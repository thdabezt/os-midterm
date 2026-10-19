// English text only. IDs, option order, and all scheduling rules match scheduling.js.
export const SCHEDULING_EN = {
  'scheduling-001': {
    prompt: 'What does the short-term scheduler select to receive the CPU?',
    options: ['A process in the ready queue', 'Any process waiting for I/O', 'A terminated process', 'A file in secondary storage'],
    explanation: 'The CPU scheduler (short-term scheduler) selects a process from the ready queue and allocates the CPU to it.',
  },
  'scheduling-002': {
    prompt: 'Which situation permits a scheduling decision in a nonpreemptive system?',
    options: ['A new process moves from waiting to ready', 'The running process moves to waiting or terminates', 'A mandatory time quantum expires', 'A newly arrived higher-priority process preempts the running process'],
    explanation: 'With nonpreemptive scheduling, a process keeps the CPU until it voluntarily enters the waiting state or terminates. Taking the CPU away while the process could still run is preemptive scheduling.',
  },
  'scheduling-003': {
    prompt: 'Which of the following is a task of the dispatcher?',
    options: ['Estimating disk capacity', 'Only selecting the process with the shortest CPU burst', 'Giving the CPU to the process selected by the scheduler', 'Only managing I/O device queues'],
    explanation: 'The dispatcher gives the CPU to the selected process. Its tasks include switching context, switching to user mode, and jumping to the appropriate location to resume the program.',
  },
  'scheduling-004': {
    prompt: 'What is dispatch latency?',
    options: ['The entire lifetime of a process', 'The total time all processes spend waiting for I/O', 'The time from starting the computer to logging in', 'The time the dispatcher takes to stop one process and start another'],
    explanation: 'Dispatch latency measures the overhead of transferring execution from the running process to the next process.',
  },
  'scheduling-005': {
    prompt: 'What does system throughput measure?',
    options: ['The number of processes completed per unit of time', 'The waiting time of the first process to arrive', 'The maximum number of bytes in memory', 'The number of times a process is preempted'],
    explanation: 'Throughput is the number of processes that complete execution per unit of time. The optimization objective is to increase throughput.',
  },
  'scheduling-006': {
    prompt: 'If A is the arrival time and C is the completion time, what is the turnaround time?',
    options: ['C + A', 'C − A', 'A − C', 'Only the initial waiting time'],
    explanation: 'Turnaround time is the interval from arrival to completion: TAT = C − A. It is a duration, unlike the completion time C, which is a point on the timeline.',
  },
  'scheduling-007': {
    prompt: 'If each process has one CPU burst B and no I/O, what is the formula for waiting time W?',
    options: ['W = C + A + B', 'W = B − A', 'W = C − A − B', 'W = C − B + A'],
    explanation: 'Waiting time is the total time spent in the ready queue. With no I/O, W = turnaround − burst = C − A − B. This formula remains valid even if the process is preempted multiple times.',
  },
  'scheduling-008': {
    prompt: 'Which event marks the end of the interval used to calculate response time?',
    options: ['The process terminates completely', 'The process uses its entire CPU burst', 'The process is preempted for the last time', 'The process first receives the CPU, measured from arrival'],
    explanation: 'In scheduling exercises, R = first start time − arrival time. Response time is not the time until completion.',
  },
  'scheduling-009': {
    prompt: 'Which set of objectives is appropriate for optimizing a CPU scheduling algorithm?',
    options: ['Increase CPU utilization and throughput; reduce waiting, turnaround, and response times', 'Reduce CPU utilization and throughput', 'Increase the waiting time of every process', 'Always maximize the number of context switches'],
    explanation: 'The slides list five criteria: CPU utilization, throughput, turnaround time, waiting time, and response time. Maximize the first two and minimize the last three.',
  },
  'scheduling-010': {
    prompt: 'In FCFS, which process is selected next when the CPU becomes available?',
    options: ['The process with the shortest burst, even if it has not arrived', 'The process that entered the ready queue earliest', 'The process with the largest priority number', 'The process whose quantum has just expired'],
    explanation: 'FCFS serves processes in the order they enter the ready queue. A process that has not arrived cannot be selected.',
  },
  'scheduling-011': {
    prompt: 'Which situation commonly illustrates the convoy effect?',
    options: ['All processes have equal CPU bursts', 'The CPU never has a ready process', 'Many short processes wait behind one long process in FCFS', 'Every process receives the CPU immediately on arrival'],
    explanation: 'In FCFS, a CPU-bound process can hold the CPU for a long time, forcing many short or I/O-bound processes to queue behind it.',
  },
  'scheduling-012': {
    prompt: 'What is the main difficulty in applying SJF?',
    options: ['SJF cannot use a ready queue', 'SJF requires every process to have the same burst', 'SJF cannot calculate waiting time', 'The length of the next CPU burst must be known or predicted'],
    explanation: 'SJF must select the shortest next CPU burst. Usually, its exact length is not known before execution, so it must be estimated.',
  },
  'scheduling-013': {
    prompt: 'For processes that are all ready at the same time and have known CPU burst lengths, which criterion does nonpreemptive SJF optimize?',
    options: ['Minimum average waiting time', 'Maximum number of disk accesses', 'Every process always has zero waiting time', 'All processes have equal CPU burst lengths'],
    explanation: 'When all processes are ready together and their bursts are known, running shorter jobs first minimizes total waiting time and therefore average waiting time.',
  },
  'scheduling-014': {
    prompt: 'Which quantity does SRTF use to decide whether to preempt?',
    options: ['The running process’s original total burst, without updating it', 'The running process’s remaining CPU time compared with the newly arrived process’s burst', 'The completion time of an already finished process', 'Only the order of process IDs P1, P2, P3'],
    explanation: 'SRTF is the preemptive form of SJF. If a newly arrived process needs less CPU time than the running process has remaining, the new process receives the CPU.',
  },
  'scheduling-015': {
    prompt: 'In nonpreemptive SJF, a newly arrived process has a shorter burst than the running process. What happens?',
    options: ['The new process always takes the CPU immediately', 'Both processes run simultaneously on one CPU', 'The running process continues until its CPU burst finishes', 'The running process is forcibly terminated'],
    explanation: 'Nonpreemptive means the running process does not lose the CPU just because a shorter job arrives. The new job is considered when the CPU is released.',
  },
  'scheduling-016': {
    prompt: 'In the burst prediction formula τ(n+1) = α·t(n) + (1−α)·τ(n), what is true if α = 0?',
    options: ['The new prediction is always 0', 'The new prediction equals only the latest actual burst', 'All CPU bursts are equal', 'The new prediction equals the previous prediction; the latest actual burst has no effect'],
    explanation: 'Substituting α = 0 gives τ(n+1) = τ(n). The latest burst t(n) has a weight of 0.',
  },
  'scheduling-017': {
    prompt: 'In exponential averaging for CPU burst prediction, what does α = 1 mean?',
    options: ['The next prediction equals the latest actual burst', 'The next prediction equals the initial prediction', 'The latest actual burst is completely ignored', 'The next prediction cannot be calculated'],
    explanation: 'With α = 1, τ(n+1) = t(n), so the predicted value depends only on the latest actual CPU burst.',
  },
  'scheduling-018': {
    prompt: 'Under the convention used in the current slides and review quiz, which priority number has the highest priority?',
    options: ['Priority number 5', 'Priority number 1', 'Priority number 4', 'Priority number 3'],
    explanation: 'The lecture and quiz specify that a smaller priority number means higher priority. Always check the convention in each problem.',
  },
  'scheduling-019': {
    prompt: 'What is starvation in priority scheduling?',
    options: ['The CPU is always idle while processes are waiting', 'Every process has the highest priority', 'A low-priority process may wait indefinitely while higher-priority jobs keep being served', 'A process with a long CPU burst terminates automatically'],
    explanation: 'If higher-priority jobs keep arriving, a low-priority process may never receive the CPU.',
  },
  'scheduling-020': {
    prompt: 'How does aging prevent starvation?',
    options: ['By lowering the priority of processes the longer they wait', 'By deleting every process that waits too long', 'By increasing every process’s burst', 'By gradually raising a process’s priority as it waits'],
    explanation: 'Aging raises the priority of processes that have waited a long time. Under the convention that smaller numbers mean higher priority, raising priority usually means reducing the priority number.',
  },
  'scheduling-021': {
    prompt: 'In Round Robin, what happens if a process has not finished after one quantum q?',
    options: ['It is preempted and placed at the end of the ready queue', 'It is removed from the system', 'It keeps exclusive use of the CPU until it finishes', 'It moves immediately to the terminated state'],
    explanation: 'When its quantum expires and it still has CPU burst time remaining, RR places the process at the end of the queue so other ready processes can receive the CPU.',
  },
  'scheduling-022': {
    prompt: 'When the RR quantum is large enough for every process to finish in its first CPU turn, which algorithm does its behavior approach?',
    options: ['SRTF', 'FCFS (FIFO)', 'Preemptive priority scheduling', 'SJF'],
    explanation: 'When no process is preempted because its quantum expires, RR serves processes in queue order and behaves like FCFS.',
  },
  'scheduling-023': {
    prompt: 'Why can an excessively small RR quantum reduce performance?',
    options: ['It makes every process’s CPU burst grow without bound', 'It automatically turns the algorithm into SJF', 'It increases the number of context switches and the proportion of overhead', 'It guarantees that waiting time is always 0'],
    explanation: 'A smaller q causes more frequent process switches. If q is not large enough relative to context-switch time, much of the CPU’s time is spent on overhead.',
  },
  'scheduling-024': {
    prompt: 'In RR with n processes always ready, no context-switch overhead, and no new arrivals, what is the maximum wait between two consecutive CPU turns for a process?',
    options: ['q/n', 'n + q', 'nq²', '(n−1)q'],
    explanation: 'Between two turns of a process, at most n−1 other processes run, each for at most q time units. The wait therefore does not exceed (n−1)q.',
  },
  'scheduling-025': {
    prompt: 'In a model where each process has one CPU burst and scheduling is nonpreemptive, what is the relationship between waiting time and response time?',
    options: ['They are equal because all waiting occurs before the first CPU turn', 'Waiting time is always 0', 'Response time equals turnaround time', 'Waiting time is always less than response time'],
    explanation: 'With one burst, a process runs to completion once it receives the CPU. It waits only before its first CPU turn, so W = R. With preemption, W also includes later periods of waiting.',
  },
  'scheduling-026': {
    prompt: 'What characterizes multilevel queue scheduling?',
    options: ['Every process must use the same quantum', 'Each process stays in one fixed queue; each queue may use its own algorithm', 'Processes always move between queues after every instruction', 'There is only one ready queue'],
    explanation: 'Multilevel queue scheduling divides the ready queue into separate queues. For example, an interactive queue may use RR and a background queue may use FCFS. Each process is permanently assigned to a queue.',
  },
  'scheduling-027': {
    prompt: 'What is the main difference between a multilevel feedback queue and a multilevel queue?',
    options: ['It does not use priorities', 'Preemption is not allowed', 'Processes can move between queues', 'Aging cannot be applied'],
    explanation: 'A multilevel feedback queue can promote or demote processes between queues according to the scheduler’s rules. This can also implement aging.',
  },
  'scheduling-028': {
    prompt: 'In the example where Q0 uses RR q=8 ms, Q1 uses RR q=16 ms, and Q2 uses FCFS, where does a process go if it has not finished after 8 ms in Q0?',
    options: ['It terminates immediately', 'It remains in Q0 forever', 'It moves directly to the I/O waiting state', 'It moves down to Q1'],
    explanation: 'In the slide example, new jobs enter Q0. A job that uses all 8 ms without finishing moves to Q1. If it then uses all 16 ms in Q1 without finishing, it moves to Q2.',
  },
  'scheduling-029': {
    prompt: 'In steady state, how does Little’s law relate the average number of processes in the queue n, arrival rate λ, and average waiting time W?',
    options: ['n = λW', 'n = λ + W', 'W = nλ', 'λ = nW'],
    explanation: 'Little’s law is n = λW. For example, if λ = 7 processes/second and n = 14, then W = 14/7 = 2 seconds. Time units must be consistent.',
  },
  'scheduling-030': {
    prompt: 'What type of input does deterministic modeling use to evaluate scheduling algorithms?',
    options: ['No workload is needed', 'A predetermined workload used to calculate each algorithm’s performance', 'Only the operating system’s name', 'Only the amount of RAM'],
    explanation: 'Deterministic evaluation uses a specific, known workload to calculate performance. It is simple and fast, but its results apply only to those particular inputs.',
  },
};

