import React from 'react';
import { motion } from 'motion/react';
import { Shield, Rocket, Activity, Menu } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user } = useAuth();
  
  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-md border-b border-white/5"
      id="navbar"
    >
      <div className="max-w-7xl mx-auto px-12 h-24 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-tr from-blue-500 to-cyan-300 rounded-sm rotate-45 flex items-center justify-center">
            <div className="w-4 h-4 bg-black rounded-sm"></div>
          </div>
          <span className="text-xl font-bold tracking-widest uppercase text-white">SpaceX</span>
        </Link>

        <div className="hidden md:flex items-center gap-10 text-[10px] font-bold tracking-[0.3em] uppercase">
          <NavLink to="/shop" label="Shop" />
          <NavLink to="/projects" label="Projects" />
          <NavLink to="/invest" label="Invest" />
          <Link 
            to={user ? "/invest/dashboard" : "/invest/login"} 
            className="px-6 py-2.5 border border-brand-primary/50 rounded bg-brand-primary/5 text-brand-primary cursor-pointer hover:bg-brand-primary/10 transition-all font-bold"
          >
            {user ? "Dashboard" : "Account"}
          </Link>
        </div>
      </div>
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
