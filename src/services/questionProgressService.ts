import { supabase } from '../lib/supabase';

export type QuestionType = 'dsa' | 'sql' | 'aptitude' | 'corecs' | 'interview';

export interface QuestionInteraction {
    id: string;
    user_id: string;
    question_id: string;
    question_type: QuestionType;
    viewed_at: string;
    time_spent: number;
    quiz_completed: boolean;
    interaction_completed: boolean;
    completed_at: string | null;
    created_at: string;
    updated_at: string;
}

export interface QuestionProgress {
    viewed: boolean;
    timeSpent: number;
    quizCompleted: boolean;
    interactionCompleted: boolean;
    canMarkAsSolved: boolean;
}

/**
 * Track when a user views a question.
 * Inserts a row if it doesn't exist yet (does NOT touch domain_page/companies_page).
 */
export async function trackView(
    userId: string,
    questionId: string,
    questionType: QuestionType
): Promise<void> {
    try {
        // Only insert if the row doesn't already exist — never overwrite solved flags
        const { error } = await supabase
            .from('user_question_tracking')
            .upsert(
                {
                    user_id: userId,
                    question_id: questionId,
                    topic: questionType === 'interview' ? 'interview' : questionType,
                    updated_at: new Date().toISOString(),
                },
                {
                    onConflict: 'user_id,question_id',
                    ignoreDuplicates: true,   // Don't overwrite existing rows (so solved flags stay intact)
                }
            );

        if (error) {
            console.error('Error tracking view:', error);
        }
    } catch (error) {
        console.error('Error tracking view:', error);
    }
}

/**
 * Update time spent on a question (stubbed — schema removed time tracking).
 */
export async function updateTimeSpent(
    _userId: string,
    _questionId: string,
    _questionType: QuestionType,
    _additionalSeconds: number
): Promise<void> {
    return Promise.resolve();
}

/**
 * Mark quiz as completed (sets domain_page = true via explicit UPDATE).
 */
export async function markQuizCompleted(
    userId: string,
    questionId: string,
    questionType: QuestionType
): Promise<void> {
    try {
        await ensureTrackingRow(userId, questionId, questionType);

        const { error } = await supabase
            .from('user_question_tracking')
            .update({
                domain_page: true,
                updated_at: new Date().toISOString(),
            })
            .eq('user_id', userId)
            .eq('question_id', questionId);

        if (error) {
            console.error('Error marking quiz completed:', error);
        }
    } catch (error) {
        console.error('Error marking quiz completed:', error);
    }
}

/**
 * Mark interaction as completed for domain questions (sets domain_page = true).
 */
export async function markInteractionCompleted(
    userId: string,
    questionId: string,
    questionType: QuestionType
): Promise<void> {
    try {
        await ensureTrackingRow(userId, questionId, questionType);

        const { error } = await supabase
            .from('user_question_tracking')
            .update({
                domain_page: true,
                updated_at: new Date().toISOString(),
            })
            .eq('user_id', userId)
            .eq('question_id', questionId);

        if (error) throw error;
    } catch (error) {
        console.error('Error marking interaction completed:', error);
        throw error;
    }
}

/**
 * Check if user can mark question as solved.
 */
export async function canMarkAsSolved(
    userId: string,
    questionId: string,
    _questionType: QuestionType,
    _hasQuiz: boolean
): Promise<boolean> {
    try {
        const { data, error } = await supabase
            .from('user_question_tracking')
            .select('domain_page, companies_page')
            .eq('user_id', userId)
            .eq('question_id', questionId)
            .single();

        if (error && error.code !== 'PGRST116') {
            console.error('Error checking if can mark as solved:', error);
            return false;
        }

        return !!(data?.domain_page || data?.companies_page);
    } catch (error) {
        console.error('Error checking if can mark as solved:', error);
        return false;
    }
}

/**
 * Mark question as solved in user_question_tracking (domain_page = true).
 * Uses an explicit UPDATE after ensuring the row exists, to avoid RLS upsert issues.
 */
