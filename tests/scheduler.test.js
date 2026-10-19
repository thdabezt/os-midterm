import test from 'node:test';
import assert from 'node:assert/strict';
import { schedule, generateExercise } from '../scheduler.js';

const process = (id, arrival, burst, priority = 0) => ({ id, arrival, burst, priority });
const segment = (id, start, end) => ({ id, start, end });
const metricValues = result => result.metrics.map(({ start, completion, turnaround, waiting, response }) =>
  [start, completion, turnaround, waiting, response]);

test('FCFS uses arrival then input order, records idle CPU and does not mutate input', () => {
  const input = [process('P2', 2, 3), process('P1', 2, 2), process('P3', 10, 1)];
  const copy = structuredClone(input);
  const result = schedule(input, { algorithm: 'fcfs' });
  assert.deepEqual(result.segments, [segment('idle', 0, 2), segment('P2', 2, 5), segment('P1', 5, 7), segment('idle', 7, 10), segment('P3', 10, 11)]);
  assert.deepEqual(metricValues(result), [[2, 5, 3, 0, 0], [5, 7, 5, 3, 3], [10, 11, 1, 0, 0]]);
  assert.deepEqual(result.averages, { waiting: 1, turnaround: 3, response: 1 });
  assert.equal(result.makespan, 11);
  assert.deepEqual(input, copy);
});

test('SJF is nonpreemptive and chooses shortest ready burst with deterministic ties', () => {
  const result = schedule([process('P1', 0, 7), process('P2', 1, 2), process('P3', 2, 2), process('P4', 0, 3)], { algorithm: 'sjf' });
  assert.deepEqual(result.segments, [segment('P4', 0, 3), segment('P2', 3, 5), segment('P3', 5, 7), segment('P1', 7, 14)]);
  assert.deepEqual(metricValues(result), [[7, 14, 14, 7, 7], [3, 5, 4, 2, 2], [5, 7, 5, 3, 3], [0, 3, 3, 0, 0]]);
});

test('SRTF preempts for strictly shorter remaining time; an equal arrival does not preempt', () => {
  const result = schedule([process('P1', 0, 8), process('P2', 1, 4), process('P3', 2, 3), process('P4', 3, 1)], { algorithm: 'srtf' });
  assert.deepEqual(result.segments, [segment('P1', 0, 1), segment('P2', 1, 3), segment('P4', 3, 4), segment('P2', 4, 6), segment('P3', 6, 9), segment('P1', 9, 16)]);
  assert.deepEqual(metricValues(result), [[0, 16, 16, 8, 0], [1, 6, 5, 1, 0], [6, 9, 7, 4, 4], [3, 4, 1, 0, 0]]);
  assert.deepEqual(result.averages, { waiting: 3.25, turnaround: 7.25, response: 1 });
});

test('priority is nonpreemptive and supports both priority number conventions', () => {
  const input = [process('P1', 0, 3, 2), process('P2', 0, 2, 1), process('P3', 1, 1, 3)];
  const lower = schedule(input, { algorithm: 'priority', priorityOrder: 'lower' });
  assert.deepEqual(lower.segments, [segment('P2', 0, 2), segment('P1', 2, 5), segment('P3', 5, 6)]);
  assert.deepEqual(metricValues(lower), [[2, 5, 5, 2, 2], [0, 2, 2, 0, 0], [5, 6, 5, 4, 4]]);
  const higher = schedule(input, { algorithm: 'priority', priorityOrder: 'higher' });
  assert.deepEqual(higher.segments, [segment('P1', 0, 3), segment('P3', 3, 4), segment('P2', 4, 6)]);
});

test('preemptive priority retains running process on equal priority', () => {
  const input = [process('P1', 0, 5, 3), process('P2', 1, 2, 2), process('P3', 2, 1, 2), process('P4', 3, 1, 1)];
  const result = schedule(input, { algorithm: 'priority-preemptive' });
  assert.deepEqual(result.segments, [segment('P1', 0, 1), segment('P2', 1, 3), segment('P4', 3, 4), segment('P3', 4, 5), segment('P1', 5, 9)]);
  assert.deepEqual(metricValues(result), [[0, 9, 9, 4, 0], [1, 3, 2, 0, 0], [4, 5, 3, 2, 2], [3, 4, 1, 0, 0]]);
  const reversed = schedule(input.map(job => ({ ...job, priority: -job.priority })), { algorithm: 'priority-preemptive', priorityOrder: 'higher' });
  assert.deepEqual(reversed.segments, result.segments);
});

