import React, { useState, useEffect } from 'react';
import { 
  Search, Sparkles, Activity, ShieldCheck, 
  Droplets, Bug, TrendingUp, ChevronRight,
  Leaf, Thermometer, Wind, AlertCircle,
  CheckCircle2, Clock, Zap, Camera, Mic,
  MapPin, Calendar, ArrowRight, ChevronDown,
  Edit3, MoreVertical, Plus, Scissors, X, Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { getProfile, getCurrentWeather, updateFarmProfile, addFarm, deleteFarm } from '../../services/apiClient';


const FARM_IMAGES = [
  "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&q=80&w=800"
];

const CROP_ICONS = {
  wheat: '🌾', rice: '🍚', maize: '🌽', corn: '🌽', cotton: '🧶',
  soybean: '🫛', chickpea: '🥜', mustard: '🌻', sugarcane: '🎋',
  tomato: '🍅', onion: '🧅', potato: '🥔', groundnut: '🥜',
  default: '🌱'
};

const AddFarmModal = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: '',
    farmSize: '',
    soilType: 'loamy',
    waterSource: 'well',
    irrigationType: 'flood',
    cropStage: 'Vegetative'
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(formData);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-fadeIn">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200 flex flex-col"
      >
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/80 shrink-0">
          <h3 className="font-black text-slate-900 flex items-center gap-2.5 text-lg">
            <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center text-green-600">
              <Plus size={18} />
            </div>
            Register New Farm
          </h3>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-200 text-slate-400 hover:text-slate-700 rounded-xl transition-colors">
            <X size={18} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Farm Name</label>
            <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20" placeholder="e.g. West Field" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Farm Size (Acres)</label>
              <input type="number" step="0.1" required value={formData.farmSize} onChange={e => setFormData({...formData, farmSize: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20" placeholder="e.g. 5.5" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Soil Type</label>
              <select value={formData.soilType} onChange={e => setFormData({...formData, soilType: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-green-500">
                {['sandy', 'loamy', 'clay', 'silt', 'red', 'black', 'alluvial', 'other'].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Water Source</label>
              <select value={formData.waterSource} onChange={e => setFormData({...formData, waterSource: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-green-500">
                {['well', 'canal', 'borewell', 'river', 'rain', 'tank', 'other'].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Irrigation Type</label>
              <select value={formData.irrigationType} onChange={e => setFormData({...formData, irrigationType: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-green-500">
                {['drip', 'sprinkler', 'flood', 'furrow', 'rain-fed', 'other'].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
            <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors">Cancel</button>
            <button type="submit" className="px-5 py-2.5 text-sm font-bold text-white bg-green-600 hover:bg-green-700 rounded-xl transition-all shadow-lg shadow-green-200">Register Farm</button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

const EditFarmModal = ({ isOpen, onClose, onUpdate, farm }) => {
  const [formData, setFormData] = useState({
    name: farm?.name || '',
    farmSize: farm?.farmSize || '',
    soilType: farm?.soilType || 'loamy',
    waterSource: farm?.waterSource || 'well',
    irrigationType: farm?.irrigationType || 'flood',
    cropStage: farm?.cropStage || 'Vegetative'
  });

  useEffect(() => {
    if (farm) {
      setFormData({
        name: farm.name || '',
        farmSize: farm.farmSize || '',
        soilType: farm.soilType || 'loamy',
        waterSource: farm.waterSource || 'well',
        irrigationType: farm.irrigationType || 'flood',
        cropStage: farm.cropStage || 'Vegetative'
      });
    }
  }, [farm]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate({ ...formData, farmId: farm._id });
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-fadeIn">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200 flex flex-col"
      >
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/80 shrink-0">
          <h3 className="font-black text-slate-900 flex items-center gap-2.5 text-lg">
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
              <Edit3 size={18} />
            </div>
            Edit Farm Details
          </h3>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-200 text-slate-400 hover:text-slate-700 rounded-xl transition-colors">
            <X size={18} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Farm Name</label>
            <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Farm Size (Acres)</label>
              <input type="number" step="0.1" required value={formData.farmSize} onChange={e => setFormData({...formData, farmSize: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-green-500" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Soil Type</label>
              <select value={formData.soilType} onChange={e => setFormData({...formData, soilType: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-green-500">
                {['sandy', 'loamy', 'clay', 'silt', 'red', 'black', 'alluvial', 'other'].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Water Source</label>
              <select value={formData.waterSource} onChange={e => setFormData({...formData, waterSource: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-green-500">
                {['well', 'canal', 'borewell', 'river', 'rain', 'tank', 'other'].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Irrigation Type</label>
              <select value={formData.irrigationType} onChange={e => setFormData({...formData, irrigationType: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-green-500">
                {['drip', 'sprinkler', 'flood', 'furrow', 'rain-fed', 'other'].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
            <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors">Cancel</button>
            <button type="submit" className="px-5 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-lg shadow-blue-200">Update Farm</button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};


const AddCropModal = ({ isOpen, onClose, onAdd, farms = [] }) => {
  const [formData, setFormData] = useState({ name: '', variety: '', planted: '', harvest: '', farmId: farms[0]?._id || '' });

  useEffect(() => {
    if (farms.length > 0 && !formData.farmId) {
      setFormData(prev => ({ ...prev, farmId: farms[0]._id }));
    }
  }, [farms]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.farmId) return;
    onAdd({
      name: formData.name,
      variety: formData.variety || 'Standard',
      planted: formData.planted || new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      harvest: formData.harvest || 'TBD',
      farmId: formData.farmId
    });
    setFormData({ name: '', variety: '', planted: '', harvest: '', farmId: farms[0]?._id || '' });
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-fadeIn">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200 flex flex-col"
      >
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/80 shrink-0">
          <h3 className="font-black text-slate-900 flex items-center gap-2.5 text-lg">
            <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center text-green-600">
              <Plus size={18} />
            </div>
            Register New Crop
          </h3>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-200 text-slate-400 hover:text-slate-700 rounded-xl transition-colors">
            <X size={18} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {farms.length > 1 && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Select Farm</label>
              <select value={formData.farmId} onChange={e => setFormData({...formData, farmId: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-green-500">
                {farms.map(f => <option key={f._id} value={f._id}>{f.name}</option>)}
              </select>
            </div>
          )}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Crop Name</label>
            <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:bg-white focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none" placeholder="e.g. Soybeans" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Variety / Seed</label>
              <input type="text" value={formData.variety} onChange={e => setFormData({...formData, variety: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:bg-white focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none" placeholder="e.g. JS-335" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Planting Date</label>
              <input type="text" value={formData.planted} onChange={e => setFormData({...formData, planted: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:bg-white focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none" placeholder="e.g. Oct 12, 2023" />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Est. Harvest Date</label>
            <input type="text" value={formData.harvest} onChange={e => setFormData({...formData, harvest: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:bg-white focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none" placeholder="e.g. Apr 2024" />
          </div>
          <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
            <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-200 hover:text-slate-900 rounded-xl transition-colors">Cancel</button>
            <button type="submit" className="px-5 py-2.5 text-sm font-bold text-white bg-green-600 hover:bg-green-700 rounded-xl transition-all shadow-lg shadow-green-200">Add Crop</button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default function Overview({ setIsChatOpen }) {
  const [myCrops, setMyCrops] = useState([]);
  const [showAddCropModal, setShowAddCropModal] = useState(false);
  const [showAddFarmModal, setShowAddFarmModal] = useState(false);
  const [showEditFarmModal, setShowEditFarmModal] = useState(false);
  const [editingFarm, setEditingFarm] = useState(null);
  const [farmNodes, setFarmNodes] = useState([]);
  const [isLoadingFarms, setIsLoadingFarms] = useState(true);
  const [profile, setProfile] = useState(null);

  const loadData = async () => {
    setIsLoadingFarms(true);
    try {
      const profileRes = await getProfile();
      const farms = profileRes?.farms || [];
      const user = profileRes?.user;
      setProfile(profileRes);

      if (farms.length > 0) {
        const { lat, lng } = user?.location || {};
        let weatherData = { temp: '--', humidity: '--' };
        try {
          const wr = await getCurrentWeather(lat || 20.5937, lng || 78.9629);
          if (wr?.data) weatherData = { temp: Math.round(wr.data.temperature), humidity: wr.data.humidity };
        } catch { }

        const nodes = farms.map((farm, idx) => ({
          ...farm, // Keep original data for editing
          id: farm._id,
          name: farm.name || `Farm ${idx + 1}`,
          location: user?.location ? `${user.location.district || ''}, ${user.location.state || ''}` : 'India',
          intelligence: 85,
          status: 'Active',
          models: {
            soil: farm.soilType || 'Setup Needed',
            irrigation: farm.irrigationType || 'flood',
            water: farm.waterSource || 'well'
          },
          metrics: { moisture: '45', temp: weatherData.temp },
          image: FARM_IMAGES[idx % FARM_IMAGES.length]
        }));
        setFarmNodes(nodes);

        // Aggregate crops from all farms
        const allCrops = [];
        farms.forEach(farm => {
          if (farm.currentCrops) {
            farm.currentCrops.forEach(c => {
              allCrops.push({
                id: `${farm._id}-${c}`,
                farmId: farm._id,
                name: c.charAt(0).toUpperCase() + c.slice(1),
                variety: 'Standard',
                planted: 'Active',
                harvest: 'TBD',
                stage: farm.cropStage || 'Vegetative',
                progress: 50,
                health: 'Active',
                icon: CROP_ICONS[c.toLowerCase()] || CROP_ICONS.default
              });
            });
          }
        });
        setMyCrops(allCrops);
      } else {
        setFarmNodes([]);
        setMyCrops([]);
      }
    } catch (err) {
      console.error('Failed to load profile data', err);
    } finally {
      setIsLoadingFarms(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddFarm = async (farmData) => {
    try {
      await addFarm(farmData);
      setShowAddFarmModal(false);
      loadData();
    } catch (err) {
      console.error('Failed to add farm', err);
    }
  };

  const handleDeleteFarm = async (farmId) => {
    if (!window.confirm('Are you sure you want to delete this farm? All its data will be lost.')) return;
    try {
      await deleteFarm(farmId);
      loadData();
    } catch (err) {
      console.error('Failed to delete farm', err);
    }
  };

  const handleUpdateFarm = async (updatedData) => {
    try {
      await updateFarmProfile(updatedData);
      setShowEditFarmModal(false);
      setEditingFarm(null);
      loadData();
    } catch (err) {
      console.error('Failed to update farm', err);
    }
  };

  const handleAddCrop = async (newCrop) => {
    try {
      const targetFarmId = newCrop.farmId;
      const targetFarm = profile?.farms?.find(f => f._id === targetFarmId);
      if (!targetFarm) return;

      const existingCrops = targetFarm.currentCrops || [];
      const updatedCrops = [...existingCrops, newCrop.name.toLowerCase()];
      await updateFarmProfile({
        farmId: targetFarmId,
        currentCrops: updatedCrops
      });
      setShowAddCropModal(false);
      loadData();
    } catch (err) {
      console.error('Failed to add crop', err);
    }
  };

  const handleDeleteCrop = async (farmId, cropName) => {
    if (!window.confirm(`Remove ${cropName} from your cultivation list?`)) return;
    try {
      const targetFarm = profile?.farms?.find(f => f._id === farmId);
      if (!targetFarm) return;

      const updatedCrops = (targetFarm.currentCrops || []).filter(c => c.toLowerCase() !== cropName.toLowerCase());
      await updateFarmProfile({
        farmId,
        currentCrops: updatedCrops
      });
      loadData();
    } catch (err) {
      console.error('Failed to remove crop', err);
    }
  };

  return (
    <div className="space-y-0 pb-40">
      {showAddCropModal && (
        <AddCropModal 
          isOpen={showAddCropModal} 
          onClose={() => setShowAddCropModal(false)} 
          onAdd={handleAddCrop} 
          farms={profile?.farms || []}
        />
      )}
      {showAddFarmModal && <AddFarmModal isOpen={showAddFarmModal} onClose={() => setShowAddFarmModal(false)} onAdd={handleAddFarm} />}
      {showEditFarmModal && <EditFarmModal isOpen={showEditFarmModal} onClose={() => { setShowEditFarmModal(false); setEditingFarm(null); }} onUpdate={handleUpdateFarm} farm={editingFarm} />}
      
      {/* ─── AI AGENT COMMAND CENTER ─── */}
      <section className="h-[80vh] flex flex-col items-center justify-center text-center px-4 relative">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-10"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-600/5 text-green-700 rounded-full border border-green-600/10 mb-6 shadow-sm">
            <Zap size={14} />
            <span className="text-[9px] font-black uppercase tracking-[0.2em]">AgriSense Neural Engine v2.4</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Consult your Neural Agent <br />
            <span className="text-green-600">for predictive farm insights.</span>
          </h2>
        </motion.div>

        <button 
          type="button"
          onClick={() => { console.log('CHAT TRIGGER CLICKED'); setIsChatOpen(true); }}
          className="w-full max-w-xl group cursor-pointer bg-white rounded-2xl p-2 border border-slate-200 shadow-xl flex items-center gap-5 relative z-50 active:scale-[0.98] transition-all hover:border-green-600/50 hover:shadow-green-200"
        >
          <div className="w-14 h-14 bg-green-600 text-white rounded-xl flex items-center justify-center shadow-lg flex-shrink-0 pointer-events-none">
            <Sparkles size={24} />
          </div>
          
          <div className="flex-1 flex flex-col justify-center overflow-hidden text-left py-1 pointer-events-none">
            <div className="flex items-center gap-3">
              <Search size={20} className="text-slate-300" />
              <span className="text-slate-900 font-bold text-lg tracking-tight">Access Neural Command...</span>
            </div>
          </div>

          <div className="flex items-center gap-5 pr-6 border-l border-slate-100 pl-6 ml-1 pointer-events-none">
            <Mic size={22} className="text-slate-400" />
            <Camera size={22} className="text-slate-400" />
          </div>
        </button>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-400"
        >
          <span className="text-[9px] font-black uppercase tracking-[0.2em]">Scroll for Agent Telemetry</span>
          <div className="animate-bounce">
            <ChevronDown size={20} />
          </div>
        </motion.div>
      </section>

      {/* ─── MY FARMS HEALTH ─── */}
      <section className="max-w-7xl mx-auto px-4 space-y-12 pt-20 mb-32">
        <div className="flex items-end justify-between border-b border-slate-100 pb-6">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">My Farms Health</h2>
            <p className="text-xs text-green-600/60 font-black uppercase tracking-widest mt-1">Real-time Farm Health Analytics</p>
          </div>
          <div className="flex items-center gap-4">
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {isLoadingFarms ? (
            <div className="col-span-full flex items-center justify-center py-20">
              <Loader2 size={32} className="animate-spin text-green-600" />
            </div>
          ) : farmNodes.length === 0 ? (
            <div className="col-span-full bg-white rounded-2xl border border-dashed border-slate-200 p-16 text-center">
              <MapPin size={40} className="mx-auto text-slate-200 mb-4" />
              <h3 className="text-lg font-black text-slate-900 mb-2">No Farms Registered</h3>
              <p className="text-sm text-slate-400 mb-6">Create your first farm profile to unlock AI insights.</p>
              <button onClick={() => setShowAddFarmModal(true)} className="mx-auto flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-green-700 transition-all shadow-lg shadow-green-200">
                <Plus size={16} /> Register My Farm
              </button>
            </div>
          ) : farmNodes.map((node) => (
            <motion.div 
              key={node.id}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden flex flex-col hover:border-green-600/30 transition-all duration-300"
            >
              <div className="h-44 relative">
                <img src={node.image} alt={node.name} className="w-full h-full object-cover transition-all duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-6 left-6">
                  <div className="flex items-center gap-2.5 mb-3">
                    <MapPin size={14} className="text-green-400" />
                    <span className="text-[10px] font-black text-white/90 uppercase tracking-widest leading-none">{node.location}</span>
                  </div>
                  <h3 className="text-2xl font-black text-white leading-tight">{node.name}</h3>
                </div>
                <div className="absolute top-5 right-5 bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/30">
                   <span className="text-[10px] font-black text-white uppercase tracking-widest">{node.status}</span>
                </div>
              </div>

              <div className="p-6 flex flex-col gap-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Overall Farm Health</span>
                    <span className="text-sm font-black text-green-600">{node.intelligence}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-100">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: `${node.intelligence}%` }}
                      transition={{ duration: 1, delay: 0.2 }}
                      className="h-full bg-green-600 shadow-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center shadow-sm">
                      <Droplets size={20} />
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Hydration Model</p>
                      <p className="text-base font-black text-slate-900">{node.metrics.moisture}%</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center shadow-sm">
                      <Thermometer size={20} />
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Thermal Node</p>
                      <p className="text-base font-black text-slate-900">{node.metrics.temp}°C</p>
                    </div>
                  </div>
                </div>

                <div className="pt-5 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex gap-4">
                    {Object.entries(node.models).map(([key, value]) => (
                      <div key={key} className="flex flex-col items-center">
                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-[0.1em] mb-1">{key.replace('_', ' ')}</span>
                        <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase ${
                          value === 'Active' || value === 'Predictive' || value === 'Stable'
                            ? 'bg-green-100 text-green-700 border border-green-200'
                            : 'bg-amber-100 text-amber-700 border border-amber-200'
                        }`}>
                          {value}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => { setEditingFarm(node); setShowEditFarmModal(true); }}
                      className="bg-slate-50 text-slate-700 px-4 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-blue-50 hover:text-blue-600 transition-all border border-slate-100"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteFarm(node.id)}
                      className="bg-slate-50 text-red-600 px-4 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-red-50 transition-all border border-slate-100"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── MY CROPS (NEURAL INVENTORY) ─── */}
      <section className="max-w-7xl mx-auto px-4 space-y-10 pt-32">
        <div className="flex items-end justify-between border-b border-slate-100 pb-6">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">My Crops</h2>
            <p className="text-xs text-green-600/60 font-black uppercase tracking-widest mt-1">Active Cultivation Pipeline</p>
          </div>
          <button onClick={() => setShowAddCropModal(true)} className="flex items-center gap-2 bg-green-600 text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-green-700 transition-all shadow-lg shadow-green-200">
            <Plus size={14} /> Register New Crop
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {myCrops.map((crop) => (
            <motion.div
              key={crop.id}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl border border-slate-200 shadow-xl p-6 hover:border-green-600/30 transition-all group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-green-600/5 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-700"></div>
              
              <div className="flex items-start justify-between mb-6 relative z-10">
                <div className="w-14 h-14 bg-slate-50 rounded-xl flex items-center justify-center text-3xl shadow-sm border border-slate-100 group-hover:rotate-6 transition-transform">
                  {crop.icon}
                </div>
                <div className="flex gap-1">
                    <button 
                      onClick={() => handleDeleteCrop(crop.farmId, crop.name)}
                      className="p-2 hover:bg-slate-100 rounded-lg text-slate-300 hover:text-red-600 transition-colors"
                    >
                       <Scissors size={16} />
                    </button>
                </div>
              </div>

              <div className="relative z-10 mb-6">
                 <div className="flex items-center justify-between mb-1">
                    <h3 className="text-xl font-black text-slate-900">{crop.name}</h3>
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-[9px] font-black uppercase tracking-widest border border-green-200">
                       {crop.health}
                    </span>
                 </div>
                 <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{crop.variety}</p>
              </div>

              <div className="space-y-4 relative z-10">
                <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-widest text-slate-400">
                       <span>{crop.stage}</span>
                       <span>{crop.progress}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                       <motion.div 
                         initial={{ width: 0 }}
                         whileInView={{ width: `${crop.progress}%` }}
                         transition={{ duration: 1, delay: 0.3 }}
                         className="h-full bg-green-600 shadow-sm"
                       />
                    </div>
                </div>

                 <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-4">
                    <div>
                       <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Planted</p>
                       <div className="flex items-center gap-1.5 text-xs font-black text-slate-700">
                          <Calendar size={12} className="text-blue-600" />
                          {crop.planted}
                       </div>
                    </div>
                    <div>
                       <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Est. Harvest</p>
                       <div className="flex items-center gap-1.5 text-xs font-black text-slate-700">
                          <Zap size={12} className="text-amber-600" />
                          {crop.harvest}
                       </div>
                    </div>
                 </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Chat is now handled at Dashboard level */}
    </div>
  );
}
