/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Tag, Flag } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import CodeContent from '../components/content/CodeContent';
import ImageContent from '../components/content/ImageContent';
import TextContent from '../components/content/TextContent';
import InteractiveCodeContent from '../components/content/InteractiveCodeContent';
import FillInBlankCodeContent from '../components/content/FillInBlankCodeContent';
import InteractiveDSAUI from '../components/content/InteractiveDSAUI';
import InteractiveSQLUI from '../components/content/InteractiveSQLUI';
import InteractiveMCQUI from '../components/content/InteractiveMCQUI';
import FeedbackModal from '../components/FeedbackModal';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';

interface QuestionPage {
    pageNumber: number;
    explanation: string;
    contentType: 'text' | 'code' | 'image' | 'interactive_code' | 'fill_in_blank_code' | 'dsa_pseudocode' | 'sql_construct' | 'mcq';
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

export default function CompanyQuestionDetail() {
    const { questionId } = useParams<{ questionId: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();
    const [question, setQuestion] = useState<CompanyQuestion | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const [sessionCompleted, setSessionCompleted] = useState(false);
    const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
    const [allQuestionIds, setAllQuestionIds] = useState<string[]>([]);

    useEffect(() => {
        fetchQuestion();
    }, [questionId]);

    const fetchQuestion = async () => {
        if (!questionId) return;

        setLoading(true);
        try {
            let { data, error } = await supabase
                .from('company_topic_questions')
                .select('*')
                .eq('id', questionId)
                .single();

            if (error) throw error;

            // If pages don't exist, create a default single page
            if (!data.pages || data.pages.length === 0) {
                const explanationText =
                    data.explanation_text ||
                    data.explanation ||
                    data.answer ||
                    data.solution ||
                    'No explanation available.';

                let parsedContentData = data.content_data;

                // If content_data is a string that looks like JSON, try to parse it
                if (typeof parsedContentData === 'string' && (parsedContentData.startsWith('{') || parsedContentData.startsWith('['))) {
                    try {
                        parsedContentData = JSON.parse(parsedContentData);
                    } catch (e) {
                        console.error('Failed to parse content_data JSON:', e);
                    }
                }

                // Determine content type and value based on data structure
                let contentValue = parsedContentData;
                let contentTypeValue = data.content_type;

                // 1. Check for Code (must have code string)
                if (contentValue && typeof contentValue === 'object' && typeof contentValue.code === 'string') {
                    contentTypeValue = 'code';
                    if (!contentValue.language) contentValue.language = data.language || 'java';
                }
                // 2. Fallback to data.code column if content_data didn't have it
                else if (data.code) {
                    contentTypeValue = 'code';
                    contentValue = { code: data.code, language: data.language || 'java' };
                }
                // 3. Check for Image (url or image_url)
                else if (contentValue && typeof contentValue === 'object' && (contentValue.url || contentValue.image_url)) {
                    contentTypeValue = 'image';
                }
                // 4. Check for DSA Pseudocode
                else if (contentValue && typeof contentValue === 'object' && contentValue.type === 'dsa_pseudocode') {
                    contentTypeValue = 'dsa_pseudocode';
                }
                // 5. Check for SQL Construct
                else if (contentValue && typeof contentValue === 'object' && contentValue.type === 'sql_construct') {
                    contentTypeValue = 'sql_construct';
                }
                // 5.5 Check for MCQ
                else if (contentValue && typeof contentValue === 'object' && Array.isArray(contentValue.options)) {
                    contentTypeValue = 'mcq';
                }
                // 6. Default to Text
                else {
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

                data.pages = [
                    {
                        pageNumber: 1,
                        explanation: explanationText,
                        contentType: contentTypeValue,
                        content: contentValue
                    }
                ];
            }

            if (!data.category && data.topic) {
                data.category = data.topic;
            }

            setQuestion(data);

            if (user) {
                const { data: progressData } = await supabase
                    .from('user_company_progress')
                    .select('solved')
                    .eq('user_id', user.id)
                    .eq('question_id', questionId)
                    .single();

                if (progressData) {
                    // We don't need to restore completed state to prevent answer reveal bug
                }
            }
            setSessionCompleted(false);
        } catch (error) {
            console.error('Error fetching question:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!question) return;

        const fetchAllQuestions = async () => {
            try {
                let ids: string[] = [];
                const state = location.state as any;
                const currentTab = state?.tab || (question.topic ? question.topic : 'Interview Questions');

                if (currentTab === 'Interview Questions') {
                    const { data } = await supabase
                        .from('company_topic_questions')
                        .select('id')
                        .eq('company_name', question.company_name)
                        .in('topic', ['HR', 'Technical'])
                        .order('created_at');
                    ids = data?.map(q => q.id) || [];
                } else {
                    const { data } = await supabase
                        .from('company_topic_questions')
                        .select('id')
                        .eq('company_name', question.company_name)
                        .eq('topic', currentTab)
                        .order('created_at');
                    ids = data?.map(q => q.id) || [];
                }

                setAllQuestionIds([...new Set(ids)]);
            } catch (err) {
                console.error("Error fetching question list:", err);
            }
        };
        fetchAllQuestions();
    }, [question, (location.state as any)?.tab]);

    const handleNextQuestion = () => {
        if (!questionId) {
            handleBack();
            return;
        }

        if (allQuestionIds.length === 0) return;

        const currentIndex = allQuestionIds.indexOf(questionId);
        if (currentIndex !== -1 && currentIndex < allQuestionIds.length - 1) {
            const nextId = allQuestionIds[currentIndex + 1];
            navigate(`/companies/question/${nextId}`, {
                state: location.state,
                replace: true
            });
        } else {
            handleBack();
        }
    };

    const getReturnState = () => {
        const state = location.state as any;
        if (state?.company && state?.tab) {
            return { company: state.company, tab: state.tab };
        }
        if (question) {
            const company = question.company_name;
            const tab = question.topic || 'Interview Questions';
            return { company, tab };
        }
        return {};
    };

    const handleBack = () => {
        navigate('/companies', { state: getReturnState() });
    };

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
        setSessionCompleted(true);
        if (!user || !questionId) return;

        try {
            await supabase.from('user_company_progress').upsert({
                user_id: user.id,
                question_id: questionId,
                solved: true,
                updated_at: new Date().toISOString()
            }, {
                onConflict: 'user_id,question_id'
            });
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
                <div className="w-12 h-12 border-4 border-[#4F0F93] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!question) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <p className="text-xl text-[#A0A0B0] mb-4">Question not found</p>
                <button
                    onClick={handleBack}
                    className="px-6 py-3 bg-[#4F0F93] text-white rounded-lg hover:bg-[#6312BA] transition-colors"
                >
                    Back to Companies
                </button>
            </div>
        );
    }

    const currentPageData = question.pages[currentPage];

    return (
        <div className="min-h-screen bg-[#0F0F13] text-white">
            <div className="bg-[#111317] sticky top-0 z-10">
                <div className="px-6 py-4">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={handleBack}
                            className="flex items-center gap-2 px-4 py-2 bg-zinc-800/50 hover:bg-[#2C2C2C] text-white rounded-lg transition-colors"
                        >
                            <ChevronLeft className="w-4 h-4" />
                            <span>Back</span>
                        </button>

                        <div className="flex items-center gap-2 text-sm absolute left-1/2 transform -translate-x-1/2">
                            <span className="text-[#A0A0B0]">{question.company_name}</span>
                            <ChevronRight className="w-4 h-4 text-gray-600" />
                            <span className="text-white">
                                Page {currentPage + 1} of {question.pages.length}
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 max-w-[1800px] mx-auto">
                <div className="bg-[#111317] border border-gray-800 rounded-xl p-8 h-[calc(100vh-200px)] overflow-auto">
                    <h1 className="text-2xl font-bold text-white mb-3">{question.question}</h1>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full bg-zinc-800/50 text-[#A0A0B0] border border-gray-800">
                            <Tag className="w-3 h-3" />
                            <span>{question.category || question.topic}</span>
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
                            {formatMarkdownText(currentPageData.explanation)}
                        </ReactMarkdown>
                    </div>
                </div>

                <div className="h-[calc(100vh-200px)]">
                    {
                        currentPageData.contentType === 'fill_in_blank_code' ? (
                            <FillInBlankCodeContent
                                codeData={currentPageData.content}
                                onComplete={handleComplete}
                            />
                        ) : currentPageData.contentType === 'interactive_code' ? (
                            <InteractiveCodeContent codeData={currentPageData.content} />
                        ) : currentPageData.contentType === 'sql_construct' ? (
                            <InteractiveSQLUI
                                sqlData={currentPageData.content}
                                onComplete={handleComplete}
                                isCompleted={sessionCompleted}
                            />
                        ) : currentPageData.contentType === 'mcq' ? (
                            <InteractiveMCQUI
                                mcqData={currentPageData.content}
                                onComplete={handleComplete}
                                isCompleted={sessionCompleted}
                            />
                        ) : currentPageData.contentType === 'dsa_pseudocode' ? (
                            <InteractiveDSAUI
                                dsaData={currentPageData.content}
                                onComplete={handleComplete}
                                isCompleted={sessionCompleted}
                            />
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
                        ) : (
                            <div className="h-full flex items-center justify-center bg-[#111317]/80 backdrop-blur-xl border border-gray-800 rounded-xl">
                                <p className="text-[#808090]">No content available</p>
                            </div>
                        )
                    }
                </div>
            </div>

            <div className="fixed bottom-0 left-0 right-0 border-t border-gray-800 bg-[#111317]/90 backdrop-blur-xl">
                <div className="px-6 py-4 max-w-[1800px] mx-auto">
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-[#A0A0B0]"></div>
                        <button
                            onClick={handleNextQuestion}
                            className="flex items-center gap-2 px-6 py-3 bg-[#4F0F93] text-white rounded-lg hover:bg-[#6312BA] transition-colors"
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
                questionTitle={question.question}
            />
        </div>
    );
}
