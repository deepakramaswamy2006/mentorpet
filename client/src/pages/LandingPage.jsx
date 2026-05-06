import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  Zap, 
  MessageSquare, 
  BookOpen, 
  Map, 
  FileText, 
  ArrowRight,
  Play,
  Trophy,
  Sparkles,
  Briefcase,
  GraduationCap,
  Lightbulb,
  Cpu,
  Brain,
  Globe,
  Rocket
} from 'lucide-react';

const FloatingSymbol = ({ icon: Icon, delay, x, y, size = 32, color = "purple" }) => {
  const colorMap = {
    purple: "text-purple-400/40",
    magenta: "text-pink-400/40",
    gold: "text-yellow-400/40",
    blue: "text-blue-400/40"
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ 
        opacity: [0.3, 0.7, 0.3],
        scale: [1, 1.3, 1],
        rotate: [0, 10, -10, 0],
        x: [0, 30, 0, -30, 0],
        y: [0, -30, 0, 30, 0],
      }}
      transition={{ 
        duration: 10 + Math.random() * 5, 
        delay, 
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className={`absolute ${colorMap[color]} pointer-events-none z-0 filter drop-shadow-[0_0_8px_rgba(168,85,247,0.4)]`}
      style={{ left: `${x}%`, top: `${y}%` }}
    >
      <Icon size={size} strokeWidth={1.5} />
    </motion.div>
  );
};

const FadeInView = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.8, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
  >
    {children}
  </motion.div>
);

