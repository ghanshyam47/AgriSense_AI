import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, TrendingUp, Droplets, Activity, Calendar, 
  Home, Bell, Settings as SettingsIcon, Sparkles, CloudSun, Globe, ChevronDown,
  X, CheckCircle2, AlertCircle, Info, ChevronRight, Zap, Bug, CloudRain, LogOut, Plus, ImagePlus, List
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserButton } from '@clerk/clerk-react';
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

const AddFarmModal = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = React.useState({ name: '', area: '', unit: 'Acres', crop: '', soil: 'Loamy' });

  React.useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({ name: '', area: '', unit: 'Acres', crop: '', soil: 'Loamy' });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name) return;
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-fadeIn">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200"
      >
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/80">
          <h3 className="font-black text-slate-900 flex items-center gap-2.5 text-lg">
            <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center text-green-600">
              <Home size={18} />
            </div>
            {initialData ? 'Edit Farm' : 'Add New Farm'}
          </h3>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-200 text-slate-400 hover:text-slate-700 rounded-xl transition-colors">
            <X size={18} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto custom-scrollbar">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Farm Showcase Image</label>
              <label className="block border-2 border-dashed border-slate-200 rounded-xl px-4 py-6 text-center hover:bg-slate-50 hover:border-green-300 transition-all cursor-pointer group">
                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-2 group-hover:bg-green-100 transition-colors">
                  <ImagePlus size={18} className="text-slate-400 group-hover:text-green-600 transition-colors" />
                </div>
                <p className="text-sm font-medium text-slate-600 group-hover:text-green-700 transition-colors">Click to upload cover image</p>
                <p className="text-xs text-slate-400 mt-1">PNG, JPG, or WEBP (max 5MB)</p>
                <input type="file" accept="image/*" className="hidden" />
              </label>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Farm Name</label>
              <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:bg-white focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none transition-all placeholder:text-slate-400" placeholder="e.g. North Plot" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Area</label>
                <input type="number" required value={formData.area} onChange={(e) => setFormData({...formData, area: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:bg-white focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none transition-all placeholder:text-slate-400" placeholder="Size" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Unit</label>
                <select value={formData.unit} onChange={(e) => setFormData({...formData, unit: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:bg-white focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none transition-all appearance-none cursor-pointer">
                  <option>Acres</option>
                  <option>Hectares</option>
                </select>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Primary Crop</label>
              <input type="text" required value={formData.crop} onChange={(e) => setFormData({...formData, crop: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:bg-white focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none transition-all placeholder:text-slate-400" placeholder="e.g. Wheat, Rice" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Soil Type</label>
              <select value={formData.soil} onChange={(e) => setFormData({...formData, soil: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:bg-white focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none transition-all appearance-none cursor-pointer">
                <option>Loamy</option>
                <option>Clay</option>
                <option>Sandy</option>
                <option>Silt</option>
              </select>
            </div>
          </div>
          <div className="p-5 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/80">
            <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-200 hover:text-slate-900 rounded-xl transition-colors">Cancel</button>
            <button type="submit" className="px-5 py-2.5 text-sm font-bold text-white bg-green-600 hover:bg-green-700 rounded-xl transition-all shadow-lg shadow-green-200 hover:-translate-y-0.5">Save Farm Details</button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

const ManageFarmsModal = ({ isOpen, onClose, onAdd, farms, onDelete, onEdit }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-fadeIn">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[85vh]"
      >
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/80 shrink-0">
          <h3 className="font-black text-slate-900 flex items-center gap-2.5 text-lg">
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
              <List size={18} />
            </div>
            Manage Your Farms
          </h3>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-200 text-slate-400 hover:text-slate-700 rounded-xl transition-colors">
            <X size={18} />
          </button>
        </div>
        <div className="p-6 overflow-y-auto custom-scrollbar bg-slate-50/50 flex-1">
          <div className="space-y-4">
            {farms.length > 0 ? farms.map(farm => (
              <div key={farm.id} className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 group hover:border-blue-300 transition-all hover:shadow-md">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-600 shrink-0 border border-green-100 group-hover:bg-green-600 group-hover:text-white transition-colors">
                    <Home size={20} />
                  </div>
                  <div>
                    <h4 className="text-base font-black text-slate-900 group-hover:text-blue-600 transition-colors">{farm.name}</h4>
                    <p className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-wider">{farm.area} {farm.unit} • {farm.crop} • {farm.soil}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => onEdit(farm)} className="px-4 py-2 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-600 hover:text-white rounded-xl transition-all border border-blue-100">Edit</button>
                  <button onClick={() => onDelete(farm.id)} className="px-4 py-2 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-600 hover:text-white rounded-xl transition-all border border-red-100">Delete</button>
                </div>
              </div>
            )) : (
              <div className="text-center py-6 text-slate-400 font-medium">No farms added yet.</div>
            )}
            
            <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center text-center bg-white hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => { onClose(); onAdd(); }}>
               <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-3">
                 <Home size={24} />
               </div>
               <h4 className="text-sm font-black text-slate-700 mb-1">Need to track another field?</h4>
               <p className="text-xs font-medium text-slate-500 mb-5">Add all your farm properties to get AI insights.</p>
               <button 
                 onClick={() => { onClose(); onAdd(); }} 
                 className="px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white text-xs font-black rounded-xl transition-all shadow-lg shadow-green-200 flex items-center gap-2 hover:-translate-y-0.5"
               >
                 <Plus size={14} /> Add New Farm
               </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default function Dashboard({ language, setLanguage }) {
  const navigate = useNavigate();
  const t = translations[language] || translations.en;
  const [activeNav, setActiveNav] = useState('overview');
  const [activeAlerts, setActiveAlerts] = useState(SMART_ALERTS);
  const [bookmarks, setBookmarks] = useState(['Wheat']); 
  const [showNotifications, setShowNotifications] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [showAddFarmModal, setShowAddFarmModal] = useState(false);
  const [showManageFarmsModal, setShowManageFarmsModal] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const notificationRef = useRef(null);
  const languageRef = useRef(null);

  const [farms, setFarms] = useState([
    { id: 1, name: 'North Plot', area: '12', unit: 'Acres', crop: 'Wheat', soil: 'Loamy' },
    { id: 2, name: 'South Garden', area: '5', unit: 'Acres', crop: 'Vegetables', soil: 'Sandy' }
  ]);
  const [farmToEdit, setFarmToEdit] = useState(null);

  const handleSaveFarm = (farmData) => {
    if (farmToEdit) {
      setFarms(farms.map(f => f.id === farmToEdit.id ? { ...farmData, id: farmToEdit.id } : f));
    } else {
      setFarms([...farms, { ...farmData, id: Date.now() }]);
    }
    setShowAddFarmModal(false);
    setFarmToEdit(null);
  };

  const handleDeleteFarm = (id) => {
    setFarms(farms.filter(f => f.id !== id));
  };

  const handleEditFarm = (farm) => {
    setFarmToEdit(farm);
    setShowManageFarmsModal(false);
    setShowAddFarmModal(true);
  };

  const handleOpenAddFarm = () => {
    setFarmToEdit(null);
    setShowAddFarmModal(true);
  };

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
      case 'alerts': return <AlertSystem setActiveNav={setActiveNav} />;
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
        <header className="h-16 bg-white/90 backdrop-blur-xl border-b border-slate-200 shadow-sm flex items-center justify-between px-6 md:px-8 flex-shrink-0 z-20 relative transition-all">
          <div className="flex items-center gap-5">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-inner flex items-center justify-center p-0.5">
                <img src="/logo.jpeg" alt="AgriSense" className="w-full h-full rounded-lg object-contain brightness-110 bg-white" />
              </div>
              <span className="text-xl font-black tracking-tight text-slate-900 hidden lg:block">
                Agri<span className="text-green-600">Sense</span>
              </span>
            </div>
            <div className="h-7 w-px bg-slate-200 hidden md:block"></div>
            <div className="hidden sm:block">
              <h2 className="text-lg font-black text-slate-900 tracking-tight leading-tight">{getPageTitle()}</h2>
              <p className="text-[10px] text-green-600 font-bold uppercase tracking-widest leading-tight">{t.agriIntel}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 md:space-x-4">
            {/* Manage Farms Button */}
            <button 
              onClick={() => setShowManageFarmsModal(true)}
              className="hidden sm:flex items-center gap-2 px-3.5 py-2 bg-slate-50 text-slate-700 border border-slate-200 rounded-full hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition-all text-xs font-bold shadow-sm"
            >
              <List size={14} className="text-blue-600" />
              <span>My Farms</span>
            </button>
            {/* Add Farm Button */}
            <button 
              onClick={handleOpenAddFarm}
              className="hidden sm:flex items-center gap-2 px-3.5 py-2 bg-slate-50 text-slate-700 border border-slate-200 rounded-full hover:bg-green-50 hover:text-green-700 hover:border-green-200 transition-all text-xs font-bold shadow-sm"
            >
              <Plus size={14} className="text-green-600" />
              <span>Add</span>
            </button>
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
                                <h4 className="text-sm font-bold text-slate-900 group-hover:text-green-600 transition-colors pr-2">{alert.title}</h4>
                                <div className="flex items-center gap-2 shrink-0">
                                  <span className={`text-[8px] font-bold uppercase px-1.5 py-0.5 rounded-md ${
                                    alert.severity === 'High' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'
                                  }`}>
                                    {alert.severity}
                                  </span>
                                  <button onClick={(e) => { e.stopPropagation(); dismissAlert(alert.id); }} className="text-slate-400 hover:text-red-500 transition-colors">
                                    <X size={14} />
                                  </button>
                                </div>
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
            
            <div className="flex items-center justify-center w-9 h-9">
              <UserButton afterSignOutUrl="/" />
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
              {activeNav === 'overview' && !isScrolled && activeAlerts.slice(0, 3).map((alert) => (
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
      
      {/* Add Farm Modal */}
      <AnimatePresence>
        {showAddFarmModal && <AddFarmModal isOpen={showAddFarmModal} onClose={() => {setShowAddFarmModal(false); setFarmToEdit(null);}} onSave={handleSaveFarm} initialData={farmToEdit} />}
        {showManageFarmsModal && <ManageFarmsModal isOpen={showManageFarmsModal} onClose={() => setShowManageFarmsModal(false)} onAdd={handleOpenAddFarm} farms={farms} onDelete={handleDeleteFarm} onEdit={handleEditFarm} />}
      </AnimatePresence>
    </div>
  );
}
