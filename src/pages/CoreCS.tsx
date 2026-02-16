import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Circle, Bookmark, BookmarkCheck, Plus } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface CoreCSQuestion {
  id: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  solution_text: string | null;
}

interface UserProgress {
  solved: boolean;
  revision: boolean;
}

interface ProgressStats {
  total: number;
  easy: number;
  medium: number;
  hard: number;
  solvedTotal: number;
  solvedEasy: number;
  solvedMedium: number;
  solvedHard: number;
}

const CORE_CS_CATEGORIES = [
  'System Design',
  'Computer Networks',
  'DBMS',
  'Object Oriented Programming',
  'Computer Architecture',
  'Operating Systems'
];

export default function CoreCS() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<CoreCSQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'solved' | 'revision' | 'folders'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [userProgress, setUserProgress] = useState<Record<string, UserProgress>>({});
  const [stats, setStats] = useState<ProgressStats>({
    total: 117,
    easy: 14,
    medium: 75,
    hard: 28,
    solvedTotal: 0,
    solvedEasy: 0,
    solvedMedium: 0,
    solvedHard: 0
  });

  useEffect(() => {
    fetchQuestions();
  }, []);

  useEffect(() => {
    if (user && questions.length > 0) {
      fetchUserProgress();
    }
  }, [user, questions]);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('core_cs_questions')
        .select('*')
        .order('created_at');

      if (error) throw error;
      setQuestions(data || []);
      calculateStats(data || [], {});
    } catch (error) {
      console.error('Error fetching questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProgress = async () => {
    if (!user) return;
    try {
      const { data } = await supabase
        .from('user_core_cs_progress')
        .select('question_id, solved, revision')
        .eq('user_id', user.id);

      const progressMap: Record<string, UserProgress> = {};
      data?.forEach(p => {
        progressMap[p.question_id] = {
          solved: p.solved,
          revision: p.revision
        };
      });
      setUserProgress(progressMap);
      calculateStats(questions, progressMap);
    } catch (error) {
      console.error('Error fetching progress:', error);
    }
  };

  const calculateStats = (allQuestions: CoreCSQuestion[], progress: Record<string, UserProgress>) => {
    const newStats: ProgressStats = {
      total: allQuestions.length || 117,
      easy: allQuestions.filter(q => q.difficulty === 'Easy').length || 14,
      medium: allQuestions.filter(q => q.difficulty === 'Medium').length || 75,
      hard: allQuestions.filter(q => q.difficulty === 'Hard').length || 28,
      solvedTotal: 0,
      solvedEasy: 0,
      solvedMedium: 0,
      solvedHard: 0
    };

    allQuestions.forEach(q => {
      if (progress[q.id]?.solved) {
        newStats.solvedTotal++;
        if (q.difficulty === 'Easy') newStats.solvedEasy++;
        if (q.difficulty === 'Medium') newStats.solvedMedium++;
        if (q.difficulty === 'Hard') newStats.solvedHard++;
      }
    });

    setStats(newStats);
  };

  const toggleSolved = async (questionId: string) => {
    if (!user) return;

    const currentProgress = userProgress[questionId];
    const newSolved = !currentProgress?.solved;

    try {
      const { error } = await supabase
        .from('user_core_cs_progress')
        .upsert({
          user_id: user.id,
          question_id: questionId,
          solved: newSolved,
          revision: currentProgress?.revision || false
        });

      if (error) throw error;

      setUserProgress(prev => ({
        ...prev,
        [questionId]: {
          ...prev[questionId],
          solved: newSolved
        }
      }));
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const toggleRevision = async (questionId: string) => {
    if (!user) return;

    const currentProgress = userProgress[questionId];
    const newRevision = !currentProgress?.revision;

    try {
      const { error } = await supabase
        .from('user_core_cs_progress')
        .upsert({
          user_id: user.id,
          question_id: questionId,
          solved: currentProgress?.solved || false,
          revision: newRevision
        });

      if (error) throw error;

      setUserProgress(prev => ({
        ...prev,
        [questionId]: {
          ...prev[questionId],
          revision: newRevision
        }
      }));
    } catch (error) {
      console.error('Error updating revision:', error);
    }
  };

  const filteredQuestions = questions.filter(question => {
    const matchesTab =
      activeTab === 'all' ||
      (activeTab === 'solved' && userProgress[question.id]?.solved) ||
      (activeTab === 'revision' && userProgress[question.id]?.revision);

    const matchesCategory = !selectedCategory || question.category === selectedCategory;

    return matchesTab && matchesCategory;
  });

  const progressPercentage = stats.total > 0 ? Math.round((stats.solvedTotal / stats.total) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <div className="border-b border-purple-500/20 bg-gray-900/50 backdrop-blur-xl">
        <div className="px-6 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Core Subjects</h1>
              <p className="text-gray-400">Master fundamental computer science concepts and prepare for technical interviews</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-3 py-1.5 bg-gray-800 text-white border border-gray-700 rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2">
                <span className="text-base">📊</span>
                <span className="text-sm font-medium">My progress</span>
              </button>
              <button className="px-3 py-1.5 bg-gray-800 text-white border border-gray-700 rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2">
                <Plus className="w-4 h-4" />
                <span className="text-sm font-medium">Create Folder</span>
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-6 text-sm">
            <button
              onClick={() => setActiveTab('all')}
              className={`pb-3 border-b-2 transition-colors ${activeTab === 'all'
                ? 'border-purple-500 text-white'
                : 'border-transparent text-gray-400 hover:text-white'
                }`}
            >
              All questions
            </button>
            <button
              onClick={() => setActiveTab('solved')}
              className={`pb-3 border-b-2 transition-colors ${activeTab === 'solved'
                ? 'border-purple-500 text-white'
                : 'border-transparent text-gray-400 hover:text-white'
                }`}
            >
              Solved questions
            </button>
            <button
              onClick={() => setActiveTab('revision')}
              className={`pb-3 border-b-2 transition-colors ${activeTab === 'revision'
                ? 'border-purple-500 text-white'
                : 'border-transparent text-gray-400 hover:text-white'
                }`}
            >
              Revision questions
            </button>
            <button
              onClick={() => setActiveTab('folders')}
              className={`pb-3 border-b-2 transition-colors ${activeTab === 'folders'
                ? 'border-purple-500 text-white'
                : 'border-transparent text-gray-400 hover:text-white'
                }`}
            >
              My Folders
            </button>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="border-b border-gray-800 bg-[#0a0a0a]">
        <div className="px-6 overflow-x-auto">
          <div className="flex items-center gap-2 py-3">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${!selectedCategory
                ? 'bg-white text-black'
                : 'bg-transparent text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
            >
              All Questions
            </button>
            {CORE_CS_CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${selectedCategory === category
                  ? 'bg-white text-black'
                  : 'bg-transparent text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {/* Total Progress */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Total Progress</span>
              <span className="text-xs text-gray-500">ⓘ</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold">{stats.solvedTotal}</span>
              <span className="text-gray-500">/ {stats.total}</span>
            </div>
            <div className="mt-2 text-sm text-orange-400">{progressPercentage}%</div>
          </div>

          {/* Easy Questions */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Easy Questions</span>
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold">{stats.solvedEasy}</span>
              <span className="text-gray-500">/ {stats.easy}</span>
            </div>
          </div>

          {/* Medium Questions */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Medium Questions</span>
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold">{stats.solvedMedium}</span>
              <span className="text-gray-500">/ {stats.medium}</span>
            </div>
          </div>

          {/* Hard Questions */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Hard Questions</span>
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold">{stats.solvedHard}</span>
              <span className="text-gray-500">/ {stats.hard}</span>
            </div>
          </div>
        </div>

        {/* Questions Table */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-black/40 border-b border-gray-800">
              <tr className="text-sm text-gray-400">
                <th className="text-left px-6 py-3 font-medium w-12">#</th>
                <th className="text-left px-6 py-3 font-medium">Question</th>
                <th className="text-left px-6 py-3 font-medium">Difficulty</th>
                <th className="text-left px-6 py-3 font-medium">Solved</th>
                <th className="text-left px-6 py-3 font-medium">Revision</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    Loading questions...
                  </td>
                </tr>
              ) : filteredQuestions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    No questions found
                  </td>
                </tr>
              ) : (
                filteredQuestions.map((question, index) => (
                  <tr
                    key={question.id}
                    onClick={() => navigate(`/core-cs/${question.id}`)}
                    className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-4 text-gray-500">{index + 1}</td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-white mb-1 line-clamp-1">{question.title}</div>
                        <div className="text-sm text-gray-400 line-clamp-2">{question.description}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-sm font-medium ${question.difficulty === 'Easy'
                          ? 'text-green-500'
                          : question.difficulty === 'Medium'
                            ? 'text-yellow-500'
                            : 'text-red-500'
                          }`}
                      >
                        {question.difficulty}
                      </span>
                    </td>
                    <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                      <div className="inline-flex items-center justify-center w-5 h-5 text-gray-400 relative group">
                        {userProgress[question.id]?.solved ? (
                          <>
                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                            <div className="absolute bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                              Completed
                            </div>
                          </>
                        ) : (
                          <>
                            <Circle className="w-5 h-5" />
                            <div className="absolute bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10">
                              Click row to view question
                            </div>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => toggleRevision(question.id)}
                        className="text-gray-400 hover:text-purple-500 transition-colors"
                      >
                        {userProgress[question.id]?.revision ? (
                          <BookmarkCheck className="w-5 h-5 text-purple-500" />
                        ) : (
                          <Bookmark className="w-5 h-5" />
                        )}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
