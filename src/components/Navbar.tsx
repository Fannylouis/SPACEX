import React from 'react';
import { motion } from 'motion/react';
import { Shield, Rocket, Activity, Menu, Globe, ShieldCheck } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCurrency, currencyOptions } from '../context/CurrencyContext';

export default function Navbar() {
  const { user } = useAuth();
  const { selectedCurrency, setCurrencyByCode } = useCurrency();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  
  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-md border-b border-white/5"
      id="navbar"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 h-20 md:h-24 flex items-center justify-between">
        <div className="flex items-center gap-4 md:gap-12">
          <Link to="/" className="flex items-center gap-3">
            <img src="https://69f5e78ba0be0e562863d717.imgix.net/pho/share.jpg?w=800&h=800&bg-remove=true" alt="SpaceX" className="h-32 md:h-48 object-contain brightness-110" referrerPolicy="no-referrer" />
          </Link>

          {/* Currency Selector */}
          <div className="flex items-center gap-2 md:gap-3 bg-white/5 border border-white/10 px-2 md:px-3 py-1 md:py-1.5 rounded-lg">
            <Globe className="h-3 w-3 text-slate-500" />
            <select 
              value={selectedCurrency.code}
              onChange={(e) => setCurrencyByCode(e.target.value)}
              className="bg-transparent border-none text-[8px] font-mono text-white underline uppercase focus:outline-none focus:ring-0 cursor-pointer"
            >
              {currencyOptions.map(opt => (
                <option key={opt.code} value={opt.code} className="bg-slate-900">{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-10 text-[10px] font-bold tracking-[0.3em] uppercase">
          {/* Security Status */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-emerald-500/5 border border-emerald-500/20 rounded-full">
            <ShieldCheck className="h-3 w-3 text-emerald-500" />
            <span className="text-[8px] font-bold font-mono text-emerald-500/80 uppercase tracking-widest">TLS 1.3 Secure</span>
          </div>

          <NavLink to="/" label="Home" />
          <NavLink to="/shop" label="Shop" />
          <NavLink to="/projects" label="Projects" />
          <NavLink to="/invest" label="Invest" />
          {user?.email === 'mgbemere3@gmail.com' && (
            <Link 
              to="/admin" 
              className="px-4 py-2 bg-brand-primary/10 text-brand-primary border border-brand-primary/20 rounded-lg text-[9px] font-mono uppercase tracking-widest hover:bg-brand-primary hover:text-black transition-all flex items-center gap-2"
            >
              <Shield className="h-3 w-3" />
              Admin Portal
            </Link>
          )}
          <Link 
            to={user ? "/invest/dashboard" : "/invest/login"} 
            className="px-6 py-2.5 border border-brand-primary/50 rounded bg-brand-primary/5 text-brand-primary cursor-pointer hover:bg-brand-primary/10 transition-all font-bold"
          >
            {user ? "Dashboard" : "Account"}
          </Link>
        </div>

        {/* Mobile menu button */}
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2 text-white hover:text-brand-primary transition-colors"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Mobile Nav Overlay */}
      {isMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="md:hidden bg-black border-t border-white/5 px-6 py-8 space-y-6"
        >
          <div className="flex flex-col gap-6 text-[10px] font-bold tracking-[0.3em] uppercase">
            <Link to="/" onClick={() => setIsMenuOpen(false)} className="text-slate-400 hover:text-white transition-colors">Home</Link>
            <Link to="/shop" onClick={() => setIsMenuOpen(false)} className="text-slate-400 hover:text-white transition-colors">Shop</Link>
            <Link to="/projects" onClick={() => setIsMenuOpen(false)} className="text-slate-400 hover:text-white transition-colors">Projects</Link>
            <Link to="/invest" onClick={() => setIsMenuOpen(false)} className="text-slate-400 hover:text-white transition-colors">Invest</Link>
            {user?.email === 'mgbemere3@gmail.com' && (
              <Link 
                to="/admin" 
                onClick={() => setIsMenuOpen(false)}
                className="w-full text-center py-4 border border-brand-primary/20 rounded bg-brand-primary/5 text-brand-primary font-mono text-[10px] uppercase tracking-widest flex items-center justify-center gap-2"
              >
                <Shield className="h-4 w-4" />
                Admin Portal
              </Link>
            )}
            <Link 
              to={user ? "/invest/dashboard" : "/invest/login"} 
              onClick={() => setIsMenuOpen(false)}
              className="w-full text-center py-4 border border-brand-primary/50 rounded bg-brand-primary/5 text-brand-primary font-bold"
            >
              {user ? "Dashboard" : "Account"}
            </Link>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
}

function NavLink({ to, label }: { to: string; label: string }) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link 
      to={to} 
      className={`transition-colors relative group ${isActive ? 'text-brand-primary' : 'text-slate-400 hover:text-white'}`}
    >
      {label}
      {isActive && (
        <motion.span 
          layoutId="nav-glow"
          className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-8 h-[2px] bg-brand-primary glow-primary shadow-[0_0_10px_rgba(59,130,246,0.5)]" 
        />
      )}
    </Link>
  );
}
