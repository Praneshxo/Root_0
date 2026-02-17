import { useState } from 'react';
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';

interface QuizData {
    options: string[];
    correctAnswer: number;
    solution: string;
}

interface QuizContentProps {
    quizData: QuizData;
    onComplete: () => void | Promise<void>;
    isCompleted: boolean;
    onWrongAnswer?: () => void;
    onCorrectAnswer?: () => void;
}

export default function QuizContent({ quizData, onComplete, isCompleted, onWrongAnswer, onCorrectAnswer }: QuizContentProps) {
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [submitted, setSubmitted] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [showExplanation, setShowExplanation] = useState(false);

    const handleRetry = () => {
        setSelectedAnswer(null);
        setSubmitted(false);
        setIsCorrect(false);
        setShowExplanation(false);
    };

    const handleOptionClick = (index: number) => {
        if (submitted) return; // Don't allow changing after submission

        setSelectedAnswer(index);
        // Auto-submit immediately
        setSubmitted(true);
        const correct = index === quizData.correctAnswer;
        setIsCorrect(correct);

        if (correct) {
            // Call onComplete to mark as solved
            console.log('Correct answer! Calling onComplete()');
            onComplete();
            if (onCorrectAnswer) onCorrectAnswer();
            setShowExplanation(true);
        } else {
            console.log('Wrong answer selected');
            if (onWrongAnswer) onWrongAnswer();
        }
    };

    return (
        <div className="h-full flex flex-col bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800 bg-gray-900/80">
                <div className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-purple-400" />
                    <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Options</h3>
                </div>
                {isCompleted && (
                    <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs rounded-full border border-green-500/30 font-medium">
                        Completed ✓
                    </span>
                )}
            </div>

            <div className="flex-1 p-6 overflow-auto space-y-6 bg-gray-950/50">
                {/* Options */}
                <div className="space-y-3">
                    {quizData.options.map((option, index) => {
                        const isSelected = selectedAnswer === index;
                        const isCorrectOption = index === quizData.correctAnswer;
                        const showCorrect = submitted && isCorrectOption && isCorrect;
                        const showIncorrect = submitted && isSelected && !isCorrect;

                        let borderColor = 'border-gray-800';
                        let bgColor = 'bg-gray-900/30';
                        let textColor = 'text-gray-400';

                        if (showCorrect) {
                            borderColor = 'border-green-500';
                            bgColor = 'bg-green-500/10';
                            textColor = 'text-green-400';
                        } else if (showIncorrect) {
                            borderColor = 'border-red-500';
                            bgColor = 'bg-red-500/10';
                            textColor = 'text-red-400';
                        } else if (isSelected) {
                            borderColor = 'border-purple-500';
                            bgColor = 'bg-purple-500/10';
                            textColor = 'text-purple-300';
                        }

                        return (
                            <button
                                key={index}
                                onClick={() => handleOptionClick(index)}
                                disabled={submitted}
                                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${borderColor} ${bgColor} ${submitted ? 'cursor-not-allowed' : 'hover:border-gray-700 cursor-pointer'}`}
                            >
                                <div className="flex items-center justify-between">
                                    <span className={`${textColor} font-medium text-lg`}>
                                        {String.fromCharCode(65 + index)}. {option}
                                    </span>
                                    {showCorrect && <CheckCircle2 className="w-5 h-5 text-green-400" />}
                                    {showIncorrect && <XCircle className="w-5 h-5 text-red-400" />}
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Action Buttons */}
            <div className="p-6 border-t border-gray-800 bg-gray-900/50">
                {/* Try Again button - only show for wrong answers */}
                {submitted && !isCorrect && (
                    <button
                        onClick={handleRetry}
                        className="w-full px-6 py-3 mb-4 bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors"
                    >
                        Try Again
                    </button>
                )}

                {/* Quiz Solution - Single Collapsible Section */}
                <div className="relative group">
                    <button
                        onClick={() => {
                            if (submitted) {
                                setShowExplanation(!showExplanation);
                            }
                        }}
                        disabled={!submitted}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-lg border transition-colors ${submitted
                            ? 'bg-gray-800 border-gray-700 text-white hover:bg-gray-700'
                            : 'bg-gray-900/50 border-gray-800 text-gray-500 cursor-not-allowed'
                            }`}
                    >
                        <span className="font-medium">Solution</span>
                        {showExplanation ? <CheckCircle2 className="w-5 h-5 text-green-400" /> : <AlertCircle className="w-5 h-5" />}
                    </button>

                    {/* Tooltip on hover when disabled */}
                    {!submitted && (
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                            Try to solve the question first
                        </div>
                    )}

                    {/* Solution Content - Dropdown Rendering Markdown */}
                    {showExplanation && (
                        <div className="mt-3 p-4 rounded-lg bg-gray-900 border border-gray-800 prose prose-invert max-w-none text-gray-300">
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm, remarkBreaks]}
                                components={{
                                    h1: ({ ...props }) => <h1 className="text-xl font-bold text-white mb-2 mt-4" {...props} />,
                                    h2: ({ ...props }) => <h2 className="text-lg font-bold text-white mb-2 mt-3" {...props} />,
                                    p: ({ ...props }) => <p className="mb-3 text-gray-300 leading-relaxed" {...props} />,
                                    ul: ({ ...props }) => <ul className="list-disc pl-5 mb-3 space-y-1" {...props} />,
                                    ol: ({ ...props }) => <ol className="list-decimal pl-5 mb-3 space-y-1" {...props} />,
                                    li: ({ ...props }) => <li className="pl-1" {...props} />,
                                    code: ({ inline, className, children, ...props }: any) => {
                                        return inline ?
                                            <code className="bg-gray-800 text-purple-300 px-1 py-0.5 rounded text-sm font-mono" {...props}>{children}</code> :
                                            <code className="block bg-gray-950 p-3 rounded border border-gray-800 text-sm font-mono my-2 overflow-x-auto" {...props}>{children}</code>;
                                    }
                                }}
                            >
                                {(quizData.solution || '').replace(/\\n/g, '\n')}
                            </ReactMarkdown>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
