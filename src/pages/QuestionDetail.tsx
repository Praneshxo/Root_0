/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Flag } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import {
    trackView,
    updateTimeSpent,
    markInteractionCompleted,
    getQuestionProgress,
    markAsSolved,
    updateStreak,
    QuestionType,
} from '../services/questionProgressService';
import CodeContent from '../components/content/CodeContent';
import ImageContent from '../components/content/ImageContent';
import TextContent from '../components/content/TextContent';
import InteractiveCodeContent from '../components/content/InteractiveCodeContent';
import InteractiveDSAUI from '../components/content/InteractiveDSAUI';
import InteractiveSQLUI from '../components/content/InteractiveSQLUI';
import FillInBlankCodeContent from '../components/content/FillInBlankCodeContent';
import InteractiveMCQUI from '../components/content/InteractiveMCQUI';
import FeedbackModal from '../components/FeedbackModal';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';

interface QuestionData {
    id: string;
    title: string;
    description: string;
    difficulty: string;
    explanation_text: string;
    content_type?: 'image' | 'code' | 'quiz' | 'text' | 'dsa_pseudocode' | 'sql_construct' | 'interactive_code' | 'fill_in_blank_code' | 'mcq';
    content_data?: any;
    has_quiz?: boolean;
    quiz_data?: any;
    content?: string;
    solution_text?: string;
}

interface QuestionDetailProps {
    type: QuestionType;
}

