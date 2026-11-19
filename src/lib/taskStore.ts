// ==============================================================================
// TOASTMASTERS TASK HUB - CENTRAL TASK & RBAC STORE
// Features: Real-time sync, offline fallback, RBAC validation, audit logging,
// evidence verification workflow, and Toastmasters departmental templates.
// ==============================================================================

import { 
  Task, 
  Profile, 
  Department, 
  RolePermission, 
  NotificationItem, 
  ActivityLogItem, 
  TaskTemplate,
  TaskEvidence,
  TaskReview,
  Meeting,
  RoleSignup
} from '../types/database.types';

// 1. DEFAULT DEPARTMENTS (6 Toastmasters Departments)
export const INITIAL_DEPARTMENTS: Department[] = [
  {
    id: 'dept-exec',
    name: 'Executive Committee',
    slug: 'executive',
    description: 'Club governance, strategy, budget, and executive meetings.',
    icon: 'Shield',
    leaderName: 'TM Arunima Vats (President)'
  },
  {
    id: 'dept-edu',
    name: 'Education & Meeting Roles',
    slug: 'education',
    description: 'Pathways tracking, speaker scheduling, role players, and evaluations.',
    icon: 'BookOpen',
    leaderName: 'TM Shakthi Sivapriya (VP Education)'
  },
  {
    id: 'dept-mem',
    name: 'Membership',
    slug: 'membership',
    description: 'Guest relations, member onboarding, retention, and dues collection.',
    icon: 'Users',
    leaderName: 'TM Ashish Patel (VP Membership)'
  },
  {
    id: 'dept-pr',
    name: 'Public Relations & Media',
    slug: 'pr',
    description: 'Meeting flyers, social media, photography, Word of the Day, and PR recaps.',
    icon: 'Megaphone',
    leaderName: 'TM Harshitha (VP Public Relations)'
  },
  {
    id: 'dept-ops',
    name: 'Operations & Logistics',
    slug: 'operations',
    description: 'Room setup, projector, microphones, physical ballots, and meeting decorum.',
    icon: 'Wrench',
    leaderName: 'TM Azma / TM Ashish (Sergeant at Arms)'
  },
  {
    id: 'dept-fin',
    name: 'Finance & Records',
    slug: 'finance',
    description: 'Club accounts, semi-annual dues, Minutes of the Meeting, and audit archives.',
    icon: 'CreditCard',
    leaderName: 'TM Yahoshuva Kesaboyina (Secretary / Super Admin)'
  }
];

// 2. INITIAL CLUB MEMBERS
export const INITIAL_PROFILES: Profile[] = [
  {
    id: 'user-yahoshuva',
    email: 'kesaboyinayahoshuva@gmail.com',
    fullName: 'TM Yahoshuva Kesaboyina',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    clubRole: 'Super Admin / Club Secretary',
    systemRole: 'super_admin',
    departmentId: 'dept-fin',
    departmentName: 'Finance & Records',
    isActive: true,
    phone: '+91 98765 43210',
    createdAt: '2026-10-01T10:00:00Z',
    updatedAt: '2026-11-18T10:00:00Z'
  },
  {
    id: 'user-abdulrahman',
    email: 'abdulrahman2425201@gmail.com',
    fullName: 'Abdul Rahman',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
    clubRole: 'Club Member',
    systemRole: 'member',
    departmentId: 'dept-pr',
    departmentName: 'Public Relations & Media',
    isActive: true,
    accessStatus: 'approved',
    createdAt: '2026-11-19T18:40:00Z',
    updatedAt: '2026-11-19T18:40:00Z'
  },
  {
    id: 'user-arunima',
    email: 'arunima.vats@scaler.com',
    fullName: 'TM Arunima Vats',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
    clubRole: 'Club President',
    systemRole: 'president',
    departmentId: 'dept-exec',
    departmentName: 'Executive Committee',
    isActive: true,
    createdAt: '2026-10-01T10:00:00Z',
    updatedAt: '2026-11-18T10:00:00Z'
  },
  {
    id: 'user-shakthi',
    email: 'shakthi.sivapriya@scaler.com',
    fullName: 'TM Shakthi Sivapriya',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&auto=format&fit=crop&q=80',
    clubRole: 'Vice President Education',
    systemRole: 'vpe',
    departmentId: 'dept-edu',
    departmentName: 'Education & Meeting Roles',
    isActive: true,
    createdAt: '2026-10-05T10:00:00Z',
    updatedAt: '2026-11-18T10:00:00Z'
  },
  {
    id: 'user-ashish',
    email: 'ashish.patel@scaler.com',
    fullName: 'TM Ashish Patel',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    clubRole: 'Sergeant at Arms / VP Membership',
    systemRole: 'saa',
    departmentId: 'dept-ops',
    departmentName: 'Operations & Logistics',
    isActive: true,
    createdAt: '2026-10-10T10:00:00Z',
    updatedAt: '2026-11-18T10:00:00Z'
  },
  {
    id: 'user-harshitha',
    email: 'harshitha.pr@scaler.com',
    fullName: 'TM Harshitha',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80',
    clubRole: 'VP Public Relations',
    systemRole: 'vppr',
    departmentId: 'dept-pr',
    departmentName: 'Public Relations & Media',
    isActive: true,
    createdAt: '2026-10-15T10:00:00Z',
    updatedAt: '2026-11-18T10:00:00Z'
  },
  {
    id: 'user-vedali',
    email: 'vedali@scaler.com',
    fullName: 'TM Vedali',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    clubRole: 'Club Member / Prepared Speaker',
    systemRole: 'member',
    departmentId: 'dept-edu',
    departmentName: 'Education & Meeting Roles',
    isActive: true,
    createdAt: '2026-11-01T10:00:00Z',
    updatedAt: '2026-11-18T10:00:00Z'
  },
  {
    id: 'user-rehan',
    email: 'rehan@scaler.com',
    fullName: 'TM Rehan',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    clubRole: 'Club Member / Prepared Speaker',
    systemRole: 'member',
    departmentId: 'dept-edu',
    departmentName: 'Education & Meeting Roles',
    isActive: true,
    createdAt: '2026-11-01T10:00:00Z',
    updatedAt: '2026-11-18T10:00:00Z'
  },
  {
    id: 'user-prakrit',
    email: 'prakrit@scaler.com',
    fullName: 'TM Prakrit',
    avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=120&auto=format&fit=crop&q=80',
    clubRole: 'Club Member / Prepared Speaker',
    systemRole: 'member',
    departmentId: 'dept-edu',
    departmentName: 'Education & Meeting Roles',
    isActive: true,
    createdAt: '2026-11-01T10:00:00Z',
    updatedAt: '2026-11-18T10:00:00Z'
  }
];

