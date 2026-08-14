import React, { useState } from 'react';
import { Habit } from '../../types';
import { HabitCard } from '../HabitCard';
import { Plus, CheckCircle2, Search, ArrowUpDown, X, FileText } from 'lucide-react';

interface HabitsViewProps {
  habits: Habit[];
  onToggleComplete: (id: string) => void;
  onEditHabit: (habit: Habit) => void;
  onDeleteHabit: (id: string) => void;
  onOpenAddHabit: () => void;
  onOpenWorkUpdate?: (habitId?: string) => void;
}

export const HabitsView: React.FC<HabitsViewProps> = ({
  habits,
  onToggleComplete,
  onEditHabit,
  onDeleteHabit,
  onOpenAddHabit,
  onOpenWorkUpdate,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'streak' | 'name' | 'status'>('streak');
  const [search, setSearch] = useState<string>('');

  const categories = ['All', 'Health', 'Fitness', 'Productivity', 'Mindfulness', 'Learning', 'Wellness'];

  let processed = habits.filter((h) => {
    if (selectedCategory !== 'All' && h.category !== selectedCategory) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchName = h.name.toLowerCase().includes(q);
      const matchCategory = h.category.toLowerCase().includes(q);
      const matchNotes = h.notes?.toLowerCase().includes(q);
      const matchLog = h.dailyWorkLog?.toLowerCase().includes(q);
      return matchName || matchCategory || matchNotes || matchLog;
    }
    return true;
  });

  // Sort logic
  processed.sort((a, b) => {
    if (sortBy === 'streak') return b.currentStreak - a.currentStreak;
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'status') return (a.completedToday === b.completedToday) ? 0 : a.completedToday ? 1 : -1;
    return 0;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-gray-900 p-6 sm:p-8 rounded-3xl border border-gray-200/80 dark:border-gray-800 shadow-xl">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-gray-100 flex items-center space-x-3">
            <CheckCircle2 className="w-8 h-8 text-emerald-500" />
            <span>Habit Library & Management</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
            Organize, search by name, audit check-in times & update daily logs
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {onOpenWorkUpdate && (
            <button
              onClick={() => onOpenWorkUpdate()}
              className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-teal-50 dark:bg-teal-950/80 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 text-xs font-bold hover:bg-teal-100 transition-all cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>Update Day's Work</span>
            </button>
          )}
          <button
            onClick={onOpenAddHabit}
            className="flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-500/20 transition-all hover:scale-[1.02] cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>+ Create Habit</span>
          </button>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="bg-white dark:bg-gray-900 p-4 sm:p-6 rounded-3xl border border-gray-200/80 dark:border-gray-800 shadow-lg space-y-4">
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Search Bar */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search habit by name or note..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-8 py-2 text-xs bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-2.5 top-2.5 p-0.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Sort By selector */}
          <div className="flex items-center space-x-2 w-full md:w-auto justify-end">
            <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 flex items-center space-x-1">
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span>Sort By:</span>
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs font-bold text-gray-800 dark:text-gray-200 rounded-xl focus:outline-none"
            >
              <option value="streak">Highest Streak</option>
              <option value="name">Alphabetical</option>
              <option value="status">Status (Pending First)</option>
            </select>
          </div>

        </div>

        {/* Categories Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 no-scrollbar pt-2 border-t border-gray-100 dark:border-gray-800">
          <span className="text-xs font-bold text-gray-400 dark:text-gray-500 shrink-0 mr-1">
            Filter:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all shrink-0 cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white font-bold'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

      </div>

      {/* Habit Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {processed.map((h) => (
          <HabitCard
            key={h.id}
            habit={h}
            onToggleComplete={onToggleComplete}
            onEdit={onEditHabit}
            onDelete={onDeleteHabit}
            onOpenWorkUpdate={onOpenWorkUpdate}
            searchHighlight={search}
          />
        ))}
      </div>

    </div>
  );
};
