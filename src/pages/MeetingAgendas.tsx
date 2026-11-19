import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  Users, 
  CheckCircle2, 
  Plus, 
  Sparkles, 
  BookOpen, 
  MapPin, 
  Mic, 
  Award, 
  UserPlus, 
  Trash2, 
  X, 
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { Meeting, RoleSignup, Profile } from '../types/database.types';

interface MeetingAgendasProps {
  meetings: Meeting[];
  roleSignups: RoleSignup[];
  currentUser: Profile;
  members: Profile[];
  onSignupRole: (meetingId: string, roleName: string, speechTitle?: string, pathwayProject?: string) => void;
  onDropRole: (signupId: string) => void;
  onCreateMeeting: (newMeeting: Omit<Meeting, 'id' | 'createdAt'>) => void;
  onNavigate: (page: string) => void;
}

export const MeetingAgendas: React.FC<MeetingAgendasProps> = ({
  meetings,
  roleSignups,
  currentUser,
  members,
  onSignupRole,
  onDropRole,
  onCreateMeeting,
  onNavigate
}) => {
  const [selectedMeetingId, setSelectedMeetingId] = useState<string>(
    meetings.find(m => m.status === 'upcoming')?.id || meetings[0]?.id || ''
  );

  const [isCreateMeetingOpen, setIsCreateMeetingOpen] = useState(false);
  const [newMeetingNumber, setNewMeetingNumber] = useState(
    (meetings[0]?.meetingNumber || 5) + 1
  );
  const [newMeetingDate, setNewMeetingDate] = useState('2026-11-28');
  const [newTheme, setNewTheme] = useState('');
  const [newWordOfTheDay, setNewWordOfTheDay] = useState('');
  const [newLocation, setNewLocation] = useState('Scaler Innovation Hall / Hybrid Room');
  const [newNotes, setNewNotes] = useState('');

  // Speaker sign-up modal state
  const [signupModalRole, setSignupModalRole] = useState<string | null>(null);
  const [speechTitle, setSpeechTitle] = useState('');
  const [pathwayProject, setPathwayProject] = useState('');

  const isOfficerOrAdmin = ['super_admin', 'president', 'vpe', 'vpm', 'secretary'].includes(currentUser.systemRole);

  const activeMeeting = meetings.find(m => m.id === selectedMeetingId) || meetings[0];

  const standardRoles = [
    { name: 'Toastmaster of the Day (TMOD)', desc: 'Host & director of the meeting program', icon: Mic, isSpeaker: false },
    { name: 'Table Topics Master (TTM)', desc: 'Conducts impromptu speaking session for members & guests', icon: Sparkles, isSpeaker: false },
    { name: 'General Evaluator (GE)', desc: 'Evaluates entire meeting experience and directs evaluation team', icon: ShieldCheck, isSpeaker: false },
    { name: 'Prepared Speaker 1', desc: '5-7 minute Pathways project speech', icon: Award, isSpeaker: true },
    { name: 'Prepared Speaker 2', desc: '5-7 minute Pathways project speech', icon: Award, isSpeaker: true },
    { name: 'Speech Evaluator 1', desc: 'Provides constructive oral & written evaluation for Speaker 1', icon: Users, isSpeaker: false },
    { name: 'Speech Evaluator 2', desc: 'Provides constructive oral & written evaluation for Speaker 2', icon: Users, isSpeaker: false },
    { name: 'Timer', desc: 'Monitors speaking time and operates green, amber, red signals', icon: Clock, isSpeaker: false },
    { name: 'Ah-Counter', desc: 'Notes filler words, pause pauses, and repeated sounds', icon: CheckCircle2, isSpeaker: false },
    { name: 'Grammarian', desc: 'Introduces Word of the Day and tracks grammatical gems & slips', icon: BookOpen, isSpeaker: false },
  ];

  const handleCreateMeetingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTheme.trim()) return;

    onCreateMeeting({
      meetingNumber: Number(newMeetingNumber),
      meetingDate: newMeetingDate,
      theme: newTheme.trim(),
      wordOfTheDay: newWordOfTheDay.trim() || undefined,
      locationOrLink: newLocation.trim(),
      status: 'upcoming',
      notes: newNotes.trim() || undefined
    });

    setIsCreateMeetingOpen(false);
    setNewTheme('');
    setNewWordOfTheDay('');
  };

  const handleOpenSignup = (roleName: string, isSpeaker: boolean) => {
    if (isSpeaker) {
      setSignupModalRole(roleName);
      setSpeechTitle('');
      setPathwayProject('');
    } else {
      onSignupRole(activeMeeting.id, roleName);
    }
  };

  const handleConfirmSpeakerSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupModalRole) return;
    onSignupRole(activeMeeting.id, signupModalRole, speechTitle.trim(), pathwayProject.trim());
    setSignupModalRole(null);
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
            <div className="flex items-center space-x-2 text-[#772432] mb-0.5">
              <span className="text-[11px] font-brand font-bold uppercase tracking-wider">Live Agenda & Roster</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-brand font-black text-[#004165]">
              Meeting Agendas & Role Sign-ups
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Realtime meeting agendas, speaker schedule, and member role sign-ups for SpeakUp Scaler Club
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2.5 w-full sm:w-auto">
          <button
            onClick={() => onNavigate('role-resources')}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-[#004165] font-brand font-bold text-xs rounded-lg transition flex items-center space-x-1.5"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#004165]" />
            <span>Role Handbook</span>
          </button>

          {isOfficerOrAdmin && (
            <button
              onClick={() => setIsCreateMeetingOpen(true)}
              className="px-4 py-2 bg-[#772432] hover:bg-[#5A1A25] text-white font-brand font-bold text-xs rounded-lg shadow-sm transition flex items-center space-x-1.5"
            >
              <Plus className="w-3.5 h-3.5 text-[#F2DF74]" />
              <span>+ New Meeting</span>
            </button>
          )}
        </div>
      </div>

      {/* Meeting Selector Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2">
        {meetings.map(m => {
          const isSelected = m.id === selectedMeetingId;
          const isUpcoming = m.status === 'upcoming';

          return (
            <button
              key={m.id}
              onClick={() => setSelectedMeetingId(m.id)}
              className={`px-4 py-2.5 rounded-xl font-brand text-xs font-bold transition flex items-center space-x-2 flex-shrink-0 border ${
                isSelected
                  ? 'bg-[#004165] text-white border-[#004165] shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200'
              }`}
            >
              <Calendar className={`w-3.5 h-3.5 ${isSelected ? 'text-[#F2DF74]' : 'text-slate-400'}`} />
              <span>Meeting #{m.meetingNumber}</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                isSelected 
                  ? 'bg-[#772432] text-[#F2DF74]' 
                  : isUpcoming 
                    ? 'bg-emerald-100 text-emerald-800' 
                    : 'bg-slate-100 text-slate-600'
              }`}>
                {isUpcoming ? 'Upcoming' : 'Past'}
              </span>
            </button>
          );
        })}
      </div>

      {activeMeeting && (
        <div className="space-y-6">
          
          {/* Active Meeting Banner Card */}
          <div className="bg-gradient-to-r from-[#004165] via-[#002B44] to-[#004165] text-white p-6 rounded-2xl shadow-md border border-[#002B44] space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-brand font-bold uppercase tracking-wider text-[#F2DF74] block">
                  SpeakUp Scaler Toastmasters Club #28681022
                </span>
                <h2 className="text-2xl font-brand font-black mt-1">
                  Meeting #{activeMeeting.meetingNumber}: {activeMeeting.theme}
                </h2>
              </div>

              <div className="flex items-center space-x-2 text-xs font-semibold bg-white/10 px-3.5 py-1.5 rounded-xl border border-white/20">
                <Calendar className="w-4 h-4 text-[#F2DF74]" />
                <span>{new Date(activeMeeting.meetingDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3 border-t border-white/10 text-xs">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-[#F2DF74] flex-shrink-0" />
                <span className="text-slate-200 truncate">{activeMeeting.locationOrLink}</span>
              </div>

              {activeMeeting.wordOfTheDay && (
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-[#F2DF74] flex-shrink-0" />
                  <span className="text-slate-200 truncate">
                    Word: <strong className="text-white">{activeMeeting.wordOfTheDay}</strong>
                  </span>
                </div>
              )}

              {activeMeeting.notes && (
                <div className="text-slate-300 italic truncate md:text-right">
                  {activeMeeting.notes}
                </div>
              )}
            </div>
          </div>

          {/* Standard Meeting Roles Grid */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-brand font-bold text-base text-slate-900">
                  Role Player Sign-up Sheet (10 Standard Club Roles)
                </h3>
                <p className="text-xs text-slate-500">
                  Every meeting role develops a specific leadership, listening, or speaking competency.
                </p>
              </div>

              <div className="text-xs font-brand font-bold text-[#004165]">
                {roleSignups.filter(s => s.meetingId === activeMeeting.id).length} of {standardRoles.length} roles filled
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {standardRoles.map((role) => {
                const Icon = role.icon;
                const signup = roleSignups.find(
                  s => s.meetingId === activeMeeting.id && s.roleName === role.name
                );
                const isTakenByMe = signup?.memberId === currentUser.id;

                return (
                  <div 
                    key={role.name}
                    className={`p-4 rounded-xl border transition flex flex-col justify-between space-y-3 ${
                      signup
                        ? isTakenByMe
                          ? 'bg-blue-50/70 border-[#004165]'
                          : 'bg-slate-50 border-slate-200'
                        : 'bg-white border-dashed border-slate-300 hover:border-[#004165]'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center space-x-2.5">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            signup ? 'bg-[#004165] text-[#F2DF74]' : 'bg-slate-100 text-slate-500'
                          }`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="font-brand font-bold text-xs text-slate-900 leading-tight">
                              {role.name}
                            </h4>
                            <p className="text-[11px] text-slate-500 leading-tight mt-0.5">
                              {role.desc}
                            </p>
                          </div>
                        </div>

                        {signup ? (
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full flex-shrink-0">
                            Filled
                          </span>
                        ) : (
                          <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full flex-shrink-0">
                            Available
                          </span>
                        )}
                      </div>

                      {/* Display Assigned Member Info */}
                      {signup && (
                        <div className="mt-3 pt-2.5 border-t border-slate-200/80 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="font-brand font-bold text-slate-900">
                              {signup.memberName}
                            </span>
                            <span className="text-[10px] text-slate-500">
                              {signup.memberEmail}
                            </span>
                          </div>

                          {/* Speaker details if applicable */}
                          {signup.speechTitle && (
                            <div className="mt-1.5 p-2 bg-white rounded-lg border border-slate-200 text-[11px] space-y-0.5">
                              <p className="font-semibold text-[#772432]">
                                Speech: "{signup.speechTitle}"
                              </p>
                              {signup.pathwayProject && (
                                <p className="text-slate-500">
                                  Project: {signup.pathwayProject}
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Action Button */}
                    <div className="pt-2 flex items-center justify-end">
                      {signup ? (
                        (isTakenByMe || isOfficerOrAdmin) && (
                          <button
                            onClick={() => onDropRole(signup.id)}
                            className="text-xs text-red-600 hover:text-red-800 font-semibold flex items-center space-x-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Drop Role</span>
                          </button>
                        )
                      ) : (
                        <button
                          onClick={() => handleOpenSignup(role.name, role.isSpeaker)}
                          className="px-3 py-1.5 bg-[#004165] hover:bg-[#002B44] text-white font-brand font-bold text-xs rounded-lg transition shadow-sm flex items-center space-x-1.5"
                        >
                          <UserPlus className="w-3.5 h-3.5 text-[#F2DF74]" />
                          <span>I'll Take This Role</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {/* Speaker Sign-Up Modal */}
      {signupModalRole && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <div className="flex items-center space-x-2">
                <Award className="w-5 h-5 text-[#772432]" />
                <h3 className="font-brand font-bold text-sm text-slate-900">
                  Sign Up as {signupModalRole}
                </h3>
              </div>
              <button onClick={() => setSignupModalRole(null)}>
                <X className="w-4 h-4 text-slate-400 hover:text-slate-600" />
              </button>
            </div>

            <form onSubmit={handleConfirmSpeakerSignup} className="space-y-4">
              <div>
                <label className="block text-xs font-brand font-bold uppercase text-slate-700 mb-1">
                  Speech Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Embracing Imperfection"
                  value={speechTitle}
                  onChange={e => setSpeechTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#004165] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-brand font-bold uppercase text-slate-700 mb-1">
                  Pathways Project (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Dynamic Leadership - Level 1: Ice Breaker"
                  value={pathwayProject}
                  onChange={e => setPathwayProject(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#004165] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSignupModalRole(null)}
                  className="px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#772432] hover:bg-[#5A1A25] text-white font-brand font-bold text-xs rounded-lg shadow-sm"
                >
                  Confirm Speaker Sign-Up
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Meeting Modal (Officers & Admin) */}
      {isCreateMeetingOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-[#004165]" />
                <h3 className="font-brand font-bold text-base text-slate-900">
                  Schedule New Toastmasters Meeting
                </h3>
              </div>
              <button onClick={() => setIsCreateMeetingOpen(false)}>
                <X className="w-4 h-4 text-slate-400 hover:text-slate-600" />
              </button>
            </div>

            <form onSubmit={handleCreateMeetingSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-brand font-bold uppercase text-slate-700 mb-1">Meeting Number *</label>
                  <input
                    type="number"
                    required
                    value={newMeetingNumber}
                    onChange={e => setNewMeetingNumber(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#004165] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-brand font-bold uppercase text-slate-700 mb-1">Meeting Date *</label>
                  <input
                    type="date"
                    required
                    value={newMeetingDate}
                    onChange={e => setNewMeetingDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#004165] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-brand font-bold uppercase text-slate-700 mb-1">Meeting Theme *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Stepping Beyond Comfort Zones"
                  value={newTheme}
                  onChange={e => setNewTheme(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#004165] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-brand font-bold uppercase text-slate-700 mb-1">Word of the Day</label>
                <input
                  type="text"
                  placeholder="e.g. Audacious (adjective: showing a willingness to take bold risks)"
                  value={newWordOfTheDay}
                  onChange={e => setNewWordOfTheDay(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#004165] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-brand font-bold uppercase text-slate-700 mb-1">Venue / Online Link</label>
                <input
                  type="text"
                  value={newLocation}
                  onChange={e => setNewLocation(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#004165] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateMeetingOpen(false)}
                  className="px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#772432] hover:bg-[#5A1A25] text-white font-brand font-bold text-xs rounded-lg shadow-sm"
                >
                  Schedule Meeting
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
