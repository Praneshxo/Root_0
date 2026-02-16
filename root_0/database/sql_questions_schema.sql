-- SQL Interview Questions Database Schema

-- Table: sql_questions
-- Stores all SQL interview questions
CREATE TABLE IF NOT EXISTS sql_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
  category TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('theory', 'query')),
  solution_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: user_sql_progress
-- Tracks user progress on SQL questions
CREATE TABLE IF NOT EXISTS user_sql_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES sql_questions(id) ON DELETE CASCADE,
  solved BOOLEAN DEFAULT FALSE,
  revision BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, question_id)
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_sql_questions_difficulty ON sql_questions(difficulty);
CREATE INDEX IF NOT EXISTS idx_sql_questions_category ON sql_questions(category);
CREATE INDEX IF NOT EXISTS idx_sql_questions_type ON sql_questions(type);
CREATE INDEX IF NOT EXISTS idx_user_sql_progress_user_id ON user_sql_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sql_progress_question_id ON user_sql_progress(question_id);

-- Enable Row Level Security
ALTER TABLE sql_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sql_progress ENABLE ROW LEVEL SECURITY;

-- RLS Policies for sql_questions (public read)
CREATE POLICY "Anyone can view SQL questions"
  ON sql_questions FOR SELECT
  USING (true);

-- RLS Policies for user_sql_progress (user-specific)
CREATE POLICY "Users can view their own progress"
  ON user_sql_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress"
  ON user_sql_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress"
  ON user_sql_progress FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own progress"
  ON user_sql_progress FOR DELETE
  USING (auth.uid() = user_id);

-- Sample SQL Interview Questions Data
INSERT INTO sql_questions (title, description, difficulty, category, type, solution_text) VALUES

-- Basics Questions (Easy)
('What is SQL and why is it important?', 'SQL (Structured Query Language) is used to manage and manipulate relational databases. It allows developers to create, read, update, and delete data efficiently. It''s essential because almost all modern applications rely on structured data storage and retrieval.', 'Easy', 'Basics', 'theory', 'SQL is a standard language for managing relational databases, enabling CRUD operations and data querying.'),

('What is the difference between SQL and MySQL?', 'SQL is a language for querying databases, whereas MySQL is a database management system that implements SQL. In short, SQL is the language; MySQL is a tool that uses it to manage databases.', 'Easy', 'Basics', 'theory', 'SQL is the language, MySQL is the DBMS that uses SQL.'),

('What are the different types of SQL commands?', 'SQL commands are grouped into categories: DDL (Data Definition Language), DML (Data Manipulation Language), DCL (Data Control Language), TCL (Transaction Control Language), and DQL (Data Query Language). Each type performs a unique database operation.', 'Easy', 'Basics', 'theory', 'DDL, DML, DCL, TCL, DQL - each handles different database operations.'),

('Explain primary key and foreign key.', 'A primary key uniquely identifies each record in a table. A foreign key establishes a link between two tables by referencing the primary key of another table, enforcing relational integrity between data sets.', 'Easy', 'Constraints', 'theory', 'Primary key uniquely identifies records; foreign key links tables.'),

-- Filtering Questions (Medium)
('What is the difference between WHERE and HAVING clauses?', 'WHERE filters rows before aggregation, while HAVING filters groups after aggregation. You use WHERE with raw data and HAVING with aggregated results like SUM or COUNT; often combined with GROUP BY.', 'Medium', 'Filtering', 'theory', 'WHERE filters rows before aggregation; HAVING filters after GROUP BY.'),

-- Normalization Questions (Medium)
('What is normalization in SQL?', 'Normalization organizes data to reduce redundancy and improve data integrity. It divides tables into smaller, related tables and uses relationships to maintain data consistency. The main forms include 1NF, 2NF, and 3NF.', 'Medium', 'Database Design', 'theory', 'Normalization reduces redundancy by organizing data into related tables.'),

('What is denormalization?', 'Denormalization is the process of combining tables to improve read performance by reducing the number of joins. It trades some redundancy for faster query execution, often used in data warehousing.', 'Medium', 'Database Design', 'theory', 'Denormalization combines tables for faster reads at the cost of redundancy.'),

