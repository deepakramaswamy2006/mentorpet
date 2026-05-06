import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Zap, 
  MessageSquare, 
  BookOpen, 
  BarChart2, 
  Map, 
  FileText, 
  CheckCircle,
  ArrowRight,
  Play,
  Trophy
} from 'lucide-react';

const LandingPage = () => {
  const features = [
    { name: 'AI Study Planner', desc: 'Personalized schedules generated based on your goals and pace.', icon: <CheckCircle className="text-brand-accent-purple" /> },
    { name: 'AI Tutor', desc: 'Ask any question and get instant academic help from our specialized models.', icon: <MessageSquare className="text-brand-accent-magenta" /> },
    { name: 'Quiz Generator', desc: 'Instantly create MCQs and flashcards from your study notes.', icon: <BookOpen className="text-brand-accent-gold" /> },
    { name: 'Smart Analytics', desc: 'Track your productivity and identify weak topics with AI insights.', icon: <BarChart2 className="text-brand-accent-green" /> },
    { name: 'Learning Roadmaps', desc: 'Step-by-step visual paths for any subject or career goal.', icon: <Map className="text-brand-accent-purple" /> },
    { name: 'Notes Summarizer', desc: 'Upload PDFs and get concise, actionable summaries in seconds.', icon: <FileText className="text-brand-accent-magenta" /> },
  ];

  return (
    <div className="bg-brand-bg text-white min-h-screen font-sans selection:bg-brand-accent-magenta/30 overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 px-8 py-6 backdrop-blur-md border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center font-bold text-xl shadow-lg border border-white/10">M</div>
          <span className="text-2xl font-bold tracking-tight">MENTORPET AI</span>
        </div>
        <div className="hidden md:flex items-center gap-10 text-sm font-medium text-white/70">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-white transition-colors">How it works</a>
          <a href="#about" className="hover:text-white transition-colors">About</a>
          <a href="#contact" className="hover:text-white transition-colors">Contact</a>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login" className="px-6 py-2 rounded-full border border-white/10 hover:bg-white/5 transition-all">Login</Link>
          <Link to="/register" className="magenta-gradient px-6 py-2 rounded-full font-bold shadow-lg shadow-magenta-500/20 hover:scale-105 transition-all">Get Started</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-8 flex flex-col items-center text-center">
        {/* Decorative elements */}
        <div className="absolute top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-brand-accent-purple/10 rounded-full blur-[120px] -z-10"></div>
        <div className="absolute top-20 right-20 w-[400px] h-[400px] bg-brand-accent-magenta/5 rounded-full blur-[100px] -z-10"></div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl"
        >
          <span className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-brand-accent-purple text-sm font-bold tracking-wider uppercase mb-6 inline-block">
            Revolutionizing Student Productivity
          </span>
          <h1 className="text-6xl md:text-8xl font-black mb-8 leading-[1.1] tracking-tight">
            Your AI-Powered <span className="text-transparent bg-clip-text magenta-gradient">Smart Study</span> Companion
          </h1>
          <p className="text-xl text-white/50 mb-10 max-w-2xl mx-auto leading-relaxed">
            Plan smarter, learn faster, and track productivity with your personal AI mentor. MENTORPET uses advanced AI to help you master any subject.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register" className="magenta-gradient px-10 py-4 rounded-full text-lg font-bold shadow-2xl shadow-magenta-500/40 hover:scale-105 transition-all flex items-center gap-2 group">
              Get Started Free <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <button className="px-10 py-4 rounded-full bg-white/5 border border-white/10 text-lg font-bold hover:bg-white/10 transition-all flex items-center gap-2">
              <Play fill="white" size={18} /> Watch Demo
            </button>
          </div>
        </motion.div>

        {/* Dashboard Preview */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="mt-24 w-full max-w-5xl relative"
        >
          <div className="glass p-2 border border-white/10 shadow-2xl shadow-purple-500/10">
            <img 
              src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
              alt="Dashboard Preview" 
              className="w-full h-auto rounded-lg opacity-40 blur-[1px] grayscale"
            />
            <div className="absolute inset-0 flex items-center justify-center">
               <div className="glass p-8 max-w-sm text-left border-white/20 shadow-2xl">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <h4 className="font-bold text-lg mb-2">AI Roadmap Generated</h4>
                  <p className="text-sm text-white/50 mb-4">Ready to start your "Full Stack Development" journey? Your first 3 tasks are ready.</p>
                  <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full w-1/3 magenta-gradient"></div>
                  </div>
               </div>
            </div>
          </div>
          {/* Floating cards */}
          <div className="absolute -left-12 top-20 glass p-4 hidden lg:block animate-bounce-slow">
            <Zap className="text-brand-accent-gold mb-2" />
            <p className="text-xs font-bold uppercase text-white/40 tracking-wider">Productivity</p>
            <p className="text-xl font-bold">97%</p>
          </div>
          <div className="absolute -right-12 bottom-20 glass p-4 hidden lg:block animate-bounce-slow delay-100">
            <Trophy className="text-brand-accent-magenta mb-2" />
            <p className="text-xs font-bold uppercase text-white/40 tracking-wider">Study Streak</p>
            <p className="text-xl font-bold">14 Days</p>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 px-8 bg-white/[0.02]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Built for Modern Students</h2>
            <p className="text-white/50 text-xl max-w-2xl mx-auto">
              Everything you need to optimize your learning workflow, all in one place.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((f, idx) => (
              <div key={idx} className="glass p-8 hover:bg-white/5 hover:border-white/20 transition-all group cursor-default">
                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  {f.icon}
                </div>
                <h3 className="text-xl font-bold mb-4">{f.name}</h3>
                <p className="text-white/40 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-8">
        <div className="max-w-5xl mx-auto magenta-gradient rounded-[3rem] p-16 text-center shadow-2xl shadow-magenta-500/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
          <h2 className="text-4xl md:text-5xl font-black mb-8 text-white">Ready to Master Your Studies?</h2>
          <p className="text-white/80 text-xl mb-12 max-w-2xl mx-auto font-medium">
            Join thousands of students who are already using MENTORPET AI to achieve their academic goals.
          </p>
          <Link to="/register" className="bg-white text-brand-accent-magenta px-12 py-5 rounded-full text-xl font-black hover:scale-105 hover:shadow-2xl transition-all inline-block">
            Create Your Free Account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-8 border-t border-white/5">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center font-bold text-lg shadow-lg border border-white/10">M</div>
              <span className="text-xl font-bold tracking-tight">MENTORPET AI</span>
            </div>
            <p className="text-white/40 max-w-xs leading-relaxed">
              The world's most advanced AI-powered study companion. Empowering the next generation of learners.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-6">Platform</h4>
            <ul className="space-y-4 text-white/40 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-white transition-colors">AI Tutor</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Roadmaps</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6">Legal</h4>
            <ul className="space-y-4 text-white/40 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Cookie Policy</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-20 pt-8 border-t border-white/5 text-center text-white/20 text-xs">
          © 2024 MENTORPET AI. All rights reserved. Built with futuristic love.
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
