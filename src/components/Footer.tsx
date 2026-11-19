import React from 'react';
import { 
  ExternalLink, 
  ShieldCheck, 
  FileText, 
  BookOpen, 
  Award, 
  CheckCircle2, 
  Users, 
  Calendar,
  Lock
} from 'lucide-react';

interface FooterProps {
  onNavigate?: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="w-full bg-[#002B44] text-white border-t-4 border-[#772432] mt-auto">
      {/* Upper 4-Column Directory */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Column 1: Brand & Club Credentials */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-xl bg-white p-1 flex items-center justify-center shadow-md border border-slate-200">
                <img 
                  src="/toastmasters-logo.svg" 
                  alt="Toastmasters International Logo" 
                  className="w-full h-full object-contain" 
                />
              </div>
              <div>
                <span className="font-brand font-black text-base text-white tracking-wide block">
                  TOASTMASTERS
                </span>
                <span className="font-brand font-bold text-[10px] text-[#F2DF74] tracking-widest uppercase block">
                  INTERNATIONAL
                </span>
                <span className="text-[10px] text-slate-300 font-semibold">
                  TASK HUB PORTAL
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              <strong className="text-white">SpeakUp Scaler Toastmasters Club</strong>
              <br />
              Club #28681022 • District 227 • Div E • Area 04
            </p>

            <div className="inline-block bg-[#004165] px-3 py-1.5 rounded-lg border border-[#005580] text-[11px] font-brand font-bold text-[#F2DF74]">
              Where Leaders Are Made
            </div>

            <p className="text-[11px] text-slate-400">
              Official Task Management & Evidence Verification System.
            </p>
          </div>

          {/* Column 2: Platform Navigation */}
          <div className="space-y-3">
            <h4 className="font-brand font-bold text-xs uppercase tracking-wider text-[#F2DF74]">
              Task Hub Navigation
            </h4>
            <ul className="space-y-2 text-xs text-slate-300 font-medium">
              <li>
                <button 
                  onClick={() => onNavigate?.('dashboard')}
                  className="hover:text-white hover:underline transition"
                >
                  Centralized Dashboard
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate?.('all-tasks')}
                  className="hover:text-white hover:underline transition"
                >
                  All Tasks & Kanban View
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate?.('my-tasks')}
                  className="hover:text-white hover:underline transition"
                >
                  My Assigned Tasks
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate?.('review-queue')}
                  className="hover:text-white hover:underline transition"
                >
                  Officer Review Queue
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate?.('evidence-history')}
                  className="hover:text-white hover:underline transition"
                >
                  Evidence Vault & History
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate?.('team-workspaces')}
                  className="hover:text-white hover:underline transition"
                >
                  Department Workspaces
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Handbooks & Official Toolkits */}
          <div className="space-y-3">
            <h4 className="font-brand font-bold text-xs uppercase tracking-wider text-[#F2DF74]">
              Toolkits & Resources
            </h4>
            <ul className="space-y-2 text-xs text-slate-300 font-medium">
              <li>
                <button 
                  onClick={() => onNavigate?.('role-resources')}
                  className="hover:text-white hover:underline transition flex items-center space-x-1.5"
                >
                  <FileText className="w-3.5 h-3.5 text-[#F2DF74]" />
                  <span>Meeting Roles Handbook</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate?.('role-resources')}
                  className="hover:text-white hover:underline transition flex items-center space-x-1.5"
                >
                  <BookOpen className="w-3.5 h-3.5 text-[#F2DF74]" />
                  <span>District 227 Starter Kit</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate?.('role-resources')}
                  className="hover:text-white hover:underline transition flex items-center space-x-1.5"
                >
                  <Award className="w-3.5 h-3.5 text-[#F2DF74]" />
                  <span>PR & Social Media Templates</span>
                </button>
              </li>
              <li className="pt-1">
                <a 
                  href="https://www.toastmasters.org" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-white hover:underline transition flex items-center space-x-1.5 text-slate-200"
                >
                  <span>Toastmasters International Official Portal</span>
                  <ExternalLink className="w-3 h-3 opacity-80" />
                </a>
              </li>
              <li>
                <a 
                  href="https://www.toastmasters.org/pathways-overview" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-white hover:underline transition flex items-center space-x-1.5 text-slate-200"
                >
                  <span>Pathways Learning Experience</span>
                  <ExternalLink className="w-3 h-3 opacity-80" />
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Quality & Compliance */}
          <div className="space-y-3">
            <h4 className="font-brand font-bold text-xs uppercase tracking-wider text-[#F2DF74]">
              Governance & Standards
            </h4>
            <div className="bg-[#004165]/80 p-3.5 rounded-xl border border-[#005580] space-y-2 text-xs">
              <div className="flex items-center space-x-2 text-emerald-300 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>100% Proof Verification</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Tasks cannot be marked completed without verifiable proof (documents, graphics, or URLs) approved by an authorized officer.
              </p>
            </div>

            <div className="text-[11px] text-slate-300 space-y-1">
              <p className="flex items-center space-x-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#F2DF74]" />
                <span>Super Admin: <strong>TM Yahoshuva Kesaboyina</strong></span>
              </p>
              <p className="flex items-center space-x-1.5 text-slate-400">
                <Lock className="w-3.5 h-3.5 text-slate-400" />
                <span>Role-Based Access Control (RBAC)</span>
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Official Legal & Copyright Bottom Bar (Mandatory Toastmasters.org Disclaimer) */}
      <div className="bg-[#001D2E] border-t border-slate-800 py-6 px-4 sm:px-6 lg:px-8 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left space-y-1">
            <p className="font-medium text-slate-300">
              © {new Date().getFullYear()} SpeakUp Scaler Toastmasters Club #28681022. All rights reserved.
            </p>
            <p className="text-[11px] text-slate-500 max-w-3xl leading-relaxed">
              The information on this website is for the sole use of Toastmasters’ members for Toastmasters business only. 
              It is not to be used for solicitation and distribution of non-Toastmasters material or information. 
              Toastmasters International, the Toastmasters International logo, and all other Toastmasters International trademarks 
              and copyrights are the sole property of Toastmasters International.
            </p>
          </div>

          <div className="flex items-center space-x-4 text-xs font-semibold text-slate-300 flex-shrink-0">
            <span className="text-[#F2DF74]">Learn • Speak • Lead</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
