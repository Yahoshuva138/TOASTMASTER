import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Mail, 
  Lock, 
  AlertCircle, 
  ArrowRight, 
  Clock, 
  CheckCircle2, 
  RefreshCw,
  Info
} from 'lucide-react';
import { Profile, Department, UserSystemRole } from '../types/database.types';
import { 
  syncAccessRequestToCloud, 
  checkCloudApprovalStatus 
} from '../lib/cloudSync';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

interface LoginProps {
  onLoginSuccess: (user: Profile) => void;
  onRequestAccess: (pendingUser: Profile) => void;
  onApprovePendingMember?: (memberId: string, role: UserSystemRole, clubRole: string, departmentId: string) => void;
  members: Profile[];
  departments?: Department[];
}

export const Login: React.FC<LoginProps> = ({
  onLoginSuccess,
  onRequestAccess,
  members
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [pendingUser, setPendingUser] = useState<Profile | null>(null);
  const [statusMessage, setStatusMessage] = useState('');
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [googleModalEmail, setGoogleModalEmail] = useState('');

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
    setStatusMessage('');
    const cleanEmail = inputEmail.toLowerCase().trim();

    if (!cleanEmail || !cleanEmail.includes('@')) {
      setError('Please enter a valid Google or club email address.');
      return;
    }

    // 1. Super Admin instant verified access
    if (isSuperAdminEmail(cleanEmail)) {
      const superAdminProfile: Profile = {
        id: 'user-yahoshuva',
        email: 'kesaboyinayahoshuva@gmail.com',
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

  // Google OAuth / Google Sign-In Action
  const handleGoogleSignIn = async () => {
    setError('');
    setStatusMessage('');

    if (isSupabaseConfigured()) {
      setLoading(true);
      try {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: window.location.origin
          }
        });
        if (error) {
          console.warn('Supabase OAuth error, falling back to direct Google sign-in:', error.message);
          setShowGoogleModal(true);
        }
      } catch (err: any) {
        setShowGoogleModal(true);
      } finally {
        setLoading(false);
      }
    } else {
      // Direct Google Account input dialog
      setShowGoogleModal(true);
    }
  };

  // Submit from Google Account Selector
  const handleGoogleModalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!googleModalEmail.trim()) {
      setError('Please provide your Google email address.');
      return;
    }
    setShowGoogleModal(false);
    authenticateEmail(googleModalEmail);
  };

  // Email & Password/PIN form submit
  const handleEmailPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }
    authenticateEmail(email);
  };

  // Re-check pending status (checks both Live Cloud Supabase and local store)
  const handleCheckStatus = async () => {
    if (!pendingUser) return;
    setLoading(true);
    const cleanEmail = pendingUser.email.toLowerCase().trim();

    if (isSuperAdminEmail(cleanEmail)) {
      authenticateEmail(cleanEmail);
      setLoading(false);
      return;
    }

    // 1. Check in Cloud Supabase first
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
      setLoading(false);
      onLoginSuccess(fullProfile);
      return;
    }

    // 2. Check in local members list
    const matched = members.find(m => m.email.toLowerCase() === cleanEmail);
    if (matched && (matched.accessStatus === 'approved' || matched.isActive)) {
      setPendingUser(null);
      setLoading(false);
      onLoginSuccess(matched);
    } else {
      setLoading(false);
      setStatusMessage('Your request is in the queue. TM Yahoshuva Kesaboyina has not yet approved it.');
    }
  };

  return (
    <div className="min-h-screen bg-[#004165] flex flex-col justify-between">
      
      {/* Top Utility Bar (Toastmasters International Standard) */}
      <div className="w-full bg-[#002B44] text-slate-200 text-xs py-2.5 px-4 border-b border-[#001D2E]">
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
          
          <div className="p-8 space-y-6">
            
            {error && (
              <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl flex items-center space-x-2 border border-red-200 animate-in fade-in">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {statusMessage && (
              <div className="p-3 bg-amber-50 text-amber-800 text-xs rounded-xl flex items-center space-x-2 border border-amber-200 animate-in fade-in">
                <Info className="w-4 h-4 flex-shrink-0 text-amber-600" />
                <span>{statusMessage}</span>
              </div>
            )}

            {/* PENDING APPROVAL VIEW */}
            {pendingUser ? (
              <div className="space-y-4 text-center">
                <div className="w-16 h-16 rounded-full bg-amber-100 border-2 border-amber-400 mx-auto flex items-center justify-center text-amber-700 animate-pulse">
                  <Clock className="w-8 h-8" />
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase text-amber-800 tracking-wider block">Access Status</span>
                  <h3 className="text-lg font-bold text-slate-900 mt-0.5">Approval & Role Assignment Required</h3>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                    Your account <span className="font-bold text-slate-900">{pendingUser.email}</span> is registered.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-left text-xs space-y-2">
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Assigned Role:</span>
                    <span className="font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      Pending Super Admin Assignment
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Authorized Approver:</span>
                    <span className="font-semibold text-slate-900">TM Yahoshuva Kesaboyina</span>
                  </div>
                  <p className="text-[11px] text-slate-500 pt-1.5 border-t border-slate-200 leading-relaxed">
                    Access to club records is restricted. Contact <span className="font-mono text-[#004165] font-semibold">kesaboyinayahoshuva@gmail.com</span> to get your leadership role approved.
                  </p>
                </div>

                <div className="space-y-2.5 pt-2">
                  <button
                    type="button"
                    onClick={handleCheckStatus}
                    disabled={loading}
                    className="w-full py-2.5 bg-[#004165] hover:bg-[#002B44] text-white text-xs font-bold rounded-xl shadow transition flex items-center justify-center space-x-2 disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                    <span>{loading ? 'Checking Status...' : 'Check Approval Status'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setPendingUser(null);
                      setError('');
                      setStatusMessage('');
                    }}
                    className="w-full py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 transition"
                  >
                    ← Sign In with a Different Account
                  </button>
                </div>
              </div>
            ) : (
              /* STANDARD LOGIN VIEW */
              <div className="space-y-5">
                
                <div className="text-center">
                  <h2 className="text-xl font-brand font-bold text-slate-900">Sign In to Your Account</h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Sign in with Google to access club tasks, agendas, and manuals
                  </p>
                </div>

                {/* OFFICIAL GOOGLE SIGN-IN BUTTON */}
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  className="w-full py-3 px-4 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold rounded-xl border border-slate-300 shadow-sm transition flex items-center justify-center space-x-3 active:scale-[0.99]"
                >
                  <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>Sign in with Google</span>
                </button>

                {/* DIVIDER */}
                <div className="relative flex items-center justify-center">
                  <div className="border-t border-slate-200 w-full"></div>
                  <span className="bg-white px-3 text-[11px] uppercase tracking-wider text-slate-400 font-semibold absolute">
                    or continue with email
                  </span>
                </div>

                {/* EMAIL & PASSWORD / PIN FORM */}
                <form onSubmit={handleEmailPasswordSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your.email@gmail.com"
                        className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#004165] transition"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold text-slate-700 uppercase">
                        Password or PIN
                      </label>
                      <span className="text-[10px] text-slate-400">Default PIN: 1234</span>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#004165] transition"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-[#004165] hover:bg-[#002B44] text-white font-brand font-bold text-xs rounded-xl transition shadow flex items-center justify-center space-x-1.5"
                  >
                    <span>Sign In</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>

                <div className="pt-2 text-center text-[11px] text-slate-500">
                  <p>Club member access is granted by Super Admin.</p>
                  <p className="mt-0.5 text-slate-400">Admin Email: kesaboyinayahoshuva@gmail.com</p>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>

      {/* GOOGLE ACCOUNT INPUT MODAL (Used for clean Google account entry/selection) */}
      {showGoogleModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="text-center space-y-2 mb-5">
              <svg className="w-8 h-8 mx-auto" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <h3 className="font-brand font-bold text-slate-900 text-base">Sign in with Google</h3>
              <p className="text-xs text-slate-500">
                Choose or enter your Google account to continue to Toastmasters Task Hub
              </p>
            </div>

            <form onSubmit={handleGoogleModalSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  Google Account Email
                </label>
                <input
                  type="email"
                  value={googleModalEmail}
                  onChange={(e) => setGoogleModalEmail(e.target.value)}
                  placeholder="e.g. kesaboyinayahoshuva@gmail.com"
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#004165]"
                  autoFocus
                  required
                />
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowGoogleModal(false)}
                  className="flex-1 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-[#004165] hover:bg-[#002B44] text-white text-xs font-bold rounded-xl shadow"
                >
                  Continue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer Branding */}
      <div className="w-full bg-[#002B44] text-slate-400 text-[11px] py-4 px-4 border-t border-[#001D2E] text-center">
        <p className="font-brand font-semibold text-slate-300">
          Toastmasters International • SpeakUp Scaler Toastmasters Club #28681022
        </p>
        <p className="text-[10px] text-slate-500 mt-0.5">
          Official Toastmasters Club Governance • Super Admin: TM Yahoshuva Kesaboyina
        </p>
      </div>

    </div>
  );
};
