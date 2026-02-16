-- User Project Bookmarks Schema

-- Table: user_project_bookmarks
-- Tracks which projects users have bookmarked
CREATE TABLE IF NOT EXISTS user_project_bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, project_id)
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_user_project_bookmarks_user_id ON user_project_bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_user_project_bookmarks_project_id ON user_project_bookmarks(project_id);

-- Enable Row Level Security
ALTER TABLE user_project_bookmarks ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own project bookmarks" ON user_project_bookmarks;
DROP POLICY IF EXISTS "Users can insert their own project bookmarks" ON user_project_bookmarks;
DROP POLICY IF EXISTS "Users can delete their own project bookmarks" ON user_project_bookmarks;

-- RLS Policies for user_project_bookmarks (user-specific)
CREATE POLICY "Users can view their own project bookmarks"
  ON user_project_bookmarks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own project bookmarks"
  ON user_project_bookmarks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own project bookmarks"
  ON user_project_bookmarks FOR DELETE
  USING (auth.uid() = user_id);
