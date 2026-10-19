/** CPU scheduling for one CPU, one CPU burst per process, and no I/O. */
export const RULES = 'Một CPU, mỗi tiến trình có một CPU burst; bỏ qua thời gian chuyển ngữ cảnh và I/O. Khi bằng nhau, xét thời điểm đến rồi thứ tự trong bảng. SRTF và ưu tiên có ngắt chỉ ngắt khi tiến trình mới tốt hơn hẳn; bằng nhau thì tiếp tục tiến trình đang chạy. Round Robin: rrBoundary="arrival-first" đưa tiến trình đến đúng cuối quantum vào hàng đợi trước khi đưa tiến trình đang chạy trở lại; rrBoundary="requeue-first" đưa tiến trình đang chạy trở lại trước tiến trình đến đúng cuối quantum. Tiến trình đến giữa quantum luôn được xếp hàng trước tiến trình đang chạy trở lại. Số ưu tiên nhỏ hơn là ưu tiên cao hơn khi priorityOrder="lower"; priorityOrder="higher" đảo quy ước. Thời gian bắt đầu từ 0; khoảng CPU rỗi được ghi là idle. Các đoạn liên tiếp của cùng một tiến trình được gộp.';

const ALGORITHMS = new Set(['fcfs', 'sjf', 'srtf', 'priority', 'priority-preemptive', 'rr']);
const LIMITS = { processes: 50, arrival: 1_000_000, burst: 1_000, totalBurst: 20_000, quantum: 10_000 };

function integer(value, minimum, maximum, name) {
  if (!Number.isSafeInteger(value) || value < minimum || value > maximum) {
    throw new RangeError(`${name} must be an integer from ${minimum} to ${maximum}.`);
  }
  return value;
}

function normalize(processes, options) {
  if (!Array.isArray(processes) || processes.length === 0 || processes.length > LIMITS.processes) {
    throw new RangeError(`Supply between 1 and ${LIMITS.processes} processes.`);
  }
  if (options === null || typeof options !== 'object' || Array.isArray(options)) {
    throw new TypeError('Options must be an object.');
  }
  const algorithm = options.algorithm ?? 'fcfs';
  if (!ALGORITHMS.has(algorithm)) throw new RangeError(`Unknown scheduling algorithm: ${algorithm}.`);
  const priorityOrder = options.priorityOrder ?? 'lower';
  if (!['lower', 'higher'].includes(priorityOrder)) throw new RangeError('priorityOrder must be lower or higher.');
  const rrBoundary = options.rrBoundary === undefined ? 'arrival-first' : options.rrBoundary;
  if (!['arrival-first', 'requeue-first'].includes(rrBoundary)) throw new RangeError('rrBoundary must be arrival-first or requeue-first.');
  const quantum = integer(options.quantum === undefined ? 2 : options.quantum, 1, LIMITS.quantum, 'Quantum');
  const ids = new Set();
  let totalBurst = 0;
  const jobs = processes.map((process, index) => {
    if (process === null || typeof process !== 'object' || Array.isArray(process)) {
      throw new TypeError(`Process ${index + 1} must be an object.`);
    }
    const { id } = process;
    if (typeof id !== 'string' || id.trim() === '' || id === 'idle' || ids.has(id)) {
      throw new TypeError('Process IDs must be unique nonempty strings and cannot be idle.');
    }
    ids.add(id);
    const arrival = integer(process.arrival, 0, LIMITS.arrival, `${id} arrival`);
    const burst = integer(process.burst, 1, LIMITS.burst, `${id} burst`);
    const priority = process.priority === undefined ? 0 : process.priority;
    if (typeof priority !== 'number' || !Number.isFinite(priority)) {
      throw new TypeError(`${id} priority must be a finite number.`);
    }
    totalBurst += burst;
    return { id, arrival, burst, priority, index, remaining: burst, start: null, completion: null };
  });
  if (totalBurst > LIMITS.totalBurst) throw new RangeError(`Total CPU burst must not exceed ${LIMITS.totalBurst}.`);
  return { jobs, algorithm, priorityOrder, quantum, rrBoundary };
}

/**
 * Returns {segments, metrics, averages, makespan}. Metrics preserve input order.
 * Supported algorithms: fcfs, sjf, srtf, priority, priority-preemptive, rr.
 * Defaults: priority 0, lower number first, RR arrivals before requeue at boundaries.
 * rrBoundary='requeue-first' reverses only arrivals exactly at a quantum boundary.
 * All times are integer units; bounds keep RR output small.
 * Input process objects are never changed.
 */
