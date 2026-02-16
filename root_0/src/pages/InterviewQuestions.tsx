import { useState, useEffect } from 'react';
import { Search, ChevronDown, CheckCircle2, Circle, Bookmark, BookmarkCheck, X, Folder, Plus } from 'lucide-react';
import { supabase, Database } from '../lib/supabase';

type Question = Database['questions'];

interface UserProgress {
  solved: boolean;
  bookmarked: boolean;
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

const ROLES = [
  'All Roles',
  'Frontend Developer',
  'AI & Machine Learning',
  'Data Analyst',
  'Backend Developer',
  'System Design & Architecture',
  'General Interview',
  'Blockchain',
  'Web3',
  'Marketing'
];

export default function InterviewQuestions() {
  const [activeTab, setActiveTab] = useState<'all' | 'solved' | 'revision' | 'folders'>('all');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [userProgress, setUserProgress] = useState<Record<string, UserProgress>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('All Difficulties');
  const [roleFilter, setRoleFilter] = useState('All Roles');
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [folderName, setFolderName] = useState('');
  const [folderDescription, setFolderDescription] = useState('');
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
    fetchQuestions();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [questions, activeTab, searchQuery, difficultyFilter, roleFilter, userProgress]);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      // Fetch all interview questions (HR, Technical, Managerial)
      const { data: questionsData, error } = await supabase
        .from('questions')
        .select('*')
        .in('category', ['HR', 'Technical', 'Managerial'])
        .order('created_at');

      if (error) throw error;
      setQuestions(questionsData || []);

