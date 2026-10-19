// English companion to theory.js. IDs and option positions match the Vietnamese bank.
export const THEORY_EN = {
  "intro-001": {
    "prompt": "Which description best captures what a bare computer (without an operating system) can do?",
    "options": [
      "Provide a graphical user interface.",
      "Perform basic arithmetic operations.",
      "Provide applications and Internet connectivity.",
      "Provide applications for users."
    ],
    "explanation": "Hardware can execute machine instructions such as arithmetic operations. A convenient interface and application environment need supporting software. This is the distinction intended by the lecture quiz; it does not mean that every program necessarily requires an OS."
  },
  "intro-002": {
    "prompt": "Which code can a bare computer execute directly?",
    "options": [
      "c.open();",
      "add AX, BX",
      "0110010110",
      "a = a + b"
    ],
    "explanation": "The CPU directly executes machine code represented as bits. C, high-level expressions, and assembly language must be translated into machine instructions appropriate for the CPU architecture."
  },
  "intro-003": {
    "prompt": "Which language can a bare computer understand directly?",
    "options": [
      "Shell",
      "C++",
      "Java",
      "Julia",
      "Binary code (0110010110)",
      "C",
      "Assembly",
      "Python"
    ],
    "explanation": "The lecture answer is binary code, the representation of machine instructions. Assembly is close to the hardware but still needs an assembler; the other languages require compilation or interpretation."
  },
  "intro-004": {
    "prompt": "Which description gives the most complete account of the resources a computer may have?",
    "options": [
      "CPU, RAM, disks, and anything that can be connected to the computer, such as CDs and network cards.",
      "CPU, RAM, disks, and a printer.",
      "CPU, RAM, disks, a printer, and a monitor.",
      "CPU, RAM, and disks."
    ],
    "explanation": "Resources include not only the CPU, RAM, and disks, but also I/O devices, network devices, and peripherals. The other options list only some resources."
  },
  "intro-005": {
    "prompt": "Can we directly use a bare computer and its resources?",
    "options": [
      "Any ordinary user.",
      "Almost no one.",
      "Software developers.",
      "Yes, only some system programmers can do so."
    ],
    "explanation": "In the review of Quiz 1, question 5, B, ‘Almost no one,’ is marked correct for 1/1 point. The question emphasizes the OS’s role in making hardware and resources convenient for users to access. Experts can still program hardware directly; that is a separate technical case."
  },
  "intro-006": {
    "prompt": "Among the following choices, what type of operating system is Windows?",
    "options": [
      "An embedded OS.",
      "A multiprogramming OS.",
      "A special-purpose OS.",
      "A single-program OS."
    ],
    "explanation": "Windows can keep and execute multiple programs, so it fits the multiprogramming category. This classification concerns the ability to run programs, rather than a system limited to a single program."
  },
  "intro-007": {
    "prompt": "Among the following choices, how is macOS classified?",
    "options": [
      "A real-time OS.",
      "A distributed OS.",
      "A special-purpose OS.",
      "A general-purpose OS."
    ],
    "explanation": "macOS supports many kinds of tasks on personal computers, so it is a general-purpose OS. Fast response alone does not make it a hard real-time OS."
  },
  "intro-008": {
    "prompt": "Which classification is INCORRECT for Ubuntu Linux?",
    "options": [
      "A multiuser OS.",
      "A single-program OS.",
      "A multitasking OS.",
      "A general-purpose OS."
    ],
    "explanation": "Ubuntu supports multiprogramming, multitasking, and multiple users. Calling it a single-program OS is therefore incorrect."
  },
  "intro-009": {
    "prompt": "What is the overall role of an operating system?",
    "options": [
      "Only to compile C programs.",
      "To replace all computer hardware.",
      "To act as an intermediary between users and hardware, manage resources, and support applications.",
      "Only to provide Internet connectivity."
    ],
    "explanation": "An OS manages hardware efficiently and provides a convenient environment for running applications. It is more than just an interface or a compiler."
  },
  "intro-010": {
    "prompt": "Which statement correctly distinguishes the kernel from system programs?",
    "options": [
      "Every system program is part of the kernel.",
      "System programs are closely associated with the kernel but are not necessarily part of it.",
      "The kernel is only a text editor.",
      "User applications always run inside the kernel."
    ],
    "explanation": "The slides distinguish the OS kernel, system programs, and applications. A system utility may use kernel services without being part of the kernel itself."
  },
  "intro-011": {
    "prompt": "What does middleware primarily provide?",
    "options": [
      "Libraries or frameworks that provide additional services for application developers.",
      "Only the physical registers of the CPU.",
      "A type of hard disk that replaces RAM.",
      "A mechanism that makes every application part of the kernel."
    ],
    "explanation": "Middleware provides additional services, such as database or multimedia services. It is not hardware, nor is it synonymous with the OS kernel."
  },
  "intro-012": {
    "prompt": "Which characteristic best describes a batch operating system?",
    "options": [
      "Users must interact continuously with each job while it runs.",
      "Every job must have a graphical interface.",
      "Input data does not need to be specified.",
      "Similar jobs are grouped into batches; users have little direct interaction while they run."
    ],
    "explanation": "In the batch model, an operator groups similar jobs for execution. Key limitations are the lack of interaction with a running job and the need to prepare input in advance."
  },
  "intro-013": {
    "prompt": "In multiprogramming on a single CPU, what can the system do when the current program must wait for I/O?",
    "options": [
      "Always shut down the CPU until all I/O finishes.",
      "Switch the CPU to another program that is ready.",
      "Remove all other programs from memory.",
      "Execute two instructions in parallel on the same core."
    ],
    "explanation": "Multiprogramming allows several programs to reside in memory. Switching to a ready program when another waits helps reduce CPU idle time."
  },
  "intro-014": {
    "prompt": "How does time-sharing create the impression that several processes run simultaneously on one core?",
    "options": [
      "By dividing CPU time into small intervals and switching frequently between processes.",
      "By permanently assigning the CPU to the first process.",
      "By never performing context switches.",
      "By allowing each process to use exactly one machine instruction."
    ],
    "explanation": "Time-sharing uses time quanta and frequent switching to provide quick responses. Concurrency on one core does not mean that instructions actually execute in parallel."
  },
  "intro-015": {
    "prompt": "What hardware characteristic enables multiprocessing?",
    "options": [
      "Only a larger disk.",
      "Only one core but many windows.",
      "Multiple CPUs or multiple CPU cores.",
      "No RAM."
    ],
    "explanation": "Multiprocessing uses multiple CPUs or cores to execute work at the same time. Multitasking on a single core is a different concept and does not create additional cores."
  },
  "intro-016": {
    "prompt": "Which statement best describes a multiuser operating system?",
    "options": [
      "It means exactly the same thing as a multiprogramming OS.",
      "Only one account may use the system at any time.",
      "It requires a separate CPU for each user.",
      "It allows multiple users to use the same system concurrently, often through terminals or a network."
    ],
    "explanation": "Multiuser describes the ability to serve multiple users. Multiprogramming describes the ability to manage multiple programs. These classifications are related but not synonymous."
  },
  "intro-017": {
    "prompt": "What view does a distributed OS try to present of a group of separate computers?",
    "options": [
      "The computers cannot exchange any data.",
      "The group appears to users as a single unified system.",
      "The group has exactly one physically shared RAM.",
      "All computers must be powered off."
    ],
    "explanation": "A distributed system manages multiple nodes and makes them appear to be one system. The nodes communicate over a network and may share resources and data."
  },
  "intro-018": {
    "prompt": "What is a key distinguishing feature of a hard real-time system?",
    "options": [
      "Strict deadlines that must not be missed.",
      "It always has a better-looking graphical interface.",
      "Completion time does not matter.",
      "It is always faster than every other system for every calculation."
    ],
    "explanation": "Correctness in a real-time system depends on both the result and when it is delivered. In a hard real-time system, missing a deadline is unacceptable."
  },
  "intro-019": {
    "prompt": "Which description fits an embedded operating system?",
    "options": [
      "It is used only to run every desktop application for every architecture.",
      "It always has an unlimited number of functions.",
      "It is integrated into a device to perform specific tasks.",
      "It cannot be used in household appliances."
    ],
    "explanation": "An embedded OS serves specific functions within a device and often has a limited set of tasks. Slide examples include ATMs, cameras, and household appliances."
  },
  "intro-020": {
    "prompt": "What is the main purpose of caching?",
    "options": [
      "To remove data in use from all memory.",
      "To replace all secondary storage with registers.",
      "To make all storage devices run at the same speed.",
      "To temporarily copy data from slower storage into faster storage for quicker access."
    ],
    "explanation": "The system checks the cache first. If the data is present, it uses the faster copy; otherwise, it may bring the data into the cache."
  },
  "intro-021": {
    "prompt": "Among the following choices, which type of memory loses its data when power is lost?",
    "options": [
      "ROM.",
      "CPU cache.",
      "Optical disks.",
      "Magnetic tape."
    ],
    "explanation": "CPU cache is volatile memory. ROM, optical disks, and magnetic tape retain data without power."
  },
  "intro-022": {
    "prompt": "According to the slides, which is NOT an OS memory-management function?",
    "options": [
      "Tracking which memory regions are in use and which processes use them.",
      "Deciding what to move into or out of memory.",
      "Automatically collecting every unused object in every user program.",
      "Allocating and freeing memory space as needed."
    ],
    "explanation": "The OS tracks, allocates, and coordinates memory. Object-level garbage collection within applications is usually the responsibility of a language or runtime, rather than an OS service automatically applied to every program."
  },
  "intro-023": {
    "prompt": "According to the lecture, which is NOT a main purpose of virtualization?",
    "options": [
      "Creating more processes as an end in itself.",
      "Using CPU and RAM resources more efficiently.",
      "Running multiple independent operating systems on one physical machine.",
      "Isolating environments with their own resources."
    ],
    "explanation": "Virtualization creates virtual computers, allowing hardware to be shared and environments to be isolated. Simply increasing the number of processes is not its main purpose."
  },
  "intro-024": {
    "prompt": "What is a notable disadvantage of a monolithic kernel?",
    "options": [
      "All components must communicate over a network.",
      "It cannot provide a file system.",
      "It has no management functions.",
      "Components are tightly coupled, so a change can have widespread effects and extensions can be difficult."
    ],
    "explanation": "A monolithic kernel places many functions in the same kernel space, providing fast communication but tight coupling. This can make modification and extension harder."
  },
  "intro-025": {
    "prompt": "In the strict layered model described in the slides, which layer may layer 3 use directly?",
    "options": [
      "Layer 0, bypassing intermediate layers.",
      "Layer 2.",
      "Any higher layer.",
      "Only layer 3 itself, with no use of lower layers."
    ],
    "explanation": "The slides describe a higher layer as directly using only the adjacent lower layer: layer 3 uses layer 2, without going straight to layer 1. Layers separate responsibilities but can add overhead."
  },
  "intro-026": {
    "prompt": "What is the central idea of a microkernel?",
    "options": [
      "Move every application into kernel space.",
      "Eliminate all communication between components.",
      "Move as many services as possible from the kernel into user space.",
      "Only increase the size of the kernel file."
    ],
    "explanation": "A microkernel keeps the kernel small and moves many functions into user-level services. Message passing between components improves isolation but adds communication overhead."
  },
  "intro-027": {
    "prompt": "How does the lecture describe the Linux kernel structure?",
    "options": [
      "Monolithic, with dynamically loadable modules.",
      "Only a purely layered structure.",
      "A pure microkernel.",
      "It has no kernel."
    ],
    "explanation": "Linux operates monolithically within the kernel address space while also supporting dynamically loadable modules. These properties coexist; they are not mutually exclusive."
  },
  "intro-028": {
    "prompt": "What is the role of a system call?",
    "options": [
      "To physically change the number of CPU cores.",
      "It is another name for every arithmetic function.",
      "It is only a graphical interface shortcut.",
      "To provide a programming interface for requesting OS services."
    ],
    "explanation": "System calls are an interface to OS services. Applications usually use a higher-level API or library, which then invokes the appropriate system call."
  },
  "intro-029": {
    "prompt": "Why does a system distinguish user mode from kernel mode?",
    "options": [
      "Kernel code must be written in a special language.",
      "To protect the system, control privileged operations, and prevent applications from interfering arbitrarily with it.",
      "To deliberately make every user-mode instruction run slowly.",
      "To prevent applications from ever requesting I/O services."
    ],
    "explanation": "The two modes control access to resources and protect system operation. Applications can still request legitimate I/O through OS services."
  },
  "intro-030": {
    "prompt": "Which pair correctly describes the roles of the linker and loader?",
    "options": [
      "The linker assigns CPU time; the loader schedules disks.",
      "The linker creates more CPUs; the loader creates more RAM.",
      "The linker combines object files into an executable; the loader loads the program into memory to run.",
      "The linker and loader only rename files."
    ],
    "explanation": "The linker connects object code and resolves the necessary references. The loader places a program in memory and prepares it for execution."
  },
  "intro-031": {
    "prompt": "According to the lecture, which statement about a shell is correct?",
    "options": [
      "It accepts and executes user commands and may be a system program outside the kernel.",
      "The shell is always the entire OS kernel.",
      "A shell can execute only built-in commands.",
      "Every OS must have exactly one shell."
    ],
    "explanation": "A shell is a command interpreter. It may handle built-in commands or invoke external programs, and an OS may provide multiple shells."
  },
  "process-001": {
    "prompt": "What is the MOST COMPLETE reason that a system needs process scheduling?",
    "options": [
      "Because many processes need to run.",
      "Because there are many processes and all must always be treated equally.",
      "Only to use memory more efficiently.",
      "There are many processes; resources must be used efficiently and long user waits should be avoided."
    ],
    "explanation": "Scheduling serves several goals: using the CPU and other resources efficiently, choosing the next process, and improving responsiveness. Not every policy assigns equal resources to every process."
  },
  "process-002": {
    "prompt": "Which statement about a multiuser OS is NOT correct?",
    "options": [
      "It allows several users to use the computer.",
      "It allows each user to run several processes.",
      "It is synonymous with a multiprogramming OS.",
      "It allows several processes to take turns using the same CPU."
    ],
    "explanation": "Multiuser concerns multiple users, whereas multiprogramming concerns managing and executing multiple programs. The concepts are not synonymous. See also Slide 01, pages 40 and 44."
  },
  "process-003": {
    "prompt": "Which statement about process states is NOT correct?",
    "options": [
      "A process can move from running to ready.",
      "The basic model has new, ready, running, waiting, and terminated states.",
      "Every OS has the same number of process states.",
      "A process can move from running to waiting."
    ],
    "explanation": "The five-state model is a basic teaching model; real operating systems may add or organize states differently. Running → ready occurs when the CPU is taken away, and running → waiting occurs when a process must wait for an event."
  },
  "process-004": {
    "prompt": "Which statement about a context switch is NOT correct?",
    "options": [
      "The destination process is brought into execution.",
      "The current process is always placed in the waiting queue.",
      "The context of the current process is saved.",
      "It is the operation of switching to another process."
    ],
    "explanation": "A process removed from the CPU may return to ready if preempted, or enter waiting if it is waiting for I/O. Therefore, a context switch does not always place the previous process in waiting."
  },
  "process-005": {
    "prompt": "Which statement about a process is correct?",
    "options": [
      "It is always identical to the entire application.",
      "It is only a file on disk.",
      "It is a library.",
      "It is an executing instance of a program."
    ],
    "explanation": "A program is a passive entity; a process is a program in execution, together with its associated state and resources. One program may have several process instances."
  },
  "process-006": {
    "prompt": "Which statement about a batch system is NOT correct?",
    "options": [
      "It allows several users to interact directly and simultaneously with the computer as in a time-sharing system.",
      "It may use FIFO.",
      "It is a simple form of OS.",
      "It differs from a time-sharing system."
    ],
    "explanation": "In this question, a batch system processes submitted jobs in batches without direct interaction while they run. Several users may submit batch jobs, but that does not imply simultaneous time-sharing interaction. See Slide 01, pages 39–41."
  },
  "process-007": {
    "prompt": "What is the correct relationship between an application, a program, and a process?",
    "options": [
      "An application may have several processes, and a process contains several independent programs at the same time.",
      "An application may have several programs, and each program has only one process.",
      "An application may have several programs, and a program may have several processes.",
      "An application has only one program, and each program has only one process."
    ],
    "explanation": "An application may consist of several programs. The same program can run multiple times as separate processes, each with its own state and resources."
  },
  "process-008": {
    "prompt": "Which name is NOT a common type of process scheduler?",
    "options": [
      "Medium-term scheduler.",
      "Quick-term scheduler.",
      "Short-term scheduler.",
      "Long-term scheduler."
    ],
    "explanation": "The common names are long-term, medium-term, and short-term. Quick-term is not a standard scheduling level; the short-term scheduler selects a ready process for the CPU. Slide 02 discusses schedulers generally without listing this complete set of three terms."
  },
  "process-009": {
    "prompt": "In the wording of the quiz and the executable-program model used in the slides, which statement about a program is correct?",
    "options": [
      "It is a process.",
      "It is a library.",
      "It is always part of the OS.",
      "It is an application compiled into executable form."
    ],
    "explanation": "This answer follows the lesson context of an executable program stored on disk. A program is passive, unlike a running process. In the broader sense, interpreted programs also exist, so do not conclude that every program must be compiled in advance."
  },
  "process-010": {
    "prompt": "In a process memory layout, what does the stack typically contain?",
    "options": [
      "All global variables of every process.",
      "Function parameters, return addresses, and local variables.",
      "Only dynamically allocated data blocks.",
      "Only the immutable instructions of the program."
    ],
    "explanation": "The stack holds temporary data for function calls. The data section contains global variables, the heap supports dynamic allocation, and the text section contains instructions."
  },
  "process-011": {
    "prompt": "What is the main purpose of a process heap?",
    "options": [
      "To store every instruction currently in CPU registers.",
      "To store only the process PID.",
      "To hold memory allocated dynamically during execution.",
      "To replace the running program with a new program."
    ],
    "explanation": "The heap is the process region for dynamic allocation. It differs from the stack, which supports function calls, and the text section, which holds program instructions."
  },
  "process-012": {
    "prompt": "What does the ready state mean?",
    "options": [
      "The process is ready to execute and is waiting to be assigned the CPU.",
      "The process has finished.",
      "The process is waiting for an I/O operation to finish.",
      "The process has not been created."
    ],
    "explanation": "Ready means eligible to run but not currently assigned the CPU. Waiting means unable to run until an event occurs; these are different states."
  },
  "process-013": {
    "prompt": "When a running process requests I/O and must wait for the result, which state transition occurs?",
    "options": [
      "Ready → new.",
      "Waiting → terminated immediately.",
      "Terminated → running.",
      "Running → waiting."
    ],
    "explanation": "The process cannot continue executing while waiting for I/O, so it enters waiting. Once the event completes, it may return to ready and wait for the CPU."
  },
  "process-014": {
    "prompt": "In the five-state model, what transition normally occurs after I/O completes?",
    "options": [
      "Waiting → running directly, always taking the CPU immediately.",
      "Waiting → ready.",
      "Waiting → new.",
      "Ready → terminated."
    ],
    "explanation": "Completing I/O makes the process eligible to run again, so it enters ready. The scheduler still decides when to give it the CPU."
  },
  "process-015": {
    "prompt": "What information does the program counter in a PCB record?",
    "options": [
      "The total number of files on disk.",
      "The maximum heap size of all processes.",
      "The address of the next instruction to execute.",
      "The total number of user accounts."
    ],
    "explanation": "The program counter allows a process to resume at the correct point when scheduled again. The PCB also stores state, registers, and scheduling, memory, and I/O information."
  },
  "process-016": {
    "prompt": "Which set correctly describes the ready queue?",
    "options": [
      "Processes in main memory that are ready and waiting to execute on the CPU.",
      "Only terminated processes.",
      "Only processes waiting for data from disk.",
      "All executable files that have never been loaded."
    ],
    "explanation": "The ready queue contains processes eligible to receive the CPU. Wait queues contain processes waiting for events such as I/O, so they are not yet eligible to run."
  },
  "process-017": {
    "prompt": "What happens during a context switch between two processes?",
    "options": [
      "All memory of the old process is always erased.",
      "Only the name of the displayed window changes.",
      "The old process must terminate.",
      "The old process context is saved and the new process context is restored."
    ],
    "explanation": "The context is represented in the PCB and includes the required CPU state. Saving and restoring it allows a process to continue from where it stopped."
  },
  "process-018": {
    "prompt": "Why is context-switch time considered overhead?",
    "options": [
      "Because it is always zero.",
      "Because the system does no useful user-process work while performing the switch.",
      "Because it occurs only during a power failure.",
      "Because it prevents the program from ever continuing."
    ],
    "explanation": "The CPU spends time saving and restoring state rather than doing process work. This time depends on the hardware and the complexity of the OS."
  },
  "process-019": {
    "prompt": "What characterizes a CPU-bound process?",
    "options": [
      "It mainly waits for disk reads and writes.",
      "It does not need the CPU.",
      "It spends more time computing than performing I/O.",
      "It always terminates before every other process."
    ],
    "explanation": "CPU-bound processes require substantial computation, whereas I/O-bound processes spend much of their activity on input and output. The mix affects scheduling policies and CPU utilization."
  },
  "process-020": {
    "prompt": "What does a successful fork() call do?",
    "options": [
      "Create a new child process.",
      "Only create an additional local variable.",
      "Always replace the calling process program without creating a process.",
      "Always terminate both the parent and child."
    ],
    "explanation": "fork() creates a child process. In the Unix example, the child may call exec to replace its executing program; these two operations have different roles."
  },
  "process-021": {
    "prompt": "After a successful fork(), which process receives a return value of 0?",
    "options": [
      "Both the parent and child.",
      "Only the parent process.",
      "Neither process.",
      "The child process."
    ],
    "explanation": "The slide code checks pid == 0 to enter the child branch; the parent receives the child PID. A negative value indicates process-creation failure."
  },
  "process-022": {
    "prompt": "What is the purpose of exec() in the fork–exec example?",
    "options": [
      "To always create another child process.",
      "To replace the program and memory image of the calling process with a new program.",
      "To wait for every process in the system to terminate.",
      "Only to rename the executable file on disk."
    ],
    "explanation": "exec replaces the program image of the calling process; it does not create a new process as fork does. When exec succeeds, the old program does not continue after the call."
  },
  "process-023": {
    "prompt": "Why does the parent call wait() in the lecture example?",
    "options": [
      "To force the child to print before every other process in the system.",
      "To create a second copy of the child.",
      "To wait for a child to terminate and collect its status information.",
      "Only to allocate a new heap region."
    ],
    "explanation": "wait lets the parent wait for and collect a child termination status. It allows the retained termination information for the child to be reclaimed."
  },
  "process-024": {
    "prompt": "When is a child process called a zombie?",
    "options": [
      "The child has terminated, but the parent has not yet collected its termination status.",
      "The child and parent are both still running normally.",
      "The parent has terminated while the child is still running.",
      "The child is waiting to receive the CPU for the first time."
    ],
    "explanation": "A zombie has finished execution, but a status record remains for its parent to collect. An orphan is still alive after its parent has terminated; that is a different situation."
  },
  "process-025": {
    "prompt": "What is a child process called if it is still running after its parent has terminated?",
    "options": [
      "Ready queue.",
      "Zombie.",
      "CPU burst.",
      "Orphan."
    ],
    "explanation": "An orphan process has lost its parent because the parent terminated first. Do not confuse it with a zombie, which has terminated but whose status has not yet been collected by its parent."
  },
  "process-026": {
    "prompt": "What does cascading termination mean?",
    "options": [
      "A child process automatically becomes several threads.",
      "Terminating a process causes its descendants to terminate, according to system policy.",
      "Every context switch terminates the process.",
      "Every OS must always terminate children when their parent terminates."
    ],
    "explanation": "Some operating systems have a policy of terminating descendant processes in a cascade. The slides explicitly describe this as a policy of some systems, rather than a universal OS requirement."
  },
  "process-027": {
    "prompt": "In fork1.c, the parent calls wait(NULL) before printing 10 lines, while the child prints 10 lines and then terminates. What follows if fork succeeds?",
    "options": [
      "The parent and child must print alternating lines.",
      "The parent always prints all 10 lines before the child.",
      "The child prints its 10 lines before the parent prints its 10 lines.",
      "Only one line is printed."
    ],
    "explanation": "wait makes the parent wait for the child to terminate before entering its own print loop. There are two processes and a total of 20 lines from the two loops in this example."
  },
  "process-028": {
    "prompt": "If wait() is removed, as in fork2.c, is the order of the parent and child output guaranteed to match a sample run?",
    "options": [
      "No; the order between the two processes depends on scheduling, although each process retains its own sequential order.",
      "Yes; the parent always finishes all output before the child on every machine.",
      "Yes; the child always finishes all output before the parent on every machine.",
      "Yes; the two processes always alternate exactly one line at a time."
    ],
    "explanation": "The output image in the slides illustrates only one run. Without wait or an appropriate synchronization mechanism, no fixed order between parent and child can be inferred; usleep does not guarantee exact alternation either."
  },
  "ipc-001": {
    "prompt": "Which statement about interprocess communication (IPC) is NOT correct?",
    "options": [
      "IPC can only be used between processes on the same machine.",
      "A single-program OS may not need local IPC.",
      "IPC mechanisms may differ between operating systems.",
      "Linux IPC examples include message queues, semaphores, and shared memory."
    ],
    "explanation": "IPC may occur on one machine or across a network, for example through sockets and RPC. It is therefore incorrect to restrict IPC to the same system."
  },
  "ipc-002": {
    "prompt": "Among the functions covered by the quiz, which is NOT a main purpose of IPC?",
    "options": [
      "Coordinating critical-section access through suitable synchronization.",
      "Transferring data between processes.",
      "Managing and allocating memory for the entire system.",
      "Synchronizing processes."
    ],
    "explanation": "IPC supports data exchange and coordination between processes. System memory management is a separate responsibility; shared memory is an IPC mechanism, but that does not make IPC the memory manager."
  },
  "ipc-003": {
    "prompt": "What characterizes a cooperating process?",
    "options": [
      "It never shares information.",
      "It only ever runs after every other process has terminated.",
      "It cannot be affected by another process.",
      "It can affect or be affected by other processes."
    ],
    "explanation": "Cooperating processes can influence one another, including through data. Reasons for cooperation include information sharing, speedup, modularity, and convenience."
  },
  "ipc-004": {
    "prompt": "What are the two basic IPC models in the lecture?",
    "options": [
      "Stack and heap.",
      "Shared memory and message passing.",
      "Compiler and linker.",
      "CPU-bound and I/O-bound."
    ],
    "explanation": "Shared memory establishes a memory region that processes share. Message passing exchanges data through message-send and message-receive operations."
  },
  "ipc-005": {
    "prompt": "In shared-memory IPC, what important issue must the processes handle?",
    "options": [
      "Every read must be sent through a remote server.",
      "Concurrent access does not need to be considered.",
      "Synchronizing access to the shared memory region.",
      "Ensuring that every process has the same PID."
    ],
    "explanation": "After establishing the region, processes access shared memory directly. They need synchronization to avoid conflicting reads and writes; the OS does not automatically understand all application data rules."
  },
  "ipc-006": {
    "prompt": "In the bounded-buffer producer–consumer problem, when must the producer wait?",
    "options": [
      "When the buffer is full.",
      "When the buffer is empty.",
      "Whenever a consumer is created.",
      "It never has to wait under any circumstances."
    ],
    "explanation": "The producer needs an empty slot in which to place an item. The consumer is the one that must wait when the buffer is empty because there is no data to take."
  },
  "ipc-007": {
    "prompt": "In the unbounded-buffer model presented in the lecture, what happens when no data is available?",
    "options": [
      "The producer must wait because the buffer is full.",
      "The consumer may read data that does not exist yet.",
      "Both processes must terminate.",
      "The consumer must wait; the producer does not wait for the buffer to have space."
    ],
    "explanation": "The unbounded-buffer model abstracts away practical capacity limits. It does not remove the requirement for data to exist before the consumer can consume it."
  },
  "ipc-008": {
    "prompt": "In the circular buffer using in and out in the slides, what is the empty-buffer condition?",
    "options": [
      "(in + 1) % BUFFER_SIZE == out.",
      "in == out.",
      "in == BUFFER_SIZE at all times.",
      "out == BUFFER_SIZE + 1."
    ],
    "explanation": "in identifies the next write position and out identifies the next read position. Equality means empty; this implementation leaves one slot unused to distinguish empty from full."
  },
  "ipc-009": {
    "prompt": "In the circular-buffer implementation that leaves one slot unused, which condition means the buffer is full?",
    "options": [
      "in == out.",
      "in == 0 and out == 0.",
      "(in + 1) % BUFFER_SIZE == out.",
      "out == -1."
    ],
    "explanation": "If the next write position would reach out, the producer must wait. With a buffer of size N, this encoding of full and empty holds at most N − 1 items."
  },
  "ipc-010": {
    "prompt": "Why can counter++ and counter-- cause a race condition when executed concurrently?",
    "options": [
      "They may involve multiple read, modify, and write steps that interleave and lose updates.",
      "Every increment and decrement is always an atomic operation.",
      "The counter variable is never stored in memory.",
      "Race conditions can only occur over a network."
    ],
    "explanation": "Two processes may read the same old value and then overwrite one another with their own results. Interleaving can produce a different result from sequential execution, so suitable synchronization is needed."
  },
  "ipc-011": {
    "prompt": "What are the two basic IPC operations in the message-passing model?",
    "options": [
      "malloc and free.",
      "fork and exec.",
      "open and close in every case.",
      "send(message) and receive(message)."
    ],
    "explanation": "Message passing provides send and receive operations without requiring the application to use shared variables to exchange data. Message size may be fixed or variable."
  },
  "ipc-012": {
    "prompt": "In direct communication as modeled in the slides, what does the sending process specify?",
    "options": [
      "Only an arbitrary location in every process heap.",
      "The explicit name or identifier of the receiving process.",
      "The names of all idle CPUs.",
      "No recipient at all."
    ],
    "explanation": "For example, send(P, message) sends directly to P. Indirect communication uses a mailbox, so the sender specifies a mailbox rather than directly identifying the receiving process."
  },
  "ipc-013": {
    "prompt": "Through what component do processes communicate indirectly?",
    "options": [
      "Each other’s program counters.",
      "Only a local variable on the sender’s stack.",
      "A shared mailbox (or port).",
      "A physical-core counter."
    ],
    "explanation": "Messages are sent to and received from an identified mailbox. One mailbox may be associated with several processes, and a pair of processes may use multiple links."
  },
  "ipc-014": {
    "prompt": "How does a blocking receive behave?",
    "options": [
      "The receiving process is blocked until a message is available.",
      "It always returns immediately even when no message is available.",
      "It must terminate the sending process.",
      "It never receives data."
    ],
    "explanation": "Blocking is synchronous: the receiver waits for a message. A non-blocking receive may return a valid message or an indication that no message is available."
  },
  "ipc-015": {
    "prompt": "What does a non-blocking send mean in the lecture model?",
    "options": [
      "The sender must wait for the receiver to finish its entire program.",
      "The receiver must always run before the sender.",
      "The message is never sent.",
      "The sender sends the message and then continues executing."
    ],
    "explanation": "Non-blocking is considered asynchronous. It differs from a blocking send, which blocks the sender until the message is received in the model shown in the slides."
  },
  "ipc-016": {
    "prompt": "When both send and receive are blocking, what is their combined mechanism called?",
    "options": [
      "Cascading termination.",
      "Rendezvous.",
      "Garbage collection.",
      "Context-free execution."
    ],
    "explanation": "A rendezvous is a synchronous meeting between sender and receiver. Both sides must coordinate to complete the message exchange."
  },
  "ipc-017": {
    "prompt": "Which statement is correct for a zero-capacity message-passing link?",
    "options": [
      "It can store an unlimited number of unreceived messages.",
      "A receiver does not need to exist.",
      "There is no waiting buffer; the sender must rendezvous with the receiver.",
      "Only the consumer can send data."
    ],
    "explanation": "Zero capacity stores no waiting messages, so a rendezvous is required. Bounded capacity blocks the sender when full, whereas unbounded capacity does not make the sender wait for buffer space."
  },
  "ipc-018": {
    "prompt": "According to the ordinary-pipe model in the lecture, which statement is correct?",
    "options": [
      "Data flows in one direction from the write end to the read end, typically between parent and child.",
      "It always allows access by any process on another machine.",
      "It has no separate read and write ends.",
      "It must be a mailbox with a public IP address."
    ],
    "explanation": "The ordinary pipe shown in the slides is unidirectional and used within a parent–child relationship. A named pipe extends accessibility without requiring that relationship."
  },
  "ipc-019": {
    "prompt": "According to the lecture, what advantage does a named pipe have over an ordinary pipe?",
    "options": [
      "It never needs synchronization or waiting.",
      "Only the process that created it may use it.",
      "It must be used with exactly one child process.",
      "It allows processes to communicate without a parent–child relationship."
    ],
    "explanation": "A named pipe has a name through which processes can find and use it. The communicating processes need not have a parent–child relationship; specific properties also depend on the OS."
  },
  "ipc-020": {
    "prompt": "What does the socket 161.25.19.8:1625 represent?",
    "options": [
      "A process with PID 161 and 25 threads.",
      "A communication endpoint with IP address 161.25.19.8 and port 1625.",
      "A heap region of 1625 bytes.",
      "A CPU with 1625 cores."
    ],
    "explanation": "A socket is described by an IP address and a port. Ports distinguish services on the same machine, and communication takes place between a pair of endpoints."
  },
  "ipc-021": {
    "prompt": "In RPC, what is the main responsibility of the client stub?",
    "options": [
      "To turn a remote call into a CPU addition without a network.",
      "Only to allocate hardware registers.",
      "To locate the server and marshal parameters for transmission.",
      "To run the entire server inside the client."
    ],
    "explanation": "The client stub represents the server procedure and marshals its parameters. The server stub receives the message, unmarshals it, and invokes the actual procedure."
  },
  "threads-001": {
    "prompt": "Which components do threads in the same process typically share?",
    "options": [
      "The process code, data, and files.",
      "All threads must share exactly one stack.",
      "Each thread must have a completely separate address space, as processes do.",
      "Only the PIDs of all other processes."
    ],
    "explanation": "The figure on page 7 shows threads sharing code, data, and files. Each thread still has its own stack, registers, and program counter to maintain its execution flow."
  },
  "threads-002": {
    "prompt": "Which components must be private to each thread in the same process?",
    "options": [
      "All program source code.",
      "All open files.",
      "The entire shared data region.",
      "The stack, registers, and program counter."
    ],
    "explanation": "Each thread has its own execution state, including its PC, registers, and stack. Code, data, and process resources are shared among the threads."
  },
  "threads-003": {
    "prompt": "A text editor still responds to user input while another thread prints a document. Which benefit does this illustrate?",
    "options": [
      "Automatically increasing the number of CPU cores.",
      "Responsiveness.",
      "No memory is needed.",
      "Every thread has a separate address space."
    ],
    "explanation": "Multithreading can keep the interface processing input while another task is blocked. This is responsiveness, distinct from scalability across multiple cores."
  },
  "threads-004": {
    "prompt": "Which statement about concurrency and parallelism is correct?",
    "options": [
      "The two concepts always mean exactly the same thing.",
      "One core always executes instructions from multiple threads in parallel at the same instant.",
      "Concurrency lets multiple tasks make progress; parallelism actually executes multiple tasks at the same time.",
      "Concurrency exists only when there are at least four cores."
    ],
    "explanation": "A single core can provide concurrency by interleaving execution. Parallelism requires execution resources that let work run at the same time, such as multiple cores."
  },
  "threads-005": {
    "prompt": "Which case is an example of data parallelism?",
    "options": [
      "Partitioning a dataset and applying the same operation to its parts on multiple cores.",
      "One thread reads files, one handles the GUI, and one sends network data.",
      "Running exactly one sequential task.",
      "Creating several files without dividing the work."
    ],
    "explanation": "Data parallelism partitions data and performs the same operation on the partitions. Running different tasks in different threads fits task parallelism."
  },
  "threads-006": {
    "prompt": "Which case illustrates task parallelism?",
    "options": [
      "All cores calculate squares on partitions of the same array.",
      "Only one thread reads data and then stops.",
      "Copying a program into several folders.",
      "Threads on different cores perform different jobs, such as compressing data, processing images, and updating the interface."
    ],
    "explanation": "Task parallelism distributes different operations or tasks among threads or cores. It differs from applying the same operation to different data partitions."
  },
  "threads-007": {
    "prompt": "In Amdahl’s formula 1 / (S + (1 − S)/N), what does S represent?",
    "options": [
      "The number of threads waiting for I/O.",
      "The fraction of work that must execute sequentially.",
      "The total number of physical cores.",
      "CPU speed in GHz."
    ],
    "explanation": "S is the serial fraction, 1 − S is the parallelizable fraction, and N is the number of cores. The serial fraction limits speedup even when more cores are added."
  },
  "threads-008": {
    "prompt": "For S > 0, as the number of cores N tends to infinity, what value does the Amdahl speedup limit approach?",
    "options": [
      "0.",
      "N regardless of S.",
      "1/S.",
      "S/N."
    ],
    "explanation": "As N → ∞, the term (1 − S)/N approaches 0, so the maximum speedup approaches 1/S. A limit remains whenever the program has a serial portion."
  },
  "threads-009": {
    "prompt": "Where are user threads primarily managed?",
    "options": [
      "By a user-level thread library.",
      "Only by the disk controller.",
      "Only by display firmware.",
      "By the bootloader before the OS runs."
    ],
    "explanation": "The slides distinguish user threads managed by user-level libraries from kernel threads supported by the kernel. Multithreading models describe how the two levels are mapped."
  },
  "threads-010": {
    "prompt": "Which statement is correct for the many-to-one model?",
    "options": [
      "Every user thread must have its own kernel thread.",
      "A process can use all cores to run its threads in parallel.",
      "No thread can ever block.",
      "Many user threads map to one kernel thread, so this model cannot run them in parallel across multiple cores."
    ],
    "explanation": "With only one kernel thread as the execution entity, many-to-one restricts multicore parallelism. A blocking kernel call may block the entire process in the model shown in the slides."
  },
  "threads-011": {
    "prompt": "What characterizes the one-to-one model?",
    "options": [
      "Every process shares exactly one user thread.",
      "Each user thread maps to one kernel thread.",
      "Many user threads must map to exactly one kernel thread.",
      "Creating additional threads has no cost."
    ],
    "explanation": "One-to-one creates one kernel thread for each user thread and provides better concurrency than many-to-one. Resource overhead may cause the system to limit the number of threads."
  },
  "threads-012": {
    "prompt": "What does the many-to-many model allow?",
    "options": [
      "Only one thread exists in the entire system.",
      "There must always be more kernel threads than user threads.",
      "Many user threads map onto an appropriate set of multiple kernel threads.",
      "Execution requires no OS involvement."
    ],
    "explanation": "Many-to-many multiplexes multiple user threads over multiple kernel threads. The OS can create an appropriate number of kernel threads instead of requiring one for every user thread."
  },
  "threads-013": {
    "prompt": "What capability does the two-level model add to basic many-to-many?",
    "options": [
      "Binding a particular user thread to a kernel thread.",
      "Prohibiting all kernel threads.",
      "Requiring every process to have only one thread.",
      "Placing every process on the same stack."
    ],
    "explanation": "Two-level is similar to many-to-many but permits a user thread to be bound to a particular kernel thread. It does not eliminate many-to-many mapping for other threads."
  },
  "threads-014": {
    "prompt": "Which statement about POSIX Pthreads is correct?",
    "options": [
      "It is a separate OS that replaces Linux.",
      "It is the name of a type of multicore CPU.",
      "There is exactly one implementation.",
      "It is a standard API specification for thread creation and synchronization; implementation depends on the library."
    ],
    "explanation": "Pthreads is an API standard, not a single implementation. An implementation may operate at user level or have kernel-level support."
  },
  "threads-015": {
    "prompt": "According to the lecture, what is the standard way to define a task for a Java thread?",
    "options": [
      "Rewrite the OS kernel.",
      "Implement the Runnable interface and its run() method.",
      "Replace RAM with an executable file.",
      "Always create a new process with fork()."
    ],
    "explanation": "The lecture presents both extending Thread and implementing Runnable, and recommends Runnable. Java threads are managed by the JVM and typically use the OS threading mechanism."
  },
  "threads-016": {
    "prompt": "In implicit threading, who handles thread creation and management?",
    "options": [
      "Only end users, by opening more windows.",
      "Storage devices without any software.",
      "Compilers and runtime libraries.",
      "No component; threads appear by themselves."
    ],
    "explanation": "Implicit threading delegates thread creation and management to compilers and runtimes instead of requiring the programmer to control each thread explicitly. The slides give examples such as thread pools, fork–join, and OpenMP."
  }
};

