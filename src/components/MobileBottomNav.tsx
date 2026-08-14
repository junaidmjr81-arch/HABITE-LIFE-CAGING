import React from 'react';
import { 
  LayoutDashboard, 
  CheckCircle2, 
  BarChart3, 
  Calendar as CalendarIcon, 
  Settings,
  Sun,
  Moon,
  Plus,
  Briefcase
} from 'lucide-react';
import { NavigationTab } from '../types';

interface MobileBottomNavProps {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  onOpenAddHabit: () => void;
  completedCount?: number;
  totalCount?: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  setActiveTab,
  darkMode,
  setDarkMode,
  onOpenAddHabit,
  completedCount = 0,
  totalCount = 0,
}) => {
  const navItems: { id: NavigationTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'day-work', label: 'WORK UP', icon: Briefcase },
    { id: 'habits', label: 'Habits', icon: CheckCircle2 },
    { id: 'statistics', label: 'Stats', icon: BarChart3 },
    { id: 'calendar', label: 'Calendar', icon: CalendarIcon },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-t border-gray-200 dark:border-gray-800 shadow-[0_-4px_24px_rgba(0,0,0,0.12)] transition-colors duration-200">
      
      {/* Top micro progress line on mobile */}
      <div className="h-0.5 w-full bg-gray-200 dark:bg-gray-800">
        <div 
          className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300"
          style={{ width: `${Math.round((completedCount / (totalCount || 1)) * 100)}%` }}
        />
      </div>

      <nav className="flex items-center justify-around px-2 py-1.5 max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`relative flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl transition-all duration-200 cursor-pointer min-w-[56px] ${
                isActive
                  ? 'text-emerald-600 dark:text-emerald-400 font-bold scale-105'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
            >
              {/* Active subtle background capsule */}
              {isActive && (
                <span className="absolute inset-0 bg-emerald-500/10 dark:bg-emerald-400/15 rounded-2xl -z-10 animate-fade-in" />
              )}

              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110 stroke-[2.5]' : 'stroke-2'}`} />
                {item.id === 'habits' && totalCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 w-4 h-4 bg-emerald-500 text-white rounded-full text-[9px] font-extrabold flex items-center justify-center">
                    {totalCount - completedCount > 0 ? totalCount - completedCount : '✓'}
                  </span>
                )}
              </div>

              <span className="text-[10px] mt-1 font-medium tracking-tight">
                {item.label}
              </span>

              {/* Active bottom micro dot */}
              {isActive && (
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-0.5 shadow-sm shadow-emerald-500" />
              )}
            </button>
          );
        })}

        {/* Mobile Quick Dark Mode Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="flex flex-col items-center justify-center py-1.5 px-2.5 text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors cursor-pointer min-w-[50px]"
          title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {darkMode ? (
            <Sun className="w-5 h-5 text-amber-400 animate-spin-slow" />
          ) : (
            <Moon className="w-5 h-5 text-gray-600" />
          )}
          <span className="text-[10px] mt-1 font-medium">
            {darkMode ? 'Light' : 'Dark'}
          </span>
        </button>
      </nav>
    </div>
  );
};
