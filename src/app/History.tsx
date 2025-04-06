import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart, Clock, Calendar, ChevronDown, Filter, 
  ArrowUpRight, ArrowDownRight, Search, X,
  Check, List, Grid, Layers, Download, Share2
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { format, isThisWeek, isThisMonth } from 'date-fns';
import { supabase } from '../lib/supabase';
import { StatCard } from '../components/ui/StatCard';
import { useAuthStore } from '../store/useAuthStore';
import { Tabs, TabsList, TabsTrigger } from '../components/ui/Tabs';
import Tooltip from '../components/ui/Tooltip';
import { Skeleton } from '../components/ui/Skeleton';
import { Button } from '../components/ui/Button';
import { Calendar as CalendarComponent } from '../components/ui/Calendar';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';

// Type definitions based on your schema
interface Session {
  id: string;
  user_id: string;
  title: string;
  start_time: string;
  end_time: string | null;
  total_duration: number | null;
  tag: string | null;
  created_at: string;
  tasks?: Task[];
}

interface Task {
  id: string;
  user_id: string;
  session_id: string | null;
  project_id: string | null;
  title: string;
  notes: string | null;
  label: string | null;
  reminder: string | null;
  deadline: string | null;
  created_at: string;
  status: string;
  tag: string | null;
}

interface Project {
  id: string;
  user_id: string;
  name: string;
  created_at: string;
}

interface Stats {
  totalTime: number;
  sessionDays: number;
  dailyAverage: number;
  thisWeekTime: number;
  thisMonthTime: number;
  completedTasks: number;
  uniqueTags: string[];
  tagDistribution: Record<string, number>;
  mostProductiveDay: string;
  longestSession: number;
}

// Time filter options
type TimeRange = 'all' | 'today' | 'week' | 'month' | 'custom';

// Format duration from minutes to hours and minutes
const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
};

// Day streak calculation
const calculateStreak = (sessions: Session[]): number => {
  if (!sessions.length) return 0;
  
  // Sort sessions by start time
  const sortedSessions = [...sessions].sort((a, b) => 
    new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
  );
  
  // Get unique days
  const uniqueDays = new Set<string>();
  sortedSessions.forEach(session => {
    const day = format(new Date(session.start_time), 'yyyy-MM-dd');
    uniqueDays.add(day);
  });
  
  // Convert to array and sort
  const days = Array.from(uniqueDays).sort();
  
  // Calculate current streak
  let currentStreak = 1;
  const today = format(new Date(), 'yyyy-MM-dd');
  
  // If the last day with a session isn't today or yesterday, streak is broken
  const lastDay = days[days.length - 1];
  const lastDayDate = new Date(lastDay);
  const todayDate = new Date(today);
  
  const diffTime = Math.abs(todayDate.getTime() - lastDayDate.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays > 1) return 0;
  
  // Count consecutive days backward from the latest day
  for (let i = days.length - 2; i >= 0; i--) {
    const currentDay = new Date(days[i]);
    const nextDay = new Date(days[i + 1]);
    
    const dayDiff = Math.floor((nextDay.getTime() - currentDay.getTime()) / (1000 * 60 * 60 * 24));
    
    if (dayDiff === 1) {
      currentStreak++;
    } else {
      break;
    }
  }
  
  return currentStreak;
};

