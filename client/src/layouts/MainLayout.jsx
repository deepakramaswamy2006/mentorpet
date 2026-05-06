import React, { useState } from 'react';
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
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const MainLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/dashboard' },
    { name: 'Study Planner', icon: <CheckSquare size={20} />, path: '/dashboard/planner' },
    { name: 'Roadmap', icon: <Map size={20} />, path: '/dashboard/roadmap' },
    { name: 'AI Tutor', icon: <MessageSquare size={20} />, path: '/dashboard/tutor' },
    { name: 'Notes', icon: <FileText size={20} />, path: '/dashboard/notes' },
    { name: 'Quiz', icon: <BookOpen size={20} />, path: '/dashboard/quiz' },
    { name: 'Analytics', icon: <BarChart2 size={20} />, path: '/dashboard/analytics' },
    { name: 'Settings', icon: <Settings size={20} />, path: '/dashboard/settings' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="flex h-screen bg-brand-bg text-white overflow-hidden font-sans">
      {/* Sidebar */}
      <aside 
        className={`${
          isSidebarOpen ? 'w-64' : 'w-20'
        } sidebar-gradient flex flex-col transition-all duration-300 ease-in-out relative z-30`}
      >
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-white/20 rounded flex items-center justify-center font-bold text-white shadow-lg">
            M
          </div>
          {isSidebarOpen && <h1 className="text-xl font-bold tracking-tight">MENTORPET AI</h1>}
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  isActive 
                    ? 'bg-white/20 text-white shadow-md' 
                    : 'text-white/60 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span className={`${isActive ? 'text-white' : 'group-hover:scale-110 transition-transform'}`}>
                  {item.icon}
                </span>
                {isSidebarOpen && <span className="font-medium">{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-4 w-full px-4 py-3 rounded-xl text-white/60 hover:bg-red-500/20 hover:text-red-400 transition-all duration-200 group"
          >
            <LogOut size={20} className="group-hover:rotate-12 transition-transform" />
            {isSidebarOpen && <span className="font-medium">Logout</span>}
          </button>
        </div>
        
        {/* Toggle Button */}
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="absolute -right-3 top-20 bg-brand-sidebar-end border border-white/10 rounded-full p-1 text-white/80 hover:text-white"
        >
          {isSidebarOpen ? <X size={14} /> : <Menu size={14} />}
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Top Nav */}
        <header className="h-20 flex items-center justify-between px-8 bg-brand-bg/50 backdrop-blur-md border-b border-white/5 z-20">
          <div className="flex items-center gap-4 w-1/3">
            <div className="relative w-full max-w-md hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
              <input 
                type="text" 
                placeholder="Search study materials..." 
                className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-brand-accent-purple/50 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative cursor-pointer text-white/60 hover:text-white transition-colors">
              <Bell size={22} />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-brand-accent-magenta rounded-full border-2 border-brand-bg"></span>
            </div>
            
            <div className="flex items-center gap-3 pl-6 border-l border-white/10">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold">{user?.name || 'User'}</p>
                <p className="text-xs text-white/40">Student Pro</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-accent-purple to-brand-accent-magenta flex items-center justify-center font-bold text-lg shadow-lg ring-2 ring-white/10">
                {user?.name?.[0]?.toUpperCase() || 'U'}
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-8 relative">
          {children}
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
