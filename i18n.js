import { THEORY_QUESTIONS } from './data/theory.js?v=1.1.1';
import { SCHEDULING_QUESTIONS, CALCULATION_PRESETS } from './data/scheduling.js';
import { NUMERIC_EXERCISES } from './practice.js';
import { THEORY_EN } from './data/theory.en.js?v=1.1.1';
import { SCHEDULING_EN, PRESETS_EN } from './data/scheduling.en.js';
import { NUMERIC_EN } from './data/numeric.en.js';
import { LESSONS } from './data/lessons.js';
import { UI_EN } from './data/ui.en.js?v=1.2.0';

const dictionary = new Map(Object.entries(UI_EN));
export function registerTranslation(vi,en) { if(vi&&en)dictionary.set(vi.trim(),en.trim()); }
function addBilingual(value) {if(value&&typeof value==='object'){if(typeof value.vi==='string'&&typeof value.en==='string')registerTranslation(value.vi,value.en);else for(const child of Object.values(value))addBilingual(child);}}
for(const item of [...THEORY_QUESTIONS,...SCHEDULING_QUESTIONS]) {
  const en=THEORY_EN[item.id]||SCHEDULING_EN[item.id];
  if(!en)continue;
  registerTranslation(item.prompt,en.prompt);registerTranslation(item.explanation,en.explanation);
  item.options.forEach((option,i)=>registerTranslation(option,en.options[i]));
}
for(const item of [...CALCULATION_PRESETS,...NUMERIC_EXERCISES]) {
  const en=PRESETS_EN[item.id]||NUMERIC_EN[item.id];if(!en)continue;
  for(const key of ['title','description','explanation'])registerTranslation(item[key],en[key]);
  item.fields?.forEach((field,i)=>registerTranslation(field.label,en.fields?.[i]?.label));
}
LESSONS.forEach(addBilingual);

export function translateText(value) {
  const text=String(value),trimmed=text.trim();
  if(!trimmed)return text;
  let translated=dictionary.get(trimmed);
  if(!translated) {
    const option=trimmed.match(/^([A-Z]\. )(.*)$/s);
    if(option&&dictionary.has(option[2]))translated=option[1]+dictionary.get(option[2]);
  }
  if(!translated) {
    translated=trimmed
      .replace(/^(\d+) CÂU · (\d+) CHỦ ĐỀ$/,'$1 QUESTIONS · $2 TOPICS')
      .replace(/^(\d+) câu đang chờ bạn\.$/,'$1 questions ready for review.')
      .replace(/^(\d+) câu trắc nghiệm$/,'$1 multiple-choice questions')
      .replace(/^(\d+) câu bổ sung$/,'$1 additional questions')
      .replace(/^(\d+) phút$/,'$1 minutes')
      .replace(/^(\d+(?:\.\d+)?) \/ (\d+) điểm$/,'$1 / $2 points')
      .replace(/^\/ (\d+) điểm$/,'/ $1 points')
      .replace(/^(\d+) \/ (\d+) CÂU \/ BÀI$/,'$1 / $2 QUESTIONS / EXERCISES')
      .replace(/^(\d+) \/ (\d+) CÂU$/,'$1 / $2 QUESTIONS')
      .replace(/^(\d+)\/(\d+) câu đã điền đầy đủ$/,'$1/$2 fully answered')
      .replace(/^Đến câu (\d+)$/,'Go to question $1')
      .replace(/^Đúng (\d+)% số ô\. Cùng kiểm tra lại\.$/,'$1% of fields are correct. Let’s review the rest.')
      .replace(/^Đúng hoàn toàn (\d+) câu\/bài\. Xem lại từng câu bên dưới\.$/,'$1 fully correct questions/exercises. Review each one below.')
      .replace(/^Bạn đã trả lời đầy đủ (\d+)\/(\d+) câu\/bài\. Nộp đề và xem kết quả\?$/,'You have fully answered $1/$2 questions/exercises. Submit and view your results?')
      .replace(/^(Luyện tập|Đề tổng hợp) · câu (\d+)\/(\d+)( · Đã hoàn thành)?$/,(_,type,n,total,done)=>`${type==='Luyện tập'?'Practice':'Mixed exam'} · question ${n}/${total}${done?' · Completed':''}`)
      .replace(/^(.*?) · Bài luyện mới$/,(_,algorithm)=>`${translateText(algorithm)} · New practice exercise`)
      .replace(/^Bảng dữ liệu tiến trình · (.*)$/,(_,algorithm)=>`Process data · ${translateText(algorithm)}`)
      .replace(/^Đối chiếu lời giải: /,'Answer reference: ')
      .replace(/ · trang (\d+)/g,' · page $1')
      .replace(/^Slide CPU Scheduling, trang (\d+)/,'CPU Scheduling slides, page $1')
      .replace(/^Slide 01 · Giới thiệu/,'Lecture 01 · Introduction')
      .replace(/^Slide 02 · Tiến trình/,'Lecture 02 · Processes')
      .replace(/^Slide 03 · IPC/,'Lecture 03 · IPC')
      .replace(/^Slide 04 · Luồng/,'Lecture 04 · Threads')
      .replace(/^Quiz thực tế · /,'Course quiz · ')
      .replace(/^Quiz 8 · CPU Scheduling \(Ôn tập\)/,'Quiz 8 · CPU Scheduling (Review)');
  }
  return text.slice(0,text.indexOf(trimmed))+translated+text.slice(text.indexOf(trimmed)+trimmed.length);
}

