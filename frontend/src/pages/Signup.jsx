import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Mail, Lock, User, Phone, Eye, EyeOff, Leaf, MapPin, 
  Home, Plus, X, ChevronDown, Sparkles, ArrowLeft,
  Activity, Droplets, Zap
} from 'lucide-react';

const WATER_SOURCES = [
  'Well (Borewell)', 'Well (Open)', 'Canal', 'River', 'Lake', 'Pond', 
  'Rainwater Harvesting', 'Dam', 'Pipeline', 'Municipal Water', 
  'Wastewater Reuse', 'Drip Irrigation System', 'Sprinkler System'
];

const IRRIGATION_TYPES = [
  'Drip Irrigation', 'Sprinkler Irrigation', 'Flood Irrigation', 
  'Furrow Irrigation', 'Basin Irrigation', 'Ring Irrigation', 
  'Drip with Mulch', 'Micro Sprinkler', 'Center Pivot', 
  'Linear Move System', 'Subsurface Drip', 'Surface Irrigation'
];

const PREVIOUS_CROPS = [
  'Rice', 'Wheat', 'Maize', 'Barley', 'Sorghum', 'Millet', 'Bajra', 'Ragi',
  'Gram (Chickpea)', 'Tur (Pigeon Pea)', 'Moong (Green Gram)', 
  'Urad (Black Gram)', 'Lentil', 'Peas', 'Beans', 'Cowpea',
  'Soybean', 'Groundnut', 'Sunflower', 'Sesame', 'Mustard', 
  'Linseed', 'Castor', 'Safflower',
  'Cotton (BT)', 'Cotton (Desi)', 'Cotton (Organic)',
  'Tomato', 'Potato', 'Onion', 'Garlic', 'Carrot', 'Cabbage', 
  'Cauliflower', 'Brinjal', 'Chilli', 'Capsicum', 'Cucumber',
  'Banana', 'Mango', 'Citrus', 'Grape', 'Pomegranate', 'Papaya',
  'Sugarcane', 'Tea', 'Coffee', 'Rubber', 'Tobacco',
  'Berseem', 'Lucerne', 'Napier', 'Co-4 Grass',
  'Turmeric', 'Ginger', 'Cumin', 'Coriander', 'Pepper', 'Cardamom'
];

function SearchableDropdown({ label, value, onChange, options, placeholder, searchTerm, setSearchTerm }) {
  const [isOpen, setIsOpen] = useState(false);
  const filtered = options.filter(opt => opt.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="relative">
      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">{label}</label>
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={(e) => { onChange(e.target.value); setSearchTerm(e.target.value); }}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
          className="block w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-green-500 focus:ring-2 focus:ring-green-500/10 outline-none transition-all"
          placeholder={placeholder}
        />
        <ChevronDown size={14} className={`absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-green-600' : ''}`} />
      </div>
      {isOpen && (
        <div className="absolute z-50 w-full mt-1.5 bg-white border border-slate-200 rounded-xl shadow-xl max-h-44 overflow-y-auto">
          {filtered.length > 0 ? filtered.map((opt, i) => (
            <button
              key={i}
              type="button"
              onClick={() => { onChange(opt); setSearchTerm(''); setIsOpen(false); }}
              className="w-full text-left px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-green-600 transition-all border-b border-slate-50 last:border-none"
            >
              {opt}
            </button>
          )) : (
            <div className="px-4 py-3 text-xs text-slate-400 italic">No matches found</div>
          )}
        </div>
      )}
    </div>
  );
}

const createEmptyFarm = () => ({
  id: Date.now(),
  name: '',
  area: '',
  unit: 'acre',
  address: '',
  moisture: 50,
  nitrogen: 50,
  phosphorus: 50,
  potassium: 50,
  previousCrop: '',
  irrigationType: '',
  waterSource: '',
  pesticideType: 50,
  searchPreviousCrop: '',
  searchIrrigationType: '',
  searchWaterSource: ''
});

