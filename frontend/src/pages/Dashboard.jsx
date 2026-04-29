import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, TrendingUp, Droplets, Activity, Calendar, 
  Home, Bell, Settings as SettingsIcon, Sparkles, CloudSun, Globe, ChevronDown,
  X, CheckCircle2, AlertCircle, Info, ChevronRight, Zap, Bug, CloudRain, LogOut
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Sub-components
import Overview from '../components/dashboard/Overview';
import MarketMSP from '../components/dashboard/MarketMSP';
import IrrigationManager from '../components/dashboard/IrrigationManager';
import AlertSystem from '../components/dashboard/AlertSystem';
import PestDetection from '../components/dashboard/PestDetection';
import Settings from '../components/dashboard/Settings';
import CropRecommendation from '../components/dashboard/CropRecommendation';
import WeatherAnalytics from '../components/dashboard/WeatherAnalytics';
import AIChat from '../components/dashboard/AIChat';
import { translations, LANGUAGES } from '../services/translations';
import { SMART_ALERTS } from '../services/mockData';

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'dashboard', id: 'overview' },
  { icon: TrendingUp, label: 'marketInsights', id: 'market' },
  { icon: Droplets, label: 'irrigation', id: 'irrigation' },
  { icon: Sparkles, label: 'cropRec', id: 'recommendation' },
  { icon: CloudSun, label: 'weather', id: 'weather' },
  { icon: Activity, label: 'smartAlerts', id: 'alerts' },
  { icon: Bug, label: 'pestDetection', id: 'pest' },
];

