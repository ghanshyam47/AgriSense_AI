import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, X, Sparkles, Image as ImageIcon, Mic, 
  Bot, User, ChevronRight, Paperclip, Smile,
  Camera, FileText, MapPin, Zap, Activity, Cpu,
  TrendingUp
} from 'lucide-react';
import { sendChatMessage, getChatHistory, clearChatHistory } from '../../services/apiClient';

export default function AIChat({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      type: 'ai', 
      text: "Neural Link established. I am your AgriSense Intelligence Agent. How shall we optimize your farm operations today?",
      time: 'Sync: Active'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // Load conversation history from backend
  useEffect(() => {
    if (!isOpen) return;
    getChatHistory()
      .then((res) => {
        if (res?.data && res.data.length > 0) {
          const historyMsgs = res.data.map((m, i) => ({
            id: `hist-${i}`,
            type: m.role === 'assistant' ? 'ai' : 'user',
            text: m.content,
            time: m.role === 'assistant' ? 'ML Processed' : '',
          }));
          setMessages(prev => [prev[0], ...historyMsgs]);
        }
      })
      .catch(() => {});
  }, [isOpen]);

  useEffect(() => {
    // Initialize Speech Recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'hi-IN';

      recognitionRef.current.onstart = () => {
        setIsListening(true);
      };

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputValue(prev => prev + (prev ? ' ' : '') + transcript);
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Browser does not support Speech Recognition");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
  };

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMsg = {
      id: Date.now(),
      type: 'user',
      text: inputValue,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    const messageToSend = inputValue;
    setInputValue('');
    setIsTyping(true);

    try {
      const res = await sendChatMessage({ message: messageToSend });
      const aiMsg = {
        id: Date.now() + 1,
        type: 'ai',
        text: res?.data?.response || "I processed your request, but there was an error extracting the data.",
        time: 'ML Processed'
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error("Failed to send message", err);
      const errorMsg = {
        id: Date.now() + 1,
        type: 'ai',
        text: "Error communicating with the neural engine.",
        time: 'Error'
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[2000] bg-white flex flex-col overflow-hidden animate-fadeIn">
      {/* Neural Header */}
      <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-white shadow-xl z-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-slate-50 text-green-600 rounded-2xl flex items-center justify-center shadow-lg border border-slate-200">
            <Cpu size={24} className="animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">AgriSense Neural Engine</h2>
            <div className="flex items-center gap-2">
              <Activity className="text-green-600" size={12} />
              <span className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">Agent Status: Synced</span>
            </div>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="p-3 hover:bg-slate-50 rounded-2xl transition-colors text-slate-300 hover:text-red-500"
        >
          <X size={24} />
        </button>
        <button
          onClick={async () => {
            try { await clearChatHistory(); } catch {}
            setMessages([{ id: 1, type: 'ai', text: 'History cleared. How can I help?', time: 'Sync: Active' }]);
          }}
          title="Clear History"
          className="p-3 hover:bg-red-50 rounded-2xl transition-colors text-slate-300 hover:text-red-500"
        >
          <X size={18} />
        </button>
      </div>

      {/* Neural Feedback Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-8 space-y-8 scroll-smooth bg-slate-50/50"
      >
        <div className="max-w-4xl mx-auto space-y-8">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'} animate-slideUp`}
            >
              <div className={`flex gap-4 max-w-[85%] ${msg.type === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center shadow-sm ${
                  msg.type === 'ai' ? 'bg-white text-green-600 border border-slate-200' : 'bg-blue-50 text-blue-600 border border-blue-100'
                }`}>
                  {msg.type === 'ai' ? <Sparkles size={20} /> : <User size={20} />}
                </div>
                <div className={`space-y-1 ${msg.type === 'user' ? 'items-end' : ''}`}>
                  <div className={`p-5 rounded-3xl text-sm font-black leading-relaxed shadow-xl ${
                    msg.type === 'ai' 
                      ? 'bg-white border border-slate-200 text-slate-700 rounded-tl-none border-l-4 border-l-green-600' 
                      : 'bg-green-600 text-white rounded-tr-none shadow-green-100'
                  }`}>
                    {msg.text}
                  </div>
                  <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest px-2">
                    {msg.time}
                  </span>
                </div>
              </div>
            </div>
          ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-white text-green-600 rounded-xl flex items-center justify-center border border-slate-200 shadow-sm">
                    <Cpu size={20} className="animate-spin-slow" />
                  </div>
                  <div className="bg-white border border-slate-200 p-5 rounded-3xl rounded-tl-none flex gap-1.5 shadow-sm">
                    <span className="w-2 h-2 bg-green-600 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-green-600 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-2 h-2 bg-green-600 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                </div>
              </div>
            )}
        </div>
      </div>

      {/* Neural Input Interface */}
      <div className="p-8 border-t border-slate-100 bg-white shadow-[0_-20px_50px_rgba(0,0,0,0.03)]">
        <div className="max-w-4xl mx-auto">
          <div className="bg-slate-50 rounded-[2rem] border border-slate-200 p-2 flex items-end gap-2 focus-within:border-green-600 focus-within:ring-4 focus-within:ring-green-500/5 transition-all">
            <div className="flex items-center gap-1 pb-1">
              <button className="p-3 hover:bg-slate-100 rounded-full text-slate-400 hover:text-green-600 transition-all">
                <Paperclip size={20} />
              </button>
              <button className="p-3 hover:bg-slate-100 rounded-full text-slate-400 hover:text-green-600 transition-all">
                <Camera size={20} />
              </button>
            </div>
            
            <textarea 
              rows={1}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
              placeholder="Query Neural Engine for predictive insights..."
              className="flex-1 bg-transparent border-none py-3 px-2 text-sm font-black text-slate-900 placeholder-slate-300 focus:ring-0 resize-none max-h-32"
            />

            <div className="flex items-center gap-1 pb-1">
              <button 
                onClick={toggleListening}
                className={`p-3 rounded-full transition-all ${
                  isListening 
                    ? 'bg-red-50 text-red-600 animate-pulse ring-2 ring-red-200' 
                    : 'hover:bg-slate-100 text-slate-400 hover:text-green-600'
                }`}
                title={isListening ? "Stop Listening" : "Start Voice Input (Hindi)"}
              >
                <Mic size={20} />
              </button>
              <button 
                onClick={handleSend}
                disabled={!inputValue.trim()}
                className={`p-3 rounded-full shadow-lg transition-all ${
                  inputValue.trim() ? 'bg-green-600 text-white hover:bg-green-700 shadow-green-200' : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <Send size={20} />
              </button>
            </div>
          </div>
          
          <div className="mt-4 flex flex-wrap items-center justify-center gap-4">
            <button className="px-4 py-2 rounded-full border border-slate-200 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:border-green-600 hover:text-green-600 hover:bg-green-50 transition-all flex items-center gap-2">
               <Zap size={12} /> Predictive Optimization
            </button>
            <button className="px-4 py-2 rounded-full border border-slate-200 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:border-green-600 hover:text-green-600 hover:bg-green-50 transition-all flex items-center gap-2">
               <TrendingUp size={12} /> Yield Projection
            </button>
            <button className="px-4 py-2 rounded-full border border-slate-200 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:border-green-600 hover:text-green-600 hover:bg-green-50 transition-all flex items-center gap-2">
               <Cpu size={12} /> Node Diagnostics
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
