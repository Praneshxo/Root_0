import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Circle, Bookmark, BookmarkCheck } from 'lucide-react';
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



export default function CoreCS() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<CompanyQuestion[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'solved' | 'revision'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
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
    fetchQuestions();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, selectedCategory]);

  useEffect(() => {
    if (user && questions.length > 0) {
      fetchUserProgress();
    }
  }, [user, questions]);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('company_topic_questions')
        .select('*')
        .eq('topic', 'Core CS')
        .order('created_at');

      if (error) throw error;

      const fetchedQuestions = data || [];
      setQuestions(fetchedQuestions);

      const uniqueCategories = Array.from(new Set(fetchedQuestions.map(q => q.subcategory || 'Miscellaneous'))).sort();
      setCategories(uniqueCategories);

      calculateStats(fetchedQuestions, {});
    } catch (error) {
      console.error('Error fetching questions:', error);
    } finally {
      if (!user) setLoading(false);
    }
  };

  const fetchUserProgress = async () => {
    if (!user) return;
    try {
      const { data } = await supabase
        .from('user_question_tracking')
        .select('question_id, domain_page, revision')
        .eq('user_id', user.id);

      const progressMap: Record<string, UserProgress> = {};
      data?.forEach(p => {
        progressMap[p.question_id] = {
          solved: p.domain_page,
          revision: p.revision
        };
      });
      setUserProgress(progressMap);
      calculateStats(questions, progressMap);
    } catch (error) {
      console.error('Error fetching progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (allQuestions: CompanyQuestion[], progress: Record<string, UserProgress>) => {
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



  const toggleRevision = async (questionId: string) => {
    if (!user) return;

    const currentProgress = userProgress[questionId];
    const newRevision = !currentProgress?.revision;

    try {
      const { error } = await supabase
        .from('user_question_tracking')
        .upsert({
          user_id: user.id,
          question_id: questionId,
          topic: 'corecs',
          domain_page: currentProgress?.solved || false,
          revision: newRevision,
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id,question_id' });

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

    const matchesCategory = !selectedCategory || (question.subcategory || 'Miscellaneous') === selectedCategory;

    return matchesTab && matchesCategory;
  });

  const progressPercentage = stats.total > 0 ? Math.round((stats.solvedTotal / stats.total) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#0F0F13] text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-[#111317]/80 backdrop-blur-xl">
        <div className="px-6 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Core Subjects</h1>
              <p className="text-[#A0A0B0]">Master fundamental computer science concepts and prepare for technical interviews</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-6 text-sm">
            <button
              onClick={() => setActiveTab('all')}
              className={`pb-3 border-b-2 transition-colors ${activeTab === 'all'
                ? 'border-[#4F0F93] text-white'
                : 'border-transparent text-[#A0A0B0] hover:text-white'
                }`}
            >
              All questions
            </button>
            <button
              onClick={() => setActiveTab('solved')}
              className={`pb-3 border-b-2 transition-colors ${activeTab === 'solved'
                ? 'border-[#4F0F93] text-white'
                : 'border-transparent text-[#A0A0B0] hover:text-white'
                }`}
            >
              Solved questions
            </button>
            <button
              onClick={() => setActiveTab('revision')}
              className={`pb-3 border-b-2 transition-colors ${activeTab === 'revision'
                ? 'border-[#4F0F93] text-white'
                : 'border-transparent text-[#A0A0B0] hover:text-white'
                }`}
            >
              Revision questions
            </button>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="border-b border-gray-800 bg-[#0F0F13]">
        <div className="px-6 overflow-x-auto">
          <div className="flex items-center gap-2 py-3">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${!selectedCategory
                ? 'bg-white text-black'
                : 'bg-transparent text-[#A0A0B0] hover:text-white hover:bg-zinc-800/50'
                }`}
            >
              All Questions
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${selectedCategory === category
                  ? 'bg-white text-black'
                  : 'bg-transparent text-[#A0A0B0] hover:text-white hover:bg-zinc-800/50'
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
          <div className="bg-[#111317] border border-gray-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-[#A0A0B0]">Total Progress</span>
              <span className="text-xs text-[#808090]">ⓘ</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold">{stats.solvedTotal}</span>
              <span className="text-[#808090]">/ {stats.total}</span>
            </div>
            <div className="mt-2 text-sm text-orange-400">{progressPercentage}%</div>
          </div>

          {/* Easy Questions */}
          <div className="bg-[#111317] border border-gray-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-[#A0A0B0]">Easy Questions</span>
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold">{stats.solvedEasy}</span>
              <span className="text-[#808090]">/ {stats.easy}</span>
            </div>
          </div>

          {/* Medium Questions */}
          <div className="bg-[#111317] border border-gray-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-[#A0A0B0]">Medium Questions</span>
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold">{stats.solvedMedium}</span>
              <span className="text-[#808090]">/ {stats.medium}</span>
            </div>
          </div>

          {/* Hard Questions */}
          <div className="bg-[#111317] border border-gray-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-[#A0A0B0]">Hard Questions</span>
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold">{stats.solvedHard}</span>
              <span className="text-[#808090]">/ {stats.hard}</span>
            </div>
          </div>
        </div>

        {/* Questions Table */}
        <div className="bg-[#111317] border border-gray-800 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-[#111317] border-b border-gray-800">
              <tr className="text-sm text-[#A0A0B0]">
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
                  <td colSpan={5} className="px-6 py-12 text-center text-[#808090]">
                    Loading questions...
                  </td>
                </tr>
              ) : filteredQuestions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-[#808090]">
                    No questions found
                  </td>
                </tr>
              ) : (
                filteredQuestions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((question, index) => (
                  <tr
                    key={question.id}
                    onClick={() => navigate(`/core-cs/${question.id}`)}
                    className="border-b border-gray-800 hover:bg-[#111317] transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-4 text-[#808090]">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-white mb-1 line-clamp-1">{question.question}</div>
                        <div className="text-sm text-[#A0A0B0] line-clamp-2">{question.explanation_text}</div>
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
                    <td className="px-6 py-4">
                      <div className="inline-flex items-center justify-center w-5 h-5 text-[#A0A0B0] relative group">
                        {userProgress[question.id]?.solved ? (
                          <>
                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                            <div className="absolute bottom-full mb-2 hidden group-hover:block bg-zinc-800/50 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10">
                              Completed
                            </div>
                          </>
                        ) : (
                          <Circle className="w-5 h-5" />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => toggleRevision(question.id)}
                        className="text-[#A0A0B0] hover:text-[#A855F7] transition-colors"
                      >
                        {userProgress[question.id]?.revision ? (
                          <BookmarkCheck className="w-5 h-5 text-[#A855F7]" />
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

        {filteredQuestions.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(filteredQuestions.length / itemsPerPage)}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </div>
  );
}
