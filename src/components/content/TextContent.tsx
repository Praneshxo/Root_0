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
                <div className="p-8 prose prose-invert prose-lg max-w-none text-gray-300 text-lg leading-relaxed">
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm, remarkBreaks]}
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
