import { useState } from 'react';
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

interface QuizData {
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
}

interface QuizContentProps {
    quizData: QuizData;
    onComplete: () => void;
    isCompleted: boolean;
}

export default function QuizContent({ quizData, onComplete, isCompleted }: QuizContentProps) {
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [submitted, setSubmitted] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);

    const handleSubmit = () => {
        if (selectedAnswer === null) return;

        setSubmitted(true);
        const correct = selectedAnswer === quizData.correctAnswer;
        setIsCorrect(correct);

        if (correct) {
            onComplete();
        }
    };

    const handleRetry = () => {
        setSelectedAnswer(null);
        setSubmitted(false);
        setIsCorrect(false);
    };

    return (
        <div className="h-full flex flex-col bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800 bg-gray-900/80">
                <div className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-purple-400" />
                    <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Solution Quiz</h3>
                </div>
                {isCompleted && (
                    <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs rounded-full border border-green-500/30 font-medium">
                        Completed ✓
                    </span>
                )}
            </div>

            <div className="flex-1 p-6 overflow-auto space-y-6 bg-gray-950/50">
                {/* Question */}
                <div className="p-4 rounded-lg bg-gray-900 border border-gray-800">
                    <p className="text-lg text-white font-medium leading-relaxed">{quizData.question}</p>
                </div>

                {/* Options */}
                <div className="space-y-3">
                    {quizData.options.map((option, index) => {
                        const isSelected = selectedAnswer === index;
                        const isCorrectOption = index === quizData.correctAnswer;
                        const showCorrect = submitted && isCorrectOption;
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
                                onClick={() => !submitted && setSelectedAnswer(index)}
                                disabled={submitted}
                                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${borderColor} ${bgColor} ${submitted ? 'cursor-not-allowed' : 'hover:border-gray-700 cursor-pointer'
                                    }`}
                            >
                                <div className="flex items-center justify-between">
                                    <span className={`${textColor} font-medium text-base`}>
                                        {String.fromCharCode(65 + index)}. {option}
                                    </span>
                                    {showCorrect && <CheckCircle2 className="w-5 h-5 text-green-400" />}
                                    {showIncorrect && <XCircle className="w-5 h-5 text-red-400" />}
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* Feedback */}
                {submitted && (
                    <div
                        className={`p-4 rounded-lg border border-2 ${isCorrect
                            ? 'bg-green-500/10 border-green-500/30'
                            : 'bg-red-500/10 border-red-500/30'
                            }`}
                    >
                        <div className="flex items-start gap-4">
                            {isCorrect ? (
                                <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0" />
                            ) : (
                                <XCircle className="w-6 h-6 text-red-400 flex-shrink-0" />
                            )}
                            <div className="flex-1">
                                <p className={`font-semibold mb-1 ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                                    {isCorrect ? 'Correct!' : 'Incorrect'}
                                </p>
                                <p className="text-base text-gray-300 leading-relaxed">{quizData.explanation.replace(/\\n/g, '\n')}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Action Buttons */}
            <div className="p-6 border-t border-gray-800 bg-gray-900/50">
                {!submitted ? (
                    <button
                        onClick={handleSubmit}
                        disabled={selectedAnswer === null}
                        className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50"
                    >
                        Submit Answer
                    </button>
                ) : !isCorrect ? (
                    <button
                        onClick={handleRetry}
                        className="w-full px-6 py-3 bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors"
                    >
                        Try Again
                    </button>
                ) : (
                    <div className="w-full px-6 py-3 bg-green-500/10 text-green-400 rounded-lg font-medium text-center border border-green-500/30">
                        Quiz Completed!
                    </div>
                )}
            </div>
        </div>
    );
}
