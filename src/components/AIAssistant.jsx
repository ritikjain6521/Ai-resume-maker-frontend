import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { MessageCircle, X, Send, Mic, MicOff, Volume2, VolumeX, Loader2, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const API = `\${import.meta.env.VITE_API_URL || (import.meta.env.PROD ? 'https://ai-resume-maker-backend-ve6d.onrender.com' : 'http://localhost:5000')}/api`;

const AIAssistant = () => {
  const userInfo = useSelector((state) => state.auth.userInfo);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi there! I am your AI Career Coach. How can I help you with your resume or job search today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);

  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  const isPremiumOrPro = userInfo?.plan === 'Premium' || userInfo?.plan === 'Pro';

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
      };
      recognition.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };
      recognition.onend = () => setIsListening(false);

      recognitionRef.current = recognition;
    }
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      recognitionRef.current?.start();
    }
  };

  const speak = (text) => {
    if (!voiceEnabled || !window.speechSynthesis) return;
    window.speechSynthesis.cancel(); // Stop any current speech
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  const handleSend = async (textOverride) => {
    const textToSend = typeof textOverride === 'string' ? textOverride : input;
    if (!textToSend.trim()) return;

    const newMessages = [...messages, { role: 'user', content: textToSend }];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch(`${API}/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
        credentials: 'include'
      });

      const data = await res.json();
      if (res.ok) {
        setMessages([...newMessages, { role: 'assistant', content: data.reply }]);
        speak(data.reply);
      } else {
        const errMsg = data.message || 'An error occurred. Please try again.';
        setMessages([...newMessages, { role: 'assistant', content: `⚠️ ${errMsg}` }]);
      }
    } catch (error) {
      setMessages([...newMessages, { role: 'assistant', content: '⚠️ Network error — make sure the backend server is running and try again.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!userInfo) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-16 right-0 w-[350px] sm:w-[400px] h-[500px] bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-primary-600 p-4 flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                  <MessageCircle size={18} />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">AI Career Coach</h3>
                  <p className="text-xs text-primary-100">{isPremiumOrPro ? 'Premium Assistant' : 'Preview Mode'}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {isPremiumOrPro && (
                  <button 
                    onClick={() => {
                      setVoiceEnabled(!voiceEnabled);
                      if (voiceEnabled) window.speechSynthesis?.cancel();
                    }}
                    className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                    title={voiceEnabled ? "Mute Voice" : "Enable Voice"}
                  >
                    {voiceEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
                  </button>
                )}
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* If not Premium/Pro, show upgrade prompt */}
            {!isPremiumOrPro ? (
              <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-slate-50 dark:bg-slate-900/50">
                <div className="w-16 h-16 rounded-2xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mb-4">
                  <Lock size={28} className="text-primary-500" />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-2">Premium Feature</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
                  The AI Career Coach is available for <strong>Premium</strong> and <strong>Pro</strong> plan members. Upgrade to get unlimited AI-powered career coaching.
                </p>
                <Link
                  to="/pricing"
                  className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-2.5 rounded-xl font-semibold text-sm transition-colors shadow-lg shadow-primary-500/25"
                  onClick={() => setIsOpen(false)}
                >
                  Upgrade to Premium →
                </Link>
                <p className="text-xs text-slate-400 mt-3">Starting at ₹299/month</p>
              </div>
            ) : (
              <>
                {/* Chat Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-900/50">
                  {messages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div 
                        className={`max-w-[80%] rounded-2xl p-3 text-sm shadow-sm ${
                          msg.role === 'user' 
                            ? 'bg-primary-600 text-white rounded-tr-sm' 
                            : 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-100 dark:border-slate-600 rounded-tl-sm'
                        }`}
                      >
                        {msg.content}
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-white dark:bg-slate-700 p-3 rounded-2xl rounded-tl-sm shadow-sm border border-slate-100 dark:border-slate-600">
                        <Loader2 size={16} className="animate-spin text-primary-500" />
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700">
                  <div className="relative flex items-center gap-2">
                    <button
                      type="button"
                      onClick={toggleListening}
                      className={`p-2.5 rounded-full transition-colors flex-shrink-0 ${
                        isListening 
                          ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 animate-pulse' 
                          : 'bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-400 dark:hover:bg-slate-600'
                      }`}
                      title={isListening ? "Stop listening" : "Start Voice Input"}
                    >
                      {isListening ? <MicOff size={18} /> : <Mic size={18} />}
                    </button>
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                      placeholder={isListening ? "Listening..." : "Type a message..."}
                      className="flex-1 bg-slate-100 dark:bg-slate-700/50 border-none rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                    />
                    <button
                      onClick={handleSend}
                      disabled={!input.trim() || isLoading}
                      className="p-2.5 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl transition-colors shadow-md shadow-primary-500/20 flex-shrink-0"
                    >
                      <Send size={18} />
                    </button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-primary-600 hover:bg-primary-700 text-white rounded-full shadow-xl shadow-primary-500/30 flex items-center justify-center transition-colors relative"
        title={isPremiumOrPro ? "Open AI Career Coach" : "AI Career Coach (Premium)"}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
        {!isPremiumOrPro && !isOpen && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-amber-400 rounded-full flex items-center justify-center">
            <Lock size={10} className="text-amber-900" />
          </div>
        )}
      </motion.button>
    </div>
  );
};

export default AIAssistant;
