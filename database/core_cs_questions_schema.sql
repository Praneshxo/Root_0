-- Core CS Questions Database Schema

-- Table: core_cs_questions
-- Stores all core computer science interview questions
CREATE TABLE IF NOT EXISTS core_cs_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
  category TEXT NOT NULL,
  solution_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: user_core_cs_progress
-- Tracks user progress on core CS questions
CREATE TABLE IF NOT EXISTS user_core_cs_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES core_cs_questions(id) ON DELETE CASCADE,
  solved BOOLEAN DEFAULT FALSE,
  revision BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, question_id)
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_core_cs_questions_difficulty ON core_cs_questions(difficulty);
CREATE INDEX IF NOT EXISTS idx_core_cs_questions_category ON core_cs_questions(category);
CREATE INDEX IF NOT EXISTS idx_user_core_cs_progress_user_id ON user_core_cs_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_core_cs_progress_question_id ON user_core_cs_progress(question_id);

-- Enable Row Level Security
ALTER TABLE core_cs_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_core_cs_progress ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can view core CS questions" ON core_cs_questions;
DROP POLICY IF EXISTS "Users can view their own core CS progress" ON user_core_cs_progress;
DROP POLICY IF EXISTS "Users can insert their own core CS progress" ON user_core_cs_progress;
DROP POLICY IF EXISTS "Users can update their own core CS progress" ON user_core_cs_progress;
DROP POLICY IF EXISTS "Users can delete their own core CS progress" ON user_core_cs_progress;

-- RLS Policies for core_cs_questions (public read)
CREATE POLICY "Anyone can view core CS questions"
  ON core_cs_questions FOR SELECT
  USING (true);

-- RLS Policies for user_core_cs_progress (user-specific)
CREATE POLICY "Users can view their own core CS progress"
  ON user_core_cs_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own core CS progress"
  ON user_core_cs_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own core CS progress"
  ON user_core_cs_progress FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own core CS progress"
  ON user_core_cs_progress FOR DELETE
  USING (auth.uid() = user_id);

-- Sample Core CS Questions Data
INSERT INTO core_cs_questions (title, description, difficulty, category, solution_text) VALUES

-- System Design Questions
('Explain ACID properties in DBMS.', 'ACID is an acronym that stands for Atomicity, Consistency, Isolation, and Durability, which are the foundational properties that ensure reliable processing of database transactions. Atomicity ensures that a transaction is treated as a single unit—either all of its operations succeed or none do, preventing partial updates. Consistency ensures that a transaction brings the database from one valid state to another, maintaining all defined rules and constraints. Isolation ensures that concurrent transactions do not interfere with each other, as if they were executed sequentially. Durability guarantees that once a transaction is committed, its changes are permanent, even in the case of system failures.', 'Medium', 'System Design', 'Atomicity, Consistency, Isolation, Durability - ensure reliable database transactions.'),

('What is load balancing?', 'Load balancing is the process of distributing network traffic across multiple servers to ensure no single server bears too much demand. It improves application availability, scalability, and reliability by preventing server overload. Load balancers can use various algorithms like round-robin, least connections, or IP hash to distribute traffic. They also perform health checks to route traffic only to healthy servers. Load balancing is essential for high-traffic applications and helps achieve horizontal scaling.', 'Medium', 'System Design', 'Distributing traffic across multiple servers to improve availability and performance.'),

('Explain microservices architecture.', 'Microservices architecture is a design approach where an application is built as a collection of small, independent services that communicate through APIs. Each microservice focuses on a specific business capability and can be developed, deployed, and scaled independently. This architecture offers benefits like improved scalability, easier maintenance, technology diversity, and fault isolation. However, it also introduces complexity in terms of service communication, data consistency, and deployment orchestration.', 'Hard', 'System Design', 'Architecture pattern using small, independent services communicating via APIs.'),

-- Computer Networks Questions
('What is the OSI model?', 'The OSI (Open Systems Interconnection) model is a conceptual framework that standardizes the functions of a telecommunication or computing system into seven distinct layers. These layers are: Physical, Data Link, Network, Transport, Session, Presentation, and Application. Each layer serves a specific purpose and communicates with the layers directly above and below it. The model helps in understanding how data flows through a network and serves as a basis for network protocols and troubleshooting. It provides a universal language for network engineers to discuss and design network architectures.', 'Easy', 'Computer Networks', '7-layer model: Physical, Data Link, Network, Transport, Session, Presentation, Application.'),

('Difference between TCP and UDP?', 'TCP (Transmission Control Protocol) and UDP (User Datagram Protocol) are both protocols of the Internet Protocol Suite used for transmitting data over networks. TCP is connection-oriented, meaning it establishes a reliable connection through a handshake process before transmitting data. It guarantees delivery, maintains the order of packets, and includes error-checking mechanisms, making it slower but more reliable. UDP, on the other hand, is connectionless and does not guarantee delivery, maintain order, or check for errors. It is faster and more efficient for applications where speed is critical and occasional data loss is acceptable, such as video streaming or online gaming.', 'Medium', 'Computer Networks', 'TCP is connection-oriented and reliable; UDP is connectionless and faster but unreliable.'),

