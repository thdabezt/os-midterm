// English text only. Numeric answer values remain in practice.js.
export const NUMERIC_EN = {
  'num-amdahl-1': {
    title: 'Amdahl · Two cores',
    description: 'A program spends 25% of its execution time on serial work. The remaining 75% can be parallelized perfectly. Calculate the speedup on 2 cores, ignoring management overhead.',
    fields: [{ key: 'speedup', label: 'Speedup (×)' }],
    explanation: 'S = 0.25; N = 2. Speedup = 1 / (S + (1 − S)/N) = 1 / (0.25 + 0.75/2) = 1.6.',
  },
  'num-amdahl-2': {
    title: 'Amdahl · Four cores',
    description: 'A program spends 20% of its execution time on serial work. The remainder can be parallelized perfectly on 4 cores. Calculate the speedup, ignoring management overhead.',
    fields: [{ key: 'speedup', label: 'Speedup (×)' }],
    explanation: 'Speedup = 1 / (0.2 + 0.8/4) = 2.5. Adding cores does not eliminate the serial portion.',
  },
  'num-amdahl-3': {
    title: 'Amdahl · Speedup limit',
    description: 'A program spends 25% of its execution time on serial work. As the number of cores approaches infinity, what is the maximum speedup?',
    fields: [{ key: 'speedup', label: 'Maximum speedup (×)' }],
    explanation: 'As N → ∞, the term (1 − S)/N → 0. The speedup limit is 1/S = 1/0.25 = 4.',
  },
  'num-buffer': {
    title: 'Circular buffer · Capacity',
    description: 'A circular buffer has BUFFER_SIZE = 10. It uses in == out for the empty condition and (in + 1) % BUFFER_SIZE == out for the full condition. What is the maximum number of items the buffer can hold?',
    fields: [{ key: 'capacity', label: 'Maximum number of items' }],
    explanation: 'This representation leaves one slot empty to distinguish full from empty. Usable capacity = BUFFER_SIZE − 1 = 9.',
  },
  'num-fork': {
    title: 'fork() · Processes and printed lines',
    description: 'There is initially 1 process. The program successfully calls fork() exactly once, with no other fork() calls. Both parent and child run a loop that prints exactly 10 lines. The parent calls wait(NULL) before its own loop. Calculate the total number of processes (including the parent) and the total number of printed lines.',
    fields: [{ key: 'processes', label: 'Total number of processes' }, { key: 'lines', label: 'Total number of printed lines' }],
    explanation: 'One successful fork() creates one child process, giving 2 processes in total. Each prints 10 lines, for a total of 20. wait() changes only the order: the child finishes before the parent begins printing.',
  },
  'num-race': {
    title: 'Race condition · Trace each instruction',
    description: 'counter initially equals 5. Execute the following instructions in exactly this order: R1 ← counter; R1 ← R1 + 1; R2 ← counter; R2 ← R2 − 1; counter ← R1; counter ← R2. What is the final value of counter?',
    fields: [{ key: 'counter', label: 'Final counter value' }],
    explanation: 'R1 = 6. R2 reads counter while it is still 5, so R2 = 4. The two writes store 6 and then 4. The final result is 4: the increment update is lost.',
  },
};
