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
        <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs">
          <span className="font-bold text-[#004165] block">Toastmasters Club #2867</span>
          <p className="text-slate-500 mt-0.5">District 120 • Division G</p>
          <div className="mt-2 text-[11px] text-slate-600 font-medium flex items-center justify-between">
            <span>Verified System</span>
            <span className="text-emerald-700 font-bold">100% Evidence</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
