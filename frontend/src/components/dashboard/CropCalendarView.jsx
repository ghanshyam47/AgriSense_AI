import React, { useState, useMemo } from 'react';
import { 
  Calendar as CalendarIcon, Milestone, CheckCircle2, Clock, MapPin, 
  Sprout, ShoppingBasket, Truck, Bookmark, ChevronDown, Plus, 
  X, AlertCircle, FileText, Droplets, Zap, ChevronLeft, ChevronRight
} from 'lucide-react';
import { CROP_CALENDARS, CROPS_LIST, HARVEST_TARGETS, MANUAL_EVENTS_BY_CROP } from '../../services/mockData';

export default function CropCalendarView({ bookmarks, toggleBookmark }) {
  const [selectedCrop, setSelectedCrop] = useState(CROPS_LIST[0]);
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 3)); // April 2026
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState('2026-04-26');
  const [allNotes, setAllNotes] = useState(MANUAL_EVENTS_BY_CROP);

  const stages = CROP_CALENDARS[selectedCrop.id] || CROP_CALENDARS['Wheat'];
  const harvestTarget = HARVEST_TARGETS[selectedCrop.id] || { targetDate: '2026-12-31', confidence: 0 };
  const cropNotes = allNotes[selectedCrop.id] || [];

  const daysToHarvest = useMemo(() => {
    const today = new Date(2026, 3, 26); 
    const target = new Date(harvestTarget.targetDate);
    const diffTime = target - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  }, [selectedCrop, harvestTarget]);

  // Calendar Logic
  const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const days = [];
    const totalDays = daysInMonth(year, month);
    const startOffset = firstDayOfMonth(year, month);

    for (let i = 0; i < startOffset; i++) days.push(null);
    for (let i = 1; i <= totalDays; i++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      const dayEvents = cropNotes.filter(n => n.date === dateStr);
      days.push({ day: i, date: dateStr, events: dayEvents });
    }
    return days;
  }, [currentMonth, cropNotes]);

  const selectedDayData = useMemo(() => {
    return cropNotes.filter(n => n.date === selectedDate);
  }, [cropNotes, selectedDate]);

  const handleAddNote = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newNote = {
      id: Date.now(),
      date: selectedDate,
      type: formData.get('type'),
      note: formData.get('note'),
      completed: false
    };
    
    setAllNotes(prev => ({
      ...prev,
      [selectedCrop.id]: [...(prev[selectedCrop.id] || []), newNote]
    }));
    setShowNoteModal(false);
  };

  return (
    <div className="space-y-4 animate-fadeIn relative pb-10">
      {/* ─── COMPACT HEADER ─── */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className="md:col-span-8 bg-slate-900 rounded-3xl p-5 text-white flex items-center justify-between shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 w-32 h-32 bg-green-500 rounded-full blur-[60px] opacity-20 -mr-10 -mt-10"></div>
          <div className="flex items-center gap-6">
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10">
               <Zap size={24} className="text-green-400" />
            </div>
            <div>
               <p className="text-[10px] font-black text-green-400 uppercase tracking-widest leading-none mb-1">Harvest Window</p>
               <h3 className="text-2xl font-black">{daysToHarvest} <span className="text-sm text-white/40 font-bold tracking-normal uppercase">Days Left</span></h3>
            </div>
          </div>
          <div className="text-right">
             <p className="text-xl font-black text-white">{harvestTarget.confidence}%</p>
             <p className="text-[9px] font-black text-white/30 uppercase tracking-widest">Confidence</p>
          </div>
        </div>

        <div className="md:col-span-4 bg-white/80 backdrop-blur-xl p-4 rounded-3xl border border-slate-200 shadow-xl flex items-center justify-between relative z-[50]">
           <div className="relative group flex-1">
              <button className="w-full flex items-center justify-between bg-slate-50 px-4 py-2 rounded-xl border border-slate-200 hover:border-green-600 transition-all">
                <div className="flex items-center gap-2">
                   <span className="text-base">{selectedCrop.icon}</span>
                   <span className="text-xs font-black text-slate-900">{selectedCrop.name}</span>
                </div>
                <ChevronDown size={14} className="text-slate-400" />
              </button>
              <div className="absolute right-0 top-full mt-1 w-full bg-white backdrop-blur-2xl rounded-xl shadow-2xl border border-slate-200 overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-[100]">
                 {CROPS_LIST.map(crop => (
                   <button
                     key={crop.id}
                     onClick={() => setSelectedCrop(crop)}
                     className={`w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-slate-50 transition-all ${selectedCrop.id === crop.id ? 'bg-green-50' : ''}`}
                   >
                     <span className="text-base">{crop.icon}</span>
                     <span className="text-xs font-bold text-slate-900">{crop.name}</span>
                   </button>
                 ))}
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* ─── LEFT: MINI CALENDAR ─── */}
        <div className="lg:col-span-4 bg-white/80 backdrop-blur-xl rounded-3xl p-5 border border-slate-200 shadow-xl">
           <div className="flex items-center justify-between mb-4 px-1">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">{currentMonth.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</h3>
              <div className="flex gap-1">
                 <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))} className="p-1 hover:bg-slate-100 rounded-md text-slate-400"><ChevronLeft size={14} /></button>
                 <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))} className="p-1 hover:bg-slate-100 rounded-md text-slate-400"><ChevronRight size={14} /></button>
              </div>
           </div>
 
           <div className="grid grid-cols-7 gap-1">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
                <div key={d} className="py-1 text-center text-[8px] font-black text-slate-400">{d}</div>
              ))}
              {calendarDays.map((dayObj, i) => (
                <button 
                  key={i} 
                  onClick={() => { if(dayObj) setSelectedDate(dayObj.date); }}
                  className={`relative aspect-square rounded-lg flex items-center justify-center transition-all ${
                    !dayObj ? 'invisible' :
                    dayObj.date === selectedDate ? 'bg-green-600 text-white shadow-lg shadow-green-200 scale-110 z-10' :
                    dayObj.date === '2026-04-26' ? 'bg-green-100 text-green-600 font-black' :
                    'hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  {dayObj && (
                    <>
                       <span className="text-[10px] font-black">{dayObj.day}</span>
                      {dayObj.events.length > 0 && dayObj.date !== selectedDate && (
                        <div className={`absolute bottom-1 w-1 h-1 rounded-full ${dayObj.events.some(e => e.type === 'Irrigation') ? 'bg-blue-500' : 'bg-slate-200'}`}></div>
                      )}
                    </>
                  )}
                </button>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-slate-100 space-y-3">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Growth Milestone</p>
              {stages.slice(0, 3).map((s, idx) => (
                <div key={idx} className="flex items-center gap-3 opacity-80">
                   <div className="w-6 h-6 rounded-md bg-green-50 text-green-600 flex items-center justify-center">
                      <Sprout size={12} />
                   </div>
                   <div className="flex-1">
                      <p className="text-[10px] font-black text-slate-900 leading-none">{s.stage}</p>
                      <p className="text-[8px] text-slate-400 mt-0.5">{s.date}</p>
                   </div>
                </div>
              ))}
           </div>
        </div>
 
        {/* ─── RIGHT: DAILY ACTIVITY & LOGS ─── */}
        <div className="lg:col-span-8 bg-white/80 backdrop-blur-xl rounded-3xl p-6 border border-slate-200 shadow-xl flex flex-col">
           <div className="flex items-center justify-between mb-6">
              <div>
                 <h3 className="text-sm font-black text-slate-900">{new Date(selectedDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</h3>
                 <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Daily Activity Log</p>
              </div>
              <button 
                onClick={() => setShowNoteModal(true)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl text-[10px] font-black transition-all shadow-lg shadow-green-200 flex items-center gap-2"
              >
                <Plus size={14} /> ADD NOTE
              </button>
           </div>
           
           <div className="flex-1 space-y-3 overflow-y-auto max-h-[400px] pr-2">
              {selectedDayData.length > 0 ? (
                selectedDayData.map(note => (
                  <div key={note.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between hover:bg-white hover:border-green-600/30 hover:shadow-md transition-all group">
                     <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${note.completed ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'}`}>
                           {note.type === 'Irrigation' ? <Droplets size={18} /> : <FileText size={18} />}
                        </div>
                        <div>
                           <p className="text-sm font-black text-slate-900">{note.note}</p>
                           <p className="text-[10px] text-slate-400 font-black uppercase tracking-tighter">{note.type} Activity · Verified</p>
                        </div>
                     </div>
                     <button onClick={() => setAllNotes(prev => ({
                        ...prev,
                        [selectedCrop.id]: prev[selectedCrop.id].map(n => n.id === note.id ? {...n, completed: !n.completed} : n)
                      }))}>
                        {note.completed ? <CheckCircle2 size={20} className="text-green-600 shadow-sm" /> : <Clock size={20} className="text-slate-300" />}
                     </button>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center opacity-30">
                   <AlertCircle size={40} className="text-slate-300 mb-3" />
                   <p className="text-sm font-black text-slate-400 uppercase tracking-widest">No entries for this date</p>
                </div>
              )}

              {/* Show Previous History if current date selected */}
              {selectedDate === '2026-04-26' && (
                <div className="mt-8 pt-8 border-t border-slate-100">
                   <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Historical Continuity</h4>
                   <div className="space-y-3 opacity-60">
                      {cropNotes.slice(-3).map(note => (
                        <div key={note.id} className="p-3 bg-slate-50 rounded-xl border border-dashed border-slate-200 flex items-center gap-3">
                           <Clock size={14} className="text-slate-400" />
                           <p className="text-xs font-black text-slate-600">{note.note} on {new Date(note.date).toLocaleDateString()}</p>
                        </div>
                      ))}
                   </div>
                </div>
              )}
           </div>
        </div>
      </div>

      {/* ─── NOTE MODAL ─── */}
      {showNoteModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setShowNoteModal(false)}></div>
          <div className="bg-white rounded-[2rem] w-full max-w-sm p-6 relative z-10 shadow-2xl animate-scaleIn border border-slate-200">
             <button onClick={() => setShowNoteModal(false)} className="absolute top-5 right-5 p-2 hover:bg-slate-100 rounded-full transition-all text-slate-400"><X size={18} /></button>
             <h3 className="text-xl font-black text-slate-900 mb-1">Log Activity</h3>
             <p className="text-xs text-slate-400 mb-6 font-black uppercase">{new Date(selectedDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</p>
             <form onSubmit={handleAddNote} className="space-y-5">
                 <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Activity Node</label>
                    <select name="type" className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-xs font-black text-slate-900 focus:bg-white focus:border-green-600 outline-none transition-all appearance-none cursor-pointer">
                        <option value="Sowing">Sowing</option>
                        <option value="Irrigation">Irrigation</option>
                        <option value="Fertilizing">Fertilizing</option>
                        <option value="Pest Control">Pest Control</option>
                        <option value="Harvesting">Harvesting</option>
                    </select>
                 </div>
                 <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Action Protocol</label>
                    <textarea name="note" rows="3" placeholder="Describe the neural work done..." required className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-xs font-black text-slate-900 placeholder:text-slate-300 focus:bg-white focus:border-green-600 outline-none transition-all"></textarea>
                 </div>
                 <button type="submit" className="w-full py-4 rounded-xl bg-green-600 text-white font-black text-xs hover:bg-green-700 transition-all shadow-xl shadow-green-200">
                    Save Entry
                 </button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
}
