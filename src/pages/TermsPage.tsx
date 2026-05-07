import React from 'react';
import { motion } from 'motion/react';
import { FileText, Gavel, Scale, AlertCircle } from 'lucide-react';

const TermsPage = () => {
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
                <Gavel className="h-6 w-6 text-brand-primary" />
             </div>
             <h1 className="text-4xl md:text-5xl font-light tracking-tighter uppercase whitespace-nowrap">
                Terms <span className="font-bold">of Service</span>
             </h1>
          </div>
          <p className="text-slate-500 font-mono text-[10px] uppercase tracking-[0.4em]">
             LEGAL FRAMEWORK // TERMS OF ACCESS REVISION 1.9
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid gap-12"
        >
          <section className="bg-white/5 border border-white/10 p-8 rounded-2xl relative overflow-hidden group hover:border-brand-primary/30 transition-colors">
            <h2 className="text-xl font-bold uppercase tracking-widest text-white mb-6 flex items-center gap-3">
              <span className="h-1 w-8 bg-brand-primary rounded-full"></span>
              Acceptance of Terms
            </h2>
            <div className="space-y-6 text-slate-400 font-light leading-relaxed">
              <p>
                By accessing the SpaceXAI terminal, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
              </p>
            </div>
          </section>

          <section className="p-8 border-l-2 border-brand-primary/20">
            <h2 className="text-xl font-bold uppercase tracking-widest text-white mb-6 flex items-center gap-3">
              <Scale className="h-5 w-5 text-brand-primary" />
              Use License
            </h2>
            <p className="text-slate-400 font-light leading-relaxed">
              Permission is granted to temporarily download one copy of the materials (information or software) on SpaceXAI's website for personal, non-commercial transitory viewing only.
            </p>
          </section>

          <section className="bg-white/5 border border-white/10 p-8 rounded-2xl">
            <h2 className="text-xl font-bold uppercase tracking-widest text-white mb-6 flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-brand-primary" />
              Disclaimer
            </h2>
            <p className="text-slate-400 font-light leading-relaxed">
              The materials on SpaceXAI's website are provided on an 'as is' basis. SpaceXAI makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
            </p>
          </section>
        </motion.div>
      </div>
    </div>
  );
};

export default TermsPage;
