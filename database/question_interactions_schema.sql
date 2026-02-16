-- Question Interactions Tracking Table
-- Tracks user interactions with questions for progress monitoring

CREATE TABLE IF NOT EXISTS question_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  question_id UUID NOT NULL,
  question_type VARCHAR(50) NOT NULL CHECK (question_type IN ('dsa', 'sql', 'aptitude', 'corecs', 'interview')),
  
  -- Tracking fields
  viewed_at TIMESTAMPTZ DEFAULT NOW(),
  time_spent INTEGER DEFAULT 0, -- in seconds
  quiz_completed BOOLEAN DEFAULT FALSE,
  interaction_completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Ensure one record per user per question
  UNIQUE(user_id, question_id, question_type)
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_question_interactions_user ON question_interactions(user_id);
CREATE INDEX IF NOT EXISTS idx_question_interactions_question ON question_interactions(question_id, question_type);
CREATE INDEX IF NOT EXISTS idx_question_interactions_completed ON question_interactions(user_id, interaction_completed);

-- Enable Row Level Security
ALTER TABLE question_interactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own interactions"
  ON question_interactions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own interactions"
  ON question_interactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own interactions"
  ON question_interactions FOR UPDATE
  USING (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_question_interactions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
CREATE TRIGGER update_question_interactions_timestamp
  BEFORE UPDATE ON question_interactions
  FOR EACH ROW
  EXECUTE FUNCTION update_question_interactions_updated_at();