      // Fetch user progress
      const { data: { user } } = await supabase.auth.getUser();
      if (user && questionsData && questionsData.length > 0) {
        const { data: progressData } = await supabase
          .from('user_progress')
          .select('question_id, status')
          .eq('user_id', user.id)
          .in('question_id', questionsData.map(q => q.id));

        const progressMap: Record<string, UserProgress> = {};
        progressData?.forEach(p => {
          if (!progressMap[p.question_id]) {
            progressMap[p.question_id] = { solved: false, bookmarked: false };
          }
          if (p.status === 'solved') progressMap[p.question_id].solved = true;
          if (p.status === 'bookmarked') progressMap[p.question_id].bookmarked = true;
        });
        setUserProgress(progressMap);

        // Calculate stats
        calculateStats(questionsData, progressMap);
      } else {
        calculateStats(questionsData || [], {});
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (allQuestions: Question[], progress: Record<string, UserProgress>) => {
    const newStats: ProgressStats = {
      total: allQuestions.length,
      easy: allQuestions.filter(q => q.difficulty === 'Easy').length,
      medium: allQuestions.filter(q => q.difficulty === 'Medium').length,
      hard: allQuestions.filter(q => q.difficulty === 'Hard').length,
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

  const applyFilters = () => {
    let filtered = [...questions];

    // Tab filter
    if (activeTab === 'solved') {
      filtered = filtered.filter(q => userProgress[q.id]?.solved);
    } else if (activeTab === 'revision') {
      filtered = filtered.filter(q => userProgress[q.id]?.bookmarked);
    }

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(q =>
        q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Difficulty filter
    if (difficultyFilter !== 'All Difficulties') {
      filtered = filtered.filter(q => q.difficulty === difficultyFilter);
    }

    // Role filter (based on category for now)
    if (roleFilter !== 'All Roles') {
      // Map roles to categories or use title matching
      filtered = filtered.filter(q => q.category === 'Technical' || q.category === 'HR' || q.category === 'Managerial');
    }

    setFilteredQuestions(filtered);
  };

  const toggleSolved = async (questionId: string) => {
    const currentStatus = userProgress[questionId]?.solved || false;
    const newStatus = !currentStatus;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      if (newStatus) {
        // Mark as solved
        await supabase.from('user_progress').upsert({
          user_id: user.id,
          question_id: questionId,
          status: 'solved',
          updated_at: new Date().toISOString()
        });
      } else {
        // Remove solved status
        await supabase.from('user_progress')
          .delete()
          .eq('user_id', user.id)
          .eq('question_id', questionId)
          .eq('status', 'solved');
      }

      setUserProgress(prev => ({
        ...prev,
        [questionId]: { ...prev[questionId], solved: newStatus }
      }));

      // Recalculate stats
      const updatedProgress = {
        ...userProgress,
        [questionId]: { ...userProgress[questionId], solved: newStatus }
      };
      calculateStats(questions, updatedProgress);
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const toggleRevision = async (questionId: string) => {
    const currentStatus = userProgress[questionId]?.bookmarked || false;
    const newStatus = !currentStatus;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      if (newStatus) {
        await supabase.from('user_progress').upsert({
          user_id: user.id,
          question_id: questionId,
          status: 'bookmarked',
          updated_at: new Date().toISOString()
        });
      } else {
        await supabase.from('user_progress')
          .delete()
          .eq('user_id', user.id)
          .eq('question_id', questionId)
          .eq('status', 'bookmarked');
      }

      setUserProgress(prev => ({
        ...prev,
        [questionId]: { ...prev[questionId], bookmarked: newStatus }
      }));
    } catch (error) {
      console.error('Error updating revision:', error);
    }
  };

  const createFolder = async () => {
    if (!folderName.trim()) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase.from('interview_folders').insert({
        user_id: user.id,
        name: folderName,
        description: folderDescription,
        updated_at: new Date().toISOString()
      });

      setFolderName('');
      setFolderDescription('');
      setShowCreateFolder(false);
    } catch (error) {
      console.error('Error creating folder:', error);
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
        return 'text-gray-400 bg-gray-500/10 border-gray-500/30';
    }
  };

  const getRoleFromQuestion = (question: Question): string => {
    // Simple mapping based on content
    const title = question.title.toLowerCase();
    if (title.includes('react') || title.includes('frontend')) return 'Frontend Developer';
    if (title.includes('machine learning') || title.includes('ai')) return 'AI & Machine Learning';
    if (title.includes('data') || title.includes('analyst')) return 'Data Analyst';
    if (title.includes('backend') || title.includes('api')) return 'Backend Developer';
    if (title.includes('design') || title.includes('architecture')) return 'System Design & Architecture';
    if (title.includes('blockchain') || title.includes('ethereum')) return 'Blockchain';
    if (title.includes('marketing') || title.includes('campaign')) return 'Marketing';
    return 'General Interview';
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1.5">Interview Questions</h1>
          <p className="text-base text-gray-400">
            Prepare for your interviews with our comprehensive collection of questions and answers.
          </p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 text-sm bg-gray-800/50 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors border border-gray-700 flex items-center gap-2">
            📊 My progress
          </button>
          <button
            onClick={() => setShowCreateFolder(true)}
            className="px-4 py-2 text-sm bg-gray-800/50 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors border border-gray-700 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Create folder
          </button>
        </div>
      </div>

      {/* Progress Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Total Progress</span>
            <span className="text-xs text-gray-500">ℹ️</span>
          </div>
          <div className="text-2xl font-bold text-white">{stats.solvedTotal}/{stats.total}</div>
          <div className="mt-2 h-1.5 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-purple-600"
              style={{ width: `${stats.total > 0 ? (stats.solvedTotal / stats.total) * 100 : 0}%` }}
            />
          </div>
        </div>

        <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Easy Questions</span>
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
          </div>
          <div className="text-2xl font-bold text-white">{stats.solvedEasy}/{stats.easy}</div>
        </div>

        <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Medium Questions</span>
            <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
          </div>
          <div className="text-2xl font-bold text-white">{stats.solvedMedium}/{stats.medium}</div>
        </div>

        <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Hard Questions</span>
            <span className="w-2 h-2 bg-red-500 rounded-full"></span>
          </div>
          <div className="text-2xl font-bold text-white">{stats.solvedHard}/{stats.hard}</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-800">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2.5 text-sm font-medium transition-colors ${activeTab === 'all'
            ? 'text-white border-b-2 border-white'
            : 'text-gray-400 hover:text-white'
            }`}
        >
          All questions
        </button>
        <button
          onClick={() => setActiveTab('solved')}
          className={`px-4 py-2.5 text-sm font-medium transition-colors ${activeTab === 'solved'
            ? 'text-white border-b-2 border-white'
            : 'text-gray-400 hover:text-white'
            }`}
        >
          Solved questions
        </button>
        <button
          onClick={() => setActiveTab('revision')}
          className={`px-4 py-2.5 text-sm font-medium transition-colors ${activeTab === 'revision'
            ? 'text-white border-b-2 border-white'
            : 'text-gray-400 hover:text-white'
            }`}
        >
          Revision questions
        </button>
        <button
          onClick={() => setActiveTab('folders')}
          className={`px-4 py-2.5 text-sm font-medium transition-colors ${activeTab === 'folders'
            ? 'text-white border-b-2 border-white'
            : 'text-gray-400 hover:text-white'
            }`}
        >
          Folders
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-3 items-center">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search interview questions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-900/50 border border-gray-800 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-gray-700"
          />
        </div>

        <div className="relative">
          <select
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
            className="appearance-none bg-gray-900/50 border border-gray-800 rounded-lg px-4 py-2.5 pr-10 text-sm text-white focus:outline-none focus:border-gray-700 cursor-pointer"
          >
            <option>All Difficulties</option>
            <option>Easy</option>
            <option>Medium</option>
            <option>Hard</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>

        <div className="relative">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="appearance-none bg-gray-900/50 border border-gray-800 rounded-lg px-4 py-2.5 pr-10 text-sm text-white focus:outline-none focus:border-gray-700 cursor-pointer"
          >
            {ROLES.map(role => (
              <option key={role}>{role}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>

        {(searchQuery || difficultyFilter !== 'All Difficulties' || roleFilter !== 'All Roles') && (
          <button
            onClick={() => {
              setSearchQuery('');
              setDifficultyFilter('All Difficulties');
              setRoleFilter('All Roles');
            }}
            className="px-4 py-2.5 text-sm text-gray-400 hover:text-white transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      {/* Questions Table */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : activeTab === 'folders' ? (
        <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-xl p-8 text-center">
          <Folder className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400">No folders created yet. Click "Create folder" to organize your questions.</p>
        </div>
      ) : (
        <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-800/50 border-b border-gray-800">
              <tr>
                <th className="px-5 py-3.5 text-left text-sm font-medium text-gray-400 w-16">#</th>
                <th className="px-5 py-3.5 text-left text-sm font-medium text-gray-400">Question</th>
                <th className="px-5 py-3.5 text-left text-sm font-medium text-gray-400 w-40">Role</th>
                <th className="px-5 py-3.5 text-left text-sm font-medium text-gray-400 w-28">Difficulty</th>
                <th className="px-5 py-3.5 text-center text-sm font-medium text-gray-400 w-24">Solved</th>
                <th className="px-5 py-3.5 text-center text-sm font-medium text-gray-400 w-24">Revision</th>
              </tr>
            </thead>
            <tbody>
              {filteredQuestions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-base text-gray-400">
                    No questions found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredQuestions.map((question, index) => (
                  <tr
                    key={question.id}
                    className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors"
                  >
                    <td className="px-5 py-4 text-sm text-gray-400">{index + 1}</td>
                    <td className="px-5 py-4">
                      <div className="text-base text-white font-medium">{question.title}</div>
                      <div className="text-sm text-gray-400 mt-1 line-clamp-1">
                        {question.content}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-block px-2.5 py-1 text-xs font-medium bg-gray-800 text-gray-300 rounded">
                        {getRoleFromQuestion(question)}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex px-2.5 py-1 text-sm font-medium rounded border ${getDifficultyColor(question.difficulty)}`}>
                        {question.difficulty}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <button
                        onClick={() => toggleSolved(question.id)}
                        className="inline-flex items-center justify-center w-6 h-6 text-gray-400 hover:text-green-400 transition-colors"
                      >
                        {userProgress[question.id]?.solved ? (
                          <CheckCircle2 className="w-6 h-6 text-green-400" />
                        ) : (
                          <Circle className="w-6 h-6" />
                        )}
                      </button>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <button
                        onClick={() => toggleRevision(question.id)}
                        className="inline-flex items-center justify-center w-6 h-6 text-gray-400 hover:text-blue-400 transition-colors"
                      >
                        {userProgress[question.id]?.bookmarked ? (
                          <BookmarkCheck className="w-6 h-6 text-blue-400" />
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
      )}

      {/* Create Folder Modal */}
      {showCreateFolder && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Create New Folder</h2>
              <button
                onClick={() => setShowCreateFolder(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Folder Name
                </label>
                <input
                  type="text"
                  value={folderName}
                  onChange={(e) => setFolderName(e.target.value)}
                  placeholder="e.g., System Design Questions"
                  className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  value={folderDescription}
                  onChange={(e) => setFolderDescription(e.target.value)}
                  placeholder="Add a description..."
                  rows={3}
                  className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowCreateFolder(false)}
                  className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-300 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={createFolder}
                  disabled={!folderName.trim()}
                  className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Create Folder
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
