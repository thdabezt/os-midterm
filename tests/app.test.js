import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createContext, runInContext } from 'node:vm';
import { THEORY_QUESTIONS } from '../data/theory.js';
import { SCHEDULING_QUESTIONS, CALCULATION_PRESETS } from '../data/scheduling.js';
import { schedule, generateExercise } from '../scheduler.js';
import { TOPICS, ALGORITHMS, NUMERIC_EXERCISES, numericCorrect, formatNumber, shuffle } from '../practice.js';
import { LESSONS } from '../data/lessons.js';
import { registerTranslation, translateText } from '../i18n.js';

const STORAGE_KEY = 'os-studyroom-v1';
const INITIAL_NOW = Date.UTC(2026, 9, 19, 12);
// Execute the application itself. Only its ESM imports are replaced with the real
// imported values above; the appended hooks expose existing lifecycle functions.
const application = readFileSync(new URL('../app.js', import.meta.url), 'utf8')
  .replace(/^import\s+[^\r\n]+;\r?\n/gm, '') + `
globalThis.app = {
  get session() { return session; },
  get state() { return state; },
  begin, theoryItem, numericItem, createScheduleItem, checkCurrent,
  finishExam, tick, render, itemScore
};`;

function element(tag = 'div') {
  const listeners = new Map();
  const classes = new Set();
  return {
    tagName: tag.toUpperCase(), innerHTML: '', textContent: '', hidden: true,
    dataset: {}, open: false, removed: false, listeners,
    classList: { toggle(name, enabled) { if (enabled) classes.add(name); else classes.delete(name); } },
    addEventListener(type, listener) {
      if (!listeners.has(type)) listeners.set(type, []);
      listeners.get(type).push(listener);
    },
    showModal() { this.open = true; },
    close() { this.open = false; },
    remove() { this.removed = true; },
    scrollIntoView() {},
  };
}

function boot({ storage = new Map(), now = INITIAL_NOW, hash = '#home' } = {}) {
  let currentTime = now;
  let currentHash = hash;
  let timeoutId = 0;
  const main = element('main');
  const reviewCount = element();
  const toast = element();
  const examTimer = element();
  const dialogs = [];
  const intervals = [];
  const document = {
    body: { append(node) { dialogs.push(node); } },
    querySelector(selector) {
      if (selector === '#main') return main;
      if (selector === '#review-count') return reviewCount;
      if (selector === '#toast') return toast;
      if (selector === '#exam-timer') return main.innerHTML.includes('id="exam-timer"') ? examTimer : null;
      throw new Error(`Unexpected DOM query in lifecycle test: ${selector}`);
    },
    querySelectorAll() { return []; },
    createElement: element,
    addEventListener() {},
  };
  const location = {
    get hash() { return currentHash; },
    set hash(value) { currentHash = value && !value.startsWith('#') ? `#${value}` : value; },
  };
  class ClockDate extends Date { static now() { return currentTime; } }
  const context = createContext({
    THEORY_QUESTIONS, SCHEDULING_QUESTIONS, CALCULATION_PRESETS,
    schedule, generateExercise, TOPICS, ALGORITHMS, NUMERIC_EXERCISES,
    numericCorrect, fmt: formatNumber, shuffle, LESSONS, registerTranslation, translateText, initLanguage() {},
    document, location, Date: ClockDate,
    localStorage: { getItem: key => storage.get(key) ?? null, setItem: (key, value) => storage.set(key, value) },
    window: { addEventListener() {}, scrollTo() {} },
    setInterval(callback) { intervals.push(callback); return intervals.length; },
    setTimeout() { return ++timeoutId; },
    clearTimeout() {},
  });
  runInContext(application, context, { filename: 'app.js' });

  const emit = async (target, type, event) => {
    for (const listener of target.listeners.get(type) ?? []) await listener(event);
  };
  return {
    app: context.app, storage, location, main, reviewCount, toast, examTimer,
    advance(milliseconds) { currentTime += milliseconds; },
    runTimer() { for (const callback of intervals) callback(); },
    activeDialog() { return dialogs.findLast(dialog => dialog.open && !dialog.removed); },
    async answerDialog(yes) {
      const dialog = this.activeDialog();
      assert.ok(dialog, 'application should have opened its confirmation dialog');
      await emit(dialog, 'click', {
        target: { closest: selector => selector === '[data-confirm]' ? { dataset: { confirm: yes ? 'yes' : 'no' } } : null },
      });
      assert.equal(dialog.open, false);
      assert.equal(dialog.removed, true);
    },
    async cancelDialog() {
      const dialog = this.activeDialog();
      assert.ok(dialog);
      let prevented = false;
      await emit(dialog, 'cancel', { preventDefault() { prevented = true; } });
      assert.equal(prevented, true);
      assert.equal(dialog.removed, true);
    },
    click(action, data = {}) {
      const button = { dataset: { action, ...data } };
      return emit(main, 'click', { target: { closest: selector => selector === '[data-action]' ? button : null } });
    },
    input(field, value) { return emit(main, 'input', { target: { dataset: { field }, value } }); },
    saved() { return JSON.parse(storage.get(STORAGE_KEY)); },
  };
}

