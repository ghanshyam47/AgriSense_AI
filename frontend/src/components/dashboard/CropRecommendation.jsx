import React, { useState, useEffect } from 'react';
import {
  Sparkles, MessageSquare, ArrowRight, RefreshCw,
  Sprout, Droplets, Map, Landmark, Zap, ChevronRight, ChevronLeft, CheckCircle2,
  Globe, RotateCcw, TrendingUp, DollarSign
} from 'lucide-react';

const QUESTIONS = [
  {
    id: 'region',
    question: "Where is your farm located?",
    options: [
      { label: 'North India', icon: '🏔️', description: 'Cold winters, hot summers.' },
      { label: 'South India', icon: '🌴', description: 'Warm and humid all year.' },
      { label: 'West India', icon: '🏜️', description: 'Dry and very hot.' },
      { label: 'East India', icon: '🎋', description: 'Lots of rain and floods.' },
      { label: 'Central India', icon: '🌋', description: 'Moderate rain, central plains.' }
    ]
  },
  {
    id: 'soil',
    question: "How does the soil in your field look and feel?",
    options: [
      { label: 'Soft & Crumbly', icon: '🌱', description: 'Good dark soil, easy to dig.' },
      { label: 'Black & Sticky', icon: '🌑', description: 'Cracks when dry, holds water.' },
      { label: 'Sandy / Red', icon: '🏖️', description: 'Water drains very fast.' },
      { label: 'Heavy Clay', icon: '🏺', description: 'Sticks to hands when wet.' }
    ]
  },
  {
    id: 'prev_crop',
    question: "What did you grow in this field last season?",
    options: [
      { label: 'Wheat or Rice', icon: '🌾', description: 'Regular food grains.' },
      { label: 'Dal / Pulses', icon: '🥜', description: 'Chana, Moong, Toor etc.' },
      { label: 'Vegetables', icon: '🥦', description: 'Tomato, Onion, Potato etc.' },
      { label: 'Nothing (Empty)', icon: '🏜️', description: 'Field was left empty.' }
    ]
  },
  {
    id: 'prev_yield',
    question: "How was your harvest last time?",
    options: [
      { label: 'Very Good', icon: '📈', description: 'Got a lot of crop.' },
      { label: 'Normal / Okay', icon: '📊', description: 'Just regular amount.' },
      { label: 'Poor / Failed', icon: '📉', description: 'Crop got ruined or very less.' }
    ]
  },
  {
    id: 'water',
    question: "How do you water your crops?",
    options: [
      { label: 'Borewell / Motor', icon: '🚰', description: 'Can pump water anytime.' },
      { label: 'Canal Water', icon: '🌊', description: 'Comes when government releases.' },
      { label: 'Only Rain', icon: '🌧️', description: 'Depend on monsoon clouds.' },
      { label: 'Drip Pipes', icon: '💧', description: 'Small pipes giving water to roots.' }
    ]
  },
  {
    id: 'budget',
    question: "How much money can you spend on seeds and fertilizer?",
    options: [
      { label: 'I can spend well', icon: '💎', description: 'Want to grow costly crops.' },
      { label: 'Medium', icon: '💳', description: 'Normal expenses only.' },
      { label: 'Very Little', icon: '🪙', description: 'Need very low-cost crops.' }
    ]
  }
];

