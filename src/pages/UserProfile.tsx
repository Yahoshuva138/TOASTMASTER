import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Shield, 
  Building2, 
  Calendar, 
  Award, 
  Paperclip, 
  CheckCircle2, 
  Clock, 
  FileText, 
  ExternalLink, 
  Share2, 
  Copy, 
  Check, 
  Sparkles, 
  TrendingUp, 
  Search, 
  Filter, 
  Layers, 
  MessageSquare, 
  Quote, 
  Video, 
  Image as ImageIcon,
  ChevronRight,
  BookOpen
} from 'lucide-react';
import { 
  Profile, 
  Task, 
  MemberEvaluationItem, 
  MemberParticipationEvent, 
  PRMemberStory 
} from '../types/database.types';
import { 
  INITIAL_MEMBER_EVALUATIONS, 
  INITIAL_MEMBER_PARTICIPATION, 
  INITIAL_PR_MEMBER_STORIES 
} from '../lib/taskStore';
import { formatDueDateTime } from '../lib/dateUtils';

interface UserProfileProps {
  currentUser: Profile;
  tasks: Task[];
  members?: Profile[];
  onSelectTask?: (task: Task) => void;
  onNavigate?: (page: string) => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({
  currentUser,
  tasks,
  members = [],
  onSelectTask,
  onNavigate
}) => {
  // Allow viewing personal profile or switching to inspect another member's story (e.g. for PR or Admin)
  const [selectedMemberId, setSelectedMemberId] = useState<string>(currentUser.id);
  const [activeTab, setActiveTab] = useState<'evidence' | 'evaluations' | 'timeline' | 'pr-story' | 'todos'>('evidence');
  const [evalTypeFilter, setEvalTypeFilter] = useState<'all' | 'evaluated' | 'evaluating'>('all');
  const [evidenceFilter, setEvidenceFilter] = useState<'all' | 'photos' | 'videos' | 'docs'>('all');
  const [copiedCaption, setCopiedCaption] = useState<'insta' | 'linkedin' | null>(null);

  // Active member profile
  const activeMember = members.find(m => m.id === selectedMemberId) || currentUser;

  // 1. My Tasks (Live Data Tracking)
  const memberTasks = tasks.filter(t => t.assignedMemberId === activeMember.id);
  const completedTasks = memberTasks.filter(t => t.status === 'approved');
  const inProgressTasks = memberTasks.filter(t => t.status === 'in_progress');
  const underReviewTasks = memberTasks.filter(t => t.status === 'submitted_for_review');
  const completionRate = memberTasks.length > 0 ? Math.round((completedTasks.length / memberTasks.length) * 100) : 0;

  // 2. My Evidences (10-15 proofs associated with this member)
  const memberEvidences = React.useMemo(() => {
    const list: Array<{
      id: string;
      title: string;
      meetingName: string;
      workDescription: string;
      fileUrl: string;
      fileType: string;
      fileName: string;
      linkUrl?: string;
      createdAt: string;
      taskCode: string;
      reviewerName?: string;
      reviewerFeedback?: string;
    }> = [];

    // Extract from all tasks
    tasks.forEach(t => {
      if (t.assignedMemberId === activeMember.id || t.evidence?.some(e => e.submittedBy === activeMember.id)) {
        if (t.evidence && t.evidence.length > 0) {
          t.evidence.forEach(ev => {
            list.push({
              id: ev.id,
              title: t.title,
              meetingName: t.meetingName || 'Club Meeting',
              workDescription: ev.workDescription,
              fileUrl: ev.fileUrl || t.proofThumbnail || '/proof/real_speaker1_yahoshuva.jpg',
              fileType: ev.fileType || 'image/jpeg',
              fileName: ev.fileName || 'evidence_proof.jpg',
              linkUrl: ev.linkUrl || t.proofSourceUrl,
              createdAt: ev.createdAt,
              taskCode: t.taskCode,
              reviewerName: t.reviews?.[0]?.reviewerName,
              reviewerFeedback: t.reviews?.[0]?.feedback
            });
          });
        } else if (t.proofThumbnail) {
          list.push({
            id: 'ev-thumb-' + t.id,
            title: t.title,
            meetingName: t.meetingName || 'Club Meeting',
            workDescription: t.description,
            fileUrl: t.proofThumbnail,
            fileType: 'image/jpeg',
            fileName: 'meeting_proof.jpg',
            linkUrl: t.proofSourceUrl,
            createdAt: t.createdAt,
            taskCode: t.taskCode,
            reviewerName: t.reviews?.[0]?.reviewerName,
            reviewerFeedback: t.reviews?.[0]?.feedback
          });
        }
      }
    });

    // Extract from member participation
    INITIAL_MEMBER_PARTICIPATION.forEach(p => {
      if (p.memberId === activeMember.id && p.proofThumbnail) {
        if (!list.some(item => item.fileUrl === p.proofThumbnail)) {
          list.push({
            id: 'ev-part-' + p.id,
            title: p.speechTitle || p.rolesPlayed.join(' & '),
            meetingName: `Meeting ${p.meetingNumber}: ${p.meetingTheme}`,
            workDescription: `Fulfilled roles: ${p.rolesPlayed.join(', ')}. ${p.awardsWon?.length ? 'Awards: ' + p.awardsWon.join(', ') : ''}`,
            fileUrl: p.proofThumbnail,
            fileType: 'image/jpeg',
            fileName: 'role_participation_proof.jpg',
            linkUrl: p.videoUrl,
            createdAt: p.meetingDate,
            taskCode: `M${p.meetingNumber}-EV`,
            reviewerName: 'Club Executive Committee'
          });
        }
      }
    });

    return list;
  }, [tasks, activeMember.id]);

  // Filtered evidences
  const filteredEvidences = memberEvidences.filter(ev => {
    if (evidenceFilter === 'photos') return ev.fileType?.includes('image') || ev.fileName.endsWith('.jpg') || ev.fileName.endsWith('.png');
    if (evidenceFilter === 'videos') return Boolean(ev.linkUrl?.includes('.mp4') || ev.workDescription?.toLowerCase().includes('video'));
    if (evidenceFilter === 'docs') return Boolean(ev.linkUrl?.includes('.docx') || ev.linkUrl?.includes('.md') || ev.fileName.includes('.doc'));
    return true;
  });

  // 3. My Evaluations (Where member was evaluated OR evaluated others)
  const memberEvaluations = INITIAL_MEMBER_EVALUATIONS.filter(
    e => e.speakerId === activeMember.id || e.evaluatorId === activeMember.id
  );

  const filteredEvaluations = memberEvaluations.filter(e => {
    if (evalTypeFilter === 'evaluated') return e.speakerId === activeMember.id;
    if (evalTypeFilter === 'evaluating') return e.evaluatorId === activeMember.id;
    return true;
  });

  // 4. My Meeting Participation History
  const memberParticipations = INITIAL_MEMBER_PARTICIPATION.filter(
    p => p.memberId === activeMember.id
  );

  // 5. PR Member Story
  const prStory = INITIAL_PR_MEMBER_STORIES.find(s => s.memberId === activeMember.id) || {
    memberId: activeMember.id,
    memberName: activeMember.fullName,
    headline: `Dedicated Toastmaster & ${activeMember.clubRole}`,
    quote: "Every speech delivered on stage is a stepping stone toward authentic communication leadership.",
    pathwayTrack: 'Presentation Mastery',
    currentLevel: 'Level 1 Milestone',
    speechesCompleted: memberEvaluations.filter(e => e.speakerId === activeMember.id).length || 1,
    rolesFulfilled: memberParticipations.length || 3,
    awardsCount: 1,
    awards: ['🎖️ Active Club Contributor'],
    spotlightHighlights: [
      `Active member of ${activeMember.departmentName || 'SpeakUp Scaler Club'}.`,
      'Regular contributor to club meeting agendas and speech evaluations.'
    ],
    instagramCaption: `🌟 MEMBER SPOTLIGHT: ${activeMember.fullName}! 🎙️✨\n\nCelebrating leadership and communication growth with ${activeMember.clubRole} at SpeakUp Scaler Toastmasters Club #28681022!\n\n#Toastmasters #SpeakUpScaler #Leadership`,
    linkedInPost: `Proud to highlight ${activeMember.fullName}, serving as ${activeMember.clubRole} at SpeakUp Scaler Toastmasters Club.\n\n#ToastmastersInternational #PublicSpeaking #Leadership`,
    featuredProofImage: memberEvidences[0]?.fileUrl || '/proof/real_speaker1_yahoshuva.jpg'
  };

  // Copy to clipboard helper
  const handleCopyCaption = (type: 'insta' | 'linkedin', text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCaption(type);
    setTimeout(() => setCopiedCaption(null), 2500);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      
      {/* Top Banner: Member Selector & Profile Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        
        <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-5 text-center sm:text-left">
          <div className="relative">
            <img 
              src={activeMember.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'} 
              alt={activeMember.fullName}
              className="w-24 h-24 rounded-2xl object-cover border-4 border-[#004165] shadow-lg" 
            />
            <div className="absolute -bottom-2 -right-2 w-9 h-9 rounded-full bg-white p-1 border-2 border-[#F2DF74] shadow-md flex items-center justify-center">
              <img 
                src="/toastmasters-logo.svg" 
                alt="Toastmasters" 
                className="w-full h-full object-contain" 
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="text-2xl font-brand font-black text-slate-900">{activeMember.fullName}</h1>
              <span className="px-3 py-0.5 rounded-full text-xs font-brand font-bold bg-[#772432] text-[#F2DF74] border border-[#932C3E]">
                {activeMember.systemRole === 'super_admin' ? '🛡️ Super Admin' : activeMember.clubRole}
              </span>
              <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Active Roster</span>
              </span>
            </div>

            <p className="text-xs text-slate-500 flex items-center justify-center sm:justify-start space-x-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-mono text-slate-700">{activeMember.email}</span>
            </p>

            <p className="text-xs text-slate-600">
              SpeakUp Scaler Toastmasters Club #28681022 • {activeMember.departmentName || 'General Membership'}
            </p>
          </div>
        </div>

        {/* Member Selector (Enables PR / Admin to inspect ANY member's story) */}
        <div className="w-full md:w-auto bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-2 flex-shrink-0 text-left">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700">
            <span>Inspect Member Portfolio:</span>
            <span className="text-[10px] text-[#004165] font-semibold">PR & Officer Tool</span>
          </div>
          <select
            value={selectedMemberId}
            onChange={(e) => setSelectedMemberId(e.target.value)}
            className="w-full px-3 py-2 text-xs font-semibold bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#004165]"
          >
            {members.length > 0 ? (
              members.map(m => (
                <option key={m.id} value={m.id}>
                  {m.fullName} ({m.clubRole})
                </option>
              ))
            ) : (
              <option value={currentUser.id}>{currentUser.fullName}</option>
            )}
          </select>
          {selectedMemberId !== currentUser.id && (
            <button
              onClick={() => setSelectedMemberId(currentUser.id)}
              className="text-[11px] font-bold text-[#004165] hover:underline block"
            >
              ← Back to My Personal Profile
            </button>
          )}
        </div>

      </div>

      {/* 5 Real-Time Personal Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-center">
          <span className="text-[11px] font-brand font-bold uppercase text-slate-400 block">Assigned To-Dos</span>
          <span className="text-2xl font-black text-slate-900 mt-0.5 block">{memberTasks.length}</span>
          <span className="text-[10px] text-slate-500">{completedTasks.length} verified done</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-center">
          <span className="text-[11px] font-brand font-bold uppercase text-slate-400 block">Verified Evidences</span>
          <span className="text-2xl font-black text-[#004165] mt-0.5 block">{memberEvidences.length}</span>
          <span className="text-[10px] text-emerald-600 font-semibold">Stage & MoM proofs</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-center">
          <span className="text-[11px] font-brand font-bold uppercase text-slate-400 block">Evaluations Matrix</span>
          <span className="text-2xl font-black text-[#772432] mt-0.5 block">{memberEvaluations.length}</span>
          <span className="text-[10px] text-slate-500">Evaluated & Evaluator</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-center">
          <span className="text-[11px] font-brand font-bold uppercase text-slate-400 block">Meeting Events</span>
          <span className="text-2xl font-black text-amber-700 mt-0.5 block">{memberParticipations.length || 3}</span>
          <span className="text-[10px] text-slate-500">Active participation</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-center col-span-2 sm:col-span-1">
          <span className="text-[11px] font-brand font-bold uppercase text-slate-400 block">Completion Rate</span>
          <span className="text-2xl font-black text-emerald-600 mt-0.5 block">{completionRate}%</span>
          <span className="text-[10px] text-emerald-700 font-semibold">Accountability score</span>
        </div>

      </div>

      {/* Main Tab Navigation */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        
        {/* Navigation Tabs */}
        <div className="flex items-center space-x-1 p-2 bg-slate-50 border-b border-slate-200 overflow-x-auto">
          
          <button
            onClick={() => setActiveTab('evidence')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center space-x-2 flex-shrink-0 ${
              activeTab === 'evidence'
                ? 'bg-[#004165] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Paperclip className="w-3.5 h-3.5" />
            <span>1. My Evidence Vault ({memberEvidences.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('evaluations')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center space-x-2 flex-shrink-0 ${
              activeTab === 'evaluations'
                ? 'bg-[#004165] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>2. Evaluations Matrix ({memberEvaluations.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('timeline')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center space-x-2 flex-shrink-0 ${
              activeTab === 'timeline'
                ? 'bg-[#004165] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>3. Event Participation ({memberParticipations.length || 3})</span>
          </button>

          <button
            onClick={() => setActiveTab('pr-story')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center space-x-2 flex-shrink-0 ${
              activeTab === 'pr-story'
                ? 'bg-[#772432] text-[#F2DF74] shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>4. PR Member Story Spotlight</span>
          </button>

          <button
            onClick={() => setActiveTab('todos')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center space-x-2 flex-shrink-0 ${
              activeTab === 'todos'
                ? 'bg-[#004165] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>5. Live To-Do List ({memberTasks.length})</span>
          </button>

        </div>

        {/* TAB 1: MY EVIDENCE VAULT (10-15 Real Evidences & Proofs) */}
        {activeTab === 'evidence' && (
          <div className="p-6 space-y-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
              <div>
                <h3 className="font-brand font-bold text-base text-slate-900">
                  {activeMember.fullName}’s Verified Proof Vault ({memberEvidences.length} Evidences)
                </h3>
                <p className="text-xs text-slate-500">
                  Archived stage photos, video recordings, and Minutes of the Meeting (MoM) verifying milestone completion
                </p>
              </div>

              {/* Filter Pills */}
              <div className="flex items-center space-x-1.5 bg-slate-100 p-1 rounded-xl text-xs font-bold">
                <button
                  onClick={() => setEvidenceFilter('all')}
                  className={`px-3 py-1 rounded-lg transition ${evidenceFilter === 'all' ? 'bg-white text-[#004165] shadow-sm' : 'text-slate-600'}`}
                >
                  All ({memberEvidences.length})
                </button>
                <button
                  onClick={() => setEvidenceFilter('photos')}
                  className={`px-3 py-1 rounded-lg transition ${evidenceFilter === 'photos' ? 'bg-white text-[#004165] shadow-sm' : 'text-slate-600'}`}
                >
                  Photos
                </button>
                <button
                  onClick={() => setEvidenceFilter('videos')}
                  className={`px-3 py-1 rounded-lg transition ${evidenceFilter === 'videos' ? 'bg-white text-[#004165] shadow-sm' : 'text-slate-600'}`}
                >
                  Videos
                </button>
                <button
                  onClick={() => setEvidenceFilter('docs')}
                  className={`px-3 py-1 rounded-lg transition ${evidenceFilter === 'docs' ? 'bg-white text-[#004165] shadow-sm' : 'text-slate-600'}`}
                >
                  MoM Docs
                </button>
              </div>
            </div>

            {filteredEvidences.length === 0 ? (
              <div className="p-8 text-center text-slate-400 italic">
                No matching evidence items found for this filter.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredEvidences.map((ev, idx) => (
                  <div 
                    key={ev.id || idx}
                    className="bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:border-[#004165] hover:shadow-md transition flex flex-col justify-between"
                  >
                    <div>
                      {/* Thumbnail with type pill */}
                      <div className="relative h-44 bg-slate-900 overflow-hidden group">
                        <img 
                          src={ev.fileUrl} 
                          alt={ev.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        />
                        <div className="absolute top-2.5 left-2.5 flex items-center space-x-1.5">
                          <span className="text-[10px] font-bold bg-[#772432] text-[#F2DF74] px-2 py-0.5 rounded shadow">
                            {ev.taskCode}
                          </span>
                          <span className="text-[10px] font-bold bg-[#004165] text-white px-2 py-0.5 rounded shadow">
                            {ev.meetingName}
                          </span>
                        </div>
                        {ev.linkUrl?.includes('.mp4') && (
                          <div className="absolute bottom-2.5 right-2.5 bg-black/70 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center space-x-1">
                            <Video className="w-3 h-3 text-[#F2DF74]" />
                            <span>Video Recording</span>
                          </div>
                        )}
                      </div>

                      {/* Content Details */}
                      <div className="p-4 space-y-2">
                        <h4 className="font-bold text-xs text-slate-900 line-clamp-1">{ev.title}</h4>
                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                          {ev.workDescription}
                        </p>

                        {ev.reviewerName && (
                          <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 text-[11px] text-emerald-900 space-y-1">
                            <div className="flex items-center space-x-1 font-bold text-emerald-800">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Verified: {ev.reviewerName}</span>
                            </div>
                            {ev.reviewerFeedback && (
                              <p className="text-[10px] text-emerald-700 italic line-clamp-2">
                                "{ev.reviewerFeedback}"
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="p-3 bg-white border-t border-slate-200 flex items-center justify-between">
                      <span className="text-[10px] text-slate-400 font-mono">
                        {new Date(ev.createdAt).toLocaleDateString()}
                      </span>
                      {ev.linkUrl ? (
                        <a
                          href={ev.linkUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-bold text-[#004165] hover:text-[#772432] flex items-center space-x-1"
                        >
                          <span>Open File / Video</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <a
                          href={ev.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-bold text-[#004165] hover:text-[#772432] flex items-center space-x-1"
                        >
                          <span>View Proof Photo</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: MY EVALUATIONS MATRIX (Evaluated & Evaluating Others) */}
        {activeTab === 'evaluations' && (
          <div className="p-6 space-y-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
              <div>
                <h3 className="font-brand font-bold text-base text-slate-900">
                  Speech Evaluations Matrix: {activeMember.fullName}
                </h3>
                <p className="text-xs text-slate-500">
                  Structured Toastmasters feedback: speeches where you were evaluated and speeches where you evaluated others
                </p>
              </div>

              {/* Sub-filter */}
              <div className="flex items-center space-x-1.5 bg-slate-100 p-1 rounded-xl text-xs font-bold">
                <button
                  onClick={() => setEvalTypeFilter('all')}
                  className={`px-3 py-1 rounded-lg transition ${evalTypeFilter === 'all' ? 'bg-white text-[#004165] shadow-sm' : 'text-slate-600'}`}
                >
                  All ({memberEvaluations.length})
                </button>
                <button
                  onClick={() => setEvalTypeFilter('evaluated')}
                  className={`px-3 py-1 rounded-lg transition ${evalTypeFilter === 'evaluated' ? 'bg-white text-[#004165] shadow-sm' : 'text-slate-600'}`}
                >
                  Speeches I Delivered
                </button>
                <button
                  onClick={() => setEvalTypeFilter('evaluating')}
                  className={`px-3 py-1 rounded-lg transition ${evalTypeFilter === 'evaluating' ? 'bg-white text-[#004165] shadow-sm' : 'text-slate-600'}`}
                >
                  Speeches I Evaluated
                </button>
              </div>
            </div>

            {filteredEvaluations.length === 0 ? (
              <div className="p-8 text-center text-slate-400 italic">
                No evaluation records found for this category.
              </div>
            ) : (
              <div className="space-y-4">
                {filteredEvaluations.map(ev => {
                  const isSpeaker = ev.speakerId === activeMember.id;

                  return (
                    <div 
                      key={ev.id}
                      className="bg-slate-50 rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4 hover:border-[#004165] transition"
                    >
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                              isSpeaker ? 'bg-[#004165] text-[#F2DF74]' : 'bg-[#772432] text-white'
                            }`}>
                              {isSpeaker ? 'Speaker (Evaluated)' : 'Evaluator (Feedback Giver)'}
                            </span>
                            <span className="text-xs font-bold text-slate-600">
                              Meeting {ev.meetingNumber}: {ev.meetingTheme}
                            </span>
                          </div>
                          <h4 className="font-brand font-black text-slate-900 text-base mt-1">
                            {ev.speechTitle}
                          </h4>
                          <p className="text-xs text-slate-500">{ev.pathwayProject}</p>
                        </div>

                        <div className="text-right flex-shrink-0">
                          {ev.scoreOrRating && (
                            <span className="text-xs font-bold bg-amber-100 text-amber-900 px-2.5 py-1 rounded-lg block border border-amber-200">
                              {ev.scoreOrRating}
                            </span>
                          )}
                          <span className="text-[11px] text-slate-400 block mt-1 font-mono">
                            Duration: {ev.speechDuration || '5-7 mins'}
                          </span>
                        </div>
                      </div>

                      {/* Evaluator vs Speaker Card */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div className="bg-white p-3 rounded-xl border border-slate-200">
                          <span className="text-[10px] font-bold uppercase text-slate-400 block">Delivered By</span>
                          <span className="font-bold text-slate-900 text-sm mt-0.5 block">{ev.speakerName}</span>
                        </div>
                        <div className="bg-white p-3 rounded-xl border border-slate-200">
                          <span className="text-[10px] font-bold uppercase text-slate-400 block">Evaluated By</span>
                          <span className="font-bold text-slate-900 text-sm mt-0.5 block">{ev.evaluatorName}</span>
                        </div>
                      </div>

                      {/* Commendations & Recommendations (Toastmasters Sandwich Method) */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        
                        {/* Commendations */}
                        <div className="bg-emerald-50/70 p-4 rounded-xl border border-emerald-200 space-y-2">
                          <span className="text-xs font-bold text-emerald-900 flex items-center space-x-1.5 uppercase tracking-wider">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <span>Commendations (What Went Well)</span>
                          </span>
                          <ul className="space-y-1.5 text-xs text-emerald-950">
                            {ev.commendations.map((c, i) => (
                              <li key={i} className="flex items-start space-x-1.5">
                                <span className="text-emerald-600 font-black">•</span>
                                <span>{c}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Recommendations */}
                        <div className="bg-amber-50/70 p-4 rounded-xl border border-amber-200 space-y-2">
                          <span className="text-xs font-bold text-amber-900 flex items-center space-x-1.5 uppercase tracking-wider">
                            <TrendingUp className="w-4 h-4 text-amber-600" />
                            <span>Recommendations (Areas for Growth)</span>
                          </span>
                          <ul className="space-y-1.5 text-xs text-amber-950">
                            {ev.recommendations.map((r, i) => (
                              <li key={i} className="flex items-start space-x-1.5">
                                <span className="text-amber-600 font-black">•</span>
                                <span>{r}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                      </div>

                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: MEETING & EVENT PARTICIPATION TIMELINE */}
        {activeTab === 'timeline' && (
          <div className="p-6 space-y-5">
            <div className="border-b border-slate-200 pb-4">
              <h3 className="font-brand font-bold text-base text-slate-900">
                Toastmasters Event & Meeting Participation History
              </h3>
              <p className="text-xs text-slate-500">
                Official record of meetings attended, functional roles fulfilled, and awards won at SpeakUp Scaler
              </p>
            </div>

            <div className="relative border-l-2 border-[#004165] ml-4 sm:ml-6 space-y-6 py-2">
              {memberParticipations.map(p => (
                <div key={p.id} className="relative pl-6 sm:pl-8">
                  
                  {/* Timeline Node Icon */}
                  <div className="absolute -left-[17px] top-1.5 w-8 h-8 rounded-full bg-[#004165] border-4 border-white text-[#F2DF74] flex items-center justify-center shadow">
                    <Calendar className="w-3.5 h-3.5" />
                  </div>

                  {/* Card Content */}
                  <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3 hover:border-[#004165] transition">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-200 pb-2">
                      <div>
                        <span className="text-[10px] font-bold bg-[#772432] text-white px-2 py-0.5 rounded uppercase">
                          Meeting {p.meetingNumber}
                        </span>
                        <h4 className="font-brand font-bold text-slate-900 text-sm mt-1">
                          Theme: {p.meetingTheme}
                        </h4>
                      </div>
                      <span className="text-xs font-semibold text-slate-500 font-mono">
                        {new Date(p.meetingDate).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })}
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold uppercase text-slate-400 block">Roles Fulfilled:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {p.rolesPlayed.map((role, i) => (
                          <span key={i} className="text-xs font-bold bg-[#004165] text-white px-2.5 py-1 rounded-lg">
                            {role}
                          </span>
                        ))}
                      </div>
                    </div>

                    {p.speechTitle && (
                      <p className="text-xs text-slate-700 bg-white p-3 rounded-xl border border-slate-200">
                        <span className="font-bold text-[#004165]">Milestone Speech: </span>
                        <span>"{p.speechTitle}"</span>
                      </p>
                    )}

                    {p.awardsWon && p.awardsWon.length > 0 && (
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        {p.awardsWon.map((aw, i) => (
                          <span key={i} className="text-xs font-bold bg-amber-100 text-amber-900 px-3 py-1 rounded-xl border border-amber-300 flex items-center space-x-1 shadow-sm">
                            <span>{aw}</span>
                          </span>
                        ))}
                      </div>
                    )}

                    {p.proofThumbnail && (
                      <div className="pt-2 flex items-center space-x-3">
                        <img 
                          src={p.proofThumbnail} 
                          alt="Meeting Proof" 
                          className="w-16 h-12 rounded-lg object-cover border border-slate-300 shadow-sm" 
                        />
                        <span className="text-xs text-slate-500">Verified session photograph archived in club evidence vault.</span>
                      </div>
                    )}
                  </div>

                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: PR MEMBER STORY SPOTLIGHT & SOCIAL MEDIA GENERATOR */}
        {activeTab === 'pr-story' && (
          <div className="p-6 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold uppercase text-[#772432] tracking-wider">
                    PR & Media Hub
                  </span>
                  <span className="text-[10px] bg-[#F2DF74] text-[#004165] font-black px-2 py-0.5 rounded-full">
                    Story Spotlight
                  </span>
                </div>
                <h3 className="font-brand font-bold text-base text-slate-900 mt-0.5">
                  Automated Club Member Story Spotlight: {prStory.memberName}
                </h3>
                <p className="text-xs text-slate-500">
                  Ready-to-publish social media copy and visual story cards designed for the VP PR team (TM Harshitha)
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold bg-[#772432] text-white px-3 py-1 rounded-lg">
                  {prStory.pathwayTrack} • {prStory.currentLevel}
                </span>
              </div>
            </div>

            {/* Generated Official Spotlight Card */}
            <div className="bg-gradient-to-br from-[#004165] via-[#002B44] to-[#001D2E] text-white p-6 sm:p-8 rounded-3xl shadow-xl border-2 border-[#F2DF74] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

              <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                
                <div className="space-y-4 max-w-xl">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-brand font-black uppercase text-[#F2DF74] tracking-wider bg-white/10 px-3 py-1 rounded-full border border-white/20">
                      SpeakUp Scaler Member Story
                    </span>
                    <span className="text-xs text-slate-300">Club #28681022</span>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-brand font-black text-white leading-tight">
                    {prStory.headline}
                  </h2>

                  <div className="p-4 bg-white/10 rounded-2xl border border-white/15 italic text-sm text-slate-100 flex items-start space-x-2.5">
                    <Quote className="w-5 h-5 text-[#F2DF74] flex-shrink-0 mt-0.5" />
                    <span>"{prStory.quote}"</span>
                  </div>

                  {/* Highlights Bullet List */}
                  <div className="space-y-1.5 text-xs text-slate-200">
                    {prStory.spotlightHighlights.map((hl, i) => (
                      <div key={i} className="flex items-start space-x-2">
                        <Check className="w-4 h-4 text-[#F2DF74] flex-shrink-0 mt-0.5" />
                        <span>{hl}</span>
                      </div>
                    ))}
                  </div>

                  {/* Awards Ribbon */}
                  <div className="flex flex-wrap items-center gap-2 pt-2">
                    {prStory.awards.map((aw, i) => (
                      <span key={i} className="text-xs font-bold bg-[#F2DF74] text-[#004165] px-3 py-1 rounded-xl shadow">
                        {aw}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Featured Proof Photo */}
                <div className="flex flex-col items-center flex-shrink-0 mx-auto md:mx-0">
                  <div className="w-52 h-44 rounded-2xl overflow-hidden border-2 border-white/30 shadow-2xl">
                    <img 
                      src={prStory.featuredProofImage} 
                      alt="Featured Stage Proof" 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <span className="text-[11px] text-slate-300 font-semibold mt-2">
                    Verified Stage Moment • Scaler Hall
                  </span>
                </div>

              </div>
            </div>

            {/* Ready-to-Copy Social Media Captions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Instagram Caption */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-900">
                    <span>📸 Instagram Caption & Carousel Copy</span>
                  </div>
                  <button
                    onClick={() => handleCopyCaption('insta', prStory.instagramCaption)}
                    className="px-3 py-1 bg-white hover:bg-slate-100 text-xs font-bold text-[#004165] rounded-lg border border-slate-300 shadow-sm transition flex items-center space-x-1"
                  >
                    {copiedCaption === 'insta' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Caption</span>
                      </>
                    )}
                  </button>
                </div>
                <textarea
                  readOnly
                  value={prStory.instagramCaption}
                  rows={6}
                  className="w-full p-3 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none font-sans text-slate-800 leading-relaxed"
                />
              </div>

              {/* LinkedIn Post */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-900">
                    <span>💼 LinkedIn Professional Post</span>
                  </div>
                  <button
                    onClick={() => handleCopyCaption('linkedin', prStory.linkedInPost)}
                    className="px-3 py-1 bg-white hover:bg-slate-100 text-xs font-bold text-[#004165] rounded-lg border border-slate-300 shadow-sm transition flex items-center space-x-1"
                  >
                    {copiedCaption === 'linkedin' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Post</span>
                      </>
                    )}
                  </button>
                </div>
                <textarea
                  readOnly
                  value={prStory.linkedInPost}
                  rows={6}
                  className="w-full p-3 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none font-sans text-slate-800 leading-relaxed"
                />
              </div>

            </div>
          </div>
        )}

        {/* TAB 5: MY LIVE TO-DO LIST (Live Data Tracking) */}
        {activeTab === 'todos' && (
          <div className="p-6 space-y-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-brand font-bold text-base text-slate-900">
                    Live To-Do Tracker: {activeMember.fullName} ({memberTasks.length} Tasks)
                  </h3>
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full flex items-center space-x-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>Live Synced</span>
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Real-time accountability tracking: speeches, evaluations, agendas, and MoM records
                </p>
              </div>

              {onNavigate && (
                <button
                  onClick={() => onNavigate('my-tasks')}
                  className="text-xs font-bold text-[#004165] hover:underline"
                >
                  Open in Dedicated Tasks Board →
                </button>
              )}
            </div>

            {memberTasks.length === 0 ? (
              <div className="p-8 text-center text-slate-400 italic">
                No active tasks assigned to this member.
              </div>
            ) : (
              <div className="space-y-3">
                {memberTasks.map(t => (
                  <div
                    key={t.id}
                    onClick={() => onSelectTask && onSelectTask(t)}
                    className="p-4 bg-slate-50 hover:bg-slate-100 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 cursor-pointer transition"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-bold bg-[#772432] text-[#F2DF74] px-2 py-0.5 rounded">
                          {t.taskCode}
                        </span>
                        <span className="font-bold text-xs text-slate-900">{t.title}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                          t.priority === 'urgent' ? 'bg-red-100 text-red-700' :
                          t.priority === 'high' ? 'bg-amber-100 text-amber-800' :
                          'bg-slate-200 text-slate-700'
                        }`}>
                          {t.priority}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 line-clamp-1">{t.description}</p>
                    </div>

                    <div className="flex items-center space-x-3 flex-shrink-0 self-end sm:self-auto">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                        t.status === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                        t.status === 'submitted_for_review' ? 'bg-purple-100 text-purple-800' :
                        t.status === 'in_progress' ? 'bg-sky-100 text-sky-800' :
                        'bg-slate-200 text-slate-700'
                      }`}>
                        {t.status.replace(/_/g, ' ')}
                      </span>
                      <span className="text-[11px] text-slate-400 font-medium">
                        Due: {formatDueDateTime(t.dueDate)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>

    </div>
  );
};
