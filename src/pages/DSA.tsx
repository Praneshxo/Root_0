import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronDown, CheckCircle2, Circle, Bookmark, BookmarkCheck } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import Pagination from '../components/Pagination';

interface CompanyQuestion {
  id: string;
  question: string;
  explanation_text: string | null;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  content_type: string | null;
  subcategory: string | null;
  company_name: string;
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

export default function DSA() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [problems, setProblems] = useState<CompanyQuestion[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'solved' | 'revision'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('All Difficulties');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [userProgress, setUserProgress] = useState<Record<string, UserProgress>>({});
  const [stats, setStats] = useState<ProgressStats>({
    total: 0,
    easy: 0,
    medium: 0,
    hard: 0,
    solvedTotal: 0,
    solvedEasy: 0,
    solvedMedium: 0,
    solvedHard: 0
  });
  useEffect(() => {
    fetchProblems();
  }, []);

  useEffect(() => {
    if (user && problems.length > 0) {
      fetchUserProgress();
    }
  }, [user, problems]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, difficultyFilter, selectedCategory, activeTab]);

  const fetchProblems = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('company_topic_questions')
        .select('*')
        .eq('topic', 'DSA')
        .order('created_at');

      if (error) throw error;

      const fetchedProblems = data || [];
      setProblems(fetchedProblems);

      // Extract unique subcategories from 'subcategory' column
      const uniqueCategories = Array.from(new Set(fetchedProblems.map(p => p.subcategory || 'Miscellaneous'))).sort();
      setCategories(uniqueCategories);

