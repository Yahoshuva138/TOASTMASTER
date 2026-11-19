import React, { useState } from 'react';
import { 
  Bell, 
  Plus, 
  Wifi, 
  WifiOff, 
  LogOut, 
  User, 
  ShieldCheck, 
  CheckCircle2, 
  X,
  ExternalLink
} from 'lucide-react';
import { Profile, NotificationItem } from '../types/database.types';

interface NavbarProps {
  currentUser: Profile;
  onLogout: () => void;
  isOnline: boolean;
  notifications: NotificationItem[];
  onMarkNotificationRead: (id: string) => void;
  onCreateTaskClick: () => void;
  onNavigate: (page: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onLogout,
  isOnline,
  notifications,
  onMarkNotificationRead,
  onCreateTaskClick,
  onNavigate
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <header className="sticky top-0 z-30 bg-[#004165] text-white shadow-md border-b border-[#002B44]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand & Club Details */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onNavigate('dashboard')}>
            <div className="w-10 h-10 rounded-lg bg-[#772432] border border-[#F2DF74] flex items-center justify-center font-bold text-white shadow-sm">
              <span className="text-[#F2DF74] text-xl font-black">T</span>M
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-base tracking-wide text-white">TOASTMASTERS TASK HUB</span>
                <span className="text-xs bg-[#772432] text-[#F2DF74] px-2 py-0.5 rounded font-semibold border border-[#932C3E]">
                  PROD
                </span>
              </div>
              <p className="text-xs text-slate-200">
                SpeakUp Scaler Toastmasters Club • <span className="text-[#F2DF74]">Learn • Speak • Lead</span>
              </p>
            </div>
          </div>

          {/* Right Action Icons & Controls */}
          <div className="flex items-center space-x-4">
            
            {/* Live Sync Indicator */}
            <div 
              className={`hidden md:flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                isOnline 
                  ? 'bg-emerald-950/60 text-emerald-300 border-emerald-700' 
                  : 'bg-amber-950/60 text-amber-300 border-amber-700'
              }`}
              title={isOnline ? 'Realtime Database Connected' : 'Local Storage Fallback Active'}
            >
              {isOnline ? <Wifi className="w-3.5 h-3.5 text-emerald-400 animate-pulse" /> : <WifiOff className="w-3.5 h-3.5 text-amber-400" />}
              <span>{isOnline ? 'Live Realtime' : 'Local Sync'}</span>
            </div>

            {/* Quick Create Task */}
            <button
              onClick={onCreateTaskClick}
              className="flex items-center space-x-1 bg-[#772432] hover:bg-[#932C3E] text-white px-3 py-1.5 rounded-lg text-sm font-semibold transition border border-[#932C3E] shadow-sm"
            >
              <Plus className="w-4 h-4 text-[#F2DF74]" />
              <span className="hidden sm:inline">New Task</span>
            </button>

            {/* Notifications Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-slate-200 hover:text-white hover:bg-slate-800/40 rounded-full transition"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 bg-[#772432] text-[#F2DF74] text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center border border-white">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Popover */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white text-slate-800 rounded-xl shadow-2xl border border-slate-200 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                    <span className="font-bold text-sm text-slate-900">Notifications ({unreadCount} unread)</span>
                    <button 
                      onClick={() => setShowNotifications(false)}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                    {notifications.length === 0 ? (
                      <p className="text-center py-6 text-sm text-slate-500">No new notifications</p>
                    ) : (
                      notifications.map(n => (
                        <div 
                          key={n.id} 
                          className={`p-3 text-xs hover:bg-slate-50 transition cursor-pointer ${!n.isRead ? 'bg-blue-50/60' : ''}`}
                          onClick={() => {
                            onMarkNotificationRead(n.id);
                            if (n.relatedTaskId) onNavigate('all-tasks');
                          }}
                        >
                          <div className="flex items-start justify-between">
                            <span className="font-semibold text-slate-900">{n.title}</span>
                            {!n.isRead && <span className="w-2 h-2 rounded-full bg-blue-600"></span>}
                          </div>
                          <p className="text-slate-600 mt-1">{n.message}</p>
                          <span className="text-[10px] text-slate-400 mt-1.5 block">
                            {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="p-2 bg-slate-50 border-t border-slate-200 text-center">
                    <button 
                      onClick={() => {
                        setShowNotifications(false);
                        onNavigate('notifications');
                      }}
                      className="text-xs font-semibold text-[#004165] hover:underline"
                    >
                      View all in Notification Center →
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Avatar & Role Menu */}
            <div className="flex items-center space-x-2 pl-2 border-l border-slate-700/60">
              <img 
                src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'} 
                alt={currentUser.fullName}
                className="w-8 h-8 rounded-full object-cover border border-[#F2DF74]"
              />
              <div className="hidden lg:block text-left">
                <p className="text-xs font-bold leading-tight truncate max-w-[140px] text-white">
                  {currentUser.fullName}
                </p>
                <span className="text-[10px] text-[#F2DF74] font-medium leading-tight block">
                  {currentUser.systemRole === 'super_admin' ? '🛡️ Super Admin' : currentUser.clubRole}
                </span>
              </div>

              {/* Sign Out */}
              <button
                onClick={onLogout}
                className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800/40 rounded-lg transition"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4 text-red-300" />
              </button>
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};
