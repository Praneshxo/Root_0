ALTER TABLE public.user_question_tracking ADD COLUMN IF NOT EXISTS revision BOOLEAN DEFAULT FALSE;
