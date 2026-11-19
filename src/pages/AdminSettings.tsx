import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  ShieldCheck, 
  Database, 
  Key, 
  CheckCircle2, 
  Copy, 
  ExternalLink,
  Wifi,
  WifiOff,
  AlertTriangle,
  RefreshCw,
  Server
} from 'lucide-react';
import { Profile } from '../types/database.types';
import { 
  getActiveSupabaseUrl, 
  getActiveSupabaseAnonKey, 
  isSupabaseConfigured,
  updateSupabaseCredentials,
  clearSupabaseCredentials,
  testSupabaseConnection 
} from '../lib/supabaseClient';

interface AdminSettingsProps {
  currentUser: Profile;
}

export const AdminSettings: React.FC<AdminSettingsProps> = ({
  currentUser
}) => {
  const [supabaseUrl, setSupabaseUrl] = useState(getActiveSupabaseUrl());
  const [anonKey, setAnonKey] = useState(getActiveSupabaseAnonKey());
  const [isConfigured, setIsConfigured] = useState(isSupabaseConfigured());
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const handleSaveConnection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabaseUrl.trim() || !anonKey.trim()) return;

    updateSupabaseCredentials(supabaseUrl.trim(), anonKey.trim());
    setIsConfigured(isSupabaseConfigured());
    
    // Test the new connection
    setIsTesting(true);
    const res = await testSupabaseConnection();
    setTestResult(res);
    setIsTesting(false);
  };

  const handleResetDemo = () => {
    clearSupabaseCredentials();
    setSupabaseUrl(getActiveSupabaseUrl());
    setAnonKey(getActiveSupabaseAnonKey());
    setIsConfigured(false);
    setTestResult({ success: true, message: 'Reset to local browser storage fallback.' });
  };

  const handleTestOnly = async () => {
    setIsTesting(true);
    const res = await testSupabaseConnection();
    setTestResult(res);
    setIsTesting(false);
  };

  const copyToClipboard = (text: string, sectionId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionId);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const sqlSchemaSnippet = `-- 1. Club Members Table
CREATE TABLE IF NOT EXISTS public.members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  pathway TEXT,
  role_title TEXT DEFAULT 'Member',
  joined_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Upcoming Meetings Table
CREATE TABLE IF NOT EXISTS public.meetings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  meeting_number INT NOT NULL,
  meeting_date DATE NOT NULL,
  theme TEXT NOT NULL,
  word_of_the_day TEXT,
  location_or_link TEXT,
  status TEXT DEFAULT 'upcoming',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Meeting Role Sign-ups Table
CREATE TABLE IF NOT EXISTS public.role_signups (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  meeting_id UUID REFERENCES public.meetings(id) ON DELETE CASCADE,
  member_id UUID,
  member_name TEXT NOT NULL,
  member_email TEXT NOT NULL,
  role_name TEXT NOT NULL,
  speech_title TEXT,
  pathway_project TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_signups ENABLE ROW LEVEL SECURITY;

-- 5. Public & Authenticated Access Policies
CREATE POLICY "Public can view meetings" ON public.meetings FOR SELECT USING (true);
CREATE POLICY "Public can view role signups" ON public.role_signups FOR SELECT USING (true);
CREATE POLICY "Anyone can insert role signups" ON public.role_signups FOR ALL USING (true);
CREATE POLICY "Members view access" ON public.members FOR SELECT USING (true);`;

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-3.5">
        <div className="w-12 h-12 rounded-xl bg-slate-50 p-1.5 border border-slate-200 shadow-sm flex items-center justify-center flex-shrink-0">
          <img 
            src="/toastmasters-logo.svg" 
            alt="Toastmasters" 
            className="w-full h-full object-contain" 
          />
        </div>
        <div>
          <div className="flex items-center space-x-2 text-[#004165] mb-0.5">
            <span className="text-[11px] font-brand font-bold uppercase tracking-wider">Enterprise Administration</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-brand font-black text-[#004165]">
            Toastmasters Hub Database & Supabase Configuration
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Connect your live Supabase PostgreSQL backend, manage Google OAuth, and synchronize club member data
          </p>
        </div>
      </div>

      {/* Live Supabase Connection Manager */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2.5">
            <Database className="w-5 h-5 text-[#004165]" />
            <div>
              <h3 className="font-brand font-bold text-base text-slate-900">
                Supabase Live Cloud Connection
              </h3>
              <p className="text-xs text-slate-500">
                Connect your free Supabase PostgreSQL database to sync members, tasks, and meetings across devices in real time.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className={`text-xs font-brand font-bold px-3 py-1 rounded-full flex items-center space-x-1.5 border ${
              isConfigured 
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300' 
                : 'bg-amber-50 text-amber-800 border-amber-300'
            }`}>
              {isConfigured ? <Wifi className="w-3.5 h-3.5 text-emerald-600" /> : <WifiOff className="w-3.5 h-3.5 text-amber-600" />}
              <span>{isConfigured ? 'Live Cloud Supabase' : 'Offline / Local Fallback'}</span>
            </span>
          </div>
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleSaveConnection} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-brand font-bold uppercase text-slate-700 mb-1">
                Supabase Project URL *
              </label>
              <input
                type="url"
                required
                placeholder="https://your-project-id.supabase.co"
                value={supabaseUrl}
                onChange={e => setSupabaseUrl(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#004165] focus:outline-none font-mono"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Found in Supabase Dashboard → Project Settings → API
              </span>
            </div>

            <div>
              <label className="block text-xs font-brand font-bold uppercase text-slate-700 mb-1">
                Anon / Public API Key *
              </label>
              <input
                type="text"
                required
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                value={anonKey}
                onChange={e => setAnonKey(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#004165] focus:outline-none font-mono"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Public anon key with Row Level Security enabled
              </span>
            </div>
          </div>

          {testResult && (
            <div className={`p-3.5 rounded-xl border text-xs flex items-center space-x-2 ${
              testResult.success 
                ? 'bg-emerald-50 text-emerald-900 border-emerald-200' 
                : 'bg-red-50 text-red-900 border-red-200'
            }`}>
              {testResult.success ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0" />
              )}
              <span>{testResult.message}</span>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex items-center space-x-2">
              <button
                type="submit"
                disabled={isTesting}
                className="px-4 py-2 bg-[#004165] hover:bg-[#002B44] text-white font-brand font-bold text-xs rounded-lg shadow-sm transition flex items-center space-x-1.5"
              >
                {isTesting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Server className="w-3.5 h-3.5 text-[#F2DF74]" />}
                <span>Save & Connect Supabase</span>
              </button>

              <button
                type="button"
                onClick={handleTestOnly}
                disabled={isTesting}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-brand font-semibold text-xs rounded-lg transition"
              >
                Test Connection
              </button>
            </div>

            <button
              type="button"
              onClick={handleResetDemo}
              className="text-xs text-slate-500 hover:text-slate-800 underline font-medium"
            >
              Reset to Demo Mode
            </button>
          </div>
        </form>
      </div>

      {/* SQL Setup Instructions & Copyable Query */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Key className="w-5 h-5 text-[#772432]" />
            <h3 className="font-brand font-bold text-base text-slate-900">
              Supabase SQL Editor: Table Schema & RLS Policies
            </h3>
          </div>

          <button
            onClick={() => copyToClipboard(sqlSchemaSnippet, 'sql-schema')}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-[#004165] font-brand font-bold text-xs rounded-lg transition flex items-center space-x-1"
          >
            {copiedSection === 'sql-schema' ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy SQL Query</span>
              </>
            )}
          </button>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          Open your <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer" className="text-[#004165] font-bold underline inline-flex items-center space-x-0.5"><span>Supabase Dashboard</span><ExternalLink className="w-3 h-3" /></a>, go to <strong>SQL Editor → New Query</strong>, and run the following script:
        </p>

        <pre className="p-4 bg-slate-900 text-slate-100 text-[11px] font-mono rounded-xl overflow-x-auto leading-relaxed border border-slate-800 max-h-64">
          {sqlSchemaSnippet}
        </pre>
      </div>

      {/* Super Admin Bootstrap Notice */}
      <div className="p-5 bg-blue-50 rounded-2xl border border-blue-200 text-xs text-blue-900 space-y-1">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-[#004165]" />
          <span className="font-brand font-bold text-sm text-[#004165]">
            Super Admin Account Verified
          </span>
        </div>
        <p className="text-blue-800 leading-relaxed mt-1">
          Super Admin is permanently mapped to <strong className="text-[#004165]">yahoshuva.kesaboyina@scaler.com</strong>.
          Public registration is active, and new users strictly receive the <span className="font-bold">Member</span> role with zero administrative authority until you approve and assign them a role.
        </p>
      </div>

    </div>
  );
};