-- Joins Questions (Medium)
('Explain different types of SQL joins.', 'INNER JOIN returns matching rows from both tables. LEFT JOIN returns all rows from the left table and matching rows from the right. RIGHT JOIN does the opposite. FULL OUTER JOIN returns all rows from both tables.', 'Medium', 'Joins', 'theory', 'INNER, LEFT, RIGHT, FULL OUTER - each returns different row combinations.'),

('Write a query to find employees and their departments using INNER JOIN.', 'SELECT e.name, d.department_name FROM employees e INNER JOIN departments d ON e.department_id = d.id;', 'Medium', 'Joins', 'query', 'SELECT e.name, d.department_name FROM employees e INNER JOIN departments d ON e.department_id = d.id;'),

-- Aggregation Questions (Medium)
('What are aggregate functions in SQL?', 'Aggregate functions perform calculations on multiple rows and return a single value. Common examples include COUNT(), SUM(), AVG(), MIN(), and MAX(). They are often used with GROUP BY.', 'Easy', 'Aggregation', 'theory', 'COUNT, SUM, AVG, MIN, MAX - perform calculations on row sets.'),

('Write a query to count the number of employees in each department.', 'SELECT department_id, COUNT(*) as employee_count FROM employees GROUP BY department_id;', 'Easy', 'Aggregation', 'query', 'SELECT department_id, COUNT(*) FROM employees GROUP BY department_id;'),

-- Subqueries Questions (Medium)
('What is a subquery in SQL?', 'A subquery is a query nested inside another query. It can be used in SELECT, FROM, WHERE, or HAVING clauses to provide intermediate results for the main query.', 'Medium', 'Subqueries', 'theory', 'A query nested inside another query for intermediate results.'),

('Write a query to find employees earning more than the average salary.', 'SELECT name, salary FROM employees WHERE salary > (SELECT AVG(salary) FROM employees);', 'Medium', 'Subqueries', 'query', 'SELECT name, salary FROM employees WHERE salary > (SELECT AVG(salary) FROM employees);'),

-- Window Functions Questions (Hard)
('What are window functions in SQL?', 'Window functions perform calculations across a set of rows related to the current row without collapsing the result set. Examples include ROW_NUMBER(), RANK(), DENSE_RANK(), and LEAD()/LAG().', 'Hard', 'Window Functions', 'theory', 'Functions that operate on row sets without collapsing results.'),

('Write a query using ROW_NUMBER() to rank employees by salary.', 'SELECT name, salary, ROW_NUMBER() OVER (ORDER BY salary DESC) as rank FROM employees;', 'Hard', 'Window Functions', 'query', 'SELECT name, salary, ROW_NUMBER() OVER (ORDER BY salary DESC) FROM employees;'),

-- Indexes Questions (Medium)
('What is an index in SQL and why is it used?', 'An index is a database object that improves query performance by allowing faster data retrieval. It works like a book index, creating a sorted reference to data locations.', 'Medium', 'Indexes', 'theory', 'Indexes speed up data retrieval by creating sorted references.'),

-- Transactions Questions (Medium)
('What is a transaction in SQL?', 'A transaction is a sequence of SQL operations treated as a single unit. It follows ACID properties (Atomicity, Consistency, Isolation, Durability) to ensure data integrity.', 'Medium', 'Transactions', 'theory', 'A unit of work following ACID properties for data integrity.'),

('Explain COMMIT and ROLLBACK.', 'COMMIT saves all changes made in the current transaction permanently. ROLLBACK undoes all changes made in the current transaction, reverting to the previous state.', 'Medium', 'Transactions', 'theory', 'COMMIT saves changes; ROLLBACK undoes them.'),

-- DELETE vs TRUNCATE Questions (Medium)
('What is the difference between DELETE and TRUNCATE?', 'DELETE removes specific rows and can be rolled back; it''s slower and logs each deletion. TRUNCATE removes all rows, is faster, cannot be rolled back (in most DBs), and resets identity counters.', 'Medium', 'DELETE', 'theory', 'DELETE removes specific rows (can rollback); TRUNCATE removes all (faster, no rollback).'),

