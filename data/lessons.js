// Main-theory revision notes grounded in the five current-semester lecture PDFs.
// Page numbers refer to the one-based PDF page, including the cover pages.
const b = (vi, en) => ({ vi, en });

export const LESSONS = [
  {
    id: 'intro',
    number: '01',
    title: b('Giới thiệu hệ điều hành', 'Introduction to operating systems'),
    intro: b('Nắm vai trò của HĐH, phân biệt các loại hệ thống và hiểu cách ứng dụng yêu cầu dịch vụ từ nhân.', 'Understand the OS role, distinguish system types, and trace how applications request kernel services.'),
    sections: [
      {
        title: b('HĐH là gì? Nhân khác ứng dụng ở đâu?', 'What is an OS? Kernel versus applications'),
        points: [
          b('HĐH là lớp trung gian giữa người dùng/ứng dụng và phần cứng: quản lý tài nguyên, tạo môi trường chạy chương trình và giúp sử dụng máy thuận tiện, hiệu quả.', 'An OS mediates between users/applications and hardware: it manages resources, supports program execution, and makes the machine convenient and efficient to use.'),
          b('Nhân (kernel) là phần cốt lõi luôn hiện diện khi hệ thống hoạt động. Chương trình hệ thống hỗ trợ HĐH nhưng không nhất thiết thuộc nhân; ứng dụng phục vụ nhu cầu người dùng.', 'The kernel is the core present throughout system operation. System programs support the OS without necessarily belonging to the kernel; applications serve user needs.'),
          b('Phần cứng chạy mã máy. HĐH phân phối và bảo vệ tài nguyên: CPU, RAM, lưu trữ, thiết bị I/O.', 'Hardware executes machine code. The OS allocates and protects resources: CPU, RAM, storage, and I/O devices.'),
        ],
        sourcePages: [8, 9, 10, 13, 17, 19, 20, 21, 35],
      },
      {
        title: b('Đa chương trình, đa nhiệm, đa xử lý', 'Multiprogramming, multitasking, multiprocessing'),
        points: [
          b('Đa chương trình giữ nhiều chương trình trong bộ nhớ; khi một tiến trình chờ I/O, CPU có thể chạy tiến trình khác để giảm thời gian nhàn rỗi.', 'Multiprogramming keeps several programs in memory; when one waits for I/O, the CPU can run another to reduce idle time.'),
          b('Đa nhiệm/chia sẻ thời gian chuyển CPU thường xuyên giữa các công việc, thường dùng lượng tử thời gian. Cưỡng chế: HĐH có thể thu hồi CPU; hợp tác: tiến trình tự nhường.', 'Multitasking/time sharing switches the CPU frequently between tasks, commonly using time quanta. With preemption, the OS may take back the CPU; cooperative tasks yield voluntarily.'),
          b('Đa xử lý dùng nhiều CPU hoặc lõi để có thể chạy thật sự song song. Đa người dùng cho nhiều người sử dụng chung hệ thống, thường dựa trên chia sẻ thời gian.', 'Multiprocessing uses multiple CPUs or cores to support actual parallel execution. Multiuser systems let several users share a system, commonly through time sharing.'),
        ],
        sourcePages: [37, 38, 39, 40, 41, 42, 43, 44],
      },
      {
        title: b('Nhận diện các loại HĐH khác', 'Recognizing other OS categories'),
        points: [
          b('Theo lô (batch): gom và chạy công việc, ít tương tác trực tiếp. Phân tán: phối hợp nhiều máy độc lập để chia sẻ tài nguyên và cung cấp cái nhìn như một hệ thống.', 'Batch systems collect and run jobs with little direct interaction. Distributed systems coordinate independent machines to share resources and present a unified system.'),
          b('Thời gian thực ưu tiên đáp ứng đúng hạn: hard real-time không chấp nhận trễ hạn yêu cầu; soft real-time cho phép yêu cầu thời gian mềm hơn. Nhanh trung bình chưa đủ để là hard real-time.', 'Real-time systems prioritize deadlines: hard real-time requirements cannot tolerate deadline misses, while soft real-time requirements are less strict. Good average speed alone does not establish hard real-time behavior.'),
          b('HĐH nhúng nằm trong thiết bị chuyên biệt; HĐH mục đích đặc biệt phục vụ ứng dụng cụ thể. Một HĐH có thể thuộc nhiều loại.', 'An embedded OS runs inside a specialized device; a special-purpose OS serves a particular application. An OS may belong to multiple categories.'),
        ],
        sourcePages: [39, 45, 46, 47, 48, 49, 50, 51, 52],
      },
      {
        title: b('Các tài nguyên và nhiệm vụ chính', 'Main resources and responsibilities'),
        points: [
          b('Quản lý tiến trình gồm tạo/chạy công việc, lập lịch CPU, giao tiếp và phối hợp. Quản lý bộ nhớ theo dõi ai dùng vùng nào, cấp phát/thu hồi và quyết định dữ liệu nào ở trong bộ nhớ.', 'Process management includes creating/running tasks, CPU scheduling, communication, and coordination. Memory management tracks ownership, allocates/frees space, and decides what resides in memory.'),
          b('Quản lý lưu trữ và tập tin cung cấp cách đặt tên, lưu, tìm, đọc/ghi và bảo vệ dữ liệu; HĐH cũng quản lý thiết bị I/O và mạng.', 'Storage and file management provide naming, storage, lookup, reading/writing, and protection of data; the OS also manages I/O devices and networking.'),
          b('Cache giữ bản sao dữ liệu ở tầng nhanh hơn và được kiểm tra trước; thiếu dữ liệu thì lấy từ tầng chậm. RAM và CPU cache là bộ nhớ khả biến, mất nội dung khi mất điện.', 'A cache keeps copies in a faster level and is checked first; a miss requires fetching from a slower level. RAM and CPU caches are volatile and lose their contents without power.'),
          b('Protection kiểm soát quyền truy cập tài nguyên; security chống các đe dọa trong/ngoài hệ thống. Ảo hóa cho nhiều HĐH độc lập dùng chung phần cứng và tăng cách ly.', 'Protection controls access rights to resources; security counters internal/external threats. Virtualization lets independent OS instances share hardware while improving isolation.'),
        ],
        sourcePages: [35, 55, 60, 61, 62, 64, 66, 67, 68, 69, 129],
      },
      {
        title: b('So sánh cấu trúc nhân HĐH', 'Comparing kernel structures'),
        points: [
          b('Nguyên khối (monolithic): nhiều chức năng cùng ở trong nhân, giao tiếp nhanh nhưng phụ thuộc chặt; thay đổi một phần có thể ảnh hưởng rộng.', 'Monolithic kernels place many functions in the kernel, enabling fast communication but tight coupling; changing one component can affect others widely.'),
          b('Phân lớp: mỗi lớp dựa vào lớp thấp hơn, dễ tổ chức/gỡ lỗi nhưng khó chia lớp phù hợp và có thêm chi phí đi qua nhiều lớp.', 'Layered systems build each layer on lower layers, improving organization/debugging but making layer boundaries difficult and adding traversal overhead.'),
          b('Vi nhân (microkernel) chuyển nhiều dịch vụ sang user space, giao tiếp bằng thông điệp: dễ mở rộng, cách ly tốt hơn nhưng tăng chi phí giao tiếp user–kernel.', 'Microkernels move many services into user space and communicate through messages: they improve extensibility/isolation but add user–kernel communication overhead.'),
          b('Mô-đun nạp được khi cần, qua giao diện rõ ràng. Hệ thống lai phối hợp nhiều cách: theo bài giảng, Linux là nguyên khối kết hợp mô-đun, macOS phối hợp Mach và BSD.', 'Modules load as needed through defined interfaces. Hybrid systems combine approaches: the lecture describes Linux as monolithic with modules and macOS as combining Mach and BSD.'),
        ],
        sourcePages: [75, 76, 77, 78, 79, 80, 82, 83, 85],
      },
      {
        title: b('Dịch vụ, giao diện và lời gọi hệ thống', 'Services, interfaces, and system calls'),
        points: [
          b('Dịch vụ HĐH gồm giao diện người dùng, chạy chương trình, I/O, tập tin, truyền thông, phát hiện lỗi, phân bổ tài nguyên, ghi nhật ký và bảo vệ.', 'OS services include user interfaces, program execution, I/O, files, communication, error detection, resource allocation, logging, and protection.'),
          b('Shell/CLI nhận và thực hiện lệnh; GUI và cảm ứng cung cấp cách tương tác khác. Chúng là giao diện sử dụng, không đồng nhất với nhân.', 'A shell/CLI accepts and executes commands; GUI and touch interfaces offer other interaction styles. These user interfaces are not identical to the kernel.'),
          b('System call là lối vào dịch vụ nhân. Ứng dụng thường gọi API/thư viện; giao diện system call dùng số hiệu để chuyển tới hàm nhân và trả kết quả. Ví dụ printf() có thể dẫn tới write().', 'A system call enters a kernel service. Applications normally use APIs/libraries; the system-call interface dispatches by call number and returns results. For example, printf() may lead to write().'),
          b('User mode hạn chế đặc quyền, kernel mode cho phép thao tác hệ thống; tách hai chế độ giúp ngăn ứng dụng gây hại hệ thống. Các nhóm system call: tiến trình, tập tin, thiết bị, thông tin, truyền thông, bảo vệ.', 'User mode restricts privileges, while kernel mode permits system operations; separating them helps protect the system from applications. System-call groups cover processes, files, devices, information, communication, and protection.'),
        ],
        sourcePages: [95, 96, 97, 100, 103, 105, 107, 110, 111, 112, 113, 114, 115, 116, 117, 128],
      },
      {
        title: b('Từ mã nguồn đến chương trình đang chạy', 'From source code to a running program'),
        points: [
          b('Trình biên dịch tạo tệp đối tượng; linker kết hợp các tệp đối tượng/thư viện thành tệp thực thi; loader nạp chương trình vào bộ nhớ để chạy.', 'A compiler produces object files; the linker combines objects/libraries into an executable; the loader brings the program into memory for execution.'),
          b('Liên kết động tránh nhúng toàn bộ thư viện vào từng tệp thực thi. Chương trình trên đĩa chưa phải tiến trình đang chạy.', 'Dynamic linking avoids embedding all library code into each executable. A program on disk is not yet a running process.'),
          b('Ứng dụng phụ thuộc system call, định dạng thực thi và ABI của nền tảng. Chạy đa nền tảng có thể cần trình thông dịch, máy ảo hoặc biên dịch riêng cho từng HĐH.', 'Applications depend on platform system calls, executable formats, and ABI. Cross-platform execution may require an interpreter, a virtual machine, or a separate build for each OS.'),
        ],
        sourcePages: [120, 121, 122, 123, 125, 126, 127],
      },
    ],
    pitfalls: [
      b('Đa nhiệm trên một lõi có thể chỉ là xen kẽ; không suy ra nhiều lệnh chạy song song.', 'Multitasking on one core can be interleaving; it does not imply simultaneous execution.'),
      b('API, system call, shell và kernel là các khái niệm khác nhau; một lời gọi thư viện không nhất thiết tương ứng đúng một system call.', 'An API, a system call, a shell, and the kernel are different concepts; a library call need not map to exactly one system call.'),
      b('Ví dụ HĐH/kiến trúc theo slide; số liệu thị phần cũ không được coi là thông tin hiện tại.', 'OS/architecture examples follow the slides; old market-share figures are not current facts.'),
    ],
    formulas: [],
    source: { file: 'OS/Current Progress/Lecture-01-Introduction.pdf', label: 'Lecture-01', pages: 132 },
  },
  {
    id: 'process',
    number: '02',
    title: b('Tiến trình', 'Processes'),
    intro: b('Từ chương trình thụ động đến tiến trình đang chạy: trạng thái, PCB, hàng đợi, chuyển ngữ cảnh và vòng đời cha–con.', 'From a passive program to an active process: states, PCB, queues, context switching, and the parent–child lifecycle.'),
    sections: [
      {
        title: b('Chương trình, tiến trình và ứng dụng', 'Programs, processes, and applications'),
        points: [
          b('Program là mã thực thi thụ động lưu trên đĩa; process là chương trình đang được thực thi. Nạp và chạy một chương trình tạo ra hoạt động có trạng thái.', 'A program is passive executable code stored on disk; a process is a program in execution. Loading and running a program creates active, stateful execution.'),
          b('Một chương trình có thể có nhiều tiến trình chạy độc lập; một ứng dụng có thể gồm nhiều chương trình và tiến trình. Không suy ra quan hệ một–một.', 'One program can have several independent process instances; an application can contain several programs and processes. The relationship is not necessarily one-to-one.'),
          b('Tiến trình hệ thống chạy dịch vụ thiết yếu; tiến trình người dùng thường chạy ứng dụng. Trong một tiến trình đơn luồng, dòng lệnh thực thi tuần tự.', 'System processes run essential services; user processes commonly run applications. A single-threaded process has one sequential execution stream.'),
        ],
        sourcePages: [6, 7, 9, 34, 44],
      },
      {
        title: b('Bố cục và ngữ cảnh của tiến trình', 'Process layout and execution context'),
        points: [
          b('Text chứa mã; data chứa biến toàn cục; heap chứa vùng nhớ cấp phát động; stack chứa tham số hàm, địa chỉ trả về và biến cục bộ.', 'Text stores code; data stores global variables; the heap holds dynamic allocations; the stack contains function parameters, return addresses, and local variables.'),
          b('Program Counter (PC) chỉ vị trí lệnh tiếp theo; các thanh ghi chứa trạng thái xử lý hiện tại. Cùng mã chương trình nhưng mỗi tiến trình có trạng thái thực thi riêng.', 'The Program Counter (PC) identifies the next instruction; registers hold current execution state. Processes may run the same code while maintaining distinct execution states.'),
          b('PCB lưu trạng thái, PC/thanh ghi, thông tin lập lịch, quản lý bộ nhớ, thống kê và I/O. Nhân dùng PCB để quản lý và khôi phục tiến trình.', 'The PCB records state, PC/registers, scheduling data, memory-management data, accounting, and I/O information. The kernel uses it to manage and restore a process.'),
        ],
        sourcePages: [6, 8, 12, 15, 16],
      },
      {
        title: b('Năm trạng thái và các bước chuyển', 'Five states and their transitions'),
        points: [
          b('New: đang được tạo. Ready: đã có thể chạy, chỉ thiếu CPU. Running: đang thực thi trên CPU. Waiting: chờ sự kiện/I/O. Terminated: đã kết thúc.', 'New: being created. Ready: runnable and waiting only for CPU time. Running: executing on the CPU. Waiting: awaiting an event/I/O. Terminated: execution has ended.'),
          b('New → Ready khi được nhận vào; Ready → Running khi được điều phối; Running → Waiting khi yêu cầu I/O/chờ sự kiện; Waiting → Ready khi sự kiện hoàn thành.', 'New → Ready on admission; Ready → Running on dispatch; Running → Waiting on an I/O request/event wait; Waiting → Ready when the event completes.'),
          b('Running → Ready khi bị ngắt/cưỡng chế; Running → Terminated khi kết thúc. Hoàn thành I/O không tự động đưa tiến trình thẳng lên CPU.', 'Running → Ready on interruption/preemption; Running → Terminated on exit. Completing I/O does not automatically place a process directly on the CPU.'),
        ],
        sourcePages: [13, 14],
      },
      {
        title: b('CPU burst, I/O burst và hàng đợi', 'CPU bursts, I/O bursts, and queues'),
        points: [
          b('Tiến trình xen kẽ các khoảng dùng CPU và chờ I/O. CPU-bound dành nhiều thời gian tính toán; I/O-bound dành nhiều thời gian cho I/O, ảnh hưởng lựa chọn lập lịch.', 'A process alternates CPU execution and I/O waits. CPU-bound work spends more time computing; I/O-bound work spends more time on I/O, affecting scheduling decisions.'),
          b('Ready queue chứa tiến trình trong bộ nhớ, sẵn sàng chờ CPU; wait queues chứa tiến trình đang chờ sự kiện, chẳng hạn thiết bị I/O.', 'The ready queue contains memory-resident processes ready for CPU time; wait queues contain processes awaiting events such as I/O completion.'),
          b('Bộ lập lịch chọn công việc sẵn sàng tiếp theo. Tiến trình có thể chuyển giữa CPU và nhiều hàng đợi chờ trong suốt vòng đời; chờ I/O không tính là chờ trong ready queue.', 'The scheduler selects the next ready task. A process may move between CPU execution and several wait queues throughout its lifetime; I/O waiting is not ready-queue waiting.'),
        ],
        sourcePages: [17, 18, 20, 21, 22],
      },
      {
        title: b('Chuyển ngữ cảnh', 'Context switching'),
        points: [
          b('Khi đổi tiến trình chạy, hệ thống lưu ngữ cảnh tiến trình cũ và nạp ngữ cảnh tiến trình mới từ thông tin PCB để tiếp tục đúng vị trí.', 'When switching processes, the system saves the old process context and restores the new one from PCB information so execution resumes correctly.'),
          b('Thời gian chuyển ngữ cảnh là overhead: CPU không thực hiện công việc hữu ích của tiến trình trong khoảng đó. Chi phí phụ thuộc phần cứng và thông tin phải lưu/nạp.', 'Context-switch time is overhead: no useful process work is performed during that interval. Its cost depends on hardware and the state that must be saved/restored.'),
          b('Chuyển ngữ cảnh không đồng nghĩa tạo tiến trình mới. Bộ lập lịch quyết định ai chạy; việc khôi phục trạng thái giúp tiến trình cũ có thể chạy tiếp sau này.', 'A context switch does not create a new process. Scheduling decides who runs; state restoration lets an existing process continue later.'),
        ],
        sourcePages: [20, 23, 24],
      },
      {
        title: b('Tạo tiến trình: fork, exec, wait', 'Creating processes: fork, exec, wait'),
        points: [
          b('Tiến trình cha tạo tiến trình con, hình thành cây tiến trình; mỗi tiến trình có PID. Cha/con có thể chạy đồng thời hoặc cha chờ con; mức chia sẻ tài nguyên tùy hệ thống.', 'A parent creates child processes, forming a process tree; each process has a PID. Parent/child execution may overlap or the parent may wait; resource-sharing policies vary.'),
          b('fork() tạo một tiến trình con với không gian địa chỉ sao từ cha. Sau fork thành công, cả cha và con tiếp tục sau lời gọi; giá trị trả về giúp phân biệt hai nhánh.', 'fork() creates a child with an address space copied from the parent. After a successful fork, both continue after the call; the return value distinguishes the two branches.'),
          b('exec() thay chương trình trong tiến trình hiện có; không tự tạo thêm một tiến trình. wait() cho phép cha chờ và thu thông tin kết thúc của con.', 'exec() replaces the program in an existing process; it does not by itself create another process. wait() lets a parent wait for and collect a child’s termination information.'),
          b('Đọc bài fork theo từng nhánh thực thi; chỉ đếm những lời gọi fork thực sự được nhánh đó đi qua. Không mặc định thứ tự in của cha và con nếu không có đồng bộ.', 'Trace fork exercises separately along each execution branch; count only fork calls that branch actually reaches. Do not assume parent/child output order without synchronization.'),
        ],
        sourcePages: [27, 28, 30, 31, 35, 36, 37, 38, 39, 40, 41, 42, 43],
      },
      {
        title: b('Kết thúc, zombie và orphan', 'Termination, zombies, and orphans'),
        points: [
          b('exit() kết thúc tiến trình; HĐH thu hồi tài nguyên và cho cha lấy trạng thái kết thúc qua wait(). Cha cũng có thể yêu cầu kết thúc con theo chính sách hệ thống.', 'exit() terminates a process; the OS reclaims resources and makes exit status available to the parent through wait(). A parent may also request a child’s termination under system policy.'),
          b('Zombie: con đã kết thúc nhưng cha chưa thu trạng thái kết thúc. Orphan: cha đã kết thúc trong khi con còn tồn tại; hai khái niệm nói về hai điều kiện khác nhau.', 'A zombie is a terminated child whose parent has not collected its exit status. An orphan has lost its parent while still existing; these describe different conditions.'),
          b('Một số hệ thống dùng kết thúc dây chuyền: cha kết thúc kéo theo các con/cháu. Đây là chính sách của một số HĐH, không phải quy tắc chung cho mọi fork.', 'Some systems use cascading termination: ending a parent also ends its descendants. This is a policy in some OSes, not a universal rule for every fork.'),
        ],
        sourcePages: [32, 33],
      },
    ],
    pitfalls: [
      b('Ready là chờ CPU; Waiting là chờ sự kiện. Đừng dùng hai trạng thái thay thế cho nhau.', 'Ready means waiting for CPU time; Waiting means awaiting an event. Do not interchange the states.'),
      b('fork tạo tiến trình; exec thay chương trình; wait chờ/thu trạng thái. Ba lời gọi có mục đích khác nhau.', 'fork creates a process; exec replaces a program; wait waits/collects status. They serve different purposes.'),
      b('Zombie đã kết thúc; orphan chưa chắc đã kết thúc. Thứ tự chạy cha–con phụ thuộc lập lịch nếu không được ràng buộc.', 'A zombie has terminated; an orphan need not have. Parent–child execution order depends on scheduling unless constrained.'),
    ],
    formulas: [],
    source: { file: 'OS/Current Progress/Lecture-02-Process.pdf', label: 'Lecture-02', pages: 45 },
  },
  {
    id: 'ipc',
    number: '03',
    title: b('Giao tiếp liên tiến trình', 'Interprocess communication'),
    intro: b('So sánh bộ nhớ chia sẻ và truyền thông điệp; đọc đúng bộ đệm, thao tác chặn và tình trạng tranh chấp.', 'Compare shared memory and message passing; reason correctly about buffering, blocking operations, and race conditions.'),
    sections: [
      {
        title: b('Vì sao cần IPC? Hai mô hình chính', 'Why IPC? Two principal models'),
        points: [
          b('Tiến trình hợp tác ảnh hưởng lẫn nhau; cần IPC để chia sẻ thông tin, tăng tốc, chia mô-đun và tạo tiện ích.', 'Cooperating processes affect one another; they use IPC for information sharing, speedup, modularity, and convenience.'),
          b('Bộ nhớ chia sẻ: các tiến trình cùng truy cập một vùng nhớ; sau khi thiết lập, việc trao đổi dữ liệu do mã người dùng thực hiện. Chúng phải phối hợp truy cập để bảo đảm đúng.', 'Shared memory lets processes access a common region; after setup, user code performs data exchange. Processes must coordinate access to preserve correctness.'),
          b('Truyền thông điệp dùng send/receive, không cần các tiến trình truy cập cùng biến. Muốn trao đổi phải có liên kết giao tiếp; mô hình logic và cách cài đặt vật lý là hai khía cạnh khác nhau.', 'Message passing uses send/receive without requiring processes to access shared variables. Communication requires a link; its logical model and physical implementation are separate concerns.'),
        ],
        sourcePages: [6, 7, 10, 20, 21, 22],
      },
      {
        title: b('Producer–consumer và bộ đệm vòng', 'Producer–consumer and circular buffers'),
        points: [
          b('Producer tạo dữ liệu, consumer dùng dữ liệu. Với bộ đệm hữu hạn: producer chờ khi đầy, consumer chờ khi rỗng. Với bộ đệm vô hạn: producer không phải chờ vì đầy.', 'The producer creates data and the consumer uses it. With a bounded buffer, the producer waits when full and the consumer waits when empty. With an unbounded buffer, the producer does not wait for space.'),
          b('Trong cách cài đặt dùng in/out ở slide, in là vị trí ghi kế tiếp, out là vị trí đọc kế tiếp; hai chỉ số cập nhật theo modulo BUFFER_SIZE.', 'In the slide’s in/out implementation, in is the next write index and out is the next read index; both advance modulo BUFFER_SIZE.'),
          b('in == out biểu diễn rỗng; (in + 1) % N == out biểu diễn đầy. Phải để trống một ô để phân biệt hai trạng thái, nên mảng N ô chỉ chứa tối đa N − 1 phần tử trong cách này.', 'in == out means empty; (in + 1) % N == out means full. One slot stays unused to distinguish the states, so an N-slot array holds at most N − 1 items in this design.'),
        ],
        sourcePages: [8, 11, 12, 13],
      },
      {
        title: b('Biến đếm chung và race condition', 'Shared counters and race conditions'),
        points: [
          b('Thêm counter có thể biểu diễn số phần tử để dùng đủ N ô, nhưng counter++ và counter-- không mặc nhiên là thao tác nguyên tử.', 'Adding counter can represent occupancy and permit all N slots to be used, but counter++ and counter-- are not automatically atomic operations.'),
          b('Một phép tăng/giảm có thể tách thành đọc → tính trên thanh ghi → ghi lại. Hai tiến trình xen kẽ các bước có thể ghi đè kết quả của nhau.', 'An increment/decrement can split into read → register calculation → write back. Interleaved steps from two processes can overwrite one another’s updates.'),
          b('Với counter ban đầu 5, một tăng và một giảm đúng ra giữ 5; lịch xen kẽ ở slide cho ra 4, và lịch khác có thể cho 6. Đây là race: kết quả phụ thuộc thứ tự thực thi.', 'Starting from counter = 5, one increment and one decrement should leave 5; the slide’s interleaving produces 4, and another can produce 6. This is a race: the result depends on execution order.'),
          b('Vùng nhớ chung/biến đếm chưa đủ để đồng bộ. Bài này yêu cầu nhận diện và lần theo xen kẽ; cơ chế đồng bộ thuộc bài sau.', 'Shared memory/a counter alone does not synchronize access. This lesson focuses on recognizing and tracing interleavings; synchronization mechanisms follow later.'),
        ],
        sourcePages: [14, 15, 16, 17, 18],
      },
      {
        title: b('Giao tiếp trực tiếp và qua mailbox', 'Direct communication and mailboxes'),
        points: [
          b('Trực tiếp: send(P, message), receive(Q, message) chỉ rõ tiến trình. Theo mô hình đối xứng trong slide, liên kết được tạo tự động, gắn đúng một cặp và có một liên kết cho mỗi cặp.', 'Direct communication names processes using send(P, message) and receive(Q, message). In the slide’s symmetric model, links form automatically, connect exactly one pair, and are unique for that pair.'),
          b('Gián tiếp: gửi/nhận qua mailbox có ID. Chỉ các tiến trình dùng chung mailbox mới liên lạc được; nhiều tiến trình có thể dùng một mailbox và một cặp có thể dùng nhiều mailbox.', 'Indirect communication sends/receives through an identified mailbox. Processes must share a mailbox to communicate; several may share one, and a pair may use several mailboxes.'),
          b('Nếu nhiều tiến trình cùng nhận từ một mailbox, cần quy định ai nhận: giới hạn số tiến trình, chỉ cho một receive tại một thời điểm, hoặc để hệ thống chọn người nhận.', 'When several processes receive from one mailbox, receiver selection needs a rule: restrict participants, allow only one receive at a time, or let the system choose a recipient.'),
        ],
        sourcePages: [23, 24, 25, 26],
      },
      {
        title: b('Blocking, non-blocking và dung lượng đệm', 'Blocking, non-blocking, and buffer capacity'),
        points: [
          b('Theo mô hình slide: blocking send chờ thông điệp được nhận; blocking receive chờ có thông điệp. Non-blocking send tiếp tục ngay; non-blocking receive trả thông điệp hoặc báo chưa có.', 'In the slide model, blocking send waits until the message is received; blocking receive waits for a message. Non-blocking send continues immediately; non-blocking receive returns a message or indicates none is available.'),
          b('Cả send và receive đều blocking tạo điểm gặp rendezvous. Cần phân biệt blocking của thao tác với dung lượng hàng đợi: chúng là hai đặc tính phải đọc trong đề.', 'Blocking send and receive together create a rendezvous. Distinguish an operation’s blocking behavior from queue capacity: both properties must be read from the problem.'),
          b('Zero capacity không lưu được thông điệp nên người gửi phải gặp người nhận. Bounded capacity chứa tối đa n thông điệp, gửi phải chờ khi đầy. Unbounded capacity không chặn người gửi do thiếu chỗ.', 'Zero capacity stores no messages, so sender and receiver must meet. Bounded capacity holds up to n messages and sending waits when full. Unbounded capacity does not block a sender for lack of space.'),
        ],
        sourcePages: [27, 28, 29],
      },
      {
        title: b('Pipe thường và pipe có tên', 'Ordinary and named pipes'),
        points: [
          b('Pipe thường theo mô hình slide là một chiều: producer ghi đầu write, consumer đọc đầu read; thường dùng giữa các tiến trình có quan hệ cha–con.', 'An ordinary pipe in the slide model is unidirectional: a producer writes to the write end and a consumer reads from the read end; it is commonly used between related parent–child processes.'),
          b('Pipe có tên không yêu cầu quan hệ cha–con và có thể được nhiều tiến trình sử dụng. Slide mô tả hai chiều: half-duplex trên Unix/Linux, full-duplex trên Windows.', 'Named pipes do not require a parent–child relationship and can be used by several processes. The slide describes two-way communication: half-duplex on Unix/Linux and full-duplex on Windows.'),
          b('Half-duplex: hai chiều không đồng thời; full-duplex: hai chiều đồng thời. Khả năng qua mạng tùy loại pipe/nền tảng.', 'Half-duplex permits two-way communication one direction at a time; full-duplex permits both simultaneously. Network support depends on pipe type/platform.'),
        ],
        sourcePages: [31, 32, 33, 34, 35],
      },
      {
        title: b('Client–server: socket và RPC', 'Client–server: sockets and RPC'),
        points: [
          b('Socket là đầu mút giao tiếp, nhận diện bằng địa chỉ IP và port; giao tiếp diễn ra giữa một cặp socket. 127.0.0.1 là loopback; các port dưới 1024 thường dành cho dịch vụ chuẩn.', 'A socket is a communication endpoint identified by an IP address and port; communication occurs between a socket pair. 127.0.0.1 is loopback; ports below 1024 are commonly reserved for well-known services.'),
          b('Java có socket hướng kết nối TCP, không kết nối UDP và multicast. Socket là đầu mút; RPC trừu tượng hóa lời gọi thủ tục từ xa.', 'Java provides connection-oriented TCP, connectionless UDP, and multicast sockets. A socket is an endpoint; RPC abstracts remote procedure invocation.'),
          b('RPC: client stub đóng gói tham số (marshal), gửi yêu cầu; server stub giải đóng gói (unmarshal), gọi thủ tục và trả kết quả. Định dạng dữ liệu chung giúp các kiến trúc khác nhau hiểu nhau.', 'In RPC, a client stub marshals parameters and sends a request; the server stub unmarshals them, invokes the procedure, and returns results. A common data representation supports different machine architectures.'),
          b('Gọi từ xa có thể lỗi do mạng; cần chú ý ngữ nghĩa gửi/thực thi như at-most-once và exactly-once mà giao thức bảo đảm. Không mặc định RPC luôn giống hệt lời gọi cục bộ.', 'Remote calls can fail because of networking; inspect delivery/execution semantics such as at-most-once and exactly-once that the protocol guarantees. Do not assume an RPC always behaves exactly like a local call.'),
        ],
        sourcePages: [37, 38, 39, 40, 41, 42, 43, 44],
      },
    ],
    pitfalls: [
      b('N − 1 chỉ đúng cho cách in/out chừa một ô, không bắt buộc với mọi bounded buffer.', 'N − 1 applies to the one-empty-slot in/out design, not every bounded buffer.'),
      b('Một dòng counter++ trong mã nguồn không bảo đảm nguyên tử; hãy tách các bước đọc/tính/ghi khi làm bài xen kẽ.', 'One source-code line counter++ is not necessarily atomic; split it into read/calculate/write steps for interleaving problems.'),
      b('Bộ đệm vô hạn chỉ bỏ việc chờ vì đầy; consumer vẫn có thể chờ khi chưa có dữ liệu.', 'An unbounded buffer removes waiting for space; the consumer can still wait when no data exists.'),
    ],
    formulas: [
      { formula: '(in + 1) % N == out', meaning: b('Điều kiện đầy của bộ đệm vòng chừa một ô; điều kiện rỗng là in == out.', 'Full condition for a circular buffer that leaves one slot empty; the empty condition is in == out.') },
      { formula: 'C = N − 1', meaning: b('Sức chứa sử dụng được của mảng N ô trong cách cài đặt in/out ở slide.', 'Usable capacity of an N-slot array in the slide’s in/out implementation.') },
    ],
    source: { file: 'OS/Current Progress/Lecture-03-InterprocessCommunication.pdf', label: 'Lecture-03', pages: 46 },
  },
  {
    id: 'threads',
    number: '04',
    title: b('Luồng và đa luồng', 'Threads and multithreading'),
    intro: b('Hiểu tài nguyên chung/riêng của luồng, concurrency và parallelism, giới hạn Amdahl và các mô hình ánh xạ luồng.', 'Understand shared/private thread resources, concurrency versus parallelism, Amdahl’s limit, and thread-mapping models.'),
    sections: [
      {
        title: b('Luồng nằm trong tiến trình', 'Threads within a process'),
        points: [
          b('Một tiến trình có thể chứa nhiều luồng thực thi. Các luồng cùng tiến trình chia sẻ mã, dữ liệu và tài nguyên như tập tin đang mở.', 'A process may contain multiple execution threads. Threads in the same process share code, data, and resources such as open files.'),
          b('Mỗi luồng có PC, thanh ghi và stack riêng để theo dõi luồng điều khiển của nó. Chia sẻ không gian địa chỉ không có nghĩa chia sẻ mọi trạng thái thực thi.', 'Each thread has its own PC, registers, and stack to track its control flow. Sharing an address space does not mean sharing every part of execution state.'),
          b('Ứng dụng có thể giao cập nhật UI, tải dữ liệu, kiểm tra chính tả hoặc xử lý yêu cầu mạng cho các luồng khác nhau; server có thể tách luồng xử lý từng yêu cầu.', 'Applications may assign UI updates, data fetching, spell checking, or network requests to different threads; a server may use threads to handle individual requests.'),
        ],
        sourcePages: [6, 7, 8],
      },
      {
        title: b('Bốn lợi ích chính của đa luồng', 'Four principal benefits of multithreading'),
        points: [
          b('Responsiveness: ứng dụng vẫn có thể phản hồi khi một phần công việc bị chặn. Resource sharing: các luồng dùng chung tài nguyên tiến trình thuận tiện hơn IPC giữa tiến trình độc lập.', 'Responsiveness lets an application keep responding while part of its work blocks. Resource sharing lets threads use process resources more conveniently than IPC between independent processes.'),
          b('Economy: tạo/chuyển luồng thường ít chi phí hơn tạo/chuyển tiến trình. Scalability: nhiều luồng có thể tận dụng nhiều lõi khi mô hình luồng và công việc cho phép.', 'Economy: thread creation/switching usually costs less than process creation/switching. Scalability: multiple threads can exploit multiple cores when the thread model and workload allow it.'),
          b('Lợi ích không tự động xuất hiện: cần chia công việc hợp lý và xử lý phụ thuộc dữ liệu. Dùng chung dữ liệu cũng tạo nhu cầu phối hợp truy cập.', 'Benefits are not automatic: work must be partitioned sensibly and data dependencies handled. Shared data also creates a need to coordinate access.'),
        ],
        sourcePages: [6, 9, 11],
      },
      {
        title: b('Concurrency, parallelism và cách chia việc', 'Concurrency, parallelism, and work partitioning'),
        points: [
          b('Concurrency: nhiều tác vụ cùng có tiến triển, có thể bằng xen kẽ trên một lõi. Parallelism: nhiều tác vụ thực sự thực thi đồng thời, cần tài nguyên xử lý phù hợp.', 'Concurrency means several tasks make progress, potentially through interleaving on one core. Parallelism means tasks actually execute simultaneously and requires suitable processing resources.'),
          b('Data parallelism chia các phần của dữ liệu để cùng phép toán chạy trên nhiều lõi. Task parallelism phân các tác vụ/phép toán khác nhau cho các luồng.', 'Data parallelism partitions data so the same operation runs on multiple cores. Task parallelism assigns different tasks/operations to different threads.'),
          b('Thách thức đa nhân: tìm việc có thể tách, cân bằng tải, chia dữ liệu, xử lý phụ thuộc và kiểm thử/gỡ lỗi các lịch xen kẽ.', 'Multicore challenges include identifying separable work, balancing load, partitioning data, handling dependencies, and testing/debugging interleavings.'),
        ],
        sourcePages: [11, 12, 13, 14],
      },
      {
        title: b('Định luật Amdahl', 'Amdahl’s law'),
        points: [
          b('Gọi S là tỷ lệ công việc bắt buộc tuần tự, 1 − S là phần có thể song song và N là số lõi. Chỉ phần song song được chia cho N trong mô hình lý tưởng.', 'Let S be the serial fraction, 1 − S the parallelizable fraction, and N the number of cores. Only the parallel part is divided by N in the ideal model.'),
          b('Speedup = 1 / (S + (1 − S)/N). Ví dụ 25% tuần tự, 75% song song trên 2 lõi: 1/(0,25 + 0,75/2) = 1,6 lần.', 'Speedup = 1 / (S + (1 − S)/N). With 25% serial work and 75% parallel work on 2 cores: 1/(0.25 + 0.75/2) = 1.6×.'),
          b('Khi số lõi tăng vô hạn và S > 0, tăng tốc bị giới hạn ở 1/S. Tăng số luồng/lõi không loại bỏ phần tuần tự; mô hình cơ bản chưa cộng chi phí phối hợp thực tế.', 'As the core count approaches infinity with S > 0, speedup is limited to 1/S. More threads/cores do not remove serial work; the basic model does not add real coordination overhead.'),
        ],
        sourcePages: [15, 16],
      },
      {
        title: b('Luồng người dùng và ba mô hình ánh xạ', 'User threads and three mapping models'),
        points: [
          b('User threads do thư viện mức người dùng quản lý; kernel threads do nhân hỗ trợ/lập lịch. Cần xét cách ánh xạ giữa hai loại để biết khả năng song song và tác động khi bị chặn.', 'User threads are managed by a user-level library; kernel threads are supported/scheduled by the kernel. Their mapping determines parallelism and the effects of blocking.'),
          b('Many-to-one: nhiều user threads → một kernel thread. Không tận dụng song song nhiều lõi; một lời gọi chặn ở mức nhân có thể chặn toàn bộ các luồng trong mô hình này.', 'Many-to-one maps many user threads to one kernel thread. It cannot exploit multicore parallelism; a blocking kernel call can block all the threads in this model.'),
          b('One-to-one: mỗi user thread → một kernel thread, hỗ trợ đồng thời/song song tốt hơn nhưng tạo nhiều luồng nhân có chi phí. Slide dùng Windows và Linux làm ví dụ.', 'One-to-one maps each user thread to a kernel thread, improving concurrency/parallelism but incurring kernel-thread creation costs. The slides use Windows and Linux as examples.'),
          b('Many-to-many: nhiều user threads → nhiều kernel threads, có thể điều chỉnh số luồng nhân. Two-level tương tự nhưng cho phép gắn một số user threads cố định vào kernel thread.', 'Many-to-many maps many user threads onto multiple kernel threads, allowing an appropriate kernel-thread count. The two-level variant also permits some user threads to be bound to kernel threads.'),
        ],
        sourcePages: [17, 18, 20, 21, 22, 23, 24],
      },
      {
        title: b('Thư viện luồng: Pthreads và Java', 'Thread libraries: Pthreads and Java'),
        points: [
          b('Thư viện luồng cung cấp API tạo và quản lý luồng; có thể cài đặt hoàn toàn ở user space hoặc được nhân hỗ trợ.', 'A thread library provides APIs to create and manage threads; its implementation may be entirely in user space or supported by the kernel.'),
          b('Pthreads là đặc tả API POSIX về tạo và đồng bộ luồng, không phải một bản cài đặt cụ thể. Tùy thư viện/HĐH mà có cài đặt tương ứng.', 'Pthreads is a POSIX API specification for thread creation and synchronization, not one particular implementation. Implementations depend on the library/OS.'),
          b('Luồng Java do JVM quản lý, thường dựa trên mô hình luồng của HĐH bên dưới. Có thể kế thừa Thread hoặc cài Runnable; join() chờ một luồng kết thúc.', 'Java threads are managed by the JVM, usually using the underlying OS thread model. They may extend Thread or implement Runnable; join() waits for a thread to finish.'),
        ],
        sourcePages: [26, 27, 28, 29, 31, 32],
      },
      {
        title: b('Đa luồng tường minh và đa luồng ẩn', 'Explicit and implicit threading'),
        points: [
          b('Với đa luồng tường minh, lập trình viên tự tạo/quản lý luồng; khi số luồng lớn, việc giữ đúng và gỡ lỗi trở nên khó hơn.', 'With explicit threading, programmers create/manage threads themselves; maintaining correctness and debugging become harder as thread counts grow.'),
          b('Đa luồng ẩn giao phần tạo/quản lý luồng cho trình biên dịch hoặc thư viện runtime. Lập trình viên diễn đạt công việc, hệ thống hỗ trợ tổ chức thực thi.', 'Implicit threading delegates thread creation/management to the compiler or runtime library. Programmers express work while the supporting system organizes execution.'),
          b('Các phương pháp được nêu trong slide: Thread Pools, Fork–Join, OpenMP, Grand Central Dispatch và Intel Threading Building Blocks.', 'The slide lists Thread Pools, Fork–Join, OpenMP, Grand Central Dispatch, and Intel Threading Building Blocks.'),
        ],
        sourcePages: [34, 35],
      },
    ],
    pitfalls: [
      b('PC, thanh ghi, stack là riêng từng luồng; code/data/tài nguyên tiến trình được chia sẻ.', 'PC, registers, and stack are per-thread; code/data/process resources are shared.'),
      b('Many-to-one không biến thành song song chỉ vì máy có nhiều lõi. Cần đủ kernel threads để nhân phân phối lên các lõi.', 'Many-to-one does not become parallel merely because the machine has multiple cores. Sufficient kernel threads are needed for the kernel to distribute execution across cores.'),
      b('Trong Amdahl, S là phần tuần tự, không phải phần song song; đổi phần trăm sang tỷ lệ trước khi tính.', 'In Amdahl’s law, S is the serial fraction, not the parallel fraction; convert percentages to fractions first.'),
    ],
    formulas: [
      { formula: 'Speedup(N) = 1 / (S + (1 − S) / N)', meaning: b('Mô hình Amdahl: S là tỷ lệ tuần tự của khối lượng công việc cố định; N là số lõi; bỏ qua overhead.', 'Amdahl’s model: S is the serial fraction of a fixed workload; N is the number of cores; overhead is ignored.') },
      { formula: 'lim(N → ∞) Speedup(N) = 1 / S', meaning: b('Giới hạn tăng tốc khi S > 0: phần tuần tự quyết định trần hiệu năng.', 'Speedup limit for S > 0: the serial part sets the performance ceiling.') },
    ],
    source: { file: 'OS/Current Progress/Lecture-04-ThreadAndMultithreading.pdf', label: 'Lecture-04', pages: 35 },
  },
  {
    id: 'scheduling',
    number: '05',
    title: b('Lập lịch CPU', 'CPU scheduling'),
    intro: b('Dựng Gantt theo arrival và thuật toán; tính đúng response, waiting, turnaround.', 'Build Gantt charts from arrivals and scheduling rules; calculate response, waiting, and turnaround.'),
    sections: [
      {
        title: b('Bộ lập lịch, cưỡng chế và điều phối', 'Scheduler, preemption, and dispatch'),
        points: [
          b('Bộ lập lịch ngắn hạn chọn từ ready queue. Dispatcher chuyển ngữ cảnh, sang user mode và tiếp tục lệnh; dispatch latency là thời gian chuyển giao.', 'The short-term scheduler selects from the ready queue. The dispatcher switches context, enters user mode, and resumes instructions; dispatch latency is the handover time.'),
          b('Không cưỡng chế: giữ CPU đến khi chờ/tự nhường/kết thúc. Cưỡng chế: có thể bị thu hồi CPU khi hết quantum hoặc có việc ưu tiên hơn.', 'Non-preemptive tasks keep the CPU until waiting/yielding/termination. Preemptive scheduling may take it back at quantum expiry or for higher-priority work.'),
          b('Mốc quyết định: Running → Waiting, Running → Ready, Waiting → Ready, kết thúc. Hệ thống đa luồng lập lịch các luồng.', 'Decision points: Running → Waiting, Running → Ready, Waiting → Ready, termination. Multithreaded systems schedule threads.'),
        ],
        sourcePages: [7, 9, 10, 11, 12, 38],
      },
      {
        title: b('Năm tiêu chí và công thức tính', 'Five criteria and calculation rules'),
        points: [
          b('Tối đa CPU utilization (tỷ lệ bận), throughput (hoàn thành/đơn vị thời gian); tối thiểu turnaround, waiting, response.', 'Maximize CPU utilization (busy fraction) and throughput (completions/time); minimize turnaround, waiting, and response.'),
          b('A: đến; B: tổng CPU burst; F: lần đầu chạy; C: kết thúc. Turnaround T = C − A; response R = F − A.', 'A: arrival; B: total CPU burst; F: first start; C: completion. Turnaround T = C − A; response R = F − A.'),
          b('Waiting chỉ tính chờ trong ready queue. Bài một burst, không I/O: W = C − A − B. Có I/O phải tính riêng các khoảng chờ.', 'Waiting counts ready-queue intervals only. For one burst without I/O: W = C − A − B. With I/O, account separately for waiting intervals.'),
          b('Response dừng ở lần chạy đầu, turnaround dừng lúc kết thúc. Tính từng tiến trình trước khi lấy trung bình cộng.', 'Response ends at first start; turnaround ends at completion. Calculate per-process metrics before averaging.'),
        ],
        sourcePages: [14, 15, 18, 19, 26, 43],
      },
      {
        title: b('FCFS, SJF và SRTF', 'FCFS, SJF, and SRTF'),
        points: [
          b('FCFS không cưỡng chế, theo thứ tự đến. Convoy effect: việc ngắn đợi sau việc dài.', 'FCFS is non-preemptive and follows arrival order. Convoy effect: short jobs wait behind long ones.'),
          b('SJF chọn burst ngắn nhất trong số đã đến, chạy hết burst. Tối ưu chờ trung bình cho tập việc sẵn có với burst đã biết.', 'SJF selects the shortest arrived burst and runs it to completion. It minimizes average waiting for an available set with known bursts.'),
          b('SRTF là SJF cưỡng chế: so phần còn lại, không so burst ban đầu. Việc mới ngắn hơn có thể giành CPU.', 'SRTF is preemptive SJF: compare remaining time, not original burst. A shorter new task can preempt.'),
          b('Ước lượng burst bằng trung bình mũ: τ(n+1) = αt(n) + (1 − α)τ(n). α = 0 bỏ burst mới; α = 1 chỉ lấy burst mới.', 'Estimate bursts with exponential averaging: τ(n+1) = αt(n) + (1 − α)τ(n). α = 0 ignores the latest burst; α = 1 uses only it.'),
        ],
        sourcePages: [17, 18, 19, 20, 21, 22, 23, 24, 25, 26],
      },
      {
        title: b('Độ ưu tiên và Round Robin', 'Priority scheduling and Round Robin'),
        points: [
          b('Priority có bản cưỡng chế/không cưỡng chế. Slide dùng số nhỏ = ưu tiên cao; luôn đọc quy ước đề.', 'Priority scheduling may be preemptive/non-preemptive. Slides use smaller numbers for higher priority; check each problem.'),
          b('Starvation: việc ưu tiên thấp bị bỏ qua liên tục. Aging tăng ưu tiên theo thời gian chờ.', 'Starvation repeatedly bypasses low-priority work. Aging raises priority with waiting time.'),
          b('RR cấp tối đa q/lượt; chưa xong thì về cuối ready queue. Thêm việc mới đúng arrival; không sắp hàng theo burst.', 'RR grants up to q per turn; unfinished tasks rejoin the ready-queue tail. Add arrivals at their times; do not sort by burst.'),
          b('q lớn: gần FCFS; q nhỏ: nhiều overhead. Arrival đúng lúc hết quantum: thứ tự thêm việc mới và đưa việc cũ lại hàng tùy quy ước; theo đề/bài luyện.', 'Large q approaches FCFS; small q adds overhead. When arrival coincides with quantum expiry, arrival-versus-requeue order varies by convention; follow the problem/practice rule.'),
        ],
        sourcePages: [27, 28, 29, 30, 31, 32, 43],
      },
      {
        title: b('Hàng đợi đa mức và phản hồi đa mức', 'Multilevel and multilevel feedback queues'),
        points: [
          b('MLQ: công việc ở hàng cố định; mỗi hàng dùng thuật toán riêng, ví dụ foreground RR, background FCFS.', 'MLQ fixes tasks to queues with separate policies, for example foreground RR and background FCFS.'),
          b('Giữa các hàng: ưu tiên cố định có thể gây starvation; hoặc chia tỷ lệ thời gian CPU.', 'Between queues, fixed priority can cause starvation; alternatively allocate CPU-time shares.'),
          b('MLFQ cho chuyển hàng: cần số hàng, thuật toán/quantum, điều kiện thăng/hạ, hàng vào ban đầu.', 'MLFQ permits queue changes: specify queue counts, policies/quanta, promotion/demotion rules, and entry queue.'),
          b('Ví dụ slide: Q0 RR 8 ms → chưa xong xuống Q1 RR 16 ms → Q2 FCFS. Các tham số này chỉ là ví dụ.', 'Slide example: Q0 RR 8 ms → unfinished work moves to Q1 RR 16 ms → Q2 FCFS. These parameters are illustrative.'),
        ],
        sourcePages: [33, 34, 35, 36],
      },
      {
        title: b('Lập lịch luồng và ví dụ HĐH trong slide', 'Thread scheduling and the lecture’s OS examples'),
        points: [
          b('PCS: cạnh tranh trong tiến trình, thư viện chọn user threads. SCS: cạnh tranh toàn hệ thống, nhân phân kernel threads lên CPU.', 'PCS: within-process competition as a library selects user threads. SCS: system-wide competition as the kernel schedules kernel threads.'),
          b('Linux trong slide: CFS dùng nice/vruntime, chọn vruntime nhỏ nhất. Đây là mô hình/phiên bản trong học liệu.', 'The slides describe Linux CFS using nice/vruntime and selecting the smallest vruntime. This refers to the course’s model/version.'),
          b('Windows trong slide: cưỡng chế theo ưu tiên; mức 1–15 biến đổi, 16–31 thời gian thực, 0 quản lý bộ nhớ. Solaris: nhiều lớp, ưu tiên toàn cục, cùng ưu tiên dùng RR.', 'The slides describe Windows preemptive priorities: levels 1–15 variable, 16–31 real-time, 0 for memory management. Solaris uses several classes, global priorities, and RR for equal priority.'),
        ],
        sourcePages: [38, 39, 46, 47, 48, 49, 51, 52, 53, 54, 56, 59],
      },
      {
        title: b('Đánh giá thuật toán và quy trình làm bài', 'Evaluating algorithms and solving exercises'),
        points: [
          b('Tất định: tính trên dữ liệu cho trước. Mô hình hàng đợi: dùng phân bố đến/phục vụ. Mô phỏng: dữ liệu sinh hoặc trace. Triển khai: đo thực, tốn kém.', 'Deterministic evaluation calculates a given workload. Queueing models use arrival/service distributions. Simulation uses generated data or traces. Implementation measures a real system at greater cost.'),
          b('Little: n = λW khi ổn định; n là độ dài hàng trung bình, λ tốc độ đến, W thời gian chờ cùng hàng. Thống nhất đơn vị.', 'Little: n = λW in steady state; n is average queue length, λ arrival rate, and W average waiting in that queue. Use consistent units.'),
          b('Ghi A/B/priority/q, quy tắc hòa; dựng Gantt tại arrival, hết burst/quantum; thêm idle nếu cần; ghi F/C rồi tính R/T/W.', 'Record A/B/priority/q and tie rules; build Gantt events at arrivals and burst/quantum ends; include idle time; record F/C, then calculate R/T/W.'),
          b('Kiểm tra tổng chạy = B, không chạy trước A, R/T/W không âm. Bài luyện giả định overhead = 0 khi đề không cho.', 'Check total running = B, no running before A, and nonnegative R/T/W. Practice assumes zero overhead when unspecified.'),
        ],
        sourcePages: [18, 19, 21, 26, 28, 30, 43, 61, 62, 63, 64, 65, 66, 67],
      },
    ],
    pitfalls: [
      b('Chỉ chọn việc đã đến; SJF không bỏ qua arrival.', 'Select only arrived tasks; SJF must respect arrivals.'),
      b('Response chỉ đến lần chạy đầu; waiting cộng mọi khoảng chờ CPU. Không mặc định chúng bằng nhau.', 'Response ends at first start; waiting sums all ready-queue intervals. Do not assume equality.'),
      b('SRTF so phần còn lại; priority đọc chiều ưu tiên; RR giữ thứ tự và quy tắc ranh giới quantum.', 'SRTF compares remaining time; priority needs its numerical convention; RR needs queue order and the boundary rule.'),
      b('Turnaround = C − A là khoảng thời gian; completion C là mốc. Không lấy trung bình C thay turnaround.', 'Turnaround = C − A is a duration; completion C is a timestamp. Do not average C instead of turnaround.'),
    ],
    formulas: [
      { formula: 'T = C − A', meaning: b('Turnaround: từ lúc đến A đến lúc kết thúc C.', 'Turnaround: elapsed time from arrival A to completion C.') },
      { formula: 'R = F − A', meaning: b('Response: từ lúc đến A đến lần đầu được chạy F.', 'Response: elapsed time from arrival A to first start F.') },
      { formula: 'W = T − B = C − A − B', meaning: b('Waiting cho bài một CPU burst không có I/O; B là CPU burst. Có I/O phải tính các khoảng ready hoặc trừ cả thời gian I/O phù hợp.', 'Waiting for a single-CPU-burst problem with no I/O; B is CPU burst. With I/O, sum ready intervals or additionally account for the relevant I/O time.') },
      { formula: 'X̄ = (X₁ + X₂ + … + Xₙ) / n', meaning: b('Trung bình cộng của cùng một chỉ số X trên n tiến trình.', 'Arithmetic mean of the same metric X across n processes.') },
      { formula: 'U = 100% × B_total / Δt', meaning: b('Mức sử dụng CPU: thời gian CPU bận chia khoảng quan sát; gồm cả idle trong mẫu số.', 'CPU utilization: busy CPU time divided by the observation interval; idle time remains in the denominator.') },
      { formula: 'Throughput = n_complete / Δt', meaning: b('Số tiến trình hoàn thành chia độ dài khoảng quan sát.', 'Completed process count divided by the observation interval.') },
      { formula: 'τₙ₊₁ = αtₙ + (1 − α)τₙ,  0 ≤ α ≤ 1', meaning: b('Dự đoán burst kế: tₙ là burst thực tế gần nhất; τₙ là dự đoán trước đó.', 'Next-burst prediction: tₙ is the latest measured burst; τₙ is the previous prediction.') },
      { formula: 'n = λW', meaning: b('Little ở trạng thái ổn định: độ dài hàng đợi trung bình = tốc độ đến × thời gian chờ trung bình.', 'Little’s law in steady state: average queue length = arrival rate × average queue waiting time.') },
    ],
    source: { file: 'OS/Current Progress/Lecture-05-CPUScheduling.pdf', label: 'Lecture-05', pages: 68 },
  },
];
