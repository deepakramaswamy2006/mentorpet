import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, Globe } from 'lucide-react';
import { login } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await login(formData);
      localStorage.setItem('token', res.data.token);
      setUser(res.data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg flex items-center justify-center p-4 selection:bg-brand-accent-magenta/30">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-accent-purple/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-accent-magenta/10 rounded-full blur-[120px]"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass max-w-4xl w-full flex flex-col md:flex-row overflow-hidden shadow-2xl border-white/10"
      >
        {/* Left Side - Form */}
        <div className="w-full md:w-1/2 p-8 lg:p-12">
          <div className="flex items-center gap-2 mb-12">
             <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center font-bold text-lg">M</div>
             <span className="font-bold tracking-tight">MENTORPET AI</span>
          </div>

          <h2 className="text-3xl font-black mb-2">Welcome Back</h2>
          <p className="text-white/40 mb-8">Enter your details to access your workspace.</p>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/60 pl-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                <input 
                  type="email" 
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="name@example.com"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-brand-accent-purple/50 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-sm font-medium text-white/60">Password</label>
                <a href="#" className="text-xs text-brand-accent-purple hover:underline">Forgot password?</a>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                <input 
                  type="password" 
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-brand-accent-purple/50 transition-all"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full magenta-gradient py-4 rounded-xl font-bold shadow-lg shadow-magenta-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
            >
              {loading ? 'Signing in...' : (
                <>Sign In <ArrowRight size={18} /></>
              )}
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-transparent px-2 text-white/20">Or continue with</span></div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-2 bg-white/5 border border-white/10 rounded-xl py-3 hover:bg-white/10 transition-all text-sm font-medium">
              <Globe size={18} /> Google
            </button>
            <button className="flex items-center justify-center gap-2 bg-white/5 border border-white/10 rounded-xl py-3 hover:bg-white/10 transition-all text-sm font-medium">
              <Globe size={18} /> GitHub
            </button>
          </div>

          <p className="text-center mt-10 text-sm text-white/40">
            Don't have an account? <Link to="/register" className="text-brand-accent-magenta font-bold hover:underline">Register now</Link>
          </p>
        </div>

        {/* Right Side - Visual */}
        <div className="hidden md:block w-1/2 relative bg-gradient-to-br from-brand-sidebar-start to-brand-sidebar-end p-12">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="relative h-full flex flex-col justify-between">
            <div className="glass p-6 border-white/20 shadow-2xl backdrop-blur-xl">
              <div className="flex gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <h4 className="font-bold text-xl mb-4">Master Any Subject with AI</h4>
              <div className="space-y-3">
                <div className="h-2 w-full bg-white/10 rounded-full"><div className="h-full w-3/4 magenta-gradient rounded-full"></div></div>
                <div className="h-2 w-full bg-white/10 rounded-full"><div className="h-full w-1/2 magenta-gradient rounded-full"></div></div>
                <div className="h-2 w-full bg-white/10 rounded-full"><div className="h-full w-5/6 magenta-gradient rounded-full"></div></div>
              </div>
            </div>

            <div className="text-white">
              <h3 className="text-2xl font-bold mb-4">"The best way to predict the future is to create it."</h3>
              <p className="text-white/60">Start your journey towards academic excellence today with the power of artificial intelligence.</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
