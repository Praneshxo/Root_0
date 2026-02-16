import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle2, Circle, Bookmark, BookmarkCheck } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface CompanyQuestion {
  id: string;
  company_name: string;
  question: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: 'HR' | 'Technical' | 'Managerial';
  created_at: string;
}

interface UserProgress {
  solved: boolean;
  revision: boolean;
}

const COMPANIES = ['HCL', 'IBM', 'Cognizant', 'Infosys', 'TCS', 'Wipro', 'Tech Mahindra', 'L&T', 'Capgemini', 'Accenture', 'Mindtree', 'Mphasis', 'Hexaware', 'LTIMindtree', 'Zoho', 'Persistent Systems', 'Cyient', 'Coforge'];

export default function Companies() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeCompany, setActiveCompany] = useState(location.state?.company || 'HCL');
  const [activeTab, setActiveTab] = useState(location.state?.tab || 'Interview Questions');
  const [questions, setQuestions] = useState<CompanyQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [userProgress, setUserProgress] = useState<Record<string, UserProgress>>({});

  useEffect(() => {
    if (location.state?.company) {
      setActiveCompany(location.state.company);
    }
    if (location.state?.tab) {
      setActiveTab(location.state.tab);
    }
  }, [location.state]);

  useEffect(() => {
    fetchQuestions();
  }, [activeCompany, activeTab]);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      let data: any[] = [];
      let error: any = null;

      if (activeTab === 'Interview Questions') {
        const result = await supabase
          .from('company_interview_questions')
          .select('*')
          .eq('company_name', activeCompany)
          .order('created_at');
        data = result.data || [];
        error = result.error;
      } else {
        const result = await supabase
          .from('company_topic_questions')
          .select('*')
          .eq('company_name', activeCompany)
          .eq('topic', activeTab)
          .order('created_at');

        // Map 'topic' to 'category' for UI consistency if needed, though we display category below
        data = (result.data || []).map(q => ({
          ...q,
          category: q.topic // Map topic to category for display interface
        }));
        error = result.error;
      }

      if (error) throw error;
      setQuestions(data || []);

      // Fetch user progress
      const { data: { user } } = await supabase.auth.getUser();
      if (user && data && data.length > 0) {
        // We reuse the same progress table? Or do we need separate progress tables?
        // Ideally we should have a unified progress table or valid foreign keys.
        // For simplicity, let's assume 'user_company_progress' links by 'question_id' which is UUID.
        // If IDs are unique across tables (UUIDs usually are), this works fine.

        const { data: progressData } = await supabase
          .from('user_company_progress')
          .select('question_id, solved, revision')
          .eq('user_id', user.id)
          .in('question_id', data.map(q => q.id));

        const progressMap: Record<string, UserProgress> = {};
        progressData?.forEach(p => {
          progressMap[p.question_id] = {
            solved: p.solved,
            revision: p.revision
          };
        });
        setUserProgress(progressMap);
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleSolved = async (questionId: string) => {
    const currentStatus = userProgress[questionId]?.solved || false;
    const newStatus = !currentStatus;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase.from('user_company_progress').upsert({
        user_id: user.id,
        question_id: questionId,
        solved: newStatus,
        revision: userProgress[questionId]?.revision || false,
        updated_at: new Date().toISOString()
      });

      setUserProgress(prev => ({
        ...prev,
        [questionId]: { ...prev[questionId], solved: newStatus }
      }));
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const toggleRevision = async (questionId: string) => {
    const currentStatus = userProgress[questionId]?.revision || false;
    const newStatus = !currentStatus;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase.from('user_company_progress').upsert({
        user_id: user.id,
        question_id: questionId,
        solved: userProgress[questionId]?.solved || false,
        revision: newStatus,
        updated_at: new Date().toISOString()
      });

      setUserProgress(prev => ({
        ...prev,
        [questionId]: { ...prev[questionId], revision: newStatus }
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
        return 'text-gray-400 bg-gray-500/10 border-gray-500/30';
    }
  };

  const TABS = ['Interview Questions', 'DSA', 'Aptitude', 'SQL', 'Core CS'];
  const TAB_ICONS: Record<string, string> = {
    'Interview Questions': '🏠',
    'DSA': '💻',
    'Aptitude': '🎯',
    'SQL': '📊',
    'Core CS': '💡'
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1.5">Interview Questions for {activeCompany}</h1>
          <p className="text-base text-gray-400">
            Prepare for mass IT company recruitments with comprehensive study material.
          </p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 text-sm bg-gray-800/50 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors border border-gray-700">
            📊 My progress
          </button>
          <button className="px-4 py-2 text-sm bg-gray-800/50 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors border border-gray-700">
            View all resources
          </button>
        </div>
      </div>

      {/* Company Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
        {COMPANIES.map((company) => (
          <button
            key={company}
            onClick={() => setActiveCompany(company)}
            className={`px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-all ${activeCompany === company
              ? 'bg-gray-800 text-white border border-gray-700'
              : 'bg-transparent text-gray-400 hover:text-white hover:bg-gray-800/50'
              }`}
          >
            {company}
          </button>
        ))}
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 border-b border-gray-800 overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 text-sm font-medium transition-colors whitespace-nowrap ${activeTab === tab
              ? 'text-white border-b-2 border-purple-500 text-purple-400'
              : 'text-gray-400 hover:text-white border-b-2 border-transparent'
              }`}
          >
            <span className="mr-2">{TAB_ICONS[tab]}</span>
            {tab}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-800/50 border-b border-gray-800">
              <tr>
                <th className="px-5 py-3.5 text-left text-sm font-medium text-gray-400 w-16">#</th>
                <th className="px-5 py-3.5 text-left text-sm font-medium text-gray-400">Question</th>
                <th className="px-5 py-3.5 text-left text-sm font-medium text-gray-400 w-28">Difficulty</th>
                <th className="px-5 py-3.5 text-center text-sm font-medium text-gray-400 w-24">Solved</th>
                <th className="px-5 py-3.5 text-center text-sm font-medium text-gray-400 w-24">Revision</th>
              </tr>
            </thead>
            <tbody>
              {questions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-base text-gray-400">
                    No questions available for {activeCompany} yet.
                  </td>
                </tr>
              ) : (
                questions.map((question, index) => (
                  <tr
                    key={question.id}
                    onClick={() => {
                      // Navigate to company question detail page with state
                      navigate(`/companies/${question.id}`, {
                        state: {
                          company: activeCompany,
                          tab: activeTab
                        }
                      });
                    }}
                    className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors cursor-pointer"
                  >
                    <td className="px-5 py-4 text-sm text-gray-400">{index + 1}</td>
                    <td className="px-5 py-4">
                      <div className="text-base text-white font-medium line-clamp-1">{question.question}</div>
                      <div className="text-sm text-gray-400 mt-1">
                        {question.category}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex px-2.5 py-1 text-sm font-medium rounded border ${getDifficultyColor(question.difficulty)}`}>
                        {question.difficulty}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-center" onClick={(e) => e.stopPropagation()}>
                      <div className="inline-flex items-center justify-center w-6 h-6 text-gray-400 relative group">
                        {userProgress[question.id]?.solved ? (
                          <>
                            <CheckCircle2 className="w-6 h-6 text-green-400" />
                            <div className="absolute bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                              Completed
                            </div>
                          </>
                        ) : (
                          <>
                            <Circle className="w-6 h-6" />
                            <div className="absolute bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10">
                              Click row to view question
                            </div>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-center" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => toggleRevision(question.id)}
                        className="inline-flex items-center justify-center w-6 h-6 text-gray-400 hover:text-blue-400 transition-colors"
                      >
                        {userProgress[question.id]?.revision ? (
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
    </div>
  );
}
