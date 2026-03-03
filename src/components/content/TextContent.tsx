/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { FileText } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';

interface TextContentProps {
    content: string;
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

export default function TextContent({ content }: TextContentProps) {
    return (
        <div className="h-full flex flex-col bg-[#111317] border border-gray-800 rounded-xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-800 bg-[#111317]/80">
                <FileText className="w-5 h-5 text-[#A855F7]" />
                <span className="text-sm font-semibold text-[#D0D0E0]">Additional Information</span>
            </div>

            {/* Content */}
            <div className="flex-1 bg-gray-950 overflow-auto custom-scrollbar">
                <div className="p-8 prose prose-invert prose-xl max-w-none text-[#D0D0E0] leading-relaxed">
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
                        {formatMarkdownText(content)}
                    </ReactMarkdown>
                </div>
            </div>

            {/* Info */}
            <div className="px-6 py-3 border-t border-gray-800 text-xs text-[#808090] bg-[#111317]/80">
                <span className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-[#4F0F93] rounded-full"></div>
                    Read through the content to deepen your understanding
                </span>
            </div>
        </div>
    );
}
