import React, { useState } from 'react';
import { X, Paperclip, Upload, Link2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Task, Profile, TaskEvidence } from '../types/database.types';

interface EvidenceUploaderModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  currentUser: Profile;
  onEvidenceSubmitted: (taskId: string, evidence: Omit<TaskEvidence, 'id' | 'createdAt'>) => void;
}

export const EvidenceUploaderModal: React.FC<EvidenceUploaderModalProps> = ({
  task,
  isOpen,
  onClose,
  currentUser,
  onEvidenceSubmitted
}) => {
  if (!isOpen || !task) return null;

  const [workDescription, setWorkDescription] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileType, setFileType] = useState('image/jpeg');
  const [error, setError] = useState('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setFileType(file.type || 'image/jpeg');
      
      // Create local preview URL
      const preview = URL.createObjectURL(file);
      setFileUrl(preview);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!workDescription.trim()) {
      setError('Please provide a description of the completed work.');
      return;
    }

    if (!fileUrl && !linkUrl) {
      setError('Please attach at least one proof file or external URL link.');
      return;
    }

    onEvidenceSubmitted(task.id, {
      taskId: task.id,
      submittedBy: currentUser.id,
      submitterName: currentUser.fullName,
      submitterEmail: currentUser.email,
      workDescription: workDescription.trim(),
      fileUrl: fileUrl || undefined,
      fileName: fileName || undefined,
      fileType: fileType,
      linkUrl: linkUrl.trim() || undefined
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="px-6 py-4 bg-[#772432] text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-white p-1 flex items-center justify-center shadow-sm flex-shrink-0">
              <img src="/toastmasters-logo.svg" alt="Toastmasters" className="w-full h-full object-contain" />
            </div>
            <div>
              <h3 className="font-bold text-base">Submit Evidence for Verification</h3>
              <p className="text-xs text-slate-200">{task.taskCode}: {task.title}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-300 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 text-red-700 text-xs rounded-lg flex items-center space-x-2 border border-red-200">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Work Description & Summary *
            </label>
            <textarea
              required
              rows={3}
              placeholder="Describe what was accomplished, speech times, attendee counts, or resolution steps..."
              value={workDescription}
              onChange={e => setWorkDescription(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-[#772432] focus:outline-none"
            />
          </div>

          {/* File Upload Area */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Upload Proof Asset (JPG, PNG, PDF, DOCX)
            </label>
            <div className="border-2 border-dashed border-slate-300 hover:border-[#772432] rounded-xl p-4 text-center bg-slate-50 transition cursor-pointer relative">
              <input
                type="file"
                accept="image/*,application/pdf,.doc,.docx"
                onChange={handleFileUpload}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1" />
              <p className="text-xs font-semibold text-slate-700">Click to select file or drag & drop</p>
              <p className="text-[10px] text-slate-400">Supported: JPEG, PNG, WebP, PDF, Word Docs</p>
            </div>

            {fileName && (
              <div className="mt-2 p-2 bg-emerald-50 rounded-lg border border-emerald-200 flex items-center justify-between text-xs text-emerald-800">
                <span className="font-semibold truncate max-w-xs">{fileName}</span>
                <span className="text-[10px] bg-emerald-200 px-1.5 py-0.5 rounded">Ready</span>
              </div>
            )}
          </div>

          {/* External URL Link */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              External Proof Link (Google Drive, Instagram, YouTube, etc.)
            </label>
            <div className="flex items-center space-x-2">
              <Link2 className="w-4 h-4 text-slate-400" />
              <input
                type="url"
                placeholder="https://drive.google.com/... or https://instagram.com/..."
                value={linkUrl}
                onChange={e => setLinkUrl(e.target.value)}
                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-[#772432] focus:outline-none"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#772432] hover:bg-[#932C3E] text-white text-xs font-bold rounded-lg shadow-md transition"
            >
              Submit for Review
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
