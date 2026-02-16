import { useState, useEffect } from 'react';
import { Clock, CheckCircle, XCircle, Search, ChevronDown, Bookmark, BookmarkCheck } from 'lucide-react';
import { supabase, Database } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

type Quiz = Database['quizzes'];

export default function Quiz() {
  const { user } = useAuth();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'Dashboard' | 'History' | 'Bookmarked'>('Dashboard');
  const [difficultyFilter, setDifficultyFilter] = useState('All Difficulties');
  const [roleFilter, setRoleFilter] = useState('All Roles');
  const [bookmarkedQuizzes, setBookmarkedQuizzes] = useState<Set<string>>(new Set());
  const [quizHistory, setQuizHistory] = useState<Array<{ quiz_id: string; score: number; created_at: string }>>([]);

  // Quiz taking state
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);

  useEffect(() => {
    fetchQuizzes();
    if (user) {
      fetchBookmarks();
      fetchHistory();
    }
  }, [user]);

  useEffect(() => {
    if (quizStarted && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleCompleteQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [quizStarted, timeLeft]);

  const fetchQuizzes = async () => {
    try {
      const { data, error } = await supabase
        .from('quizzes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setQuizzes(data || []);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBookmarks = async () => {
    if (!user) return;
    try {
      const { data } = await supabase
        .from('quiz_bookmarks')
        .select('quiz_id')
        .eq('user_id', user.id);

      if (data) {
        setBookmarkedQuizzes(new Set(data.map(b => b.quiz_id)));
      }
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
    }
  };

  const fetchHistory = async () => {
    if (!user) return;
    try {
      const { data } = await supabase
        .from('quiz_attempts')
        .select('quiz_id, score, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (data) {
        setQuizHistory(data);
      }
    } catch (error) {
      console.error('Error fetching history:', error);
    }
  };

  const toggleBookmark = async (quizId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) return;

    const isBookmarked = bookmarkedQuizzes.has(quizId);

    try {
      if (isBookmarked) {
        await supabase
          .from('quiz_bookmarks')
          .delete()
          .eq('user_id', user.id)
          .eq('quiz_id', quizId);

        setBookmarkedQuizzes(prev => {
          const next = new Set(prev);
          next.delete(quizId);
          return next;
        });
      } else {
        await supabase
          .from('quiz_bookmarks')
          .insert({ user_id: user.id, quiz_id: quizId });

        setBookmarkedQuizzes(prev => new Set(prev).add(quizId));
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    }
  };

  const startQuiz = (quiz: Quiz) => {
    setActiveQuiz(quiz);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setTimeLeft(quiz.duration_minutes * 60);
    setQuizStarted(true);
    setQuizCompleted(false);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: answerIndex,
    }));
  };

  const handleNext = () => {
    if (activeQuiz && currentQuestionIndex < activeQuiz.questions_json.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleCompleteQuiz = async () => {
    if (!user?.id || !activeQuiz) return;

    const score = calculateScore();
    const totalQuestions = activeQuiz.questions_json.length;
    const correctAnswers = Math.round((score / 100) * totalQuestions);
    const timeTakenMinutes = activeQuiz.duration_minutes - Math.floor(timeLeft / 60);

    try {
      await supabase.from('quiz_attempts').insert({
        user_id: user.id,
        quiz_id: activeQuiz.id,
        score,
        total_questions: totalQuestions,
        correct_answers: correctAnswers,
        time_taken_minutes: Math.max(1, timeTakenMinutes),
      });

      fetchHistory();
    } catch (error) {
      console.error('Error saving quiz result:', error);
    }

    setQuizStarted(false);
    setQuizCompleted(true);
  };

  const calculateScore = () => {
    if (!activeQuiz) return 0;
    let correct = 0;
    activeQuiz.questions_json.forEach((q, index) => {
      if (selectedAnswers[index] === q.correct) {
        correct++;
      }
    });
    return Math.round((correct / activeQuiz.questions_json.length) * 100);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getRoleFromCategory = (category: string | null): string => {
    if (!category) return 'Tech';
    const cat = category.toLowerCase();
    if (cat.includes('aptitude') || cat.includes('logical') || cat.includes('reasoning')) return 'Aptitude';
    if (cat.includes('marketing') || cat.includes('hr') || cat.includes('management')) return 'Non Tech';
    return 'Tech';
  };

  const getRoleBadgeColor = (role: string): string => {
    switch (role) {
      case 'Tech':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'Aptitude':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'Non Tech':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
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

  const getFilteredQuizzes = () => {
    let filtered = quizzes;

    // Tab filter
    if (activeTab === 'Bookmarked') {
      filtered = filtered.filter(q => bookmarkedQuizzes.has(q.id));
    } else if (activeTab === 'History') {
      const attemptedIds = new Set(quizHistory.map(h => h.quiz_id));
      filtered = filtered.filter(q => attemptedIds.has(q.id));
    }

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(q =>
        q.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Difficulty filter
    if (difficultyFilter !== 'All Difficulties') {
      filtered = filtered.filter(q => q.difficulty === difficultyFilter);
    }

    // Role filter
    if (roleFilter !== 'All Roles') {
      filtered = filtered.filter(q => getRoleFromCategory(q.category) === roleFilter);
    }

    return filtered;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (quizCompleted && activeQuiz) {
    const score = calculateScore();
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="bg-purple-900/30 border border-purple-500/30 rounded-2xl p-8 text-center">
          <div className="w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Quiz Completed!</h1>
          <p className="text-xl text-gray-300 mb-6">Your Score: {score}%</p>
          <button
            onClick={() => {
              setActiveQuiz(null);
              setQuizCompleted(false);
            }}
            className="px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors"
          >
            Back to Quizzes
          </button>
        </div>

        <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">Review Answers</h2>
          <div className="space-y-4">
            {activeQuiz.questions_json.map((q, index) => {
              const userAnswer = selectedAnswers[index];
              const isCorrect = userAnswer === q.correct;

              return (
                <div key={index} className="bg-gray-800/30 rounded-lg p-4">
                  <div className="flex items-start gap-3 mb-3">
                    {isCorrect ? (
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    )}
                    <p className="text-white font-medium">{q.question}</p>
                  </div>
                  <div className="ml-8 space-y-2">
                    {q.options.map((option, optIndex) => {
                      const isUserAnswer = userAnswer === optIndex;
                      const isCorrectAnswer = q.correct === optIndex;

                      return (
                        <div
                          key={optIndex}
                          className={`p-2 rounded text-sm ${isCorrectAnswer
                            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                            : isUserAnswer
                              ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                              : 'text-gray-400'
                            }`}
                        >
                          {option}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  if (activeQuiz && quizStarted) {
    const currentQuestion = activeQuiz.questions_json[currentQuestionIndex];

    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">{activeQuiz.title}</h1>
            <p className="text-gray-400">
              Question {currentQuestionIndex + 1} of {activeQuiz.questions_json.length}
            </p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-gray-900/50 border border-gray-800 rounded-lg">
            <Clock className="w-5 h-5 text-blue-400" />
            <span className="text-xl font-bold text-white">{formatTime(timeLeft)}</span>
          </div>
        </div>

        <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">{currentQuestion.question}</h2>

          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                className={`w-full p-4 text-left rounded-lg border transition-all ${selectedAnswers[currentQuestionIndex] === index
                  ? 'bg-blue-500/20 border-blue-500 text-white'
                  : 'bg-gray-800/30 border-gray-700 text-gray-300 hover:border-gray-600'
                  }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className="px-6 py-3 bg-gray-800 text-white font-medium rounded-lg hover:bg-gray-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          {currentQuestionIndex === activeQuiz.questions_json.length - 1 ? (
            <button
              onClick={handleCompleteQuiz}
              className="px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
            >
              Complete Quiz
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors"
            >
              Next
            </button>
          )}
        </div>
      </div>
    );
  }

  const filteredQuizzes = getFilteredQuizzes();

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-1.5">Quizzes</h1>
        <p className="text-base text-gray-400">
          Test your knowledge with our comprehensive collection of quizzes.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-800">
        {['Dashboard', 'History', 'Bookmarked'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-4 py-2.5 text-sm font-medium transition-colors ${activeTab === tab
              ? 'text-white border-b-2 border-white'
              : 'text-gray-400 hover:text-white'
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Search and Filters */}
      <div className="flex gap-3 items-center">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search quizzes..."
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
            <option>All Roles</option>
            <option>Tech</option>
            <option>Aptitude</option>
            <option>Non Tech</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Quiz Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredQuizzes.length === 0 ? (
          <div className="col-span-full bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-xl p-8 text-center">
            <p className="text-gray-400">No quizzes found matching your filters.</p>
          </div>
        ) : (
          filteredQuizzes.map((quiz) => {
            const role = getRoleFromCategory(quiz.category);
            const isBookmarked = bookmarkedQuizzes.has(quiz.id);

            return (
              <div
                key={quiz.id}
                onClick={() => startQuiz(quiz)}
                className="bg-gray-900/50 backdrop-blur-xl border border-purple-500/20 rounded-xl p-5 hover:border-purple-500/50 hover:bg-purple-500/5 transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-bold text-white line-clamp-2 flex-1 pr-2 group-hover:text-purple-300 transition-colors">
                    {quiz.title}
                  </h3>
                  <button
                    onClick={(e) => toggleBookmark(quiz.id, e)}
                    className="text-gray-400 hover:text-purple-400 transition-colors flex-shrink-0"
                  >
                    {isBookmarked ? (
                      <BookmarkCheck className="w-5 h-5 text-purple-400" />
                    ) : (
                      <Bookmark className="w-5 h-5" />
                    )}
                  </button>
                </div>

                <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                  {quiz.category || 'Test your knowledge with this comprehensive quiz.'}
                </p>

                <div className="flex items-center gap-2">
                  <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded border ${getRoleBadgeColor(role)}`}>
                    {role}
                  </span>
                  <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded border ${getDifficultyColor(quiz.difficulty || 'Medium')}`}>
                    {quiz.difficulty || 'Medium'}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
