import { useState } from 'react';
import { Copy, Check, Eye, EyeOff } from 'lucide-react';

interface CodeBlank {
    lineNumber: number;
    placeholder: string;
    answer: string;
}

interface InteractiveCodeData {
    language: string;
    code: string;
    blanks: CodeBlank[];
    caption?: string;
}

interface InteractiveCodeContentProps {
    codeData: InteractiveCodeData;
}

export default function InteractiveCodeContent({ codeData }: InteractiveCodeContentProps) {
    const [copied, setCopied] = useState(false);
    const [showAnswers, setShowAnswers] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(codeData.code);
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
            cpp: 'text-[#A855F7]',
            sql: 'text-pink-400',
            html: 'text-red-400',
            css: 'text-blue-300',
        };
        return colors[lang.toLowerCase()] || 'text-[#A0A0B0]';
    };

    // Process code to replace blanks with interactive elements
    const renderCodeWithBlanks = () => {
        const lines = codeData.code.replace(/\\n/g, '\n').split('\n');

        return lines.map((line, index) => {
            const lineNumber = index + 1;
            const blank = codeData.blanks.find(b => b.lineNumber === lineNumber);

            if (blank) {
                // Replace the placeholder with an interactive blank
                const parts = line.split(blank.placeholder);

                return (
                    <div key={index} className="flex">
                        <span className="text-gray-600 select-none w-12 text-right pr-4 font-mono text-sm">{lineNumber}</span>
                        <span className="flex-1">
                            {parts[0]}
                            <span className="inline-flex items-center">
                                {showAnswers ? (
                                    <span className="bg-green-500/20 text-green-400 px-2 py-0.5 rounded border border-green-500/30 font-semibold">
                                        {blank.answer}
                                    </span>
                                ) : (
                                    <span className="border-b-2 border-dotted border-green-400 px-8 py-0.5 mx-1 inline-block min-w-[100px] text-center text-[#808090] text-sm">
                                        {blank.placeholder}
                                    </span>
                                )}
                            </span>
                            {parts[1]}
                        </span>
                    </div>
                );
            }

            return (
                <div key={index} className="flex">
                    <span className="text-gray-600 select-none w-12 text-right pr-4">{lineNumber}</span>
                    <span className="flex-1">{line}</span>
                </div>
            );
        });
    };

    return (
        <div className="h-full flex flex-col bg-[#111317] border border-gray-800 rounded-xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-gray-800 bg-[#111317]/80">
                <div className="flex items-center gap-2">
                    <div className="flex gap-1.5 mr-3">
                        <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/30"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/30"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/30"></div>
                    </div>
                    <span className={`text-xs font-medium uppercase tracking-wider ${getLanguageColor(codeData.language)}`}>
                        {codeData.language}
                    </span>
                    <span className="text-xs text-[#A0A0B0] ml-2">• Interactive</span>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setShowAnswers(!showAnswers)}
                        className="flex items-center gap-2 px-3 py-1 bg-zinc-800/50 hover:bg-[#2C2C2C] text-[#D0D0E0] rounded-md transition-colors text-xs font-medium"
                    >
                        {showAnswers ? (
                            <>
                                <EyeOff className="w-3 h-3" />
                                <span>Hide Answers</span>
                            </>
                        ) : (
                            <>
                                <Eye className="w-3 h-3" />
                                <span>Show Answers</span>
                            </>
                        )}
                    </button>
                    <button
                        onClick={handleCopy}
                        className="p-1.5 hover:bg-zinc-800/50 text-[#A0A0B0] hover:text-white rounded-md transition-colors"
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
                <pre className="py-4 text-base leading-relaxed font-mono">
                    <code className="text-[#D0D0E0] block">
                        {renderCodeWithBlanks()}
                    </code>
                </pre>
            </div>

            {/* Caption */}
            {codeData.caption && (
                <div className="p-4 border-t border-gray-800 bg-[#111317]/80">
                    <p className="text-sm text-[#A0A0B0]">{codeData.caption}</p>
                </div>
            )}
        </div>
    );
}
