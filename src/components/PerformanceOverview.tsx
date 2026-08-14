import React from 'react';
import { Habit } from '../types';
import { TrendingUp, Activity, AlertTriangle, CheckCircle2, ChevronRight, ShieldCheck } from 'lucide-react';

interface PerformanceOverviewProps {
  habits: Habit[];
  onSelectTierFilter?: (tier: 'high' | 'medium' | 'low' | 'all') => void;
  activeFilter?: string;
}

export const PerformanceOverview: React.FC<PerformanceOverviewProps> = ({
  habits,
  onSelectTierFilter,
  activeFilter = 'all'
}) => {
  // Categorize habits based on completion & streak performance
  // High: streak >= 10 OR completed today with high streak
  // Medium: streak 5-9
  // Low: streak < 5 OR needs attention
  
  const highPerformanceHabits = habits.filter(h => h.currentStreak >= 10);
  const mediumPerformanceHabits = habits.filter(h => h.currentStreak >= 5 && h.currentStreak < 10);
  const lowPerformanceHabits = habits.filter(h => h.currentStreak < 5);

  const total = habits.length || 1;

  const highCount = highPerformanceHabits.length;
  const highPercentage = Math.round((highCount / total) * 100);

  const mediumCount = mediumPerformanceHabits.length;
  const mediumPercentage = Math.round((mediumCount / total) * 100);

  const lowCount = lowPerformanceHabits.length;
  const lowPercentage = Math.round((lowCount / total) * 100);

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
            <span>Performance Overview</span>
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Categorized analysis of habit streaks and consistency levels
          </p>
        </div>
        {activeFilter !== 'all' && (
          <button
            onClick={() => onSelectTierFilter && onSelectTierFilter('all')}
            className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
          >
            Reset Filter
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        
        {/* 1. High Performance Card */}
        <div 
          onClick={() => onSelectTierFilter && onSelectTierFilter('high')}
          className={`relative overflow-hidden p-5 rounded-2xl border transition-all duration-300 cursor-pointer group ${
            activeFilter === 'high' 
              ? 'ring-2 ring-emerald-500 bg-emerald-50/90 dark:bg-emerald-950/60 border-emerald-500 shadow-lg shadow-emerald-500/10' 
              : 'bg-white dark:bg-gray-900 border-gray-200/80 dark:border-gray-800 hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/5'
          }`}
        >
          {/* Top subtle glow bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600" />

          <div className="flex items-start justify-between mb-3">
            <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 font-semibold group-hover:scale-110 transition-transform">
              <TrendingUp className="w-5 h-5" />
            </div>
            <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300 flex items-center space-x-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>Optimal</span>
            </span>
          </div>

          <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">
            High Performance
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
            Streak 10+ days • High consistency
          </p>

          <div className="flex items-baseline justify-between pt-3 border-t border-gray-100 dark:border-gray-800">
            <div>
              <span className="text-2xl font-black text-gray-900 dark:text-gray-100 font-mono">
                {highCount}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                {highCount === 1 ? 'Habit' : 'Habits'}
              </span>
            </div>
            <div className="text-right">
              <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                {highPercentage}%
              </span>
              <div className="text-[10px] text-gray-400">of total portfolio</div>
            </div>
          </div>

          {/* Progress fill bar */}
          <div className="w-full bg-gray-100 dark:bg-gray-800 h-1.5 rounded-full mt-3 overflow-hidden">
            <div 
              className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
              style={{ width: `${highPercentage}%` }} 
            />
          </div>
        </div>

        {/* 2. Medium Performance Card */}
        <div 
          onClick={() => onSelectTierFilter && onSelectTierFilter('medium')}
          className={`relative overflow-hidden p-5 rounded-2xl border transition-all duration-300 cursor-pointer group ${
            activeFilter === 'medium' 
              ? 'ring-2 ring-amber-500 bg-amber-50/90 dark:bg-amber-950/60 border-amber-500 shadow-lg shadow-amber-500/10' 
              : 'bg-white dark:bg-gray-900 border-gray-200/80 dark:border-gray-800 hover:border-amber-500/50 hover:shadow-lg hover:shadow-amber-500/5'
          }`}
        >
          {/* Top bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500" />

          <div className="flex items-start justify-between mb-3">
            <div className="p-2.5 rounded-xl bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 font-semibold group-hover:scale-110 transition-transform">
              <Activity className="w-5 h-5" />
            </div>
            <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300">
              Building Streak
            </span>
          </div>

          <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">
            Medium Performance
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
            Streak 5–9 days • Steady momentum
          </p>

          <div className="flex items-baseline justify-between pt-3 border-t border-gray-100 dark:border-gray-800">
            <div>
              <span className="text-2xl font-black text-gray-900 dark:text-gray-100 font-mono">
                {mediumCount}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                {mediumCount === 1 ? 'Habit' : 'Habits'}
              </span>
            </div>
            <div className="text-right">
              <span className="text-xl font-bold text-amber-600 dark:text-amber-400 font-mono">
                {mediumPercentage}%
              </span>
              <div className="text-[10px] text-gray-400">of total portfolio</div>
            </div>
          </div>

          {/* Progress fill bar */}
          <div className="w-full bg-gray-100 dark:bg-gray-800 h-1.5 rounded-full mt-3 overflow-hidden">
            <div 
              className="bg-amber-500 h-full rounded-full transition-all duration-500" 
              style={{ width: `${mediumPercentage}%` }} 
            />
          </div>
        </div>

        {/* 3. Low Performance Card */}
        <div 
          onClick={() => onSelectTierFilter && onSelectTierFilter('low')}
          className={`relative overflow-hidden p-5 rounded-2xl border transition-all duration-300 cursor-pointer group ${
            activeFilter === 'low' 
              ? 'ring-2 ring-rose-500 bg-rose-50/90 dark:bg-rose-950/60 border-rose-500 shadow-lg shadow-rose-500/10' 
              : 'bg-white dark:bg-gray-900 border-gray-200/80 dark:border-gray-800 hover:border-rose-500/50 hover:shadow-lg hover:shadow-rose-500/5'
          }`}
        >
          {/* Top bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-rose-500 via-pink-500 to-red-500" />

          <div className="flex items-start justify-between mb-3">
            <div className="p-2.5 rounded-xl bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 font-semibold group-hover:scale-110 transition-transform">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-rose-100 text-rose-800 dark:bg-rose-900/60 dark:text-rose-300">
              Needs Focus
            </span>
          </div>

          <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">
            Low Performance
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
            Streak &lt; 5 days • Fresh start opportunity
          </p>

          <div className="flex items-baseline justify-between pt-3 border-t border-gray-100 dark:border-gray-800">
            <div>
              <span className="text-2xl font-black text-gray-900 dark:text-gray-100 font-mono">
                {lowCount}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                {lowCount === 1 ? 'Habit' : 'Habits'}
              </span>
            </div>
            <div className="text-right">
              <span className="text-xl font-bold text-rose-600 dark:text-rose-400 font-mono">
                {lowPercentage}%
              </span>
              <div className="text-[10px] text-gray-400">of total portfolio</div>
            </div>
          </div>

          {/* Progress fill bar */}
          <div className="w-full bg-gray-100 dark:bg-gray-800 h-1.5 rounded-full mt-3 overflow-hidden">
            <div 
              className="bg-rose-500 h-full rounded-full transition-all duration-500" 
              style={{ width: `${lowPercentage}%` }} 
            />
          </div>
        </div>

      </div>
    </div>
  );
};
