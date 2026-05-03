import React, { useState, useEffect, useRef } from 'react';
import { 
  Cloud, Sun, CloudRain, Wind, Droplets, Thermometer, 
  Calendar, ChevronDown, BarChart2, Activity, AreaChart as AreaIcon, LineChart as LineIcon,
  MapPin, RefreshCw, Search, Globe, Check
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, LineChart, Line, Legend } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { getForecast, getCurrentWeather } from '../../services/apiClient';

const REGIONAL_STATIONS = {
  'Punjab': ['Majha', 'Doaba', 'Malwa', 'Puar'],
  'Maharashtra': ['Konkan', 'Paschim Maharashtra', 'Khandesh', 'Marathwada', 'Vidarbha'],
  'Karnataka': ['Coastal', 'Malnad', 'North Karnataka', 'South Karnataka'],
  'Madhya Pradesh': ['Malwa', 'Nimar', 'Bundelkhand', 'Baghelkhand', 'Mahakoshal'],
  'Uttar Pradesh': ['Western UP', 'Central UP', 'Eastern UP', 'Bundelkhand'],
  'Gujarat': ['Saurashtra', 'Kutch', 'North Gujarat', 'South Gujarat']
};

const getStateCoords = (state) => {
  const coords = {
    'Punjab': { lat: 31.1471, lng: 75.3412 },
    'Maharashtra': { lat: 19.7515, lng: 75.7139 },
    'Karnataka': { lat: 15.3173, lng: 75.7139 },
    'Madhya Pradesh': { lat: 22.9734, lng: 78.6569 },
    'Uttar Pradesh': { lat: 26.8467, lng: 80.9462 },
    'Gujarat': { lat: 22.2587, lng: 71.1924 }
  };
  return coords[state] || { lat: 20.5937, lng: 78.9629 };
};

