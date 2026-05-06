import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Trash2, 
  CheckCircle, 
  Clock, 
  Calendar, 
  AlertCircle,
  Search,
  Filter,
  MoreVertical,
  BookOpen,
  Play,
  Check,
  CheckCircle2
} from 'lucide-react';
import API from '../services/api';

const StudyPlanner = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState('All');
  const [newTask, setNewTask] = useState({
    title: '',
    subject: '',
    description: '',
    priority: 'Medium',
    deadline: '',
    status: 'To Do'
  });

  const fetchTasks = async () => {
    try {
      const res = await API.get('/tasks');
      setTasks(res.data.data);
    } catch (err) {
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAddTask = async (e) => {
    e.preventDefault();
    try {
      await API.post('/tasks', newTask);
      setShowAddModal(false);
      setNewTask({ title: '', subject: '', description: '', priority: 'Medium', deadline: '', status: 'To Do' });
      fetchTasks();
    } catch (err) {
      console.error('Error adding task:', err);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await API.put(`/tasks/${id}`, { status: newStatus });
      fetchTasks();
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const deleteTask = async (id) => {
    try {
      await API.delete(`/tasks/${id}`);
      fetchTasks();
    } catch (err) {
      console.error('Error deleting task:', err);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'bg-red-500/20 text-red-400';
      case 'Medium': return 'bg-orange-500/20 text-orange-400';
      case 'Low': return 'bg-green-500/20 text-green-400';
      default: return 'bg-white/10 text-white/40';
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          task.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = filterPriority === 'All' || task.priority === filterPriority;
    return matchesSearch && matchesPriority;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold">Study Planner</h2>
          <p className="text-white/40 mt-1">Organize your academic goals and track your progress.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="magenta-gradient px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:scale-105 transition-all shadow-lg shadow-magenta-500/20"
        >
          <Plus size={20} /> Create New Plan
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
          <input 
            type="text" 
            placeholder="Search by title or subject..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-brand-accent-purple/50"
          />
        </div>
        <div className="flex gap-4">
          <select 
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="glass px-4 py-3 text-sm font-medium hover:bg-white/10 bg-brand-bg border-white/10 focus:outline-none"
          >
            <option value="All">All Priorities</option>
            <option value="High">High Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="Low">Low Priority</option>
          </select>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {['To Do', 'In Progress', 'Completed'].map((status) => (
          <div key={status} className="space-y-6">
            <div className="flex items-center justify-between px-2">
              <h3 className="font-black text-sm uppercase tracking-widest text-white/40 flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${
                  status === 'To Do' ? 'bg-white/20' : 
                  status === 'In Progress' ? 'bg-brand-accent-purple' : 'bg-green-500'
                }`}></span>
                {status}
                <span className="ml-2 bg-white/5 px-2 py-0.5 rounded text-[10px] text-white/60">
                  {filteredTasks.filter(t => t.status === status).length}
                </span>
              </h3>
              <MoreVertical size={16} className="text-white/20 cursor-pointer" />
            </div>

            <div className="space-y-4 min-h-[500px]">
              {filteredTasks.filter(t => t.status === status).map((task, index) => (
                <motion.div 
                  layout
                  key={task._id || index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass p-5 hover:border-white/20 transition-all group relative"
                >
                  <div className="flex justify-between items-start mb-3">
                    <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                    <button 
                      onClick={() => deleteTask(task._id)}
                      className="text-white/0 group-hover:text-red-400 transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  
                  <h4 className="font-bold text-lg mb-1">{task.title}</h4>
                  <p className="text-sm text-white/40 mb-4 line-clamp-2">{task.description}</p>
                  
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 text-white/40">
                        <BookOpen size={14} className="text-brand-accent-purple" />
                        <span className="text-xs font-medium">{task.subject}</span>
                      </div>
                      <div className="flex items-center gap-2 text-white/40">
                        <Clock size={14} />
                        <span className="text-xs">{new Date(task.deadline).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {status === 'To Do' && (
                        <button 
                          onClick={() => handleStatusChange(task._id, 'In Progress')}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-accent-purple/10 text-brand-accent-purple hover:bg-brand-accent-purple hover:text-white transition-all text-xs font-bold"
                        >
                          <Play size={12} fill="currentColor" /> Start
                        </button>
                      )}
                      {status === 'In Progress' && (
                        <button 
                          onClick={() => handleStatusChange(task._id, 'Completed')}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-500/10 text-green-400 hover:bg-green-500 hover:text-white transition-all text-xs font-bold"
                        >
                          <Check size={12} strokeWidth={3} /> Complete
                        </button>
                      )}
                      {status === 'Completed' && (
                        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 text-white/40 text-xs font-bold">
                          <CheckCircle2 size={12} /> Finished
                        </span>
                      )}
                    </div>
                  </div>

                </motion.div>
              ))}
              
              {filteredTasks.filter(t => t.status === status).length === 0 && (
                <div className="border-2 border-dashed border-white/5 rounded-2xl h-32 flex items-center justify-center text-white/10 text-sm italic">
                  No tasks found
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Task Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            ></motion.div>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="glass max-w-lg w-full p-8 relative z-10 border-white/20"
            >
              <h3 className="text-2xl font-bold mb-6">Create Study Plan</h3>
              <form onSubmit={handleAddTask} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/60">Task Title</label>
                  <input 
                    type="text" 
                    required
                    value={newTask.title}
                    onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                    placeholder="e.g., Study Quantum Mechanics"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-brand-accent-purple/50"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/60">Subject</label>
                    <input 
                      type="text" 
                      required
                      value={newTask.subject}
                      onChange={(e) => setNewTask({...newTask, subject: e.target.value})}
                      placeholder="e.g., Physics"
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-brand-accent-purple/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/60">Priority</label>
                    <select 
                      value={newTask.priority}
                      onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-brand-accent-purple/50"
                    >
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/60">Deadline</label>
                  <input 
                    type="date" 
                    required
                    value={newTask.deadline}
                    onChange={(e) => setNewTask({...newTask, deadline: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-brand-accent-purple/50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/60">Description</label>
                  <textarea 
                    rows="3"
                    value={newTask.description}
                    onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-brand-accent-purple/50"
                    placeholder="What do you need to accomplish?"
                  ></textarea>
                </div>
                <div className="flex gap-4 mt-6">
                  <button 
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 bg-white/5 py-3 rounded-xl font-bold hover:bg-white/10 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 magenta-gradient py-3 rounded-xl font-bold hover:scale-[1.02] transition-all"
                  >
                    Create Task
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StudyPlanner;
