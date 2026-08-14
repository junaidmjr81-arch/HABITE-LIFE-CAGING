import React, { useState, useEffect } from 'react';
import { X, Edit3, Trash2 } from 'lucide-react';
import { Habit, HabitCategory, HabitTimeOfDay } from '../../types';

interface EditHabitModalProps {
  habit: Habit | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateHabit: (updated: Habit) => void;
  onDeleteHabit: (id: string) => void;
}

export const EditHabitModal: React.FC<EditHabitModalProps> = ({
  habit,
  isOpen,
  onClose,
  onUpdateHabit,
  onDeleteHabit,
}) => {
  if (!isOpen || !habit) return null;

  const [name, setName] = useState(habit.name);
  const [category, setCategory] = useState<HabitCategory>(habit.category);
  const [timeOfDay, setTimeOfDay] = useState<HabitTimeOfDay>(habit.timeOfDay);
  const [notes, setNotes] = useState(habit.notes || '');

  useEffect(() => {
    if (habit) {
      setName(habit.name);
      setCategory(habit.category);
      setTimeOfDay(habit.timeOfDay);
      setNotes(habit.notes || '');
    }
  }, [habit]);

  const categories: HabitCategory[] = ['Health', 'Fitness', 'Productivity', 'Mindfulness', 'Learning', 'Wellness'];
  const times: HabitTimeOfDay[] = ['Morning', 'Afternoon', 'Evening', 'Anytime'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onUpdateHabit({
      ...habit,
      name,
      category,
      timeOfDay,
      notes,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white dark:bg-gray-900 rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-gray-200 dark:border-gray-800 shadow-2xl relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2 mb-2">
          <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
            <Edit3 className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Edit Habit
          </h3>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">
          Update habit details or delete from your routine
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Habit Name */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
              Habit Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
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
                      ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                      : 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700'
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
                      ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                      : 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
              Notes
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-between border-t border-gray-100 dark:border-gray-800">
            <button
              type="button"
              onClick={() => {
                onDeleteHabit(habit.id);
                onClose();
              }}
              className="px-4 py-2.5 rounded-xl bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 hover:bg-rose-100 text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete Habit</span>
            </button>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 text-xs font-bold hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-md shadow-amber-500/20 transition-all hover:scale-[1.02] cursor-pointer"
              >
                Update Changes
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
