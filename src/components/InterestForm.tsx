import React from 'react';
import { motion } from 'motion/react';
import { Send, Globe, Mail, Phone, Lock, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function InterestForm() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      navigate('/invest/dashboard');
    } else {
      navigate('/invest/signup');
    }
  };

  return (
    <section className="py-32 relative overflow-hidden" id="about">
      <div className="max-w-7xl mx-auto px-12 grid md:grid-cols-12 gap-20">
        <div className="md:col-span-7">
          <h2 className="text-6xl font-light mb-8 leading-none tracking-tight">SECURE YOUR <br /><span className="font-bold text-gradient">POSITION.</span></h2>
          <p className="text-slate-400 text-lg mb-12 leading-relaxed max-w-lg">
            Market capacity for SpaceX and xAI is limited. Expressions of interest are processed on a first-come, first-served basis. Join our priority list to be notified of new tranches.
          </p>

          <div className="space-y-8">
            <ContactInfo icon={Globe} label="Global HQ" value="Los Angeles, CA • 2000 Avenue of the Stars" />
            <ContactInfo icon={Mail} label="Access Desk" value="allocations@nexus-equity.com" />
            <ContactInfo icon={Phone} label="Direct Line" value="+1 (310) 555-0192" />
          </div>

          <div className="mt-16 pt-8 border-t border-white/5 flex items-center gap-6">
            <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center shrink-0">
               <ShieldCheck className="w-6 h-6 text-slate-400" />
            </div>
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wider">Secure Protocol Enabled</p>
              <p className="text-[10px] text-slate-500 font-mono">Escrow handled via Fidelity Digital Assets</p>
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="md:col-span-5 card-panel p-10 rounded-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl pointer-events-none"></div>
          <form className="space-y-6 relative z-10" onSubmit={handleSubmit}>
            <div className="grid md:grid-cols-2 gap-6">
              <InputGroup label="First Name" type="text" placeholder="John" />
              <InputGroup label="Last Name" type="text" placeholder="Doe" />
            </div>
            <InputGroup label="Corporate Entity" type="text" placeholder="Family Office LLC" />
            <InputGroup label="Contact Email" type="email" placeholder="john@vault.com" />
            
            <div className="space-y-3">
              <label className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.2em] block">Allocation Range (USD)</label>
              <select className="w-full bg-black border border-white/10 rounded-lg p-4 text-white focus:border-brand-primary/50 transition-colors outline-none appearance-none font-mono text-sm">
                <option value="">Select Tier</option>
                <option value="100-500k">$100,000 - $500,000</option>
                <option value="500k-1m">$500,000 - $1,000,000</option>
                <option value="1m-5m">$1,000,000 - $5,000,000</option>
                <option value="5m+">$5,000,000+</option>
              </select>
            </div>

            <div className="flex items-start gap-3 mt-8">
              <input type="checkbox" id="accredited" className="w-4 h-4 mt-1 rounded border-white/10 bg-black accent-brand-primary" />
              <label htmlFor="accredited" className="text-[10px] text-slate-500 leading-relaxed uppercase tracking-wider">I certify that I am an accredited investor under Rule 501 of Regulation D.</label>
            </div>

            <button className="w-full py-5 bg-white text-black font-bold uppercase tracking-[0.2em] text-[10px] rounded hover:bg-brand-primary transition-all group flex items-center justify-center gap-3 active:scale-95 shadow-xl">
              INITIALIZE ALLOCATION
              <Send className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}

function InputGroup({ label, type, placeholder }: { label: string; type: string; placeholder: string }) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.2em] block">{label}</label>
      <input 
        type={type} 
        placeholder={placeholder}
        className="w-full bg-black border border-white/10 rounded p-4 text-white placeholder:text-slate-800 focus:border-brand-primary/50 transition-colors outline-none font-mono text-sm"
      />
    </div>
  );
}

function ContactInfo({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex items-center gap-4 group">
      <div className="p-3 bg-white/5 rounded border border-white/5 group-hover:border-white/20 transition-colors">
        <Icon className="h-4 w-4 text-slate-500" />
      </div>
      <div>
        <p className="text-[9px] font-mono text-slate-500 uppercase tracking-widest mb-0.5">{label}</p>
        <p className="text-slate-300 text-sm font-medium">{value}</p>
      </div>
    </div>
  );
}