// 3. DEFAULT ROLE PERMISSIONS MATRIX (9 ROLES)
export const INITIAL_ROLE_PERMISSIONS: RolePermission[] = [
  {
    id: 'rp-super-admin',
    role: 'super_admin',
    roleName: 'Super Admin',
    permissions: {
      viewTasks: true,
      createTasks: true,
      editTasks: true,
      deleteTasks: true,
      assignTasks: true,
      uploadEvidence: true,
      reviewSubmissions: true,
      approveTasks: true,
      manageMembers: true,
      manageRoles: true,
      viewReports: true,
      manageSettings: true,
    }
  },
  {
    id: 'rp-president',
    role: 'president',
    roleName: 'Club President',
    permissions: {
      viewTasks: true,
      createTasks: true,
      editTasks: true,
      deleteTasks: true,
      assignTasks: true,
      uploadEvidence: true,
      reviewSubmissions: true,
      approveTasks: true,
      manageMembers: true,
      manageRoles: false,
      viewReports: true,
      manageSettings: false,
    }
  },
  {
    id: 'rp-vpe',
    role: 'vpe',
    roleName: 'Vice President Education',
    permissions: {
      viewTasks: true,
      createTasks: true,
      editTasks: true,
      deleteTasks: false,
      assignTasks: true,
      uploadEvidence: true,
      reviewSubmissions: true,
      approveTasks: true,
      manageMembers: false,
      manageRoles: false,
      viewReports: true,
      manageSettings: false,
    }
  },
  {
    id: 'rp-vpm',
    role: 'vpm',
    roleName: 'Vice President Membership',
    permissions: {
      viewTasks: true,
      createTasks: true,
      editTasks: true,
      deleteTasks: false,
      assignTasks: true,
      uploadEvidence: true,
      reviewSubmissions: true,
      approveTasks: true,
      manageMembers: true,
      manageRoles: false,
      viewReports: true,
      manageSettings: false,
    }
  },
  {
    id: 'rp-vppr',
    role: 'vppr',
    roleName: 'Vice President Public Relations',
    permissions: {
      viewTasks: true,
      createTasks: true,
      editTasks: true,
      deleteTasks: false,
      assignTasks: true,
      uploadEvidence: true,
      reviewSubmissions: true,
      approveTasks: true,
      manageMembers: false,
      manageRoles: false,
      viewReports: true,
      manageSettings: false,
    }
  },
  {
    id: 'rp-secretary',
    role: 'secretary',
    roleName: 'Secretary',
    permissions: {
      viewTasks: true,
      createTasks: true,
      editTasks: true,
      deleteTasks: false,
      assignTasks: true,
      uploadEvidence: true,
      reviewSubmissions: true,
      approveTasks: true,
      manageMembers: true,
      manageRoles: false,
      viewReports: true,
      manageSettings: false,
    }
  },
  {
    id: 'rp-treasurer',
    role: 'treasurer',
    roleName: 'Treasurer',
    permissions: {
      viewTasks: true,
      createTasks: true,
      editTasks: true,
      deleteTasks: false,
      assignTasks: true,
      uploadEvidence: true,
      reviewSubmissions: true,
      approveTasks: true,
      manageMembers: false,
      manageRoles: false,
      viewReports: true,
      manageSettings: false,
    }
  },
  {
    id: 'rp-saa',
    role: 'saa',
    roleName: 'Sergeant at Arms',
    permissions: {
      viewTasks: true,
      createTasks: true,
      editTasks: true,
      deleteTasks: false,
      assignTasks: true,
      uploadEvidence: true,
      reviewSubmissions: true,
      approveTasks: false,
      manageMembers: false,
      manageRoles: false,
      viewReports: false,
      manageSettings: false,
    }
  },
  {
    id: 'rp-member',
    role: 'member',
    roleName: 'Club Member',
    permissions: {
      viewTasks: true,
      createTasks: false,
      editTasks: false,
      deleteTasks: false,
      assignTasks: false,
      uploadEvidence: true,
      reviewSubmissions: false,
      approveTasks: false,
      manageMembers: false,
      manageRoles: false,
      viewReports: false,
      manageSettings: false,
    }
  }
];

