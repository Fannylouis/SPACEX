import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, Zap, Gauge, Battery, ArrowRight, MapPin, ClipboardList, Wallet, X, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import { collection, addDoc, serverTimestamp, doc, updateDoc, increment } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';

const cars = [
  {
    name: "Model S Plaid",
    tagline: "Beyond Ludicrous.",
    description: "Model S Plaid has the lowest drag coefficient on Earth, featuring a revolutionary tri-motor powertrain with carbon-sleeved rotors. It delivers 1,020 horsepower consistently up to its 200 mph top speed.",
    specs: { acceleration: "1.99s", range: "359mi", topSpeed: "200mph", peakPower: "1,020 hp" },
    price: 89990,
    prefix: "From ",
    image: "https://69f5e78ba0be0e562863d717.imgix.net/PHOTO/MODEL%20S.jpg?w=800&h=450",
    color: "#ef4444"
  },
  {
    name: "Cybertruck",
    tagline: "Built for any planet.",
    description: "Constructed from Ultra-Hard 30X Cold-Rolled stainless-steel, the Cybertruck is an armored personnel carrier for the civilian world. Features 11,000 lbs towing capacity and Extract Mode ground clearance.",
    specs: { acceleration: "2.6s", range: "340mi", towing: "11,000 lbs", clearance: "17\"" },
    price: 79990,
    prefix: "From ",
    image: "https://69f5e78ba0be0e562863d717.imgix.net/PHOTO/awd-cybertruck.jpg?w=800&h=450",
    color: "#94a3b8"
  },
  {
    name: "Model X Plaid",
    tagline: "The SUV of the future.",
    description: "With the most storage space and towing capacity of any electric SUV, and the highest performance, Model X Plaid is the ultimate family vehicle. Features signature Falcon Wing doors for easy access.",
    specs: { acceleration: "2.5s", range: "326mi", doors: "Falcon Wing", storage: "88 cu ft" },
    price: 94990,
    prefix: "From ",
    image: "https://69f5e78ba0be0e562863d717.imgix.net/PLAID/download.jpg?w=800&h=450",
    color: "#9333ea"
  },
  {
    name: "Model 3 Performance",
    tagline: "Designed for performance.",
    description: "The Model 3 Performance features a bespoke performance-tuned chassis, forged wheels, and high-performance brakes. Track Mode V3 allows for customized power split and regenerative braking.",
    specs: { acceleration: "2.9s", range: "303mi", topSpeed: "163mph", drive: "AWD" },
    price: 54990,
    prefix: "From ",
    image: "https://69f5e78ba0be0e562863d717.imgix.net/PHOTO/2025_tesla_model-3_sedan_performance_fq_oem_1_815.avif?w=800&h=450",
    color: "#ef4444"
  },
  {
    name: "Roadster",
    tagline: "Apex of speed. Rocket thrusters.",
    description: "The quickest car in the world, with record-setting acceleration, range and performance. Developed with SpaceX Cold Gas Thruster technology to achieve sub-2.0s acceleration and extreme cornering physics.",
    specs: { acceleration: "1.1s*", range: "620mi", topSpeed: "250mph+", torque: "10,000 Nm" },
    price: 250000,
    suffix: " (Reservation)",
    image: "https://69f5e78ba0be0e562863d717.imgix.net/PHOTO/Tesla-Model-Roadster-2-P4.webp?w=800&h=450",
    color: "#dc2626"
  },
  {
    name: "Tesla Semi",
    tagline: "The future of heavy transport.",
    description: "Semi is equipped with a tri-motor system and independent motors on the rear axles for unparalleled traction and efficiency. Fully loaded, it reaches 60 mph in 20 seconds with sub-2 kWh/mi energy consumption.",
    specs: { acceleration: "5s (Empty)", range: "500mi", payload: "82,000 lbs", motors: "Tri-Motor" },
    price: 150000,
    suffix: " (Inquiry)",
    image: "https://69f5e78ba0be0e562863d717.imgix.net/PHOTO/tesla-semi-standard-range-production-version-4.avif?w=800&h=450",
    color: "#334155"
  }
];

