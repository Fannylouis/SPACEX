import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Wallet, 
  PieChart, 
  Activity, 
  ShieldCheck, 
  History, 
  ArrowDownCircle, 
  ArrowUpCircle, 
  Bitcoin, 
  Zap, 
  Briefcase, 
  ShoppingBag, 
  CreditCard, 
  UserRoundCheck, 
  ReceiptText, 
  Settings, 
  LogOut,
  ChevronRight,
  Building2,
  Landmark,
  ArrowRight,
  Menu,
  X
} from 'lucide-react';
import { AnimatePresence } from 'motion/react';
import { useAuth, auth } from '../context/AuthContext';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  orderBy, 
  addDoc, 
  serverTimestamp,
  doc,
  updateDoc,
  increment
} from 'firebase/firestore';
import { db } from '../lib/firebase';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(errInfo.error);
}

const sidebarItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, category: 'Main' },
  { id: 'deposit', label: 'Deposit', icon: ArrowDownCircle, category: 'Financial' },
  { id: 'withdraw', label: 'Withdraw', icon: ArrowUpCircle, category: 'Financial' },
  { id: 'buy-crypto', label: 'Buy Crypto', icon: Bitcoin, category: 'Financial' },
  { id: 'subscribe', label: 'Subscribe to Plan', icon: Zap, category: 'AI Intel' },
  { id: 'my-plans', label: 'My Plans', icon: History, category: 'AI Intel' },
  { id: 'my-projects', label: 'My Projects', icon: Briefcase, category: 'Assets' },
  { id: 'orders', label: 'Orders', icon: ShoppingBag, category: 'Assets' },
  { id: 'membership', label: 'Membership Card', icon: CreditCard, category: 'Assets' },
  { id: 'kyc', label: 'KYC', icon: UserRoundCheck, category: 'Protocol' },
  { id: 'transactions', label: 'Transactions', icon: ReceiptText, category: 'Protocol' },
  { id: 'settings', label: 'Settings', icon: Settings, category: 'Protocol' },
];

