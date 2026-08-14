import React, { useState } from 'react';
import { Habit, HabitCategory } from '../types';
import { HabitCard } from './HabitCard';
import { 
  CheckCircle2, 
  ListFilter, 
  Plus, 
  Search, 
  X,
  FileText,
  Clock,
  Sparkles
} from 'lucide-react';

interface TodaysHabitsProps {
  habits: Habit[];
  searchQuery: string;
  setSearchQuery?: (q: string) => void;
  onToggleComplete: (id: string) => void;
  onEditHabit: (habit: Habit) => void;
  onDeleteHabit: (id: string) => void;
  onOpenAddHabit: () => void;
  onOpenWorkUpdate?: (habitId?: string) => void;
  tierFilter?: 'high' | 'medium' | 'low' | 'all';
}

export const TodaysHabits: React.FC<TodaysHabitsProps> = ({
  habits,
  searchQuery,
  setSearchQuery,
  onToggleComplete,
  onEditHabit,
  onDeleteHabit,
  onOpenAddHabit,
  onOpenWorkUpdate,
  tierFilter = 'all',
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [localNameSearch, setLocalNameSearch] = useState<string>('');

  const categories = ['All', 'Health', 'Fitness', 'Productivity', 'Mindfulness', 'Learning', 'Wellness'];

  const activeSearch = searchQuery || localNameSearch;

  // Filter pipeline: Search Query -> Category -> Status -> Tier Performance
  const filteredHabits = habits.filter((habit) => {
    // 1. Search filter by Name
    if (activeSearch.trim() !== '') {
      const q = activeSearch.toLowerCase();
      const matchesName = habit.name.toLowerCase().includes(q);
      const matchesCategory = habit.category.toLowerCase().includes(q);
      const matchesNotes = habit.notes?.toLowerCase().includes(q);
      const matchesWorkLog = habit.dailyWorkLog?.toLowerCase().includes(q);
      if (!matchesName && !matchesCategory && !matchesNotes && !matchesWorkLog) return false;
    }

    // 2. Category filter
    if (selectedCategory !== 'All' && habit.category !== selectedCategory) {
      return false;
    }

    // 3. Status filter
    if (statusFilter === 'pending' && habit.completedToday) return false;
    if (statusFilter === 'completed' && !habit.completedToday) return false;

    // 4. Tier filter
    if (tierFilter === 'high' && habit.currentStreak < 10) return false;
    if (tierFilter === 'medium' && (habit.currentStreak < 5 || habit.currentStreak >= 10)) return false;
    if (tierFilter === 'low' && habit.currentStreak >= 5) return false;

    return true;
  });

  const completedInFilter = filteredHabits.filter(h => h.completedToday).length;

  const handleSearchChange = (val: string) => {
    setLocalNameSearch(val);
    if (setSearchQuery) {
      setSearchQuery(val);
    }
  };

  const clearSearch = () => {
    setLocalNameSearch('');
    if (setSearchQuery) {
      setSearchQuery('');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 border border-gray-200/80 dark:border-gray-800 shadow-xl mb-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-6 h-6 text-emerald-500" />
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-gray-100">
              Today's Habits
            </h2>
            <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
              {completedInFilter}/{filteredHabits.length} Done
            </span>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
            Track daily rituals, exact check-in times & one-day work progress
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          
          {/* Status Filter Toggle Pills */}
          <div className="bg-gray-100 dark:bg-gray-800 p-1 rounded-xl flex items-center text-xs font-medium">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                statusFilter === 'all'
                  ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-bold shadow-xs'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter('pending')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                statusFilter === 'pending'
                  ? 'bg-white dark:bg-gray-900 text-amber-600 dark:text-amber-400 font-bold shadow-xs'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setStatusFilter('completed')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                statusFilter === 'completed'
                  ? 'bg-white dark:bg-gray-900 text-emerald-600 dark:text-emerald-400 font-bold shadow-xs'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              Done
            </button>
          </div>

          {/* One-Day Work Update CTA */}
          {onOpenWorkUpdate && (
            <button
              onClick={() => onOpenWorkUpdate()}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-teal-50 dark:bg-teal-950/80 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 text-xs font-bold hover:bg-teal-100 dark:hover:bg-teal-900/80 transition-all cursor-pointer"
            >
              <FileText className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <span>Update Work</span>
            </button>
          )}

          {/* Add Habit Primary CTA */}
          <button
            onClick={onOpenAddHabit}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-500/20 transition-all hover:scale-[1.02] cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Habit</span>
          </button>

        </div>
      </div>

      {/* Prominent Habit Name Search Bar */}
      <div className="relative mb-5">
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 pointer-events-none" />
          <input
            type="text"
            value={activeSearch}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search habits by name (e.g. Meditation, Workout, Reading, Water)..."
            className="w-full pl-10 pr-10 py-2.5 rounded-2xl bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
          />
          {activeSearch && (
            <button
              onClick={clearSearch}
              className="absolute right-3 p-1 rounded-full text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer"
              title="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        {activeSearch && (
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mt-1.5 px-1">
            <span>Found <strong className="text-emerald-600 dark:text-emerald-400">{filteredHabits.length}</strong> matching habits</span>
            <button 
              onClick={clearSearch}
              className="text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              Reset search
            </button>
          </div>
        )}
      </div>

      {/* Category Pills Bar */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-3 mb-6 no-scrollbar border-b border-gray-100 dark:border-gray-800">
        <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider shrink-0 mr-1 flex items-center space-x-1">
          <ListFilter className="w-3.5 h-3.5" />
          <span>Category:</span>
        </span>
        {categories.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-emerald-600 text-white font-bold shadow-sm'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Habit List Grid */}
      {filteredHabits.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredHabits.map((habit) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              onToggleComplete={onToggleComplete}
              onEdit={onEditHabit}
              onDelete={onDeleteHabit}
              onOpenWorkUpdate={onOpenWorkUpdate}
              searchHighlight={activeSearch}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 px-4 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-2xl">
          <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-3">
            <Search className="w-6 h-6" />
          </div>
          <h4 className="text-base font-bold text-gray-900 dark:text-gray-100">
            No habits found
          </h4>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-sm mx-auto">
            {activeSearch 
              ? `No habit name matched "${activeSearch}". Try another keyword.`
              : 'Try adjusting your status filter or category selection.'
            }
          </p>
          <div className="flex items-center justify-center space-x-3 mt-4">
            {activeSearch && (
              <button
                onClick={clearSearch}
                className="px-4 py-2 text-xs font-bold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 transition-colors cursor-pointer"
              >
                Clear Search
              </button>
            )}
            <button
              onClick={onOpenAddHabit}
              className="px-4 py-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/80 rounded-xl hover:bg-emerald-100 transition-colors cursor-pointer"
            >
              + Create New Habit
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
