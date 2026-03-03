import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { User, Save, MessageSquare, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface FeedbackItem {
    id: string;
    question_title: string;
    issue_text: string;
    status: string;
    created_at: string;
}

export default function Profile() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [fullName, setFullName] = useState(user?.user_metadata?.full_name || '');
    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);

    const [feedbackHistory, setFeedbackHistory] = useState<FeedbackItem[]>([]);
    const [isLoadingFeedback, setIsLoadingFeedback] = useState(true);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        const fetchFeedback = async () => {
            try {
                const { data, error } = await supabase
                    .from('user_feedback')
                    .select('*')
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false });

                if (error) throw error;
                setFeedbackHistory(data || []);
            } catch (err) {
                console.error('Error fetching feedback history:', err);
            } finally {
                setIsLoadingFeedback(false);
            }
        };

        fetchFeedback();
    }, [user, navigate]);

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setIsSaving(true);
        setSaveError(null);
        setSaveSuccess(false);

        try {
            const { error } = await supabase.auth.updateUser({
                data: { full_name: fullName }
            });

            if (error) throw error;

            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
        } catch (err: any) {
            console.error('Error updating profile:', err);
            setSaveError(err.message || 'Failed to update profile');
        } finally {
            setIsSaving(false);
        }
    };

    if (!user) return null;

    return (
        <div className="min-h-screen bg-[#0F0F13] text-white p-6 max-w-5xl mx-auto space-y-8 mt-16">
            <div className="flex items-center gap-3">
                <User className="w-8 h-8 text-[#4F0F93]" />
                <h1 className="text-3xl font-bold">Profile Settings</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Profile Info */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-[#111317] border border-gray-800 rounded-xl p-6 shadow-xl">
                        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                            Personal Information
                        </h2>

                        <form onSubmit={handleUpdateProfile} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-[#A0A0B0] mb-1">
                                    Email Address
                                </label>
                                <div className="px-4 py-2.5 bg-zinc-800/50 border border-gray-800 rounded-lg text-gray-400 text-sm cursor-not-allowed">
                                    {user.email}
                                </div>
                            </div>

                            <div>
                                <label htmlFor="fullName" className="block text-sm font-medium text-[#A0A0B0] mb-1">
                                    Full Name
                                </label>
                                <input
                                    id="fullName"
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    className="w-full px-4 py-2.5 bg-[#0F0F13] border border-gray-800 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-[#4F0F93] transition-colors text-sm"
                                    placeholder="Enter your full name"
                                />
                            </div>

                            {saveError && (
                                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-2">
                                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                                    <p className="text-sm text-red-400">{saveError}</p>
                                </div>
                            )}

                            {saveSuccess && (
                                <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                                    <p className="text-sm text-green-400 text-center">Profile updated successfully!</p>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isSaving}
                                className="w-full py-2.5 bg-[#4F0F93] text-white text-sm font-medium rounded-lg hover:bg-[#6312BA] transition-colors disabled:opacity-50 flex items-center justify-center gap-2 mt-4"
                            >
                                {isSaving ? (
                                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <Save className="w-4 h-4" />
                                        Save Changes
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Right Column: Feedback History */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-[#111317] border border-gray-800 rounded-xl p-6 shadow-xl h-full min-h-[400px]">
                        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                            <MessageSquare className="w-5 h-5 text-[#4F0F93]" />
                            Your Feedback History
                        </h2>

                        {isLoadingFeedback ? (
                            <div className="flex items-center justify-center py-20">
                                <div className="w-8 h-8 border-4 border-[#4F0F93] border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        ) : feedbackHistory.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 text-center">
                                <div className="w-16 h-16 bg-zinc-800/50 rounded-full flex items-center justify-center mb-4">
                                    <MessageSquare className="w-8 h-8 text-gray-500" />
                                </div>
                                <h3 className="text-lg font-medium text-white mb-2">No feedback yet</h3>
                                <p className="text-[#A0A0B0] max-w-sm">
                                    You haven't submitted any feedback yet. If you find issues in questions, use the flag icon to let us know!
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {feedbackHistory.map((item) => (
                                    <div key={item.id} className="p-4 bg-zinc-800/30 border border-gray-800 rounded-lg">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-medium text-white line-clamp-1 flex-1 pr-4" title={item.question_title}>
                                                {item.question_title}
                                            </h3>
                                            <span className={`text-xs px-2.5 py-1 rounded-full border shrink-0 ${item.status === 'resolved' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                                                    item.status === 'reviewed' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                                        'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                                                }`}>
                                                {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                                            </span>
                                        </div>
                                        <p className="text-sm text-[#A0A0B0] mb-3">{item.issue_text}</p>
                                        <div className="text-xs text-gray-600">
                                            {new Date(item.created_at).toLocaleDateString()} at {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
