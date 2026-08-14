import React, { useState, useEffect } from 'react';
import { 
  Habit, 
  NavigationTab, 
  UserProfile, 
  MonthlyPerformanceData,
  DayWorkUpdateEntry,
  DayWorkProjectLog
} from './types';
import { 
  INITIAL_HABITS, 
  INITIAL_USER_PROFILE, 
  INITIAL_TEAM_MEMBERS,
  INITIAL_MONTHLY_DATA,
  INITIAL_WORK_HISTORY,
  INITIAL_DAY_WORK_LOGS
} from './data/initialHabits';

import { Navbar } from './components/Navbar';
import { WelcomeSection } from './components/WelcomeSection';
import { PerformanceOverview } from './components/PerformanceOverview';
import { MainProgressCard } from './components/MainProgressCard';
import { TodaysHabits } from './components/TodaysHabits';
import { WeeklyChart } from './components/WeeklyChart';
import { MonthlyPerformance } from './components/MonthlyPerformance';
import { WorkHistorySection } from './components/WorkHistorySection';
import { QuickActions } from './components/QuickActions';
import { MobileBottomNav } from './components/MobileBottomNav';

import { AddHabitModal } from './components/modals/AddHabitModal';
import { EditHabitModal } from './components/modals/EditHabitModal';
import { DayWorkUpdateModal } from './components/modals/DayWorkUpdateModal';
import { ProfileManagerModal } from './components/modals/ProfileManagerModal';

import { HabitsView } from './components/views/HabitsView';
import { StatisticsView } from './components/views/StatisticsView';
import { CalendarView } from './components/views/CalendarView';
import { SettingsView } from './components/views/SettingsView';
import { DayWorkView } from './components/views/DayWorkView';

