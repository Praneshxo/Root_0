-- Create quiz bookmarks table
CREATE TABLE IF NOT EXISTS quiz_bookmarks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  quiz_id uuid NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, quiz_id)
);

-- Enable RLS
ALTER TABLE quiz_bookmarks ENABLE ROW LEVEL SECURITY;

-- Policies for quiz_bookmarks
CREATE POLICY "Users can view own quiz bookmarks"
  ON quiz_bookmarks FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own quiz bookmarks"
  ON quiz_bookmarks FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own quiz bookmarks"
  ON quiz_bookmarks FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create index
CREATE INDEX IF NOT EXISTS idx_quiz_bookmarks_user ON quiz_bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_bookmarks_quiz ON quiz_bookmarks(quiz_id);
