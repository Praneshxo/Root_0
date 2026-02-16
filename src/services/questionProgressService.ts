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
            .from('question_interactions')
            .upsert({
                user_id: userId,
                question_id: questionId,
                question_type: questionType,
                viewed_at: new Date().toISOString(),
            }, {
                onConflict: 'user_id,question_id,question_type'
            });

        if (error) throw error;
    } catch (error) {
        console.error('Error tracking view:', error);
    }
}

/**
 * Update time spent on a question
 */
export async function updateTimeSpent(
    userId: string,
    questionId: string,
    questionType: QuestionType,
    seconds: number
): Promise<void> {
    try {
        // Get current time spent
        const { data: existing } = await supabase
            .from('question_interactions')
            .select('time_spent')
            .eq('user_id', userId)
            .eq('question_id', questionId)
            .eq('question_type', questionType)
            .single();

        const currentTime = existing?.time_spent || 0;

        const { error } = await supabase
            .from('question_interactions')
            .upsert({
                user_id: userId,
                question_id: questionId,
                question_type: questionType,
                time_spent: currentTime + seconds,
                updated_at: new Date().toISOString(),
            }, {
                onConflict: 'user_id,question_id,question_type'
            });

        if (error) throw error;
    } catch (error) {
        console.error('Error updating time spent:', error);
    }
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
            .from('question_interactions')
            .upsert({
                user_id: userId,
                question_id: questionId,
                question_type: questionType,
                quiz_completed: true,
                interaction_completed: true,
                completed_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            }, {
                onConflict: 'user_id,question_id,question_type'
            });

        if (error) throw error;
    } catch (error) {
        console.error('Error marking quiz completed:', error);
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
            .from('question_interactions')
            .upsert({
                user_id: userId,
                question_id: questionId,
                question_type: questionType,
                interaction_completed: true,
                completed_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            }, {
                onConflict: 'user_id,question_id,question_type'
            });

        if (error) throw error;
    } catch (error) {
        console.error('Error marking interaction completed:', error);
    }
}

/**
 * Check if user can mark question as solved
 */
export async function canMarkAsSolved(
    userId: string,
    questionId: string,
    questionType: QuestionType,
    hasQuiz: boolean
): Promise<boolean> {
    try {
        const { data, error } = await supabase
            .from('question_interactions')
            .select('quiz_completed, interaction_completed')
            .eq('user_id', userId)
            .eq('question_id', questionId)
            .eq('question_type', questionType)
            .single();

        if (error || !data) return false;

        // For quiz questions, quiz must be completed
        if (hasQuiz) {
            return data.quiz_completed;
        }

        // For non-quiz questions, interaction must be completed
        return data.interaction_completed;
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
    try {
        let tableName: string;
        let columnName: string;

        switch (questionType) {
            case 'dsa':
                tableName = 'user_dsa_progress';
                columnName = 'problem_id';
                break;
            case 'sql':
                tableName = 'user_sql_progress';
                columnName = 'question_id';
                break;
            case 'aptitude':
                tableName = 'user_aptitude_progress';
                columnName = 'question_id';
                break;
            case 'corecs':
                tableName = 'user_corecs_progress';
                columnName = 'question_id';
                break;
            case 'interview':
                tableName = 'user_progress';
                columnName = 'question_id';
                // For interview questions, we need to use status='solved'
                const { error: interviewError } = await supabase
                    .from(tableName)
                    .upsert({
                        user_id: userId,
                        question_id: questionId,
                        status: 'solved',
                        updated_at: new Date().toISOString(),
                    });
                if (interviewError) throw interviewError;
                return;
        }

        // For other question types
        const { error } = await supabase
            .from(tableName)
            .upsert({
                user_id: userId,
                [columnName]: questionId,
                solved: true,
                updated_at: new Date().toISOString(),
            });

        if (error) throw error;
    } catch (error) {
        console.error('Error marking as solved:', error);
    }
}

/**
 * Get question progress for a user
 */
export async function getQuestionProgress(
    userId: string,
    questionId: string,
    questionType: QuestionType
): Promise<QuestionProgress> {
    try {
        const { data, error } = await supabase
            .from('question_interactions')
            .select('*')
            .eq('user_id', userId)
            .eq('question_id', questionId)
            .eq('question_type', questionType)
            .single();

        if (error || !data) {
            return {
                viewed: false,
                timeSpent: 0,
                quizCompleted: false,
                interactionCompleted: false,
                canMarkAsSolved: false,
            };
        }

        return {
            viewed: true,
            timeSpent: data.time_spent,
            quizCompleted: data.quiz_completed,
            interactionCompleted: data.interaction_completed,
            canMarkAsSolved: data.interaction_completed || data.quiz_completed,
        };
    } catch (error) {
        console.error('Error getting question progress:', error);
        return {
            viewed: false,
            timeSpent: 0,
            quizCompleted: false,
            interactionCompleted: false,
            canMarkAsSolved: false,
        };
    }
}

/**
 * Get all interactions for a user by question type
 */
export async function getUserInteractions(
    userId: string,
    questionType?: QuestionType
): Promise<QuestionInteraction[]> {
    try {
        let query = supabase
            .from('question_interactions')
            .select('*')
            .eq('user_id', userId);

        if (questionType) {
            query = query.eq('question_type', questionType);
        }

        const { data, error } = await query;

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error getting user interactions:', error);
        return [];
    }
}
