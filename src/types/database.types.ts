// ==============================================================================
// TOASTMASTERS TASK HUB - MASTER TYPESCRIPT TYPE DEFINITIONS
// ==============================================================================

export type UserSystemRole =
  | 'super_admin'
  | 'president'
  | 'vpe'
  | 'vpm'
  | 'vppr'
  | 'secretary'
  | 'treasurer'
  | 'saa'
  | 'member';

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export type TaskStatus =
  | 'not_started'
  | 'in_progress'
  | 'submitted_for_review'
  | 'approved'
  | 'changes_requested'
  | 'cancelled';

export type ReviewAction = 'approved' | 'rejected' | 'changes_requested';

export interface Profile {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  clubRole: string; // e.g. "Club President", "Secretary", "Member"
  systemRole: UserSystemRole;
  departmentId?: string;
  departmentName?: string;
  isActive: boolean;
  accessStatus?: 'approved' | 'pending' | 'rejected';
  phone?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Department {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  leaderId?: string;
  leaderName?: string;
  taskCount?: number;
  completedCount?: number;
}

export interface TaskEvidence {
  id: string;
  taskId: string;
  submittedBy: string;
  submitterName: string;
  submitterEmail: string;
  workDescription: string;
  fileUrl?: string;
  fileType?: string; // 'image', 'pdf', 'doc', 'link'
  fileName?: string;
  linkUrl?: string;
  createdAt: string;
}

export interface TaskReview {
  id: string;
  taskId: string;
  evidenceId?: string;
  reviewerId: string;
  reviewerName: string;
  reviewerRole: string;
  action: ReviewAction;
  feedback: string;
  createdAt: string;
}

export interface TaskComment {
  id: string;
  taskId: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  comment: string;
  createdAt: string;
}

export interface Task {
  id: string;
  taskCode: string; // e.g. YK-01, AV-02, PR-01
  title: string;
  description: string;
  departmentId: string;
  departmentName: string;
  assignedOfficerId?: string;
  assignedOfficerName?: string;
  assignedMemberId: string;
  assignedMemberName: string;
  assignedMemberEmail: string;
  priority: TaskPriority;
  status: TaskStatus;
  startDate?: string;
  dueDate?: string;
  acceptanceCriteria?: string;
  proofRequired: boolean; // CORE PRINCIPLE: Proof-based completion
  additionalInstructions?: string;
  meetingName?: string;
  evidence?: TaskEvidence[];
  reviews?: TaskReview[];
  comments?: TaskComment[];
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  proofThumbnail?: string;
  proofSourceUrl?: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'task_assigned' | 'evidence_submitted' | 'task_approved' | 'evidence_rejected' | 'deadline_approaching';
  relatedTaskId?: string;
  isRead: boolean;
  createdAt: string;
}

export interface ActivityLogItem {
  id: string;
  userId?: string;
  userName: string;
  userRole: string;
  action: string;
  entityType: 'task' | 'evidence' | 'member' | 'role' | 'system';
  entityId?: string;
  details?: Record<string, any>;
  createdAt: string;
}

export interface TaskTemplate {
  id: string;
  departmentId: string;
  title: string;
  description: string;
  priority: TaskPriority;
  acceptanceCriteria: string;
  proofRequired: boolean;
}

export interface RolePermission {
  id: string;
  role: UserSystemRole;
  roleName: string;
  permissions: {
    viewTasks: boolean;
    createTasks: boolean;
    editTasks: boolean;
    deleteTasks: boolean;
    assignTasks: boolean;
    uploadEvidence: boolean;
    reviewSubmissions: boolean;
    approveTasks: boolean;
    manageMembers: boolean;
    manageRoles: boolean;
    viewReports: boolean;
    manageSettings: boolean;
  };
}

export type ViewMode = 'kanban' | 'table' | 'calendar';

export interface Meeting {
  id: string;
  meetingNumber: number;
  meetingDate: string;
  theme: string;
  wordOfTheDay?: string;
  locationOrLink: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  notes?: string;
  createdAt?: string;
}

export interface RoleSignup {
  id: string;
  meetingId: string;
  memberId?: string;
  memberName?: string;
  memberEmail?: string;
  roleName: string;
  speechTitle?: string;
  pathwayProject?: string;
  createdAt: string;
}