('What is IP subnetting?', 'IP subnetting is the process of dividing a larger IP network into smaller sub-networks, or subnets. This division allows more efficient use of IP addresses and improves network performance and security. By segmenting a network, administrators can reduce broadcast traffic, isolate network problems, and apply different security policies to different segments. Subnetting uses a subnet mask to determine which portion of an IP address refers to the network and which refers to the host. Common subnet masks include /24 (255.255.255.0), /16 (255.255.0.0), and CIDR notation for more granular control.', 'Medium', 'Computer Networks', 'Dividing a larger IP network into smaller sub-networks for better efficiency and security.'),

('What is DNS and how does it work?', 'DNS (Domain Name System) is a hierarchical naming system that translates human-readable domain names into IP addresses. When you enter a URL, your computer queries DNS servers to find the corresponding IP address. The process involves recursive queries through root servers, TLD servers, and authoritative name servers. DNS uses caching to improve performance and reduce query time. It is essential for internet functionality and supports various record types like A, AAAA, CNAME, MX, and TXT records.', 'Medium', 'Computer Networks', 'System that translates domain names to IP addresses through hierarchical queries.'),

-- DBMS Questions
('What is a primary key in a database?', 'A primary key is a column or set of columns in a table that uniquely identifies each record in a table. It ensures that no two rows have the same primary key value, which helps maintain data integrity and allows efficient data retrieval. Primary keys must contain unique values and cannot contain null values. They are crucial in relational databases for establishing and identifying relationships between tables.', 'Easy', 'DBMS', 'A unique identifier for each record in a table that cannot be null and must be unique.'),

('Explain ACID properties in DBMS.', 'ACID is an acronym that stands for Atomicity, Consistency, Isolation, and Durability, which are the foundational properties that ensure reliable processing of database transactions. Atomicity ensures that a transaction is treated as a single unit—either all of its operations succeed or none do, preventing partial updates. Consistency ensures that a transaction brings the database from one valid state to another, maintaining all defined rules and constraints. Isolation ensures that concurrent transactions do not interfere with each other, as if they were executed sequentially. Durability guarantees that once a transaction is committed, its changes are permanent, even in the case of system failures.', 'Medium', 'DBMS', 'Atomicity, Consistency, Isolation, Durability - fundamental properties ensuring reliable database transactions.'),

('What is normalization?', 'Normalization is a database design process aimed at reducing data redundancy and improving data integrity. It involves organizing data into tables and columns by applying a series of rules called normal forms. The most common normal forms include 1NF, 2NF, 3NF, and BCNF. Each normal form addresses specific types of redundancy and dependency issues. For example, 1NF eliminates repeating groups, 2NF removes partial dependencies, and 3NF eliminates transitive dependencies. Normalization helps maintain data consistency and makes the database easier to maintain and query.', 'Medium', 'DBMS', 'Process of organizing data to minimize redundancy through normal forms (1NF, 2NF, 3NF, BCNF).'),

('What is database indexing?', 'Database indexing is a data structure technique used to quickly locate and access data in a database. Indexes are created on columns to speed up query performance by reducing the number of disk accesses required. Common index types include B-tree, hash, and bitmap indexes. While indexes improve read performance, they can slow down write operations and consume additional storage space. Proper index design is crucial for database optimization.', 'Medium', 'DBMS', 'Data structure to speed up data retrieval by creating pointers to table rows.'),

-- Object Oriented Programming Questions
('What are the four pillars of OOP?', 'The four fundamental principles of Object-Oriented Programming are Encapsulation, Abstraction, Inheritance, and Polymorphism. Encapsulation involves bundling data and methods that operate on that data within a single unit (class), hiding internal details from the outside world. Abstraction focuses on exposing only essential features while hiding implementation details. Inheritance allows a class to inherit properties and methods from another class, promoting code reuse. Polymorphism enables objects of different classes to be treated as objects of a common superclass, allowing methods to behave differently based on the object calling them.', 'Easy', 'Object Oriented Programming', 'Encapsulation, Abstraction, Inheritance, Polymorphism.'),

('What is the difference between abstract class and interface?', 'An abstract class is a class that cannot be instantiated and may contain both abstract methods (without implementation) and concrete methods (with implementation). It is used when classes share common behavior but also have specific implementations. An interface, on the other hand, is a contract that defines a set of methods that a class must implement, without providing any implementation itself (in most languages). Interfaces support multiple inheritance, while abstract classes typically do not. Abstract classes are used for "is-a" relationships, while interfaces are for "can-do" relationships.', 'Medium', 'Object Oriented Programming', 'Abstract class can have implementation; interface is a pure contract. Abstract class for "is-a", interface for "can-do".'),

