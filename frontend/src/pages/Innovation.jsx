import React from 'react';
import { Cpu, Zap, Microscope, Radio, Binary, Sparkles, ArrowLeft } from 'lucide-react';
import Navbar from '../components/Navbar';

const TECH_CARDS = [
  {
    icon: Cpu,
    title: 'Precision IoT',
    desc: 'Deploying networks of soil sensors and micro-climate stations to provide granular data on crop health.'
  },
  {
    icon: Zap,
    title: 'Autonomous Drones',
    desc: 'High-resolution multispectral imaging for early pest detection and automated precision spraying.'
  },
  {
    icon: Microscope,
    title: 'Biotech Research',
    desc: 'Collaborating with scientists to develop climate-resilient seed varieties and organic bio-fertilizers.'
  },
  {
    icon: Radio,
    title: 'Satellite Imagery',
    desc: 'Leveraging real-time satellite data to monitor crop growth and land changes on a global scale.'
  },
  {
    icon: Binary,
    title: 'Machine Learning',
    desc: 'Deep learning models trained on decades of agronomic data to predict yield with 95% accuracy.'
  },
  {
    icon: Sparkles,
    title: 'Future Lab',
    desc: 'Exploring vertical farming and hydroponics to solve urban food security challenges.'
  }
];

export default function Innovation() {
  return (
    <div className="min-h-screen bg-stone-50 text-slate-900 font-sans overflow-x-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-40 pb-24 px-6 relative overflow-hidden border-b border-slate-100">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-green-500/5 rounded-full blur-[150px] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-600/5 border border-green-600/10 rounded-full mb-8 backdrop-blur-md animate-fadeIn">
              <Sparkles size={14} className="text-green-600" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-green-800/80">Neural Innovation Lab</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-slate-900 leading-[1] mb-8 tracking-tighter">
              Engineering the <br />
              <span className="text-green-600 italic drop-shadow-[0_0_30px_rgba(22,163,74,0.2)]">Green Revolution</span>
            </h1>
            <p className="text-slate-500 text-lg md:text-xl max-w-3xl leading-relaxed mb-12 font-medium">
              Innovation is the heartbeat of AgriSense. We are constantly exploring neural horizons in science and technology to build a resilient food ecosystem.
            </p>
            <div className="flex flex-wrap gap-6">
              <div className="bg-white backdrop-blur-md text-green-600 px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest border border-green-600/20 flex items-center gap-3 shadow-xl shadow-green-100">
                <Sparkles size={18} /> AI-Powered Analytics
              </div>
              <div className="bg-white backdrop-blur-md text-emerald-600 px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest border border-emerald-600/20 flex items-center gap-3 shadow-xl shadow-emerald-100">
                <Zap size={18} /> Sustainable Energy
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Innovation Pillars */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {TECH_CARDS.map((tech, i) => (
              <div key={i} className="bg-white backdrop-blur-2xl p-12 rounded-[3rem] border border-slate-200 hover:border-green-600/20 hover:bg-white transition-all duration-500 group relative overflow-hidden shadow-sm hover:shadow-2xl">
                <div className="absolute top-0 right-0 w-24 h-24 bg-green-600/5 rounded-full -mr-12 -mt-12"></div>
                <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center mb-10 border border-slate-100 group-hover:bg-green-600 transition-all duration-500 transform group-hover:rotate-12 shadow-sm">
                  <tech.icon size={36} className="text-slate-400 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight leading-snug">{tech.title}</h3>
                <p className="text-slate-500 text-base leading-relaxed font-medium">
                  {tech.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roadmap / Timeline */}
      <section className="py-32 px-6 bg-slate-50 backdrop-blur-3xl border-y border-slate-100">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter">Neural <span className="text-green-600">Roadmap</span></h2>
            <p className="text-slate-400 mt-4 text-[11px] font-black uppercase tracking-widest leading-loose">The vector of our expansion into the next decade.</p>
          </div>
          
          <div className="space-y-20 relative">
            <div className="absolute left-12 top-0 bottom-0 w-px bg-gradient-to-b from-green-600/50 via-green-600/20 to-transparent"></div>

            {[
              { year: '2025', title: 'Carbon Credit Integration', desc: 'Rewarding farmers for sequestering carbon through regenerative practices.', color: 'text-green-600', bg: 'bg-green-600' },
              { year: '2026', title: 'Autonomous Fleet Launch', desc: 'Fully autonomous tractors and harvesters for large-scale efficient farming.', color: 'text-blue-600', bg: 'bg-blue-600' },
              { year: '2027', title: 'Agri-Blockchain', desc: 'Full transparency and traceability from seed to shelf using blockchain tech.', color: 'text-amber-600', bg: 'bg-amber-600' }
            ].map((milestone, i) => (
              <div key={i} className="flex gap-16 relative group">
                <div className={`w-24 h-24 rounded-3xl ${milestone.bg} flex items-center justify-center flex-shrink-0 z-10 shadow-xl border-4 border-white group-hover:scale-110 transition-transform duration-500`}>
                  <span className="font-black text-white text-xl">{milestone.year}</span>
                </div>
                <div className="pt-4">
                  <h3 className={`text-2xl font-black mb-3 tracking-tight ${milestone.color}`}>{milestone.title}</h3>
                  <p className="text-slate-500 text-lg leading-relaxed font-medium">{milestone.desc}</p>
                </div>
              </div>
            ))}
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
