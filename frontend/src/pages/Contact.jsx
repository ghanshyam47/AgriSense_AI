import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, MessageSquare, Send, Instagram, Twitter, Linkedin, Facebook, Sparkles, ArrowLeft } from 'lucide-react';
import Navbar from '../components/Navbar';

export default function Contact() {
  return (
    <div className="min-h-screen bg-stone-50 text-slate-900 font-sans overflow-x-hidden">
      <Navbar />

      <section className="pt-40 pb-24 px-6 relative">
        <div className="absolute top-1/4 -left-1/4 w-[500px] h-[500px] bg-green-500/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-1/4 -right-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <Link 
            to="/"
            className="mb-12 flex items-center gap-2 text-slate-400 hover:text-slate-600 transition-all group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Return Home</span>
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            {/* Contact Info */}
            <div className="space-y-12">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-600/5 border border-green-600/10 rounded-full mb-8 backdrop-blur-md animate-fadeIn">
                  <Sparkles size={14} className="text-green-600" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-green-800/80">Neural Connectivity Grid</span>
                </div>
                <h1 className="text-6xl md:text-8xl font-black text-slate-900 leading-[1] mb-8 tracking-tighter">
                  Let's Grow <br />
                  <span className="text-green-600 italic drop-shadow-[0_0_30px_rgba(22,163,74,0.2)]">Together</span>
                </h1>
                <p className="text-slate-500 text-lg md:text-xl max-w-xl leading-relaxed font-medium">
                  Have questions about our technology or want to explore how AgriSense can help your farm? Our team of neural experts is ready to assist.
                </p>
              </div>

              <div className="space-y-8">
                <div className="flex items-start gap-8 group">
                  <div className="w-16 h-16 bg-white border border-slate-200 shadow-sm rounded-[1.5rem] flex items-center justify-center flex-shrink-0 group-hover:bg-green-600 transition-all duration-500">
                    <Mail size={28} className="text-green-600 group-hover:text-white" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Neural Link</p>
                    <p className="text-2xl font-black text-slate-900 tracking-tight">hello@agrisense.ai</p>
                  </div>
                </div>

                <div className="flex items-start gap-8 group">
                  <div className="w-16 h-16 bg-white border border-slate-200 shadow-sm rounded-[1.5rem] flex items-center justify-center flex-shrink-0 group-hover:bg-green-600 transition-all duration-500">
                    <Phone size={28} className="text-green-600 group-hover:text-white" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Voice Command</p>
                    <p className="text-2xl font-black text-slate-900 tracking-tight">+1 (800) AGRI-NEURAL</p>
                  </div>
                </div>

                <div className="flex items-start gap-8 group">
                  <div className="w-16 h-16 bg-white border border-slate-200 shadow-sm rounded-[1.5rem] flex items-center justify-center flex-shrink-0 group-hover:bg-green-600 transition-all duration-500">
                    <MapPin size={28} className="text-green-600 group-hover:text-white" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Global HQ</p>
                    <p className="text-2xl font-black text-slate-900 tracking-tight">Neural Valley, Earth</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-6 pt-4">
                {[Instagram, Twitter, Linkedin, Facebook].map((Icon, i) => (
                  <a key={i} href="#" className="w-14 h-14 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-slate-300 hover:text-green-600 hover:border-green-600/20 hover:bg-white transition-all duration-500 shadow-sm hover:shadow-lg">
                    <Icon size={24} />
                  </a>
                ))}
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white/80 backdrop-blur-2xl rounded-[3rem] p-10 md:p-14 border border-slate-200 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-green-600/5 rounded-full -mr-16 -mt-16"></div>
              
              <div className="mb-12 relative z-10">
                <h3 className="text-3xl font-black text-slate-900 mb-4 tracking-tighter flex items-center gap-3">
                  Initialize Transmission <MessageSquare size={28} className="text-green-600" />
                </h3>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">Response within 24 neural cycles.</p>
              </div>

              <form className="space-y-8 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Identity</label>
                    <input 
                      type="text" 
                      placeholder="e.g. John Doe" 
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-black text-slate-900 placeholder:text-slate-300 focus:bg-white focus:border-green-600 focus:ring-4 focus:ring-green-500/5 transition-all outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Contact Protocol</label>
                    <input 
                      type="email" 
                      placeholder="e.g. john@neural.com" 
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-black text-slate-900 placeholder:text-slate-300 focus:bg-white focus:border-green-600 focus:ring-4 focus:ring-green-500/5 transition-all outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Sector Inquired</label>
                  <select className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-black text-slate-900 focus:bg-white focus:border-green-600 outline-none appearance-none cursor-pointer">
                    <option className="bg-white">General Inquiry</option>
                    <option className="bg-white">Technical Support</option>
                    <option className="bg-white">Partnership Interest</option>
                    <option className="bg-white">Request a Demo</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Neural Data</label>
                  <textarea 
                    rows="4" 
                    placeholder="How can our AI assist your growth today?" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-black text-slate-900 placeholder:text-slate-300 focus:bg-white focus:border-green-600 outline-none resize-none"
                  ></textarea>
                </div>

                <button className="w-full bg-green-600 text-white font-black py-5 rounded-[2rem] hover:bg-green-700 transition-all shadow-xl shadow-green-200 flex items-center justify-center gap-3 group uppercase text-xs tracking-[0.2em]">
                  <span>Send Transmission</span>
                  <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Map Placeholder */}
      <section className="px-6 mb-32">
        <div className="max-w-7xl mx-auto h-[500px] bg-slate-100 rounded-[4rem] overflow-hidden relative group border border-slate-200">
          <img 
            src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=2066&auto=format&fit=crop" 
            alt="Map" 
            className="w-full h-full object-cover grayscale opacity-40 group-hover:opacity-60 transition-all duration-1000"
          />
          <div className="absolute inset-0 flex items-center justify-center">
             <div className="bg-green-600 p-6 rounded-full shadow-2xl animate-bounce border-4 border-white">
                <MapPin size={40} className="text-white" />
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
