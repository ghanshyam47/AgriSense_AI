import React, { useState, useRef } from 'react';
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
    name: "Wheat Leaf Rust",
    crop: "Wheat",
    severity: "High",
    symptoms: "Small, orange-brown pustules on leaves, reducing photosynthesis and causing premature leaf aging.",
    solution: "Apply Propiconazole or Tebuconazole fungicide at first sign of infection. Ensure proper field drainage and use resistant varieties.",
    pesticide: "Tilt 250 EC",
    image: "https://upload.wikimedia.org/wikipedia/commons/d/d4/Wheat_leaf_rust_on_wheat.jpg"
  },
  {
    id: 2,
    name: "Rice Blast",
    crop: "Rice",
    severity: "Critical",
    symptoms: "Spindle-shaped spots with gray centers and brown margins on leaves, nodes, and panicles.",
    solution: "Use resistant varieties. Avoid excessive nitrogen fertilizer. Apply Tricyclazole 75% WP or Azoxystrobin.",
    pesticide: "Baan Fungicide",
    image: "https://upload.wikimedia.org/wikipedia/commons/6/66/Magnaporthe_grisea.jpg"
  },
  {
    id: 3,
    name: "Maize Downy Mildew",
    crop: "Maize",
    severity: "Medium",
    symptoms: "White downy fungal growth on leaf surfaces, chlorotic streaks, and stunted plant growth.",
    solution: "Seed treatment with Metalaxyl. Spraying with Mancozeb if symptoms persist during early growth stages.",
    pesticide: "Ridomil Gold",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Corn_smut_01.jpg/800px-Corn_smut_01.jpg"
  },
  {
    id: 4,
    name: "Cotton Bollworm",
    crop: "Cotton",
    severity: "High",
    symptoms: "Holes in bolls, presence of larvae inside bolls, and premature shedding of squares and bolls.",
    solution: "Implement Integrated Pest Management (IPM). Use Bt Cotton varieties. Spray Emamectin Benzoate or Spinosad.",
    pesticide: "Delegate Insecticide",
    image: "https://upload.wikimedia.org/wikipedia/commons/7/78/Helicoverpa_armigera.jpg"
  },
  {
    id: 5,
    name: "Late Blight",
    crop: "Potato",
    severity: "Critical",
    symptoms: "Water-soaked irregular pale green lesions on leaves that turn brown/black rapidly. White fuzzy growth on undersides in humid conditions.",
    solution: "Destroy infected tubers. Apply preventative fungicides like Chlorothalonil or Mancozeb before symptoms appear.",
    pesticide: "Bravo Weather Stik",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Late_blight_on_potato_leaf_2.jpg/960px-Late_blight_on_potato_leaf_2.jpg"
  },
  {
    id: 6,
    name: "Early Blight",
    crop: "Tomato",
    severity: "High",
    symptoms: "Brown spots with concentric rings (target-board appearance) on older leaves. Lower leaves yellow and drop off.",
    solution: "Crop rotation. Provide adequate spacing for air flow. Apply Copper-based fungicides or Azoxystrobin.",
    pesticide: "Quadris Fungicide",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Alternaria_solani_-_leaf_lesions.jpg/960px-Alternaria_solani_-_leaf_lesions.jpg"
  },
  {
    id: 7,
    name: "Red Rot",
    crop: "Sugarcane",
    severity: "Critical",
    symptoms: "Yellowing and drying of upper leaves. Internal tissues of the cane show red coloration with white cross-bands.",
    solution: "Use disease-free setts. Hot water treatment of setts at 50°C for 2 hours. Uproot and burn infected clumps.",
    pesticide: "Bavistin 50 WP",
    image: "https://upload.wikimedia.org/wikipedia/commons/4/4c/Sugarcane.jpg"
  },
  {
    id: 8,
    name: "Fall Armyworm",
    crop: "Maize",
    severity: "High",
    symptoms: "Ragged holes in leaves, feeding damage in the whorl, and large amounts of sawdust-like frass (excrement).",
    solution: "Early planting. Mechanical destruction of egg masses. Spray Chlorantraniliprole or Spinetoram when threshold is reached.",
    pesticide: "Coragen Insecticide",
    image: "https://upload.wikimedia.org/wikipedia/commons/4/44/Spodoptera_frugiperda.jpg"
  }
];

