import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen, 
  CheckSquare, 
  MessageSquare, 
  FileText, 
  BarChart2, 
  Map, 
  Settings, 
  LogOut,
  Search,
  Bell,
  Menu,
  X,
  ChevronLeft,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const MainLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 1024);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/dashboard' },
    { name: 'Study Planner', icon: <CheckSquare size={20} />, path: '/dashboard/planner' },
    { name: 'Roadmap', icon: <Map size={20} />, path: '/dashboard/roadmap' },
    { name: 'AI Tutor', icon: <MessageSquare size={20} />, path: '/dashboard/tutor' },
    { name: 'Learn New', icon: <Sparkles size={20} />, path: '/dashboard/learn' },
    { name: 'Notes', icon: <FileText size={20} />, path: '/dashboard/notes' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="flex h-screen bg-brand-bg text-white overflow-hidden font-sans selection:bg-brand-accent-magenta/30">
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar (Desktop & Mobile) */}
      <aside 
        className={`
          fixed inset-y-0 left-0 z-50 lg:relative lg:flex flex-col sidebar-gradient transition-all duration-300 ease-in-out
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${isSidebarOpen ? 'w-72' : 'w-20'}
        `}
      >
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 magenta-gradient rounded-xl flex items-center justify-center font-black text-white shadow-lg shadow-magenta-500/20">
              M
            </div>
            {(isSidebarOpen || isMobileMenuOpen) && (
              <motion.h1 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-xl font-black tracking-tighter"
              >
                MENTORPET
              </motion.h1>
            )}
          </div>
          <button onClick={() => setIsMobileMenuOpen(false)} className="lg:hidden text-white/40 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 group relative ${
                  isActive 
                    ? 'bg-white/10 text-white shadow-xl border border-white/10' 
                    : 'text-white/40 hover:bg-white/5 hover:text-white'
                }`}
              >
                <span className={`${isActive ? 'text-brand-accent-magenta' : 'group-hover:scale-110 transition-transform'}`}>
                  {item.icon}
                </span>
                {(isSidebarOpen || isMobileMenuOpen) && (
                  <span className="font-bold text-sm tracking-tight">{item.name}</span>
                )}
                {isActive && (
                  <motion.div 
                    layoutId="activeTab"
                    className="absolute left-0 w-1 h-6 bg-brand-accent-magenta rounded-full"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/5">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-4 w-full px-4 py-4 rounded-xl text-white/40 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200 group"
          >
            <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
            {(isSidebarOpen || isMobileMenuOpen) && <span className="font-bold text-sm">Logout Session</span>}
          </button>
        </div>
        
        {/* Toggle Button (Desktop Only) */}
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="hidden lg:flex absolute -right-4 top-10 bg-brand-bg border border-white/10 rounded-full w-8 h-8 items-center justify-center text-white/40 hover:text-brand-accent-magenta hover:border-brand-accent-magenta transition-all z-50 shadow-xl"
        >
          <ChevronLeft size={16} className={`transition-transform duration-300 ${!isSidebarOpen ? 'rotate-180' : ''}`} />
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Top Nav */}
        <header className="h-20 flex items-center justify-between px-4 lg:px-8 bg-brand-bg/50 backdrop-blur-xl border-b border-white/5 z-20">
          <div className="flex items-center gap-4 flex-1">
            <button 
              onClick={() => setIsMobileMenuOpen(true)} 
              className="lg:hidden p-2 bg-white/5 rounded-lg border border-white/10"
            >
              <Menu size={20} />
            </button>
            <div className="relative w-full max-w-xs hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" size={16} />
              <input 
                type="text" 
                placeholder="Global search..." 
                className="w-full bg-white/5 border border-white/5 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-brand-accent-purple/50 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 lg:gap-6">
            <div className="relative cursor-pointer text-white/40 hover:text-white transition-colors p-2 bg-white/5 rounded-lg border border-white/5">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-brand-accent-magenta rounded-full ring-2 ring-brand-bg"></span>
            </div>
            
            <div className="flex items-center gap-3 pl-4 lg:pl-6 border-l border-white/5">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-black tracking-tight">{user?.name || 'Academic Pro'}</p>
                <p className="text-[10px] uppercase font-black text-brand-accent-purple tracking-widest opacity-60">Elite Student</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-accent-purple to-brand-accent-magenta flex items-center justify-center font-black text-lg shadow-lg ring-1 ring-white/20">
                {user?.name?.[0]?.toUpperCase() || 'P'}
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-10 custom-scrollbar">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
