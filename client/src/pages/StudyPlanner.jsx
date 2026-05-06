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
  Check
} from 'lucide-react';
import API from '../services/api';

const StudyPlanner = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
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
      console.error('Error updating task status:', err);
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
      case 'High': return 'text-red-400 bg-red-400/10';
      case 'Medium': return 'text-brand-accent-purple bg-brand-accent-purple/10';
      case 'Low': return 'text-blue-400 bg-blue-400/10';
      default: return 'text-white/40 bg-white/5';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold">Study Planner</h2>
          <p className="text-white/40 mt-1">Manage your academic tasks and deadlines.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="magenta-gradient px-6 py-3 rounded-xl font-bold shadow-lg shadow-magenta-500/20 hover:scale-105 transition-all flex items-center gap-2"
        >
          <Plus size={20} /> Add New Task
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
          <input 
            type="text" 
            placeholder="Search tasks..." 
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-brand-accent-purple/50"
          />
        </div>
        <div className="flex gap-4">
          <button className="glass px-4 py-3 flex items-center gap-2 text-sm font-medium hover:bg-white/10">
            <Filter size={18} className="text-white/40" /> Filter
          </button>
          <button className="glass px-4 py-3 flex items-center gap-2 text-sm font-medium hover:bg-white/10">
            <Calendar size={18} className="text-white/40" /> Calendar
          </button>
        </div>
      </div>

      {/* Task Columns / List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {['To Do', 'In Progress', 'Completed'].map((status) => (
          <div key={status} className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <h3 className="font-bold flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${
                  status === 'To Do' ? 'bg-white/20' : status === 'In Progress' ? 'bg-brand-accent-purple' : 'bg-green-500'
                }`}></span>
                {status}
                <span className="text-white/20 ml-2 text-sm font-medium">
                  {tasks.filter(t => t.status === status).length}
                </span>
              </h3>
              <MoreVertical size={16} className="text-white/20 cursor-pointer" />
            </div>

            <div className="space-y-4 min-h-[500px]">
              {tasks.filter(t => t.status === status).map((task, index) => (
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
                          <CheckCircle size={12} /> Finished
                        </span>
                      )}
                    </div>
                  </div>

                </motion.div>
              ))}
              
              {tasks.filter(t => t.status === status).length === 0 && (
                <div className="h-24 border-2 border-dashed border-white/5 rounded-2xl flex items-center justify-center text-white/10 text-sm italic">
                  No tasks here
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
              className="absolute inset-0 bg-brand-bg/80 backdrop-blur-sm"
              onClick={() => setShowAddModal(false)}
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass max-w-lg w-full p-8 z-10 relative overflow-hidden"
            >
              <h3 className="text-2xl font-bold mb-6">Create New Study Task</h3>
              <form onSubmit={handleAddTask} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/60">Task Title</label>
                  <input 
                    type="text" 
                    required
                    value={newTask.title}
                    onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                    placeholder="e.g. Finish React Chapter"
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
                      placeholder="e.g. CS101"
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
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
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
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-brand-accent-purple/50 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/60">Description (Optional)</label>
                  <textarea 
                    rows="3"
                    value={newTask.description}
                    onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                    placeholder="Add some details..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-brand-accent-purple/50 resize-none"
                  />
                </div>
                <div className="flex gap-4 pt-4">
                  <button 
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 px-6 py-3 rounded-xl border border-white/10 hover:bg-white/5 transition-all font-bold"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 magenta-gradient px-6 py-3 rounded-xl font-bold shadow-lg shadow-magenta-500/20 hover:scale-105 transition-all"
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
