import test from 'node:test';
import assert from 'node:assert/strict';
import { createLanguageState, initLanguage, registerTranslation, translateText } from '../i18n.js';
import { THEORY_QUESTIONS } from '../data/theory.js';
import { THEORY_EN } from '../data/theory.en.js';
import { SCHEDULING_QUESTIONS, CALCULATION_PRESETS } from '../data/scheduling.js';
import { SCHEDULING_EN, PRESETS_EN } from '../data/scheduling.en.js';
import { NUMERIC_EXERCISES } from '../practice.js';
import { NUMERIC_EN } from '../data/numeric.en.js';
import { LESSONS } from '../data/lessons.js';

// A deterministic clock exercises the threshold and canceled callbacks without
// wall-clock waits or dependence on Node's experimental mock-timer API.
function fakeClock() {
  let now = 0, nextId = 0;
  const pending = new Map();
  return {
    setTimeout(callback, delay) {
      const id = ++nextId;
      pending.set(id, { callback, at: now + delay });
      return id;
    },
    clearTimeout(id) { pending.delete(id); },
    advance(milliseconds) {
      const target = now + milliseconds;
      while (true) {
        const next = [...pending.entries()]
          .filter(([, timer]) => timer.at <= target)
          .sort(([a, left], [b, right]) => left.at - right.at || a - b)[0];
        if (!next) break;
        const [id, timer] = next;
        pending.delete(id);
        now = timer.at;
        timer.callback();
      }
      now = target;
    },
    get pendingCount() { return pending.size; },
  };
}

function language() {
  const changes = [], clock = fakeClock();
  const state = createLanguageState(view => changes.push(view), clock);
  return { state, clock, changes };
}
const shift = (code = 'ShiftLeft', shiftKey = true) => ({ key: 'Shift', code, shiftKey });

test('Shift temporarily translates; key repeat does not toggle or duplicate updates', () => {
  const { state, changes } = language();
  assert.deepEqual(changes, [{ english: false, pinned: false }]);
  state.keyDown({ key: 'a', code: 'KeyA' });
  assert.equal(state.english, false);
  state.keyDown(shift());
  state.keyDown({ ...shift(), repeat: true });
  state.keyDown({ ...shift(), repeat: true });
  assert.equal(state.english, true);
  assert.equal(state.pinned, false);
  assert.equal(changes.length, 2);
  state.keyUp(shift('ShiftLeft', false));
  assert.deepEqual(changes.at(-1), { english: false, pinned: false });
  state.keyUp(shift('ShiftLeft', false));
  assert.equal(changes.length, 3);
});

test('holding both Shift keys preserves English until the last Shift is released', () => {
  for (const [first, second] of [['ShiftLeft', 'ShiftRight'], ['ShiftRight', 'ShiftLeft']]) {
    const { state } = language();
    state.keyDown(shift(first));
    state.keyDown(shift(second));
    state.keyUp(shift(first, true));
    assert.equal(state.english, true, `${second} is still held`);
    assert.equal(state.pinned, false);
    state.keyUp(shift(second, false));
    assert.equal(state.english, false);
  }
});

test('a mobile tap toggles English without leaving a delayed preview', () => {
  const { state, clock } = language();
  state.beginHold();
  clock.advance(299);
  assert.equal(state.english, false);
  state.endHold();
  assert.equal(state.english, true);
  assert.equal(state.pinned, true);
  assert.equal(clock.pendingCount, 0);
  clock.advance(1000);
  assert.equal(state.pinned, true);
  state.beginHold();
  state.endHold();
  assert.equal(state.english, false);
  assert.equal(state.pinned, false);
});

test('a mobile long press previews English then restores the previous pinned state', () => {
  for (const pinned of [false, true]) {
    const { state, clock } = language();
    if (pinned) state.toggle();
    state.beginHold();
    clock.advance(300);
    assert.equal(state.english, true);
    assert.equal(state.pinned, pinned, 'holding must not change the toggle preference');
    state.endHold();
    assert.equal(state.english, pinned);
    assert.equal(state.pinned, pinned);
  }
});

