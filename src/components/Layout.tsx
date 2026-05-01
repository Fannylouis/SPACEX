import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { motion, useScroll, useSpring } from 'motion/react';
import { Outlet } from 'react-router-dom';

export default function Layout() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div className="relative min-h-screen">
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-brand-primary z-[60] origin-left"
        style={{ scaleX }}
      />
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-brand-primary/5 to-transparent" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-brand-secondary/5 blur-[150px] rounded-full opacity-30" />
      </div>
    </div>
  );
}
