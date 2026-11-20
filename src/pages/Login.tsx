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
  Info,
  User,
  Phone,
  Github,
  Globe,
  Sparkles,
  BookOpen
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
  members,
  departments = []
}) => {
  // Mode: Sign In vs Sign Up (Register)
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');

  // Sign In Form State
  const [signinEmail, setSigninEmail] = useState('');
  const [signinPassword, setSigninPassword] = useState('');

  // Sign Up (Register) Form State
  const [signupFullName, setSignupFullName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [signupRole, setSignupRole] = useState('Club Member');
  const [signupDepartment, setSignupDepartment] = useState('Public Relations & Media');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupGithub, setSignupGithub] = useState('');
  const [signupPortfolio, setSignupPortfolio] = useState('');
  const [signupBio, setSignupBio] = useState('');

  // UI / Status State
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [pendingUser, setPendingUser] = useState<Profile | null>(null);
  const [statusMessage, setStatusMessage] = useState('');
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [googleModalEmail, setGoogleModalEmail] = useState('');

  // Helpers for Local Credential Storage
  const getStoredCredentials = (): Record<string, string> => {
    try {
      const raw = localStorage.getItem('tm_auth_credentials');
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  };

  const saveStoredCredential = (userEmail: string, pass: string) => {
    try {
      const creds = getStoredCredentials();
      creds[userEmail.toLowerCase().trim()] = pass;
      localStorage.setItem('tm_auth_credentials', JSON.stringify(creds));
    } catch (e) {
      console.warn('Failed to save credential locally:', e);
    }
  };

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

  // 1. SIGN IN SUBMIT HANDLER
  const handleSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setStatusMessage('');

    const cleanEmail = signinEmail.toLowerCase().trim();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!signinPassword) {
      setError('Please enter your password.');
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
        githubUrl: 'https://github.com/Yahoshuva138',
        linkedinUrl: 'https://linkedin.com/in/yahoshuva',
        portfolioUrl: 'https://yahoshuva.dev',
        statusMessage: '🟢 Available for Table Topics & General Evaluator',
        attendanceStreak: 8,
        speechStreak: 4,
        rolesStreak: 6,
        createdAt: '2026-10-01T10:00:00Z',
        updatedAt: new Date().toISOString()
      };
      onLoginSuccess(superAdminProfile);
      return;
    }

    // 2. Check if user exists in club roster
    const matched = members.find(m => m.email.toLowerCase() === cleanEmail);

    if (!matched) {
      setError('No account found with this email. Please switch to "Create Club Account" to register.');
      return;
    }

    // 3. Password Verification
    const creds = getStoredCredentials();
    const storedPass = creds[cleanEmail];

    if (storedPass && storedPass !== signinPassword) {
      setError('Invalid password. Please check your credentials and try again.');
      return;
    }

    // If no password was saved yet for this existing member, store it for future logins
    if (!storedPass) {
      saveStoredCredential(cleanEmail, signinPassword);
    }

    // 4. Check Access Status
    if (matched.accessStatus === 'pending' || (!matched.isActive && matched.accessStatus !== 'approved')) {
      setPendingUser(matched);
      setStatusMessage('Your account is registered but pending Super Admin acceptance and role assignment.');
      return;
    }

    // 5. Approved Member Login
    onLoginSuccess(matched);
  };

  // 2. SIGN UP / REGISTRATION SUBMIT HANDLER
  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setStatusMessage('');

    const cleanEmail = signupEmail.toLowerCase().trim();

    if (!signupFullName.trim()) {
      setError('Please enter your full name.');
      return;
    }

    if (!cleanEmail || !cleanEmail.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    if (signupPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (signupPassword !== signupConfirmPassword) {
      setError('Passwords do not match. Please re-enter.');
      return;
    }

    // Check if account already exists
    const existing = members.find(m => m.email.toLowerCase() === cleanEmail);
    if (existing) {
      if (existing.accessStatus === 'approved') {
        setError('An account with this email is already registered and approved. Please Sign In.');
        setAuthMode('signin');
        setSigninEmail(cleanEmail);
        return;
      } else {
        setPendingUser(existing);
        setStatusMessage('Your registration is already in the queue awaiting Super Admin approval.');
        return;
      }
    }

    // Save credentials securely in local storage
    saveStoredCredential(cleanEmail, signupPassword);

    // Create New Member Profile with pending access status
    const newPendingProfile: Profile = {
      id: 'user-' + Date.now(),
      email: cleanEmail,
      fullName: signupFullName.trim(),
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      clubRole: signupRole || 'Club Member',
      systemRole: 'member',
      departmentName: signupDepartment || 'General Membership',
      phone: signupPhone.trim(),
      githubUrl: signupGithub.trim(),
      portfolioUrl: signupPortfolio.trim(),
      bio: signupBio.trim() || 'New Toastmasters member ready to learn, speak, and lead.',
      statusMessage: '🟡 Registration Submitted - Pending Super Admin Acceptance',
      attendanceStreak: 1,
      speechStreak: 0,
      rolesStreak: 0,
      isActive: false,
      accessStatus: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Propagate to App state and Cloud sync
    onRequestAccess(newPendingProfile);
    syncAccessRequestToCloud(newPendingProfile);

    // Transition to Pending view with confirmation
    setPendingUser(newPendingProfile);
    setStatusMessage('Registration submitted successfully! Your account is awaiting Super Admin approval.');
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
          console.warn('Supabase OAuth error, falling back to direct Google sign-in dialog:', error.message);
          setShowGoogleModal(true);
        }
      } catch (err: any) {
        setShowGoogleModal(true);
      } finally {
        setLoading(false);
      }
    } else {
      setShowGoogleModal(true);
    }
  };

  // Submit from Google Account Selector
  const handleGoogleModalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = googleModalEmail.toLowerCase().trim();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setError('Please provide a valid Google account email address.');
      return;
    }
    setShowGoogleModal(false);

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
        githubUrl: 'https://github.com/Yahoshuva138',
        linkedinUrl: 'https://linkedin.com/in/yahoshuva',
        portfolioUrl: 'https://yahoshuva.dev',
        statusMessage: '🟢 Available for Table Topics & General Evaluator',
        attendanceStreak: 8,
        speechStreak: 4,
        rolesStreak: 6,
        createdAt: '2026-10-01T10:00:00Z',
        updatedAt: new Date().toISOString()
      };
      onLoginSuccess(superAdminProfile);
      return;
    }

    // 2. Check existing roster
    const matched = members.find(m => m.email.toLowerCase() === cleanEmail);
    if (matched) {
      if (matched.accessStatus === 'approved' || (matched.isActive && matched.accessStatus !== 'pending')) {
        onLoginSuccess(matched);
      } else {
        setPendingUser(matched);
      }
    } else {
      // 3. New Google account: prompt registration or create pending request
      const newPendingProfile: Profile = {
        id: 'user-' + Date.now(),
        email: cleanEmail,
        fullName: cleanEmail.split('@')[0].replace('.', ' ').toUpperCase(),
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
        clubRole: 'Club Member',
        systemRole: 'member',
        departmentName: 'General Membership',
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

  // Re-check pending status
  const handleCheckStatus = async () => {
    if (!pendingUser) return;
    setLoading(true);
    const cleanEmail = pendingUser.email.toLowerCase().trim();

    if (isSuperAdminEmail(cleanEmail)) {
      onLoginSuccess(pendingUser);
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
      setStatusMessage('Your registration is still pending approval. Super Admin TM Yahoshuva Kesaboyina will review your request.');
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
      <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 my-6">
        
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

        {/* Main Authentication Card */}
        <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95">
          
          {/* Dual Tab Switcher: Sign In vs Sign Up */}
          {!pendingUser && (
            <div className="grid grid-cols-2 border-b border-slate-200 bg-slate-50">
              <button
                type="button"
                onClick={() => { setAuthMode('signin'); setError(''); }}
                className={`py-3.5 text-xs font-brand font-bold transition flex items-center justify-center space-x-1.5 ${
                  authMode === 'signin'
                    ? 'bg-white text-[#004165] border-b-2 border-[#004165] shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
              <button
                type="button"
                onClick={() => { setAuthMode('signup'); setError(''); }}
                className={`py-3.5 text-xs font-brand font-bold transition flex items-center justify-center space-x-1.5 ${
                  authMode === 'signup'
                    ? 'bg-white text-[#004165] border-b-2 border-[#004165] shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Create Account (Sign Up)</span>
              </button>
            </div>
          )}

          <div className="p-7 sm:p-8 space-y-5">
            
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

            {/* VIEW 1: PENDING APPROVAL VIEW */}
            {pendingUser ? (
              <div className="space-y-4 text-center">
                <div className="w-16 h-16 rounded-full bg-amber-100 border-2 border-amber-400 mx-auto flex items-center justify-center text-amber-700 animate-pulse">
                  <Clock className="w-8 h-8" />
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase text-amber-800 tracking-wider block">Access Status</span>
                  <h3 className="text-lg font-bold text-slate-900 mt-0.5">Approval & Role Assignment Required</h3>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                    Account <span className="font-bold text-slate-900">{pendingUser.email}</span> is registered.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-left text-xs space-y-2">
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Member Name:</span>
                    <span className="font-bold text-slate-900">{pendingUser.fullName}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Requested Role:</span>
                    <span className="font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      {pendingUser.clubRole || 'Pending Assignment'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Authorized Approver:</span>
                    <span className="font-semibold text-slate-900">TM Yahoshuva Kesaboyina</span>
                  </div>
                  <p className="text-[11px] text-slate-500 pt-1.5 border-t border-slate-200 leading-relaxed">
                    For security, club records are restricted until accepted. Super Admin <span className="font-mono text-[#004165] font-semibold">kesaboyinayahoshuva@gmail.com</span> has been notified.
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
                      setAuthMode('signin');
                    }}
                    className="w-full py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 transition"
                  >
                    ← Sign In with a Different Account
                  </button>
                </div>
              </div>
            ) : authMode === 'signin' ? (
              
              /* VIEW 2: STANDARD SIGN IN */
              <div className="space-y-5">
                
                <div className="text-center">
                  <h2 className="text-xl font-brand font-bold text-slate-900">Sign In to Your Account</h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Access club tasks, agendas, speech evaluations, and evidence vault
                  </p>
                </div>

                {/* GOOGLE SIGN IN BUTTON */}
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  className="w-full py-3 px-4 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold rounded-xl border border-slate-300 shadow-sm transition flex items-center justify-center space-x-3 active:scale-[0.99]"
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
                    or email & password
                  </span>
                </div>

                {/* EMAIL & PASSWORD FORM */}
                <form onSubmit={handleSignInSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="email"
                        value={signinEmail}
                        onChange={(e) => setSigninEmail(e.target.value)}
                        placeholder="your.email@gmail.com"
                        className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#004165] transition"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="password"
                        value={signinPassword}
                        onChange={(e) => setSigninPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#004165] transition"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-[#004165] hover:bg-[#002B44] text-white font-brand font-bold text-xs rounded-xl transition shadow flex items-center justify-center space-x-1.5"
                  >
                    <span>Sign In</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>

                <div className="pt-2 text-center text-xs text-slate-500">
                  <span>Don't have an account? </span>
                  <button
                    type="button"
                    onClick={() => { setAuthMode('signup'); setError(''); }}
                    className="font-bold text-[#004165] hover:underline"
                  >
                    Create Club Account (Sign Up)
                  </button>
                </div>

                <div className="pt-1 text-center text-[11px] text-slate-400">
                  <p>Club Secretary & Super Admin: TM Yahoshuva Kesaboyina</p>
                </div>
              </div>
            ) : (
              
              /* VIEW 3: SIGN UP / REGISTRATION */
              <div className="space-y-4">
                <div className="text-center">
                  <h2 className="text-xl font-brand font-bold text-slate-900">Create Club Account</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Register for SpeakUp Scaler Toastmasters Club #28681022
                  </p>
                </div>

                <form onSubmit={handleSignUpSubmit} className="space-y-3.5">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
                      <input
                        type="text"
                        required
                        value={signupFullName}
                        onChange={(e) => setSignupFullName(e.target.value)}
                        placeholder="e.g. TM Rohan Sharma"
                        className="w-full pl-10 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#004165]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
                      <input
                        type="email"
                        required
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
                        placeholder="rohan@scaler.com / gmail.com"
                        className="w-full pl-10 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#004165]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                        Password *
                      </label>
                      <input
                        type="password"
                        required
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        placeholder="Min 6 characters"
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#004165]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                        Confirm Password *
                      </label>
                      <input
                        type="password"
                        required
                        value={signupConfirmPassword}
                        onChange={(e) => setSignupConfirmPassword(e.target.value)}
                        placeholder="Repeat password"
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#004165]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                        Club Role
                      </label>
                      <select
                        value={signupRole}
                        onChange={(e) => setSignupRole(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#004165] font-semibold"
                      >
                        <option value="Club Member">Club Member</option>
                        <option value="Prepared Speaker">Prepared Speaker</option>
                        <option value="Speech Evaluator">Speech Evaluator</option>
                        <option value="Table Topics Master">Table Topics Master</option>
                        <option value="Vice President Public Relations">VP Public Relations</option>
                        <option value="Vice President Education">VP Education</option>
                        <option value="Vice President Membership">VP Membership</option>
                        <option value="Club Secretary">Club Secretary</option>
                        <option value="Club Treasurer">Club Treasurer</option>
                        <option value="Sergeant at Arms">Sergeant at Arms</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                        Department / Track
                      </label>
                      <select
                        value={signupDepartment}
                        onChange={(e) => setSignupDepartment(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#004165]"
                      >
                        <option value="Public Relations & Media">Public Relations & Media</option>
                        <option value="Presentation Mastery">Presentation Mastery</option>
                        <option value="Education & Meeting Roles">Education & Meeting Roles</option>
                        <option value="Membership Growth">Membership Growth</option>
                        <option value="Finance & Records">Finance & Records</option>
                        <option value="Executive Committee">Executive Committee</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                        Phone / WhatsApp
                      </label>
                      <div className="relative">
                        <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                        <input
                          type="tel"
                          value={signupPhone}
                          onChange={(e) => setSignupPhone(e.target.value)}
                          placeholder="+91 98765 43210"
                          className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#004165]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                        GitHub Profile Link
                      </label>
                      <div className="relative">
                        <Github className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                        <input
                          type="url"
                          value={signupGithub}
                          onChange={(e) => setSignupGithub(e.target.value)}
                          placeholder="https://github.com/..."
                          className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#004165]"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-800 space-y-1">
                    <span className="font-bold flex items-center space-x-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                      <span>Admin Approval Security Notice</span>
                    </span>
                    <p>
                      Your registration will be placed in the queue for Super Admin TM Yahoshuva Kesaboyina to accept and assign club credentials before full access is activated.
                    </p>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-[#004165] hover:bg-[#002B44] text-white font-brand font-bold text-xs rounded-xl transition shadow flex items-center justify-center space-x-1.5"
                  >
                    <span>Submit Registration for Approval</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>

                <div className="pt-2 text-center text-xs text-slate-500">
                  <span>Already have an account? </span>
                  <button
                    type="button"
                    onClick={() => { setAuthMode('signin'); setError(''); }}
                    className="font-bold text-[#004165] hover:underline"
                  >
                    Sign In
                  </button>
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
