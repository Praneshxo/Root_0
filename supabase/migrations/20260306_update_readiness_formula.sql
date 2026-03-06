-- ============================================================
-- UPDATE: Overall Readiness Formula v2
-- New formula:
--   readiness% = ((dsa + sql + aptitude + corecs + companies_page) / 2) / total_questions * 100
--
-- Where total_questions =
--   (COUNT(company_topic_questions) * 2) - (COUNT of HR + Technical from 'questions' table)
--
-- Run this in your Supabase SQL Editor
-- ============================================================

-- Step 1: Create a static cache table for question counts
-- (so the trigger doesn't re-count huge tables every time a user solves a question)
CREATE TABLE IF NOT EXISTS public.app_question_counts (
    id INTEGER PRIMARY KEY DEFAULT 1,
    total_company_topic_q INTEGER DEFAULT 0,       -- COUNT of all rows in company_topic_questions
    total_interview_q INTEGER DEFAULT 0,            -- COUNT of HR + Technical in questions table
    total_effective_q INTEGER DEFAULT 0,            -- (total_company_topic_q * 2) - total_interview_q
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT Now(),
    CONSTRAINT single_row CHECK (id = 1)            -- ensures only 1 row ever
);

-- Enable RLS (allow everyone to read, no one to manually write)
ALTER TABLE public.app_question_counts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anyone_can_read_counts" ON public.app_question_counts;
CREATE POLICY "anyone_can_read_counts"
ON public.app_question_counts FOR SELECT TO authenticated USING (true);

-- Step 2: Compute and cache the question counts NOW
-- This populates or replaces the single row in the cache
INSERT INTO public.app_question_counts (id, total_company_topic_q, total_interview_q, total_effective_q, updated_at)
SELECT
    1 AS id,
    ctq.total AS total_company_topic_q,
    iq.total  AS total_interview_q,
    GREATEST(1, (ctq.total * 2) - iq.total)  AS total_effective_q,
    NOW()     AS updated_at
FROM
    (SELECT COUNT(*)::INTEGER AS total FROM public.company_topic_questions) AS ctq,
    (SELECT COUNT(*)::INTEGER AS total FROM public.questions 
     WHERE category IN ('HR', 'Technical', 'Managerial')) AS iq
ON CONFLICT (id) DO UPDATE
    SET total_company_topic_q = EXCLUDED.total_company_topic_q,
        total_interview_q     = EXCLUDED.total_interview_q,
        total_effective_q     = EXCLUDED.total_effective_q,
        updated_at            = EXCLUDED.updated_at;

-- Verify the counts were stored
SELECT * FROM public.app_question_counts;

-- Step 3: Add companies_mastery_pct column if missing
ALTER TABLE public.user_dashboard_readiness
ADD COLUMN IF NOT EXISTS companies_mastery_pct INTEGER DEFAULT 0;

-- Step 4: Drop and recreate the trigger function with the new formula
DROP TRIGGER IF EXISTS trigger_update_dashboard_readiness ON public.user_question_tracking;
DROP FUNCTION IF EXISTS public.update_user_dashboard_readiness CASCADE;

CREATE OR REPLACE FUNCTION update_user_dashboard_readiness()
RETURNS TRIGGER AS $$
DECLARE
    -- Solved counts per domain from user_question_tracking
    cnt_dsa        INTEGER;
    cnt_sql        INTEGER;
    cnt_aptitude   INTEGER;
    cnt_corecs     INTEGER;
    cnt_companies  INTEGER;

    -- Cached total (from app_question_counts)
    total_q        INTEGER;

    -- Calculated values
    sum_solved     INTEGER;
    readiness_pct  INTEGER;
BEGIN
    -- --- 1. Count solved questions per topic for this user ---
    SELECT
        COUNT(*) FILTER (WHERE topic = 'dsa'      AND domain_page    = TRUE),
        COUNT(*) FILTER (WHERE topic = 'sql'      AND domain_page    = TRUE),
        COUNT(*) FILTER (WHERE topic = 'aptitude' AND domain_page    = TRUE),
        COUNT(*) FILTER (WHERE topic = 'corecs'   AND domain_page    = TRUE),
        COUNT(*) FILTER (WHERE companies_page = TRUE)
    INTO cnt_dsa, cnt_sql, cnt_aptitude, cnt_corecs, cnt_companies
    FROM public.user_question_tracking
    WHERE user_id = NEW.user_id;

    -- --- 2. Get the cached total question denominator ---
    SELECT COALESCE(total_effective_q, 1) INTO total_q
    FROM public.app_question_counts
    WHERE id = 1;

    -- Fallback: if cache row missing, default to 1 (not 0) to avoid division by zero
    IF total_q IS NULL OR total_q = 0 THEN
        total_q := 1;
    END IF;

    -- --- 3. Apply the formula ---
    -- numerator: ((dsa + sql + aptitude + corecs + companies) / 2)
    -- denominator: total_effective_q
    sum_solved := cnt_dsa + cnt_sql + cnt_aptitude + cnt_corecs + cnt_companies;
    readiness_pct := LEAST(100, ROUND( ((sum_solved::NUMERIC / 2.0) / total_q::NUMERIC) * 100 )::INTEGER);

    -- --- 4. Upsert into dashboard readiness ---
    INSERT INTO public.user_dashboard_readiness (
        user_id,
        dsa_mastery_pct,
        sql_mastery_pct,
        aptitude_mastery_pct,
        corecs_mastery_pct,
        companies_mastery_pct,
        overall_readiness_pct,
        updated_at
    ) VALUES (
        NEW.user_id,
        cnt_dsa,
        cnt_sql,
        cnt_aptitude,
        cnt_corecs,
        cnt_companies,
        readiness_pct,
        NOW()
    )
    ON CONFLICT (user_id) DO UPDATE SET
        dsa_mastery_pct       = EXCLUDED.dsa_mastery_pct,
        sql_mastery_pct       = EXCLUDED.sql_mastery_pct,
        aptitude_mastery_pct  = EXCLUDED.aptitude_mastery_pct,
        corecs_mastery_pct    = EXCLUDED.corecs_mastery_pct,
        companies_mastery_pct = EXCLUDED.companies_mastery_pct,
        overall_readiness_pct = EXCLUDED.overall_readiness_pct,
        updated_at            = EXCLUDED.updated_at;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 5: Recreate the trigger
CREATE TRIGGER trigger_update_dashboard_readiness
AFTER INSERT OR UPDATE ON public.user_question_tracking
FOR EACH ROW EXECUTE FUNCTION update_user_dashboard_readiness();

-- Step 6: Backfill - recalculate readiness for ALL users who already have tracking data
-- This fires the formula once for all existing data by touching each user's latest row
DO $$
DECLARE
    u RECORD;
BEGIN
    FOR u IN SELECT DISTINCT user_id FROM public.user_question_tracking LOOP
        UPDATE public.user_question_tracking
        SET updated_at = NOW()
        WHERE user_id = u.user_id
          AND id = (
              SELECT id FROM public.user_question_tracking 
              WHERE user_id = u.user_id 
              ORDER BY updated_at DESC 
              LIMIT 1
          );
    END LOOP;
END $$;

-- Verify final readiness values
SELECT user_id, dsa_mastery_pct, sql_mastery_pct, aptitude_mastery_pct, 
       corecs_mastery_pct, companies_mastery_pct, overall_readiness_pct 
FROM public.user_dashboard_readiness;
