import { useState, useEffect, useRef } from 'react';
import { Github, Bookmark, BookmarkCheck, Search, ChevronDown } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface Project {
  id: string;
  title: string;
  description: string;
  tech_stack: string[];
  difficulty: 'Easy' | 'Medium' | 'Hard';
  preview_image_url: string;
  demo_url: string;
  github_url: string;
}

const TECH_STACKS = [
  'Web App',
  'React',
  'Node.js',
  'Python',
  'TypeScript',
  'MongoDB',
  'PostgreSQL',
  'Express',
  'Next.js',
  'Vue.js'
];

const DIFFICULTIES = ['Easy', 'Medium', 'Hard'];

// Mock projects data
const MOCK_PROJECTS: Project[] = [
  {
    id: '1',
    title: 'E-Commerce Platform',
    description: 'Full-stack e-commerce application with shopping cart, payment integration, and admin dashboard',
    tech_stack: ['React', 'Node.js', 'MongoDB', 'Express'],
    difficulty: 'Medium',
    preview_image_url: '/images/projects/ecommerce.png',
    demo_url: 'https://example.com/ecommerce-demo',
    github_url: 'https://github.com/example/ecommerce'
  },
  {
    id: '2',
    title: 'Real-Time Chat Application',
    description: 'WebSocket-based chat app with private messaging, group chats, and file sharing',
    tech_stack: ['React', 'Node.js', 'Socket.io', 'PostgreSQL'],
    difficulty: 'Medium',
    preview_image_url: '/images/projects/ecommerce.png',
    demo_url: 'https://example.com/chat-demo',
    github_url: 'https://github.com/example/chat-app'
  },
  {
    id: '3',
    title: 'Task Management Dashboard',
    description: 'Kanban-style project management tool with drag-and-drop, team collaboration, and analytics',
    tech_stack: ['React', 'TypeScript', 'Node.js', 'MongoDB'],
    difficulty: 'Medium',
    preview_image_url: '/images/projects/ecommerce.png',
    demo_url: 'https://example.com/task-manager-demo',
    github_url: 'https://github.com/example/task-manager'
  },
  {
    id: '4',
    title: 'Weather Forecast App',
    description: 'Beautiful weather application with 7-day forecasts, location search, and interactive maps',
    tech_stack: ['React', 'TypeScript', 'Web App'],
    difficulty: 'Easy',
    preview_image_url: '/images/projects/ecommerce.png',
    demo_url: 'https://example.com/weather-demo',
    github_url: 'https://github.com/example/weather-app'
  },
  {
    id: '5',
    title: 'Social Media Dashboard',
    description: 'Analytics dashboard for social media metrics with real-time data visualization',
    tech_stack: ['Next.js', 'TypeScript', 'PostgreSQL'],
    difficulty: 'Medium',
    preview_image_url: '/images/projects/ecommerce.png',
    demo_url: 'https://example.com/social-dashboard-demo',
    github_url: 'https://github.com/example/social-dashboard'
  },
  {
    id: '6',
    title: 'Blog Platform',
    description: 'Modern blogging platform with markdown support, comments, and SEO optimization',
    tech_stack: ['Next.js', 'MongoDB', 'Web App'],
    difficulty: 'Easy',
    preview_image_url: '/images/projects/ecommerce.png',
    demo_url: 'https://example.com/blog-demo',
    github_url: 'https://github.com/example/blog-platform'
  },
  {
    id: '7',
    title: 'Video Streaming Platform',
    description: 'Netflix-like streaming platform with video encoding, CDN integration, and user subscriptions',
    tech_stack: ['React', 'Node.js', 'PostgreSQL', 'AWS'],
    difficulty: 'Hard',
    preview_image_url: '/images/projects/ecommerce.png',
    demo_url: 'https://example.com/streaming-demo',
    github_url: 'https://github.com/example/streaming-platform'
  },
  {
    id: '8',
    title: 'Microservices E-Learning Platform',
    description: 'Scalable e-learning platform with microservices architecture, video courses, and payment processing',
    tech_stack: ['React', 'Node.js', 'MongoDB', 'Redis', 'Docker'],
    difficulty: 'Hard',
    preview_image_url: '/images/projects/ecommerce.png',
    demo_url: 'https://example.com/elearning-demo',
    github_url: 'https://github.com/example/elearning'
  },
  {
    id: '9',
    title: 'Portfolio Website',
    description: 'Responsive portfolio website with project showcase, contact form, and smooth animations',
    tech_stack: ['React', 'TypeScript', 'Web App'],
    difficulty: 'Easy',
    preview_image_url: '/images/projects/ecommerce.png',
    demo_url: 'https://example.com/portfolio-demo',
    github_url: 'https://github.com/example/portfolio'
  }
];