export default function ShopPage() {
  const navigate = useNavigate();
  const { user, userData } = useAuth();
  const { formatPrice } = useCurrency();
  const [selectedCar, setSelectedCar] = React.useState<any>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = React.useState(false);
  const [deliveryInfo, setDeliveryInfo] = React.useState({ address: '', details: '' });
  const [isProcessing, setIsProcessing] = React.useState(false);

  const handleOrder = (car: any) => {
    if (!user) {
      navigate('/invest/login');
      return;
    }

    const price = car.price;
    const balance = userData?.balance || 0;

    if (balance < price) {
      // Not enough money
      navigate('/invest/dashboard?tab=deposit');
      return;
    }

    setSelectedCar(car);
    setIsCheckoutOpen(true);
  };

  const handleFinalizeOrder = async () => {
    if (!user || !selectedCar || !deliveryInfo.address) return;

    setIsProcessing(true);
    const price = selectedCar.price;

    try {
      // 1. Create order
      await addDoc(collection(db, 'orders'), {
        userId: user.uid,
        name: selectedCar.name,
        price: selectedCar.price,
        image: selectedCar.image,
        stats: selectedCar.specs,
        status: 'In Production',
        deliveryAddress: deliveryInfo.address,
        additionalNotes: deliveryInfo.details,
        orderDate: serverTimestamp()
      });

      // 2. Deduct balance
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        balance: increment(-price)
      });

      // 3. Record transaction
      await addDoc(collection(db, 'transactions'), {
        userId: user.uid,
        type: 'Purchase',
        amount: price,
        method: 'Wallet Balance',
        status: 'Completed',
        reference: `FLT-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        date: serverTimestamp()
      });

      setIsCheckoutOpen(false);
      navigate('/invest/dashboard?tab=orders');
    } catch (error) {
      console.error("Error finalizing purchase:", error);
      handleFirestoreError(error, OperationType.WRITE, 'orders/transactions');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="pt-24 min-h-screen">
      <AnimatePresence>
        {isCheckoutOpen && selectedCar && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isProcessing && setIsCheckoutOpen(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row"
            >
              {/* Fleet Intel Sidebar */}
              <div className="md:w-64 bg-black/40 border-r border-white/5 p-8 flex flex-col pt-12">
                <div className="mb-10">
                  <div className="text-[8px] font-mono text-brand-primary uppercase tracking-[0.3em] font-bold mb-3 flex items-center gap-2">
                    <Zap className="h-2 w-2" /> Asset Specifications
                  </div>
                  <h3 className="text-2xl font-bold uppercase tracking-tight text-white leading-none">{selectedCar.name}</h3>
                  <div className="h-1 w-8 bg-brand-primary mt-4" />
                </div>

                <div className="space-y-8 flex-grow">
                  {Object.entries(selectedCar.specs).map(([key, value]) => (
                    <div key={key} className="group">
                      <div className="text-[8px] font-mono text-slate-500 uppercase tracking-widest mb-1 transition-colors group-hover:text-brand-primary">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </div>
                      <div className="text-sm font-mono text-white font-bold tracking-tight">
                        {value as string}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-auto pt-8">
                   <div className="p-4 bg-brand-primary/5 border border-brand-primary/20 rounded-xl relative overflow-hidden group">
                      <div className="absolute inset-0 bg-brand-primary/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                      <p className="text-[8px] font-mono text-slate-400 leading-relaxed uppercase tracking-tight relative z-10">
                        // SECURE UPLINK ESTABLISHED. AUTO-PILOT V12 READY FOR MISSION PARAMETERS.
                      </p>
                   </div>
                </div>
              </div>

              {/* Main Checkout Form */}
              <div className="flex-grow p-8 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-brand-primary/10 rounded-lg">
                      <ShoppingBag className="h-5 w-5 text-brand-primary" />
                    </div>
                    <h2 className="text-xl font-bold uppercase tracking-widest font-mono">Procurement</h2>
                  </div>
                  <button 
                    disabled={isProcessing}
                    onClick={() => setIsCheckoutOpen(false)}
                    className="p-2 hover:bg-white/5 rounded-full transition-colors disabled:opacity-0"
                  >
                    <X className="h-5 w-5 text-slate-500" />
                  </button>
                </div>

                <div className="mb-8 p-6 bg-white/5 rounded-2xl border border-white/5">
                  <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest leading-relaxed mb-4">
                    {selectedCar.description}
                  </p>
                  <img 
                    src={selectedCar.image} 
                    alt={selectedCar.name} 
                    className="w-full h-32 object-cover rounded-xl grayscale opacity-50 mb-4"
                  />
                  <div className="flex justify-between items-end">
                    <div>
                      <h3 className="text-lg font-bold text-white uppercase tracking-tight">{selectedCar.name}</h3>
                      <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Unit Price</p>
                    </div>
                    <p className="text-2xl font-mono text-brand-primary font-bold">{selectedCar.prefix || ''}{formatPrice(selectedCar.price)}{selectedCar.suffix || ''}</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[9px] font-mono text-slate-500 uppercase tracking-widest flex items-center gap-2">
                      <MapPin className="h-3 w-3" /> Delivery Destination
                    </label>
                    <input 
                      type="text"
                      required
                      placeholder="Street Address, City, State, ZIP"
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-4 text-white font-mono text-xs focus:border-brand-primary/50 transition-all outline-none"
                      value={deliveryInfo.address}
                      onChange={(e) => setDeliveryInfo({...deliveryInfo, address: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[9px] font-mono text-slate-500 uppercase tracking-widest flex items-center gap-2">
                      <ClipboardList className="h-3 w-3" /> Configuration Notes
                    </label>
                    <textarea 
                      placeholder="Interior preferences, specialized delivery instructions, etc."
                      rows={3}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-4 text-white font-mono text-xs focus:border-brand-primary/50 transition-all outline-none resize-none"
                      value={deliveryInfo.details}
                      onChange={(e) => setDeliveryInfo({...deliveryInfo, details: e.target.value})}
                    />
                  </div>
                </div>

                <div className="mt-10 p-6 bg-brand-primary/5 border border-brand-primary/20 rounded-2xl flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-1">Available Resources</p>
                    <div className="flex items-center gap-2">
                      <Wallet className="h-4 w-4 text-brand-primary" />
                      <span className="text-xl font-mono text-white font-bold">{formatPrice(userData?.balance || 0)}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-1">Transaction Total</p>
                    <p className="text-xl font-mono text-white font-bold">-{formatPrice(selectedCar.price)}</p>
                  </div>
                </div>

                <button 
                  disabled={!deliveryInfo.address || isProcessing}
                  onClick={handleFinalizeOrder}
                  className="w-full mt-8 py-5 bg-white text-black font-bold uppercase tracking-[0.2em] text-[10px] rounded-xl hover:bg-brand-primary transition-all active:scale-[0.98] disabled:opacity-20 flex items-center justify-center gap-3"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Authorizing Protocol...
                    </>
                  ) : (
                    <>Initialize Secure Procurement</>
                  )}
                </button>
                
                <p className="text-center mt-6 text-[8px] font-mono text-slate-600 uppercase tracking-[0.2em]">
                  By authorizing, you agree to the Interplanetary Delivery Protocols.
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
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
                    <p className="text-xl font-mono text-white tracking-tight">{car.prefix || ''}{formatPrice(car.price)}{car.suffix || ''}</p>
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
