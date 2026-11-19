import React, { useState } from 'react';
import { 
  X, 
  Calendar, 
  User, 
  ShieldCheck, 
  Paperclip, 
  ExternalLink, 
  MessageSquare, 
  CheckCircle2, 
  Clock, 
  AlertCircle 
} from 'lucide-react';
import { Task, Profile } from '../types/database.types';

interface TaskDetailsModalProps {
  task: Task | null;
  onClose: () => void;
  currentUser: Profile;
  onSubmitEvidenceClick: (task: Task) => void;
  onReviewClick: (task: Task) => void;
  onAddComment: (taskId: string, comment: string) => void;
}

export const TaskDetailsModal: React.FC<TaskDetailsModalProps> = ({
  task,
  onClose,
  currentUser,
  onSubmitEvidenceClick,
  onReviewClick,
  onAddComment
}) => {
  if (!task) return null;

  const [commentText, setCommentText] = useState('');
  const isSuperAdmin = currentUser.systemRole === 'super_admin';
  const isOfficer = ['president', 'vpe', 'vpm', 'vppr', 'secretary', 'treasurer', 'saa'].includes(currentUser.systemRole);
  const isAssigned = currentUser.id === task.assignedMemberId;
  const canReview = (isSuperAdmin || isOfficer) && !isAssigned; // Security Rule: No self-approval

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentText.trim()) {
      onAddComment(task.id, commentText.trim());
      setCommentText('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="px-6 py-4 bg-[#004165] text-white flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <span className="bg-[#772432] text-[#F2DF74] text-xs font-bold px-2 py-0.5 rounded border border-[#932C3E]">
                {task.taskCode}
              </span>
              <span className="text-xs text-slate-300 font-medium">{task.departmentName}</span>
            </div>
            <h2 className="text-lg font-bold mt-1 text-white">{task.title}</h2>
          </div>
          <button onClick={onClose} className="text-slate-300 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          
          {/* Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs">
            <div>
              <span className="text-slate-400 block font-semibold">Priority</span>
              <span className={`font-bold uppercase ${
                task.priority === 'urgent' ? 'text-red-600' :
                task.priority === 'high' ? 'text-amber-600' : 'text-blue-600'
              }`}>{task.priority}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-semibold">Status</span>
              <span className="font-bold text-slate-800 capitalize">{task.status.replace(/_/g, ' ')}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-semibold">Assigned Member</span>
              <span className="font-bold text-slate-800 truncate block">{task.assignedMemberName}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-semibold">Due Date</span>
              <span className="font-bold text-slate-800">{task.dueDate || 'Flexible'}</span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Description</h4>
            <p className="text-sm text-slate-700 leading-relaxed bg-white p-3 rounded-lg border border-slate-100">
              {task.description || 'No detailed description provided.'}
            </p>
          </div>

          {/* Acceptance Criteria */}
          {task.acceptanceCriteria && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Acceptance Criteria</h4>
              <p className="text-sm text-slate-700 leading-relaxed bg-amber-50/60 p-3 rounded-lg border border-amber-200">
                {task.acceptanceCriteria}
              </p>
            </div>
          )}

          {/* Evidence Section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center space-x-1">
                <Paperclip className="w-3.5 h-3.5" />
                <span>Submitted Evidence & Proof ({task.evidence?.length || 0})</span>
              </h4>
              {task.proofRequired && (
                <span className="text-[11px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                  Proof Required
                </span>
              )}
            </div>

            {(!task.evidence || task.evidence.length === 0) ? (
              <div className="p-4 bg-slate-50 rounded-xl border border-dashed border-slate-300 text-center">
                <p className="text-xs text-slate-500">No evidence submitted yet.</p>
                {isAssigned && (
                  <button
                    onClick={() => onSubmitEvidenceClick(task)}
                    className="mt-2 text-xs font-bold text-[#004165] hover:underline"
                  >
                    + Submit Evidence Now
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {task.evidence.map(ev => (
                  <div key={ev.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-900">{ev.submitterName}</span>
                      <span className="text-slate-400">{new Date(ev.createdAt).toLocaleString()}</span>
                    </div>
                    <p className="text-xs text-slate-700">{ev.workDescription}</p>

                    {/* Image / Proof Preview */}
                    {ev.fileUrl && (
                      <div className="mt-2">
                        <img 
                          src={ev.fileUrl} 
                          alt="Proof preview" 
                          className="max-h-56 rounded-lg border border-slate-300 object-cover shadow-sm"
                        />
                      </div>
                    )}

                    {/* URL Link */}
                    {ev.linkUrl && (
                      <a 
                        href={ev.linkUrl} 
                        target="_blank" 
                        rel="noreferrer"
                        className="inline-flex items-center space-x-1 text-xs text-[#004165] hover:underline font-semibold"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>View External Proof Source</span>
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Reviews & Verification History */}
          {task.reviews && task.reviews.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Verification & Review History</span>
              </h4>
              <div className="space-y-2">
                {task.reviews.map(rev => (
                  <div 
                    key={rev.id} 
                    className={`p-3 rounded-lg border text-xs ${
                      rev.action === 'approved' 
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
                        : 'bg-red-50 border-red-200 text-red-900'
                    }`}
                  >
                    <div className="flex items-center justify-between font-semibold">
                      <span>{rev.reviewerName} ({rev.reviewerRole})</span>
                      <span className="uppercase font-bold">{rev.action}</span>
                    </div>
                    <p className="mt-1">{rev.feedback}</p>
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      {new Date(rev.createdAt).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Comments Thread */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center space-x-1">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Discussion & Updates</span>
            </h4>
            <div className="space-y-2 mb-3 max-h-36 overflow-y-auto">
              {(!task.comments || task.comments.length === 0) ? (
                <p className="text-xs text-slate-400 italic">No comments posted yet.</p>
              ) : (
                task.comments.map(c => (
                  <div key={c.id} className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 text-xs">
                    <span className="font-bold text-slate-800">{c.authorName}: </span>
                    <span className="text-slate-600">{c.comment}</span>
                  </div>
                ))
              )}
            </div>

            <form onSubmit={handleCommentSubmit} className="flex space-x-2">
              <input
                type="text"
                placeholder="Write an update or question..."
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                className="flex-1 px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#004165] focus:outline-none"
              />
              <button
                type="submit"
                className="px-3 py-1.5 bg-slate-800 text-white rounded-lg text-xs font-semibold hover:bg-slate-900 transition"
              >
                Post
              </button>
            </form>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 transition"
          >
            Close
          </button>

          <div className="flex items-center space-x-2">
            {/* Submit Evidence Button */}
            {task.status !== 'approved' && (
              <button
                onClick={() => onSubmitEvidenceClick(task)}
                className="px-4 py-2 bg-[#772432] hover:bg-[#932C3E] text-white text-xs font-bold rounded-lg shadow-sm transition flex items-center space-x-1"
              >
                <Paperclip className="w-3.5 h-3.5 text-[#F2DF74]" />
                <span>Submit Evidence</span>
              </button>
            )}

            {/* Review Button for Officers (Self-approval blocked) */}
            {task.status === 'submitted_for_review' && canReview && (
              <button
                onClick={() => onReviewClick(task)}
                className="px-4 py-2 bg-[#004165] hover:bg-[#002B44] text-white text-xs font-bold rounded-lg shadow-sm transition flex items-center space-x-1"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#F2DF74]" />
                <span>Review & Verify</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
