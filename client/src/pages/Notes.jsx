import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, Sparkles, Copy, CheckCircle, Trash2, BookOpen } from 'lucide-react';
import API from '../services/api';

const Notes = () => {
  const [content, setContent] = useState('');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSummarize = async () => {
    if (!content.trim() || loading) return;
    setLoading(true);
    try {
      const res = await API.post('/ai/summarize', { content });
      setSummary(res.data.data);
    } catch (err) {
      console.error('Summarize error:', err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold">Notes & AI Summarizer</h2>
        <p className="text-white/40 mt-1">Transform long lectures and documents into concise summaries.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Area */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="font-bold flex items-center gap-2">
              <FileText size={18} className="text-brand-accent-purple" />
              Your Study Notes
            </h3>
            <button 
              onClick={() => setContent('')}
              className="text-white/20 hover:text-red-400 text-xs font-bold uppercase tracking-widest"
            >
              Clear
            </button>
          </div>
          <div className="glass h-[500px] p-1 flex flex-col">
            <textarea 
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste your lecture notes, article content, or transcript here..."
              className="flex-1 w-full bg-transparent p-6 outline-none resize-none text-[15px] leading-relaxed placeholder:text-white/10"
            />
            <div className="p-4 border-t border-white/5 flex items-center justify-between bg-white/[0.02]">
              <div className="flex gap-2">
                <button className="p-2 hover:bg-white/5 rounded-lg text-white/40" title="Upload File">
                  <Upload size={18} />
                </button>
                <button className="p-2 hover:bg-white/5 rounded-lg text-white/40" title="Templates">
                  <BookOpen size={18} />
                </button>
              </div>
              <button 
                onClick={handleSummarize}
                disabled={!content.trim() || loading}
                className="magenta-gradient px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-magenta-500/20 disabled:opacity-50 transition-all hover:scale-105"
              >
                {loading ? 'Processing...' : (
                  <>Summarize with AI <Sparkles size={18} /></>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Output Area */}
        <div className="space-y-4">
           <div className="flex items-center justify-between px-2">
            <h3 className="font-bold flex items-center gap-2 text-brand-accent-magenta">
              <Sparkles size={18} />
              AI Summary
            </h3>
            {summary && (
              <button 
                onClick={copyToClipboard}
                className="flex items-center gap-2 text-white/40 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors"
              >
                {copied ? <><CheckCircle size={14} className="text-green-500" /> Copied</> : <><Copy size={14} /> Copy</>}
              </button>
            )}
          </div>
          <div className="glass h-[500px] relative overflow-hidden bg-white/[0.01]">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-accent-purple/5 to-transparent pointer-events-none"></div>
            <div className="h-full overflow-y-auto p-8 relative z-10 prose prose-invert max-w-none">
              {summary ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="whitespace-pre-wrap text-[15px] leading-relaxed text-white/80"
                >
                  {summary}
                </motion.div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-12">
                  <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-6 border border-white/5">
                    <Sparkles className="text-white/20" size={32} />
                  </div>
                  <h4 className="font-bold text-lg mb-2 text-white/40">Ready to Summarize</h4>
                  <p className="text-sm text-white/20 max-w-xs">
                    Paste your notes on the left and click "Summarize" to see the magic happen.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notes;
