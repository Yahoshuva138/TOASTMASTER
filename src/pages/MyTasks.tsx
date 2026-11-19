import React from 'react';
import { CheckCircle2, Clock, Paperclip, AlertCircle, Plus } from 'lucide-react';
import { Task, Profile } from '../types/database.types';

interface MyTasksProps {
  tasks: Task[];
  currentUser: Profile;
  onSelectTask: (task: Task) => void;
  onSubmitEvidenceClick: (task: Task) => void;
  onCreateTaskClick: () => void;
}

export const MyTasks: React.FC<MyTasksProps> = ({
  tasks,
  currentUser,
  onSelectTask,
  onSubmitEvidenceClick,
  onCreateTaskClick
}) => {
  const myTasks = tasks.filter(t => t.assignedMemberId === currentUser.id);
  const pendingTasks = myTasks.filter(t => t.status !== 'approved');
  const completedTasks = myTasks.filter(t => t.status === 'approved');

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">My Assigned Tasks & Action Items</h1>
          <p className="text-xs text-slate-500">
            Responsibilities directly allocated to {currentUser.fullName} ({currentUser.clubRole})
          </p>
        </div>
        <button
          onClick={onCreateTaskClick}
          className="px-4 py-2 bg-[#004165] hover:bg-[#002B44] text-white text-xs font-bold rounded-lg shadow-sm transition"
        >
          + Add Personal Task
        </button>
      </div>

      {/* Pending Items Requiring Action */}
      <div className="space-y-4">
        <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
          <Clock className="w-4 h-4 text-amber-600" />
          <span>Active & In-Progress ({pendingTasks.length})</span>
        </h3>

        {pendingTasks.length === 0 ? (
          <div className="p-8 bg-white rounded-xl border border-dashed border-slate-300 text-center text-xs text-slate-500">
            🎉 All assigned tasks completed and verified!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingTasks.map(t => (
              <div 
                key={t.id} 
                onClick={() => onSelectTask(t)}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-[#004165] transition cursor-pointer space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold bg-[#772432] text-[#F2DF74] px-2 py-0.5 rounded">
                    {t.taskCode}
                  </span>
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                    t.priority === 'urgent' ? 'bg-red-100 text-red-700' :
                    t.priority === 'high' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {t.priority}
                  </span>
                </div>

                <h4 className="font-bold text-sm text-slate-900">{t.title}</h4>
                <p className="text-xs text-slate-600 line-clamp-2">{t.description}</p>

                {t.acceptanceCriteria && (
                  <div className="p-2.5 bg-amber-50 rounded-lg border border-amber-200 text-[11px] text-amber-900">
                    <span className="font-bold block">Acceptance Criteria:</span>
                    <span>{t.acceptanceCriteria}</span>
                  </div>
                )}

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-400">Due: {t.dueDate || 'Flexible'}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSubmitEvidenceClick(t);
                    }}
                    className="px-3 py-1.5 bg-[#772432] hover:bg-[#932C3E] text-white text-xs font-bold rounded-lg shadow-sm transition flex items-center space-x-1"
                  >
                    <Paperclip className="w-3 h-3 text-[#F2DF74]" />
                    <span>Upload Proof</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Verified Completed Tasks */}
      <div className="space-y-4 pt-4 border-t border-slate-200">
        <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Completed & Verified History ({completedTasks.length})</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {completedTasks.map(t => (
            <div 
              key={t.id} 
              onClick={() => onSelectTask(t)}
              className="bg-emerald-50/40 p-4 rounded-xl border border-emerald-200 shadow-sm cursor-pointer hover:bg-emerald-50 transition space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-900">{t.taskCode}</span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                  VERIFIED
                </span>
              </div>
              <h4 className="text-xs font-bold text-slate-900">{t.title}</h4>
              <p className="text-[11px] text-slate-600">{t.reviews?.[0]?.feedback || 'Evaluation confirmed.'}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
