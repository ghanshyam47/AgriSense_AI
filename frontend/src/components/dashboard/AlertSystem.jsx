import React, { useState } from 'react';
import { Zap, AlertTriangle, Bug, CloudRain, TrendingUp, Info, ChevronRight, Search, Filter } from 'lucide-react';
import { SMART_ALERTS } from '../../services/mockData';

export default function AlertSystem({ setActiveNav }) {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  const filteredAlerts = SMART_ALERTS.filter(alert => {
    const matchesFilter = filter === 'All' || alert.severity === filter;
    const matchesSearch = alert.title.toLowerCase().includes(search.toLowerCase()) ||
      alert.message.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/80 backdrop-blur-2xl p-6 rounded-2xl border border-slate-200 shadow-xl">
        <div>
          <h2 className="text-xl font-bold text-slate-900">AI Intelligence Alerts</h2>
          <p className="text-sm text-slate-500">Real-time predictive alerts based on weather, market, and soil sensors.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" />
            <input
              type="text"
              placeholder="Search alerts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-slate-50 border-none rounded-xl pl-10 pr-4 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-green-600 w-48 md:w-64 transition-all shadow-sm"
            />
          </div>
          <div className="flex bg-slate-100 p-1 rounded-xl">
            {['All', 'High', 'Medium'].map(level => (
              <button
                key={level}
                onClick={() => setFilter(level)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-black transition-all ${filter === level ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'
                  }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAlerts.length > 0 ? (
          filteredAlerts.map((alert) => (
            <div key={alert.id} className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-slate-200 shadow-xl hover:shadow-green-100 transition-all group relative overflow-hidden">
              <div className={`absolute top-0 left-0 w-1 h-full ${alert.severity === 'High' ? 'bg-red-500' : 'bg-amber-500'
                }`}></div>

              <div className="flex justify-between items-start mb-6">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${alert.type === 'weather-irrigation' ? 'bg-blue-50 text-blue-600' :
                    alert.type === 'pest-weather' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
                  }`}>
                  {alert.type === 'weather-irrigation' && <CloudRain size={24} />}
                  {alert.type === 'pest-weather' && <Bug size={24} />}
                  {alert.type === 'market-trend' && <TrendingUp size={24} />}
                </div>
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${alert.severity === 'High' ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-amber-100 text-amber-700 border border-amber-200'
                  }`}>
                  {alert.severity} Priority
                </span>
              </div>

              <h3 className="text-lg font-black text-slate-900 mb-3 group-hover:text-green-600 transition-colors">{alert.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed mb-8 flex-grow">
                {alert.message}
              </p>

              <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                  <Zap size={14} className="text-amber-500" />
                  AI Predicted
                </div>
                <button 
                  onClick={() => {
                    if (setActiveNav) {
                      if (alert.type === 'weather-irrigation') setActiveNav('irrigation');
                      else if (alert.type === 'pest-weather') setActiveNav('pest');
                      else if (alert.type === 'market-trend') setActiveNav('market');
                    }
                  }}
                  className="flex items-center gap-1 text-sm font-black text-green-600 hover:text-green-700 transition-colors group/btn"
                >
                  {alert.action} <ChevronRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center bg-white/50 backdrop-blur-sm rounded-3xl border border-dashed border-slate-200">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Info size={24} className="text-slate-300" />
            </div>
            <p className="text-slate-400 font-medium">No alerts found matching your criteria.</p>
          </div>
        )}
      </div>


    </div>
  );
}
