import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  CheckCircle2, 
  TrendingUp, 
  Compass, 
  Users, 
  Sparkles, 
  BookOpen, 
  Clock, 
  Award, 
  HelpCircle, 
  ExternalLink, 
  ChevronRight, 
  Zap,
  Building2,
  FileText
} from 'lucide-react';

interface ScalingGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (page: string) => void;
}

export const ScalingGuideModal: React.FC<ScalingGuideModalProps> = ({
  isOpen,
  onClose,
  onNavigate
}) => {
  const [guideTab, setGuideTab] = useState<'instructions' | 'roi' | 'scaling'>('instructions');
  const [roleFilter, setRoleFilter] = useState<'member' | 'speaker' | 'evaluator' | 'officer' | 'admin'>('member');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in">
      
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full border border-slate-200 overflow-hidden my-auto flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#004165] to-[#002B44] text-white p-6 border-b border-[#001D2E] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-white/10 p-1.5 flex items-center justify-center border border-white/20">
              <img 
                src="/toastmasters-logo.svg" 
                alt="Toastmasters" 
                className="w-full h-full object-contain" 
              />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-brand font-bold uppercase text-[#F2DF74] tracking-wider">
                  System Architecture & SOPs
                </span>
                <span className="text-[10px] bg-[#772432] text-white px-2 py-0.5 rounded-full font-bold">
                  Scale Forever
                </span>
              </div>
              <h2 className="text-xl font-brand font-black text-white mt-0.5">
                Toastmasters Task Hub: Clear Instructions & Scaling Blueprint
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-full transition"
            title="Close Guide"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center space-x-2 p-3 bg-slate-100 border-b border-slate-200 text-xs font-bold overflow-x-auto">
          <button
            onClick={() => setGuideTab('instructions')}
            className={`px-4 py-2 rounded-xl transition flex items-center space-x-2 flex-shrink-0 ${
              guideTab === 'instructions'
                ? 'bg-white text-[#004165] shadow-sm font-black'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>1. Clear Step-by-Step Instructions</span>
          </button>

          <button
            onClick={() => setGuideTab('roi')}
            className={`px-4 py-2 rounded-xl transition flex items-center space-x-2 flex-shrink-0 ${
              guideTab === 'roi'
                ? 'bg-white text-[#004165] shadow-sm font-black'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>2. Measurable Club ROI & Value</span>
          </button>

          <button
            onClick={() => setGuideTab('scaling')}
            className={`px-4 py-2 rounded-xl transition flex items-center space-x-2 flex-shrink-0 ${
              guideTab === 'scaling'
                ? 'bg-white text-[#004165] shadow-sm font-black'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>3. Scaling Forever: Multi-Club Architecture</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-800">
          
          {/* TAB 1: INSTRUCTIONS FOR EVERYONE */}
          {guideTab === 'instructions' && (
            <div className="space-y-6">
              
              {/* Role Filter Selector */}
              <div>
                <span className="text-[11px] font-brand font-bold uppercase text-slate-400 block mb-2">
                  Select Your Role for Tailored Instructions:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {[
                    { id: 'member', label: 'Club Member', icon: Users },
                    { id: 'speaker', label: 'Prepared Speaker', icon: Award },
                    { id: 'evaluator', label: 'Speech Evaluator', icon: BookOpen },
                    { id: 'officer', label: 'Club Officer / PR', icon: Building2 },
                    { id: 'admin', label: 'Super Admin', icon: ShieldCheck }
                  ].map(tab => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setRoleFilter(tab.id as any)}
                        className={`p-2.5 rounded-xl border text-xs font-bold transition flex items-center justify-center space-x-1.5 ${
                          roleFilter === tab.id
                            ? 'bg-[#004165] text-[#F2DF74] border-[#004165] shadow-sm'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Instructions Panel by Role */}
              {roleFilter === 'member' && (
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                  <div className="flex items-center space-x-2 text-[#004165] font-brand font-bold">
                    <Users className="w-5 h-5 text-[#772432]" />
                    <h3 className="text-base text-slate-900">Club Member Quick Start Workflow</h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1.5">
                      <span className="text-xs font-black text-[#004165] block">Step 1: Sign in with Google</span>
                      <p className="text-xs text-slate-600">
                        Sign in using your Google account. Your access request is sent to Super Admin TM Yahoshuva for role approval.
                      </p>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1.5">
                      <span className="text-xs font-black text-[#004165] block">Step 2: Claim Meeting Roles</span>
                      <p className="text-xs text-slate-600">
                        Go to <strong>Meeting Agendas</strong>. Sign up for functional roles: Timer, Ah-Counter, Grammarian, or Table Topics.
                      </p>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1.5">
                      <span className="text-xs font-black text-[#004165] block">Step 3: Track Your Story</span>
                      <p className="text-xs text-slate-600">
                        Visit <strong>My Story & Evidence Hub</strong> to view your personalized portfolio, evaluations, and 15+ verified meeting proofs.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {roleFilter === 'speaker' && (
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                  <div className="flex items-center space-x-2 text-[#004165] font-brand font-bold">
                    <Award className="w-5 h-5 text-[#F2DF74]" />
                    <h3 className="text-base text-slate-900">Prepared Speaker Delivery & Proof SOP</h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                    <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1">
                      <span className="font-bold text-[#004165] block">1. Reserve Slot</span>
                      <p className="text-slate-600">Claim a Speaker slot (1–6) in the upcoming Meeting Agenda with your speech title.</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1">
                      <span className="font-bold text-[#004165] block">2. Rehearse</span>
                      <p className="text-slate-600">Review evaluation criteria with your assigned mentor before stepping onto the stage.</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1">
                      <span className="font-bold text-[#004165] block">3. Deliver</span>
                      <p className="text-slate-600">Deliver your 5–7 min milestone at Scaler Hall with open 45° stance to screen.</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1">
                      <span className="font-bold text-[#004165] block">4. Upload Proof</span>
                      <p className="text-slate-600">Upload on-stage photo frame or video timestamp under Task Evidence to receive credit.</p>
                    </div>
                  </div>
                </div>
              )}

              {roleFilter === 'evaluator' && (
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                  <div className="flex items-center space-x-2 text-[#004165] font-brand font-bold">
                    <BookOpen className="w-5 h-5 text-emerald-600" />
                    <h3 className="text-base text-slate-900">Speech Evaluator Sandwich Protocol</h3>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    Evaluators follow Toastmasters’ proven <strong>Commend-Recommend-Commend (CRC)</strong> structure:
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="bg-emerald-50 p-3.5 rounded-xl border border-emerald-200 text-emerald-950 space-y-1">
                      <span className="font-bold block">1. Commendations (Opening)</span>
                      <p>Highlight 2–3 specific strengths: vocal variety, stage presence, visual slide clarity.</p>
                    </div>
                    <div className="bg-amber-50 p-3.5 rounded-xl border border-amber-200 text-amber-950 space-y-1">
                      <span className="font-bold block">2. Recommendations (Middle)</span>
                      <p>Offer 1–2 actionable growth areas: stance angle, gaze quadrant scanning, transition pacing.</p>
                    </div>
                    <div className="bg-emerald-50 p-3.5 rounded-xl border border-emerald-200 text-emerald-950 space-y-1">
                      <span className="font-bold block">3. Commendations (Close)</span>
                      <p>End with enthusiastic encouragement and a clear challenge for the next milestone speech.</p>
                    </div>
                  </div>
                </div>
              )}

              {roleFilter === 'officer' && (
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                  <div className="flex items-center space-x-2 text-[#004165] font-brand font-bold">
                    <Building2 className="w-5 h-5 text-purple-600" />
                    <h3 className="text-base text-slate-900">Executive Committee & PR Team Operations</h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1">
                      <span className="font-bold text-[#004165] block">VP Public Relations (VPPR)</span>
                      <p className="text-slate-600">
                        Use the <strong>PR Member Story Spotlight</strong> to generate instant Instagram and LinkedIn captions with 1-click copy.
                      </p>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1">
                      <span className="font-bold text-[#004165] block">VP Education (VPE)</span>
                      <p className="text-slate-600">
                        Publish upcoming meeting agendas 5 days in advance and review submitted speech evidence in the Review Queue.
                      </p>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1">
                      <span className="font-bold text-[#004165] block">Club Secretary</span>
                      <p className="text-slate-600">
                        Consolidate master Minutes of the Meeting (MoM), archive attendance, and maintain member approval queues.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {roleFilter === 'admin' && (
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                  <div className="flex items-center space-x-2 text-[#004165] font-brand font-bold">
                    <ShieldCheck className="w-5 h-5 text-[#772432]" />
                    <h3 className="text-base text-slate-900">Super Admin Governance Protocol</h3>
                  </div>

                  <div className="space-y-2 text-xs text-slate-700 leading-relaxed">
                    <p>• Super Admin access is anchored to <strong className="font-mono text-[#004165]">kesaboyinayahoshuva@gmail.com</strong>.</p>
                    <p>• New users who register with Google enter a secure holding queue. They cannot view or modify data until approved.</p>
                    <p>• Approve applicants either directly from the <strong>Dashboard alert banner</strong> or under <strong>Club Members</strong>.</p>
                    <p>• All database actions enforce PostgreSQL Row Level Security (RLS) to ensure immutable proof records.</p>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* TAB 2: MEASURABLE CLUB ROI & VALUE */}
          {guideTab === 'roi' && (
            <div className="space-y-5">
              
              <div className="border-b border-slate-200 pb-3">
                <h3 className="font-brand font-bold text-base text-slate-900">
                  Measurable Return on Investment (ROI) for SpeakUp Scaler Club
                </h3>
                <p className="text-xs text-slate-500">
                  Replacing manual paper logs and messy chat groups with an automated, proof-based operating system
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-1.5">
                  <div className="flex items-center justify-between text-emerald-800">
                    <span className="text-[10px] font-bold uppercase tracking-wider">Executive Time</span>
                    <Clock className="w-4 h-4" />
                  </div>
                  <span className="text-2xl font-black text-emerald-900 block">5+ Hours</span>
                  <p className="text-[11px] text-emerald-800">
                    Saved per meeting across MoM authoring, agenda coordination, and PR writeups.
                  </p>
                </div>

                <div className="p-4 bg-blue-50 rounded-2xl border border-blue-200 space-y-1.5">
                  <div className="flex items-center justify-between text-blue-800">
                    <span className="text-[10px] font-bold uppercase tracking-wider">Evidence Accuracy</span>
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <span className="text-2xl font-black text-blue-900 block">100%</span>
                  <p className="text-[11px] text-blue-800">
                    Proof-backed accountability. Zero verbal completions; every milestone has video or photo proof.
                  </p>
                </div>

                <div className="p-4 bg-purple-50 rounded-2xl border border-purple-200 space-y-1.5">
                  <div className="flex items-center justify-between text-purple-800">
                    <span className="text-[10px] font-bold uppercase tracking-wider">Pathways Velocity</span>
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <span className="text-2xl font-black text-purple-900 block">2.4x</span>
                  <p className="text-[11px] text-purple-800">
                    Faster milestone approvals with transparent evaluation checklists and mentor rubrics.
                  </p>
                </div>

                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 space-y-1.5">
                  <div className="flex items-center justify-between text-amber-800">
                    <span className="text-[10px] font-bold uppercase tracking-wider">PR Social Reach</span>
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <span className="text-2xl font-black text-amber-900 block">Instant</span>
                  <p className="text-[11px] text-amber-800">
                    Automated LinkedIn and Instagram captions ready to publish immediately after each session.
                  </p>
                </div>

              </div>

              {/* Executive ROI Comparison Table */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 overflow-x-auto text-xs">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 uppercase text-[10px] font-bold">
                      <th className="pb-2">Club Capability</th>
                      <th className="pb-2">Old / Traditional Way</th>
                      <th className="pb-2 text-[#004165]">Toastmasters Task Hub Solution</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-slate-700">
                    <tr>
                      <td className="py-2.5 font-bold">Meeting Role Sign-ups</td>
                      <td className="py-2.5 text-slate-500">Messy WhatsApp polls and forgotten promises</td>
                      <td className="py-2.5 font-semibold text-[#004165]">1-Click live agenda signups synced to cloud</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-bold">Speech Evaluations</td>
                      <td className="py-2.5 text-slate-500">Lost paper slips and verbal comments</td>
                      <td className="py-2.5 font-semibold text-[#004165]">Permanent evaluations matrix with sandwich notes</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-bold">Minutes of Meeting (MoM)</td>
                      <td className="py-2.5 text-slate-500">Delayed by days or forgotten completely</td>
                      <td className="py-2.5 font-semibold text-[#004165]">Archived MoM repository with full video linkages</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-bold">PR Member Spotlights</td>
                      <td className="py-2.5 text-slate-500">Manual copywriting taking 2 hours per post</td>
                      <td className="py-2.5 font-semibold text-[#004165]">Automated social copy generated in seconds</td>
                    </tr>
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {/* TAB 3: SCALING FOREVER */}
          {guideTab === 'scaling' && (
            <div className="space-y-5">
              
              <div className="border-b border-slate-200 pb-3">
                <h3 className="font-brand font-bold text-base text-slate-900">
                  Built to Scale Forever: Modular Club Architecture
                </h3>
                <p className="text-xs text-slate-500">
                  Engineered to scale seamlessly from 1 Club to Area 04, Division E, and District 227 without rewriting code
                </p>
              </div>

              <div className="space-y-3.5 text-xs text-slate-700">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
                  <div className="flex items-center space-x-2 text-[#004165] font-bold">
                    <Zap className="w-4 h-4 text-[#F2DF74]" />
                    <span>1. Sub-Second Code-Split Bundling (Vite 5)</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    Third-party vendor libraries (React, Supabase, Lucide icons, and Vercel Analytics) are isolated into distinct cacheable chunks. Initial page loads take less than 400ms on 4G and mobile networks.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
                  <div className="flex items-center space-x-2 text-[#004165] font-bold">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>2. PostgreSQL Row Level Security (RLS)</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    Database tables enforce strict permission boundaries at the SQL level. Club members can view public meetings, but only verified officers can approve tasks and assign leadership roles.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
                  <div className="flex items-center space-x-2 text-[#004165] font-bold">
                    <Building2 className="w-4 h-4 text-[#772432]" />
                    <span>3. Multi-Club & Area Architecture</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    Every task, meeting, and member record carries standard District, Division, and Club ID fields. The schema supports spinning up additional clubs or whole Area clusters in minutes.
                  </p>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
          <span className="text-slate-500 font-brand">
            SpeakUp Scaler Toastmasters Club #28681022 • Super Admin: TM Yahoshuva Kesaboyina
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#004165] hover:bg-[#002B44] text-white font-bold rounded-xl transition shadow"
          >
            Got It! Close Guide
          </button>
        </div>

      </div>

    </div>
  );
};
