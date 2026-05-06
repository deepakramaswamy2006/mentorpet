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
  FileIcon
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
  }, [chat]);

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
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-180px)] flex flex-col gap-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Smart Notes</h2>
          <p className="text-white/40 mt-1">Upload documents and interact with them using AI.</p>
        </div>
        <button 
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="magenta-gradient px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:scale-105 transition-all shadow-lg shadow-magenta-500/20 disabled:opacity-50"
        >
          {uploading ? <Loader2 className="animate-spin" /> : <Upload size={20} />}
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

      <div className="flex-1 flex gap-8 overflow-hidden">
        {/* Notes List */}
        <div className="w-80 flex flex-col gap-4">
          <h3 className="text-sm font-black uppercase tracking-widest text-white/20 px-2">Library</h3>
          <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
            {loading ? (
              <div className="p-4 text-white/20 animate-pulse text-center">Loading library...</div>
            ) : notes.length > 0 ? (
              notes.map((note) => (
                <motion.div
                  key={note._id}
                  layout
                  onClick={() => {
                    setSelectedNote(note);
                    setChat([]);
                  }}
                  className={`glass p-4 cursor-pointer transition-all border-l-4 group ${
                    selectedNote?._id === note._id 
                      ? 'border-brand-accent-magenta bg-white/5 shadow-lg' 
                      : 'border-transparent hover:border-white/10'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <FileIcon size={18} className="text-brand-accent-magenta" />
                    <Trash2 
                      size={14} 
                      onClick={(e) => deleteNote(note._id, e)}
                      className="text-white/0 group-hover:text-red-400 transition-all cursor-pointer" 
                    />
                  </div>
                  <h4 className="font-bold text-sm truncate">{note.title}</h4>
                  <p className="text-[10px] text-white/40 mt-1">{new Date(note.createdAt).toLocaleDateString()}</p>
                </motion.div>
              ))
            ) : (
              <div className="glass p-8 text-center border-dashed">
                <p className="text-white/20 text-sm italic">No documents yet.</p>
              </div>
            )}
          </div>
        </div>

        {/* Workspace Area */}
        <div className="flex-1 flex flex-col gap-6 overflow-hidden">
          <AnimatePresence mode="wait">
            {selectedNote ? (
              <motion.div 
                key={selectedNote._id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex-1 flex gap-6 overflow-hidden"
              >
                {/* Document Detail & Summary */}
                <div className="w-1/2 flex flex-col gap-6 overflow-y-auto pr-4 custom-scrollbar">
                  <div className="glass p-8 space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl magenta-gradient flex items-center justify-center">
                        <Sparkles size={24} />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">AI Summary</h3>
                        <p className="text-xs text-white/40 uppercase tracking-widest">{selectedNote.title}</p>
                      </div>
                    </div>
                    <div className="prose prose-invert max-w-none">
                      <p className="text-white/80 leading-relaxed whitespace-pre-wrap">{selectedNote.summary}</p>
                    </div>
                  </div>
                </div>

                {/* Q&A Chat */}
                <div className="w-1/2 glass flex flex-col overflow-hidden border-white/5">
                  <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/5">
                    <div className="flex items-center gap-2">
                      <MessageSquare size={16} className="text-brand-accent-magenta" />
                      <span className="font-bold text-sm tracking-tight">Chat with Document</span>
                    </div>
                    <span className="text-[10px] uppercase font-bold text-white/20">Ask anything</span>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                    {chat.length === 0 && (
                      <div className="h-full flex flex-col items-center justify-center text-center opacity-20 space-y-4 px-10">
                        <MessageSquare size={48} />
                        <p className="text-sm">Ask questions about definitions, concepts, or specific details within the text.</p>
                      </div>
                    )}
                    {chat.map((msg, i) => (
                      <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                          msg.role === 'user' 
                            ? 'bg-brand-accent-magenta/20 text-white border border-brand-accent-magenta/30 shadow-lg' 
                            : 'glass border-white/10 text-white/80'
                        }`}>
                          {msg.content}
                        </div>
                      </div>
                    ))}
                    {asking && (
                      <div className="flex justify-start">
                        <div className="glass p-3 rounded-2xl flex gap-1">
                          <span className="w-1.5 h-1.5 bg-white/20 rounded-full animate-bounce"></span>
                          <span className="w-1.5 h-1.5 bg-white/20 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                          <span className="w-1.5 h-1.5 bg-white/20 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                        </div>
                      </div>
                    )}
                    <div ref={chatEndRef} />
                  </div>

                  <form onSubmit={handleAsk} className="p-4 bg-white/5 border-t border-white/5 flex gap-2">
                    <input 
                      type="text" 
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      placeholder="Ask a question..."
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:ring-1 focus:ring-brand-accent-magenta/50"
                    />
                    <button 
                      type="submit"
                      disabled={asking || !question.trim()}
                      className="magenta-gradient p-2.5 rounded-xl disabled:opacity-50"
                    >
                      <Send size={18} />
                    </button>
                  </form>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                className="flex-1 flex flex-col items-center justify-center text-center space-y-6"
              >
                <div className="w-24 h-24 rounded-full border-2 border-dashed border-white/20 flex items-center justify-center">
                  <Upload size={40} className="text-white/20" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">No Document Selected</h3>
                  <p className="text-sm text-white/40 max-w-xs mx-auto mt-2">Upload a study material or select one from your library to start interacting.</p>
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
