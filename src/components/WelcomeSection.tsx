import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Quote, 
  RefreshCw, 
  Sparkles, 
  Flame, 
  Trophy, 
  Star, 
  Sun, 
  Sunset, 
  Moon, 
  Edit3,
  CheckCircle2
} from 'lucide-react';
import businessmanImg from '../assets/images/businessman_journal_1786685883646.jpg';

interface WelcomeSectionProps {
  completedCount: number;
  totalCount: number;
  currentStreak: number;
  userName?: string;
  onOpenWorkUpdate?: () => void;
  onOpenProfileManager?: () => void;
}

const MOTIVATIONAL_QUOTES = [
  "We are what we repeatedly do. Excellence, then, is not an act, but a habit. — Aristotle",
  "Small daily improvements over time lead to stunning results. — Robin Sharma",
  "Motivation is what gets you started. Habit is what keeps you going. — Jim Ryun",
  "You do not rise to the level of your goals. You fall to the level of your systems. — James Clear",
  "Energy flows where attention goes. Focus on your daily rituals today.",
  "Success is the sum of small efforts, repeated day in and day out. — Robert Collier"
];

export const WelcomeSection: React.FC<WelcomeSectionProps> = ({
  completedCount,
  totalCount,
  currentStreak,
  userName = "Alex",
  onOpenWorkUpdate,
  onOpenProfileManager,
}) => {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [timeMode, setTimeMode] = useState<'morning' | 'afternoon' | 'evening'>('morning');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      setTimeMode('morning');
    } else if (hour < 18) {
      setTimeMode('afternoon');
    } else {
      setTimeMode('evening');
    }
  }, []);

  const todayDateString = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  const nextQuote = () => {
    setQuoteIndex((prev) => (prev + 1) % MOTIVATIONAL_QUOTES.length);
  };

  const getGreetingData = () => {
    switch (timeMode) {
      case 'morning':
        return {
          title: 'Good Morning',
          icon: <Sun className="w-6 h-6 text-amber-300 animate-pulse" />,
          subtitle: 'Start your day with energized habits & clear focus.',
          badge: 'Morning Session',
          badgeColor: 'bg-amber-400/20 text-amber-200 border-amber-400/30'
        };
      case 'afternoon':
        return {
          title: 'Good Afternoon',
          icon: <Sunset className="w-6 h-6 text-orange-300" />,
          subtitle: 'Keep your momentum high and finish today strong.',
          badge: 'Afternoon Flow',
          badgeColor: 'bg-orange-400/20 text-orange-200 border-orange-400/30'
        };
      case 'evening':
      default:
        return {
          title: 'Good Evening',
          icon: <Moon className="w-6 h-6 text-indigo-300" />,
          subtitle: 'Reflect on today’s wins, log your work & prepare for rest.',
          badge: 'Evening Wind-down',
          badgeColor: 'bg-indigo-400/20 text-indigo-200 border-indigo-400/30'
        };
    }
  };

  const currentGreeting = getGreetingData();

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-emerald-700 via-teal-800 to-cyan-900 dark:from-emerald-950 dark:via-gray-900 dark:to-teal-950 rounded-3xl text-white p-6 sm:p-8 shadow-xl mb-8 border border-emerald-600/30">
      
      {/* Decorative ambient blurred blobs */}
      <div className="absolute -top-12 -right-12 w-72 h-72 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-72 h-72 bg-cyan-400/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        
        {/* Left Welcome Copy (Col 1-7) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Top badges bar */}
          <div className="flex flex-wrap items-center gap-2">
            
            {/* Date Pill */}
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-medium text-emerald-100">
              <Calendar className="w-3.5 h-3.5 text-emerald-300" />
              <span>{todayDateString}</span>
            </div>

            {/* Profile Selection Option Pill */}
            {onOpenProfileManager && (
              <button
                type="button"
                onClick={onOpenProfileManager}
                className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/25 text-xs font-bold text-white transition-all cursor-pointer hover:scale-105 shadow-xs"
                title="Option to select a profile (Click to switch or manage profiles)"
              >
                <span>👤 Option to select a profile: <span className="text-emerald-200 underline underline-offset-2">{userName}</span></span>
                <span className="text-[10px] bg-emerald-400 text-emerald-950 px-2 py-0.5 rounded-full font-black uppercase">Switch</span>
              </button>
            )}

            {/* Streak Pill */}
            <div className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-amber-500/20 backdrop-blur-md border border-amber-400/30 text-xs font-bold text-amber-300">
              <Flame className="w-3.5 h-3.5 fill-amber-300" />
              <span>{currentStreak} Day Streak</span>
            </div>

            {/* Greeting Time Selector Tabs (Good Morning / Good Afternoon toggle) */}
            <div className="inline-flex items-center p-0.5 rounded-full bg-black/20 backdrop-blur-md border border-white/10 text-[11px]">
              <button
                type="button"
                onClick={() => setTimeMode('morning')}
                className={`px-2.5 py-0.5 rounded-full transition-all cursor-pointer ${
                  timeMode === 'morning'
                    ? 'bg-amber-400 text-gray-900 font-bold shadow-xs'
                    : 'text-emerald-100/70 hover:text-white'
                }`}
              >
                ☀️ Morning
              </button>
              <button
                type="button"
                onClick={() => setTimeMode('afternoon')}
                className={`px-2.5 py-0.5 rounded-full transition-all cursor-pointer ${
                  timeMode === 'afternoon'
                    ? 'bg-orange-400 text-gray-900 font-bold shadow-xs'
                    : 'text-emerald-100/70 hover:text-white'
                }`}
              >
                🌤️ Afternoon
              </button>
              <button
                type="button"
                onClick={() => setTimeMode('evening')}
                className={`px-2.5 py-0.5 rounded-full transition-all cursor-pointer ${
                  timeMode === 'evening'
                    ? 'bg-indigo-400 text-gray-900 font-bold shadow-xs'
                    : 'text-emerald-100/70 hover:text-white'
                }`}
              >
                🌙 Evening
              </button>
            </div>

          </div>

          {/* Main Greeting Heading */}
          <div>
            <div className="flex items-center space-x-3">
              <span className="p-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
                {currentGreeting.icon}
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                {currentGreeting.title}, {userName}! 👋
              </h1>
            </div>
            <p className="text-emerald-100/90 text-sm sm:text-base font-medium mt-2">
              {currentGreeting.subtitle}
            </p>
          </div>

          {/* One-Day Work Update CTA Button */}
          {onOpenWorkUpdate && (
            <div className="pt-1 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={onOpenWorkUpdate}
                className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-white text-emerald-900 hover:bg-emerald-50 text-xs font-extrabold shadow-lg shadow-black/10 transition-all hover:scale-105 cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5 text-emerald-700" />
                <span>One-Day Work Update & Time Log</span>
              </button>
              
              <span className="text-xs text-emerald-200/80 font-medium">
                {completedCount}/{totalCount} habits completed today
              </span>
            </div>
          )}

          {/* Motivational Quote Box */}
          <div className="pt-3 border-t border-white/10 flex items-start space-x-3 text-emerald-100/80 text-xs sm:text-sm">
            <Quote className="w-4 h-4 text-emerald-300 shrink-0 mt-0.5 opacity-80" />
            <p className="italic font-light leading-relaxed flex-1">
              "{MOTIVATIONAL_QUOTES[quoteIndex]}"
            </p>
            <button
              onClick={nextQuote}
              className="p-1 rounded-full hover:bg-white/10 transition-colors shrink-0 text-emerald-200 hover:text-white cursor-pointer"
              title="Next motivational message"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

        {/* Right People Rating & Journal Artwork Card (Col 8-12) */}
        <div className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-col items-center gap-4 bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4 sm:p-5">
          
          {/* Businessman Writing Journal Artwork with Consistency Rating Overlay */}
          <div className="relative w-full aspect-video sm:aspect-square lg:aspect-[16/9] max-h-48 rounded-xl overflow-hidden shadow-md group">
            <img
              src={businessmanImg}
              alt="Professional businessman writing daily habit journal and work update"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-transparent to-black/20" />
            
            {/* Top Tag */}
            <div className="absolute top-2 left-2 px-2.5 py-1 rounded-lg bg-emerald-950/80 backdrop-blur-md border border-emerald-500/40 text-[10px] font-bold text-emerald-300 flex items-center space-x-1">
              <Sparkles className="w-3 h-3 text-emerald-400" />
              <span>Daily Work Journal</span>
            </div>

            {/* People Rating Badge Overlay */}
            <div className="absolute bottom-2 left-2 right-2 p-2 rounded-lg bg-black/70 backdrop-blur-md border border-white/10 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-1.5">
                <div className="flex text-amber-400">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                </div>
                <span className="font-extrabold text-white">4.9/5</span>
              </div>
              <span className="text-[11px] font-semibold text-emerald-300">
                People Habit Rating
              </span>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="w-full grid grid-cols-2 gap-2 text-center">
            <div className="bg-white/10 rounded-xl p-2 border border-white/10">
              <span className="text-[10px] text-emerald-200 block">Today's Progress</span>
              <span className="text-sm font-extrabold text-white font-mono">
                {completedCount} / {totalCount} Done
              </span>
            </div>
            <div className="bg-white/10 rounded-xl p-2 border border-white/10">
              <span className="text-[10px] text-emerald-200 block">Consistency Score</span>
              <span className="text-sm font-extrabold text-amber-300 flex items-center justify-center space-x-1">
                <Trophy className="w-3.5 h-3.5" />
                <span>{Math.round((completedCount / (totalCount || 1)) * 100)}%</span>
              </span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
