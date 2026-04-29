import React from 'react';
import { Leaf, Users, Shield, Globe, Award, Target, Sparkles, ArrowRight } from 'lucide-react';
import Navbar from '../components/Navbar';

const VALUES = [
  {
    icon: Shield,
    title: 'Integrity',
    desc: 'We uphold the highest standards of honesty and transparency in all our farming and business practices.'
  },
  {
    icon: Leaf,
    title: 'Sustainability',
    desc: 'Our methods are designed to protect the environment and ensure a healthy planet for future generations.'
  },
  {
    icon: Target,
    title: 'Innovation',
    desc: 'We continuously push the boundaries of agricultural technology to solve the world\'s food challenges.'
  },
  {
    icon: Globe,
    title: 'Global Impact',
    desc: 'Empowering farmers worldwide with tools that increase yield and reduce waste.'
  }
];

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-stone-50 text-slate-900 font-sans overflow-x-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-40 pb-24 px-6 relative overflow-hidden border-b border-slate-100">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-green-500/5 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-600/5 border border-green-600/10 rounded-full mb-8 backdrop-blur-md animate-fadeIn">
            <Sparkles size={14} className="text-green-600" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-green-800/80">Our Vision for the Earth</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-slate-900 leading-[1] mb-8 tracking-tighter">
            Cultivating the <br />
            <span className="text-green-600 italic drop-shadow-[0_0_30px_rgba(22,163,74,0.2)]">Future</span> of Food
          </h1>
          <p className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-medium">
            AgriSense is a neural agricultural technology network dedicated to merging traditional farming wisdom with cutting-edge AI and IoT solutions.
          </p>
        </div>
      </section>

      {/* Our Mission */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-20">
          <div className="md:w-1/2">
            <div className="relative group">
              <div className="absolute -inset-4 bg-green-500/5 rounded-[3rem] blur-2xl group-hover:bg-green-500/10 transition-all duration-700"></div>
              <img 
                src="https://images.unsplash.com/photo-1500673922987-e212871fec22?q=80&w=2070&auto=format&fit=crop" 
                alt="Our Farm" 
                className="rounded-[2.5rem] shadow-2xl relative z-10 border border-slate-100 grayscale-[30%] group-hover:grayscale-0 transition-all duration-700"
              />
              <div className="absolute -bottom-10 -right-10 bg-green-600 p-10 rounded-[2rem] shadow-2xl relative z-20 border border-white/20 hover:scale-105 transition-transform duration-500">
                <p className="text-5xl font-black text-white leading-none mb-2">15+</p>
                <p className="text-[10px] text-white/70 uppercase tracking-widest font-black">Years of Excellence</p>
              </div>
            </div>
          </div>
          <div className="md:w-1/2 space-y-8">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter leading-tight">Our Neural Mission</h2>
            <p className="text-slate-500 text-lg leading-relaxed font-medium">
              Founded in 2010, AgriSense began with a simple vision: to make high-quality, sustainable farming accessible to everyone. We believe that technology should empower, not replace, the farmer.
            </p>
            <p className="text-slate-500 text-lg leading-relaxed font-medium">
              Today, we serve thousands of farmers across the globe, providing them with real-time data, predictive analytics, and automated systems that transform how they interact with their land.
            </p>
            <div className="flex items-center space-x-6 pt-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-12 h-12 rounded-full border-4 border-stone-50 bg-slate-100 overflow-hidden shadow-xl">
                    <img src={`https://i.pravatar.cc/100?u=${i}`} alt="User" className="grayscale hover:grayscale-0 transition-all" />
                  </div>
                ))}
              </div>
              <div className="h-10 w-px bg-slate-200"></div>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Joined by 10k+ farmers worldwide</p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-32 px-6 bg-slate-50 border-y border-slate-100 backdrop-blur-3xl">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter">Neural <span className="text-green-600">Core Values</span></h2>
            <p className="text-slate-400 mt-4 max-w-xl mx-auto text-[11px] font-black uppercase tracking-widest leading-loose">The principles that guide every operation at AgriSense.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {VALUES.map((value, i) => (
              <div key={i} className="bg-white p-10 rounded-[2.5rem] border border-slate-100 hover:border-green-600/20 hover:bg-white transition-all duration-500 group shadow-sm hover:shadow-xl">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-8 border border-slate-100 group-hover:scale-110 group-hover:bg-green-600 group-hover:text-white transition-all duration-500">
                  <value.icon size={28} className="text-green-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-4 tracking-tight leading-snug">{value.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed font-medium">{value.desc}</p>
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
