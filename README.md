# OS Studyroom

A Vietnamese practice website for the Operating Systems midterm, covering the current course through CPU Scheduling.

**Website:** https://thdabezt.github.io/os-midterm/

## Practice

- **126 theory questions** in Vietnamese: 19 complete current-semester quiz questions translated/normalized where needed, plus 107 questions based on the current lecture slides.
- Topic and source filters, unanswered/wrong/bookmarked filters, immediate explanations, and slide/page references.
- **16 fixed scheduling exercises**, including the current review quiz's exact eight-process dataset across all six algorithms (18 numeric prompts).
- Unlimited generated FCFS, SJF, SRTF, priority (preemptive/nonpreemptive), and Round Robin exercises.
- Fill in mean waiting, turnaround, and response times; optionally fill every process's completion, waiting, turnaround, and response time.
- Gantt chart, per-process solution table, formulas, and a worked example after submission.
- Six earlier-topic numeric exercises: Amdahl, fork/wait, circular buffers, and a specified race-condition interleaving.
- Mixed practice exams: 20 theory questions and two calculation exercises, with a user-selected 30/45/60-minute timer. These durations are practice settings; the announcement did not state the official exam duration.
- Browser-local progress, bookmarks, mistake review, saved sessions, exam history, and a progress JSON export.

## Source policy

Primary material: the user's `OS/Current Progress/Lecture-01...05` slides and `OS/This semester actual questions` quiz exports. A source file and one-based PDF page are attached to each question. English original questions are translated into Vietnamese. New practice is labeled separately from recovered quiz questions. Answers are checked against slides or computed, rather than represented as an official instructor answer key.

The original PDFs, student submissions, grades, and personal data are **not included** in this repository. Older/other-instructor materials are not treated as the current course's authority. Topics after CPU scheduling are excluded.

Incomplete originals are not guessed:

- Intro review quiz 3 has prompts but placeholder option letters; it only informs labeled supplemental practice.
- Scheduling quiz 7 lacks recoverable question and option text.
- Process quiz 4's ambiguous question about what is not a kernel module is excluded from scored actual questions.

## Calculation conventions

One CPU, one CPU burst per process, no I/O or context-switch costs. Ties use arrival time then input-table order; preemption requires a strictly better remaining time/priority. Priority number direction is explicit per exercise.

Round Robin boundary ordering is explicit. **The actual course review quiz uses `rrBoundary: 'requeue-first'`**: the expired process is requeued before processes arriving at precisely that instant. Generated exercises default to `arrival-first`. Both are supported and displayed. All 18 visible review-quiz averages are independently reproduced by the tests.

`TAT = CT - AT`, `WT = TAT - BT`, `RT = firstStart - AT`. Numeric fields accept decimal commas, decimal dots, and simple fractions. Answers rounded to two decimal places are accepted (absolute tolerance 0.005).

## Run locally

Requires Node.js 22+; no package installation is needed.

```sh
npm test
npm start
```

Open http://127.0.0.1:4173. `npm run build` creates `dist/` for static hosting. All application functionality runs in the browser, with no server, accounts, analytics, or API keys. Fonts use Google Fonts with system fallbacks. Progress stays in this browser; the exported JSON is a backup, not an automatic sync/import feature.

## Deploy

The GitHub Actions workflow runs the tests, builds only the public static files, and deploys to GitHub Pages. Select **GitHub Actions** as the Pages publishing source. Relative URLs support the project subpath.

## Exam announcement

The midterm is on **20 October 2026 at 10:30**. Format: theory multiple choice and calculation answer entry; scope through CPU Scheduling. Bring a pen and handheld calculator. No materials may be used during the exam. This website is for preparation before the exam.
