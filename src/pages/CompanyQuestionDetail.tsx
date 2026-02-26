import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Tag } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import QuizContent from '../components/content/QuizContent';
import CodeContent from '../components/content/CodeContent';
import ImageContent from '../components/content/ImageContent';
import TextContent from '../components/content/TextContent';
import InteractiveCodeContent from '../components/content/InteractiveCodeContent';
import FillInBlankCodeContent from '../components/content/FillInBlankCodeContent';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';

interface QuestionPage {
    pageNumber: number;
    explanation: string;
    contentType: 'text' | 'code' | 'image' | 'interactive_code' | 'fill_in_blank_code' | 'quiz';
    content: any;
}

interface CompanyQuestion {
    id: string;
    company_name: string;
    question: string;
    difficulty: string;
    category: string;
    topic?: string;
    pages: QuestionPage[];
}

export default function CompanyQuestionDetail() {
    const { questionId } = useParams<{ questionId: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();
    const [question, setQuestion] = useState<CompanyQuestion | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const [completed, setCompleted] = useState(false);
    const [allQuestionIds, setAllQuestionIds] = useState<string[]>([]);

    useEffect(() => {
        fetchQuestion();
    }, [questionId]);

    const fetchQuestion = async () => {
        if (!questionId) return;

        setLoading(true);
        try {
            // Try company_interview_questions first
            let { data, error } = await supabase
                .from('company_interview_questions')
                .select('*')
                .eq('id', questionId)
                .single();

            // If not found, try company_topic_questions
            if (error || !data) {
                const result = await supabase
                    .from('company_topic_questions')
                    .select('*')
                    .eq('id', questionId)
                    .single();
                data = result.data;
                error = result.error;
            }

            if (error) throw error;

            console.log('Fetched Question Data:', data);
            console.log('Has Pages:', data.pages && data.pages.length > 0);
            console.log('Legacy Content Type:', data.content_type);
            console.log('Legacy Content Data:', data.content_data);

            // If pages don't exist, create a default single page
            if (!data.pages || data.pages.length === 0) {
                data.pages = [
                    {
                        pageNumber: 1,
                        explanation: data.explanation_text || 'No explanation available.',
                        contentType: data.content_type || 'text',
                        content: data.content_data || { text: data.content || 'No content available.' }
                    }
                ];
            }

            setQuestion(data);

            // Check if user has completed this question
            if (user) {
                const { data: progressData } = await supabase
                    .from('user_company_progress')
                    .select('solved')
                    .eq('user_id', user.id)
                    .eq('question_id', questionId)
                    .single();

                if (progressData) {
                    setCompleted(progressData.solved);
                }
            }
        } catch (error) {
            console.error('Error fetching question:', error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch all questions for navigation (same company and topic)
    useEffect(() => {
        if (!question) return;

        const fetchAllQuestions = async () => {
            try {
                let ids: string[] = [];
                const state = location.state as any;
                const currentTab = state?.tab || (question.topic ? question.topic : 'Interview Questions');

                console.log('Fetching questions for:', {
                    company: question.company_name,
                    tab: currentTab,
                    questionTopic: question.topic,
                    questionCategory: question.category
                });

                if (currentTab === 'Interview Questions') {
                    const { data } = await supabase
                        .from('company_interview_questions')
                        .select('id')
                        .eq('company_name', question.company_name)
                        .order('created_at');
                    ids = data?.map(q => q.id) || [];
                    console.log('Interview questions found:', ids.length);
                } else {
                    const { data } = await supabase
                        .from('company_topic_questions')
                        .select('id')
                        .eq('company_name', question.company_name)
                        .eq('topic', currentTab)
                        .order('created_at');
                    ids = data?.map(q => q.id) || [];
                    console.log('Topic questions found:', ids.length, 'for topic:', currentTab);
                }

                setAllQuestionIds([...new Set(ids)]);
                console.log('Set allQuestionIds:', ids);
            } catch (err) {
                console.error("Error fetching question list:", err);
            }
        };
        fetchAllQuestions();
    }, [question, (location.state as any)?.tab]);

    const handleNextQuestion = () => {
        console.log('handleNextQuestion called', { questionId, allQuestionIds });

        if (!questionId) {
            console.log('No questionId, going back');
            handleBack();
            return;
        }

        if (allQuestionIds.length === 0) {
            console.log('allQuestionIds is empty, staying on page');
            // Don't navigate if we don't have the question list yet
            return;
        }

        const currentIndex = allQuestionIds.indexOf(questionId);
        console.log('Current index:', currentIndex, 'Total questions:', allQuestionIds.length);

        if (currentIndex !== -1 && currentIndex < allQuestionIds.length - 1) {
            const nextId = allQuestionIds[currentIndex + 1];
            console.log('Navigating to next question:', nextId);
            navigate(`/companies/question/${nextId}`, {
                state: location.state,
                replace: true
            });
        } else {
            console.log('Last question, going back to list');
            handleBack();
        }
    };


    const getReturnState = () => {
        const state = location.state as any;
        // If we have state passed from previous page, trust it
        if (state?.company && state?.tab) {
            return { company: state.company, tab: state.tab };
        }

        // Otherwise derive from question data
        if (question) {
            const company = question.company_name;
            // If topic is present, it's a topic question. Otherwise default to 'Interview Questions'
            const tab = question.topic || 'Interview Questions';
            return { company, tab };
        }
        return {};
    };

    const handleBack = () => {
        navigate('/companies', { state: getReturnState() });
    };

    // Keyboard navigation
    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight' && !isLastPage) {
                handleNextPage();
            } else if (e.key === 'ArrowLeft' && !isFirstPage) {
                handlePreviousPage();
            } else if (e.key === 'Escape') {
                handleBack();
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [currentPage, question]);

    const handleComplete = async () => {
        if (!user || !questionId) return;

        console.log('handleComplete called', { user: user.id, questionId, completed });

        try {
            const { data, error } = await supabase.from('user_company_progress').upsert({
                user_id: user.id,
                question_id: questionId,
                solved: true,
                updated_at: new Date().toISOString()
            }, {
                onConflict: 'user_id,question_id'
            }).select();

            if (error) {
                console.error('Error upserting progress:', error);
            } else {
                console.log('Successfully saved progress:', data);
                setCompleted(true);
            }
        } catch (error) {
            console.error('Error marking as complete:', error);
        }
    };

    const handleNextPage = () => {
        if (question && currentPage < question.pages.length - 1) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
        }
    };

    const isLastPage = question ? currentPage === question.pages.length - 1 : false;
    const isFirstPage = currentPage === 0;

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
                    onClick={handleBack}
                    className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                    Back to Companies
                </button>
            </div>
        );
    }

    const currentPageData = question.pages[currentPage];
    console.log('Rendering Page Data:', currentPageData);

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white">
            {/* Header */}
            <div className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-xl sticky top-0 z-10">
                <div className="px-6 py-4">
                    <div className="flex items-center justify-between">
                        {/* Left: Back Button */}
                        <button
                            onClick={handleBack}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
                        >
                            <ChevronLeft className="w-4 h-4" />
                            <span>Back</span>
                        </button>

                        {/* Center: Breadcrumb */}
                        <div className="flex items-center gap-2 text-sm absolute left-1/2 transform -translate-x-1/2">
                            <span className="text-gray-400">{question.company_name}</span>
                            <ChevronRight className="w-4 h-4 text-gray-600" />
                            <span className="text-white">
                                Page {currentPage + 1} of {question.pages.length}
                            </span>
                        </div>

                        {/* Right: Empty or minimal space */}
                        <div className="w-20"></div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 max-w-[1800px] mx-auto">
                {/* Left Panel - Explanation */}
                <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-xl p-8 h-[calc(100vh-200px)] overflow-auto">
                    <h1 className="text-2xl font-bold text-white mb-3">{question.question}</h1>
                    <div className="flex items-center gap-3 mb-6">
                        {/* Topic Badge */}
                        <div className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full bg-gray-800 text-gray-400 border border-gray-700">
                            <Tag className="w-3 h-3" />
                            <span>{question.category || question.topic}</span>
                        </div>

                        {/* Difficulty Badge */}
                        <span className={`px-3 py-1 text-xs font-medium rounded-full border ${question.difficulty === 'Easy'
                            ? 'bg-green-500/10 text-green-400 border-green-500/20'
                            : question.difficulty === 'Medium'
                                ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                                : 'bg-red-500/10 text-red-400 border-red-500/20'
                            }`}>
                            {question.difficulty}
                        </span>
                    </div>

                    <div className={`transition-opacity duration-300 prose prose-invert prose-xl max-w-none text-gray-300 leading-relaxed`}>
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm, remarkBreaks]}
                            components={{
                                h1: ({ node, ...props }) => <h1 className="text-2xl font-bold text-white mb-4 mt-6" {...props} />,
                                h2: ({ node, ...props }) => <h2 className="text-xl font-bold text-white mb-3 mt-5" {...props} />,
                                h3: ({ node, ...props }) => <h3 className="text-lg font-bold text-white mb-2 mt-4" {...props} />,
                                p: ({ node, ...props }) => <p className="mb-4 text-gray-300 leading-relaxed" {...props} />,
                                ul: ({ node, ...props }) => <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-300" {...props} />,
                                ol: ({ node, ...props }) => <ol className="list-decimal pl-6 mb-4 space-y-2 text-gray-300" {...props} />,
                                li: ({ node, ...props }) => <li className="pl-1" {...props} />,
                                strong: ({ node, ...props }) => <strong className="font-bold text-white" {...props} />,
                                blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-purple-500 pl-4 italic my-4 text-gray-400 bg-gray-900/50 py-2 pr-2 rounded-r" {...props} />,
                                code: ({ node, inline, className, children, ...props }: any) => {
                                    return inline ?
                                        <code className="bg-gray-800 text-purple-300 px-1.5 py-0.5 rounded text-sm font-mono" {...props}>{children}</code> :
                                        <code className="block bg-gray-900 p-4 rounded-lg overflow-x-auto font-mono text-sm text-gray-300 my-4 border border-gray-800" {...props}>{children}</code>;
                                }
                            }}
                        >
                            {currentPageData.explanation.replace(/\\n/g, '\n')}
                        </ReactMarkdown>
                    </div>
                </div >

                {/* Right Panel - Interactive Content */}
                < div className="h-[calc(100vh-200px)]" >
                    {
                        currentPageData.contentType === 'fill_in_blank_code' ? (
                            <FillInBlankCodeContent
                                codeData={currentPageData.content}
                                onComplete={handleComplete}
                            />
                        ) : currentPageData.contentType === 'interactive_code' ? (
                            <InteractiveCodeContent codeData={currentPageData.content} />
                        ) : currentPageData.contentType === 'code' ? (
                            <CodeContent codeData={currentPageData.content} />
                        ) : currentPageData.contentType === 'image' ? (
                            <ImageContent
                                imageData={{
                                    ...currentPageData.content,
                                    url: currentPageData.content.url || currentPageData.content.image_url,
                                    alt: currentPageData.content.alt || currentPageData.content.title || 'Image',
                                    caption: currentPageData.content.caption || currentPageData.content.title
                                }}
                            />
                        ) : currentPageData.contentType === 'text' ? (
                            <TextContent content={currentPageData.content.text || currentPageData.content} />
                        ) : (currentPageData.contentType === 'quiz') ? (
                            <>
                                {console.log('Quiz Data:', currentPageData.content)}
                                <QuizContent
                                    quizData={currentPageData.content}
                                    onComplete={handleComplete}
                                    isCompleted={completed}
                                />
                            </>
                        ) : (
                            <div className="h-full flex items-center justify-center bg-gray-900/50 backdrop-blur-xl border border-purple-500/20 rounded-xl">
                                <p className="text-gray-500">No content available</p>
                            </div>
                        )
                    }
                </div >
            </div >

            {/* Navigation Footer */}
            < div className="fixed bottom-0 left-0 right-0 border-t border-gray-800 bg-gray-900/90 backdrop-blur-xl" >
                <div className="px-6 py-4 max-w-[1800px] mx-auto">
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-400">
                            {/* navigation text removed */}
                        </div>

                        <button
                            onClick={handleNextQuestion}
                            className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                        >
                            <span>Next</span>
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div >
        </div >
    );
}
