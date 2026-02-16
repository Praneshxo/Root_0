/*
  # Add User Stats and Quiz Results Tables

  1. New Tables
    - `user_stats` - Stores aggregated stats for each user
      - `user_id` (uuid, primary key)
      - `problems_solved` (integer)
      - `study_streak_days` (integer)
      - `total_study_hours` (integer)
      - `last_activity_date` (timestamptz)
      - `updated_at` (timestamptz)

    - `quiz_attempts` - Stores quiz attempt results
      - `id` (uuid, primary key)
      - `user_id` (uuid)
      - `quiz_id` (uuid)
      - `score` (integer) - percentage
      - `total_questions` (integer)
      - `correct_answers` (integer)
      - `time_taken_minutes` (integer)
      - `completed_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for users to manage their own data
*/

-- Create user_stats table
CREATE TABLE IF NOT EXISTS user_stats (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  problems_solved integer DEFAULT 0,
  study_streak_days integer DEFAULT 0,
  total_study_hours integer DEFAULT 0,
  last_activity_date timestamptz,
  updated_at timestamptz DEFAULT now()
);

-- Create quiz_attempts table
CREATE TABLE IF NOT EXISTS quiz_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  quiz_id uuid NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  score integer NOT NULL,
  total_questions integer NOT NULL,
  correct_answers integer NOT NULL,
  time_taken_minutes integer,
  completed_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;

-- Policies for user_stats
CREATE POLICY "Users can view own stats"
  ON user_stats FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own stats"
  ON user_stats FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "System can insert user stats"
  ON user_stats FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policies for quiz_attempts
CREATE POLICY "Users can view own quiz attempts"
  ON quiz_attempts FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert quiz attempts"
  ON quiz_attempts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_user_stats_user ON user_stats(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user ON quiz_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_completed ON quiz_attempts(completed_at);