import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, X, Sparkles, Image as ImageIcon, Mic, 
  Bot, User, ChevronRight, Paperclip, Smile,
  Camera, FileText, MapPin, Zap, Activity, Cpu,
  TrendingUp, Trash2, Pause, Play
} from 'lucide-react';

export default function AIChat({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      type: 'ai', 
      text: "Neural Link established. I am your AgriSense Intelligence Agent. I have analyzed your current Neural Node telemetry. How shall we optimize your farm operations today?",
      time: 'Sync: Active'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);
  const scrollRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [previewAudioUrl, setPreviewAudioUrl] = useState(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);
  const cancelRecordingRef = useRef(false);
  const [audioLevels, setAudioLevels] = useState(new Array(20).fill(2));
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animationFrameRef = useRef(null);
  const [playingId, setPlayingId] = useState(null);
  const audioInstanceRef = useRef(null);

  const startCamera = async () => {
    setIsCameraOpen(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing camera: ", err);
      alert("Unable to access camera. Please allow camera permissions.");
      setIsCameraOpen(false);
    }
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
      const imageDataUrl = canvasRef.current.toDataURL('image/jpeg');
      
      stopCamera();

      const userMsg = {
        id: Date.now(),
        type: 'user',
        text: 'Captured an image for analysis.',
        image: imageDataUrl,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, userMsg]);
      setIsTyping(true);

      setTimeout(() => {
        setIsTyping(false);
        const aiMsg = {
          id: Date.now() + 1,
          type: 'ai',
          text: "Neural Vision has processed the live capture. I have cross-referenced the visual data with our global telemetry datasets. What specific diagnostics would you like?",
          time: 'Vision Processed'
        };
        setMessages(prev => [...prev, aiMsg]);
      }, 1500);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
    setIsCameraOpen(false);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };



  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Setup Audio Context for Visualizer
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 64;
      source.connect(analyserRef.current);
      
      const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
      const updateLevels = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);
        // Map frequencies to simple levels for 20 bars
        const levels = Array.from(dataArray.slice(0, 20)).map(val => Math.max(4, (val / 255) * 100));
        setAudioLevels(levels);
        animationFrameRef.current = requestAnimationFrame(updateLevels);
      };
      updateLevels();

      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];
      cancelRecordingRef.current = false;

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
          if (mediaRecorderRef.current.state === 'paused') {
            const audioBlob = new Blob(audioChunksRef.current, { type: mediaRecorderRef.current.mimeType || 'audio/webm' });
            setPreviewAudioUrl(URL.createObjectURL(audioBlob));
          }
        }
      };

      mediaRecorderRef.current.onstop = () => {
        if (audioChunksRef.current.length === 0) return;
        const audioBlob = new Blob(audioChunksRef.current, { type: mediaRecorderRef.current.mimeType || 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        
        if (!cancelRecordingRef.current) {
          const userMsg = {
            id: Date.now(),
            type: 'user',
            text: 'Voice note',
            audio: audioUrl,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
          setMessages(prev => [...prev, userMsg]);
          setIsTyping(true);

          setTimeout(() => {
            setIsTyping(false);
            const aiMsg = {
              id: Date.now() + 1,
              type: 'ai',
              text: "Neural Engine has processed your high-fidelity voice transmission. Transcription complete. Analyzing semantic intent...",
              time: 'Neural Stream Sync'
            };
            setMessages(prev => [...prev, aiMsg]);
          }, 1500);
        }

        stream.getTracks().forEach(track => track.stop());
        if (audioContextRef.current) audioContextRef.current.close();
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setIsPaused(false);
      setPreviewAudioUrl(null);
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Neural Link requires voice permissions to establish a secure audio connection.");
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      if (isPaused) {
        mediaRecorderRef.current.resume();
        setIsPaused(false);
        setPreviewAudioUrl(null);
        timerRef.current = setInterval(() => {
          setRecordingTime(prev => prev + 1);
        }, 1000);
      } else {
        mediaRecorderRef.current.pause();
        mediaRecorderRef.current.requestData();
        setIsPaused(true);
        clearInterval(timerRef.current);
      }
    }
  };

  const stopRecording = (cancel = false) => {
    if (mediaRecorderRef.current && isRecording) {
      if (cancel) {
        cancelRecordingRef.current = true;
      }
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
      setPreviewAudioUrl(null);
      clearInterval(timerRef.current);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    }
  };

  const handlePlayAudio = (id, url) => {
    if (playingId === id) {
      audioInstanceRef.current.pause();
      setPlayingId(null);
    } else {
      if (audioInstanceRef.current) {
        audioInstanceRef.current.pause();
      }
      const audio = new Audio(url);
      audio.onended = () => setPlayingId(null);
      audioInstanceRef.current = audio;
      audio.play();
      setPlayingId(id);
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  useEffect(() => {
    // Initialize Speech Recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      // Defaulting to Hindi, you can change this dynamically based on user preferences: e.g., 'hi-IN', 'en-US', 'ta-IN'
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

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMsg = {
      id: Date.now(),
      type: 'user',
      text: inputValue,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // Simulate Agent processing
    setTimeout(() => {
      setIsTyping(false);
      const aiMsg = {
        id: Date.now() + 1,
        type: 'ai',
        text: getAgentResponse(inputValue),
        time: 'ML Processed'
      };
      setMessages(prev => [...prev, aiMsg]);
    }, 1200);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const userMsg = {
          id: Date.now(),
          type: 'user',
          text: 'Uploaded an image for analysis.',
          image: reader.result,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, userMsg]);
        setIsTyping(true);

        setTimeout(() => {
          setIsTyping(false);
          const aiMsg = {
            id: Date.now() + 1,
            type: 'ai',
            text: "Neural Vision has processed the image. I have cross-referenced the visual data with our global telemetry datasets. What specific diagnostics or treatment protocols would you like me to run based on this scan?",
            time: 'Vision Processed'
          };
          setMessages(prev => [...prev, aiMsg]);
        }, 1500);
      };
      reader.readAsDataURL(file);
    }
  };

  const getAgentResponse = (query) => {
    const q = query.toLowerCase();
    if (q.includes('weather') || q.includes('climate')) return "Neural models indicate a high-pressure system moving in. ML predictions suggest 84% probability of localized precipitation. Optimizing irrigation vectors now.";
    if (q.includes('pest') || q.includes('risk')) return "Neural analysis of high-humidity nodes indicates an elevated risk of pathogen spread. I recommend deploying an autonomous drone for multi-spectral imaging.";
    if (q.includes('price') || q.includes('yield')) return "Predictive algorithms suggest a 12% yield increase across North Nodes. MSP-delta is currently optimal for high-volume transactions.";
    return "Query received. Accessing global agricultural datasets and local node telemetry. My neural models suggest focusing on hydration optimization in Sector 4.";
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
                  {msg.type === 'ai' ? <Bot size={20} /> : <User size={20} />}
                </div>
                <div className={`space-y-1 ${msg.type === 'user' ? 'items-end' : ''}`}>
                  <div className={`p-5 rounded-3xl text-sm font-black leading-relaxed shadow-xl ${
                    msg.type === 'ai' 
                      ? 'bg-white border border-slate-200 text-slate-700 rounded-tl-none border-l-4 border-l-green-600' 
                      : 'bg-green-600 text-white rounded-tr-none shadow-green-100'
                  }`}>
                    {msg.image && (
                      <img src={msg.image} alt="Upload" className="w-full max-w-[200px] rounded-2xl mb-3 shadow-md border-2 border-white/20" />
                    )}
                    {msg.audio && (
                      <div className="mt-1 mb-1">
                        <button 
                          onClick={() => handlePlayAudio(msg.id, msg.audio)}
                          className="w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all backdrop-blur-sm border border-white/30 text-white shadow-lg hover:scale-105 active:scale-95"
                        >
                          {playingId === msg.id ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1" />}
                        </button>
                      </div>
                    )}
                    {msg.text !== 'Voice note' && msg.text}
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
            {!isRecording ? (
              <>
                <div className="flex items-center gap-1 pb-1">
                  <label className="p-3 hover:bg-slate-100 rounded-full text-slate-400 hover:text-green-600 transition-all cursor-pointer">
                    <Paperclip size={20} />
                    <input type="file" className="hidden" accept="image/*,application/pdf" onChange={handleFileUpload} />
                  </label>
                  <button onClick={startCamera} className="p-3 hover:bg-slate-100 rounded-full text-slate-400 hover:text-green-600 transition-all outline-none">
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
                  {inputValue.trim() ? (
                    <button 
                      onClick={handleSend}
                      className="p-3 rounded-full shadow-lg transition-all bg-green-600 text-white hover:bg-green-700 shadow-green-200"
                    >
                      <Send size={20} />
                    </button>
                  ) : (
                    <div className="flex items-center gap-1">
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
                      <button onClick={startRecording} className="p-3 hover:bg-slate-100 rounded-full text-slate-400 hover:text-green-600 transition-all">
                        <Zap size={20} className={isRecording ? "animate-pulse text-green-600" : ""} />
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-between px-6 py-3 bg-slate-900 rounded-[1.5rem] border border-green-500/30 shadow-[0_0_30px_rgba(34,197,94,0.1)] animate-in slide-in-from-bottom-2 duration-300">
                <div className="flex items-center gap-6 flex-1">
                  <div className={`flex items-center gap-2 font-mono text-xs tracking-tighter ${isPaused ? 'text-slate-500' : 'text-red-500'}`}>
                    <div className={`w-2 h-2 rounded-full ${isPaused ? 'bg-slate-500' : 'bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.5)]'}`}></div>
                    {formatTime(recordingTime)}
                  </div>
                  
                  {/* Waveform Visualizer */}
                  {!isPaused && (
                    <div className="flex items-center gap-[3px] h-8 flex-1 max-w-[200px]">
                      {audioLevels.map((h, i) => (
                        <div 
                          key={i} 
                          className="w-[3px] bg-green-500 rounded-full transition-all duration-75 ease-out shadow-[0_0_5px_rgba(34,197,94,0.3)]"
                          style={{ height: `${h}%`, opacity: 0.2 + (h/100) }}
                        ></div>
                      ))}
                    </div>
                  )}
                  
                  {isPaused && previewAudioUrl && (
                    <div className="flex-1 max-w-[300px] animate-in fade-in duration-500">
                       <audio controls src={previewAudioUrl} className="h-10 w-full outline-none opacity-80 invert hue-rotate-180 scale-90 contrast-125"></audio>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button onClick={() => stopRecording(true)} className="p-3 text-slate-500 hover:text-red-500 hover:bg-white/5 rounded-full transition-all">
                     <Trash2 size={20} />
                  </button>
                  <button onClick={pauseRecording} className="p-3 text-green-500 hover:bg-green-500/10 rounded-full transition-all">
                     {isPaused ? <Mic size={20} /> : <Pause size={20} />}
                  </button>
                  <button onClick={() => stopRecording(false)} className="p-3 bg-green-600 text-white rounded-full shadow-lg hover:bg-green-700 hover:scale-105 transition-all">
                    <Send size={18} />
                  </button>
                </div>
              </div>
            )}
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

      {isCameraOpen && (
        <div className="absolute inset-0 z-[3000] bg-black flex flex-col items-center justify-center overflow-hidden">
           <video ref={videoRef} autoPlay playsInline className="absolute inset-0 w-full h-full object-cover"></video>
           <canvas ref={canvasRef} className="hidden"></canvas>
           <div className="absolute bottom-10 left-0 right-0 flex justify-center gap-8 z-50">
              <button onClick={stopCamera} className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-colors shadow-xl border border-white/30">
                 <X size={28} />
              </button>
              <button onClick={captureImage} className="w-20 h-20 bg-white rounded-full border-4 border-green-500 shadow-2xl flex items-center justify-center hover:scale-105 transition-transform">
                 <Camera size={32} className="text-green-600" />
              </button>
           </div>
        </div>
      )}
    </div>
  );
}