test('answer-key update removes only the obsolete result when its selected answer is unavailable', async () => {
  const unaffected={correct:true,attempts:3,date:INITIAL_NOW-2000};
  const legacy={
    answers:{'intro-005':{correct:false,attempts:2,date:INITIAL_NOW-1000},'intro-001':unaffected},
    bookmarks:['intro-005','intro-001'],calc:{attempts:4,correct:3},
    exams:[{date:INITIAL_NOW-3000,score:7,total:10}],session:null,
  };
  const storage=new Map([[STORAGE_KEY,JSON.stringify(legacy)]]);
  const view=boot({storage});
  assert.equal(view.app.state.answers['intro-005'],undefined);
  assert.deepEqual(view.saved().answers,{'intro-001':unaffected});
  assert.deepEqual(view.saved().bookmarks,legacy.bookmarks);
  assert.deepEqual(view.saved().calc,legacy.calc);
  assert.deepEqual(view.saved().exams,legacy.exams);
  assert.equal(view.saved().answerKeyRevision,1);

  await view.app.begin([view.app.theoryItem(THEORY_QUESTIONS.find(q=>q.id==='intro-005'))]);
  await view.click('select-option',{index:'1'});
  await view.click('check');
  const reloaded=boot({storage});
  assert.equal(reloaded.app.state.answers['intro-005'].correct,true);
  assert.equal(reloaded.app.state.answers['intro-005'].attempts,1,'migration must run only once');
});

for(const selection of [1,3])test(`answer-key update regrades retained choice ${selection} without adding an attempt`,()=>{
  const legacy={
    answers:{'intro-005':{correct:selection===3,attempts:2,date:INITIAL_NOW-1000}},
    session:{mode:'practice',items:[{id:'intro-005',kind:'theory',selection,checked:true,recorded:true}],index:0,finished:false,startedAt:INITIAL_NOW-2000},
  };
  const view=boot({storage:new Map([[STORAGE_KEY,JSON.stringify(legacy)]]),hash:'#session'});
  assert.equal(view.app.state.answers['intro-005'].correct,selection===1);
  assert.equal(view.app.state.answers['intro-005'].attempts,2);
  assert.equal(view.app.state.answers['intro-005'].date,INITIAL_NOW-1000);
  assert.equal(view.app.session.items[0].selection,selection);
  assert.equal(view.app.session.items[0].checked,true);
  assert.equal(view.reviewCount.textContent,selection===1?0:1);
});

for(const selection of [1,3])test(`answer-key update adjusts a retained finished exam for choice ${selection}`,()=>{
  const oldScore=selection===3?1:0;
  const legacy={
    answers:{'intro-005':{correct:selection===3,attempts:1,date:INITIAL_NOW-1000}},
    session:{mode:'exam',items:[{id:'intro-005',kind:'theory',selection,checked:true,recorded:true}],index:0,finished:true,score:oldScore,startedAt:INITIAL_NOW-2000},
    exams:[{date:INITIAL_NOW-5000,score:oldScore,total:1},{date:INITIAL_NOW-1000,score:oldScore,total:1}],
  };
  const view=boot({storage:new Map([[STORAGE_KEY,JSON.stringify(legacy)]]),hash:'#session'});
  assert.equal(view.app.session.score,selection===1?1:0);
  assert.equal(view.app.state.exams[1].score,view.app.session.score);
  assert.deepEqual(view.saved().exams[0],legacy.exams[0],'unrecoverable earlier history stays intact');
  assert.equal(view.app.state.answers['intro-005'].attempts,1);
  assert.equal(boot({storage:view.storage}).app.session.score,view.app.session.score);
});

