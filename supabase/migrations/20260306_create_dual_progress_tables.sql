-- Enable UUID extension if not present
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Create the detailed tracking table
CREATE TABLE IF NOT EXISTS public.user_question_tracking (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    question_id TEXT NOT NULL,
    topic TEXT NOT NULL, -- e.g., 'dsa', 'sql', 'aptitude', 'corecs'
    companies_page BOOLEAN DEFAULT FALSE,
    domain_page BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    UNIQUE(user_id, question_id)
);

-- Enable RLS for tracking table
ALTER TABLE public.user_question_tracking ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own question tracking" 
ON public.user_question_tracking
FOR ALL 
TO authenticated 
USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);


-- 2. Create the dashboard readiness summary table
CREATE TABLE IF NOT EXISTS public.user_dashboard_readiness (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    dsa_percentage INTEGER DEFAULT 0,
    sql_percentage INTEGER DEFAULT 0,
    aptitude_percentage INTEGER DEFAULT 0,
    corecs_percentage INTEGER DEFAULT 0,
    overall_readiness INTEGER DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- Enable RLS for readiness table
ALTER TABLE public.user_dashboard_readiness ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own readiness summary" 
ON public.user_dashboard_readiness
FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);

-- Wait, triggers execute as the user, so the trigger needs permission to update this table for the user
CREATE POLICY "Users can update their own readiness summary" 
ON public.user_dashboard_readiness
FOR ALL 
TO authenticated 
USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);


-- 3. Create the Trigger Function to calculate percentages automatically
-- We assume a fixed denominator for percentage, but it's better to dynamically calculate based on the total questions in each topic OR just store the raw counts and divide.
-- The user requested: "overall readiness which should get the total questions solved in (dsa+sql+aptitude+core cs) divided by 2"
-- "get the percentage of questions solved"
-- Since we don't dynamically know the exact total number of questions ever available in the topic from this trigger without joining `questions` table, 
-- we will just store the counts of solved questions right now, and let the dashboard do the simple division, OR we can hardcode the totals if known.
-- Wait, the user said: "get the percentage of questions solved: so this table two which has the only the value of the percentage".

-- I will write a function that calculates total solved (where domain_page = true OR companies_page = true)
CREATE OR REPLACE FUNCTION update_user_dashboard_readiness()
RETURNS TRIGGER AS $$
DECLARE
    total_dsa INTEGER;
    total_sql INTEGER;
    total_aptitude INTEGER;
    total_corecs INTEGER;
    calc_overall INTEGER;
BEGIN
    -- Calculate how many distinct questions were solved per topic for this user
    -- We consider it "solved" if solved_in_domain OR solved_in_company is true
    SELECT 
        COUNT(*) FILTER (WHERE topic = 'dsa' AND (domain_page = TRUE OR companies_page = TRUE)),
        COUNT(*) FILTER (WHERE topic = 'sql' AND (domain_page = TRUE OR companies_page = TRUE)),
        COUNT(*) FILTER (WHERE topic = 'aptitude' AND (domain_page = TRUE OR companies_page = TRUE)),
        COUNT(*) FILTER (WHERE topic = 'corecs' AND (domain_page = TRUE OR companies_page = TRUE))
    INTO total_dsa, total_sql, total_aptitude, total_corecs
    FROM public.user_question_tracking
    WHERE user_id = NEW.user_id;

    -- As per user: overall readiness is (dsa + sql + aptitude + corecs) / 2
    calc_overall := (total_dsa + total_sql + total_aptitude + total_corecs) / 2;

    -- Upsert into the readiness table
    INSERT INTO public.user_dashboard_readiness (
        user_id, 
        dsa_percentage, 
        sql_percentage, 
        aptitude_percentage, 
        corecs_percentage, 
        overall_readiness,
        updated_at
    ) 
    VALUES (
        NEW.user_id, 
        total_dsa, 
        total_sql, 
        total_aptitude, 
        total_corecs, 
        calc_overall,
        now()
    )
    ON CONFLICT (user_id) DO UPDATE 
    SET 
        dsa_percentage = EXCLUDED.dsa_percentage,
        sql_percentage = EXCLUDED.sql_percentage,
        aptitude_percentage = EXCLUDED.aptitude_percentage,
        corecs_percentage = EXCLUDED.corecs_percentage,
        overall_readiness = EXCLUDED.overall_readiness,
        updated_at = EXCLUDED.updated_at;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Create the Trigger on the tracking table
DROP TRIGGER IF EXISTS trigger_update_dashboard_readiness ON public.user_question_tracking;

CREATE TRIGGER trigger_update_dashboard_readiness
AFTER INSERT OR UPDATE ON public.user_question_tracking
FOR EACH ROW
EXECUTE FUNCTION update_user_dashboard_readiness();
