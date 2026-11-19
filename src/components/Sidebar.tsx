import React from 'react';
import { 
  LayoutDashboard, 
  CheckSquare, 
  UserCheck, 
  FileCheck, 
  Paperclip, 
  Building2, 
  Users, 
  ShieldCheck, 
  Bell, 
  BarChart3, 
  History, 
  Settings, 
  User, 
  BookOpen, 
  X,
  ExternalLink,
  Calendar
} from 'lucide-react';
import { Profile } from '../types/database.types';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  currentUser: Profile;
  pendingReviewCount: number;
  pendingMembersCount?: number;
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onNavigate,
  currentUser,
  pendingReviewCount,
  pendingMembersCount = 0,
  isOpen = false,
  onClose
}) => {
  const isSuperAdmin = currentUser.systemRole === 'super_admin';
  const isOfficer = ['president', 'vpe', 'vpm', 'vppr', 'secretary', 'treasurer', 'saa'].includes(currentUser.systemRole);

  const mainNav = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'meeting-agendas', label: 'Meeting Agendas & Roles', icon: Calendar },
    { id: 'all-tasks', label: 'All Tasks', icon: CheckSquare },
    { id: 'my-tasks', label: 'My Tasks', icon: UserCheck },
    { 
      id: 'review-queue', 
      label: 'Review Queue', 
      icon: FileCheck, 
      badge: pendingReviewCount > 0 ? pendingReviewCount : undefined,
      badgeColor: 'bg-[#772432] text-[#F2DF74]'
    },
    { id: 'evidence-history', label: 'Evidence Vault', icon: Paperclip },
    { id: 'team-workspaces', label: 'Workspaces', icon: Building2 },
    { id: 'role-resources', label: 'Toolkits & Manuals', icon: BookOpen },
  ];

  const adminNav = [
    { 
      id: 'members', 
      label: 'Club Members', 
      icon: Users, 
      officerOnly: true,
      badge: (isSuperAdmin && pendingMembersCount > 0) ? `${pendingMembersCount} New` : undefined,
      badgeColor: 'bg-amber-500 text-white animate-pulse'
    },
    { id: 'roles-permissions', label: 'Roles & RBAC', icon: ShieldCheck, adminOnly: true },
    { id: 'reports', label: 'Reports & Export', icon: BarChart3 },
    { id: 'activity-log', label: 'Audit Activity Log', icon: History },
    { id: 'admin-settings', label: 'Admin Settings', icon: Settings, adminOnly: true },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'user-profile', label: 'My Profile', icon: User },
  ];

  const handleNavClick = (id: string) => {
    onNavigate(id);
    if (onClose) onClose();
  };

  const navContent = (
    <div className="space-y-6">
      
      {/* Main Workspaces */}
      <div>
        <div className="mb-2 px-2.5">
          <span className="text-[10px] font-brand font-black uppercase tracking-wider text-slate-400">
            Club Workspace
          </span>
        </div>

        <nav className="space-y-1">
          {mainNav.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-brand font-semibold transition ${
                  isActive
                    ? 'bg-[#004165] text-white shadow-sm'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-[#004165]'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#F2DF74]' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.badgeColor || 'bg-slate-200 text-slate-700'}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Administration & Governance */}
      <div>
        <div className="mb-2 px-2.5">
          <span className="text-[10px] font-brand font-black uppercase tracking-wider text-slate-400">
            Governance & Admin
          </span>
        </div>

        <nav className="space-y-1">
          {adminNav.map((item) => {
            if (item.adminOnly && !isSuperAdmin) return null;
            if (item.officerOnly && !isSuperAdmin && !isOfficer) return null;

            const Icon = item.icon;
            const isActive = currentPage === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-brand font-semibold transition ${
                  isActive
                    ? 'bg-[#004165] text-white shadow-sm'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-[#004165]'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#F2DF74]' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </div>
              </button>
            );
          })}
        </nav>
      </div>

    </div>
  );

  const clubBadge = (
    <div className="pt-4 mt-6 border-t border-slate-100">
      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
        <div className="flex items-center space-x-2.5 mb-2">
          <div className="w-8 h-8 rounded-lg bg-white p-1 border border-slate-200 shadow-xs flex items-center justify-center flex-shrink-0">
            <img 
              src="/toastmasters-logo.svg" 
              alt="Toastmasters International Logo" 
              className="w-full h-full object-contain" 
            />
          </div>
          <div className="min-w-0">
            <span className="font-brand font-bold text-xs text-[#004165] block truncate">
              SpeakUp Scaler Club
            </span>
            <span className="text-[10px] font-bold text-[#772432] block">
              #28681022
            </span>
          </div>
        </div>
        <p className="text-[10px] text-slate-500 font-medium">
          District 227 • Div E • Area 04
        </p>
        <div className="mt-2 pt-2 border-t border-slate-200/80 text-[10px] font-bold text-emerald-700 flex items-center space-x-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>100% Evidence Verification</span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* 1. Desktop Permanent Sidebar (lg:flex, hidden on mobile) */}
      <aside className="hidden lg:flex w-64 bg-white border-r border-slate-200 flex-shrink-0 min-h-[calc(100vh-6.5rem)] flex-col justify-between p-4 shadow-sm">
        {navContent}
        {clubBadge}
      </aside>

      {/* 2. Mobile Responsive Slide-Over Drawer (< lg) */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 lg:hidden animate-in fade-in"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <div 
        className={`fixed inset-y-0 left-0 w-72 max-w-[85vw] bg-white z-50 shadow-2xl flex flex-col justify-between p-4 overflow-y-auto lg:hidden transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Mobile Drawer Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-white p-1 border border-slate-200 shadow-xs flex items-center justify-center flex-shrink-0">
                <img 
                  src="/toastmasters-logo.svg" 
                  alt="Toastmasters International Logo" 
                  className="w-full h-full object-contain" 
                />
              </div>
              <div>
                <span className="font-brand font-black text-sm text-[#004165] block leading-tight">
                  TOASTMASTERS
                </span>
                <span className="font-brand font-bold text-[9px] text-[#772432] block leading-tight uppercase">
                  TASK HUB MENU
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition"
              aria-label="Close navigation"
            >
              <X className="w-5 h-5 text-slate-700" />
            </button>
          </div>

          {navContent}
        </div>

        {clubBadge}
      </div>
    </>
  );
};
