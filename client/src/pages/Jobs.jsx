import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Briefcase, 
  MapPin, 
  Search, 
  Building2, 
  ExternalLink, 
  Calendar,
  DollarSign,
  Loader2,
  Filter,
  ArrowRight
} from 'lucide-react';
import API from '../services/api';

const Jobs = () => {
  const [role, setRole] = useState('');
  const [location, setLocation] = useState('');
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Fetch default jobs on mount
  React.useEffect(() => {
    const fetchDefaultJobs = async () => {
      setLoading(true);
      try {
        const res = await API.get(`/jobs/search`, {
          params: { role: 'Software Engineer', location: 'India' }
        });
        setJobs(res.data.data);
      } catch (err) {
        console.error('Initial job fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDefaultJobs();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!role.trim()) return;

    setLoading(true);
    setHasSearched(true);
    try {
      const res = await API.get(`/jobs/search`, {
        params: { role, location }
      });
      setJobs(res.data.data);
    } catch (err) {
      console.error('Job search error:', err);
      alert('Failed to fetch jobs. Please check your API configuration.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <h2 className="text-4xl lg:text-5xl font-black tracking-tight">Career <span className="text-brand-accent-magenta">Opportunities</span></h2>
        <p className="text-white/40 max-w-2xl mx-auto">Find your next big role. Search thousands of jobs from top tech companies and startups worldwide.</p>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="glass p-4 lg:p-6 flex flex-col lg:flex-row gap-4 items-center shadow-2xl border-white/10">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={20} />
          <input 
            type="text" 
            placeholder="Job title or keywords..."
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full bg-white/5 border border-white/5 rounded-xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-brand-accent-purple/50 transition-all"
          />
        </div>
        <div className="relative flex-1 w-full">
          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={20} />
          <input 
            type="text" 
            placeholder="City or country..."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full bg-white/5 border border-white/5 rounded-xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-brand-accent-purple/50 transition-all"
          />
        </div>
        <button 
          type="submit"
          disabled={loading || !role.trim()}
          className="w-full lg:w-auto magenta-gradient px-10 py-4 rounded-xl font-black flex items-center justify-center gap-2 shadow-lg shadow-magenta-500/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : <Briefcase size={20} />}
          Find Jobs
        </button>
      </form>

      {/* Results Grid */}
      <div className="grid grid-cols-1 gap-6">
        {loading ? (
          Array(3).fill(0).map((_, i) => (
            <div key={i} className="glass h-40 animate-pulse rounded-2xl border-white/5" />
          ))
        ) : jobs.length > 0 ? (
          <AnimatePresence>
            {jobs.map((job, idx) => (
              <motion.div 
                key={job.id || idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="glass p-6 group hover:border-brand-accent-magenta/50 transition-all relative overflow-hidden"
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-brand-accent-magenta">
                        <Building2 size={24} />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold group-hover:text-brand-accent-magenta transition-colors line-clamp-1">{job.title}</h3>
                        <p className="text-sm text-white/60 flex items-center gap-2">
                          <Building2 size={14} className="text-white/20" /> {job.company}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-4 pt-2">
                      <div className="flex items-center gap-1.5 text-xs text-white/40 font-medium">
                        <MapPin size={14} /> {job.location}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-white/40 font-medium">
                        <Calendar size={14} /> {new Date(job.created).toLocaleDateString()}
                      </div>
                      {job.salary_min && (
                        <div className="flex items-center gap-1.5 text-xs text-green-400 font-bold">
                          <DollarSign size={14} /> {Math.round(job.salary_min).toLocaleString()} - {Math.round(job.salary_max).toLocaleString()}
                        </div>
                      )}
                    </div>
                  </div>

                  <a 
                    href={job.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full md:w-auto bg-white/5 border border-white/10 px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-white/10 hover:border-brand-accent-magenta transition-all"
                  >
                    Apply Now <ExternalLink size={16} />
                  </a>
                </div>
                
                <div className="mt-6 pt-6 border-t border-white/5">
                  <p className="text-sm text-white/40 leading-relaxed line-clamp-2 italic">"{job.description}"</p>
                </div>
                
                {/* Decorative background element */}
                <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-brand-accent-magenta/5 rounded-full blur-3xl group-hover:bg-brand-accent-magenta/10 transition-all"></div>
              </motion.div>
            ))}
          </AnimatePresence>
        ) : hasSearched && !loading ? (
          <div className="py-20 text-center glass border-dashed border-2 border-white/5 opacity-40">
            <Filter size={64} className="mx-auto mb-4" />
            <p className="text-lg font-bold uppercase tracking-widest">No matching jobs found</p>
            <p className="text-sm">Try broadening your search terms or location.</p>
          </div>
        ) : (
          <div className="py-32 text-center space-y-6">
            <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mx-auto border border-white/10 border-dashed">
              <Briefcase size={40} className="text-white/20" />
            </div>
            <p className="text-white/20 font-bold uppercase tracking-widest">Enter a role and location to begin</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Jobs;
