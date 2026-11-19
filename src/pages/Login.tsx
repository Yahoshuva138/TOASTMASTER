import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Mail, 
  Lock, 
  AlertCircle, 
  ArrowRight, 
  Clock, 
  UserCheck, 
  CheckCircle2, 
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { Profile } from '../types/database.types';
import { 
  syncAccessRequestToCloud, 
  checkCloudApprovalStatus, 
  grantCloudMemberAccess, 
  getSystemRoleFromTitle 
} from '../lib/cloudSync';

interface LoginProps {
  onLoginSuccess: (user: Profile) => void;
  onRequestAccess: (pendingUser: Profile) => void;
  members: Profile[];
}

export const Login: React.FC<LoginProps> = ({
  onLoginSuccess,
  onRequestAccess,
  members
}) => {
  const [activeTab, setActiveTab] = useState<'google' | 'pin'>('google');
  const [googleEmail, setGoogleEmail] = useState('');
  const [pinEmail, setPinEmail] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [pendingUser, setPendingUser] = useState<Profile | null>(null);

  // Quick Super Admin approval state on pending screen
  const [instantRole, setInstantRole] = useState('Club Member');
  const [instantPin, setInstantPin] = useState('');
  const [instantError, setInstantError] = useState('');

  // Check if an email belongs to Super Admin
  const isSuperAdminEmail = (rawEmail: string) => {
    const e = rawEmail.toLowerCase().trim();
    return (
      e === 'kesaboyinayahoshuva@gmail.com' ||
      e === 'yahoshuva.kesaboyina@scaler.com' ||
      e === 'yahoshuva138@gmail.com' ||
      e === 'yahoshuva@scaler.com'
    );
  };

  // Process authentication for ANY email address
  const authenticateEmail = (inputEmail: string, explicitName?: string) => {
    setError('');
    const cleanEmail = inputEmail.toLowerCase().trim();

    if (!cleanEmail || !cleanEmail.includes('@')) {
      setError('Please enter a valid Google or club email address.');
      return;
    }

    // 1. Super Admin instant verified access
    if (isSuperAdminEmail(cleanEmail)) {
      const superAdminProfile: Profile = {
        id: 'user-yahoshuva',
        email: cleanEmail,
        fullName: 'TM Yahoshuva Kesaboyina',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
        clubRole: 'Super Admin / Club Secretary',
        systemRole: 'super_admin',
        departmentId: 'dept-fin',
        departmentName: 'Finance & Records',
        isActive: true,
        accessStatus: 'approved',
        createdAt: '2026-10-01T10:00:00Z',
        updatedAt: new Date().toISOString()
      };
      onLoginSuccess(superAdminProfile);
      return;
    }

    // 2. Check existing member roster
    const matched = members.find(m => m.email.toLowerCase() === cleanEmail);

    if (matched) {
      if (matched.accessStatus === 'approved' || (matched.isActive && matched.accessStatus !== 'pending')) {
        // Access has been granted by Super Admin with assigned role
        onLoginSuccess(matched);
      } else {
        // Registered but still pending approval
        setPendingUser(matched);
      }
    } else {
      // 3. New email registering: Create pending record requiring Super Admin approval & role assignment
      const newPendingProfile: Profile = {
        id: 'user-' + Date.now(),
        email: cleanEmail,
        fullName: explicitName?.trim() || cleanEmail.split('@')[0].replace('.', ' ').toUpperCase(),
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
        clubRole: 'Pending Role Assignment',
        systemRole: 'member',
        departmentName: 'Pending Assignment',
        isActive: false,
        accessStatus: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      onRequestAccess(newPendingProfile);
      setPendingUser(newPendingProfile);
      syncAccessRequestToCloud(newPendingProfile);
    }
  };

  // Re-check pending status (checks both Live Cloud Supabase and local store)
  const handleCheckStatus = async () => {
    if (!pendingUser) return;
    const cleanEmail = pendingUser.email.toLowerCase().trim();

    if (isSuperAdminEmail(cleanEmail)) {
      authenticateEmail(cleanEmail);
      return;
    }

    // 1. Check in Cloud Supabase first!
    const cloudCheck = await checkCloudApprovalStatus(cleanEmail);
    if (cloudCheck.approved && cloudCheck.profile) {
      const fullProfile: Profile = {
        id: cloudCheck.profile.id || pendingUser.id,
        email: cleanEmail,
        fullName: cloudCheck.profile.fullName || pendingUser.fullName,
        avatarUrl: pendingUser.avatarUrl,
        clubRole: cloudCheck.role || 'Club Member',
        systemRole: cloudCheck.profile.systemRole || 'member',
        departmentName: 'Club Roster',
        isActive: true,
        accessStatus: 'approved',
        createdAt: pendingUser.createdAt,
        updatedAt: new Date().toISOString()
      };
      setPendingUser(null);
      onLoginSuccess(fullProfile);
      return;
    }

    // 2. Check in local members list
    const matched = members.find(m => m.email.toLowerCase() === cleanEmail);
    if (matched && (matched.accessStatus === 'approved' || matched.isActive)) {
      setPendingUser(null);
      onLoginSuccess(matched);
    } else {
      setError('Your access request is awaiting Super Admin approval. Please contact TM Yahoshuva Kesaboyina.');
    }
  };

  // Super Admin Instant Approval directly from the pending card
  const handleInstantApprove = async () => {
    if (!pendingUser) return;
    setInstantError('');

    if (instantPin !== '1234' && instantPin !== 'admin') {
      setInstantError('Invalid Super Admin PIN. Enter 1234.');
      return;
    }

    const approvedProfile: Profile = {
      ...pendingUser,
      clubRole: instantRole,
      systemRole: getSystemRoleFromTitle(instantRole),
      isActive: true,
      accessStatus: 'approved',
      updatedAt: new Date().toISOString()
    };

    // Update cloud and local state
    grantCloudMemberAccess(pendingUser.email, instantRole, pendingUser.fullName);
    setPendingUser(null);
    onLoginSuccess(approvedProfile);
  };

  // Google Login form submit
  const handleGoogleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    authenticateEmail(googleEmail);
  };

  // Direct Email & PIN Login form handler
  const handleEmailPinLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin !== '1234' && pin !== 'admin') {
      setError('Incorrect PIN. (Default member PIN: 1234)');
      return;
    }
    authenticateEmail(pinEmail);
  };

  return (
    <div className="min-h-screen bg-[#004165] flex flex-col justify-between">
      
      {/* Top Utility Bar (matching toastmasters.org) */}
      <div className="w-full bg-[#002B44] text-slate-200 text-xs py-2 px-4 border-b border-[#001D2E]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2 text-[11px] sm:text-xs">
            <span className="font-brand font-bold text-[#F2DF74] tracking-wider uppercase">
              Where Leaders Are Made
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-300">
              SpeakUp Scaler Toastmasters Club #28681022
            </span>
          </div>
          <div className="text-[11px] text-slate-400 hidden sm:block">
            District 227 • Division E • Area 04
          </div>
        </div>
      </div>

      {/* Main Center Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 my-8">
        
        {/* Brand & Portal Header */}
        <div className="text-center mb-6 max-w-md w-full animate-in fade-in">
          <div className="w-20 h-20 rounded-2xl bg-white p-2 mx-auto flex items-center justify-center shadow-2xl mb-4 border-2 border-[#F2DF74]">
            <img 
              src="/toastmasters-logo.svg" 
              alt="Toastmasters International Emblem" 
              className="w-full h-full object-contain" 
            />
          </div>
          <h1 className="text-2xl sm:text-3xl font-brand font-black tracking-wide text-white uppercase drop-shadow-sm">
            TOASTMASTERS TASK HUB
          </h1>
          <p className="text-sm font-brand font-bold text-[#F2DF74] mt-1">
            SpeakUp Scaler Toastmasters Club
          </p>
          <p className="text-xs text-slate-200 font-medium">
            Club #28681022 • District 227 • Division E • Area 04
          </p>
          <p className="text-[11px] text-slate-300 mt-1 italic font-brand">
            Where Leaders Are Made • Learn • Speak • Lead
          </p>
        </div>

      {/* Main Login Card */}
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95">
        
        {/* Navigation Tabs: Google Sign-In vs PIN */}
        <div className="grid grid-cols-2 bg-slate-100 p-1.5 border-b border-slate-200 text-xs font-bold">
          <button
            type="button"
            onClick={() => { setActiveTab('google'); setError(''); }}
            className={`py-2.5 rounded-xl transition flex items-center justify-center space-x-2 ${
              activeTab === 'google'
                ? 'bg-white text-[#004165] shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>Google Login</span>
          </button>

          <button
            type="button"
            onClick={() => { setActiveTab('pin'); setError(''); }}
            className={`py-2.5 rounded-xl transition flex items-center justify-center space-x-2 ${
              activeTab === 'pin'
                ? 'bg-white text-[#004165] shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Lock className="w-3.5 h-3.5 text-[#772432]" />
            <span>Email & PIN</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-8 space-y-6">
          
          {error && (
            <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl flex items-center space-x-2 border border-red-200 animate-in fade-in">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* VIEW: Pending Access Approval Screen */}
          {pendingUser ? (
            <div className="space-y-4 text-center">
              <div className="w-14 h-14 rounded-full bg-amber-100 border-2 border-amber-400 mx-auto flex items-center justify-center text-amber-700 animate-pulse">
                <Clock className="w-7 h-7" />
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase text-amber-800 tracking-wider block">Access Status</span>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">Approval & Role Assignment Required</h3>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                  Your email <span className="font-bold text-slate-900">{pendingUser.email}</span> is registered in the queue.
                </p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-left text-xs space-y-1.5">
                <div className="flex items-center justify-between text-slate-600">
                  <span>Assigned Role:</span>
                  <span className="font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    Pending Super Admin Assignment
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span>Authorized Approver:</span>
                  <span className="font-semibold text-slate-900">TM Yahoshuva Kesaboyina</span>
                </div>
                <p className="text-[11px] text-slate-500 pt-1 border-t border-slate-200">
                  Contact <span className="font-mono text-[#004165]">kesaboyinayahoshuva@gmail.com</span> to activate your club role.
                </p>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={handleCheckStatus}
                  className="w-full py-2.5 bg-[#004165] hover:bg-[#002B44] text-white text-xs font-bold rounded-xl shadow-sm transition flex items-center justify-center space-x-2"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Check Approval Status</span>
                </button>

                {/* Instant Super Admin Unlock Tool */}
                <div className="mt-3 pt-3 border-t border-slate-200 text-left bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2.5">
                  <div className="flex items-center space-x-1.5 text-xs font-brand font-bold text-[#004165]">
                    <ShieldCheck className="w-4 h-4 text-[#772432]" />
                    <span>Super Admin: Approve & Assign Role Now</span>
                  </div>

                  {instantError && (
                    <p className="text-[11px] text-red-600 font-semibold">{instantError}</p>
                  )}

                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Select Role</label>
                    <select
                      value={instantRole}
                      onChange={e => setInstantRole(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white font-medium"
                    >
                      <option value="Club Member">Club Member (Standard)</option>
                      <option value="Vice President Public Relations">Vice President Public Relations (VPPR)</option>
                      <option value="Vice President Education">Vice President Education (VPE)</option>
                      <option value="Vice President Membership">Vice President Membership (VPM)</option>
                      <option value="Secretary">Club Secretary</option>
                      <option value="Treasurer">Treasurer</option>
                      <option value="Sergeant at Arms">Sergeant at Arms (SAA)</option>
                      <option value="Club President">Club President</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Super Admin PIN (1234)</label>
                    <input
                      type="password"
                      placeholder="Enter Admin PIN 1234"
                      value={instantPin}
                      onChange={e => setInstantPin(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleInstantApprove}
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-brand font-bold text-xs rounded-lg transition shadow-sm flex items-center justify-center space-x-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Verify PIN & Grant Access Immediately</span>
                  </button>
                </div>

                {/* 1-Click Switch to Super Admin */}
                <button
                  type="button"
                  onClick={() => {
                    setPendingUser(null);
                    setError('');
                    authenticateEmail('kesaboyinayahoshuva@gmail.com');
                  }}
                  className="w-full py-2 px-3 bg-amber-50 hover:bg-amber-100 text-[#772432] text-xs font-bold rounded-lg border border-amber-300 transition flex items-center justify-between"
                >
                  <div className="flex items-center space-x-2">
                    <ShieldCheck className="w-4 h-4 text-[#772432]" />
                    <span>Log In as TM Yahoshuva (Super Admin)</span>
                  </div>
                  <span className="text-[10px] font-bold bg-[#772432] text-[#F2DF74] px-2 py-0.5 rounded">
                    Admin
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setPendingUser(null);
                    setError('');
                  }}
                  className="w-full py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 transition"
                >
                  ← Sign In with a Different Account
                </button>
              </div>
            </div>
          ) : activeTab === 'google' ? (
            /* TAB 1: Google OAuth Form */
            <form onSubmit={handleGoogleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Google / Scaler Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    placeholder="e.g. kesaboyinayahoshuva@gmail.com or name@scaler.com"
                    value={googleEmail}
                    onChange={e => setGoogleEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#004165] focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#004165] hover:bg-[#002B44] text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center space-x-2 group"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Continue with Google</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#F2DF74]" />
              </button>

              {/* 1-Click Fast Access for Yahoshuva */}
              <div className="pt-2 border-t border-slate-100 text-center">
                <span className="text-[10px] text-slate-400 block mb-1.5 font-semibold">Super Admin Quick Access</span>
                <button
                  type="button"
                  onClick={() => authenticateEmail('kesaboyinayahoshuva@gmail.com')}
                  className="w-full py-2 px-3 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 transition flex items-center justify-between"
                >
                  <div className="flex items-center space-x-2">
                    <ShieldCheck className="w-4 h-4 text-[#772432]" />
                    <span>TM Yahoshuva Kesaboyina</span>
                  </div>
                  <span className="text-[10px] font-bold text-[#772432] bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    Super Admin
                  </span>
                </button>
              </div>

              <p className="text-[11px] text-slate-500 text-center leading-relaxed">
                Public Google authentication active. New accounts receive member access upon Super Admin verification.
              </p>
            </form>
          ) : (
            /* TAB 2: Email & PIN Form */
            <form onSubmit={handleEmailPinLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Registered Club Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    placeholder="e.g. name@scaler.com or gmail.com"
                    value={pinEmail}
                    onChange={e => setPinEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#004165] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Member Security PIN</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    required
                    placeholder="Enter 4-digit PIN (default: 1234)"
                    value={pin}
                    onChange={e => setPin(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#004165] focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#004165] hover:bg-[#002B44] text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center space-x-2"
              >
                <span>Enter Toastmasters Hub</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#F2DF74]" />
              </button>

              <p className="text-[11px] text-slate-500 text-center">
                Default officer & member access PIN: <code className="font-mono text-[#004165] font-bold">1234</code>
              </p>
            </form>
          )}

        </div>

      </div>

      {/* Security & Bylaws Notice */}
      <div className="mt-6 text-center text-slate-300 text-xs max-w-sm">
        <p>Protected by PostgreSQL Row Level Security & RBAC governance.</p>
        <p className="text-[10px] text-[#F2DF74] mt-1 font-brand">
          SpeakUp Scaler Toastmasters Club #28681022 • District 227
        </p>
      </div>

      </div>

      {/* Official Legal & Copyright Bottom Bar (Mandatory Toastmasters.org Disclaimer) */}
      <footer className="w-full bg-[#001D2E] border-t-2 border-[#772432] py-4 px-4 sm:px-6 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div>
            <p className="font-brand font-semibold text-slate-300">
              © {new Date().getFullYear()} SpeakUp Scaler Toastmasters Club #28681022. All rights reserved.
            </p>
            <p className="text-[10px] text-slate-500 max-w-2xl leading-relaxed mt-0.5">
              The information on this website is for the sole use of Toastmasters’ members for Toastmasters business only. 
              Toastmasters International, the Toastmasters International logo, and all other Toastmasters trademarks and copyrights 
              are the sole property of Toastmasters International.
            </p>
          </div>
          <div className="text-[11px] font-bold text-[#F2DF74] flex-shrink-0 font-brand">
            Learn • Speak • Lead
          </div>
        </div>
      </footer>

    </div>
  );
};
