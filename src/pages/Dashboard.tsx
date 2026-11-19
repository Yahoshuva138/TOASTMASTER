import React from 'react';
import { 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  FileCheck, 
  ListTodo, 
  TrendingUp, 
  Calendar, 
  ArrowRight, 
  Building2,
  ShieldCheck,
  Paperclip
} from 'lucide-react';
import { Task, Profile, Department, ActivityLogItem } from '../types/database.types';
import { formatDueDateTime, isTaskOverdue } from '../lib/dateUtils';

interface DashboardProps {
  tasks: Task[];
  departments: Department[];
  currentUser: Profile;
  activityLogs: ActivityLogItem[];
  pendingMembersCount?: number;
  onNavigate: (page: string) => void;
  onSelectTask: (task: Task) => void;
  onCreateTaskClick: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  tasks,
  departments,
  currentUser,
  activityLogs,
  pendingMembersCount = 0,
  onNavigate,
  onSelectTask,
  onCreateTaskClick
}) => {
  // Compute real metrics directly from database state
  const totalTasks = tasks.length;
  const notStarted = tasks.filter(t => t.status === 'not_started').length;
  const inProgress = tasks.filter(t => t.status === 'in_progress').length;
  const awaitingReview = tasks.filter(t => t.status === 'submitted_for_review').length;
  const approved = tasks.filter(t => t.status === 'approved').length;
  
  const overdue = tasks.filter(t => isTaskOverdue(t.dueDate, t.status)).length;
  const completionPercentage = totalTasks > 0 ? Math.round((approved / totalTasks) * 100) : 0;

  const myTasks = tasks.filter(t => t.assignedMemberId === currentUser.id);
  const myPendingTasks = myTasks.filter(t => t.status !== 'approved');

  const urgentTasks = tasks.filter(t => (t.priority === 'urgent' || t.priority === 'high') && t.status !== 'approved').slice(0, 4);

  return (
    <div className="space-y-6">
      
      {/* Super Admin Alert: Pending Member Access Requests */}
      {currentUser.systemRole === 'super_admin' && pendingMembersCount > 0 && (
        <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-start sm:items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center flex-shrink-0 text-amber-700">
              <Clock className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-brand font-black text-sm text-amber-950">
                  {pendingMembersCount} Pending Member Access Request{pendingMembersCount > 1 ? 's' : ''}
                </span>
                <span className="text-[10px] bg-amber-200 text-amber-900 font-bold px-2 py-0.5 rounded-full">
                  Action Required
                </span>
              </div>
              <p className="text-xs text-amber-800 mt-0.5">
                New user(s) requested access from the login portal. Assign their club role and department to grant entry.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('members')}
            className="w-full sm:w-auto px-4 py-2 bg-[#772432] hover:bg-[#5A1A25] text-white font-brand font-bold text-xs rounded-xl shadow-sm transition flex items-center justify-center space-x-1.5 flex-shrink-0"
          >
            <span>Review & Grant Access →</span>
          </button>
        </div>
      )}

      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#004165] to-[#002B44] text-white p-6 rounded-2xl shadow-sm border border-[#002B44] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-white p-1.5 flex-shrink-0 shadow-lg border-2 border-[#F2DF74]/80 hidden sm:flex items-center justify-center">
            <img 
              src="/toastmasters-logo.svg" 
              alt="Toastmasters International" 
              className="w-full h-full object-contain" 
            />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs bg-[#772432] text-[#F2DF74] px-2.5 py-0.5 rounded-full font-brand font-bold border border-[#932C3E]">
                {currentUser.clubRole}
              </span>
              <span className="text-xs text-slate-300 font-medium">SpeakUp Scaler Executive Workspace</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-brand font-black mt-1 text-white">Welcome, {currentUser.fullName}</h1>
            <p className="text-sm text-slate-200 mt-1 max-w-xl font-sans">
              Accountability and proof-based tracking active across all 6 club departments. Verified video, document, and link evidence required for milestone completion.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onNavigate('meeting-agendas')}
            className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-lg transition border border-white/20 flex items-center space-x-1.5"
          >
            <span>📅 Meeting Agendas</span>
          </button>
          <button
            onClick={() => onNavigate('role-resources')}
            className="px-3.5 py-2 bg-[#F2DF74] hover:bg-yellow-300 text-[#004165] text-xs font-bold rounded-lg transition shadow-sm flex items-center space-x-1.5"
          >
            <span>📚 Role Resources</span>
          </button>
          <button
            onClick={onCreateTaskClick}
            className="px-4 py-2 bg-[#772432] hover:bg-[#932C3E] text-white text-xs font-bold rounded-lg shadow-sm transition border border-[#932C3E]"
          >
            + Create Task
          </button>
          <button
            onClick={() => onNavigate('my-tasks')}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-lg transition border border-white/20"
          >
            My Tasks ({myPendingTasks.length})
          </button>
        </div>
      </div>

      {/* 7 Key Real Database Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        
        {/* Total Tasks */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm cursor-pointer hover:border-[#004165] transition" onClick={() => onNavigate('all-tasks')}>
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-brand font-bold uppercase tracking-wider">Total Tasks</span>
            <ListTodo className="w-4 h-4 text-[#004165]" />
          </div>
          <span className="text-2xl font-brand font-black text-slate-900">{totalTasks}</span>
          <span className="text-[10px] text-slate-500 block mt-1">Club-wide pool</span>
        </div>

        {/* Completion Rate */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-brand font-bold uppercase tracking-wider">Completion</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="text-2xl font-brand font-black text-emerald-600">{completionPercentage}%</span>
          <span className="text-[10px] text-emerald-700 block mt-1">{approved} tasks verified</span>
        </div>

        {/* Awaiting Review */}
        <div className="bg-purple-50/60 p-4 rounded-xl border border-purple-200 shadow-sm cursor-pointer hover:border-purple-400 transition" onClick={() => onNavigate('review-queue')}>
          <div className="flex items-center justify-between text-purple-700 mb-1">
            <span className="text-[11px] font-brand font-bold uppercase tracking-wider">In Review</span>
            <FileCheck className="w-4 h-4 text-purple-600" />
          </div>
          <span className="text-2xl font-brand font-black text-purple-900">{awaitingReview}</span>
          <span className="text-[10px] text-purple-700 block mt-1">Evidence submitted</span>
        </div>

        {/* In Progress */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-brand font-bold uppercase tracking-wider">In Progress</span>
            <Clock className="w-4 h-4 text-sky-600" />
          </div>
          <span className="text-2xl font-brand font-black text-sky-700">{inProgress}</span>
          <span className="text-[10px] text-slate-500 block mt-1">Active execution</span>
        </div>

        {/* Not Started */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-brand font-bold uppercase tracking-wider">Not Started</span>
            <Clock className="w-4 h-4 text-slate-400" />
          </div>
          <span className="text-2xl font-brand font-black text-slate-700">{notStarted}</span>
          <span className="text-[10px] text-slate-500 block mt-1">Pending kickoff</span>
        </div>

        {/* Approved Tasks */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-brand font-bold uppercase tracking-wider">Approved</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="text-2xl font-brand font-black text-emerald-700">{approved}</span>
          <span className="text-[10px] text-slate-500 block mt-1">Proof confirmed</span>
        </div>

        {/* Overdue */}
        <div className={`p-4 rounded-xl border shadow-sm ${overdue > 0 ? 'bg-red-50 border-red-200 text-red-900' : 'bg-white border-slate-200'}`}>
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-brand font-bold uppercase tracking-wider text-red-700">Overdue</span>
            <AlertTriangle className="w-4 h-4 text-red-600" />
          </div>
          <span className={`text-2xl font-brand font-black ${overdue > 0 ? 'text-red-700' : 'text-slate-800'}`}>{overdue}</span>
          <span className="text-[10px] text-red-600 block mt-1">{overdue > 0 ? 'Action required' : 'On schedule'}</span>
        </div>

      </div>

      {/* Main Grid: Department Stats & High-Priority Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Department Breakdown (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Department Performance Cards */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Department Workspaces</h3>
                <p className="text-xs text-slate-500">Live task allocation and completion across Toastmasters committees</p>
              </div>
              <button 
                onClick={() => onNavigate('team-workspaces')}
                className="text-xs font-bold text-[#004165] hover:underline flex items-center space-x-1"
              >
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {departments.map(dept => {
                const deptTasks = tasks.filter(t => t.departmentId === dept.id);
                const deptApproved = deptTasks.filter(t => t.status === 'approved').length;
                const deptPercent = deptTasks.length > 0 ? Math.round((deptApproved / deptTasks.length) * 100) : 0;

                return (
                  <div key={dept.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 hover:border-slate-300 transition">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-xs text-slate-900">{dept.name}</span>
                      <span className="text-xs font-bold text-[#004165]">{deptPercent}%</span>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mb-2">
                      <div 
                        className="bg-[#004165] h-full transition-all duration-500" 
                        style={{ width: `${deptPercent}%` }}
                      ></div>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>{deptTasks.length} total tasks</span>
                      <span className="text-emerald-700 font-semibold">{deptApproved} verified</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* High Priority & Urgent Tasks */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Urgent & High-Priority Tasks</h3>
                <p className="text-xs text-slate-500">Items requiring immediate action or upcoming meeting deadlines</p>
              </div>
              <button 
                onClick={() => onNavigate('all-tasks')}
                className="text-xs font-bold text-[#004165] hover:underline"
              >
                View in All Tasks →
              </button>
            </div>

            <div className="space-y-3">
              {urgentTasks.length === 0 ? (
                <p className="text-xs text-slate-500 italic py-4 text-center">No urgent tasks currently pending.</p>
              ) : (
                urgentTasks.map(t => (
                  <div 
                    key={t.id} 
                    onClick={() => onSelectTask(t)}
                    className="p-3.5 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 flex items-center justify-between cursor-pointer transition"
                  >
                    <div className="space-y-1 max-w-md">
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-bold bg-red-100 text-red-700 px-2 py-0.5 rounded border border-red-200 uppercase">
                          {t.priority}
                        </span>
                        <span className="text-xs font-bold text-slate-900">{t.taskCode}: {t.title}</span>
                      </div>
                      <p className="text-xs text-slate-500 line-clamp-1">{t.description}</p>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <span className="text-xs font-semibold text-slate-700 block">{t.assignedMemberName}</span>
                      <span className="text-[10px] text-slate-500 font-medium">Due: {formatDueDateTime(t.dueDate)}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

        {/* Right Column: Pending Approvals & Live Activity Log (1 Col) */}
        <div className="space-y-6">
          
          {/* Pending Evidence Review Callout */}
          <div className="bg-purple-50 p-5 rounded-2xl border border-purple-200 shadow-sm">
            <div className="flex items-center space-x-2 text-purple-900 mb-2">
              <FileCheck className="w-5 h-5 text-purple-700" />
              <h4 className="font-bold text-sm">Review Queue ({awaitingReview})</h4>
            </div>
            <p className="text-xs text-purple-800 leading-relaxed mb-4">
              Club members have submitted proof (video frames, certificates, and posts). Executive review is required to verify completion.
            </p>
            <button
              onClick={() => onNavigate('review-queue')}
              className="w-full py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-lg text-xs font-bold transition shadow-sm"
            >
              Open Review Queue →
            </button>
          </div>

          {/* Live Activity Audit Feed */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-bold text-slate-900 text-sm">Recent Audit Activities</h4>
              <button 
                onClick={() => onNavigate('activity-log')}
                className="text-[11px] font-semibold text-[#004165] hover:underline"
              >
                Full Log →
              </button>
            </div>

            <div className="space-y-4">
              {activityLogs.slice(0, 5).map(act => (
                <div key={act.id} className="text-xs space-y-1 pb-3 border-b border-slate-100 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">{act.userName}</span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(act.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-slate-600">
                    <span className="font-semibold text-[#004165]">{act.action.replace(/_/g, ' ')}</span>
                    {act.details?.taskCode && ` on ${act.details.taskCode}`}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