test('real app records correct and wrong theory answers once and allows a later successful retry', async () => {
  const view = boot();
  const [first, second] = THEORY_QUESTIONS;
  await view.app.begin([view.app.theoryItem(first), view.app.theoryItem(second)]);
  await view.click('select-option', { index: String(first.answer) });
  await view.click('check');
  view.app.checkCurrent();
  assert.equal(view.app.state.answers[first.id].correct, true);
  assert.equal(view.app.state.answers[first.id].attempts, 1);

  await view.click('next');
  await view.click('select-option', { index: String((second.answer + 1) % second.options.length) });
  await view.click('check');
  assert.equal(view.app.state.answers[second.id].correct, false);
  assert.equal(view.app.state.answers[second.id].attempts, 1);
  assert.equal(view.reviewCount.textContent, 1);
  assert.equal(view.saved().answers[second.id].correct, false);

  await view.click('complete-practice');
  await view.app.begin([view.app.theoryItem(second)]);
  await view.click('select-option', { index: String(second.answer) });
  await view.click('check');
  assert.equal(view.app.state.answers[second.id].correct, true);
  assert.equal(view.app.state.answers[second.id].attempts, 2);
  assert.equal(view.reviewCount.textContent, 0);
});

test('real calculation lifecycle rejects blanks then grades decimal commas with the actual RR convention', async () => {
  const view = boot();
  const preset = CALCULATION_PRESETS.find(exercise => exercise.id === 'actual8-rr');
  const item = view.app.createScheduleItem(preset);
  assert.equal(item.exercise.options.rrBoundary, 'requeue-first');
  assert.deepEqual(Array.from(item.fields, field => field.answer), [16.25, 21.125, 10.25]);
  await view.app.begin([item]);
  view.app.checkCurrent();
  assert.equal(item.checked, false);
  assert.equal(view.app.state.calc.attempts, 0);

  await view.input('avg-waiting', '16,25');
  view.app.checkCurrent();
  assert.equal(item.checked, false, 'a partially filled calculation must remain ungraded');
  await view.input('avg-turnaround', '21,125');
  await view.input('avg-response', '10,25');
  await view.click('check');
  assert.equal(item.checked, true);
  assert.equal(view.app.itemScore(item), 1);
  assert.equal(view.app.state.calc.attempts, 1);
  assert.equal(view.app.state.calc.correct, 1);
  assert.equal(view.saved().session.items[0].values['avg-response'], '10,25');
});

test('exam submit waits for custom confirmation and awards partial calculation credit', async () => {
  const view = boot();
  const [first, second] = THEORY_QUESTIONS;
  const correct = view.app.theoryItem(first);
  const wrong = view.app.theoryItem(second);
  const numeric = view.app.numericItem(NUMERIC_EXERCISES.find(exercise => exercise.id === 'num-fork'));
  correct.selection = first.answer;
  wrong.selection = (second.answer + 1) % second.options.length;
  numeric.values = { processes: '2', lines: '19' };
  await view.app.begin([correct, wrong, numeric], 'exam', 30);
  assert.equal(view.main.innerHTML.includes('class="feedback '), false, 'exam answers stay hidden before submission');

  const canceledSubmit = view.app.finishExam();
  assert.equal(view.app.session.finished, false);
  assert.equal(view.app.state.exams.length, 0);
  await view.answerDialog(false);
  await canceledSubmit;
  assert.equal(correct.checked, false);
  assert.equal(view.app.session.finished, false);

  const confirmedSubmit = view.app.finishExam();
  await view.answerDialog(true);
  await confirmedSubmit;
  assert.equal(view.app.session.finished, true);
  assert.equal(view.app.session.score, 1.5);
  assert.ok(view.app.session.items.every(item => item.checked));
  assert.equal(view.app.state.exams.length, 1);
  assert.equal(view.app.state.exams[0].score, 1.5);
  assert.equal(view.app.state.exams[0].total, 3);
  assert.equal(view.app.state.answers[first.id].correct, true);
  assert.equal(view.app.state.answers[second.id].correct, false);
  assert.equal(view.app.state.calc.correct, 0);
  assert.equal(view.main.innerHTML.includes('class="feedback '), true);
  await view.app.finishExam();
  assert.equal(view.app.state.exams.length, 1, 'repeated submission must not duplicate history');
});