// Calculate statistics based on session data
const calculateStats = (sessions: Session[], tasks: Task[]): Stats => {
  // Default empty stats
  const emptyStats: Stats = {
    totalTime: 0,
    sessionDays: 0,
    dailyAverage: 0,
    thisWeekTime: 0,
    thisMonthTime: 0,
    completedTasks: 0,
    uniqueTags: [],
    tagDistribution: {},
    mostProductiveDay: '',
    longestSession: 0
  };
  
  if (!sessions.length) return emptyStats;
  
  // Calculate total time
  const totalMinutes = sessions.reduce((sum, session) => {
    return sum + (session.total_duration || 0);
  }, 0);
  
  // Get unique days
  const uniqueDays = new Set<string>();
  sessions.forEach(session => {
    uniqueDays.add(format(new Date(session.start_time), 'yyyy-MM-dd'));
  });
  
  // This week and month time
  const thisWeekMinutes = sessions
    .filter(session => isThisWeek(new Date(session.start_time)))
    .reduce((sum, session) => sum + (session.total_duration || 0), 0);
    
  const thisMonthMinutes = sessions
    .filter(session => isThisMonth(new Date(session.start_time)))
    .reduce((sum, session) => sum + (session.total_duration || 0), 0);
  
  // Count completed tasks
  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  
  // Tag distribution
  const tagDistribution: Record<string, number> = {};
  const uniqueTags: string[] = [];
  
  sessions.forEach(session => {
    if (session.tag) {
      if (tagDistribution[session.tag]) {
        tagDistribution[session.tag] += session.total_duration || 0;
      } else {
        tagDistribution[session.tag] = session.total_duration || 0;
        uniqueTags.push(session.tag);
      }
    }
  });
  
  // Most productive day
  const dayDistribution: Record<string, number> = {};
  sessions.forEach(session => {
    const day = format(new Date(session.start_time), 'EEEE'); // Day name
    if (dayDistribution[day]) {
      dayDistribution[day] += session.total_duration || 0;
    } else {
      dayDistribution[day] += session.total_duration || 0;
    }
  });
  
  const mostProductiveDay = Object.entries(dayDistribution)
    .sort((a, b) => b[1] - a[1])[0]?.[0] || '';
  
  // Longest session
  const longestSession = Math.max(...sessions.map(s => s.total_duration || 0));
  
  return {
    totalTime: totalMinutes,
    sessionDays: uniqueDays.size,
    dailyAverage: Math.round(totalMinutes / uniqueDays.size) || 0,
    thisWeekTime: thisWeekMinutes,
    thisMonthTime: thisMonthMinutes,
    completedTasks,
    uniqueTags,
    tagDistribution,
    mostProductiveDay,
    longestSession
  };
};

// Prepare chart data from sessions
const prepareChartData = (sessions: Session[], timeRange: TimeRange) => {
  if (!sessions.length) return [];
  
  const today = new Date();
  const filteredSessions = sessions.filter(session => {
    const sessionDate = new Date(session.start_time);
    
    switch(timeRange) {
      case 'today':
        return format(sessionDate, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd');
      case 'week':
        return isThisWeek(sessionDate);
      case 'month':
        return isThisMonth(sessionDate);
      default:
        return true;
    }
  });
  
  if (timeRange === 'today') {
    // Hourly data for today
    const hourlyData: Record<number, number> = {};
    for (let i = 0; i < 24; i++) {
      hourlyData[i] = 0;
    }
    
    filteredSessions.forEach(session => {
      const startHour = new Date(session.start_time).getHours();
      hourlyData[startHour] += (session.total_duration || 0);
    });
    
    return Object.entries(hourlyData).map(([hour, minutes]) => ({
      name: `${hour}:00`,
      minutes: minutes
    }));
  } else if (timeRange === 'week') {
    // Daily data for this week
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dailyData: Record<string, number> = {};
    daysOfWeek.forEach(day => {
      dailyData[day] = 0;
    });
    
    filteredSessions.forEach(session => {
      const dayName = format(new Date(session.start_time), 'EEEE');
      dailyData[dayName] += (session.total_duration || 0);
    });
    
    return daysOfWeek.map(day => ({
      name: day.substring(0, 3),
      minutes: dailyData[day]
    }));
  } else if (timeRange === 'month') {
    // Weekly data for this month
    const weeksInMonth: Record<number, number> = {};
    for (let i = 1; i <= 5; i++) {
      weeksInMonth[i] = 0;
    }
    
    filteredSessions.forEach(session => {
      const date = new Date(session.start_time);
      const weekOfMonth = Math.ceil(date.getDate() / 7);
      weeksInMonth[weekOfMonth] += (session.total_duration || 0);
    });
    
    return Object.entries(weeksInMonth).map(([week, minutes]) => ({
      name: `Week ${week}`,
      minutes: minutes
    }));
  } else {
    // Monthly data for all time
    const monthlyData: Record<string, number> = {};
    
    filteredSessions.forEach(session => {
      const monthYear = format(new Date(session.start_time), 'MMM yyyy');
      if (monthlyData[monthYear]) {
        monthlyData[monthYear] += (session.total_duration || 0);
      } else {
        monthlyData[monthYear] = session.total_duration || 0;
      }
    });
    
    return Object.entries(monthlyData)
      .sort((a, b) => {
        const dateA = new Date(a[0]);
        const dateB = new Date(b[0]);
        return dateA.getTime() - dateB.getTime();
      })
      .map(([monthYear, minutes]) => ({
        name: monthYear,
        minutes: minutes
      }));
  }
};

// Group sessions by day for timeline view
const groupSessionsByDay = (sessions: Session[]) => {
  const grouped: Record<string, Session[]> = {};
  
  sessions.forEach(session => {
    const day = format(new Date(session.start_time), 'yyyy-MM-dd');
    if (!grouped[day]) {
      grouped[day] = [];
    }
    grouped[day].push(session);
  });
  
  // Sort sessions within each day
  Object.keys(grouped).forEach(day => {
    grouped[day].sort((a, b) => 
      new Date(b.start_time).getTime() - new Date(a.start_time).getTime()
    );
  });
  
  // Return as array of entries, sorted by date (newest first)
  return Object.entries(grouped)
    .sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime())
    .map(([date, daySessions]) => ({
      date,
      sessions: daySessions
    }));
};

