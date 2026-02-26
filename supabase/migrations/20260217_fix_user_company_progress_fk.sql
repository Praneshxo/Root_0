-- Fix user_company_progress to support both company_interview_questions and company_topic_questions
-- The foreign key constraint was preventing progress tracking for topic questions (Aptitude, DSA, SQL, Core CS)

-- Drop the existing foreign key constraint
ALTER TABLE user_company_progress 
DROP CONSTRAINT IF EXISTS user_company_progress_question_id_fkey;

-- Change question_id to accept UUIDs from any table (not just company_interview_questions)
-- This allows tracking progress for both interview questions and topic questions
-- The application logic ensures only valid question IDs are used

-- Note: We keep the NOT NULL constraint but remove the foreign key reference
-- This is acceptable because:
-- 1. The application validates question IDs before inserting
-- 2. Both source tables (company_interview_questions and company_topic_questions) use UUIDs
-- 3. Orphaned records are cleaned up by application logic if needed
