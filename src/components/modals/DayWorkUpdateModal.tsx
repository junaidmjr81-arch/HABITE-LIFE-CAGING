import React, { useState, useEffect } from 'react';
import { 
  X, 
  Clock, 
  Calendar, 
  Star, 
  CheckCircle2, 
  FileText, 
  Sparkles,
  Save,
  Check,
  History,
  ListFilter
} from 'lucide-react';
import { Habit, DayWorkUpdateEntry } from '../../types';

interface DayWorkUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  habits: Habit[];
  onUpdateHabit: (habit: Habit) => void;
  selectedHabitId?: string | null;
  history?: DayWorkUpdateEntry[];
  onSaveHistoryEntry?: (entry: DayWorkUpdateEntry) => void;
}

export const DayWorkUpdateModal: React.FC<DayWorkUpdateModalProps> = ({
  isOpen,
  onClose,
  habits,
  onUpdateHabit,
  selectedHabitId,
  history = [],
  onSaveHistoryEntry,
}) => {
  const [modalTab, setModalTab] = useState<'update' | 'history'>('update');
  const [targetHabitId, setTargetHabitId] = useState<string>(
    selectedHabitId || (habits.length > 0 ? habits[0].id : '')
  );
  
  const currentHabit = habits.find(h => h.id === targetHabitId) || habits[0];

  const getCurrentTimeString = () => {
    return new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const getTodayDateStr = () => {
    return new Date().toISOString().split('T')[0];
  };

  const [date, setDate] = useState<string>(getTodayDateStr());
  const [completed, setCompleted] = useState<boolean>(true);
  const [checkTime, setCheckTime] = useState<string>(getCurrentTimeString());
  const [workLog, setWorkLog] = useState<string>('');
  const [rating, setRating] = useState<number>(5);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (selectedHabitId) {
      setTargetHabitId(selectedHabitId);
    }
  }, [selectedHabitId]);

  useEffect(() => {
    if (currentHabit) {
      setCompleted(currentHabit.completedToday);
      setCheckTime(currentHabit.completedTime || getCurrentTimeString());
      setWorkLog(currentHabit.dailyWorkLog || '');
      setRating(currentHabit.workRating || 5);
      setSavedSuccess(false);
    }
  }, [targetHabitId, currentHabit?.id]);

  if (!isOpen || !currentHabit) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    const wasCompleted = currentHabit.completedToday;
    let newStreak = currentHabit.currentStreak;
    if (completed && !wasCompleted) {
      newStreak = currentHabit.currentStreak + 1;
    } else if (!completed && wasCompleted) {
      newStreak = Math.max(0, currentHabit.currentStreak - 1);
    }

    const recordedTime = completed ? (checkTime || getCurrentTimeString()) : undefined;

    const updatedHabit: Habit = {
      ...currentHabit,
      completedToday: completed,
      completedTime: recordedTime,
      dailyWorkLog: workLog.trim(),
      workRating: rating,
      currentStreak: newStreak,
      bestStreak: Math.max(currentHabit.bestStreak, newStreak),
    };

    onUpdateHabit(updatedHabit);

    if (onSaveHistoryEntry) {
      const historyEntry: DayWorkUpdateEntry = {
        id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        habitId: currentHabit.id,
        habitName: currentHabit.name,
        category: currentHabit.category,
        color: currentHabit.color,
        date: date,
        completed: completed,
        completedTime: recordedTime || getCurrentTimeString(),
        workLogText: workLog.trim() || `${currentHabit.name} recorded for ${date}`,
        rating: rating,
      };
      onSaveHistoryEntry(historyEntry);
    }

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-scale-in flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gradient-to-r from-teal-500/10 via-emerald-500/5 to-cyan-500/10 dark:from-teal-950/40 dark:to-cyan-950/40 shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-teal-600 text-white shadow-md shadow-teal-500/20">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                One-Day Work Update & Check Time
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Record your daily work updates, exact checking time & history
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher: Update Form vs History Option */}
        <div className="px-6 pt-3 pb-1 border-b border-gray-100 dark:border-gray-800 bg-gray-50/70 dark:bg-gray-800/40 flex items-center space-x-2 shrink-0">
          <button
            type="button"
            onClick={() => setModalTab('update')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              modalTab === 'update'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Update Habit Work & Time</span>
          </button>

          <button
            type="button"
            onClick={() => setModalTab('history')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              modalTab === 'history'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Check-in History ({history.length})</span>
          </button>
        </div>

        {/* Tab 1: Form Body */}
        {modalTab === 'update' ? (
          <form onSubmit={handleSave} className="p-6 space-y-4 overflow-y-auto flex-1">
            
            {/* Select Habit */}
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                Select Habit to Update
              </label>
              <select
                value={targetHabitId}
                onChange={(e) => setTargetHabitId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
              >
                {habits.map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.completedToday ? '✓ ' : '○ '} {h.name} ({h.category})
                  </option>
                ))}
              </select>
            </div>

            {/* Date & Checking Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5 flex items-center space-x-1">
                  <Calendar className="w-3.5 h-3.5 text-teal-500" />
                  <span>Work Date</span>
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5 flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5 text-teal-500" />
                  <span>Check Time</span>
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={checkTime}
                    onChange={(e) => setCheckTime(e.target.value)}
                    placeholder="e.g. 09:30 AM"
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setCheckTime(getCurrentTimeString())}
                    className="px-2.5 py-2 text-[11px] font-bold bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 rounded-xl hover:bg-teal-200 shrink-0 transition-colors cursor-pointer"
                    title="Use current local time"
                  >
                    Now
                  </button>
                </div>
              </div>
            </div>

            {/* Completion Status Toggle */}
            <div className="p-3.5 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-800 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className={`p-2 rounded-xl ${completed ? 'bg-emerald-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-400'}`}>
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900 dark:text-gray-100">
                    {completed ? 'Marked as Completed for Today' : 'Marked as Incomplete / Pending'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {completed ? `Checked at ${checkTime}` : 'Toggle to mark completed'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setCompleted(!completed)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  completed
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                {completed ? 'Completed ✓' : 'Set Done'}
              </button>
            </div>

            {/* One-Day Work Log / Details */}
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                <span>One-Day Work Summary / Notes</span>
                <span className="text-[11px] text-gray-400 font-normal">Details</span>
              </label>
              <textarea
                value={workLog}
                onChange={(e) => setWorkLog(e.target.value)}
                rows={3}
                placeholder="e.g., Completed 45 minutes of HIIT workout, 50 pushups, feeling energized..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            {/* Day Work Rating (1-5 Stars) */}
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                <span className="flex items-center space-x-1">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span>Today's Work Execution Rating</span>
                </span>
                <span className="text-xs font-bold text-amber-500">{rating} / 5 Stars</span>
              </label>
              <div className="flex items-center space-x-2 bg-gray-50 dark:bg-gray-800/60 p-3 rounded-xl border border-gray-200 dark:border-gray-800">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className={`p-1.5 rounded-lg transition-transform hover:scale-110 cursor-pointer ${
                      star <= rating
                        ? 'text-amber-400 fill-amber-400'
                        : 'text-gray-300 dark:text-gray-600'
                    }`}
                    title={`${star} Star Rating`}
                  >
                    <Star className={`w-6 h-6 ${star <= rating ? 'fill-amber-400' : ''}`} />
                  </button>
                ))}
                <span className="text-xs text-gray-500 dark:text-gray-400 ml-2 font-medium">
                  {rating === 5 && '🌟 Outstanding'}
                  {rating === 4 && '✨ Great'}
                  {rating === 3 && '👍 Good'}
                  {rating === 2 && '⚠️ Needs Focus'}
                  {rating === 1 && '🌱 Starting'}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-xs font-bold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white transition-all shadow-md cursor-pointer ${
                  savedSuccess
                    ? 'bg-emerald-500 scale-105'
                    : 'bg-teal-600 hover:bg-teal-700 shadow-teal-500/20'
                }`}
              >
                {savedSuccess ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Work Updated!</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Work Update</span>
                  </>
                )}
              </button>
            </div>

          </form>
        ) : (
          /* Tab 2: History Option View */
          <div className="p-6 overflow-y-auto space-y-3 flex-1">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100 flex items-center space-x-1.5">
                <History className="w-4 h-4 text-teal-500" />
                <span>Recorded Work & Check-in History</span>
              </h4>
              <span className="text-xs text-gray-400">{history.length} records</span>
            </div>

            {history.length > 0 ? (
              history.map((item) => (
                <div 
                  key={item.id}
                  className="p-3.5 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200/70 dark:border-gray-800 text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-900 dark:text-gray-100">{item.habitName}</span>
                    <div className="flex text-amber-400">
                      {Array.from({ length: item.rating }).map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-amber-400" />
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 text-[11px] text-gray-500 dark:text-gray-400">
                    <span>{item.date}</span>
                    <span>•</span>
                    <span className="text-teal-600 dark:text-teal-400 font-semibold">
                      Checked at {item.completedTime}
                    </span>
                  </div>
                  {item.workLogText && (
                    <p className="text-gray-700 dark:text-gray-300 italic pt-1 border-t border-gray-200/40 dark:border-gray-700/40">
                      "{item.workLogText}"
                    </p>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-xs text-gray-400">
                No past logs recorded yet. Complete habits or submit work updates to see history.
              </div>
            )}

            <div className="pt-3 border-t border-gray-100 dark:border-gray-800 flex justify-end">
              <button
                type="button"
                onClick={() => setModalTab('update')}
                className="px-4 py-2 rounded-xl bg-teal-600 text-white text-xs font-bold cursor-pointer"
              >
                Back to Update Form
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
