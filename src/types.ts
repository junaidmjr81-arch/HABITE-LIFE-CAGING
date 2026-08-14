export type HabitCategory = 
  | 'Health' 
  | 'Fitness' 
  | 'Productivity' 
  | 'Mindfulness' 
  | 'Learning' 
  | 'Wellness';

export type HabitTimeOfDay = 'Morning' | 'Afternoon' | 'Evening' | 'Anytime';

export interface Habit {
  id: string;
  name: string;
  category: HabitCategory;
  timeOfDay: HabitTimeOfDay;
  icon: string; // lucide icon name or emoji
  color: string; // hex or tailwind color class
  currentStreak: number;
  bestStreak: number;
  completedToday: boolean;
  completedTime?: string; // Time check e.g. "08:30 AM"
  dailyWorkLog?: string; // Daily work update / summary notes
  workRating?: number; // 1-5 star rating of today's work
  targetPerWeek: number; // e.g. 7 days a week
  completedDates: string[]; // ISO date strings YYYY-MM-DD
  notes?: string;
  createdAt: string;
}

export interface DayWorkUpdateEntry {
  id: string;
  habitId: string;
  habitName: string;
  category?: HabitCategory;
  color?: string;
  date: string;
  completed: boolean;
  completedTime: string;
  workLogText: string;
  rating: number;
}

export type NavigationTab = 'dashboard' | 'day-work' | 'habits' | 'statistics' | 'calendar' | 'settings';

export interface DayWorkMaterialItem {
  id: string;
  name: string;
  quantity: string | number;
  unit: string; // e.g. "pcs", "kg", "meters", "hours", "bags", "sets", "boxes", "liters", "units"
  estimatedCost?: string;
  status?: 'available' | 'used' | 'ordered' | 'needed';
  notes?: string;
}

export interface DayWorkCollaborator {
  id: string;
  name: string;
  role?: string; // e.g. "Foreman", "Electrician", "Architect", "Inspector", "Neighbor / Neighbor Site Lead", "Laborer", "Co-worker"
  phone?: string;
  avatar?: string;
}

export interface DayWorkProjectLog {
  id: string;
  workName: string; // Task / Work Title e.g. "Concrete Foundation Pouring"
  projectName: string; // Project Name e.g. "Skyline Plaza Renovation"
  place: string; // Location / Place e.g. "East Wing Site, Level 3"
  date: string; // ISO date YYYY-MM-DD
  startTime?: string; // e.g. "08:00 AM"
  endTime?: string; // e.g. "04:30 PM"
  durationHours?: number; // e.g. 8.5
  checkInTime?: string; // e.g. "07:50 AM"
  checkOutTime?: string; // e.g. "04:45 PM"
  status: 'completed' | 'in-progress' | 'pending' | 'review';
  rating: number; // 1-5 rating
  description: string; // Notes & work summary
  materials: DayWorkMaterialItem[]; // Materials list & options
  neighbors: DayWorkCollaborator[]; // Neighbors / Coworkers / Laborers
  createdByProfileId?: string;
  createdByProfileName?: string;
  weatherOrNotes?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: string;
}

export type PerformanceTier = 'high' | 'medium' | 'low';

export interface PerformanceCategoryData {
  tier: PerformanceTier;
  label: string;
  description: string;
  count: number;
  percentage: number;
  habits: Habit[];
}

export interface DayWeeklyData {
  day: string; // 'Mon', 'Tue', etc.
  fullDate: string;
  percentage: number;
  completedCount: number;
  totalCount: number;
}

export interface MonthlyPerformanceData {
  currentMonthName: string;
  currentMonthPercentage: number;
  previousMonthPercentage: number;
  improvementPercentage: number;
  totalCompletionsThisMonth: number;
  activeDaysCount: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email?: string;
  avatar: string;
  level: number;
  currentXp: number;
  nextLevelXp: number;
  title: string;
  role?: string;
  bio?: string;
  totalHabitsCompleted: number;
}