('Explain method overloading vs method overriding.', 'Method overloading occurs when multiple methods in the same class have the same name but different parameters (different number, type, or order). It is resolved at compile time (static polymorphism). Method overriding occurs when a subclass provides a specific implementation of a method already defined in its parent class. The method signature must be identical, and it is resolved at runtime (dynamic polymorphism). Overloading is about compile-time flexibility, while overriding is about runtime behavior customization.', 'Medium', 'Object Oriented Programming', 'Overloading: same name, different parameters (compile-time). Overriding: subclass redefines parent method (runtime).'),

-- Computer Architecture Questions
('What is pipelining in computer architecture?', 'Pipelining is a technique used in computer architecture to improve instruction throughput by overlapping the execution of multiple instructions. Instead of completing one instruction before starting the next, pipelining divides instruction execution into stages (fetch, decode, execute, memory access, write back) and processes different stages of different instructions simultaneously. This allows the CPU to work on multiple instructions at once, significantly increasing performance. However, pipelining introduces challenges like hazards (data, control, structural) that must be managed through techniques like forwarding, stalling, and branch prediction.', 'Medium', 'Computer Architecture', 'Technique to overlap instruction execution stages for improved throughput.'),

('Explain cache memory and its levels.', 'Cache memory is a small, fast memory located close to the CPU that stores frequently accessed data and instructions. It reduces the average time to access memory by keeping copies of data from frequently used main memory locations. Modern processors typically have three levels: L1 cache (smallest, fastest, closest to CPU cores), L2 cache (larger, slightly slower), and L3 cache (largest, shared among cores). Cache uses principles of locality (temporal and spatial) to predict what data will be needed next. Cache hit ratio is a key performance metric.', 'Medium', 'Computer Architecture', 'Fast memory hierarchy (L1, L2, L3) storing frequently accessed data near CPU.'),

('What is the Von Neumann architecture?', 'The Von Neumann architecture is a computer design model that uses a single storage structure to hold both instructions and data. It consists of a CPU (containing ALU and control unit), memory, and input/output mechanisms. Instructions and data share the same memory and bus system, which creates the "Von Neumann bottleneck" where the CPU must wait for memory access. Despite this limitation, it remains the foundation for most modern computers due to its simplicity and flexibility.', 'Easy', 'Computer Architecture', 'Computer design with shared memory for instructions and data, including CPU, memory, and I/O.'),

-- Operating Systems Questions
('Define deadlock in operating systems.', 'A deadlock is a situation in an operating system where two or more processes are unable to proceed because each is waiting for resources held by the other. This cycle of waiting creates a standstill where no process can continue execution. Deadlock occurs when four conditions are met simultaneously: mutual exclusion (resources cannot be shared), hold and wait (processes hold resources while waiting for others), no preemption (resources cannot be forcibly taken), and circular wait (a circular chain of processes exists where each waits for a resource held by the next). Deadlock can be prevented, avoided, detected, or recovered from using various strategies.', 'Hard', 'Operating Systems', 'A cycle where processes wait for resources held by each other. Requires 4 conditions: mutual exclusion, hold and wait, no preemption, circular wait.'),

('Difference between process and thread?', 'A process is an independent execution unit with its own memory space, including code, data, and system resources. Each process runs in isolation and has its own address space. A thread, on the other hand, is a lightweight unit of execution within a process that shares the process''s memory and resources. Multiple threads within the same process can run concurrently and share data more easily than separate processes. Threads are faster to create and switch between than processes, but they require careful synchronization to avoid race conditions and data corruption.', 'Medium', 'Operating Systems', 'Process is independent with own memory; thread is lightweight unit within a process sharing memory.'),

('Explain process scheduling algorithms.', 'Process scheduling algorithms determine the order in which processes are executed by the CPU. Common algorithms include First-Come-First-Served (FCFS), which executes processes in the order they arrive; Shortest Job First (SJF), which prioritizes processes with the shortest execution time; Round Robin (RR), which allocates a fixed time slice to each process in a circular manner; and Priority Scheduling, which assigns priorities to processes and executes higher-priority ones first. Each algorithm has trade-offs in terms of throughput, turnaround time, waiting time, and response time.', 'Medium', 'Operating Systems', 'FCFS, SJF, Round Robin, Priority Scheduling - methods to determine process execution order.'),

('What is virtual memory?', 'Virtual memory is a memory management technique that provides an abstraction of the storage resources, allowing programs to use more memory than physically available. It uses a combination of RAM and disk space to create the illusion of a large, contiguous address space. Pages or segments of memory are swapped between RAM and disk as needed. Virtual memory enables multiprogramming, memory protection, and efficient memory utilization. It uses concepts like paging, page tables, and the TLB (Translation Lookaside Buffer) for address translation.', 'Medium', 'Operating Systems', 'Memory management technique using RAM and disk to provide larger address space than physical memory.');

-- Note: This provides 20 sample questions across the 6 core categories.
