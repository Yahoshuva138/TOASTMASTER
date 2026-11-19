import React from 'react';
import { Settings, ShieldCheck, Database, Key, CheckCircle2, Copy } from 'lucide-react';
import { Profile } from '../types/database.types';

interface AdminSettingsProps {
  currentUser: Profile;
}

export const AdminSettings: React.FC<AdminSettingsProps> = ({
  currentUser
}) => {
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
            <span className="text-xs font-bold uppercase tracking-wider">Enterprise Administration</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900">Toastmasters Hub Administration & Security</h1>
          <p className="text-xs text-slate-500">
            Super Admin configuration, Google OAuth credentialing, Supabase migration guides, and private evidence storage
          </p>
        </div>
      </div>

      {/* Supabase & OAuth Setup Instructions */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="font-bold text-slate-900 text-base flex items-center space-x-2">
          <Database className="w-5 h-5 text-[#004165]" />
          <span>Production Supabase & Google OAuth Configuration</span>
        </h3>

        <div className="space-y-3 text-xs text-slate-700 leading-relaxed">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="font-bold block text-slate-900 mb-1">Step 1: Execute Database Schema</span>
            <p>
              In your Supabase project SQL Editor, run the master schema file located at 
              <code className="text-[#004165] font-semibold mx-1">supabase/schema.sql</code>. 
              This configures PostgreSQL tables, enums, triggers, and Row Level Security.
            </p>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="font-bold block text-slate-900 mb-1">Step 2: Bootstrap First Super Admin</span>
            <p>
              After signing in with your Google account once, run 
              <code className="text-[#004165] font-semibold mx-1">supabase/admin_bootstrap.sql</code> 
              to promote <span className="font-bold">yahoshuva.kesaboyina@scaler.com</span> to 🛡️ Super Admin.
            </p>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="font-bold block text-slate-900 mb-1">Step 3: Private Evidence Storage Bucket</span>
            <p>
              Ensure the private bucket <code className="text-[#004165] font-semibold mx-1">task-evidence</code> is provisioned with RLS policies allowing authenticated uploads.
            </p>
          </div>
        </div>
      </div>

      {/* Access Settings Notice */}
      <div className="p-5 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-900 space-y-1">
        <span className="font-bold text-sm block text-emerald-950">Strict Access Control Active</span>
        <p>
          Public Google registration is permitted, but new users strictly receive the <span className="font-bold">Member</span> role with zero administrative authority. No member can elevate their own privileges.
        </p>
      </div>

    </div>
  );
};
