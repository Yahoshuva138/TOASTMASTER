import React, { useState } from 'react';
import { Building2, Plus, ArrowRight, CheckCircle2, ShieldCheck, FileText } from 'lucide-react';
import { Department, Task, TaskTemplate } from '../types/database.types';

interface TeamWorkspacesProps {
  departments: Department[];
  tasks: Task[];
  templates: TaskTemplate[];
  onSelectTask: (task: Task) => void;
  onUseTemplate: (template: TaskTemplate) => void;
}

export const TeamWorkspaces: React.FC<TeamWorkspacesProps> = ({
  departments,
  tasks,
  templates,
  onSelectTask,
  onUseTemplate
}) => {
  const [activeDeptId, setActiveDeptId] = useState(departments[0]?.id || 'dept-exec');
  const activeDept = departments.find(d => d.id === activeDeptId) || departments[0];

  const deptTasks = tasks.filter(t => t.departmentId === activeDeptId);
  const deptTemplates = templates.filter(tmpl => tmpl.departmentId === activeDeptId);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-3.5">
        <div className="w-12 h-12 rounded-xl bg-slate-50 p-1.5 border border-slate-200 shadow-sm flex items-center justify-center flex-shrink-0">
          <img 
            src="/toastmasters-logo.svg" 
            alt="Toastmasters" 
            className="w-full h-full object-contain" 
          />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-900">Toastmasters Committee Workspaces</h1>
          <p className="text-xs text-slate-500">
            Departmental responsibility hubs with pre-configured Standard Operating Procedures (SOPs)
          </p>
        </div>

        {/* Department Tabs */}
        <div className="flex items-center space-x-2 mt-4 overflow-x-auto pb-2">
          {departments.map(dept => (
            <button
              key={dept.id}
              onClick={() => setActiveDeptId(dept.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex-shrink-0 ${
                activeDeptId === dept.id
                  ? 'bg-[#004165] text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {dept.name}
            </button>
          ))}
        </div>
      </div>

      {/* Active Department Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Department Tasks */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-base">{activeDept.name} Active Tasks</h3>
                <p className="text-xs text-slate-500">{activeDept.description}</p>
              </div>
              <span className="text-xs font-bold bg-[#004165] text-white px-2.5 py-1 rounded-full">
                {deptTasks.length} Tasks
              </span>
            </div>

            <div className="space-y-3">
              {deptTasks.length === 0 ? (
                <p className="text-xs text-slate-400 italic py-6 text-center">No tasks assigned to this department yet.</p>
              ) : (
                deptTasks.map(t => (
                  <div 
                    key={t.id} 
                    onClick={() => onSelectTask(t)}
                    className="p-3.5 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 flex items-center justify-between cursor-pointer transition"
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-bold bg-[#772432] text-[#F2DF74] px-1.5 py-0.5 rounded">
                          {t.taskCode}
                        </span>
                        <span className="font-bold text-xs text-slate-900">{t.title}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">Assigned: {t.assignedMemberName}</p>
                    </div>

                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded capitalize ${
                      t.status === 'approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {t.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Pre-configured Department Templates */}
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-900 text-sm mb-1 flex items-center space-x-2">
              <FileText className="w-4 h-4 text-[#004165]" />
              <span>Department Quick Templates</span>
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Instantiate proven Toastmasters SOP tasks with one click.
            </p>

            <div className="space-y-3">
              {deptTemplates.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No templates for this department.</p>
              ) : (
                deptTemplates.map(tmpl => (
                  <div key={tmpl.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <span className="font-bold text-xs text-slate-900 block">{tmpl.title}</span>
                    <p className="text-[11px] text-slate-600 line-clamp-2">{tmpl.description}</p>
                    <button
                      onClick={() => onUseTemplate(tmpl)}
                      className="w-full py-1.5 bg-[#004165] hover:bg-[#002B44] text-white text-[11px] font-bold rounded-lg transition"
                    >
                      + Use Template
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