test('deadline submits unanswered work once while preserving an open resources page', async () => {
  const view = boot();
  const question = THEORY_QUESTIONS[0];
  const numeric = view.app.numericItem(NUMERIC_EXERCISES[0]);
  numeric.values.speedup = '1,6';
  await view.app.begin([view.app.theoryItem(question), numeric], 'exam', 1);
  view.location.hash = '#resources';
  view.app.render();
  const resourcesPage = view.main.innerHTML;
  view.advance(60_000);
  view.runTimer();
  assert.equal(view.app.session.finished, true);
  assert.equal(view.app.session.score, 1);
  assert.equal(view.location.hash, '#resources');
  assert.equal(view.main.innerHTML, resourcesPage);
  assert.equal(view.app.state.answers[question.id].correct, false);
  assert.equal(view.app.state.exams.length, 1);
  assert.equal(view.saved().session.finished, true);
  assert.equal(view.toast.hidden, false);
  view.runTimer();
  assert.equal(view.app.state.exams.length, 1);
  assert.equal(view.app.state.calc.attempts, 1);
});

test('saved exam resumes answers, current question, computed solution and original deadline after reload', async () => {
  const initial = boot();
  const question = THEORY_QUESTIONS[0];
  const preset = CALCULATION_PRESETS.find(exercise => exercise.id === 'actual8-rr');
  await initial.app.begin([initial.app.theoryItem(question), initial.app.createScheduleItem(preset)], 'exam', 1);
  await initial.click('select-option', { index: String(question.answer) });
  await initial.click('jump', { index: '1' });
  await initial.input('avg-waiting', '16,25');

  const resumed = boot({ storage: initial.storage, now: INITIAL_NOW + 30_000, hash: '#session' });
  assert.equal(resumed.app.session.mode, 'exam');
  assert.equal(resumed.app.session.finished, false);
  assert.equal(resumed.app.session.index, 1);
  assert.equal(resumed.app.session.items[0].selection, question.answer);
  assert.equal(resumed.app.session.items[1].values['avg-waiting'], '16,25');
  assert.equal(resumed.app.session.items[1].result.averages.response, 10.25);
  assert.equal(resumed.app.session.expiresAt, INITIAL_NOW + 60_000);
  assert.equal(resumed.examTimer.textContent, '00:30');
  assert.equal(resumed.activeDialog(), undefined);
});

test('canceling replacement with Escape preserves the current session and stored answers', async () => {
  const view = boot();
  const question = THEORY_QUESTIONS[0];
  await view.app.begin([view.app.theoryItem(question)]);
  await view.click('select-option', { index: String(question.answer) });
  const originalSession = view.app.session;
  const originalSave = view.storage.get(STORAGE_KEY);
  const replacement = view.app.begin([view.app.numericItem(NUMERIC_EXERCISES[0])]);
  assert.equal(view.app.session, originalSession);
  await view.cancelDialog();
  await replacement;
  assert.equal(view.app.session, originalSession);
  assert.equal(view.storage.get(STORAGE_KEY), originalSave);
  assert.equal(view.app.session.items[0].selection, question.answer);
});

test('deadline closes a pending submit dialog without recording the exam twice', async () => {
  const view = boot();
  const question = THEORY_QUESTIONS[0];
  const item = view.app.theoryItem(question);
  item.selection = question.answer;
  await view.app.begin([item], 'exam', 1);
  const pendingSubmit = view.app.finishExam();
  assert.ok(view.activeDialog());
  view.advance(61_000);
  view.runTimer();
  await pendingSubmit;
  assert.equal(view.activeDialog(), undefined);
  assert.equal(view.app.session.finished, true);
  assert.equal(view.app.session.score, 1);
  assert.equal(view.app.state.exams.length, 1);
  assert.equal(view.app.state.answers[question.id].attempts, 1);
});