const CustomDropdown = ({ label, value, options, onChange, icon: Icon }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex-1 relative" ref={dropdownRef}>
      <label className="absolute -top-2.5 left-4 px-2 bg-white text-[9px] font-bold text-blue-600 uppercase tracking-widest z-10">{label}</label>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center bg-slate-50 border ${isOpen ? 'border-blue-600 ring-4 ring-blue-500/10' : 'border-slate-200'} rounded-xl px-4 py-3 transition-all duration-300 group shadow-sm`}
      >
        <Icon size={16} className={`${isOpen ? 'text-blue-600' : 'text-slate-400'} mr-3 transition-colors`} />
        <span className="text-sm font-bold text-slate-900">{value}</span>
        <ChevronDown size={16} className={`ml-auto text-slate-400 transition-transform duration-500 ${isOpen ? 'rotate-180 text-blue-600' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute top-full left-0 right-0 mt-2 bg-white backdrop-blur-xl border border-slate-200 rounded-xl shadow-2xl z-[100] py-2 overflow-hidden"
          >
            <div className="max-h-60 overflow-y-auto custom-scrollbar">
              {options.map((opt) => (
                <button
                  key={opt}
                  onClick={() => {
                    onChange(opt);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-5 py-3 text-left hover:bg-slate-50 transition-colors group ${value === opt ? 'bg-blue-600/5 text-blue-600' : 'text-slate-600'}`}
                >
                  <span className="text-sm font-bold tracking-tight">{opt}</span>
                  {value === opt && <Check size={14} className="text-blue-600" />}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function WeatherAnalytics() {
  const [timeFilter, setTimeFilter] = useState('days'); 
  const [chartType, setChartType] = useState('area');
  const [selectedState, setSelectedState] = useState('Punjab');
  const [selectedRegion, setSelectedRegion] = useState('Malwa');
  const [isSyncing, setIsSyncing] = useState(false);
  const [localData, setLocalData] = useState([]);
  const [currentWeather, setCurrentWeather] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchWeather = async () => {
      setIsSyncing(true);
      try {
        const { lat, lng } = getStateCoords(selectedState);
        const res = await getForecast(lat, lng);
        if (isMounted && res && res.data && res.data.daily) {
          const mappedData = res.data.daily.map(d => ({
            time: new Date(d.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
            temp: d.temp_avg,
            rainfall: d.rainfall,
            humidity: d.humidity,
            wind: d.wind_avg
          }));
          setLocalData(mappedData);
        }
      } catch (err) {
        console.error("Failed to fetch weather", err);
      } finally {
        if (isMounted) setIsSyncing(false);
      }
    };
    fetchWeather();
    return () => { isMounted = false; };
  }, [selectedState, selectedRegion, timeFilter]);

  // Fetch current weather separately
  useEffect(() => {
    let mounted = true;
    const { lat, lng } = getStateCoords(selectedState);
    getCurrentWeather(lat, lng)
      .then(res => {
        if (mounted && res?.data) setCurrentWeather(res.data);
      })
      .catch(() => {});
    return () => { mounted = false; };
  }, [selectedState]);

  const XAxisProps = {
    dataKey: "time",
    axisLine: false,
    tickLine: false,
    tick: { fontSize: 9, fill: '#64748b', fontWeight: 'bold' },
    dy: 10,
    interval: timeFilter === 'days' ? 0 : 'preserveStartEnd'
  };

  const renderChart = () => {
    const commonProps = {
      data: localData,
      margin: { top: 10, right: 10, left: 0, bottom: 0 }
    };

    if (isSyncing) return (
      <div className="h-full w-full flex flex-col items-center justify-center space-y-4">
          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}>
            <RefreshCw size={32} className="text-blue-600" />
          </motion.div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] animate-pulse">Syncing {selectedRegion} Station...</p>
      </div>
    );

    switch (chartType) {
      case 'bar':
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
            <XAxis {...XAxisProps} />
            <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#64748b'}} />
            <Tooltip 
              contentStyle={{ borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)', background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(8px)', color: '#0f172a' }}
              itemStyle={{ color: '#0f172a' }}
              cursor={{ fill: 'rgba(0,0,0,0.02)' }}
            />
            <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ paddingBottom: '20px', fontSize: '11px', fontWeight: 'bold', color: '#64748b' }} />
            <Bar dataKey="temp" fill="#ef4444" radius={[4, 4, 0, 0]} name="Temp (°C)" />
            <Bar dataKey="rainfall" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Rainfall (mm)" />
          </BarChart>
        );
      case 'line':
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
            <XAxis {...XAxisProps} />
            <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#64748b'}} />
            <Tooltip contentStyle={{ borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)', background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(8px)', color: '#0f172a' }} itemStyle={{ color: '#0f172a' }} />
            <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ paddingBottom: '20px', fontSize: '11px', fontWeight: 'bold', color: '#64748b' }} />
            <Line type="monotone" dataKey="temp" stroke="#ef4444" strokeWidth={3} dot={{ r: 4, fill: '#ef4444' }} name="Temp (°C)" />
            <Line type="monotone" dataKey="rainfall" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#3b82f6' }} name="Rainfall (mm)" />
          </LineChart>
        );
      default:
        return (
          <AreaChart {...commonProps}>
            <defs>
              <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorRain" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
            <XAxis {...XAxisProps} />
            <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#64748b'}} />
            <Tooltip contentStyle={{ borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)', background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(8px)', color: '#0f172a' }} itemStyle={{ color: '#0f172a' }} />
            <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ paddingBottom: '20px', fontSize: '11px', fontWeight: 'bold', color: '#64748b' }} />
            <Area type="monotone" dataKey="temp" stroke="#ef4444" fillOpacity={1} fill="url(#colorTemp)" strokeWidth={3} name="Temp (°C)" />
            <Area type="monotone" dataKey="rainfall" stroke="#3b82f6" fillOpacity={1} fill="url(#colorRain)" strokeWidth={3} name="Rainfall (mm)" />
          </AreaChart>
        );
    }
  };

  return (
    <div className="space-y-5 animate-fadeIn pb-6">
      {/* ─── LOCATION SELECTOR ─── */}
      <div className="bg-white/80 backdrop-blur-2xl rounded-2xl p-5 border border-slate-200 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 relative z-[50] overflow-visible">
         <div className="flex items-center gap-5 px-4">
            <div className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-blue-200 ring-4 ring-slate-50">
               <MapPin size={28} />
            </div>
            <div>
               <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-none mb-1">{selectedRegion}</h3>
               <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{selectedState}</p>
            </div>
         </div>

         <div className="flex flex-1 max-w-2xl gap-5 w-full">
            <CustomDropdown 
              label="Select State"
              value={selectedState}
              options={Object.keys(REGIONAL_STATIONS)}
              onChange={(s) => {
                setSelectedState(s);
                setSelectedRegion(REGIONAL_STATIONS[s][0]);
              }}
              icon={Globe}
            />

            <CustomDropdown 
              label="Agro-Region"
              value={selectedRegion}
              options={REGIONAL_STATIONS[selectedState]}
              onChange={setSelectedRegion}
              icon={Search}
            />
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-5 text-white shadow-lg relative overflow-hidden group hover:scale-[1.02] transition-all duration-500">
            <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-1000"></div>
            <p className="text-[10px] font-bold text-blue-100 uppercase tracking-widest mb-3">Live Forecast</p>
            <div className="flex items-center gap-4">
               <CloudRain size={36} />
               <div>
                   <h3 className="text-2xl font-black tracking-tight leading-none mb-1">{currentWeather?.description || 'Loading...'}</h3>
                   <p className="text-[10px] text-blue-100 font-bold uppercase tracking-widest">In {selectedRegion}</p>
               </div>
            </div>
         </div>
         <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4 hover:bg-slate-50 transition-all duration-500 group">
            <div className="w-12 h-12 bg-red-50 text-red-600 rounded-xl flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition-all duration-500">
               <Thermometer size={24} />
            </div>
            <div>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Temperature</p>
               <h3 className="text-2xl font-black text-slate-900 leading-none">{currentWeather?.temperature ?? localData[0]?.temp ?? '—'}°C</h3>
            </div>
         </div>
         <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4 hover:bg-slate-50 transition-all duration-500 group">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
               <Droplets size={24} />
            </div>
            <div>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Humidity</p>
               <h3 className="text-2xl font-black text-slate-900 leading-none">{currentWeather?.humidity ?? '—'}%</h3>
            </div>
         </div>
         <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4 hover:bg-slate-50 transition-all duration-500 group">
            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center group-hover:bg-green-600 group-hover:text-white transition-all duration-500">
               <Wind size={24} />
            </div>
            <div>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Wind Speed</p>
               <h3 className="text-2xl font-black text-slate-900 leading-none">{currentWeather?.wind_speed ?? '—'} km/h</h3>
            </div>
         </div>
      </div>

      <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 md:p-8 border border-slate-200 shadow-xl relative overflow-hidden">
         <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8 relative z-10">
            <div>
               <h3 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter mb-1.5">Climatic Intelligence</h3>
               <p className="text-xs text-slate-500 font-medium">Station: <span className="text-blue-600 font-bold underline underline-offset-4 decoration-blue-600/20">AS-{(selectedRegion || 'DEF').toUpperCase().slice(0,3)}-026</span> · Active Data Streams</p>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">

               <div className="flex bg-slate-100 p-1.5 rounded-xl border border-slate-200 shadow-inner">
                {[
                  { id: 'area', icon: AreaIcon },
                  { id: 'bar', icon: BarChart2 },
                  { id: 'line', icon: LineIcon }
                ].map(({ id, icon: Icon }) => (
                  <button 
                    key={id}
                    onClick={() => setChartType(id)}
                    className={`p-2 rounded-lg transition-all ${chartType === id ? 'bg-white shadow-md text-blue-600 scale-105' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    <Icon size={18} />
                  </button>
                ))}
             </div>
            </div>
         </div>

         <div className="h-[380px] w-full relative z-10">
            <ResponsiveContainer width="100%" height="100%">
               {renderChart()}
            </ResponsiveContainer>
         </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-slate-100 relative z-10">
            <div className="flex items-center gap-5 p-5 rounded-2xl bg-slate-50 hover:bg-white transition-all border border-transparent hover:border-slate-200 hover:shadow-lg group">
               <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                  <Calendar size={24} />
               </div>
               <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Historical Peak</p>
                  <p className="text-base font-black text-slate-900">{localData.length > 0 ? [...localData].sort((a,b) => b.temp - a.temp)[0]?.temp : '24'}°C</p>
                  <p className="text-[10px] text-slate-400 font-bold tracking-tight uppercase">{selectedRegion} Region</p>
               </div>
            </div>
            <div className="flex items-center gap-5 p-5 rounded-2xl bg-slate-50 hover:bg-white transition-all border border-transparent hover:border-slate-200 hover:shadow-lg group">
               <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center group-hover:bg-green-600 group-hover:text-white transition-all duration-500">
                  <CloudRain size={24} />
               </div>
               <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Avg Rainfall</p>
                  <p className="text-base font-black text-slate-900">{localData.length > 0 ? Math.round(localData.reduce((acc,curr) => acc + curr.rainfall, 0) / localData.length) : '0'} mm</p>
                  <p className="text-[10px] text-slate-400 font-bold tracking-tight uppercase">Intensity Index</p>
               </div>
            </div>
            <div className="flex items-center gap-5 p-5 rounded-2xl bg-slate-50 hover:bg-white transition-all border border-transparent hover:border-slate-200 hover:shadow-lg group">
               <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-all duration-500">
                  <Activity size={24} />
               </div>
               <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Climatic Health</p>
                  <p className="text-base font-black text-slate-900">Optimal (98%)</p>
                  <p className="text-[10px] text-slate-400 font-bold tracking-tight uppercase">{selectedState} Staples</p>
               </div>
            </div>
         </div>
         
         <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl"></div>
         <div className="absolute -top-10 -left-10 w-64 h-64 bg-green-500/5 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
}