test('pointer cancellation neither toggles a tap nor leaves a preview running', () => {
  for (const elapsed of [0, 299, 300, 1000]) {
    const { state, clock } = language();
    state.beginHold();
    clock.advance(elapsed);
    state.cancelHold();
    state.endHold();
    assert.equal(state.english, false, `canceled after ${elapsed} ms`);
    assert.equal(state.pinned, false);
    assert.equal(clock.pendingCount, 0);
    clock.advance(1000);
    assert.equal(state.english, false, 'a canceled timer must not enable a late preview');
  }
});

test('blur/reset clears every transient hold and pending timer while retaining pinned English', () => {
  for (const pinned of [false, true]) {
    for (const elapsed of [100, 300]) {
      const { state, clock } = language();
      if (pinned) state.toggle();
      state.keyDown(shift('ShiftLeft'));
      state.keyDown(shift('ShiftRight'));
      state.beginHold();
      clock.advance(elapsed);
      state.resetTransient();
      assert.equal(state.english, pinned);
      assert.equal(state.pinned, pinned);
      assert.equal(clock.pendingCount, 0);
      clock.advance(1000);
      state.endHold();
      assert.equal(state.english, pinned, 'reset must not turn the canceled pointer into a tap');
      if (pinned) {
        state.toggle();
        assert.equal(state.english, false, 'no stale Shift or pointer hold may remain');
      }
    }
  }
});

test('all theory prompts, choices and explanations translate with matching answer positions', () => {
  const all = [...THEORY_QUESTIONS, ...SCHEDULING_QUESTIONS];
  for (const question of all) {
    const en = THEORY_EN[question.id] || SCHEDULING_EN[question.id];
    assert.ok(en, question.id);
    assert.equal(en.options.length, question.options.length, question.id);
    assert.equal(translateText(question.prompt), en.prompt, `${question.id} prompt`);
    assert.equal(translateText(question.explanation), en.explanation, `${question.id} explanation`);
    question.options.forEach((option, index) => {
      const prefix = `${String.fromCharCode(65 + index)}. `;
      assert.equal(translateText(option), en.options[index], `${question.id} option ${index}`);
      assert.equal(translateText(prefix + option), prefix + en.options[index], `${question.id} prefixed option ${index}`);
    });
    assert.equal(translateText(`A. ${question.options[question.answer]}`), `A. ${en.options[question.answer]}`);
  }
});

test('numeric exercise text and field labels translate without changing data or answer keys', () => {
  const before = structuredClone(NUMERIC_EXERCISES);
  assert.deepEqual(Object.keys(NUMERIC_EN), NUMERIC_EXERCISES.map(item => item.id));
  for (const item of NUMERIC_EXERCISES) {
    const en = NUMERIC_EN[item.id];
    for (const key of ['title', 'description', 'explanation']) {
      assert.equal(translateText(item[key]), en[key], `${item.id} ${key}`);
    }
    assert.deepEqual(en.fields.map(field => field.key), item.fields.map(field => field.key));
    item.fields.forEach((field, index) => assert.equal(translateText(field.label), en.fields[index].label));
  }
  assert.deepEqual(NUMERIC_EXERCISES, before);
});

test('calculation presets retain explicit quiz and slide RR boundary conventions in English', () => {
  assert.deepEqual(Object.keys(PRESETS_EN), CALCULATION_PRESETS.map(item => item.id));
  for (const preset of CALCULATION_PRESETS) {
    assert.equal(translateText(preset.title), PRESETS_EN[preset.id].title, preset.id);
    assert.equal(translateText(preset.description), PRESETS_EN[preset.id].description, preset.id);
  }
  const quiz = PRESETS_EN['actual8-rr'].description;
  assert.match(quiz, /requeue.*before processes arriving/);
  assert.match(quiz, /ART=10\.250/);
  assert.match(quiz, /ART=9\.375/);
  assert.match(PRESETS_EN['slide43-rr'].description, /arriving.*before the process whose quantum/);
});