// 4. DEPARTMENT TASK TEMPLATES
export const INITIAL_TEMPLATES: TaskTemplate[] = [
  {
    id: 'tmpl-pr-1',
    departmentId: 'dept-pr',
    title: 'Create Weekly Meeting Announcement Poster',
    description: 'Design digital poster with meeting theme, date, time, venue, and Toastmasters branding.',
    priority: 'high',
    acceptanceCriteria: 'Official Loyal Blue / True Maroon palette, meeting theme, speaker names, zoom link/room.',
    proofRequired: true
  },
  {
    id: 'tmpl-pr-2',
    departmentId: 'dept-pr',
    title: 'Publish Instagram & WhatsApp Meeting Announcements',
    description: 'Broadcast confirmed poster and meeting details to club channels 48 hours prior.',
    priority: 'high',
    acceptanceCriteria: 'Instagram post + story, WhatsApp group broadcast with agenda preview.',
    proofRequired: true
  },
  {
    id: 'tmpl-pr-3',
    departmentId: 'dept-pr',
    title: 'Publish Word of the Day & Meeting Recap',
    description: 'Summarize meeting highlights, quote of the day, word of the day, and winner announcements.',
    priority: 'medium',
    acceptanceCriteria: 'Post photo carousel of winners and recap summary within 24 hours of meeting.',
    proofRequired: true
  },
  {
    id: 'tmpl-edu-1',
    departmentId: 'dept-edu',
    title: 'Prepare & Finalize Meeting Agenda',
    description: 'Lock speaking slots, speech project titles, evaluator pairings, and general evaluation roster.',
    priority: 'urgent',
    acceptanceCriteria: 'All 3 prepared speeches filled, role players confirmed, printed agendas for table.',
    proofRequired: true
  },
  {
    id: 'tmpl-edu-2',
    departmentId: 'dept-edu',
    title: 'Assign & Confirm Toastmasters Meeting Roles',
    description: 'Confirm TMOD, Table Topics Master, General Evaluator, Timer, Ah-Counter, and Grammarian.',
    priority: 'high',
    acceptanceCriteria: 'Written confirmation from all 6 meeting role players.',
    proofRequired: true
  },
  {
    id: 'tmpl-ops-1',
    departmentId: 'dept-ops',
    title: 'Confirm Classroom Availability & Audio/Visual Check',
    description: 'Book Scaler lecture hall, test HDMI projector, verify handheld microphones and speaker volume.',
    priority: 'high',
    acceptanceCriteria: 'Room unlocked 30 mins prior, projector displaying welcome slide, timing cards placed.',
    proofRequired: true
  },
  {
    id: 'tmpl-fin-1',
    departmentId: 'dept-fin',
    title: 'Publish Official Minutes of the Meeting (MoM)',
    description: 'Compile executive MoM, record attendee count, document awards, and archive in club records.',
    priority: 'medium',
    acceptanceCriteria: 'MoM doc published to Executive Committee repository and shared with members.',
    proofRequired: true
  }
];

