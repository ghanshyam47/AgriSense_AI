import React, { useState } from 'react';
import { 
  Camera, Upload, Bug, AlertCircle, 
  CheckCircle2, Info, ArrowRight, Search,
  Filter, ChevronRight, X, Sparkles,
  ShieldCheck, Beaker, Droplets
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PEST_LIBRARY = [
  {
    id: 1,
    name: "Leaf Rust",
    crop: "Wheat",
    severity: "High",
    symptoms: "Small, orange-brown pustules on leaves, reducing photosynthesis.",
    solution: "Apply Propiconazole or Tebuconazole fungicide at first sign of infection. Ensure proper drainage.",
    pesticide: "Tilt 250 EC",
    pesticideImg: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1000&auto=format&fit=crop",
    image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: 2,
    name: "Blast Disease",
    crop: "Rice",
    severity: "Critical",
    symptoms: "Spindle-shaped spots with gray centers on leaves and nodes.",
    solution: "Use resistant varieties. Apply Tricyclazole 75% WP or Azoxystrobin.",
    pesticide: "Baan Fungicide",
    pesticideImg: "https://images.unsplash.com/photo-1628352081506-83c43123ed6d?q=80&w=1000&auto=format&fit=crop",
    image: "https://images.unsplash.com/photo-1536630596251-b12ba0d9f7d4?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: 3,
    name: "Downy Mildew",
    crop: "Maize",
    severity: "Medium",
    symptoms: "White downy growth on leaf surfaces, chlorotic streaks.",
    solution: "Seed treatment with Metalaxyl. Spraying with Mancozeb if symptoms persist.",
    pesticide: "Ridomil Gold",
    pesticideImg: "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?q=80&w=1000&auto=format&fit=crop",
    image: "https://images.unsplash.com/photo-1551009175-8a68da93d5f9?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: 4,
    name: "Bollworm",
    crop: "Cotton",
    severity: "High",
    symptoms: "Holes in bolls, presence of larvae, shed bolls.",
    solution: "Integrated Pest Management (IPM). Use Bt Cotton varieties. Spray Emamectin Benzoate.",
    pesticide: "Delegate Insecticide",
    pesticideImg: "https://images.unsplash.com/photo-1605173574183-ef9849814763?q=80&w=1000&auto=format&fit=crop",
    image: "https://images.unsplash.com/photo-1594904351111-a072f80b1a71?q=80&w=1000&auto=format&fit=crop"
  }
];

const CROPS = ["All Crops", "Wheat", "Rice", "Maize", "Cotton"];

export default function PestDetection({ location = "Punjab" }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [filterCrop, setFilterCrop] = useState("All Crops");
  const [searchQuery, setSearchQuery] = useState("");

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
        simulateAnalysis();
      };
      reader.readAsDataURL(file);
    }
  };

  const simulateAnalysis = () => {
    setIsAnalyzing(true);
    setAnalysisResult(null);
    setTimeout(() => {
      // Simulate finding a match (random for demo)
      const randomResult = PEST_LIBRARY[Math.floor(Math.random() * PEST_LIBRARY.length)];
      setAnalysisResult(randomResult);
      setIsAnalyzing(false);
    }, 2500);
  };

  const filteredLibrary = PEST_LIBRARY.filter(item => 
    (filterCrop === "All Crops" || item.crop === filterCrop) &&
    (item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
     item.crop.toLowerCase().includes(searchQuery.toLowerCase()))
  );

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
                      onClick={() => setSelectedImage(null)}
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
                  <div className="flex gap-4">
                    <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-[10px] font-black uppercase tracking-widest">Crop: {analysisResult.crop}</span>
                    <span className="px-3 py-1 bg-red-50 text-red-600 rounded-full text-[10px] font-black uppercase tracking-widest">Severity: {analysisResult.severity}</span>
                  </div>
                  <p className="text-sm text-slate-500 font-medium leading-relaxed italic">
                    \"{analysisResult.symptoms}\"
                  </p>
                </div>

                <div className="bg-slate-50 rounded-[2rem] p-8 border border-slate-100 space-y-6">
                   <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-50 text-green-600 rounded-lg flex items-center justify-center">
                      <CheckCircle2 size={18} />
                    </div>
                    <span className="text-[10px] font-black text-green-600 uppercase tracking-widest">Recommended Protocol</span>
                  </div>
                  <p className="text-sm text-slate-600 font-bold leading-relaxed">
                    {analysisResult.solution}
                  </p>
                  <button className="flex items-center gap-2 text-[10px] font-black text-green-600 uppercase tracking-widest group">
                    Full Protocol Report <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>

                <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-lg flex flex-col items-center text-center">
                  <img src={analysisResult.pesticideImg} alt={analysisResult.pesticide} className="w-24 h-24 object-cover rounded-2xl mb-6 shadow-md" />
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Recommended Pesticide</p>
                  <h4 className="text-xl font-black text-slate-900 mb-4">{analysisResult.pesticide}</h4>
                  <button className="w-full bg-slate-900 text-white py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all">
                    Order Formulation
                  </button>
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
            <p className="text-sm text-slate-400 font-medium">Browse verified solutions for common regional pests</p>
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
                  {CROPS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredLibrary.map((item) => (
            <div key={item.id} className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 group">
              <div className="h-48 relative overflow-hidden">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000" />
                <div className="absolute top-4 right-4 px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[9px] font-black text-slate-900 uppercase tracking-widest border border-slate-200">
                  {item.crop}
                </div>
              </div>
              <div className="p-8 space-y-6">
                <div>
                  <h4 className="text-xl font-black text-slate-900 mb-2">{item.name}</h4>
                  <p className="text-xs text-slate-400 font-medium leading-relaxed line-clamp-2">{item.symptoms}</p>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-50 rounded-xl overflow-hidden shadow-sm">
                         <img src={item.pesticideImg} alt="Pesticide" className="w-full h-full object-cover" />
                      </div>
                      <div>
                         <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Recommended</p>
                         <p className="text-[10px] font-black text-slate-900">{item.pesticide}</p>
                      </div>
                   </div>
                   <button className="w-10 h-10 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center hover:bg-green-600 hover:text-white transition-all shadow-sm">
                      <ChevronRight size={18} />
                   </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