const actualDescription = 'The exact eight-process table from the review quiz. Ignore context-switch overhead; each process has one CPU burst. A smaller priority number means higher priority. Break ties by arrival time, then table order; SRTF and preemptive priority keep the running process when the selection criterion is tied. Enter three decimal places.';
const slide43Description = 'The exact exercise table on page 43 of the current slides. Ignore context-switch overhead. Break ties by arrival time, then table order; SRTF keeps the running process when remaining times are equal. RR q=5: processes arriving exactly at the end of a quantum enter the queue before the process whose quantum has just expired.';

export const PRESETS_EN = {
  'actual8-fcfs': { title: 'Review quiz · FCFS', description: actualDescription },
  'actual8-sjf': { title: 'Review quiz · Nonpreemptive SJF', description: actualDescription },
  'actual8-srtf': { title: 'Review quiz · SRTF', description: actualDescription },
  'actual8-priority-preemptive': { title: 'Review quiz · Preemptive priority', description: actualDescription },
  'actual8-priority': { title: 'Review quiz · Nonpreemptive priority', description: actualDescription },
  'actual8-rr': {
    title: 'Review quiz · Round Robin q=4',
    description: actualDescription + ' RR q=4: at the exact end of a quantum, requeue the process whose quantum has expired before processes arriving at that exact time. This requeue-first convention matches the quiz answer ART=10.250; reversing the order gives ART=9.375.',
  },
  'slide18-fcfs': {
    title: 'Slide 18 · FCFS convoy effect',
    description: 'All three processes arrive at time 0 and queue in the order P1, P2, P3. Ignore context-switch overhead. The data and order match the slide example.',
  },
  'slide21-sjf': {
    title: 'Slide 21 · Basic SJF',
    description: 'Four processes are all ready at time 0. Select the job with the shortest CPU burst. Ignore context-switch overhead.',
  },
  'slide26-srtf': {
    title: 'Slide 26 · SRTF with different arrival times',
    description: 'The exact SRTF example from the slides: preempt when a new process has a burst shorter than the running process’s remaining time. Keep the running process on a tie. Ignore context-switch overhead.',
  },
  'slide28-priority': {
    title: 'Slide 28 · Basic priority scheduling',
    description: 'All processes arrive at time 0. A smaller priority number runs first. Ignore context-switch overhead.',
  },
  'slide30-rr': {
    title: 'Slide 30 · Round Robin q=4',
    description: 'All three processes arrive at time 0 in the order P1, P2, P3. The quantum is 4. Ignore context-switch overhead. This matches the RR example in the slides.',
  },
  'slide43-fcfs': { title: 'Slide 43 · FCFS with 8 processes', description: slide43Description },
  'slide43-sjf': { title: 'Slide 43 · SJF with 8 processes', description: slide43Description },
  'slide43-srtf': { title: 'Slide 43 · SRTF with 8 processes', description: slide43Description },
  'slide43-priority': { title: 'Slide 43 · Nonpreemptive priority', description: slide43Description },
  'slide43-rr': { title: 'Slide 43 · Round Robin q=5', description: slide43Description },
};