export async function markAsSolved(
    userId: string,
    questionId: string,
    questionType: QuestionType
): Promise<void> {
    console.log(`[questionProgressService] markAsSolved called with:`, { userId, questionId, questionType });

    try {
        // Step 1: Ensure the row exists
        await ensureTrackingRow(userId, questionId, questionType);

        // Step 2: Explicitly UPDATE domain_page to true
        const { error, data } = await supabase
            .from('user_question_tracking')
            .update({
                domain_page: true,
                updated_at: new Date().toISOString(),
            })
            .eq('user_id', userId)
            .eq('question_id', questionId)
            .select();

        console.log(`[questionProgressService] UPDATE returned:`, { error, data });

        if (error) {
            console.error('[questionProgressService] UPDATE error:', error);
            throw error;
        }

        if (!data || data.length === 0) {
            console.error('[questionProgressService] UPDATE matched 0 rows!');
            throw new Error('Could not update tracking row — 0 rows matched.');
        }
    } catch (error) {
        console.error('[questionProgressService] Error marking as solved:', error);
        throw error;
    }
}

/**
 * Mark a company question as solved (companies_page = true).
 * Uses an explicit UPDATE after ensuring the row exists.
 */
export async function markCompanySolved(
    userId: string,
    questionId: string,
    topic: string
): Promise<void> {
    console.log(`[questionProgressService] markCompanySolved called with:`, { userId, questionId, topic });

    try {
        // Step 1: Ensure the row exists
        const { error: upsertError } = await supabase
            .from('user_question_tracking')
            .upsert(
                {
                    user_id: userId,
                    question_id: questionId,
                    topic: topic || 'unknown',
                    updated_at: new Date().toISOString(),
                },
                { onConflict: 'user_id,question_id', ignoreDuplicates: true }
            );

        if (upsertError) {
            console.warn('[questionProgressService] Insert warning (may already exist):', upsertError);
        }

        // Step 2: Explicitly UPDATE companies_page to true
        const { error, data } = await supabase
            .from('user_question_tracking')
            .update({
                companies_page: true,
                updated_at: new Date().toISOString(),
            })
            .eq('user_id', userId)
            .eq('question_id', questionId)
            .select();

        console.log(`[questionProgressService] Companies UPDATE returned:`, { error, data });

        if (error) {
            console.error('[questionProgressService] Companies UPDATE error:', error);
            throw error;
        }

        if (!data || data.length === 0) {
            throw new Error('Could not update companies tracking row — 0 rows matched.');
        }
    } catch (error) {
        console.error('[questionProgressService] Error marking company question as solved:', error);
        throw error;
    }
}

/**
 * Update the user_streak table after solving a question.
 * Columns match the actual DB schema:
 *   last_solved_date, week_start_date (ISO Monday), weekly_count, current_streak, longest_streak
 */
