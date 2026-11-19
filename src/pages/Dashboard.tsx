import React, { useState } from 'react';
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
  Paperclip,
  UserCheck,
  UserX,
  Mail,
  Check,
  Compass,
  BookOpen,
  Award,
  Users,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { Task, Profile, Department, ActivityLogItem, UserSystemRole } from '../types/database.types';
import { formatDueDateTime, isTaskOverdue } from '../lib/dateUtils';

interface DashboardProps {
  tasks: Task[];
  departments: Department[];
  currentUser: Profile;
  activityLogs: ActivityLogItem[];
  pendingMembersCount?: number;
  pendingMembers?: Profile[];
  onApprovePendingMember?: (memberId: string, role: UserSystemRole, clubRole: string, departmentId: string) => void;
  onRejectPendingMember?: (memberId: string) => void;
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
  pendingMembers = [],
  onApprovePendingMember,
  onRejectPendingMember,
  onNavigate,
  onSelectTask,
  onCreateTaskClick
}) => {
  // State for inline quick-assignment roles on dashboard
  const [selectedRoles, setSelectedRoles] = React.useState<Record<string, { role: UserSystemRole; deptId: string }>>({});
  const [approvedNotification, setApprovedNotification] = React.useState<string | null>(null);
  const [workflowTab, setWorkflowTab] = useState<'pipeline' | 'officers' | 'milestones'>('pipeline');

  const getClubTitleForRole = (r: UserSystemRole): string => {
    switch (r) {
      case 'president': return 'Club President';
      case 'vpe': return 'Vice President Education';
      case 'vpm': return 'Vice President Membership';
      case 'vppr': return 'Vice President Public Relations';
      case 'secretary': return 'Club Secretary';
      case 'treasurer': return 'Treasurer';
      case 'saa': return 'Sergeant at Arms';
      case 'super_admin': return 'Super Administrator';
      default: return 'Club Member';
    }
  };
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
      
      {/* Success Notification after inline approval */}
      {approvedNotification && (
        <div className="bg-emerald-50 border-2 border-emerald-500 rounded-2xl p-4 shadow-sm flex items-center justify-between text-emerald-900 animate-in fade-in">
          <div className="flex items-center space-x-2 text-xs font-bold">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>{approvedNotification}</span>
          </div>
          <button 
            onClick={() => setApprovedNotification(null)}
            className="text-xs text-emerald-700 hover:text-emerald-950 font-bold px-2 py-1"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Super Admin Direct Action: Pending Member Access Requests */}
      {currentUser.systemRole === 'super_admin' && (pendingMembers.length > 0 || pendingMembersCount > 0) && (
        <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-5 shadow-sm space-y-4 animate-in fade-in">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-amber-200 pb-3">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-200/80 border border-amber-400 flex items-center justify-center text-amber-900">
                <Clock className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-brand font-bold text-sm text-amber-950">
                    {pendingMembers.length || pendingMembersCount} Pending Member Access Request{(pendingMembers.length || pendingMembersCount) > 1 ? 's' : ''}
                  </h3>
                  <span className="text-[10px] bg-[#772432] text-[#F2DF74] font-bold px-2 py-0.5 rounded-full">
                    Action Required
                  </span>
                </div>
                <p className="text-xs text-amber-900/80 mt-0.5">
                  Approve applicants and assign their club role below to grant immediate access.
                </p>
              </div>
            </div>
            <button
              onClick={() => onNavigate('members')}
              className="text-xs font-bold text-[#004165] hover:text-[#772432] transition flex items-center space-x-1"
            >
              <span>View Roster in Club Members →</span>
            </button>
          </div>

          {/* Pending Members List */}
          <div className="space-y-3">
            {pendingMembers.map(pending => {
              const assigned = selectedRoles[pending.id] || {
                role: 'member' as UserSystemRole,
                deptId: departments[0]?.id || 'dept-edu'
              };

              return (
                <div
                  key={pending.id}
                  className="bg-white p-4 rounded-xl border border-amber-200 shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-xs text-slate-900">{pending.fullName}</span>
                      <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        Pending Approval
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-600 font-mono flex items-center space-x-1.5">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <span>{pending.email}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 block">
                      Requested: {new Date(pending.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}, {new Date(pending.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Inline Role & Department Controls + Action Buttons */}
                  <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
                    <div>
                      <label className="text-[9px] font-bold text-slate-500 uppercase block mb-0.5">Club Role</label>
                      <select
                        value={assigned.role}
                        onChange={(e) => {
                          const r = e.target.value as UserSystemRole;
                          setSelectedRoles(prev => ({
                            ...prev,
                            [pending.id]: { ...assigned, role: r }
                          }));
                        }}
                        className="px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg font-semibold bg-white focus:outline-none focus:ring-2 focus:ring-[#004165]"
                      >
                        <option value="member">Club Member</option>
                        <option value="vppr">VP Public Relations (VPPR)</option>
                        <option value="vpe">VP Education (VPE)</option>
                        <option value="vpm">VP Membership (VPM)</option>
                        <option value="secretary">Secretary</option>
                        <option value="treasurer">Treasurer</option>
                        <option value="saa">Sergeant at Arms (SAA)</option>
                        <option value="president">Club President</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[9px] font-bold text-slate-500 uppercase block mb-0.5">Department</label>
                      <select
                        value={assigned.deptId}
                        onChange={(e) => {
                          setSelectedRoles(prev => ({
                            ...prev,
                            [pending.id]: { ...assigned, deptId: e.target.value }
                          }));
                        }}
                        className="px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#004165]"
                      >
                        {departments.map(d => (
                          <option key={d.id} value={d.id}>{d.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="flex items-center space-x-1.5 pt-3.5">
                      <button
                        type="button"
                        onClick={() => {
                          if (onApprovePendingMember) {
                            const title = getClubTitleForRole(assigned.role);
                            onApprovePendingMember(pending.id, assigned.role, title, assigned.deptId);
                            setApprovedNotification(`Granted ${title} access to ${pending.fullName} (${pending.email})!`);
                          }
                        }}
                        className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-brand font-bold text-xs rounded-lg transition shadow-sm flex items-center space-x-1"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Accept & Grant Access</span>
                      </button>

                      {onRejectPendingMember && (
                        <button
                          type="button"
                          onClick={() => onRejectPendingMember(pending.id)}
                          className="px-2.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-semibold rounded-lg border border-red-200 transition"
                          title="Decline request"
                        >
                          Decline
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
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

      {/* INTERACTIVE CLUB NAVIGATION & WORKFLOW GUIDE (Visual Flow of Everyone) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in">
        
        {/* Header with Navigation Tabs */}
        <div className="p-5 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#004165] text-[#F2DF74] flex items-center justify-center shadow flex-shrink-0">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-brand font-bold uppercase text-[#772432] tracking-wider">
                  Club Governance & Flow
                </span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                  SpeakUp Scaler #28681022
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-brand font-black text-slate-900">
                Interactive Club Navigation & Workflow Map
              </h2>
            </div>
          </div>

          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold w-full md:w-auto">
            <button
              onClick={() => setWorkflowTab('pipeline')}
              className={`flex-1 md:flex-none px-3 py-1.5 rounded-lg transition ${
                workflowTab === 'pipeline'
                  ? 'bg-white text-[#004165] shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              1. 4-Stage Pipeline
            </button>
            <button
              onClick={() => setWorkflowTab('officers')}
              className={`flex-1 md:flex-none px-3 py-1.5 rounded-lg transition ${
                workflowTab === 'officers'
                  ? 'bg-white text-[#004165] shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              2. Flow of Everyone (7 Roles)
            </button>
            <button
              onClick={() => setWorkflowTab('milestones')}
              className={`flex-1 md:flex-none px-3 py-1.5 rounded-lg transition ${
                workflowTab === 'milestones'
                  ? 'bg-white text-[#004165] shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              3. Proof & MoM Rules
            </button>
          </div>
        </div>

        {/* Tab 1: 4-Stage Operational Pipeline */}
        {workflowTab === 'pipeline' && (
          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative">
              
              {/* Step 1: Login & Access Approval */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col justify-between hover:border-[#004165] transition relative">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold bg-[#004165] text-[#F2DF74] px-2 py-0.5 rounded uppercase">
                      Stage 1
                    </span>
                    <ShieldCheck className="w-5 h-5 text-[#004165]" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm mb-1">Google Auth & Access Control</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Members register with Google. Super Admin <span className="font-semibold text-slate-900">TM Yahoshuva Kesaboyina</span> approves requests and assigns official Toastmasters leadership roles.
                  </p>
                </div>
                <button
                  onClick={() => onNavigate('members')}
                  className="mt-4 text-xs font-bold text-[#004165] hover:text-[#772432] flex items-center space-x-1"
                >
                  <span>Members & Access Queue →</span>
                </button>
              </div>

              {/* Step 2: Meeting Agendas & Role Claims */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col justify-between hover:border-[#004165] transition">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold bg-[#772432] text-white px-2 py-0.5 rounded uppercase">
                      Stage 2
                    </span>
                    <Calendar className="w-5 h-5 text-[#772432]" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm mb-1">Agendas & Role Signups</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    VP Education publishes the meeting theme and agenda. Members sign up for TMOD, Speakers 1–6, General Evaluator, Timer, and Ah-Counter slots.
                  </p>
                </div>
                <button
                  onClick={() => onNavigate('meeting-agendas')}
                  className="mt-4 text-xs font-bold text-[#004165] hover:text-[#772432] flex items-center space-x-1"
                >
                  <span>Claim Meeting Roles →</span>
                </button>
              </div>

              {/* Step 3: Evidence-Backed Execution */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col justify-between hover:border-[#004165] transition">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold bg-amber-600 text-white px-2 py-0.5 rounded uppercase">
                      Stage 3
                    </span>
                    <Paperclip className="w-5 h-5 text-amber-600" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm mb-1">Execution & Evidence Upload</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Speakers deliver milestone speeches; officers fulfill duties. Verified photos from Scaler Hall, speech video links, and MoM records are uploaded as proof.
                  </p>
                </div>
                <button
                  onClick={() => onNavigate('all-tasks')}
                  className="mt-4 text-xs font-bold text-[#004165] hover:text-[#772432] flex items-center space-x-1"
                >
                  <span>Submit Task Evidence →</span>
                </button>
              </div>

              {/* Step 4: Verification & Audit Archive */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col justify-between hover:border-[#004165] transition">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold bg-emerald-600 text-white px-2 py-0.5 rounded uppercase">
                      Stage 4
                    </span>
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm mb-1">Officer Sign-Off & Audit</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Club President and VP Education review submitted evidence, provide constructive feedback, approve milestones, and update immutable club archives.
                  </p>
                </div>
                <button
                  onClick={() => onNavigate('review-queue')}
                  className="mt-4 text-xs font-bold text-[#004165] hover:text-[#772432] flex items-center space-x-1"
                >
                  <span>Open Review Queue →</span>
                </button>
              </div>

            </div>
          </div>
        )}

        {/* Tab 2: Flow of Everyone (7 Key Roles) */}
        {workflowTab === 'officers' && (
          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              
              {/* President */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#772432] bg-[#772432]/10 px-2 py-0.5 rounded">
                    Club President
                  </span>
                  <span className="text-xs font-bold text-slate-900">TM Arunima Vats</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Opens and closes meetings with gavel; presides over Executive Committee; verifies club charter goals and official meeting adherence.
                </p>
                <div className="text-[11px] text-slate-500 font-medium pt-1 border-t border-slate-200">
                  Key Tasks: Presidential Address, Charter Adherence, Executive Alignments.
                </div>
              </div>

              {/* VP Education */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#004165] bg-[#004165]/10 px-2 py-0.5 rounded">
                    VP Education
                  </span>
                  <span className="text-xs font-bold text-slate-900">TM Shakthi Sivapriya</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Publishes meeting agendas, schedules speaker milestone slots, coordinates speech evaluations, and manages Pathways mentor assignments.
                </p>
                <div className="text-[11px] text-slate-500 font-medium pt-1 border-t border-slate-200">
                  Key Tasks: Agenda Publishing, Speech Slotting, Evaluator Training.
                </div>
              </div>

              {/* Super Admin / Secretary */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                    Secretary & Super Admin
                  </span>
                  <span className="text-xs font-bold text-slate-900">TM Yahoshuva Kesaboyina</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Compiles official master Minutes of the Meeting (MoM), approves member access requests, manages platform permissions and cloud synchronization.
                </p>
                <div className="text-[11px] text-slate-500 font-medium pt-1 border-t border-slate-200">
                  Key Tasks: Master MoM Compilation, User Approval, Cloud Sync.
                </div>
              </div>

              {/* VP Membership & SAA */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                    SAA / VP Membership
                  </span>
                  <span className="text-xs font-bold text-slate-900">TM Ashish Patel</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Maintains meeting room decorum, positions timing light/cards (Green/Yellow/Red), welcomes club guests, and coordinates Moments of Truth evaluations.
                </p>
                <div className="text-[11px] text-slate-500 font-medium pt-1 border-t border-slate-200">
                  Key Tasks: Timing Card Protocol, Hall Setup, Guest Hospitality.
                </div>
              </div>

              {/* VP Public Relations */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-purple-800 bg-purple-100 px-2 py-0.5 rounded">
                    VP Public Relations
                  </span>
                  <span className="text-xs font-bold text-slate-900">TM Harshitha</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Designs meeting flyers and theme graphics; photographs award winners; publishes meeting recaps on Instagram and LinkedIn.
                </p>
                <div className="text-[11px] text-slate-500 font-medium pt-1 border-t border-slate-200">
                  Key Tasks: Meeting Flyers, Award Carousels, Brand Guidelines.
                </div>
              </div>

              {/* Members & Speakers */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-sky-800 bg-sky-100 px-2 py-0.5 rounded">
                    Members & Speakers
                  </span>
                  <span className="text-xs font-bold text-slate-900">Vedali, Rehan, Abdul Rahman</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Deliver Level 1-5 Pathways speeches, participate in impromptu Table Topics, take up meeting functional roles (Timer, Ah-Counter, Grammarian).
                </p>
                <div className="text-[11px] text-slate-500 font-medium pt-1 border-t border-slate-200">
                  Key Tasks: Icebreaker Speeches, Table Topics, Rehearsals.
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Tab 3: Proof & MoM Standards */}
        {workflowTab === 'milestones' && (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
                <div className="flex items-center space-x-2 text-[#004165] font-bold text-xs uppercase">
                  <Award className="w-4 h-4 text-[#F2DF74]" />
                  <span>Speech Milestone Evidence</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Every prepared speech requires a photo frame from Scaler Hall or recording timestamp, evaluator written notes, and speech duration verification.
                </p>
                <span className="text-[11px] text-[#004165] font-semibold block pt-1">
                  Standard: 5–7 mins with slide projection & vocal variety.
                </span>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
                <div className="flex items-center space-x-2 text-[#772432] font-bold text-xs uppercase">
                  <BookOpen className="w-4 h-4 text-[#772432]" />
                  <span>MoM & Meeting Documentation</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Consolidated Minutes of the Meeting (MoM) must record total attendance, guest roster, speech titles, award winners, and executive action items.
                </p>
                <span className="text-[11px] text-[#772432] font-semibold block pt-1">
                  Standard: Published within 48h to Club Archives.
                </span>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
                <div className="flex items-center space-x-2 text-emerald-800 font-bold text-xs uppercase">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Role Resource Manuals</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  All 16 official Toastmasters PDF manuals and scripts (Timer, Ah-Counter, Grammarian, Evaluator, SAA) are embedded with live preview and download.
                </p>
                <button
                  onClick={() => onNavigate('role-resources')}
                  className="text-[11px] font-bold text-[#004165] hover:underline block pt-1"
                >
                  View All 16 Official Manuals →
                </button>
              </div>

            </div>
          </div>
        )}

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
