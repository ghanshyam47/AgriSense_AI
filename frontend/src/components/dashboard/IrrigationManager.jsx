import React, { useState, useEffect } from 'react';
import { Droplets, CloudRain, Clock, Power, CheckCircle2, AlertCircle, TrendingDown, Bookmark, ChevronDown, Sparkles } from 'lucide-react';
import { CROPS_LIST } from '../../services/constants';
import { getIrrigationToday } from '../../services/apiClient';

export default function IrrigationManager({ bookmarks, toggleBookmark }) {
  const [selectedCrop, setSelectedCrop] = useState(CROPS_LIST[0]);
  const [schedules, setSchedules] = useState([]);
  const [reasoning, setReasoning] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const isBookmarked = bookmarks.includes(selectedCrop.id);

  useEffect(() => {
    let isMounted = true;
    const fetchIrrigation = async () => {
      setIsLoading(true);
      try {
        // India center coords (fallback when no farm location is set)
        const lat = 20.5937, lng = 78.9629; 
        const res = await getIrrigationToday(lat, lng, selectedCrop.name);
        
        if (!isMounted) return;

        if (res && res.data && res.data.prediction) {
          const mlResponse = res.data.prediction;
          const planData = mlResponse.plan;
          
          setReasoning(res.data.reasoning || planData?.advice || '');
          
          if (planData && planData.daily_plan && planData.daily_plan.length > 0) {
            const todayPlan = planData.daily_plan[0];
            
            if (todayPlan.should_irrigate) {
              setSchedules([
                { id: 1, zone: 'Zone A (North)', time: '06:00 AM', waterAmount: `${todayPlan.water_need_mm}mm`, duration: '45 mins', status: 'Pending' },
                { id: 2, zone: 'Zone B (South)', time: '07:00 AM', waterAmount: `${todayPlan.water_need_mm}mm`, duration: '45 mins', status: 'Pending' }
              ]);
            } else {
              setSchedules([
                { id: 1, zone: 'All Zones', time: 'N/A', waterAmount: '0mm', duration: '0 mins', status: 'Completed (No water needed)' }
              ]);
            }
          } else {
            setSchedules([
              { id: 1, zone: 'All Zones', time: 'N/A', waterAmount: '0mm', duration: '0 mins', status: 'Completed (No water needed)' }
            ]);
          }
        }
      } catch (err) {
        console.error("Failed to fetch irrigation data", err);
        if (isMounted) setSchedules([]);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    fetchIrrigation();
    return () => { isMounted = false; };
  }, [selectedCrop]);

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/80 backdrop-blur-2xl p-6 rounded-2xl border border-slate-200 shadow-xl relative z-[50]">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
            <Droplets size={24} className="text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Irrigation Control</h2>
            <p className="text-sm text-slate-500">Smart water management for your {selectedCrop.name} fields.</p>
          </div>
        </div>

        {/* Crop Selector Corner */}
        <div className="flex items-center gap-3">
          <div className="relative group">
            <button className="flex items-center gap-3 bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-200 hover:border-blue-600 transition-all shadow-sm">
              <span className="text-lg">{selectedCrop.icon}</span>
              <span className="text-sm font-bold text-slate-900">{selectedCrop.name}</span>
              <ChevronDown size={16} className="text-slate-400" />
            </button>
            <div className="absolute right-0 top-full mt-2 w-48 bg-white backdrop-blur-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-[100]">
              {CROPS_LIST.map(crop => (
                <button
                  key={crop.id}
                  onClick={() => setSelectedCrop(crop)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-slate-50 transition-all ${selectedCrop.id === crop.id ? 'bg-blue-600/5' : ''}`}
                >
                  <span className="text-lg">{crop.icon}</span>
                  <span className="text-sm font-bold text-slate-700">{crop.name}</span>
                  {bookmarks.includes(crop.id) && <Bookmark size={12} className="text-blue-600 fill-blue-600 ml-auto" />}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={() => toggleBookmark(selectedCrop.id)}
            className={`p-2.5 rounded-xl border transition-all ${isBookmarked ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-200' : 'bg-slate-50 border-slate-200 text-slate-300 hover:text-blue-600 shadow-sm'}`}
          >
            <Bookmark size={20} className={isBookmarked ? 'fill-white' : ''} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Active Schedule */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-blue-50/50">
              <div className="flex items-center gap-2 text-blue-700 font-bold">
                <Sparkles size={18} />
                <h3>AI Recommendation</h3>
              </div>
            </div>
            <div className="p-6">
               <p className="text-sm text-slate-600 leading-relaxed font-medium">
                 {isLoading ? 'Analyzing weather and soil conditions...' : (reasoning || 'No immediate irrigation required based on current conditions.')}
               </p>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-slate-900">{selectedCrop.name} Watering Schedule</h3>
              <button className="text-xs font-bold text-blue-600 hover:underline">+ New Zone</button>
            </div>
            <div className="divide-y divide-slate-50">
              {isLoading ? (
                <div className="p-12 text-center text-slate-400 font-medium">Loading schedule...</div>
              ) : schedules.length > 0 ? (
                schedules.map((item) => (
                  <div key={item.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50 transition-colors group">
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${item.status.includes('Completed') ? 'bg-green-100' :
                        item.status.includes('Delayed') ? 'bg-amber-100' : 'bg-blue-100'
                        }`}>
                        {item.status.includes('Completed') ? <CheckCircle2 className="text-green-600" size={20} /> :
                          item.status.includes('Delayed') ? <AlertCircle className="text-amber-600" size={20} /> : <Clock className="text-blue-600" size={20} />}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900">{item.zone}</h4>
                        <div className="flex items-center gap-3 mt-1 text-xs text-slate-400 font-medium">
                          <span className="flex items-center gap-1"><Clock size={12} /> {item.time}</span>
                          <span className="flex items-center gap-1"><Droplets size={12} /> {item.waterAmount}</span>
                          <span>{item.duration}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${item.status.includes('Completed') ? 'bg-green-100 text-green-700' :
                        item.status.includes('Delayed') ? 'bg-amber-100 text-amber-700 animate-pulse' : 'bg-blue-100 text-blue-700'
                        }`}>
                        {item.status}
                      </span>
                      <button className="p-2 rounded-lg border bg-slate-50 border-slate-200 text-slate-300 hover:border-blue-600 hover:text-blue-600 transition-all">
                        <Power size={18} />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-12 text-center">
                  <Droplets size={48} className="mx-auto text-slate-100 mb-4" />
                  <h4 className="text-lg font-bold text-slate-900">No Schedules Found</h4>
                  <p className="text-sm text-slate-400">There are no irrigation schedules set for this crop yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats Column */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl border border-slate-200 shadow-xl">
            <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
              <TrendingDown size={18} className="text-blue-600" /> Water Efficiency
            </h3>
            <div className="space-y-6">
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                <p className="text-xs font-black text-blue-400/60 uppercase tracking-widest mb-1">Savings for {selectedCrop.name}</p>
                <p className="text-2xl font-bold text-slate-900">12,400 L</p>
                <p className="text-[10px] text-blue-600 font-bold mt-1 uppercase tracking-widest">15% more efficient than avg.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
