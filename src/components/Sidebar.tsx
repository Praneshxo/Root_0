import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  MessageSquare,
  Brain,
  Code,
  Database,
  Calculator,
  BookOpen,
  FileText,
  FolderGit2,
  Sparkles,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: Building2, label: 'Companies', path: '/companies' },
  { icon: MessageSquare, label: 'Interview Questions', path: '/interview-questions' },
  { icon: Brain, label: 'Quiz', path: '/quiz' },
  { icon: Code, label: 'DSA Questions', path: '/dsa' },
  { icon: Database, label: 'SQL Questions', path: '/sql' },
  { icon: Calculator, label: 'Aptitude', path: '/aptitude' },
  { icon: BookOpen, label: 'Core CS Subjects', path: '/core-cs' },
  { icon: FileText, label: 'Notes', path: '/notes' },
  { icon: FolderGit2, label: 'Projects', path: '/projects' },
];

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Auto-collapse based on route
  useEffect(() => {
    if (location.pathname === '/') {
      setIsCollapsed(false); // Expanded on dashboard
    } else {
      setIsCollapsed(true); // Collapsed on other pages
    }
  }, [location.pathname]);

  // Determine if sidebar should show expanded
  const shouldExpand = !isCollapsed || isHovered;

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`fixed top-0 left-0 h-screen bg-gray-900/50 backdrop-blur-xl border-r border-purple-500/20 transition-[width] duration-300 ease-in-out overflow-hidden ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          } ${shouldExpand ? 'w-64 z-50' : 'w-20 z-40'}`}
      >
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="flex items-center justify-between p-4 border-b border-purple-500/20">
            {shouldExpand && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                  <Code className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-white">PlacementPro</h1>
                  <p className="text-xs text-gray-400">Ace Your Interviews</p>
                </div>
              </div>
            )}
            {!shouldExpand && (
              <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center mx-auto">
                <Code className="w-6 h-6 text-white" />
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-3 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              // Match exact path or if current path starts with menu item path (for detail pages)
              const isActive = location.pathname === item.path ||
                (item.path !== '/' && location.pathname.startsWith(item.path));

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => onClose()}
                  className={`group relative flex items-center gap-3 px-3 py-3 rounded-lg transition-all ${isActive
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-purple-500/10'
                    } ${!shouldExpand ? 'justify-center' : ''}`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {shouldExpand && <span className="font-medium text-sm">{item.label}</span>}

                  {/* Tooltip on hover when collapsed - only show if not already hovered */}
                  {!shouldExpand && !isHovered && (
                    <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 border border-purple-500/30 rounded-lg text-sm text-white whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                      {item.label}
                    </div>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Upgrade Section */}
          <div className="p-3 border-t border-purple-500/20">
            <div
              className={`relative overflow-hidden ${!shouldExpand
                ? 'upgrade-box-collapsed'
                : 'upgrade-box-expanded bg-purple-900/30 border border-purple-500/30 rounded-lg p-4'
                }`}
            >

              {!shouldExpand ? (
                <div className="group relative">
                  <button
                    className="relative w-full flex items-center justify-center p-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    <Sparkles className="w-5 h-5" />
                  </button>
                  {/* Tooltip - only show if not hovered */}
                  {!isHovered && (
                    <div className="absolute left-full ml-2 bottom-0 px-3 py-2 bg-gray-900 border border-purple-500/30 rounded-lg text-sm text-white whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                      Upgrade Now
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <h3 className="text-sm font-semibold text-white">
                      Premium Access
                    </h3>
                  </div>
                  <p className="text-xs text-gray-400 mb-3">
                    Unlock advanced features and content
                  </p>
                  <button className="w-full bg-purple-600 text-white text-sm font-medium py-2 rounded-lg hover:bg-purple-700 transition-colors">
                    Upgrade Now
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* Custom CSS for staggered animation */}
      <style>{`
        @keyframes expandUpgradeBox {
          0% {
            max-height: 60px;
            padding-top: 0.75rem;
            padding-bottom: 0.75rem;
          }
          60% {
            max-height: 60px;
            padding-top: 0.75rem;
            padding-bottom: 0.75rem;
          }
          100% {
            max-height: 200px;
            padding-top: 1rem;
            padding-bottom: 1rem;
          }
        }
        
        .upgrade-box-expanded {
          animation: expandUpgradeBox 800ms ease-in-out forwards;
        }
      `}</style>
    </>
  );
}
