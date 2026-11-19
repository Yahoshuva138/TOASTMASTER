import React, { useState } from 'react';
import { 
  FileCheck, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Paperclip, 
  ExternalLink, 
  ShieldAlert,
  MessageSquare
} from 'lucide-react';
import { Task, Profile, ReviewAction } from '../types/database.types';

interface ReviewQueueProps {
  tasks: Task[];
  currentUser: Profile;
  onReviewSubmitted: (taskId: string, evidenceId: string | undefined, action: ReviewAction, feedback: string) => void;
  onSelectTask: (task: Task) => void;
}

export const ReviewQueue: React.FC<ReviewQueueProps> = ({
  tasks,
  currentUser,
  onReviewSubmitted,
  onSelectTask
}) => {
  const isSuperAdmin = currentUser.systemRole === 'super_admin';
  const isOfficer = ['president', 'vpe', 'vpm', 'vppr', 'secretary', 'treasurer', 'saa'].includes(currentUser.systemRole);

  const reviewableTasks = tasks.filter(t => t.status === 'submitted_for_review');

  const [activeTask, setActiveTask] = useState<Task | null>(reviewableTasks[0] || null);
  const [feedback, setFeedback] = useState('');
  const [action, setAction] = useState<ReviewAction>('approved');
  const [error, setError] = useState('');

  if (!isSuperAdmin && !isOfficer) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 shadow-sm max-w-lg mx-auto">
        <ShieldAlert className="w-12 h-12 text-amber-500 mx-auto mb-3" />
        <h3 className="font-bold text-slate-900 text-lg">Officer Review Access Required</h3>
        <p className="text-xs text-slate-500 mt-1">
          Only Club Officers and Super Admins are authorized to review submitted proof and verify task completion.
        </p>
      </div>
    );
  }

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTask) return;

    // Security Check 1: Cannot approve own submission
    if (activeTask.assignedMemberId === currentUser.id && action === 'approved') {
      setError('SECURITY VIOLATION: Toastmasters bylaws prohibit self-approval of personal tasks.');
      return;
    }

    // Security Check 2: Rejections require mandatory constructive feedback
    if ((action === 'rejected' || action === 'changes_requested') && !feedback.trim()) {
      setError('Mandatory feedback is required when rejecting or requesting changes.');
      return;
    }

    // Security Check 3: Cannot approve proof-required task with zero evidence
    if (activeTask.proofRequired && (!activeTask.evidence || activeTask.evidence.length === 0)) {
      setError('Cannot approve a proof-required task without attached evidence.');
      return;
    }

    const latestEvidence = activeTask.evidence?.[activeTask.evidence.length - 1];

    onReviewSubmitted(
      activeTask.id,
      latestEvidence?.id,
      action,
      feedback.trim() || 'Verified and approved with officer review.'
    );

    setFeedback('');
    setError('');
    setActiveTask(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center space-x-2 text-[#772432] mb-1">
          <FileCheck className="w-5 h-5" />
          <span className="text-xs font-bold uppercase tracking-wider">Verification Authority</span>
        </div>
        <h1 className="text-xl font-bold text-slate-900">Toastmasters Evidence Review Queue</h1>
        <p className="text-xs text-slate-500">
          Enforce accountability: Review submitted proof, examine video captures, and verify milestone completion.
        </p>
      </div>

      {reviewableTasks.length === 0 ? (
        <div className="p-12 bg-white rounded-2xl border border-dashed border-slate-300 text-center space-y-2">
          <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
          <h3 className="font-bold text-slate-900 text-base">Review Queue is Clear!</h3>
          <p className="text-xs text-slate-500">All submitted club tasks have been evaluated and verified.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column: Tasks Pending Review List */}
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase text-slate-500 block">
              Pending Submissions ({reviewableTasks.length})
            </span>

            {reviewableTasks.map(t => (
              <div
                key={t.id}
                onClick={() => {
                  setActiveTask(t);
                  setError('');
                }}
                className={`p-4 rounded-xl border transition cursor-pointer space-y-2 ${
                  activeTask?.id === t.id
                    ? 'bg-[#004165] text-white border-[#002B44] shadow-md'
                    : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    activeTask?.id === t.id ? 'bg-[#772432] text-[#F2DF74]' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {t.taskCode}
                  </span>
                  <span className={`text-[10px] uppercase font-bold ${
                    activeTask?.id === t.id ? 'text-[#F2DF74]' : 'text-slate-400'
                  }`}>
                    {t.priority}
                  </span>
                </div>

                <h4 className="font-bold text-xs line-clamp-1">{t.title}</h4>
                <p className={`text-[11px] ${activeTask?.id === t.id ? 'text-slate-200' : 'text-slate-500'}`}>
                  Submitted by {t.assignedMemberName}
                </p>
              </div>
            ))}
          </div>

          {/* Right Column: Review Details & Action Box (2 Cols) */}
          {activeTask && (
            <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-xs font-bold bg-[#772432] text-[#F2DF74] px-2 py-0.5 rounded">
                    {activeTask.taskCode}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">{activeTask.departmentName}</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900">{activeTask.title}</h3>
                <p className="text-xs text-slate-600 mt-1">{activeTask.description}</p>
              </div>

              {/* Acceptance Criteria */}
              {activeTask.acceptanceCriteria && (
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900">
                  <span className="font-bold block mb-0.5">Required Acceptance Criteria:</span>
                  <span>{activeTask.acceptanceCriteria}</span>
                </div>
              )}

              {/* Submitted Proof Inspection */}
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase text-slate-700 flex items-center space-x-1">
                  <Paperclip className="w-3.5 h-3.5" />
                  <span>Submitted Evidence for Verification</span>
                </span>

                {(!activeTask.evidence || activeTask.evidence.length === 0) ? (
                  <p className="text-xs text-red-500 italic">No proof file attached by member.</p>
                ) : (
                  activeTask.evidence.map(ev => (
                    <div key={ev.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-900">{ev.submitterName} ({ev.submitterEmail})</span>
                        <span className="text-slate-400">{new Date(ev.createdAt).toLocaleString()}</span>
                      </div>

                      <p className="text-xs text-slate-700 bg-white p-3 rounded-lg border border-slate-200">
                        {ev.workDescription}
                      </p>

                      {/* Frame / Screenshot Preview */}
                      {ev.fileUrl && (
                        <div>
                          <span className="text-[11px] font-semibold text-slate-500 block mb-1">Attached Media Proof:</span>
                          <img 
                            src={ev.fileUrl} 
                            alt="Submitted proof" 
                            className="max-h-64 rounded-xl border border-slate-300 shadow-sm object-cover"
                          />
                        </div>
                      )}

                      {/* URL Link */}
                      {ev.linkUrl && (
                        <a
                          href={ev.linkUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center space-x-1 text-xs text-[#004165] font-bold hover:underline"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Inspect Live Resource ({ev.linkUrl})</span>
                        </a>
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* Review Decision Form */}
              <form onSubmit={handleReviewSubmit} className="pt-4 border-t border-slate-200 space-y-4">
                {error && (
                  <div className="p-3 bg-red-50 text-red-700 text-xs rounded-lg flex items-center space-x-2 border border-red-200">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Review Decision</label>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => setAction('approved')}
                      className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center space-x-1.5 transition ${
                        action === 'approved' 
                          ? 'bg-emerald-600 text-white border-emerald-700 shadow-sm' 
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Approve & Verify</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setAction('changes_requested')}
                      className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center space-x-1.5 transition ${
                        action === 'changes_requested' 
                          ? 'bg-amber-600 text-white border-amber-700 shadow-sm' 
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <AlertCircle className="w-4 h-4" />
                      <span>Request Changes</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setAction('rejected')}
                      className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center space-x-1.5 transition ${
                        action === 'rejected' 
                          ? 'bg-red-600 text-white border-red-700 shadow-sm' 
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Reject Proof</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Evaluator Feedback & Constructive Comments *
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Provide specific commendations, recommendations, timing numbers, or required corrections..."
                    value={feedback}
                    onChange={e => setFeedback(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-[#004165] focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-end space-x-3">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#004165] hover:bg-[#002B44] text-white text-xs font-bold rounded-lg shadow-md transition"
                  >
                    Confirm Review Decision
                  </button>
                </div>
              </form>

            </div>
          )}

        </div>
      )}

    </div>
  );
};
