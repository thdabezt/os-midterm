import test from 'node:test';
import assert from 'node:assert/strict';
import { analyzeDraft, MAX_DRAFT_SEGMENTS } from '../gantt-draft.js';

const ids = ['P1', 'P2'];
const draft = rows => ({ start: '0', rows, open: true });

test('Drafts preserve idle intervals, decimal times and repeated quantum boundaries', () => {
  const input = { start: ' 0,5 ', rows: [
    { id: 'idle', end: ' 1,25 ' },
    { id: 'P1', end: '2.5' },
    { id: 'P1', end: '3.75' },
    { id: 'P2', end: '4' },
    { id: 'P1', end: '5.125' },
  ], open: true };
  const before = structuredClone(input);
  const result = analyzeDraft(input, ids);
  assert.deepEqual(result.starts, [0.5, 1.25, 2.5, 3.75, 4]);
  assert.deepEqual(result.segments, [
    { id: 'idle', start: 0.5, end: 1.25, rowIndex: 0 },
    { id: 'P1', start: 1.25, end: 2.5, rowIndex: 1 },
    { id: 'P1', start: 2.5, end: 3.75, rowIndex: 2 },
    { id: 'P2', start: 3.75, end: 4, rowIndex: 3 },
    { id: 'P1', start: 4, end: 5.125, rowIndex: 4 },
  ]);
  assert.deepEqual(result.errors, []);
  assert.equal(result.complete, true);
  assert.deepEqual(input, before);
});

test('Times reject blank, signed, exponent, arithmetic, nonfinite and out-of-range values', () => {
  for (const value of ['', ' ', '-1', '+1', '1e2', '2+3', 'Infinity', 'NaN', '1,2.3', '1000000001', 3, null, undefined]) {
    const result = analyzeDraft({ start: value, rows: [{ id: 'P1', end: '7' }] }, ids);
    assert.deepEqual(result.errors, [{ rowIndex: -1, code: 'start' }], String(value));
    assert.deepEqual(result.starts, [null]);
    assert.deepEqual(result.segments, []);
    assert.equal(result.complete, false);
    const badEnd = analyzeDraft(draft([{ id: 'P1', end: value }]), ids);
    assert.deepEqual(badEnd.errors, [{ rowIndex: 0, code: 'end' }], String(value));
  }
  assert.equal(analyzeDraft(draft([{ id: 'P1', end: '1000000000' }]), ids).complete, true);
  assert.equal(analyzeDraft(draft([{ id: 'P1', end: '.5' }]), ids).complete, true);
});

test('Zero-length and backward intervals are invalid; later rows cannot reconnect preview', () => {
  for (const end of ['0', '-0']) {
    const result = analyzeDraft(draft([{ id: 'P1', end }]), ids);
    assert.equal(result.complete, false);
    assert.deepEqual(result.segments, []);
    assert.equal(result.errors[0].code, end === '0' ? 'order' : 'end');
  }
  const result = analyzeDraft(draft([
    { id: 'P1', end: '3' }, { id: 'P2', end: '2' }, { id: 'P1', end: '4' },
  ]), ids);
  assert.deepEqual(result.errors, [{ rowIndex: 1, code: 'order' }]);
  assert.deepEqual(result.starts, [0, 3, 2]);
  assert.deepEqual(result.segments, [{ id: 'P1', start: 0, end: 3, rowIndex: 0 }]);
});

test('Invalid middle endpoints or unknown processes stop the contiguous preview', () => {
  const invalidEnd = analyzeDraft(draft([
    { id: 'P1', end: '3' }, { id: 'P2', end: 'oops' },
    { id: 'P1', end: '7' }, { id: 'P2', end: '9' },
  ]), ids);
  assert.deepEqual(invalidEnd.starts, [0, 3, null, 7]);
  assert.deepEqual(invalidEnd.errors, [{ rowIndex: 1, code: 'end' }]);
  assert.equal(invalidEnd.segments.length, 1);
  const unknown = analyzeDraft(draft([
    { id: 'P1', end: '3' }, { id: 'P9', end: '5' }, { id: 'P2', end: '7' },
  ]), ids);
  assert.deepEqual(unknown.errors, [{ rowIndex: 1, code: 'process' }]);
  assert.equal(unknown.segments.length, 1);
  assert.equal(unknown.complete, false);
});

test('Blank trailing placeholders are unfinished without errors, and blank middle rows are errors', () => {
  const unfinished = analyzeDraft(draft([
    { id: 'P1', end: '3' }, { id: '', end: '' }, { id: '', end: ' ' },
  ]), ids);
  assert.equal(unfinished.segments.length, 1);
  assert.deepEqual(unfinished.errors, []);
  assert.equal(unfinished.complete, false);
  const middle = analyzeDraft(draft([
    { id: 'P1', end: '3' }, { id: '', end: '' }, { id: 'P2', end: '7' },
  ]), ids);
  assert.deepEqual(middle.errors, [{ rowIndex: 1, code: 'process' }, { rowIndex: 1, code: 'end' }]);
  assert.equal(middle.segments.length, 1);
  for (const row of [{ id: '', end: '3' }, { id: 'P1', end: '' }]) {
    assert.equal(analyzeDraft(draft([row]), ids).errors.length, 1);
  }
});

test('Malformed and empty drafts stay incomplete without throwing or mutating input', () => {
  for (const input of [null, undefined, false, [], {}, { start: '0', rows: {} }, draft([])]) {
    const result = analyzeDraft(input, ids);
    assert.equal(result.complete, false);
    assert.deepEqual(result.segments, []);
  }
  const invalidRow = analyzeDraft(draft([null]), ids);
  assert.deepEqual(invalidRow.errors, [{ rowIndex: 0, code: 'process' }, { rowIndex: 0, code: 'end' }]);
  assert.equal(analyzeDraft(draft([{ id: 'P1', end: '3' }]), null).errors[0].code, 'process');
});

test('The segment limit bounds the preview and prevents oversized drafts being complete', () => {
  const rows = Array.from({ length: MAX_DRAFT_SEGMENTS }, (_, index) => ({ id: 'P1', end: String(index + 1) }));
  assert.equal(analyzeDraft(draft(rows), ids).complete, true);
  rows.push({ id: 'P1', end: String(MAX_DRAFT_SEGMENTS + 1) });
  const result = analyzeDraft(draft(rows), ids);
  assert.equal(result.starts.length, rows.length);
  assert.equal(result.segments.length, MAX_DRAFT_SEGMENTS);
  assert.deepEqual(result.errors, [{ rowIndex: MAX_DRAFT_SEGMENTS, code: 'limit' }]);
  assert.equal(result.complete, false);
});
