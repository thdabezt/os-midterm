import test from 'node:test';
import assert from 'node:assert/strict';
import {parseNumber,numericCorrect,NUMERIC_EXERCISES} from '../practice.js';
test('Calculator input accepts decimal comma, fractions and zeros safely',()=>{
  assert.equal(parseNumber(' 13,875 '),13.875);
  assert.equal(parseNumber('111/8'),13.875);
  assert.equal(parseNumber('0'),0);
  for (const text of ['', ' ', '1/0','NaN','Infinity','3abc','1+2','1,2,3','<script>']) assert.equal(parseNumber(text),null,text);
});
test('Grading accepts correct rounding to two decimal places and rejects empty answers',()=>{
  assert.ok(numericCorrect('13,88',13.875));
  assert.ok(numericCorrect('13.875',13.875));
  assert.ok(numericCorrect('111/8',13.875));
  assert.ok(!numericCorrect('13.86',13.875));
  assert.ok(!numericCorrect('',0));
  assert.ok(!numericCorrect('0.006',0));
});
test('Non-scheduling fixtures have consistent numeric answers and slide references',()=>{
  for (const item of NUMERIC_EXERCISES) {
    assert.ok(item.source.page>0);
    assert.ok(item.fields.every(field=>Number.isFinite(field.answer)));
  }
  assert.equal(NUMERIC_EXERCISES[0].fields[0].answer,1/(.25+.75/2));
});
