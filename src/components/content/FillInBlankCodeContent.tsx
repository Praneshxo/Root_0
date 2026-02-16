import { useState } from 'react';
import { Copy, Check, AlertCircle, BookOpen, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CodeBlank {
    id: string;
    correctAnswer: string;
    hint?: string;
}

interface FillInBlankData {
    language: string;
    codeTemplate: string; // Code with {{blank1}}, {{blank2}} placeholders
    blanks: CodeBlank[];
    caption?: string;
    topic?: string; // For filtering notes
    notesLink?: string; // Custom notes link
}

interface FillInBlankCodeContentProps {
    codeData: FillInBlankData;
    onComplete?: () => void;
}

export default function FillInBlankCodeContent({ codeData, onComplete }: FillInBlankCodeContentProps) {
    const navigate = useNavigate();
    const [copied, setCopied] = useState(false);
    const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
    const [attempts, setAttempts] = useState(0);
    const [showFailureDialog, setShowFailureDialog] = useState(false);
    const [shakeFields, setShakeFields] = useState<Set<string>>(new Set());
    const [isCorrect, setIsCorrect] = useState(false);

    const MAX_ATTEMPTS = 3;

    const handleCopy = async () => {
        try {
            // Copy the complete code with answers filled in
            let completeCode = codeData.codeTemplate;
            codeData.blanks.forEach(blank => {
                completeCode = completeCode.replace(`{{${blank.id}}}`, blank.correctAnswer);
            });
            await navigator.clipboard.writeText(completeCode.replace(/\\n/g, '\n'));
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            console.error('Failed to copy code:', error);
        }
    };

    const getLanguageColor = (lang: string) => {
        const colors: Record<string, string> = {
            javascript: 'text-yellow-400',
            typescript: 'text-blue-400',
            python: 'text-green-400',
            java: 'text-orange-400',
            cpp: 'text-purple-400',
            sql: 'text-pink-400',
            html: 'text-red-400',
            css: 'text-blue-300',
        };
        return colors[lang.toLowerCase()] || 'text-gray-400';
    };

    const handleInputChange = (blankId: string, value: string) => {
        setUserAnswers(prev => ({
            ...prev,
            [blankId]: value
        }));
    };

    const handleSubmit = () => {
        // Check if all blanks are filled
        const allFilled = codeData.blanks.every(blank => userAnswers[blank.id]?.trim());
        if (!allFilled) {
            alert('Please fill in all blanks before submitting.');
            return;
        }

        // Validate answers
        const incorrectFields = new Set<string>();
        let allCorrect = true;

        codeData.blanks.forEach(blank => {
            const userAnswer = userAnswers[blank.id]?.trim();
            const correctAnswer = blank.correctAnswer.trim();

            if (userAnswer !== correctAnswer) {
                incorrectFields.add(blank.id);
                allCorrect = false;
            }
        });

        if (allCorrect) {
            // Success!
            setIsCorrect(true);
            if (onComplete) {
                onComplete();
            }
        } else {
            // Incorrect - shake and clear wrong fields
            setShakeFields(incorrectFields);
            setAttempts(prev => prev + 1);

            // Clear incorrect fields after shake animation
            setTimeout(() => {
                setUserAnswers(prev => {
                    const newAnswers = { ...prev };
                    incorrectFields.forEach(id => {
                        delete newAnswers[id];
                    });
                    return newAnswers;
                });
                setShakeFields(new Set());
            }, 500);

            // Check if max attempts reached
            if (attempts + 1 >= MAX_ATTEMPTS) {
                setTimeout(() => {
                    setShowFailureDialog(true);
                }, 600);
            }
        }
    };

    const handleLearnMore = () => {
        const link = codeData.notesLink || `/notes${codeData.topic ? `?topic=${codeData.topic}` : ''}`;
        navigate(link);
    };

    // Render code with input fields
    const renderCodeWithBlanks = () => {
        const lines = codeData.codeTemplate.replace(/\\n/g, '\n').split('\n');

        return lines.map((line, lineIndex) => {
            const lineNumber = lineIndex + 1;
            const parts: (string | JSX.Element)[] = [];

            // Find all blanks in this line
            const blankRegex = /\{\{(\w+)\}\}/g;
            let match;
            let lastIndex = 0;

            while ((match = blankRegex.exec(line)) !== null) {
                const blankId = match[1];
                const blank = codeData.blanks.find(b => b.id === blankId);

                if (blank) {
                    // Add text before blank
                    if (match.index > lastIndex) {
                        parts.push(line.substring(lastIndex, match.index));
                    }

                    // Add input field for blank
                    const isShaking = shakeFields.has(blankId);
                    parts.push(
                        <input
                            key={`${lineIndex}-${blankId}`}
                            type="text"
                            value={userAnswers[blankId] || ''}
                            onChange={(e) => handleInputChange(blankId, e.target.value)}
                            disabled={isCorrect}
                            placeholder={blank.hint || `blank${blankId}`}
                            className={`inline-block px-2 py-0.5 mx-1 min-w-[120px] bg-gray-800 border-2 rounded text-purple-300 font-mono text-sm focus:outline-none focus:border-purple-500 disabled:bg-gray-700 disabled:border-green-500 ${isShaking ? 'animate-shake border-red-500' : 'border-purple-500/50'
                                } ${isCorrect ? 'border-green-500 text-green-400' : ''}`}
                            title={blank.hint}
                        />
                    );

                    lastIndex = match.index + match[0].length;
                }
            }

            // Add remaining text after last blank
            if (lastIndex < line.length) {
                parts.push(line.substring(lastIndex));
            }

            // If no blanks found, just return the line
            if (parts.length === 0) {
                parts.push(line);
            }

            return (
                <div key={lineIndex} className="flex leading-relaxed">
                    <span className="text-gray-600 select-none w-12 text-right pr-4 font-mono text-xs">{lineNumber}</span>
                    <span className="flex-1 flex items-center flex-wrap font-mono text-sm">
                        {parts.map((part, idx) =>
                            typeof part === 'string' ? <span key={idx}>{part}</span> : part
                        )}
                    </span>
                </div>
            );
        });
    };

    return (
        <div className="h-full flex flex-col bg-gray-900 border border-gray-800 rounded-xl overflow-hidden relative">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-gray-800 bg-gray-900/80">
                <div className="flex items-center gap-2">
                    <div className="flex gap-1.5 mr-3">
                        <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/30"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/30"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/30"></div>
                    </div>
                    <span className={`text-xs font-medium uppercase tracking-wider ${getLanguageColor(codeData.language)}`}>
                        {codeData.language}
                    </span>
                    <span className="text-xs text-gray-400 ml-2">• Quiz Mode</span>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-400">
                        Attempts: <span className="text-purple-400">{attempts}/{MAX_ATTEMPTS}</span>
                    </span>
                    <button
                        onClick={handleCopy}
                        className="p-1.5 hover:bg-gray-800 text-gray-400 hover:text-white rounded-md transition-colors"
                    >
                        {copied ? (
                            <Check className="w-4 h-4 text-green-400" />
                        ) : (
                            <Copy className="w-4 h-4" />
                        )}
                    </button>
                </div>
            </div>

            {/* Code Block */}
            <div className="flex-1 bg-gray-950 overflow-auto custom-scrollbar">
                <div className="py-4">
                    {renderCodeWithBlanks()}
                </div>
            </div>

            {/* Footer with Submit/Feedback */}
            <div className="p-4 border-t border-gray-800 bg-gray-900/50 space-y-4">
                {isCorrect ? (
                    <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg flex items-center gap-2">
                        <Check className="w-5 h-5 text-green-400" />
                        <span className="text-green-400 font-medium text-sm">Correct! You solved the exercise.</span>
                    </div>
                ) : (
                    <div className="flex justify-center">
                        <button
                            onClick={handleSubmit}
                            disabled={attempts >= MAX_ATTEMPTS}
                            className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors text-sm font-medium disabled:opacity-50"
                        >
                            Check Solution
                        </button>
                    </div>
                )}

                {codeData.caption && (
                    <p className="text-sm text-gray-400 mt-2">{codeData.caption}</p>
                )}
            </div>

            {/* Failure Dialog */}
            {showFailureDialog && (
                <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
                    <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 max-w-md w-full">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-orange-500/10 rounded-lg">
                                <AlertCircle className="w-6 h-6 text-orange-400" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-white mb-2">
                                    Need More Practice?
                                </h3>
                                <p className="text-gray-400 text-sm mb-4">
                                    You've used all {MAX_ATTEMPTS} attempts. Learn this topic in more depth and practice to master it!
                                </p>
                                <div className="flex gap-3">
                                    <button
                                        onClick={handleLearnMore}
                                        className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors text-sm font-medium"
                                    >
                                        <BookOpen className="w-4 h-4" />
                                        <span>Go to Notes</span>
                                    </button>
                                    <button
                                        onClick={() => setShowFailureDialog(false)}
                                        className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors text-sm"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowFailureDialog(false)}
                                className="text-gray-500 hover:text-gray-300 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Shake Animation Styles */}
            <style>{`
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    10%, 30%, 50%, 70%, 90% { transform: translateX(-8px); }
                    20%, 40%, 60%, 80% { transform: translateX(8px); }
                }
                .animate-shake {
                    animation: shake 0.5s;
                }
            `}</style>
        </div>
    );
}
