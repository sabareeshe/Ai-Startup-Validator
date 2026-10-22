// ============================================================
// pages/ChatAssistant.jsx — AI Chat Assistant
// ============================================================

import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiPaperAirplane, HiTrash, HiLightBulb, HiRefresh } from 'react-icons/hi';
import toast from 'react-hot-toast';
import api from '../services/api';
import Card from '../components/ui/Card';

const suggestedQuestions = [
  '💡 What features should my MVP include?',
  '📊 How should I price my product?',
  '🎯 What marketing channels should I focus on?',
  '💰 How should I prepare for fundraising?',
  '🏗️ What tech stack do you recommend?',
  '📈 How can I improve my business model?',
];

export default function ChatAssistant() {
  const [searchParams] = useSearchParams();
  const preSelectedStartup = searchParams.get('startup');

  const [startups, setStartups] = useState([]);
  const [selectedStartup, setSelectedStartup] = useState(preSelectedStartup || '');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchingStartups, setFetchingStartups] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => { fetchStartups(); }, []);
  useEffect(() => { if (selectedStartup) fetchChatHistory(); }, [selectedStartup]);
  useEffect(() => { scrollToBottom(); }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchStartups = async () => {
    try {
      const { data } = await api.get('/startups', { params: { limit: 100 } });
      setStartups(data.startups);
      if (!selectedStartup && data.startups.length > 0) {
        setSelectedStartup(data.startups[0]._id);
      }
    } catch (error) {
      toast.error('Failed to load startups');
    } finally {
      setFetchingStartups(false);
    }
  };

  const fetchChatHistory = async () => {
    try {
      const { data } = await api.get(`/chat/${selectedStartup}`);
      setMessages(data.chatHistory?.messages || []);
    } catch (error) {
      setMessages([]);
    }
  };

  const sendMessage = async (text = input) => {
    if (!text.trim() || !selectedStartup) return;
    if (!selectedStartup) {
      toast.error('Please select a startup first');
      return;
    }

    const userMsg = { role: 'user', content: text, timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const { data } = await api.post(`/chat/${selectedStartup}`, { message: text });
      const aiMsg = { role: 'assistant', content: data.message, timestamp: new Date() };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (error) {
      toast.error('Failed to get AI response');
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setLoading(false);
    }
  };

  const clearChat = async () => {
    try {
      await api.delete(`/chat/${selectedStartup}`);
      setMessages([]);
      toast.success('Chat cleared');
    } catch (error) {
      toast.error('Failed to clear chat');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const selectedStartupData = startups.find((s) => s._id === selectedStartup);

  if (fetchingStartups) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500" />
      </div>
    );
  }

  if (startups.length === 0) {
    return (
      <Card className="text-center py-16">
        <div className="text-6xl mb-4">🤖</div>
        <h2 className="text-xl font-semibold mb-2">No Startups to Chat About</h2>
        <p className="text-surface-500 mb-4">Create a startup idea first, then come back to chat with AI.</p>
      </Card>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
        <div className="flex-1">
          <h1 className="text-2xl font-bold">AI Chat Assistant</h1>
          <p className="text-sm text-surface-500">Ask follow-up questions about your startup</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedStartup}
            onChange={(e) => setSelectedStartup(e.target.value)}
            className="input-field text-sm w-full sm:w-64"
          >
            {startups.map((s) => (
              <option key={s._id} value={s._id}>{s.startupName}</option>
            ))}
          </select>
          <button onClick={clearChat} className="p-2.5 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors text-surface-500">
            <HiTrash className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Context Banner */}
      {selectedStartupData && (
        <div className="mb-4 p-3 rounded-xl bg-primary-50 dark:bg-primary-950/30 border border-primary-200 dark:border-primary-800 flex items-center gap-3">
          <HiLightBulb className="w-5 h-5 text-primary-500 flex-shrink-0" />
          <p className="text-sm text-primary-700 dark:text-primary-300">
            Chatting about <strong>{selectedStartupData.startupName}</strong> ({selectedStartupData.industry})
          </p>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">🤖</div>
            <h3 className="text-lg font-semibold mb-2">Start a Conversation</h3>
            <p className="text-surface-500 text-sm mb-6">Ask me anything about your startup idea</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-lg mx-auto">
              {suggestedQuestions.map((q) => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  className="text-left p-3 rounded-xl bg-surface-50 dark:bg-surface-800/50 hover:bg-surface-100 dark:hover:bg-surface-800 text-sm transition-colors border border-surface-200 dark:border-surface-700"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] ${msg.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'}`}>
                <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
              </div>
            </motion.div>
          ))
        )}

        {/* Typing indicator */}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="chat-bubble-ai">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-primary-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 rounded-full bg-primary-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 rounded-full bg-primary-500 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="glass-card-strong p-3 flex items-end gap-3">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about your startup..."
          rows={1}
          className="flex-1 resize-none bg-transparent border-none outline-none text-sm py-2 px-3 max-h-32 placeholder:text-surface-400"
          style={{ minHeight: '40px' }}
        />
        <button
          onClick={() => sendMessage()}
          disabled={loading || !input.trim()}
          className="p-3 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700 transition-all disabled:opacity-50 flex-shrink-0"
        >
          <HiPaperAirplane className="w-5 h-5 rotate-90" />
        </button>
      </div>
    </div>
  );
}
