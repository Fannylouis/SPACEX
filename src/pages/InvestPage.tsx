import React from 'react';
import { motion } from 'motion/react';
import InterestForm from '../components/InterestForm';
import { ShieldCheck, TrendingUp, Lock } from 'lucide-react';

export default function InvestPage() {
  return (
    <div className="pt-24 min-h-screen">
      <section className="py-16 border-b border-white/5 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto px-12">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="md:col-span-2">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-6"
              >
                <ShieldCheck className="w-3 h-3" />
                Verified Institutional Portal
              </motion.div>
              <h1 className="text-6xl font-light tracking-tight mb-6">Commit <span className="font-bold text-gradient">Capital.</span></h1>
              <p className="text-slate-400 text-lg max-w-xl">
                Ready to secure your position? Complete the allocation request below. Our legal team will verify your accreditation status within 24 hours.
              </p>
            </div>
            
            <div className="flex flex-col justify-center">
              <div className="p-6 rounded-xl border border-white/5 bg-white/5 backdrop-blur-sm">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[10px] uppercase font-mono text-slate-500 tracking-widest">Protocol Status</span>
                  <span className="text-[10px] uppercase font-mono text-emerald-400">Operational</span>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm font-mono">
                    <span className="text-slate-400">Network</span>
                    <span className="text-white">Vault-V3</span>
                  </div>
                  <div className="flex justify-between text-sm font-mono">
                    <span className="text-slate-400">Escrow</span>
                    <span className="text-white">Fidelity-Digital</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <InterestForm />

      <section className="pb-32 max-w-7xl mx-auto px-12">
        <div className="grid md:grid-cols-3 gap-8">
           <PromoCard 
             title="Direct Transfer" 
             desc="Bypass SPV structures for allocations above $5M." 
             icon={TrendingUp}
           />
           <PromoCard 
             title="Smart Escrow" 
             desc="Automated settlement via smart-contract regulated vaults." 
             icon={Lock}
           />
           <PromoCard 
             title="Lending" 
             desc="Borrow against your private equity holdings instantly." 
             icon={ShieldCheck}
           />
        </div>
      </section>
    </div>
  );
}

function PromoCard({ title, desc, icon: Icon }: { title: string; desc: string; icon: any }) {
  return (
    <div className="p-8 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all group">
      <Icon className="h-6 w-6 text-brand-primary mb-4 group-hover:scale-110 transition-transform" />
      <h4 className="text-lg font-bold mb-2 uppercase tracking-tight">{title}</h4>
      <p className="text-slate-500 text-xs leading-relaxed">{desc}</p>
    </div>
  );
}
