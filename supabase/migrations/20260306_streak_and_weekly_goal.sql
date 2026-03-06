-- ============================================================
-- Daily Streak & Weekly Goal System
-- Run this in your Supabase SQL Editor
-- ============================================================

-- Step 1: Create the user_streak table
CREATE TABLE IF NOT EXISTS public.user_streak (
    user_id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    current_streak   INTEGER NOT NULL DEFAULT 0,
    longest_streak   INTEGER NOT NULL DEFAULT 0,
    last_solved_date DATE,                           -- UTC date of last solve
    weekly_count     INTEGER NOT NULL DEFAULT 0,     -- questions solved this week
    week_start_date  DATE,                           -- the Monday that started the current week
    updated_at       TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 2: RLS
ALTER TABLE public.user_streak ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "streak_select_own" ON public.user_streak;
DROP POLICY IF EXISTS "streak_insert_own" ON public.user_streak;
DROP POLICY IF EXISTS "streak_update_own" ON public.user_streak;

CREATE POLICY "streak_select_own"
ON public.user_streak FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "streak_insert_own"
ON public.user_streak FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "streak_update_own"
ON public.user_streak FOR UPDATE TO authenticated
USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Step 3: Trigger function — runs after every solved question
DROP TRIGGER IF EXISTS trigger_update_user_streak ON public.user_question_tracking;
DROP FUNCTION IF EXISTS public.update_user_streak CASCADE;

CREATE OR REPLACE FUNCTION public.update_user_streak()
RETURNS TRIGGER AS $$
DECLARE
    today             DATE := CURRENT_DATE;
    current_week_mon  DATE := DATE_TRUNC('week', today)::DATE;  -- ISO week: Monday
    existing          RECORD;
    new_streak        INTEGER;
    new_longest       INTEGER;
    new_weekly        INTEGER;
BEGIN
    -- Only track rows where something is actually "solved"
    -- (domain_page or companies_page must be true)
    IF NOT (NEW.domain_page = TRUE OR NEW.companies_page = TRUE) THEN
        RETURN NEW;
    END IF;

    -- Fetch existing streak row for this user
    SELECT * INTO existing FROM public.user_streak WHERE user_id = NEW.user_id;

    IF NOT FOUND THEN
        -- First ever solve for this user
        INSERT INTO public.user_streak (
            user_id, current_streak, longest_streak,
            last_solved_date, weekly_count, week_start_date, updated_at
        ) VALUES (
            NEW.user_id, 1, 1,
            today, 1, current_week_mon, NOW()
        );
        RETURN NEW;
    END IF;

    -- ── Streak calculation ──────────────────────────────────────────
    IF existing.last_solved_date = today THEN
        -- Already solved today: streak unchanged
        new_streak := existing.current_streak;
    ELSIF existing.last_solved_date = today - INTERVAL '1 day' THEN
        -- Solved yesterday: extend streak
        new_streak := existing.current_streak + 1;
    ELSE
        -- Missed a day (or more): reset streak
        new_streak := 1;
    END IF;

    new_longest := GREATEST(new_streak, existing.longest_streak);

    -- ── Weekly count calculation ────────────────────────────────────
    IF existing.week_start_date = current_week_mon THEN
        -- Same week: only increment if not already counted today
        IF existing.last_solved_date = today THEN
            new_weekly := existing.weekly_count;  -- already counted today
        ELSE
            new_weekly := existing.weekly_count + 1;
        END IF;
    ELSE
        -- New week: reset to 1
        new_weekly := 1;
    END IF;

    -- ── Upsert the result ───────────────────────────────────────────
    UPDATE public.user_streak SET
        current_streak   = new_streak,
        longest_streak   = new_longest,
        last_solved_date = today,
        weekly_count     = new_weekly,
        week_start_date  = current_week_mon,
        updated_at       = NOW()
    WHERE user_id = NEW.user_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 4: Attach the trigger
CREATE TRIGGER trigger_update_user_streak
AFTER INSERT OR UPDATE ON public.user_question_tracking
FOR EACH ROW EXECUTE FUNCTION public.update_user_streak();

-- Step 5: Backfill — initialize streak rows for all users who have solved questions
INSERT INTO public.user_streak (
    user_id, current_streak, longest_streak,
    last_solved_date, weekly_count, week_start_date, updated_at
)
SELECT
    user_id,
    1 AS current_streak,
    1 AS longest_streak,
    MAX(updated_at::DATE) AS last_solved_date,
    COUNT(*) FILTER (
        WHERE updated_at::DATE >= DATE_TRUNC('week', CURRENT_DATE)::DATE
        AND (domain_page = TRUE OR companies_page = TRUE)
    )::INTEGER AS weekly_count,
    DATE_TRUNC('week', CURRENT_DATE)::DATE AS week_start_date,
    NOW()
FROM public.user_question_tracking
WHERE domain_page = TRUE OR companies_page = TRUE
GROUP BY user_id
ON CONFLICT (user_id) DO NOTHING;

-- Verify
SELECT user_id, current_streak, longest_streak, last_solved_date,
       weekly_count, week_start_date
FROM public.user_streak;
