import React from 'react';
import { motion } from 'motion/react';
import { ShoppingBag, TrendingUp, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div className="h-screen w-full flex flex-col md:flex-row overflow-hidden pt-24">
      {/* Left Panel: Shop */}
      <Link 
        to="/shop"
        className="flex-1 relative group overflow-hidden border-r border-white/5"
      >
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1617704548623-3ad0383c83b1?auto=format&fit=crop&q=80&w=1200')] bg-cover bg-center grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000" />
        <div className="absolute inset-0 bg-black/60 group-hover:bg-black/40 transition-colors" />
        
        <div className="relative h-full flex flex-col items-center justify-center p-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-white/10 rounded-2xl backdrop-blur-md mb-8 border border-white/10"
          >
            <ShoppingBag className="h-8 w-8 text-white" />
          </motion.div>
          <h2 className="text-5xl font-light tracking-tighter mb-4 uppercase">Tesla <span className="font-bold">Inventory</span></h2>
          <p className="text-slate-400 max-w-sm mb-8 font-mono text-xs uppercase tracking-widest leading-relaxed">
            Configure and secure your position in the electric revolution. Real-time fleet availability for advanced mobility.
          </p>
          <div className="flex items-center gap-2 text-white font-bold uppercase tracking-widest text-[10px] bg-white/5 px-6 py-3 rounded border border-white/10 group-hover:bg-white group-hover:text-black transition-all">
            Enter Shop <ArrowRight className="h-3 w-3" />
          </div>
        </div>
      </Link>

      {/* Right Panel: Invest */}
      <Link 
        to="/invest"
        className="flex-1 relative group overflow-hidden"
      >
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200')] bg-cover bg-center grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000" />
        <div className="absolute inset-0 bg-black/60 group-hover:bg-black/40 transition-colors" />
        
        <div className="relative h-full flex flex-col items-center justify-center p-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-brand-primary/10 rounded-2xl backdrop-blur-md mb-8 border border-brand-primary/20"
          >
            <TrendingUp className="h-8 w-8 text-brand-primary" />
          </motion.div>
          <h2 className="text-5xl font-light tracking-tighter mb-4 uppercase">SpaceX <span className="font-bold">Invest</span></h2>
          <p className="text-slate-400 max-w-sm mb-8 font-mono text-xs uppercase tracking-widest leading-relaxed">
            Exclusive institutional access to SpaceX, xAI, and frontier infrastructure rounds.
          </p>
          <div className="flex items-center gap-2 text-brand-primary font-bold uppercase tracking-widest text-[10px] bg-brand-primary/5 px-6 py-3 rounded border border-brand-primary/20 group-hover:bg-brand-primary group-hover:text-black transition-all">
            Investment Terminal <ArrowRight className="h-3 w-3" />
          </div>
        </div>
      </Link>
    </div>
  );
}