test('translation preserves leading/trailing whitespace and leaves unknown content unchanged', () => {
  const question = SCHEDULING_QUESTIONS[0];
  assert.equal(translateText(` \n\t${question.prompt}  \t\n`), ` \n\t${SCHEDULING_EN[question.id].prompt}  \t\n`);
  assert.equal(translateText(' \n\t '), ' \n\t ');
  assert.equal(translateText('  P1: AT=0, BT=7; 13,875  '), '  P1: AT=0, BT=7; 13,875  ');
});

test('computed feedback and progress counters translate their changing numbers', () => {
  const pairs = [
    ['Đúng 67% số ô. Cùng kiểm tra lại.', '67% of fields are correct. Let’s review the rest.'],
    ['Đúng hoàn toàn 12 câu/bài. Xem lại từng câu bên dưới.', '12 fully correct questions/exercises. Review each one below.'],
    ['12 / 20 điểm', '12 / 20 points'],
    ['14.67 / 22 điểm', '14.67 / 22 points'],
    ['12/20 câu đã điền đầy đủ', '12/20 fully answered'],
    ['Luyện tập · câu 2/8 · Đã hoàn thành', 'Practice · question 2/8 · Completed'],
    ['Đề tổng hợp · câu 7/20', 'Mixed exam · question 7/20'],
    ['Bạn đã trả lời đầy đủ 12/20 câu/bài. Nộp đề và xem kết quả?', 'You have fully answered 12/20 questions/exercises. Submit and view your results?'],
  ];
  for (const [vi, en] of pairs) assert.equal(translateText(vi), en);
});

test('every lesson has bilingual essentials, pitfalls and valid current-slide references',()=>{
  assert.deepEqual(LESSONS.map(lesson=>lesson.id),['intro','process','ipc','threads','scheduling']);
  function checkText(pair){assert.ok(pair.vi?.length&&pair.en?.length);assert.equal(translateText(pair.vi),pair.en);}
  for(const lesson of LESSONS){
    checkText(lesson.title);checkText(lesson.intro);
    assert.ok(lesson.sections.length>=5);
    assert.ok(lesson.source.file.startsWith('OS/Current Progress/'));
    for(const section of lesson.sections){
      checkText(section.title);section.points.forEach(checkText);
      assert.ok(section.sourcePages.length>0);
      assert.ok(section.sourcePages.every(page=>Number.isInteger(page)&&page>=1&&page<=lesson.source.pages));
    }
    assert.ok(lesson.pitfalls.length>0);lesson.pitfalls.forEach(checkText);
    for(const formula of lesson.formulas){assert.ok(formula.formula.length>0);checkText(formula.meaning);}
  }
});

test('runtime rule text can register both RR boundary conventions without mixing them', () => {
  const pairs = [
    ['Quy tắc bài kiểm thử RR: đưa tiến trình vừa hết lượng tử vào trước tiến trình mới đến.', 'Test RR rule: requeue the expired process before new arrivals.'],
    ['Quy tắc bài kiểm thử RR: tiến trình mới đến vào trước tiến trình vừa hết lượng tử.', 'Test RR rule: new arrivals enter before the expired process is requeued.'],
  ];
  for (const [vi, en] of pairs) registerTranslation(vi, en);
  for (const [vi, en] of pairs) assert.equal(translateText(vi), en);
});

function eventTarget() {
  const listeners = new Map();
  return {
    addEventListener(name, callback) {
      if (!listeners.has(name)) listeners.set(name, []);
      listeners.get(name).push(callback);
    },
    emit(name, event = {}) { for (const callback of listeners.get(name) || []) callback(event); },
  };
}

