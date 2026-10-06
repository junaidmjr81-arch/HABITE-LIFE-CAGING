import React from 'react';
import { Plus, CheckCircle2, BarChart3, Calendar, Zap, FileText, Users, Briefcase, Share2 } from 'lucide-react';
import { NavigationTab } from '../types';

interface QuickActionsProps {
  onOpenAddHabit: () => void;
  onOpenQuickComplete?: () => void;
  onOpenWorkUpdate?: () => void;
  onOpenProfileManager?: () => void;
  onOpenShare?: () => void;
  setActiveTab: (tab: NavigationTab) => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  onOpenAddHabit,
  onOpenQuickComplete,
  onOpenWorkUpdate,
  onOpenProfileManager,
  onOpenShare,
  setActiveTab,
}) => {
  const actions = [
    {
      id: 'share-work',
      title: 'Share Work Progress',
      description: 'Share today’s accomplishments to WhatsApp, Instagram, Email, X & more',
      icon: <Share2 className="w-5 h-5" />,
      color: 'from-emerald-500 to-teal-600',
      textColor: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950/80',
      borderColor: 'hover:border-emerald-500',
      onClick: onOpenShare || onOpenWorkUpdate || onOpenAddHabit,
      badge: 'WhatsApp • IG'
    },
    {
      id: 'work-up-page',
      title: 'WORK UP Hub',
      description: 'Day work option adding: work/project name, place, date & time, materials, neighbors & history',
      icon: <Briefcase className="w-5 h-5" />,
      color: 'from-emerald-500 to-teal-600',
      textColor: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950/80',
      borderColor: 'hover:border-emerald-500',
      onClick: () => setActiveTab('day-work'),
      badge: 'WORK UP'
    },
    {
      id: 'select-profile',
      title: 'Option to select a profile',
      description: 'Profile selection option to switch member accounts or add profiles',
      icon: <Users className="w-5 h-5" />,
      color: 'from-blue-500 to-indigo-600',
      textColor: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-950/80',
      borderColor: 'hover:border-blue-500',
      onClick: onOpenProfileManager || (() => setActiveTab('settings')),
      badge: 'Switch'
    },
    {
      id: 'work-update',
      title: 'One-Day Work Update',
      description: 'Record checking time, log daily work notes & rate execution',
      icon: <FileText className="w-5 h-5" />,
      color: 'from-teal-500 to-emerald-600',
      textColor: 'text-teal-600 dark:text-teal-400',
      bgColor: 'bg-teal-50 dark:bg-teal-950/80',
      borderColor: 'hover:border-teal-500',
      onClick: onOpenWorkUpdate || onOpenAddHabit,
    },
    {
      id: 'add-habit',
      title: 'Add Habit',
      description: 'Create a new custom daily routine or goal',
      icon: <Plus className="w-5 h-5" />,
      color: 'from-emerald-500 to-teal-600',
      textColor: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950/80',
      borderColor: 'hover:border-emerald-500',
      onClick: onOpenAddHabit,
    },
    {
      id: 'complete-habit',
      title: 'Quick Check All',
      description: 'Quick-check off pending habits for today',
      icon: <CheckCircle2 className="w-5 h-5" />,
      color: 'from-amber-500 to-orange-600',
      textColor: 'text-amber-600 dark:text-amber-400',
      bgColor: 'bg-amber-50 dark:bg-amber-950/80',
      borderColor: 'hover:border-amber-500',
      onClick: onOpenQuickComplete || onOpenAddHabit,
    },
    {
      id: 'open-calendar',
      title: 'Open Calendar',
      description: 'View full monthly consistency heatmap calendar',
      icon: <Calendar className="w-5 h-5" />,
      color: 'from-cyan-500 to-blue-600',
      textColor: 'text-cyan-600 dark:text-cyan-400',
      bgColor: 'bg-cyan-50 dark:bg-cyan-950/80',
      borderColor: 'hover:border-cyan-500',
      onClick: () => setActiveTab('calendar'),
    },
  ];

  return (
    <div className="mb-8">
      <div className="flex items-center space-x-2 mb-4">
        <Zap className="w-5 h-5 text-emerald-500" />
        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
          Quick Actions
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {actions.map((act) => (
          <button
            key={act.id}
            onClick={act.onClick}
            className={`group p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 ${act.borderColor} hover:shadow-lg transition-all duration-200 text-left flex flex-col justify-between cursor-pointer`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`p-3 rounded-xl ${act.bgColor} ${act.textColor} group-hover:scale-110 transition-transform`}>
                {act.icon}
              </div>
              {act.badge ? (
                <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                  {act.badge}
                </span>
              ) : (
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  Action
                </span>
              )}
            </div>

            <div>
              <h4 className="text-base font-bold text-gray-900 dark:text-gray-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                {act.title}
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                {act.description}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