const SideNavItem = ({ icon: Icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 text-left ${
      active
        ? 'bg-green-600 text-white shadow-lg shadow-green-200'
        : 'text-gray-600 hover:bg-white/50 hover:text-gray-900 border border-transparent hover:border-white/40'
    }`}
  >
    <Icon size={19} />
    <span className="text-sm font-medium">{label}</span>
  </button>
);

export default function Dashboard({ language, setLanguage }) {
  const navigate = useNavigate();
  const t = translations[language] || translations.en;
  const [activeNav, setActiveNav] = useState('overview');
  const [activeAlerts, setActiveAlerts] = useState(SMART_ALERTS);
  const [bookmarks, setBookmarks] = useState(['Wheat']); 
  const [showNotifications, setShowNotifications] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const notificationRef = useRef(null);
  const languageRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (languageRef.current && !languageRef.current.contains(event.target)) {
        setShowLanguageDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleScroll = (e) => {
    const scrollTop = e.target.scrollTop;
    if (scrollTop > 300) {
      if (!isScrolled) setIsScrolled(true);
    } else {
      if (isScrolled) setIsScrolled(false);
    }
  };

  const dismissAlert = (id) => {
    setActiveAlerts(prev => prev.filter(a => a.id !== id));
  };

  const toggleBookmark = (id) => {
    setBookmarks(prev => 
      prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]
    );
  };


  const renderContent = () => {
    switch (activeNav) {
      case 'overview': return <Overview setIsChatOpen={setIsChatOpen} />;
      case 'market': return <MarketMSP />;
      case 'irrigation': return <IrrigationManager bookmarks={bookmarks} toggleBookmark={toggleBookmark} />;
      case 'recommendation': return <CropRecommendation />;
      case 'weather': return <WeatherAnalytics />;
      case 'alerts': return <AlertSystem />;
      case 'pest': return <PestDetection />;
      case 'settings': return <Settings language={language} setLanguage={setLanguage} />;
      default: return <Overview setIsChatOpen={setIsChatOpen} />;
    }
  };

  const getPageTitle = () => {
    if (activeNav === 'settings') return t.settings;
    if (activeNav === 'recommendation') return t.cropRec;
    if (activeNav === 'weather') return t.weather;
    const item = NAV_ITEMS.find(n => n.id === activeNav);
    return item ? t[item.label] : t.dashboard;
  };

  return (
    <div 
      className="flex flex-col h-screen overflow-hidden font-sans relative bg-stone-50"
      style={{ background: 'linear-gradient(135deg, #f9fafb 0%, #ecfdf5 40%, #f9fafb 100%)' }}
    >
      {/* ─── SUBTLE GRID PATTERN ─── */}
      <div className="absolute inset-0 opacity-[0.4] pointer-events-none z-0" style={{
        backgroundImage: `radial-gradient(#10b981 0.8px, transparent 0.8px)`,
        backgroundSize: '32px 32px'
      }}></div>
      {/* ─── MAIN CONTENT AREA ─── */}
      <main className="flex-1 flex flex-col overflow-hidden relative z-[1]">
        {/* ─── HEADER ─── */}
        <header className="h-[52px] bg-white/80 backdrop-blur-2xl border-b border-slate-200 shadow-sm flex items-center justify-between px-10 flex-shrink-0 z-20 relative">
          <div className="flex items-center gap-6">
            <div className="flex items-center space-x-2">
              <img src="/logo.jpeg" alt="AgriSense" className="w-8 h-8 rounded-lg object-contain brightness-110" />
              <span className="text-lg font-bold tracking-tight text-slate-900 hidden md:block">
                Agri<span className="text-green-600">Sense</span>
              </span>
            </div>
            <div className="h-6 w-px bg-slate-200 hidden md:block"></div>
            <div>
              <h2 className="text-base font-black text-slate-900 tracking-tight">{getPageTitle()}</h2>
              <p className="text-[10px] text-green-600 font-bold uppercase tracking-widest">{t.agriIntel} · April 2026</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Language Selector */}
            <div className="relative" ref={languageRef}>
              <button 
                onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-full transition-all border ${showLanguageDropdown ? 'bg-green-600 border-green-500 text-white' : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-900 shadow-sm'} backdrop-blur-sm`}
              >
                <Globe size={16} className={showLanguageDropdown ? 'text-white' : 'text-green-600'} />
                <span className="text-xs font-bold uppercase tracking-tight hidden sm:block">
                  {language?.toUpperCase() || 'EN'}
                </span>
                <ChevronDown size={14} className={`transition-transform duration-200 ${showLanguageDropdown ? 'rotate-180' : ''}`} />
              </button>

              {showLanguageDropdown && (
                <div className="absolute right-0 mt-3 w-48 bg-white backdrop-blur-xl rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-200 overflow-hidden z-[100] animate-fadeInUp">
                  <div className="p-2">
                    {LANGUAGES.map((lang) => (
                      <button
                        key={lang.id}
                        onClick={() => {
                          setLanguage(lang.id);
                          setShowLanguageDropdown(false);
                        }}
                        className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                          language === lang.id 
                            ? 'bg-green-600 text-white shadow-md shadow-green-200' 
                            : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span>{lang.name}</span>
                        {language === lang.id && <CheckCircle2 size={14} />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {activeNav === 'overview' && !isScrolled && (
              <div className="relative" ref={notificationRef}>
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className={`relative p-2 rounded-full transition-colors ${showNotifications ? 'bg-green-600 text-white' : 'hover:bg-slate-100 text-slate-700'}`}
                >
                  <Bell size={20} />
                  {!showNotifications && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>}
                </button>

                {/* Notification Dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 mt-3 w-80 md:w-96 bg-white backdrop-blur-xl rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-200 overflow-hidden z-[100] animate-fadeInUp">
                    <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                      <div className="flex items-center gap-2">
                        <Bell size={16} className="text-green-600" />
                        <h3 className="font-bold text-slate-900">Notifications</h3>
                      </div>
                      <span className="bg-green-600 text-white px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
                        {activeAlerts.length} New
                      </span>
                    </div>
                    
                    <div className="max-h-[400px] overflow-y-auto divide-y divide-slate-100">
                      {activeAlerts.length > 0 ? activeAlerts.map((alert) => (
                        <div key={alert.id} className="p-4 hover:bg-slate-50 transition-colors cursor-pointer group">
                          <div className="flex items-start gap-4">
                            <div className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center ${
                              alert.type === 'weather-irrigation' ? 'bg-blue-100 text-blue-600' :
                              alert.type === 'pest-weather' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                            }`}>
                              {alert.type === 'weather-irrigation' && <CloudRain size={18} />}
                              {alert.type === 'pest-weather' && <Bug size={18} />}
                              {alert.type === 'market-trend' && <TrendingUp size={18} />}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <h4 className="text-sm font-bold text-slate-900 group-hover:text-green-600 transition-colors">{alert.title}</h4>
                                <span className={`text-[8px] font-bold uppercase px-1.5 py-0.5 rounded-md ${
                                  alert.severity === 'High' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'
                                }`}>
                                  {alert.severity}
                                </span>
                              </div>
                              <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{alert.message}</p>
                            </div>
                          </div>
                        </div>
                      )) : (
                        <div className="p-10 text-center">
                          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">No new alerts</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Logout Button */}
            <button
              onClick={() => {
                sessionStorage.removeItem('agri_authed');
                navigate('/');
              }}
              className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-full border border-slate-200 bg-white hover:bg-red-50 hover:border-red-200 hover:text-red-500 text-slate-500 text-xs font-bold transition-all shadow-sm"
              title="Logout"
            >
              <LogOut size={15} />
              <span className="hidden lg:inline">Logout</span>
            </button>

            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-green-400 to-green-600 p-[2px] shadow-md cursor-pointer hover:shadow-lg hover:scale-105 transition-all" onClick={() => setActiveNav('settings')}>
              <img src="https://i.pravatar.cc/150?u=rajesh" alt="Profile" className="w-full h-full rounded-full object-cover border-2 border-white" />
            </div>
          </div>
        </header>


        {/* ─── SCROLLABLE CONTENT ─── */}
        <div 
          className="flex-1 overflow-y-auto p-4 md:p-8 relative"
          onScroll={handleScroll}
        >
          <div className="max-w-[1600px] mx-auto relative z-10 pb-20 md:pb-0 px-10">
             {renderContent()}
          </div>

          {/* Floating Alerts (Left Side - Now Absolute to scroll) */}
          <div className="absolute top-10 left-8 z-[150] flex flex-col gap-3 w-80 pointer-events-none">
            <AnimatePresence>
              {activeNav === 'overview' && !isScrolled && activeAlerts.map((alert) => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  className="pointer-events-auto bg-white/90 backdrop-blur-xl border border-slate-200 shadow-xl rounded-2xl p-4 flex items-start gap-4 relative group"
                >
                  <div className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center ${
                    alert.severity === 'High' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'
                  }`}>
                    <AlertCircle size={20} />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xs font-black text-slate-900 pr-6">{alert.title}</h4>
                    <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">{alert.message}</p>
                  </div>
                  <button 
                    onClick={() => dismissAlert(alert.id)}
                    className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 transition-colors p-1"
                  >
                    <X size={14} />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* ─── BOTTOM NAVIGATION (WIDE DOCK) ─── */}
      <div className="fixed bottom-0 left-0 right-0 z-[100] px-4 pb-4">
        <nav className="max-w-5xl mx-auto bg-white border border-slate-200 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] rounded-2xl p-1 flex items-center justify-between overflow-visible relative">
          <div className="flex-1 flex items-center justify-around relative z-10 px-1">
            {NAV_ITEMS.map((item) => {
              const active = activeNav === item.id;
              const Icon = item.icon;
              
              // Map colors to icons
              const getIconColor = () => {
                if (!active) return 'text-slate-400';
                switch(item.id) {
                  case 'overview': return 'text-green-600';
                  case 'market': return 'text-amber-600';
                  case 'irrigation': return 'text-blue-600';
                  case 'recommendation': return 'text-purple-600';
                  case 'weather': return 'text-sky-600';
                  case 'alerts': return 'text-red-600';
                  case 'schedule': return 'text-orange-600';
                  default: return 'text-green-600';
                }
              };

              return (
                <motion.button
                  key={item.id}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveNav(item.id)}
                  className={`flex flex-col items-center justify-center gap-1.5 py-3 px-4 rounded-xl transition-all duration-300 relative group ${
                    active ? 'opacity-100' : 'opacity-100'
                  }`}
                >
                  {active && (
                    <motion.div 
                      layoutId="activeNavBg"
                      className="absolute inset-0 bg-green-600/5 rounded-xl z-[-1]"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <Icon size={20} className={`${getIconColor()} transition-colors`} />
                  
                  {/* Label under icon */}
                  <span className={`text-[8px] font-black uppercase tracking-[0.1em] transition-all ${active ? getIconColor() : 'text-slate-400 group-hover:text-slate-600'}`}>
                    {t[item.label] || item.label}
                  </span>
                  
                  {active && (
                    <div className={`absolute -bottom-0.5 w-1 h-1 rounded-full ${getIconColor()} bg-current`} />
                  )}
                </motion.button>
              );
            })}
          </div>
        </nav>
      </div>
      {/* AIChat portal — rendered outside overflow context */}
      {isChatOpen && <AIChat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />}
    </div>
  );
}
