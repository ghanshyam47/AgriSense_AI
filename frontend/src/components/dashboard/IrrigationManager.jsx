import React, { useState, useEffect } from 'react';
import {
  Droplets, CloudRain, Clock, Power, CheckCircle2,
  AlertCircle, TrendingDown, Bookmark, ChevronDown,
  Plus, Trash2, Edit2, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { IRRIGATION_DATA, CROPS_LIST } from '../../services/mockData';

const ZoneModal = ({ isOpen, onClose, onSave, editingZone }) => {
  const [formData, setFormData] = useState({
    zone: '',
    time: '08:00 AM',
    duration: '30 mins',
    waterAmount: '100 L',
    status: 'Scheduled'
  });

  useEffect(() => {
    if (editingZone) {
      setFormData(editingZone);
    } else {
      setFormData({
        zone: '',
        time: '08:00 AM',
        duration: '30 mins',
        waterAmount: '100 L',
        status: 'Scheduled'
      });
    }
  }, [editingZone, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-fadeIn">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200"
      >
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <h3 className="font-black text-slate-900 uppercase tracking-tight">
            {editingZone ? 'Edit Irrigation Zone' : 'Register New Zone'}
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-xl transition-colors text-slate-400">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); onSave(formData); }} className="p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Zone Name</label>
            <input
              type="text"
              required
              value={formData.zone}
              onChange={e => setFormData({ ...formData, zone: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
              placeholder="e.g. North Sector 4"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Start Time</label>
              <input
                type="text"
                value={formData.time}
                onChange={e => setFormData({ ...formData, time: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Duration</label>
              <input
                type="text"
                value={formData.duration}
                onChange={e => setFormData({ ...formData, duration: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold outline-none"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Water Intensity</label>
            <input
              type="text"
              value={formData.waterAmount}
              onChange={e => setFormData({ ...formData, waterAmount: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold outline-none"
            />
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-6 py-3 text-sm font-black text-slate-500 hover:bg-slate-100 rounded-xl transition-all">Cancel</button>
            <button type="submit" className="px-6 py-3 text-sm font-black text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-lg shadow-blue-200">
              {editingZone ? 'Update Zone' : 'Activate Zone'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default function IrrigationManager({ bookmarks, toggleBookmark }) {
  const [selectedCrop, setSelectedCrop] = useState(CROPS_LIST[0]);
  const [allSchedules, setAllSchedules] = useState(IRRIGATION_DATA);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingZone, setEditingZone] = useState(null);

  const schedules = allSchedules[selectedCrop.id] || [];
  const isBookmarked = bookmarks.includes(selectedCrop.id);

  const handleSaveZone = (formData) => {
    const cropId = selectedCrop.id;
    const currentSchedules = allSchedules[cropId] || [];

    if (editingZone) {
      const updated = currentSchedules.map(item => item.id === editingZone.id ? formData : item);
      setAllSchedules({ ...allSchedules, [cropId]: updated });
    } else {
      const newZone = { ...formData, id: Date.now() };
      setAllSchedules({ ...allSchedules, [cropId]: [...currentSchedules, newZone] });
    }
    setIsModalOpen(false);
    setEditingZone(null);
  };

  const handleDeleteZone = (id) => {
    if (window.confirm("Terminate this irrigation zone? All automated schedules for this sector will be erased.")) {
      const updated = (allSchedules[selectedCrop.id] || []).filter(item => item.id !== id);
      setAllSchedules({ ...allSchedules, [selectedCrop.id]: updated });
    }
  };

  const toggleStatus = (id) => {
    const updated = (allSchedules[selectedCrop.id] || []).map(item => {
      if (item.id === id) {
        return { ...item, status: item.status === 'Completed' ? 'Scheduled' : 'Completed' };
      }
      return item;
    });
    setAllSchedules({ ...allSchedules, [selectedCrop.id]: updated });
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-20">
      <AnimatePresence>
        {isModalOpen && (
          <ZoneModal
            isOpen={isModalOpen}
            onClose={() => { setIsModalOpen(false); setEditingZone(null); }}
            onSave={handleSaveZone}
            editingZone={editingZone}
          />
        )}
      </AnimatePresence>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white border border-slate-200 p-8 rounded-[2rem] shadow-2xl relative z-[50]">
        <div className="flex items-center gap-6">
          <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center border border-blue-100 shadow-inner">
            <Droplets size={28} className="text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Irrigation Intelligence</h2>
            <p className="text-sm text-slate-400 font-bold uppercase tracking-widest mt-1">
              Neural Water Optimization: {selectedCrop.name}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative group">
            <button className="flex items-center gap-4 bg-slate-50 px-6 py-3 rounded-2xl border border-slate-200 hover:border-blue-600 transition-all shadow-sm">
              <span className="text-xl">{selectedCrop.icon}</span>
              <span className="text-sm font-black text-slate-900 uppercase tracking-wider">{selectedCrop.name}</span>
              <ChevronDown size={18} className="text-slate-400" />
            </button>
            <div className="absolute right-0 top-full mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-[100] transform origin-top-right scale-95 group-hover:scale-100">
              {CROPS_LIST.map(crop => (
                <button
                  key={crop.id}
                  onClick={() => setSelectedCrop(crop)}
                  className={`w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-slate-50 transition-all ${selectedCrop.id === crop.id ? 'bg-blue-600/5' : ''}`}
                >
                  <span className="text-xl">{crop.icon}</span>
                  <span className="text-xs font-black text-slate-700 uppercase">{crop.name}</span>
                  {bookmarks.includes(crop.id) && <Bookmark size={12} className="text-blue-600 fill-blue-600 ml-auto" />}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={() => toggleBookmark(selectedCrop.id)}
            className={`p-3.5 rounded-2xl border transition-all ${isBookmarked ? 'bg-blue-600 border-blue-500 text-white shadow-xl shadow-blue-200' : 'bg-slate-50 border-slate-200 text-slate-300 hover:text-blue-600 shadow-sm'}`}
          >
            <Bookmark size={22} className={isBookmarked ? 'fill-white' : ''} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-[2rem] border border-slate-200 shadow-2xl overflow-hidden">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-black text-slate-900 uppercase tracking-widest text-sm flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                Active Node Schedules
              </h3>
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-95"
              >
                <Plus size={16} /> Register Zone
              </button>
            </div>
            <div className="divide-y divide-slate-100">
              {schedules.length > 0 ? (
                schedules.map((item) => (
                  <motion.div
                    layout
                    key={item.id}
                    className="p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-slate-50 transition-colors group"
                  >
                    <div className="flex items-start gap-5">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm border ${item.status === 'Completed' ? 'bg-green-50 border-green-100 text-green-600' :
                        item.status.includes('Delayed') ? 'bg-amber-50 border-amber-100 text-amber-600' :
                          'bg-blue-50 border-blue-100 text-blue-600'
                        }`}>
                        {item.status === 'Completed' ? <CheckCircle2 size={24} /> :
                          item.status.includes('Delayed') ? <AlertCircle size={24} /> : <Clock size={24} />}
                      </div>
                      <div>
                        <h4 className="font-black text-slate-900 text-lg tracking-tight">{item.zone}</h4>
                        <div className="flex items-center gap-5 mt-2 text-[10px] text-slate-400 font-black uppercase tracking-widest">
                          <span className="flex items-center gap-1.5"><Clock size={14} className="text-blue-500" /> {item.time}</span>
                          <span className="flex items-center gap-1.5"><Droplets size={14} className="text-blue-500" /> {item.waterAmount}</span>
                          <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-500">{item.duration}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.15em] border ${item.status === 'Completed' ? 'bg-green-100 text-green-700 border-green-200' :
                        item.status.includes('Delayed') ? 'bg-amber-100 text-amber-700 border-amber-200 animate-pulse' :
                          'bg-blue-100 text-blue-700 border-blue-200'
                        }`}>
                        {item.status}
                      </span>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => { setEditingZone(item); setIsModalOpen(true); }}
                          className="p-2.5 rounded-xl border bg-white border-slate-200 text-slate-400 hover:border-blue-600 hover:text-blue-600 transition-all shadow-sm"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteZone(item.id)}
                          className="p-2.5 rounded-xl border bg-white border-slate-200 text-slate-400 hover:border-red-600 hover:text-red-600 transition-all shadow-sm"
                        >
                          <Trash2 size={16} />
                        </button>
                        <button
                          onClick={() => toggleStatus(item.id)}
                          className={`p-2.5 rounded-xl border transition-all shadow-sm ${item.status === 'Completed' ? 'bg-blue-600 border-blue-500 text-white' : 'bg-white border-slate-200 text-slate-400 hover:border-blue-600 hover:text-blue-600'}`}
                        >
                          <Power size={16} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="p-20 text-center">
                  <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6 border border-slate-100">
                    <Droplets size={40} className="text-slate-200" />
                  </div>
                  <h4 className="text-xl font-black text-slate-900 tracking-tight uppercase">Zone Desync</h4>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-2 max-w-[240px] mx-auto">No irrigation schedules detected for this Neural Node.</p>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="mt-8 text-blue-600 font-black uppercase text-[10px] tracking-widest hover:underline"
                  >
                    Register First Zone +
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-8">
          <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
            <h3 className="font-black text-slate-900 uppercase tracking-widest text-xs mb-8 flex items-center gap-2">
              <TrendingDown size={18} className="text-blue-600" /> Efficiency Telemetry
            </h3>
            <div className="space-y-6">
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Cycle Savings: {selectedCrop.name}</p>
                <p className="text-4xl font-black text-slate-900 tracking-tighter">12,400 L</p>
                <div className="mt-4 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                  <p className="text-[9px] text-green-600 font-black uppercase tracking-widest">+15% vs Global Average</p>
                </div>
              </div>
              <div className="bg-blue-600 p-6 rounded-2xl shadow-xl shadow-blue-100 text-white">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-2 opacity-80">Next Neural Optimization</p>
                <p className="text-lg font-black leading-tight">Rain Predicted in 48h. Agent will auto-suspend Node A.</p>
                <button className="mt-4 text-[9px] font-black uppercase tracking-[0.2em] bg-white/20 px-3 py-1.5 rounded-lg border border-white/30 hover:bg-white/30 transition-all">
                  Sync Policy
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
