import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Kanban, 
  Table as TableIcon, 
  Calendar as CalendarIcon, 
  CheckCircle2, 
  Clock, 
  Paperclip, 
  ShieldCheck, 
  ExternalLink,
  Trash2 
} from 'lucide-react';
import { Task, Department, Profile, ViewMode, TaskStatus, TaskPriority } from '../types/database.types';
import { formatDueDateTime } from '../lib/dateUtils';

interface AllTasksProps {
  tasks: Task[];
  departments: Department[];
  currentUser: Profile;
  onSelectTask: (task: Task) => void;
  onCreateTaskClick: () => void;
  onSubmitEvidenceClick: (task: Task) => void;
  onDeleteTask?: (taskId: string) => void;
  onClearAllSampleTasks?: () => void;
}

export const AllTasks: React.FC<AllTasksProps> = ({
  tasks,
  departments,
  currentUser,
  onSelectTask,
  onCreateTaskClick,
  onSubmitEvidenceClick,
  onDeleteTask,
  onClearAllSampleTasks
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [viewMode, setViewMode] = useState<ViewMode>('kanban');

  // Filter Tasks
  const filteredTasks = tasks.filter(t => {
    const matchesSearch = 
      t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.taskCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.assignedMemberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.description && t.description.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesDept = selectedDept === 'all' || t.departmentId === selectedDept;
    const matchesStatus = selectedStatus === 'all' || t.status === selectedStatus;
    const matchesPriority = selectedPriority === 'all' || t.priority === selectedPriority;

    return matchesSearch && matchesDept && matchesStatus && matchesPriority;
  });

  const kanbanColumns: { id: TaskStatus; label: string; color: string }[] = [
    { id: 'not_started', label: 'Not Started', color: 'border-slate-300' },
    { id: 'in_progress', label: 'In Progress', color: 'border-sky-400' },
    { id: 'submitted_for_review', label: 'Awaiting Review', color: 'border-purple-400' },
    { id: 'approved', label: 'Approved & Verified', color: 'border-emerald-500' }
  ];

  return (
    <div className="space-y-6">
      
      {/* Top Header & Controls */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-xl bg-slate-50 p-1.5 border border-slate-200 shadow-sm flex items-center justify-center flex-shrink-0">
              <img 
                src="/toastmasters-logo.svg" 
                alt="Toastmasters" 
                className="w-full h-full object-contain" 
              />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-brand font-black text-[#004165]">Centralized Club Task Management</h1>
              <p className="text-xs text-slate-500 font-medium">Track, filter, and inspect tasks across all SpeakUp Scaler departments</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto justify-between">
            {/* View Mode Switcher */}
            <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs font-semibold">
              <button
                onClick={() => setViewMode('kanban')}
                className={`flex items-center space-x-1 px-3 py-1.5 rounded-md transition ${
                  viewMode === 'kanban' ? 'bg-white shadow-sm text-[#004165]' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Kanban className="w-3.5 h-3.5" />
                <span>Kanban</span>
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`flex items-center space-x-1 px-3 py-1.5 rounded-md transition ${
                  viewMode === 'table' ? 'bg-white shadow-sm text-[#004165]' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <TableIcon className="w-3.5 h-3.5" />
                <span>Table</span>
              </button>
              <button
                onClick={() => setViewMode('calendar')}
                className={`flex items-center space-x-1 px-3 py-1.5 rounded-md transition ${
                  viewMode === 'calendar' ? 'bg-white shadow-sm text-[#004165]' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <CalendarIcon className="w-3.5 h-3.5" />
                <span>Timeline</span>
              </button>
            </div>

            <div className="flex items-center space-x-2">
              {onClearAllSampleTasks && tasks.length > 0 && (
                <button
                  type="button"
                  onClick={onClearAllSampleTasks}
                  className="px-3 py-2 bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-700 text-xs font-semibold rounded-lg border border-slate-200 transition flex items-center space-x-1"
                  title="Clear sample tasks to start with clean real data"
                >
                  <Trash2 className="w-3.5 h-3.5 text-slate-500" />
                  <span className="hidden md:inline">Reset to Clean Real Data</span>
                </button>
              )}

              <button
                onClick={onCreateTaskClick}
                className="px-4 py-2 bg-[#004165] hover:bg-[#002B44] text-white text-xs font-bold rounded-lg shadow-sm transition flex items-center space-x-1"
              >
                <Plus className="w-3.5 h-3.5 text-[#F2DF74]" />
                <span>New Task</span>
              </button>
            </div>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 border-t border-slate-100">
          
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search code, title, member..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#004165] focus:outline-none"
            />
          </div>

          {/* Department Filter */}
          <div>
            <select
              value={selectedDept}
              onChange={e => setSelectedDept(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#004165] focus:outline-none"
            >
              <option value="all">All Departments ({tasks.length})</option>
              {departments.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#004165] focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="not_started">Not Started</option>
              <option value="in_progress">In Progress</option>
              <option value="submitted_for_review">Awaiting Review</option>
              <option value="approved">Approved & Verified</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div>
            <select
              value={selectedPriority}
              onChange={e => setSelectedPriority(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#004165] focus:outline-none"
            >
              <option value="all">All Priorities</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

        </div>
      </div>

      {/* VIEW MODE 1: KANBAN BOARD */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
          {kanbanColumns.map(col => {
            const colTasks = filteredTasks.filter(t => t.status === col.id);

            return (
              <div key={col.id} className="bg-slate-100/80 p-4 rounded-2xl border border-slate-200">
                <div className={`flex items-center justify-between pb-3 mb-3 border-b-2 ${col.color}`}>
                  <span className="font-brand font-bold text-xs text-slate-800 uppercase tracking-wider">{col.label}</span>
                  <span className="text-xs font-brand font-bold bg-white px-2 py-0.5 rounded-full border border-slate-200 text-slate-700">
                    {colTasks.length}
                  </span>
                </div>

                <div className="space-y-3 min-h-[300px]">
                  {colTasks.length === 0 ? (
                    <p className="text-xs text-slate-400 italic text-center py-8">No tasks in this stage</p>
                  ) : (
                    colTasks.map(t => (
                      <div
                        key={t.id}
                        onClick={() => onSelectTask(t)}
                        className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:border-[#004165] transition cursor-pointer space-y-2 group"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold bg-[#772432] text-[#F2DF74] px-1.5 py-0.5 rounded">
                            {t.taskCode}
                          </span>
                          <div className="flex items-center space-x-1.5">
                            <span className={`text-[10px] font-bold uppercase ${
                              t.priority === 'urgent' ? 'text-red-600' :
                              t.priority === 'high' ? 'text-amber-600' : 'text-blue-600'
                            }`}>
                              {t.priority}
                            </span>
                            {onDeleteTask && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (confirm(`Delete task ${t.taskCode}: "${t.title}"?`)) onDeleteTask(t.id);
                                }}
                                className="opacity-0 group-hover:opacity-100 p-0.5 text-slate-400 hover:text-red-600 transition"
                                title="Delete Task"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>

                        <h4 className="text-xs font-brand font-bold text-slate-900 group-hover:text-[#004165] transition leading-snug">
                          {t.title}
                        </h4>

                        <p className="text-[11px] text-slate-500 line-clamp-2">
                          {t.description}
                        </p>

                        {/* Thumbnail / Evidence Indicator */}
                        {t.evidence && t.evidence.length > 0 && (
                          <div className="flex items-center space-x-1 text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Proof Attached ({t.evidence.length})</span>
                          </div>
                        )}

                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                          <span className="font-semibold text-slate-600 truncate max-w-[120px]">
                            {t.assignedMemberName}
                          </span>
                          <span className="font-medium text-slate-500">{formatDueDateTime(t.dueDate)}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW MODE 2: TABLE VIEW */}
      {viewMode === 'table' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-[#004165] text-white uppercase text-[11px] font-bold">
                <tr>
                  <th className="px-4 py-3">Code</th>
                  <th className="px-4 py-3">Task Title</th>
                  <th className="px-4 py-3">Department</th>
                  <th className="px-4 py-3">Assigned To</th>
                  <th className="px-4 py-3">Priority</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Proof</th>
                  <th className="px-4 py-3">Due Date</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTasks.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="text-center py-8 text-slate-400 italic">No tasks match filter criteria.</td>
                  </tr>
                ) : (
                  filteredTasks.map(t => (
                    <tr 
                      key={t.id} 
                      onClick={() => onSelectTask(t)}
                      className="hover:bg-slate-50 transition cursor-pointer"
                    >
                      <td className="px-4 py-3 font-bold text-[#772432]">{t.taskCode}</td>
                      <td className="px-4 py-3 font-semibold text-slate-900 max-w-xs truncate">{t.title}</td>
                      <td className="px-4 py-3 text-slate-500">{t.departmentName}</td>
                      <td className="px-4 py-3 font-medium text-slate-800">{t.assignedMemberName}</td>
                      <td className="px-4 py-3">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                          t.priority === 'urgent' ? 'bg-red-100 text-red-700' :
                          t.priority === 'high' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                        }`}>{t.priority}</span>
                      </td>
                      <td className="px-4 py-3 capitalize font-semibold">
                        <span className={`text-[10px] px-2 py-0.5 rounded ${
                          t.status === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                          t.status === 'submitted_for_review' ? 'bg-purple-100 text-purple-800' :
                          t.status === 'in_progress' ? 'bg-sky-100 text-sky-800' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {t.status.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {t.evidence && t.evidence.length > 0 ? (
                          <span className="text-emerald-700 font-bold flex items-center space-x-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Verified</span>
                          </span>
                        ) : (
                          <span className="text-slate-400">Pending</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-slate-500 font-medium">{formatDueDateTime(t.dueDate)}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectTask(t);
                            }}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-[#004165] hover:text-white rounded text-[11px] font-semibold transition"
                          >
                            View
                          </button>
                          {onDeleteTask && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (confirm(`Permanently delete task ${t.taskCode}?`)) onDeleteTask(t.id);
                              }}
                              className="p-1 text-slate-400 hover:text-red-600 transition"
                              title="Delete Task"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW MODE 3: TIMELINE / CALENDAR VIEW */}
      {viewMode === 'calendar' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <h3 className="font-bold text-slate-900 text-base">Club Milestones & Deadlines</h3>
          <div className="space-y-4">
            {filteredTasks
              .filter(t => t.dueDate)
              .sort((a, b) => (a.dueDate! > b.dueDate! ? 1 : -1))
              .map(t => (
                <div 
                  key={t.id} 
                  onClick={() => onSelectTask(t)}
                  className="p-4 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 flex items-center justify-between cursor-pointer transition"
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-[#004165] text-white rounded-xl text-center min-w-[90px]">
                      <span className="text-[10px] uppercase font-bold block text-[#F2DF74]">Target</span>
                      <span className="text-xs font-black">{formatDueDateTime(t.dueDate)}</span>
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">{t.taskCode}: {t.title}</span>
                      <p className="text-xs text-slate-500">{t.departmentName} • Assigned: {t.assignedMemberName}</p>
                    </div>
                  </div>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded capitalize ${
                    t.status === 'approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {t.status.replace(/_/g, ' ')}
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}

    </div>
  );
};