export default function Projects() {
  const { user } = useAuth();
  const [projects] = useState<Project[]>(MOCK_PROJECTS);
  const [activeTab, setActiveTab] = useState<'all' | 'bookmarked'>('all');
  const [bookmarkedProjects, setBookmarkedProjects] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTechStack, setSelectedTechStack] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  const [techStackDropdownOpen, setTechStackDropdownOpen] = useState(false);
  const [difficultyDropdownOpen, setDifficultyDropdownOpen] = useState(false);
  const techStackDropdownRef = useRef<HTMLDivElement>(null);
  const difficultyDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      fetchBookmarks();
    } else {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (techStackDropdownRef.current && !techStackDropdownRef.current.contains(event.target as Node)) {
        setTechStackDropdownOpen(false);
      }
      if (difficultyDropdownRef.current && !difficultyDropdownRef.current.contains(event.target as Node)) {
        setDifficultyDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchBookmarks = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_project_bookmarks')
        .select('project_id')
        .eq('user_id', user.id);

      if (error) throw error;

      const bookmarkedIds = new Set(data?.map(b => b.project_id) || []);
      setBookmarkedProjects(bookmarkedIds);
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleBookmark = async (projectId: string) => {
    if (!user) return;

    const isBookmarked = bookmarkedProjects.has(projectId);

    try {
      if (isBookmarked) {
        const { error } = await supabase
          .from('user_project_bookmarks')
          .delete()
          .eq('user_id', user.id)
          .eq('project_id', projectId);

        if (error) throw error;

        setBookmarkedProjects(prev => {
          const newSet = new Set(prev);
          newSet.delete(projectId);
          return newSet;
        });
      } else {
        const { error } = await supabase
          .from('user_project_bookmarks')
          .insert({
            user_id: user.id,
            project_id: projectId
          });

        if (error) throw error;

        setBookmarkedProjects(prev => new Set([...prev, projectId]));
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    }
  };

  const handleViewSource = (githubUrl: string) => {
    window.open(githubUrl, '_blank');
  };

  const filteredProjects = projects.filter(project => {
    const matchesTab = activeTab === 'all' || bookmarkedProjects.has(project.id);
    const matchesSearch = searchQuery === '' ||
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTechStack = !selectedTechStack || project.tech_stack.includes(selectedTechStack);
    const matchesDifficulty = !selectedDifficulty || project.difficulty === selectedDifficulty;

    return matchesTab && matchesSearch && matchesTechStack && matchesDifficulty;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-12 h-12 border-4 border-[#4F0F93] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F0F13] text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-[#111317]/80 backdrop-blur-xl">
        <div className="px-6 py-6">
          <div className="mb-4">
            <h1 className="text-3xl font-bold mb-2">Projects</h1>
            <p className="text-[#A0A0B0]">Showcase projects to boost your portfolio</p>
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
              All Projects
            </button>
            <button
              onClick={() => setActiveTab('bookmarked')}
              className={`pb-3 border-b-2 transition-colors ${activeTab === 'bookmarked'
                ? 'border-[#4F0F93] text-white'
                : 'border-transparent text-[#A0A0B0] hover:text-white'
                }`}
            >
              Bookmarked Projects
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="px-6 py-6 border-b border-gray-800">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#A0A0B0]" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#111317] border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#4F0F93] transition-colors"
            />
          </div>

          {/* Tech Stack Filter */}
          <div className="relative" ref={techStackDropdownRef}>
            <button
              onClick={() => setTechStackDropdownOpen(!techStackDropdownOpen)}
              className="w-full md:w-48 px-4 py-2 bg-[#111317] border border-gray-800 rounded-lg text-left flex items-center justify-between hover:border-gray-800 transition-colors"
            >
              <span className="text-sm text-[#D0D0E0]">
                {selectedTechStack || 'All Tech Stacks'}
              </span>
              <ChevronDown className="w-4 h-4 text-[#A0A0B0]" />
            </button>

            {techStackDropdownOpen && (
              <div className="absolute top-full mt-2 w-full md:w-48 bg-[#111317] border border-gray-800 rounded-lg shadow-xl z-10 max-h-64 overflow-y-auto">
                <button
                  onClick={() => {
                    setSelectedTechStack(null);
                    setTechStackDropdownOpen(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-zinc-800/50 transition-colors text-[#D0D0E0]"
                >
                  All Tech Stacks
                </button>
                {TECH_STACKS.map((tech) => (
                  <button
                    key={tech}
                    onClick={() => {
                      setSelectedTechStack(tech);
                      setTechStackDropdownOpen(false);
                    }}
                    className={`w-full px-4 py-2 text-left text-sm hover:bg-zinc-800/50 transition-colors ${selectedTechStack === tech ? 'text-[#A855F7]' : 'text-[#D0D0E0]'
                      }`}
                  >
                    {tech}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Difficulty Filter */}
          <div className="relative" ref={difficultyDropdownRef}>
            <button
              onClick={() => setDifficultyDropdownOpen(!difficultyDropdownOpen)}
              className="w-full md:w-40 px-4 py-2 bg-[#111317] border border-gray-800 rounded-lg text-left flex items-center justify-between hover:border-gray-800 transition-colors"
            >
              <span className="text-sm text-[#D0D0E0]">
                {selectedDifficulty || 'All Levels'}
              </span>
              <ChevronDown className="w-4 h-4 text-[#A0A0B0]" />
            </button>

            {difficultyDropdownOpen && (
              <div className="absolute top-full mt-2 w-full md:w-40 bg-[#111317] border border-gray-800 rounded-lg shadow-xl z-10">
                <button
                  onClick={() => {
                    setSelectedDifficulty(null);
                    setDifficultyDropdownOpen(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-zinc-800/50 transition-colors text-[#D0D0E0]"
                >
                  All Levels
                </button>
                {DIFFICULTIES.map((difficulty) => (
                  <button
                    key={difficulty}
                    onClick={() => {
                      setSelectedDifficulty(difficulty);
                      setDifficultyDropdownOpen(false);
                    }}
                    className={`w-full px-4 py-2 text-left text-sm hover:bg-zinc-800/50 transition-colors ${selectedDifficulty === difficulty ? 'text-[#A855F7]' : 'text-[#D0D0E0]'
                      }`}
                  >
                    {difficulty}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="bg-[#111317] border border-gray-800 rounded-xl overflow-hidden hover:border-gray-800 transition-all group flex flex-col h-full"
            >
              <div className="relative h-48 bg-zinc-800/50 overflow-hidden flex-shrink-0">
                <img
                  src={project.preview_image_url}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                {/* Bookmark button on image */}
                <button
                  onClick={() => toggleBookmark(project.id)}
                  className={`absolute top-3 right-3 z-20 p-2 rounded-lg transition-all ${bookmarkedProjects.has(project.id)
                    ? 'bg-[#4F0F93] hover:bg-[#6312BA] text-white'
                    : 'bg-[#111317]/80 hover:bg-zinc-800/50 text-[#A0A0B0] backdrop-blur-sm'
                    }`}
                >
                  {bookmarkedProjects.has(project.id) ? (
                    <BookmarkCheck className="w-4 h-4" />
                  ) : (
                    <Bookmark className="w-4 h-4" />
                  )}
                </button>
              </div>

              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-lg font-bold text-white mb-2 line-clamp-1">
                  {project.title}
                </h3>

                <p className="text-sm text-[#A0A0B0] mb-4 line-clamp-2 min-h-[2.5rem]">
                  {project.description}
                </p>

                {/* Tech Stack Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tech_stack.slice(0, 3).map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-1 text-xs font-medium bg-[#4F0F93]/20 text-[#8970D6] rounded-full"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.tech_stack.length > 3 && (
                    <span className="px-2 py-1 text-xs font-medium bg-zinc-800/50 text-[#A0A0B0] rounded-full">
                      +{project.tech_stack.length - 3}
                    </span>
                  )}
                </div>

                {/* View Source Button - Full Width at bottom */}
                <button
                  onClick={() => handleViewSource(project.github_url)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-zinc-800/50 hover:bg-[#2C2C2C] text-white text-base font-medium rounded-lg transition-all mt-auto"
                >
                  <Github className="w-5 h-5" />
                  View Source
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-20">
            <p className="text-[#808090]">No projects found</p>
          </div>
        )}
      </div>
    </div>
  );
}