export default function Signup() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', password: '', address: '', state: '', district: '', taluka: ''
  });
  const [farms, setFarms] = useState([createEmptyFarm()]);

  const handleSubmit = (e) => {
    e.preventDefault();
    sessionStorage.setItem('agri_authed', 'true');
    navigate('/dashboard');
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const addFarmEntry = () => setFarms([...farms, createEmptyFarm()]);
  const removeFarm = (id) => { if (farms.length > 1) setFarms(farms.filter(f => f.id !== id)); };
  const updateFarm = (id, field, value) => {
    setFarms(farms.map(f => {
      if (f.id !== id) return f;
      const numValue = parseInt(value);
      return { ...f, [field]: isNaN(numValue) ? value : numValue };
    }));
  };
  const updateSearchTerm = (id, field, value) => setFarms(farms.map(f => f.id === id ? { ...f, [field]: value } : f));

  const inputCls = "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-green-500 focus:ring-2 focus:ring-green-500/10 outline-none transition-all";

  return (
    <div className="min-h-screen bg-stone-100 font-sans px-4 py-16 relative overflow-x-hidden">
      {/* Background blobs */}
      <div className="fixed top-1/4 -left-48 w-[400px] h-[400px] bg-green-500/8 rounded-full blur-[100px] pointer-events-none" />
      <div className="fixed bottom-1/4 -right-48 w-[400px] h-[400px] bg-emerald-500/8 rounded-full blur-[100px] pointer-events-none" />

      {/* Back */}
      <Link
        to="/"
        className="fixed top-6 left-6 z-20 flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-slate-600 transition-colors group"
      >
        <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
        Back to home
      </Link>

      <div className="max-w-3xl mx-auto relative z-10 pt-8">
        {/* Page Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center shadow-md shadow-green-200">
            <Leaf size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Create your account</h1>
            <p className="text-sm text-slate-500 font-medium">Set up your agricultural profile</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Identity Card */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="h-1 w-full bg-gradient-to-r from-green-500 to-emerald-500" />
            <div className="p-6 md:p-8">
              <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                <User size={13} className="text-green-600" /> Personal Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Full Name</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-green-600 transition-colors"><User size={16} /></div>
                    <input type="text" name="name" required value={formData.name} onChange={handleChange} className={`${inputCls} pl-11`} placeholder="Rajesh Kumar" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Phone</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-green-600 transition-colors"><Phone size={16} /></div>
                    <input type="tel" name="phone" required value={formData.phone} onChange={handleChange} className={`${inputCls} pl-11`} placeholder="+91 98765 43210" />
                  </div>
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-green-600 transition-colors"><Mail size={16} /></div>
                    <input type="email" name="email" required value={formData.email} onChange={handleChange} className={`${inputCls} pl-11`} placeholder="rajesh@example.com" />
                  </div>
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Password</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-green-600 transition-colors"><Lock size={16} /></div>
                    <input type={showPassword ? 'text' : 'password'} name="password" required value={formData.password} onChange={handleChange} className={`${inputCls} pl-11 pr-12`} placeholder="••••••••" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors">
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Location sub-section */}
            <div className="border-t border-slate-100 px-6 md:px-8 py-6 md:py-8 bg-slate-50/50">
              <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-5 flex items-center gap-2">
                <MapPin size={13} className="text-red-500" /> Location
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <input type="text" name="address" value={formData.address} onChange={handleChange} className={inputCls} placeholder="Village / Street" />
                <select name="state" value={formData.state} onChange={handleChange} className={`${inputCls} appearance-none cursor-pointer`}>
                  <option value="">Select State</option>
                  {['Punjab', 'Maharashtra', 'Karnataka', 'Gujarat', 'Uttar Pradesh', 'Rajasthan', 'Tamil Nadu'].map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <input type="text" name="district" value={formData.district} onChange={handleChange} className={inputCls} placeholder="District" />
                <input type="text" name="taluka" value={formData.taluka} onChange={handleChange} className={inputCls} placeholder="Taluka / Block" />
              </div>
            </div>
          </div>

          {/* Farms Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <Home size={13} className="text-amber-500" /> Farm Plots ({farms.length})
              </h2>
              <button
                type="button"
                onClick={addFarmEntry}
                className="flex items-center gap-1.5 bg-green-50 text-green-700 border border-green-200 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-green-600 hover:text-white hover:border-green-600 transition-all"
              >
                <Plus size={13} /> Add Plot
              </button>
            </div>

            {farms.map((farm, index) => (
              <div key={farm.id} className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Plot #{index + 1}</span>
                  {farms.length > 1 && (
                    <button type="button" onClick={() => removeFarm(farm.id)} className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                      <X size={14} />
                    </button>
                  )}
                </div>

                <div className="p-6 md:p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="md:col-span-2 space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Farm Name</label>
                      <input type="text" value={farm.name} onChange={(e) => updateFarm(farm.id, 'name', e.target.value)} className={inputCls} placeholder="e.g. North Valley Orchards" />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Area</label>
                      <div className="flex gap-2">
                        <input type="number" value={farm.area} onChange={(e) => updateFarm(farm.id, 'area', e.target.value)} className={`${inputCls} flex-1`} placeholder="Size" />
                        <select value={farm.unit} onChange={(e) => updateFarm(farm.id, 'unit', e.target.value)} className="w-24 bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-xs font-bold text-slate-900 focus:bg-white outline-none appearance-none cursor-pointer">
                          {['Acre', 'Ha', 'Bigha', 'Guntha'].map(u => <option key={u} value={u.toLowerCase()}>{u}</option>)}
                        </select>
                      </div>
                    </div>

                    <SearchableDropdown label="Previous Crop" value={farm.previousCrop} onChange={(val) => updateFarm(farm.id, 'previousCrop', val)} options={PREVIOUS_CROPS} placeholder="Select crop" searchTerm={farm.searchPreviousCrop} setSearchTerm={(val) => updateSearchTerm(farm.id, 'searchPreviousCrop', val)} />
                    <SearchableDropdown label="Irrigation Method" value={farm.irrigationType} onChange={(val) => updateFarm(farm.id, 'irrigationType', val)} options={IRRIGATION_TYPES} placeholder="Select method" searchTerm={farm.searchIrrigationType} setSearchTerm={(val) => updateSearchTerm(farm.id, 'searchIrrigationType', val)} />
                    <SearchableDropdown label="Water Source" value={farm.waterSource} onChange={(val) => updateFarm(farm.id, 'waterSource', val)} options={WATER_SOURCES} placeholder="Select source" searchTerm={farm.searchWaterSource} setSearchTerm={(val) => updateSearchTerm(farm.id, 'searchWaterSource', val)} />

                    {/* NPK Sliders */}
                    <div className="md:col-span-2 grid grid-cols-3 gap-4 pt-2">
                      {[{ k: 'nitrogen', l: 'Nitrogen (N)' }, { k: 'phosphorus', l: 'Phosphorus (P)' }, { k: 'potassium', l: 'Potassium (K)' }].map(n => (
                        <div key={n.k} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{n.l}</label>
                            <span className="text-[10px] font-bold text-green-600">{farm[n.k]}%</span>
                          </div>
                          <input type="range" min="0" max="100" value={farm[n.k]} onChange={(e) => updateFarm(farm.id, n.k, e.target.value)} className="w-full h-1.5 bg-slate-100 rounded-full appearance-none cursor-pointer accent-green-600" />
                        </div>
                      ))}
                    </div>

                    {/* Moisture */}
                    <div className="md:col-span-2 pt-1">
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5"><Droplets size={10} className="text-blue-500" /> Soil Moisture</label>
                        <span className="text-[10px] font-bold text-blue-500">{farm.moisture}%</span>
                      </div>
                      <input type="range" min="0" max="100" value={farm.moisture} onChange={(e) => updateFarm(farm.id, 'moisture', e.target.value)} className="w-full h-1.5 bg-slate-100 rounded-full appearance-none cursor-pointer accent-blue-500" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Terms */}
          <label className="flex items-start gap-3 cursor-pointer group">
            <div className="relative flex items-center mt-0.5">
              <input type="checkbox" required className="peer w-4 h-4 bg-slate-100 border border-slate-300 rounded checked:bg-green-600 checked:border-green-600 transition-all appearance-none cursor-pointer" />
              <div className="absolute inset-0 flex items-center justify-center text-white opacity-0 peer-checked:opacity-100 pointer-events-none">
                <Zap size={10} className="fill-current" />
              </div>
            </div>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              I agree to the{' '}
              <span className="text-green-600 underline underline-offset-2">Terms of Service</span>
              {' '}and{' '}
              <span className="text-green-600 underline underline-offset-2">Privacy Policy</span>.
            </p>
          </label>

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-green-200/60 transition-all active:scale-[0.98] flex items-center justify-center gap-2 group text-sm"
          >
            <span>Create Account</span>
            <Sparkles size={16} className="group-hover:rotate-12 transition-transform" />
          </button>

          <p className="text-center text-sm text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="text-green-600 hover:text-green-700 font-bold transition-colors">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
