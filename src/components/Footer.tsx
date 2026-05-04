import React from 'react';
import { Shield, Twitter, Linkedin, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="py-20 border-t border-white/5 bg-[#020308]">
      <div className="max-w-7xl mx-auto px-12">
        <div className="grid md:grid-cols-4 gap-12 mb-20">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-8">
              <img src="https://69f5e78ba0be0e562863d717.imgix.net/pho/share.jpg?w=800&h=800&bg-remove=true" alt="SpaceX" className="h-48 object-contain brightness-110" referrerPolicy="no-referrer" />
            </div>
            <p className="text-slate-500 max-w-sm mb-8 leading-relaxed text-sm">
              Securing institutional exposure to the high-growth private frontier. Specialist secondary market protocols for aerospace and artificial intelligence infrastructure.
            </p>
            <div className="flex gap-4">
              <SocialLink icon={Twitter} />
              <SocialLink icon={Linkedin} />
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 text-xs uppercase tracking-[0.2em] font-mono text-slate-400">Inventory</h4>
            <ul className="space-y-4 text-[10px] uppercase tracking-widest font-mono text-slate-500">
              <li><Link to="/dashboard/shop/model-s-plaid" className="hover:text-brand-primary transition-colors">Model S Plaid</Link></li>
              <li><Link to="/dashboard/shop/model-x" className="hover:text-brand-primary transition-colors">Model X</Link></li>
              <li><Link to="/dashboard/shop/cybertruck" className="hover:text-brand-primary transition-colors">Cybertruck Fleet</Link></li>
              <li><Link to="/projects" className="hover:text-brand-primary transition-colors">Project Tranches</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 text-xs uppercase tracking-[0.2em] font-mono text-slate-400">Navigation</h4>
            <ul className="space-y-4 text-[10px] uppercase tracking-widest font-mono text-slate-500">
              <li><Link to="/shop" className="hover:text-brand-primary transition-colors">Vehicle Shop</Link></li>
              <li><Link to="/projects" className="hover:text-brand-primary transition-colors">Investment Projects</Link></li>
              <li><Link to="/invest" className="hover:text-brand-primary transition-colors">Invest Terminal</Link></li>
              <li><Link to="/invest/login" className="hover:text-brand-primary transition-colors">Access Vault</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-12 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-[9px] font-mono text-slate-600 flex gap-8">
            <span>© 2026 SPACEX.</span>
            <span>SEC RULE 506(C) REGULATED</span>
            <span>PROTO: V3.4.1</span>
          </div>
          
          <div className="flex gap-8 text-[9px] font-mono text-slate-600 uppercase tracking-widest">
            <a href="#" className="hover:text-white transition-colors">PRIVACY</a>
            <a href="#" className="hover:text-white transition-colors">TERMS</a>
            <a href="#" className="hover:text-white transition-colors">DISCLOSURE</a>
          </div>
        </div>

        <div className="mt-12 p-8 bg-white/[0.01] rounded border border-white/5">
          <p className="text-[8px] font-mono text-slate-600 leading-relaxed uppercase tracking-tighter">
            
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ label }: { label: string }) {
  return (
    <a href="#" className="hover:text-brand-primary transition-colors flex items-center gap-1 group">
      {label}
      <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-all -translate-x-1 group-hover:translate-x-0" />
    </a>
  );
}

function SocialLink({ icon: Icon }: { icon: any }) {
  return (
    <a href="#" className="p-2.5 bg-white/5 hover:bg-white/10 rounded-lg transition-all border border-white/10 text-zinc-400 hover:text-white">
      <Icon className="h-5 w-5" />
    </a>
  );
}
