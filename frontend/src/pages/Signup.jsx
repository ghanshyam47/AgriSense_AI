import React from 'react';
import { SignUp } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function Signup() {
  return (
    <div className="min-h-screen bg-stone-100 font-sans flex items-center justify-center px-4 py-16 relative overflow-hidden">
      {/* Background blobs */}
      <div className="fixed top-1/4 -left-48 w-[400px] h-[400px] bg-green-500/8 rounded-full blur-[100px] pointer-events-none" />
      <div className="fixed bottom-1/4 -right-48 w-[400px] h-[400px] bg-emerald-500/8 rounded-full blur-[100px] pointer-events-none" />

      {/* Back link */}
      <Link
        to="/"
        className="fixed top-6 left-6 z-20 flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-slate-600 transition-colors group"
      >
        <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
        Back to home
      </Link>

      <div className="relative z-10 pt-8">
        <SignUp routing="path" path="/signup" signInUrl="/login" forceRedirectUrl="/dashboard" />
      </div>
    </div>
  );
}
