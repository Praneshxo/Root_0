-- User Note Bookmarks Schema

-- Table: user_note_bookmarks
-- Tracks which notes users have bookmarked
CREATE TABLE IF NOT EXISTS user_note_bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  note_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, note_id)
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_user_note_bookmarks_user_id ON user_note_bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_user_note_bookmarks_note_id ON user_note_bookmarks(note_id);

-- Enable Row Level Security
ALTER TABLE user_note_bookmarks ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own bookmarks" ON user_note_bookmarks;
DROP POLICY IF EXISTS "Users can insert their own bookmarks" ON user_note_bookmarks;
DROP POLICY IF EXISTS "Users can delete their own bookmarks" ON user_note_bookmarks;

-- RLS Policies for user_note_bookmarks (user-specific)
CREATE POLICY "Users can view their own bookmarks"
  ON user_note_bookmarks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own bookmarks"
  ON user_note_bookmarks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bookmarks"
  ON user_note_bookmarks FOR DELETE
  USING (auth.uid() = user_id);
