import React from 'react';
import { motion } from 'motion/react';
import { Rocket, Satellite, Factory, Brain, Drill, Network, MapPin, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const projects = [
  {
    id: "spacex-space-city",
    name: "SpaceX Space City",
    desc: "Infrastructure funding for the primary Starship manufacturing and launch campus in Starbase, TX.",
    type: "Aerospace Infrastructure",
    icon: Rocket,
    tag: "High Priority"
  },
  {
    id: "spacex-starship-commercial-fleet",
    name: "Starship Commercial Fleet",
    desc: "Financing the construction of the first 50 commercial-grade Starship heavy-lift launch vehicles.",
    type: "Logistics",
    icon: Satellite,
    tag: "Yield Optimized"
  },
  {
    id: "tesla-gigafactory-mexico-phase-1",
    name: "Tesla Gigafactory Mexico Phase 1",
    desc: "Preferred equity for the first phase of the world's most advanced EV manufacturing site.",
    type: "Manufacturing",
    icon: Factory,
    tag: "Direct Equity"
  },
  {
    id: "xai-colossus-ii-gpu-cluster",
    name: "xAI Colossus II GPU Cluster",
    desc: "Expanding the world's most powerful AI supercomputer with 100k+ additional H100 units.",
    type: "Artificial Intelligence",
    icon: Brain,
    tag: "Tech Scale"
  },
  {
    id: "boring-company-tunnel-network",
    name: "Boring Co. Tunnel Network",
    desc: "Series C funding for expansion into massive subterranean transit networks in major US cities.",
    type: "Urban Transit",
    icon: Drill,
    tag: "Growth Round"
  },
  {
    id: "neuralink-n2-clinical-programme",
    name: "Neuralink N2 Clinical Programme",
    desc: "Next-generation brain-machine interface development and clinical regulatory pathway funding.",
    type: "Neurotechnology",
    icon: Network,
    tag: "R&D Focus"
  },
  {
    id: "boring-company-lvcc-phase-3",
    name: "Boring Co. LVCC Phase 3",
    desc: "Finalizing the Las Vegas Convention Center loop expansion and city-wide integration.",
    type: "Urban Transit",
    icon: MapPin,
    tag: "Operational"
  }
];

export default function ProjectsPage() {
  return (
    <div className="pt-24 min-h-screen">
      <section className="py-20 border-b border-white/5 relative overflow-hidden bg-white/[0.01]">
        <div className="absolute inset-0 tech-grid opacity-10 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-12 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 mb-6"
          >
            <div className="p-2 bg-brand-primary/10 rounded border border-brand-primary/20">
              <Satellite className="h-5 w-5 text-brand-primary" />
            </div>
            <span className="text-[10px] font-mono font-bold tracking-[0.3em] uppercase text-brand-primary">Project Directory</span>
          </motion.div>
          <h1 className="text-6xl font-light tracking-tight mb-4">Frontier <span className="font-bold text-gradient">Infrastructure.</span></h1>
          <p className="text-slate-400 text-lg max-w-2xl">
            Institutional tranches for Musk-ecosystem projects. Direct participation in the building of the next phase of human civilization.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-12 py-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            viewport={{ once: true }}
            className="card-panel group hover:border-brand-primary/30 transition-all p-8 flex flex-col h-full bg-white/[0.02]"
          >
            <div className="flex justify-between items-start mb-8">
              <div className="w-12 h-12 bg-white/5 rounded-lg border border-white/10 flex items-center justify-center group-hover:bg-brand-primary/5 group-hover:border-brand-primary/20 transition-all">
                <project.icon className="h-6 w-6 text-slate-400 group-hover:text-brand-primary transition-colors" />
              </div>
              <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest px-2 py-1 bg-white/5 rounded border border-white/5">{project.tag}</span>
            </div>
            
            <h3 className="text-xl font-bold uppercase tracking-tight mb-3 group-hover:text-brand-primary transition-colors">{project.name}</h3>
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-4 block underline decoration-brand-primary/30 underline-offset-4">{project.type}</span>
            <p className="text-xs text-slate-400 leading-relaxed mb-10 flex-grow">{project.desc}</p>
            
            <Link 
              to="/invest/login" 
              className="flex items-center justify-between pt-6 border-t border-white/5 group/link"
            >
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 group-hover/link:text-white transition-colors">Access Tranche</span>
              <ArrowUpRight className="h-4 w-4 text-slate-600 group-hover/link:text-brand-primary transition-all group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
