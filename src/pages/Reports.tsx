import React from 'react';
import { BarChart3, Download, TrendingUp, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
import { Task, Department, Profile } from '../types/database.types';

interface ReportsProps {
  tasks: Task[];
  departments: Department[];
  members: Profile[];
}

export const Reports: React.FC<ReportsProps> = ({
  tasks,
  departments,
  members
}) => {
  const totalTasks = tasks.length;
  const approvedTasks = tasks.filter(t => t.status === 'approved').length;
  const inProgressTasks = tasks.filter(t => t.status === 'in_progress').length;
  const inReviewTasks = tasks.filter(t => t.status === 'submitted_for_review').length;
  const today = new Date().toISOString().split('T')[0];
  const overdueTasks = tasks.filter(t => t.dueDate && t.dueDate < today && t.status !== 'approved').length;

  // Export to CSV Function
  const handleExportCSV = () => {
    const headers = [
      'Task Code',
      'Title',
      'Department',
      'Assigned Member',
      'Assigned Officer',
      'Priority',
      'Status',
      'Due Date',
      'Proof Required',
      'Evidence Count',
      'Verified By'
    ];

    const rows = tasks.map(t => [
      `"${t.taskCode}"`,
      `"${t.title.replace(/"/g, '""')}"`,
      `"${t.departmentName}"`,
      `"${t.assignedMemberName}"`,
      `"${t.assignedOfficerName || ''}"`,
      `"${t.priority}"`,
      `"${t.status}"`,
      `"${t.dueDate || ''}"`,
      `"${t.proofRequired ? 'YES' : 'NO'}"`,
      `"${t.evidence?.length || 0}"`,
      `"${t.reviews?.[0]?.reviewerName || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Toastmasters_Task_Hub_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-xl bg-slate-50 p-1.5 border border-slate-200 shadow-sm flex items-center justify-center flex-shrink-0">
            <img 
              src="/toastmasters-logo.svg" 
              alt="Toastmasters" 
              className="w-full h-full object-contain" 
            />
          </div>
          <div>
            <div className="flex items-center space-x-2 text-[#004165] mb-0.5">
              <span className="text-xs font-bold uppercase tracking-wider">Club Analytics</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900">Toastmasters Reports & Evidence Analytics</h1>
            <p className="text-xs text-slate-500">
              Real performance metrics derived from verified club meeting tasks and video proof submissions
            </p>
          </div>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-4 py-2 bg-[#004165] hover:bg-[#002B44] text-white text-xs font-bold rounded-lg shadow-sm transition flex items-center space-x-2"
        >
          <Download className="w-4 h-4 text-[#F2DF74]" />
          <span>Export Club Report (CSV)</span>
        </button>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold text-slate-400 block uppercase">Overall Completion</span>
          <span className="text-2xl font-black text-emerald-600 mt-1 block">
            {totalTasks > 0 ? Math.round((approvedTasks / totalTasks) * 100) : 0}%
          </span>
          <span className="text-[10px] text-slate-500 mt-0.5 block">{approvedTasks} of {totalTasks} verified</span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold text-slate-400 block uppercase">Awaiting Verification</span>
          <span className="text-2xl font-black text-purple-700 mt-1 block">{inReviewTasks}</span>
          <span className="text-[10px] text-purple-600 mt-0.5 block">Evidence submitted</span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold text-slate-400 block uppercase">Active In Progress</span>
          <span className="text-2xl font-black text-sky-700 mt-1 block">{inProgressTasks}</span>
          <span className="text-[10px] text-slate-500 mt-0.5 block">Under execution</span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold text-slate-400 block uppercase">Overdue Tasks</span>
          <span className={`text-2xl font-black mt-1 block ${overdueTasks > 0 ? 'text-red-600' : 'text-slate-800'}`}>
            {overdueTasks}
          </span>
          <span className="text-[10px] text-slate-500 mt-0.5 block">Action required</span>
        </div>
      </div>

      {/* Department-wise Completion Breakdown */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="font-bold text-slate-900 text-sm">Department-Wise Task Completion</h3>
        <div className="space-y-3">
          {departments.map(dept => {
            const deptTasks = tasks.filter(t => t.departmentId === dept.id);
            const deptApproved = deptTasks.filter(t => t.status === 'approved').length;
            const percent = deptTasks.length > 0 ? Math.round((deptApproved / deptTasks.length) * 100) : 0;

            return (
              <div key={dept.id} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-800">{dept.name}</span>
                  <span className="text-slate-600">{deptApproved}/{deptTasks.length} ({percent}%)</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-[#004165] h-full transition-all duration-500"
                    style={{ width: `${percent}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Member Performance Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
          <h3 className="font-bold text-slate-900 text-sm">Member-Wise Execution Metrics</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-[#004165] text-white uppercase text-[11px] font-bold">
              <tr>
                <th className="px-4 py-3">Member</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3 text-center">Assigned Tasks</th>
                <th className="px-4 py-3 text-center">Completed & Verified</th>
                <th className="px-4 py-3 text-center">Pending Review</th>
                <th className="px-4 py-3 text-right">Completion Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {members.map(m => {
                const memberTasks = tasks.filter(t => t.assignedMemberId === m.id);
                const approved = memberTasks.filter(t => t.status === 'approved').length;
                const inReview = memberTasks.filter(t => t.status === 'submitted_for_review').length;
                const rate = memberTasks.length > 0 ? Math.round((approved / memberTasks.length) * 100) : 0;

                return (
                  <tr key={m.id} className="hover:bg-slate-50 transition">
                    <td className="px-4 py-3 font-bold text-slate-900">{m.fullName}</td>
                    <td className="px-4 py-3 text-slate-500">{m.clubRole}</td>
                    <td className="px-4 py-3 text-center font-semibold">{memberTasks.length}</td>
                    <td className="px-4 py-3 text-center font-bold text-emerald-700">{approved}</td>
                    <td className="px-4 py-3 text-center font-bold text-purple-700">{inReview}</td>
                    <td className="px-4 py-3 text-right font-black text-slate-800">{rate}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
