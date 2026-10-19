import test from 'node:test';
import assert from 'node:assert/strict';
import {THEORY_QUESTIONS} from '../data/theory.js';
import {SCHEDULING_QUESTIONS,CALCULATION_PRESETS} from '../data/scheduling.js';
import {TOPICS} from '../practice.js';
import {schedule} from '../scheduler.js';

test('Recovered theory keys match answers visibly awarded 1/1 in the original quiz reviews',()=>{
  // Independently checked against the selected radios and scores in the Intro,
  // Process and IPC PDFs. Process Q6 scored 0/1 and remains unrecoverable.
  const markedAnswers={
    'intro-001':1,'intro-002':2,'intro-003':4,'intro-004':0,
    'intro-005':1,'intro-006':1,'intro-007':3,'intro-008':1,
    'process-001':3,'process-002':2,'process-003':2,'process-004':1,
    'process-005':3,'process-006':0,'process-007':2,'process-008':1,'process-009':3,
    'ipc-001':0,'ipc-002':2,
  };
  const actual=THEORY_QUESTIONS.filter(q=>q.origin==='actual');
  assert.equal(actual.length,Object.keys(markedAnswers).length);
  for(const q of actual)assert.equal(q.answer,markedAnswers[q.id],q.id);
  const original=actual.find(q=>q.id==='intro-005');
  assert.equal(original.prompt,'Chúng ta có thể sử dụng trực tiếp một máy tính thuần túy và các tài nguyên của nó không?');
  assert.equal(original.options[original.answer],'Hầu như không có ai.');
});

test('Every scored theory question has one valid answer, unique options and a source page',()=>{
  const all=[...THEORY_QUESTIONS,...SCHEDULING_QUESTIONS];
  assert.equal(new Set(all.map(q=>q.id)).size,all.length);
  assert.ok(all.length>=120);
  for(const q of all){
    assert.ok(TOPICS[q.topic],q.id);
    assert.ok(q.prompt.length>12,q.id);
    assert.ok(q.options.length>=2,q.id);
    assert.equal(new Set(q.options).size,q.options.length,q.id);
    assert.ok(Number.isInteger(q.answer)&&q.answer>=0&&q.answer<q.options.length,q.id);
    assert.ok(q.explanation.length>20,q.id);
    assert.ok(['actual','practice'].includes(q.origin),q.id);
    assert.ok(q.source.file.startsWith('OS/'),q.id);
    assert.ok(Number.isInteger(q.source.page)&&q.source.page>0,q.id);
  }
  for(const topic of Object.keys(TOPICS))assert.ok(all.filter(q=>q.topic===topic).length>=4,topic);
});
test('Every original quiz calculation reproduces all three supplied correct answers',()=>{
  const actual=CALCULATION_PRESETS.filter(p=>p.origin==='actual');
  assert.equal(actual.length,6);
  assert.equal(new Set(actual.map(p=>p.options.algorithm)).size,6);
  for(const p of actual){
    const result=schedule(p.processes,p.options);
    for(const key of ['waiting','turnaround','response'])assert.equal(result.averages[key],p.expectedAverages[key],p.id+' '+key);
  }
});
test('All supplied scheduling datasets finish every process with consistent timing',()=>{
  for(const p of CALCULATION_PRESETS){
    const r=schedule(p.processes,p.options);
    assert.equal(r.metrics.length,p.processes.length,p.id);
    assert.equal(r.segments.reduce((sum,s)=>sum+(s.id==='idle'?0:s.end-s.start),0),p.processes.reduce((sum,x)=>sum+x.burst,0),p.id);
    for(const m of r.metrics){assert.ok(m.waiting>=0&&m.response>=0,p.id);assert.equal(m.turnaround,m.waiting+m.burst,p.id);}
  }
});