export default function App() {
  // Persistence key helpers
  const LOCAL_STORAGE_HABITS_KEY = 'habitflow_habits_v2';
  const LOCAL_STORAGE_HISTORY_KEY = 'habitflow_history_v2';
  const LOCAL_STORAGE_PROFILE_KEY = 'habitflow_profile_v2';
  const LOCAL_STORAGE_MEMBERS_KEY = 'habitflow_members_v2';
  const LOCAL_STORAGE_THEME_KEY = 'habitflow_dark_v2';
  const LOCAL_STORAGE_DAY_WORK_KEY = 'habitflow_day_work_logs_v2';

  // Team Members State
  const [teamMembers, setTeamMembers] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_MEMBERS_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse members from local storage', e);
      }
    }
    return INITIAL_TEAM_MEMBERS;
  });

  // Active User Profile State
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_PROFILE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse profile from local storage', e);
      }
    }
    return INITIAL_USER_PROFILE;
  });

  // Habits State
  const [habits, setHabits] = useState<Habit[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_HABITS_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse habits from local storage', e);
      }
    }
    return INITIAL_HABITS;
  });

  // Work History State
  const [workHistory, setWorkHistory] = useState<DayWorkUpdateEntry[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_HISTORY_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse work history from local storage', e);
      }
    }
    return INITIAL_WORK_HISTORY;
  });

  // Day Work Project Logs State for WORK UP Page
  const [dayWorkLogs, setDayWorkLogs] = useState<DayWorkProjectLog[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_DAY_WORK_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse day work logs from local storage', e);
      }
    }
    return INITIAL_DAY_WORK_LOGS;
  });

  const [monthlyData, setMonthlyData] = useState<MonthlyPerformanceData>(INITIAL_MONTHLY_DATA);
  const [activeTab, setActiveTab] = useState<NavigationTab>('dashboard');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [tierFilter, setTierFilter] = useState<'high' | 'medium' | 'low' | 'all'>('all');

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_THEME_KEY);
    if (saved !== null) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return true;
      }
    }
    return true; // Default to dark mode
  });

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [isWorkUpdateModalOpen, setIsWorkUpdateModalOpen] = useState<boolean>(false);
  const [isProfileManagerOpen, setIsProfileManagerOpen] = useState<boolean>(false);
  const [workUpdateHabitId, setWorkUpdateHabitId] = useState<string | null>(null);

  // Synchronize dark mode class on document element AND body
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_THEME_KEY, JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
  }, [darkMode]);

  // Persist habits to LocalStorage
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_HABITS_KEY, JSON.stringify(habits));
  }, [habits]);

  // Persist profile to LocalStorage
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_PROFILE_KEY, JSON.stringify(userProfile));
  }, [userProfile]);

  // Persist members list to LocalStorage
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_MEMBERS_KEY, JSON.stringify(teamMembers));
  }, [teamMembers]);

  // Persist work history to LocalStorage
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_HISTORY_KEY, JSON.stringify(workHistory));
  }, [workHistory]);

  // Persist day work logs to LocalStorage
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_DAY_WORK_KEY, JSON.stringify(dayWorkLogs));
  }, [dayWorkLogs]);

  // Derived metrics for Dashboard
  const completedCount = habits.filter(h => h.completedToday).length;
  const totalCount = habits.length;
  const currentStreak = 12; // Master active streak
  const completionPercentage = Math.round((completedCount / (totalCount || 1)) * 100);

  // Get formatted current time for check-in
  const getCurrentCheckTimeString = () => {
    return new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const getTodayDateStr = () => {
    return new Date().toISOString().split('T')[0];
  };

  // Toggle habit completion status with automatic time recording and history log
  const handleToggleComplete = (id: string) => {
    const timeNow = getCurrentCheckTimeString();
    const todayStr = getTodayDateStr();

    setHabits((prevHabits) =>
      prevHabits.map((h) => {
        if (h.id === id) {
          const newCompleted = !h.completedToday;
          const newStreak = newCompleted ? h.currentStreak + 1 : Math.max(0, h.currentStreak - 1);
          const completionTime = newCompleted ? (h.completedTime || timeNow) : undefined;
          
          if (newCompleted) {
            // Append auto check-in history entry
            const newHistoryItem: DayWorkUpdateEntry = {
              id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
              habitId: h.id,
              habitName: h.name,
              category: h.category,
              color: h.color,
              date: todayStr,
              completed: true,
              completedTime: completionTime || timeNow,
              workLogText: h.dailyWorkLog || `Habit completed and check-in logged.`,
              rating: h.workRating || 5,
            };
            setWorkHistory((prev) => [newHistoryItem, ...prev]);
          }

          return {
            ...h,
            completedToday: newCompleted,
            completedTime: completionTime,
            currentStreak: newStreak,
            bestStreak: Math.max(h.bestStreak, newStreak),
          };
        }
        return h;
      })
    );
  };

  // Complete all remaining habits in one tap with timestamping
  const handleCompleteAllRemaining = () => {
    const timeNow = getCurrentCheckTimeString();
    const todayStr = getTodayDateStr();

    setHabits((prevHabits) => {
      const updated = prevHabits.map((h) => {
        if (!h.completedToday) {
          const newHistoryItem: DayWorkUpdateEntry = {
            id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
            habitId: h.id,
            habitName: h.name,
            category: h.category,
            color: h.color,
            date: todayStr,
            completed: true,
            completedTime: timeNow,
            workLogText: h.dailyWorkLog || `Quick complete logged for today.`,
            rating: 5,
          };
          setWorkHistory((prev) => [newHistoryItem, ...prev]);

          return {
            ...h,
            completedToday: true,
            completedTime: timeNow,
            currentStreak: h.currentStreak + 1,
            bestStreak: Math.max(h.bestStreak, h.currentStreak + 1),
          };
        }
        return h;
      });
      return updated;
    });
  };

  // Add new habit
  const handleAddHabit = (habitData: {
    name: string;
    category: any;
    timeOfDay: any;
    icon: string;
    color: string;
    notes?: string;
  }) => {
    const newHabit: Habit = {
      id: `habit-${Date.now()}`,
      name: habitData.name,
      category: habitData.category,
      timeOfDay: habitData.timeOfDay,
      icon: habitData.icon,
      color: habitData.color,
      currentStreak: 1,
      bestStreak: 1,
      completedToday: false,
      targetPerWeek: 7,
      completedDates: [],
      notes: habitData.notes,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setHabits((prev) => [newHabit, ...prev]);
  };

  // Update existing habit
  const handleUpdateHabit = (updated: Habit) => {
    setHabits((prev) => prev.map((h) => (h.id === updated.id ? updated : h)));
  };

  // Profile Switching & Management Handlers
  const handleSelectProfile = (profile: UserProfile) => {
    setUserProfile(profile);
    // Also sync back to team members if updated
    setTeamMembers((prev) => prev.map((m) => (m.id === profile.id ? profile : m)));
  };

  const handleAddProfile = (newProfile: UserProfile) => {
    setTeamMembers((prev) => [...prev, newProfile]);
    setUserProfile(newProfile);
  };

  const handleUpdateProfile = (updatedProfile: UserProfile) => {
    setUserProfile(updatedProfile);
    setTeamMembers((prev) => prev.map((m) => (m.id === updatedProfile.id ? updatedProfile : m)));
  };

  const handleDeleteProfile = (profileId: string) => {
    setTeamMembers((prev) => {
      const filtered = prev.filter((m) => m.id !== profileId);
      if (userProfile.id === profileId && filtered.length > 0) {
        setUserProfile(filtered[0]);
      }
      return filtered;
    });
  };

  // Save work history entry
  const handleSaveWorkHistoryEntry = (entry: DayWorkUpdateEntry) => {
    setWorkHistory((prev) => [entry, ...prev]);
  };

  // Delete history item
  const handleDeleteHistoryItem = (id: string) => {
    setWorkHistory((prev) => prev.filter((item) => item.id !== id));
  };

  // Delete habit
  const handleDeleteHabit = (id: string) => {
    setHabits((prev) => prev.filter((h) => h.id !== id));
  };

  // Open work update modal for a specific habit or general
  const handleOpenWorkUpdate = (habitId?: string) => {
    if (habitId) {
      setWorkUpdateHabitId(habitId);
    } else {
      setWorkUpdateHabitId(habits.length > 0 ? habits[0].id : null);
    }
    setIsWorkUpdateModalOpen(true);
  };

  // Reset demo data
  const handleResetDemoData = () => {
    setHabits(INITIAL_HABITS);
    setUserProfile(INITIAL_USER_PROFILE);
    setTeamMembers(INITIAL_TEAM_MEMBERS);
    setMonthlyData(INITIAL_MONTHLY_DATA);
    setWorkHistory(INITIAL_WORK_HISTORY);
    setTierFilter('all');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300 pb-28 md:pb-16 font-sans">
      
      {/* 1. Top Navigation Bar with Profile Switcher & Dark Mode */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        userProfile={userProfile}
        teamMembers={teamMembers}
        onSelectProfile={handleSelectProfile}
        onOpenProfileManager={() => setIsProfileManagerOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenAddHabit={() => setIsAddModalOpen(true)}
      />

      {/* Main App Canvas */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        
        {/* Render Tab Views */}
        {activeTab === 'dashboard' && (
          <div className="animate-fade-in space-y-2">
            
            {/* 2. Welcome Section with Businessman Artwork & Switch Member action */}
            <WelcomeSection
              completedCount={completedCount}
              totalCount={totalCount}
              currentStreak={currentStreak}
              userName={userProfile.name}
              onOpenWorkUpdate={() => handleOpenWorkUpdate()}
              onOpenProfileManager={() => setIsProfileManagerOpen(true)}
            />

            {/* 3. Performance Overview */}
            <PerformanceOverview
              habits={habits}
              onSelectTierFilter={(tier) => setTierFilter(tier)}
              activeFilter={tierFilter}
            />

            {/* 4. Main Progress Card */}
            <MainProgressCard
              completedCount={completedCount}
              totalCount={totalCount}
              currentStreak={currentStreak}
              onCompleteAllRemaining={handleCompleteAllRemaining}
            />

            {/* 5. Today's Habits with Instant Search & Check-in Time logs */}
            <TodaysHabits
              habits={habits}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onToggleComplete={handleToggleComplete}
              onEditHabit={(h) => setEditingHabit(h)}
              onDeleteHabit={handleDeleteHabit}
              onOpenAddHabit={() => setIsAddModalOpen(true)}
              onOpenWorkUpdate={(id) => handleOpenWorkUpdate(id)}
              tierFilter={tierFilter}
            />

            {/* 6. Weekly Chart */}
            <WeeklyChart todayCompletionPercentage={completionPercentage} />

            {/* 7. Monthly Performance */}
            <MonthlyPerformance monthlyData={monthlyData} />

            {/* 8. One-Day Work Update & Check Time Logging: History Section */}
            <WorkHistorySection
              history={workHistory}
              onOpenWorkUpdate={(id) => handleOpenWorkUpdate(id)}
              onDeleteHistoryItem={handleDeleteHistoryItem}
            />

            {/* 9. Quick Actions */}
            <QuickActions
              onOpenAddHabit={() => setIsAddModalOpen(true)}
              onOpenQuickComplete={handleCompleteAllRemaining}
              onOpenWorkUpdate={() => handleOpenWorkUpdate()}
              onOpenProfileManager={() => setIsProfileManagerOpen(true)}
              setActiveTab={setActiveTab}
            />

          </div>
        )}

        {activeTab === 'day-work' && (
          <DayWorkView
            dayWorkLogs={dayWorkLogs}
            setDayWorkLogs={setDayWorkLogs}
            activeProfile={userProfile}
          />
        )}

        {activeTab === 'habits' && (
          <HabitsView
            habits={habits}
            onToggleComplete={handleToggleComplete}
            onEditHabit={(h) => setEditingHabit(h)}
            onDeleteHabit={handleDeleteHabit}
            onOpenAddHabit={() => setIsAddModalOpen(true)}
            onOpenWorkUpdate={(id) => handleOpenWorkUpdate(id)}
          />
        )}

        {activeTab === 'statistics' && (
          <StatisticsView
            habits={habits}
            userProfile={userProfile}
          />
        )}

        {activeTab === 'calendar' && (
          <CalendarView
            habits={habits}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsView
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            userProfile={userProfile}
            setUserProfile={setUserProfile}
            teamMembers={teamMembers}
            onSelectProfile={handleSelectProfile}
            onOpenProfileManager={() => setIsProfileManagerOpen(true)}
            onResetDemoData={handleResetDemoData}
          />
        )}

      </main>

      {/* Mobile Sticky Bottom Navigation Bar */}
      <MobileBottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onOpenAddHabit={() => setIsAddModalOpen(true)}
        completedCount={completedCount}
        totalCount={totalCount}
      />

      {/* Modals */}
      <AddHabitModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddHabit={handleAddHabit}
      />

      <EditHabitModal
        isOpen={Boolean(editingHabit)}
        habit={editingHabit}
        onClose={() => setEditingHabit(null)}
        onUpdateHabit={handleUpdateHabit}
        onDeleteHabit={handleDeleteHabit}
      />

      <DayWorkUpdateModal
        isOpen={isWorkUpdateModalOpen}
        onClose={() => setIsWorkUpdateModalOpen(false)}
        habits={habits}
        onUpdateHabit={handleUpdateHabit}
        selectedHabitId={workUpdateHabitId}
        history={workHistory}
        onSaveHistoryEntry={handleSaveWorkHistoryEntry}
      />

      <ProfileManagerModal
        isOpen={isProfileManagerOpen}
        onClose={() => setIsProfileManagerOpen(false)}
        currentProfile={userProfile}
        teamMembers={teamMembers}
        onSelectProfile={handleSelectProfile}
        onAddProfile={handleAddProfile}
        onUpdateProfile={handleUpdateProfile}
        onDeleteProfile={handleDeleteProfile}
      />

    </div>
  );
}
