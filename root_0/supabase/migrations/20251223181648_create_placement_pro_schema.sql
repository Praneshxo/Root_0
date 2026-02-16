/*
  # PlacementPro Platform Schema

  ## Overview
  Creates the complete database schema for the PlacementPro placement preparation platform.

  ## New Tables

  1. **companies**
     - `id` (uuid, primary key)
     - `name` (text) - Company name
     - `logo_url` (text) - URL to company logo
     - `category` (text) - Service/Product/Startup
     - `description` (text) - Company description
     - `selection_process` (text) - Detailed selection process
     - `syllabus` (text) - Syllabus/topics covered
     - `created_at` (timestamptz)

  2. **questions**
     - `id` (uuid, primary key)
     - `title` (text) - Question title
     - `category` (text) - DSA/SQL/Aptitude/Core/HR/Technical/Managerial
     - `difficulty` (text) - Easy/Medium/Hard
     - `content` (text) - Question description/content
     - `solution_text` (text) - Solution explanation
     - `is_premium` (boolean) - Premium content flag
     - `company_id` (uuid, nullable) - Reference to company if company-specific
     - `created_at` (timestamptz)

  3. **notes**
     - `id` (uuid, primary key)
     - `title` (text) - Note title
     - `subject` (text) - Subject category (OS/DBMS/CN/etc)
     - `pdf_url` (text) - URL to PDF file
     - `preview_image_url` (text) - Preview thumbnail
     - `created_at` (timestamptz)

  4. **projects**
     - `id` (uuid, primary key)
     - `title` (text) - Project title
     - `tech_stack` (text[]) - Array of technologies
     - `description` (text) - Project description
     - `github_url` (text) - GitHub repository URL
     - `created_at` (timestamptz)

  5. **quizzes**
     - `id` (uuid, primary key)
     - `title` (text) - Quiz title
     - `category` (text) - Quiz category
     - `questions_json` (jsonb) - Questions with options and answers
     - `duration_minutes` (integer) - Quiz duration
     - `created_at` (timestamptz)

  6. **user_progress**
     - `id` (uuid, primary key)
     - `user_id` (uuid) - Reference to auth.users
     - `question_id` (uuid) - Reference to questions
     - `status` (text) - solved/attempted/bookmarked
     - `created_at` (timestamptz)
     - `updated_at` (timestamptz)

  ## Security
  - Enable RLS on all tables
  - Add policies for authenticated users to read all content
  - Add policies for users to manage their own progress
*/

-- Create companies table
CREATE TABLE IF NOT EXISTS companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  logo_url text,
  category text NOT NULL CHECK (category IN ('Service', 'Product', 'Startup')),
  description text,
  selection_process text,
  syllabus text,
  created_at timestamptz DEFAULT now()
);

-- Create questions table
CREATE TABLE IF NOT EXISTS questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  category text NOT NULL CHECK (category IN ('DSA', 'SQL', 'Aptitude', 'Core', 'HR', 'Technical', 'Managerial')),
  difficulty text NOT NULL CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
  content text NOT NULL,
  solution_text text,
  is_premium boolean DEFAULT false,
  company_id uuid REFERENCES companies(id),
  created_at timestamptz DEFAULT now()
);

-- Create notes table
CREATE TABLE IF NOT EXISTS notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  subject text NOT NULL,
  pdf_url text NOT NULL,
  preview_image_url text,
  created_at timestamptz DEFAULT now()
);

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  tech_stack text[] NOT NULL DEFAULT '{}',
  description text,
  github_url text,
  created_at timestamptz DEFAULT now()
);

-- Create quizzes table
CREATE TABLE IF NOT EXISTS quizzes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  category text,
  questions_json jsonb NOT NULL DEFAULT '[]',
  duration_minutes integer DEFAULT 30,
  created_at timestamptz DEFAULT now()
);

-- Create user_progress table
CREATE TABLE IF NOT EXISTS user_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  question_id uuid NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  status text NOT NULL CHECK (status IN ('solved', 'attempted', 'bookmarked')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, question_id)
);

-- Enable RLS
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- Policies for companies (public read)
CREATE POLICY "Anyone can view companies"
  ON companies FOR SELECT
  TO authenticated
  USING (true);

-- Policies for questions (public read)
CREATE POLICY "Authenticated users can view questions"
  ON questions FOR SELECT
  TO authenticated
  USING (true);

-- Policies for notes (public read)
CREATE POLICY "Authenticated users can view notes"
  ON notes FOR SELECT
  TO authenticated
  USING (true);

-- Policies for projects (public read)
CREATE POLICY "Authenticated users can view projects"
  ON projects FOR SELECT
  TO authenticated
  USING (true);

-- Policies for quizzes (public read)
CREATE POLICY "Authenticated users can view quizzes"
  ON quizzes FOR SELECT
  TO authenticated
  USING (true);

-- Policies for user_progress (users manage their own)
CREATE POLICY "Users can view own progress"
  ON user_progress FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress"
  ON user_progress FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
  ON user_progress FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own progress"
  ON user_progress FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_questions_category ON questions(category);
CREATE INDEX IF NOT EXISTS idx_questions_difficulty ON questions(difficulty);
CREATE INDEX IF NOT EXISTS idx_questions_company ON questions(company_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_user ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_question ON user_progress(question_id);