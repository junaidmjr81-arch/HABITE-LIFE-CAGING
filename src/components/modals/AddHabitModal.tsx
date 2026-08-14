import React, { useState } from 'react';
import { X, Sparkles, Flame, Check } from 'lucide-react';
import { HabitCategory, HabitTimeOfDay } from '../../types';

interface AddHabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddHabit: (habitData: {
    name: string;
    category: HabitCategory;
    timeOfDay: HabitTimeOfDay;
    icon: string;
    color: string;
    notes?: string;
  }) => void;
}

export const AddHabitModal: React.FC<AddHabitModalProps> = ({
  isOpen,
  onClose,
  onAddHabit,
}) => {
  if (!isOpen) return null;

  const [name, setName] = useState('');
  const [category, setCategory] = useState<HabitCategory>('Health');
  const [timeOfDay, setTimeOfDay] = useState<HabitTimeOfDay>('Morning');
  const [icon, setIcon] = useState('Flame');
  const [color, setColor] = useState('emerald');
  const [notes, setNotes] = useState('');

  const categories: HabitCategory[] = ['Health', 'Fitness', 'Productivity', 'Mindfulness', 'Learning', 'Wellness'];
  const times: HabitTimeOfDay[] = ['Morning', 'Afternoon', 'Evening', 'Anytime'];

  const icons = [
    { id: 'Flame', label: 'Flame' },
    { id: 'Dumbbell', label: 'Workout' },
    { id: 'BookOpen', label: 'Reading' },
    { id: 'Droplets', label: 'Water' },
    { id: 'Zap', label: 'Focus' },
    { id: 'PenTool', label: 'Journal' },
    { id: 'Moon', label: 'Sleep' },
    { id: 'Sparkles', label: 'Zen' },
    { id: 'Globe', label: 'Learn' },
    { id: 'Footprints', label: 'Walk' },
    { id: 'Apple', label: 'Diet' },
    { id: 'CalendarCheck', label: 'Plan' },
  ];

  const colors = [
    { id: 'emerald', bg: 'bg-emerald-500' },
    { id: 'orange', bg: 'bg-orange-500' },
    { id: 'indigo', bg: 'bg-indigo-500' },
    { id: 'cyan', bg: 'bg-cyan-500' },
    { id: 'violet', bg: 'bg-violet-500' },
    { id: 'amber', bg: 'bg-amber-500' },
    { id: 'rose', bg: 'bg-rose-500' },
    { id: 'purple', bg: 'bg-purple-500' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAddHabit({
      name,
      category,
      timeOfDay,
      icon,
      color,
      notes,
    });

    // Reset
    setName('');
    setNotes('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white dark:bg-gray-900 rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-gray-200 dark:border-gray-800 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2 mb-2">
          <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Create New Habit
          </h3>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">
          Set up a daily habit with category, icon, and target schedule
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Habit Name */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
              Habit Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g., Read 20 pages, Morning Run, 3L Water"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          {/* Category Select */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
              Category
            </label>
            <div className="grid grid-cols-3 gap-2">
              {categories.map((cat) => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border text-center transition-all cursor-pointer ${
                    category === cat
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                      : 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-gray-300'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Time of Day */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
              Time of Day
            </label>
            <div className="grid grid-cols-4 gap-2">
              {times.map((t) => (
                <button
                  type="button"
                  key={t}
                  onClick={() => setTimeOfDay(t)}
                  className={`py-2 px-2 rounded-xl text-xs font-bold border text-center transition-all cursor-pointer ${
                    timeOfDay === t
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                      : 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Icon Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
              Choose Icon
            </label>
            <div className="grid grid-cols-6 gap-2">
              {icons.map((ic) => (
                <button
                  type="button"
                  key={ic.id}
                  onClick={() => setIcon(ic.id)}
                  className={`p-2.5 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
                    icon === ic.id
                      ? 'bg-emerald-100 dark:bg-emerald-950/80 border-emerald-500 text-emerald-600 dark:text-emerald-400 scale-105'
                      : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400'
                  }`}
                >
                  <span className="text-xs font-bold">{ic.label[0]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Color Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
              Theme Accent Color
            </label>
            <div className="flex items-center space-x-3">
              {colors.map((c) => (
                <button
                  type="button"
                  key={c.id}
                  onClick={() => setColor(c.id)}
                  className={`w-7 h-7 rounded-full ${c.bg} flex items-center justify-center cursor-pointer transition-transform ${
                    color === c.id ? 'ring-2 ring-offset-2 ring-emerald-500 scale-110' : 'opacity-80 hover:opacity-100'
                  }`}
                >
                  {color === c.id && <Check className="w-4 h-4 text-white" />}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
              Notes or Motivation (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Do this right after morning coffee..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          {/* Submit CTA */}
          <div className="pt-2 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 text-xs font-bold hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-500/20 transition-all hover:scale-[1.02] cursor-pointer"
            >
              Save Habit
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
