import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CheckSquare, 
  MessageSquare, 
  FileText, 
  Map, 
  LogOut,
  Search,
  Bell,
  Menu,
  X,
  ChevronLeft,
  Sparkles,
  Trash2,
  Clock,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { getNotifications, markNotificationRead, deleteNotification } from '../services/api';

const MainLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Notification states
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);

  const fetchNotifications = async () => {
    try {
      const res = await getNotifications();
      setNotifications(res.data.data);
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  // Close notifications on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkRead = async (id) => {
    try {
      await markNotificationRead(id);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteNotification = async (id, e) => {
    e.stopPropagation();
    try {
      await deleteNotification(id);
      setNotifications(prev => prev.filter(n => n._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

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
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-brand-bg text-white font-sans overflow-hidden">
      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-[101] flex flex-col sidebar-gradient border-r border-white/5 transition-all duration-300 transform lg:relative lg:translate-x-0 ${
          isMobileMenuOpen ? 'translate-x-0 w-80' : '-translate-x-full lg:w-auto'
        } ${isSidebarOpen ? 'lg:w-80' : 'lg:w-24'}`}
      >
        <div className="flex items-center justify-between p-6 h-24">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shadow-lg flex-shrink-0">
              <span className="font-black text-2xl tracking-tighter text-white">M</span>
            </div>
            {(isSidebarOpen || isMobileMenuOpen) && (
              <motion.h1 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-black text-xl tracking-tight text-white"
              >
                MENTORPET AI
              </motion.h1>
            )}
          </div>
          <button onClick={() => setIsMobileMenuOpen(false)} className="lg:hidden text-white/40 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-2 py-6 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link 
                key={item.name}
                to={item.path}
                className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 group relative ${
                  isActive 
                    ? 'bg-white/20 text-white shadow-md' 
                    : 'text-white/60 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span className={`${isActive ? 'text-white' : 'group-hover:scale-110 transition-transform'}`}>
                  {item.icon}
                </span>
                {(isSidebarOpen || isMobileMenuOpen) && (
                  <span className="font-bold text-sm tracking-tight">{item.name}</span>
                )}
                {isActive && (
                  <motion.div 
                    layoutId="activeTab"
                    className="absolute left-0 w-1 h-6 bg-white rounded-full"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-4 w-full px-4 py-4 rounded-xl text-white/60 hover:bg-red-500/20 hover:text-red-400 transition-all duration-200 group"
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

          <div className="flex items-center gap-3 lg:gap-6 relative" ref={notificationRef}>
            {/* Notification Bell */}
            <div 
              onClick={() => setShowNotifications(!showNotifications)}
              className={`relative cursor-pointer transition-all p-2 rounded-lg border flex items-center justify-center ${
                showNotifications 
                  ? 'bg-brand-accent-magenta/10 border-brand-accent-magenta/30 text-brand-accent-magenta shadow-lg shadow-magenta-500/10' 
                  : 'text-white/40 hover:text-white bg-white/5 border-white/5'
              }`}
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-brand-accent-magenta text-[10px] font-black rounded-full flex items-center justify-center ring-2 ring-brand-bg text-white">
                  {unreadCount}
                </span>
              )}
            </div>

            {/* Notification Dropdown */}
            <AnimatePresence>
              {showNotifications && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 top-14 w-80 lg:w-96 bg-[#151926] rounded-2xl overflow-hidden z-[100] shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10"
                >
                  <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/5">
                    <h4 className="font-bold text-sm uppercase tracking-widest text-white/60">Notifications</h4>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-lg bg-brand-accent-magenta/20 text-brand-accent-magenta">
                      {notifications.length} Total
                    </span>
                  </div>
                  
                  <div className="max-h-96 overflow-y-auto custom-scrollbar">
                    {notifications.length > 0 ? (
                      notifications.map((n) => (
                        <div 
                          key={n._id}
                          onClick={() => handleMarkRead(n._id)}
                          className={`p-4 border-b border-white/5 cursor-pointer hover:bg-white/2 transition-all group relative ${!n.read ? 'bg-brand-accent-purple/5' : ''}`}
                        >
                          {!n.read && <div className="absolute left-2 top-1/2 -translate-y-1/2 w-1 h-10 bg-brand-accent-magenta rounded-full"></div>}
                          <div className="flex justify-between items-start gap-3">
                            <div className="p-2 rounded-lg bg-white/5 text-brand-accent-purple">
                              <Clock size={16} />
                            </div>
                            <div className="flex-1">
                              <p className={`text-sm font-bold ${!n.read ? 'text-white' : 'text-white/80'}`}>{n.title}</p>
                              <p className="text-xs text-white/70 mt-1 line-clamp-2">{n.message}</p>
                              <p className="text-[10px] text-white/40 mt-2 uppercase font-black">{new Date(n.createdAt).toLocaleTimeString()}</p>
                            </div>
                            <button 
                              onClick={(e) => handleDeleteNotification(n._id, e)}
                              className="p-1 text-white/0 group-hover:text-white/20 hover:text-red-400 transition-all"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="py-12 text-center text-white/20">
                        <Bell size={48} className="mx-auto mb-4 opacity-10" />
                        <p className="text-xs font-bold uppercase tracking-widest">All clear!</p>
                      </div>
                    )}
                  </div>
                  
                  {notifications.length > 0 && (
                    <div className="p-3 bg-white/2 text-center">
                      <button 
                        onClick={() => navigate('/dashboard/planner')}
                        className="text-[10px] font-black uppercase tracking-widest text-brand-accent-magenta hover:text-white transition-all flex items-center justify-center gap-1 mx-auto"
                      >
                        Manage Tasks <ExternalLink size={10} />
                      </button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
            
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