// The DOM double deliberately rejects HTML replacement. Translation is allowed
// to edit text/attributes while the same input, focus and open-details survive.
function documentDouble() {
  const nodes = [], elements = [], observers = [];
  function element(tag, attributes = {}) {
    const classes = new Set();
    const node = {
      ...eventTarget(), tagName: tag.toUpperCase(), attributes: new Map(Object.entries(attributes)),
      classList: { toggle(name, enabled) { if (enabled) classes.add(name); else classes.delete(name); } },
      hasAttribute(name) { return this.attributes.has(name); },
      getAttribute(name) { return this.attributes.get(name); },
      setAttribute(name, value) { this.attributes.set(name, value); },
      closest(selector) {
        return selector.split(',').some(part => part === tag || (part === '[data-no-translate]' && this.hasAttribute('data-no-translate'))) ? this : null;
      },
      set innerHTML(_) { throw new Error('Language preview must not replace controls'); },
    };
    elements.push(node);
    return node;
  }
  const button = element('button', { 'data-no-translate': '', 'aria-pressed': 'false' });
  const labels = { '.language-desktop': element('span'), '.language-mobile': element('span') };
  button.querySelector = selector => labels[selector];
  const input = element('input', { placeholder: 'Điền đáp án' });
  Object.assign(input, { value: '13,875', selectionStart: 2, selectionEnd: 5 });
  const details = element('details');
  details.open = true;
  const text = { nodeValue: THEORY_QUESTIONS[0].prompt, parentElement: element('p') };
  const textarea = { nodeValue: THEORY_QUESTIONS[0].prompt, parentElement: element('textarea') };
  nodes.push(text, textarea);
  const doc = {
    ...eventTarget(), body: element('body'), documentElement: {}, hidden: false,
    title: 'OS Studyroom · Ôn tập giữa kỳ', activeElement: input,
    getElementById(id) { return id === 'language-switch' ? button : null; },
    createTreeWalker() { let index = 0; return { nextNode: () => nodes[index++] || null }; },
    querySelectorAll() { return elements.filter(node => ['aria-label', 'placeholder', 'title'].some(name => node.hasAttribute(name))); },
  };
  const win = {
    ...eventTarget(), NodeFilter: { SHOW_TEXT: 4 },
    MutationObserver: class {
      constructor(callback) { this.callback = callback; observers.push(this); }
      disconnect() {}
      observe() {}
    },
  };
  return { doc, win, button, input, details, text, textarea, observers };
}

test('page translation preserves typed answers, selection, focus and open details across updates and blur', () => {
  const view = documentDouble();
  const { state } = initLanguage(view.doc, view.win);
  const input = view.input;
  view.doc.emit('keydown', shift());
  assert.equal(view.doc.documentElement.lang, 'en');
  assert.equal(view.doc.title, 'OS Studyroom · Midterm practice');
  assert.equal(view.text.nodeValue, THEORY_EN[THEORY_QUESTIONS[0].id].prompt);
  assert.equal(view.textarea.nodeValue, THEORY_QUESTIONS[0].prompt, 'editable textarea contents are excluded');
  assert.equal(view.doc.activeElement, input);
  assert.equal(input.value, '13,875');
  assert.deepEqual([input.selectionStart, input.selectionEnd], [2, 5]);
  assert.equal(view.details.open, true);

  // A newly rendered question while preview is active should translate and then
  // restore its own Vietnamese text, rather than the previous question's text.
  view.text.nodeValue = SCHEDULING_QUESTIONS[0].prompt;
  view.observers[0].callback();
  assert.equal(view.text.nodeValue, SCHEDULING_EN['scheduling-001'].prompt);
  view.win.emit('blur');
  assert.equal(view.doc.documentElement.lang, 'vi');
  assert.equal(view.text.nodeValue, SCHEDULING_QUESTIONS[0].prompt);
  assert.equal(view.doc.title, 'OS Studyroom · Ôn tập giữa kỳ');
  assert.equal(input.value, '13,875');
  assert.equal(view.details.open, true);

  state.toggle();
  view.win.emit('blur');
  assert.equal(state.pinned, true);
  assert.equal(view.doc.documentElement.lang, 'en');
  assert.equal(view.button.getAttribute('aria-pressed'), 'true');
});

test('a pointer tap toggles once even when its follow-up click has detail zero',()=>{
  const view=documentDouble();
  const {state}=initLanguage(view.doc,view.win);
  view.button.emit('pointerdown',{button:0,isPrimary:true,pointerId:1});
  view.button.emit('pointerup',{button:0,isPrimary:true,pointerId:1});
  view.button.emit('click',{detail:0});
  assert.equal(state.pinned,true);
  assert.equal(view.doc.documentElement.lang,'en');
  view.button.emit('keydown',{key:'Enter'});
  view.button.emit('click',{detail:0});
  assert.equal(state.pinned,false,'keyboard activation remains available immediately after a tap');
});
