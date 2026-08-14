import React, { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, CheckCircle2, Flame, Award } from 'lucide-react';
import { Habit } from '../../types';

interface CalendarViewProps {
  habits: Habit[];
}

export const CalendarView: React.FC<CalendarViewProps> = ({ habits }) => {
  const [selectedDay, setSelectedDay] = useState<number>(12); // Default to Aug 12

  // Generate 31 days for August
  const daysInAugust = Array.from({ length: 31 }, (_, i) => i + 1);

  // Simulated daily completion rate map
  const getCompletionForDay = (day: number) => {
    if (day > 12) return 0; // Future days
    if (day === 12) return Math.round((habits.filter(h => h.completedToday).length / (habits.length || 1)) * 100);
    // Pseudo-random realistic consistency for past days
    const seed = (day * 17) % 30;
    return 70 + seed; // 70% - 99%
  };

  const selectedPct = getCompletionForDay(selectedDay);

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 p-6 sm:p-8 rounded-3xl border border-gray-200/80 dark:border-gray-800 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <CalendarIcon className="w-8 h-8 text-cyan-500" />
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-gray-100">
              August 2026 Calendar
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
            Visual month consistency matrix and historic completion audit
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-800 p-1.5 rounded-2xl">
          <button className="p-2 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 rounded-xl hover:bg-white dark:hover:bg-gray-700 transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-bold px-3 text-gray-800 dark:text-gray-200">August 2026</span>
          <button className="p-2 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 rounded-xl hover:bg-white dark:hover:bg-gray-700 transition-colors">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Grid + Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Calendar Heatmap Grid */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 p-6 sm:p-8 rounded-3xl border border-gray-200/80 dark:border-gray-800 shadow-xl">
          
          {/* Day Headers */}
          <div className="grid grid-cols-7 text-center text-xs font-bold text-gray-400 dark:text-gray-500 mb-4">
            <div>MON</div><div>TUE</div><div>WED</div><div>THU</div><div>FRI</div><div>SAT</div><div>SUN</div>
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-2">
            {daysInAugust.map((day) => {
              const pct = getCompletionForDay(day);
              const isSelected = selectedDay === day;
              const isToday = day === 12;
              const isFuture = day > 12;

              let heatBg = 'bg-gray-100 dark:bg-gray-800 text-gray-400';
              if (!isFuture) {
                if (pct >= 90) heatBg = 'bg-emerald-500 text-white font-bold';
                else if (pct >= 75) heatBg = 'bg-emerald-400 text-white font-bold';
                else if (pct >= 50) heatBg = 'bg-amber-400 text-gray-900 font-bold';
                else heatBg = 'bg-rose-400 text-white font-bold';
              }

              return (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`h-14 sm:h-16 rounded-2xl p-2 flex flex-col justify-between transition-all cursor-pointer relative ${heatBg} ${
                    isSelected ? 'ring-4 ring-cyan-500 ring-offset-2 scale-105 z-10 shadow-lg' : 'hover:scale-102'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-xs font-mono font-bold">{day}</span>
                    {isToday && (
                      <span className="w-2 h-2 rounded-full bg-cyan-300 animate-pulse" title="Today" />
                    )}
                  </div>

                  {!isFuture && (
                    <span className="text-[10px] font-mono text-right opacity-90">
                      {pct}%
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Heat Legend */}
          <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>Completion Rate:</span>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 rounded bg-emerald-500" />
                <span>90%+</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 rounded bg-emerald-400" />
                <span>75%+</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 rounded bg-amber-400" />
                <span>50%+</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 rounded bg-gray-200 dark:bg-gray-700" />
                <span>Upcoming</span>
              </div>
            </div>
          </div>

        </div>

        {/* Date Inspector Card */}
        <div className="bg-white dark:bg-gray-900 p-6 sm:p-8 rounded-3xl border border-gray-200/80 dark:border-gray-800 shadow-xl space-y-4">
          <div className="border-b border-gray-100 dark:border-gray-800 pb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Selected Log
            </span>
            <h3 className="text-xl font-extrabold text-gray-900 dark:text-gray-100">
              August {selectedDay}, 2026 {selectedDay === 12 && '(Today)'}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Completion Rate: <strong className="text-emerald-600 dark:text-emerald-400 font-mono">{selectedPct}%</strong>
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Logged Habits
            </h4>

            {habits.slice(0, 5).map((h) => (
              <div key={h.id} className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/60 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span className="text-xs font-bold text-gray-800 dark:text-gray-200 truncate">{h.name}</span>
                </div>
                <span className="text-[10px] text-gray-400">{h.category}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
