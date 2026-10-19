import { THEORY_QUESTIONS } from './data/theory.js';
import { SCHEDULING_QUESTIONS, CALCULATION_PRESETS } from './data/scheduling.js';
import { schedule, generateExercise } from './scheduler.js';
import { TOPICS, ALGORITHMS, NUMERIC_EXERCISES, numericCorrect, formatNumber as fmt, shuffle } from './practice.js';
import { LESSONS } from './data/lessons.js';
import { initLanguage, registerTranslation, translateText } from './i18n.js?v=1.1.0';

const bank = [...THEORY_QUESTIONS,...SCHEDULING_QUESTIONS];
const $ = (selector) => document.querySelector(selector);
const main = $('#main');
const esc = (value) => String(value ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const bi = (vi,en) => {registerTranslation(vi,en);return esc(vi);};
const KEY = 'os-studyroom-v1';
const fresh = () => ({answers:{},bookmarks:[],calc:{attempts:0,correct:0},exams:[],session:null});
let state;
try { state = {...fresh(),...JSON.parse(localStorage.getItem(KEY) || 'null')}; } catch { state = fresh(); }
if (!state.answers || !Array.isArray(state.bookmarks) || !state.calc || !Array.isArray(state.exams)) state=fresh();
let session = state.session;
if (session && (!Array.isArray(session.items) || !session.items.length || !Number.isInteger(session.index) || !['practice','exam'].includes(session.mode))) session=null;
let selectedReview = 'wrong';
let selectedLesson = 'intro';
let timer;
let dismissConfirm;
function confirmAction(message) {
  return new Promise(resolve=>{
    if(dismissConfirm)dismissConfirm(false);
    const modal=document.createElement('dialog');
    modal.className='confirm-modal';
    modal.innerHTML=`<h2>Xác nhận lựa chọn</h2><p>${esc(message)}</p><div class="button-row"><button class="btn btn-outline" data-confirm="no">Quay lại</button><button class="btn btn-dark" data-confirm="yes">Tiếp tục</button></div>`;
    const done=value=>{modal.close();modal.remove();dismissConfirm=null;resolve(value);};
    dismissConfirm=done;
    modal.addEventListener('cancel',event=>{event.preventDefault();done(false);});
    modal.addEventListener('click',event=>{const answer=event.target.closest('[data-confirm]');if(answer)done(answer.dataset.confirm==='yes');});
    document.body.append(modal);modal.showModal();
  });
}
function save() {
  state.session=session;
  try { localStorage.setItem(KEY,JSON.stringify(state)); } catch { toast('Trình duyệt không thể lưu tiến độ. Bạn vẫn có thể làm bài.'); }
  $('#review-count').textContent=Object.values(state.answers).filter(a=>!a.correct).length;
}
function toast(message) { const box=$('#toast');box.textContent=message;box.hidden=false;clearTimeout(timer);timer=setTimeout(()=>box.hidden=true,4000); }
function heading(kicker,title,description='') { return `<div class="page-heading"><div class="eyebrow">${kicker}</div><h1>${title}</h1>${description?`<p>${description}</p>`:''}</div>`; }
function source(item) {
  const s=item.source;
  return `<details class="source"><summary>Nguồn & đối chiếu</summary><p><strong>${item.origin==='actual'?'Câu hỏi học kỳ này':'Câu luyện tập biên soạn từ bài giảng'}</strong></p><p>${esc(s?.label||'Bài giảng hiện tại')} · trang ${esc(s?.page||'—')}</p><p class="source-path" data-no-translate>${esc(s?.file||'')}</p>${item.evidence?`<p>${bi(`Đối chiếu lời giải: ${item.evidence.file} · trang ${item.evidence.page}`,`Answer reference: ${item.evidence.file} · page ${item.evidence.page}`)}</p>`:''}<p>Đáp án được đối chiếu hoặc tính lại; không thay thế đáp án chính thức của giảng viên.</p></details>`;
}
function tag(item) {return `<span class="tag ${item.origin==='actual'?'tag-course':''}">${item.origin==='actual'?'QUIZ HỌC KỲ NÀY':'LUYỆN TẬP THÊM'}</span>`;}
function stats() { const vals=Object.values(state.answers);return {done:vals.length,correct:vals.filter(x=>x.correct).length,wrong:vals.filter(x=>!x.correct).length}; }
function home() {
  const s=stats();
  main.innerHTML=`<section class="home-hero"><div><div class="eyebrow"><span class="mini-line"></span> SẴN SÀNG CHO GIỮA KỲ</div><h1>Hiểu nguyên lý.<br><span>Vững vàng làm bài.</span></h1><p>Từ những khái niệm đầu tiên đến lập lịch CPU.<br>Luyện đúng hai dạng bài, từng bước một.</p><a class="btn btn-dark" href="#theory">Bắt đầu ôn tập <span>↗</span></a></div><div class="hero-art" aria-hidden="true"><div class="art-title">YOUR NEXT PROCESS</div><div class="art-window"><div class="window-dots"><i></i><i></i><i></i><span>study.exe</span></div><div class="art-code"><span>01</span> understand()<br><span>02</span> practice()<br><span>03</span> <b>you.gotThis()</b><i class="cursor"></i></div><div class="art-timeline"><span>P₁</span><span>P₂</span><span>P₃</span><span>P₄</span></div><div class="art-caption">READY → RUNNING → CONFIDENT</div></div><span class="art-sticker">a little progress,<br>every process.</span></div></section>
  <div class="stat-strip"><div><strong>${bank.length}</strong><span>Câu hỏi lý thuyết</span></div><div><strong>6<span> thuật toán</span></strong><span>Bài tập CPU Scheduling</span></div><div><strong>${s.done}<span> / ${bank.length}</span></strong><span>Câu đã luyện</span></div><div><strong>${s.done?Math.round(s.correct/s.done*100):0}<span>%</span></strong><span>Đúng ở lần gần nhất</span></div></div>
  <a class="summary-cta" href="#summaries"><span class="summary-cta-icon">≡</span><div><h2>Đọc tóm tắt trước khi luyện</h2><p>Ôn ý chính, so sánh các khái niệm và ghi nhớ công thức của từng bài.</p></div><span>Mở tóm tắt →</span></a>
  <div class="section-title"><h2>Hôm nay, mình luyện gì?</h2><span>CHỌN MỘT ĐIỂM BẮT ĐẦU</span></div>
  <div class="mode-grid"><a class="mode-card" href="#theory"><div class="mode-top"><span class="mode-number">01 / LÝ THUYẾT</span><span class="card-icon">▤</span></div><h2>Chọn đáp án.<br>Hiểu vì sao.</h2><p>Trắc nghiệm tiếng Việt theo từng chương, có giải thích và dẫn nguồn bài giảng.</p><div class="card-bottom"><span>${bank.length} CÂU · 5 CHỦ ĐỀ</span><b>↗</b></div></a><a class="mode-card calc-card" href="#calculation"><div class="mode-top"><span class="mode-number">02 / TÍNH TOÁN</span><span class="card-icon">⌗</span></div><h2>Tự tính trước.<br>Xem lời giải sau.</h2><p>Điền kết quả lập lịch, kiểm tra từng đáp án và đối chiếu biểu đồ Gantt.</p><div class="card-bottom"><span>ĐỀ QUIZ THẬT + BÀI SINH MỚI</span><b>↗</b></div></a></div>
  <div class="section-title"><h2>Bản đồ kiến thức</h2><a href="#resources">Xem phạm vi ↗</a></div><div class="topic-list">${Object.entries(TOPICS).map(([id,name],i)=>{const qs=bank.filter(q=>q.topic===id),done=qs.filter(q=>state.answers[q.id]?.correct).length;return `<a href="#theory" class="topic-row" data-topic-link="${id}"><span class="topic-no">0${i+1}</span><strong>${name}</strong><span class="topic-progress"><span style="width:${qs.length?done/qs.length*100:0}%"></span></span><span>${done} / ${qs.length}</span><b>↗</b></a>`;}).join('')}</div>
  <div class="exam-note"><span class="note-symbol">i</span><p><strong>Thi ngày 20/10/2026, bắt đầu lúc 10:30.</strong><br>Trắc nghiệm lý thuyết và điền đáp án tính toán. Mang bút, máy tính cầm tay; không sử dụng tài liệu trong kỳ thi.</p><a href="#exam">Luyện đề tổng hợp →</a></div>`;
}
function summaries() {
  const lesson=LESSONS.find(item=>item.id===selectedLesson)||LESSONS[0];
  main.innerHTML=heading('TÓM TẮT / 5 BÀI HỌC','Nắm ý chính. Kết nối kiến thức.','Tóm tắt năm bài giảng hiện tại, từ tổng quan đến CPU Scheduling. Mỗi bài có ý chính, công thức và những chỗ dễ nhầm.')+`
  <div class="lesson-tabs" role="group" aria-label="Chọn bài học">${LESSONS.map(item=>`<button class="lesson-tab ${item.id===lesson.id?'active':''}" data-action="select-lesson" data-id="${item.id}" aria-pressed="${item.id===lesson.id}" aria-controls="lesson-content"><span>${item.number}</span><strong>${esc(item.title.vi)}</strong></button>`).join('')}</div>
  <article class="lesson-content" id="lesson-content"><header class="lesson-header"><div><span class="eyebrow">${esc(lesson.source.label)}</span><h2>${esc(lesson.title.vi)}</h2><p>${esc(lesson.intro.vi)}</p></div><a class="btn btn-dark" href="#theory" data-topic-link="${lesson.id}">Luyện câu hỏi của bài này →</a></header>
  <div class="lesson-sections">${lesson.sections.map((section,i)=>`<section class="panel lesson-section"><div class="lesson-section-top"><span>${String(i+1).padStart(2,'0')}</span><h3>${esc(section.title.vi)}</h3></div><ul>${section.points.map(point=>`<li>${esc(point.vi)}</li>`).join('')}</ul><div class="lesson-reference">${bi(`${lesson.source.label} · trang ${section.sourcePages.join(', ')}`,`${lesson.source.label} · pages ${section.sourcePages.join(', ')}`)}</div></section>`).join('')}</div>
  ${lesson.formulas.length?`<section class="lesson-formulas panel"><div class="eyebrow">CÔNG THỨC CẦN NHỚ</div>${lesson.formulas.map(formula=>`<div class="formula-item"><code>${esc(formula.formula)}</code><p>${esc(formula.meaning.vi)}</p></div>`).join('')}</section>`:''}
  <section class="lesson-pitfalls"><div class="eyebrow">NHỮNG CHỖ DỄ NHẦM</div><ul>${lesson.pitfalls.map(point=>`<li>${esc(point.vi)}</li>`).join('')}</ul></section>
  <details class="source"><summary>Đối chiếu bài giảng</summary><p class="source-path" data-no-translate>${esc(lesson.source.file)}</p><p>Giữ Shift để xem tiếng Anh. Trên điện thoại: chạm EN để bật/tắt, hoặc nhấn giữ để xem tạm.</p></details></article>`;
}
function theory(topic='all') {
  main.innerHTML=heading('01 / TRẮC NGHIỆM','Hiểu chắc từng khái niệm.','Chọn chủ đề, tự trả lời rồi đọc lời giải. Những câu làm sai sẽ vào sổ tay ôn tập.')+`
  ${session?`<div class="resume-banner"><div><strong>Bạn đang có một phiên luyện tập.</strong><p>${session.mode==='exam'?'Đề tổng hợp':'Luyện tập'} · câu ${session.index+1}/${session.items.length}${session.finished?' · Đã hoàn thành':''}</p></div><button class="btn btn-dark" data-action="resume">Tiếp tục →</button></div>`:''}
  <section class="panel setup-panel"><div class="panel-title"><span class="small-square">▤</span><h2>Thiết lập phiên luyện tập</h2></div><div class="form-grid"><label>Chủ đề<select id="theory-topic"><option value="all">Tất cả chủ đề</option>${Object.entries(TOPICS).map(([id,label])=>`<option value="${id}" ${topic===id?'selected':''}>${label}</option>`).join('')}</select></label><label>Nguồn câu hỏi<select id="theory-origin"><option value="all">Quiz học kỳ này + câu luyện tập</option><option value="actual">Chỉ câu quiz khôi phục được đầy đủ</option><option value="practice">Chỉ câu luyện tập thêm</option></select></label><label>Số câu<select id="theory-count"><option value="10">10 câu · Khởi động</option><option value="20">20 câu · Tập trung</option><option value="all">Tất cả câu phù hợp</option></select></label><label>Ưu tiên<select id="theory-filter"><option value="all">Tất cả câu hỏi</option><option value="new">Chưa từng làm</option><option value="wrong">Đã làm sai</option><option value="bookmarked">Đã đánh dấu</option></select></label></div><div class="setup-footer"><p>Thứ tự câu hỏi được xáo trộn. Có thể dùng phím 1–4 để chọn.</p><button class="btn btn-dark" data-action="start-theory">Bắt đầu luyện tập ↗</button></div></section>
  <section class="tip-card"><span>✦</span><div><h3>Mẹo ôn hiệu quả</h3><p>Giải thích lại bằng lời của mình trước khi xem đáp án. Sau đó quay lại câu sai để kiểm tra xem mình đã hiểu thật chưa.</p></div></section>`;
}
function calculation() {
  main.innerHTML=heading('02 / ĐIỀN ĐÁP ÁN','Bút, máy tính. Và bạn.','Tự lập lịch, điền kết quả rồi kiểm tra. Lời giải chỉ xuất hiện sau khi nộp bài.')+`
  <section class="panel setup-panel"><div class="panel-title"><span class="small-square">⌗</span><h2>Bài tập CPU Scheduling</h2></div><div class="form-grid"><label>Bộ bài<select id="calc-preset"><option value="random">Sinh bài mới · 3–5 tiến trình</option>${CALCULATION_PRESETS.map(p=>`<option value="${esc(p.id)}">${esc(p.title)}</option>`).join('')}</select></label><label>Thuật toán cho bài sinh mới<select id="calc-algorithm">${Object.entries(ALGORITHMS).map(([id,name])=>`<option value="${id}">${name}</option>`).join('')}</select></label><label>Mức chi tiết đáp án<select id="calc-detail"><option value="averages">3 giá trị trung bình: WT, TAT, RT</option><option value="full">Trung bình + từng tiến trình (CT, WT, TAT, RT)</option></select></label></div><div class="setup-footer"><p>Bài quiz giữ nguyên dữ liệu và thuật toán gốc.<br>Nhận dấu phẩy thập phân, dấu chấm và phân số; làm tròn ít nhất 2 chữ số thập phân.</p><button class="btn btn-dark" data-action="start-calc">Mở bài tập ↗</button></div></section>
  <div class="section-title"><h2>Ôn thêm phần trước lập lịch</h2><span>BÀI TẬP TỪ CÁC CHƯƠNG 02–04</span></div><div class="numeric-grid">${NUMERIC_EXERCISES.map(p=>`<button class="numeric-card" data-action="start-numeric" data-id="${p.id}"><span class="tag">TÍNH NHANH</span><h3>${esc(p.title)}</h3><span>Mở bài tập →</span></button>`).join('')}</div>`;
}
function examSetup() {
  main.innerHTML=heading('03 / ĐỀ LUYỆN TỔNG HỢP','Một lần tập dượt thật sự.','Làm cả hai dạng bài trong một phiên. Bạn sẽ xem điểm và lời giải sau khi nộp đề.')+`
  <section class="exam-setup"><div class="exam-setup-main"><span class="tag">ĐỀ TỰ LUYỆN · KHÔNG PHẢI ĐỀ THI CHÍNH THỨC</span><h2>Giữ tập trung.<br>Tự kiểm tra kiến thức.</h2><ul class="exam-features"><li>20 câu lý thuyết từ cả 5 chủ đề</li><li>2 bài điền đáp án: lập lịch CPU và tính nhanh</li><li>Đếm ngược, đánh dấu, quay lại câu chưa làm</li><li>Tổng điểm: mỗi câu/bài 1 điểm; bài tính được chia điểm theo ô</li></ul></div><div class="exam-setup-side"><label>Thời gian tự luyện<select id="exam-duration"><option value="30">30 phút</option><option value="45">45 phút</option><option value="60">60 phút</option></select></label><p>Thời lượng này do bạn chọn để luyện tập. Thông báo chưa nêu thời gian làm bài chính thức.</p><button class="btn btn-dark" data-action="start-exam">Bắt đầu làm đề ↗</button>${session?.mode==='exam'?'<button class="btn btn-outline" data-action="resume">Tiếp tục đề đang lưu</button>':''}</div></section>
  ${state.exams.length?`<div class="section-title"><h2>Những lần tập dượt</h2></div><div class="panel exam-history">${state.exams.slice(-5).reverse().map(e=>`<div><span>${new Date(e.date).toLocaleString('vi-VN')}</span><strong>${e.score} / ${e.total} điểm</strong></div>`).join('')}</div>`:''}`;
}
function review() {
  let qs=bank.filter(q=>selectedReview==='wrong'?state.answers[q.id]&&!state.answers[q.id].correct:state.bookmarks.includes(q.id));
  main.innerHTML=heading('04 / SỔ TAY','Quay lại. Hiểu sâu hơn.','Tập trung vào những chỗ còn vướng và các câu bạn muốn xem lại.')+`<div class="review-tabs"><button class="${selectedReview==='wrong'?'active':''}" data-action="review-tab" data-id="wrong">Câu làm sai <span>${stats().wrong}</span></button><button class="${selectedReview==='saved'?'active':''}" data-action="review-tab" data-id="saved">Đã đánh dấu <span>${state.bookmarks.length}</span></button></div>
  ${qs.length?`<div class="review-toolbar"><p>${qs.length} câu đang chờ bạn.</p><button class="btn btn-dark" data-action="start-review">Luyện lại tất cả →</button></div><div class="review-list">${qs.map(q=>`<article class="panel review-item"><div>${tag(q)}<span class="muted">${TOPICS[q.topic]}</span></div><h3>${esc(q.prompt)}</h3><div><button class="text-btn" data-action="review-one" data-id="${q.id}">Luyện câu này →</button><button class="text-btn" data-action="bookmark-id" data-id="${q.id}">${state.bookmarks.includes(q.id)?'Bỏ đánh dấu':'Đánh dấu ☆'}</button></div></article>`).join('')}</div>`:`<div class="empty-state"><span>✓</span><h2>${selectedReview==='wrong'?'Chưa có câu sai để ôn lại.':'Chưa có câu được đánh dấu.'}</h2><p>${selectedReview==='wrong'?'Bắt đầu luyện tập để khám phá phần mình cần củng cố.':'Bấm ngôi sao khi làm bài để lưu câu hỏi vào đây.'}</p><a class="btn btn-dark" href="#theory">Đến phần lý thuyết ↗</a></div>`}`;
}
function resources() {
  const actual=bank.filter(q=>q.origin==='actual').length;
  main.innerHTML=heading('05 / PHẠM VI & NGUỒN','Đúng trọng tâm học kỳ này.','Ưu tiên tài liệu Current Progress và This semester actual questions trong thư mục OS của bạn.')+`
  <section class="panel resources"><h2>Phạm vi ôn tập</h2><p>Theo thông báo: toàn bộ phần đã học đến hết <strong>CPU Scheduling</strong>. Gồm tổng quan hệ điều hành, tiến trình, giao tiếp liên tiến trình, luồng & đa luồng, lập lịch CPU.</p><div class="scope-tags">${Object.values(TOPICS).map(t=>`<span class="tag">${t}</span>`).join('')}</div><h3>Thông tin kỳ thi</h3><p><strong>20/10/2026, lúc 10:30.</strong> Trắc nghiệm lý thuyết và điền đáp án bài tập tính toán. Không sử dụng mọi hình thức tài liệu. Chuẩn bị bút và máy tính cầm tay. Website chỉ phục vụ ôn tập trước kỳ thi.</p><h3>Ngân hàng được xây dựng như thế nào?</h3><p><strong>${actual} câu trắc nghiệm</strong> có đầy đủ nội dung và lựa chọn từ quiz học kỳ này; <strong>${bank.length-actual} câu bổ sung</strong> được biên soạn từ bài giảng hiện tại. Mỗi câu đều gắn nhãn nguồn và số trang, kèm lời giải. Câu luyện thêm không được coi là đề thi thật.</p><p>Bộ CPU Scheduling ôn tập có bảng 8 tiến trình, được giữ nguyên cho 6 thuật toán. Kết quả của bộ tính được kiểm tra với các đáp án số trong quiz ôn tập. Các bài sinh ngẫu nhiên dùng cùng quy tắc minh bạch.</p><h3>Những chỗ tài liệu không đủ</h3><ul><li>Quiz “3. Intro – kiểm tra bài cũ” có câu hỏi nhưng không có nội dung lựa chọn; chỉ dùng làm gợi ý cho câu luyện tập có nhãn riêng.</li><li>Quiz “7. CPU Scheduling” thiếu nội dung câu hỏi/lựa chọn; không khôi phục hay đoán đáp án.</li><li>Một câu ở quiz Process về thành phần kernel có nhiều lựa chọn có thể đúng; không đưa vào chấm điểm như một câu quiz đã xác minh.</li><li>Không đưa các chủ đề học sau lập lịch CPU vào bộ ôn tập này. Tài liệu của khóa/giảng viên khác không được dùng làm căn cứ ưu tiên.</li></ul><h3>Các bài giảng được đối chiếu</h3><ol><li>Lecture-01-Introduction.pdf</li><li>Lecture-02-Process.pdf</li><li>Lecture-03-InterprocessCommunication.pdf</li><li>Lecture-04-ThreadAndMultithreading.pdf</li><li>Lecture-05-CPUScheduling.pdf</li></ol><p class="muted">Các tệp gốc nằm trong thư mục OS của bạn. Website chỉ chứa nội dung luyện tập và tham chiếu; không tải lên toàn bộ slide, bài nộp hay dữ liệu sinh viên.</p><h3>Quy tắc tính và chấm</h3><p>AT: đến; BT: CPU burst; CT: hoàn thành; TAT = CT − AT; WT = TAT − BT; RT = lần chạy đầu − AT. Không tính chi phí chuyển ngữ cảnh. Tie-break và quy ước RR được ghi ngay trong bài. Nhận kết quả làm tròn 2 chữ số thập phân (sai số tối đa 0,005).</p><h3>Dữ liệu ôn tập</h3><p>Câu đã làm, đánh dấu và đề đang làm được lưu trong trình duyệt hiện tại, không gửi đến máy chủ. Hãy tải bản sao trước khi xóa dữ liệu trình duyệt.</p><div class="button-row"><button class="btn btn-outline" data-action="export-progress">Tải bản sao tiến độ ↓</button><button class="text-btn danger" data-action="reset">Xóa tiến độ trên máy này</button></div></section>`;
}
function createScheduleItem(preset,full=false) {
  const result=schedule(preset.processes,preset.options);
  const fields=[{key:'avg-waiting',label:'WT trung bình',answer:result.averages.waiting},{key:'avg-turnaround',label:'TAT trung bình',answer:result.averages.turnaround},{key:'avg-response',label:'RT trung bình',answer:result.averages.response}];
  if(full) for(const m of result.metrics) for(const [key,label] of [['completion','CT'],['waiting','WT'],['turnaround','TAT'],['response','RT']]) fields.push({key:`${m.id}-${key}`,label:`${m.id} · ${label}`,answer:m[key]});
  return {id:`calc-${Date.now()}-${Math.random().toString(36).slice(2,6)}`,kind:'calculation',exercise:preset,result,fields,values:{},checked:false};
}
function randomPreset(algorithm) {
  const generated=generateExercise(Math.floor(Math.random()*2147483647),algorithm);
  return {id:'random',title:`${ALGORITHMS[algorithm]} · Bài luyện mới`,description:'Tính các đại lượng được yêu cầu cho bảng tiến trình dưới đây. Mỗi tiến trình chỉ có một CPU burst, không có I/O.',processes:generated.processes,options:generated.options,origin:'practice',source:{label:'Bài sinh từ quy tắc Lecture-05',file:'OS/Current Progress/Lecture-05-CPUScheduling.pdf',page:10}};
}
function numericItem(exercise) {return {id:exercise.id,kind:'calculation',exercise,fields:exercise.fields,values:{},checked:false};}
async function begin(items,mode='practice',minutes=30) {
  if(!items.length) {toast('Không có câu phù hợp với bộ lọc. Hãy đổi lựa chọn.');return;}
  if(session&&!session.finished&&!await confirmAction('Bắt đầu phiên mới sẽ thay thế phiên đang làm. Các kết quả đã chấm vẫn được giữ trong sổ tay.')) return;
  session={mode,items,index:0,finished:false,expiresAt:mode==='exam'?Date.now()+minutes*60000:null,startedAt:Date.now()};
  save();location.hash='session';render();
}
function theoryItem(q) {return {id:q.id,kind:'theory',selection:null,checked:false};}
function getQuestion(item) {return bank.find(q=>q.id===item.id);}
function isAnswered(item) {return item.kind==='theory'?item.selection!==null:item.fields.every(f=>String(item.values[f.key]??'').trim()!=='');}
function itemScore(item) {if(item.kind==='theory') return item.selection===getQuestion(item)?.answer?1:0;return item.fields.filter(f=>numericCorrect(item.values[f.key],f.answer)).length/item.fields.length;}
function record(item) {
  if(item.recorded)return;
  if(item.kind==='theory') {const old=state.answers[item.id];state.answers[item.id]={correct:!!itemScore(item),attempts:(old?.attempts||0)+1,date:Date.now()};}
  else {state.calc.attempts++;if(itemScore(item)===1)state.calc.correct++;}
  item.recorded=true;
}
function checkCurrent() {
  const item=session.items[session.index];
  if(!isAnswered(item)) {toast('Bạn hãy trả lời đầy đủ trước khi kiểm tra.');return;}
  item.checked=true;record(item);save();renderSession();
}
async function finishExam(expired=false) {
  if(!session||session.finished)return;
  const target=session;
  if(!expired&&!await confirmAction(`Bạn đã trả lời đầy đủ ${session.items.filter(isAnswered).length}/${session.items.length} câu/bài. Nộp đề và xem kết quả?`))return;
  if(session!==target||session.finished)return;
  if(expired&&dismissConfirm)dismissConfirm(false);
  session.items.forEach(item=>{item.checked=true;record(item);});session.finished=true;
  session.score=Number(session.items.reduce((sum,item)=>sum+itemScore(item),0).toFixed(2));
  state.exams.push({date:Date.now(),score:session.score,total:session.items.length});save();
  if(location.hash==='#session')renderSession();
  else if(!expired){location.hash='session';renderSession();}
  if(expired)toast('Đã hết giờ. Đề được nộp tự động.');
}
function renderSession() {
  if(!session){theory();return;}
  const item=session.items[session.index], q=getQuestion(item),isTheory=item.kind==='theory',show=item.checked&&(session.mode==='practice'||session.finished);
  if(isTheory&&!q){session=null;save();theory();toast('Ngân hàng đã cập nhật. Hãy mở phiên mới.');return;}
  const percent=Math.round((session.index+1)/session.items.length*100),isExam=session.mode==='exam';
  main.innerHTML=`<div class="session-top"><a class="text-btn" href="${isExam?'#exam':isTheory?'#theory':'#calculation'}">← ${isExam?'Đề tổng hợp':isTheory?'Lý thuyết':'Bài tập tính toán'}</a><div class="session-meta">${isExam&&!session.finished?'<span class="timer" id="exam-timer" role="timer"></span>':''}<span>${session.index+1} / ${session.items.length} ${isExam?'CÂU / BÀI':'CÂU'}</span></div></div>
  <div class="session-progress"><span style="width:${percent}%"></span></div>
  ${session.finished?`<div class="score-banner"><div><span class="eyebrow">ĐÃ HOÀN THÀNH ĐỀ TỰ LUYỆN</span><h2>${session.score} <span>/ ${session.items.length} điểm</span></h2><p>Đúng hoàn toàn ${session.items.filter(i=>itemScore(i)===1).length} câu/bài. Xem lại từng câu bên dưới.</p></div><a class="btn btn-dark" href="#review">Đến sổ tay ôn tập →</a></div>`:''}
  <div class="session-layout"><section class="question-panel panel"><div class="question-kicker">${tag(isTheory?q:item.exercise)}<span class="muted">${isTheory?TOPICS[q.topic]:'ĐIỀN ĐÁP ÁN SỐ'}</span>${isTheory?`<button class="bookmark ${state.bookmarks.includes(q.id)?'marked':''}" data-action="bookmark" aria-label="${state.bookmarks.includes(q.id)?'Bỏ đánh dấu':'Đánh dấu câu hỏi'}" aria-pressed="${state.bookmarks.includes(q.id)}">${state.bookmarks.includes(q.id)?'★':'☆'}</button>`:''}</div>
  ${isTheory?renderTheoryQuestion(item,q,show):renderCalculationQuestion(item,show)}
  ${show?`<div class="feedback ${itemScore(item)===1?'correct':'incorrect'}" role="status"><strong>${itemScore(item)===1?'✓ Chính xác. Bạn đã hiểu bài!':itemScore(item)>0?`Đúng ${Math.round(itemScore(item)*100)}% số ô. Cùng kiểm tra lại.`:'Cùng xem lại một chút.'}</strong>${isTheory?`<p>Đáp án đúng: <b>${String.fromCharCode(65+q.answer)}. ${esc(q.options[q.answer])}</b></p><p>${esc(q.explanation)}</p>`:renderCalculationSolution(item)}</div>${source(isTheory?q:item.exercise)}`:''}
  <div class="question-controls"><button class="btn btn-outline" data-action="previous" ${session.index===0?'disabled':''}>← Trước</button><div>${!isExam&&!show?'<button class="btn btn-dark" data-action="check">Kiểm tra đáp án →</button>':''}${session.index<session.items.length-1?'<button class="btn '+(show||isExam?'btn-dark':'btn-outline')+'" data-action="next">Câu tiếp →</button>':isExam&&!session.finished?'<button class="btn btn-dark" data-action="submit-exam">Nộp đề ✓</button>':!isExam&&show?'<button class="btn btn-dark" data-action="complete-practice">Hoàn thành ✓</button>':''}</div></div></section>
  <aside class="session-side"><div class="panel question-map"><span class="eyebrow">${isExam?'BÀI LÀM CỦA BẠN':'TIẾN ĐỘ PHIÊN'}</span><div class="question-dots">${session.items.map((it,i)=>`<button data-action="jump" data-index="${i}" aria-label="Đến câu ${i+1}" ${i===session.index?'aria-current="step"':''} class="${i===session.index?'current':''} ${it.checked&&(!isExam||session.finished)?itemScore(it)===1?'done-correct':'done-wrong':isAnswered(it)?'answered':''}">${i+1}</button>`).join('')}</div><p>${session.items.filter(isAnswered).length}/${session.items.length} câu đã điền đầy đủ</p>${isExam&&!session.finished?'<button class="btn btn-dark full-width" data-action="submit-exam">Nộp đề</button>':''}</div><div class="session-tip"><span class="eyebrow">MỘT CHÚT NHẮC NHỞ</span><p>${isTheory?'Đọc kỹ “đúng”, “sai”, “không phải”. Một từ có thể thay đổi cả đáp án.':'Viết biểu đồ Gantt ra giấy trước. WT = CT − AT − BT; RT chỉ tính đến lần chạy đầu tiên.'}</p><small>${isTheory?'Phím 1–4 chọn · Enter kiểm tra / tiếp':'Dùng dấu phẩy hoặc dấu chấm cho số thập phân.'}</small></div></aside></div>`;
  tick();
}
function renderTheoryQuestion(item,q,show) {
  return `<h1 class="question-prompt">${esc(q.prompt)}</h1><div class="options" role="group" aria-label="Chọn đáp án">${q.options.map((text,i)=>`<button data-action="select-option" data-index="${i}" class="option ${item.selection===i?'selected':''} ${show&&i===q.answer?'option-correct':''} ${show&&item.selection===i&&i!==q.answer?'option-wrong':''}" ${show?'disabled':''} aria-pressed="${item.selection===i}"><span class="option-letter">${String.fromCharCode(65+i)}</span><span>${esc(text)}</span>${show&&i===q.answer?'<b>✓</b>':''}</button>`).join('')}</div>`;
}
function renderCalculationQuestion(item,show) {
  const e=item.exercise;
  return `<h1 class="question-prompt">${esc(e.title)}</h1><p class="calc-description">${esc(e.description)}</p>${e.processes?`<div class="table-scroll"><table class="process-table"><caption>${bi(`Bảng dữ liệu tiến trình · ${ALGORITHMS[e.options.algorithm]}${e.options.algorithm==='rr'?` · quantum = ${e.options.quantum}`:''}`,`Process data · ${translateText(ALGORITHMS[e.options.algorithm])}${e.options.algorithm==='rr'?` · quantum = ${e.options.quantum}`:''}`)}</caption><thead><tr><th>Tiến trình</th><th>Đến (AT)</th><th>CPU burst (BT)</th><th>Ưu tiên</th></tr></thead><tbody>${e.processes.map(p=>`<tr><th>${esc(p.id)}</th><td>${p.arrival}</td><td>${p.burst}</td><td>${p.priority??0}</td></tr>`).join('')}</tbody></table></div><details class="conventions" open><summary>Quy ước của bài này</summary><p>${renderConventions(e.options)}</p></details>`:''}
  <div class="answer-label"><h3>Điền kết quả của bạn</h3><span>Đơn vị thời gian theo đề · làm tròn ≥ 2 chữ số</span></div><div class="numeric-fields">${item.fields.map(f=>`<label>${esc(f.label)}<div class="numeric-input-wrap"><input type="text" inputmode="decimal" autocomplete="off" data-field="${esc(f.key)}" aria-label="${esc(f.label)}" value="${esc(item.values[f.key]??'')}" placeholder="Nhập số..." ${show?'readonly':''} class="${show?numericCorrect(item.values[f.key],f.answer)?'input-correct':'input-wrong':''}">${show?`<span>${numericCorrect(item.values[f.key],f.answer)?'✓':'→ '+fmt(f.answer)}</span>`:''}</div></label>`).join('')}</div>`;
}
function renderConventions(options) {
  const priority=options.algorithm.startsWith('priority');
  const vi=`CPU đơn, không có I/O, không tính chuyển ngữ cảnh. ${priority?`Số ưu tiên ${options.priorityOrder==='higher'?'lớn':'nhỏ'} hơn là ưu tiên cao hơn. `:''}Hòa: đến trước, rồi thứ tự trong bảng. SRTF/ưu tiên chỉ ngắt khi có tiến trình tốt hơn hẳn. ${options.algorithm==='rr'?options.rrBoundary==='requeue-first'?'RR: tiến trình vừa hết quantum được xếp lại trước các tiến trình đến đúng thời điểm đó (quy ước quiz học kỳ này).':'RR: tiến trình đến đúng cuối quantum vào hàng đợi trước tiến trình vừa hết lượt.':''} RT = lần chạy đầu − AT.`;
  const en=`One CPU, no I/O or context-switch costs. ${priority?`${options.priorityOrder==='higher'?'Higher':'Lower'} priority numbers mean higher priority. `:''}Ties: earlier arrival, then table order. SRTF/preemptive priority only preempts for a strictly better process. ${options.algorithm==='rr'?options.rrBoundary==='requeue-first'?'RR: requeue the expired process before processes arriving at that exact instant (this semester’s quiz convention).':'RR: processes arriving exactly at the end of a quantum enter the queue before the expired process is requeued.':''} RT = first start − AT.`;
  return bi(vi,en);
}
function renderCalculationSolution(item) {
  if(!item.result)return `<p>${esc(item.exercise.explanation)}</p>`;
  const r=item.result;
  const m=r.metrics[0];
  const example=bi(`Tính từng dòng từ Gantt, cộng từng cột và chia cho ${r.metrics.length} tiến trình. Ví dụ ${m.id}: TAT = ${m.completion} − ${m.arrival} = ${m.turnaround}; WT = ${m.turnaround} − ${m.burst} = ${m.waiting}; RT = ${m.start} − ${m.arrival} = ${m.response}.`,`Read each row from the Gantt chart, sum each column and divide by ${r.metrics.length} processes. For ${m.id}: TAT = ${m.completion} − ${m.arrival} = ${m.turnaround}; WT = ${m.turnaround} − ${m.burst} = ${m.waiting}; RT = ${m.start} − ${m.arrival} = ${m.response}.`);
  return `<h3>Biểu đồ Gantt</h3><div class="gantt-scroll"><div class="gantt" style="min-width:${Math.max(380,r.segments.length*52)}px">${r.segments.map((s,i)=>`<div class="gantt-block ${s.id==='idle'?'idle':''}" style="flex:${s.end-s.start};--hue:${s.id==='idle'?0:(Number(s.id.replace(/\D/g,''))||i)*47%360}"><b>${s.id==='idle'?'Rỗi':esc(s.id)}</b><span>${s.start}</span>${i===r.segments.length-1?`<em>${s.end}</em>`:''}</div>`).join('')}</div></div><p class="formula-line">TAT = CT − AT · WT = TAT − BT · RT = lần chạy đầu − AT</p><div class="table-scroll"><table class="solution-table"><thead><tr><th>Tiến trình</th><th>Chạy đầu</th><th>CT</th><th>TAT</th><th>WT</th><th>RT</th></tr></thead><tbody>${r.metrics.map(m=>`<tr><th>${esc(m.id)}</th><td>${m.start}</td><td>${m.completion}</td><td>${m.turnaround}</td><td>${m.waiting}</td><td>${m.response}</td></tr>`).join('')}</tbody><tfoot><tr><th colspan="3">Trung bình</th><td>${fmt(r.averages.turnaround)}</td><td>${fmt(r.averages.waiting)}</td><td>${fmt(r.averages.response)}</td></tr></tfoot></table></div><p>${example}</p>`;
}
function tick() {
  if(!session||session.mode!=='exam'||session.finished)return;
  const seconds=Math.max(0,Math.ceil((session.expiresAt-Date.now())/1000));
  const box=$('#exam-timer');if(box){box.textContent=`${Math.floor(seconds/60).toString().padStart(2,'0')}:${(seconds%60).toString().padStart(2,'0')}`;box.classList.toggle('timer-urgent',seconds<300);}
  if(!seconds)finishExam(true);
}
function render() {
  const route=location.hash.slice(1)||'home';
  document.querySelectorAll('[data-nav]').forEach(el=>el.classList.toggle('active',el.dataset.nav===route));
  if(route==='session')renderSession();else if(route==='summaries')summaries();else if(route==='theory')theory();else if(route==='calculation')calculation();else if(route==='exam')examSetup();else if(route==='review')review();else if(route==='resources')resources();else home();
  $('#review-count').textContent=stats().wrong;
}
main.addEventListener('input',event=>{if(event.target.dataset.field&&session){session.items[session.index].values[event.target.dataset.field]=event.target.value;save();}});
main.addEventListener('change',event=>{
  if(event.target.id==='calc-preset')$('#calc-algorithm').disabled=event.target.value!=='random';
});
main.addEventListener('click',async event=>{
  const link=event.target.closest('[data-topic-link]');
  if(link){event.preventDefault();location.hash='theory';setTimeout(()=>theory(link.dataset.topicLink),0);return;}
  const button=event.target.closest('[data-action]');if(!button)return;
  const action=button.dataset.action;
  if(action==='select-lesson'){selectedLesson=button.dataset.id;summaries();}
  else if(action==='start-theory'){
    const topic=$('#theory-topic').value,origin=$('#theory-origin').value,filter=$('#theory-filter').value;
    let qs=bank.filter(q=>(topic==='all'||q.topic===topic)&&(origin==='all'||q.origin===origin)&&(filter==='all'||filter==='new'&&!state.answers[q.id]||filter==='wrong'&&state.answers[q.id]&&!state.answers[q.id].correct||filter==='bookmarked'&&state.bookmarks.includes(q.id)));
    qs=shuffle(qs);const count=$('#theory-count').value;begin((count==='all'?qs:qs.slice(0,Number(count))).map(theoryItem));
  }else if(action==='start-calc'){
    const chosen=$('#calc-preset').value;
    const preset=chosen==='random'?randomPreset($('#calc-algorithm').value):CALCULATION_PRESETS.find(p=>p.id===chosen);
    begin([createScheduleItem(preset,$('#calc-detail').value==='full')]);
  }else if(action==='start-numeric')begin([numericItem(NUMERIC_EXERCISES.find(x=>x.id===button.dataset.id))]);
  else if(action==='start-exam'){
    const qs=[];for(const topic of Object.keys(TOPICS))qs.push(...shuffle(bank.filter(q=>q.topic===topic)).slice(0,4));
    begin([...shuffle(qs).map(theoryItem),createScheduleItem(randomPreset(shuffle(Object.keys(ALGORITHMS))[0])),numericItem(shuffle(NUMERIC_EXERCISES)[0])],'exam',Number($('#exam-duration').value));
  }else if(action==='resume'){location.hash='session';renderSession();}
  else if(action==='select-option'){session.items[session.index].selection=Number(button.dataset.index);save();renderSession();}
  else if(action==='check')checkCurrent();
  else if(action==='next'||action==='previous'||action==='jump'){
    session.index=action==='jump'?Number(button.dataset.index):session.index+(action==='next'?1:-1);save();renderSession();main.scrollIntoView({behavior:'smooth'});
  }else if(action==='submit-exam')finishExam();
  else if(action==='complete-practice'){session.finished=true;save();toast('Đã lưu kết quả phiên luyện tập. Tiếp tục giữ nhịp nhé!');location.hash=session.items[0].kind==='theory'?'review':'calculation';}
  else if(action==='bookmark'||action==='bookmark-id'){
    const id=action==='bookmark'?session.items[session.index].id:button.dataset.id;
    state.bookmarks=state.bookmarks.includes(id)?state.bookmarks.filter(x=>x!==id):[...state.bookmarks,id];save();render();
  }else if(action==='review-tab'){selectedReview=button.dataset.id;review();}
  else if(action==='start-review')begin(shuffle(bank.filter(q=>selectedReview==='wrong'?state.answers[q.id]&&!state.answers[q.id].correct:state.bookmarks.includes(q.id))).map(theoryItem));
  else if(action==='review-one')begin([theoryItem(bank.find(q=>q.id===button.dataset.id))]);
  else if(action==='export-progress'){
    const url=URL.createObjectURL(new Blob([JSON.stringify(state,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='os-studyroom-progress.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  }else if(action==='reset'&&await confirmAction('Xóa toàn bộ câu đã làm, đánh dấu và phiên đang lưu trên trình duyệt này?')){state=fresh();session=null;save();render();toast('Đã xóa tiến độ trên trình duyệt này.');}
});
document.addEventListener('keydown',event=>{
  if(location.hash!=='#session'||!session||event.ctrlKey||event.metaKey||event.altKey||['INPUT','SELECT','TEXTAREA','BUTTON','A','SUMMARY'].includes(event.target.tagName))return;
  const item=session.items[session.index];
  if(item.kind==='theory'&&/^[1-9]$/.test(event.key)&&!item.checked){const q=getQuestion(item),index=Number(event.key)-1;if(index<q.options.length){item.selection=index;save();renderSession();}}
  if(event.key==='Enter'&&session.mode==='practice'){event.preventDefault();if(!item.checked)checkCurrent();else if(session.index<session.items.length-1){session.index++;save();renderSession();}}
});
window.addEventListener('hashchange',()=>{render();window.scrollTo(0,0);});
setInterval(tick,1000);
render();
initLanguage();
