import React, { useState, useRef, useEffect } from 'react';
import { User, Bell, Map, Shield, Smartphone, Globe, CreditCard, ChevronRight, Save, Check, ChevronDown, Plus, Trash2, Edit3, X, Droplets, Leaf, Phone, Mail, MapPin, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { translations, LANGUAGES } from '../../services/translations';
import { getProfile, updateProfile as apiUpdateProfile, updateFarmProfile as apiUpdateFarmProfile } from '../../services/apiClient';

const CustomDropdown = ({ label, value, options, onChange, isLanguage = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 px-1">{label}</label>
      <button onClick={() => setIsOpen(!isOpen)} className={`w-full flex items-center justify-between bg-slate-50 border ${isOpen ? 'border-green-600 ring-4 ring-green-500/10' : 'border-slate-200'} rounded-xl px-5 py-3.5 text-sm font-black text-slate-900 transition-all shadow-sm`}>
        <span>{isLanguage ? LANGUAGES.find(l => l.id === value)?.name : value}</span>
        <ChevronDown size={16} className={`text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-green-600' : ''}`} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute top-full left-0 right-0 mt-2 bg-white backdrop-blur-2xl rounded-2xl shadow-2xl border border-slate-200 z-[100] py-2 overflow-hidden">
            {options.map((opt) => (
              <button key={isLanguage ? opt.id : opt} onClick={() => { onChange(isLanguage ? opt.id : opt); setIsOpen(false); }} className={`w-full flex items-center justify-between px-5 py-3 text-left hover:bg-slate-50 transition-colors ${value === (isLanguage ? opt.id : opt) ? 'bg-green-50 text-slate-900 font-black' : 'text-slate-600'}`}>
                <span>{isLanguage ? opt.name : opt}</span>
                {value === (isLanguage ? opt.id : opt) && <Check size={14} className="text-green-600" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const EMPTY_FARM = { name: '', area: '', soilType: 'Loamy', moisture: 45, nitrogen: 40, phosphorus: 25, potassium: 30 };

export default function Settings({ language, setLanguage }) {
  const t = translations[language] || translations.en;
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    district: '',
    state: '',
    pincode: ''
  });

  const [farms, setFarms] = useState([]);

  const [notifications, setNotifications] = useState({ weather: true, market: true, pests: true, irrigation: false });
  const [showFarmModal, setShowFarmModal] = useState(false);
  const [editingFarm, setEditingFarm] = useState(null);
  const [farmForm, setFarmForm] = useState({ ...EMPTY_FARM });
  const [activeTab, setActiveTab] = useState('profile');
  const [isSaving, setIsSaving] = useState(false);

  // Load profile from backend on mount
  useEffect(() => {
    let mounted = true;
    getProfile()
      .then((res) => {
        if (!mounted) return;
        if (res?.user) {
          setProfile(prev => ({
            ...prev,
            name: res.user.name || prev.name,
            email: res.user.email || prev.email,
            phone: res.user.phone || prev.phone,
            address: res.user.location?.address || prev.address,
            district: res.user.location?.district || prev.district,
            state: res.user.location?.state || prev.state,
            pincode: res.user.location?.pincode || prev.pincode,
          }));
        }
        if (res?.farm) {
          setFarms([{
            id: res.farm._id || 1,
            name: res.farm.farmName || 'My Farm',
            area: res.farm.farmSize || '',
            soilType: res.farm.soilType || 'Loamy',
            moisture: 50,
            nitrogen: 40,
            phosphorus: 25,
            potassium: 30,
          }]);
        }
      })
      .catch(() => { /* profile load failed — use defaults */ });
    return () => { mounted = false; };
  }, []);

  const openAddFarm = () => { setEditingFarm(null); setFarmForm({ ...EMPTY_FARM }); setShowFarmModal(true); };
  const openEditFarm = (farm) => { setEditingFarm(farm.id); setFarmForm({ ...farm }); setShowFarmModal(true); };
  const deleteFarm = (id) => setFarms(prev => prev.filter(f => f.id !== id));

  const saveFarm = async (e) => {
    e.preventDefault();
    if (editingFarm) {
      setFarms(prev => prev.map(f => f.id === editingFarm ? { ...farmForm, id: editingFarm } : f));
    } else {
      setFarms(prev => [...prev, { ...farmForm, id: Date.now() }]);
    }
    // Also persist to backend
    try {
      await apiUpdateFarmProfile({
        farmSize: farmForm.area,
        soilType: farmForm.soilType,
        currentCrops: [],
      });
    } catch { /* ignore */ }
    setShowFarmModal(false);
  };

  const updateProfile = (key, val) => setProfile(prev => ({ ...prev, [key]: val }));

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      await apiUpdateProfile({
        name: profile.name,
        language,
        location: {
          address: profile.address,
          district: profile.district,
          state: profile.state,
          pincode: profile.pincode,
        },
      });
    } catch (err) {
      console.error('Profile save failed', err);
    } finally {
      setIsSaving(false);
    }
  };

  const getNPKColor = (val) => val > 40 ? 'text-green-400' : val > 20 ? 'text-amber-400' : 'text-red-400';
  const getNPKBg = (val) => val > 40 ? 'bg-green-500/10' : val > 20 ? 'bg-amber-500/10' : 'bg-red-500/10';
  const getMoistureColor = (val) => val > 60 ? 'from-blue-500 to-cyan-400' : val > 30 ? 'from-amber-400 to-yellow-300' : 'from-red-500 to-orange-400';

  return (
    <div className="space-y-6 animate-fadeIn pb-10">
      {/* ─── PROFILE HEADER ─── */}
      <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2.5rem] border border-slate-200 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-48 h-48 bg-green-500 rounded-full blur-[80px] opacity-10 -mr-16 -mt-16"></div>
        <div className="flex items-center gap-6 relative z-10">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-green-700 p-1 shadow-lg">
              <img src="https://i.pravatar.cc/150?u=rajesh" alt="Profile" className="w-full h-full rounded-full border-4 border-white object-cover" />
            </div>
            <button className="absolute bottom-0 right-0 bg-white p-2.5 rounded-full shadow-lg border border-slate-100 hover:bg-green-600 hover:text-white transition-all">
              <User size={16} />
            </button>
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">{profile.name}</h2>
            <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest mt-1">{profile.district}, {profile.state} · Lead Farmer</p>
            <div className="flex gap-2 mt-4">
              <span className="px-3 py-1 bg-green-600 text-white text-[10px] font-black rounded-full shadow-lg shadow-green-200 uppercase tracking-tighter">Verified Pro</span>
              <span className="px-3 py-1 bg-slate-50 text-slate-500 text-[10px] font-black rounded-full uppercase tracking-tighter border border-slate-200">Premium Plan</span>
            </div>
          </div>
        </div>
      </div>

      {/* ─── TAB SWITCHER ─── */}
      <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shadow-sm gap-1">
        {[
          { id: 'profile', label: t.profile, icon: User },
          { id: 'farms', label: t.myFarms, icon: Map },
          { id: 'notifications', label: t.notifications, icon: Bell }
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black transition-all ${activeTab === tab.id ? 'bg-white text-slate-900 shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}>
            <tab.icon size={15} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* ═══ PROFILE TAB ═══ */}
      {activeTab === 'profile' && (
        <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2.5rem] border border-slate-200 shadow-xl space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-8">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-3">
                <User size={18} className="text-green-600" /> {t.personalInfo}
              </h3>
              <div className="grid grid-cols-1 gap-6">
                {[
                  { key: 'name', label: t.name, icon: User, type: 'text' },
                  { key: 'email', label: t.email, icon: Mail, type: 'email' },
                  { key: 'phone', label: t.phone, icon: Phone, type: 'tel' },
                ].map(field => (
                  <div key={field.key}>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 px-1 flex items-center gap-1.5">
                      <field.icon size={12} /> {field.label}
                    </label>
                    <input type={field.type} value={profile[field.key]} onChange={(e) => updateProfile(field.key, e.target.value)} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-5 py-3.5 text-sm font-black text-slate-900 focus:ring-4 focus:ring-green-500/5 focus:border-green-600 transition-all outline-none" />
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-8">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-3">
                <Globe size={18} className="text-blue-600" /> {t.language}
              </h3>
              <CustomDropdown 
                label={t.selectLanguage}
                value={language}
                options={LANGUAGES}
                onChange={setLanguage}
                isLanguage={true}
              />
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest leading-relaxed">
                Choose your preferred language for the interface and agronomic reports.
              </p>
            </div>
          </div>

          <div className="space-y-8">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-3">
              <MapPin size={18} className="text-red-600" /> {t.address}
            </h3>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 px-1 flex items-center gap-1.5">
                   {t.address}
                </label>
                <input type="text" value={profile.address} onChange={(e) => updateProfile('address', e.target.value)} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-5 py-3.5 text-sm font-black text-slate-900 focus:ring-4 focus:ring-green-500/5 focus:border-green-600 transition-all outline-none" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 px-1">{t.district}</label>
                  <input type="text" value={profile.district} onChange={(e) => updateProfile('district', e.target.value)} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-5 py-3.5 text-sm font-black text-slate-900 focus:ring-4 focus:ring-green-500/5 focus:border-green-600 transition-all outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 px-1">{t.state}</label>
                  <input type="text" value={profile.state} onChange={(e) => updateProfile('state', e.target.value)} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-5 py-3.5 text-sm font-black text-slate-900 focus:ring-4 focus:ring-green-500/5 focus:border-green-600 transition-all outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 px-1">PIN Code</label>
                  <input type="text" value={profile.pincode} onChange={(e) => updateProfile('pincode', e.target.value)} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-5 py-3.5 text-sm font-black text-slate-900 focus:ring-4 focus:ring-green-500/5 focus:border-green-600 transition-all outline-none" />
                </div>
              </div>
            </div>
          </div>
          <div className="pt-6 border-t border-slate-100 flex justify-end">
            <button onClick={handleSaveProfile} disabled={isSaving} className="bg-green-600 text-white px-12 py-4 rounded-[1.2rem] font-black text-xs uppercase tracking-widest hover:bg-green-700 transition-all shadow-xl shadow-green-200 flex items-center gap-3 group disabled:opacity-60">
              {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} className="group-hover:scale-110 transition-transform" />} {t.saveProfile}
            </button>
          </div>
        </div>
      )}

      {/* ═══ FARMS TAB ═══ */}
      {activeTab === 'farms' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-black text-slate-900">My Farms</h3>
              <p className="text-xs text-slate-400">Manage all your farm plots, soil data, and sensors.</p>
            </div>
            <button onClick={openAddFarm} className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-2xl text-xs font-black transition-all shadow-lg shadow-green-200 flex items-center gap-2">
              <Plus size={16} /> Add Farm
            </button>
          </div>

          {farms.length === 0 ? (
            <div className="bg-white rounded-[2.5rem] p-16 border border-slate-200 shadow-xl text-center">
              <Map size={48} className="mx-auto text-slate-100 mb-4" />
              <h4 className="text-lg font-black text-slate-900">No Farms Added</h4>
              <p className="text-sm text-slate-400 mt-1">Add your first farm to start tracking soil, moisture, and NPK data.</p>
              <button onClick={openAddFarm} className="mt-6 bg-green-600 text-white px-6 py-3 rounded-2xl text-xs font-black">
                <Plus size={14} className="inline mr-1" /> Add Your First Farm
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {farms.map(farm => (
                <div key={farm.id} className="bg-white/80 backdrop-blur-xl rounded-[2rem] p-6 border border-slate-200 shadow-xl hover:shadow-green-100 transition-all group relative overflow-hidden">
                  <div className="absolute right-0 top-0 w-32 h-32 bg-green-500 rounded-full blur-[60px] opacity-10 -mr-10 -mt-10"></div>
                  <div className="flex items-start justify-between mb-5 relative z-10">
                    <div>
                      <h4 className="text-lg font-black text-slate-900">{farm.name}</h4>
                      <p className="text-xs text-slate-400 font-black mt-0.5">{farm.area} Acres · {farm.soilType} Soil</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => openEditFarm(farm)} className="p-2 rounded-xl border border-slate-100 text-slate-300 hover:border-blue-500/50 hover:text-blue-600 hover:bg-blue-50 transition-all">
                        <Edit3 size={15} />
                      </button>
                      <button onClick={() => deleteFarm(farm.id)} className="p-2 rounded-xl border border-slate-100 text-slate-300 hover:border-red-500/50 hover:text-red-600 hover:bg-red-50 transition-all">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>

                  {/* Moisture Bar */}
                  <div className="mb-5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1"><Droplets size={12} className="text-blue-600" /> Moisture</span>
                      <span className="text-sm font-black text-slate-900">{farm.moisture}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                      <div className={`h-full rounded-full bg-gradient-to-r ${getMoistureColor(farm.moisture)} transition-all`} style={{ width: `${farm.moisture}%` }}></div>
                    </div>
                  </div>

                  {/* NPK Grid */}
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: 'Nitrogen', key: 'nitrogen', symbol: 'N' },
                      { label: 'Phosphorus', key: 'phosphorus', symbol: 'P' },
                      { label: 'Potassium', key: 'potassium', symbol: 'K' },
                    ].map(nutrient => (
                      <div key={nutrient.key} className={`${getNPKBg(farm[nutrient.key])} rounded-2xl p-3.5 text-center border border-slate-100`}>
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">{nutrient.label}</p>
                        <p className={`text-xl font-black ${getNPKColor(farm[nutrient.key])}`}>{farm[nutrient.key]}</p>
                        <p className="text-[9px] font-black text-slate-300 mt-0.5">{nutrient.symbol} · kg/ha</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ═══ NOTIFICATIONS TAB ═══ */}
      {activeTab === 'notifications' && (
        <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2.5rem] border border-slate-200 shadow-xl space-y-8">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-3">
            <Bell size={18} className="text-blue-600" /> Intelligence Stream
          </h3>
          <div className="grid grid-cols-1 gap-3">
            {Object.entries(notifications).map(([key, value]) => (
              <div key={key} className={`flex items-center justify-between p-5 rounded-2xl border transition-all cursor-pointer group ${value ? 'bg-slate-50 border-green-600/20 shadow-lg' : 'bg-slate-50 border-transparent hover:border-slate-100'}`} onClick={() => setNotifications(prev => ({ ...prev, [key]: !prev[key] }))}>
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${value ? 'bg-green-600 text-white shadow-lg shadow-green-200' : 'bg-white text-slate-200 border border-slate-100'}`}>
                    {key === 'weather' ? <Smartphone size={20} /> : key === 'market' ? <Globe size={20} /> : <Shield size={20} />}
                  </div>
                  <div>
                    <p className={`text-sm font-black capitalize ${value ? 'text-slate-900' : 'text-slate-400'}`}>{key} Alerts</p>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-tight">Real-time push delivery</p>
                  </div>
                </div>
                <div className={`w-12 h-6 rounded-full transition-all relative ${value ? 'bg-green-600' : 'bg-slate-200'}`}>
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${value ? 'left-7' : 'left-1'}`}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── BOTTOM CARDS ─── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button className="bg-white/80 p-8 rounded-[2rem] border border-slate-200 shadow-xl flex items-center justify-between group hover:border-blue-500/50 transition-all">
          <div className="flex items-center gap-5">
            <div className="w-12 h-12 bg-slate-50 text-blue-600 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all duration-500"><CreditCard size={24} /></div>
            <div className="text-left">
               <p className="text-sm font-black text-slate-900 leading-none mb-1">Billing</p>
               <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Invoices & Plan</p>
            </div>
          </div>
          <ChevronRight size={20} className="text-blue-600 group-hover:translate-x-2 transition-transform" />
        </button>
        <button className="bg-white/80 p-8 rounded-[2rem] border border-slate-200 shadow-xl flex items-center justify-between group hover:border-purple-500/50 transition-all">
          <div className="flex items-center gap-5">
            <div className="w-12 h-12 bg-slate-50 text-purple-600 rounded-2xl flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-all duration-500"><Shield size={24} /></div>
            <div className="text-left">
               <p className="text-sm font-black text-slate-900 leading-none mb-1">Security</p>
               <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Access & Privacy</p>
            </div>
          </div>
          <ChevronRight size={20} className="text-purple-600 group-hover:translate-x-2 transition-transform" />
        </button>
        <button className="bg-white/80 p-8 rounded-[2rem] border border-slate-200 shadow-xl flex items-center justify-between group hover:border-orange-500/50 transition-all">
          <div className="flex items-center gap-5">
            <div className="w-12 h-12 bg-slate-50 text-orange-600 rounded-2xl flex items-center justify-center group-hover:bg-orange-600 group-hover:text-white transition-all duration-500"><Smartphone size={24} /></div>
            <div className="text-left">
               <p className="text-sm font-black text-slate-900 leading-none mb-1">Devices</p>
               <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">IOT Node Status</p>
            </div>
          </div>
          <ChevronRight size={20} className="text-orange-600 group-hover:translate-x-2 transition-transform" />
        </button>
      </div>

      {/* ═══ FARM MODAL ═══ */}
      {showFarmModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setShowFarmModal(false)}></div>
          <div className="bg-white rounded-[2rem] w-full max-w-lg p-8 relative z-10 shadow-2xl animate-scaleIn max-h-[90vh] overflow-y-auto border border-slate-200">
            <button onClick={() => setShowFarmModal(false)} className="absolute top-6 right-6 p-2 hover:bg-slate-100 rounded-full transition-all text-slate-300"><X size={18} /></button>
            <h3 className="text-xl font-black text-slate-900 mb-1">{editingFarm ? 'Edit Farm' : 'Add New Farm'}</h3>
            <p className="text-xs text-slate-400 mb-6 font-black uppercase tracking-widest">Fill in the details for your farm plot.</p>
 
            <form onSubmit={saveFarm} className="space-y-5">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Farm Name</label>
                <input type="text" required value={farmForm.name} onChange={(e) => setFarmForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Green Valley Meadows" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-3.5 text-sm text-slate-900 focus:ring-2 focus:ring-green-600 transition-all outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Area (Acres)</label>
                  <input type="number" required value={farmForm.area} onChange={(e) => setFarmForm(p => ({ ...p, area: e.target.value }))} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-3.5 text-sm text-slate-900 focus:ring-2 focus:ring-green-600 transition-all outline-none" />
                </div>
                <CustomDropdown label="Soil Type" value={farmForm.soilType} options={['Loamy', 'Silty', 'Clay', 'Sandy', 'Black Soil', 'Red Soil', 'Alluvial']} onChange={(val) => setFarmForm(p => ({ ...p, soilType: val }))} />
              </div>
 
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1"><Droplets size={12} className="text-blue-600" /> Moisture Level ({farmForm.moisture}%)</label>
                <input type="range" min="0" max="100" value={farmForm.moisture} onChange={(e) => setFarmForm(p => ({ ...p, moisture: parseInt(e.target.value) }))} className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600" />
              </div>
 
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1"><Leaf size={12} className="text-green-600" /> NPK Values (kg/ha)</label>
                <div className="grid grid-cols-3 gap-4">
                  {[{ key: 'nitrogen', label: 'N' }, { key: 'phosphorus', label: 'P' }, { key: 'potassium', label: 'K' }].map(n => (
                    <div key={n.key}>
                      <label className="block text-[9px] font-black text-slate-400 uppercase mb-1 text-center">{n.label}</label>
                      <input type="number" min="0" max="100" value={farmForm[n.key]} onChange={(e) => setFarmForm(p => ({ ...p, [n.key]: parseInt(e.target.value) || 0 }))} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-sm text-center font-black text-slate-900 focus:ring-2 focus:ring-green-600 transition-all outline-none" />
                    </div>
                  ))}
                </div>
              </div>
 
              <button type="submit" className="w-full py-4 rounded-2xl bg-green-600 text-white font-black text-xs uppercase tracking-widest hover:bg-green-700 transition-all shadow-lg shadow-green-200">
                {editingFarm ? 'Update Farm' : 'Save Farm'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
