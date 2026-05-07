import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Play, 
  Youtube, 
  BookOpen, 
  Search, 
  ChevronRight, 
  Loader2
} from 'lucide-react';
import API from '../services/api';

const skills = [
  "Python Programming", "Web Development", "Data Science", "Machine Learning", 
  "Artificial Intelligence", "UI/UX Design", "Digital Marketing", "Public Speaking",
  "Cloud Computing", "Cybersecurity", "Blockchain Technology", "Financial Literacy",
  "Graphic Design", "Video Editing", "Content Writing", "SEO Optimization",
  "Project Management", "Agile & Scrum", "Social Media Management", "Photography",
  "Investment Banking", "Cryptocurrency", "Mobile App Development", "Game Development",
  "AWS Cloud Services", "DevOps Engineering", "Cybersecurity", "Ethics in AI",
  "React.js Mastery", "Node.js Backend", "SQL & Databases", "Data Visualization",
  "Copywriting", "Creative Writing", "Leadership Skills", "Emotional Intelligence",
  "Time Management", "Critical Thinking", "Problem Solving", "Entrepreneurship",
  "Stock Market Basics", "Personal Branding", "Public Relations", "Sales & Negotiation",
  "Customer Psychology", "User Research", "Product Management", "SaaS Business",
  "Internet of Things", "Robotics Basics", "Data Structures & Algorithms"
];

const LearnNew = () => {
  const navigate = useNavigate();
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [videos, setVideos] = useState([]);
  const [videoLoading, setVideoLoading] = useState(false);

  const filteredSkills = skills.filter(skill => 
    skill.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLearnSkill = async (skill) => {
    setSelectedSkill(skill);
    
    // Check Cache first
    const cachedVideos = sessionStorage.getItem(`videos_${skill}`);
    if (cachedVideos) {
      setVideos(JSON.parse(cachedVideos));
      return;
    }

    setVideos([]);
    // Fetch Videos
    setVideoLoading(true);
    try {
      const res = await API.get(`/videos/search?q=${skill}`);
      setVideos(res.data.data);
      // Store in Cache
      sessionStorage.setItem(`videos_${skill}`, JSON.stringify(res.data.data));
    } catch (err) {
      console.error('Video fetch error:', err);
    } finally {
      setVideoLoading(false);
    }
  };

  const startQuiz = () => {
    if (!selectedSkill) return;
    navigate('/dashboard/quiz', { state: { topic: selectedSkill } });
  };

  return (
    <div className="max-w-7xl mx-auto pb-20">
      {!selectedSkill ? (
        <div className="space-y-10">
          <div className="text-center space-y-4">
            <h2 className="text-4xl lg:text-5xl font-black tracking-tight">Expand Your <span className="text-brand-accent-magenta">Skillset</span></h2>
            <p className="text-white/40 max-w-2xl mx-auto">Choose from our curated list of 50+ professional skills. Learn through high-quality video tutorials and test your knowledge immediately.</p>
          </div>

          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={20} />
            <input 
              type="text" 
              placeholder="Search skills (e.g. Python, AI, Marketing)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-12 pr-6 text-lg focus:outline-none focus:border-brand-accent-purple/50 transition-all shadow-2xl shadow-brand-bg"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredSkills.map((skill, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.02 }}
                onClick={() => handleLearnSkill(skill)}
                className="glass p-6 cursor-pointer group hover:border-brand-accent-magenta transition-all"
              >
                <div className="flex justify-between items-center mb-4">
                  <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center group-hover:scale-110 transition-all">
                    <Sparkles className="text-brand-accent-magenta" size={20} />
                  </div>
                  <ChevronRight size={18} className="text-white/20 group-hover:text-white group-hover:translate-x-1 transition-all" />
                </div>
                <h4 className="font-bold text-white/80">{skill}</h4>
                <p className="text-[10px] uppercase font-black tracking-widest text-white/20 mt-2">Professional Skill</p>
              </motion.div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-10 animate-in fade-in duration-500">
          {/* Header */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
            <div>
              <button 
                onClick={() => setSelectedSkill(null)}
                className="text-brand-accent-magenta font-bold flex items-center gap-2 mb-4 hover:-translate-x-1 transition-all"
              >
                <ChevronRight className="rotate-180" size={18} /> Back to All Skills
              </button>
              <h2 className="text-4xl lg:text-5xl font-black tracking-tight">{selectedSkill}</h2>
              <div className="flex items-center gap-3 mt-4">
                <span className="px-3 py-1 rounded-full bg-brand-accent-purple/20 text-brand-accent-purple text-[10px] font-black uppercase tracking-widest border border-brand-accent-purple/20">Learning Mode</span>
                <span className="text-white/20">•</span>
                <span className="text-white/40 text-sm font-medium">4 Video Modules & AI Quiz</span>
              </div>
            </div>
            
            <button 
              onClick={startQuiz}
              className="magenta-gradient px-8 py-4 rounded-2xl font-black flex items-center gap-3 shadow-xl shadow-magenta-500/20 hover:scale-105 active:scale-95 transition-all w-full lg:w-auto justify-center"
            >
              <BookOpen size={20} />
              Test My Knowledge
            </button>
          </div>

          {/* Video Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Youtube className="text-red-500" size={28} />
              <h3 className="text-2xl font-bold">Recommended Tutorials</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videoLoading ? (
                Array(3).fill(0).map((_, i) => (
                  <div key={i} className="glass h-64 animate-pulse rounded-3xl" />
                ))
              ) : videos.length > 0 ? (
                videos.map((video) => (
                  <a 
                    key={video.id} 
                    href={`https://www.youtube.com/watch?v=${video.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glass group overflow-hidden hover:border-white/20 transition-all flex flex-col"
                  >
                    <div className="aspect-video relative overflow-hidden">
                      <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-500" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                        <Play size={48} fill="white" className="text-white" />
                      </div>
                    </div>
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="font-bold text-sm leading-snug line-clamp-2 mb-2 group-hover:text-brand-accent-magenta transition-all">{video.title}</h4>
                        <p className="text-[10px] text-white/40 uppercase font-black tracking-widest">{video.channel}</p>
                      </div>
                    </div>
                  </a>
                ))
              ) : (
                <div className="col-span-full py-20 text-center glass border-dashed border-2 border-white/5 opacity-40">
                  <Youtube size={64} className="mx-auto mb-4" />
                  <p className="font-bold uppercase tracking-widest">No tutorials found for this skill</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LearnNew;