export function schedule(processes, options = {}) {
  const { jobs, algorithm, priorityOrder, quantum, rrBoundary } = normalize(processes, options);
  const arrivals = [...jobs].sort((a, b) => a.arrival - b.arrival || a.index - b.index);
  const segments = [];
  let time = 0;

  function append(id, start, end) {
    if (start === end) return;
    const previous = segments.at(-1);
    if (previous?.id === id && previous.end === start) previous.end = end;
    else segments.push({ id, start, end });
  }

  function run(job, duration) {
    if (job.start === null) job.start = time;
    append(job.id, time, time + duration);
    time += duration;
    job.remaining -= duration;
    if (job.remaining === 0) job.completion = time;
  }

  if (algorithm === 'rr') {
    const queue = [];
    let next = 0;
    const enqueueArrivals = (includeBoundary = true) => {
      while (next < arrivals.length && (includeBoundary ? arrivals[next].arrival <= time : arrivals[next].arrival < time)) {
        queue.push(arrivals[next++]);
      }
    };
    enqueueArrivals();
    while (next < arrivals.length || queue.length > 0) {
      if (queue.length === 0) {
        append('idle', time, arrivals[next].arrival);
        time = arrivals[next].arrival;
        enqueueArrivals();
      }
      const job = queue.shift();
      run(job, Math.min(quantum, job.remaining));
      // Only exact boundary arrivals can switch places with the requeued process.
      enqueueArrivals(rrBoundary === 'arrival-first');
      if (job.remaining > 0) queue.push(job);
      if (rrBoundary === 'requeue-first') enqueueArrivals();
    }
  } else {
    const preemptive = algorithm === 'srtf' || algorithm === 'priority-preemptive';
    const priorityAlgorithm = algorithm === 'priority' || algorithm === 'priority-preemptive';
    const primary = job => {
      if (priorityAlgorithm) return priorityOrder === 'lower' ? job.priority : -job.priority;
      if (algorithm === 'sjf') return job.burst;
      if (algorithm === 'srtf') return job.remaining;
      return job.arrival;
    };
    const compare = (a, b) => primary(a) - primary(b) || a.arrival - b.arrival || a.index - b.index;
    let completed = 0;
    let current = null;
    while (completed < jobs.length) {
      const ready = jobs.filter(job => job.remaining > 0 && job.arrival <= time).sort(compare);
      if (ready.length === 0) {
        const nextArrival = Math.min(...jobs.filter(job => job.remaining > 0).map(job => job.arrival));
        append('idle', time, nextArrival);
        time = nextArrival;
        current = null;
        continue;
      }
      const best = ready[0];
      // A tie never interrupts a running job, including an older equal-priority job.
      if (!current || current.remaining === 0 || !preemptive || primary(best) < primary(current)) current = best;
      let duration = current.remaining;
      if (preemptive) {
        const nextArrival = arrivals.find(job => job.arrival > time)?.arrival;
        if (nextArrival !== undefined) duration = Math.min(duration, nextArrival - time);
      }
      run(current, duration);
      if (current.remaining === 0) {
        completed += 1;
        current = null;
      }
    }
  }

  const metrics = jobs.map(({ id, arrival, burst, priority, start, completion }) => ({
    id, arrival, burst, priority, start, completion,
    turnaround: completion - arrival,
    waiting: completion - arrival - burst,
    response: start - arrival,
  }));
  const average = key => metrics.reduce((sum, process) => sum + process[key], 0) / metrics.length;
  return {
    segments,
    metrics,
    averages: { waiting: average('waiting'), turnaround: average('turnaround'), response: average('response') },
    makespan: time,
  };
}

/** Stable exercise for a finite number or string seed, independent of current time. */
export function generateExercise(seed = 1, algorithm = 'fcfs') {
  if ((typeof seed !== 'number' && typeof seed !== 'string') || (typeof seed === 'number' && !Number.isFinite(seed))) {
    throw new TypeError('Seed must be a finite number or a string.');
  }
  if (!ALGORITHMS.has(algorithm)) throw new RangeError(`Unknown scheduling algorithm: ${algorithm}.`);
  let state = 2166136261;
  for (const character of String(seed)) state = Math.imul(state ^ character.codePointAt(0), 16777619) >>> 0;
  const random = maximum => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return Math.floor((state / 4294967296) * maximum);
  };
  const count = 3 + random(3);
  const simultaneous = random(3) === 0;
  const options = { algorithm, quantum: 2 + random(3), priorityOrder: 'lower', rrBoundary: 'arrival-first' };
  const processes = Array.from({ length: count }, (_, index) => ({
    id: `P${index + 1}`,
    arrival: simultaneous || index === 0 ? 0 : index === 1 ? 1 + random(4) : random(9),
    burst: 1 + random(9),
    priority: 1 + random(5),
  }));
  if (algorithm === 'rr') processes[0].burst = Math.max(processes[0].burst, options.quantum + 1);
  return { processes, options, result: schedule(processes, options) };
}
