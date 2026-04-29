import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Leaf, Sparkles, ArrowRight, ArrowLeft } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    sessionStorage.setItem('agri_authed', 'true');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-stone-100 font-sans flex items-center justify-center px-4 py-16 relative overflow-hidden">
      {/* Subtle background blobs */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-green-500/8 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-500/8 rounded-full blur-[100px] pointer-events-none" />

      {/* Card */}
      <div className="relative z-10 w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-xl shadow-slate-200/60 overflow-hidden">
        {/* Card top accent strip */}
        <div className="h-1.5 w-full bg-gradient-to-r from-green-500 to-emerald-500" />

        <div className="p-8 md:p-10">
          {/* Logo */}
          <div className="flex items-center gap-2.5 mb-8">
            <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center shadow-md shadow-green-200">
              <Leaf className="text-white" size={20} />
            </div>
            <span className="text-xl font-black text-slate-900 tracking-tight">
              Agri<span className="text-green-600">Sense</span>
            </span>
          </div>

          <h1 className="text-2xl font-black text-slate-900 tracking-tight mb-1">Welcome back</h1>
          <p className="text-sm text-slate-500 font-medium mb-8">Sign in to your agricultural dashboard</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-green-600 transition-colors">
                  <Mail size={17} />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-green-500 focus:ring-2 focus:ring-green-500/10 transition-all outline-none"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-green-600 transition-colors">
                  <Lock size={17} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-12 py-3 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-green-500 focus:ring-2 focus:ring-green-500/10 transition-all outline-none"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-end">
              <button type="button" className="text-xs font-semibold text-green-600 hover:text-green-700 transition-colors">
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-green-200/60 transition-all active:scale-[0.98] flex items-center justify-center gap-2 group text-sm"
            >
              <span>Sign In</span>
              <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-500">
              Don't have an account?{' '}
              <Link
                to="/signup"
                className="text-green-600 hover:text-green-700 font-bold transition-colors"
              >
                Sign up free
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Back link */}
      <Link
        to="/"
        className="absolute top-6 left-6 flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-slate-600 transition-colors group"
      >
        <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
        Back to home
      </Link>
    </div>
  );
}
