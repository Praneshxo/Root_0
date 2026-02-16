-- Migration to add content fields to existing question tables
-- Adds fields for explanation text, content type, and structured content data

-- DSA Problems
ALTER TABLE dsa_problems 
ADD COLUMN IF NOT EXISTS explanation_text TEXT,
ADD COLUMN IF NOT EXISTS content_type VARCHAR(50) DEFAULT 'text' CHECK (content_type IN ('image', 'code', 'quiz', 'text')),
ADD COLUMN IF NOT EXISTS content_data JSONB,
ADD COLUMN IF NOT EXISTS has_quiz BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS quiz_data JSONB;

-- SQL Questions
ALTER TABLE sql_questions 
ADD COLUMN IF NOT EXISTS explanation_text TEXT,
ADD COLUMN IF NOT EXISTS content_type VARCHAR(50) DEFAULT 'code' CHECK (content_type IN ('image', 'code', 'quiz', 'text')),
ADD COLUMN IF NOT EXISTS content_data JSONB,
ADD COLUMN IF NOT EXISTS has_quiz BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS quiz_data JSONB;

-- Aptitude Questions
ALTER TABLE aptitude_questions 
ADD COLUMN IF NOT EXISTS explanation_text TEXT,
ADD COLUMN IF NOT EXISTS content_type VARCHAR(50) DEFAULT 'text' CHECK (content_type IN ('image', 'code', 'quiz', 'text')),
ADD COLUMN IF NOT EXISTS content_data JSONB,
ADD COLUMN IF NOT EXISTS has_quiz BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS quiz_data JSONB;

-- Core CS Questions
ALTER TABLE core_cs_questions 
ADD COLUMN IF NOT EXISTS explanation_text TEXT,
ADD COLUMN IF NOT EXISTS content_type VARCHAR(50) DEFAULT 'text' CHECK (content_type IN ('image', 'code', 'quiz', 'text')),
ADD COLUMN IF NOT EXISTS content_data JSONB,
ADD COLUMN IF NOT EXISTS has_quiz BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS quiz_data JSONB;

-- Interview Questions (questions table)
ALTER TABLE questions 
ADD COLUMN IF NOT EXISTS explanation_text TEXT,
ADD COLUMN IF NOT EXISTS content_type VARCHAR(50) DEFAULT 'text' CHECK (content_type IN ('image', 'code', 'quiz', 'text')),
ADD COLUMN IF NOT EXISTS content_data JSONB,
ADD COLUMN IF NOT EXISTS has_quiz BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS quiz_data JSONB;

-- Add comments for documentation
COMMENT ON COLUMN dsa_problems.explanation_text IS 'Detailed explanation shown in left panel of detail view';
COMMENT ON COLUMN dsa_problems.content_type IS 'Type of content to display in right panel: image, code, quiz, or text';
COMMENT ON COLUMN dsa_problems.content_data IS 'Structured data for the content (image URL, code snippet, etc.)';
COMMENT ON COLUMN dsa_problems.has_quiz IS 'Whether this question includes an interactive quiz';
COMMENT ON COLUMN dsa_problems.quiz_data IS 'Quiz question, options, and correct answer in JSON format';

-- Example quiz_data structure:
-- {
--   "question": "What is the time complexity?",
--   "options": ["O(n)", "O(log n)", "O(n²)", "O(1)"],
--   "correctAnswer": 1,
--   "explanation": "Explanation of the correct answer"
-- }

-- Example content_data structure for code:
-- {
--   "language": "javascript",
--   "code": "function example() { return 'hello'; }",
--   "caption": "Example implementation"
-- }

-- Example content_data structure for image:
-- {
--   "url": "/images/example.png",
--   "alt": "Example diagram",
--   "caption": "Visual representation"
-- }
