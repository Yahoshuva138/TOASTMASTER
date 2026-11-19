import React, { useState } from 'react';
import { 
  BookOpen, 
  Download, 
  ExternalLink, 
  Search, 
  FileText, 
  FolderArchive, 
  Image as ImageIcon, 
  Sparkles, 
  Filter, 
  Eye, 
  X,
  ShieldCheck,
  Award
} from 'lucide-react';

interface ResourceItem {
  id: string;
  title: string;
  subtitle: string;
  role: string;
  roleCategory: 'executive' | 'education' | 'membership' | 'pr' | 'secretary' | 'treasurer' | 'operations' | 'meeting_roles';
  fileType: 'PDF' | 'ZIP' | 'PNG' | 'SVG' | 'DOCX';
  fileSize: string;
  path: string;
  description: string;
  isFeatured?: boolean;
}

export const RoleResources: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [previewItem, setPreviewItem] = useState<ResourceItem | null>(null);

  const resources: ResourceItem[] = [
    // 1. Core Official Manuals & Handbooks
    {
      id: 'res-leadership-handbook',
      title: 'Toastmasters Club Leadership Handbook',
      subtitle: 'Item 1310 - Complete Governance & Leadership Guide',
      role: 'Club Executive Committee',
      roleCategory: 'executive',
      fileType: 'PDF',
      fileSize: '810 KB',
      path: '/resources/docs/Club Leadership Handbook.pdf',
      description: 'Core handbook outlining roles and responsibilities of the 7 club officers, executive committee protocol, and Distinguished Club Program (DCP) goals.',
      isFeatured: true
    },
    {
      id: 'res-brand-manual',
      title: 'Toastmasters International Brand Manual',
      subtitle: 'Item 1111 - Master Brand Identity, Colors & Typography',
      role: 'VP Public Relations & Officers',
      roleCategory: 'pr',
      fileType: 'PDF',
      fileSize: '2.42 MB',
      path: '/resources/docs/Toastmasters International Brand Manual.pdf',
      description: 'Mandatory global guidelines for Loyal Blue, True Maroon, Cool Gray, Happy Yellow, Montserrat typography, photography rules, and club emblem lockups.',
      isFeatured: true
    },
    {
      id: 'res-officer-checklist',
      title: 'Toastmasters Club Officers Checklist',
      subtitle: 'Monthly & Semi-Annual Operational Action Checklist',
      role: 'Club Officers',
      roleCategory: 'executive',
      fileType: 'PDF',
      fileSize: '2.22 MB',
      path: '/resources/docs/Club Officers Checklist.pdf',
      description: 'Actionable checklists for each officer role broken down month-by-month to maintain club excellence and compliance.'
    },
    {
      id: 'res-club-election',
      title: 'Toastmasters Club Election Guidelines',
      subtitle: 'Official Nominations & Voting Procedure Manual',
      role: 'President & Secretary',
      roleCategory: 'executive',
      fileType: 'PDF',
      fileSize: '672 KB',
      path: '/resources/docs/Club Election.pdf',
      description: 'Rules for appointing the Club Nominating Committee, running floor nominations, quorum requirements, and balloting.'
    },

    // 2. Meeting Roles & Scripts
    {
      id: 'res-roles-handbook',
      title: 'Toastmaster Club Meeting Roles Handbook',
      subtitle: 'Official Comprehensive Manual for All 8 Meeting Roles',
      role: 'Meeting Roles & Speakers',
      roleCategory: 'meeting_roles',
      fileType: 'PDF',
      fileSize: '2.87 MB',
      path: '/resources/Toastmaster_Club_Meeting_Roles.pdf',
      description: 'Master guidelines and checklists for TMOD, Prepared Speaker, Speech Evaluator, Timer, Ah-Counter, Grammarian, Table Topics Master, and General Evaluator.',
      isFeatured: true
    },
    {
      id: 'res-meeting-roles-library',
      title: 'Club Meeting Roles Resource Library',
      subtitle: 'In-Depth Guides for All 8 Meeting Functions',
      role: 'Meeting Role Players',
      roleCategory: 'meeting_roles',
      fileType: 'PDF',
      fileSize: '3.59 MB',
      path: '/resources/docs/club-meeting-roles-resource-library.pdf',
      description: 'Comprehensive resource library with detailed preparation instructions, evaluation sheets, and speech delivery criteria.'
    },
    {
      id: 'res-anatomy-meeting',
      title: 'Anatomy of a Toastmasters Meeting',
      subtitle: 'Item 472 - Official Meeting Flow & Time Segments',
      role: 'TMOD & Members',
      roleCategory: 'meeting_roles',
      fileType: 'PDF',
      fileSize: '72 KB',
      path: '/resources/docs/472-anatomy-of-a-toastmasters-meeting.pdf',
      description: 'Visual breakdown of the 3 meeting parts: Prepared Speeches, Table Topics impromptu session, and General Evaluation.'
    },
    {
      id: 'res-ah-counter-log',
      title: 'Official Ah-Counter Script and Log Sheet',
      subtitle: 'Item 675A - Word & Sound Tracking Sheet (A4)',
      role: 'Ah-Counter',
      roleCategory: 'meeting_roles',
      fileType: 'PDF',
      fileSize: '60 KB',
      path: '/resources/docs/03_Meeting_Roles_and_Scripts/675a-ah-counter-script-and-log/toastmasters-675A-ah-counter-script-and-log-A4.pdf',
      description: 'Official printable log to record filler words (ah, um, err, you know, so) during speeches and impromptu sessions.'
    },
    {
      id: 'res-timer-log',
      title: 'Official Timer Script and Timing Sheet',
      subtitle: 'Item 675E - Green, Amber, Red Disqualifier Log (A4)',
      role: 'Timer',
      roleCategory: 'meeting_roles',
      fileType: 'PDF',
      fileSize: '62 KB',
      path: '/resources/docs/03_Meeting_Roles_and_Scripts/675e-timer-script-and-log/toastmasters-675E-timer-script-and-log-A4.pdf',
      description: 'Official script and timing chart with signal flag rules (Green, Amber, Red) for 1-2 min topics, 5-7 min speeches, and 2-3 min evaluations.'
    },

    // 3. Education & Pathways
    {
      id: 'res-dtm-pathways',
      title: 'DTM Through Pathways Milestone Roadmap',
      subtitle: 'Complete Guide to Earning the Distinguished Toastmaster Award',
      role: 'VP Education & Members',
      roleCategory: 'education',
      fileType: 'PDF',
      fileSize: '868 KB',
      path: '/resources/docs/DTM-Through-PATHWAYS.pdf',
      description: 'Detailed progression tracker through 2 learning paths, club officer service, club coach/sponsor assignment, and DTM capstone project.',
      isFeatured: true
    },
    {
      id: 'res-mentoring-program',
      title: 'Pathways Mentoring Program Manual',
      subtitle: 'Item 801 - Club Mentor-Mentee Relationship Guide',
      role: 'VP Education & Mentors',
      roleCategory: 'education',
      fileType: 'PDF',
      fileSize: '3.16 MB',
      path: '/resources/docs/Pathways Mentoring Program.pdf',
      description: 'Step-by-step framework to assign experienced mentors to new speakers to build speech confidence and milestone completion.'
    },
    {
      id: 'res-steps-choose-path',
      title: '11 Pathways Selection & Assessment Guide',
      subtitle: 'Decision Tree to Align Speeches with Career Goals',
      role: 'VP Education & Members',
      roleCategory: 'education',
      fileType: 'PDF',
      fileSize: '1.77 MB',
      path: '/resources/docs/STEPS TO CHOOSE A PATH.pdf',
      description: 'Visual guide comparing Dynamic Leadership, Presentation Mastery, Innovative Planning, Strategic Relationships, and 7 other paths.'
    },
    {
      id: 'res-new-member-kit',
      title: 'COMPASS District 227 New Member Starter Kit',
      subtitle: 'Official District 227 Onboarding & Pathways Guide',
      role: 'VP Membership & Members',
      roleCategory: 'membership',
      fileType: 'PDF',
      fileSize: '323 KB',
      path: '/resources/COMPASS_District_227_New_Member_Starter_Kit.pdf',
      description: 'Essential orientation kit explaining Pathways projects, meeting etiquette, mentor assignment, and foundational public speaking milestones.'
    },

    // 4. Membership & Moments of Truth
    {
      id: 'res-guest-booklet',
      title: 'Official Guest Information Booklet',
      subtitle: 'Item 368 - Visitor Orientation & Club Membership Guide',
      role: 'VP Membership',
      roleCategory: 'membership',
      fileType: 'PDF',
      fileSize: '1.48 MB',
      path: '/resources/docs/Guest Booklet.pdf',
      description: 'Pamphlet provided to guests explaining what happens at a meeting, benefits of membership, and joining steps.'
    },
    {
      id: 'res-moments-truth',
      title: 'Moments of Truth Club Quality Manual',
      subtitle: 'Item 290A - 6 Standards of Club Excellence',
      role: 'Executive Committee',
      roleCategory: 'executive',
      fileType: 'PDF',
      fileSize: '2.98 MB',
      path: '/resources/docs/05_Membership_and_Guest_Relations/290-moments-of-truth/290A-moments-of-truth.pdf',
      description: 'Club health audit assessing First Impressions, Membership Orientation, Fellowship, Program Planning, Membership Strength, and Achievement Recognition.'
    },

    // 5. Official Club Minutes of the Meeting (MoM)
    {
      id: 'res-mom-master-record',
      title: 'SpeakUp Scaler Master MoM Record',
      subtitle: 'Executive Archive Spanning Meetings 1 through 5',
      role: 'Club Secretary',
      roleCategory: 'secretary',
      fileType: 'DOCX',
      fileSize: '49 KB',
      path: '/resources/mom/SpeakUp Scaler MoM Record.docx',
      description: 'Consolidated official Minutes of Meeting authored by TM Yahoshuva Kesaboyina documenting meeting themes, speakers, evaluators, and awards.',
      isFeatured: true
    },
    {
      id: 'res-mom-meeting-5',
      title: 'Meeting 5 (Day 7) Official Minutes of Meeting',
      subtitle: 'Theme: Asleep, But Not Rested • Word: Somnolent',
      role: 'Club Secretary',
      roleCategory: 'secretary',
      fileType: 'DOCX',
      fileSize: '42 KB',
      path: '/resources/mom/SpeakUp_Scaler_MoM_Meeting_5_Day_7.docx',
      description: 'Formal executive record of Sunday, 17 Nov 2026 meeting. Includes 6 speaker evaluations, awards winners, and president address.'
    },
    {
      id: 'res-mom-todo-5',
      title: 'Meeting 5 Action Items & Resolution Matrix',
      subtitle: 'Post-Meeting Governance & Department TODO Tracker',
      role: 'Club Secretary & Officers',
      roleCategory: 'secretary',
      fileType: 'DOCX',
      fileSize: '38 KB',
      path: '/resources/mom/SpeakUp_Scaler_TODO_Meeting_5_Day_7.docx',
      description: 'Operational task accountability matrix resolving stage rehearsal, flyer release deadlines, and guest conversion actions.'
    },
    {
      id: 'res-posters-catalog',
      title: 'Club Meeting Posters Design Catalog',
      subtitle: 'Official Brand Layouts & Design Rules',
      role: 'VP Public Relations',
      roleCategory: 'pr',
      fileType: 'PDF',
      fileSize: '4.80 MB',
      path: '/resources/Club_Meeting_Posters.pdf',
      description: 'Detailed visual catalog showing brand typography, color proportions, photo framing, and flyer templates for weekly club announcements.',
      isFeatured: true
    },

    // 2. PR & Media Kits
    {
      id: 'res-logo-suite',
      title: 'Official Toastmasters Master Logo Suite',
      subtitle: 'Color, Grayscale & White Vector Pack',
      role: 'VP Public Relations',
      roleCategory: 'pr',
      fileType: 'ZIP',
      fileSize: '1.06 MB',
      path: '/resources/toastmasters-logo.zip',
      description: 'Official emblem files in SVG, PNG, and EPS formats. Includes standard 3-color lockups for flyers, websites, and certificates.'
    },
    {
      id: 'res-wordmark-suite',
      title: 'Toastmasters Official Wordmark Suite',
      subtitle: 'Vector Typography Lockups',
      role: 'VP Public Relations',
      roleCategory: 'pr',
      fileType: 'ZIP',
      fileSize: '790 KB',
      path: '/resources/toastmasters-wordmark.zip',
      description: 'Official Toastmasters Wordmark in Black, Color, Grayscale, and White. Required for club merchandise, banners, and publications.'
    },
    {
      id: 'res-logo-3color',
      title: 'Toastmasters 3-Color Vector Logo (Color)',
      subtitle: 'Loyal Blue, True Maroon & Cool Gray',
      role: 'VP Public Relations',
      roleCategory: 'pr',
      fileType: 'PNG',
      fileSize: '130 KB',
      path: '/resources/logos/ToastmastersLogo3Color.png',
      description: 'High-res transparent PNG ready for immediate use in Canva, Photoshop, or web headers.'
    },
    {
      id: 'res-logo-white',
      title: 'Toastmasters White Vector Logo (Dark Backgrounds)',
      subtitle: 'Pure White Transparent Emblem',
      role: 'VP Public Relations',
      roleCategory: 'pr',
      fileType: 'PNG',
      fileSize: '210 KB',
      path: '/resources/logos/ToastmastersLogoWhite.png',
      description: 'Transparent white logo optimized for dark video thumbnails, evening flyers, and black backgrounds.'
    },
    {
      id: 'res-lockups',
      title: 'Toastmasters Master Logo Lockups',
      subtitle: 'Horizontal & Vertical Layout Formats',
      role: 'VP Public Relations',
      roleCategory: 'pr',
      fileType: 'ZIP',
      fileSize: '2.22 MB',
      path: '/resources/logo-lockups.zip',
      description: 'Precise logo lockup formats with safety margin rules and clear space parameters.'
    },

    // 3. Meeting Flyers & Poster Templates
    {
      id: 'res-poster-m5-blue',
      title: 'SpeakUp Scaler Meeting 5 Poster (Loyal Blue)',
      subtitle: 'Theme: Asleep, But Not Rested',
      role: 'VP Public Relations',
      roleCategory: 'pr',
      fileType: 'PNG',
      fileSize: '2.59 MB',
      path: '/resources/SPEAKUP_SCALER_MEETING_5_POSTER_LOYAL_BLUE.png',
      description: 'Official production flyer for Meeting 5 featuring Loyal Blue palette and speaker roster.'
    },
    {
      id: 'res-poster-m5-maroon',
      title: 'SpeakUp Scaler Meeting 5 Poster (True Maroon)',
      subtitle: 'Theme: Asleep, But Not Rested',
      role: 'VP Public Relations',
      roleCategory: 'pr',
      fileType: 'PNG',
      fileSize: '2.96 MB',
      path: '/resources/SPEAKUP_SCALER_MEETING_5_POSTER_TRUE_MAROON.png',
      description: 'Official production flyer for Meeting 5 featuring True Maroon palette.'
    },
    {
      id: 'res-poster-m6-kintsugi',
      title: 'Meeting 6 Classic Kintsugi Poster',
      subtitle: 'Theme: Error 404 & Golden Repair',
      role: 'VP Public Relations',
      roleCategory: 'pr',
      fileType: 'PNG',
      fileSize: '2.05 MB',
      path: '/resources/SPEAKUP_SCALER_MEETING_6_CLASSIC_KINTSUGI_POSTER_V1.png',
      description: 'Artistic flyer based on the Japanese philosophy of Kintsugi embracing flaws and public speaking growth.'
    },
    {
      id: 'res-poster-day5',
      title: 'Meeting Day 5: "A Pale Blue Dot" Poster',
      subtitle: 'Classic Space Theme Announcement',
      role: 'VP Public Relations',
      roleCategory: 'pr',
      fileType: 'PNG',
      fileSize: '230 KB',
      path: '/resources/DAY_5_PALE_BLUE_DOT_POSTER.jpeg',
      description: 'Official flyer for Meeting Day 5 celebrating scientific thinking and oratory.'
    },

    // 4. Executive, Secretary & Finance Toolkits
    {
      id: 'res-letterhead',
      title: 'Official Toastmasters Letterhead Templates',
      subtitle: 'Word (.docx) Executive Templates',
      role: 'Club Secretary & President',
      roleCategory: 'secretary',
      fileType: 'ZIP',
      fileSize: '1.70 MB',
      path: '/resources/letterhead-template.zip',
      description: 'Microsoft Word templates for official club correspondence, meeting minutes (MoM), and executive communications.'
    },
    {
      id: 'res-email-signatures',
      title: 'Official Leader Email Signature Kit',
      subtitle: 'Mobile-Optimized HTML Signatures',
      role: 'Club Executive Committee',
      roleCategory: 'executive',
      fileType: 'ZIP',
      fileSize: '10 KB',
      path: '/resources/toastmasters-email-signature-leaders-mobile.zip',
      description: 'Professional email signature templates for club officers and executive leaders.'
    },

    // 5. Education & Membership Badges
    {
      id: 'res-pathways-badges',
      title: 'Pathways Educational Badges Kit',
      subtitle: 'Level 1 to 5 Achievement Icons',
      role: 'VP Education',
      roleCategory: 'education',
      fileType: 'ZIP',
      fileSize: '350 KB',
      path: '/resources/pathways-badge.zip',
      description: 'Official digital badges for Pathways milestone completions, speeches, and certificate ceremonies.'
    },
    {
      id: 'res-pathways-logos',
      title: 'Pathways Official Logo Pack',
      subtitle: 'Vector & PNG Educational Logos',
      role: 'VP Education',
      roleCategory: 'education',
      fileType: 'ZIP',
      fileSize: '1.02 MB',
      path: '/resources/pathways-logo.zip',
      description: 'Official logos for Pathways curriculum slides, speaker agendas, and educational presentations.'
    },
    {
      id: 'res-member-badges',
      title: '"Member of Toastmasters" Digital Badges',
      subtitle: 'LinkedIn & Resume Badges',
      role: 'VP Membership & Members',
      roleCategory: 'membership',
      fileType: 'ZIP',
      fileSize: '2.93 MB',
      path: '/resources/member-of-ti-badge.zip',
      description: 'Official badge kit for members to showcase their Toastmasters membership on LinkedIn and portfolios.'
    },
    {
      id: 'res-gavel-club',
      title: 'Gavel Club & Youth Leadership Pack',
      subtitle: 'Official Emblem & Identity Kit',
      role: 'Club President',
      roleCategory: 'executive',
      fileType: 'ZIP',
      fileSize: '5.70 MB',
      path: '/resources/gavel-club-logo.zip',
      description: 'Logos and collateral for Gavel club affiliations and community outreach.'
    }
  ];

  const categories = [
    { id: 'all', label: 'All Resources' },
    { id: 'meeting_roles', label: '🎤 Meeting Roles & Speakers' },
    { id: 'education', label: '🎓 VP Education (VPE)' },
    { id: 'membership', label: '🤝 VP Membership (VPM)' },
    { id: 'pr', label: '📢 VP Public Relations (VPPR)' },
    { id: 'secretary', label: '✍️ Secretary & Letterheads' },
    { id: 'executive', label: '👑 Executive Committee' }
  ];

  const filteredResources = resources.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.roleCategory === selectedCategory;
    const matchesSearch = 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.subtitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.fileType.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesCategory && matchesSearch;
  });

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
              <span className="text-[11px] font-brand font-bold uppercase tracking-wider">Official Club Toolkits</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-brand font-black text-[#004165]">Toastmasters Role Resources & Toolkits</h1>
            <p className="text-xs text-slate-500 font-medium">
              Handbooks, official logos, flyer templates, letterheads, and checklists for every Toastmasters role
            </p>
          </div>
        </div>

        <div className="w-full sm:w-64">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search guides, logos, roles..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#004165] focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Role Category Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex-shrink-0 ${
              selectedCategory === cat.id
                ? 'bg-[#004165] text-white shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.length === 0 ? (
          <div className="col-span-full p-12 bg-white rounded-2xl border border-dashed border-slate-300 text-center text-xs text-slate-500">
            No resources match your search criteria.
          </div>
        ) : (
          filteredResources.map(res => (
            <div 
              key={res.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between hover:border-[#004165] transition group"
            >
              {/* Card Body (Clickable to preview) */}
              <div 
                onClick={() => setPreviewItem(res)}
                className="p-5 space-y-3 cursor-pointer flex-1"
              >
                {/* Badges */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold bg-[#772432] text-[#F2DF74] px-2 py-0.5 rounded border border-[#932C3E]">
                    {res.role}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                    res.fileType === 'PDF' ? 'bg-red-100 text-red-800' :
                    res.fileType === 'ZIP' ? 'bg-purple-100 text-purple-800' :
                    res.fileType === 'DOCX' ? 'bg-blue-100 text-blue-800' :
                    'bg-emerald-100 text-emerald-800'
                  }`}>
                    {res.fileType} • {res.fileSize}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-sm text-slate-900 group-hover:text-[#004165] transition leading-snug">
                    {res.title}
                  </h3>
                  <p className="text-[11px] text-[#004165] font-semibold mt-0.5">{res.subtitle}</p>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {res.description}
                </p>
              </div>

              {/* Action Buttons: Primary View in Website, Secondary Download */}
              <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => setPreviewItem(res)}
                  className="flex-1 py-2 bg-[#004165] hover:bg-[#002B44] text-white text-xs font-bold rounded-lg shadow-sm transition flex items-center justify-center space-x-1.5"
                >
                  <Eye className="w-3.5 h-3.5 text-[#F2DF74]" />
                  <span>View in Website</span>
                </button>

                <a
                  href={res.path}
                  download
                  onClick={e => e.stopPropagation()}
                  className="px-3 py-2 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 transition flex items-center space-x-1"
                  title="Download copy if needed"
                >
                  <Download className="w-3.5 h-3.5 text-slate-500" />
                  <span className="hidden sm:inline">Download</span>
                </a>
              </div>
            </div>
          ))
        )}
      </div>

      {/* IN-WEBSITE INTERACTIVE DOCUMENT & TOOLKIT VIEWER MODAL */}
      {previewItem && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-200">
            
            {/* Viewer Header */}
            <div className="px-6 py-4 bg-[#004165] text-white flex items-center justify-between border-b border-[#002B44] flex-shrink-0">
              <div className="flex items-center space-x-3.5 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-white p-1 flex items-center justify-center shadow-md flex-shrink-0">
                  <img src="/toastmasters-logo.svg" alt="Toastmasters" className="w-full h-full object-contain" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-bold bg-[#772432] text-[#F2DF74] px-2 py-0.5 rounded border border-[#932C3E]">
                      {previewItem.role}
                    </span>
                    <span className="text-xs text-slate-300 font-semibold">{previewItem.fileType} • {previewItem.fileSize}</span>
                  </div>
                  <h2 className="text-base sm:text-lg font-bold text-white mt-0.5 truncate">{previewItem.title}</h2>
                </div>
              </div>

              <div className="flex items-center space-x-2 flex-shrink-0 ml-3">
                {/* Download Button (If needed) */}
                <a
                  href={previewItem.path}
                  download
                  className="px-3.5 py-1.5 bg-[#F2DF74] hover:bg-yellow-300 text-[#004165] text-xs font-bold rounded-lg shadow-sm transition flex items-center space-x-1.5"
                  title="Download Copy"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Download</span>
                </a>

                {/* Open in new tab */}
                <a
                  href={previewItem.path}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg transition"
                  title="Open in new window"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>

                {/* Close Button */}
                <button
                  onClick={() => setPreviewItem(null)}
                  className="p-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg transition ml-1"
                  title="Close viewer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Viewer Body */}
            <div className="flex-1 bg-slate-100 overflow-y-auto p-4 sm:p-6 flex items-center justify-center min-h-[460px]">
              {previewItem.fileType === 'PDF' ? (
                <div className="w-full h-[680px] bg-white rounded-2xl shadow-inner border border-slate-300 overflow-hidden">
                  <iframe
                    src={`${previewItem.path}#toolbar=1&navpanes=1`}
                    className="w-full h-full border-0"
                    title={previewItem.title}
                  />
                </div>
              ) : previewItem.fileType === 'PNG' || previewItem.fileType === 'SVG' ? (
                <div className="max-w-3xl w-full bg-white p-6 rounded-2xl shadow-md border border-slate-200 text-center space-y-4">
                  <div className="max-h-[540px] overflow-auto flex items-center justify-center bg-slate-50 rounded-xl p-4 border border-slate-100">
                    <img
                      src={previewItem.path}
                      alt={previewItem.title}
                      className="max-h-[500px] w-auto object-contain mx-auto rounded-lg shadow-sm"
                    />
                  </div>
                  <div className="text-left text-xs text-slate-600 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                    <span className="font-bold text-slate-800 block mb-1">Official Resource Notes:</span>
                    <p>{previewItem.description}</p>
                  </div>
                </div>
              ) : (
                /* ZIP Archive Suite Viewer */
                <div className="max-w-xl w-full bg-white p-8 rounded-2xl shadow-lg border border-slate-200 space-y-6 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-purple-50 border-2 border-purple-200 text-purple-700 mx-auto flex items-center justify-center">
                    <FolderArchive className="w-8 h-8" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase text-purple-700 tracking-wider">Archived Vector & Asset Bundle</span>
                    <h3 className="text-xl font-bold text-slate-900 mt-1">{previewItem.title}</h3>
                    <p className="text-xs text-slate-500 mt-1">{previewItem.subtitle}</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-left text-xs space-y-2">
                    <span className="font-bold text-slate-800 block">Package Contents & Usage:</span>
                    <p className="text-slate-600">{previewItem.description}</p>
                    <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-slate-500 font-mono text-[11px]">
                      <span>Format: Compressed ZIP Suite</span>
                      <span>File Size: {previewItem.fileSize}</span>
                    </div>
                  </div>
                  <div className="pt-2">
                    <a
                      href={previewItem.path}
                      download
                      className="inline-flex items-center space-x-2 px-6 py-3 bg-[#004165] hover:bg-[#002B44] text-white font-bold text-xs rounded-xl shadow-md transition"
                    >
                      <Download className="w-4 h-4 text-[#F2DF74]" />
                      <span>Download {previewItem.title} ({previewItem.fileSize})</span>
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Viewer Footer */}
            <div className="px-6 py-3 bg-white border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 flex-shrink-0">
              <span className="italic">SpeakUp Scaler Toastmasters Club #28681022 • District 227</span>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setPreviewItem(null)}
                  className="px-4 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-800 transition"
                >
                  Close Viewer
                </button>
                <a
                  href={previewItem.path}
                  download
                  className="px-4 py-1.5 bg-[#004165] text-white text-xs font-bold rounded-lg hover:bg-[#002B44] transition flex items-center space-x-1"
                >
                  <Download className="w-3.5 h-3.5 text-[#F2DF74]" />
                  <span>Download File</span>
                </a>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
