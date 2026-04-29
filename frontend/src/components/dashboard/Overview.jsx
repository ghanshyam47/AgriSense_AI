import React from 'react';
import { 
  Search, Sparkles, Activity, ShieldCheck, 
  Droplets, Bug, TrendingUp, ChevronRight,
  Leaf, Thermometer, Wind, AlertCircle,
  CheckCircle2, Clock, Zap, Camera, Mic,
  MapPin, Calendar, ArrowRight, ChevronDown,
  Edit3, MoreVertical, Plus, Scissors
} from 'lucide-react';
import { motion } from 'framer-motion';

const AGENT_DATA = [
  {
    id: 1,
    name: "Neural Node: North Valley",
    location: "Punjab, Sector 4",
    intelligence: 94,
    status: "Optimal Performance",
    models: { soil: "Active", growth: "Predictive", neural_sync: "Stable" },
    metrics: { moisture: 62, temp: 24, n: "Optimal", p: "High", k: "Stable" },
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 2,
    name: "Neural Node: East River",
    location: "Haryana, Block B",
    intelligence: 78,
    status: "Optimization Required",
    models: { soil: "Analysis", growth: "Static", neural_sync: "Desync" },
    metrics: { moisture: 38, temp: 28, n: "Stable", p: "Low", k: "Deficit" },
    image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&q=80&w=800"
  }
];

const MY_CROPS = [
  {
    id: 1,
    name: "Durum Wheat",
    variety: "HD-2967",
    planted: "Oct 12, 2023",
    harvest: "Apr 2024",
    stage: "Grain Filling",
    progress: 75,
    health: "Excellent",
    icon: "🌾"
  },
  {
    id: 2,
    name: "Basmati Rice",
    variety: "Pusa-1121",
    planted: "Jun 05, 2023",
    harvest: "Nov 2023",
    stage: "Ripening",
    progress: 92,
    health: "Stable",
    icon: "🍚"
  },
  {
    id: 3,
    name: "Hybrid Corn",
    variety: "DKC-9108",
    planted: "Jan 15, 2024",
    harvest: "May 2024",
    stage: "Vegetative",
    progress: 30,
    health: "Monitoring",
    icon: "🌽"
  }
];

export default function Overview({ setIsChatOpen }) {
  return (
    <div className="space-y-0 pb-40">
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
             <div className="flex items-center gap-1.5 px-3 py-1 bg-green-100 rounded-lg border border-green-200">
                <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                <span className="text-[9px] font-black text-green-700 uppercase">ML Sync: 100%</span>
             </div>
             <button className="text-xs font-black text-green-600 uppercase tracking-widest hover:text-green-700 transition-colors flex items-center gap-1">
                Global Analytics <ChevronRight size={14} />
             </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {AGENT_DATA.map((node) => (
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
                  <button className="bg-green-600 text-white px-5 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-green-700 transition-all shadow-lg shadow-green-200">
                    View Farm Details
                  </button>
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
          <button className="flex items-center gap-2 bg-green-600 text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-green-700 transition-all shadow-lg shadow-green-200">
            <Plus size={14} /> Register New Crop
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {MY_CROPS.map((crop) => (
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
                    <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-300 hover:text-green-600 transition-colors">
                       <Edit3 size={16} />
                    </button>
                    <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-300 hover:text-red-600 transition-colors">
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

                 <button className="w-full mt-4 bg-green-600 text-white py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-green-700 transition-all shadow-lg shadow-green-200">
                    Analyze Growth Path
                 </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Chat is now handled at Dashboard level */}
    </div>
  );
}