-- DISTINCT Questions (Easy)
('What does the DISTINCT keyword do?', 'DISTINCT removes duplicate rows from query results, returning only unique values. It can be applied to one or multiple columns.', 'Easy', 'DISTINCT', 'theory', 'Removes duplicate rows, returning only unique values.'),

('Write a query to get unique department IDs from employees table.', 'SELECT DISTINCT department_id FROM employees;', 'Easy', 'DISTINCT', 'query', 'SELECT DISTINCT department_id FROM employees;'),

-- GROUP BY Questions (Medium)
('Explain the GROUP BY clause.', 'GROUP BY groups rows with the same values in specified columns into summary rows. It''s typically used with aggregate functions to perform calculations on each group.', 'Medium', 'GROUP BY', 'theory', 'Groups rows by column values for aggregate calculations.'),

('Write a query to find the average salary per department.', 'SELECT department_id, AVG(salary) as avg_salary FROM employees GROUP BY department_id;', 'Medium', 'GROUP BY', 'query', 'SELECT department_id, AVG(salary) FROM employees GROUP BY department_id;'),

-- CASE Statement Questions (Medium)
('What is the CASE statement in SQL?', 'CASE is a conditional expression that returns different values based on conditions. It works like if-else logic, allowing you to create calculated columns based on multiple conditions.', 'Medium', 'CASE', 'theory', 'Conditional expression for if-else logic in SQL queries.'),

('Write a query using CASE to categorize employees by salary range.', 'SELECT name, salary, CASE WHEN salary < 50000 THEN ''Low'' WHEN salary BETWEEN 50000 AND 100000 THEN ''Medium'' ELSE ''High'' END as salary_category FROM employees;', 'Medium', 'CASE', 'query', 'SELECT name, CASE WHEN salary < 50000 THEN ''Low'' ELSE ''High'' END FROM employees;'),

-- CTE Questions (Hard)
('What is a CTE (Common Table Expression)?', 'A CTE is a temporary named result set that exists only during query execution. It improves readability and can be referenced multiple times in the same query. Defined using WITH clause.', 'Hard', 'CTE', 'theory', 'Temporary named result set using WITH clause for better readability.'),

('Write a query using CTE to find departments with more than 5 employees.', 'WITH dept_counts AS (SELECT department_id, COUNT(*) as emp_count FROM employees GROUP BY department_id) SELECT * FROM dept_counts WHERE emp_count > 5;', 'Hard', 'CTE', 'query', 'WITH dept_counts AS (SELECT department_id, COUNT(*) FROM employees GROUP BY department_id) SELECT * FROM dept_counts WHERE emp_count > 5;'),

-- String Functions Questions (Easy)
('What are common string functions in SQL?', 'Common string functions include CONCAT() for joining strings, SUBSTRING() for extracting parts, UPPER()/LOWER() for case conversion, LENGTH() for string length, and TRIM() for removing spaces.', 'Easy', 'String Functions', 'theory', 'CONCAT, SUBSTRING, UPPER, LOWER, LENGTH, TRIM for string manipulation.'),

-- Date Functions Questions (Easy)
('What are common date functions in SQL?', 'Common date functions include NOW() for current datetime, DATE() for extracting date, YEAR()/MONTH()/DAY() for parts, DATEDIFF() for difference, and DATE_ADD()/DATE_SUB() for arithmetic.', 'Easy', 'Date Functions', 'theory', 'NOW, DATE, YEAR, MONTH, DAY, DATEDIFF for date operations.'),

-- Views Questions (Medium)
('What is a view in SQL?', 'A view is a virtual table based on a SQL query. It doesn''t store data but provides a saved query that can be referenced like a table. Views simplify complex queries and enhance security.', 'Medium', 'Views', 'theory', 'Virtual table based on a query, simplifies access and enhances security.'),

