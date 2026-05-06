import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Map, Sparkles, ChevronRight, Target, CheckCircle2, Circle, Clock, BookOpen } from 'lucide-react';
import API from '../services/api';

const Roadmap = () => {
  const [tasks, setTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  
  // Roadmap cache: { [taskId]: roadmapData }
  const [roadmapCache, setRoadmapCache] = useState(() => {
    const saved = localStorage.getItem('mentorpet_roadmaps');
    return saved ? JSON.parse(saved) : {};
  });

  const fetchTasks = async () => {
    try {
      const res = await API.get('/tasks');
      const activeTasks = res.data.data.filter(t => t.status !== 'Completed');
      setTasks(activeTasks);
      
      // Cleanup cache for completed tasks
      const activeIds = activeTasks.map(t => t._id);
      const newCache = { ...roadmapCache };
      let changed = false;
      Object.keys(newCache).forEach(id => {
        if (!activeIds.includes(id)) {
          delete newCache[id];
          changed = true;
        }
      });
      if (changed) {
        setRoadmapCache(newCache);
        localStorage.setItem('mentorpet_roadmaps', JSON.stringify(newCache));
      }
    } catch (err) {
      console.error('Error fetching tasks:', err);
    } finally {
      setLoadingTasks(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleTaskClick = async (task) => {
    setSelectedTask(task);
    
    // If already in cache, don't re-generate
    if (roadmapCache[task._id]) return;

    setGenerating(true);
    try {
      const res = await API.post('/ai/roadmap', { goal: `${task.title} for subject ${task.subject}` });
      const newRoadmap = res.data.data;
      
      const newCache = { ...roadmapCache, [task._id]: newRoadmap };
      setRoadmapCache(newCache);
      localStorage.setItem('mentorpet_roadmaps', JSON.stringify(newCache));
    } catch (err) {
      console.error('Roadmap error:', err);
    } finally {
      setGenerating(false);
    }
  };

  const currentRoadmap = selectedTask ? roadmapCache[selectedTask._id] : null;

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      <div>
        <h2 className="text-3xl font-bold">Dynamic Task Roadmaps</h2>
        <p className="text-white/40 mt-1">Select a task from your planner to generate or view its learning path.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Task Selection Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <h3 className="text-sm font-black uppercase tracking-widest text-white/20 px-2">Active Tasks</h3>
          <div className="space-y-3">
            {loadingTasks ? (
              <div className="p-4 text-white/20 animate-pulse">Loading tasks...</div>
            ) : tasks.length > 0 ? (
              tasks.map((task) => (
                <motion.div
                  key={task._id}
                  whileHover={{ x: 5 }}
                  onClick={() => handleTaskClick(task)}
                  className={`glass p-4 cursor-pointer transition-all border-l-4 ${
                    selectedTask?._id === task._id 
                      ? 'border-brand-accent-purple bg-white/5' 
                      : 'border-transparent hover:border-white/10'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-sm mb-1">{task.title}</h4>
                    {roadmapCache[task._id] && <Sparkles size={12} className="text-brand-accent-purple" />}
                  </div>
                  <div className="flex items-center gap-3 text-[10px] text-white/40 uppercase font-bold tracking-tighter">
                    <span className="flex items-center gap-1"><BookOpen size={10} /> {task.subject}</span>
                    <span className="flex items-center gap-1"><Clock size={10} /> {task.status}</span>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="glass p-8 text-center">
                <p className="text-white/20 text-sm">No active tasks in your planner. Add a task to generate a roadmap!</p>
              </div>
            )}
          </div>
        </div>

        {/* Roadmap Display Area */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {generating ? (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="glass p-20 flex flex-col items-center justify-center space-y-6 text-center"
              >
                <div className="w-16 h-16 rounded-full border-t-4 border-brand-accent-purple animate-spin"></div>
                <div>
                  <h3 className="text-xl font-bold">Designing Your Path</h3>
                  <p className="text-white/40 mt-2">Groq is analyzing "{selectedTask?.title}" to create a structured roadmap...</p>
                </div>
              </motion.div>
            ) : currentRoadmap ? (
              <motion.div 
                key="content"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                <div className="glass p-6 magenta-gradient shadow-xl shadow-magenta-500/10">
                  <h3 className="text-2xl font-black text-white">{selectedTask?.title}</h3>
                  <p className="text-white/70 text-sm mt-1">Personalized AI Roadmap for {selectedTask?.subject}</p>
                </div>

                <div className="space-y-12 relative pl-8 before:content-[''] before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-white/5">
                  {currentRoadmap.phases.map((phase, pIdx) => (
                    <div key={pIdx} className="space-y-6 relative">
                      <div className="absolute -left-[29px] top-1 w-5 h-5 rounded-full bg-brand-accent-purple shadow-[0_0_15px_rgba(168,85,247,0.5)] z-10 flex items-center justify-center">
                        <Sparkles size={10} className="text-white" />
                      </div>
                      <h3 className="text-lg font-black uppercase tracking-widest text-brand-accent-purple">
                        {phase.name}
                      </h3>
                      <div className="grid grid-cols-1 gap-4">
                        {phase.steps.map((step, sIdx) => (
                          <motion.div 
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: sIdx * 0.1 }}
                            key={sIdx} 
                            className="glass p-5 hover:bg-white/5 transition-all group"
                          >
                            <div className="flex items-start gap-4">
                              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0 group-hover:bg-brand-accent-purple group-hover:text-white transition-all text-sm font-bold">
                                {sIdx + 1}
                              </div>
                              <div>
                                <h4 className="font-bold mb-1">{step.title}</h4>
                                <p className="text-sm text-white/40 leading-relaxed">{step.description}</p>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <div className="glass p-20 flex flex-col items-center justify-center text-center space-y-6 opacity-30 border-dashed border-2">
                <Map size={64} />
                <div>
                  <h3 className="text-xl font-bold">Select a Task to Begin</h3>
                  <p className="text-sm max-w-xs mx-auto">Click any active task on the left to generate a step-by-step AI learning roadmap.</p>
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Roadmap;
