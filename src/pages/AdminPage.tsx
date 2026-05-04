import React, { useState, useEffect } from 'react';
import { collection, query, getDocs, doc, updateDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import { Shield, ChevronRight, User, CheckCircle, XCircle, AlertCircle, Search, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface UserRecord {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  country?: string;
  phoneNumber?: string;
  balance: number;
  kycStatus: string;
  createdAt: any;
}

export default function AdminPage() {
  const { user } = useAuth();
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterKyc, setFilterKyc] = useState('All');
  const [selectedUser, setSelectedUser] = useState<UserRecord | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    if (!user) return;

    // Check admin status
    const adminRef = doc(db, 'admins', user.uid);
    const unsubAdmin = onSnapshot(adminRef, (doc) => {
      setIsAdmin(doc.exists());
    });

    return () => unsubAdmin();
  }, [user]);

  useEffect(() => {
    if (isAdmin !== true) return;

    const usersQuery = query(collection(db, 'users'));
    const unsubUsers = onSnapshot(usersQuery, (snap) => {
      const uList = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as UserRecord));
      setUsers(uList);
      setLoading(false);
    });

    return () => unsubUsers();
  }, [isAdmin]);

  const handleUpdateKyc = async (userId: string, status: string) => {
    try {
      await updateDoc(doc(db, 'users', userId), { kycStatus: status });
    } catch (err) {
      console.error("Error updating KYC:", err);
    }
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = (u.email?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          u.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          u.lastName?.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter = filterKyc === 'All' || u.kycStatus === filterKyc;
    return matchesSearch && matchesFilter;
  });

  if (isAdmin === null || loading) {
    return (
      <div className="min-h-screen bg-[#050505] pt-32 flex items-center justify-center">
        <div className="text-center font-mono text-[10px] uppercase tracking-[0.4em] text-slate-700 animate-pulse">
          Authenticating Administrative Credentials...
        </div>
      </div>
    );
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
            <h1 className="text-4xl font-light uppercase tracking-tight">User <span className="font-bold">Registry</span></h1>
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
                          <p className="text-sm font-bold text-white uppercase tracking-tight">{u.firstName} {u.lastName}</p>
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
                </div>

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