const formatMarkdownText = (text: string) => {
    if (!text) return '';
    let formatted = text.replace(/\\n/g, '\n');

    // Add newlines before headers
    formatted = formatted.replace(/([^\n])(\s+##\s+)/g, '$1\n\n## ');

    // Add newlines after known header titles if squished
    formatted = formatted.replace(/(##\s+(?:Explanation|Difference Table|Real-World Analogy|Example|Answer|Code|Solution))\s+(?=[A-Z`*|\-+0-9])/gi, '$1\n\n');

    // Fix table rows squished together `| |`
    formatted = formatted.replace(/\|\s+\|/g, '|\n|');

    // Fix code blocks
    formatted = formatted.replace(/([^\n])(\s+```)/g, '$1\n$2');
    // Ensure code block opening has newline after language
    formatted = formatted.replace(/(```[a-z]*)\s+(?=[^\n])/gi, '$1\n');

    return formatted;
};

export default function QuestionDetail({ type }: QuestionDetailProps) {
    const { questionId } = useParams<{ questionId: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [question, setQuestion] = useState<QuestionData | null>(null);
    const [loading, setLoading] = useState(true);
    const [allQuestions, setAllQuestions] = useState<string[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [interactionCompleted, setInteractionCompleted] = useState(false);
    const [sessionCompleted, setSessionCompleted] = useState(false);
    const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
    const startTimeRef = useRef<number>(Date.now());

    // Get table name based on type
    const getTableName = () => {
        switch (type) {
            case 'dsa':
            case 'sql':
            case 'aptitude':
            case 'corecs':
                return 'company_topic_questions';
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

    // Get DB Topic string mapping
    const getDbTopic = () => {
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
                return type;
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
                let query = supabase
                    .from(getTableName())
                    .select('id')
                    .order('created_at')
                    .order('id'); // Secondary sort for stability

                if (getTableName() === 'company_topic_questions') {
                    // Filter by mapped DB topic exact string match
                    query = query.eq('topic', getDbTopic());
                }

                const { data, error } = await query;

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

    // Update current index when questionId changes (e.g., from clicking Next)
    useEffect(() => {
        if (allQuestions.length > 0 && questionId) {
            const index = allQuestions.indexOf(questionId);
            if (index !== -1) {
                setCurrentIndex(index);
            }
        }
    }, [questionId, allQuestions]);

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

                const explanationText =
                    data.explanation_text ||
                    data.explanation ||
                    data.answer ||
                    data.solution ||
                    'No explanation available.';

                let parsedContentData = data.content_data;

                if (typeof parsedContentData === 'string' && (parsedContentData.startsWith('{') || parsedContentData.startsWith('['))) {
                    try {
                        parsedContentData = JSON.parse(parsedContentData);
                    } catch (e) {
                        console.error('Failed to parse content_data JSON:', e);
                    }
                }

                let contentValue = parsedContentData;
                let contentTypeValue = data.content_type;

                if (contentValue && typeof contentValue === 'object' && typeof contentValue.code === 'string') {
                    contentTypeValue = 'code';
                    if (!contentValue.language) contentValue.language = data.language || 'java';
                } else if (data.code) {
                    contentTypeValue = 'code';
                    contentValue = { code: data.code, language: data.language || 'java' };
                } else if (contentValue && typeof contentValue === 'object' && (contentValue.url || contentValue.image_url)) {
                    contentTypeValue = 'image';
                } else if (contentValue && typeof contentValue === 'object' && contentValue.type === 'dsa_pseudocode') {
                    contentTypeValue = 'dsa_pseudocode';
                } else if (contentValue && typeof contentValue === 'object' && contentValue.type === 'sql_construct') {
                    contentTypeValue = 'sql_construct';
                } else if (contentValue && typeof contentValue === 'object' && contentValue.type === 'interactive_code') {
                    contentTypeValue = 'interactive_code';
                } else if (contentValue && typeof contentValue === 'object' && contentValue.type === 'fill_in_blank_code') {
                    contentTypeValue = 'fill_in_blank_code';
                } else if (contentValue && typeof contentValue === 'object' && Array.isArray(contentValue.options)) {
                    contentTypeValue = 'mcq';
                } else {
                    if (contentValue && (contentValue.best_answer || contentValue.detailed_answer || contentValue.interview_style)) {
                        const parts = [];
                        if (contentValue.interview_style) parts.push(`### Interview Style\n${contentValue.interview_style}`);
                        if (contentValue.best_answer) parts.push(`### Best Answer\n${contentValue.best_answer}`);
                        if (contentValue.detailed_answer) parts.push(`### Detailed Answer\n${contentValue.detailed_answer}`);
                        contentValue = { text: parts.join('\n\n') };
                        contentTypeValue = 'text';
                    } else if (typeof contentValue === 'string') {
                        contentValue = { text: contentValue };
                        contentTypeValue = 'text';
                    } else if (contentValue && contentValue.text) {
                        contentTypeValue = 'text';
                    } else {
                        if (contentValue) {
                            contentValue = { text: JSON.stringify(contentValue, null, 2) };
                        } else if (data.content) {
                            contentValue = { text: data.content };
                        } else {
                            contentValue = { text: 'No additional content available.' };
                        }
                        contentTypeValue = 'text';
                    }
                }

                data.explanation_text = explanationText;
                data.content_type = contentTypeValue;
                data.content_data = contentValue;

                setQuestion(data);

                // Track view
                if (user) {
                    await trackView(user.id, questionId, type);

                    // Get existing progress
                    const progress = await getQuestionProgress(user.id, questionId, type);
                    setInteractionCompleted(progress.interactionCompleted);
                    setSessionCompleted(false); // Reset session completion on new question
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
        const timeIntervalRef = setInterval(async () => {
            const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
            if (elapsed >= 10) {
                await updateTimeSpent(user.id, questionId, type, elapsed);
                startTimeRef.current = Date.now();
            }
        }, 10000);

        return () => {
            clearInterval(timeIntervalRef);
            // Save final time on unmount
            const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
            if (elapsed > 0 && user && questionId) {
                updateTimeSpent(user.id, questionId, type, elapsed);
            }
        };
    }, [user, questionId, type]);



    const handleComplete = async () => {
        console.log(`[QuestionDetail] handleComplete triggered! sessionCompleted: ${sessionCompleted}, interactionCompleted: ${interactionCompleted}`);
        setSessionCompleted(true);
        if (!user || !questionId || interactionCompleted) {
            console.log(`[QuestionDetail] handleComplete returning early! user: ${!!user}, questionId: ${!!questionId}, interactionCompleted: ${interactionCompleted}`);
            return;
        }
        setInteractionCompleted(true);
        console.log(`[QuestionDetail] Calling markInteractionCompleted and markAsSolved API...`);
        try {
            await markInteractionCompleted(user.id, questionId, type);
            await markAsSolved(user.id, questionId, type);
            await updateStreak(user.id);
            console.log(`[QuestionDetail] API calls finished.`);
        } catch (error: any) {
            console.error('[QuestionDetail] handleComplete failed:', error);
            alert(`Could not save your progress to the database!\n\n${error.message || 'Unknown error. Check the console.'}`);
            setInteractionCompleted(false);
            setSessionCompleted(false);
        }
    };

    // Handle next button
    const handleNext = () => {
        if (!user || !questionId) return;

        if (currentIndex < allQuestions.length - 1) {
            const nextId = allQuestions[currentIndex + 1];
            navigate(`${getRoutePath()}/${nextId}`);
        } else {
            console.log("No next question found in list. Remaining on current question.");
        }
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
    }, [currentIndex, allQuestions, interactionCompleted]);

    const canGoNext = () => {
        return true; // Can always go next
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="w-12 h-12 border-4 border-[#4F0F93] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!question) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <p className="text-xl text-[#A0A0B0] mb-4">Question not found</p>
                <button
                    onClick={() => navigate(getRoutePath())}
                    className="px-6 py-3 bg-[#4F0F93] text-white rounded-lg hover:bg-[#6312BA] transition-colors"
                >
                    Back to List
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0F0F13] text-white">
            {/* Header */}
            <div className="border-b border-gray-800 bg-[#111317]/80 backdrop-blur-xl sticky top-0 z-10">
                <div className="px-6 py-4">
                    <div className="flex items-center justify-between">
                        {/* Left: Back Button */}
                        <div className="flex items-center gap-2 text-sm">
                            <button
                                onClick={() => navigate(getRoutePath())}
                                className="flex items-center gap-2 px-4 py-2 bg-zinc-800/50 hover:bg-[#2C2C2C] text-white rounded-lg transition-colors"
                            >
                                <ChevronLeft className="w-4 h-4" />
                                <span>Back</span>
                            </button>
                            {/* Optional: Add spacing or minimal breadcrumb here if needed */}
                        </div>

                        {/* Center: Breadcrumb */}
                        <div className="flex items-center gap-2 text-sm absolute left-1/2 transform -translate-x-1/2">
                            <span className="text-[#A0A0B0]">{getTypeName()}</span>
                            <ChevronRight className="w-4 h-4 text-gray-600" />
                            <span className="text-white">
                                Question {currentIndex + 1} of {allQuestions.length}
                            </span>
                        </div>
                        <div className="flex items-center justify-end w-20">
                            <button
                                onClick={() => setIsFeedbackModalOpen(true)}
                                className="p-2 text-[#A0A0B0] hover:text-[#D0D0E0] hover:bg-zinc-800/50 rounded-lg transition-colors"
                                title="Report an issue"
                            >
                                <Flag className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 max-w-[1800px] mx-auto">
                {/* Left Panel - Explanation */}
                <div className="bg-[#111317] border border-gray-800 rounded-xl p-8 h-[calc(100vh-200px)] overflow-auto">
                    <h1 className="text-2xl font-bold text-white mb-3">{question.title}</h1>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full bg-zinc-800/50 text-[#A0A0B0] border border-gray-800">
                            <span>{(question as any).category || (question as any).topic || getTypeName()}</span>
                        </div>
                        <span className={`px-3 py-1 text-xs font-medium rounded-full border ${question.difficulty === 'Easy'
                            ? 'bg-green-500/10 text-green-400 border-green-500/20'
                            : question.difficulty === 'Medium'
                                ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                                : 'bg-red-500/10 text-red-400 border-red-500/20'
                            }`}>
                            {question.difficulty}
                        </span>
                    </div>

                    <div className={`transition-opacity duration-300 prose prose-invert prose-xl max-w-none text-[#D0D0E0] leading-relaxed`}>
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm, remarkBreaks]}
                            components={{
                                h1: ({ node, ...props }) => <h1 className="text-2xl font-bold text-white mb-4 mt-6" {...props} />,
                                h2: ({ node, ...props }) => <h2 className="text-xl font-bold text-white mb-3 mt-5" {...props} />,
                                h3: ({ node, ...props }) => <h3 className="text-lg font-bold text-white mb-2 mt-4" {...props} />,
                                p: ({ node, ...props }) => <p className="mb-4 text-[#D0D0E0] leading-relaxed" {...props} />,
                                ul: ({ node, ...props }) => <ul className="list-disc pl-6 mb-4 space-y-2 text-[#D0D0E0]" {...props} />,
                                ol: ({ node, ...props }) => <ol className="list-decimal pl-6 mb-4 space-y-2 text-[#D0D0E0]" {...props} />,
                                li: ({ node, ...props }) => <li className="pl-1" {...props} />,
                                strong: ({ node, ...props }) => <strong className="font-bold text-white" {...props} />,
                                blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-[#4F0F93] pl-4 italic my-4 text-[#A0A0B0] bg-[#111317]/80 py-2 pr-2 rounded-r" {...props} />,
                                table: ({ node, ...props }) => (
                                    <div className="overflow-x-auto my-6 bg-[#111317]/80 rounded-lg border border-gray-800">
                                        <table className="w-full text-left border-collapse text-sm" {...props} />
                                    </div>
                                ),
                                thead: ({ node, ...props }) => <thead className="bg-zinc-800/50/80 text-gray-200 border-b border-gray-800" {...props} />,
                                tbody: ({ node, ...props }) => <tbody className="divide-y divide-gray-800/50" {...props} />,
                                tr: ({ node, ...props }) => <tr className="hover:bg-[#111317] transition-colors" {...props} />,
                                th: ({ node, ...props }) => <th className="px-4 py-3 font-semibold" {...props} />,
                                td: ({ node, ...props }) => <td className="px-4 py-3 text-[#D0D0E0]" {...props} />,
                                code: ({ node, inline, className, children, ...props }: any) => {
                                    return inline ?
                                        <code className="bg-zinc-800/50 text-[#8970D6] px-1.5 py-0.5 rounded text-sm font-mono" {...props}>{children}</code> :
                                        <code className="block bg-[#111317] p-4 rounded-lg overflow-x-auto font-mono text-sm text-[#D0D0E0] my-4 border border-gray-800" {...props}>{children}</code>;
                                }
                            }}
                        >
                            {formatMarkdownText(question.explanation_text || question.solution_text || question.content || 'No explanation available.')}
                        </ReactMarkdown>
                    </div>
                </div>

                {/* Right Panel - Interactive Content */}
                <div className="h-[calc(100vh-200px)]">
                    {question.content_type === 'fill_in_blank_code' ? (
                        <FillInBlankCodeContent
                            codeData={question.content_data}
                            onComplete={handleComplete}
                        />
                    ) : question.content_type === 'interactive_code' ? (
                        <InteractiveCodeContent codeData={question.content_data} />
                    ) : question.content_type === 'sql_construct' ? (
                        <InteractiveSQLUI
                            sqlData={question.content_data}
                            onComplete={handleComplete}
                            isCompleted={sessionCompleted}
                        />
                    ) : question.content_type === 'mcq' ? (
                        <InteractiveMCQUI
                            mcqData={question.content_data}
                            onComplete={handleComplete}
                            isCompleted={sessionCompleted}
                        />
                    ) : question.content_type === 'dsa_pseudocode' ? (
                        <InteractiveDSAUI
                            dsaData={question.content_data}
                            onComplete={handleComplete}
                            isCompleted={sessionCompleted}
                        />
                    ) : question.content_type === 'code' && question.content_data ? (
                        <CodeContent codeData={question.content_data} />
                    ) : question.content_type === 'image' && question.content_data ? (
                        <ImageContent
                            imageData={{
                                ...question.content_data,
                                url: question.content_data.url || question.content_data.image_url,
                                alt: question.content_data.alt || question.content_data.title || 'Image',
                                caption: question.content_data.caption || question.content_data.title
                            }}
                        />
                    ) : question.content_type === 'text' && question.content_data ? (
                        <TextContent content={question.content_data.text || question.content_data} />
                    ) : (
                        <div className="h-full flex items-center justify-center bg-[#111317]/80 backdrop-blur-xl border border-gray-800 rounded-xl">
                            <p className="text-[#808090]">No content available</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Navigation Footer */}
            <div className="fixed bottom-0 left-0 right-0 border-t border-gray-800 bg-[#111317]/90 backdrop-blur-xl">
                <div className="px-6 py-4 max-w-[1800px] mx-auto">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={handlePrevious}
                            disabled={currentIndex === 0}
                            className="flex items-center gap-2 px-6 py-3 bg-zinc-800/50 text-white rounded-lg hover:bg-[#2C2C2C] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronLeft className="w-5 h-5" />
                            <span>Previous</span>
                        </button>

                        <div className="text-sm text-[#A0A0B0]">
                            Use ← → arrow keys to navigate • Press Esc to go back
                        </div>

                        <button
                            onClick={handleNext}
                            disabled={currentIndex >= allQuestions.length - 1}
                            className="flex items-center gap-2 px-6 py-3 bg-[#4F0F93] text-white rounded-lg hover:bg-[#6312BA] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <span>Next</span>
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
            <FeedbackModal
                isOpen={isFeedbackModalOpen}
                onClose={() => setIsFeedbackModalOpen(false)}
                questionId={questionId || ''}
                questionTitle={question.title}
            />
        </div>
    );
}