export default function CropRecommendation() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [recommendation, setRecommendation] = useState(null);

  const handleSelect = (option) => {
    const newAnswers = { ...answers, [QUESTIONS[step].id]: option };
    setAnswers(newAnswers);

    if (step < QUESTIONS.length - 1) {
      setStep(step + 1);
    } else {
      startAnalysis(newAnswers);
    }
  };

  const startAnalysis = (finalAnswers) => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      generateRecommendation(finalAnswers);
    }, 4000);
  };

  const generateRecommendation = (ans) => {
    if (ans.budget === 'I can spend well' && ans.region === 'North India' && ans.soil === 'Soft & Crumbly') {
      setRecommendation({
        crop: 'Saffron (Kesar)',
        confidence: 94,
        reason: "Since you can invest well and have soft soil in the North, Saffron is your highest value choice. It grows well in the cold and gives a huge return.",
        tasks: ['Buy high quality corms (seeds)', 'Set up shade nets for protection', 'Arrange cold storage for harvest'],
        profitPotential: 'Very High',
        marketPrice: '₹2.5L / kg'
      });
    } else if (ans.prev_crop === 'Dal / Pulses' && ans.prev_yield === 'Very Good') {
      setRecommendation({
        crop: 'Basmati Rice',
        confidence: 97,
        reason: "Growing dal last time made your soil rich. Planting good Basmati rice now will give you excellent quality grain that sells at a high price.",
        tasks: ['Buy Pusa Basmati 1121 seeds', 'Keep the field flooded properly', 'Watch out for leaf spots'],
        profitPotential: 'High',
        marketPrice: '₹4,500 / quintal'
      });
    } else if (ans.region === 'South India' && ans.water === 'Drip Pipes') {
      setRecommendation({
        crop: 'Vanilla Orchids',
        confidence: 91,
        reason: "Vanilla sells for a lot of money and loves the warm South weather. Your drip pipes are perfect for giving it just the right amount of water.",
        tasks: ['Build support frames for vines', 'Get healthy cuttings to plant', 'Learn hand-pollination'],
        profitPotential: 'High (Long-term)',
        marketPrice: '₹15,000 / kg'
      });
    } else {
      setRecommendation({
        crop: 'Turmeric (Haldi)',
        confidence: 88,
        reason: "Turmeric is a very safe and profitable crop. It uses the soil well, doesn't spoil quickly, and always has good market demand.",
        tasks: ['Plant with some shade', 'Use organic compost', 'Keep soil moist but not flooded'],
        profitPotential: 'Steady Income',
        marketPrice: '₹450 / kg'
      });
    }
  };

  const reset = () => {
    setStep(0);
    setAnswers({});
    setRecommendation(null);
  };

  return (
    <div className="max-w-5xl mx-auto animate-fadeIn pb-20 px-4">
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 md:p-10 border border-slate-200 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-green-500 rounded-full blur-[150px] opacity-[0.05] -mr-40 -mt-40"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500 rounded-full blur-[150px] opacity-[0.05] -ml-40 -mb-40"></div>

        <div className="relative z-10">
          {!isAnalyzing && !recommendation && (
            <div className="space-y-12">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                  {step > 0 && (
                    <button
                      onClick={() => setStep(step - 1)}
                      className="group/back flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-400 hover:bg-green-50 hover:text-green-600 rounded-2xl transition-all border border-slate-200 shadow-sm"
                      title="Previous Question"
                    >
                      <ChevronLeft size={18} className="group-hover/back:-translate-x-1 transition-transform" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Back</span>
                    </button>
                  )}
                  <div className="w-14 h-14 bg-gradient-to-br from-green-600 to-green-800 text-white rounded-xl flex items-center justify-center shadow-lg shadow-green-200 flex-shrink-0">
                    <Sparkles size={28} />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">AI Strategy Advisor</h2>
                    <p className="text-slate-500 font-medium">Deep analysis of your farm's history and potential.</p>
                  </div>
                </div>
                <div className="bg-slate-50 px-5 py-2 rounded-2xl border border-slate-200 shadow-sm">
                  <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Progress: {Math.round((step / QUESTIONS.length) * 100)}%</span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="flex gap-1.5">
                {QUESTIONS.map((_, i) => (
                  <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-700 ease-out ${i <= step ? 'bg-green-600 shadow-sm' : 'bg-slate-100'}`}></div>
                ))}
              </div>

              <div className="space-y-10">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-600 shadow-sm"></span>
                    <span className="text-[10px] font-black text-green-600 uppercase tracking-[0.3em]">Step {step + 1} of {QUESTIONS.length}</span>
                  </div>
                  <h3 className="text-4xl font-black text-slate-900 leading-[1.1]">{QUESTIONS[step].question}</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {QUESTIONS[step].options.map((opt) => (
                    <button
                      key={opt.label}
                      onClick={() => handleSelect(opt.label)}
                      className="flex items-center gap-5 p-5 bg-white hover:bg-slate-50 rounded-2xl border border-slate-200 hover:border-green-600 hover:shadow-lg transition-all text-left group relative overflow-hidden"
                    >
                      <div className="text-3xl bg-slate-50 w-16 h-16 rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 group-hover:bg-green-600/5 transition-all duration-500">{opt.icon}</div>
                      <div className="flex-1">
                        <p className="text-xl font-black text-slate-900 group-hover:text-green-600 transition-colors">{opt.label}</p>
                        <p className="text-xs text-slate-500 font-medium mt-1.5 leading-relaxed">{opt.description}</p>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-green-600 group-hover:text-white transition-all">
                        <ChevronRight size={20} />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {isAnalyzing && (
            <div className="py-24 flex flex-col items-center text-center space-y-10">
              <div className="w-24 h-24 bg-green-600/5 rounded-2xl flex items-center justify-center relative rotate-3 animate-pulse">
                <RefreshCw size={48} className="text-green-600 animate-spin-slow" />
                <div className="absolute inset-0 bg-green-600 rounded-2xl blur-2xl opacity-10 animate-ping"></div>
              </div>
              <div className="space-y-4">
                <h3 className="text-3xl font-black text-slate-900">Calculating Peak Performance...</h3>
                <div className="flex flex-col gap-2 text-slate-400 text-sm font-medium">
                  <p className="flex items-center justify-center gap-2"><Globe size={14} className="text-blue-600" /> Analyzing climatic variables</p>
                  <p className="flex items-center justify-center gap-2"><RotateCcw size={14} className="text-amber-600" /> Factoring rotation history</p>
                  <p className="flex items-center justify-center gap-2"><TrendingUp size={14} className="text-green-600" /> Benchmarking yield trends</p>
                </div>
              </div>
            </div>
          )}

          {recommendation && (
            <div className="space-y-12 animate-fadeIn">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-gradient-to-br from-green-600 to-green-800 text-white rounded-xl flex items-center justify-center shadow-lg shadow-green-200">
                    <DollarSign size={28} />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">Strategy Unlock</h2>
                    <p className="text-slate-500 font-medium">Optimized for maximum profit and soil health.</p>
                  </div>
                </div>
                <button onClick={reset} className="flex items-center gap-2 px-6 py-3 bg-slate-50 hover:bg-white rounded-2xl text-xs font-black text-slate-400 transition-all border border-slate-200 shadow-sm uppercase tracking-widest">
                  <RefreshCw size={14} /> New Strategy
                </button>
              </div>

              <div className="bg-white/80 backdrop-blur-2xl rounded-3xl p-8 md:p-10 border border-slate-200 relative overflow-hidden shadow-xl">
                <div className="absolute right-0 top-0 w-80 h-80 bg-green-500 rounded-full blur-[120px] opacity-[0.05] -mr-20 -mt-20"></div>
                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start text-slate-900">
                  <div className="lg:col-span-7 space-y-8">
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-[10px] font-black text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-100 uppercase tracking-[0.2em]">High Value Target</span>
                        <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100 uppercase tracking-[0.2em]">Match: {recommendation.confidence}%</span>
                      </div>
                      <h3 className="text-6xl font-black text-slate-900 tracking-tight leading-none">{recommendation.crop}</h3>
                    </div>
                    <p className="text-slate-500 text-lg leading-relaxed italic border-l-4 border-green-600 pl-6 font-medium">"{recommendation.reason}"</p>
                    <div className="flex flex-wrap gap-4">
                      <div className="bg-slate-50/50 backdrop-blur-md px-6 py-4 rounded-2xl border border-slate-100 flex flex-col items-center min-w-[140px] shadow-sm">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Expected Price</p>
                        <p className="text-2xl font-black text-green-600">{recommendation.marketPrice}</p>
                      </div>
                      <div className="bg-slate-50/50 backdrop-blur-md px-6 py-4 rounded-2xl border border-slate-100 flex flex-col items-center min-w-[140px] shadow-sm">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Profitability</p>
                        <p className="text-2xl font-black text-blue-600">{recommendation.profitPotential}</p>
                      </div>
                    </div>
                  </div>
                  <div className="lg:col-span-5 space-y-6">
                    <div className="bg-slate-50/50 rounded-2xl p-6 border border-slate-100 shadow-sm">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                        <ArrowRight size={14} className="text-green-500" /> Implementation Roadmap
                      </h4>
                      <div className="space-y-4">
                        {recommendation.tasks.map((task, i) => (
                          <div key={i} className="flex items-start gap-4 group">
                            <div className="w-6 h-6 rounded-full bg-green-50 text-green-600 flex items-center justify-center text-[10px] font-black border border-green-100 group-hover:bg-green-600 group-hover:text-white transition-all flex-shrink-0 mt-0.5">{i + 1}</div>
                            <span className="text-sm font-bold text-slate-500 group-hover:text-slate-900 transition-colors">{task}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-5 rounded-2xl border border-blue-100 shadow-sm">
                  <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">Climate</p>
                  <p className="text-sm font-black text-slate-700">Match Ready</p>
                </div>
                <div className="bg-amber-50 p-5 rounded-2xl border border-amber-100 shadow-sm">
                  <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-1">Soil</p>
                  <p className="text-sm font-black text-slate-700 text-truncate">{answers.soil || 'Analyzing'}</p>
                </div>
                <div className="bg-purple-50 p-5 rounded-2xl border border-purple-100 shadow-sm">
                  <p className="text-[10px] font-black text-purple-600 uppercase tracking-widest mb-1">Rotation</p>
                  <p className="text-sm font-black text-slate-700">Post-Harvest</p>
                </div>
                <div className="bg-green-50 p-5 rounded-2xl border border-green-100 shadow-sm">
                  <p className="text-[10px] font-black text-green-600 uppercase tracking-widest mb-1">Investment</p>
                  <p className="text-sm font-black text-slate-700">Strategic Tier</p>
                </div>
              </div>

              <button className="w-full py-4 rounded-2xl bg-green-600 text-white font-black text-sm hover:bg-green-500 transition-all shadow-lg flex items-center justify-center gap-4 group">
                Generate Full Agronomic Report <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