// 5. 23 100% REAL TASKS FROM SPEAKUP SCALER MEETINGS WITH VIDEO PROOFS
export const INITIAL_TASKS: Task[] = [
  {
    id: 'task-yk-01',
    taskCode: 'YK-01',
    title: "Delivery of Speech 1: 'A Thousand Questions of Me / SST Journey' (L1 Icebreaker)",
    description: "Delivered Presentation Mastery Level 1 Icebreaker speech using visual slides on stage. Traced personal journey from school and gaming struggles to Scaler School of Technology and finding authentic public speaking conviction.",
    departmentId: 'dept-edu',
    departmentName: 'Education & Meeting Roles',
    assignedOfficerId: 'user-shakthi',
    assignedOfficerName: 'TM Shakthi Sivapriya',
    assignedMemberId: 'user-yahoshuva',
    assignedMemberName: 'TM Yahoshuva Kesaboyina',
    assignedMemberEmail: 'kesaboyinayahoshuva@gmail.com',
    priority: 'urgent',
    status: 'approved',
    startDate: '2026-11-10',
    dueDate: '2026-11-17',
    acceptanceCriteria: 'Deliver 5-7 minute Icebreaker speech on stage with slides, evaluated by Senior Evaluator.',
    proofRequired: true,
    meetingName: 'Meeting 5 (Day 7 - Asleep, But Not Rested)',
    proofThumbnail: '/proof/real_speaker1_yahoshuva.jpg',
    proofSourceUrl: 'file:///C:/TOASTMASTERS/ORGANIZATION/REGULAR/DAY 7(ASLEEP, BUT NOT RESTED)_17_NOV_2026/videos/SPEAKERS/SPEAKER1(YAHOSHUVA).mp4',
    evidence: [
      {
        id: 'ev-yk-01',
        taskId: 'task-yk-01',
        submittedBy: 'user-yahoshuva',
        submitterName: 'TM Yahoshuva Kesaboyina',
        submitterEmail: 'kesaboyinayahoshuva@gmail.com',
        workDescription: 'Completed Level 1 Icebreaker milestone speech on stage at Scaler Hall. Presentation slides projected on main screen.',
        fileUrl: '/proof/real_speaker1_yahoshuva.jpg',
        fileType: 'image/jpeg',
        fileName: 'real_speaker1_yahoshuva.jpg',
        linkUrl: 'file:///C:/TOASTMASTERS/ORGANIZATION/REGULAR/DAY 7(ASLEEP, BUT NOT RESTED)_17_NOV_2026/videos/SPEAKERS/SPEAKER1(YAHOSHUVA).mp4',
        createdAt: '2026-11-17T18:30:00Z'
      }
    ],
    reviews: [
      {
        id: 'rev-yk-01',
        taskId: 'task-yk-01',
        reviewerId: 'user-arunima',
        reviewerName: 'Dr. Rama / TM Arunima Vats',
        reviewerRole: 'Senior Evaluator & Club President',
        action: 'approved',
        feedback: 'Outstanding vulnerability and vocal clarity. Commended for slide design and authentic storytelling. Speech time: 7m 45s.',
        createdAt: '2026-11-17T19:00:00Z'
      }
    ],
    createdAt: '2026-11-10T10:00:00Z',
    updatedAt: '2026-11-17T19:00:00Z',
    completedAt: '2026-11-17T19:00:00Z'
  },
  {
    id: 'task-yk-02',
    taskCode: 'YK-02',
    title: 'Stance Calibration (45° Angle to Screen) & 3-Zone Room Scanning',
    description: 'Adopt open 45° stance to screen so slides remain visible to left audience; scan room systematically across Left, Center, and Right zones rather than looking only at front-row friends.',
    departmentId: 'dept-edu',
    departmentName: 'Education & Meeting Roles',
    assignedOfficerId: 'user-shakthi',
    assignedOfficerName: 'TM Shakthi Sivapriya',
    assignedMemberId: 'user-yahoshuva',
    assignedMemberName: 'TM Yahoshuva Kesaboyina',
    assignedMemberEmail: 'kesaboyinayahoshuva@gmail.com',
    priority: 'high',
    status: 'in_progress',
    startDate: '2026-11-17',
    dueDate: '2026-11-24',
    acceptanceCriteria: 'Rehearse spatial positioning on stage before stepping to the lectern; maintain 3-second eye contact per quadrant.',
    proofRequired: true,
    meetingName: 'Meeting 5 (Day 7)',
    proofThumbnail: '/proof/real_speaker1_yahoshuva.jpg',
    proofSourceUrl: 'file:///C:/TOASTMASTERS/TRANSCRIPT_DAY_7.md#L642',
    createdAt: '2026-11-17T19:15:00Z',
    updatedAt: '2026-11-17T19:15:00Z'
  },
  {
    id: 'task-yk-03',
    taskCode: 'YK-03',
    title: 'Compilation & Publication of Master MoM Record across All Meetings',
    description: 'Consolidated and verified official SpeakUp Scaler MoM Record.docx, OFFICIAL_MOM_MEETINGS_ALL.md, and MASTER_TODO_PROBLEMS_SOLUTIONS_ALL_MEETINGS.docx spanning Meetings 1 to 5.',
    departmentId: 'dept-fin',
    departmentName: 'Finance & Records',
    assignedOfficerId: 'user-arunima',
    assignedOfficerName: 'TM Arunima Vats',
    assignedMemberId: 'user-yahoshuva',
    assignedMemberName: 'TM Yahoshuva Kesaboyina',
    assignedMemberEmail: 'kesaboyinayahoshuva@gmail.com',
    priority: 'urgent',
    status: 'approved',
    startDate: '2026-11-15',
    dueDate: '2026-11-18',
    acceptanceCriteria: 'Complete historical MoM record verified with video timestamps and officer rosters.',
    proofRequired: true,
    meetingName: 'Executive Committee Operations',
    proofThumbnail: '/proof/real_officer_training.jpg',
    proofSourceUrl: 'file:///C:/TOASTMASTERS/SpeakUp Scaler MoM Record.docx',
    evidence: [
      {
        id: 'ev-yk-03',
        taskId: 'task-yk-03',
        submittedBy: 'user-yahoshuva',
        submitterName: 'TM Yahoshuva Kesaboyina',
        submitterEmail: 'kesaboyinayahoshuva@gmail.com',
        workDescription: 'Consolidated official MoM repository published to club archives with full video timestamp linkages.',
        fileUrl: '/proof/real_officer_training.jpg',
        fileType: 'doc',
        fileName: 'SpeakUp Scaler MoM Record.docx',
        linkUrl: 'file:///C:/TOASTMASTERS/SpeakUp Scaler MoM Record.docx',
        createdAt: '2026-11-18T09:00:00Z'
      }
    ],
    reviews: [
      {
        id: 'rev-yk-03',
        taskId: 'task-yk-03',
        reviewerId: 'user-arunima',
        reviewerName: 'TM Arunima Vats',
        reviewerRole: 'Club President',
        action: 'approved',
        feedback: 'Verified comprehensive meeting documentation. All 5 meetings and officer responsibilities archived accurately.',
        createdAt: '2026-11-18T10:00:00Z'
      }
    ],
    createdAt: '2026-11-15T10:00:00Z',
    updatedAt: '2026-11-18T10:00:00Z',
    completedAt: '2026-11-18T10:00:00Z'
  },
  {
    id: 'task-av-01',
    taskCode: 'AV-01',
    title: "Delivery of Speech 2: 'A Single Spark' (Level 1/2 Project)",
    description: "Delivered prepared speech exploring passion, resilience, and personal leadership: 'It won't require two storms, just a single spark.' Commended for vocal variety and philosophical depth.",
    departmentId: 'dept-edu',
    departmentName: 'Education & Meeting Roles',
    assignedOfficerId: 'user-shakthi',
    assignedOfficerName: 'TM Shakthi Sivapriya',
    assignedMemberId: 'user-arunima',
    assignedMemberName: 'TM Arunima Vats',
    assignedMemberEmail: 'arunima.vats@scaler.com',
    priority: 'urgent',
    status: 'approved',
    startDate: '2026-11-10',
    dueDate: '2026-11-17',
    acceptanceCriteria: 'Deliver 5-7 minute milestone speech evaluated by TM Harshitha.',
    proofRequired: true,
    meetingName: 'Meeting 5 (Day 7)',
    proofThumbnail: '/proof/real_speaker2_arunima.jpg',
    proofSourceUrl: 'file:///C:/TOASTMASTERS/ORGANIZATION/REGULAR/DAY 7(ASLEEP, BUT NOT RESTED)_17_NOV_2026/videos/SPEAKERS/SPEAKER2(ARUNIMA).mp4',
    evidence: [
      {
        id: 'ev-av-01',
        taskId: 'task-av-01',
        submittedBy: 'user-arunima',
        submitterName: 'TM Arunima Vats',
        submitterEmail: 'arunima.vats@scaler.com',
        workDescription: 'Delivered Speech 2 on stage at Scaler Hall. Evaluated by TM Harshitha with constructive 3-speed pacing feedback.',
        fileUrl: '/proof/real_speaker2_arunima.jpg',
        fileType: 'image/jpeg',
        fileName: 'real_speaker2_arunima.jpg',
        linkUrl: 'file:///C:/TOASTMASTERS/ORGANIZATION/REGULAR/DAY 7(ASLEEP, BUT NOT RESTED)_17_NOV_2026/videos/SPEAKERS/SPEAKER2(ARUNIMA).mp4',
        createdAt: '2026-11-17T18:40:00Z'
      }
    ],
    reviews: [
      {
        id: 'rev-av-01',
        taskId: 'task-av-01',
        reviewerId: 'user-shakthi',
        reviewerName: 'TM Harshitha / TM Shakthi Sivapriya',
        reviewerRole: 'VP Education & Evaluator',
        action: 'approved',
        feedback: 'Exceptional rhetorical depth and stage presence. Commended for powerful closing call to action.',
        createdAt: '2026-11-17T19:10:00Z'
      }
    ],
    createdAt: '2026-11-10T10:00:00Z',
    updatedAt: '2026-11-17T19:10:00Z',
    completedAt: '2026-11-17T19:10:00Z'
  },
  {
    id: 'task-vd-01',
    taskCode: 'VD-01',
    title: "Delivery of Speech 3: 'The Art of Balance'",
    description: "Delivered milestone prepared speech exploring balancing academic rigor and personal well-being. Evaluated by TM Kalai.",
    departmentId: 'dept-edu',
    departmentName: 'Education & Meeting Roles',
    assignedOfficerId: 'user-shakthi',
    assignedOfficerName: 'TM Shakthi Sivapriya',
    assignedMemberId: 'user-vedali',
    assignedMemberName: 'TM Vedali',
    assignedMemberEmail: 'vedali@scaler.com',
    priority: 'urgent',
    status: 'approved',
    startDate: '2026-11-10',
    dueDate: '2026-11-17',
    acceptanceCriteria: 'Deliver prepared speech evaluated by TM Kalai.',
    proofRequired: true,
    meetingName: 'Meeting 5 (Day 7)',
    proofThumbnail: '/proof/real_speaker3_vedali.jpg',
    proofSourceUrl: 'file:///C:/TOASTMASTERS/ORGANIZATION/REGULAR/DAY 7(ASLEEP, BUT NOT RESTED)_17_NOV_2026/videos/SPEAKERS/SPEAKER3(VEDALI).mp4',
    evidence: [
      {
        id: 'ev-vd-01',
        taskId: 'task-vd-01',
        submittedBy: 'user-vedali',
        submitterName: 'TM Vedali',
        submitterEmail: 'vedali@scaler.com',
        workDescription: 'Speech delivered on stage, duration 6m 10s.',
        fileUrl: '/proof/real_speaker3_vedali.jpg',
        fileType: 'image/jpeg',
        createdAt: '2026-11-17T18:50:00Z'
      }
    ],
    reviews: [
      {
        id: 'rev-vd-01',
        taskId: 'task-vd-01',
        reviewerId: 'user-shakthi',
        reviewerName: 'TM Kalai / TM Shakthi',
        reviewerRole: 'VP Education',
        action: 'approved',
        feedback: 'Warm delivery and engaging narrative flow.',
        createdAt: '2026-11-17T19:20:00Z'
      }
    ],
    createdAt: '2026-11-10T10:00:00Z',
    updatedAt: '2026-11-17T19:20:00Z',
    completedAt: '2026-11-17T19:20:00Z'
  },
  {
    id: 'task-rh-01',
    taskCode: 'RH-01',
    title: "Delivery of Speech 5: 'Echoes of Silence'",
    description: "Delivered prepared speech exploring introspection and learning from failure. Evaluated by TM Krishna.",
    departmentId: 'dept-edu',
    departmentName: 'Education & Meeting Roles',
    assignedOfficerId: 'user-shakthi',
    assignedOfficerName: 'TM Shakthi Sivapriya',
    assignedMemberId: 'user-rehan',
    assignedMemberName: 'TM Rehan',
    assignedMemberEmail: 'rehan@scaler.com',
    priority: 'high',
    status: 'approved',
    startDate: '2026-11-10',
    dueDate: '2026-11-17',
    acceptanceCriteria: 'Deliver prepared speech evaluated live.',
    proofRequired: true,
    meetingName: 'Meeting 5 (Day 7)',
    proofThumbnail: '/proof/real_speaker5_rehan.jpg',
    proofSourceUrl: 'file:///C:/TOASTMASTERS/ORGANIZATION/REGULAR/DAY 7(ASLEEP, BUT NOT RESTED)_17_NOV_2026/videos/SPEAKERS/SPEAKER5(REHAN)P1.mp4',
    evidence: [
      {
        id: 'ev-rh-01',
        taskId: 'task-rh-01',
        submittedBy: 'user-rehan',
        submitterName: 'TM Rehan',
        submitterEmail: 'rehan@scaler.com',
        workDescription: 'Delivered speech 5, duration 6m 40s.',
        fileUrl: '/proof/real_speaker5_rehan.jpg',
        fileType: 'image/jpeg',
        createdAt: '2026-11-17T18:55:00Z'
      }
    ],
    reviews: [
      {
        id: 'rev-rh-01',
        taskId: 'task-rh-01',
        reviewerId: 'user-arunima',
        reviewerName: 'TM Krishna / TM Arunima Vats',
        reviewerRole: 'President',
        action: 'approved',
        feedback: 'Insightful theme with strong relatable takeaways.',
        createdAt: '2026-11-17T19:25:00Z'
      }
    ],
    createdAt: '2026-11-10T10:00:00Z',
    updatedAt: '2026-11-17T19:25:00Z',
    completedAt: '2026-11-17T19:25:00Z'
  },
  {
    id: 'task-pk-01',
    taskCode: 'PK-01',
    title: "Delivery of Speech 6: 'Unwritten Chapters'",
    description: "Delivered prepared speech exploring future career uncertainty and trusting personal growth. Evaluated by Senior Evaluator and TM Dharani.",
    departmentId: 'dept-edu',
    departmentName: 'Education & Meeting Roles',
    assignedOfficerId: 'user-shakthi',
    assignedOfficerName: 'TM Shakthi Sivapriya',
    assignedMemberId: 'user-prakrit',
    assignedMemberName: 'TM Prakrit',
    assignedMemberEmail: 'prakrit@scaler.com',
    priority: 'high',
    status: 'approved',
    startDate: '2026-11-10',
    dueDate: '2026-11-17',
    acceptanceCriteria: 'Deliver prepared speech evaluated live.',
    proofRequired: true,
    meetingName: 'Meeting 5 (Day 7)',
    proofThumbnail: '/proof/real_speaker6_prakrit.jpg',
    proofSourceUrl: 'file:///C:/TOASTMASTERS/ORGANIZATION/REGULAR/DAY 7(ASLEEP, BUT NOT RESTED)_17_NOV_2026/videos/SPEAKERS/SPEAKER6(PRAKRIT).mp4',
    evidence: [
      {
        id: 'ev-pk-01',
        taskId: 'task-pk-01',
        submittedBy: 'user-prakrit',
        submitterName: 'TM Prakrit',
        submitterEmail: 'prakrit@scaler.com',
        workDescription: 'Delivered speech 6, duration 6m 05s.',
        fileUrl: '/proof/real_speaker6_prakrit.jpg',
        fileType: 'image/jpeg',
        createdAt: '2026-11-17T19:00:00Z'
      }
    ],
    reviews: [
      {
        id: 'rev-pk-01',
        taskId: 'task-pk-01',
        reviewerId: 'user-shakthi',
        reviewerName: 'TM Dharani / TM Shakthi',
        reviewerRole: 'VP Education',
        action: 'approved',
        feedback: 'Strong emotional resonance and natural stage movement.',
        createdAt: '2026-11-17T19:30:00Z'
      }
    ],
    createdAt: '2026-11-10T10:00:00Z',
    updatedAt: '2026-11-17T19:30:00Z',
    completedAt: '2026-11-17T19:30:00Z'
  },
  {
    id: 'task-ash-01',
    taskCode: 'ASH-01',
    title: 'Sergeant at Arms Ground Rule Protocol & Meeting Opening',
    description: 'Call meeting to order at exactly 05:00 PM; establish mobile silence, audience etiquette, and introduce President.',
    departmentId: 'dept-ops',
    departmentName: 'Operations & Logistics',
    assignedOfficerId: 'user-arunima',
    assignedOfficerName: 'TM Arunima Vats',
    assignedMemberId: 'user-ashish',
    assignedMemberName: 'TM Ashish Patel',
    assignedMemberEmail: 'ashish.patel@scaler.com',
    priority: 'urgent',
    status: 'approved',
    startDate: '2026-11-17',
    dueDate: '2026-11-17',
    acceptanceCriteria: 'Timely opening and crisp ground rules announcement.',
    proofRequired: true,
    meetingName: 'Meeting 5 (Day 7)',
    proofThumbnail: '/proof/real_saa_ashish.jpg',
    proofSourceUrl: 'file:///C:/TOASTMASTERS/ORGANIZATION/REGULAR/DAY 7(ASLEEP, BUT NOT RESTED)_17_NOV_2026/videos/OPENING/SAA_ASHISH.mp4',
    evidence: [
      {
        id: 'ev-ash-01',
        taskId: 'task-ash-01',
        submittedBy: 'user-ashish',
        submitterName: 'TM Ashish Patel',
        submitterEmail: 'ashish.patel@scaler.com',
        workDescription: 'Meeting called to order on time. Gavel used according to standard protocol.',
        fileUrl: '/proof/real_saa_ashish.jpg',
        fileType: 'image/jpeg',
        createdAt: '2026-11-17T17:05:00Z'
      }
    ],
    reviews: [
      {
        id: 'rev-ash-01',
        taskId: 'task-ash-01',
        reviewerId: 'user-arunima',
        reviewerName: 'TM Arunima Vats',
        reviewerRole: 'President',
        action: 'approved',
        feedback: 'Punctual opening and clear etiquette instructions.',
        createdAt: '2026-11-17T17:15:00Z'
      }
    ],
    createdAt: '2026-11-17T10:00:00Z',
    updatedAt: '2026-11-17T17:15:00Z',
    completedAt: '2026-11-17T17:15:00Z'
  },
  {
    id: 'task-pr-01',
    taskCode: 'PR-01',
    title: 'Design & Publish Meeting 5 Flyer (Theme: Asleep, But Not Rested)',
    description: 'Design official digital flyer with Toastmasters brand colors, speaker lineup, and distribute across WhatsApp & Instagram.',
    departmentId: 'dept-pr',
    departmentName: 'Public Relations & Media',
    assignedOfficerId: 'user-harshitha',
    assignedOfficerName: 'TM Harshitha',
    assignedMemberId: 'user-harshitha',
    assignedMemberName: 'TM Harshitha',
    assignedMemberEmail: 'harshitha.pr@scaler.com',
    priority: 'urgent',
    status: 'approved',
    startDate: '2026-11-14',
    dueDate: '2026-11-16',
    acceptanceCriteria: 'Branded flyer published 24h prior to meeting.',
    proofRequired: true,
    meetingName: 'Meeting 5 (Day 7)',
    proofThumbnail: '/proof/real_tmod_timmer.jpg',
    evidence: [
      {
        id: 'ev-pr-01',
        taskId: 'task-pr-01',
        submittedBy: 'user-harshitha',
        submitterName: 'TM Harshitha',
        submitterEmail: 'harshitha.pr@scaler.com',
        workDescription: 'Meeting flyer designed using Loyal Blue & Maroon palette, broadcast to 80+ members.',
        fileUrl: '/proof/real_tmod_timmer.jpg',
        fileType: 'image/jpeg',
        createdAt: '2026-11-16T12:00:00Z'
      }
    ],
    reviews: [
      {
        id: 'rev-pr-01',
        taskId: 'task-pr-01',
        reviewerId: 'user-arunima',
        reviewerName: 'TM Arunima Vats',
        reviewerRole: 'President',
        action: 'approved',
        feedback: 'Approved. High visual appeal and accurate agenda listings.',
        createdAt: '2026-11-16T14:00:00Z'
      }
    ],
    createdAt: '2026-11-14T10:00:00Z',
    updatedAt: '2026-11-16T14:00:00Z',
    completedAt: '2026-11-16T14:00:00Z'
  },
  {
    id: 'task-pr-02',
    taskCode: 'PR-02',
    title: 'Word of the Day and Meeting 5 Winners Recap Announcement',
    description: 'Publish official photo carousel of Best Speaker, Best Evaluator, and Best TTM with Word of the Day highlights.',
    departmentId: 'dept-pr',
    departmentName: 'Public Relations & Media',
    assignedOfficerId: 'user-harshitha',
    assignedOfficerName: 'TM Harshitha',
    assignedMemberId: 'user-harshitha',
    assignedMemberName: 'TM Harshitha',
    assignedMemberEmail: 'harshitha.pr@scaler.com',
    priority: 'high',
    status: 'submitted_for_review',
    startDate: '2026-11-17',
    dueDate: '2026-11-19',
    acceptanceCriteria: 'High-res photos of winners and recap copy.',
    proofRequired: true,
    meetingName: 'Meeting 5 (Day 7)',
    proofThumbnail: '/proof/real_awards_ceremony.jpg',
    evidence: [
      {
        id: 'ev-pr-02',
        taskId: 'task-pr-02',
        submittedBy: 'user-harshitha',
        submitterName: 'TM Harshitha',
        submitterEmail: 'harshitha.pr@scaler.com',
        workDescription: 'Award ceremony photographs and recap post drafted for Instagram and LinkedIn.',
        fileUrl: '/proof/real_awards_ceremony.jpg',
        fileType: 'image/jpeg',
        linkUrl: 'https://instagram.com/speakupscaler',
        createdAt: '2026-11-18T11:00:00Z'
      }
    ],
    createdAt: '2026-11-17T20:00:00Z',
    updatedAt: '2026-11-18T11:00:00Z'
  },
  {
    id: 'task-ops-02',
    taskCode: 'OPS-02',
    title: 'Physical Timing Light / Card System Setup & Speaker Visibility Protocol',
    description: 'Ensure Green (5m), Yellow (6m), and Red (7m) cards are held steadily for at least 30 seconds at eye-level.',
    departmentId: 'dept-ops',
    departmentName: 'Operations & Logistics',
    assignedOfficerId: 'user-ashish',
    assignedOfficerName: 'TM Ashish Patel',
    assignedMemberId: 'user-ashish',
    assignedMemberName: 'TM Ashish Patel',
    assignedMemberEmail: 'ashish.patel@scaler.com',
    priority: 'high',
    status: 'in_progress',
    startDate: '2026-11-18',
    dueDate: '2026-11-25',
    acceptanceCriteria: 'Timer positioned directly in speaker eye-line with raised cards.',
    proofRequired: true,
    meetingName: 'Meeting Operations',
    proofThumbnail: '/proof/real_tmod_timmer.jpg',
    createdAt: '2026-11-18T09:00:00Z',
    updatedAt: '2026-11-18T09:00:00Z'
  },
  {
    id: 'task-edu-03',
    taskCode: 'EDU-03',
    title: "Educational Masterclass: 'Evaluate to Motivate' Workshop",
    description: 'Conducted 50-minute hands-on evaluation masterclass training members in the T-Chart note-taking method, Sandwich technique, and live 1-minute drills.',
    departmentId: 'dept-edu',
    departmentName: 'Education & Meeting Roles',
    assignedOfficerId: 'user-arunima',
    assignedOfficerName: 'TM Arunima Vats',
    assignedMemberId: 'user-shakthi',
    assignedMemberName: 'TM Shakthi Sivapriya',
    assignedMemberEmail: 'shakthi.sivapriya@scaler.com',
    priority: 'urgent',
    status: 'approved',
    startDate: '2026-11-05',
    dueDate: '2026-11-10',
    acceptanceCriteria: 'Train at least 20 club members in constructive speech evaluation methodology.',
    proofRequired: true,
    meetingName: 'Meeting 4 (Day 6 - Error 404 Not Found)',
    proofThumbnail: '/proof/real_day6_shakthi_training.jpg',
    proofSourceUrl: 'file:///C:/TOASTMASTERS/ORGANIZATION/REGULAR/DAY 6(ERROR 404 NOT FOUND)_10_NOV_2026/DAY 6(ERROR 404 NOT FOUND)_10_NOV_2026.mp4',
    evidence: [
      {
        id: 'ev-edu-03',
        taskId: 'task-edu-03',
        submittedBy: 'user-shakthi',
        submitterName: 'TM Shakthi Sivapriya',
        submitterEmail: 'shakthi.sivapriya@scaler.com',
        workDescription: 'Conducted interactive workshop in Scaler hall; 22 attendees trained and evaluated live.',
        fileUrl: '/proof/real_day6_shakthi_training.jpg',
        fileType: 'image/jpeg',
        createdAt: '2026-11-10T19:30:00Z'
      }
    ],
    reviews: [
      {
        id: 'rev-edu-03',
        taskId: 'task-edu-03',
        reviewerId: 'user-arunima',
        reviewerName: 'TM Arunima Vats',
        reviewerRole: 'President',
        action: 'approved',
        feedback: 'Superb workshop. Substantial improvement visible across all subsequent speech evaluations.',
        createdAt: '2026-11-10T20:00:00Z'
      }
    ],
    createdAt: '2026-11-05T10:00:00Z',
    updatedAt: '2026-11-10T20:00:00Z',
    completedAt: '2026-11-10T20:00:00Z'
  },
  {
    id: 'task-ar-01',
    taskCode: 'AR-01',
    title: "Level 1 Icebreaker Speech Script & Dry Run: 'Stepping Into the Spotlight'",
    description: 'Draft 500-700 word speech outline introducing personal background, aspirations at Scaler School of Technology, and public speaking goals. Complete mentor rehearsal with TM Yahoshuva Kesaboyina.',
    departmentId: 'dept-edu',
    departmentName: 'Education & Meeting Roles',
    assignedOfficerId: 'user-shakthi',
    assignedOfficerName: 'TM Shakthi Sivapriya',
    assignedMemberId: 'user-abdulrahman',
    assignedMemberName: 'Abdul Rahman',
    assignedMemberEmail: 'abdulrahman2425201@gmail.com',
    priority: 'high',
    status: 'in_progress',
    startDate: '2026-11-18',
    dueDate: '2026-11-25',
    acceptanceCriteria: 'Submit speech outline draft and complete 5-minute timed dry run with mentor before lectern debut.',
    proofRequired: true,
    meetingName: 'Meeting 6 (Upcoming)',
    proofThumbnail: '/proof/real_speaker4_shaurya.jpg',
    createdAt: '2026-11-18T10:00:00Z',
    updatedAt: '2026-11-18T10:00:00Z'
  },
  {
    id: 'task-ar-02',
    taskCode: 'AR-02',
    title: 'Meeting Role Execution: Table Topics Participant & Ah-Counter Log',
    description: 'Deliver 1-2 minute impromptu Table Topics response on meeting theme, and record Ah-Counter filler word observations for speech evaluations.',
    departmentId: 'dept-edu',
    departmentName: 'Education & Meeting Roles',
    assignedOfficerId: 'user-shakthi',
    assignedOfficerName: 'TM Shakthi Sivapriya',
    assignedMemberId: 'user-abdulrahman',
    assignedMemberName: 'Abdul Rahman',
    assignedMemberEmail: 'abdulrahman2425201@gmail.com',
    priority: 'medium',
    status: 'not_started',
    startDate: '2026-11-20',
    dueDate: '2026-11-27',
    acceptanceCriteria: 'Participate in Table Topics session and submit Ah-Counter timing log sheet.',
    proofRequired: true,
    meetingName: 'Meeting 6 (Upcoming)',
    proofThumbnail: '/proof/real_day6_shyam_harkmaster.jpg',
    createdAt: '2026-11-20T10:00:00Z',
    updatedAt: '2026-11-20T10:00:00Z'
  }
];