test('Round Robin puts arrivals at quantum boundary before requeued process', () => {
  const result = schedule([process('P1', 0, 5), process('P2', 2, 3), process('P3', 3, 1)], { algorithm: 'rr', quantum: 2 });
  assert.deepEqual(result.segments, [segment('P1', 0, 2), segment('P2', 2, 4), segment('P1', 4, 6), segment('P3', 6, 7), segment('P2', 7, 8), segment('P1', 8, 9)]);
  assert.deepEqual(metricValues(result), [[0, 9, 9, 4, 0], [2, 8, 6, 3, 0], [6, 7, 4, 3, 3]]);
  assert.deepEqual(result.averages, { waiting: 10 / 3, turnaround: 19 / 3, response: 1 });
});

test('Round Robin requeue-first reverses only exact boundary arrivals', () => {
  const result = schedule([process('P1', 0, 5), process('P2', 2, 3), process('P3', 3, 1)], {
    algorithm: 'rr', quantum: 2, rrBoundary: 'requeue-first',
  });
  assert.deepEqual(result.segments, [segment('P1', 0, 4), segment('P2', 4, 6), segment('P3', 6, 7), segment('P1', 7, 8), segment('P2', 8, 9)]);
  assert.deepEqual(metricValues(result), [[0, 8, 8, 3, 0], [4, 9, 7, 4, 2], [6, 7, 4, 3, 3]]);
  assert.deepEqual(result.averages, { waiting: 10 / 3, turnaround: 19 / 3, response: 5 / 3 });
});

test('Round Robin handles initial idle, future idle, completion boundary, and large quantum', () => {
  const input = [process('P1', 3, 2), process('P2', 5, 1), process('P3', 10, 2)];
  const expected = [segment('idle', 0, 3), segment('P1', 3, 5), segment('P2', 5, 6), segment('idle', 6, 10), segment('P3', 10, 12)];
  assert.deepEqual(schedule(input, { algorithm: 'rr', quantum: 2 }).segments, expected);
  assert.deepEqual(schedule(input, { algorithm: 'rr', quantum: 100 }).segments, expected);
});

test('all algorithms handle a single process and omit zero-length idle', () => {
  for (const algorithm of ['fcfs', 'sjf', 'srtf', 'priority', 'priority-preemptive', 'rr']) {
    const result = schedule([process('P1', 0, 7)], { algorithm, quantum: 2 });
    assert.deepEqual(result.segments, [segment('P1', 0, 7)]);
    assert.deepEqual(metricValues(result), [[0, 7, 7, 0, 0]]);
  }
});

test('current semester review quiz agrees with all six algorithms using requeue-first RR', () => {
  // Quiz 8: CPU Scheduling (review), visible answer feedback from this semester.
  const input = [
    process('P1', 0, 7, 3), process('P2', 1, 4, 2), process('P3', 2, 8, 4), process('P4', 4, 3, 1),
    process('P5', 5, 6, 3), process('P6', 8, 2, 2), process('P7', 9, 5, 1), process('P8', 12, 4, 4),
  ];
  const expected = {
    fcfs: [13.875, 13.875, 18.75],
    sjf: [10, 10, 14.875],
    srtf: [9, 6.75, 13.875],
    'priority-preemptive': [10.75, 8, 15.625],
    priority: [11.625, 11.625, 16.5],
    rr: [16.25, 10.25, 21.125],
  };
  for (const [algorithm, [waiting, response, turnaround]] of Object.entries(expected)) {
    const result = schedule(input, { algorithm, quantum: 4, priorityOrder: 'lower', rrBoundary: 'requeue-first' });
    assert.deepEqual(result.averages, { waiting, turnaround, response }, algorithm);
  }
  const roundRobin = schedule(input, { algorithm: 'rr', quantum: 4 });
  assert.equal(roundRobin.averages.waiting, 16.25);
  assert.equal(roundRobin.averages.turnaround, 21.125);
  // The same table with arrival-first boundary handling has a different response
  // average. The actual quiz uses requeue-first to obtain the 10.25 above.
  assert.deepEqual(roundRobin.metrics.map(job => job.start), [0, 4, 8, 12, 18, 22, 24, 28]);
  assert.deepEqual(roundRobin.metrics.map(job => job.response), [0, 3, 6, 8, 13, 14, 15, 16]);
  assert.equal(roundRobin.averages.response, 75 / 8);
});