export async function updateStreak(userId: string): Promise<void> {
    try {
        const today = new Date();
        const todayStr = today.toISOString().split('T')[0]; // YYYY-MM-DD

        // Compute ISO Monday of the current week
        const dayOfWeek = today.getDay(); // 0=Sun, 1=Mon … 6=Sat
        const daysToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
        const monday = new Date(today);
        monday.setDate(today.getDate() + daysToMonday);
        const weekStartStr = monday.toISOString().split('T')[0];

        // Yesterday string for consecutive-day check
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        // Fetch existing streak row
        const { data: existing, error: fetchError } = await supabase
            .from('user_streak')
            .select('current_streak, longest_streak, last_solved_date, weekly_count, week_start_date')
            .eq('user_id', userId)
            .maybeSingle();

        if (fetchError) {
            console.error('[updateStreak] Error fetching streak:', fetchError);
            return;
        }

        if (!existing) {
            // First solve ever — insert a fresh row
            const { error } = await supabase.from('user_streak').insert({
                user_id: userId,
                current_streak: 1,
                longest_streak: 1,
                last_solved_date: todayStr,
                weekly_count: 1,
                week_start_date: weekStartStr,
            });
            if (error) console.error('[updateStreak] Error creating streak row:', error);
            return;
        }

        const lastSolved: string | null = existing.last_solved_date;
        const lastWeekStart: string | null = existing.week_start_date;
        let currentStreak: number = existing.current_streak || 0;
        let longestStreak: number = existing.longest_streak || 0;
        let weeklyCount: number = existing.weekly_count || 0;

        // ── Streak calculation ──────────────────────────────────────
        if (lastSolved === todayStr) {
            // Already solved today — streak unchanged
        } else if (lastSolved === yesterdayStr) {
            // Consecutive day — extend streak
            currentStreak += 1;
            longestStreak = Math.max(longestStreak, currentStreak);
        } else {
            // Gap — reset streak
            currentStreak = 1;
            longestStreak = Math.max(longestStreak, 1);
        }

        // ── Weekly count calculation — increments for EVERY question solved ──
        if (lastWeekStart === weekStartStr) {
            // Same week — always add 1 for this solve
            weeklyCount += 1;
        } else {
            // New week started — reset to 1
            weeklyCount = 1;
        }

        const { error } = await supabase
            .from('user_streak')
            .update({
                current_streak: currentStreak,
                longest_streak: longestStreak,
                weekly_count: weeklyCount,
                last_solved_date: todayStr,
                week_start_date: weekStartStr,
                updated_at: new Date().toISOString(),
            })
            .eq('user_id', userId);

        if (error) console.error('[updateStreak] Error updating streak:', error);
        else console.log('[updateStreak] Streak updated:', { currentStreak, weeklyCount, todayStr });
    } catch (error) {
        console.error('[updateStreak] Error:', error);
    }
}

/**
 * Get question progress for a user.
 */
export async function getQuestionProgress(
    userId: string,
    questionId: string,
    _questionType: QuestionType
): Promise<{
    hasViewed: boolean;
    timeSpent: number;
    interactionCompleted: boolean;
}> {
    try {
        const { data, error } = await supabase
            .from('user_question_tracking')
            .select('domain_page, companies_page')
            .eq('user_id', userId)
            .eq('question_id', questionId)
            .single();

        if (error && error.code !== 'PGRST116') {
            console.error('Error getting question progress:', error);
            return { hasViewed: false, timeSpent: 0, interactionCompleted: false };
        }

        return {
            hasViewed: !!data,
            timeSpent: 0,
            interactionCompleted: !!(data?.domain_page || data?.companies_page),
        };
    } catch (error) {
        console.error('Error getting question progress:', error);
        return { hasViewed: false, timeSpent: 0, interactionCompleted: false };
    }
}

/**
 * Get all interactions for a user by question type.
 */
export async function getUserInteractions(
    userId: string,
    questionType?: QuestionType
): Promise<any[]> {
    try {
        let query = supabase
            .from('user_question_tracking')
            .select('*')
            .eq('user_id', userId);

        if (questionType) {
            query = query.eq('topic', questionType === 'interview' ? 'interview' : questionType);
        }

        const { data, error } = await query;

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error getting user interactions:', error);
        return [];
    }
}

// ─── Internal helper ────────────────────────────────────────────────────────

/**
 * Ensures a tracking row exists for the given user+question.
 * Uses ignoreDuplicates so it won't overwrite existing solved flags.
 */
async function ensureTrackingRow(
    userId: string,
    questionId: string,
    questionType: QuestionType
): Promise<void> {
    const { error } = await supabase
        .from('user_question_tracking')
        .upsert(
            {
                user_id: userId,
                question_id: questionId,
                topic: questionType === 'interview' ? 'interview' : questionType,
                updated_at: new Date().toISOString(),
            },
            { onConflict: 'user_id,question_id', ignoreDuplicates: true }
        );

    if (error) {
        console.warn('[ensureTrackingRow] Insert warning (may already exist):', error);
    }
}
