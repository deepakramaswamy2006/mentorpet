import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  Upload, 
  Search, 
  Sparkles, 
  Trash2, 
  MessageSquare, 
  ChevronRight,
  Send,
  Loader2,
  X,
  FileIcon,
  ChevronLeft,
  Book
} from 'lucide-react';
import API from '../services/api';

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [question, setQuestion] = useState('');
  const [asking, setAsking] = useState(false);
  const [chat, setChat] = useState([]);
  const [view, setView] = useState('list'); // 'list' or 'detail'
  const chatEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const fetchNotes = async () => {
    try {
      const res = await API.get('/notes');
      setNotes(res.data.data);
    } catch (err) {
      console.error('Fetch notes error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat, asking]);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);
    try {
      const res = await API.post('/notes/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setNotes([res.data.data, ...notes]);
      setSelectedNote(res.data.data);
      setView('detail');
    } catch (err) {
      alert('Upload failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setUploading(false);
    }
  };

  const handleAsk = async (e) => {
    e.preventDefault();
    if (!question.trim() || !selectedNote || asking) return;

    const userQ = { role: 'user', content: question };
    setChat(prev => [...prev, userQ]);
    setQuestion('');
    setAsking(true);

    try {
      const res = await API.post(`/notes/${selectedNote._id}/ask`, { question: userQ.content });
      setChat(prev => [...prev, { role: 'assistant', content: res.data.data }]);
    } catch (err) {
      setChat(prev => [...prev, { role: 'assistant', content: 'Sorry, I failed to analyze the document. Please try again.' }]);
    } finally {
      setAsking(false);
    }
  };

  const deleteNote = async (id, e) => {
    e.stopPropagation();
    if (!confirm('Are you sure?')) return;
    try {
      await API.delete(`/notes/${id}`);
      setNotes(notes.filter(n => n._id !== id));
      if (selectedNote?._id === id) {
        setSelectedNote(null);
        setChat([]);
        setView('list');
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-140px)] lg:h-[calc(100vh-180px)] flex flex-col gap-6 lg:gap-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className={view === 'detail' ? 'hidden sm:block' : 'block'}>
          <h2 className="text-2xl lg:text-3xl font-bold">Smart Notes</h2>
          <p className="text-sm text-white/40 mt-1">AI-powered document intelligence.</p>
        </div>
        
        {view === 'detail' && (
          <button 
            onClick={() => setView('list')}
            className="sm:hidden flex items-center gap-2 text-brand-accent-magenta font-bold"
          >
            <ChevronLeft size={20} /> Back to Library
          </button>
        )}

        <button 
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="w-full sm:w-auto magenta-gradient px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:scale-105 transition-all shadow-lg shadow-magenta-500/20 disabled:opacity-50"
        >
          {uploading ? <Loader2 className="animate-spin" size={20} /> : <Upload size={20} />}
          {uploading ? 'Analyzing...' : 'Upload PDF'}
        </button>
        <input 
          type="file" 
          hidden 
          ref={fileInputRef} 
          accept=".pdf,.txt,.doc,.docx"
          onChange={handleFileUpload}
        />
      </div>

      <div className="flex-1 flex gap-8 overflow-hidden relative">
        {/* Notes List (Hidden on mobile detail view) */}
        <div className={`
          ${view === 'detail' ? 'hidden lg:flex' : 'flex'}
          w-full lg:w-80 flex-col gap-4 overflow-hidden
        `}>
          <h3 className="text-xs font-black uppercase tracking-widest text-white/20 px-2 flex items-center gap-2">
            <Book size={14} /> My Library
          </h3>
          <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
            {loading ? (
              <div className="p-8 text-white/20 animate-pulse text-center glass rounded-2xl">Scanning library...</div>
            ) : notes.length > 0 ? (
              notes.map((note) => (
                <motion.div
                  key={note._id}
                  layout
                  onClick={() => {
                    setSelectedNote(note);
                    setChat([]);
                    setView('detail');
                  }}
                  className={`glass p-4 cursor-pointer transition-all border-l-4 group ${
                    selectedNote?._id === note._id 
                      ? 'border-brand-accent-magenta bg-white/5 shadow-xl' 
                      : 'border-transparent hover:border-white/10'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="p-2 bg-white/5 rounded-lg text-brand-accent-magenta">
                      <FileIcon size={18} />
                    </div>
                    <button 
                      onClick={(e) => deleteNote(note._id, e)}
                      className="p-1.5 text-white/0 group-hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <h4 className="font-bold text-sm truncate">{note.title}</h4>
                  <p className="text-[10px] text-white/40 mt-1 uppercase tracking-widest font-black">{new Date(note.createdAt).toLocaleDateString()}</p>
                </motion.div>
              ))
            ) : (
              <div className="glass p-10 text-center border-dashed border-2 border-white/5 flex flex-col items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                  <FileText className="text-white/20" />
                </div>
                <p className="text-white/20 text-xs font-bold uppercase tracking-widest">No documents found</p>
              </div>
            )}
          </div>
        </div>

        {/* Workspace Area (Shown as primary on mobile detail view) */}
        <div className={`
          ${view === 'list' ? 'hidden lg:flex' : 'flex'}
          flex-1 flex-col gap-6 overflow-hidden
        `}>
          <AnimatePresence mode="wait">
            {selectedNote ? (
              <motion.div 
                key={selectedNote._id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex-1 flex flex-col lg:flex-row gap-6 overflow-hidden"
              >
                {/* Document Summary */}
                <div className="lg:w-1/2 flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar">
                  <div className="glass p-6 lg:p-8 space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl magenta-gradient flex items-center justify-center shadow-lg shadow-magenta-500/20">
                        <Sparkles size={28} className="text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-black tracking-tight">AI Insights</h3>
                        <p className="text-[10px] text-white/40 uppercase font-black tracking-[0.2em] truncate max-w-[200px]">{selectedNote.title}</p>
                      </div>
                    </div>
                    <div className="prose prose-invert max-w-none">
                      <p className="text-white/80 leading-relaxed text-sm lg:text-base whitespace-pre-wrap">{selectedNote.summary}</p>
                    </div>
                  </div>
                </div>

                {/* Q&A Chat */}
                <div className="lg:w-1/2 glass flex flex-col overflow-hidden border-white/10 shadow-2xl relative">
                  <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-brand-accent-magenta animate-pulse"></div>
                      <span className="font-black text-[10px] uppercase tracking-widest">Interactive Context</span>
                    </div>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                    {chat.length === 0 && (
                      <div className="h-full flex flex-col items-center justify-center text-center opacity-10 space-y-4 px-10">
                        <MessageSquare size={64} />
                        <p className="text-sm font-bold uppercase tracking-widest">Ask the Document</p>
                      </div>
                    )}
                    {chat.map((msg, i) => (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={i} 
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[90%] p-4 rounded-2xl text-sm ${
                          msg.role === 'user' 
                            ? 'bg-brand-accent-magenta/20 text-white border border-brand-accent-magenta/30 shadow-xl' 
                            : 'bg-white/5 border border-white/10 text-white/80'
                        }`}>
                          {msg.content}
                        </div>
                      </motion.div>
                    ))}
                    {asking && (
                      <div className="flex justify-start">
                        <div className="bg-white/5 p-4 rounded-2xl flex gap-1.5 border border-white/5">
                          <span className="w-1.5 h-1.5 bg-brand-accent-magenta rounded-full animate-bounce"></span>
                          <span className="w-1.5 h-1.5 bg-brand-accent-magenta rounded-full animate-bounce [animation-delay:0.2s]"></span>
                          <span className="w-1.5 h-1.5 bg-brand-accent-magenta rounded-full animate-bounce [animation-delay:0.4s]"></span>
                        </div>
                      </div>
                    )}
                    <div ref={chatEndRef} />
                  </div>

                  <form onSubmit={handleAsk} className="p-4 bg-white/2 border-t border-white/5 flex gap-2">
                    <input 
                      type="text" 
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      placeholder="Ask a question..."
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-brand-accent-magenta/50 transition-all"
                    />
                    <button 
                      type="submit"
                      disabled={asking || !question.trim()}
                      className="magenta-gradient p-3 rounded-xl disabled:opacity-50 shadow-lg shadow-magenta-500/20"
                    >
                      <Send size={20} />
                    </button>
                  </form>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex-1 flex flex-col items-center justify-center text-center space-y-6"
              >
                <div className="w-32 h-32 rounded-full border-4 border-dashed border-white/10 flex items-center justify-center">
                  <Upload size={48} className="text-white/10" />
                </div>
                <div>
                  <h3 className="text-xl font-black">No Material Selected</h3>
                  <p className="text-sm text-white/40 max-w-xs mx-auto mt-2">Select a document from your library or upload a new one to begin AI analysis.</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Notes;
