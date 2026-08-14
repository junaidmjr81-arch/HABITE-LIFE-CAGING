import React, { useState } from 'react';
import { BarChart3, TrendingUp, Calendar, Trophy, Sparkles } from 'lucide-react';
import { DayWeeklyData } from '../types';

interface WeeklyChartProps {
  todayCompletionPercentage: number;
}

export const WeeklyChart: React.FC<WeeklyChartProps> = ({ todayCompletionPercentage }) => {
  const [hoveredDay, setHoveredDay] = useState<DayWeeklyData | null>(null);

  // Monday to Sunday dynamic data relative to today
  const weeklyData: DayWeeklyData[] = [
    { day: 'Mon', fullDate: 'Aug 10', percentage: 86, completedCount: 12, totalCount: 14 },
    { day: 'Tue', fullDate: 'Aug 11', percentage: 93, completedCount: 13, totalCount: 14 },
    { day: 'Wed', fullDate: 'Aug 12', percentage: todayCompletionPercentage, completedCount: Math.round((todayCompletionPercentage / 100) * 14), totalCount: 14 },
    { day: 'Thu', fullDate: 'Aug 13', percentage: 88, completedCount: 12, totalCount: 14 },
    { day: 'Fri', fullDate: 'Aug 14', percentage: 95, completedCount: 13, totalCount: 14 },
    { day: 'Sat', fullDate: 'Aug 15', percentage: 71, completedCount: 10, totalCount: 14 },
    { day: 'Sun', fullDate: 'Aug 16', percentage: 82, completedCount: 11, totalCount: 14 },
  ];

  const averageWeeklyPct = Math.round(
    weeklyData.reduce((acc, d) => acc + d.percentage, 0) / weeklyData.length
  );

  const peakDay = [...weeklyData].sort((a, b) => b.percentage - a.percentage)[0];

  return (
    <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 border border-gray-200/80 dark:border-gray-800 shadow-xl mb-8">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-6 h-6 text-emerald-500" />
            <h3 className="text-xl font-extrabold text-gray-900 dark:text-gray-100">
              Weekly Performance Trends
            </h3>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Monday – Sunday habit completion breakdown and target benchmarks
          </p>
        </div>

        {/* Quick Highlights */}
        <div className="flex items-center space-x-3 text-xs">
          <div className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 font-bold flex items-center space-x-1.5">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Weekly Avg: {averageWeeklyPct}%</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 font-bold flex items-center space-x-1.5">
            <Trophy className="w-3.5 h-3.5" />
            <span>Peak: {peakDay.day} ({peakDay.percentage}%)</span>
          </div>
        </div>
      </div>

      {/* Chart Canvas Container */}
      <div className="relative pt-6 pb-2">
        
        {/* Target 80% reference line */}
        <div className="absolute top-[35%] left-0 right-0 border-b-2 border-dashed border-emerald-500/30 dark:border-emerald-500/20 z-0 flex items-center justify-end pr-2">
          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-white dark:bg-gray-900 px-1">
            Target 80%
          </span>
        </div>

        {/* Bars Container */}
        <div className="grid grid-cols-7 gap-2 sm:gap-4 h-56 items-end relative z-10 px-2">
          {weeklyData.map((d) => {
            const isToday = d.day === 'Wed';
            const isHovered = hoveredDay?.day === d.day;

            return (
              <div
                key={d.day}
                onMouseEnter={() => setHoveredDay(d)}
                onMouseLeave={() => setHoveredDay(null)}
                className="flex flex-col items-center h-full justify-end group cursor-pointer"
              >
                {/* Hover Tooltip Popup */}
                {isHovered && (
                  <div className="mb-2 p-2 rounded-xl bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900 text-xs font-bold shadow-xl animate-fade-in text-center shrink-0 z-30">
                    <div className="font-mono text-emerald-400 dark:text-emerald-600">{d.percentage}%</div>
                    <div className="text-[10px] font-normal opacity-80">{d.completedCount}/{d.totalCount} Done</div>
                  </div>
                )}

                {/* Bar Fill Wrapper */}
                <div className="w-full max-w-[48px] bg-gray-100 dark:bg-gray-800/80 rounded-2xl h-full flex items-end p-1 relative overflow-hidden transition-all group-hover:bg-gray-200 dark:group-hover:bg-gray-800">
                  <div
                    className={`w-full rounded-xl transition-all duration-700 relative ${
                      isToday
                        ? 'bg-gradient-to-t from-emerald-600 via-teal-500 to-cyan-400 shadow-md shadow-emerald-500/30'
                        : d.percentage >= 80
                        ? 'bg-gradient-to-t from-emerald-500 to-teal-400'
                        : 'bg-gradient-to-t from-amber-500 to-orange-400'
                    }`}
                    style={{ height: `${d.percentage}%` }}
                  >
                    {isToday && (
                      <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 rounded-full bg-white shadow-xs" />
                    )}
                  </div>
                </div>

                {/* Day Label */}
                <div className="mt-2 text-center">
                  <span className={`text-xs font-bold block ${
                    isToday
                      ? 'text-emerald-600 dark:text-emerald-400 underline underline-offset-4 font-black'
                      : 'text-gray-600 dark:text-gray-400'
                  }`}>
                    {d.day}
                  </span>
                  <span className="text-[10px] text-gray-400 dark:text-gray-500">
                    {d.fullDate}
                  </span>
                </div>

              </div>
            );
          })}
        </div>

      </div>

      {/* Footer Insight */}
      <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-emerald-500" />
          <span>You're performing <strong>+8% better</strong> than last week on weekdays!</span>
        </div>
        <span className="hidden sm:inline-block text-[11px] font-mono text-gray-400">
          Updated live
        </span>
      </div>

    </div>
  );
};