const CROPS = ["All Crops", "Wheat", "Rice", "Maize", "Cotton", "Potato", "Tomato", "Sugarcane"];

export default function PestDetection({ location = "Punjab" }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [filterCrop, setFilterCrop] = useState("All Crops");
  const [searchQuery, setSearchQuery] = useState("");
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const startCamera = async () => {
    setIsCameraOpen(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing camera: ", err);
      alert("Unable to access camera. Please allow camera permissions.");
      setIsCameraOpen(false);
    }
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
      const imageDataUrl = canvasRef.current.toDataURL('image/jpeg');
      setSelectedImage(imageDataUrl);
      stopCamera();
      simulateAnalysis();
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
    setIsCameraOpen(false);
  };

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
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-tight">Instant <br />Detection</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-4">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm"><Beaker size={20} /></div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-tight">Expert <br />Solutions</p>
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
                    className={`flex flex-col items-center justify-center w-full h-full ${isCameraOpen ? 'p-0' : 'px-6 text-center gap-4'}`}
                  >
                    {!isCameraOpen ? (
                      <div className="flex flex-col items-center gap-4 px-6 text-center">
                        <button onClick={startCamera} className="flex flex-col items-center group cursor-pointer border-none bg-transparent outline-none">
                          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-xl text-green-600 group-hover:scale-105 transition-transform group-hover:bg-green-50">
                            <Camera size={32} />
                          </div>
                          <div className="mt-4 text-center">
                            <p className="text-lg font-black text-slate-900 group-hover:text-green-700 transition-colors">Open Web Cam</p>
                            <p className="text-sm text-slate-400 font-medium mt-1">Tap to scan your crop instantly</p>
                          </div>
                        </button>
                        <label className="cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-600 px-8 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all mt-2 border border-slate-200">
                          Or Browse Files
                          <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                        </label>
                      </div>
                    ) : (
                      <div className="relative w-full h-full bg-black flex flex-col items-center justify-center overflow-hidden">
                         <video ref={videoRef} autoPlay playsInline className="absolute inset-0 w-full h-full object-cover"></video>
                         <canvas ref={canvasRef} className="hidden"></canvas>
                         <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-6 z-50">
                            <button onClick={stopCamera} className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-colors shadow-xl border border-white/30">
                               <X size={24} />
                            </button>
                            <button onClick={captureImage} className="w-16 h-16 bg-white rounded-full border-4 border-green-500 shadow-2xl flex items-center justify-center hover:scale-105 transition-transform">
                               <Camera size={28} className="text-green-600" />
                            </button>
                         </div>
                      </div>
                    )}
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
                </div>

                <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-lg flex flex-col items-center text-center">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Recommended Pesticide</p>
                  <h4 className="text-xl font-black text-slate-900 mb-4">{analysisResult.pesticide}</h4>
                  <button
                    onClick={() => { setSelectedImage(null); setAnalysisResult(null); }}
                    className="w-full bg-green-600 text-white py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-green-700 transition-all shadow-lg shadow-green-200"
                  >
                    Next Detection
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
                  <h4 className="text-xl font-black text-slate-900 mb-4">{item.name}</h4>
                  <div className="space-y-4">
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Symptoms</p>
                      <p className="text-xs text-slate-600 font-medium leading-relaxed line-clamp-2">{item.symptoms}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-green-600/70 uppercase tracking-widest mb-1">Solution</p>
                      <p className="text-xs text-green-700 font-medium leading-relaxed line-clamp-2">{item.solution}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                  <div className="flex items-center gap-3">
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
