import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Play, 
  Clock, 
  Trophy, 
  RefreshCcw, 
  ChevronRight, 
  CheckCircle2, 
  XCircle,
  HelpCircle,
  Award,
  Check,
  X,
  Loader2,
  ArrowLeft
} from 'lucide-react';
import API from '../services/api';

const Quiz = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const passedTopic = location.state?.topic || '';
  
  const [topic, setTopic] = useState(passedTopic);
  const [difficulty, setDifficulty] = useState('Medium');
  const [loading, setLoading] = useState(false);
  const [quizData, setQuizData] = useState(null);
  const [currentStep, setCurrentStep] = useState(0); // 0: Config, 1: Quiz, 2: Results
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [userAnswers, setUserAnswers] = useState([]);

  useEffect(() => {
    if (passedTopic) {
      startQuiz(passedTopic);
    }
  }, [passedTopic]);

  const startQuiz = async (topicToUse = topic) => {
    const finalTopic = topicToUse || topic;
    if (!finalTopic.trim()) return;
    
    setLoading(true);
    try {
      const res = await API.post('/ai/quiz', { topic: finalTopic, difficulty });
      setQuizData(res.data.data.quizzes);
      setCurrentStep(1);
      setCurrentIndex(0);
      setScore(0);
      setUserAnswers([]);
      setSelectedOption(null);
    } catch (err) {
      console.error('Quiz error:', err);
      alert('Failed to generate quiz. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (option) => {
    if (selectedOption !== null) return;
    setSelectedOption(option);
    
    const currentQuestion = quizData[currentIndex];
    const isCorrect = option === currentQuestion.correctAnswer;
    
    if (isCorrect) setScore(s => s + 1);
    
    setUserAnswers(prev => [...prev, {
      question: currentQuestion.question,
      selected: option,
      correct: currentQuestion.correctAnswer,
      isCorrect: isCorrect,
      options: currentQuestion.options
    }]);

    setTimeout(() => {
      if (currentIndex < quizData.length - 1) {
        setCurrentIndex(c => c + 1);
        setSelectedOption(null);
      } else {
        setCurrentStep(2);
      }
    }, 400);
  };

  const handleRetake = () => {
    setScore(0);
    setCurrentIndex(0);
    setUserAnswers([]);
    setSelectedOption(null);
    setCurrentStep(1);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-white/5 rounded-full transition-all text-white/40 hover:text-white"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h2 className="text-3xl font-bold">Skill Assessment</h2>
            <p className="text-white/40 mt-1">{passedTopic ? `Testing your knowledge in ${passedTopic}` : 'Evaluate your understanding.'}</p>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* Step 0: Configuration (Only shown if no topic passed) */}
        {currentStep === 0 && !passedTopic && (
          <motion.div 
            key="config"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass p-12 text-center space-y-8 border-white/10"
          >
            <div className="w-24 h-24 rounded-3xl bg-brand-accent-purple/10 flex items-center justify-center mx-auto border border-brand-accent-purple/20 relative">
               <Sparkles className="text-brand-accent-purple" size={48} />
               <div className="absolute -top-2 -right-2 bg-brand-accent-magenta text-[10px] font-black px-2 py-1 rounded-lg">10 Qs</div>
            </div>
            
            <div className="space-y-6 max-w-xl mx-auto">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-white/40">Enter Topic</label>
                <input 
                  type="text" 
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. Modern Physics, React Hooks"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-6 text-center text-xl font-bold focus:outline-none focus:ring-2 focus:ring-brand-accent-purple/50 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-white/40">Difficulty Level</label>
                <div className="flex gap-4">
                  {['Low', 'Medium', 'High'].map((d) => (
                    <button 
                      key={d}
                      onClick={() => setDifficulty(d)}
                      className={`flex-1 py-4 rounded-xl font-bold transition-all border-2 ${
                        difficulty === d 
                          ? 'magenta-gradient border-transparent shadow-lg shadow-magenta-500/20' 
                          : 'bg-white/5 border-white/5 text-white/40 hover:bg-white/10'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button 
              onClick={() => startQuiz()}
              disabled={!topic.trim() || loading}
              className="magenta-gradient px-12 py-5 rounded-full text-xl font-black shadow-2xl shadow-magenta-500/30 hover:scale-105 active:scale-95 disabled:opacity-50 transition-all flex items-center gap-3 mx-auto"
            >
              {loading ? (
                <div className="flex items-center gap-3">
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                    <RefreshCcw size={24} />
                  </motion.div>
                  Generating...
                </div>
              ) : (
                <><Play size={24} fill="white" /> Start Quiz</>
              )}
            </button>
          </motion.div>
        )}

        {/* Loading State for Passed Topic */}
        {currentStep === 0 && passedTopic && loading && (
          <motion.div 
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-40 space-y-6"
          >
            <div className="relative">
              <div className="w-20 h-20 border-4 border-white/5 rounded-full"></div>
              <div className="w-20 h-20 border-4 border-brand-accent-magenta border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
            </div>
            <p className="text-white/40 font-bold uppercase tracking-widest animate-pulse">AI is crafting your {passedTopic} quiz...</p>
          </motion.div>
        )}

        {/* Step 1: Taking Quiz */}
        {currentStep === 1 && quizData && (
          <motion.div 
            key="quiz"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-8"
          >
            <div className="flex items-center justify-between px-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl glass flex items-center justify-center font-black text-xl border-white/10">
                  {currentIndex + 1}
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/20">Progress</span>
                  <div className="flex gap-1 mt-1">
                    {quizData.map((_, i) => (
                      <div key={i} className={`h-1.5 w-6 rounded-full transition-all ${
                        i < currentIndex ? 'bg-brand-accent-magenta' : 
                        i === currentIndex ? 'bg-white/40' : 'bg-white/5'
                      }`}></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="glass p-12 relative overflow-hidden min-h-[400px] flex flex-col justify-center">
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand-accent-purple/5 blur-[100px] -z-10"></div>
              <h3 className="text-2xl md:text-3xl font-bold leading-tight text-center mb-12 max-w-3xl mx-auto">
                {quizData[currentIndex].question}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto w-full">
                {quizData[currentIndex].options.map((option, idx) => {
                  const isSelected = selectedOption === option;

                  return (
                    <button 
                      key={idx}
                      onClick={() => handleAnswer(option)}
                      disabled={selectedOption !== null}
                      className={`p-6 rounded-2xl text-left font-bold border-2 transition-all group flex items-center justify-between ${
                        isSelected 
                          ? 'bg-brand-accent-purple/20 border-brand-accent-purple text-white shadow-xl' 
                          : 'bg-white/5 border-white/5 hover:border-brand-accent-purple/50 hover:bg-white/10 text-white/60'
                      }`}
                    >
                      <span className="relative z-10">{option}</span>
                      {isSelected && <div className="w-2 h-2 rounded-full bg-brand-accent-magenta animate-ping"></div>}
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 2: Results & Review */}
        {currentStep === 2 && (
          <motion.div 
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-10"
          >
            {/* Score Overview */}
            <div className="glass p-16 text-center space-y-10">
              <div className="relative inline-block">
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", damping: 12 }}
                  className="w-40 h-40 rounded-full border-[10px] border-white/5 flex flex-col items-center justify-center bg-white/2"
                >
                  <span className="text-5xl font-black">{score}<span className="text-2xl text-white/20">/10</span></span>
                  <span className="text-xs font-black uppercase tracking-widest text-white/40 mt-1">Final Score</span>
                </motion.div>
                <div className="absolute -top-4 -right-4 w-12 h-12 rounded-2xl magenta-gradient flex items-center justify-center shadow-lg">
                  <Award className="text-white" size={24} />
                </div>
              </div>

              <div>
                <h2 className="text-4xl font-black mb-2">Assessment Complete</h2>
                <p className="text-white/40">Performance Level: <span className="text-white font-bold">{score >= 8 ? 'Exceptional' : score >= 5 ? 'Good Progress' : 'Needs Review'}</span></p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <button 
                  onClick={() => navigate('/dashboard/learn')}
                  className="flex-1 bg-white/5 border border-white/10 px-8 py-4 rounded-2xl font-bold hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                >
                  <ChevronRight className="rotate-180" size={20} /> Back to Learning
                </button>
                <button 
                  onClick={handleRetake}
                  className="flex-1 magenta-gradient px-8 py-4 rounded-2xl font-bold shadow-lg shadow-magenta-500/20 hover:scale-105 transition-all flex items-center justify-center gap-2"
                >
                  <Play size={20} fill="white" /> Retake Test
                </button>
              </div>
            </div>

            {/* Detailed Review Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-4 px-2">
                <HelpCircle size={24} className="text-brand-accent-purple" />
                <h3 className="text-xl font-bold">Review Your Answers</h3>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {userAnswers.map((answer, i) => (
                  <div key={i} className={`glass p-6 border-l-8 ${answer.isCorrect ? 'border-green-500/50' : 'border-red-500/50'}`}>
                    <div className="flex justify-between items-start gap-4 mb-4">
                      <div className="flex-1">
                        <span className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-1 block">Question {i + 1}</span>
                        <h4 className="font-bold text-lg">{answer.question}</h4>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${answer.isCorrect ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                        {answer.isCorrect ? 'Correct' : 'Incorrect'}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {answer.options.map((opt, idx) => {
                        const isCorrectOpt = opt === answer.correct;
                        const isSelectedOpt = opt === answer.selected;
                        
                        return (
                          <div key={idx} className={`p-4 rounded-xl text-sm font-medium border ${
                            isCorrectOpt 
                              ? 'bg-green-500/10 border-green-500/20 text-green-400' 
                              : isSelectedOpt 
                                ? 'bg-red-500/10 border-red-500/20 text-red-400'
                                : 'bg-white/5 border-white/10 text-white/40'
                          }`}>
                            <div className="flex items-center justify-between">
                              <span>{opt}</span>
                              {isCorrectOpt && <CheckCircle2 size={16} />}
                              {isSelectedOpt && !isCorrectOpt && <XCircle size={16} />}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Quiz;
