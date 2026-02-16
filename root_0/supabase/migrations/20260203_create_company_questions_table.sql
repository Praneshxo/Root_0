-- Create dedicated table for company interview questions
-- This replaces the generic questions table approach with a dedicated table for mass recruitment

-- Create company_interview_questions table
CREATE TABLE IF NOT EXISTS company_interview_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name text NOT NULL,
  question text NOT NULL,
  difficulty text NOT NULL CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
  category text NOT NULL CHECK (category IN ('HR', 'Technical', 'Managerial')),
  created_at timestamptz DEFAULT now()
);

-- Create user progress tracking table for company questions
CREATE TABLE IF NOT EXISTS user_company_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  question_id uuid NOT NULL REFERENCES company_interview_questions(id) ON DELETE CASCADE,
  solved boolean DEFAULT false,
  revision boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, question_id)
);

-- Enable RLS
ALTER TABLE company_interview_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_company_progress ENABLE ROW LEVEL SECURITY;

-- Policies for company_interview_questions (public read)
CREATE POLICY "Anyone can view company interview questions"
  ON company_interview_questions FOR SELECT
  TO authenticated
  USING (true);

-- Policies for user_company_progress (users manage their own)
CREATE POLICY "Users can view own company progress"
  ON user_company_progress FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own company progress"
  ON user_company_progress FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own company progress"
  ON user_company_progress FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Note: No DELETE policy - users cannot delete their progress, only track it

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_company_questions_company ON company_interview_questions(company_name);
CREATE INDEX IF NOT EXISTS idx_company_questions_difficulty ON company_interview_questions(difficulty);
CREATE INDEX IF NOT EXISTS idx_user_company_progress_user ON user_company_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_company_progress_question ON user_company_progress(question_id);

-- Insert sample data for HCL
INSERT INTO company_interview_questions (company_name, question, difficulty, category) VALUES
  ('HCL', 'Why are you interested in this position?', 'Easy', 'HR'),
  ('HCL', 'StringBuffer vs StringBuilder?', 'Easy', 'Technical'),
  ('HCL', 'Are you willing to relocate or travel?', 'Easy', 'HR'),
  ('HCL', 'What are the 4 pillars of OOP?', 'Easy', 'Technical'),
  ('HCL', 'What are your weaknesses?', 'Easy', 'HR'),
  ('HCL', 'Abstract Class vs Interface?', 'Easy', 'Technical'),
  ('HCL', 'What is a Constructor?', 'Easy', 'Technical'),
  ('HCL', 'What is this keyword?', 'Easy', 'Technical'),
  ('HCL', 'What is static keyword?', 'Easy', 'Technical'),
  ('HCL', 'Checked vs Unchecked Exceptions?', 'Easy', 'Technical'),
  ('HCL', 'What is the Collections Framework?', 'Easy', 'Technical'),
  ('HCL', 'Break vs Continue?', 'Easy', 'Technical'),
  ('HCL', 'Difference between == and .equals()?', 'Easy', 'Technical'),
  ('HCL', 'Where do you see yourself in five years?', 'Easy', 'HR'),
  ('HCL', 'What do you know about our company?', 'Easy', 'HR'),
  ('HCL', 'What are your strengths?', 'Easy', 'HR');

-- Insert sample data for other companies
INSERT INTO company_interview_questions (company_name, question, difficulty, category) VALUES
  ('IBM', 'Explain polymorphism with examples', 'Medium', 'Technical'),
  ('IBM', 'What is dependency injection?', 'Medium', 'Technical'),
  ('IBM', 'Describe your leadership experience', 'Medium', 'Managerial'),
  ('IBM', 'How do you handle conflicts in a team?', 'Medium', 'HR'),
  
  ('Cognizant', 'What is your greatest strength?', 'Easy', 'HR'),
  ('Cognizant', 'Explain the SOLID principles', 'Medium', 'Technical'),
  ('Cognizant', 'What motivates you?', 'Easy', 'HR'),
  
  ('Infosys', 'Difference between abstract class and interface', 'Medium', 'Technical'),
  ('Infosys', 'Why do you want to work here?', 'Easy', 'HR'),
  ('Infosys', 'Explain REST API', 'Medium', 'Technical'),
  
  ('TCS', 'What is normalization in databases?', 'Medium', 'Technical'),
  ('TCS', 'Describe a challenging project', 'Medium', 'HR'),
  ('TCS', 'What are your career goals?', 'Easy', 'HR'),
  
  ('Wipro', 'Explain multithreading in Java', 'Hard', 'Technical'),
  ('Wipro', 'How do you prioritize tasks?', 'Medium', 'Managerial'),
  
  ('Tech Mahindra', 'What is Agile methodology?', 'Medium', 'Technical'),
  ('Tech Mahindra', 'Describe your problem-solving approach', 'Medium', 'HR'),
  
  ('Capgemini', 'What is cloud computing?', 'Easy', 'Technical'),
  ('Capgemini', 'Why should we hire you?', 'Easy', 'HR'),
  
  ('Accenture', 'Explain microservices architecture', 'Hard', 'Technical'),
  ('Accenture', 'How do you handle tight deadlines?', 'Medium', 'HR');