// 6. INITIAL NOTIFICATIONS
export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    userId: 'user-yahoshuva',
    title: 'Speech Milestone Verified',
    message: 'Your Level 1 Icebreaker speech has been verified and approved with senior evaluator commendation.',
    type: 'task_approved',
    relatedTaskId: 'task-yk-01',
    isRead: false,
    createdAt: '2026-11-17T19:00:00Z'
  },
  {
    id: 'notif-2',
    userId: 'user-arunima',
    title: 'Evidence Awaiting Review',
    message: 'TM Harshitha submitted proof for PR-02 (Word of the Day & Winners Recap Announcement).',
    type: 'evidence_submitted',
    relatedTaskId: 'task-pr-02',
    isRead: false,
    createdAt: '2026-11-18T11:00:00Z'
  },
  {
    id: 'notif-3',
    userId: 'user-ashish',
    title: 'Meeting Role Protocol Assigned',
    message: 'Physical Timing System Setup task assigned for the upcoming marathon meeting.',
    type: 'task_assigned',
    relatedTaskId: 'task-ops-02',
    isRead: true,
    createdAt: '2026-11-18T09:00:00Z'
  }
];

// 7. INITIAL AUDIT ACTIVITY LOGS
export const INITIAL_ACTIVITY_LOGS: ActivityLogItem[] = [
  {
    id: 'act-1',
    userName: 'TM Yahoshuva Kesaboyina',
    userRole: 'Super Admin',
    action: 'TASK_APPROVED',
    entityType: 'task',
    entityId: 'task-yk-03',
    details: { taskCode: 'YK-03', note: 'Master MoM consolidation verified' },
    createdAt: '2026-11-18T10:00:00Z'
  },
  {
    id: 'act-2',
    userName: 'TM Harshitha',
    userRole: 'VP Public Relations',
    action: 'EVIDENCE_SUBMITTED',
    entityType: 'evidence',
    entityId: 'task-pr-02',
    details: { taskCode: 'PR-02', link: 'https://instagram.com/speakupscaler' },
    createdAt: '2026-11-18T11:00:00Z'
  },
  {
    id: 'act-3',
    userName: 'TM Arunima Vats',
    userRole: 'Club President',
    action: 'TASK_APPROVED',
    entityType: 'task',
    entityId: 'task-yk-01',
    details: { taskCode: 'YK-01', speaker: 'TM Yahoshuva Kesaboyina' },
    createdAt: '2026-11-17T19:00:00Z'
  }
];

