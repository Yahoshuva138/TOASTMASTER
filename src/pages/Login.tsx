import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Mail, 
  Lock, 
  AlertCircle, 
  ArrowRight, 
  X, 
  Clock, 
  UserCheck, 
  UserPlus, 
  CheckCircle2, 
  RefreshCw 
} from 'lucide-react';
import { Profile } from '../types/database.types';

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
  const [email, setEmail] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [customGoogleEmail, setCustomGoogleEmail] = useState('');
  const [customGoogleName, setCustomGoogleName] = useState('');
  const [pendingUser, setPendingUser] = useState<Profile | null>(null);

  // Check if an email belongs to Super Admin
  const isSuperAdminEmail = (rawEmail: string) => {
    const e = rawEmail.toLowerCase().trim();
    return (
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
      setError('Please enter a valid email address.');
      return;
    }

    // 1. Super Admin instant access
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
      setShowGoogleModal(false);
      onLoginSuccess(superAdminProfile);
      return;
    }

    // 2. Check existing member roster
    const matched = members.find(m => m.email.toLowerCase() === cleanEmail);

    if (matched) {
      if (matched.accessStatus === 'approved' || (matched.isActive && matched.accessStatus !== 'pending')) {
        // Access has been granted by Super Admin with assigned role!
        setShowGoogleModal(false);
        onLoginSuccess(matched);
      } else {
        // Registered but still pending approval
        setShowGoogleModal(false);
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
      setShowGoogleModal(false);
      setPendingUser(newPendingProfile);
    }
  };

  // Re-check pending status
  const handleCheckStatus = () => {
    if (!pendingUser) return;
    const cleanEmail = pendingUser.email.toLowerCase().trim();

    if (isSuperAdminEmail(cleanEmail)) {
      authenticateEmail(cleanEmail);
      return;
    }

    const matched = members.find(m => m.email.toLowerCase() === cleanEmail);
    if (matched && (matched.accessStatus === 'approved' || matched.isActive)) {
      setPendingUser(null);
      onLoginSuccess(matched);
    } else {
      setError('Your access request is still pending Super Admin review. Please contact TM Yahoshuva Kesaboyina.');
    }
  };

  // Direct Email & PIN Login form handler
  const handleEmailPinLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin !== '1234' && pin !== 'admin') {
      setError('Incorrect PIN. (Default member PIN: 1234)');
      return;
    }
    authenticateEmail(email);
  };

  // Prominent pre-authorized accounts for one-click testing
  const quickAccounts = [
    {
      name: 'TM Yahoshuva Kesaboyina',
      email: 'yahoshuva.kesaboyina@scaler.com',
      role: '🛡️ Super Admin',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'
    },
    {
      name: 'TM Arunima Vats',
      email: 'arunima.vats@scaler.com',
      role: '👑 Club President',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80'
    },
    {
      name: 'TM Shakthi Sivapriya',
      email: 'shakthi.sivapriya@scaler.com',
      role: 'VP Education',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&auto=format&fit=crop&q=80'
    },
    {
      name: 'TM Ashish Patel',
      email: 'ashish.patel@scaler.com',
      role: 'Sergeant at Arms',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#004165] via-[#002B44] to-slate-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95">
        
        {/* Brand Header */}
        <div className="bg-[#004165] p-8 text-center text-white relative">
          <div className="w-16 h-16 rounded-2xl bg-[#772432] border-2 border-[#F2DF74] mx-auto flex items-center justify-center shadow-lg mb-3">
            <span className="text-[#F2DF74] text-3xl font-black">T</span>
            <span className="text-white text-3xl font-black">M</span>
          </div>
          <h1 className="text-xl font-black tracking-wide uppercase text-white">TOASTMASTERS TASK HUB</h1>
          <p className="text-xs text-slate-300 mt-1 font-medium">SpeakUp Scaler Toastmasters Club</p>
          <p className="text-[11px] text-[#F2DF74] mt-0.5 font-semibold">Learn • Speak • Lead</p>
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
                <span className="text-xs font-bold uppercase text-amber-800 tracking-wider block">Access Status</span>
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
                  Contact <span className="font-mono text-[#004165]">yahoshuva.kesaboyina@scaler.com</span> to activate your club role.
                </p>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  onClick={handleCheckStatus}
                  className="w-full py-2.5 bg-[#004165] hover:bg-[#002B44] text-white text-xs font-bold rounded-xl shadow-sm transition flex items-center justify-center space-x-2"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Check Approval Status</span>
                </button>

                <button
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
          ) : (
            /* VIEW: Standard Sign In Form */
            <>
              {/* Continue with Google Button */}
              <div>
                <button
                  onClick={() => setShowGoogleModal(true)}
                  className="w-full py-3 px-4 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs rounded-xl border border-slate-300 shadow-sm transition flex items-center justify-center space-x-3 group"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>Sign in with Google</span>
                </button>

                <div className="mt-2 text-[10px] text-center text-slate-500">
                  Enter any Google / Scaler email. Roles are granted and managed by the Super Admin.
                </div>
              </div>

              {/* Divider */}
              <div className="relative flex items-center justify-center">
                <div className="border-t border-slate-200 w-full"></div>
                <span className="bg-white px-3 text-[10px] font-bold uppercase text-slate-400 absolute">
                  Or Sign In with Email & PIN
                </span>
              </div>

              {/* Direct Email & PIN Form */}
              <form onSubmit={handleEmailPinLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="email"
                      required
                      placeholder="e.g. yourname@gmail.com or @scaler.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#004165] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Member PIN</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="password"
                      required
                      placeholder="Enter 4-digit PIN (default: 1234)"
                      value={pin}
                      onChange={e => setPin(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#004165] focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#004165] hover:bg-[#002B44] text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center space-x-2"
                >
                  <span>Enter Toastmasters Hub</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#F2DF74]" />
                </button>
              </form>
            </>
          )}

        </div>

      </div>

      {/* IN-APP GOOGLE ACCOUNT SELECTOR MODAL (Replaces browser window.prompt completely) */}
      {showGoogleModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span className="font-bold text-sm text-slate-800">Sign in with Google</span>
              </div>
              <button 
                onClick={() => setShowGoogleModal(false)}
                className="text-slate-400 hover:text-slate-600 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <p className="text-xs text-slate-600">
                Choose a recognized Toastmasters officer account or type any Google email:
              </p>

              {/* Quick Officer Accounts */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Authorized Officer Accounts</span>
                <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-slate-50/50">
                  {quickAccounts.map(acc => (
                    <div
                      key={acc.email}
                      onClick={() => authenticateEmail(acc.email, acc.name)}
                      className="p-2.5 flex items-center justify-between hover:bg-slate-100 transition cursor-pointer"
                    >
                      <div className="flex items-center space-x-2.5">
                        <img src={acc.avatar} alt={acc.name} className="w-7 h-7 rounded-full object-cover border border-[#F2DF74]" />
                        <div>
                          <span className="font-bold text-xs text-slate-900 block leading-tight">{acc.name}</span>
                          <span className="text-[10px] text-slate-500 leading-tight">{acc.email}</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-[#772432] bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        {acc.role}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Enter ANY Custom Email Form */}
              <div className="pt-2 border-t border-slate-100 space-y-3">
                <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block">Or Enter Any Email Address</span>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Email (Google / Scaler)</label>
                  <input
                    type="email"
                    placeholder="e.g. newmember@gmail.com or colleague@scaler.com"
                    value={customGoogleEmail}
                    onChange={e => setCustomGoogleEmail(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#004165] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Your Name (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. John Doe"
                    value={customGoogleName}
                    onChange={e => setCustomGoogleName(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#004165] focus:outline-none"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => authenticateEmail(customGoogleEmail, customGoogleName)}
                  className="w-full py-2.5 bg-[#004165] hover:bg-[#002B44] text-white font-bold text-xs rounded-xl shadow-sm transition"
                >
                  Continue with this Account →
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};
