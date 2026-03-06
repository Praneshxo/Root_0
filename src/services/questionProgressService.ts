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
 * Track when a user views a question
 */
export async function trackView(
    userId: string,
    questionId: string,
    questionType: QuestionType
): Promise<void> {
    try {
        const { error } = await supabase
            .from('user_question_tracking')
            .upsert(
                {
                    user_id: userId,
                    question_id: questionId,
                    topic: questionType === 'interview' ? 'interview' : questionType,
                    // We simply bump the updated_at timestamp as a "view"
                    updated_at: new Date().toISOString()
                },
                { onConflict: 'user_id,question_id' }
            );

        if (error) {
            console.error('Error tracking view:', error);
        }
    } catch (error) {
        console.error('Error tracking view:', error);
    }
}

/**
 * Update time spent on a question
 */
export async function updateTimeSpent(
    _userId: string,
    _questionId: string,
    _questionType: QuestionType,
    _additionalSeconds: number
): Promise<void> {
    // Time tracking is no longer supported in the simplified user_question_tracking schema.
    // Stubbing this function to prevent errors from existing callers.
    return Promise.resolve();
}

/**
 * Mark quiz as completed
 */
export async function markQuizCompleted(
    userId: string,
    questionId: string,
    questionType: QuestionType
): Promise<void> {
    try {
        const { error } = await supabase
            .from('user_question_tracking')
            .upsert(
                {
                    user_id: userId,
                    question_id: questionId,
                    topic: questionType === 'interview' ? 'interview' : questionType,
                    domain_page: true,
                    updated_at: new Date().toISOString()
                },
                { onConflict: 'user_id,question_id' }
            );

        if (error) {
            console.error('Error marking interaction completed:', error);
        }
    } catch (error) {
        console.error('Error marking interaction completed:', error);
    }
}

/**
 * Mark interaction as completed (for non-quiz questions)
 */
export async function markInteractionCompleted(
    userId: string,
    questionId: string,
    questionType: QuestionType
): Promise<void> {
    try {
        const { error } = await supabase
            .from('user_question_tracking')
            .upsert({
                user_id: userId,
                question_id: questionId,
                topic: questionType === 'interview' ? 'interview' : questionType,
                domain_page: true, // Assuming interaction completion means domain_page is true
                updated_at: new Date().toISOString(),
            }, {
                onConflict: 'user_id,question_id'
            });

        if (error) throw error;
    } catch (error) {
        console.error('Error marking interaction completed:', error);
        throw error;
    }
}

/**
 * Check if user can mark question as solved
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
            .select('domain_page, companies_page') // Assuming these indicate completion
            .eq('user_id', userId)
            .eq('question_id', questionId)
            .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found
            console.error('Error checking if can mark as solved:', error);
            return false;
        }

        // If data exists and either domain_page or companies_page is true, it's considered completed
        return !!(data?.domain_page || data?.companies_page);
    } catch (error) {
        console.error('Error checking if can mark as solved:', error);
        return false;
    }
}

/**
 * Mark question as solved in the appropriate progress table
 */
export async function markAsSolved(
    userId: string,
    questionId: string,
    questionType: QuestionType
): Promise<void> {
    console.log(`[questionProgressService] markAsSolved called with:`, { userId, questionId, questionType });
    try {
        // Note: For company maps, companies_page is set in the component. We assume domain_page here based on the types

        console.log(`[questionProgressService] Upserting to user_question_tracking:`, {
            user_id: userId,
            question_id: questionId,
            topic: questionType === 'interview' ? 'interview' : questionType,
            domain_page: true
        });

        const { error, data } = await supabase
            .from('user_question_tracking')
            .upsert({
                user_id: userId,
                question_id: questionId,
                topic: questionType === 'interview' ? 'interview' : questionType,
                domain_page: true,
                updated_at: new Date().toISOString(),
            }, {
                onConflict: 'user_id,question_id'
            })
            .select();

        console.log(`[questionProgressService] Upsert returned:`, { error, data });

        if (error) {
            console.error('[questionProgressService] upsert error:', error);
            if (error.code === '42P01' || error.message?.includes('does not exist')) {
                alert('CRITICAL: The user_question_tracking table does not exist in your database! Please run the fresh_progress_schema.sql script in Supabase.');
            }
            throw error;
        }
    } catch (error) {
        console.error('[questionProgressService] Error marking as solved:', error);
        throw error;
    }
}

/**
 * Get question progress for a user
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
            timeSpent: 0, // Time tracking removed in new schema
            interactionCompleted: !!(data?.domain_page || data?.companies_page)
        };
    } catch (error) {
        console.error('Error getting question progress:', error);
        return { hasViewed: false, timeSpent: 0, interactionCompleted: false };
    }
}

/**
 * Get all interactions for a user by question type
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
