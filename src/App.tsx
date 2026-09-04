import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import InvestPage from './pages/InvestPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ProjectsPage from './pages/ProjectsPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CurrencyProvider } from './context/CurrencyContext';
import { ShieldCheck, Activity } from 'lucide-react';

const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));

function AppRoutes() {
  const { loading } = useAuth();

  React.useEffect(() => {
    if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
      console.warn("INSECURE PROTOCOL DETECTED: Application should be accessed via HTTPS for full encryption support.");
    }
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center z-[100]">
        <div className="text-center">
          <div className="relative mb-8">
            <ShieldCheck className="h-16 w-16 text-brand-primary animate-pulse mx-auto" />
            <Activity className="h-6 w-6 text-brand-primary absolute -bottom-1 -right-1 animate-spin" />
          </div>
          <h2 className="text-xl font-light uppercase tracking-[0.4em] text-white/80 animate-pulse">Initializing <span className="font-bold text-brand-primary">Protocol...</span></h2>
          <div className="space-y-1">
            <p className="font-mono text-[8px] text-slate-700 uppercase tracking-[0.3em]">SECURE ACCESS GATEWAY // VERIFYING DISTRIBUTED LEDGER</p>
            <p className="font-mono text-[8px] text-emerald-500/50 uppercase tracking-[0.3em]">TLS 1.3 TUNNEL ESTABLISHED // AES-256 HANDSHAKE SUCCESS</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="shop" element={<ShopPage />} />
        
        {/* Shop Redirects */}
        <Route path="dashboard/shop/*" element={<Navigate to="/invest/login" replace />} />
        <Route path="dashboard" element={<Navigate to="/invest/dashboard" replace />} />
        <Route path="dashboard/*" element={<Navigate to="/invest/dashboard" replace />} />

        <Route path="invest">
          <Route index element={<InvestPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="signup" element={<RegisterPage />} />
          <Route path="forgot-password" element={<ForgotPasswordPage />} />
          <Route path="dashboard" element={
            <Suspense fallback={
              <div className="pt-40 text-center font-mono text-[10px] uppercase tracking-widest text-slate-700">
                Loading Secure Console...
              </div>
            }>
              <DashboardPage />
            </Suspense>
          } />
        </Route>

        <Route path="projects" element={<ProjectsPage />} />
        <Route path="admin" element={
          <Suspense fallback={<div className="pt-40 text-center font-mono text-[10px] uppercase tracking-widest text-slate-700">Loading Protocol...</div>}>
            <AdminPage />
          </Suspense>
        } />

        {/* 404 handled by Navigate or just leaving as is - user mentioned privacy/terms/contact/careers is 404 */}
        <Route path="privacy" element={<PrivacyPage />} />
        <Route path="terms" element={<TermsPage />} />
        <Route path="contact" element={<Navigate to="/404" replace />} />
        <Route path="careers" element={<Navigate to="/404" replace />} />
        
        <Route path="404" element={<div className="pt-40 text-center font-mono uppercase tracking-[0.4em] text-slate-700">404 // Access Denied</div>} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <CurrencyProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </CurrencyProvider>
  );
}

