import React, { useState } from 'react';
import { Paperclip, ExternalLink, Search, CheckCircle2, FileText, Image as ImageIcon } from 'lucide-react';
import { Task, Profile } from '../types/database.types';

interface EvidenceHistoryProps {
  tasks: Task[];
  onSelectTask: (task: Task) => void;
}

export const EvidenceHistory: React.FC<EvidenceHistoryProps> = ({
  tasks,
  onSelectTask
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Collect all submitted evidence items
  const allEvidence = tasks.flatMap(task => 
    (task.evidence || []).map(ev => ({
      ...ev,
      taskCode: task.taskCode,
      taskTitle: task.title,
      taskDepartment: task.departmentName,
      taskStatus: task.status,
      taskObject: task
    }))
  );

  const filteredEvidence = allEvidence.filter(e => 
    e.taskTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.taskCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.submitterName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.workDescription.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
              <span className="text-xs font-bold uppercase tracking-wider">Club Proof Vault</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900">Toastmasters Evidence Vault</h1>
            <p className="text-xs text-slate-500">
              Searchable historical archive of all proof submissions, video frames, documents, and external links
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="w-full sm:w-64">
          <input
            type="text"
            placeholder="Search proof items..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#004165] focus:outline-none"
          />
        </div>
      </div>

      {/* Grid of Evidence Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvidence.length === 0 ? (
          <div className="col-span-full p-12 bg-white rounded-2xl border border-dashed border-slate-300 text-center text-xs text-slate-500">
            No evidence matches your search criteria.
          </div>
        ) : (
          filteredEvidence.map(item => (
            <div 
              key={item.id} 
              onClick={() => onSelectTask(item.taskObject)}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:border-[#004165] transition cursor-pointer flex flex-col justify-between"
            >
              {/* Media Preview or Icon Header */}
              {item.fileUrl ? (
                <div className="h-44 bg-slate-100 overflow-hidden relative">
                  <img 
                    src={item.fileUrl} 
                    alt={item.taskTitle}
                    className="w-full h-full object-cover hover:scale-105 transition duration-300" 
                  />
                  <span className="absolute top-2 left-2 bg-[#772432] text-[#F2DF74] text-[10px] font-bold px-2 py-0.5 rounded shadow">
                    {item.taskCode}
                  </span>
                </div>
              ) : (
                <div className="h-28 bg-[#004165]/10 flex items-center justify-center p-4">
                  <FileText className="w-8 h-8 text-[#004165]" />
                </div>
              )}

              {/* Card Body */}
              <div className="p-4 space-y-2 flex-1">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                  {item.taskDepartment}
                </span>
                <h4 className="font-bold text-xs text-slate-900 line-clamp-1">{item.taskTitle}</h4>
                <p className="text-[11px] text-slate-600 line-clamp-2">{item.workDescription}</p>

                {item.linkUrl && (
                  <a
                    href={item.linkUrl}
                    target="_blank"
                    rel="noreferrer"
                    onClick={e => e.stopPropagation()}
                    className="inline-flex items-center space-x-1 text-[11px] font-semibold text-[#004165] hover:underline"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span className="truncate max-w-[200px]">{item.linkUrl}</span>
                  </a>
                )}
              </div>

              {/* Footer */}
              <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
                <span>By {item.submitterName}</span>
                <span>{new Date(item.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
};