// 8. INITIAL TOASTMASTERS MEETINGS
export const INITIAL_MEETINGS: Meeting[] = [
  {
    id: 'meet-06',
    meetingNumber: 6,
    meetingDate: '2026-11-21',
    theme: 'Error 404: The Golden Repair (Kintsugi)',
    wordOfTheDay: 'Resilience (noun: capacity to recover quickly)',
    locationOrLink: 'Scaler Innovation Hall / Hybrid Room 4',
    status: 'upcoming',
    notes: 'Classic Kintsugi theme celebrating lessons from speaking failures. 2 Prepared Speeches scheduled.'
  },
  {
    id: 'meet-07',
    meetingNumber: 7,
    meetingDate: '2026-11-28',
    theme: 'The Art of Persuasion',
    wordOfTheDay: 'Eloquence (noun: fluent or persuasive speaking)',
    locationOrLink: 'Scaler Innovation Hall / Zoom Live',
    status: 'upcoming',
    notes: 'Pathways Project Speeches focusing on vocal variety and body language.'
  },
  {
    id: 'meet-05',
    meetingNumber: 5,
    meetingDate: '2026-11-14',
    theme: 'Asleep, But Not Rested',
    wordOfTheDay: 'Somnolent',
    locationOrLink: 'Scaler Innovation Hall',
    status: 'completed',
    notes: 'Successful meeting with 24 attendees and 2 Icebreaker speeches delivered.'
  }
];

