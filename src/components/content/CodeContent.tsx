import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CodeData {
    language: string;
    code: string;
    caption?: string;
}

interface CodeContentProps {
    codeData: CodeData;
}

export default function CodeContent({ codeData }: CodeContentProps) {
    const [copied, setCopied] = useState(false);

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
            cpp: 'text-purple-400',
            sql: 'text-pink-400',
            html: 'text-red-400',
            css: 'text-blue-300',
        };
        return colors[lang.toLowerCase()] || 'text-gray-400';
    };

    const renderCodeWithLineNumbers = () => {
        const lines = codeData.code.replace(/\\n/g, '\n').split('\n');
        return lines.map((line, index) => (
            <div key={index} className="flex leading-relaxed">
                <span className="text-gray-600 select-none w-12 text-right pr-4 shrink-0 font-mono text-sm">{index + 1}</span>
                <span className="text-gray-300 font-mono text-base whitespace-pre">{line}</span>
            </div>
        ));
    };

    return (
        <div className="h-full flex flex-col bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-gray-800 bg-gray-900/80">
                <div className="flex items-center gap-3">
                    <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/30"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/30"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/30"></div>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <span className={`text-xs font-medium uppercase tracking-wider ${getLanguageColor(codeData.language)}`}>
                        {codeData.language}
                    </span>
                    <button
                        onClick={handleCopy}
                        className="p-1.5 hover:bg-gray-800 text-gray-400 hover:text-white rounded-md transition-colors"
                        title="Copy Code"
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
                    {renderCodeWithLineNumbers()}
                </div>
            </div>

            {/* Caption */}
            {codeData.caption && (
                <div className="p-4 border-t border-gray-800 bg-gray-900/50">
                    <p className="text-sm text-gray-400">{codeData.caption}</p>
                </div>
            )}
        </div>
    );
}
