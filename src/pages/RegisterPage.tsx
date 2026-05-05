import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, UserPlus, Eye, EyeOff, ArrowRight, ShieldCheck, Chrome, Calendar, Globe, Phone, Users } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';

import { sendConfirmationEmail } from '../lib/email';

export default function RegisterPage() {
  const { formatPrice } = useCurrency();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [country, setCountry] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('');
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

    // General Validation
    if (!firstName || !lastName || !dateOfBirth || !country || !phone || !gender || !email || !password) {
      setError('All synchronization parameters must be initialized.');
      return;
    }

    // Age Validation
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    if (age < 18) {
      setError('Access Denied: You must be at least 18 years of age to initialize a vault.');
      setLoading(false);
      return;
    }

    setError(null);
    setLoading(true);
    
    try {
      await signUp(email, password, firstName, lastName, dateOfBirth, country, phone, gender);
      
      // Dispatch Confirmation Email via utility
      await sendConfirmationEmail(email, 'signup', { firstName, lastName });

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
    setError(null);
    setLoading(true);
    try {
      await signIn();
      // Auth changes will trigger navigation automatically via user useEffect
    } catch (err: any) {
      console.error("Google login error:", err);
      if (err.code === 'auth/popup-blocked') {
        setError('Signup popup was blocked by your browser. Please allow popups for this site and try again.');
      } else if (err.code === 'auth/popup-closed-by-user') {
        setError('Signup attempt was cancelled. Please complete the sign-in process in the popup window.');
      } else if (err.code === 'auth/unauthorized-domain') {
        setError('This domain is not authorized for Google Sign-in. Please add this URL to your Firebase Console authorized domains.');
      } else if (err.code === 'auth/operation-not-allowed') {
        setError('Google Sign-in is not enabled in your Firebase Project. Please enable it in the Firebase Console.');
      } else {
        setError(`Google synchronization failed (${err.code || 'unknown'}). Please ensure popups are permitted and verify your internet connection.`);
      }
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
            <img src="https://69f5e78ba0be0e562863d717.imgix.net/pho/share.jpg?w=800&h=800&bg-remove=true" alt="SpaceX" className="h-80 mx-auto mb-8 object-contain brightness-125" referrerPolicy="no-referrer" />
            <h1 className="text-3xl font-light tracking-tight mb-2 uppercase">Create <span className="font-bold text-gradient">Vault.</span></h1>
            <p className="text-slate-500 text-xs font-mono uppercase tracking-widest">Access Protocol</p>
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
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.2em] block ml-1">First Name</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <UserPlus className="h-4 w-4 text-slate-600 transition-colors group-focus-within:text-brand-primary" />
                    </div>
                    <input 
                      type="text" 
                      placeholder="e.g. John"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full bg-black border border-white/10 rounded-lg py-4 pl-12 pr-4 text-white placeholder:text-slate-800 focus:border-brand-primary/50 transition-all outline-none font-mono text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.2em] block ml-1">Last Name</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <UserPlus className="h-4 w-4 text-slate-600 transition-colors group-focus-within:text-brand-primary" />
                    </div>
                    <input 
                      type="text" 
                      placeholder="e.g. Doe"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full bg-black border border-white/10 rounded-lg py-4 pl-12 pr-4 text-white placeholder:text-slate-800 focus:border-brand-primary/50 transition-all outline-none font-mono text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.2em] block ml-1">Date of Birth</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Calendar className="h-4 w-4 text-slate-600 transition-colors group-focus-within:text-brand-primary" />
                  </div>
                  <input 
                    type="date" 
                    required
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    className="w-full bg-black border border-white/10 rounded-lg py-4 pl-12 pr-4 text-white placeholder:text-slate-800 focus:border-brand-primary/50 transition-all outline-none font-mono text-sm [color-scheme:dark]"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.2em] block ml-1">Country</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Globe className="h-4 w-4 text-slate-600 transition-colors group-focus-within:text-brand-primary" />
                    </div>
                    <input 
                      type="text" 
                      placeholder="e.g. United States"
                      required
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full bg-black border border-white/10 rounded-lg py-4 pl-12 pr-4 text-white placeholder:text-slate-800 focus:border-brand-primary/50 transition-all outline-none font-mono text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.2em] block ml-1">Phone Number</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Phone className="h-4 w-4 text-slate-600 transition-colors group-focus-within:text-brand-primary" />
                    </div>
                    <input 
                      type="tel" 
                      placeholder="+1 (555) 000-0000"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-black border border-white/10 rounded-lg py-4 pl-12 pr-4 text-white placeholder:text-slate-800 focus:border-brand-primary/50 transition-all outline-none font-mono text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.2em] block ml-1">Gender</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Users className="h-4 w-4 text-slate-600 transition-colors group-focus-within:text-brand-primary" />
                    </div>
                    <select 
                      required
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="w-full bg-black border border-white/10 rounded-lg py-4 pl-12 pr-4 text-white appearance-none focus:border-brand-primary/50 transition-all outline-none font-mono text-sm"
                    >
                      <option value="" disabled className="text-slate-800">Select Gender</option>
                      <option value="Male" className="bg-slate-900">Male</option>
                      <option value="Female" className="bg-slate-900">Female</option>
                      <option value="Other" className="bg-slate-900">Other</option>
                      <option value="Prefer not to say" className="bg-slate-900">Prefer not to say</option>
                    </select>
                  </div>
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

          <div className="mt-8 pt-8 border-t border-white/5 text-center flex flex-col gap-3">
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
