/** Structural checks for a student's working timeline; no scheduling answers. */
export const MAX_DRAFT_SEGMENTS = 200;

function time(value) {
  if (typeof value !== 'string') return null;
  const text = value.trim();
  if (!/^(?:\d+(?:[.,]\d*)?|[.,]\d+)$/.test(text)) return null;
  const number = Number(text.replace(',', '.'));
  return Number.isFinite(number) && number <= 1_000_000_000 ? number : null;
}

function blank(row) {
  return row !== null && typeof row === 'object' && !Array.isArray(row)
    && row.id === '' && typeof row.end === 'string' && row.end.trim() === '';
}

export function analyzeDraft(draft, processIds) {
  const rows = Array.isArray(draft?.rows) ? draft.rows : [];
  const allowed = new Set(Array.isArray(processIds) || processIds instanceof Set ? processIds : []);
  allowed.add('idle');
  const errors = [];
  const segments = [];
  const initialStart = time(draft?.start);
  const ends = rows.map(row => time(row?.end));
  const starts = rows.map((_, index) => index === 0 ? initialStart : ends[index - 1]);
  if (initialStart === null) errors.push({ rowIndex: -1, code: 'start' });
  if (rows.length > MAX_DRAFT_SEGMENTS) errors.push({ rowIndex: MAX_DRAFT_SEGMENTS, code: 'limit' });

  let lastFilled = rows.length - 1;
  while (lastFilled >= 0 && blank(rows[lastFilled])) lastFilled--;
  let prefixValid = initialStart !== null;
  for (let index = 0; index < Math.min(rows.length, MAX_DRAFT_SEGMENTS); index++) {
    if (index > lastFilled) { prefixValid = false; continue; }
    const row = rows[index];
    const start = starts[index];
    const end = ends[index];
    const validProcess = typeof row?.id === 'string' && row.id !== '' && allowed.has(row.id);
    if (!validProcess) errors.push({ rowIndex: index, code: 'process' });
    if (end === null) errors.push({ rowIndex: index, code: 'end' });
    else if (start !== null && end <= start) errors.push({ rowIndex: index, code: 'order' });
    const valid = validProcess && start !== null && end !== null && end > start;
    prefixValid = prefixValid && valid;
    if (prefixValid) segments.push({ id: row.id, start, end, rowIndex: index });
  }
  return {
    segments,
    starts,
    errors,
    complete: segments.length > 0 && errors.length === 0 && segments.length === rows.length,
  };
}