      calculateStats(fetchedProblems, {});
    } catch (error) {
      console.error('Error fetching problems:', error);
    } finally {
      if (!user) setLoading(false);
    }
  };

  const fetchUserProgress = async () => {
    if (!user) return;
    try {
      const { data } = await supabase
        .from('user_dsa_progress')
        .select('problem_id, solved, revision')
        .eq('user_id', user.id);

      const progressMap: Record<string, UserProgress> = {};
      data?.forEach(p => {
        progressMap[p.problem_id] = {
          solved: p.solved,
          revision: p.revision
        };
      });
      setUserProgress(progressMap);
      calculateStats(problems, progressMap);
    } catch (error) {
      console.error('Error fetching progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (allProblems: CompanyQuestion[], progress: Record<string, UserProgress>) => {
    const newStats: ProgressStats = {
      total: allProblems.length,
      easy: allProblems.filter(p => p.difficulty === 'Easy').length,
      medium: allProblems.filter(p => p.difficulty === 'Medium').length,
      hard: allProblems.filter(p => p.difficulty === 'Hard').length,
      solvedTotal: 0,
      solvedEasy: 0,
      solvedMedium: 0,
      solvedHard: 0
    };

    allProblems.forEach(p => {
      if (progress[p.id]?.solved) {
        newStats.solvedTotal++;
        if (p.difficulty === 'Easy') newStats.solvedEasy++;
        if (p.difficulty === 'Medium') newStats.solvedMedium++;
        if (p.difficulty === 'Hard') newStats.solvedHard++;
      }
    });

    setStats(newStats);
  };

  const toggleSolved = async (problemId: string) => {
    if (!user) return;
    const currentStatus = userProgress[problemId]?.solved || false;
    const newStatus = !currentStatus;

    try {
      await supabase.from('user_dsa_progress').upsert({
        user_id: user.id,
        problem_id: problemId,
        solved: newStatus,
        revision: userProgress[problemId]?.revision || false,
        updated_at: new Date().toISOString()
      });

      const updatedProgress = {
        ...userProgress,
        [problemId]: { ...userProgress[problemId], solved: newStatus }
      };
      setUserProgress(updatedProgress);
      calculateStats(problems, updatedProgress);
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const toggleRevision = async (problemId: string) => {
    if (!user) return;
    const currentStatus = userProgress[problemId]?.revision || false;
    const newStatus = !currentStatus;

    try {
      await supabase.from('user_dsa_progress').upsert({
        user_id: user.id,
        problem_id: problemId,
        solved: userProgress[problemId]?.solved || false,
        revision: newStatus,
        updated_at: new Date().toISOString()
      });

      setUserProgress(prev => ({
        ...prev,
        [problemId]: { ...prev[problemId], revision: newStatus }
      }));
    } catch (error) {
      console.error('Error updating revision:', error);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'text-green-400 bg-green-500/10 border-green-500/30';
      case 'Medium':
        return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
      case 'Hard':
        return 'text-red-400 bg-red-500/10 border-red-500/30';
      default:
        return 'text-[#A0A0B0] bg-gray-500/10 border-gray-500/30';
    }
  };

  const getFilteredProblems = () => {
    let filtered = problems;

    // Tab filter
    if (activeTab === 'solved') {
      filtered = filtered.filter(p => userProgress[p.id]?.solved);
    } else if (activeTab === 'revision') {
      filtered = filtered.filter(p => userProgress[p.id]?.revision);
    }

    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter(p => (p.subcategory || 'Miscellaneous') === selectedCategory);
    }

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(p =>
        p.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.explanation_text || '').toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Difficulty filter
    if (difficultyFilter !== 'All Difficulties') {
      filtered = filtered.filter(p => p.difficulty === difficultyFilter);
    }

    return filtered;
  };

  const getCategoryProblemCount = (categoryName: string) => {
    return problems.filter(p => (p.subcategory || 'Miscellaneous') === categoryName).length;
  };

  const filteredProblems = getFilteredProblems();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-12 h-12 border-4 border-[#4F0F93] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex gap-6">
      {/* Left Sidebar - Categories */}
      <div className="w-64 flex-shrink-0">
        <div className="bg-[#111317] border border-gray-800 rounded-xl p-4 sticky top-6">
          <h3 className="text-sm font-semibold text-[#A0A0B0] mb-3">CATEGORIES</h3>
          <div className="space-y-1">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-colors ${selectedCategory === null
                ? 'bg-[#4F0F93]/20 text-[#8970D6]'
                : 'text-[#A0A0B0] hover:text-white hover:bg-[#111317]'
                }`}
            >
              <span>All Categories</span>
              <span className="text-xs text-[#808090]">{problems.length}</span>
            </button>
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-colors ${selectedCategory === category
                  ? 'bg-[#4F0F93]/20 text-[#8970D6]'
                  : 'text-[#A0A0B0] hover:text-white hover:bg-[#111317]'
                  }`}
              >
                <span className="flex items-center gap-2">
                  <span className="truncate">{category}</span>
                </span>
                <span className="text-xs text-[#808090]">{getCategoryProblemCount(category)}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1.5">Data Structures & Algorithms</h1>
            <p className="text-base text-[#A0A0B0]">
              Practice DSA problems and prepare your interviews
            </p>
          </div>
        </div>

        {/* Progress Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-[#111317] border border-gray-800 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-[#A0A0B0]">Total Progress</span>
              <span className="text-xs text-[#808090]">ℹ️</span>
            </div>
            <div className="text-2xl font-bold text-white">{stats.solvedTotal}/{stats.total}</div>
            <div className="mt-2 h-1.5 bg-zinc-800/50 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#4F0F93]"
                style={{ width: `${stats.total > 0 ? (stats.solvedTotal / stats.total) * 100 : 0}%` }}
              />
            </div>
          </div>

          <div className="bg-[#111317] border border-gray-800 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-[#A0A0B0]">Easy Questions</span>
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            </div>
            <div className="text-2xl font-bold text-white">{stats.solvedEasy}/{stats.easy}</div>
          </div>

          <div className="bg-[#111317] border border-gray-800 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-[#A0A0B0]">Medium Questions</span>
              <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
            </div>
            <div className="text-2xl font-bold text-white">{stats.solvedMedium}/{stats.medium}</div>
          </div>

          <div className="bg-[#111317] border border-gray-800 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-[#A0A0B0]">Hard Questions</span>
              <span className="w-2 h-2 bg-red-500 rounded-full"></span>
            </div>
            <div className="text-2xl font-bold text-white">{stats.solvedHard}/{stats.hard}</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 border-b border-gray-800">
          {[
            { key: 'all', label: 'All problems' },
            { key: 'solved', label: 'Solved problems' },
            { key: 'revision', label: 'Revision' }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as 'all' | 'solved' | 'revision')}
              className={`px-4 py-2.5 text-sm font-medium transition-colors ${activeTab === tab.key
                ? 'text-white border-b-2 border-[#4F0F93]'
                : 'text-[#A0A0B0] hover:text-white'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search and Filters */}
        <div className="flex gap-3 items-center">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A0A0B0]" />
            <input
              type="text"
              placeholder="Search DSA problems..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#111317]/80 border border-gray-800 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#4F0F93]/50"
            />
          </div>

          <div className="relative">
            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              className="appearance-none bg-[#111317]/80 border border-gray-800 rounded-lg px-4 py-2.5 pr-10 text-sm text-white focus:outline-none focus:border-[#4F0F93]/50 cursor-pointer"
            >
              <option>All Difficulties</option>
              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A0A0B0] pointer-events-none" />
          </div>
        </div>

        {/* Problems Table */}
        <div className="bg-[#111317] border border-gray-800 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-[#111317] border-b border-gray-800">
              <tr>
                <th className="px-5 py-3.5 text-left text-sm font-medium text-[#A0A0B0] w-16">#</th>
                <th className="px-5 py-3.5 text-left text-sm font-medium text-[#A0A0B0]">Question</th>
                <th className="px-5 py-3.5 text-left text-sm font-medium text-[#A0A0B0] w-28">Difficulty</th>
                <th className="px-5 py-3.5 text-center text-sm font-medium text-[#A0A0B0] w-24">Solved</th>
                <th className="px-5 py-3.5 text-center text-sm font-medium text-[#A0A0B0] w-24">Revision</th>
              </tr>
            </thead>
            <tbody>
              {filteredProblems.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-base text-[#A0A0B0]">
                    No problems found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredProblems.map((problem, index) => (
                  <tr
                    key={problem.id}
                    onClick={() => navigate(`/dsa/${problem.id}`)}
                    className="border-b border-gray-800/50 hover:bg-[#4F0F93]/5 transition-colors cursor-pointer"
                  >
                    <td className="px-5 py-4 text-sm text-[#A0A0B0]">{index + 1}</td>
                    <td className="px-5 py-4">
                      <div className="text-base text-white font-medium mb-1 line-clamp-1">{problem.question}</div>
                      <div className="text-sm text-[#A0A0B0] line-clamp-2">
                        {problem.explanation_text}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex px-2.5 py-1 text-sm font-medium rounded border ${getDifficultyColor(problem.difficulty)}`}>
                        {problem.difficulty}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-center" onClick={(e) => e.stopPropagation()}>
                      <div
                        className="inline-flex items-center justify-center w-6 h-6 text-[#A0A0B0] relative group cursor-pointer hover:text-green-400 transition-colors"
                        onClick={() => toggleSolved(problem.id)}
                      >
                        {userProgress[problem.id]?.solved ? (
                          <>
                            <CheckCircle2 className="w-6 h-6 text-green-400" />
                            <div className="absolute bottom-full mb-2 hidden group-hover:block bg-zinc-800/50 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                              Completed
                            </div>
                          </>
                        ) : (
                          <>
                            <Circle className="w-6 h-6" />
                            <div className="absolute bottom-full mb-2 hidden group-hover:block bg-zinc-800/50 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10">
                              Mark as solved
                            </div>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-center" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => toggleRevision(problem.id)}
                        className="inline-flex items-center justify-center w-6 h-6 text-[#A0A0B0] hover:text-[#A855F7] transition-colors"
                      >
                        {userProgress[problem.id]?.revision ? (
                          <BookmarkCheck className="w-6 h-6 text-[#A855F7]" />
                        ) : (
                          <Bookmark className="w-6 h-6" />
                        )}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {filteredProblems.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(filteredProblems.length / itemsPerPage)}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </div>
  );
}