test('invalid and excessive inputs reject instead of creating impossible schedules', () => {
  const valid = [process('P1', 0, 4)];
  for (const invalid of [[], null, {}, [null], [process('idle', 0, 1)], [process('', 0, 1)], [process('P1', 0, 1), process('P1', 1, 1)]]) {
    assert.throws(() => schedule(invalid));
  }
  for (const arrival of [-1, 0.5, Infinity, NaN, '0', 1_000_001]) assert.throws(() => schedule([process('P1', arrival, 1)]));
  for (const burst of [0, -1, 0.5, Infinity, NaN, '1', 1_001]) assert.throws(() => schedule([process('P1', 0, burst)]));
  for (const priority of [Infinity, NaN, '1', null]) assert.throws(() => schedule([process('P1', 0, 1, priority)]));
  for (const quantum of [0, -1, 1.5, Infinity, NaN, '2', null, 10_001]) assert.throws(() => schedule(valid, { algorithm: 'rr', quantum }));
  assert.throws(() => schedule(valid, { algorithm: 'unknown' }));
  assert.throws(() => schedule(valid, { priorityOrder: 'unknown' }));
  for (const rrBoundary of ['unknown', null, 0]) assert.throws(() => schedule(valid, { rrBoundary }));
  assert.throws(() => schedule(valid, null));
  assert.throws(() => schedule(Array.from({ length: 51 }, (_, index) => process(`P${index}`, 0, 1))));
  assert.throws(() => schedule(Array.from({ length: 21 }, (_, index) => process(`P${index}`, 0, 1_000))));
});

test('exercise seeds reproduce complete valid schedules across all algorithms', () => {
  const arrivalPatterns = new Set();
  for (const algorithm of ['fcfs', 'sjf', 'srtf', 'priority', 'priority-preemptive', 'rr']) {
    for (let seed = 0; seed < 25; seed += 1) {
      const exercise = generateExercise(seed, algorithm);
      assert.deepEqual(exercise, generateExercise(seed, algorithm));
      assert.ok(exercise.processes.length >= 3 && exercise.processes.length <= 5);
      assert.equal(exercise.options.algorithm, algorithm);
      arrivalPatterns.add(exercise.processes.every(job => job.arrival === 0) ? 'simultaneous' : 'varied');
      const { segments, metrics, makespan } = exercise.result;
      assert.equal(segments[0].start, 0);
      assert.equal(segments.at(-1).end, makespan);
      for (let index = 0; index < segments.length; index += 1) {
        const current = segments[index];
        assert.ok(current.end > current.start);
        if (index > 0) assert.equal(segments[index - 1].end, current.start);
      }
      for (const job of metrics) {
        const ownSegments = segments.filter(current => current.id === job.id);
        assert.equal(ownSegments.reduce((sum, current) => sum + current.end - current.start, 0), job.burst);
        assert.ok(ownSegments.every(current => current.start >= job.arrival));
        assert.equal(job.start, ownSegments[0].start);
        assert.equal(job.completion, ownSegments.at(-1).end);
        assert.equal(job.turnaround, job.completion - job.arrival);
        assert.equal(job.waiting, job.turnaround - job.burst);
        assert.equal(job.response, job.start - job.arrival);
        assert.ok(job.waiting >= 0 && job.response >= 0);
      }
    }
  }
  assert.deepEqual(arrivalPatterns, new Set(['simultaneous', 'varied']));
  assert.throws(() => generateExercise(Infinity));
  assert.throws(() => generateExercise({}, 'fcfs'));
  assert.throws(() => generateExercise(1, 'unknown'));
  assert.deepEqual(generateExercise('review-session', 'rr'), generateExercise('review-session', 'rr'));
});
