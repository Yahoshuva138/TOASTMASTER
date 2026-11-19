import React, { useState } from 'react';
import { X, CheckSquare, AlertCircle } from 'lucide-react';
import { Department, Profile, TaskPriority, Task } from '../types/database.types';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  departments: Department[];
  members: Profile[];
  currentUser: Profile;
  onTaskCreated: (newTask: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

export const CreateTaskModal: React.FC<CreateTaskModalProps> = ({
  isOpen,
  onClose,
  departments,
  members,
  currentUser,
  onTaskCreated
}) => {
  if (!isOpen) return null;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [departmentId, setDepartmentId] = useState(departments[0]?.id || 'dept-edu');
  const [assignedMemberId, setAssignedMemberId] = useState(currentUser.id);
  const [assignedOfficerId, setAssignedOfficerId] = useState(currentUser.id);
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [dueDate, setDueDate] = useState('');
  const [acceptanceCriteria, setAcceptanceCriteria] = useState('');
  const [proofRequired, setProofRequired] = useState(true);
  const [meetingName, setMeetingName] = useState('Meeting 6 (Upcoming)');
  const [additionalInstructions, setAdditionalInstructions] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Task title is required');
      return;
    }

    const assignedMember = members.find(m => m.id === assignedMemberId) || currentUser;
    const assignedOfficer = members.find(m => m.id === assignedOfficerId) || currentUser;
    const dept = departments.find(d => d.id === departmentId) || departments[0];

    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const taskCode = `${dept.slug.toUpperCase().slice(0, 3)}-${randomSuffix}`;

    onTaskCreated({
      taskCode,
      title: title.trim(),
      description: description.trim(),
      departmentId: dept.id,
      departmentName: dept.name,
      assignedOfficerId: assignedOfficer.id,
      assignedOfficerName: assignedOfficer.fullName,
      assignedMemberId: assignedMember.id,
      assignedMemberName: assignedMember.fullName,
      assignedMemberEmail: assignedMember.email,
      priority,
      status: 'not_started',
      startDate: new Date().toISOString().split('T')[0],
      dueDate: dueDate || undefined,
      acceptanceCriteria: acceptanceCriteria.trim(),
      proofRequired,
      additionalInstructions: additionalInstructions.trim(),
      meetingName,
      evidence: [],
      reviews: [],
      comments: []
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="px-6 py-4 bg-[#004165] text-white flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-white p-1 flex items-center justify-center shadow-sm flex-shrink-0">
              <img src="/toastmasters-logo.svg" alt="Toastmasters" className="w-full h-full object-contain" />
            </div>
            <h3 className="font-bold text-lg">Create New Toastmasters Task</h3>
          </div>
          <button onClick={onClose} className="text-slate-300 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {error && (
            <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg flex items-center space-x-2 border border-red-200">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Task Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Design Digital Meeting Poster for Meeting 6"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-[#004165] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Department</label>
              <select
                value={departmentId}
                onChange={e => setDepartmentId(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-[#004165] focus:outline-none"
              >
                {departments.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Priority</label>
              <select
                value={priority}
                onChange={e => setPriority(e.target.value as TaskPriority)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-[#004165] focus:outline-none"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Assigned Member</label>
              <select
                value={assignedMemberId}
                onChange={e => setAssignedMemberId(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-[#004165] focus:outline-none"
              >
                {members.map(m => (
                  <option key={m.id} value={m.id}>{m.fullName} ({m.clubRole})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-[#004165] focus:outline-none"
              >
              </input>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Description</label>
            <textarea
              rows={2}
              placeholder="Detailed description of responsibilities and goals..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-[#004165] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Acceptance Criteria</label>
            <textarea
              rows={2}
              placeholder="What must be demonstrated for this task to be verified?"
              value={acceptanceCriteria}
              onChange={e => setAcceptanceCriteria(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-[#004165] focus:outline-none"
            />
          </div>

          {/* Proof Required Toggle */}
          <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 flex items-center justify-between">
            <div>
              <span className="font-bold text-xs text-amber-900 block">Proof-Based Completion Required</span>
              <p className="text-[11px] text-amber-700">
                Task cannot be marked completed without uploading evidence (images, docs, or links) and reviewer verification.
              </p>
            </div>
            <input
              type="checkbox"
              checked={proofRequired}
              onChange={e => setProofRequired(e.target.checked)}
              className="w-5 h-5 text-[#772432] rounded focus:ring-[#772432]"
            />
          </div>

          {/* Modal Footer */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#004165] hover:bg-[#002B44] text-white text-sm font-bold rounded-lg shadow-md transition"
            >
              Create Task
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
