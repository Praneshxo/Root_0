import { useState } from 'react';
import { CheckCircle2, XCircle, ArrowRight, Eye } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';

interface MCQData {
    options: string[];
    solution?: string;
    finalAnswer?: string;
    correctAnswer?: number; // Index of the correct option
}

interface InteractiveMCQUIProps {
    mcqData: MCQData;
    onComplete?: () => void;
    isCompleted?: boolean;
}

export default function InteractiveMCQUI({ mcqData, onComplete, isCompleted }: InteractiveMCQUIProps) {
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [showSolution, setShowSolution] = useState(false);
    const [hasAttempted, setHasAttempted] = useState(false);
    const [isRevealed, setIsRevealed] = useState(false);

    const handleOptionSelect = (index: number) => {
        if (isRevealed || isCompleted || (isSubmitted && selectedOption === mcqData.correctAnswer)) return;
        setSelectedOption(index);
        setIsSubmitted(false);
    };

    const handleSubmit = () => {
        if (selectedOption === null) return;
        setIsSubmitted(true);
        setHasAttempted(true);
        if (selectedOption === mcqData.correctAnswer) {
            console.log('[InteractiveMCQUI] Correct answer selected. Triggering onComplete()');
            onComplete?.();
        } else {
            console.log('[InteractiveMCQUI] Incorrect answer selected.');
        }
    };

    const handleReveal = () => {
        setIsRevealed(true);
        setHasAttempted(true);
        // Do NOT call onComplete() so it does not count as naturally solved.
    };

    const formatMarkdownText = (text: string) => {
        if (!text) return '';
        let formatted = text.replace(/\\n/g, '\n');
        return formatted;
    };

    const hasSolution = !!mcqData.solution;

    // Check if correct considering pre-existing completion or current selection
    const isCorrect = isCompleted || (isSubmitted && selectedOption === mcqData.correctAnswer);
    const showCorrectAnswer = isCompleted || isCorrect || isRevealed;

    return (
        <div className="bg-[#111317]/80 backdrop-blur-xl border border-gray-800 rounded-xl p-8 flex flex-col h-full">
            <h2 className="text-xl font-bold text-white mb-6">Select the correct option</h2>

            <div className="flex-1 overflow-y-auto pr-2 space-y-4">
                {mcqData.options.map((option, index) => {
                    let optionClasses = "p-4 rounded-lg border-2 text-left transition-all duration-200 focus:outline-none flex items-center justify-between";
                    let textClasses = "text-lg";
                    let icon = null;

                    if (showCorrectAnswer) {
                        if (index === mcqData.correctAnswer) {
                            optionClasses += " border-green-500/50 bg-green-500/10 text-green-400";
                            icon = <CheckCircle2 className="w-6 h-6 text-green-500" />;
                        } else if (isSubmitted && selectedOption === index) {
                            optionClasses += " border-red-500/50 bg-red-500/10 text-red-400";
                            icon = <XCircle className="w-6 h-6 text-red-500" />;
                        } else {
                            optionClasses += " border-gray-800 bg-zinc-800/20 text-[#A0A0B0] opacity-50";
                        }
                    } else if (isSubmitted && selectedOption === index && !isCorrect) {
                        optionClasses += " border-red-500/50 bg-red-500/10 text-red-400";
                        icon = <XCircle className="w-6 h-6 text-red-500" />;
                    } else {
                        if (selectedOption === index) {
                            optionClasses += " border-[#8970D6] bg-[#8970D6]/10 text-white";
                        } else {
                            optionClasses += " border-gray-800 bg-zinc-800/50 text-[#D0D0E0] hover:border-gray-600 hover:bg-[#2C2C2C] cursor-pointer";
                        }
                    }

                    return (
                        <button
                            key={index}
                            className={`w-full ${optionClasses}`}
                            onClick={() => handleOptionSelect(index)}
                            disabled={showCorrectAnswer}
                        >
                            <span className={textClasses}>{option}</span>
                            {icon}
                        </button>
                    );
                })}

                {showCorrectAnswer && hasSolution && (
                    <div className="mt-8">
                        <button
                            onClick={() => setShowSolution(!showSolution)}
                            className="text-[#8970D6] hover:text-[#A855F7] text-sm font-medium transition-colors mb-4 flex items-center gap-2"
                        >
                            {showSolution ? 'Hide Solution' : 'View Solution'}
                            <ArrowRight className={`w-4 h-4 transition-transform ${showSolution ? 'rotate-90' : ''}`} />
                        </button>

                        {showSolution && (
                            <div className="bg-zinc-800/50 border border-gray-700/50 rounded-lg p-6 prose prose-invert max-w-none text-[#D0D0E0]">
                                <ReactMarkdown
                                    remarkPlugins={[remarkGfm, remarkBreaks]}
                                    components={{
                                        p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
                                        code: ({ node, inline, children, ...props }: any) => (
                                            inline ?
                                                <code className="bg-black/30 text-[#8970D6] px-1.5 py-0.5 rounded text-sm" {...props}>{children}</code> :
                                                <code className="block bg-[#0F0F13] p-4 rounded-lg my-4 text-sm font-mono overflow-x-auto" {...props}>{children}</code>
                                        )
                                    }}
                                >
                                    {formatMarkdownText(mcqData.solution || '')}
                                </ReactMarkdown>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {!(showCorrectAnswer) && (
                <div className="pt-6 border-t border-gray-800 mt-auto">
                    <div className="flex gap-3">
                        <div className="flex-1 flex flex-col gap-3">
                            <button
                                onClick={handleSubmit}
                                disabled={selectedOption === null || isSubmitted}
                                className="w-full py-4 text-white font-bold rounded-lg bg-gradient-to-r from-[#8970D6] to-[#4F0F93] hover:from-[#9B88E1] hover:to-[#6312BA] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#4F0F93]/20"
                            >
                                {isSubmitted ? 'Incorrect - Select another' : 'Submit Answer'}
                            </button>
                        </div>
                        <div className="relative group flex items-start">
                            <button
                                onClick={hasAttempted ? handleReveal : undefined}
                                disabled={!hasAttempted}
                                className={`px-5 py-4 border font-medium rounded-lg transition-colors flex items-center gap-2 ${hasAttempted
                                    ? 'bg-transparent hover:bg-zinc-800/50 border-gray-800 text-[#D0D0E0] cursor-pointer'
                                    : 'bg-transparent border-gray-800/50 text-gray-600 cursor-not-allowed opacity-50'
                                    }`}
                            >
                                <Eye size={16} />
                                Reveal Answer
                            </button>
                            {!hasAttempted && (
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-zinc-800 text-xs text-[#D0D0E0] rounded-md border border-gray-700 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none shadow-lg">
                                    Try to solve once
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px border-4 border-transparent border-t-zinc-800" />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {(showCorrectAnswer) && (
                <div className="pt-6 border-t border-gray-800 mt-auto">
                    <div className="w-full py-4 text-white font-bold rounded-lg bg-green-500/20 border border-green-500/50 flex items-center justify-center gap-2">
                        <CheckCircle2 className="w-6 h-6 text-green-400" />
                        <span className="text-green-400">Correct!</span>
                    </div>
                </div>
            )}
        </div>
    );
}