// Input state is independent of rendering, answers and persistent study data.
export function createLanguageState(onChange,clock={setTimeout,clearTimeout}) {
  let pinned=false,holding=false,pointerDown=false,holdTimer=null,last='';
  const shifts=new Set();
  function emit(){const key=`${pinned||holding||shifts.size>0}:${pinned}`;if(key!==last){last=key;onChange({english:pinned||holding||shifts.size>0,pinned});}}
  function cancelHold(){if(holdTimer!==null)clock.clearTimeout(holdTimer);holdTimer=null;holding=false;pointerDown=false;emit();}
  const api={
    get english(){return pinned||holding||shifts.size>0;},get pinned(){return pinned;},
    keyDown(event){if(event.key==='Shift'){shifts.add(event.code||'Shift');emit();}},
    keyUp(event){if(event.key==='Shift'){shifts.delete(event.code||'Shift');if(event.shiftKey===false)shifts.clear();emit();}},
    toggle(){pinned=!pinned;emit();},
    beginHold(){if(pointerDown)return;pointerDown=true;holdTimer=clock.setTimeout(()=>{holdTimer=null;if(pointerDown){holding=true;emit();}},300);},
    endHold(){if(!pointerDown)return;const wasHolding=holding;if(holdTimer!==null)clock.clearTimeout(holdTimer);holdTimer=null;pointerDown=false;holding=false;if(!wasHolding)pinned=!pinned;emit();},
    cancelHold,
    resetTransient(){shifts.clear();cancelHold();}
  };
  emit();return api;
}

// Translate existing text nodes and attributes rather than rerendering controls.
// This preserves typed values, selection, focus, open details and exam deadlines.
export function initLanguage(doc=document,win=window) {
  const button=doc.getElementById('language-switch');if(!button)return;
  let english=false,observer,refreshing=false,suppressClickUntil=0,keyboardActivation=false;
  const texts=new WeakMap(),attributes=new WeakMap();
  const originalTitle=doc.title;
  const excluded='script,style,noscript,textarea,[data-no-translate]';
  function refresh(){
    if(refreshing)return;refreshing=true;observer?.disconnect();
    try {
      const walker=doc.createTreeWalker(doc.body,win.NodeFilter.SHOW_TEXT);
      let node;
      while((node=walker.nextNode())){
        if(!node.parentElement||node.parentElement.closest(excluded))continue;
        let record=texts.get(node);
        if(!record||node.nodeValue!==record.rendered)record={vi:node.nodeValue,rendered:node.nodeValue};
        const next=english?translateText(record.vi):record.vi;
        if(node.nodeValue!==next)node.nodeValue=next;
        record.rendered=next;texts.set(node,record);
      }
      for(const element of doc.querySelectorAll('[aria-label],[placeholder],[title]')){
        if(element.closest('[data-no-translate]'))continue;
        let records=attributes.get(element)||{};
        for(const name of ['aria-label','placeholder','title']){
          if(!element.hasAttribute(name))continue;
          const current=element.getAttribute(name);
          let record=records[name];if(!record||current!==record.rendered)record={vi:current,rendered:current};
          const next=english?translateText(record.vi):record.vi;
          if(current!==next)element.setAttribute(name,next);
          record.rendered=next;records[name]=record;
        }
        attributes.set(element,records);
      }
      doc.documentElement.lang=english?'en':'vi';
      doc.title=english?translateText(originalTitle):originalTitle;
    } finally {refreshing=false;observer?.observe(doc.body,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['aria-label','placeholder','title']});}
  }
  const state=createLanguageState(view=>{
    english=view.english;
    button.classList.toggle('is-english',english);button.classList.toggle('is-pinned',view.pinned);
    button.setAttribute('aria-pressed',String(english));
    button.setAttribute('aria-label',english?'English view. Tap to toggle, or hold to preview.':'Xem tiếng Anh. Chạm để bật/tắt, hoặc nhấn giữ để xem tạm.');
    button.title=english?'Hold Shift for a temporary English view. Tap this button to toggle.':'Giữ Shift để xem tiếng Anh. Chạm nút để bật/tắt; nhấn giữ để xem tạm.';
    const desktop=button.querySelector('.language-desktop'),mobile=button.querySelector('.language-mobile'),hint=button.querySelector('.language-mobile-hint');
    if(desktop)desktop.textContent=view.pinned?'EN · ON':english?'EN · ⇧':'⇧ English';
    if(mobile)mobile.textContent=english?'EN ✓':'EN';
    if(hint)hint.textContent=english?'Hold / tap':'Giữ / chạm';
    refresh();
  });
  observer=new win.MutationObserver(refresh);refresh();
  doc.addEventListener('keydown',event=>state.keyDown(event));
  doc.addEventListener('keyup',event=>state.keyUp(event));
  win.addEventListener('blur',()=>state.resetTransient());
  doc.addEventListener('visibilitychange',()=>{if(doc.hidden)state.resetTransient();});
  button.addEventListener('pointerdown',event=>{if(event.button!==0||event.isPrimary===false)return;button.setPointerCapture?.(event.pointerId);state.beginHold();});
  button.addEventListener('pointerup',event=>{if(event.isPrimary===false)return;suppressClickUntil=Date.now()+800;state.endHold();});
  button.addEventListener('pointercancel',()=>state.cancelHold());
  button.addEventListener('contextmenu',event=>event.preventDefault());
  button.addEventListener('lostpointercapture',()=>state.cancelHold());
  button.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' ')keyboardActivation=true;});
  button.addEventListener('click',()=>{const keyboard=keyboardActivation;keyboardActivation=false;if(!keyboard&&Date.now()<suppressClickUntil)return;state.toggle();});
  return {state,refresh};
}
