import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, TrendingUp, Lock, Rocket, Target, Globe, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';

export default function InvestPage() {
  const { user } = useAuth();
  const { formatPrice } = useCurrency();

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
                Ready to secure your position? Complete the allocation request below or access your secure portal to view active opportunities.
              </p>
              
              <div className="mt-8 flex items-center gap-6">
                <a href="#opportunities" className="group flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.3em] text-brand-primary hover:text-white transition-colors">
                  View Opportunities
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
                <div className="h-4 w-[1px] bg-white/10" />
                <Link 
                  to={user ? "/invest/dashboard" : "/invest/login"} 
                  className="group flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.3em] text-white/50 hover:text-brand-primary transition-colors"
                >
                  {user ? "Investor Dashboard" : "Access Account"}
                  <Lock className="w-3 h-3" />
                </Link>
              </div>
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

      <section className="pt-24 pb-12 bg-black">
        <div className="max-w-7xl mx-auto px-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-8 border border-brand-primary/20 bg-brand-primary/5 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-8"
          >
            <div>
              <h4 className="text-xl font-bold mb-2">Ready to expand your portfolio?</h4>
              <p className="text-slate-400 text-sm">Register your institutional account to access detailed pitch decks and data rooms.</p>
            </div>
            <Link 
              to="/invest/signup"
              className="px-8 py-4 bg-brand-primary text-black font-bold uppercase tracking-widest text-[10px] rounded-lg hover:bg-white transition-all whitespace-nowrap"
            >
              Open Investor Account
            </Link>
          </motion.div>
        </div>
      </section>

      <section id="opportunities" className="py-32 border-y border-white/5 bg-black">
        <div className="max-w-7xl mx-auto px-12">
          <div className="mb-16">
            <h2 className="text-4xl font-light tracking-tight mb-4 uppercase">Direct <span className="font-bold text-brand-primary">Opportunities.</span></h2>
            <p className="text-slate-500 text-sm font-mono tracking-widest uppercase">Open for institutional and accredited capital allocation</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <OpportunityCard 
              title="Starlink Series C"
              status="Closing Soon"
              roi="12.4% Est."
              min={10000}
              icon={Globe}
              description="Global satellite mesh network expansion and direct-to-cell infrastructure."
            />
            <OpportunityCard 
              title="Mars Colony Fund II"
              status="Open"
              roi="15% Est."
              min={50000}
              icon={Rocket}
              description="Capital allocation for long-range habitation modules and propulsion testing."
            />
            <OpportunityCard 
              title="Lunar Logistics V"
              status="Limited"
              roi="13% Est."
              min={25000}
              icon={Target}
              description="Surface transport and resource extraction logistics for Artemis-support missions."
            />
          </div>
        </div>
      </section>

      <section className="py-32 max-w-7xl mx-auto px-12">
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

function OpportunityCard({ title, status, roi, min, icon: Icon, description }: { 
  title: string; status: string; roi: string; min: number; icon: any; description: string 
}) {
  const { user } = useAuth();
  const { formatPrice } = useCurrency();
  return (
    <Link 
      to={user ? "/invest/dashboard" : "/invest/login"}
      className="p-8 rounded-2xl border border-white/5 bg-white/[0.01] hover:border-brand-primary/30 transition-all flex flex-col h-full group cursor-pointer"
    >
      <div className="flex justify-between items-start mb-6">
        <div className="p-3 bg-brand-primary/10 rounded-xl">
          <Icon className="w-6 h-6 text-brand-primary" />
        </div>
        <span className={`px-2 py-1 rounded text-[8px] font-bold uppercase tracking-widest ${
          status === 'Closing Soon' ? 'bg-orange-500/10 text-orange-500 border border-orange-500/20' : 
          status === 'Limited' ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' :
          'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
        }`}>
          {status}
        </span>
      </div>
      <h3 className="text-xl font-bold mb-3 group-hover:text-brand-primary transition-colors">{title}</h3>
      <p className="text-slate-500 text-xs mb-8 flex-grow leading-relaxed">{description}</p>
      
      <div className="space-y-3 pt-6 border-t border-white/5">
        <div className="flex justify-between items-center text-[10px] font-mono uppercase tracking-widest">
          <span className="text-slate-500">Projected ROI</span>
          <span className="text-emerald-400 font-bold">{roi}</span>
        </div>
        <div className="flex justify-between items-center text-[10px] font-mono uppercase tracking-widest">
          <span className="text-slate-500">Minimum Lockup</span>
          <span className="text-white">{formatPrice(min)}</span>
        </div>
      </div>
    </Link>
  );
}
