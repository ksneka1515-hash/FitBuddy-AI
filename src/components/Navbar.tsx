import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Sparkles, 
  Menu, 
  X, 
  User as UserIcon, 
  LogOut, 
  Compass, 
  LayoutDashboard, 
  Home, 
  PartyPopper, 
  Gem, 
  History, 
  LogIn
} from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onOpenAuth: (initialMode?: 'login' | 'register') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onSelectTab, onOpenAuth }) => {
  const { user, logout, demoLogin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDemoLoading, setIsDemoLoading] = useState(false);

  const handleNavClick = (tab: string) => {
    onSelectTab(tab);
    setMobileMenuOpen(false);
  };

  const handleDemoClick = async () => {
    try {
      setIsDemoLoading(true);
      await demoLogin();
      onSelectTab('dashboard');
    } catch (err) {
      console.error(err);
    } finally {
      setIsDemoLoading(false);
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Zone 1: Single text element wordmark */}
          <button 
            onClick={() => handleNavClick('landing')}
            className="flex items-center gap-2.5 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded-lg p-1"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-slate-900 to-blue-900 flex items-center justify-center text-white shadow-sm shadow-blue-950/20 group-hover:scale-105 transition-transform duration-200">
              <Sparkles className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-slate-900 block leading-tight">
                PocketSmart <span className="text-blue-600">AI</span>
              </span>
              <span className="text-[10px] text-slate-500 font-medium tracking-wide hidden sm:block">
                Smart Budget Assistant
              </span>
            </div>
          </button>

          {/* Zone 2: 4-6 clean text navigation links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            <button
              onClick={() => handleNavClick('landing')}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                currentTab === 'landing'
                  ? 'text-blue-600 bg-blue-50/70'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              Home
            </button>

            {user && (
              <button
                onClick={() => handleNavClick('dashboard')}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                  currentTab === 'dashboard'
                    ? 'text-blue-600 bg-blue-50/70'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                Dashboard
              </button>
            )}

            <button
              onClick={() => handleNavClick('home-planner')}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                currentTab === 'home-planner'
                  ? 'text-blue-600 bg-blue-50/70'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              Home Planner
            </button>

            <button
              onClick={() => handleNavClick('party-planner')}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                currentTab === 'party-planner'
                  ? 'text-blue-600 bg-blue-50/70'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              Party Planner
            </button>

            <button
              onClick={() => handleNavClick('jewelry-planner')}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                currentTab === 'jewelry-planner'
                  ? 'text-blue-600 bg-blue-50/70'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              Jewelry Planner
            </button>

            {user && (
              <button
                onClick={() => handleNavClick('history')}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                  currentTab === 'history'
                    ? 'text-blue-600 bg-blue-50/70'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                History
              </button>
            )}
          </nav>

          {/* Zone 3: 1-2 primary actions */}
          <div className="hidden lg:flex items-center gap-2.5">
            {user ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleNavClick('profile')}
                  className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg border transition-colors ${
                    currentTab === 'profile'
                      ? 'border-blue-300 bg-blue-50/80 text-blue-700'
                      : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                  title="My Profile"
                >
                  <div className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs flex items-center justify-center font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="max-w-[120px] truncate">{user.name}</span>
                </button>
                <button
                  onClick={() => {
                    logout();
                    handleNavClick('landing');
                  }}
                  className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  title="Logout"
                  aria-label="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleDemoClick}
                  disabled={isDemoLoading}
                  className="px-3 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 rounded-lg transition-colors whitespace-nowrap"
                >
                  {isDemoLoading ? 'Loading Demo...' : 'Demo Login'}
                </button>
                <button
                  onClick={() => onOpenAuth('login')}
                  className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-sm whitespace-nowrap"
                >
                  Sign In
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu toggle */}
          <div className="flex lg:hidden items-center gap-2">
            {!user && (
              <button
                onClick={handleDemoClick}
                disabled={isDemoLoading}
                className="px-2.5 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
              >
                Demo
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation (Touch-Friendly >= 44px) */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white shadow-xl px-4 py-5 animate-in slide-in-from-top duration-200">
          <div className="flex flex-col space-y-1">
            <button
              onClick={() => handleNavClick('landing')}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium min-h-[48px] text-left transition-colors ${
                currentTab === 'landing' ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Compass className="w-5 h-5 text-slate-500" />
              Home Page
            </button>

            {user && (
              <button
                onClick={() => handleNavClick('dashboard')}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium min-h-[48px] text-left transition-colors ${
                  currentTab === 'dashboard' ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <LayoutDashboard className="w-5 h-5 text-slate-500" />
                Dashboard
              </button>
            )}

            <button
              onClick={() => handleNavClick('home-planner')}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium min-h-[48px] text-left transition-colors ${
                currentTab === 'home-planner' ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Home className="w-5 h-5 text-slate-500" />
              Home Budget Planner
            </button>

            <button
              onClick={() => handleNavClick('party-planner')}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium min-h-[48px] text-left transition-colors ${
                currentTab === 'party-planner' ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <PartyPopper className="w-5 h-5 text-slate-500" />
              Party Budget Planner
            </button>

            <button
              onClick={() => handleNavClick('jewelry-planner')}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium min-h-[48px] text-left transition-colors ${
                currentTab === 'jewelry-planner' ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Gem className="w-5 h-5 text-slate-500" />
              Jewelry Budget Planner
            </button>

            {user && (
              <button
                onClick={() => handleNavClick('history')}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium min-h-[48px] text-left transition-colors ${
                  currentTab === 'history' ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <History className="w-5 h-5 text-slate-500" />
                My Plan History
              </button>
            )}

            {user && (
              <button
                onClick={() => handleNavClick('profile')}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium min-h-[48px] text-left transition-colors ${
                  currentTab === 'profile' ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <UserIcon className="w-5 h-5 text-slate-500" />
                My Profile ({user.name})
              </button>
            )}
          </div>

          <div className="mt-5 pt-4 border-t border-slate-200">
            {user ? (
              <button
                onClick={() => {
                  logout();
                  handleNavClick('landing');
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-rose-50 text-rose-700 font-semibold text-sm hover:bg-rose-100 transition-colors min-h-[48px]"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    onOpenAuth('login');
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-slate-300 font-semibold text-sm text-slate-700 hover:bg-slate-50 min-h-[48px]"
                >
                  <LogIn className="w-4 h-4" />
                  Sign In
                </button>
                <button
                  onClick={() => {
                    onOpenAuth('register');
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center justify-center px-4 py-3 rounded-lg bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 shadow-sm min-h-[48px]"
                >
                  Register
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
