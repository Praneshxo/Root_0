import { useState, useEffect } from 'react';
import { CheckCircle, Circle, X, Eye } from 'lucide-react';
import { supabase, Database } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

type Question = Database['questions'];
type UserProgress = Database['user_progress'];

interface PracticePageProps {
  category: 'DSA' | 'SQL' | 'Aptitude';
  title: string;
  description: string;
}

export default function PracticePage({ category, title, description }: PracticePageProps) {
  const { user } = useAuth();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [progress, setProgress] = useState<Record<string, UserProgress>>({});
  const [loading, setLoading] = useState(true);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [showSolution, setShowSolution] = useState(false);

  useEffect(() => {
    fetchQuestionsAndProgress();
  }, [category, user?.id]);

  const fetchQuestionsAndProgress = async () => {
    try {
      const [questionsResult, progressResult] = await Promise.all([
        supabase
          .from('questions')
          .select('*')
          .eq('category', category)
          .order('difficulty'),
        user?.id
          ? supabase
            .from('user_progress')
            .select('*')
            .eq('user_id', user.id)
          : Promise.resolve({ data: null }),
      ]);

      if (questionsResult.error) throw questionsResult.error;
      setQuestions(questionsResult.data || []);

      if (progressResult.data) {
        const progressMap = progressResult.data.reduce((acc, p) => {
          acc[p.question_id] = p;
          return acc;
        }, {} as Record<string, UserProgress>);
        setProgress(progressMap);
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProgress = async (questionId: string, status: 'solved' | 'attempted' | 'bookmarked') => {
    if (!user?.id) return;

    try {
      const existing = progress[questionId];

      if (existing) {
        await supabase
          .from('user_progress')
          .update({ status, updated_at: new Date().toISOString() })
          .eq('id', existing.id);
      } else {
        await supabase.from('user_progress').insert({
          user_id: user.id,
          question_id: questionId,
          status,
        });
      }

      setProgress((prev) => ({
        ...prev,
        [questionId]: {
          ...prev[questionId],
          id: existing?.id || questionId,
          user_id: user.id,
          question_id: questionId,
          status,
          created_at: existing?.created_at || new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      }));
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'Medium':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'Hard':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-[#A0A0B0] border-gray-500/30';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">{title}</h1>
        <p className="text-[#A0A0B0]">{description}</p>
      </div>

      <div className="bg-[#111317] border border-gray-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left p-4 text-sm font-medium text-[#A0A0B0]">Status</th>
                <th className="text-left p-4 text-sm font-medium text-[#A0A0B0]">Problem Title</th>
                <th className="text-left p-4 text-sm font-medium text-[#A0A0B0]">Difficulty</th>
                <th className="text-left p-4 text-sm font-medium text-[#A0A0B0]">Action</th>
              </tr>
            </thead>
            <tbody>
              {questions.map((question) => {
                const progressData = progress[question.id];
                const isSolved = progressData?.status === 'solved';

                return (
                  <tr
                    key={question.id}
                    className="border-b border-gray-800 hover:bg-[#111317] transition-colors"
                  >
                    <td className="p-4">
                      {isSolved ? (
                        <CheckCircle className="w-5 h-5 text-green-500 cursor-pointer hover:text-green-400" />
                      ) : (
                        <Circle className="w-5 h-5 text-gray-600 cursor-pointer hover:text-[#808090]" />
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className="text-white font-medium line-clamp-1">{question.title}</span>
                        {question.is_premium && (
                          <span className="px-2 py-0.5 text-xs font-medium bg-yellow-500/20 text-yellow-400 rounded border border-yellow-500/30">
                            Premium
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full border ${getDifficultyColor(question.difficulty)}`}>
                        {question.difficulty}
                      </span>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => {
                          setSelectedQuestion(question);
                          setShowSolution(false);
                        }}
                        className="px-4 py-2 bg-gradient-to-r from-[#4F0F93] to-[#6312BA] text-white text-sm font-medium rounded-lg hover:from-[#6312BA] hover:to-[#6A03D6] transition-all"
                      >
                        Solve
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {selectedQuestion && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#111317] border border-gray-800 rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="border-b border-gray-800 p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h2 className="text-2xl font-bold text-white">{selectedQuestion.title}</h2>
                <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getDifficultyColor(selectedQuestion.difficulty)}`}>
                  {selectedQuestion.difficulty}
                </span>
              </div>
              <button
                onClick={() => setSelectedQuestion(null)}
                className="text-[#A0A0B0] hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
                <div className="p-6 border-r border-gray-800">
                  <h3 className="text-lg font-bold text-white mb-4">Problem Description</h3>
                  <div className="prose prose-invert max-w-none">
                    <p className="text-[#A0A0B0] leading-relaxed whitespace-pre-line">
                      {selectedQuestion.content}
                    </p>
                  </div>
                </div>

                <div className="p-6 bg-[#111317]/80">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-white">Solution</h3>
                    <button
                      onClick={() => setShowSolution(!showSolution)}
                      className="flex items-center gap-2 px-4 py-2 bg-zinc-800/50 hover:bg-[#2C2C2C] text-white text-sm font-medium rounded-lg transition-all"
                    >
                      <Eye className="w-4 h-4" />
                      {showSolution ? 'Hide' : 'Show'} Solution
                    </button>
                  </div>

                  {showSolution ? (
                    <div className="bg-[#111317] rounded-lg p-4">
                      <p className="text-[#D0D0E0] leading-relaxed whitespace-pre-line mb-4">
                        {selectedQuestion.solution_text || 'Solution not available yet.'}
                      </p>
                      <button
                        onClick={() => updateProgress(selectedQuestion.id, 'solved')}
                        className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all"
                      >
                        Mark as Solved
                      </button>
                    </div>
                  ) : (
                    <div className="bg-[#111317] border-2 border-dashed border-gray-800 rounded-lg p-8 text-center">
                      <p className="text-[#808090]">Click "Show Solution" to reveal the answer</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