function HistoryPage() {
  const { user } = useAuthStore();
  const [timeRange, setTimeRange] = useState<TimeRange>('all');
  const [filterTag, setFilterTag] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'timeline' | 'calendar' | 'grid'>('timeline');
  const [searchTerm, setSearchTerm] = useState('');
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  
  // Fetch sessions data
  const { data: sessionData, isLoading: sessionsLoading } = useQuery({
    queryKey: ['sessions', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('start_time', { ascending: false });
        
      if (error) throw error;
      return data as Session[];
    },
    enabled: !!user,
  });
  
  // Fetch tasks data
  const { data: taskData, isLoading: tasksLoading } = useQuery({
    queryKey: ['tasks', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id);
        
      if (error) throw error;
      return data as Task[];
    },
    enabled: !!user,
  });
  
  // Fetch tasks associated with each session
  useEffect(() => {
    if (sessionData && sessionData.length > 0) {
      sessionData.forEach(async (session) => {
        const { data, error } = await supabase
          .from('tasks')
          .select('*')
          .eq('session_id', session.id);
          
        if (!error && data) {
          session.tasks = data as Task[];
        }
      });
    }
  }, [sessionData]);
  
  // Filtered sessions based on current filters
  const filteredSessions = React.useMemo(() => {
    if (!sessionData) return [];
    
    let filtered = [...sessionData];
    
    // Apply tag filter
    if (filterTag) {
      filtered = filtered.filter(session => session.tag === filterTag);
    }
    
    // Apply search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(session => 
        session.title.toLowerCase().includes(term) ||
        session.tag?.toLowerCase().includes(term)
      );
    }
    
    // Apply time range filter
    if (timeRange === 'today') {
      filtered = filtered.filter(session => 
        format(new Date(session.start_time), 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
      );
    } else if (timeRange === 'week') {
      filtered = filtered.filter(session => 
        isThisWeek(new Date(session.start_time))
      );
    } else if (timeRange === 'month') {
      filtered = filtered.filter(session => 
        isThisMonth(new Date(session.start_time))
      );
    } else if (timeRange === 'custom' && selectedDate) {
      filtered = filtered.filter(session => 
        format(new Date(session.start_time), 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
      );
    }
    
    return filtered;
  }, [sessionData, filterTag, searchTerm, timeRange, selectedDate]);
  
  // Calculate stats
  const stats = React.useMemo(() => {
    return calculateStats(filteredSessions, taskData || []);
  }, [filteredSessions, taskData]);
  
  // Group sessions by day for timeline view
  const groupedSessions = React.useMemo(() => {
    return groupSessionsByDay(filteredSessions);
  }, [filteredSessions]);
  
  // Chart data
  const chartData = React.useMemo(() => {
    return prepareChartData(filteredSessions, timeRange);
  }, [filteredSessions, timeRange]);
  
  // Calculate streak
  const streak = React.useMemo(() => {
    return calculateStreak(sessionData || []);
  }, [sessionData]);
  
  const getTagColor = (tag: string | null) => {
    if (!tag) return 'bg-gray-300';
    
    const tagColors: Record<string, string> = {
      'Working': 'bg-blue-500',
      'Studying': 'bg-purple-500',
      'Reading': 'bg-yellow-500',
      'Meeting': 'bg-pink-500',
      'Research': 'bg-indigo-500',
      'Meditation': 'bg-teal-500',
      'Writing': 'bg-emerald-500',
      'Coding': 'bg-cyan-500',
      'Designing': 'bg-orange-500',
      'Editing': 'bg-rose-500',
    };
    
    return tagColors[tag] || 'bg-gray-500';
  };
  
  const getTagTextColor = (tag: string | null) => {
    if (!tag) return 'text-gray-700';
    
    const tagTextColors: Record<string, string> = {
      'Working': 'text-blue-500',
      'Studying': 'text-purple-500',
      'Reading': 'text-yellow-600',
      'Meeting': 'text-pink-500',
      'Research': 'text-indigo-500',
      'Meditation': 'text-teal-500',
      'Writing': 'text-emerald-500',
      'Coding': 'text-cyan-500',
      'Designing': 'text-orange-500',
      'Editing': 'text-rose-500',
    };
    
    return tagTextColors[tag] || 'text-gray-700';
  };
  
  const getProductivityChange = () => {
    // Calculate this week's time vs previous week
    if (!sessionData) return 0;
    
    const today = new Date();
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(today.getDate() - 7);
    
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(today.getDate() - 14);
    
    const thisWeekSessions = sessionData.filter(session => {
      const sessionDate = new Date(session.start_time);
      return sessionDate >= oneWeekAgo && sessionDate <= today;
    });
    
    const lastWeekSessions = sessionData.filter(session => {
      const sessionDate = new Date(session.start_time);
      return sessionDate >= twoWeeksAgo && sessionDate < oneWeekAgo;
    });
    
    const thisWeekMinutes = thisWeekSessions.reduce((sum, session) => 
      sum + (session.total_duration || 0), 0);
      
    const lastWeekMinutes = lastWeekSessions.reduce((sum, session) => 
      sum + (session.total_duration || 0), 0);
      
    if (lastWeekMinutes === 0) return thisWeekMinutes > 0 ? 100 : 0;
    
    const percentChange = ((thisWeekMinutes - lastWeekMinutes) / lastWeekMinutes) * 100;
    return Math.round(percentChange);
  };
  
  const downloadCSV = () => {
    if (!filteredSessions.length) return;
    
    const headers = ['Date', 'Time', 'Duration', 'Title', 'Tag'];
    const csv = [
      headers.join(','),
      ...filteredSessions.map(session => {
        const date = format(new Date(session.start_time), 'yyyy-MM-dd');
        const time = format(new Date(session.start_time), 'HH:mm');
        const duration = session.total_duration || 0;
        return [
          date,
          time,
          duration,
          `"${session.title.replace(/"/g, '""')}"`,
          session.tag || ''
        ].join(',');
      })
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `sundial-history-${format(new Date(), 'yyyy-MM-dd')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const productivityChange = getProductivityChange();
  const isLoading = sessionsLoading || tasksLoading;
  const hasNoData = !sessionsLoading && (!sessionData || sessionData.length === 0);
  
  return (
    <div className="pb-12">
      {/* Header with title and actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">History & Analytics</h2>
          <p className="text-text-secondary mt-1">Track your progress and gain insights from your sessions</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
            className="flex items-center gap-1.5"
          >
            <Filter className="h-4 w-4" />
            Filters
            <ChevronDown className={`h-4 w-4 transition-transform ${isFiltersOpen ? 'rotate-180' : ''}`} />
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={downloadCSV}
            className="flex items-center gap-1.5"
            disabled={!filteredSessions.length}
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
          
          <div className="flex border border-border rounded-md overflow-hidden">
            <Tooltip text="Timeline view">
              <button
                onClick={() => setViewMode('timeline')}
                className={`p-2 ${viewMode === 'timeline' ? 'bg-primary text-primary-contrast' : 'bg-surface text-text-secondary hover:text-text-primary'}`}
              >
                <List className="h-4 w-4" />
              </button>
            </Tooltip>
            <Tooltip text="Grid view">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-primary text-primary-contrast' : 'bg-surface text-text-secondary hover:text-text-primary'}`}
              >
                <Grid className="h-4 w-4" />
              </button>
            </Tooltip>
            <Tooltip text="Calendar view">
              <button
                onClick={() => setViewMode('calendar')}
                className={`p-2 ${viewMode === 'calendar' ? 'bg-primary text-primary-contrast' : 'bg-surface text-text-secondary hover:text-text-primary'}`}
              >
                <Calendar className="h-4 w-4" />
              </button>
            </Tooltip>
          </div>
        </div>
      </div>
      
      {/* Filter panel */}
      <AnimatePresence>
        {isFiltersOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden mb-6"
          >
            <div className="bg-surface rounded-lg border border-border p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">Time Range</label>
                  <select
                    value={timeRange}
                    onChange={(e) => setTimeRange(e.target.value as TimeRange)}
                    className="w-full rounded-md border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="all">All Time</option>
                    <option value="today">Today</option>
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                    <option value="custom">Custom Date</option>
                  </select>
                </div>
                
                {timeRange === 'custom' && (
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">Select Date</label>
                    <div className="relative">
                      <input
                        type="date"
                        value={selectedDate ? format(selectedDate, 'yyyy-MM-dd') : ''}
                        onChange={(e) => setSelectedDate(e.target.value ? new Date(e.target.value) : null)}
                        className="w-full rounded-md border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">Search</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-4 w-4 text-text-tertiary" />
                    </div>
                    <input
                      type="text"
                      placeholder="Search sessions..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full rounded-md border-border bg-background pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm('')}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        <X className="h-4 w-4 text-text-tertiary hover:text-text-primary" />
                      </button>
                    )}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">Filter by Tag</label>
                  <div className="relative">
                    <select
                      value={filterTag || ''}
                      onChange={(e) => setFilterTag(e.target.value || null)}
                      className="w-full rounded-md border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">All Tags</option>
                      {stats.uniqueTags.map(tag => (
                        <option key={tag} value={tag}>{tag}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={Clock}
          label="Total Session Time"
          value={formatDuration(stats.totalTime)}
          className="bg-surface border border-border shadow-sm"
        />
        <StatCard
          icon={Calendar}
          label="Session Streak"
          value={`${streak} days`}
          className="bg-surface border border-border shadow-sm"
          trend={
            streak > 0 ? {
              direction: 'up',
              label: 'Keep it up!',
              icon: <Check className="h-3 w-3" />
            } : undefined
          }
        />
        <StatCard
          icon={Clock}
          label="This Week"
          value={formatDuration(stats.thisWeekTime)}
          trend={productivityChange !== 0 ? {
            direction: productivityChange > 0 ? 'up' : 'down',
            label: `${Math.abs(productivityChange)}% vs last week`,
            icon: productivityChange > 0 
              ? <ArrowUpRight className="h-3 w-3" />
              : <ArrowDownRight className="h-3 w-3" />
          } : undefined}
          className="bg-surface border border-border shadow-sm"
        />
        <StatCard
          icon={BarChart}
          label="Daily Average"
          value={formatDuration(stats.dailyAverage)}
          className="bg-surface border border-border shadow-sm"
        />
      </div>
      
      {/* Chart and Tab Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Chart */}
        <div className="bg-surface border border-border rounded-xl p-6 shadow-sm col-span-1 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-text-primary">Time Distribution</h3>
            <Tabs defaultValue="minutes">
              <TabsList>
                <TabsTrigger value="minutes">Minutes</TabsTrigger>
                <TabsTrigger value="hours">Hours</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          {isLoading ? (
            <div className="h-72 flex items-center justify-center">
              <div className="animate-pulse flex flex-col items-center">
                <div className="h-52 w-full bg-border/30 rounded"></div>
                <div className="mt-4 h-4 w-32 bg-border/30 rounded"></div>
              </div>
            </div>
          ) : hasNoData ? (
            <div className="h-72 flex flex-col items-center justify-center text-text-secondary">
              <BarChart className="h-12 w-12 mb-2 opacity-30" />
              <p>No session data available</p>
              <p className="text-sm mt-1">Start a session to see analytics</p>
            </div>
          ) : (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
                  <defs>
                    <linearGradient id="colorMinutes" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.4} />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fill: 'var(--color-text-secondary)' }}
                    tickLine={{ stroke: 'var(--color-border)' }}
                  />
                  <YAxis 
                    tick={{ fill: 'var(--color-text-secondary)' }}
                    tickLine={{ stroke: 'var(--color-border)' }}
                    tickFormatter={(value) => `${Math.floor(value / 60)}h`}
                  />
                  <RechartsTooltip 
                    formatter={(value: number) => [`${Math.floor(value / 60)}h ${value % 60}m`, 'Duration']}
                    labelStyle={{ color: 'var(--color-text-primary)' }}
                    contentStyle={{ 
                      backgroundColor: 'var(--color-background)',
                      border: '1px solid var(--color-border)',
                      borderRadius: '8px'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="minutes" 
                    stroke="var(--color-primary)" 
                    fillOpacity={1} 
                    fill="url(#colorMinutes)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
          
          {/* Time Range Selector Pills */}
          <div className="flex items-center justify-center mt-6 flex-wrap gap-2">
            <button
              onClick={() => setTimeRange('today')}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                timeRange === 'today' 
                  ? 'bg-primary text-primary-contrast' 
                  : 'bg-surface hover:bg-primary/10 text-text-secondary border border-border'
              }`}
            >
              Today
            </button>
            <button
              onClick={() => setTimeRange('week')}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                timeRange === 'week' 
                  ? 'bg-primary text-primary-contrast' 
                  : 'bg-surface hover:bg-primary/10 text-text-secondary border border-border'
              }`}
            >
              This Week
            </button>
            <button
              onClick={() => setTimeRange('month')}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                timeRange === 'month' 
                  ? 'bg-primary text-primary-contrast' 
                  : 'bg-surface hover:bg-primary/10 text-text-secondary border border-border'
              }`}
            >
              This Month
            </button>
            <button
              onClick={() => setTimeRange('all')}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                timeRange === 'all' 
                  ? 'bg-primary text-primary-contrast' 
                  : 'bg-surface hover:bg-primary/10 text-text-secondary border border-border'
              }`}
            >
              All Time
            </button>
          </div>
        </div>
        
        {/* Additional Stats */}
        <div className="bg-surface border border-border rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-text-primary mb-6">Insights</h3>
          
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4].map(i => (
                <Skeleton key={i} className="h-14 w-full" />
              ))}
            </div>
          ) : hasNoData ? (
            <div className="flex flex-col items-center justify-center h-56 text-text-secondary">
              <Layers className="h-12 w-12 mb-2 opacity-30" />
              <p>No insights available</p>
              <p className="text-sm mt-1">Start a session to generate insights</p>
            </div>
          ) : (
            <div className="space-y-5">
              <div>
                <div className="text-xs font-medium text-text-secondary uppercase tracking-wide mb-2">
                  Top Tag
                </div>
                {Object.entries(stats.tagDistribution).length > 0 ? (
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-2 ${getTagColor(Object.entries(stats.tagDistribution)
                      .sort((a, b) => b[1] - a[1])[0]?.[0])}`}></div>
                    <span className="font-medium">
                      {Object.entries(stats.tagDistribution)
                        .sort((a, b) => b[1] - a[1])[0]?.[0] || 'None'}
                    </span>
                    <span className="text-text-secondary ml-2 text-sm">
                      ({formatDuration(Object.entries(stats.tagDistribution)
                        .sort((a, b) => b[1] - a[1])[0]?.[1] || 0)})
                    </span>
                  </div>
                ) : (
                  <div className="text-text-secondary">No tags used yet</div>
                )}
              </div>
              
              <div>
                <div className="text-xs font-medium text-text-secondary uppercase tracking-wide mb-2">
                  Longest Session
                </div>
                <div className="font-medium">
                  {formatDuration(stats.longestSession)}
                </div>
              </div>
              
              <div>
                <div className="text-xs font-medium text-text-secondary uppercase tracking-wide mb-2">
                  Most Productive Day
                </div>
                <div className="font-medium">
                  {stats.mostProductiveDay || 'Not enough data'}
                </div>
              </div>
              
              <div>
                <div className="text-xs font-medium text-text-secondary uppercase tracking-wide mb-2">
                  Total Sessions
                </div>
                <div className="font-medium">
                  {filteredSessions.length} sessions
                </div>
              </div>
              
              <div>
                <div className="text-xs font-medium text-text-secondary uppercase tracking-wide mb-2">
                  Completed Tasks
                </div>
                <div className="font-medium">
                  {stats.completedTasks} tasks
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Main Content - Timeline, Grid or Calendar */}
      <div>
        {/* View Tabs */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-text-primary">Session History</h3>
          <p className="text-text-secondary text-sm">
            {filteredSessions.length} 
            {filteredSessions.length === 1 ? ' session' : ' sessions'} 
            {searchTerm ? ` matching "${searchTerm}"` : ''}
            {filterTag ? ` with tag "${filterTag}"` : ''}
            {timeRange !== 'all' ? ` in selected time range` : ''}
          </p>
        </div>
        
        {/* Timeline View */}
        {viewMode === 'timeline' && (
          <div className="space-y-8">
            {isLoading ? (
              <div className="space-y-8">
                {[1, 2, 3].map(day => (
                  <div key={day} className="space-y-4">
                    <Skeleton className="h-8 w-32" />
                    <div className="border-l-2 border-border pl-6 ml-3 space-y-4">
                      {[1, 2, 3].map(session => (
                        <Skeleton key={session} className="h-24 w-full" />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : hasNoData ? (
              <div className="flex flex-col items-center justify-center p-12 text-text-secondary border border-dashed border-border rounded-lg">
                <Clock className="h-12 w-12 mb-4 opacity-30" />
                <h3 className="text-lg font-medium text-text-primary mb-1">No sessions recorded yet</h3>
                <p className="text-center max-w-sm">
                  Your session history will appear here once you start tracking your focus time.
                </p>
              </div>
            ) : groupedSessions.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 text-text-secondary border border-dashed border-border rounded-lg">
                <Search className="h-12 w-12 mb-4 opacity-30" />
                <h3 className="text-lg font-medium text-text-primary mb-1">No matching sessions</h3>
                <p className="text-center">Try adjusting your filters to see more results.</p>
                <Button 
                  className="mt-4"
                  variant="outline"
                  onClick={() => {
                    setTimeRange('all');
                    setFilterTag(null);
                    setSearchTerm('');
                    setSelectedDate(null);
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className="space-y-10">
                {groupedSessions.map(({ date, sessions }) => (
                  <div key={date}>
                    <h3 className="text-md font-semibold text-text-primary mb-4">
                      {format(new Date(date), "EEEE, MMMM d, yyyy")}
                      <span className="ml-2 text-sm font-normal text-text-secondary">
                        ({sessions.length} {sessions.length === 1 ? 'session' : 'sessions'})
                      </span>
                    </h3>
                    
                    <div className="border-l-2 border-border pl-6 ml-3 space-y-6">
                      {sessions.map(session => {
                        const startTime = new Date(session.start_time);
                        const endTime = session.end_time ? new Date(session.end_time) : null;
                        const duration = session.total_duration || 0;
                        
                        return (
                          <motion.div 
                            key={session.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3 }}
                            className="relative"
                          >
                            {/* Time marker */}
                            <div className="absolute -left-[41px] -top-1 w-6 h-6 rounded-full border-4 border-background bg-primary flex items-center justify-center">
                              <div className="w-2 h-2 rounded-full bg-background"></div>
                            </div>
                            
                            {/* Session Card */}
                            <div className="bg-surface border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <h4 className="text-md font-medium text-text-primary">{session.title}</h4>
                                    {session.tag && (
                                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTagTextColor(session.tag)} bg-surface border border-border`}>
                                        {session.tag}
                                      </span>
                                    )}
                                  </div>
                                  
                                  <div className="flex items-center gap-2 mt-1 text-text-secondary text-sm">
                                    <span>
                                      {format(startTime, "h:mm a")}
                                      {endTime && ` - ${format(endTime, "h:mm a")}`}
                                    </span>
                                    <span className="text-text-tertiary">•</span>
                                    <span>{formatDuration(duration)}</span>
                                  </div>
                                </div>
                                
                                <div className="flex items-center gap-2">
                                  {session.tasks && session.tasks.length > 0 && (
                                    <div className="text-xs bg-primary/10 text-primary rounded-full px-2.5 py-1 font-medium">
                                      {session.tasks.length} tasks
                                    </div>
                                  )}
                                  
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-xs"
                                  >
                                    <Share2 className="mr-1.5 h-3 w-3" />
                                    Share
                                  </Button>
                                </div>
                              </div>
                              
                              {session.tasks && session.tasks.length > 0 && (
                                <div className="mt-4 pt-4 border-t border-border">
                                  <h5 className="text-sm font-medium text-text-secondary mb-2">Tasks completed:</h5>
                                  <div className="space-y-1">
                                    {session.tasks.map(task => (
                                      <div key={task.id} className="flex items-center">
                                        <div className="w-4 h-4 rounded mr-2 bg-primary/20 flex items-center justify-center">
                                          <Check className="w-3 h-3 text-primary" />
                                        </div>
                                        <span className="text-sm">{task.title}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        {/* Grid View */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              Array(6).fill(0).map((_, i) => (
                <Skeleton key={i} className="h-48 w-full" />
              ))
            ) : hasNoData || filteredSessions.length === 0 ? (
              <div className="col-span-full flex flex-col items-center justify-center p-12 text-text-secondary border border-dashed border-border rounded-lg">
                <Clock className="h-12 w-12 mb-4 opacity-30" />
                <h3 className="text-lg font-medium text-text-primary mb-1">
                  {hasNoData ? 'No sessions recorded yet' : 'No matching sessions'}
                </h3>
                <p className="text-center max-w-sm">
                  {hasNoData 
                    ? 'Your session history will appear here once you start tracking your focus time.'
                    : 'Try adjusting your filters to see more results.'
                  }
                </p>
                {!hasNoData && (
                  <Button 
                    className="mt-4"
                    variant="outline"
                    onClick={() => {
                      setTimeRange('all');
                      setFilterTag(null);
                      setSearchTerm('');
                      setSelectedDate(null);
                    }}
                  >
                    Clear Filters
                  </Button>
                )}
              </div>
            ) : (
              filteredSessions.map(session => {
                const startTime = new Date(session.start_time);
                const duration = session.total_duration || 0;
                
                return (
                  <motion.div 
                    key={session.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="bg-surface border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group"
                  >
                    {/* Color bar at top based on tag */}
                    <div className={`h-1.5 w-full ${getTagColor(session.tag)}`}></div>
                    
                    <div className="p-6">
                      <div className="flex justify-between items-start">
                        <h4 className="text-md font-medium text-text-primary">{session.title}</h4>
                        {session.tag && (
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTagTextColor(session.tag)} bg-surface border border-border`}>
                            {session.tag}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center mt-2 text-text-secondary text-sm">
                        <Calendar className="w-4 h-4 mr-1.5" />
                        <span>{format(startTime, "MMM d, yyyy")}</span>
                      </div>
                      
                      <div className="flex items-center mt-1 text-text-secondary text-sm">
                        <Clock className="w-4 h-4 mr-1.5" />
                        <span>{format(startTime, "h:mm a")}</span>
                        <span className="mx-1">•</span>
                        <span>{formatDuration(duration)}</span>
                      </div>
                      
                      {session.tasks && session.tasks.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-border">
                          <div className="flex items-center text-text-secondary text-sm">
                            <Check className="w-4 h-4 mr-1.5" />
                            <span>
                              {session.tasks.length} {session.tasks.length === 1 ? 'task' : 'tasks'} completed
                            </span>
                          </div>
                        </div>
                      )}
                      
                      <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full text-xs"
                        >
                          <Share2 className="mr-1.5 h-3 w-3" />
                          Share Session
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        )}
        
        {/* Calendar View */}
        {viewMode === 'calendar' && (
          <div className="bg-surface border border-border rounded-xl p-6 shadow-sm">
            {isLoading ? (
              <Skeleton className="h-96 w-full" />
            ) : hasNoData ? (
              <div className="flex flex-col items-center justify-center p-12 text-text-secondary h-96">
                <Calendar className="h-12 w-12 mb-4 opacity-30" />
                <h3 className="text-lg font-medium text-text-primary mb-1">No sessions recorded yet</h3>
                <p className="text-center max-w-sm">
                  Your session history will appear here once you start tracking your focus time.
                </p>
              </div>
            ) : (
              <CalendarComponent 
                mode="multiple"
                className="rounded-md"
                classNames={{
                  day_today: "bg-primary/20 text-text-primary",
                  day_selected: "bg-primary text-primary-contrast hover:bg-primary-dark",
                  day_range_end: "bg-primary text-primary-contrast hover:bg-primary-dark",
                  day_range_middle: "bg-primary/20 text-text-primary"
                }}
                // TODO: Implement day selection logic
                // selected={...}
                // onSelect={...}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default HistoryPage;
