import React from 'react';
import { Habit, UserProfile } from '../../types';
import { 
  BarChart3, 
  Flame, 
  Trophy, 
  Award, 
  CheckCircle2, 
  PieChart as PieChartIcon, 
  TrendingUp, 
  Zap, 
  ShieldCheck,
  Star
} from 'lucide-react';

interface StatisticsViewProps {
  habits: Habit[];
  userProfile: UserProfile;
}

export const StatisticsView: React.FC<StatisticsViewProps> = ({ habits, userProfile }) => {
  const totalHabits = habits.length;
  const completedToday = habits.filter(h => h.completedToday).length;
  const completionRate = Math.round((completedToday / (totalHabits || 1)) * 100);

  // Highest streak habit
  const topStreakHabit = [...habits].sort((a, b) => b.currentStreak - a.currentStreak)[0];

  // Category breakdown
  const categoryCounts: Record<string, number> = {};
  habits.forEach(h => {
    categoryCounts[h.category] = (categoryCounts[h.category] || 0) + 1;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 p-6 sm:p-8 rounded-3xl border border-gray-200/80 dark:border-gray-800 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="flex items-center space-x-3">
            <BarChart3 className="w-8 h-8 text-indigo-500" />
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-gray-100">
              Analytics & Insights
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
            In-depth performance statistics, category allocations, and level milestones
          </p>
        </div>

        {/* User Level Banner */}
        <div className="flex items-center space-x-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 rounded-2xl shadow-lg shrink-0 w-full sm:w-auto">
          <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center font-black text-xl">
            Lvl {userProfile.level}
          </div>
          <div>
            <div className="text-xs font-bold text-indigo-200 uppercase tracking-wider">
              {userProfile.title}
            </div>
            <div className="text-sm font-black">
              {userProfile.currentXp} / {userProfile.nextLevelXp} XP
            </div>
            <div className="w-36 bg-white/20 h-1.5 rounded-full mt-1">
              <div 
                className="bg-amber-300 h-full rounded-full" 
                style={{ width: `${(userProfile.currentXp / userProfile.nextLevelXp) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Top 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-lg">
          <div className="p-2 w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 mb-3">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div className="text-2xl font-black text-gray-900 dark:text-gray-100 font-mono">
            {completionRate}%
          </div>
          <div className="text-xs font-bold text-gray-800 dark:text-gray-200 mt-0.5">
            Today Completion Rate
          </div>
          <p className="text-[10px] text-gray-400 mt-1">
            {completedToday} of {totalHabits} completed
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-lg">
          <div className="p-2 w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 mb-3">
            <Flame className="w-5 h-5 fill-amber-500" />
          </div>
          <div className="text-2xl font-black text-gray-900 dark:text-gray-100 font-mono">
            {topStreakHabit?.currentStreak || 0} Days
          </div>
          <div className="text-xs font-bold text-gray-800 dark:text-gray-200 mt-0.5">
            Longest Active Streak
          </div>
          <p className="text-[10px] text-gray-400 mt-1 truncate">
            {topStreakHabit?.name || 'None'}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-lg">
          <div className="p-2 w-9 h-9 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 mb-3">
            <Award className="w-5 h-5" />
          </div>
          <div className="text-2xl font-black text-gray-900 dark:text-gray-100 font-mono">
            {userProfile.totalHabitsCompleted}
          </div>
          <div className="text-xs font-bold text-gray-800 dark:text-gray-200 mt-0.5">
            Lifetime Habits Completed
          </div>
          <p className="text-[10px] text-gray-400 mt-1">
            All-time productivity logs
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-lg">
          <div className="p-2 w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 mb-3">
            <Trophy className="w-5 h-5" />
          </div>
          <div className="text-2xl font-black text-gray-900 dark:text-gray-100 font-mono">
            84.5%
          </div>
          <div className="text-xs font-bold text-gray-800 dark:text-gray-200 mt-0.5">
            30-Day Velocity Index
          </div>
          <p className="text-[10px] text-gray-400 mt-1">
            High overall consistency
          </p>
        </div>

      </div>

      {/* Streak Leaderboard & Category Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Streak Leaderboard */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-200/80 dark:border-gray-800 shadow-xl">
          <div className="flex items-center space-x-2 mb-4">
            <Flame className="w-5 h-5 text-amber-500 fill-amber-500" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
              Top Active Streaks
            </h3>
          </div>

          <div className="space-y-3">
            {habits.slice(0, 6).map((habit, idx) => (
              <div 
                key={habit.id}
                className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800"
              >
                <div className="flex items-center space-x-3">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center font-mono font-bold text-xs ${
                    idx === 0 ? 'bg-amber-400 text-gray-900' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                  }`}>
                    {idx + 1}
                  </span>
                  <div>
                    <div className="text-xs font-bold text-gray-900 dark:text-gray-100">
                      {habit.name}
                    </div>
                    <div className="text-[10px] text-gray-400">
                      {habit.category}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-1 text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950 px-2.5 py-1 rounded-lg">
                  <Flame className="w-3.5 h-3.5 fill-amber-500" />
                  <span>{habit.currentStreak} Days</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-200/80 dark:border-gray-800 shadow-xl">
          <div className="flex items-center space-x-2 mb-4">
            <PieChartIcon className="w-5 h-5 text-emerald-500" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
              Category Distribution
            </h3>
          </div>

          <div className="space-y-4">
            {Object.entries(categoryCounts).map(([cat, count]) => {
              const pct = Math.round((count / totalHabits) * 100);
              return (
                <div key={cat}>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-gray-800 dark:text-gray-200">{cat}</span>
                    <span className="text-gray-500 dark:text-gray-400 font-mono">{count} habits ({pct}%)</span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-gray-800 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
};
