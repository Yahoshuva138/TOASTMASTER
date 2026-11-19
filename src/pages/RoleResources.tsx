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
    // 1. Meeting Roles & Education
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
      id: 'res-new-member-kit',
      title: 'COMPASS District 227 New Member Starter Kit',
      subtitle: 'Official District 227 Onboarding & Pathways Guide',
      role: 'VP Membership & Members',
      roleCategory: 'membership',
      fileType: 'PDF',
      fileSize: '323 KB',
      path: '/resources/COMPASS_District_227_New_Member_Starter_Kit.pdf',
      description: 'Essential orientation kit explaining Pathways projects, meeting etiquette, mentor assignment, and foundational public speaking milestones.',
      isFeatured: true
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
        <div>
          <div className="flex items-center space-x-2 text-[#004165] mb-1">
            <BookOpen className="w-5 h-5 text-[#772432]" />
            <span className="text-xs font-bold uppercase tracking-wider">Official Club Toolkits</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900">Toastmasters Role Resources & Toolkits</h1>
          <p className="text-xs text-slate-500">
            Handbooks, official logos, flyer templates, letterheads, and checklists for every Toastmasters role
          </p>
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
              <div className="p-5 space-y-3">
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

              {/* Action Buttons */}
              <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <a
                  href={res.path}
                  download
                  className="px-3 py-1.5 bg-[#004165] hover:bg-[#002B44] text-white text-xs font-bold rounded-lg shadow-sm transition flex items-center space-x-1.5"
                >
                  <Download className="w-3.5 h-3.5 text-[#F2DF74]" />
                  <span>Download</span>
                </a>

                {(res.fileType === 'PDF' || res.fileType === 'PNG') && (
                  <a
                    href={res.path}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 transition flex items-center space-x-1"
                  >
                    <Eye className="w-3.5 h-3.5 text-slate-500" />
                    <span>Open Guide</span>
                  </a>
                )}
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
};
