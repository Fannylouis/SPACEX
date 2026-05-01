import React from 'react';
import { motion } from 'motion/react';
import { Mail, ArrowLeft, RefreshCw, ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ForgotPasswordPage() {
  return (
    <div className="pt-24 min-h-screen flex items-center justify-center pb-20">
      <div className="absolute inset-0 tech-grid opacity-10 pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full px-6 relative z-10"
      >
        <div className="card-panel p-10 rounded-3xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 blur-3xl pointer-events-none" />
          
          <div className="text-center mb-10">
            <h1 className="text-3xl font-light tracking-tight mb-2 uppercase">Reset <span className="font-bold text-gradient">Phrase.</span></h1>
            <p className="text-slate-500 text-xs font-mono uppercase tracking-widest">Vault Recovery Protocol</p>
          </div>

          <div className="p-4 bg-orange-500/5 border border-orange-500/10 rounded-lg flex gap-4 mb-8">
            <ShieldAlert className="h-5 w-5 text-orange-500 shrink-0" />
            <p className="text-[10px] text-slate-400 uppercase leading-relaxed tracking-wider">
              Phrase recovery requires manual verification for accounts with tranches exceeding $1M.
            </p>
          </div>

          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.2em] block ml-1">Universal ID</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-slate-600 transition-colors group-focus-within:text-brand-primary" />
                </div>
                <input 
                  type="email" 
                  placeholder="name@nexus-equity.com"
                  className="w-full bg-black border border-white/10 rounded-lg py-4 pl-12 pr-4 text-white placeholder:text-slate-800 focus:border-brand-primary/50 transition-all outline-none font-mono text-sm"
                />
              </div>
            </div>

            <button className="w-full py-5 bg-white text-black font-bold uppercase tracking-[0.2em] text-[10px] rounded hover:bg-brand-primary transition-all active:scale-95 shadow-xl flex items-center justify-center gap-2 group">
              Send Recovery Key
              <RefreshCw className="h-4 w-4 group-hover:rotate-180 transition-transform duration-500" />
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-white/5 text-center">
            <Link 
              to="/invest/login" 
              className="text-[10px] text-slate-500 uppercase tracking-widest hover:text-white transition-colors flex items-center justify-center gap-2"
            >
              <ArrowLeft className="h-3 w-3" />
              Return to Authentication
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
