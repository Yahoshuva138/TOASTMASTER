import React, { useState, useEffect } from 'react';
import { 
  INITIAL_DEPARTMENTS, 
  INITIAL_PROFILES, 
  INITIAL_ROLE_PERMISSIONS, 
  INITIAL_TEMPLATES, 
  INITIAL_TASKS, 
  INITIAL_NOTIFICATIONS, 
  INITIAL_ACTIVITY_LOGS,
  INITIAL_MEETINGS,
  INITIAL_ROLE_SIGNUPS
} from './lib/taskStore';
import { 
  Task, 
  Profile, 
  Department, 
  RolePermission, 
  NotificationItem, 
  ActivityLogItem, 
  TaskTemplate,
  TaskEvidence,
  ReviewAction,
  UserSystemRole,
  TaskStatus,
  Meeting,
  RoleSignup
} from './types/database.types';

// Layout & Core Components
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { Footer } from './components/Footer';
import { CreateTaskModal } from './components/CreateTaskModal';
import { TaskDetailsModal } from './components/TaskDetailsModal';
import { EvidenceUploaderModal } from './components/EvidenceUploaderModal';

// Pages
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { AllTasks } from './pages/AllTasks';
import { MyTasks } from './pages/MyTasks';
import { TeamWorkspaces } from './pages/TeamWorkspaces';
import { ReviewQueue } from './pages/ReviewQueue';
import { EvidenceHistory } from './pages/EvidenceHistory';
import { MembersManagement } from './pages/MembersManagement';
import { RolesPermissions } from './pages/RolesPermissions';
import { NotificationsPanel } from './pages/NotificationsPanel';
import { Reports } from './pages/Reports';
import { ActivityLog } from './pages/ActivityLog';
import { AdminSettings } from './pages/AdminSettings';
import { UserProfile } from './pages/UserProfile';
import { RoleResources } from './pages/RoleResources';
import { MeetingAgendas } from './pages/MeetingAgendas';
import { fetchCloudMembers, grantCloudMemberAccess } from './lib/cloudSync';
import { supabase, isSupabaseConfigured } from './lib/supabaseClient';

