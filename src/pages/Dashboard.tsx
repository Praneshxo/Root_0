/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useState, useEffect } from 'react';
import {
  Code,
  Brain,
  Map,
  Clock,
  Zap,
  Target,
  ChevronRight,
  Crown,
  Database,
  Layout,
  Terminal,
  FileText
} from 'lucide-react';






// --- Interfaces ---
interface UserStats {
  problems_solved: number;
  study_streak_days: number;
  total_study_hours: number;
  weekly_goal_progress?: number;
  weekly_goal_target?: number;
}

interface RecentActivity {
  id: string;
  title: string;
  type: string;
  status: string;
  created_at: string;
}

function DashboardContent() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [todayStats, setTodayStats] = useState({ problems: 0, quizzes: 0, hours: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      fetchDashboardData();
    }
  }, [user?.id]);

  const [skillGap, setSkillGap] = useState({
    DSA: 0,
    SQL: 0,
    Aptitude: 0,
    CoreCS: 0,
    Companies: 0,
  });

  const fetchDashboardData = async () => {
    try {
      const [statsResult, readinessResult] = await Promise.all([
        supabase.from('user_stats').select('*').eq('user_id', user?.id).maybeSingle(),
        supabase.from('user_dashboard_readiness').select('*').eq('user_id', user?.id).maybeSingle()
      ]);

      if (statsResult.data) {
        setStats(statsResult.data);
      }

      if (readinessResult.data) {
        const r = readinessResult.data;
        setSkillGap({
          DSA: r.dsa_mastery_pct || 0,
          SQL: r.sql_mastery_pct || 0,
          Aptitude: r.aptitude_mastery_pct || 0,
          CoreCS: r.corecs_mastery_pct || 0,
          Companies: r.companies_mastery_pct || 0,
        });
        setQuizScore(r.overall_readiness_pct || 0);
      } else {
        setSkillGap({ DSA: 0, SQL: 0, Aptitude: 0, CoreCS: 0, Companies: 0 });
        setQuizScore(0);
      }

      const { data: latestActivity } = await supabase
        .from('user_question_tracking')
        .select(`
          *,
          company_topic_questions:question_id (
            question, subcategory
          )
        `)
        .eq('user_id', user?.id)
        .order('updated_at', { ascending: false })
        .limit(4);

      if (latestActivity) {
        const activities = latestActivity.map((p: any) => {
          const isCompleted = p.domain_page || p.companies_page;
          const qData = p.company_topic_questions?.[0] || p.company_topic_questions;
          return {
            id: p.id || p.question_id,
            title: qData?.question || 'Tracked Question',
            type: p.topic || qData?.subcategory || 'Practice',
            status: isCompleted ? 'Completed' : 'Attempted',
            created_at: p.updated_at || p.created_at,
          };
        });
        setRecentActivity(activities);
      }

      const today = new Date().toISOString().split('T')[0];
      const todayProblemsCount = (latestActivity || []).filter(
        (p: any) => {
          const dateStr = p.updated_at || p.created_at;
          return dateStr && dateStr.startsWith(today);
        }
      ).length;
      setTodayStats((prev) => ({ ...prev, problems: todayProblemsCount }));

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    return `${diffDays} days ago`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0F0F13]">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F0F13] text-white p-6 md:p-8 font-sans selection:bg-emerald-500/30">

      {/* 1. Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">
            Welcome back, <span className="text-emerald-400">{user?.email?.split('@')[0]}</span>!
          </h1>
          <p className="text-zinc-400">Let's continue your prep journey.</p>
        </div>
        <div className="flex items-center gap-3 bg-[#111317] px-4 py-2 rounded-full border border-gray-800 backdrop-blur-sm">
          <Crown className="w-4 h-4 text-yellow-500" />
          <span className="text-sm font-medium text-zinc-300">Free Plan</span>
          <button className="text-xs bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-full transition-colors font-semibold shadow-lg shadow-emerald-900/20">
            Upgrade
          </button>
        </div>
      </div>

      {/* 2. Top Grid: Progress & Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

        {/* Main Progress Card (Donut Chart Style) */}
        <div className="lg:col-span-2 bg-[#111317] border border-gray-800 rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-emerald-500/10 transition-colors duration-500"></div>

          <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
            {/* Circular Progress */}
            <div className="relative w-40 h-40 flex-shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
                <circle cx="80" cy="80" r="70" stroke="#27272a" strokeWidth="12" fill="none" />
                <circle
                  cx="80" cy="80" r="70"
                  stroke="#10b981"
                  strokeWidth="12"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 70 * (quizScore / 100)} ${2 * Math.PI * 70}`}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold text-white tracking-tighter">{quizScore}%</span>
                <span className="text-xs text-zinc-500 uppercase tracking-wider font-medium mt-1">Readiness</span>
              </div>
            </div>

            {/* Stats Breakdown - Domain Mastery (Expanded) */}
            <div className="flex-1 w-full flex flex-col items-stretch h-full">
              <div className=" flex-col justify-between h-full relative overflow-hidden">
                <div className="flex items-center justify-between mb-12">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Layout className="w-4 h-4 text-zinc-400" />
                    Domain Mastery
                  </h3>
                  <button className="text-[10px] text-emerald-500 hover:text-emerald-400 font-bold uppercase tracking-wider">Manage Tracks</button>
                </div>

                <div className="space-y-8 flex-1 flex flex-col justify-center">
                  {/* Domain Item 1: DSA */}
                  <div className="group">
                    <div className="flex justify-between mb-3">
                      <span className="text-sm font-medium text-zinc-300 flex items-center gap-2 group-hover:text-white transition-colors">
                        <Terminal className="w-4 h-4 text-[#A855F7]" /> Data Structures &amp; Algorithms
                      </span>
                      <span className="text-sm text-zinc-500 font-mono">{Math.round(skillGap.DSA)} solved</span>
                    </div>
                    <div className="w-full h-2 bg-[#2A2A35] rounded-full overflow-hidden">
                      <div className="h-full bg-[#4F0F93] rounded-full transition-all duration-1000 ease-out" style={{ width: `${Math.max(skillGap.DSA > 0 ? Math.min(100, Math.round((skillGap.DSA / 200) * 100)) : 0, skillGap.DSA > 0 ? 4 : 0)}%` }}></div>
                    </div>
                  </div>

                  {/* Domain Item 2: SQL */}
                  <div className="group">
                    <div className="flex justify-between mb-3">
                      <span className="text-sm font-medium text-zinc-300 flex items-center gap-2 group-hover:text-white transition-colors">
                        <Database className="w-4 h-4 text-blue-500" /> SQL Queries &amp; Optimization
                      </span>
                      <span className="text-sm text-zinc-500 font-mono">{Math.round(skillGap.SQL)} solved</span>
                    </div>
                    <div className="w-full h-2 bg-[#2A2A35] rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full transition-all duration-1000 ease-out" style={{ width: `${Math.max(skillGap.SQL > 0 ? Math.min(100, Math.round((skillGap.SQL / 200) * 100)) : 0, skillGap.SQL > 0 ? 4 : 0)}%` }}></div>
                    </div>
                  </div>

                  {/* Domain Item 3: Aptitude */}
                  <div className="group">
                    <div className="flex justify-between mb-3">
                      <span className="text-sm font-medium text-zinc-300 flex items-center gap-2 group-hover:text-white transition-colors">
                        <Brain className="w-4 h-4 text-emerald-500" /> Logical Aptitude
                      </span>
                      <span className="text-sm text-zinc-500 font-mono">{Math.round(skillGap.Aptitude)} solved</span>
                    </div>
                    <div className="w-full h-2 bg-[#2A2A35] rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full transition-all duration-1000 ease-out" style={{ width: `${Math.max(skillGap.Aptitude > 0 ? Math.min(100, Math.round((skillGap.Aptitude / 200) * 100)) : 0, skillGap.Aptitude > 0 ? 4 : 0)}%` }}></div>
                    </div>
                  </div>

                  {/* Domain Item 4: Companies */}
                  <div className="group">
                    <div className="flex justify-between mb-3">
                      <span className="text-sm font-medium text-zinc-300 flex items-center gap-2 group-hover:text-white transition-colors">
                        <Map className="w-4 h-4 text-yellow-500" /> Companies Practice
                      </span>
                      <span className="text-sm text-zinc-500 font-mono">{Math.round(skillGap.Companies)} solved</span>
                    </div>
                    <div className="w-full h-2 bg-[#2A2A35] rounded-full overflow-hidden">
                      <div className="h-full bg-yellow-500 rounded-full transition-all duration-1000 ease-out" style={{ width: `${Math.max(skillGap.Companies > 0 ? Math.min(100, Math.round((skillGap.Companies / 200) * 100)) : 0, skillGap.Companies > 0 ? 4 : 0)}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Streaks & Goals */}
        <div className="flex flex-col gap-6">
          {/* Daily Streak */}
          <div className="bg-[#111317] border border-gray-800 rounded-2xl p-6 flex-1 flex flex-col justify-center relative overflow-hidden group hover:border-orange-500/30 transition-colors">
            <div className="absolute -top-6 -right-6 p-4 opacity-5 group-hover:opacity-10 transition-opacity rotate-12">
              <Zap className="w-32 h-32 text-orange-500" />
            </div>
            <div className="flex items-center gap-4 mb-2 relative z-10">
              <div className="p-3 bg-orange-500/10 rounded-xl border border-orange-500/20">
                <Zap className="w-6 h-6 text-orange-500 fill-orange-500" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Daily Streak</h3>
                <p className="text-zinc-400 text-xs">Keep the fire burning!</p>
              </div>
            </div>
            <div className="mt-4 relative z-10 flex items-baseline gap-2">
              <span className="text-5xl font-bold text-white tracking-tighter">{stats?.study_streak_days || 0}</span>
              <span className="text-zinc-500 font-medium">Days</span>
            </div>
          </div>

          {/* Weekly Goal Widget */}
          <div className="bg-[#111317] border border-gray-800 rounded-2xl p-6 flex-1 flex flex-col justify-center hover:border-blue-500/30 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <Target className="w-5 h-5 text-blue-500" />
                </div>
                <span className="font-semibold text-zinc-200">Weekly Goal</span>
              </div>
              <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 px-2 py-1 rounded-md border border-blue-500/20 uppercase tracking-wide">Active</span>
            </div>
            <div className="mb-2 flex justify-between items-end">
              {/* Uses todayStats.problems as a placeholder. Connect to DB `weekly_problems` later */}
              <span className="text-2xl font-bold text-white">{todayStats.problems}</span>
              <span className="text-sm text-zinc-500 mb-1 font-medium">/ 20 Problems</span>
            </div>
            <div className="w-full h-2 bg-[#2A2A35] rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full shadow-none" style={{ width: `${Math.min((todayStats.problems / 20) * 100, 100)}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Middle Section: Domain Mastery & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">

        {/* Latest Notes Widget */}
        <div className="lg:col-span-7 bg-[#111317] border border-gray-800 rounded-2xl p-6 flex flex-col justify-between hover:border-emerald-500/30 transition-colors">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-500" />
                Latest Notes
              </h3>
              <button onClick={() => navigate('/notes')} className="text-xs text-emerald-500 hover:text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1">
                View All <ChevronRight className="w-3 h-3" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Note Item 1 */}
              <div onClick={() => navigate('/notes')} className="bg-[#1A1C23] border border-gray-800/80 p-4 rounded-xl cursor-pointer hover:border-emerald-500/50 transition-colors group">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-zinc-200 font-semibold group-hover:text-emerald-400 transition-colors">Binary Search Trees</h4>
                  <span className="text-[10px] text-zinc-500 bg-black/20 px-2 py-0.5 rounded">DSA</span>
                </div>
                <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">Key concepts for insertion and deletion in BST. Remember the worst-case time complexity is O(N) unless it's balanced like an AVL tree.</p>
                <div className="mt-4 flex items-center justify-between text-[10px] text-zinc-500 font-medium tracking-wide">
                  <span>2 hrs ago</span>
                  <span className="text-emerald-500/0 group-hover:text-emerald-500 transition-colors uppercase">Read &rarr;</span>
                </div>
              </div>

              {/* Note Item 2 */}
              <div onClick={() => navigate('/notes')} className="bg-[#1A1C23] border border-gray-800/80 p-4 rounded-xl cursor-pointer hover:border-[#A855F7]/50 transition-colors group hidden sm:block">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-zinc-200 font-semibold group-hover:text-[#A855F7] transition-colors">SQL Window Functions</h4>
                  <span className="text-[10px] text-zinc-500 bg-black/20 px-2 py-0.5 rounded">SQL</span>
                </div>
                <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">Using ROW_NUMBER(), RANK(), and DENSE_RANK(). Great for finding exactly top N records per group without complex self-joins.</p>
                <div className="mt-4 flex items-center justify-between text-[10px] text-zinc-500 font-medium tracking-wide">
                  <span>1 day ago</span>
                  <span className="text-[#A855F7]/0 group-hover:text-[#A855F7] transition-colors uppercase">Read &rarr;</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions (Grid) */}
        <div className="lg:col-span-5 grid grid-cols-2 gap-4">
          <button onClick={() => navigate('/dsa')} className="bg-[#111317] border border-gray-800 hover:border-emerald-500/50 hover:bg-[#111317] p-6 rounded-2xl transition-all group text-left relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform border border-emerald-500/20 relative z-10">
              <Code className="w-5 h-5 text-emerald-500" />
            </div>
            <h4 className="font-bold text-white mb-1 relative z-10">Practice DSA</h4>
            <p className="text-xs text-zinc-500 relative z-10">Solve daily problems</p>
          </button>

          <button onClick={() => navigate('/quiz')} className="bg-[#111317] border border-gray-800 hover:border-[#4F0F93]/50 hover:bg-[#111317] p-6 rounded-2xl transition-all group text-left relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="w-10 h-10 bg-[#4F0F93]/10 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform border border-gray-800 relative z-10">
              <Brain className="w-5 h-5 text-[#A855F7]" />
            </div>
            <h4 className="font-bold text-white mb-1 relative z-10">Solve SQL</h4>
            <p className="text-xs text-zinc-500 relative z-10">Test your skills</p>
          </button>

          <button onClick={() => navigate('/companies')} className="bg-[#111317] border border-gray-800 hover:border-blue-500/50 hover:bg-[#111317] p-6 rounded-2xl transition-all group text-left col-span-2 flex items-center justify-between relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center border border-blue-500/20">
                <Map className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <h4 className="font-bold text-white text-lg">Company Roadmaps</h4>
                <p className="text-xs text-zinc-400">Target Amazon, Google, etc.</p>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#2A2A35] flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-all">
              <ChevronRight className="w-4 h-4" />
            </div>
          </button>
        </div>
      </div>

      {/* 4. Recent Activity (Bottom Section) */}
      <div className="bg-[#111317] border border-gray-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-zinc-400" />
            Recent Activity
          </h3>
          <span className="text-xs font-medium text-zinc-500 bg-[#2A2A35]/50 px-3 py-1 rounded-full">Last 7 Days</span>
        </div>

        <div className="space-y-1">
          {recentActivity.length > 0 ? (
            recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between p-4 hover:bg-[#111317] rounded-xl transition-all group border border-transparent hover:border-gray-800/50"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-2.5 h-2.5 rounded-full ring-2 ring-black ${activity.status === 'Completed' ? 'bg-emerald-500 shadow-none' : 'bg-yellow-500 shadow-none'}`}></div>
                  <div>
                    <p className="text-sm font-semibold text-zinc-200 group-hover:text-white transition-colors">
                      {activity.title}
                    </p>
                    <p className="text-xs text-zinc-500 mt-0.5 font-medium">{activity.type}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-[10px] font-bold px-2 py-1 rounded border uppercase tracking-wide ${activity.status === 'Completed'
                    ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                    : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                    }`}>
                    {activity.status}
                  </span>
                  <p className="text-xs text-zinc-600 mt-1">{formatTimeAgo(activity.created_at)}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 border-2 border-dashed border-gray-800 rounded-xl">
              <p className="text-zinc-500 font-medium">No recent activity. Start your first problem!</p>
              <button onClick={() => navigate('/dsa')} className="mt-4 text-emerald-500 text-sm font-bold hover:underline uppercase tracking-wide">
                Go to Problems &rarr;
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  return <DashboardContent />;
}

