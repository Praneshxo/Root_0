-- Create table for categorized company questions (DSA, Aptitude, SQL, Core CS)
CREATE TABLE IF NOT EXISTS company_topic_questions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  company_name TEXT NOT NULL,
  topic TEXT NOT NULL CHECK (topic IN ('DSA', 'Aptitude', 'SQL', 'Core CS')),
  question TEXT NOT NULL,
  difficulty TEXT CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE company_topic_questions ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access" ON company_topic_questions
  FOR SELECT USING (true);

-- Create index for faster filtering
CREATE INDEX IF NOT EXISTS idx_company_topic_questions_company_topic 
ON company_topic_questions(company_name, topic);

-- Insert sample data for HCL (active company in demo)
INSERT INTO company_topic_questions (company_name, topic, question, difficulty) VALUES
-- HCL DSA
('HCL', 'DSA', 'Reverse a linked list', 'Easy'),
('HCL', 'DSA', 'Find the missing number in an array', 'Easy'),
('HCL', 'DSA', 'Binary Search implementation', 'Medium'),
-- HCL Aptitude
('HCL', 'Aptitude', 'Train A moves at 60km/h...', 'Medium'),
('HCL', 'Aptitude', 'Work and Time problem: A can do work in 10 days...', 'Easy'),
-- HCL SQL
('HCL', 'SQL', 'Select second highest salary from Employee table', 'Medium'),
('HCL', 'SQL', 'Explain INNER JOIN vs LEFT JOIN', 'Easy'),
-- HCL Core CS
('HCL', 'Core CS', 'What is the difference between Process and Thread?', 'Medium'),
('HCL', 'Core CS', 'Explain ACID properties in DBMS', 'Medium');

-- Insert sample data for TCS
INSERT INTO company_topic_questions (company_name, topic, question, difficulty) VALUES
('TCS', 'DSA', 'Detect cycle in a graph', 'Hard'),
('TCS', 'SQL', 'Find employees joined in last month', 'Easy');
