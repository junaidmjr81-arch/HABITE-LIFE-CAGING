import React from 'react';
import { 
  Check, 
  Flame, 
  Edit3, 
  Sparkles, 
  Dumbbell, 
  BookOpen, 
  Droplets, 
  Zap, 
  PenTool, 
  Moon, 
  Globe, 
  Footprints, 
  Apple, 
  CalendarCheck, 
  Bed, 
  Activity, 
  Trash2,
  Clock,
  FileText,
  Star
} from 'lucide-react';
import { Habit } from '../types';

interface HabitCardProps {
  habit: Habit;
  onToggleComplete: (id: string) => void;
  onEdit: (habit: Habit) => void;
  onDelete?: (id: string) => void;
  onOpenWorkUpdate?: (habitId: string) => void;
  searchHighlight?: string;
}

export const HabitCard: React.FC<HabitCardProps> = ({
  habit,
  onToggleComplete,
  onEdit,
  onDelete,
  onOpenWorkUpdate,
  searchHighlight = ''
}) => {
  // Render icon based on habit.icon string or fallback
  const renderIcon = () => {
    const iconProps = { className: "w-5 h-5" };
    switch (habit.icon?.toLowerCase()) {
      case 'dumbbell': return <Dumbbell {...iconProps} />;
      case 'bookopen': case 'book': return <BookOpen {...iconProps} />;
      case 'droplets': case 'water': return <Droplets {...iconProps} />;
      case 'zap': case 'code': return <Zap {...iconProps} />;
      case 'pentool': case 'journal': return <PenTool {...iconProps} />;
      case 'moon': return <Moon {...iconProps} />;
      case 'globe': return <Globe {...iconProps} />;
      case 'footprints': case 'walk': return <Footprints {...iconProps} />;
      case 'apple': case 'food': return <Apple {...iconProps} />;
      case 'calendarcheck': case 'calendar': return <CalendarCheck {...iconProps} />;
      case 'bed': case 'sleep': return <Bed {...iconProps} />;
      case 'activity': case 'posture': return <Activity {...iconProps} />;
      case 'sparkles': case 'meditation': return <Sparkles {...iconProps} />;
      default: return <Flame {...iconProps} />;
    }
  };

  // Color mappings for category/habit themes
  const colorStyles: Record<string, { bg: string; text: string; border: string; ring: string }> = {
    emerald: { bg: 'bg-emerald-50 dark:bg-emerald-950/60', text: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-200 dark:border-emerald-800', ring: 'ring-emerald-500' },
    orange: { bg: 'bg-orange-50 dark:bg-orange-950/60', text: 'text-orange-600 dark:text-orange-400', border: 'border-orange-200 dark:border-orange-800', ring: 'ring-orange-500' },
    indigo: { bg: 'bg-indigo-50 dark:bg-indigo-950/60', text: 'text-indigo-600 dark:text-indigo-400', border: 'border-indigo-200 dark:border-indigo-800', ring: 'ring-indigo-500' },
    cyan: { bg: 'bg-cyan-50 dark:bg-cyan-950/60', text: 'text-cyan-600 dark:text-cyan-400', border: 'border-cyan-200 dark:border-cyan-800', ring: 'ring-cyan-500' },
    violet: { bg: 'bg-violet-50 dark:bg-violet-950/60', text: 'text-violet-600 dark:text-violet-400', border: 'border-violet-200 dark:border-violet-800', ring: 'ring-violet-500' },
    amber: { bg: 'bg-amber-50 dark:bg-amber-950/60', text: 'text-amber-600 dark:text-amber-400', border: 'border-amber-200 dark:border-amber-800', ring: 'ring-amber-500' },
    purple: { bg: 'bg-purple-50 dark:bg-purple-950/60', text: 'text-purple-600 dark:text-purple-400', border: 'border-purple-200 dark:border-purple-800', ring: 'ring-purple-500' },
    blue: { bg: 'bg-blue-50 dark:bg-blue-950/60', text: 'text-blue-600 dark:text-blue-400', border: 'border-blue-200 dark:border-blue-800', ring: 'ring-blue-500' },
    teal: { bg: 'bg-teal-50 dark:bg-teal-950/60', text: 'text-teal-600 dark:text-teal-400', border: 'border-teal-200 dark:border-teal-800', ring: 'ring-teal-500' },
    sky: { bg: 'bg-sky-50 dark:bg-sky-950/60', text: 'text-sky-600 dark:text-sky-400', border: 'border-sky-200 dark:border-sky-800', ring: 'ring-sky-500' },
    rose: { bg: 'bg-rose-50 dark:bg-rose-950/60', text: 'text-rose-600 dark:text-rose-400', border: 'border-rose-200 dark:border-rose-800', ring: 'ring-rose-500' },
    pink: { bg: 'bg-pink-50 dark:bg-pink-950/60', text: 'text-pink-600 dark:text-pink-400', border: 'border-pink-200 dark:border-pink-800', ring: 'ring-pink-500' },
  };

  const style = colorStyles[habit.color] || colorStyles.emerald;
  const progressPct = habit.completedToday ? 100 : 0;

  // Text highlighting for search matches
  const renderHighlightedName = (name: string, query: string) => {
    if (!query.trim()) return name;
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = name.split(regex);
    return parts.map((part, i) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <mark key={i} className="bg-amber-300 text-gray-950 rounded-xs px-0.5 font-extrabold">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <div 
      className={`group relative p-4 sm:p-5 rounded-2xl border transition-all duration-200 ${
        habit.completedToday
          ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-300/80 dark:border-emerald-800/80 shadow-xs'
          : 'bg-white dark:bg-gray-900 border-gray-200/80 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 hover:shadow-md'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        
        {/* Left Side: Checkbox + Icon + Info */}
        <div className="flex items-start space-x-3.5 flex-1 min-w-0">
          
          {/* Interactive Checkbox */}
          <button
            onClick={() => onToggleComplete(habit.id)}
            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center shrink-0 transition-all duration-200 mt-0.5 cursor-pointer ${
              habit.completedToday
                ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30 scale-105'
                : 'border-2 border-gray-300 dark:border-gray-700 hover:border-emerald-500 dark:hover:border-emerald-500 text-transparent hover:text-emerald-500/30'
            }`}
            title={habit.completedToday ? "Mark as incomplete" : "Mark as complete"}
          >
            <Check className={`w-5 h-5 stroke-[3] transition-transform ${habit.completedToday ? 'scale-100' : 'scale-75'}`} />
          </button>

          {/* Habit Icon Box */}
          <div className={`p-2.5 rounded-xl shrink-0 ${style.bg} ${style.text} mt-0.5`}>
            {renderIcon()}
          </div>

          {/* Habit Details */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center space-x-2">
              <h4 className={`text-sm sm:text-base font-bold truncate transition-colors ${
                habit.completedToday 
                  ? 'text-gray-800 dark:text-gray-200 line-through opacity-85' 
                  : 'text-gray-900 dark:text-gray-100'
              }`}>
                {renderHighlightedName(habit.name, searchHighlight)}
              </h4>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
              {/* Category tag */}
              <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md uppercase tracking-wider ${style.bg} ${style.text}`}>
                {habit.category}
              </span>

              {/* Time of day */}
              <span className="text-[10px] text-gray-400 dark:text-gray-500 font-medium">
                • {habit.timeOfDay}
              </span>

              {/* Streak Badge */}
              <span className="flex items-center space-x-1 text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/80 px-2 py-0.5 rounded-md">
                <Flame className="w-3 h-3 fill-amber-500 text-amber-500" />
                <span>{habit.currentStreak}d</span>
              </span>

              {/* Checking Time Badge */}
              {habit.completedToday && habit.completedTime && (
                <span className="flex items-center space-x-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100/90 dark:bg-emerald-950/90 border border-emerald-300/40 dark:border-emerald-700/40 px-2 py-0.5 rounded-md">
                  <Clock className="w-2.5 h-2.5" />
                  <span>{habit.completedTime}</span>
                </span>
              )}

              {/* Work rating badge */}
              {habit.workRating && (
                <span className="flex items-center space-x-0.5 text-[10px] font-bold text-amber-600 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-1.5 py-0.5 rounded-md">
                  <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                  <span>{habit.workRating}/5</span>
                </span>
              )}
            </div>

            {/* Daily Work Log snippet if present */}
            {habit.dailyWorkLog && (
              <div className="mt-2 text-xs text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/60 p-2 rounded-xl border border-gray-100 dark:border-gray-800 flex items-start space-x-1.5">
                <FileText className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <p className="line-clamp-2 italic text-[11px] leading-relaxed">
                  "{habit.dailyWorkLog}"
                </p>
              </div>
            )}

          </div>

        </div>

        {/* Right Side: Progress % & Quick Actions */}
        <div className="flex items-center space-x-1.5 shrink-0">
          
          {/* One-Day Work Update button */}
          {onOpenWorkUpdate && (
            <button
              onClick={() => onOpenWorkUpdate(habit.id)}
              className="p-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/80 hover:bg-emerald-100 dark:hover:bg-emerald-900/80 rounded-lg transition-colors flex items-center space-x-1 cursor-pointer"
              title="Update one-day work notes, time & rating"
            >
              <FileText className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-[11px]">Log Work</span>
            </button>
          )}

          {/* Edit Button */}
          <button
            onClick={() => onEdit(habit)}
            className="p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors cursor-pointer"
            title="Edit habit configuration"
          >
            <Edit3 className="w-4 h-4" />
          </button>

          {/* Delete Option */}
          {onDelete && (
            <button
              onClick={() => onDelete(habit.id)}
              className="p-1.5 text-gray-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950 rounded-lg transition-colors cursor-pointer"
              title="Delete habit"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}

        </div>

      </div>

      {/* Progress Bar under card */}
      <div className="w-full bg-gray-100 dark:bg-gray-800 h-1 rounded-full mt-3 overflow-hidden">
        <div 
          className={`h-full rounded-full transition-all duration-500 ${
            habit.completedToday ? 'bg-emerald-500' : 'bg-transparent'
          }`}
          style={{ width: `${progressPct}%` }}
        />
      </div>

    </div>
  );
};
