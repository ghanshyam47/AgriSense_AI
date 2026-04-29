import React from 'react';
import { MapPin, Users, TrendingUp, CheckCircle, Sparkles, ArrowLeft } from 'lucide-react';
import Navbar from '../components/Navbar';

const PROJECTS = [
  {
    image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=2070&auto=format&fit=crop',
    location: 'Punjab, India',
    title: 'Smart Wheat Initiative',
    impact: 'Increased yield by 25% across 500 farms.',
    tags: ['IoT', 'Water Management']
  },
  {
    image: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?q=80&w=2064&auto=format&fit=crop',
    location: 'Nakuru, Kenya',
    title: 'Voice-First Dairy Support',
    impact: 'Supporting 2,000+ small-scale farmers via local dialects.',
    tags: ['Voice UI', 'Livestock']
  },
  {
    image: 'https://images.unsplash.com/photo-1595113316349-9fa4ee24f884?q=80&w=2072&auto=format&fit=crop',
    location: 'Mato Grosso, Brazil',
    title: 'Precision Soy Monitoring',
    impact: 'Reduced pesticide usage by 40% using AI drones.',
    tags: ['AI Drones', 'Sustainability']
  }
];

export default function Projects() {
  return (
    <div className="min-h-screen bg-stone-50 text-slate-900 font-sans overflow-x-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-40 pb-24 px-6 relative overflow-hidden border-b border-slate-100">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-green-500/5 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-end justify-between gap-12 relative z-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-600/5 border border-green-600/10 rounded-full mb-8 backdrop-blur-md animate-fadeIn">
              <Sparkles size={14} className="text-green-600" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-green-800/80">Global Neural Coverage</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-slate-900 leading-[1] mb-8 tracking-tighter">
              Our Global <span className="text-green-600 italic drop-shadow-[0_0_30px_rgba(22,163,74,0.2)]">Impact</span>
            </h1>
            <p className="text-slate-500 text-lg md:text-xl leading-relaxed font-medium">
              From small family farms in Africa to massive cooperatives in South America, AgriSense is making a neural difference where it matters most.
            </p>
          </div>
          <div className="flex gap-12 pb-4">
            <div className="text-center">
              <p className="text-5xl md:text-6xl font-black text-slate-900">30+</p>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-2">Countries</p>
            </div>
            <div className="text-center">
              <p className="text-5xl md:text-6xl font-black text-green-600">1M+</p>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-2">Acres</p>
            </div>
          </div>
        </div>
      </section>

      {/* Project Grid */}
      <section className="py-32 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {PROJECTS.map((project, i) => (
              <div key={i} className="bg-white backdrop-blur-2xl rounded-[3rem] overflow-hidden border border-slate-200 hover:border-green-600/20 shadow-xl transition-all duration-500 group">
                <div className="h-72 overflow-hidden relative">
                  <img 
                    src={project.image} 
                    alt={project.title} 
                    className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000"
                  />
                  <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md border border-slate-200 px-5 py-2.5 rounded-full flex items-center gap-2 shadow-xl">
                    <MapPin size={14} className="text-green-600" />
                    <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">{project.location}</span>
                  </div>
                </div>
                <div className="p-10">
                  <div className="flex gap-3 mb-6">
                    {project.tags.map(tag => (
                      <span key={tag} className="text-[9px] font-black uppercase tracking-[0.2em] bg-green-50 text-green-600 border border-green-600/20 px-4 py-1.5 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight leading-snug">{project.title}</h3>
                  <p className="text-slate-500 text-base leading-relaxed font-medium mb-10">
                    {project.impact}
                  </p>
                  <button className="w-full py-5 rounded-2xl bg-slate-50 border border-slate-200 font-black text-[10px] text-slate-400 uppercase tracking-widest hover:bg-green-600 hover:text-white hover:border-green-600 transition-all duration-500 flex items-center justify-center gap-3 group/btn">
                    Analyze Case Study <CheckCircle size={16} className="group-hover/btn:rotate-12 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Global Presence Strip */}
      <section className="py-32 px-6 border-y border-slate-100 bg-slate-50 backdrop-blur-3xl">
        <div className="max-w-7xl mx-auto">
           <div className="flex flex-col md:flex-row items-center gap-24">
              <div className="md:w-1/3">
                <h2 className="text-4xl font-black text-slate-900 mb-6 tracking-tight">Supporting Local Nodes</h2>
                <p className="text-slate-500 text-base leading-relaxed font-medium">
                  We don't just provide technology; we provide neural training, high-impact jobs, and localized support to ensure long-term global success.
                </p>
              </div>
              <div className="md:w-2/3 grid grid-cols-2 md:grid-cols-4 gap-12">
                <div className="flex flex-col items-center group">
                  <div className="w-20 h-20 bg-white border border-slate-200 rounded-[1.5rem] flex items-center justify-center mb-6 group-hover:bg-green-600 transition-all duration-500 shadow-xl">
                    <Users size={32} className="text-green-600 group-hover:text-white" />
                  </div>
                  <p className="text-3xl font-black text-slate-900">50k+</p>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-2">Farmers Trained</p>
                </div>
                <div className="flex flex-col items-center group">
                   <div className="w-20 h-20 bg-white border border-slate-200 rounded-[1.5rem] flex items-center justify-center mb-6 group-hover:bg-green-600 transition-all duration-500 shadow-xl">
                    <TrendingUp size={32} className="text-green-600 group-hover:text-white" />
                  </div>
                  <p className="text-3xl font-black text-slate-900">150%</p>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-2">Avg. ROI</p>
                </div>
              </div>
           </div>
        </div>
      </section>

      {/* Simplified Footer */}
      <footer className="bg-white py-20 px-6 border-t border-slate-100">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="flex items-center space-x-3">
            <img src="/logo.jpeg" alt="AgriSense" className="w-10 h-10 rounded-xl object-contain brightness-110" />
            <span className="text-2xl font-black text-slate-900 tracking-tight">Agri<span className="text-green-600">Sense</span></span>
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">© 2026 AgriSense Platform · Neural Agricultural Network</p>
          <div className="flex space-x-8 text-[10px] font-black uppercase tracking-widest">
            {['Privacy', 'Terms', 'Contact'].map(link => (
              <a key={link} href="#" className="text-slate-500 hover:text-green-600 transition-all">{link}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
