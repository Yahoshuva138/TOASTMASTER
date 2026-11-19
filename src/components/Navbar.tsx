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
  ExternalLink,
  Menu
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
  currentPage?: string;
  isMobileMenuOpen?: boolean;
  onToggleMobileMenu?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onLogout,
  isOnline,
  notifications,
  onMarkNotificationRead,
  onCreateTaskClick,
  onNavigate,
  currentPage = 'dashboard',
  isMobileMenuOpen = false,
  onToggleMobileMenu
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <header className="sticky top-0 z-40 w-full shadow-md">
      
      {/* TIER 1: Official Deep Midnight Navy Utility Bar (matching toastmasters.org) */}
      <div className="bg-[#002B44] text-slate-200 text-xs py-1.5 px-3 sm:px-6 lg:px-8 border-b border-[#001D2E]">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          
          {/* Left: Club Credential Lockup & Official Motto */}
          <div className="flex items-center space-x-2 sm:space-x-3 text-[10px] sm:text-xs truncate">
            <span className="font-brand font-bold text-[#F2DF74] tracking-wider uppercase flex-shrink-0">
              Where Leaders Are Made
            </span>
            <span className="hidden sm:inline text-slate-500">•</span>
            <span className="font-medium text-slate-300 hidden sm:inline truncate">
              SpeakUp Scaler Club <strong className="text-white">#28681022</strong>
            </span>
            <span className="hidden md:inline text-slate-500">•</span>
            <span className="text-slate-400 hidden md:inline truncate">
              District 227 • Div E • Area 04
            </span>
          </div>

          {/* Right: Realtime status & Official External Links */}
          <div className="flex items-center space-x-2 sm:space-x-3 text-[10px] sm:text-[11px] flex-shrink-0">
            {/* Realtime Live Database Status Indicator */}
            <div 
              className={`flex items-center space-x-1.5 px-2 py-0.5 rounded-full font-medium border ${
                isOnline 
                  ? 'bg-emerald-950/70 text-emerald-300 border-emerald-600/60' 
                  : 'bg-amber-950/70 text-amber-300 border-amber-600/60'
              }`}
              title={isOnline ? 'Realtime Database Connected' : 'Local Storage Mode'}
            >
              {isOnline ? (
                <Wifi className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-emerald-400 animate-pulse" />
              ) : (
                <WifiOff className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-400" />
              )}
              <span className="text-[10px] font-semibold">{isOnline ? 'Live' : 'Local'}</span>
            </div>

            {/* Official Toastmasters External Links */}
            <a 
              href="https://www.toastmasters.org" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-slate-300 hover:text-white transition flex items-center space-x-1 hover:underline hidden sm:flex"
            >
              <span>Toastmasters.org</span>
              <ExternalLink className="w-2.5 h-2.5 opacity-70" />
            </a>

            <a 
              href="https://www.toastmasters.org/pathways-overview" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-slate-300 hover:text-[#F2DF74] transition flex items-center space-x-1 hover:underline hidden lg:flex"
            >
              <span>Pathways</span>
            </a>
          </div>

        </div>
      </div>

      {/* TIER 2: Official Toastmasters White Header Bar */}
      <div className="bg-white text-slate-900 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            
            {/* Left: Mobile Menu Toggle + Official Toastmasters Logo Lockup */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              
              {/* Mobile Hamburger Menu Toggle Button (Visible on screens < lg) */}
              <button
                onClick={onToggleMobileMenu}
                className="lg:hidden p-2 rounded-xl text-slate-700 hover:text-[#004165] hover:bg-slate-100 transition focus:outline-none focus:ring-2 focus:ring-[#004165]"
                aria-label="Toggle navigation menu"
                title="Open Navigation Menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6 text-[#772432]" />
                ) : (
                  <Menu className="w-6 h-6 text-[#004165]" />
                )}
              </button>

              {/* Logo & Brand Identity */}
              <div 
                className="flex items-center space-x-2.5 sm:space-x-3.5 cursor-pointer group py-1"
                onClick={() => onNavigate('dashboard')}
              >
                <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl bg-white p-1 flex items-center justify-center border border-slate-200 shadow-sm group-hover:scale-105 transition-transform duration-200 flex-shrink-0">
                  <img 
                    src="/toastmasters-logo.svg" 
                    alt="Toastmasters International Logo" 
                    className="w-full h-full object-contain" 
                  />
                </div>

                <div>
                  <div className="flex items-baseline space-x-1 sm:space-x-1.5">
                    <span className="font-brand font-black text-base sm:text-xl tracking-tight text-[#004165]">
                      TOASTMASTERS
                    </span>
                  </div>
                  <div className="flex items-center space-x-1.5 sm:space-x-2">
                    <span className="font-brand font-bold text-[9px] sm:text-xs tracking-widest text-[#772432] uppercase">
                      INTERNATIONAL
                    </span>
                    <span className="text-[9px] sm:text-[10px] bg-[#004165] text-[#F2DF74] font-bold px-1 sm:px-1.5 py-0.2 rounded font-brand">
                      TASK HUB
                    </span>
                  </div>
                  <span className="text-[10px] sm:text-[11px] text-slate-500 font-medium hidden sm:block">
                    SpeakUp Scaler Club
                  </span>
                </div>
              </div>

            </div>

            {/* Right: Action Buttons, Notifications & User Pill */}
            <div className="flex items-center space-x-1.5 sm:space-x-3">
              
              {/* + New Task Button in Official True Maroon */}
              <button
                onClick={onCreateTaskClick}
                className="flex items-center space-x-1 sm:space-x-1.5 bg-[#772432] hover:bg-[#5A1A25] active:scale-95 text-white px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg font-brand text-xs sm:text-sm font-bold transition shadow-sm border border-[#5A1A25]"
              >
                <Plus className="w-4 h-4 text-[#F2DF74] stroke-[3]" />
                <span className="hidden xs:inline sm:inline">New Task</span>
              </button>

              {/* Notification Bell */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 text-slate-600 hover:text-[#004165] hover:bg-slate-100 rounded-full transition"
                  title="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 bg-[#772432] text-[#F2DF74] text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown Popover */}
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-72 sm:w-96 bg-white text-slate-800 rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-3 bg-[#004165] text-white flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Bell className="w-4 h-4 text-[#F2DF74]" />
                        <span className="font-brand font-bold text-xs sm:text-sm">Notifications ({unreadCount} unread)</span>
                      </div>
                      <button 
                        onClick={() => setShowNotifications(false)}
                        className="text-slate-300 hover:text-white"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                      {notifications.length === 0 ? (
                        <p className="text-center py-8 text-xs sm:text-sm text-slate-500">No new notifications</p>
                      ) : (
                        notifications.map(n => (
                          <div 
                            key={n.id} 
                            className={`p-3 sm:p-3.5 text-xs hover:bg-slate-50 transition cursor-pointer ${!n.isRead ? 'bg-blue-50/50' : ''}`}
                            onClick={() => {
                              onMarkNotificationRead(n.id);
                              if (n.relatedTaskId) onNavigate('all-tasks');
                            }}
                          >
                            <div className="flex items-start justify-between">
                              <span className="font-bold text-slate-900">{n.title}</span>
                              {!n.isRead && <span className="w-2 h-2 rounded-full bg-[#004165]"></span>}
                            </div>
                            <p className="text-slate-600 mt-1 leading-relaxed">{n.message}</p>
                            <span className="text-[10px] text-slate-400 mt-1.5 block">
                              {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        ))
                      )}
                    </div>

                    <div className="p-2.5 bg-slate-50 border-t border-slate-200 text-center">
                      <button 
                        onClick={() => {
                          setShowNotifications(false);
                          onNavigate('notifications');
                        }}
                        className="text-xs font-bold text-[#004165] hover:text-[#772432] transition hover:underline"
                      >
                        Open Notification Center →
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* User Profile Pill */}
              <div className="flex items-center space-x-1 sm:space-x-2 pl-1.5 sm:pl-2 border-l border-slate-200">
                <button
                  onClick={() => onNavigate('user-profile')}
                  className="flex items-center space-x-1.5 sm:space-x-2 p-1 rounded-lg hover:bg-slate-50 transition"
                  title="My Profile"
                >
                  <img 
                    src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'} 
                    alt={currentUser.fullName}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover border border-[#004165]"
                  />
                  <div className="hidden lg:block text-left">
                    <p className="text-xs font-bold font-brand leading-tight truncate max-w-[130px] text-[#004165]">
                      {currentUser.fullName}
                    </p>
                    <span className="text-[10px] text-[#772432] font-semibold leading-tight block">
                      {currentUser.systemRole === 'super_admin' ? '🛡️ Super Admin' : currentUser.clubRole}
                    </span>
                  </div>
                </button>

                {/* Sign Out */}
                <button
                  onClick={onLogout}
                  className="p-1 sm:p-1.5 text-slate-500 hover:text-[#772432] hover:bg-red-50 rounded-lg transition"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>

            </div>

          </div>
        </div>
      </div>

    </header>
  );
};
