-- ============================================================
-- FIX: Row Level Security (RLS) policies for user_question_tracking
-- Run this in your Supabase SQL Editor
-- ============================================================

-- Step 1: Drop ALL existing policies on the table to start fresh
DROP POLICY IF EXISTS "Users can manage their own tracking" ON public.user_question_tracking;
DROP POLICY IF EXISTS "Users can insert their own tracking" ON public.user_question_tracking;
DROP POLICY IF EXISTS "Users can update their own tracking" ON public.user_question_tracking;
DROP POLICY IF EXISTS "Users can select their own tracking" ON public.user_question_tracking;
DROP POLICY IF EXISTS "Users can delete their own tracking" ON public.user_question_tracking;

-- Step 2: Make sure RLS is enabled
ALTER TABLE public.user_question_tracking ENABLE ROW LEVEL SECURITY;

-- Step 3: Create SEPARATE policies for each operation (more reliable than "FOR ALL")
CREATE POLICY "tracking_select_own" 
ON public.user_question_tracking 
FOR SELECT TO authenticated 
USING (auth.uid() = user_id);

CREATE POLICY "tracking_insert_own" 
ON public.user_question_tracking 
FOR INSERT TO authenticated 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "tracking_update_own" 
ON public.user_question_tracking 
FOR UPDATE TO authenticated 
USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "tracking_delete_own" 
ON public.user_question_tracking 
FOR DELETE TO authenticated 
USING (auth.uid() = user_id);

-- Step 4: Verify the table structure is correct
-- If any of these columns are missing, the upsert will fail
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'user_question_tracking' 
        AND column_name = 'domain_page'
    ) THEN
        ALTER TABLE public.user_question_tracking ADD COLUMN domain_page BOOLEAN DEFAULT FALSE;
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'user_question_tracking' 
        AND column_name = 'companies_page'
    ) THEN
        ALTER TABLE public.user_question_tracking ADD COLUMN companies_page BOOLEAN DEFAULT FALSE;
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'user_question_tracking' 
        AND column_name = 'revision'
    ) THEN
        ALTER TABLE public.user_question_tracking ADD COLUMN revision BOOLEAN DEFAULT FALSE;
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'user_question_tracking' 
        AND column_name = 'topic'
    ) THEN
        ALTER TABLE public.user_question_tracking ADD COLUMN topic TEXT;
    END IF;
END $$;

-- Step 5: Ensure the unique constraint exists for upsert to work
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE table_schema = 'public' 
        AND table_name = 'user_question_tracking' 
        AND constraint_type = 'UNIQUE'
        AND constraint_name LIKE '%user_id%question_id%'
    ) THEN
        ALTER TABLE public.user_question_tracking 
        ADD CONSTRAINT user_question_tracking_user_id_question_id_key 
        UNIQUE (user_id, question_id);
    END IF;
END $$;

-- Done! Test the fix with a quick select:
SELECT COUNT(*) as row_count FROM public.user_question_tracking;
