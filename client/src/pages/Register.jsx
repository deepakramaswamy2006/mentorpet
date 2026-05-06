import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, Globe } from 'lucide-react';
import { register } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }
    setLoading(true);
    setError('');
    try {
      const res = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      localStorage.setItem('token', res.data.token);
      setUser(res.data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg flex items-center justify-center p-4 selection:bg-brand-accent-magenta/30">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-accent-purple/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-accent-magenta/10 rounded-full blur-[120px]"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass max-w-4xl w-full flex flex-col md:flex-row-reverse overflow-hidden shadow-2xl border-white/10"
      >
        {/* Right Side - Form */}
        <div className="w-full md:w-1/2 p-8 lg:p-12">
          <div className="flex items-center gap-2 mb-8">
             <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center font-bold text-lg">M</div>
             <span className="font-bold tracking-tight">MENTORPET AI</span>
          </div>

          <h2 className="text-3xl font-black mb-2">Create Account</h2>
          <p className="text-white/40 mb-6">Join thousands of students on their journey.</p>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-white/60 pl-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="John Doe"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-brand-accent-purple/50 transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-white/60 pl-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                <input 
                  type="email" 
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="name@example.com"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-brand-accent-purple/50 transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-white/60 pl-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                  <input 
                    type="password" 
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    placeholder="••••••••"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-brand-accent-purple/50 transition-all"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-white/60 pl-1">Confirm</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                  <input 
                    type="password" 
                    required
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    placeholder="••••••••"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-brand-accent-purple/50 transition-all"
                  />
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full magenta-gradient py-3.5 rounded-xl font-bold shadow-lg shadow-magenta-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
            >
              {loading ? 'Creating account...' : (
                <>Get Started <ArrowRight size={18} /></>
              )}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-transparent px-2 text-white/20">Or register with</span></div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-2 bg-white/5 border border-white/10 rounded-xl py-2.5 hover:bg-white/10 transition-all text-sm font-medium">
              <Globe size={18} /> Google
            </button>
            <button className="flex items-center justify-center gap-2 bg-white/5 border border-white/10 rounded-xl py-2.5 hover:bg-white/10 transition-all text-sm font-medium">
              <Globe size={18} /> GitHub
            </button>
          </div>

          <p className="text-center mt-8 text-sm text-white/40">
            Already have an account? <Link to="/login" className="text-brand-accent-magenta font-bold hover:underline">Sign in</Link>
          </p>
        </div>

        {/* Left Side - Visual */}
        <div className="hidden md:block w-1/2 relative bg-gradient-to-br from-brand-sidebar-start to-brand-sidebar-end p-12">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="relative h-full flex flex-col justify-between text-white">
            <div>
               <h3 className="text-3xl font-black mb-4">Start Your AI Journey</h3>
               <p className="text-white/60 text-lg">Experience a new era of learning with personalized paths and intelligent assistance.</p>
            </div>
            
            <div className="space-y-6">
              {[
                { title: 'Personalized Study Plans', desc: 'AI creates schedules that adapt to your speed.' },
                { title: '24/7 AI Mentorship', desc: 'Expert help available whenever you need it.' },
                { title: 'Data-Driven Insights', desc: 'Track your growth with advanced analytics.' },
              ].map((item, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                  </div>
                  <div>
                    <h4 className="font-bold">{item.title}</h4>
                    <p className="text-sm text-white/40">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
