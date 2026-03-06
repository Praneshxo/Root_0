-- Clean slate setup for user_question_tracking and user_dashboard_readiness
-- Ensure UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Drop existing objects to avoid conflicts
DROP TRIGGER IF EXISTS trigger_update_dashboard_readiness ON public.user_question_tracking;
DROP FUNCTION IF EXISTS public.update_user_dashboard_readiness CASCADE;
DROP TABLE IF EXISTS public.user_dashboard_readiness CASCADE;
DROP TABLE IF EXISTS public.user_question_tracking CASCADE;

-- 2. Create the unified tracking table 
CREATE TABLE public.user_question_tracking (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    question_id TEXT NOT NULL,
    topic TEXT NOT NULL, -- e.g., 'dsa', 'sql', 'aptitude', 'corecs', 'interview'
    companies_page BOOLEAN DEFAULT FALSE,
    domain_page BOOLEAN DEFAULT FALSE,
    revision BOOLEAN DEFAULT FALSE, -- Allows bookmarking
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    UNIQUE(user_id, question_id)
);

-- Enable RLS for tracking
ALTER TABLE public.user_question_tracking ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own tracking" 
ON public.user_question_tracking FOR ALL TO authenticated 
USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 3. Create the dashboard readiness table
CREATE TABLE public.user_dashboard_readiness (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    dsa_mastery_pct INTEGER DEFAULT 0,
    sql_mastery_pct INTEGER DEFAULT 0,
    aptitude_mastery_pct INTEGER DEFAULT 0,
    corecs_mastery_pct INTEGER DEFAULT 0,
    overall_readiness_pct INTEGER DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- Enable RLS for readiness
ALTER TABLE public.user_dashboard_readiness ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own readiness summary" 
ON public.user_dashboard_readiness FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own readiness summary" 
ON public.user_dashboard_readiness FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 4. Create trigger to automatically calculate metrics 
CREATE OR REPLACE FUNCTION update_user_dashboard_readiness()
RETURNS TRIGGER AS $$
DECLARE
    total_dsa INTEGER;
    total_sql INTEGER;
    total_aptitude INTEGER;
    total_corecs INTEGER;
    calc_overall INTEGER;
BEGIN
    -- We assume standard topics: dsa, sql, aptitude, corecs
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

-- 5. Create Trigger Hook
CREATE TRIGGER trigger_update_dashboard_readiness
AFTER INSERT OR UPDATE ON public.user_question_tracking
FOR EACH ROW EXECUTE FUNCTION update_user_dashboard_readiness();
