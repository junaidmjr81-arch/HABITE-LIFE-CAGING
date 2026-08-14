import React, { useState } from 'react';
import { 
  History, 
  Clock, 
  Calendar, 
  Star, 
  Search, 
  Filter, 
  FileText, 
  Sparkles, 
  CheckCircle2, 
  Trash2, 
  ChevronRight,
  Plus
} from 'lucide-react';
import { DayWorkUpdateEntry } from '../types';

interface WorkHistorySectionProps {
  history: DayWorkUpdateEntry[];
  onOpenWorkUpdate: (habitId?: string) => void;
  onDeleteHistoryItem?: (id: string) => void;
}

export const WorkHistorySection: React.FC<WorkHistorySectionProps> = ({
  history,
  onOpenWorkUpdate,
  onDeleteHistoryItem,
}) => {
  const [search, setSearch] = useState('');
  const [selectedRatingFilter, setSelectedRatingFilter] = useState<number | 'all'>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');

  // Filter history
  const filteredHistory = history.filter((item) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchName = item.habitName.toLowerCase().includes(q);
      const matchLog = item.workLogText.toLowerCase().includes(q);
      const matchTime = item.completedTime.toLowerCase().includes(q);
      if (!matchName && !matchLog && !matchTime) return false;
    }
    if (selectedRatingFilter !== 'all' && item.rating !== selectedRatingFilter) {
      return false;
    }
    if (dateFilter !== 'all') {
      if (dateFilter === 'today') {
        const todayStr = new Date().toISOString().split('T')[0];
        if (item.date !== todayStr) return false;
      }
    }
    return true;
  });

  const averageRating = history.length > 0
    ? (history.reduce((acc, curr) => acc + curr.rating, 0) / history.length).toFixed(1)
    : '5.0';

  const todayDateStr = new Date().toISOString().split('T')[0];
  const todayUpdatesCount = history.filter(h => h.date === todayDateStr).length;

  return (
    <div id="work-history-section" className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 border border-gray-200/80 dark:border-gray-800 shadow-xl mb-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400">
              <History className="w-5 h-5" />
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-gray-100">
              One-Day Work Update & Check-in Time History
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
            Browse previous day updates, exact checking timestamps, execution notes & ratings
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={() => onOpenWorkUpdate()}
            className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white text-xs font-bold shadow-md shadow-teal-500/20 transition-all hover:scale-[1.02] cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Log New Work</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
        <div className="bg-gray-50 dark:bg-gray-800/60 p-3.5 rounded-2xl border border-gray-200/60 dark:border-gray-800">
          <span className="text-[11px] font-medium text-gray-500 dark:text-gray-400 block">
            Total Logged Entries
          </span>
          <span className="text-xl font-extrabold text-gray-900 dark:text-gray-100 font-mono">
            {history.length}
          </span>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800/60 p-3.5 rounded-2xl border border-gray-200/60 dark:border-gray-800">
          <span className="text-[11px] font-medium text-gray-500 dark:text-gray-400 block">
            Today's Logged Updates
          </span>
          <span className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
            {todayUpdatesCount} Done
          </span>
        </div>

        <div className="col-span-2 sm:col-span-1 bg-gray-50 dark:bg-gray-800/60 p-3.5 rounded-2xl border border-gray-200/60 dark:border-gray-800">
          <span className="text-[11px] font-medium text-gray-500 dark:text-gray-400 block">
            Average Quality Rating
          </span>
          <div className="flex items-center space-x-1.5 mt-0.5">
            <span className="text-xl font-extrabold text-amber-500 font-mono">
              {averageRating}
            </span>
            <div className="flex text-amber-400">
              <Star className="w-4 h-4 fill-amber-400" />
            </div>
            <span className="text-xs text-gray-400">/ 5.0</span>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-5">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search work logs, habits or times..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-2 w-full sm:w-auto justify-end overflow-x-auto pb-1">
          <button
            onClick={() => setSelectedRatingFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              selectedRatingFilter === 'all'
                ? 'bg-teal-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200'
            }`}
          >
            All Ratings
          </button>
          <button
            onClick={() => setSelectedRatingFilter(5)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1 transition-all cursor-pointer ${
              selectedRatingFilter === 5
                ? 'bg-amber-500 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200'
            }`}
          >
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span>5 Stars</span>
          </button>
          <button
            onClick={() => setSelectedRatingFilter(4)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1 transition-all cursor-pointer ${
              selectedRatingFilter === 4
                ? 'bg-amber-500 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200'
            }`}
          >
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span>4 Stars</span>
          </button>
        </div>
      </div>

      {/* History Items List */}
      {filteredHistory.length > 0 ? (
        <div className="space-y-3">
          {filteredHistory.map((entry) => (
            <div
              key={entry.id}
              className="group p-4 rounded-2xl bg-gray-50/80 dark:bg-gray-800/50 hover:bg-gray-100/80 dark:hover:bg-gray-800 border border-gray-200/70 dark:border-gray-800 transition-all duration-200"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                
                {/* Left: Checkmark + Habit Name + Date */}
                <div className="flex items-start space-x-3 min-w-0">
                  <div className="p-2 rounded-xl bg-emerald-500 text-white shadow-sm mt-0.5 shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100">
                        {entry.habitName}
                      </h4>
                      {entry.category && (
                        <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 uppercase">
                          {entry.category}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-gray-500 dark:text-gray-400">
                      <span className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3 text-teal-500" />
                        <span>{entry.date}</span>
                      </span>

                      <span>•</span>

                      {/* Checking Time badge */}
                      <span className="flex items-center space-x-1 font-bold text-teal-700 dark:text-teal-300 bg-teal-100/80 dark:bg-teal-950/80 px-2 py-0.5 rounded-md border border-teal-300/30">
                        <Clock className="w-3 h-3 text-teal-600 dark:text-teal-400" />
                        <span>Checked at: {entry.completedTime}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Star Rating & Actions */}
                <div className="flex items-center justify-between sm:justify-end space-x-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-200/50 dark:border-gray-700/50">
                  <div className="flex items-center space-x-1 bg-amber-50 dark:bg-amber-950/50 px-2.5 py-1 rounded-xl border border-amber-200/40 dark:border-amber-800/40">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < entry.rating
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-gray-300 dark:text-gray-600'
                        }`}
                      />
                    ))}
                    <span className="text-xs font-bold text-amber-600 dark:text-amber-300 ml-1">
                      {entry.rating}/5
                    </span>
                  </div>

                  {onDeleteHistoryItem && (
                    <button
                      onClick={() => onDeleteHistoryItem(entry.id)}
                      className="p-1.5 text-gray-400 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950 rounded-lg transition-colors cursor-pointer"
                      title="Delete log record"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

              </div>

              {/* Work log note text */}
              {entry.workLogText && (
                <div className="mt-2.5 text-xs text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900/80 p-3 rounded-xl border border-gray-200/60 dark:border-gray-700/60 flex items-start space-x-2">
                  <FileText className="w-3.5 h-3.5 text-teal-500 shrink-0 mt-0.5" />
                  <p className="leading-relaxed italic">
                    "{entry.workLogText}"
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 px-4 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-2xl">
          <History className="w-8 h-8 text-gray-400 mx-auto mb-2 opacity-60" />
          <p className="text-xs text-gray-500 dark:text-gray-400">
            No work update records matched your filter.
          </p>
        </div>
      )}

    </div>
  );
};
