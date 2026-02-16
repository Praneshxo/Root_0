/*
  # Update Quizzes Table with Topic and Difficulty

  1. Changes
    - Add `topic` column to quizzes table (Frontend, Backend, etc.)
    - Add `difficulty` column to quizzes table (Easy, Medium, Hard)
    - These allow organizing quizzes by topic and skill level

  2. Updated Structure
    - Quizzes can now be filtered by topic and difficulty
    - Enables dashboard to show categorized quiz sections
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'quizzes' AND column_name = 'topic'
  ) THEN
    ALTER TABLE quizzes ADD COLUMN topic text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'quizzes' AND column_name = 'difficulty'
  ) THEN
    ALTER TABLE quizzes ADD COLUMN difficulty text DEFAULT 'Medium';
  END IF;
END $$;