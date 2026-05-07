import React from 'react';
import { motion } from 'motion/react';
import { Shield, Lock, EyeOff, FileText } from 'lucide-react';

const PrivacyPage = () => {
  return (
    <div className="min-h-screen bg-black pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center gap-4 mb-6">
             <div className="p-3 bg-brand-primary/10 rounded-xl border border-brand-primary/20">
                <Shield className="h-6 w-6 text-brand-primary" />
             </div>
             <h1 className="text-4xl md:text-5xl font-light tracking-tighter uppercase whitespace-nowrap">
                Privacy <span className="font-bold">Policy</span>
             </h1>
          </div>
          <p className="text-slate-500 font-mono text-[10px] uppercase tracking-[0.4em]">
             SECURITY PROTOCOL // DATA PROTECTION ACT
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white/5 border border-white/10 p-8 md:p-12 rounded-3xl"
        >
          <div className="space-y-8 text-slate-300 font-light leading-relaxed">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white uppercase tracking-tight">Privacy Policy</h2>
              <p className="text-lg">
                Space XAI collects email addresses for authentication purposes only.
              </p>
              <p className="text-lg">
                We do not sell or share your data with third parties.
              </p>
            </div>
            
            <div className="pt-8 border-t border-white/5">
              <p className="text-[10px] font-mono text-slate-600 uppercase tracking-widest italic">
                End of Transmission.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PrivacyPage;
