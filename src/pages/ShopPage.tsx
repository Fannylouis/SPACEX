import React from 'react';
import { motion } from 'motion/react';
import { ShoppingBag, Zap, Gauge, Battery, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';

const cars = [
  {
    name: "Model S Plaid",
    tagline: "Beyond Ludicrous.",
    specs: { acceleration: "1.99s", range: "396mi", topSpeed: "200mph" },
    price: "From $89,990",
    image: "https://images.unsplash.com/photo-1620803134941-9885174872c6?auto=format&fit=crop&q=80&w=800",
    color: "#3b82f6"
  },
  {
    name: "Cybertruck",
    tagline: "Built for any planet.",
    specs: { acceleration: "2.6s", range: "340mi", towing: "11,000 lbs" },
    price: "From $79,990",
    image: "https://images.unsplash.com/photo-1619330030584-3746a5b67271?auto=format&fit=crop&q=80&w=800",
    color: "#94a3b8"
  },
  {
    name: "Model X Plaid",
    tagline: "The SUV of the future.",
    specs: { acceleration: "2.5s", range: "335mi", doors: "Falcon Wing" },
    price: "From $94,990",
    image: "https://images.unsplash.com/photo-1526626607727-41777107c71a?auto=format&fit=crop&q=80&w=800",
    color: "#9333ea"
  },
  {
    name: "Model 3 Performance",
    tagline: "Designed for performance.",
    specs: { acceleration: "2.9s", range: "303mi", topSpeed: "163mph" },
    price: "From $54,990",
    image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&q=80&w=800",
    color: "#ef4444"
  },
  {
    name: "Model Y",
    tagline: "The world's best-selling car.",
    specs: { acceleration: "3.5s", range: "320mi", storage: "76 cu ft" },
    price: "From $44,990",
    image: "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&q=80&w=800",
    color: "#1d4ed8"
  },
  {
    name: "Roadster (SpaceX Package)",
    tagline: "Apex of speed. Rocket thrusters.",
    specs: { acceleration: "1.1s*", range: "620mi", topSpeed: "250mph+" },
    price: "Reservations Open",
    image: "https://images.unsplash.com/photo-1549413247-4952003d15b0?auto=format&fit=crop&q=80&w=800",
    color: "#dc2626"
  },
  {
    name: "Tesla Semi",
    tagline: "The future of heavy transport.",
    specs: { acceleration: "20s", range: "500mi", payload: "82,000 lbs" },
    price: "Fleet Inquiries",
    image: "https://images.unsplash.com/photo-1612461879032-4299b007f3cc?auto=format&fit=crop&q=80&w=800",
    color: "#334155"
  },
  {
    name: "Dragon 2 (Crew Transport)",
    tagline: "LEO access for the elite.",
    specs: { acceleration: "3.2g", range: "Orbit", payload: "7 Passengers" },
    price: "Contract Base",
    image: "https://images.unsplash.com/photo-1517976487492-5750f3195933?auto=format&fit=crop&q=80&w=800",
    color: "#ffffff"
  },
  {
    name: "Starship (Lunar Edition)",
    tagline: "Mars is next.",
    specs: { acceleration: "Max-G", range: "Interplanetary", payload: "100 Tons" },
    price: "Contact SpaceX",
    image: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&q=80&w=800",
    color: "#cbd5e1"
  }
];

export default function ShopPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleOrder = async (car: any) => {
    if (!user) {
      navigate('/invest/login');
      return;
    }

    try {
      await addDoc(collection(db, 'orders'), {
        userId: user.uid,
        name: car.name,
        price: car.price,
        image: car.image,
        stats: car.specs,
        status: 'In Production',
        orderDate: serverTimestamp()
      });
      navigate('/invest/dashboard?tab=orders');
    } catch (error) {
      console.error("Error creating order:", error);
      alert("Failed to create order. Please try again.");
    }
  };

  return (
    <div className="pt-24 min-h-screen">
      <section className="py-16 border-b border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 tech-grid opacity-10 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-12 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 mb-6"
          >
            <div className="p-2 bg-brand-primary/10 rounded border border-brand-primary/20">
              <ShoppingBag className="h-5 w-5 text-brand-primary" />
            </div>
            <span className="text-[10px] font-mono font-bold tracking-[0.3em] uppercase text-brand-primary">Fleet Inventory</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl font-light tracking-tight mb-4"
          >
            Tesla <span className="font-bold text-gradient">Collection.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 text-lg max-w-2xl font-display"
          >
            Configure and secure your position in the electric revolution. Real-time availability for the world's most advanced mobility infrastructure.
          </motion.p>
        </div>
      </section>

      <section className="py-24 max-w-7xl mx-auto px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {cars.map((car, index) => (
            <motion.div
              key={car.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="card-panel group overflow-hidden flex flex-col h-full rounded-2xl relative"
            >
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={car.image} 
                  alt={car.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 grayscale-[0.5] group-hover:grayscale-0"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-6 left-6">
                  <h3 className="text-3xl font-bold uppercase tracking-tight text-white mb-1">{car.name}</h3>
                  <p className="text-sm font-mono text-slate-300 italic">{car.tagline}</p>
                </div>
              </div>

              <div className="p-8 flex-grow">
                <div className="grid grid-cols-3 gap-4 mb-8">
                  <SpecItem icon={Zap} label="0-60" value={car.specs.acceleration} />
                  <SpecItem icon={Battery} label="Range" value={car.specs.range} />
                  <SpecItem icon={Gauge} label="Top Speed" value={car.specs.topSpeed || "Varies"} />
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-white/5">
                  <div>
                    <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-1">MSRP</p>
                    <p className="text-xl font-mono text-white tracking-tight">{car.price}</p>
                  </div>
                  <button 
                    onClick={() => handleOrder(car)}
                    className="px-6 py-3 bg-white text-black font-bold uppercase tracking-widest text-[10px] rounded hover:bg-brand-primary transition-all active:scale-95 flex items-center gap-2"
                  >
                    Order Now
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="py-20 max-w-7xl mx-auto px-12">
        <div className="card-panel p-12 flex flex-col md:flex-row items-center justify-between gap-8 bg-gradient-to-r from-brand-primary/5 to-transparent">
          <div>
            <h3 className="text-2xl font-bold mb-2">Fleet Solutions?</h3>
            <p className="text-slate-500 font-display">Specialized procurement for corporate entities and autonomous fleets.</p>
          </div>
          <button className="px-8 py-4 border border-white/10 text-white font-bold uppercase tracking-widest text-[10px] rounded hover:bg-white/5 transition-all whitespace-nowrap">
            Inquire Fleet
          </button>
        </div>
      </section>
    </div>
  );
}

function SpecItem({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-1">
        <Icon className="h-3 w-3 text-slate-500" />
        <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">{label}</span>
      </div>
      <p className="text-sm font-bold text-slate-200">{value}</p>
    </div>
  );
}
