import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, 
  Clock, 
  Trophy, 
  Target, 
  TrendingUp, 
  BookOpen,
  ChevronRight,
  Flame,
  LayoutDashboard
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area 
} from 'recharts';
import { getDashboardStats } from '../services/api';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getDashboardStats();
        setStats(res.data.data);
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="w-10 h-10 border-t-4 border-brand-accent-purple rounded-full animate-spin"></div>
      </div>
    );
  }

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8 pb-10"
    >
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold">Welcome back, {user?.name?.split(' ')[0] || 'Student'} 👋</h2>
          <p className="text-white/40 mt-1">Here is your real-time study analytics dashboard.</p>
        </div>
        <div className="flex gap-3">
          <div className="glass px-4 py-2 flex items-center gap-2">
            <Flame className="text-orange-500" size={18} />
            <span className="font-bold text-white">7 Day Streak</span>
          </div>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { 
            label: 'Completion Rate', 
            value: `${stats?.totalTasks > 0 ? Math.round((stats.completedTasks / stats.totalTasks) * 100) : 0}%`, 
            icon: <Zap className="text-brand-accent-gold" />, 
            trend: `${stats?.completedTasks} / ${stats?.totalTasks} Tasks` 
          },
          { 
            label: 'Estimated Focus Time', 
            value: `${stats?.completedTasks * 1.5}h`, 
            icon: <Clock className="text-brand-accent-purple" />, 
            trend: 'Last 7 Days' 
          },
          { 
            label: 'Active Goals', 
            value: stats?.todoTasks + stats?.inProgressTasks, 
            icon: <Target className="text-brand-accent-magenta" />, 
            trend: 'In Your Planner' 
          },
        ].map((card, idx) => (
          <motion.div key={idx} variants={item} className="glass p-6 group hover:border-white/20 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                {card.icon}
              </div>
              <span className="text-xs font-bold px-2 py-1 rounded-full bg-brand-accent-purple/10 text-brand-accent-purple">
                {card.trend}
              </span>
            </div>
            <p className="text-white/40 text-sm">{card.label}</p>
            <h3 className="text-2xl font-bold mt-1 group-hover:scale-105 transition-transform origin-left">{card.value}</h3>
          </motion.div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Performance Graph */}
        <motion.div variants={item} className="glass p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <TrendingUp size={18} className="text-brand-accent-purple" />
              Task Activity
            </h3>
            <span className="text-xs text-white/40 font-medium uppercase tracking-widest">Weekly Overview</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats?.dailyStats || []}>
                <defs>
                  <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="day" stroke="#ffffff40" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#ffffff40" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1a1f2e', border: '1px solid #ffffff20', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="hours" stroke="#a855f7" strokeWidth={3} fillOpacity={1} fill="url(#colorHours)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Subject Performance */}
        <motion.div variants={item} className="glass p-6">
          <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
            <Trophy size={18} className="text-brand-accent-gold" />
            Subject Progress
          </h3>
          <div className="space-y-6">
            {stats?.subjectStats && stats.subjectStats.length > 0 ? stats.subjectStats.map((sub, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{sub.name}</span>
                  <span className="text-white/60 font-bold">{sub.score}%</span>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${sub.score}%` }}
                    transition={{ duration: 1, delay: idx * 0.1 }}
                    className="h-full rounded-full shadow-lg"
                    style={{ background: sub.color }}
                  ></motion.div>
                </div>
              </div>
            )) : (
              <div className="py-10 text-center text-white/20">
                <LayoutDashboard size={48} className="mx-auto mb-4 opacity-10" />
                <p>No subject data available yet. Start adding tasks to see your progress!</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