const LandingPage = () => {
  const { scrollYProgress } = useScroll();
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  const features = [
    { 
      name: 'AI Study Planner', 
      desc: 'Smart schedules that adapt to your pace and goals, keeping you ahead of your deadlines.', 
      icon: <Zap size={28} />,
      color: 'from-purple-500 to-indigo-500'
    },
    { 
      name: 'Interactive Skill Hub', 
      desc: 'Master 50+ professional skills with curated tutorials and AI-generated assessments.', 
      icon: <Sparkles size={28} />,
      color: 'from-pink-500 to-rose-500'
    },
    { 
      name: '24/7 AI Tutor', 
      desc: 'Get instant, expert-level answers to your complex academic questions anytime.', 
      icon: <Brain size={28} />,
      color: 'from-amber-400 to-orange-500'
    },
    { 
      name: 'Smart Roadmaps', 
      desc: 'Visual learning paths for any career or subject, broken down into achievable milestones.', 
      icon: <Map size={28} />,
      color: 'from-blue-500 to-cyan-500'
    },
    { 
      name: 'Career Engine', 
      desc: 'Browse and apply for trending jobs worldwide with our integrated Adzuna career hub.', 
      icon: <Briefcase size={28} />,
      color: 'from-emerald-400 to-teal-500'
    },
    { 
      name: 'Knowledge Quizzes', 
      desc: 'Validate your learning with instant AI-powered tests and detailed performance reports.', 
      icon: <Trophy size={28} />,
      color: 'from-indigo-500 to-purple-500'
    },
  ];

  return (
    <div className="bg-[#050508] text-white min-h-screen font-sans selection:bg-brand-accent-magenta/30 overflow-x-hidden relative">
      {/* Dynamic Background - Contained to prevent infinite scroll */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden h-full">
        <motion.div style={{ y: backgroundY }} className="h-full w-full">
          <FloatingSymbol icon={BookOpen} delay={0} x={8} y={15} size={48} color="purple" />
          <FloatingSymbol icon={Lightbulb} delay={2} x={88} y={12} size={56} color="gold" />
          <FloatingSymbol icon={Cpu} delay={4} x={12} y={65} size={40} color="blue" />
          <FloatingSymbol icon={GraduationCap} delay={1} x={82} y={75} size={64} color="magenta" />
          <FloatingSymbol icon={Brain} delay={3} x={42} y={8} size={52} color="purple" />
          <FloatingSymbol icon={Rocket} delay={5} x={92} y={55} size={36} color="blue" />
          <FloatingSymbol icon={Globe} delay={1.5} x={5} y={40} size={44} color="gold" />
          
          {/* Modern Mesh Gradients */}
          <div className="absolute top-0 left-[-10%] w-[50%] h-[1000px] bg-purple-600/10 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-0 right-[-10%] w-[50%] h-[1000px] bg-pink-600/10 rounded-full blur-[120px] animate-pulse delay-700"></div>
        </motion.div>
      </div>

      {/* Navbar */}
      <nav className="fixed top-0 w-full z-[100] px-6 lg:px-12 py-8 transition-all duration-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between glass py-4 px-8 border-white/5 shadow-2xl rounded-3xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 magenta-gradient rounded-xl flex items-center justify-center font-black text-2xl shadow-[0_0_20px_rgba(236,72,153,0.3)]">M</div>
            <span className="text-2xl font-black tracking-tighter bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">MENTORPET</span>
          </div>
          <div className="hidden lg:flex items-center gap-12 text-[10px] font-black uppercase tracking-[0.3em] text-white/40">
            <a href="#features" className="hover:text-white transition-colors cursor-pointer">Ecosystem</a>
            <a href="#vision" className="hover:text-white transition-colors cursor-pointer">Vision</a>
            <a href="#community" className="hover:text-white transition-colors cursor-pointer">Community</a>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/login" className="text-sm font-black uppercase tracking-widest text-white/60 hover:text-white transition-all">Login</Link>
            <Link to="/register" className="magenta-gradient px-8 py-3 rounded-xl font-black shadow-xl shadow-magenta-500/20 hover:scale-105 active:scale-95 transition-all text-[11px] uppercase tracking-widest">Join Now</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-56 pb-40 px-6 flex flex-col items-center text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="max-w-5xl z-10"
        >
          <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-white/5 border border-white/10 text-brand-accent-magenta text-[10px] font-black tracking-[0.3em] uppercase mb-10 shadow-xl backdrop-blur-md">
            <Sparkles size={14} className="animate-pulse" /> Intelligence Meets Ambition
          </div>
          <h1 className="text-7xl md:text-[100px] font-black mb-10 leading-[0.95] tracking-tighter">
            Build Your <br />
            <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-amber-400 bg-clip-text text-transparent filter drop-shadow-[0_10px_20px_rgba(236,72,153,0.2)]">Digital Legacy</span>
          </h1>
          <p className="text-xl text-white/40 mb-14 max-w-3xl mx-auto leading-relaxed font-medium">
            The all-in-one AI ecosystem for high-achievers. Master any professional skill, automate your study workflow, and bridge the gap to your dream career.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link to="/register" className="magenta-gradient px-14 py-6 rounded-2xl text-xl font-black shadow-[0_20px_40px_rgba(236,72,153,0.3)] hover:scale-105 active:scale-95 transition-all flex items-center gap-4 group">
              Start Building <ArrowRight className="group-hover:translate-x-2 transition-transform" />
            </Link>
            <button className="px-14 py-6 rounded-2xl bg-white/5 border border-white/10 text-xl font-black hover:bg-white/10 transition-all flex items-center gap-4 backdrop-blur-xl group">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:scale-110 transition-all">
                <Play fill="white" size={20} className="text-white ml-1" />
              </div>
              View Vision
            </button>
          </div>
        </motion.div>

        {/* Dynamic Card Layout */}
        <div className="mt-40 w-full max-w-7xl grid grid-cols-1 md:grid-cols-4 gap-6 px-4">
           {[
             { label: 'Skills', val: '50+', sub: 'Expert Tracks' },
             { label: 'Jobs', val: '100k+', sub: 'Active Postings' },
             { label: 'Uptime', val: '99.9%', sub: 'AI Support' },
             { label: 'Growth', val: '10x', sub: 'Faster Learning' }
           ].map((stat, i) => (
             <FadeInView key={i} delay={0.1 * i}>
               <div className="glass p-8 border-white/5 text-center group hover:border-brand-accent-magenta/30 transition-all">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-2">{stat.label}</p>
                  <h4 className="text-4xl font-black bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent group-hover:scale-110 transition-all">{stat.val}</h4>
                  <p className="text-xs font-medium text-white/20 mt-2">{stat.sub}</p>
               </div>
             </FadeInView>
           ))}
        </div>
      </section>

      {/* Features Detail Section */}
      <section id="features" className="py-40 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <FadeInView>
            <div className="flex flex-col items-center text-center mb-32">
              <h2 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter">Engineered for <span className="text-brand-accent-purple">Growth</span></h2>
              <p className="text-white/30 text-xl max-w-3xl font-medium leading-relaxed">
                We've combined advanced neural networks with intuitive design to create a learning experience that feels like magic.
              </p>
            </div>
          </FadeInView>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((f, idx) => (
              <FadeInView key={idx} delay={idx * 0.1}>
                <div className="glass p-12 hover:border-white/20 transition-all group relative overflow-hidden h-full flex flex-col justify-between">
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${f.color} opacity-0 group-hover:opacity-10 blur-[60px] transition-all duration-500`}></div>
                  <div>
                    <div className={`w-20 h-20 rounded-3xl bg-white/5 border border-white/5 flex items-center justify-center mb-10 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-2xl`}>
                      <span className="text-white group-hover:text-brand-accent-magenta transition-colors">{f.icon}</span>
                    </div>
                    <h3 className="text-3xl font-black mb-6 tracking-tight">{f.name}</h3>
                    <p className="text-white/40 leading-relaxed font-medium text-lg">{f.desc}</p>
                  </div>
                  <div className="mt-12 flex items-center gap-3 text-sm font-black uppercase tracking-widest text-white/20 group-hover:text-white transition-all">
                    Explore Feature <ArrowRight size={16} />
                  </div>
                </div>
              </FadeInView>
            ))}
          </div>
        </div>
      </section>

      {/* Stats/Vision Section */}
      <section id="vision" className="py-40 px-6 border-y border-white/5 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
           <FadeInView>
             <div className="space-y-10">
                <h2 className="text-6xl font-black leading-[0.95] tracking-tighter">Your Future <br /><span className="text-brand-accent-magenta">Unfolded</span>.</h2>
                <p className="text-white/40 text-2xl font-medium leading-relaxed">
                  Traditional education is static. MentorPet is dynamic. Our AI analyzes your learning DNA to create a journey that's uniquely yours.
                </p>
                <div className="pt-10 flex flex-col gap-8">
                   <div className="flex items-center gap-6 group">
                      <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-brand-accent-purple group-hover:scale-110 transition-all border border-white/5">
                        <Cpu size={24} />
                      </div>
                      <div>
                        <p className="text-lg font-black">Neural Roadmap Engine</p>
                        <p className="text-sm text-white/30">Paths optimized for your specific cognitive load.</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-6 group">
                      <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-brand-accent-magenta group-hover:scale-110 transition-all border border-white/5">
                        <Brain size={24} />
                      </div>
                      <div>
                        <p className="text-lg font-black">Real-time Knowledge Validation</p>
                        <p className="text-sm text-white/30">AI-driven quizzes that evolve as you learn.</p>
                      </div>
                   </div>
                </div>
             </div>
           </FadeInView>
           
           <FadeInView delay={0.2}>
             <div className="relative group">
                <div className="glass p-2 border-white/10 rounded-[3rem] overflow-hidden rotate-2 group-hover:rotate-0 transition-all duration-700 shadow-2xl">
                   <div className="bg-[#0a0a12] p-12 rounded-[2.5rem] space-y-12 min-h-[500px] flex flex-col justify-center">
                      <div className="space-y-8">
                        <div className="p-8 rounded-[2rem] bg-white/5 border border-white/5 hover:border-brand-accent-magenta/30 transition-all">
                           <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mb-4">Current Module</p>
                           <h4 className="text-3xl font-black">Quantum Computing Basics</h4>
                           <div className="w-full h-1.5 bg-white/5 rounded-full mt-6 overflow-hidden">
                              <motion.div initial={{ width: 0 }} whileInView={{ width: '70%' }} transition={{ duration: 2 }} className="h-full magenta-gradient"></motion.div>
                           </div>
                        </div>
                        <div className="p-8 rounded-[2rem] bg-brand-accent-magenta/10 border border-brand-accent-magenta/20">
                           <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60 mb-4">Career Projection</p>
                           <h4 className="text-3xl font-black italic">"Hiring potential: +45% in 2 months"</h4>
                        </div>
                      </div>
                   </div>
                </div>
                <div className="absolute -top-10 -right-10 w-64 h-64 magenta-gradient rounded-full blur-[100px] -z-10 opacity-20 animate-pulse"></div>
             </div>
           </FadeInView>
        </div>
      </section>

      {/* CTA Section */}
      <section id="community" className="py-40 px-6">
        <FadeInView>
          <div className="max-w-4xl mx-auto magenta-gradient rounded-[3rem] p-12 md:p-20 text-center shadow-[0_40px_100px_rgba(236,72,153,0.2)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-[100px] animate-pulse"></div>
            <h2 className="text-4xl md:text-5xl font-black mb-6 text-white tracking-tighter leading-tight">Your Legacy <br />Starts Now.</h2>
            <p className="text-white/90 text-xl md:text-2xl mb-12 max-w-2xl mx-auto font-black leading-tight">
              Join the elite circle of learners who choose intelligence over effort.
            </p>
            <Link to="/register" className="bg-white text-brand-accent-magenta px-12 py-5 rounded-2xl text-2xl font-black hover:scale-105 hover:shadow-2xl transition-all inline-flex items-center gap-4 group">
              Get Started <ArrowRight size={28} className="group-hover:translate-x-3 transition-transform" />
            </Link>
          </div>
        </FadeInView>
      </section>

      {/* Footer */}
      <footer className="py-32 px-8 border-t border-white/5 bg-[#030305] relative z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-20">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-10">
              <div className="w-12 h-12 magenta-gradient rounded-2xl flex items-center justify-center font-black text-3xl shadow-xl">M</div>
              <span className="text-3xl font-black tracking-tighter text-white">MENTORPET</span>
            </div>
            <p className="text-white/50 max-w-sm text-lg leading-relaxed font-medium">
              Revolutionizing professional education through the power of large language models and intuitive user design.
            </p>
          </div>
          <div>
            <h4 className="font-black text-xs uppercase tracking-[0.4em] text-white/80 mb-10">Platform</h4>
            <ul className="space-y-6 text-white/50 text-base font-black uppercase tracking-widest">
              <li><Link to="/dashboard/learn" className="hover:text-brand-accent-magenta transition-colors">Skill Hub</Link></li>
              <li><Link to="/dashboard/tutor" className="hover:text-brand-accent-magenta transition-colors">AI Tutor</Link></li>
              <li><Link to="/dashboard/jobs" className="hover:text-brand-accent-magenta transition-colors">Career Hub</Link></li>
              <li><Link to="/dashboard/roadmap" className="hover:text-brand-accent-magenta transition-colors">Roadmaps</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-black text-xs uppercase tracking-[0.4em] text-white/80 mb-10">Company</h4>
            <ul className="space-y-6 text-white/50 text-base font-black uppercase tracking-widest">
              <li><a href="#" className="hover:text-brand-accent-magenta transition-colors">Vision</a></li>
              <li><a href="#" className="hover:text-brand-accent-magenta transition-colors">Privacy</a></li>
              <li><a href="#" className="hover:text-brand-accent-magenta transition-colors">Terms</a></li>
              <li><a href="#" className="hover:text-brand-accent-magenta transition-colors">Support</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-32 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-10 text-white/30 text-xs font-black uppercase tracking-[0.3em]">
          <div>© 2024 MENTORPET. ALL RIGHTS RESERVED.</div>
          <div className="flex gap-16">
            <a href="#" className="hover:text-white hover:text-brand-accent-magenta transition-colors">Twitter / X</a>
            <a href="#" className="hover:text-white hover:text-brand-accent-magenta transition-colors">GitHub</a>
            <a href="#" className="hover:text-white hover:text-brand-accent-magenta transition-colors">Discord</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
