-- 1. Create the table for categorized company questions
CREATE TABLE IF NOT EXISTS company_topic_questions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_name TEXT NOT NULL,
  topic TEXT NOT NULL CHECK (topic IN ('DSA', 'Aptitude', 'SQL', 'Core CS')),
  question TEXT NOT NULL,
  difficulty TEXT CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE company_topic_questions ENABLE ROW LEVEL SECURITY;

-- 3. Create Policy to allow public read access
CREATE POLICY "Allow public read access" ON company_topic_questions
  FOR SELECT USING (true);

-- 4. Create Index for faster filtering
CREATE INDEX IF NOT EXISTS idx_company_topic_questions_query 
ON company_topic_questions(company_name, topic);

-- 5. Insert Sample Data
INSERT INTO company_topic_questions (company_name, topic, question, difficulty) VALUES
-- HCL Data
('HCL', 'DSA', 'Reverse a linked list', 'Easy'),
('HCL', 'DSA', 'Find the missing number in an array', 'Easy'),
('HCL', 'DSA', 'Binary Search implementation', 'Medium'),
('HCL', 'Aptitude', 'Train A moves at 60km/h...', 'Medium'),
('HCL', 'Aptitude', 'Work and Time problem: A can do work in 10 days...', 'Easy'),
('HCL', 'SQL', 'Select second highest salary from Employee table', 'Medium'),
('HCL', 'SQL', 'Explain INNER JOIN vs LEFT JOIN', 'Easy'),
('HCL', 'Core CS', 'What is the difference between Process and Thread?', 'Medium'),
('HCL', 'Core CS', 'Explain ACID properties in DBMS', 'Medium'),

-- TCS Data
('TCS', 'DSA', 'Reverse a string without using built-in functions', 'Easy'),
('TCS', 'DSA', 'Check if a string is a palindrome', 'Easy'),
('TCS', 'DSA', 'Find duplicates in an array', 'Easy'),
('TCS', 'DSA', 'Implement Bubble Sort', 'Medium'),
('TCS', 'Aptitude', 'Probability of picking a red ball from a bag...', 'Medium'),
('TCS', 'Aptitude', 'Speed, Distance, Time problem: Two trains...', 'Medium'),
('TCS', 'Aptitude', 'Percentage calculation problem', 'Easy'),
('TCS', 'SQL', 'Select employees with salary > 50000', 'Easy'),
('TCS', 'SQL', 'Count employees in each department', 'Medium'),
('TCS', 'SQL', 'Explain Primary Key vs Unique Key', 'Easy'),
('TCS', 'Core CS', 'What is SDLC?', 'Easy'),
('TCS', 'Core CS', 'Difference between C and C++', 'Easy'),
('TCS', 'Core CS', 'Explain OSI Model layers', 'Medium'),

-- Infosys Data
('Infosys', 'DSA', 'Find the factorial of a number', 'Easy'),
('Infosys', 'DSA', 'Fibonacci Series using recursion', 'Medium'),
('Infosys', 'DSA', 'Linked List insertion at beginning', 'Medium'),
('Infosys', 'Aptitude', 'Number series completion: 2, 4, 8, ...', 'Easy'),
('Infosys', 'Aptitude', 'Ratio and Proportion problem', 'Easy'),
('Infosys', 'Aptitude', 'Simple Interest calculation', 'Easy'),
('Infosys', 'SQL', 'Write a query to find null values', 'Easy'),
('Infosys', 'SQL', 'Explain Normalization (1NF, 2NF, 3NF)', 'Medium'),
('Infosys', 'Core CS', 'What is OOPs?', 'Easy'),
('Infosys', 'Core CS', 'Explain Polymorphism with examples', 'Medium'),

-- Wipro Data
('Wipro', 'DSA', 'Check for balanced parentheses', 'Medium'),
('Wipro', 'DSA', 'Merge two sorted arrays', 'Medium'),
('Wipro', 'Aptitude', 'Clock angle problem', 'Hard'),
('Wipro', 'Aptitude', 'Calendar problem: What day was...', 'Medium'),
('Wipro', 'SQL', 'Find 3rd highest salary', 'Medium'),
('Wipro', 'SQL', 'Difference between DROP and TRUNCATE', 'Easy'),
('Wipro', 'Core CS', 'What is a Deadlock?', 'Medium'),
('Wipro', 'Core CS', 'Explain Virtual Memory', 'Hard'),

-- Accenture Data
('Accenture', 'DSA', 'Find the largest element in an array', 'Easy'),
('Accenture', 'DSA', 'Remove vowels from a string', 'Easy'),
('Accenture', 'Aptitude', 'Profit and Loss calculation', 'Medium'),
('Accenture', 'Aptitude', 'Average age problem', 'Easy'),
('Accenture', 'SQL', 'Select distinct records', 'Easy'),
('Accenture', 'SQL', 'Group By usage explanation', 'Medium'),
('Accenture', 'Core CS', 'What is Cloud Computing?', 'Easy'),
('Accenture', 'Core CS', 'Explain DNS', 'Medium')
ON CONFLICT DO NOTHING;
