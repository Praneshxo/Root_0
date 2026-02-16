import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Home, Clock, CheckCircle2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import {
    trackView,
    updateTimeSpent,
    markQuizCompleted,
    markInteractionCompleted,
    getQuestionProgress,
    markAsSolved,
    QuestionType,
} from '../services/questionProgressService';
import QuizContent from '../components/content/QuizContent';
import CodeContent from '../components/content/CodeContent';
import ImageContent from '../components/content/ImageContent';
import TextContent from '../components/content/TextContent';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';

interface QuestionData {
    id: string;
    title: string;
    description: string;
    difficulty: string;
    explanation_text: string;
    content_type: 'image' | 'code' | 'quiz' | 'text';
    content_data: any;
    has_quiz: boolean;
    quiz_data: any;
}

interface QuestionDetailProps {
    type: QuestionType;
}

export default function QuestionDetail({ type }: QuestionDetailProps) {
    const { questionId } = useParams<{ questionId: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [question, setQuestion] = useState<QuestionData | null>(null);
    const [loading, setLoading] = useState(true);
    const [allQuestions, setAllQuestions] = useState<string[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [quizCompleted, setQuizCompleted] = useState(false);
    const [interactionCompleted, setInteractionCompleted] = useState(false);
    const [timeSpent, setTimeSpent] = useState(0);
    const timeIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const startTimeRef = useRef<number>(Date.now());

    // Get table name based on type
    const getTableName = () => {
        switch (type) {
            case 'dsa':
                return 'dsa_problems';
            case 'sql':
                return 'sql_questions';
            case 'aptitude':
                return 'aptitude_questions';
            case 'corecs':
                return 'core_cs_questions';
            case 'interview':
                return 'questions';
            default:
                return 'questions';
        }
    };

    // Get route path based on type
    const getRoutePath = () => {
        switch (type) {
            case 'dsa':
                return '/dsa';
            case 'sql':
                return '/sql';
            case 'aptitude':
                return '/aptitude';
            case 'corecs':
                return '/core-cs';
            case 'interview':
                return '/interview-questions';
            default:
                return '/';
        }
    };

    // Get display name
    const getTypeName = () => {
        switch (type) {
            case 'dsa':
                return 'DSA';
            case 'sql':
                return 'SQL';
            case 'aptitude':
                return 'Aptitude';
            case 'corecs':
                return 'Core CS';
            case 'interview':
                return 'Interview Questions';
            default:
                return 'Questions';
        }
    };

    // Fetch all questions for navigation
    useEffect(() => {
        const fetchAllQuestions = async () => {
            try {
                const { data, error } = await supabase
                    .from(getTableName())
                    .select('id')
                    .order('created_at');

                if (error) throw error;
                const ids = data?.map((q) => q.id) || [];
                setAllQuestions(ids);
                setCurrentIndex(ids.indexOf(questionId || ''));
            } catch (error) {
                console.error('Error fetching questions:', error);
            }
        };

        fetchAllQuestions();
    }, [type]);

    // Fetch question data
    useEffect(() => {
        const fetchQuestion = async () => {
            if (!questionId) return;

            setLoading(true);
            try {
                const { data, error } = await supabase
                    .from(getTableName())
                    .select('*')
                    .eq('id', questionId)
                    .single();

                if (error) throw error;
                setQuestion(data);

                // Track view
                if (user) {
                    await trackView(user.id, questionId, type);

                    // Get existing progress
                    const progress = await getQuestionProgress(user.id, questionId, type);
                    setQuizCompleted(progress.quizCompleted);
                    setInteractionCompleted(progress.interactionCompleted);
                    setTimeSpent(progress.timeSpent);
                }
            } catch (error) {
                console.error('Error fetching question:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchQuestion();
    }, [questionId, type, user]);

    // Time tracking
    useEffect(() => {
        if (!user || !questionId) return;

        startTimeRef.current = Date.now();

        // Update time every 10 seconds
        timeIntervalRef.current = setInterval(async () => {
            const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
            if (elapsed >= 10) {
                await updateTimeSpent(user.id, questionId, type, elapsed);
                setTimeSpent((prev) => prev + elapsed);
                startTimeRef.current = Date.now();
            }
        }, 10000);

        return () => {
            if (timeIntervalRef.current) {
                clearInterval(timeIntervalRef.current);
            }
            // Save final time on unmount
            const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
            if (elapsed > 0 && user && questionId) {
                updateTimeSpent(user.id, questionId, type, elapsed);
            }
        };
    }, [user, questionId, type]);

    // Handle quiz completion
    const handleQuizComplete = async () => {
        if (!user || !questionId) return;

        setQuizCompleted(true);
        await markQuizCompleted(user.id, questionId, type);
        await markAsSolved(user.id, questionId, type);
    };

    // Handle next button (for non-quiz questions)
    const handleNext = async () => {
        if (!user || !questionId) return;

        if (!question?.has_quiz && !interactionCompleted) {
            setInteractionCompleted(true);
            await markInteractionCompleted(user.id, questionId, type);
            await markAsSolved(user.id, questionId, type);
        }

        // Return to the list page instead of going to next question
        navigate(getRoutePath());
    };

    // Handle previous button
    const handlePrevious = () => {
        if (currentIndex > 0) {
            const prevId = allQuestions[currentIndex - 1];
            navigate(`${getRoutePath()}/${prevId}`);
        }
    };

    // Keyboard navigation
    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight' && canGoNext()) {
                handleNext();
            } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
                handlePrevious();
            } else if (e.key === 'Escape') {
                navigate(getRoutePath());
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [currentIndex, allQuestions, quizCompleted, interactionCompleted]);

    const canGoNext = () => {
        if (question?.has_quiz) {
            return quizCompleted;
        }
        return true; // Can always go next for non-quiz questions
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!question) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <p className="text-xl text-gray-400 mb-4">Question not found</p>
                <button
                    onClick={() => navigate(getRoutePath())}
                    className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                    Back to List
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white">
            {/* Header */}
            <div className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-xl sticky top-0 z-10">
                <div className="px-6 py-4">
                    <div className="flex items-center justify-between">
                        {/* Breadcrumb */}
                        <div className="flex items-center gap-2 text-sm">
                            <button
                                onClick={() => navigate(getRoutePath())}
                                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                            >
                                <Home className="w-4 h-4" />
                                <span>{getTypeName()}</span>
                            </button>
                            <ChevronRight className="w-4 h-4 text-gray-600" />
                            <span className="text-white">
                                Question {currentIndex + 1} of {allQuestions.length}
                            </span>
                        </div>

                        {/* Stats */}
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2 text-sm text-gray-400">
                                <Clock className="w-4 h-4" />
                                <span>{formatTime(timeSpent)}</span>
                            </div>
                            {(quizCompleted || interactionCompleted) && (
                                <div className="flex items-center gap-2 text-sm text-green-400">
                                    <CheckCircle2 className="w-4 h-4" />
                                    <span>Completed</span>
                                </div>
                            )}
                            <span
                                className={`px-3 py-1 text-xs font-medium rounded-full ${question.difficulty === 'Easy'
                                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                    : question.difficulty === 'Medium'
                                        ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                                        : 'bg-red-500/20 text-red-400 border border-red-500/30'
                                    }`}
                            >
                                {question.difficulty}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 max-w-[1800px] mx-auto">
                {/* Left Panel - Explanation */}
                <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-xl p-8 h-[calc(100vh-200px)] overflow-auto">
                    <h1 className="text-2xl font-bold text-white mb-3">{question.title}</h1>
                    <p className="text-gray-400 mb-6">{question.description}</p>

                    <div className="prose prose-invert prose-lg max-w-none text-gray-300 text-lg leading-relaxed">
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm, remarkBreaks]}
                        >
                            {(question.explanation_text || 'No explanation available.').replace(/\\n/g, '\n')}
                        </ReactMarkdown>
                    </div>
                </div>

                {/* Right Panel - Interactive Content */}
                <div className="h-[calc(100vh-200px)]">
                    {question.has_quiz && question.quiz_data ? (
                        <QuizContent
                            quizData={question.quiz_data}
                            onComplete={handleQuizComplete}
                            isCompleted={quizCompleted}
                        />
                    ) : question.content_type === 'code' && question.content_data ? (
                        <CodeContent codeData={question.content_data} />
                    ) : question.content_type === 'image' && question.content_data ? (
                        <ImageContent imageData={question.content_data} />
                    ) : question.content_type === 'text' && question.content_data ? (
                        <TextContent content={question.content_data.text || question.content_data} />
                    ) : (
                        <div className="h-full flex items-center justify-center bg-gray-900/50 backdrop-blur-xl border border-purple-500/20 rounded-xl">
                            <p className="text-gray-500">No additional content available</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Navigation Footer */}
            <div className="fixed bottom-0 left-0 right-0 border-t border-gray-800 bg-gray-900/90 backdrop-blur-xl">
                <div className="px-6 py-4 max-w-[1800px] mx-auto">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={handlePrevious}
                            disabled={currentIndex === 0}
                            className="flex items-center gap-2 px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronLeft className="w-5 h-5" />
                            <span>Previous</span>
                        </button>

                        <div className="text-sm text-gray-400">
                            Use ← → arrow keys to navigate • Press Esc to go back
                        </div>

                        <button
                            onClick={handleNext}
                            disabled={!canGoNext()}
                            className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <span>{question.has_quiz && !quizCompleted ? 'Complete Quiz First' : 'Complete & Return'}</span>
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
