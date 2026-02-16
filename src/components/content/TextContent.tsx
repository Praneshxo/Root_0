import { FileText } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';

interface TextContentProps {
    content: string;
}

export default function TextContent({ content }: TextContentProps) {
    return (
        <div className="h-full flex flex-col bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-800 bg-gray-900/80">
                <FileText className="w-5 h-5 text-purple-400" />
                <span className="text-sm font-semibold text-gray-300">Additional Information</span>
            </div>

            {/* Content */}
            <div className="flex-1 bg-gray-950 overflow-auto custom-scrollbar">
                <div className="p-8 prose prose-invert prose-xl max-w-none text-gray-300 leading-relaxed">
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
                        {content.replace(/\\n/g, '\n')}
                    </ReactMarkdown>
                </div>
            </div>

            {/* Info */}
            <div className="px-6 py-3 border-t border-gray-800 text-xs text-gray-500 bg-gray-900/50">
                <span className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                    Read through the content to deepen your understanding
                </span>
            </div>
        </div>
    );
}
