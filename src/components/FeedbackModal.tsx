import { useState } from 'react';
import { X, Send, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface FeedbackModalProps {
    isOpen: boolean;
    onClose: () => void;
    questionId: string;
    questionTitle: string;
}

export default function FeedbackModal({ isOpen, onClose, questionId, questionTitle }: FeedbackModalProps) {
    const { user } = useAuth();
    const [issueText, setIssueText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!issueText.trim() || !user) return;

        setIsSubmitting(true);
        setError(null);

        try {
            const { error: dbError } = await supabase
                .from('user_feedback')
                .insert({
                    user_id: user.id,
                    question_id: questionId,
                    question_title: questionTitle,
                    issue_text: issueText,
                });

            if (dbError) throw dbError;

            setSuccess(true);
            setTimeout(() => {
                onClose();
                setSuccess(false);
                setIssueText('');
            }, 2000);
        } catch (err: any) {
            console.error('Error submitting feedback:', err);
            setError(err.message || 'Failed to submit feedback');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-[#111317] border border-gray-800 rounded-xl w-full max-w-md overflow-hidden shadow-2xl relative">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800 bg-[#14161a]">
                    <h2 className="text-lg font-semibold text-white">Report an Issue</h2>
                    <button
                        onClick={onClose}
                        className="text-[#A0A0B0] hover:text-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {success ? (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/20">
                                <Send className="w-8 h-8 text-green-400" />
                            </div>
                            <h3 className="text-xl font-medium text-white mb-2">Feedback Submitted</h3>
                            <p className="text-[#A0A0B0]">Thank you for helping us improve!</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-[#D0D0E0] mb-1">
                                    Question
                                </label>
                                <div className="px-3 py-2 bg-zinc-800/50 rounded-lg text-sm text-[#A0A0B0] border border-gray-800 truncate">
                                    {questionTitle}
                                </div>
                            </div>

                            <div className="mb-6">
                                <label htmlFor="issue" className="block text-sm font-medium text-[#D0D0E0] mb-2">
                                    What's the issue? Let us know!
                                </label>
                                <textarea
                                    id="issue"
                                    rows={4}
                                    value={issueText}
                                    onChange={(e) => setIssueText(e.target.value)}
                                    placeholder="Typo, wrong answer, unclear explanation..."
                                    className="w-full bg-[#0F0F13] border border-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#4F0F93] transition-colors resize-none text-sm"
                                    required
                                />
                            </div>

                            {error && (
                                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-2">
                                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                                    <p className="text-sm text-red-400">{error}</p>
                                </div>
                            )}

                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-4 py-2 text-sm font-medium text-[#A0A0B0] hover:text-white transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting || !issueText.trim()}
                                    className="px-5 py-2 bg-[#4F0F93] text-white text-sm font-medium rounded-lg hover:bg-[#6312BA] transition-colors disabled:opacity-50 flex items-center gap-2"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                            Submitting...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="w-4 h-4" />
                                            Submit
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
