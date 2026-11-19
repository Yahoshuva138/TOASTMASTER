import React from 'react';
import { Bell, CheckCheck, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import { NotificationItem, Profile } from '../types/database.types';

interface NotificationsPanelProps {
  notifications: NotificationItem[];
  currentUser: Profile;
  onMarkNotificationRead: (id: string) => void;
  onMarkAllRead: () => void;
  onNavigate: (page: string) => void;
}

export const NotificationsPanel: React.FC<NotificationsPanelProps> = ({
  notifications,
  currentUser,
  onMarkNotificationRead,
  onMarkAllRead,
  onNavigate
}) => {
  const userNotifications = notifications.filter(n => n.userId === currentUser.id);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-[#004165] mb-1">
            <Bell className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider">Alerts & Updates</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900">Toastmasters Notification Center</h1>
          <p className="text-xs text-slate-500">
            Real-time updates regarding task assignments, evidence approvals, and meeting role deadlines
          </p>
        </div>

        {userNotifications.some(n => !n.isRead) && (
          <button
            onClick={onMarkAllRead}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition flex items-center space-x-1"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span>Mark All as Read</span>
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm divide-y divide-slate-100 overflow-hidden">
        {userNotifications.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400 italic">
            You have no notifications at this time.
          </div>
        ) : (
          userNotifications.map(n => (
            <div
              key={n.id}
              onClick={() => {
                onMarkNotificationRead(n.id);
                if (n.relatedTaskId) onNavigate('all-tasks');
              }}
              className={`p-4 flex items-start justify-between cursor-pointer transition ${
                !n.isRead ? 'bg-blue-50/50 hover:bg-blue-50' : 'hover:bg-slate-50'
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className="p-2 rounded-lg bg-slate-100 text-[#004165] mt-0.5">
                  {n.type === 'task_approved' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> :
                   n.type === 'evidence_rejected' ? <AlertCircle className="w-4 h-4 text-red-600" /> :
                   <Bell className="w-4 h-4 text-[#004165]" />}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-xs text-slate-900">{n.title}</span>
                    {!n.isRead && (
                      <span className="text-[10px] bg-blue-600 text-white font-bold px-1.5 py-0.2 rounded-full">
                        NEW
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600">{n.message}</p>
                  <span className="text-[10px] text-slate-400 block">
                    {new Date(n.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>

              {!n.isRead && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onMarkNotificationRead(n.id);
                  }}
                  className="text-xs text-[#004165] font-semibold hover:underline"
                >
                  Mark read
                </button>
              )}
            </div>
          ))
        )}
      </div>

    </div>
  );
};
