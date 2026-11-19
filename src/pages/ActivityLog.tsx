import React, { useState } from 'react';
import { History, Search, Shield, Filter } from 'lucide-react';
import { ActivityLogItem } from '../types/database.types';

interface ActivityLogProps {
  activityLogs: ActivityLogItem[];
}

export const ActivityLog: React.FC<ActivityLogProps> = ({
  activityLogs
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLogs = activityLogs.filter(log =>
    log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.entityType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-[#004165] mb-1">
            <History className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider">Security & Audit</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900">Toastmasters System Audit Trail</h1>
          <p className="text-xs text-slate-500">
            Immutable log of task creations, evidence reviews, role promotions, and club operations
          </p>
        </div>

        <div className="w-full sm:w-64">
          <input
            type="text"
            placeholder="Search audit trail..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#004165] focus:outline-none"
          />
        </div>
      </div>

      {/* Log Feed */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm divide-y divide-slate-100 overflow-hidden">
        {filteredLogs.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400 italic">No audit records match your search.</div>
        ) : (
          filteredLogs.map(log => (
            <div key={log.id} className="p-4 flex items-center justify-between text-xs hover:bg-slate-50 transition">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-slate-900">{log.userName}</span>
                  <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-semibold">
                    {log.userRole}
                  </span>
                  <span className="text-slate-400">•</span>
                  <span className="font-bold text-[#004165]">{log.action.replace(/_/g, ' ')}</span>
                </div>
                {log.details && (
                  <p className="text-slate-500 text-[11px] font-mono">
                    {JSON.stringify(log.details)}
                  </p>
                )}
              </div>

              <span className="text-[10px] text-slate-400 whitespace-nowrap ml-4">
                {new Date(log.createdAt).toLocaleString()}
              </span>
            </div>
          ))
        )}
      </div>

    </div>
  );
};
