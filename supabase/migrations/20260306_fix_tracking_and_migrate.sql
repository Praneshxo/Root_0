-- 1. Fix user_question_tracking by adding the missing columns
ALTER TABLE public.user_question_tracking ADD COLUMN IF NOT EXISTS revision BOOLEAN DEFAULT FALSE;

-- 2. Drop the old dashboard readiness table that had the wrong column names and recreate it
DROP TABLE IF EXISTS public.user_dashboard_readiness CASCADE;

CREATE TABLE public.user_dashboard_readiness (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    dsa_mastery_pct INTEGER DEFAULT 0,
    sql_mastery_pct INTEGER DEFAULT 0,
    aptitude_mastery_pct INTEGER DEFAULT 0,
    corecs_mastery_pct INTEGER DEFAULT 0,
    overall_readiness_pct INTEGER DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

ALTER TABLE public.user_dashboard_readiness ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own readiness summary" 
ON public.user_dashboard_readiness FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own readiness summary" 
ON public.user_dashboard_readiness FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 3. Recreate the trigger function exactly as expected
CREATE OR REPLACE FUNCTION update_user_dashboard_readiness()
RETURNS TRIGGER AS $$
DECLARE
    total_dsa INTEGER;
    total_sql INTEGER;
    total_aptitude INTEGER;
    total_corecs INTEGER;
    calc_overall INTEGER;
BEGIN
    SELECT 
        COUNT(*) FILTER (WHERE topic = 'dsa' AND (domain_page = TRUE OR companies_page = TRUE)),
        COUNT(*) FILTER (WHERE topic = 'sql' AND (domain_page = TRUE OR companies_page = TRUE)),
        COUNT(*) FILTER (WHERE topic = 'aptitude' AND (domain_page = TRUE OR companies_page = TRUE)),
        COUNT(*) FILTER (WHERE topic = 'corecs' AND (domain_page = TRUE OR companies_page = TRUE))
    INTO total_dsa, total_sql, total_aptitude, total_corecs
    FROM public.user_question_tracking
    WHERE user_id = NEW.user_id;

    calc_overall := (total_dsa + total_sql + total_aptitude + total_corecs) / 2;

    INSERT INTO public.user_dashboard_readiness (
        user_id, dsa_mastery_pct, sql_mastery_pct, aptitude_mastery_pct, corecs_mastery_pct, overall_readiness_pct, updated_at
    ) VALUES (
        NEW.user_id, total_dsa, total_sql, total_aptitude, total_corecs, calc_overall, now()
    )
    ON CONFLICT (user_id) DO UPDATE 
    SET 
        dsa_mastery_pct = EXCLUDED.dsa_mastery_pct,
        sql_mastery_pct = EXCLUDED.sql_mastery_pct,
        aptitude_mastery_pct = EXCLUDED.aptitude_mastery_pct,
        corecs_mastery_pct = EXCLUDED.corecs_mastery_pct,
        overall_readiness_pct = EXCLUDED.overall_readiness_pct,
        updated_at = EXCLUDED.updated_at;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Create trigger
DROP TRIGGER IF EXISTS trigger_update_dashboard_readiness ON public.user_question_tracking;
CREATE TRIGGER trigger_update_dashboard_readiness
AFTER INSERT OR UPDATE ON public.user_question_tracking
FOR EACH ROW EXECUTE FUNCTION update_user_dashboard_readiness();

-- 5. MIGRATE OLD PROGRESS DATA over to the new tracking table
-- This populates the UI so users don't lose their old checkmarks!

-- Migrate from user_progress (DSA / Interview questions)
INSERT INTO public.user_question_tracking (user_id, question_id, topic, domain_page, revision, updated_at)
SELECT user_id, question_id, 'dsa', (status = 'solved'), (status = 'bookmarked'), updated_at
FROM public.user_progress
ON CONFLICT (user_id, question_id) DO UPDATE 
SET 
  domain_page = EXCLUDED.domain_page,
  revision = EXCLUDED.revision;

-- Migrate from user_company_progress
INSERT INTO public.user_question_tracking (user_id, question_id, topic, companies_page, revision, updated_at)
SELECT user_id, question_id, 'unknown', solved, revision, updated_at
FROM public.user_company_progress
ON CONFLICT (user_id, question_id) DO UPDATE 
SET 
  companies_page = EXCLUDED.companies_page,
  revision = EXCLUDED.revision;

-- Migrate from user_sql_progress
INSERT INTO public.user_question_tracking (user_id, question_id, topic, domain_page, revision, updated_at)
SELECT user_id, question_id, 'sql', solved, revision, updated_at
FROM public.user_sql_progress
ON CONFLICT (user_id, question_id) DO UPDATE 
SET 
  domain_page = EXCLUDED.domain_page,
  revision = EXCLUDED.revision;

-- Migrate from user_core_cs_progress
INSERT INTO public.user_question_tracking (user_id, question_id, topic, domain_page, revision, updated_at)
SELECT user_id, question_id, 'corecs', solved, revision, updated_at
FROM public.user_core_cs_progress
ON CONFLICT (user_id, question_id) DO UPDATE 
SET 
  domain_page = EXCLUDED.domain_page,
  revision = EXCLUDED.revision;

-- Migrate from user_aptitude_progress
INSERT INTO public.user_question_tracking (user_id, question_id, topic, domain_page, revision, updated_at)
SELECT user_id, question_id, 'aptitude', solved, revision, updated_at
FROM public.user_aptitude_progress
ON CONFLICT (user_id, question_id) DO UPDATE 
SET 
  domain_page = EXCLUDED.domain_page,
  revision = EXCLUDED.revision;

