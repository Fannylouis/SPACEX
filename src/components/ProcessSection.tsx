import React from 'react';
import { motion } from 'motion/react';
import { UserCheck, FileText, CreditCard, PieChart } from 'lucide-react';

const steps = [
  {
    title: "Verification",
    desc: "Submit accreditation proof to join our private marketplace.",
    icon: UserCheck
  },
  {
    title: "Selection",
    desc: "Browse current SpaceX/xAI lots and available tranches.",
    icon: PieChart
  },
  {
    title: "Subscription",
    desc: "Execute digital SPV subscription docs and legal filings.",
    icon: FileText
  },
  {
    title: "Settlement",
    desc: "Fund your allocation via secure wire transfer.",
    icon: CreditCard
  }
];

export default function ProcessSection() {
  return (
    <section className="py-24 bg-black/40" id="process">
      <div className="max-w-7xl mx-auto px-12">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-4xl font-light mb-6 tracking-[0.2em] uppercase">THE NEXUS <span className="font-bold">PROTOCOL.</span></h2>
          <div className="h-[1px] w-32 bg-brand-primary mx-auto mb-6"></div>
          <p className="text-slate-500 font-mono text-xs leading-relaxed tracking-[0.3em] uppercase">
            TRANSPARENCY • SECURITY • VELOCITY
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative p-8 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all group"
            >
              <div className="mb-8 relative flex items-center justify-center w-16 h-16">
                <div className="absolute inset-0 bg-brand-primary/5 rounded-xl rotate-6 group-hover:rotate-12 transition-transform" />
                <div className="absolute inset-0 border border-white/10 rounded-xl" />
                <step.icon className="h-6 w-6 text-brand-primary" />
                <div className="absolute -top-2 -right-2 w-6 h-6 rounded border border-white/10 bg-bg-dark flex items-center justify-center text-[8px] font-mono font-bold text-slate-500">
                  {index + 1}
                </div>
              </div>
              <h3 className="text-lg font-bold mb-3 uppercase tracking-wider">{step.title}</h3>
              <p className="text-slate-500 text-xs leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
