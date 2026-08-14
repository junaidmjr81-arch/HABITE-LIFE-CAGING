import React, { useState } from 'react';
import { 
  Flame, 
  LayoutDashboard, 
  CheckCircle2, 
  BarChart3, 
  Calendar as CalendarIcon, 
  Settings, 
  Sun, 
  Moon, 
  Search, 
  User, 
  Sparkles,
  Award,
  ChevronDown,
  X,
  UserPlus,
  Users,
  UserCheck,
  Briefcase
} from 'lucide-react';
import { NavigationTab, UserProfile } from '../types';

interface NavbarProps {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  userProfile: UserProfile;
  teamMembers?: UserProfile[];
  onSelectProfile?: (profile: UserProfile) => void;
  onOpenProfileManager?: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onOpenAddHabit: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  darkMode,
  setDarkMode,
  userProfile,
  teamMembers = [],
  onSelectProfile,
  onOpenProfileManager,
  searchQuery,
  setSearchQuery,
  onOpenAddHabit,
}) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const navItems: { id: NavigationTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'day-work', label: 'WORK UP', icon: <Briefcase className="w-4 h-4" />, badge: 'NEW' },
    { id: 'habits', label: 'Habits', icon: <CheckCircle2 className="w-4 h-4" /> },
    { id: 'statistics', label: 'Statistics', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'calendar', label: 'Calendar', icon: <CalendarIcon className="w-4 h-4" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-white/85 dark:bg-gray-900/90 border-b border-gray-200/80 dark:border-gray-800/80 transition-colors duration-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Branding */}
          <div className="flex items-center space-x-8">
            <button 
              onClick={() => setActiveTab('dashboard')}
              className="flex items-center space-x-2.5 group cursor-pointer text-left focus:outline-none"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-200">
                <Flame className="w-6 h-6 fill-white/20 animate-pulse" />
              </div>
              <div>
                <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 dark:from-emerald-400 dark:via-teal-400 dark:to-cyan-400 bg-clip-text text-transparent">
                  HabitFlow
                </span>
                <span className="hidden sm:inline-block ml-2 px-1.5 py-0.5 text-[10px] font-bold tracking-wider uppercase rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300">
                  PRO
                </span>
              </div>
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`relative flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-150 cursor-pointer ${
                      isActive
                        ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 font-semibold shadow-xs'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100/70 dark:hover:bg-gray-800/70'
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="ml-1 text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-xs">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Right Utilities */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* Search Input Bar */}
            <div className="relative">
              {isSearchOpen ? (
                <div className="flex items-center">
                  <input
                    type="text"
                    placeholder="Search habits..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                    className="w-36 sm:w-56 pl-8 pr-8 py-1.5 text-sm bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg border border-emerald-500 focus:outline-none"
                  />
                  <Search className="w-4 h-4 text-gray-400 absolute left-2.5 top-2.5" />
                  <button 
                    onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }}
                    className="absolute right-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors cursor-pointer"
                  title="Search habits"
                >
                  <Search className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Dark / Light Full Mode Toggle Button */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl border border-gray-200/70 dark:border-gray-700/70 transition-all cursor-pointer flex items-center space-x-1.5"
              title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {darkMode ? (
                <>
                  <Sun className="w-4 h-4 text-amber-400" />
                  <span className="hidden sm:inline text-xs font-semibold text-gray-300">Light</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-gray-700" />
                  <span className="hidden sm:inline text-xs font-semibold text-gray-700">Dark</span>
                </>
              )}
            </button>

            {/* Add Habit Quick Button */}
            <button
              onClick={onOpenAddHabit}
              className="hidden sm:flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold shadow-sm transition-all hover:scale-[1.02] cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>+ Habit</span>
            </button>

            {/* User Profile & Member Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-2 p-1.5 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200/60 dark:border-gray-800 transition-colors cursor-pointer"
                title="Option to select a profile"
              >
                <img
                  src={userProfile.avatar}
                  alt={userProfile.name}
                  referrerPolicy="no-referrer"
                  className="w-8 h-8 rounded-xl object-cover ring-2 ring-emerald-500/60 shadow-xs"
                />
                <div className="hidden lg:block text-left pr-1">
                  <div className="text-xs font-bold text-gray-900 dark:text-gray-100 leading-tight truncate max-w-[110px]">
                    {userProfile.name}
                  </div>
                  <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center space-x-1">
                    <span>Lvl {userProfile.level}</span>
                    <span>•</span>
                    <span className="truncate max-w-[70px]">{userProfile.role || 'Member'}</span>
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
              </button>

              {/* Profile Menu Popup */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-800 py-3.5 px-4 z-50 animate-scale-in">
                  
                  {/* Current Active Profile Card */}
                  <div className="flex items-center space-x-3 pb-3 border-b border-gray-100 dark:border-gray-800">
                    <img
                      src={userProfile.avatar}
                      alt={userProfile.name}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-2xl object-cover ring-2 ring-emerald-500 shadow-md"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-0.5">
                        Active Profile
                      </div>
                      <h4 className="font-bold text-sm text-gray-900 dark:text-gray-100 truncate">
                        {userProfile.name}
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {userProfile.title}
                      </p>
                      <div className="flex items-center space-x-1.5 text-xs text-emerald-600 dark:text-emerald-400 mt-0.5 font-bold">
                        <Award className="w-3.5 h-3.5" />
                        <span>Level {userProfile.level}</span>
                        <span>•</span>
                        <span className="text-[10px] font-mono">{userProfile.currentXp} XP</span>
                      </div>
                    </div>
                  </div>

                  {/* Level XP Bar */}
                  <div className="my-3">
                    <div className="flex justify-between text-[11px] text-gray-500 dark:text-gray-400 mb-1">
                      <span>Level Progress</span>
                      <span className="font-mono">{userProfile.currentXp} / {userProfile.nextLevelXp}</span>
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-gray-800 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, (userProfile.currentXp / userProfile.nextLevelXp) * 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Option to Select a Profile Section */}
                  <div className="pt-2 pb-2 border-t border-gray-100 dark:border-gray-800">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[11px] font-bold text-gray-700 dark:text-gray-300">
                        Option to select a profile
                      </span>
                      <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 px-1.5 py-0.2 rounded font-bold">
                        {teamMembers.length}
                      </span>
                    </div>
                    <div className="space-y-1 max-h-36 overflow-y-auto">
                      {teamMembers.map((m) => (
                        <button
                          key={m.id}
                          onClick={() => {
                            if (onSelectProfile) onSelectProfile(m);
                            setShowProfileMenu(false);
                          }}
                          className={`w-full flex items-center justify-between p-1.5 rounded-xl text-xs transition-colors cursor-pointer ${
                            m.id === userProfile.id
                              ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-500/30'
                              : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                          }`}
                        >
                          <div className="flex items-center space-x-2 min-w-0">
                            <img
                              src={m.avatar}
                              alt={m.name}
                              referrerPolicy="no-referrer"
                              className="w-6 h-6 rounded-lg object-cover"
                            />
                            <span className="truncate">{m.name}</span>
                          </div>
                          {m.id === userProfile.id ? (
                            <span className="text-[9px] bg-emerald-500 text-white px-1.5 py-0.2 rounded-md font-bold uppercase">
                              Active
                            </span>
                          ) : (
                            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                              Select
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Action Links */}
                  <div className="pt-2 border-t border-gray-100 dark:border-gray-800 space-y-1">
                    {onOpenProfileManager && (
                      <button
                        onClick={() => { onOpenProfileManager(); setShowProfileMenu(false); }}
                        className="w-full text-left px-3 py-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 rounded-xl flex items-center space-x-2 transition-colors cursor-pointer"
                      >
                        <Users className="w-4 h-4 text-emerald-500" />
                        <span>Option to select a profile (All)</span>
                      </button>
                    )}
                    <button
                      onClick={() => { setActiveTab('settings'); setShowProfileMenu(false); }}
                      className="w-full text-left px-3 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl flex items-center space-x-2 transition-colors cursor-pointer"
                    >
                      <Settings className="w-4 h-4 text-gray-400" />
                      <span>Profile & App Settings</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};

