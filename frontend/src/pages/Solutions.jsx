import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, BarChart, CloudRain, Calendar, Bug, ArrowRight, Sparkles, ArrowLeft } from 'lucide-react';
import Navbar from '../components/Navbar';

const SOLUTIONS = [
  {
    icon: Mic,
    title: 'Multilingual Voice UI',
    desc: 'Empowering illiterate farmers through an integrated voice-based interface. Simply tap the mic and speak in local dialects to receive real-time weather and market advice.',
    stat: '100%',
    statLabel: 'Accessibility'
  },
  {
    icon: BarChart,
    title: 'Market Timing & MSP',
    desc: 'Real-time market price overlays against Minimum Support Price (MSP) baselines. Visualize exactly when and where to sell to secure the highest profit margins.',
    stat: '+20%',
    statLabel: 'Revenue Increase'
  },
  {
    icon: CloudRain,
    title: 'Smart Weather Alerts',
    desc: 'Connecting live weather APIs with agronomic models. Automatically alerts farmers to delay irrigation, preventing waterlogging and saving resources.',
    stat: '40%',
    statLabel: 'Water Saved'
  },
  {
    icon: Calendar,
    title: 'Monsoon Crop Calendar',
    desc: 'A dynamic crop planning calendar synchronized with monsoon patterns to ensure optimal crop cycles and avoid weather damages.',
    stat: 'Agile',
    statLabel: 'Weather Adaptive'
  },
  {
    icon: Bug,
    title: 'Pest Detection AI',
    desc: 'Weather-based pest and disease early warning models predict outbreaks. Catch diseases before they spread, significantly reducing crop loss.',
    stat: '30%',
    statLabel: 'Loss Reduction'
  }
];

export default function Solutions() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-stone-50 text-slate-900 font-sans overflow-x-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-40 pb-24 px-6 relative overflow-hidden border-b border-slate-100">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?q=80&w=2070&auto=format&fit=crop')] opacity-5 bg-cover bg-center grayscale"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-stone-50/50 via-stone-50 to-stone-50"></div>
        
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-600/5 border border-green-600/10 rounded-full mb-8 backdrop-blur-md animate-fadeIn">
            <Sparkles size={14} className="text-green-600" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-green-800/80">Neural Growth Systems</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-slate-900 leading-[1] mb-8 tracking-tighter">
            Smart Solutions for <br />
            <span className="text-green-600 italic drop-shadow-[0_0_30px_rgba(22,163,74,0.2)]">Modern Farming</span>
          </h1>
          <p className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-medium">
            Harnessing the power of AI, IoT, and real-time data to drive efficiency, sustainability, and profitability in agriculture.
          </p>
        </div>
      </section>

      {/* Solutions Grid */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {SOLUTIONS.map((sol, i) => (
              <div key={i} className="flex flex-col h-full bg-white backdrop-blur-2xl rounded-[2.5rem] p-10 border border-slate-200 hover:border-green-600/20 hover:bg-white transition-all duration-500 group relative overflow-hidden shadow-sm hover:shadow-2xl">
                <div className="absolute top-0 right-0 w-24 h-24 bg-green-600/5 rounded-full -mr-12 -mt-12"></div>
                
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-10 border border-slate-100 group-hover:scale-110 group-hover:bg-green-600 transition-all duration-500 shadow-sm">
                  <sol.icon size={28} className="text-green-600 group-hover:text-white" />
                </div>
                
                <h3 className="text-2xl font-black text-slate-900 mb-6 tracking-tight leading-snug">{sol.title}</h3>
                <p className="text-slate-500 text-base leading-relaxed font-medium mb-10 flex-grow">
                  {sol.desc}
                </p>
                
                <div className="pt-8 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <p className="text-4xl font-black text-green-600 leading-none">{sol.stat}</p>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-2">{sol.statLabel}</p>
                  </div>
                  <button className="text-[10px] font-black text-green-600 uppercase tracking-widest flex items-center gap-2 group/btn hover:text-green-700 transition-colors">
                    Analyze Core <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6">
        <div className="max-w-5xl mx-auto bg-green-600 rounded-[4rem] p-12 md:p-24 text-center relative overflow-hidden shadow-2xl shadow-green-200">
          <div className="absolute top-0 left-0 w-80 h-80 bg-white/10 rounded-full blur-[100px] -ml-40 -mt-40"></div>
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-black/5 rounded-full blur-[100px] -mr-40 -mb-40"></div>
          
          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tighter">Ready to Transform?</h2>
            <p className="text-green-50 text-xl mb-12 max-w-2xl mx-auto font-medium leading-relaxed opacity-90">
              Join thousands of farmers who are already using AgriSense to increase their yield and secure their future. Neural planning, zero effort.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <button 
                onClick={() => navigate('/contact')}
                className="w-full sm:w-auto bg-white text-green-600 font-black px-12 py-6 rounded-2xl transition-all shadow-xl shadow-green-900/10 text-sm uppercase tracking-widest hover:scale-105"
              >
                Get Custom Protocol
              </button>
              <button 
                onClick={() => navigate('/')}
                className="w-full sm:w-auto bg-green-700/50 text-white border border-white/20 font-black px-12 py-6 rounded-2xl transition-all hover:bg-green-700/70 text-sm uppercase tracking-widest backdrop-blur-md"
              >
                Return to Core
              </button>
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
