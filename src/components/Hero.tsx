import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, ChevronRight, Share2, TrendingUp } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative pt-32 pb-24 overflow-hidden" id="hero">
      {/* Theme Background Elements */}
      <div className="absolute top-[-10%] left-[-5%] w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[0%] w-[350px] h-[350px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute inset-0 tech-grid opacity-20 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-12 relative z-10 grid grid-cols-1 md:grid-cols-12 gap-12 items-end">
        <div className="md:col-span-7">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            Limited Pre-IPO Offering
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-7xl md:text-8xl font-light tracking-tight leading-[0.95] mb-8"
          >
            The <span className="font-bold text-gradient">Frontier</span><br/>
            Equity Round
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-400 max-w-lg leading-relaxed mb-12"
          >
            Exclusive institutional-grade access to the SpaceX & xAI secondary markets. Participate in the future of multi-planetary logistics and cognitive intelligence.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4"
          >
            <StatCard label="SpaceX Valuation" value="$210B+" sub="+12.4% vs Last" />
            <StatCard label="xAI Compute Cap" value="200k H100" sub="Scaling to 500k" />
            <StatCard label="Min. Allocation" value="$25,000" sub="Accredited only" color="text-blue-400" />
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="md:col-span-5 w-full"
        >
          <div className="card-panel p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-3xl group-hover:bg-blue-500/20 transition-all"></div>
            
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-brand-primary" />
              Secure Allocation
            </h3>
            
            <div className="space-y-6">
              <div>
                <label className="text-[10px] uppercase tracking-widest text-slate-500 block mb-3 font-mono">Select Opportunity</label>
                <div className="flex gap-2">
                  <button className="flex-1 py-3 px-2 rounded border border-blue-500 bg-blue-500/10 text-[10px] font-bold uppercase tracking-wider transition-all">SpaceX G-3</button>
                  <button className="flex-1 py-3 px-2 rounded border border-white/5 bg-white/5 text-[10px] font-bold uppercase tracking-wider text-slate-400 hover:bg-white/10 transition-all">xAI Series B</button>
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-widest text-slate-500 block mb-3 font-mono">Investment Amount (USD)</label>
                <div className="relative">
                  <input type="text" defaultValue="50,000" className="w-full bg-black border border-white/10 rounded py-4 px-4 text-xl font-mono text-white focus:outline-none focus:border-blue-500/50" />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 font-mono text-sm">USD</span>
                </div>
                <div className="flex justify-between mt-2 px-1">
                  <span className="text-[10px] text-slate-500 font-mono">Market Cap: $210B</span>
                  <span className="text-[10px] text-blue-400 underline cursor-pointer font-mono">View Terms</span>
                </div>
              </div>

              <button className="w-full py-5 bg-white text-black font-bold uppercase tracking-widest text-[10px] rounded hover:bg-blue-400 transition-all shadow-lg active:scale-95">
                Initialize Purchase
              </button>
            </div>
          </div>
          
          <div className="mt-8 flex items-center gap-4 px-2">
            <div className="h-[1px] flex-grow bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
            <div className="font-mono text-[9px] text-slate-600 uppercase tracking-[0.3em] flex gap-6 whitespace-nowrap">
              <span>TSLA $248.42</span>
              <span>BTC $63,102</span>
            </div>
            <div className="h-[1px] flex-grow bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function StatCard({ label, value, sub, color = "text-slate-100" }: { label: string; value: string; sub: string; color?: string }) {
  return (
    <div className="p-6 rounded-xl border border-white/5 bg-white/5 backdrop-blur-sm group hover:border-white/10 transition-all">
      <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-2 font-mono">{label}</div>
      <div className={`text-2xl font-mono ${color}`}>{value}</div>
      <div className={`text-[10px] mt-1 font-mono ${sub.includes('+') ? 'text-emerald-400' : 'text-slate-500'}`}>{sub}</div>
    </div>
  );
}
