import React from 'react';
import { SignIn } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function Login() {
  return (
    <div className="min-h-screen bg-stone-100 font-sans flex items-center justify-center px-4 py-16 relative overflow-hidden">
      {/* Subtle background blobs */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-green-500/8 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-500/8 rounded-full blur-[100px] pointer-events-none" />

      {/* Back link */}
      <Link
        to="/"
        className="absolute top-6 left-6 flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-slate-600 transition-colors group z-20"
      >
        <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
        Back to home
      </Link>

      <div className="relative z-10">
        <SignIn routing="path" path="/login" signUpUrl="/signup" forceRedirectUrl="/dashboard" />
      </div>
    </div>
  );
}
