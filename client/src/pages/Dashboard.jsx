import React from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, 
  Clock, 
  Trophy, 
  Target, 
  TrendingUp, 
  BookOpen,
  ChevronRight,
  Flame
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

const Dashboard = () => {
  const { user } = useAuth();

  const studyData = [
    { day: 'Mon', hours: 4.5 },
    { day: 'Tue', hours: 6.2 },
    { day: 'Wed', hours: 3.8 },
    { day: 'Thu', hours: 7.1 },
    { day: 'Fri', hours: 5.5 },
    { day: 'Sat', hours: 8.0 },
    { day: 'Sun', hours: 4.2 },
  ];

  const subjectPerformance = [
    { name: 'Data Structures', score: 92, color: '#a855f7' },
    { name: 'Machine Learning', score: 88, color: '#d946ef' },
    { name: 'Web Development', score: 95, color: '#10b981' },
    { name: 'Mathematics', score: 76, color: '#fbbf24' },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
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
          <p className="text-white/40 mt-1">Here is your personalized AI study workspace.</p>
        </div>
        <div className="flex gap-3">
          <div className="glass px-4 py-2 flex items-center gap-2">
            <Flame className="text-orange-500" size={18} />
            <span className="font-bold text-white">7 Day Streak</span>
          </div>
          <button className="magenta-gradient px-6 py-2 rounded-full font-bold shadow-lg shadow-magenta-500/20 hover:scale-105 transition-transform">
            Start Study Session
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Productivity Score', value: '94%', icon: <Zap className="text-brand-accent-gold" />, trend: '+5.2%' },
          { label: 'Study Hours (Weekly)', value: '38.4h', icon: <Clock className="text-brand-accent-purple" />, trend: '+12.5%' },
          { label: 'Roadmap Progress', value: '12 / 24', icon: <Target className="text-brand-accent-magenta" />, trend: '50% Complete' },
        ].map((card, idx) => (
          <motion.div key={idx} variants={item} className="glass p-6 group hover:border-white/20 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                {card.icon}
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                card.trend.includes('+') ? 'bg-green-500/10 text-green-400' : 'bg-brand-accent-purple/10 text-brand-accent-purple'
              }`}>
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
              Learning Activity
            </h3>
            <select className="bg-white/5 border border-white/10 rounded-lg text-xs px-2 py-1 outline-none">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={studyData}>
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
            Top Subject Performance
          </h3>
          <div className="space-y-6">
            {subjectPerformance.map((sub, idx) => (
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
            ))}
          </div>
        </motion.div>
      </div>

      {/* Actionable Roadmap */}
      <motion.div variants={item} className="glass p-8">
        <div className="flex items-center justify-between mb-8">
          <h3 className="font-bold text-xl flex items-center gap-3">
            <Target size={22} className="text-brand-accent-magenta" />
            Your Daily Study Roadmap
          </h3>
          <button className="text-brand-accent-purple text-sm font-semibold hover:underline flex items-center gap-1">
            View Full Roadmap <ChevronRight size={16} />
          </button>
        </div>

        <div className="relative space-y-8 pl-8 before:content-[''] before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-white/10">
          {[
            { step: 'Step 1', title: 'Deep dive into Advanced React Patterns', desc: 'Focus on higher-order components and render props for state management.', status: 'completed' },
            { step: 'Step 2', title: 'Practice Data Structures (Trees)', desc: 'Solve 3 problems on LeetCode related to Binary Search Trees and DFS.', status: 'in-progress' },
            { step: 'Step 3', title: 'Review Machine Learning Fundamentals', desc: 'Watch videos on Linear Regression and Gradient Descent optimization.', status: 'pending' },
          ].map((roadmap, idx) => (
            <div key={idx} className="relative group">
              <div className={`absolute -left-[31px] top-1 w-6 h-6 rounded-full border-4 border-brand-bg z-10 ${
                roadmap.status === 'completed' ? 'bg-green-500' : roadmap.status === 'in-progress' ? 'bg-brand-accent-purple' : 'bg-white/10'
              }`}></div>
              <div className="glass p-6 group-hover:bg-white/5 transition-all cursor-pointer">
                <span className={`text-xs font-bold uppercase tracking-wider ${
                  roadmap.status === 'completed' ? 'text-green-400' : roadmap.status === 'in-progress' ? 'text-brand-accent-purple' : 'text-white/40'
                }`}>
                  {roadmap.step}
                </span>
                <h4 className="font-bold text-lg mt-1">{roadmap.title}</h4>
                <p className="text-white/40 text-sm mt-1">{roadmap.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;
