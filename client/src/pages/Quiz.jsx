import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Play, Clock, Trophy, RefreshCcw, ChevronRight, CheckCircle2, XCircle } from 'lucide-react';
import API from '../services/api';

const Quiz = () => {
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('Medium');
  const [loading, setLoading] = useState(false);
  const [quizData, setQuizData] = useState(null);
  const [currentStep, setCurrentStep] = useState(0); // 0: Config, 1: Quiz, 2: Results
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [answers, setAnswers] = useState([]);

  const startQuiz = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    try {
      const res = await API.post('/ai/quiz', { topic, difficulty });
      setQuizData(res.data.data.quizzes);
      setCurrentStep(1);
      setCurrentIndex(0);
      setScore(0);
      setAnswers([]);
    } catch (err) {
      console.error('Quiz error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (option) => {
    if (selectedOption !== null) return;
    setSelectedOption(option);
    const isCorrect = option === quizData[currentIndex].correctAnswer;
    if (isCorrect) setScore(s => s + 1);
    setAnswers([...answers, { question: currentIndex, selected: option, correct: isCorrect }]);

    setTimeout(() => {
      if (currentIndex < quizData.length - 1) {
        setCurrentIndex(c => c + 1);
        setSelectedOption(null);
      } else {
        setCurrentStep(2);
      }
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-bold">AI Quiz Generator</h2>
        <p className="text-white/40 mt-1">Test your knowledge with custom quizzes generated on any topic.</p>
      </div>

      <AnimatePresence mode="wait">
        {/* Step 0: Configuration */}
        {currentStep === 0 && (
          <motion.div 
            key="config"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass p-12 text-center space-y-8"
          >
            <div className="w-20 h-20 rounded-3xl bg-brand-accent-purple/10 flex items-center justify-center mx-auto border border-brand-accent-purple/20">
              <Sparkles className="text-brand-accent-purple" size={40} />
            </div>
            <div className="space-y-4 max-w-md mx-auto">
              <input 
                type="text" 
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Enter a topic (e.g. Ancient Rome, React Hooks)"
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-6 text-center text-xl font-bold focus:outline-none focus:ring-2 focus:ring-brand-accent-purple/50"
              />
              <div className="flex gap-4">
                {['Easy', 'Medium', 'Hard'].map((d) => (
                  <button 
                    key={d}
                    onClick={() => setDifficulty(d)}
                    className={`flex-1 py-3 rounded-xl font-bold transition-all ${
                      difficulty === d ? 'magenta-gradient shadow-lg' : 'bg-white/5 border border-white/10 text-white/40 hover:bg-white/10'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
            <button 
              onClick={startQuiz}
              disabled={!topic.trim() || loading}
              className="magenta-gradient px-12 py-5 rounded-full text-xl font-black shadow-2xl shadow-magenta-500/30 hover:scale-105 active:scale-95 disabled:opacity-50 transition-all flex items-center gap-3 mx-auto"
            >
              {loading ? 'Generating...' : <><Play size={24} fill="white" /> Generate Quiz</>}
            </button>
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
              <div className="flex items-center gap-3">
                <span className="text-white/40 font-bold uppercase tracking-widest text-xs">Question</span>
                <span className="text-2xl font-black">{currentIndex + 1} <span className="text-white/20">/ {quizData.length}</span></span>
              </div>
              <div className="flex items-center gap-6">
                 <div className="flex items-center gap-2">
                    <Clock size={18} className="text-brand-accent-purple" />
                    <span className="font-mono text-xl font-bold">12:45</span>
                 </div>
                 <div className="w-32 h-2 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full magenta-gradient transition-all duration-500" 
                      style={{ width: `${((currentIndex + 1) / quizData.length) * 100}%` }}
                    ></div>
                 </div>
              </div>
            </div>

            <div className="glass p-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-accent-purple/5 blur-3xl -z-10"></div>
              <h3 className="text-2xl md:text-3xl font-bold leading-tight text-center mb-12">
                {quizData[currentIndex].question}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quizData[currentIndex].options.map((option, idx) => {
                  const isSelected = selectedOption === option;
                  const isCorrect = option === quizData[currentIndex].correctAnswer;
                  const showResult = selectedOption !== null;

                  return (
                    <button 
                      key={idx}
                      onClick={() => handleAnswer(option)}
                      disabled={showResult}
                      className={`p-6 rounded-2xl text-left font-bold border-2 transition-all group relative overflow-hidden ${
                        !showResult 
                          ? 'bg-white/5 border-white/5 hover:border-brand-accent-purple/50 hover:bg-white/10' 
                          : isCorrect 
                            ? 'bg-green-500/10 border-green-500/50 text-green-400' 
                            : isSelected 
                              ? 'bg-red-500/10 border-red-500/50 text-red-400' 
                              : 'bg-white/5 border-white/5 opacity-50'
                      }`}
                    >
                      <span className="relative z-10">{option}</span>
                      {showResult && isCorrect && <CheckCircle2 className="absolute right-4 top-1/2 -translate-y-1/2" size={24} />}
                      {showResult && isSelected && !isCorrect && <XCircle className="absolute right-4 top-1/2 -translate-y-1/2" size={24} />}
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 2: Results */}
        {currentStep === 2 && (
          <motion.div 
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass p-16 text-center space-y-10"
          >
            <div className="relative inline-block">
               <div className="w-32 h-32 rounded-full border-8 border-brand-accent-purple/20 flex items-center justify-center">
                  <span className="text-4xl font-black">{Math.round((score / quizData.length) * 100)}%</span>
               </div>
               <Trophy className="absolute -top-4 -right-4 text-brand-accent-gold" size={40} />
            </div>

            <div>
              <h2 className="text-4xl font-black mb-2">Quiz Completed!</h2>
              <p className="text-white/40">You scored {score} out of {quizData.length} on <span className="text-white font-bold">{topic}</span>.</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <button 
                onClick={() => setCurrentStep(0)}
                className="flex-1 bg-white/5 border border-white/10 px-8 py-4 rounded-2xl font-bold hover:bg-white/10 transition-all flex items-center justify-center gap-2"
              >
                <RefreshCcw size={20} /> Try New Topic
              </button>
              <button 
                onClick={startQuiz}
                className="flex-1 magenta-gradient px-8 py-4 rounded-2xl font-bold shadow-lg shadow-magenta-500/20 hover:scale-105 transition-all flex items-center justify-center gap-2"
              >
                <Play size={20} fill="white" /> Retake Quiz
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Quiz;
