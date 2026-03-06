/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, CheckCircle2, Circle, Bookmark, BookmarkCheck, ArrowLeft } from 'lucide-react';
import { supabase, Database } from '../lib/supabase';
import Pagination from '../components/Pagination';

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



const ROLES_INFO = [
  { name: 'Frontend Developer', desc: 'Questions on React, HTML, CSS, JavaScript, and web performance.' },
  { name: 'Backend Developer', desc: 'Questions on Node.js, Python, Databases, APIs, and server architecture.' },
  { name: 'AI & Machine Learning', desc: 'Questions on algorithms, neural networks, data processing, and ML models.' },
  { name: 'System Design & Architecture', desc: 'Scalability, microservices, system design patterns, and architecture.' },
  { name: 'Data Analyst', desc: 'SQL, Python for data, statistics, and data visualization tools.' },
  { name: 'Blockchain', desc: 'Smart contracts, Web3, Ethereum, cryptography, and DApps.' },
  { name: 'Web3', desc: 'Decentralized applications, blockchain integration, and distributed ledgers.' },
  { name: 'Marketing', desc: 'Digital marketing, SEO, campaigns, and growth strategies.' },
  { name: 'General Interview', desc: 'Behavioral, cultural fit, and standard HR questions.' }
];

export default function InterviewQuestions() {
  const navigate = useNavigate();
  const [activeTab] = useState<'all' | 'solved' | 'revision'>('all');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);
  const [searchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [, setLoading] = useState(true);

  const [userProgress, setUserProgress] = useState<Record<string, UserProgress>>({});

  const [difficultyFilter, setDifficultyFilter] = useState('All Difficulties');
  const [roleFilter, setRoleFilter] = useState('All Roles');
  const [viewMode, setViewMode] = useState<'roles' | 'list'>('roles');
  const [, setStats] = useState<ProgressStats>({
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

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchQuery, difficultyFilter, roleFilter]);

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
          .from('user_question_tracking')
          .select('question_id, domain_page, revision')
          .eq('user_id', user.id)
          .in('question_id', questionsData.map(q => q.id));

        const progressMap: Record<string, UserProgress> = {};
        progressData?.forEach(p => {
          if (!progressMap[p.question_id]) {
            progressMap[p.question_id] = { solved: false, bookmarked: false };
          }
          if (p.domain_page) progressMap[p.question_id].solved = true;
          if (p.revision) progressMap[p.question_id].bookmarked = true;
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
        (q.content || '').toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Difficulty filter
    if (difficultyFilter !== 'All Difficulties') {
      filtered = filtered.filter(q => q.difficulty === difficultyFilter);
    }

    // Role filter (based on category for now)
    if (roleFilter !== 'All Roles') {
      filtered = filtered.filter(q => getRoleFromQuestion(q) === roleFilter);
    }

    setFilteredQuestions(filtered);
  };



  const toggleRevision = async (questionId: string) => {
    const currentStatus = userProgress[questionId]?.bookmarked || false;
    const newStatus = !currentStatus;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const question = questions.find(q => q.id === questionId);
      const topic = question ? getRoleFromQuestion(question) : 'unknown';

      await supabase.from('user_question_tracking').upsert({
        user_id: user.id,
        question_id: questionId,
        topic: topic,
        domain_page: userProgress[questionId]?.solved || false,
        revision: newStatus,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id,question_id' });

      setUserProgress(prev => ({
        ...prev,
        [questionId]: { ...prev[questionId], bookmarked: newStatus }
      }));
    } catch (error) {
      console.error('Error updating revision:', error);
    }
  };





  const getRoleFromQuestion = (question: Question): string => {
    // Simple mapping based on content
    const title = (question.title || '').toLowerCase();
    if (title.includes('react') || title.includes('frontend')) return 'Frontend Developer';
    if (title.includes('machine learning') || title.includes('ai')) return 'AI & Machine Learning';
    if (title.includes('data') || title.includes('analyst')) return 'Data Analyst';
    if (title.includes('backend') || title.includes('api')) return 'Backend Developer';
    if (title.includes('design') || title.includes('architecture')) return 'System Design & Architecture';
    if (title.includes('blockchain') || title.includes('ethereum')) return 'Blockchain';
    if (title.includes('marketing') || title.includes('campaign')) return 'Marketing';
    return 'General Interview';
  };

  // Check if user has started any questions


  return (
    <div className="space-y-5">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1.5">Interview Questions</h1>
          <p className="text-base text-[#A0A0B0]">
            Prepare for your interviews with our comprehensive collection of questions and answers.
          </p>
        </div>
      </div>

      {/* Filter Bar / Tabs */}
      <div className="flex items-center justify-between border-b border-gray-800 overflow-x-auto">
        <div className="flex gap-2">
          <button className="px-4 py-2.5 text-sm font-medium transition-colors whitespace-nowrap text-white border-b-2 border-[#4F0F93] text-[#A855F7] flex items-center gap-2">
            Discover <span className="text-xs bg-gray-800 text-[#A0A0B0] px-2 py-0.5 rounded">71</span>
          </button>
          <button className="px-4 py-2.5 text-sm font-medium transition-colors whitespace-nowrap text-[#A0A0B0] border-b-2 border-transparent hover:text-white flex items-center gap-2">
            Started <span className="text-xs bg-gray-800 text-[#A0A0B0] px-2 py-0.5 rounded">0</span>
          </button>
          <button className="px-4 py-2.5 text-sm font-medium transition-colors whitespace-nowrap text-[#A0A0B0] border-b-2 border-transparent hover:text-white flex items-center gap-2">
            Completed <span className="text-xs bg-gray-800 text-[#A0A0B0] px-2 py-0.5 rounded">0</span>
          </button>
        </div>
        <div className="flex items-center gap-2 text-sm text-[#A0A0B0] cursor-pointer hover:text-white transition-colors pb-2 pr-2">
          Most Popular <ChevronDown className="w-4 h-4" />
        </div>
      </div>

      {/* Questions List / Domains Grid */}
      {
        viewMode === 'list' ? (
          <div className="space-y-4 px-2">
            <button
              onClick={() => {
                setViewMode('roles');
                setRoleFilter('All Roles');
                setDifficultyFilter('All Difficulties');
              }}
              className="flex items-center gap-2 text-[#A0A0B0] hover:text-white transition-colors text-sm w-fit"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Domains
            </button>
            <div className="bg-[#111317] border border-gray-800 rounded-xl overflow-hidden shadow-lg w-full">
              <table className="w-full">
                <thead className="bg-[#111317] border-b border-gray-800">
                  <tr>
                    <th className="px-5 py-3.5 text-left text-sm font-medium text-[#A0A0B0] w-16">#</th>
                    <th className="px-5 py-3.5 text-left text-sm font-medium text-[#A0A0B0]">Question</th>
                    <th className="px-5 py-3.5 text-left text-sm font-medium text-[#A0A0B0] w-40">Role</th>
                    <th className="px-5 py-3.5 text-left text-sm font-medium text-[#A0A0B0] w-28">Difficulty</th>
                    <th className="px-5 py-3.5 text-center text-sm font-medium text-[#A0A0B0] w-24">Solved</th>
                    <th className="px-5 py-3.5 text-center text-sm font-medium text-[#A0A0B0] w-24">Revision</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredQuestions.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-5 py-10 text-center text-base text-[#A0A0B0]">
                        No questions found matching your filters.
                      </td>
                    </tr>
                  ) : (
                    filteredQuestions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((question, index) => (
                      <tr
                        key={question.id}
                        onClick={() => navigate(`/interview-questions/${question.id}`)}
                        className="border-b border-gray-800/50 hover:bg-[#111317] transition-colors cursor-pointer"
                      >
                        <td className="px-5 py-4 text-sm text-[#A0A0B0]">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                        <td className="px-5 py-4">
                          <div className="text-base text-white font-medium line-clamp-1">{question.title}</div>
                          <div className="text-sm text-[#A0A0B0] mt-1 line-clamp-1">
                            {question.content}
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <span className="inline-block px-2.5 py-1 text-xs font-medium bg-zinc-800/50 text-[#D0D0E0] rounded">
                            {getRoleFromQuestion(question)}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <span className={`inline-flex px-2.5 py-1 text-sm font-medium rounded border 
                          ${question.difficulty === 'Easy' ? 'text-green-400 bg-green-500/10 border-green-500/30' :
                              question.difficulty === 'Medium' ? 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30' :
                                'text-red-400 bg-red-500/10 border-red-500/30'}`}>
                            {question.difficulty}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-center">
                          <div className="inline-flex items-center justify-center w-6 h-6 text-[#A0A0B0] relative group">
                            {userProgress[question.id]?.solved ? (
                              <>
                                <CheckCircle2 className="w-6 h-6 text-green-400" />
                                <div className="absolute bottom-full mb-2 hidden group-hover:block bg-zinc-800/50 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10">
                                  Completed
                                </div>
                              </>
                            ) : (
                              <Circle className="w-6 h-6" />
                            )}
                          </div>
                        </td>
                        <td className="px-5 py-4 text-center" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => toggleRevision(question.id)}
                            className="inline-flex items-center justify-center w-6 h-6 text-[#A0A0B0] hover:text-blue-400 transition-colors"
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

            {filteredQuestions.length > 0 && (
              <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(filteredQuestions.length / itemsPerPage)}
                onPageChange={setCurrentPage}
              />
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ROLES_INFO.flatMap(role =>
              ['Easy', 'Medium', 'Hard'].map(difficulty => {
                const roleQuestions = questions.filter(q => getRoleFromQuestion(q) === role.name && q.difficulty === difficulty);
                const count = roleQuestions.length;
                if (count === 0) return null;

                // Use Quizzes page styling, subtle glow based on difficulty
                const hoverGlow =
                  difficulty === 'Easy' ? 'group-hover:shadow-[0_0_20px_rgba(34,197,94,0.15)] group-hover:border-green-500/30' :
                    difficulty === 'Medium' ? 'group-hover:shadow-[0_0_20px_rgba(234,179,8,0.15)] group-hover:border-yellow-500/30' :
                      'group-hover:shadow-[0_0_20px_rgba(239,68,68,0.15)] group-hover:border-red-500/30';

                return (
                  <div
                    key={`${role.name}-${difficulty}`}
                    onClick={() => {
                      setRoleFilter(role.name);
                      setDifficultyFilter(difficulty);
                      setViewMode('list');
                    }}
                    className={`bg-[#111317] border border-gray-800 rounded-xl p-5 transition-all duration-300 cursor-pointer flex flex-col min-h-[140px] group relative overflow-hidden ${hoverGlow}`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="flex items-start justify-between mb-3 relative z-10">
                      <h3 className="text-lg font-bold text-white line-clamp-2 pr-2 group-hover:text-[#D0D0E0] transition-colors">
                        {role.name}
                      </h3>
                    </div>
                    <p className="text-sm text-[#A0A0B0] mb-4 line-clamp-2 flex-1 relative z-10">
                      {role.desc}
                    </p>
                    <div className="flex items-center justify-between mt-auto relative z-10">
                      <span className="text-xs font-medium text-[#A0A0B0]">
                        {count} {count === 1 ? 'Question' : 'Questions'}
                      </span>
                      <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded border ${difficulty === 'Easy' ? 'text-green-400 bg-green-500/10 border-green-500/30' :
                        difficulty === 'Medium' ? 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30' :
                          'text-red-400 bg-red-500/10 border-red-500/30'
                        }`}>
                        {difficulty}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )
      }
    </div>
  );
}