-- Stored Procedures Questions (Hard)
('What is a stored procedure?', 'A stored procedure is a precompiled set of SQL statements stored in the database. It can accept parameters, contain logic, and be reused multiple times, improving performance and maintainability.', 'Hard', 'Stored Procedures', 'theory', 'Precompiled SQL statements stored in database for reuse and performance.'),

-- Triggers Questions (Hard)
('What is a trigger in SQL?', 'A trigger is a stored procedure that automatically executes when specific events (INSERT, UPDATE, DELETE) occur on a table. It''s used to enforce business rules and maintain data integrity.', 'Hard', 'Triggers', 'theory', 'Automatic procedure executed on INSERT/UPDATE/DELETE events.'),

-- UNION Questions (Medium)
('What is the difference between UNION and UNION ALL?', 'UNION combines results from multiple queries and removes duplicates. UNION ALL combines results but keeps all duplicates. UNION ALL is faster since it doesn''t check for duplicates.', 'Medium', 'UNION', 'theory', 'UNION removes duplicates; UNION ALL keeps all rows (faster).'),

-- Duplicates Questions (Medium)
('Write a query to find duplicate records in a table.', 'SELECT email, COUNT(*) FROM users GROUP BY email HAVING COUNT(*) > 1;', 'Medium', 'Duplicates', 'query', 'SELECT email, COUNT(*) FROM users GROUP BY email HAVING COUNT(*) > 1;'),

-- Cursors Questions (Hard)
('What is a cursor in SQL?', 'A cursor is a database object that allows row-by-row processing of query results. It''s useful when you need to perform operations on individual rows, though set-based operations are generally preferred.', 'Hard', 'Cursors', 'theory', 'Object for row-by-row processing of query results.'),

-- Data Types Questions (Easy)
('What are the main data types in SQL?', 'Main data types include: Numeric (INT, DECIMAL, FLOAT), String (VARCHAR, CHAR, TEXT), Date/Time (DATE, DATETIME, TIMESTAMP), and Boolean (BOOLEAN/BIT).', 'Easy', 'Data Types', 'theory', 'Numeric, String, Date/Time, Boolean - fundamental SQL data types.'),

-- Constraints Questions (Easy)
('What are SQL constraints?', 'Constraints are rules enforced on table columns to ensure data integrity. Common constraints include PRIMARY KEY, FOREIGN KEY, UNIQUE, NOT NULL, CHECK, and DEFAULT.', 'Easy', 'Constraints', 'theory', 'Rules on columns: PRIMARY KEY, FOREIGN KEY, UNIQUE, NOT NULL, CHECK, DEFAULT.'),

-- Optimization Questions (Hard)
('How do you optimize SQL queries?', 'Query optimization techniques include: using indexes, avoiding SELECT *, minimizing subqueries, using JOINs instead of subqueries, limiting result sets, using EXPLAIN to analyze queries, and avoiding functions in WHERE clauses.', 'Hard', 'Optimization', 'theory', 'Use indexes, avoid SELECT *, minimize subqueries, use EXPLAIN, limit results.'),

-- Hierarchical Queries Questions (Hard)
('What are hierarchical queries in SQL?', 'Hierarchical queries retrieve data with parent-child relationships, like organizational charts or category trees. They use recursive CTEs or CONNECT BY (Oracle) to traverse tree structures.', 'Hard', 'Hierarchical Queries', 'theory', 'Queries for parent-child relationships using recursive CTEs.'),

-- Pivoting Questions (Hard)
('What is pivoting in SQL?', 'Pivoting transforms rows into columns, converting unique row values into multiple columns. It''s useful for creating cross-tabulation reports and summary matrices.', 'Hard', 'Pivoting', 'theory', 'Transforms rows into columns for cross-tabulation reports.'),

-- Data Manipulation Questions (Medium)
('What is the difference between UPDATE and ALTER?', 'UPDATE modifies data in existing rows (DML). ALTER modifies the structure of database objects like tables or columns (DDL). UPDATE changes values; ALTER changes schema.', 'Medium', 'Data Manipulation', 'theory', 'UPDATE changes data (DML); ALTER changes structure (DDL).');

-- Note: This provides 40 sample questions. You can add more to reach 160 total.