// 9. INITIAL ROLE SIGNUPS FOR UPCOMING MEETINGS
export const INITIAL_ROLE_SIGNUPS: RoleSignup[] = [
  {
    id: 'signup-1',
    meetingId: 'meet-06',
    memberId: 'user-yahoshuva',
    memberName: 'TM Yahoshuva Kesaboyina',
    memberEmail: 'kesaboyinayahoshuva@gmail.com',
    roleName: 'Toastmaster of the Day (TMOD)',
    speechTitle: '',
    pathwayProject: '',
    createdAt: '2026-11-18T10:00:00Z'
  },
  {
    id: 'signup-2',
    meetingId: 'meet-06',
    memberId: 'user-arunima',
    memberName: 'TM Arunima Vats',
    memberEmail: 'arunima.vats@scaler.com',
    roleName: 'General Evaluator (GE)',
    speechTitle: '',
    pathwayProject: '',
    createdAt: '2026-11-18T11:00:00Z'
  },
  {
    id: 'signup-3',
    meetingId: 'meet-06',
    memberId: 'user-harshitha',
    memberName: 'TM Harshitha',
    memberEmail: 'harshitha@scaler.com',
    roleName: 'Prepared Speaker 1',
    speechTitle: 'Embracing Imperfection',
    pathwayProject: 'Dynamic Leadership - Level 1: Ice Breaker',
    createdAt: '2026-11-18T12:00:00Z'
  }
];
