import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, ShieldCheck, Eye, EyeOff, ArrowRight, Chrome } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import { sendConfirmationEmail } from '../lib/email';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signIn, signInWithEmail, user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate('/invest/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await signInWithEmail(email, password);
      
      // Dispatch Secure Login Notification
      await sendConfirmationEmail(email, 'login');

      // Auth listener in App will handle navigation
    } catch (err: any) {
      console.error("Login error:", err);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('Invalid access credentials. Protocol rejected.');
      } else if (err.code === 'auth/operation-not-allowed') {
        setError('Authentication protocol disabled. Contact system administrator.');
      } else {
        setError('Authorization failure. Secure tunnel timeout.');
      }
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);
    try {
      await signIn();
    } catch (err: any) {
      console.error("Google login error:", err);
      setError('Google synchronization failed. Please ensure popups are permitted.');
      setLoading(false);
    }
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
            <h1 className="text-3xl font-light tracking-tight mb-2 uppercase">Authenticate <span className="font-bold text-gradient">Vault.</span></h1>
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
                <label className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.2em] block ml-1">Universal ID</label>
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
                <label className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.2em] block ml-1">Secure Phrase</label>
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

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-white text-black font-bold uppercase tracking-[0.2em] text-[10px] rounded hover:bg-brand-primary transition-all active:scale-95 shadow-xl flex items-center justify-center gap-2 group disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : 'Verify Access'}
              {!loading && <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />}
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-white/5"></span>
              </div>
              <div className="relative flex justify-center text-[8px] uppercase font-mono tracking-widest">
                <span className="bg-black px-4 text-slate-600">Secondary Method</span>
              </div>
            </div>

            <button 
              type="button"
              onClick={handleGoogleSignIn}
              className="w-full py-4 bg-white/5 border border-white/10 text-white font-bold uppercase tracking-[0.2em] text-[10px] rounded hover:bg-white/10 transition-all active:scale-95 flex items-center justify-center gap-3 group"
            >
              <Chrome className="h-4 w-4" />
              Sign in with Google
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-white/5 text-center flex flex-col gap-3">
            <Link to="/invest/forgot-password" title="Forgot Access Phrase?" className="text-[9px] text-slate-600 uppercase tracking-widest hover:text-white transition-colors">Forgot Access Phrase?</Link>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest">
              New User? <Link to="/invest/signup" className="text-white hover:text-brand-primary transition-colors font-bold">Initialize Vault</Link>
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
