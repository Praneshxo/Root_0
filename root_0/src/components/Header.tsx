import { Menu, User, LogOut, CreditCard } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';
import AIRing from './AIRing';

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const { user, signOut } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showAITooltip, setShowAITooltip] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-gray-900/50 backdrop-blur-xl border-b border-purple-500/20">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Mobile Menu Button */}
        <button
          onClick={onMenuClick}
          className="lg:hidden text-gray-400 hover:text-white transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Right Side: AI Assistant, Upgrade, Hamburger Menu */}
        <div className="flex items-center gap-3 ml-auto">
          {/* AI Assistant - Three.js Wavy Ring */}
          <div className="relative">
            <button
              onMouseEnter={() => setShowAITooltip(true)}
              onMouseLeave={() => setShowAITooltip(false)}
              onClick={() => setShowAITooltip(!showAITooltip)}
              className="relative w-10 h-10 flex items-center justify-center rounded-full overflow-hidden"
            >
              <div className="w-full h-full">
                <AIRing />
              </div>
            </button>

            {/* AI Tooltip */}
            {showAITooltip && (
              <div className="absolute top-full right-0 mt-2 w-64 bg-gray-900 border border-purple-500/30 rounded-lg shadow-xl p-4 z-50">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-fuchsia-600 rounded-full flex items-center justify-center flex-shrink-0">
                    {/* Modern AI Brain/Chip Icon */}
                    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
                      {/* Brain outline */}
                      <path
                        d="M12 3C10.5 3 9 3.5 8 4.5C7 5.5 6.5 7 6.5 8.5C6.5 9 6.6 9.5 6.7 10C5.5 10.5 4.5 11.5 4.5 13C4.5 14.5 5.5 15.5 6.7 16C6.6 16.5 6.5 17 6.5 17.5C6.5 19 7 20.5 8 21.5C9 22.5 10.5 23 12 23C13.5 23 15 22.5 16 21.5C17 20.5 17.5 19 17.5 17.5C17.5 17 17.4 16.5 17.3 16C18.5 15.5 19.5 14.5 19.5 13C19.5 11.5 18.5 10.5 17.3 10C17.4 9.5 17.5 9 17.5 8.5C17.5 7 17 5.5 16 4.5C15 3.5 13.5 3 12 3Z"
                        stroke="white"
                        strokeWidth="1.5"
                        fill="none"
                      />
                      {/* Neural connections */}
                      <circle cx="12" cy="8" r="1.5" fill="white" />
                      <circle cx="9" cy="13" r="1.5" fill="white" />
                      <circle cx="15" cy="13" r="1.5" fill="white" />
                      <circle cx="12" cy="18" r="1.5" fill="white" />
                      <line x1="12" y1="9.5" x2="9" y2="11.5" stroke="white" strokeWidth="1" />
                      <line x1="12" y1="9.5" x2="15" y2="11.5" stroke="white" strokeWidth="1" />
                      <line x1="9" y1="14.5" x2="12" y2="16.5" stroke="white" strokeWidth="1" />
                      <line x1="15" y1="14.5" x2="12" y2="16.5" stroke="white" strokeWidth="1" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white mb-1">AI Assistant</h3>
                    <p className="text-xs text-gray-400">
                      Your personalised Assistant is being built
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Upgrade Button */}
          <button className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2">
            <span className="hidden sm:inline">Upgrade</span>
          </button>

          {/* Hamburger Menu */}
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="p-2 text-gray-400 hover:text-white hover:bg-purple-500/10 rounded-lg transition-all"
            >
              <Menu className="w-6 h-6" />
            </button>

            {showDropdown && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowDropdown(false)}
                />
                <div className="absolute right-0 mt-2 w-56 bg-gray-900 border border-purple-500/30 rounded-lg shadow-xl z-50">
                  <div className="p-2">
                    {/* User Info */}
                    <div className="px-4 py-3 border-b border-purple-500/20">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">
                            {user?.email?.split('@')[0] || 'User'}
                          </p>
                          <p className="text-xs text-gray-400">Free Plan</p>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                      <button className="flex items-center gap-3 w-full px-4 py-2 text-left text-gray-300 hover:text-white hover:bg-purple-500/10 rounded-lg transition-all">
                        <CreditCard className="w-4 h-4" />
                        <span className="text-sm">Switch Plan</span>
                      </button>

                      <button
                        onClick={() => {
                          signOut();
                          setShowDropdown(false);
                        }}
                        className="flex items-center gap-3 w-full px-4 py-2 text-left text-gray-300 hover:text-white hover:bg-purple-500/10 rounded-lg transition-all"
                      >
                        <LogOut className="w-4 h-4" />
                        <span className="text-sm">Sign Out</span>
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
