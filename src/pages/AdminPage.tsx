import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { collection, query, getDocs, doc, updateDoc, onSnapshot, where, increment, runTransaction, setDoc, deleteDoc, writeBatch } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import { Shield, ChevronRight, User, CheckCircle, XCircle, AlertCircle, Search, Filter, Calendar, Edit2, Save, X, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Timestamp } from 'firebase/firestore';

interface UserRecord {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  country?: string;
  phoneNumber?: string;
  balance: number;
  totalProfit?: number;
  kycStatus: string;
  password?: string;
  identityInfo?: {
    firstName: string;
    lastName: string;
    dob: string;
    idNumber: string;
    idType: string;
    submittedAt?: any;
  };
  createdAt: any;
}

export default function AdminPage() {
  const { user, loading: authLoading } = useAuth();
  const [activeView, setActiveView] = useState<'users' | 'deposits' | 'withdrawals' | 'investments'>('users');
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [deposits, setDeposits] = useState<any[]>([]);
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [investments, setInvestments] = useState<any[]>([]);
  const [adminList, setAdminList] = useState<string[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterKyc, setFilterKyc] = useState('All');
  const [selectedUser, setSelectedUser] = useState<UserRecord | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [editingDateId, setEditingDateId] = useState<string | null>(null);
  const [newDateValue, setNewDateValue] = useState<string>('');

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setIsAdmin(false);
      return;
    }

    // Hardcoded owner bootstrap
    if (user.email === 'mgbemere3@gmail.com') {
      setIsAdmin(true);
      return;
    }

    // Check admin status
    const adminRef = doc(db, 'admins', user.uid);
    const unsubAdmin = onSnapshot(adminRef, (doc) => {
      setIsAdmin(doc.exists());
    });

    return () => unsubAdmin();
  }, [user, authLoading]);

  useEffect(() => {
    if (isAdmin !== true) return;

    const usersQuery = query(collection(db, 'users'));
    const unsubUsers = onSnapshot(usersQuery, (snap) => {
      const uList = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as UserRecord));
      setUsers(uList);
    });

    const depositsQuery = query(
      collection(db, 'transactions'),
      where('type', '==', 'Deposit')
    );
    const unsubDeposits = onSnapshot(depositsQuery, (snap) => {
      const dList = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setDeposits(dList);
    });

    const withdrawalsQuery = query(
      collection(db, 'transactions'),
      where('type', '==', 'Withdrawal')
    );
    const unsubWithdrawals = onSnapshot(withdrawalsQuery, (snap) => {
      const wList = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setWithdrawals(wList);
    });

    const investmentsQuery = query(
      collection(db, 'transactions'),
      where('type', '==', 'Investment')
    );
    const unsubInvestments = onSnapshot(investmentsQuery, (snap) => {
      const iList = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setInvestments(iList);
      setDataLoading(false);
    });

    const adminsQuery = collection(db, 'admins');
    const unsubAdmins = onSnapshot(adminsQuery, (snap) => {
      setAdminList(snap.docs.map(doc => doc.id));
    });

    return () => {
      unsubUsers();
      unsubDeposits();
      unsubWithdrawals();
      unsubInvestments();
      unsubAdmins();
    };
  }, [isAdmin]);

  const handleUpdateKyc = async (userId: string, status: string) => {
    try {
      await updateDoc(doc(db, 'users', userId), { kycStatus: status });
    } catch (err) {
      console.error("Error updating KYC:", err);
    }
  };

  const handleApproveDeposit = async (deposit: any) => {
    try {
      await runTransaction(db, async (transaction) => {
        const txRef = doc(db, 'transactions', deposit.id);
        const userRef = doc(db, 'users', deposit.userId);
        
        const userDoc = await transaction.get(userRef);
        if (!userDoc.exists()) {
          throw new Error("User record not found");
        }

        transaction.update(txRef, { status: 'Completed' });
        transaction.update(userRef, { 
          balance: (userDoc.data().balance || 0) + deposit.amount 
        });
      });
    } catch (err) {
      console.error("Error approving deposit:", err);
    }
  };

  const handleRejectDeposit = async (depositId: string) => {
    try {
      await updateDoc(doc(db, 'transactions', depositId), { status: 'Rejected' });
    } catch (err) {
      console.error("Error rejecting deposit:", err);
    }
  };

  const handleApproveWithdrawal = async (withdraw: any) => {
    try {
      await updateDoc(doc(db, 'transactions', withdraw.id), { status: 'Completed' });
    } catch (err) {
      console.error("Error approving withdrawal:", err);
    }
  };

  const handleRejectWithdrawal = async (withdraw: any) => {
    try {
      await runTransaction(db, async (transaction) => {
        const txRef = doc(db, 'transactions', withdraw.id);
        const userRef = doc(db, 'users', withdraw.userId);
        
        const userDoc = await transaction.get(userRef);
        if (!userDoc.exists()) {
          throw new Error("User record not found");
        }

        // Refund the balance that was held
        transaction.update(txRef, { status: 'Rejected' });
        transaction.update(userRef, { 
          balance: (userDoc.data().balance || 0) + withdraw.amount 
        });
      });
    } catch (err) {
      console.error("Error rejecting withdrawal:", err);
    }
  };

  const handleApproveInvestment = async (invest: any) => {
    try {
      await updateDoc(doc(db, 'transactions', invest.id), { status: 'Completed' });
    } catch (err) {
      console.error("Error approving investment:", err);
    }
  };

  const handleRejectInvestment = async (invest: any) => {
    try {
      await runTransaction(db, async (transaction) => {
        const txRef = doc(db, 'transactions', invest.id);
        const userRef = doc(db, 'users', invest.userId);
        
        const userDoc = await transaction.get(userRef);
        if (!userDoc.exists()) {
          throw new Error("User record not found");
        }

        // Refund the balance that was deducted
        transaction.update(txRef, { status: 'Rejected' });
        transaction.update(userRef, { 
          balance: (userDoc.data().balance || 0) + invest.amount 
        });
      });
    } catch (err) {
      console.error("Error rejecting investment:", err);
    }
  };

  const handleReconstructBartholomewPortfolio = async (userId: string) => {
    if (!confirm("Are you sure you want to reconstruct the 2026 Q1 portfolio for this user? This will overwrite existing balance and add 27 transactions.")) return;
    
    try {
      await runTransaction(db, async (transaction) => {
        const userRef = doc(db, 'users', userId);
        const userDoc = await transaction.get(userRef);
        
        if (!userDoc.exists()) throw new Error("User not found");

        const transactionsRef = collection(db, 'transactions');
        
        // 1. Initial Deposit to reach $3,750 starting point
        const depositRef = doc(transactionsRef);
        transaction.set(depositRef, {
          userId,
          type: 'Deposit',
          amount: 3750,
          asset: 'Strategic Initial Capital',
          ticker: 'USD',
          status: 'Completed',
          date: Timestamp.fromDate(new Date('2026-01-01T09:00:00Z')),
          method: 'Portfolio Onboarding'
        });

        // 2. Generate 13 weeks of Weekly Yield & Fees (Jan - March)
        let currentDate = new Date('2026-01-09T12:00:00Z'); // Start first week in Jan
        for (let i = 0; i < 13; i++) {
          // Gross Profit
          const divRef = doc(transactionsRef);
          transaction.set(divRef, {
            userId,
            type: 'Dividend',
            amount: 3500,
            asset: 'Weekly Gross Profit Yield',
            ticker: 'DIV',
            status: 'Completed',
            date: Timestamp.fromDate(new Date(currentDate)),
            method: 'Automated Credit'
          });

          // Fee
          const feeRef = doc(transactionsRef);
          transaction.set(feeRef, {
            userId,
            type: 'Service Charge',
            amount: 75,
            asset: 'Account Maintenance Fee',
            ticker: 'FEE',
            status: 'Completed',
            date: Timestamp.fromDate(new Date(currentDate.getTime() + 1000)),
            method: 'Automated Debit'
          });

          currentDate.setDate(currentDate.getDate() + 7);
        }

        // 3. SpaceX IPO Transaction on April 1
        const investRef = doc(transactionsRef);
        transaction.set(investRef, {
          userId,
          type: 'Investment',
          amount: 28017.50,
          asset: 'SpaceX IPO Allocation',
          ticker: 'SPACE',
          status: 'Completed',
          date: Timestamp.fromDate(new Date('2026-04-01T14:30:00Z')),
          method: 'Direct Entry'
        });
        
        // 4. Set final metrics
        // Metrics based on user prompt:
        // Available Balance: $20,257.50
        // Total Profit (Gross): $3,500 * 13 = $45,500
        transaction.update(userRef, { 
          balance: 20257.50,
          totalProfit: 45500.00
        });
      });
      alert("John Bartholomew Q1 Portfolio reconstructed successfully.");
    } catch (err) {
      console.error(err);
      alert("Failed to reconstruct portfolio: " + (err instanceof Error ? err.message : "Internal Error"));
    }
  };

  const toggleAdminStatus = async (userId: string) => {
    const isAdminUser = adminList.includes(userId);
    try {
      if (isAdminUser) {
        // Don't let current user demote themselves easily?
        if (userId === user?.uid) {
           if (!window.confirm("Are you sure you want to remove your own admin privileges? You will lose access to this portal.")) {
             return;
           }
        }
        await deleteDoc(doc(db, 'admins', userId));
      } else {
        await setDoc(doc(db, 'admins', userId), { 
          addedBy: user?.uid,
          addedAt: new Date()
        });
      }
    } catch (err) {
      console.error("Error toggling admin status:", err);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm("CRITICAL: Are you sure you want to PERMANENTLY DELETE this user account? This action cannot be undone and will remove all their financial data from the records.")) return;
    
    console.log("Starting deletion for user:", userId);
    try {
      const batch = writeBatch(db);
      
      // 1. Queue associated transactions for deletion
      const txQuery = query(collection(db, 'transactions'), where('userId', '==', userId));
      const txSnap = await getDocs(txQuery);
      console.log(`Found ${txSnap.size} transactions to delete`);
      txSnap.docs.forEach(doc => batch.delete(doc.ref));

      // 2. Queue associated orders for deletion
      const orderQuery = query(collection(db, 'orders'), where('userId', '==', userId));
      const orderSnap = await getDocs(orderQuery);
      console.log(`Found ${orderSnap.size} orders to delete`);
      orderSnap.docs.forEach(doc => batch.delete(doc.ref));

      // 3. Queue admin status for deletion
      batch.delete(doc(db, 'admins', userId));

      // 4. Queue user document for deletion
      batch.delete(doc(db, 'users', userId));
      
      // Execute all deletions atomically
      await batch.commit();
      console.log("Batch deletion committed successfully");
      
      if (selectedUser?.id === userId) {
        setSelectedUser(null);
      }
      
      alert("User account and associated data purged successfully.");
    } catch (err) {
      console.error("Error deleting user:", err);
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      alert("Failed to delete user: " + errorMessage);
    }
  };

  const handleUpdateDate = async (txId: string) => {
    if (!newDateValue) return;
    try {
      const selectedDate = new Date(newDateValue);
      await updateDoc(doc(db, 'transactions', txId), { 
        date: Timestamp.fromDate(selectedDate) 
      });
      setEditingDateId(null);
      setNewDateValue('');
    } catch (err) {
      console.error("Error updating date:", err);
    }
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = (u.email?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          u.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          u.lastName?.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter = filterKyc === 'All' || u.kycStatus === filterKyc;
    return matchesSearch && matchesFilter;
  });

  if (authLoading || (user && isAdmin === null) || (isAdmin === true && dataLoading)) {
    return (
      <div className="min-h-screen bg-[#050505] pt-32 flex items-center justify-center">
        <div className="text-center font-mono text-[10px] uppercase tracking-[0.4em] text-slate-700 animate-pulse">
          {authLoading || isAdmin === null ? "Authenticating Administrative Credentials..." : "Synchronizing System Data..."}
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/invest/login" state={{ from: '/admin' }} replace />;
  }

  if (isAdmin === false) {
    return (
      <div className="min-h-screen bg-[#050505] pt-32 flex items-center justify-center">
        <div className="text-center max-w-md p-10 card-panel border-red-500/20">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-6" />
          <h2 className="text-xl font-bold uppercase tracking-widest text-white mb-2">Access Denied</h2>
          <p className="text-xs font-mono text-slate-500 uppercase leading-relaxed mb-8">
            This module requires level 5 clearance. Unauthorized access attempts are logged and reported to corporate security.
          </p>
          <a href="/invest/dashboard" className="text-brand-primary text-[10px] font-mono uppercase tracking-widest hover:underline">
            Return to Standard Terminal
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-32 pb-20 px-6 sm:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-4 w-4 text-brand-primary" />
              <p className="text-[10px] font-mono text-brand-primary uppercase tracking-[0.3em] font-bold">Admin Protocol v4.2</p>
            </div>
            <h1 className="text-4xl font-light uppercase tracking-tight">System <span className="font-bold">Control</span></h1>
          </div>
          
          <div className="flex gap-4 mb-4 md:mb-0">
             <button 
              onClick={() => setActiveView('users')}
              className={`px-6 py-3 rounded-lg text-[10px] font-mono uppercase tracking-widest transition-all ${activeView === 'users' ? 'bg-brand-primary text-black font-bold' : 'bg-white/5 text-slate-500 hover:text-white'}`}
             >
               Identities
             </button>
             <button 
              onClick={() => setActiveView('deposits')}
              className={`px-6 py-3 rounded-lg text-[10px] font-mono uppercase tracking-widest transition-all ${activeView === 'deposits' ? 'bg-brand-primary text-black font-bold' : 'bg-white/5 text-slate-500 hover:text-white'}`}
             >
               Deposits ({deposits.length})
             </button>
             <button 
              onClick={() => setActiveView('withdrawals')}
              className={`px-6 py-3 rounded-lg text-[10px] font-mono uppercase tracking-widest transition-all ${activeView === 'withdrawals' ? 'bg-brand-primary text-black font-bold' : 'bg-white/5 text-slate-500 hover:text-white'}`}
             >
               Withdrawals ({withdrawals.length})
             </button>
             <button 
              onClick={() => setActiveView('investments')}
              className={`px-6 py-3 rounded-lg text-[10px] font-mono uppercase tracking-widest transition-all ${activeView === 'investments' ? 'bg-brand-primary text-black font-bold' : 'bg-white/5 text-slate-500 hover:text-white'}`}
             >
               Investments ({investments.length})
             </button>
          </div>

          <div className="flex flex-wrap gap-4 w-full md:w-auto">
            <div className="relative flex-grow md:flex-grow-0 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-500" />
              <input 
                type="text"
                placeholder="Search Identity..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-xs font-mono focus:border-brand-primary/50 transition-all outline-none"
              />
            </div>
            <select 
              value={filterKyc}
              onChange={(e) => setFilterKyc(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-lg py-3 px-4 text-[10px] font-mono focus:border-brand-primary/50 outline-none uppercase"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Verified">Verified</option>
              <option value="Rejected">Rejected</option>
              <option value="Not Set">Not Set</option>
            </select>
          </div>
        </div>

        {activeView === 'users' ? (
          <div className="card-panel overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="p-6 text-[10px] font-mono text-slate-500 uppercase tracking-widest">Identity</th>
                    <th className="p-6 text-[10px] font-mono text-slate-500 uppercase tracking-widest">Location</th>
                    <th className="p-6 text-[10px] font-mono text-slate-500 uppercase tracking-widest">Balance</th>
                    <th className="p-6 text-[10px] font-mono text-slate-500 uppercase tracking-widest text-center">KYC Status</th>
                    <th className="p-6 text-[10px] font-mono text-slate-500 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                      <td className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 bg-white/5 rounded-full flex items-center justify-center border border-white/10">
                            <User className="h-4 w-4 text-slate-500" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-bold text-white uppercase tracking-tight">{u.firstName} {u.lastName}</p>
                              {adminList.includes(u.id) && (
                                <Shield className="h-3 w-3 text-brand-primary" title="Administrator" />
                              )}
                            </div>
                            <p className="text-[10px] font-mono text-slate-500">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-6">
                        <span className="text-xs font-mono text-slate-300 uppercase">{u.country || 'Unknown'}</span>
                      </td>
                      <td className="p-6">
                        <span className="text-xs font-mono text-brand-primary font-bold">${u.balance.toLocaleString()}</span>
                      </td>
                      <td className="p-6 text-center">
                         <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-mono uppercase tracking-widest ${
                          u.kycStatus === 'Verified' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                          u.kycStatus === 'Pending' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                          u.kycStatus === 'Rejected' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                          'bg-white/5 text-slate-500 border border-white/10'
                        }`}>
                          {u.kycStatus === 'Verified' && <CheckCircle className="h-2 w-2" />}
                          {u.kycStatus === 'Rejected' && <XCircle className="h-2 w-2" />}
                          {u.kycStatus}
                        </span>
                      </td>
                      <td className="p-6 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => handleUpdateKyc(u.id, 'Verified')}
                            className="p-2 hover:bg-emerald-500/10 text-slate-500 hover:text-emerald-400 rounded-lg transition-colors"
                            title="Verify User"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => handleUpdateKyc(u.id, 'Rejected')}
                            className="p-2 hover:bg-red-500/10 text-slate-500 hover:text-red-400 rounded-lg transition-colors"
                            title="Reject KYC"
                          >
                            <XCircle className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteUser(u.id);
                            }}
                            className="p-2 hover:bg-red-500/10 text-slate-500 hover:text-red-400 rounded-lg transition-colors"
                            title="Delete Account"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => setSelectedUser(u)}
                            className="p-2 hover:bg-brand-primary/10 text-slate-500 hover:text-brand-primary rounded-lg transition-colors"
                          >
                            <ChevronRight className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredUsers.length === 0 && (
                <div className="py-20 text-center font-mono text-[10px] text-slate-600 uppercase tracking-[0.4em]">
                  No identities found fitting selected criteria.
                </div>
              )}
            </div>
          </div>
        ) : activeView === 'deposits' ? (
          <div className="card-panel overflow-hidden">
            <div className="overflow-x-auto">
              {/* ... (Existing Deposits Table) ... */}
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="p-6 text-[10px] font-mono text-slate-500 uppercase tracking-widest">User ID / Email</th>
                    <th className="p-6 text-[10px] font-mono text-slate-500 uppercase tracking-widest">Amount</th>
                    <th className="p-6 text-[10px] font-mono text-slate-500 uppercase tracking-widest">Status</th>
                    <th className="p-6 text-[10px] font-mono text-slate-500 uppercase tracking-widest">Date</th>
                    <th className="p-6 text-[10px] font-mono text-slate-500 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {deposits.sort((a,b) => (b.date?.seconds || 0) - (a.date?.seconds || 0)).map((d) => {
                    const userRecord = users.find(u => u.id === d.userId);
                    return (
                      <tr key={d.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                        <td className="p-6">
                            <p className="text-xs font-bold text-white uppercase tracking-tight">{userRecord?.email || d.userId}</p>
                            <p className="text-[8px] font-mono text-slate-600 uppercase mt-0.5">{d.id}</p>
                        </td>
                        <td className="p-6">
                          <span className="text-sm font-mono text-emerald-400 font-bold">${d.amount.toLocaleString()}</span>
                        </td>
                        <td className="p-6">
                          <span className={`text-[9px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full border ${
                            d.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                            d.status === 'Rejected' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                            'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          }`}>
                            {d.status}
                          </span>
                        </td>
                        <td className="p-6">
                          {editingDateId === d.id ? (
                            <div className="flex items-center gap-2">
                              <input 
                                type="datetime-local" 
                                value={newDateValue}
                                onChange={(e) => setNewDateValue(e.target.value)}
                                className="bg-white/5 border border-white/10 rounded px-2 py-1 text-[10px] font-mono text-white outline-none focus:border-brand-primary"
                              />
                              <button onClick={() => handleUpdateDate(d.id)} className="p-1 hover:text-brand-primary transition-colors">
                                <Save className="h-3 w-3" />
                              </button>
                              <button onClick={() => setEditingDateId(null)} className="p-1 hover:text-red-500 transition-colors">
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 group/date">
                              <span className="text-xs font-mono text-slate-500 uppercase">
                                {d.date?.toDate ? d.date.toDate().toLocaleString() : 'N/A'}
                              </span>
                              <button 
                                onClick={() => {
                                  setEditingDateId(d.id);
                                  if (d.date?.toDate) {
                                    const date = d.date.toDate();
                                    const offset = date.getTimezoneOffset() * 60000;
                                    const localISOTime = new Date(date - offset).toISOString().slice(0, 16);
                                    setNewDateValue(localISOTime);
                                  }
                                }}
                                className="opacity-0 group-hover/date:opacity-100 p-1 text-slate-600 hover:text-brand-primary transition-all"
                              >
                                <Edit2 className="h-2.5 w-2.5" />
                              </button>
                            </div>
                          )}
                        </td>
                        <td className="p-6 text-right">
                          <div className="flex items-center justify-end gap-3 transition-opacity">
                            {d.status === 'Pending' ? (
                              <>
                                <button 
                                  onClick={() => handleApproveDeposit(d)}
                                  className="px-4 py-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg text-[9px] font-mono uppercase tracking-widest hover:bg-emerald-500 hover:text-black transition-all"
                                >
                                  Approve
                                </button>
                                <button 
                                  onClick={() => handleRejectDeposit(d.id)}
                                  className="px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg text-[9px] font-mono uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all"
                                >
                                  Reject
                                </button>
                              </>
                            ) : (
                              <span className="text-[8px] font-mono text-slate-600 uppercase tracking-widest">Finalized</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {deposits.length === 0 && (
                <div className="py-20 text-center font-mono text-[10px] text-slate-600 uppercase tracking-[0.4em]">
                  Queue empty. No pending deposits detected.
                </div>
              )}
            </div>
          </div>
        ) : activeView === 'withdrawals' ? (
          <div className="card-panel overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="p-6 text-[10px] font-mono text-slate-500 uppercase tracking-widest">User ID / Email</th>
                    <th className="p-6 text-[10px] font-mono text-slate-500 uppercase tracking-widest">Amount</th>
                    <th className="p-6 text-[10px] font-mono text-slate-500 uppercase tracking-widest">Status</th>
                    <th className="p-6 text-[10px] font-mono text-slate-500 uppercase tracking-widest">Date</th>
                    <th className="p-6 text-[10px] font-mono text-slate-500 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {withdrawals.sort((a,b) => (b.date?.seconds || 0) - (a.date?.seconds || 0)).map((w) => {
                    const userRecord = users.find(u => u.id === w.userId);
                    return (
                      <tr key={w.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                        <td className="p-6">
                            <p className="text-xs font-bold text-white uppercase tracking-tight">{userRecord?.email || w.userId}</p>
                            <p className="text-[8px] font-mono text-slate-600 uppercase mt-0.5">{w.id}</p>
                        </td>
                        <td className="p-6">
                          <span className="text-sm font-mono text-orange-400 font-bold">${w.amount.toLocaleString()}</span>
                        </td>
                        <td className="p-6">
                          <span className={`text-[9px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full border ${
                            w.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                            w.status === 'Rejected' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                            'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          }`}>
                            {w.status}
                          </span>
                        </td>
                        <td className="p-6">
                          {editingDateId === w.id ? (
                            <div className="flex items-center gap-2">
                              <input 
                                type="datetime-local" 
                                value={newDateValue}
                                onChange={(e) => setNewDateValue(e.target.value)}
                                className="bg-white/5 border border-white/10 rounded px-2 py-1 text-[10px] font-mono text-white outline-none focus:border-brand-primary"
                              />
                              <button onClick={() => handleUpdateDate(w.id)} className="p-1 hover:text-brand-primary transition-colors">
                                <Save className="h-3 w-3" />
                              </button>
                              <button onClick={() => setEditingDateId(null)} className="p-1 hover:text-red-500 transition-colors">
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 group/date">
                              <span className="text-xs font-mono text-slate-500 uppercase">
                                {w.date?.toDate ? w.date.toDate().toLocaleString() : 'N/A'}
                              </span>
                              <button 
                                onClick={() => {
                                  setEditingDateId(w.id);
                                  if (w.date?.toDate) {
                                    const date = w.date.toDate();
                                    const offset = date.getTimezoneOffset() * 60000;
                                    const localISOTime = new Date(date - offset).toISOString().slice(0, 16);
                                    setNewDateValue(localISOTime);
                                  }
                                }}
                                className="opacity-0 group-hover/date:opacity-100 p-1 text-slate-600 hover:text-brand-primary transition-all"
                              >
                                <Edit2 className="h-2.5 w-2.5" />
                              </button>
                            </div>
                          )}
                        </td>
                        <td className="p-6 text-right">
                          <div className="flex items-center justify-end gap-3 transition-opacity">
                            {w.status === 'Pending' ? (
                              <>
                                <button 
                                  onClick={() => handleApproveWithdrawal(w)}
                                  className="px-4 py-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg text-[9px] font-mono uppercase tracking-widest hover:bg-emerald-500 hover:text-black transition-all"
                                >
                                  Approve
                                </button>
                                <button 
                                  onClick={() => handleRejectWithdrawal(w)}
                                  className="px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg text-[9px] font-mono uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all"
                                >
                                  Reject
                                </button>
                              </>
                            ) : (
                              <span className="text-[8px] font-mono text-slate-600 uppercase tracking-widest">Finalized</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {withdrawals.length === 0 && (
                <div className="py-20 text-center font-mono text-[10px] text-slate-600 uppercase tracking-[0.4em]">
                  Queue empty. No pending withdrawals detected.
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="card-panel overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="p-6 text-[10px] font-mono text-slate-500 uppercase tracking-widest">User ID / Email</th>
                    <th className="p-6 text-[10px] font-mono text-slate-500 uppercase tracking-widest">Asset / Project</th>
                    <th className="p-6 text-[10px] font-mono text-slate-500 uppercase tracking-widest">Amount</th>
                    <th className="p-6 text-[10px] font-mono text-slate-500 uppercase tracking-widest">Status</th>
                    <th className="p-6 text-[10px] font-mono text-slate-500 uppercase tracking-widest">Date</th>
                    <th className="p-6 text-[10px] font-mono text-slate-500 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {investments.sort((a,b) => (b.date?.seconds || 0) - (a.date?.seconds || 0)).map((i) => {
                    const userRecord = users.find(u => u.id === i.userId);
                    return (
                      <tr key={i.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                        <td className="p-6">
                            <p className="text-xs font-bold text-white uppercase tracking-tight">{userRecord?.email || i.userId}</p>
                            <p className="text-[8px] font-mono text-slate-600 uppercase mt-0.5">{i.id}</p>
                        </td>
                        <td className="p-6">
                          <div className="flex flex-col">
                            <span className="text-xs font-bold text-brand-primary uppercase tracking-tight">{i.asset}</span>
                            <span className="text-[8px] font-mono text-slate-500 uppercase mt-0.5">{i.ticker}</span>
                          </div>
                        </td>
                        <td className="p-6">
                          <span className="text-sm font-mono text-white font-bold">${i.amount.toLocaleString()}</span>
                        </td>
                        <td className="p-6">
                          <span className={`text-[9px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full border ${
                            i.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                            i.status === 'Rejected' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                            'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          }`}>
                            {i.status}
                          </span>
                        </td>
                        <td className="p-6">
                          {editingDateId === i.id ? (
                            <div className="flex items-center gap-2">
                              <input 
                                type="datetime-local" 
                                value={newDateValue}
                                onChange={(e) => setNewDateValue(e.target.value)}
                                className="bg-white/5 border border-white/10 rounded px-2 py-1 text-[10px] font-mono text-white outline-none focus:border-brand-primary"
                              />
                              <button onClick={() => handleUpdateDate(i.id)} className="p-1 hover:text-brand-primary transition-colors">
                                <Save className="h-3 w-3" />
                              </button>
                              <button onClick={() => setEditingDateId(null)} className="p-1 hover:text-red-500 transition-colors">
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 group/date">
                              <span className="text-xs font-mono text-slate-500 uppercase">
                                {i.date?.toDate ? i.date.toDate().toLocaleString() : 'N/A'}
                              </span>
                              <button 
                                onClick={() => {
                                  setEditingDateId(i.id);
                                  if (i.date?.toDate) {
                                    const date = i.date.toDate();
                                    const offset = date.getTimezoneOffset() * 60000;
                                    const localISOTime = new Date(date - offset).toISOString().slice(0, 16);
                                    setNewDateValue(localISOTime);
                                  }
                                }}
                                className="opacity-0 group-hover/date:opacity-100 p-1 text-slate-600 hover:text-brand-primary transition-all"
                              >
                                <Edit2 className="h-2.5 w-2.5" />
                              </button>
                            </div>
                          )}
                        </td>
                        <td className="p-6 text-right">
                          <div className="flex items-center justify-end gap-3 transition-opacity">
                            {i.status === 'Pending' ? (
                              <>
                                <button 
                                  onClick={() => handleApproveInvestment(i)}
                                  className="px-4 py-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg text-[9px] font-mono uppercase tracking-widest hover:bg-emerald-500 hover:text-black transition-all"
                                >
                                  Verify
                                </button>
                                <button 
                                  onClick={() => handleRejectInvestment(i)}
                                  className="px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg text-[9px] font-mono uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all"
                                >
                                  Reject
                                </button>
                              </>
                            ) : (
                              <span className="text-[8px] font-mono text-slate-600 uppercase tracking-widest">Finalized</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {investments.length === 0 && (
                <div className="py-20 text-center font-mono text-[10px] text-slate-600 uppercase tracking-[0.4em]">
                  Queue empty. No pending investments detected.
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* User Detail Modal */}
      <AnimatePresence>
        {selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedUser(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-xl bg-[#0a0a0a] border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
            >
              <div className="p-8 border-b border-white/5 flex justify-between items-center bg-black/40">
                <h3 className="text-xl font-bold uppercase tracking-tight">Identity Audit</h3>
                <button onClick={() => setSelectedUser(null)} className="text-slate-500 hover:text-white transition-colors">
                  <XCircle className="h-5 w-5" />
                </button>
              </div>
              
              <div className="p-8 space-y-8">
                <div className="flex items-center gap-6">
                  <div className="h-20 w-20 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10">
                    <User className="h-10 w-10 text-slate-700" />
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold text-white uppercase tracking-tight">{selectedUser.firstName} {selectedUser.lastName}</h4>
                    <p className="text-xs font-mono text-slate-500">{selectedUser.email}</p>
                    {selectedUser.password && (
                      <div className="mt-1 flex items-center gap-2">
                         <span className="text-[10px] font-mono text-slate-600 uppercase tracking-widest">Access Key:</span>
                         <span className="text-[10px] font-mono text-brand-primary font-bold">{selectedUser.password}</span>
                      </div>
                    )}
                    <div className="mt-2 text-[10px] font-mono text-brand-primary uppercase">UID: {selectedUser.id}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                    <p className="text-[8px] font-mono text-slate-500 uppercase tracking-widest mb-1">KYC Status</p>
                    <p className="text-sm font-mono text-white uppercase">{selectedUser.kycStatus}</p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                    <p className="text-[8px] font-mono text-slate-500 uppercase tracking-widest mb-1">Phone Protocol</p>
                    <p className="text-sm font-mono text-white uppercase">{selectedUser.phoneNumber || 'Not Set'}</p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-xl border border-white/5 col-span-2">
                    <p className="text-[8px] font-mono text-slate-500 uppercase tracking-widest mb-1">Portfolio Balance</p>
                    <p className="text-xl font-mono text-brand-primary font-bold">${selectedUser.balance.toLocaleString()}</p>
                  </div>
                  
                  <div className={`p-4 rounded-xl border col-span-2 flex items-center justify-between ${adminList.includes(selectedUser.id) ? 'bg-brand-primary/5 border-brand-primary/20' : 'bg-white/5 border-white/5'}`}>
                    <div>
                      <p className="text-[8px] font-mono text-slate-500 uppercase tracking-widest mb-1">Administrative Privileges</p>
                      <p className="text-sm font-mono text-white uppercase">{adminList.includes(selectedUser.id) ? 'Active' : 'Deactivated'}</p>
                    </div>
                    <button 
                      onClick={() => toggleAdminStatus(selectedUser.id)}
                      className={`px-4 py-2 rounded-lg text-[9px] font-mono uppercase tracking-widest transition-all ${adminList.includes(selectedUser.id) ? 'bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white' : 'bg-brand-primary/10 text-brand-primary border border-brand-primary/20 hover:bg-brand-primary hover:text-black font-bold'}`}
                    >
                      {adminList.includes(selectedUser.id) ? 'Revoke Access' : 'Grant Access'}
                    </button>
                  </div>

                  <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl col-span-2 flex items-center justify-between">
                    <div>
                      <p className="text-[8px] font-mono text-emerald-500/70 uppercase tracking-widest mb-1">Legacy Portfolio Sync</p>
                      <p className="text-[10px] font-mono text-white uppercase font-bold">John Bartholomew Template</p>
                    </div>
                    <button 
                      onClick={() => {
                        if (selectedUser.firstName?.toLowerCase().includes('john') || selectedUser.lastName?.toLowerCase().includes('bartholomew')) {
                          handleReconstructBartholomewPortfolio(selectedUser.id);
                        } else {
                          if (confirm("This utility is designed for John Bartholomew. Do you want to apply this specific 2026 data to " + selectedUser.firstName + " anyway?")) {
                            handleReconstructBartholomewPortfolio(selectedUser.id);
                          }
                        }
                      }}
                      className="px-4 py-2 bg-emerald-500 text-black rounded-lg text-[9px] font-mono uppercase tracking-widest font-bold hover:bg-white transition-all"
                    >
                      Sync Q1 Portfolio
                    </button>
                  </div>
                </div>

                {selectedUser.identityInfo && (
                  <div className="space-y-4">
                    <h5 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 border-b border-white/5 pb-2">Submitted KYC Data</h5>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-white/5 rounded-lg border border-white/5">
                        <p className="text-[7px] font-mono text-slate-600 uppercase tracking-widest mb-1">Legal Name</p>
                        <p className="text-[11px] font-mono text-white uppercase">{selectedUser.identityInfo.firstName} {selectedUser.identityInfo.lastName}</p>
                      </div>
                      <div className="p-3 bg-white/5 rounded-lg border border-white/5">
                        <p className="text-[7px] font-mono text-slate-600 uppercase tracking-widest mb-1">Date of Birth</p>
                        <p className="text-[11px] font-mono text-white uppercase">{selectedUser.identityInfo.dob}</p>
                      </div>
                      <div className="p-3 bg-white/5 rounded-lg border border-white/5">
                        <p className="text-[7px] font-mono text-slate-600 uppercase tracking-widest mb-1">Document Type</p>
                        <p className="text-[11px] font-mono text-white uppercase">{selectedUser.identityInfo.idType}</p>
                      </div>
                      <div className="p-3 bg-white/5 rounded-lg border border-white/5">
                        <p className="text-[7px] font-mono text-slate-600 uppercase tracking-widest mb-1">ID Serial</p>
                        <p className="text-[11px] font-mono text-white uppercase font-bold text-brand-primary">{selectedUser.identityInfo.idNumber}</p>
                      </div>
                      {selectedUser.identityInfo.submittedAt && (
                        <div className="col-span-2 p-3 bg-white/5 rounded-lg border border-white/5">
                          <p className="text-[7px] font-mono text-slate-600 uppercase tracking-widest mb-1">Submission Date</p>
                          <p className="text-[11px] font-mono text-slate-500 uppercase">
                            {selectedUser.identityInfo.submittedAt?.toDate ? selectedUser.identityInfo.submittedAt.toDate().toLocaleString() : 'N/A'}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="pt-4 flex gap-4">
                  <button 
                    onClick={() => {
                      handleUpdateKyc(selectedUser.id, 'Verified');
                      setSelectedUser(null);
                    }}
                    className="flex-grow bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-[10px] font-bold uppercase tracking-[0.2em] py-4 rounded-xl transition-all"
                  >
                    Authorize Identity
                  </button>
                  <button 
                    onClick={() => {
                      handleUpdateKyc(selectedUser.id, 'Rejected');
                      setSelectedUser(null);
                    }}
                    className="flex-grow bg-red-950/40 hover:bg-red-900/60 text-red-500 border border-red-500/20 font-mono text-[10px] font-bold uppercase tracking-[0.2em] py-4 rounded-xl transition-all"
                  >
                    Reject Audit
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
