export const TOPICS = {intro:'Tổng quan hệ điều hành',process:'Tiến trình',ipc:'Giao tiếp liên tiến trình',threads:'Luồng & đa luồng',scheduling:'Lập lịch CPU'};
export const ALGORITHMS = {fcfs:'FCFS',sjf:'SJF không ngắt',srtf:'SRTF','priority':'Ưu tiên không ngắt','priority-preemptive':'Ưu tiên có ngắt',rr:'Round Robin'};

// No eval: support decimal dots/commas and simple fractions from a calculator.
export function parseNumber(value) {
  const text = String(value ?? '').trim().replace(/,/g,'.');
  if (!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:\s*\/\s*[+-]?(?:\d+(?:\.\d*)?|\.\d+))?$/.test(text)) return null;
  const parts = text.split('/').map(Number);
  const number = parts.length === 2 ? parts[0] / parts[1] : parts[0];
  return Number.isFinite(number) ? number : null;
}
export function numericCorrect(input,expected) {
  const number = parseNumber(input);
  return number !== null && Math.abs(number - expected) <= 0.005001;
}
export function formatNumber(number) {
  return Number.isInteger(number) ? String(number) : String(Number(number.toFixed(3)));
}
export function shuffle(values) {
  const result = [...values];
  for (let i=result.length-1;i>0;i--) {const j=Math.floor(Math.random()*(i+1)); [result[i],result[j]]=[result[j],result[i]];}
  return result;
}
const slide = (lecture,page) => ({label:`Lecture-${lecture} · slide ${page}`,file:`OS/Current Progress/${{ '02':'Lecture-02-Process','03':'Lecture-03-InterprocessCommunication','04':'Lecture-04-ThreadAndMultithreading'}[lecture]}.pdf`,page});
export const NUMERIC_EXERCISES = [
  {id:'num-amdahl-1',title:'Amdahl · hai lõi',description:'Một chương trình có 25% thời gian thực thi tuần tự, 75% còn lại song song hóa hoàn hảo. Tính hệ số tăng tốc trên 2 lõi, bỏ qua chi phí quản lý.',fields:[{key:'speedup',label:'Hệ số tăng tốc (lần)',answer:1.6}],explanation:'S = 0,25; N = 2. Speedup = 1 / (S + (1 − S)/N) = 1 / (0,25 + 0,75/2) = 1,6.',source:slide('04',15),origin:'practice'},
  {id:'num-amdahl-2',title:'Amdahl · bốn lõi',description:'Một chương trình có 20% thời gian tuần tự. Phần còn lại song song hóa hoàn hảo trên 4 lõi. Tính hệ số tăng tốc, bỏ qua chi phí quản lý.',fields:[{key:'speedup',label:'Hệ số tăng tốc (lần)',answer:2.5}],explanation:'Speedup = 1 / (0,2 + 0,8/4) = 2,5. Thêm lõi không loại bỏ phần tuần tự.',source:slide('04',15),origin:'practice'},
  {id:'num-amdahl-3',title:'Amdahl · giới hạn tăng tốc',description:'Một chương trình có 25% thời gian thực thi tuần tự. Khi số lõi tiến tới vô hạn, hệ số tăng tốc tối đa là bao nhiêu?',fields:[{key:'speedup',label:'Giới hạn tăng tốc (lần)',answer:4}],explanation:'Khi N → ∞, phần (1 − S)/N → 0. Giới hạn speedup = 1/S = 1/0,25 = 4.',source:slide('04',15),origin:'practice'},
  {id:'num-buffer',title:'Bộ đệm vòng · sức chứa',description:'Bộ đệm vòng có BUFFER_SIZE = 10 và dùng điều kiện rỗng in == out, đầy (in + 1) % BUFFER_SIZE == out. Tối đa có bao nhiêu phần tử trong bộ đệm?',fields:[{key:'capacity',label:'Số phần tử tối đa',answer:9}],explanation:'Cách biểu diễn này để trống một ô để phân biệt đầy và rỗng. Sức chứa sử dụng được = BUFFER_SIZE − 1 = 9.',source:slide('03',12),origin:'practice'},
  {id:'num-fork',title:'fork() · số tiến trình và dòng in',description:'Ban đầu có 1 tiến trình. Chương trình gọi fork() thành công đúng 1 lần, không có fork() khác. Cả cha và con đều chạy vòng lặp in đúng 10 dòng. Cha gọi wait(NULL) trước vòng lặp của mình. Tính tổng số tiến trình (kể cả cha) và tổng số dòng được in.',fields:[{key:'processes',label:'Tổng số tiến trình',answer:2},{key:'lines',label:'Tổng số dòng in',answer:20}],explanation:'Một fork() thành công tạo thêm một tiến trình con: tổng 2. Mỗi tiến trình in 10 dòng, tổng 20. wait() chỉ thay đổi thứ tự: con kết thúc trước khi cha bắt đầu in.',source:slide('02',35),origin:'practice'},
  {id:'num-race',title:'Race condition · lần theo từng lệnh',description:'counter ban đầu bằng 5. Thực hiện đúng thứ tự: R1 ← counter; R1 ← R1 + 1; R2 ← counter; R2 ← R2 − 1; counter ← R1; counter ← R2. Giá trị counter cuối cùng là bao nhiêu?',fields:[{key:'counter',label:'counter cuối cùng',answer:4}],explanation:'R1 = 6; R2 đọc counter khi nó vẫn bằng 5 nên R2 = 4. Hai lần ghi lần lượt là 6 rồi 4. Kết quả cuối là 4 (mất cập nhật tăng).',source:slide('03',17),origin:'practice'}
];
