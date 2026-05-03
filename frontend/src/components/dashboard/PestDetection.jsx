import React, { useState, useEffect } from 'react';
import { 
  Camera, Upload, Bug, AlertCircle, 
  CheckCircle2, Info, ArrowRight, Search,
  Filter, ChevronRight, X, Sparkles,
  ShieldCheck, Beaker, Droplets, Loader2, AlertTriangle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { detectPest, getCommonPests } from '../../services/apiClient';
import { CROPS_LIST } from '../../services/constants';

export default function PestDetection({ location = "Punjab" }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [analysisError, setAnalysisError] = useState(null);
  const [filterCrop, setFilterCrop] = useState("All Crops");
  const [searchQuery, setSearchQuery] = useState("");

  // Live pest library from backend
  const [pestLibrary, setPestLibrary] = useState([]);
  const [libraryLoading, setLibraryLoading] = useState(true);
  const [cropFilters, setCropFilters] = useState(["All Crops"]);

  // Fetch pest library from backend on mount and when filter changes
  useEffect(() => {
    let mounted = true;
    const fetchLibrary = async () => {
      setLibraryLoading(true);
      try {
        // Fetch common pests for multiple crops
        const cropsToFetch = filterCrop === "All Crops" 
          ? ['tomato', 'potato', 'corn', 'apple', 'grape', 'pepper']
          : [filterCrop.toLowerCase()];

        const allPests = [];
        const cropSet = new Set(["All Crops"]);

        for (const crop of cropsToFetch) {
          try {
            const res = await getCommonPests(crop);
            if (res?.data && typeof res.data === 'object' && !res.data.message) {
              Object.entries(res.data).forEach(([key, val]) => {
                const cropName = key.split('___')[0] || crop;
                cropSet.add(cropName.charAt(0).toUpperCase() + cropName.slice(1));
                allPests.push({
                  id: key,
                  name: val.disease || key.split('___').pop()?.replace(/_/g, ' ') || key,
                  crop: cropName.charAt(0).toUpperCase() + cropName.slice(1),
                  severity: val.severity || 'medium',
                  symptoms: val.treatment || 'Consult agricultural expert.',
                  solution: val.prevention || val.treatment || 'Follow integrated pest management.',
                  treatment: val.treatment || 'Consult agricultural expert.',
                });
              });
            }
          } catch { /* skip individual crop errors */ }
        }

        if (mounted) {
          setPestLibrary(allPests);
          setCropFilters([...cropSet]);
        }
      } catch (err) {
        console.error("Failed to fetch pest library", err);
      } finally {
        if (mounted) setLibraryLoading(false);
      }
    };
    fetchLibrary();
    return () => { mounted = false; };
  }, [filterCrop]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
        setAnalysisError(null);
        startAnalysis(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const startAnalysis = async (file) => {
    setIsAnalyzing(true);
    setAnalysisResult(null);
    setAnalysisError(null);
    try {
      const result = await detectPest(file);
      // The backend returns { data: { prediction: {...}, reasoning: "..." } }
      const detection = result?.data?.prediction || result?.data?.detection || result?.data;
      if (detection) {
        setAnalysisResult({
          name: detection.disease || detection.name || 'Unknown',
          crop: detection.class?.split('___')[0] || 'Unknown',
          severity: detection.severity || 'unknown',
          confidence: detection.confidence || 0,
          symptoms: detection.treatment || 'Consult an agricultural expert.',
          solution: detection.prevention || detection.treatment || 'Follow integrated pest management.',
          treatment: detection.treatment || 'Consult expert.',
          reasoning: result?.data?.reasoning || '',
          topPredictions: detection.top_predictions || [],
        });
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("Pest detection failed", error);
      setAnalysisError("Detection failed. Please ensure the ML service is running and try again with a clear image of the affected crop.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const filteredLibrary = pestLibrary.filter(item => 
    (filterCrop === "All Crops" || item.crop.toLowerCase() === filterCrop.toLowerCase()) &&
    (item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
     item.crop.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'critical': return { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200' };
      case 'high': return { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-200' };
      case 'medium': return { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-200' };
      case 'low': return { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200' };
      default: return { bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-200' };
    }
  };

  return (
    <div className="space-y-10 pb-20 animate-fadeIn">
      {/* ─── SCANNER SECTION ─── */}
      <section className="bg-white/80 backdrop-blur-2xl rounded-[3rem] p-8 md:p-12 border border-slate-200 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
        
        <div className="flex flex-col lg:flex-row gap-12 relative z-10">
          <div className="lg:w-1/2 space-y-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 rounded-full border border-green-100 mb-6">
                <Sparkles size={14} />
                <span className="text-[9px] font-black uppercase tracking-[0.2em]">Neural Vision v4.0</span>
              </div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tighter leading-tight mb-4">
                Pest & Disease <br />
                <span className="text-green-600">AI Scanner</span>
              </h2>
              <p className="text-slate-500 font-medium leading-relaxed">
                Upload a photo of your crop or use your camera for real-time analysis. Our neural network detects over 250+ diseases with 94% accuracy.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-4">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-green-600 shadow-sm"><ShieldCheck size={20} /></div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-tight">Instant <br/>Detection</p>
               </div>
               <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-4">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm"><Beaker size={20} /></div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-tight">Expert <br/>Solutions</p>
               </div>
            </div>
          </div>

          <div className="lg:w-1/2">
            <div className={`relative h-80 rounded-[2.5rem] border-2 border-dashed transition-all duration-500 flex flex-col items-center justify-center overflow-hidden ${selectedImage ? 'border-green-600' : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50'}`}>
              <AnimatePresence mode="wait">
                {!selectedImage ? (
                  <motion.div 
                    key="upload"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center gap-4 px-6 text-center"
                  >
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-xl text-green-600">
                      <Camera size={32} />
                    </div>
                    <div>
                      <p className="text-lg font-black text-slate-900">Scan Crop</p>
                      <p className="text-sm text-slate-400 font-medium mt-1">Tap to camera or drag image here</p>
                    </div>
                    <label className="cursor-pointer bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all mt-2 shadow-lg shadow-green-200">
                      Browse Files
                      <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                    </label>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="image"
                    initial={{ scale: 1.1, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-full h-full relative"
                  >
                    <img src={selectedImage} alt="Scanned" className="w-full h-full object-cover" />
                    {isAnalyzing && (
                      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex flex-col items-center justify-center text-white">
                        <div className="relative w-24 h-24 mb-6">
                           <div className="absolute inset-0 border-4 border-green-500/30 rounded-full"></div>
                           <div className="absolute inset-0 border-4 border-green-500 rounded-full border-t-transparent animate-spin"></div>
                           <div className="absolute inset-0 flex items-center justify-center">
                              <Sparkles size={32} className="text-green-400" />
                           </div>
                        </div>
                        <p className="text-xs font-black uppercase tracking-[0.3em] animate-pulse">Neural Mapping...</p>
                      </div>
                    )}
                    <button 
                      onClick={() => { setSelectedImage(null); setAnalysisResult(null); setAnalysisError(null); }}
                      className="absolute top-6 right-6 w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-slate-900 shadow-xl hover:bg-white transition-all"
                    >
                      <X size={20} />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* ─── ERROR STATE ─── */}
        <AnimatePresence>
          {analysisError && !isAnalyzing && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-12 pt-8 border-t border-slate-100 overflow-hidden"
            >
              <div className="bg-red-50 rounded-2xl p-6 border border-red-100 flex items-start gap-4">
                <AlertTriangle size={24} className="text-red-500 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="text-sm font-black text-red-700 mb-1">Analysis Failed</h4>
                  <p className="text-sm text-red-600/80">{analysisError}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ─── ANALYSIS RESULT ─── */}
        <AnimatePresence>
          {analysisResult && !isAnalyzing && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-12 pt-12 border-t border-slate-100 overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-red-50 text-red-600 rounded-lg flex items-center justify-center">
                      <AlertCircle size={18} />
                    </div>
                    <span className="text-[10px] font-black text-red-600 uppercase tracking-widest">Threat Identified</span>
                  </div>
                  <h3 className="text-3xl font-black text-slate-900 tracking-tight">{analysisResult.name}</h3>
                  <div className="flex gap-4 flex-wrap">
                    <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-[10px] font-black uppercase tracking-widest">Crop: {analysisResult.crop}</span>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${getSeverityColor(analysisResult.severity).bg} ${getSeverityColor(analysisResult.severity).text}`}>
                      Severity: {analysisResult.severity}
                    </span>
                    {analysisResult.confidence > 0 && (
                      <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                        Confidence: {analysisResult.confidence}%
                      </span>
                    )}
                  </div>
                </div>

                <div className="bg-slate-50 rounded-[2rem] p-8 border border-slate-100 space-y-6">
                   <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-50 text-green-600 rounded-lg flex items-center justify-center">
                      <CheckCircle2 size={18} />
                    </div>
                    <span className="text-[10px] font-black text-green-600 uppercase tracking-widest">Treatment Protocol</span>
                  </div>
                  <p className="text-sm text-slate-600 font-bold leading-relaxed">
                    {analysisResult.treatment}
                  </p>
                  {analysisResult.solution && analysisResult.solution !== analysisResult.treatment && (
                    <div className="pt-4 border-t border-slate-200">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Prevention</p>
                      <p className="text-sm text-slate-500 leading-relaxed">{analysisResult.solution}</p>
                    </div>
                  )}
                </div>

                <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-lg space-y-6">
                  {analysisResult.reasoning && (
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Sparkles size={14} className="text-green-600" />
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">AI Reasoning</p>
                      </div>
                      <p className="text-sm text-slate-600 leading-relaxed italic">"{analysisResult.reasoning}"</p>
                    </div>
                  )}
                  {analysisResult.topPredictions && analysisResult.topPredictions.length > 0 && (
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">Top Predictions</p>
                      <div className="space-y-2">
                        {analysisResult.topPredictions.map((p, i) => (
                          <div key={i} className="flex items-center justify-between bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-100">
                            <span className="text-xs font-bold text-slate-700">{p.class?.replace(/_/g, ' ') || p.name}</span>
                            <span className="text-xs font-black text-green-600">{p.confidence}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* ─── DISEASE & PESTICIDE LIBRARY ─── */}
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 px-4">
          <div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tighter">Agricultural Library</h3>
            <p className="text-sm text-slate-400 font-medium">Browse verified solutions from the ML knowledge base</p>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
             <div className="relative flex-1 md:w-64">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                <input 
                  type="text" 
                  placeholder="Search diseases..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-2xl pl-12 pr-4 py-3 text-sm font-black text-slate-900 focus:border-green-600 outline-none transition-all shadow-sm"
                />
             </div>
             
             <div className="relative">
                <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                <select 
                  value={filterCrop}
                  onChange={(e) => setFilterCrop(e.target.value)}
                  className="bg-white border border-slate-200 rounded-2xl pl-12 pr-10 py-3 text-sm font-black text-slate-900 focus:border-green-600 outline-none transition-all shadow-sm appearance-none cursor-pointer"
                >
                  {cropFilters.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
             </div>
          </div>
        </div>

        {libraryLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={32} className="animate-spin text-green-600" />
          </div>
        ) : filteredLibrary.length === 0 ? (
          <div className="bg-white/50 backdrop-blur-sm rounded-3xl border border-dashed border-slate-200 p-16 text-center">
            <Bug size={40} className="mx-auto text-slate-200 mb-4" />
            <p className="text-slate-400 font-medium">No pest data found. Try a different crop filter.</p>
          </div>
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredLibrary.map((item) => {
            const sc = getSeverityColor(item.severity);
            return (
            <div key={item.id} className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 group">
              <div className="p-8 space-y-5">
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 bg-red-50 text-red-600 rounded-xl flex items-center justify-center shadow-sm">
                    <Bug size={24} />
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${sc.bg} ${sc.text} border ${sc.border}`}>
                    {item.severity}
                  </span>
                </div>
                <div>
                  <h4 className="text-lg font-black text-slate-900 mb-1 group-hover:text-green-600 transition-colors">{item.name}</h4>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.crop}</p>
                </div>
                <p className="text-xs text-slate-500 font-medium leading-relaxed line-clamp-3">{item.treatment}</p>
                
                <div className="pt-5 border-t border-slate-100">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 size={14} className="text-green-600" />
                    <span className="text-[9px] font-black text-green-600 uppercase tracking-widest">Solution</span>
                  </div>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed line-clamp-2">{item.solution}</p>
                </div>
              </div>
            </div>
          );
          })}
        </div>
        )}
      </div>
    </div>
  );
}
