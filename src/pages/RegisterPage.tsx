import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, UserPlus, Eye, EyeOff, ArrowRight, ShieldCheck, Chrome } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [investmentTier, setInvestmentTier] = useState('0 - 1000');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const navigate = useNavigate();
  const { signIn, signUp, user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate('/invest/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!termsAccepted) {
      setError('You must accept the Quantum Encryption Standards.');
      return;
    }
    setError(null);
    setLoading(true);
    
    try {
      await signUp(email, password, firstName, investmentTier);
      
      // Dispatch Confirmation Email via backend API
      try {
        await fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: email,
            subject: 'Account Initialization Success | SpaceX Asset Vault',
            html: `
              <div style="font-family: monospace; padding: 40px; background: #000; color: #fff; border: 1px solid #1e3a8a;">
                <h1 style="color: #3b82f6; font-size: 24px; text-transform: uppercase; letter-spacing: 0.2em;">SpaceX Protocol</h1>
                <p style="color: #64748b; font-size: 12px; text-transform: uppercase;">Identity: ${firstName}</p>
                <div style="border-top: 1px solid #1e1e1e; margin: 20px 0; padding-top: 20px;">
                  <p>Your institutional vault has been successfully initialized.</p>
                  <p>Investment Tier: <strong>${investmentTier} USD</strong></p>
                  <p style="color: #64748b; font-size: 10px;">Security Hash: ${Math.random().toString(36).substring(7).toUpperCase()}</p>
                </div>
                <p style="font-size: 10px; color: #334155;">This is an automated dispatch. Do not reply.</p>
              </div>
            `
          })
        });
      } catch (emailErr) {
        console.warn("Email dispatch failed, but registration succeeded:", emailErr);
      }

      // Auth listener in App will handle navigation
    } catch (err: any) {
      console.error("Registration error:", err);
      if (err.code === 'auth/email-already-in-use') {
        setError('This universal ID is already registered in our database.');
      } else if (err.code === 'auth/weak-password') {
        setError('Access phrase must be at least 6 characters.');
      } else if (err.code === 'auth/operation-not-allowed') {
        setError('Registration protocol disabled. Contact system administrator.');
      } else {
        setError('Registration failure. Encryption tunnel error.');
      }
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    await signIn();
  };

  return (
    <div className="pt-24 min-h-screen flex items-center justify-center bg-tech-grid bg-fixed pb-20">
      <div className="absolute inset-0 tech-grid opacity-10 pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full px-6 relative z-10"
      >
        <div className="card-panel p-10 rounded-3xl relative overflow-hidden backdrop-blur-2xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl pointer-events-none" />
          
          <div className="text-center mb-10">
            <div className="w-12 h-12 bg-gradient-to-tr from-blue-500 to-cyan-300 rounded-sm rotate-45 flex items-center justify-center mx-auto mb-6">
              <div className="w-6 h-6 bg-black rounded-sm"></div>
            </div>
            <h1 className="text-3xl font-light tracking-tight mb-2 uppercase">Create <span className="font-bold text-gradient">Vault.</span></h1>
            <p className="text-slate-500 text-xs font-mono uppercase tracking-widest">SpaceX Access Protocol</p>
          </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-3 bg-red-500/10 border border-red-500/20 rounded text-[9px] text-red-500 uppercase tracking-widest text-center font-mono"
              >
                {error}
              </motion.div>
            )}
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.2em] block ml-1">Legal First Name</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <UserPlus className="h-4 w-4 text-slate-600 transition-colors group-focus-within:text-brand-primary" />
                  </div>
                  <input 
                    type="text" 
                    placeholder="E.g. Ifeanyi"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full bg-black border border-white/10 rounded-lg py-4 pl-12 pr-4 text-white placeholder:text-slate-800 focus:border-brand-primary/50 transition-all outline-none font-mono text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.2em] block ml-1">Investment Tier ($)</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <ShieldCheck className="h-4 w-4 text-slate-600 transition-colors group-focus-within:text-brand-primary" />
                  </div>
                  <select 
                    required
                    value={investmentTier}
                    onChange={(e) => setInvestmentTier(e.target.value)}
                    className="w-full bg-black border border-white/10 rounded-lg py-4 pl-12 pr-4 text-white appearance-none focus:border-brand-primary/50 transition-all outline-none font-mono text-sm"
                  >
                    <option value="0 - 1000">0 - 1,000</option>
                    <option value="1000 - 10000">1,000 - 10,000</option>
                    <option value="10000 - 50000">10,000 - 50,000</option>
                    <option value="50000 - 100000">50,000 - 100,000</option>
                    <option value="100000+">100,000+</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.2em] block ml-1">Universal ID (Email)</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-slate-600 transition-colors group-focus-within:text-brand-primary" />
                  </div>
                  <input 
                    type="email" 
                    placeholder="name@spacex-access.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-black border border-white/10 rounded-lg py-4 pl-12 pr-4 text-white placeholder:text-slate-800 focus:border-brand-primary/50 transition-all outline-none font-mono text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.2em] block ml-1">Access Phrase (Password)</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-slate-600 transition-colors group-focus-within:text-brand-primary" />
                  </div>
                  <input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="••••••••••••"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-black border border-white/10 rounded-lg py-4 pl-12 pr-12 text-white placeholder:text-slate-800 focus:border-brand-primary/50 transition-all outline-none font-mono text-sm"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-600 hover:text-slate-400 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 py-2">
              <input 
                type="checkbox" 
                id="terms" 
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="w-4 h-4 mt-0.5 rounded border-white/10 bg-black accent-brand-primary" 
              />
              <label htmlFor="terms" className="text-[9px] text-slate-500 leading-relaxed uppercase tracking-widest">
                I agree to the <a href="#" className="text-slate-300 hover:text-brand-primary underline">Quantum Encryption Standards</a> & Access Terms.
              </label>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-white text-black font-bold uppercase tracking-[0.2em] text-[10px] rounded hover:bg-brand-primary transition-all active:scale-95 shadow-xl flex items-center justify-center gap-2 group disabled:opacity-50"
            >
              {loading ? 'Processing Protocol...' : 'Initialize Account'}
              {!loading && <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />}
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-white/5"></span>
              </div>
              <div className="relative flex justify-center text-[8px] uppercase font-mono tracking-widest">
                <span className="bg-black px-4 text-slate-600">Secure Protocol</span>
              </div>
            </div>

            <button 
              type="button"
              onClick={handleGoogleSignIn}
              className="w-full py-4 bg-white/5 border border-white/10 text-white font-bold uppercase tracking-[0.2em] text-[10px] rounded hover:bg-white/10 transition-all active:scale-95 flex items-center justify-center gap-3 group"
            >
              <Chrome className="h-4 w-4" />
              Sign up with Google
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-white/5 text-center">
            <p className="text-[10px] text-slate-500 uppercase tracking-widest">
              Existing user? <Link to="/invest/login" className="text-white hover:text-brand-primary transition-colors font-bold">Authenticate Vault</Link>
            </p>
          </div>
        </div>

        <div className="mt-8 flex items-center gap-4 justify-center">
          <ShieldCheck className="h-4 w-4 text-slate-600" />
          <span className="text-[9px] font-mono text-slate-600 uppercase tracking-[0.2em]">AES-256 Multi-Layer Encryption Enabled</span>
        </div>
      </motion.div>
    </div>
  );
}
