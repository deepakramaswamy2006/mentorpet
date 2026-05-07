import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, User, PawPrint, Sparkles, Trash2, Command, Paperclip, Loader2, FileText, X } from 'lucide-react';
import API from '../services/api';

const AITutor = () => {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I am MENTORPET AI. How can I help you with your studies today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

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
      
      const note = res.data.data;
      setSelectedNote(note);
      
      // Add a system message about the upload
      setMessages(prev => [...prev, 
        { role: 'user', content: `Uploaded document: ${file.name}` },
        { role: 'assistant', content: `I've analyzed your document: **${note.title}**. \n\n**Summary:**\n${note.summary}\n\nYou can now ask me any questions about this document!` }
      ]);
    } catch (err) {
      console.error('Upload Error:', err);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I failed to upload the document. Please try again.' }]);
    } finally {
      setUploading(false);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      let res;
      if (selectedNote) {
        // If a document is selected, ask about it
        res = await API.post(`/notes/${selectedNote._id}/ask`, { question: input });
      } else {
        // Otherwise use general tutor
        const history = messages.slice(-5);
        res = await API.post('/ai/tutor', { message: input, history });
      }
      
      setMessages(prev => [...prev, { role: 'assistant', content: res.data.data }]);
    } catch (err) {
      console.error('AI Tutor Error:', err);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-160px)] flex flex-col glass overflow-hidden relative border-white/5">
      {/* Chat Header */}
      <div className="px-8 py-4 border-b border-white/5 flex items-center justify-between bg-white/5 backdrop-blur-xl z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full magenta-gradient flex items-center justify-center shadow-lg shadow-magenta-500/20">
            <PawPrint className="text-white" size={20} />
          </div>
          <div>
            <h3 className="font-bold text-lg leading-tight">MENTORPET AI Tutor</h3>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-xs text-white/40 font-medium">Llama 3.3-70B Powered</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {selectedNote && (
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-brand-accent-magenta/10 border border-brand-accent-magenta/20 rounded-full text-brand-accent-magenta animate-fade-in">
              <FileText size={14} />
              <span className="text-xs font-bold truncate max-w-[150px]">{selectedNote.title}</span>
              <button onClick={() => setSelectedNote(null)} className="hover:text-white ml-1">
                <X size={14} />
              </button>
            </div>
          )}
          <button 
            onClick={() => {
              setMessages([{ role: 'assistant', content: 'Hello! How can I help you with your studies today?' }]);
              setSelectedNote(null);
            }}
            className="text-white/20 hover:text-red-400 transition-all p-2 hover:bg-white/5 rounded-lg"
            title="Clear Conversation"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-100">
        <AnimatePresence>
          {messages.map((msg, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex gap-4 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center shadow-md ${
                  msg.role === 'user' ? 'bg-white/10' : 'magenta-gradient'
                }`}>
                  {msg.role === 'user' ? <User size={16} /> : <PawPrint size={16} />}
                </div>
                <div className={`p-5 rounded-2xl ${
                  msg.role === 'user' 
                    ? 'bg-brand-accent-purple/20 border border-brand-accent-purple/30 text-white shadow-lg' 
                    : 'glass border-white/10 text-white/90 leading-relaxed'
                }`}>
                  <p className="whitespace-pre-wrap text-[15px]">{msg.content}</p>
                </div>
              </div>
            </motion.div>
          ))}
          {loading && (
            <motion.div 
              key="loading-bubble"
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0 }}
              className="flex justify-start"
            >
              <div className="flex gap-4 max-w-[80%]">
                <div className="w-8 h-8 rounded-full magenta-gradient flex items-center justify-center">
                  <PawPrint size={16} />
                </div>
                <div className="glass p-4 rounded-2xl border-white/10 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </AnimatePresence>
      </div>

      {/* Input Area */}
      <div className="p-8 border-t border-white/5 bg-brand-bg/50 backdrop-blur-xl">
        <form onSubmit={handleSend} className="relative max-w-4xl mx-auto flex items-center gap-4">
          <div className="relative flex-1">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 text-white/40 hover:text-brand-accent-magenta transition-all disabled:opacity-50"
              title="Upload Document"
            >
              {uploading ? <Loader2 className="animate-spin" size={20} /> : <Paperclip size={20} />}
            </button>
            <input 
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept=".pdf,.txt,.doc,.docx"
              onChange={handleFileUpload}
            />
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading || uploading}
              placeholder={selectedNote ? "Ask about the document..." : "Ask anything about your studies..."}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-14 pr-24 focus:outline-none focus:ring-2 focus:ring-brand-accent-purple/50 transition-all text-white placeholder:text-white/20"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-3">
               <div className="hidden sm:flex items-center gap-1 text-[10px] font-black text-white/20 border border-white/5 px-2 py-1 rounded bg-white/5 uppercase tracking-widest">
                 <Command size={10} /> Enter
               </div>
               <button 
                 type="submit"
                 disabled={loading || !input.trim() || uploading}
                 className="w-12 h-12 rounded-xl magenta-gradient flex items-center justify-center shadow-lg shadow-magenta-500/20 hover:scale-105 active:scale-95 disabled:opacity-50 transition-all"
               >
                 <Send size={20} className="text-white ml-0.5" />
               </button>
            </div>
          </div>
        </form>
        <p className="text-center text-[10px] text-white/20 mt-4 uppercase tracking-[0.2em] font-bold">
          <Sparkles size={10} className="inline mr-1" /> MENTORPET AI can make mistakes. Verify important information.
        </p>
      </div>
    </div>
  );
};

export default AITutor;
