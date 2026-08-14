import React, { useState } from 'react';
import { Flame, CheckCircle2, Clock, Award, Sparkles, Zap, ChevronRight } from 'lucide-react';
import confetti from 'canvas-confetti';

interface MainProgressCardProps {
  completedCount: number;
  totalCount: number;
  currentStreak: number;
  onCompleteAllRemaining?: () => void;
}

export const MainProgressCard: React.FC<MainProgressCardProps> = ({
  completedCount,
  totalCount,
  currentStreak,
  onCompleteAllRemaining
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const completionPercentage = Math.round((completedCount / (totalCount || 1)) * 100);
  const remainingCount = Math.max(0, totalCount - completedCount);

  // SVG ring math
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (completionPercentage / 100) * circumference;

  const handleConfettiTrigger = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#10b981', '#06b6d4', '#f59e0b', '#ec4899']
    });
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 border border-gray-200/80 dark:border-gray-800 shadow-xl mb-8 relative overflow-hidden">
      
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-teal-500/5 dark:bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
        
        {/* Left Side: Circular Progress SVG */}
        <div 
          className="relative flex flex-col items-center justify-center shrink-0"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="relative w-56 h-56 flex items-center justify-center">
            
            {/* SVG Ring */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
              <defs>
                <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="50%" stopColor="#14b8a6" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="6" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Background Ring Track */}
              <circle
                cx="100"
                cy="100"
                r={radius}
                className="text-gray-100 dark:text-gray-800"
                strokeWidth="16"
                stroke="currentColor"
                fill="transparent"
              />

              {/* Animated Progress Ring */}
              <circle
                cx="100"
                cy="100"
                r={radius}
                stroke="url(#progressGradient)"
                strokeWidth="16"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                filter="url(#glow)"
                className="transition-all duration-1000 ease-out"
              />
            </svg>

            {/* Inner Ring Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
              <div className="flex items-baseline justify-center">
                <span className="text-4xl sm:text-5xl font-black tracking-tight text-gray-900 dark:text-gray-100 font-mono">
                  {completionPercentage}
                </span>
                <span className="text-xl sm:text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
                  %
                </span>
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mt-1">
                Overall Completed
              </span>

              {/* Subtle animated indicator */}
              <button 
                onClick={handleConfettiTrigger}
                className="mt-2 flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold border border-emerald-200 dark:border-emerald-800 hover:scale-105 transition-transform cursor-pointer"
              >
                <Sparkles className="w-3 h-3 text-emerald-500 animate-spin-slow" />
                <span>On Track</span>
              </button>
            </div>

          </div>

          <p className="text-xs text-gray-400 dark:text-gray-500 mt-3 flex items-center space-x-1">
            <span>Tap ring for celebration</span>
            <Sparkles className="w-3 h-3 text-amber-400" />
          </p>
        </div>

        {/* Right Side: Detailed Metrics Grid */}
        <div className="flex-1 w-full space-y-6">
          
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-extrabold text-gray-900 dark:text-gray-100">
                Daily Habit Mastery
              </h3>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950 px-2.5 py-1 rounded-full">
                Target: 100%
              </span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {completedCount} of {totalCount} habits completed today. Maintain your momentum!
            </p>
          </div>

          {/* 4 Stat Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            
            {/* Completed */}
            <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/50">
              <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400 mb-1">
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Completed</span>
              </div>
              <div className="text-2xl font-black text-emerald-900 dark:text-emerald-100 font-mono">
                {completedCount}
              </div>
              <p className="text-[10px] text-emerald-600/80 dark:text-emerald-400/80 mt-0.5">
                {Math.round((completedCount / (totalCount || 1)) * 100)}% done
              </p>
            </div>

            {/* Remaining */}
            <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-100 dark:border-amber-900/50">
              <div className="flex items-center space-x-2 text-amber-600 dark:text-amber-400 mb-1">
                <Clock className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Remaining</span>
              </div>
              <div className="text-2xl font-black text-amber-900 dark:text-amber-100 font-mono">
                {remainingCount}
              </div>
              <p className="text-[10px] text-amber-600/80 dark:text-amber-400/80 mt-0.5">
                To do today
              </p>
            </div>

            {/* Streak */}
            <div className="p-4 rounded-2xl bg-orange-50/70 dark:bg-orange-950/40 border border-orange-100 dark:border-orange-900/50">
              <div className="flex items-center space-x-2 text-orange-600 dark:text-orange-400 mb-1">
                <Flame className="w-4 h-4 fill-orange-500" />
                <span className="text-xs font-bold uppercase tracking-wider">Streak</span>
              </div>
              <div className="text-2xl font-black text-orange-900 dark:text-orange-100 font-mono">
                {currentStreak}
              </div>
              <p className="text-[10px] text-orange-600/80 dark:text-orange-400/80 mt-0.5">
                Consecutive days
              </p>
            </div>

            {/* Total Habits */}
            <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50">
              <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 mb-1">
                <Award className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Total</span>
              </div>
              <div className="text-2xl font-black text-indigo-900 dark:text-indigo-100 font-mono">
                {totalCount}
              </div>
              <p className="text-[10px] text-indigo-600/80 dark:text-indigo-400/80 mt-0.5">
                Active habits
              </p>
            </div>

          </div>

          {/* Quick complete remaining button */}
          {remainingCount > 0 && onCompleteAllRemaining && (
            <div className="pt-2 flex items-center justify-between">
              <span className="text-xs text-gray-500 dark:text-gray-400 italic">
                Finish {remainingCount} more habits to reach 100% completion today!
              </span>
              <button
                onClick={() => {
                  onCompleteAllRemaining();
                  handleConfettiTrigger();
                }}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-md shadow-emerald-500/20 flex items-center space-x-2 hover:scale-[1.02] transition-all cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Complete All Remaining ({remainingCount})</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
