import React from 'react';
import { Calendar, ArrowUpRight, Award, CheckCircle, Flame, ShieldAlert } from 'lucide-react';
import { MonthlyPerformanceData } from '../types';

interface MonthlyPerformanceProps {
  monthlyData: MonthlyPerformanceData;
}

export const MonthlyPerformance: React.FC<MonthlyPerformanceProps> = ({ monthlyData }) => {
  const {
    currentMonthName,
    currentMonthPercentage,
    previousMonthPercentage,
    improvementPercentage,
    totalCompletionsThisMonth,
    activeDaysCount,
  } = monthlyData;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 border border-gray-200/80 dark:border-gray-800 shadow-xl mb-8">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center space-x-2">
            <Calendar className="w-6 h-6 text-emerald-500" />
            <h3 className="text-xl font-extrabold text-gray-900 dark:text-gray-100">
              Monthly Performance
            </h3>
            <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
              {currentMonthName}
            </span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Overall month-over-month habit consistency and velocity growth
          </p>
        </div>

        {/* Improvement Badge */}
        <div className="flex items-center space-x-2 px-3.5 py-2 rounded-2xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 font-bold text-sm shrink-0">
          <ArrowUpRight className="w-5 h-5 text-emerald-500" />
          <span>+{improvementPercentage}% Improvement vs Last Month</span>
        </div>
      </div>

      {/* Main Monthly Metrics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
        
        {/* Left: Highlight Completion Rate Ring/Pill */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-600 via-teal-700 to-cyan-800 text-white shadow-lg relative overflow-hidden">
          <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />

          <div className="text-xs font-bold uppercase tracking-wider text-emerald-100 mb-2">
            Current Month Completion
          </div>

          <div className="flex items-baseline space-x-2">
            <span className="text-5xl font-black font-mono tracking-tight">
              {currentMonthPercentage}%
            </span>
            <span className="text-sm font-semibold text-emerald-200">
              Avg Completion
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-white/20 h-2.5 rounded-full mt-4 overflow-hidden">
            <div 
              className="bg-amber-300 h-full rounded-full transition-all duration-700" 
              style={{ width: `${currentMonthPercentage}%` }} 
            />
          </div>

          <div className="flex justify-between items-center text-xs text-emerald-100 mt-3 pt-2 border-t border-white/15">
            <span>Previous Month: <strong>{previousMonthPercentage}%</strong></span>
            <span className="text-amber-300 font-bold">+{improvementPercentage}% Growth</span>
          </div>
        </div>

        {/* Center & Right: Breakdown Stat Cards */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          {/* Card 1: Total Completions */}
          <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800">
            <div className="p-2 w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 mb-2">
              <CheckCircle className="w-4 h-4" />
            </div>
            <div className="text-2xl font-black text-gray-900 dark:text-gray-100 font-mono">
              {totalCompletionsThisMonth}
            </div>
            <div className="text-xs font-bold text-gray-800 dark:text-gray-200 mt-0.5">
              Habits Logged
            </div>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">
              Completed in {currentMonthName}
            </p>
          </div>

          {/* Card 2: Active Days */}
          <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800">
            <div className="p-2 w-8 h-8 rounded-xl bg-orange-100 dark:bg-orange-950 text-orange-600 dark:text-orange-400 mb-2">
              <Flame className="w-4 h-4 fill-orange-500" />
            </div>
            <div className="text-2xl font-black text-gray-900 dark:text-gray-100 font-mono">
              {activeDaysCount} Days
            </div>
            <div className="text-xs font-bold text-gray-800 dark:text-gray-200 mt-0.5">
              Perfect Activity Days
            </div>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">
              100% active log rate
            </p>
          </div>

          {/* Card 3: Highest Consistency Category */}
          <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800">
            <div className="p-2 w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 mb-2">
              <Award className="w-4 h-4" />
            </div>
            <div className="text-2xl font-black text-gray-900 dark:text-gray-100 font-mono">
              92%
            </div>
            <div className="text-xs font-bold text-gray-800 dark:text-gray-200 mt-0.5">
              Mindfulness & Fitness
            </div>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">
              Top performing category
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
