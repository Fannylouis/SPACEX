import React from 'react';
import { motion } from 'motion/react';
import { Rocket, Brain, BarChart3, Lock, ShieldCheck } from 'lucide-react';

interface CompanyProps {
  name: string;
  tagline: string;
  description: string;
  valuation: string;
  sector: string;
  color: string;
  icon: React.ElementType;
}

const companies: CompanyProps[] = [
  {
    name: "SpaceX",
    tagline: "Leading the transition to a multi-planetary species.",
    description: "SpaceX designs, manufactures and launches advanced rockets and spacecraft. Its Starlink division is building a global satellite constellation to provide high-speed internet everywhere on Earth.",
    valuation: "$210B+ (Est.)",
    sector: "Aerospace & Defense",
    color: "#00D1FF",
    icon: Rocket
  },
  {
    name: "xAI",
    tagline: "Accelerating human collective understanding.",
    description: "Elon Musk's newest venture focused on building advanced artificial intelligence that understands the universe. Grok represents the first step in creating a truth-seeking LLM.",
    valuation: "$45B+ (Series B)",
    sector: "Artificial Intelligence",
    color: "#7000FF",
    icon: Brain
  }
];

export default function OpportunitiesSection() {
  return (
    <section className="py-24 relative" id="opportunities">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">EXCLUSIVE ALLOCATIONS.</h2>
            <p className="text-zinc-400 text-lg">We maintain direct relationships with secondary market stakeholders to provide verified exposure to the world's most valuable private ecosystems.</p>
          </div>
          <div className="flex items-center gap-4 text-sm font-mono text-brand-primary">
            <BarChart3 className="h-4 w-4" />
            LIVE MARKET DATA UPDATED HOURLY
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {companies.map((company, index) => (
            <motion.div
              key={company.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="card-panel group overflow-hidden flex flex-col h-full rounded-2xl relative"
              id={`company-${company.name.toLowerCase()}`}
            >
              <div 
                className="absolute top-0 right-0 w-64 h-64 blur-[80px] rounded-full opacity-[0.03] pointer-events-none group-hover:opacity-[0.08] transition-opacity"
                style={{ backgroundColor: company.color }}
              />
              
              <div className="p-10 flex-grow">
                <div className="flex items-center justify-between mb-12">
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-16 h-16 rounded-xl flex items-center justify-center border border-white/10"
                      style={{ backgroundColor: `${company.color}05` }}
                    >
                      <company.icon className="h-8 w-8" style={{ color: company.color }} />
                    </div>
                    <div>
                      <h3 className="text-3xl font-bold uppercase tracking-tight">{company.name}</h3>
                      <span className="text-[10px] font-mono tracking-widest text-slate-500 uppercase">{company.sector}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-mono text-slate-500 mb-1">VALUATION</p>
                    <p className="text-xl font-mono text-white">{company.valuation}</p>
                  </div>
                </div>

                <p className="text-xl font-display font-medium text-white mb-6 leading-tight italic">"{company.tagline}"</p>
                <p className="text-slate-400 leading-relaxed mb-8">{company.description}</p>

                <div className="grid grid-cols-2 gap-4 mb-10">
                  <FeatureItem icon={Lock} label="Access Type" value="Pre-IPO Restricted" />
                  <FeatureItem icon={ShieldCheck} label="Verification" value="Accredited Only" />
                </div>
              </div>

              <div className="p-8 border-t border-white/5 bg-white/[0.01]">
                <button 
                  className="w-full py-5 rounded font-display font-bold uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 transition-all hover:brightness-110 active:scale-95 bg-white text-black"
                >
                  Request Allocation
                  <ArrowDiagonal />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureItem({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="h-5 w-5 text-zinc-600 mt-0.5" />
      <div>
        <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider">{label}</p>
        <p className="text-sm font-medium text-zinc-300">{value}</p>
      </div>
    </div>
  );
}

function ArrowDiagonal() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="rotate-45">
      <line x1="7" y1="17" x2="17" y2="7"></line>
      <polyline points="7 7 17 7 17 17"></polyline>
    </svg>
  );
}
