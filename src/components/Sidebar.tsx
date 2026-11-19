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
  ExternalLink
} from 'lucide-react';
import { Profile } from '../types/database.types';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  currentUser: Profile;
  pendingReviewCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onNavigate,
  currentUser,
  pendingReviewCount
}) => {
  const isSuperAdmin = currentUser.systemRole === 'super_admin';
  const isOfficer = ['president', 'vpe', 'vpm', 'vppr', 'secretary', 'treasurer', 'saa'].includes(currentUser.systemRole);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
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
    { id: 'team-workspaces', label: 'Team Workspaces', icon: Building2 },
    { id: 'role-resources', label: 'Role Toolkits & Docs', icon: BookOpen },
    { id: 'members', label: 'Club Members', icon: Users, officerOnly: true },
    { id: 'roles-permissions', label: 'Roles & RBAC', icon: ShieldCheck, adminOnly: true },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'reports', label: 'Reports & Export', icon: BarChart3 },
    { id: 'activity-log', label: 'Audit Activity Log', icon: History },
    { id: 'admin-settings', label: 'Admin Settings', icon: Settings, adminOnly: true },
    { id: 'user-profile', label: 'User Profile', icon: User },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex-shrink-0 min-h-[calc(100vh-4rem)] flex flex-col justify-between p-4">
      <div>
        <div className="mb-4 px-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Navigation
          </span>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            if (item.adminOnly && !isSuperAdmin) return null;
            if (item.officerOnly && !isSuperAdmin && !isOfficer) return null;

            const Icon = item.icon;
            const isActive = currentPage === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                  isActive
                    ? 'bg-[#004165] text-white shadow-sm'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#F2DF74]' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${item.badgeColor || 'bg-slate-200 text-slate-700'}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Club Banner Card */}
      <div className="mt-6 pt-4 border-t border-slate-100">
        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-white p-1 border border-slate-200 shadow-sm flex items-center justify-center flex-shrink-0">
            <img 
              src="/toastmasters-logo.svg" 
              alt="Toastmasters International Logo" 
              className="w-full h-full object-contain" 
            />
          </div>
          <div className="min-w-0 flex-1">
            <span className="font-bold text-[#004165] block truncate">SpeakUp Scaler TM</span>
            <p className="text-[11px] text-slate-500 truncate">Club #2867 • Dist. 120</p>
            <div className="mt-1 text-[10px] text-emerald-700 font-bold flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>100% Proof Verified</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