const aiPlans = [
  { id: 'starter', name: 'Starter', price: '$49', desc: 'Essential market intel for emerging investors.', color: 'text-slate-400', border: 'border-white/10' },
  { id: 'growth', name: 'Growth', price: '$199', desc: 'Priority access to high-demand secondary tranches.', color: 'text-brand-primary', border: 'border-brand-primary/20 bg-brand-primary/5' },
  { id: 'elite', name: 'Elite', price: '$499', desc: 'Direct desk access and concierge-level allocation.', color: 'text-purple-400', border: 'border-purple-400/20 bg-purple-400/5' },
];

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user, userData, logout, loading: authLoading } = useAuth();
  
  const [activeTab, setActiveTab] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('tab') || 'dashboard';
  });
  
  const [transactions, setTransactions] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate('/invest/login');
      return;
    }

    // Listen for transactions
    const txQuery = query(
      collection(db, 'transactions'),
      where('userId', '==', user.uid),
      orderBy('date', 'desc')
    );
    const unsubTx = onSnapshot(txQuery, (snap) => {
      setTransactions(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    // Listen for orders
    const orderQuery = query(
      collection(db, 'orders'),
      where('userId', '==', user.uid),
      orderBy('orderDate', 'desc')
    );
    const unsubOrders = onSnapshot(orderQuery, (snap) => {
      setOrders(snap.docs.map(doc => ({ orderId: doc.id, ...doc.data() })));
    });

    setFetching(false);

    return () => {
      unsubTx();
      unsubOrders();
    };
  }, [user]);

  // Deposit States
  const [depositStep, setDepositStep] = useState(1);
  const [depositAmount, setDepositAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showBankInstructions, setShowBankInstructions] = useState(false);

  const cryptoAssets = [
    { id: 'btc', name: 'Bitcoin', ticker: 'BTC', address: 'bc1qsa53wd67cxgm3nd7epum68ajdd6w7s8wkfdatj' },
    { id: 'eth', name: 'Ethereum', ticker: 'ETH', address: '0xb01eD053938D65c13B817592F3Ac42C551ca2686' },
    { id: 'usdt', name: 'USDT', ticker: 'USDT (ERC20)', address: '0xb01eD053938D65c13B817592F3Ac42C551ca2686' },
    { id: 'sol', name: 'Solana', ticker: 'SOL', address: 'EZ9T1Jsuqt7Y5p8BpCRtN9KZV9qKBXkwexbCkDdhuqYm' },
    { id: 'doge', name: 'Dogecoin', ticker: 'DOGE', address: 'DSTmUe2ZupEfPpsZtgpNbUqrHUAdXgTxe1' },
    { id: 'ltc', name: 'Litecoin', ticker: 'LTC', address: 'ltc1qjx0uklf29m4yc87wqek3a23v8q0dcfe543dzz2' },
    { id: 'trx', name: 'Tron', ticker: 'TRX', address: 'THihpgigHGEC8NjZAqN8R7wf4CWnwZomvT' },
  ];

  const selectedCrypto = cryptoAssets.find(c => c.id === paymentMethod);

  // Withdraw States
  const [withdrawStep, setWithdrawStep] = useState(1);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawMethod, setWithdrawMethod] = useState('');
  const [withdrawAddress, setWithdrawAddress] = useState('');
  const [bankDetails, setBankDetails] = useState({ name: '', routing: '', account: '' });

  const recordTransaction = async (type: string, amount: number, method: string) => {
    if (!user) return;

    try {
      // Add transaction record
      await addDoc(collection(db, 'transactions'), {
        userId: user.uid,
        type: type,
        amount: amount,
        method: method,
        status: 'Completed',
        date: serverTimestamp()
      });

      // Update user balance
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        balance: increment(type === 'Deposit' ? amount : -amount)
      });
    } catch (error: any) {
      if (error.code === 'permission-denied') {
        handleFirestoreError(error, OperationType.WRITE, 'transactions/users');
      }
      console.error("Error recording transaction:", error);
    }
  };

  // KYC States
  const [kycStep, setKycStep] = useState(1);
  const [kycForm, setKycForm] = useState({
    firstName: userData?.firstName || '',
    lastName: '',
    dob: '',
    idNumber: '',
    idType: 'passport'
  });
  const [kycLoading, setKycLoading] = useState(false);
  const [kycSuccess, setKycSuccess] = useState(false);

  const handleKycSubmit = async () => {
    if (!user) return;
    setKycLoading(true);
    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        kycStatus: 'Pending',
        identityInfo: {
          ...kycForm,
          submittedAt: serverTimestamp()
        }
      });
      setKycSuccess(true);
    } catch (error: any) {
      if (error.code === 'permission-denied') {
        handleFirestoreError(error, OperationType.UPDATE, `users/${user.uid}`);
      }
      console.error("KYC Submission error:", error);
    } finally {
      setKycLoading(false);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'deposit':
        return (
          <div className="py-8 max-w-2xl">
            <h2 className="text-3xl font-light uppercase tracking-tight mb-4">Capital <span className="font-bold text-gradient">Injection.</span></h2>
            <p className="text-slate-500 font-mono text-[10px] uppercase tracking-widest mb-12 leading-relaxed">
              Initialize a secure transfer into your investment vault.
            </p>

            <div className="space-y-8">
              {/* Step Tracking */}
              <div className="flex gap-4 mb-8">
                {[1, 2, 3].map((step) => (
                  <div 
                    key={step} 
                    className={`h-1 flex-grow rounded-full transition-all duration-500 ${depositStep >= step ? 'bg-brand-primary' : 'bg-white/10'}`} 
                  />
                ))}
              </div>

              {depositStep === 1 && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="card-panel p-10"
                >
                  <label className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.3em] block mb-6">Enter Allocation Amount (USD)</label>
                  <div className="relative">
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-mono text-slate-600">$</span>
                    <input 
                      type="number"
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-12 py-8 text-4xl font-mono text-white focus:outline-none focus:border-brand-primary/50 transition-all placeholder:text-white/5"
                    />
                  </div>
                  <p className="mt-6 text-[9px] font-mono text-slate-600 uppercase tracking-widest leading-relaxed">
                    Minimum deposit: $1,000. Institutional limits apply for unverified accounts.
                  </p>
                  <button 
                    disabled={!depositAmount || parseFloat(depositAmount) < 1000}
                    onClick={() => setDepositStep(2)}
                    className="w-full mt-10 py-5 bg-white text-black font-bold uppercase tracking-[0.2em] text-[10px] rounded-xl hover:bg-brand-primary transition-all disabled:opacity-20 disabled:hover:bg-white"
                  >
                    Select Payment Method
                  </button>
                </motion.div>
              )}

              {depositStep === 2 && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block mb-2">Select Settlement Asset</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {cryptoAssets.map((crypto) => (
                      <button 
                        key={crypto.id}
                        onClick={() => setPaymentMethod(crypto.id)}
                        className={`card-panel p-6 text-left transition-all border-2 ${paymentMethod === crypto.id ? 'border-brand-primary bg-brand-primary/5' : 'border-white/5 bg-white/[0.02] hover:bg-white/[0.05]'}`}
                      >
                        <div className="flex justify-between items-start mb-4">
                          <Bitcoin className={`h-6 w-6 ${paymentMethod === crypto.id ? 'text-brand-primary' : 'text-slate-600'}`} />
                          <span className="text-[8px] font-mono text-slate-500 uppercase">{crypto.ticker}</span>
                        </div>
                        <h4 className="text-[10px] font-bold uppercase tracking-widest">{crypto.name}</h4>
                      </button>
                    ))}
                    
                    <button 
                      onClick={() => setPaymentMethod('bank')}
                      className={`card-panel p-6 text-left transition-all border-2 col-span-full ${paymentMethod === 'bank' ? 'border-brand-primary bg-brand-primary/5' : 'border-white/5 bg-white/[0.02] hover:bg-white/[0.05]'}`}
                    >
                      <div className="flex items-center gap-4">
                        <Building2 className={`h-6 w-6 ${paymentMethod === 'bank' ? 'text-brand-primary' : 'text-slate-600'}`} />
                        <div>
                          <h4 className="text-[10px] font-bold uppercase tracking-widest mb-0.5">Bank Transfer (Wire/ACH)</h4>
                          <p className="text-[8px] font-mono text-slate-500 uppercase tracking-widest">Global Settlement Support</p>
                        </div>
                      </div>
                    </button>
                  </div>

                  <div className="flex gap-4 mt-12">
                    <button 
                      onClick={() => setDepositStep(1)}
                      className="flex-grow py-5 border border-white/10 text-white font-bold uppercase tracking-[0.2em] text-[10px] rounded-xl hover:bg-white/5 transition-all"
                    >
                      Back
                    </button>
                    <button 
                      disabled={!paymentMethod}
                      onClick={() => {
                        const methodLabel = paymentMethod === 'bank' ? 'Bank Transfer' : selectedCrypto?.name || 'Crypto';
                        recordTransaction('Deposit', parseFloat(depositAmount), methodLabel);
                        setDepositStep(3);
                      }}
                      className="flex-[2] py-5 bg-white text-black font-bold uppercase tracking-[0.2em] text-[10px] rounded-xl hover:bg-brand-primary transition-all disabled:opacity-20"
                    >
                      Confirm Selection
                    </button>
                  </div>
                </motion.div>
              )}

              {depositStep === 3 && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="card-panel p-10 text-center"
                >
                  <div className="w-20 h-20 bg-brand-primary/10 rounded-full flex items-center justify-center mx-auto mb-8">
                    {paymentMethod !== 'bank' ? <Bitcoin className="h-10 w-10 text-brand-primary" /> : <ShieldCheck className="h-10 w-10 text-brand-primary" />}
                  </div>
                  <h3 className="text-xl font-bold uppercase tracking-widest mb-4">
                    {paymentMethod !== 'bank' ? `Awaiting ${selectedCrypto?.ticker} Transfer` : 'Verification Initiated'}
                  </h3>
                  <p className="text-slate-500 font-mono text-[10px] uppercase tracking-widest leading-relaxed mb-8">
                    Transfer instruction for <span className="text-white">${parseFloat(depositAmount).toLocaleString()}</span> via <span className="text-white">{(selectedCrypto?.name || paymentMethod).toUpperCase()}</span> generated. <br />
                    {paymentMethod !== 'bank' ? 'Complete the manual transfer to the secure address below.' : 'Check your secure inbox for routing credentials.'}
                  </p>

                  {paymentMethod === 'bank' && (
                    <div className="mb-8">
                      <button 
                        onClick={() => setShowBankInstructions(true)}
                        className="w-full flex items-center justify-between p-6 bg-brand-primary/5 border border-brand-primary/20 rounded-xl group hover:border-brand-primary/40 transition-all"
                      >
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-brand-primary/10 rounded-lg">
                            <ReceiptText className="h-5 w-5 text-brand-primary" />
                          </div>
                          <div className="text-left">
                            <h4 className="text-[10px] font-bold uppercase tracking-widest text-white">View Secure Instructions</h4>
                            <p className="text-[8px] font-mono text-slate-500 uppercase">Bank Account & Routing Details</p>
                          </div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-brand-primary group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  )}

                  {paymentMethod !== 'bank' && selectedCrypto && (
                    <div className="p-8 bg-black/40 border border-brand-primary/20 rounded-2xl text-left mb-8 relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-4 opacity-5">
                         <Bitcoin className="h-20 w-20 text-white" />
                      </div>
                      <label className="text-[9px] font-mono text-brand-primary uppercase tracking-widest block mb-4">{selectedCrypto.name} Secure Destination</label>
                      <div className="flex items-center gap-4 bg-white/5 p-4 rounded-lg border border-white/5">
                        <code className="text-[10px] font-mono text-white break-all flex-grow font-bold">{selectedCrypto.address}</code>
                        <button 
                          onClick={() => {
                            navigator.clipboard.writeText(selectedCrypto.address);
                          }}
                          className="px-3 py-2 bg-white/10 hover:bg-white/20 rounded text-[8px] font-mono text-white uppercase tracking-widest transition-all"
                        >
                          Copy
                        </button>
                      </div>
                      <p className="mt-4 text-[8px] font-mono text-slate-600 uppercase leading-relaxed text-center">
                        Funds will be credited to your vault after network confirmations. Ensure you use the correct network for {selectedCrypto.name}.
                      </p>
                    </div>
                  )}

                  <div className="p-6 bg-white/[0.02] border border-white/5 rounded-xl text-left mb-8">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-[9px] font-mono text-slate-500 uppercase">Ref ID</span>
                      <span className="text-[10px] font-mono text-white">#NX-{Math.random().toString(36).substring(7).toUpperCase()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] font-mono text-slate-500 uppercase">Network Status</span>
                      <span className="text-[9px] font-mono text-emerald-500 uppercase font-bold">Encrypted / Active</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                        setDepositStep(1);
                        setDepositAmount('');
                        setPaymentMethod('');
                        setActiveTab('dashboard');
                    }}
                    className="w-full py-5 bg-brand-primary text-black font-bold uppercase tracking-[0.2em] text-[10px] rounded-xl hover:bg-white transition-all"
                  >
                    Return to Console
                  </button>
                </motion.div>
              )}
            </div>
          </div>
        );
      case 'withdraw':
        return (
          <div className="py-8 max-w-2xl">
            <h2 className="text-3xl font-light uppercase tracking-tight mb-4">Capital <span className="font-bold text-gradient">Extraction.</span></h2>
            <p className="text-slate-500 font-mono text-[10px] uppercase tracking-widest mb-12 leading-relaxed">
              Liquidate assets and transfer to your designated external account.
            </p>

            <div className="space-y-8">
               <div className="flex gap-4 mb-8">
                {[1, 2, 3].map((step) => (
                  <div 
                    key={step} 
                    className={`h-1 flex-grow rounded-full transition-all duration-500 ${withdrawStep >= step ? 'bg-brand-primary' : 'bg-white/10'}`} 
                  />
                ))}
              </div>

              {withdrawStep === 1 && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card-panel p-10">
                  <div className="flex justify-between items-center mb-6">
                    <label className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.3em]">Withdrawal Amount</label>
                    <span className="text-[9px] font-mono text-slate-600 uppercase">Balance: ${(userData?.balance || 0).toLocaleString()}</span>
                  </div>
                  <div className="relative">
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-mono text-slate-600">$</span>
                    <input 
                      type="number"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-12 py-8 text-4xl font-mono text-white focus:outline-none focus:border-brand-primary/50 transition-all"
                    />
                  </div>
                  <button 
                    disabled={!withdrawAmount || parseFloat(withdrawAmount) <= 0 || parseFloat(withdrawAmount) > (userData?.balance || 0)}
                    onClick={() => setWithdrawStep(2)}
                    className="w-full mt-10 py-5 bg-white text-black font-bold uppercase tracking-[0.2em] text-[10px] rounded-xl hover:bg-brand-primary transition-all disabled:opacity-20"
                  >
                    Set Destination
                  </button>
                </motion.div>
              )}

              {withdrawStep === 2 && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <button 
                      onClick={() => setWithdrawMethod('crypto')}
                      className={`card-panel p-6 text-left transition-all border-2 ${withdrawMethod === 'crypto' ? 'border-brand-primary bg-brand-primary/5' : 'border-white/5 bg-white/[0.02]'}`}
                    >
                      <Bitcoin className="h-6 w-6 mb-3 text-slate-600" />
                      <h4 className="text-[10px] font-bold uppercase tracking-widest">Crypto Wallet</h4>
                    </button>
                    <button 
                      onClick={() => setWithdrawMethod('bank')}
                      className={`card-panel p-6 text-left transition-all border-2 ${withdrawMethod === 'bank' ? 'border-brand-primary bg-brand-primary/5' : 'border-white/5 bg-white/[0.02]'}`}
                    >
                      <Building2 className="h-6 w-6 mb-3 text-slate-600" />
                      <h4 className="text-[10px] font-bold uppercase tracking-widest">Bank Account</h4>
                    </button>
                  </div>

                  {withdrawMethod === 'crypto' && (
                    <div className="card-panel p-8 space-y-4">
                      <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">External Wallet Address (USDC/ETH/BTC)</label>
                      <input 
                        type="text"
                        value={withdrawAddress}
                        onChange={(e) => setWithdrawAddress(e.target.value)}
                        placeholder="0x..."
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-4 text-xs font-mono text-white focus:outline-none focus:border-brand-primary/50"
                      />
                    </div>
                  )}

                  {withdrawMethod === 'bank' && (
                    <div className="card-panel p-8 space-y-4">
                      <div className="grid gap-4">
                        <input 
                          type="text" 
                          placeholder="Bank Name" 
                          value={bankDetails.name}
                          onChange={(e) => setBankDetails({...bankDetails, name: e.target.value})}
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-4 text-xs font-mono text-white focus:outline-none focus:border-brand-primary/50"
                        />
                        <input 
                          type="text" 
                          placeholder="Routing Number" 
                          value={bankDetails.routing}
                          onChange={(e) => setBankDetails({...bankDetails, routing: e.target.value})}
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-4 text-xs font-mono text-white focus:outline-none focus:border-brand-primary/50"
                        />
                        <input 
                          type="text" 
                          placeholder="Account Number" 
                          value={bankDetails.account}
                          onChange={(e) => setBankDetails({...bankDetails, account: e.target.value})}
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-4 text-xs font-mono text-white focus:outline-none focus:border-brand-primary/50"
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex gap-4">
                    <button onClick={() => setWithdrawStep(1)} className="flex-grow py-5 border border-white/10 text-white font-bold uppercase tracking-[0.2em] text-[10px] rounded-xl">Back</button>
                    <button 
                      disabled={!withdrawMethod || (withdrawMethod === 'crypto' && !withdrawAddress) || (withdrawMethod === 'bank' && (!bankDetails.name || !bankDetails.account))}
                      onClick={() => {
                        recordTransaction('Withdraw', parseFloat(withdrawAmount), withdrawMethod);
                        setWithdrawStep(3);
                      }}
                      className="flex-[2] py-5 bg-white text-black font-bold uppercase tracking-[0.2em] text-[10px] rounded-xl hover:bg-brand-primary transition-all disabled:opacity-20"
                    >
                      Confirm Withdrawal
                    </button>
                  </div>
                </motion.div>
              )}

              {withdrawStep === 3 && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="card-panel p-10 text-center">
                   <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-8">
                    <Activity className="h-10 w-10 text-emerald-500" />
                  </div>
                  <h3 className="text-xl font-bold uppercase tracking-widest mb-4">Transaction Pending</h3>
                  <p className="text-slate-500 font-mono text-[10px] uppercase tracking-widest leading-relaxed mb-8">
                    A withdrawal of <span className="text-white">${parseFloat(withdrawAmount).toLocaleString()}</span> has been broadcasted. <br />
                    Assets are now in mid-flight and subject to network confirmation.
                  </p>
                  <button 
                    onClick={() => {
                        setWithdrawStep(1);
                        setWithdrawAmount('');
                        setWithdrawMethod('');
                        setWithdrawAddress('');
                        setBankDetails({ name: '', routing: '', account: '' });
                        setActiveTab('dashboard');
                    }}
                    className="w-full py-5 bg-white text-black font-bold uppercase tracking-[0.2em] text-[10px] rounded-xl hover:bg-brand-primary transition-all"
                  >
                    View Status in Ledger
                  </button>
                </motion.div>
              )}
            </div>
          </div>
        );
      case 'orders':
        return (
          <div className="py-8">
            <h2 className="text-3xl font-light uppercase tracking-tight mb-4">Fleet <span className="font-bold text-gradient">Inventory.</span></h2>
            <p className="text-slate-500 font-mono text-[10px] uppercase tracking-widest mb-12 leading-relaxed">
              Real-time build status and logistics for your Tesla vehicle acquisitions.
            </p>

            {orders.length === 0 ? (
              <div className="card-panel p-20 flex flex-col items-center justify-center text-center">
                <ShoppingBag className="h-12 w-12 text-slate-700 mb-6" />
                <h4 className="text-sm font-bold uppercase tracking-widest mb-2">No Active Orders</h4>
                <p className="text-[10px] text-slate-500 font-mono uppercase tracking-[0.2em] mb-8">Your fleet inventory is currently empty.</p>
                <Link to="/shop" className="px-8 py-4 bg-white text-black font-bold uppercase tracking-widest text-[9px] rounded hover:bg-brand-primary transition-all">
                  Browse Inventory
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {orders.map((order: any) => (
                  <div key={order.orderId} className="card-panel p-8 bg-white/[0.01] hover:bg-white/[0.02] transition-all group overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-64 h-full bg-cover bg-center opacity-10 group-hover:scale-110 group-hover:opacity-20 transition-all grayscale" style={{ backgroundImage: `url(${order.image})` }} />
                    <div className="relative z-10 flex flex-col md:flex-row justify-between gap-8">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                           <h3 className="text-xl font-bold uppercase tracking-tight">{order.name}</h3>
                           <span className="px-2 py-0.5 bg-brand-primary/10 text-brand-primary border border-brand-primary/20 rounded text-[8px] font-mono uppercase tracking-widest">{order.status}</span>
                        </div>
                        <p className="text-[9px] font-mono text-slate-500 uppercase tracking-widest mb-6">Order ID: {order.orderId} • {order.orderDate?.toDate ? order.orderDate.toDate().toLocaleDateString() : new Date(order.orderDate).toLocaleDateString()}</p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                           <div>
                              <span className="text-[8px] font-mono text-slate-600 uppercase block mb-1">MSRP</span>
                              <span className="text-sm text-white font-mono">{order.price}</span>
                           </div>
                           <div>
                              <span className="text-[8px] font-mono text-slate-600 uppercase block mb-1">Acceleration</span>
                              <span className="text-sm text-slate-300 font-mono">{order.stats?.acceleration || order.stats?.accel}</span>
                           </div>
                           <div>
                              <span className="text-[8px] font-mono text-slate-600 uppercase block mb-1">Top Speed</span>
                              <span className="text-sm text-slate-300 font-mono">{order.stats?.topSpeed || order.stats?.speed || 'N/A'}</span>
                           </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col justify-between items-end">
                         <div className="text-right">
                            <span className="text-[8px] font-mono text-slate-600 uppercase block mb-1">Build Progress</span>
                            <div className="w-32 h-1.5 bg-white/10 rounded-full overflow-hidden">
                               <div className="h-full bg-emerald-500 w-1/4 animate-pulse" />
                            </div>
                         </div>
                         <button className="text-[9px] font-mono text-slate-500 uppercase tracking-widest hover:text-white flex items-center gap-2 group/btn">
                           Manage Configuration <ArrowRight className="h-3 w-3 group-hover/btn:translate-x-1 transition-transform" />
                         </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      case 'dashboard':
        return (
          <>
            {/* Market Ticker */}
            <div className="relative w-full h-8 bg-black/40 border-y border-white/5 overflow-hidden mb-8 -mx-8 md:-mx-12 px-8 md:px-12">
              <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
              <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />
              
              <motion.div 
                animate={{ x: ["0%", "-50%"] }}
                transition={{ 
                  duration: 40, 
                  repeat: Infinity, 
                  ease: "linear" 
                }}
                className="flex items-center gap-12 whitespace-nowrap h-full pr-12 w-fit"
              >
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="flex items-center gap-12">
                    {[
                      { name: 'Bitcoin', ticker: 'BTC', price: '$64,120.50', change: '+1.24%', up: true },
                      { name: 'Ethereum', ticker: 'ETH', price: '$3,450.12', change: '-0.45%', up: false },
                      { name: 'Solana', ticker: 'SOL', price: '$145.67', change: '+5.32%', up: true },
                      { name: 'SpaceX', ticker: 'SPX', exposure: '$210.4B', change: '+12.5%', up: true },
                      { name: 'xAI', ticker: 'XAI', exposure: '$24.1B', change: '+45.2%', up: true },
                      { name: 'Neuralink', ticker: 'NLNK', exposure: '$8.2B', change: '+2.1%', up: true },
                      { name: 'Starlink', ticker: 'SLNK', exposure: '$95.0B', change: '+8.4%', up: true },
                      { name: 'Tesla', ticker: 'TSLA', price: '$175.24', change: '-1.2%', up: false },
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-wider">
                        <span className="text-slate-500 font-bold">{item.ticker}</span>
                        <span className="text-white">{item.price || item.exposure}</span>
                        <span className={item.up ? "text-emerald-500" : "text-rose-500"}>
                          {item.change}
                        </span>
                        <div className="w-1 h-1 bg-white/10 rounded-full mx-2" />
                      </div>
                    ))}
                  </div>
                ))}
              </motion.div>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
              <div>
                <h1 className="text-4xl font-light tracking-tight mb-2 uppercase">
                  {userData?.firstName || 'Investor'}'s <span className="font-bold text-gradient">Dashboard.</span>
                </h1>
                <p className="font-mono text-[10px] text-slate-500 uppercase tracking-[0.3em]">SECURE ACCESS SESSION: ACTIVE</p>
              </div>
              <div className="flex gap-4">
                <div className="px-6 py-4 card-panel bg-white/5 border-white/10 rounded-xl">
                  <span className="text-[9px] font-mono text-slate-500 uppercase block mb-1">Portfolio Value</span>
                  <span className="text-2xl font-mono text-white">${(userData?.balance || 0).toLocaleString()} <span className="text-sm text-slate-600">USD</span></span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <ExposureCard 
                name="SpaceX" 
                ticker="SPX-24" 
                valuation="$210B" 
                change="+12.4%" 
                status="High Liquidity"
              />
              <ExposureCard 
                name="xAI" 
                ticker="XAI-II" 
                valuation="$24B" 
                change="+45.2%" 
                status="Restricted"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                  <DashCard title="Asset Allocation" icon={PieChart} value="0" sub="Positions Active" />
                  <DashCard title="Vehicle Orders" icon={ShoppingBag} value={orders.length.toString()} sub="Units Reserved" />
                  <DashCard title="Pending Tranches" icon={Activity} value={transactions.filter(t => t.status === 'Pending').length.toString()} sub="Under Review" />
                </div>
                
                <div className="card-panel p-8">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="font-bold uppercase tracking-[0.2em] text-xs font-mono">Recent Activity</h3>
                    <History className="h-4 w-4 text-slate-500" />
                  </div>
                  
                  {transactions.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                      <div className="p-4 bg-white/5 rounded-full mb-4">
                        <ShieldCheck className="h-8 w-8 text-slate-700" />
                      </div>
                      <p className="text-slate-500 font-mono text-[10px] uppercase tracking-widest leading-relaxed">
                        No transaction history found. <br />
                        Initialize your first allocation in the marketplace.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {transactions.slice(0, 3).map((tx) => (
                        <div key={tx.id} className="flex items-center justify-between p-4 border border-white/5 rounded-xl bg-white/[0.01]">
                          <div className="flex items-center gap-4">
                            <div className={`p-2 rounded-lg ${tx.type === 'Deposit' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                              {tx.type === 'Deposit' ? <ArrowDownCircle className="h-4 w-4" /> : <ArrowUpCircle className="h-4 w-4" />}
                            </div>
                            <div>
                              <p className="text-[10px] font-bold uppercase tracking-widest">{tx.type} via {tx.method}</p>
                              <p className="text-[8px] font-mono text-slate-600 uppercase mt-0.5">{tx.id} • {tx.date?.toDate ? tx.date.toDate().toLocaleDateString() : new Date(tx.date).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <div className="text-right">
                             <p className={`text-xs font-mono font-bold ${tx.type === 'Deposit' ? 'text-emerald-500' : 'text-slate-300'}`}>
                               {tx.type === 'Deposit' ? '+' : '-'}${tx.amount.toLocaleString()}
                             </p>
                             <p className="text-[8px] font-mono text-slate-600 uppercase mt-0.5">{tx.status}</p>
                          </div>
                        </div>
                      ))}
                      <button onClick={() => setActiveTab('transactions')} className="w-full py-3 text-[9px] font-mono text-slate-500 uppercase tracking-widest hover:text-white transition-colors">
                        View Full Ledger
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Sidebar Info */}
              <div className="space-y-8">
                <div className="card-panel p-8 bg-gradient-to-br from-brand-primary/10 via-transparent to-transparent">
                  <h3 className="font-bold uppercase tracking-[0.2em] text-xs font-mono mb-6">Vault Security</h3>
                  <div className="space-y-4">
                    <SecurityItem label="KYC Verification" status="Pending" color="text-orange-500" />
                    <SecurityItem label="2FA Protocol" status="Disabled" color="text-slate-600" />
                    <SecurityItem label="Whitelist Wallet" status="Not Set" color="text-slate-600" />
                  </div>
                  <button className="w-full mt-8 py-3 bg-white text-black font-bold uppercase tracking-widest text-[9px] rounded hover:bg-brand-primary transition-all">
                    Update Security
                  </button>
                </div>
              </div>
            </div>
          </>
        );
      case 'subscribe':
        return (
          <div className="py-8">
            <h2 className="text-3xl font-light uppercase tracking-tight mb-12">Select <span className="font-bold text-gradient">AI Protocol.</span></h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {aiPlans.map(plan => (
                <div key={plan.id} className={`card-panel p-8 flex flex-col h-full hover:scale-[1.02] transition-transform ${plan.border}`}>
                  <h4 className={`text-xl font-bold uppercase tracking-tighter mb-2 ${plan.color}`}>{plan.name}</h4>
                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-3xl font-mono">{plan.price}</span>
                    <span className="text-[10px] text-slate-600 uppercase font-mono">/ mo</span>
                  </div>
                  <p className="text-xs text-slate-500 mb-8 leading-relaxed">{plan.desc}</p>
                  <div className="flex-grow space-y-4 mb-10">
                    {['Priority Alerts', 'Sector Analysis', 'Exclusive Tranches'].map((f, i) => (
                      <div key={i} className="flex items-center gap-3 text-[10px] uppercase tracking-widest text-slate-400">
                        <Zap className="h-3 w-3 text-brand-primary" />
                        {f}
                      </div>
                    ))}
                  </div>
                  <button className="w-full py-4 bg-white/5 border border-white/10 rounded uppercase font-bold text-[9px] tracking-widest hover:bg-white hover:text-black transition-all">
                    Initialize Plan
                  </button>
                </div>
              ))}
            </div>
          </div>
        );
      case 'kyc':
        if (userData?.kycStatus === 'Verified') {
          return (
            <div className="py-8 max-w-2xl">
              <div className="card-panel p-12 text-center border-emerald-500/20 bg-emerald-500/5">
                <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-8">
                  <ShieldCheck className="h-10 w-10 text-emerald-500" />
                </div>
                <h2 className="text-3xl font-light uppercase tracking-tight mb-4">Identity <span className="font-bold text-gradient">Verified.</span></h2>
                <p className="text-emerald-500/60 font-mono text-[10px] uppercase tracking-widest mb-8 leading-relaxed">
                  Your access protocol has been fully authenticated. <br />
                  All institutional tranches and extraction limits have been lifted.
                </p>
                <div className="p-4 bg-black/40 border border-emerald-500/20 rounded-lg inline-block">
                  <span className="text-[9px] font-mono text-emerald-500 uppercase tracking-widest">Certificate ID: AES-{user?.uid.substring(0, 12).toUpperCase()}</span>
                </div>
              </div>
            </div>
          );
        }

        if (kycSuccess || userData?.kycStatus === 'Pending') {
          return (
            <div className="py-8 max-w-2xl">
              <div className="card-panel p-12 text-center border-orange-500/20 bg-orange-500/5">
                <div className="w-20 h-20 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-8">
                  <Activity className="h-10 w-10 text-orange-500 animate-pulse" />
                </div>
                <h2 className="text-3xl font-light uppercase tracking-tight mb-4">Review <span className="font-bold text-gradient">In Progress.</span></h2>
                <p className="text-orange-500/60 font-mono text-[10px] uppercase tracking-widest mb-8 leading-relaxed">
                  Your identity documents are currently undergoing algorithmic verification. <br />
                  Estimated processing time: 24-48 hours.
                </p>
                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: "30%" }}
                    animate={{ width: "65%" }}
                    transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                    className="h-full bg-orange-500"
                  />
                </div>
              </div>
            </div>
          );
        }

        return (
          <div className="py-8 max-w-2xl">
            <h2 className="text-3xl font-light uppercase tracking-tight mb-4">Verification <span className="font-bold text-gradient">Protocol.</span></h2>
            <p className="text-slate-500 font-mono text-[10px] uppercase tracking-widest mb-12 leading-relaxed">
              Required for institutional tranches. Ensure all details match your legal documentation exactly.
            </p>

            <div className="space-y-8">
              {/* Step Tracking */}
              <div className="flex gap-4 mb-12">
                {[1, 2].map((step) => (
                  <div 
                    key={step} 
                    className={`h-1 flex-grow rounded-full transition-all duration-500 ${kycStep >= step ? 'bg-brand-primary' : 'bg-white/10'}`} 
                  />
                ))}
              </div>

              {kycStep === 1 ? (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card-panel p-10 space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block ml-1">Legal First Name</label>
                      <input 
                        type="text"
                        value={kycForm.firstName}
                        onChange={(e) => setKycForm({...kycForm, firstName: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-primary transition-all font-mono"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block ml-1">Legal Last Name</label>
                      <input 
                        type="text"
                        value={kycForm.lastName}
                        onChange={(e) => setKycForm({...kycForm, lastName: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-primary transition-all font-mono"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block ml-1">Date of Birth</label>
                    <input 
                      type="date"
                      value={kycForm.dob}
                      onChange={(e) => setKycForm({...kycForm, dob: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-primary transition-all font-mono"
                    />
                  </div>

                  <button 
                    disabled={!kycForm.firstName || !kycForm.lastName || !kycForm.dob}
                    onClick={() => setKycStep(2)}
                    className="w-full py-5 bg-white text-black font-bold uppercase tracking-[0.2em] text-[10px] rounded-xl hover:bg-brand-primary transition-all disabled:opacity-20"
                  >
                    Continue to Documents
                  </button>
                </motion.div>
              ) : (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                  <div className="card-panel p-10 space-y-6">
                    <div className="space-y-2">
                      <label className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block ml-1">Document Type</label>
                      <select 
                        value={kycForm.idType}
                        onChange={(e) => setKycForm({...kycForm, idType: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-primary transition-all font-mono appearance-none"
                      >
                        <option value="passport">Passport</option>
                        <option value="dl">Driver's License</option>
                        <option value="id">National ID Card</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block ml-1">ID Serial Number</label>
                      <input 
                        type="text"
                        value={kycForm.idNumber}
                        placeholder="E.g. A12345678"
                        onChange={(e) => setKycForm({...kycForm, idNumber: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-primary transition-all font-mono"
                      />
                    </div>

                    <div className="card-panel p-8 border-dashed border-white/10 flex flex-col items-center justify-center text-center bg-white/[0.01]">
                      <UserRoundCheck className="h-8 w-8 text-slate-700 mb-4" />
                      <h5 className="text-[10px] font-bold uppercase tracking-widest mb-1 text-slate-400">Scan & Upload Document</h5>
                      <p className="text-[8px] font-mono text-slate-600 uppercase tracking-widest mb-6">High-resolution JPEG or PNG only</p>
                      <input type="file" className="hidden" id="kyc-upload-final" />
                      <label htmlFor="kyc-upload-final" className="px-6 py-3 border border-white/10 rounded text-[9px] font-mono uppercase tracking-widest text-slate-400 hover:bg-white hover:text-black cursor-pointer transition-all">
                        Select File
                      </label>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button onClick={() => setKycStep(1)} className="flex-grow py-5 border border-white/10 text-white font-bold uppercase tracking-[0.2em] text-[10px] rounded-xl hover:bg-white/5">Back</button>
                    <button 
                      disabled={!kycForm.idNumber || kycLoading}
                      onClick={handleKycSubmit}
                      className="flex-[2] py-5 bg-white text-black font-bold uppercase tracking-[0.2em] text-[10px] rounded-xl hover:bg-brand-primary transition-all disabled:opacity-20 flex items-center justify-center gap-2"
                    >
                      {kycLoading ? 'Encrypting Data...' : 'Submit for Review'}
                    </button>
                  </div>
                </motion.div>
              )}

              <div className="p-6 bg-white/[0.02] border border-white/5 rounded-xl">
                 <h5 className="text-[9px] font-mono text-slate-500 uppercase tracking-widest mb-4">Security Notice</h5>
                 <p className="text-[8px] font-mono text-slate-600 uppercase leading-relaxed">
                   Your data is encrypted using AES-256 and stored in a decentralized vault. We never share your documentation with third-party tranches without explicit cryptographic authorization.
                 </p>
              </div>
            </div>
          </div>
        );
      case 'transactions':
        return (
          <div className="py-8">
            <h2 className="text-3xl font-light uppercase tracking-tight mb-12">Financial <span className="font-bold text-gradient">Ledger.</span></h2>
            <div className="card-panel overflow-hidden">
              <table className="w-full text-left font-mono">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-[0.3em] text-slate-600">ID / Hash</th>
                    <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-[0.3em] text-slate-600">Type</th>
                    <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-[0.3em] text-slate-600">Amount</th>
                    <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-[0.3em] text-slate-600">Status</th>
                    <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-[0.3em] text-slate-600">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-8 py-20 text-center text-slate-600 text-[10px] uppercase tracking-widest italic">
                        No transactions recorded in current session.
                      </td>
                    </tr>
                  ) : (
                    transactions.map((tx) => (
                      <tr key={tx.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.01]">
                        <td className="px-8 py-6 text-xs text-slate-500 tracking-tighter uppercase">{tx.id}</td>
                        <td className="px-8 py-6">
                          <span className={`px-2 py-1 bg-white/5 border border-white/10 rounded text-[9px] uppercase tracking-widest ${tx.type === 'Deposit' ? 'text-emerald-500' : 'text-red-500'}`}>
                            {tx.type}
                          </span>
                        </td>
                        <td className="px-8 py-6 text-sm text-slate-300">${tx.amount.toLocaleString()}</td>
                        <td className="px-8 py-6 text-[10px] text-slate-600 uppercase italic">{tx.status}</td>
                        <td className="px-8 py-6 text-[10px] text-slate-600 uppercase font-mono">{tx.date?.toDate ? tx.date.toDate().toLocaleDateString() : new Date(tx.date).toLocaleDateString()}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        );
      default:
        return (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center">
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 mb-6">
              {sidebarItems.find(i => i.id === activeTab)?.icon({ className: "h-12 w-12 text-slate-700" })}
            </div>
            <h2 className="text-2xl font-light uppercase tracking-widest mb-4">{activeTab.replace('-', ' ')} <span className="font-bold">Protocol</span></h2>
            <p className="text-slate-500 font-mono text-xs uppercase tracking-[0.2em] max-w-sm">Access to this module requires verified KYC status and an active investment vault.</p>
            <button onClick={() => setActiveTab('kyc')} className="mt-8 px-8 py-4 border border-brand-primary/20 bg-brand-primary/5 text-brand-primary font-bold font-mono text-[10px] uppercase tracking-widest rounded hover:bg-brand-primary/10 transition-all">
              Submit Documents
            </button>
          </div>
        );
    }
  };

  if (authLoading || (user && fetching)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="w-8 h-8 border-2 border-brand-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="pt-24 min-h-screen flex bg-tech-grid relative overflow-x-hidden">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Dashboard Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 border-r border-white/5 bg-black/80 backdrop-blur-2xl lg:bg-black/20 lg:backdrop-blur-xl shrink-0 lg:flex flex-col lg:h-[calc(100vh-6rem)] lg:sticky lg:top-24 transition-transform duration-300 transform
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6 flex lg:hidden items-center justify-between mb-4 border-b border-white/5">
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-brand-primary">Console Menu</span>
          <button onClick={() => setIsSidebarOpen(false)} className="p-2 hover:bg-white/5 rounded-lg">
            <X className="h-5 w-5 text-slate-500" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-grow scrollbar-hide">
          <div className="space-y-8">
            {['Main', 'Financial', 'AI Intel', 'Assets', 'Protocol'].map((category) => (
              <div key={category} className="space-y-1">
                <h4 className="px-4 text-[9px] font-mono font-bold uppercase tracking-[0.3em] text-slate-600 mb-2">{category}</h4>
                {sidebarItems.filter(item => item.category === category).map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                        setActiveTab(item.id);
                        setIsSidebarOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-xs font-mono transition-all group ${
                      activeTab === item.id 
                        ? 'bg-brand-primary/10 text-brand-primary border border-brand-primary/20' 
                        : 'text-slate-500 hover:text-white hover:bg-white/5 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className={`h-4 w-4 ${activeTab === item.id ? 'text-brand-primary' : 'text-slate-600'}`} />
                      <span className="uppercase tracking-widest">{item.label}</span>
                    </div>
                    {activeTab === item.id && <ChevronRight className="h-3 w-3" />}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 border-t border-white/5">
          <button 
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-mono text-red-500 hover:bg-red-500/5 transition-all uppercase tracking-widest"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Console Viewport */}
      <div className="flex-grow">
        {/* Mobile Nav Header */}
        <div className="lg:hidden px-6 pt-8 flex items-center justify-between">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-3 bg-white/5 border border-white/10 rounded-xl flex items-center gap-3 text-slate-400"
          >
            <Menu className="h-5 w-5" />
            <span className="text-[10px] font-mono uppercase tracking-[0.2em]">Open Console</span>
          </button>
          
          <div className="text-right">
             <span className="text-[8px] font-mono text-slate-600 uppercase tracking-widest block">Vault Balance</span>
             <span className="text-lg font-mono text-white font-bold">${(userData?.balance || 0).toLocaleString()}</span>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 md:px-12 py-8 lg:py-12">
          {renderContent()}
        </div>
      </div>

      {/* Bank Transfer Instructions Modal */}
      <AnimatePresence>
        {showBankInstructions && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowBankInstructions(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-xl bg-black border border-white/10 rounded-2xl overflow-hidden shadow-2xl shadow-brand-primary/10"
            >
              <div className="h-1 bg-brand-primary" />
              <div className="p-8 md:p-12">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h2 className="text-2xl font-light uppercase tracking-tight mb-1 font-sans text-white">Transfer <span className="font-bold text-gradient">Instructions.</span></h2>
                    <p className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">Digital Dispatch // Reference: SX-TRF-{Math.random().toString(36).substring(7).toUpperCase()}</p>
                  </div>
                  <button 
                    onClick={() => setShowBankInstructions(false)}
                    className="p-2 hover:bg-white/5 rounded-full transition-colors"
                  >
                    <X className="h-5 w-5 text-slate-500" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="p-6 bg-white/[0.02] border border-white/5 rounded-xl">
                    <p className="text-[10px] font-mono text-slate-400 uppercase leading-relaxed mb-6">
                      User authenticated. Please dispatch the liquidation amount of <span className="text-white font-bold">${parseFloat(depositAmount).toLocaleString()}</span> to the institutional vault below. 
                      Ensure your <span className="text-brand-primary font-bold">First Name</span> is included in the transfer remarks for cryptographic matching.
                    </p>

                    <div className="space-y-4">
                      <BankDetailRow label="Bank Name" value="FIROE" />
                      <BankDetailRow label="Account Name" value="SPACEX" />
                      <BankDetailRow label="Account Number" value="220161217" />
                      <BankDetailRow label="Routing / Swift" value="FIROE-US-TX (Global) // 063000021" />
                      <BankDetailRow label="Bank Address" value="Institutional Vault, Houston, TX 77001, USA" />
                    </div>
                  </div>

                  <div className="p-4 bg-orange-500/5 border border-orange-500/20 rounded-lg flex items-start gap-3">
                    <Activity className="h-4 w-4 text-orange-500 mt-0.5" />
                    <p className="text-[8px] font-mono text-orange-500/80 uppercase leading-relaxed">
                      Settlement typically occurs within 1-3 algorithmic cycles (Business Days). You will receive a secure notification once liquidity is confirmed in your vault.
                    </p>
                  </div>

                  <button 
                    onClick={() => setShowBankInstructions(false)}
                    className="w-full py-4 bg-white text-black font-bold uppercase tracking-[0.2em] text-[10px] rounded hover:bg-brand-primary transition-all"
                  >
                    I have dispatched the transfer
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function BankDetailRow({ label, value }: { label: string, value: string }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
      <span className="text-[8px] font-mono text-slate-600 uppercase tracking-widest">{label}</span>
      <span className="text-[10px] font-mono text-white text-right">{value}</span>
    </div>
  );
}

function DashCard({ title, icon: Icon, value, sub }: { title: string; icon: any; value: string; sub: string }) {
  return (
    <div className="card-panel p-8 group hover:border-brand-primary/20 transition-all cursor-default">
      <div className="flex justify-between items-start mb-6">
        <Icon className="h-6 w-6 text-brand-primary" />
        <span className="text-[10px] text-slate-500 uppercase font-mono tracking-widest">{title}</span>
      </div>
      <div className="text-3xl font-mono text-white mb-1">{value}</div>
      <div className="text-[10px] font-mono text-slate-600 uppercase tracking-widest">{sub}</div>
    </div>
  );
}

function SecurityItem({ label, status, color }: { label: string; status: string; color: string }) {
  return (
    <div className="flex justify-between items-center text-[10px] font-mono uppercase tracking-widest">
      <span className="text-slate-500">{label}</span>
      <span className={color}>{status}</span>
    </div>
  );
}

function ExposureCard({ name, ticker, valuation, change, status }: { name: string; ticker: string; valuation: string; change: string; status: string }) {
  return (
    <div className="card-panel p-6 bg-white/[0.01] overflow-hidden relative group">
      <div className="absolute top-0 right-0 w-32 h-24 bg-brand-primary/5 blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div>
          <h4 className="text-xl font-bold tracking-tight text-white mb-1">{name}</h4>
          <span className="text-[9px] font-mono text-brand-primary px-2 py-0.5 bg-brand-primary/10 rounded uppercase tracking-widest">{ticker}</span>
        </div>
        <div className="text-right">
          <div className="text-emerald-400 text-sm font-mono font-bold">{change}</div>
          <div className="text-[8px] font-mono text-slate-600 uppercase tracking-widest">FY24 Delta</div>
        </div>
      </div>
      <div className="flex items-end justify-between relative z-10">
        <div>
          <span className="text-[9px] font-mono text-slate-600 uppercase tracking-[0.2em] block mb-1">Est. Valuation</span>
          <span className="text-2xl font-mono text-white tracking-tighter">{valuation}</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[8px] font-mono text-slate-600 uppercase tracking-[0.2em] mb-1">Market Status</span>
          <span className="text-[9px] font-mono text-white uppercase tracking-widest border border-white/10 px-2 py-0.5 rounded">{status}</span>
        </div>
      </div>
      <div className="mt-4 h-1 w-full bg-white/5 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: "65%" }}
          transition={{ duration: 1, delay: 0.5 }}
          className="h-full bg-brand-primary" 
        />
      </div>
    </div>
  );
}
