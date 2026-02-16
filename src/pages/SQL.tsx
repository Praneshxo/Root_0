import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronDown, CheckCircle2, Circle, Bookmark, BookmarkCheck } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface SQLQuestion {
  id: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  type: 'theory' | 'query';
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

const SQL_CATEGORIES = [
  'Aggregation', 'Basics', 'CASE', 'Constraints', 'CTE', 'Cursors',
  'Database Design', 'Data Manipulation', 'Data Transformation', 'Data Types',
  'Date Functions', 'DELETE', 'DISTINCT', 'Duplicates', 'Filtering',
  'Functions', 'GROUP BY', 'Hierarchical Queries', 'Indexes', 'Joins',
  'Normalization', 'Optimization', 'Pivoting', 'SELECT', 'Sorting',
  'Stored Procedures', 'String Functions', 'Subqueries', 'Transactions',
  'Triggers', 'UNION', 'UPDATE', 'Views', 'Window Functions'
];

export default function SQL() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<SQLQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'solved' | 'revision'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('All Difficulties');
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [userProgress, setUserProgress] = useState<Record<string, UserProgress>>({});
  const [stats, setStats] = useState<ProgressStats>({
    total: 160,
    easy: 39,
    medium: 74,
    hard: 47,
    solvedTotal: 0,
    solvedEasy: 0,
    solvedMedium: 0,
    solvedHard: 0
  });
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showDifficultyDropdown, setShowDifficultyDropdown] = useState(false);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);

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
        .from('sql_questions')
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
        .from('user_sql_progress')
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

  const calculateStats = (allQuestions: SQLQuestion[], progress: Record<string, UserProgress>) => {
    const newStats: ProgressStats = {
      total: allQuestions.length || 160,
      easy: allQuestions.filter(q => q.difficulty === 'Easy').length || 39,
      medium: allQuestions.filter(q => q.difficulty === 'Medium').length || 74,
      hard: allQuestions.filter(q => q.difficulty === 'Hard').length || 47,
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
        .from('user_sql_progress')
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
        .from('user_sql_progress')
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

    const matchesSearch = question.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      question.description?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = !selectedCategory || question.category === selectedCategory;
    const matchesDifficulty = difficultyFilter === 'All Difficulties' || question.difficulty === difficultyFilter;
    const matchesType = typeFilter === 'All Types' || question.type === typeFilter;

    return matchesTab && matchesSearch && matchesCategory && matchesDifficulty && matchesType;
  });

  const progressPercentage = stats.total > 0 ? Math.round((stats.solvedTotal / stats.total) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <div className="border-b border-purple-500/20 bg-gray-900/50 backdrop-blur-xl">
        <div className="px-6 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">SQL Interview Questions</h1>
              <p className="text-gray-400">Practice SQL problems and prepare for technical interviews</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-3 py-1.5 bg-gray-800 text-white border border-gray-700 rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2">
                <span className="text-base">📊</span>
                <span className="text-sm font-medium">My progress</span>
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
              All SQL Questions
            </button>
            <button
              onClick={() => setActiveTab('solved')}
              className={`pb-3 border-b-2 transition-colors ${activeTab === 'solved'
                ? 'border-purple-500 text-white'
                : 'border-transparent text-gray-400 hover:text-white'
                }`}
            >
              Solved Questions
            </button>
            <button
              onClick={() => setActiveTab('revision')}
              className={`pb-3 border-b-2 transition-colors ${activeTab === 'revision'
                ? 'border-purple-500 text-white'
                : 'border-transparent text-gray-400 hover:text-white'
                }`}
            >
              Questions for Revision
            </button>
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

        {/* Search and Filters */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 mb-6">
          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search SQL questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black/40 border border-gray-800 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50"
            />
          </div>

          {/* Filter Dropdowns */}
          <div className="flex items-center gap-3">
            {/* Category Filter */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowCategoryDropdown(!showCategoryDropdown);
                  setShowDifficultyDropdown(false);
                  setShowTypeDropdown(false);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-black/40 border border-purple-500/30 rounded-lg hover:border-purple-500/50 transition-colors"
              >
                <span className="text-sm">{selectedCategory || 'Question category'}</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              {showCategoryDropdown && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowCategoryDropdown(false)}
                  />
                  <div className="absolute top-full left-0 mt-2 w-56 bg-gray-900 border border-gray-800 rounded-lg shadow-xl z-50 max-h-80 overflow-y-auto">
                    <button
                      onClick={() => {
                        setSelectedCategory(null);
                        setShowCategoryDropdown(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-purple-500/10 transition-colors"
                    >
                      All Categories
                    </button>
                    {SQL_CATEGORIES.map(cat => (
                      <button
                        key={cat}
                        onClick={() => {
                          setSelectedCategory(cat);
                          setShowCategoryDropdown(false);
                        }}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-purple-500/10 transition-colors"
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Difficulty Filter */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowDifficultyDropdown(!showDifficultyDropdown);
                  setShowCategoryDropdown(false);
                  setShowTypeDropdown(false);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-black/40 border border-purple-500/30 rounded-lg hover:border-purple-500/50 transition-colors"
              >
                <span className="text-sm">{difficultyFilter}</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              {showDifficultyDropdown && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowDifficultyDropdown(false)}
                  />
                  <div className="absolute top-full left-0 mt-2 w-48 bg-gray-900 border border-purple-500/30 rounded-lg shadow-xl z-50">
                    {['All Difficulties', 'Easy', 'Medium', 'Hard'].map(diff => (
                      <button
                        key={diff}
                        onClick={() => {
                          setDifficultyFilter(diff);
                          setShowDifficultyDropdown(false);
                        }}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-purple-500/10 transition-colors"
                      >
                        {diff}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Type Filter */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowTypeDropdown(!showTypeDropdown);
                  setShowCategoryDropdown(false);
                  setShowDifficultyDropdown(false);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-black/40 border border-purple-500/30 rounded-lg hover:border-purple-500/50 transition-colors"
              >
                <span className="text-sm">{typeFilter}</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              {showTypeDropdown && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowTypeDropdown(false)}
                  />
                  <div className="absolute top-full left-0 mt-2 w-48 bg-gray-900 border border-purple-500/30 rounded-lg shadow-xl z-50">
                    {['All Types', 'theory', 'query'].map(type => (
                      <button
                        key={type}
                        onClick={() => {
                          setTypeFilter(type);
                          setShowTypeDropdown(false);
                        }}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-800 transition-colors capitalize"
                      >
                        {type === 'All Types' ? type : type}
                      </button>
                    ))}
                  </div>
                </>
              )}
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
                <th className="text-left px-6 py-3 font-medium">Category</th>
                <th className="text-left px-6 py-3 font-medium">Difficulty</th>
                <th className="text-left px-6 py-3 font-medium">Solved</th>
                <th className="text-left px-6 py-3 font-medium">Revision</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    Loading questions...
                  </td>
                </tr>
              ) : filteredQuestions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    No questions found
                  </td>
                </tr>
              ) : (
                filteredQuestions.map((question, index) => (
                  <tr
                    key={question.id}
                    onClick={() => navigate(`/sql/${question.id}`)}
                    className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-4 text-gray-500">{index + 1}</td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-white mb-1 line-clamp-1">{question.title}</div>
                        <div className="text-sm text-gray-400 line-clamp-1">{question.description}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-300">{question.category}</span>
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