export default function App() {
  // Session & Auth State: NO auto-login by default! Show main login page on first load
  const [currentUser, setCurrentUser] = useState<Profile | null>(() => {
    const saved = localStorage.getItem('tm_hub_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return null; // Start at the main login portal
  });

  // Database Entities
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('tm_hub_tasks');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_TASKS;
  });

  const [members, setMembers] = useState<Profile[]>(() => {
    const saved = localStorage.getItem('tm_hub_members');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_PROFILES;
  });

  const [departments] = useState<Department[]>(INITIAL_DEPARTMENTS);
  const [rolePermissions, setRolePermissions] = useState<RolePermission[]>(INITIAL_ROLE_PERMISSIONS);
  const [templates] = useState<TaskTemplate[]>(INITIAL_TEMPLATES);

  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [activityLogs, setActivityLogs] = useState<ActivityLogItem[]>(INITIAL_ACTIVITY_LOGS);

  // Meetings & Agendas State
  const [meetings, setMeetings] = useState<Meeting[]>(() => {
    const saved = localStorage.getItem('tm_hub_meetings');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_MEETINGS;
  });

  const [roleSignups, setRoleSignups] = useState<RoleSignup[]>(() => {
    const saved = localStorage.getItem('tm_hub_role_signups');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_ROLE_SIGNUPS;
  });

  // UI Navigation & Modals
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isOnline] = useState(true);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [evidenceTask, setEvidenceTask] = useState<Task | null>(null);
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    setIsMobileMenuOpen(false);
  };

  // Sync to Local Storage
  useEffect(() => {
    localStorage.setItem('tm_hub_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('tm_hub_members', JSON.stringify(members));
  }, [members]);

  useEffect(() => {
    localStorage.setItem('tm_hub_meetings', JSON.stringify(meetings));
  }, [meetings]);

  useEffect(() => {
    localStorage.setItem('tm_hub_role_signups', JSON.stringify(roleSignups));
  }, [roleSignups]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('tm_hub_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('tm_hub_user');
    }
  }, [currentUser]);

  // Realtime Supabase Cloud Synchronization for Members & Access Requests
  useEffect(() => {
    if (!isSupabaseConfigured()) return;

    const syncWithCloud = async () => {
      const cloudMembers = await fetchCloudMembers();
      if (cloudMembers.length > 0) {
        setMembers(prev => {
          const merged = [...prev];
          cloudMembers.forEach(cm => {
            const idx = merged.findIndex(m => m.email.toLowerCase() === cm.email.toLowerCase());
            if (idx >= 0) {
              merged[idx] = { ...merged[idx], ...cm };
            } else {
              merged.unshift(cm);
            }
          });
          return merged;
        });
      }
    };

    syncWithCloud();

    // Subscribe to live postgres changes
    const channel = supabase
      .channel('realtime-members')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'members' }, () => {
        syncWithCloud();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Auth Handlers
  const handleLoginSuccess = (user: Profile) => {
    setCurrentUser(user);
    if (!members.some(m => m.id === user.id || m.email.toLowerCase() === user.email.toLowerCase())) {
      setMembers(prev => [...prev, user]);
    }
  };

  // Self-Service Access Request Handler
  const handleRequestAccess = (pendingUser: Profile) => {
    if (!members.some(m => m.email.toLowerCase() === pendingUser.email.toLowerCase())) {
      setMembers(prev => [pendingUser, ...prev]);
    }

    // Notify Super Admin
    const notif: NotificationItem = {
      id: 'notif-' + Date.now(),
      userId: 'user-yahoshuva',
      title: 'New Member Access Request',
      message: `${pendingUser.email} has registered and requested access. Assign role in Members management.`,
      type: 'task_assigned',
      isRead: false,
      createdAt: new Date().toISOString()
    };
    setNotifications(prev => [notif, ...prev]);

    // Audit Log
    const log: ActivityLogItem = {
      id: 'act-' + Date.now(),
      userName: pendingUser.fullName,
      userRole: 'Guest / Applicant',
      action: 'ACCESS_REQUESTED',
      entityType: 'member',
      entityId: pendingUser.id,
      details: { email: pendingUser.email },
      createdAt: new Date().toISOString()
    };
    setActivityLogs(prev => [log, ...prev]);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  // Pre-authorize new email & assign role by Super Admin
  const handleAuthorizeNewEmail = (
    email: string,
    fullName: string,
    role: UserSystemRole,
    clubRole: string,
    departmentId: string
  ) => {
    const dept = departments.find(d => d.id === departmentId);
    const existingIndex = members.findIndex(m => m.email.toLowerCase() === email.toLowerCase());

    const authorizedProfile: Profile = {
      id: existingIndex >= 0 ? members[existingIndex].id : 'user-' + Date.now(),
      email: email.toLowerCase().trim(),
      fullName: fullName.trim(),
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      clubRole,
      systemRole: role,
      departmentId: dept?.id,
      departmentName: dept?.name || 'General Membership',
      isActive: true,
      accessStatus: 'approved',
      createdAt: existingIndex >= 0 ? members[existingIndex].createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (existingIndex >= 0) {
      setMembers(prev => prev.map((m, i) => i === existingIndex ? authorizedProfile : m));
    } else {
      setMembers(prev => [authorizedProfile, ...prev]);
    }

    // Sync approval to Cloud Supabase
    grantCloudMemberAccess(email, clubRole, fullName);

    // Audit Log
    const log: ActivityLogItem = {
      id: 'act-' + Date.now(),
      userName: currentUser?.fullName || 'Super Admin',
      userRole: 'Super Admin',
      action: 'EMAIL_AUTHORIZED',
      entityType: 'member',
      entityId: authorizedProfile.id,
      details: { email, role, clubRole, dept: dept?.name },
      createdAt: new Date().toISOString()
    };
    setActivityLogs(prev => [log, ...prev]);
  };

  // Approve pending access request
  const handleApprovePendingMember = (
    memberId: string,
    role: UserSystemRole,
    clubRole: string,
    departmentId: string
  ) => {
    const dept = departments.find(d => d.id === departmentId);
    setMembers(prev => prev.map(m => {
      if (m.id === memberId) {
        return {
          ...m,
          systemRole: role,
          clubRole,
          departmentId: dept?.id,
          departmentName: dept?.name,
          isActive: true,
          accessStatus: 'approved',
          updatedAt: new Date().toISOString()
        };
      }
      return m;
    }));

    // Audit Log
    const target = members.find(m => m.id === memberId);
    if (target?.email) {
      grantCloudMemberAccess(target.email, clubRole, target.fullName);
    }
    const log: ActivityLogItem = {
      id: 'act-' + Date.now(),
      userName: currentUser?.fullName || 'Super Admin',
      userRole: 'Super Admin',
      action: 'ACCESS_GRANTED',
      entityType: 'member',
      entityId: memberId,
      details: { email: target?.email, role, clubRole },
      createdAt: new Date().toISOString()
    };
    setActivityLogs(prev => [log, ...prev]);
  };

  // Reject pending access request
  const handleRejectPendingMember = (memberId: string) => {
    setMembers(prev => prev.filter(m => m.id !== memberId));
  };

  // Task Mutations
  const handleTaskCreated = (newTaskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTask: Task = {
      ...newTaskData,
      id: 'task-' + Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setTasks(prev => [newTask, ...prev]);

    const log: ActivityLogItem = {
      id: 'act-' + Date.now(),
      userName: currentUser?.fullName || 'User',
      userRole: currentUser?.clubRole || 'Member',
      action: 'TASK_CREATED',
      entityType: 'task',
      entityId: newTask.id,
      details: { taskCode: newTask.taskCode, title: newTask.title },
      createdAt: new Date().toISOString()
    };
    setActivityLogs(prev => [log, ...prev]);

    if (newTask.assignedMemberId) {
      const notif: NotificationItem = {
        id: 'notif-' + Date.now(),
        userId: newTask.assignedMemberId,
        title: 'New Task Assigned',
        message: `You were assigned: ${newTask.taskCode} - ${newTask.title}`,
        type: 'task_assigned',
        relatedTaskId: newTask.id,
        isRead: false,
        createdAt: new Date().toISOString()
      };
      setNotifications(prev => [notif, ...prev]);
    }
  };

  // Live Task Deletion Handler
  const handleDeleteTask = (taskId: string) => {
    const target = tasks.find(t => t.id === taskId);
    setTasks(prev => prev.filter(t => t.id !== taskId));
    if (selectedTask?.id === taskId) {
      setSelectedTask(null);
    }

    if (target) {
      const log: ActivityLogItem = {
        id: 'act-' + Date.now(),
        userName: currentUser?.fullName || 'User',
        userRole: currentUser?.clubRole || 'Member',
        action: 'TASK_DELETED',
        entityType: 'task',
        entityId: taskId,
        details: { taskCode: target.taskCode, title: target.title },
        createdAt: new Date().toISOString()
      };
      setActivityLogs(prev => [log, ...prev]);
    }
  };

  // Live Task Status Update Handler
  const handleUpdateTaskStatus = (taskId: string, newStatus: TaskStatus) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        return {
          ...t,
          status: newStatus,
          updatedAt: new Date().toISOString()
        };
      }
      return t;
    }));

    if (selectedTask?.id === taskId) {
      setSelectedTask(prev => prev ? { ...prev, status: newStatus, updatedAt: new Date().toISOString() } : null);
    }
  };

  // Reset to Clean Real Data (Wipe sample tasks)
  const handleClearAllSampleTasks = () => {
    if (confirm('Clear all sample tasks? You can create real club tasks anytime.')) {
      setTasks([]);
      localStorage.setItem('tm_hub_tasks', JSON.stringify([]));
      setSelectedTask(null);
    }
  };

  // Submit Evidence Handler
  const handleEvidenceSubmitted = (taskId: string, evidenceData: Omit<TaskEvidence, 'id' | 'createdAt'>) => {
    const newEvidence: TaskEvidence = {
      ...evidenceData,
      id: 'ev-' + Date.now(),
      createdAt: new Date().toISOString()
    };

    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        return {
          ...t,
          status: 'submitted_for_review',
          evidence: [...(t.evidence || []), newEvidence],
          updatedAt: new Date().toISOString()
        };
      }
      return t;
    }));

    if (selectedTask?.id === taskId) {
      setSelectedTask(prev => prev ? {
        ...prev,
        status: 'submitted_for_review',
        evidence: [...(prev.evidence || []), newEvidence]
      } : null);
    }

    const log: ActivityLogItem = {
      id: 'act-' + Date.now(),
      userName: currentUser?.fullName || 'Member',
      userRole: currentUser?.clubRole || 'Member',
      action: 'EVIDENCE_SUBMITTED',
      entityType: 'evidence',
      entityId: taskId,
      details: { taskId, file: newEvidence.fileName || newEvidence.linkUrl },
      createdAt: new Date().toISOString()
    };
    setActivityLogs(prev => [log, ...prev]);

    const notif: NotificationItem = {
      id: 'notif-' + Date.now(),
      userId: 'user-arunima',
      title: 'Evidence Submitted for Review',
      message: `${newEvidence.submitterName} submitted proof for task. Review required.`,
      type: 'evidence_submitted',
      relatedTaskId: taskId,
      isRead: false,
      createdAt: new Date().toISOString()
    };
    setNotifications(prev => [notif, ...prev]);
  };

  // Review Submission Handler
  const handleReviewSubmitted = (
    taskId: string,
    evidenceId: string | undefined,
    action: ReviewAction,
    feedback: string
  ) => {
    const newReview = {
      id: 'rev-' + Date.now(),
      taskId,
      evidenceId,
      reviewerId: currentUser?.id || 'admin',
      reviewerName: currentUser?.fullName || 'Executive Evaluator',
      reviewerRole: currentUser?.clubRole || 'Club Officer',
      action,
      feedback,
      createdAt: new Date().toISOString()
    };

    const newStatus = action === 'approved' ? 'approved' : action === 'rejected' ? 'not_started' : 'changes_requested';

    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        return {
          ...t,
          status: newStatus,
          reviews: [...(t.reviews || []), newReview],
          completedAt: action === 'approved' ? new Date().toISOString() : undefined,
          updatedAt: new Date().toISOString()
        };
      }
      return t;
    }));

    if (selectedTask?.id === taskId) {
      setSelectedTask(prev => prev ? {
        ...prev,
        status: newStatus,
        reviews: [...(prev.reviews || []), newReview]
      } : null);
    }

    const log: ActivityLogItem = {
      id: 'act-' + Date.now(),
      userName: currentUser?.fullName || 'Officer',
      userRole: currentUser?.clubRole || 'Reviewer',
      action: action === 'approved' ? 'TASK_APPROVED' : 'TASK_REJECTED',
      entityType: 'task',
      entityId: taskId,
      details: { taskId, action, feedback },
      createdAt: new Date().toISOString()
    };
    setActivityLogs(prev => [log, ...prev]);

    const targetTask = tasks.find(t => t.id === taskId);
    if (targetTask?.assignedMemberId) {
      const notif: NotificationItem = {
        id: 'notif-' + Date.now(),
        userId: targetTask.assignedMemberId,
        title: action === 'approved' ? 'Task Approved & Verified' : 'Review Feedback Received',
        message: `${newReview.reviewerName}: ${feedback}`,
        type: action === 'approved' ? 'task_approved' : 'evidence_rejected',
        relatedTaskId: taskId,
        isRead: false,
        createdAt: new Date().toISOString()
      };
      setNotifications(prev => [notif, ...prev]);
    }
  };

  // Add Comment Handler
  const handleAddComment = (taskId: string, comment: string) => {
    const newComment = {
      id: 'comm-' + Date.now(),
      taskId,
      authorId: currentUser?.id || 'user',
      authorName: currentUser?.fullName || 'Member',
      authorAvatar: currentUser?.avatarUrl,
      comment,
      createdAt: new Date().toISOString()
    };

    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        return {
          ...t,
          comments: [...(t.comments || []), newComment],
          updatedAt: new Date().toISOString()
        };
      }
      return t;
    }));

    if (selectedTask?.id === taskId) {
      setSelectedTask(prev => prev ? {
        ...prev,
        comments: [...(prev.comments || []), newComment]
      } : null);
    }
  };

  // Member Role & Department Handlers
  const handleUpdateMemberRole = (memberId: string, newRole: UserSystemRole, newClubRole: string) => {
    setMembers(prev => prev.map(m => m.id === memberId ? {
      ...m,
      systemRole: newRole,
      clubRole: newClubRole,
      updatedAt: new Date().toISOString()
    } : m));

    const targetMember = members.find(m => m.id === memberId);
    const log: ActivityLogItem = {
      id: 'act-' + Date.now(),
      userName: currentUser?.fullName || 'Super Admin',
      userRole: 'Super Admin',
      action: 'ROLE_CHANGED',
      entityType: 'member',
      entityId: memberId,
      details: { target: targetMember?.fullName, newRole, newClubRole },
      createdAt: new Date().toISOString()
    };
    setActivityLogs(prev => [log, ...prev]);
  };

  const handleUpdateMemberDepartment = (memberId: string, departmentId: string) => {
    const dept = departments.find(d => d.id === departmentId);
    setMembers(prev => prev.map(m => m.id === memberId ? {
      ...m,
      departmentId,
      departmentName: dept?.name || 'General Membership',
      updatedAt: new Date().toISOString()
    } : m));
  };

  const handleToggleMemberActive = (memberId: string) => {
    setMembers(prev => prev.map(m => m.id === memberId ? {
      ...m,
      isActive: !m.isActive,
      updatedAt: new Date().toISOString()
    } : m));
  };

  // Permissions Matrix Handler
  const handleTogglePermission = (roleId: string, permissionKey: keyof RolePermission['permissions']) => {
    setRolePermissions(prev => prev.map(rp => {
      if (rp.id === roleId) {
        return {
          ...rp,
          permissions: {
            ...rp.permissions,
            [permissionKey]: !rp.permissions[permissionKey]
          }
        };
      }
      return rp;
    }));
  };

  // Notifications Handlers
  const handleMarkNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const handleMarkAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  // Template Instantiation Handler
  const handleUseTemplate = (template: TaskTemplate) => {
    const dept = departments.find(d => d.id === template.departmentId) || departments[0];
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const taskCode = `${dept.slug.toUpperCase().slice(0, 3)}-${randomSuffix}`;

    const newTask: Task = {
      id: 'task-' + Date.now(),
      taskCode,
      title: template.title,
      description: template.description,
      departmentId: dept.id,
      departmentName: dept.name,
      assignedMemberId: currentUser?.id || 'user',
      assignedMemberName: currentUser?.fullName || 'Member',
      assignedMemberEmail: currentUser?.email || 'member@scaler.com',
      priority: template.priority,
      status: 'not_started',
      startDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      acceptanceCriteria: template.acceptanceCriteria,
      proofRequired: template.proofRequired,
      evidence: [],
      reviews: [],
      comments: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setTasks(prev => [newTask, ...prev]);
    setCurrentPage('all-tasks');
  };

  // Meeting Role Signups & Agenda Handlers
  const handleSignupRole = (meetingId: string, roleName: string, speechTitle?: string, pathwayProject?: string) => {
    if (!currentUser) return;
    const newSignup: RoleSignup = {
      id: 'signup-' + Date.now(),
      meetingId,
      memberId: currentUser.id,
      memberName: currentUser.fullName,
      memberEmail: currentUser.email,
      roleName,
      speechTitle,
      pathwayProject,
      createdAt: new Date().toISOString()
    };
    setRoleSignups(prev => [newSignup, ...prev]);

    const notif: NotificationItem = {
      id: 'notif-' + Date.now(),
      userId: currentUser.id,
      title: 'Meeting Role Confirmed',
      message: `You signed up as ${roleName} for the meeting. Check Meeting Roles Handbook for preparation guidelines.`,
      type: 'task_assigned',
      isRead: false,
      createdAt: new Date().toISOString()
    };
    setNotifications(prev => [notif, ...prev]);
  };

  const handleDropRole = (signupId: string) => {
    setRoleSignups(prev => prev.filter(s => s.id !== signupId));
  };

  const handleCreateMeeting = (newMeeting: Omit<Meeting, 'id' | 'createdAt'>) => {
    const m: Meeting = {
      ...newMeeting,
      id: 'meet-' + Date.now(),
      createdAt: new Date().toISOString()
    };
    setMeetings(prev => [m, ...prev]);
  };

  // If unauthenticated, show Login
  if (!currentUser) {
    return (
      <Login 
        onLoginSuccess={handleLoginSuccess} 
        onRequestAccess={handleRequestAccess}
        members={members} 
      />
    );
  }

  const pendingReviewCount = tasks.filter(t => t.status === 'submitted_for_review').length;
  const pendingMembersCount = members.filter(m => m.accessStatus === 'pending').length;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      
      {/* Top Navbar */}
      <Navbar
        currentUser={currentUser}
        onLogout={handleLogout}
        isOnline={isOnline}
        notifications={notifications}
        onMarkNotificationRead={handleMarkNotificationRead}
        onCreateTaskClick={() => setIsCreateTaskOpen(true)}
        onNavigate={handleNavigate}
        currentPage={currentPage}
        isMobileMenuOpen={isMobileMenuOpen}
        onToggleMobileMenu={() => setIsMobileMenuOpen(prev => !prev)}
      />

      {/* Main Body with Sidebar */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        
        {/* Sidebar Navigation (Desktop column & Mobile Slide-Over Drawer) */}
        <Sidebar
          currentPage={currentPage}
          onNavigate={handleNavigate}
          currentUser={currentUser}
          pendingReviewCount={pendingReviewCount}
          pendingMembersCount={pendingMembersCount}
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        />

        {/* Page Content Container */}
        <main className="flex-1 p-3 sm:p-4 md:p-6 min-w-0 max-w-full overflow-y-auto overflow-x-hidden">
          {currentPage === 'dashboard' && (
            <Dashboard
              tasks={tasks}
              departments={departments}
              currentUser={currentUser}
              activityLogs={activityLogs}
              pendingMembersCount={pendingMembersCount}
              onNavigate={handleNavigate}
              onSelectTask={setSelectedTask}
              onCreateTaskClick={() => setIsCreateTaskOpen(true)}
            />
          )}

          {currentPage === 'meeting-agendas' && (
            <MeetingAgendas
              meetings={meetings}
              roleSignups={roleSignups}
              currentUser={currentUser}
              members={members}
              onSignupRole={handleSignupRole}
              onDropRole={handleDropRole}
              onCreateMeeting={handleCreateMeeting}
              onNavigate={handleNavigate}
            />
          )}

          {currentPage === 'all-tasks' && (
            <AllTasks
              tasks={tasks}
              departments={departments}
              currentUser={currentUser}
              onSelectTask={setSelectedTask}
              onCreateTaskClick={() => setIsCreateTaskOpen(true)}
              onSubmitEvidenceClick={setEvidenceTask}
              onDeleteTask={handleDeleteTask}
              onClearAllSampleTasks={handleClearAllSampleTasks}
            />
          )}

          {currentPage === 'my-tasks' && (
            <MyTasks
              tasks={tasks}
              currentUser={currentUser}
              onSelectTask={setSelectedTask}
              onSubmitEvidenceClick={setEvidenceTask}
              onCreateTaskClick={() => setIsCreateTaskOpen(true)}
            />
          )}

          {currentPage === 'review-queue' && (
            <ReviewQueue
              tasks={tasks}
              currentUser={currentUser}
              onReviewSubmitted={handleReviewSubmitted}
              onSelectTask={setSelectedTask}
            />
          )}

          {currentPage === 'evidence-history' && (
            <EvidenceHistory
              tasks={tasks}
              onSelectTask={setSelectedTask}
            />
          )}

          {currentPage === 'team-workspaces' && (
            <TeamWorkspaces
              departments={departments}
              tasks={tasks}
              templates={templates}
              onSelectTask={setSelectedTask}
              onUseTemplate={handleUseTemplate}
            />
          )}

          {currentPage === 'role-resources' && (
            <RoleResources />
          )}

          {currentPage === 'members' && (
            <MembersManagement
              members={members}
              departments={departments}
              tasks={tasks}
              currentUser={currentUser}
              onUpdateMemberRole={handleUpdateMemberRole}
              onUpdateMemberDepartment={handleUpdateMemberDepartment}
              onToggleMemberActive={handleToggleMemberActive}
              onAuthorizeNewEmail={handleAuthorizeNewEmail}
              onApprovePendingMember={handleApprovePendingMember}
              onRejectPendingMember={handleRejectPendingMember}
            />
          )}

          {currentPage === 'roles-permissions' && (
            <RolesPermissions
              rolePermissions={rolePermissions}
              currentUser={currentUser}
              onTogglePermission={handleTogglePermission}
            />
          )}

          {currentPage === 'notifications' && (
            <NotificationsPanel
              notifications={notifications}
              currentUser={currentUser}
              onMarkNotificationRead={handleMarkNotificationRead}
              onMarkAllRead={handleMarkAllNotificationsRead}
              onNavigate={setCurrentPage}
            />
          )}

          {currentPage === 'reports' && (
            <Reports
              tasks={tasks}
              departments={departments}
              members={members}
            />
          )}

          {currentPage === 'activity-log' && (
            <ActivityLog
              activityLogs={activityLogs}
            />
          )}

          {currentPage === 'admin-settings' && (
            <AdminSettings
              currentUser={currentUser}
            />
          )}

          {currentPage === 'user-profile' && (
            <UserProfile
              currentUser={currentUser}
              tasks={tasks}
            />
          )}
        </main>

      </div>

      {/* Official Toastmasters International Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Global Modals */}
      <CreateTaskModal
        isOpen={isCreateTaskOpen}
        onClose={() => setIsCreateTaskOpen(false)}
        departments={departments}
        members={members.filter(m => m.accessStatus !== 'pending')}
        currentUser={currentUser}
        onTaskCreated={handleTaskCreated}
      />

      <TaskDetailsModal
        task={selectedTask}
        onClose={() => setSelectedTask(null)}
        currentUser={currentUser}
        onSubmitEvidenceClick={(t) => {
          setSelectedTask(null);
          setEvidenceTask(t);
        }}
        onReviewClick={(t) => {
          setSelectedTask(null);
          setCurrentPage('review-queue');
        }}
        onAddComment={handleAddComment}
        onDeleteTask={handleDeleteTask}
        onUpdateStatus={handleUpdateTaskStatus}
      />

      <EvidenceUploaderModal
        task={evidenceTask}
        isOpen={!!evidenceTask}
        onClose={() => setEvidenceTask(null)}
        currentUser={currentUser}
        onEvidenceSubmitted={handleEvidenceSubmitted}
      />

    </div>
  );
}
