-- ==============================================================================
-- TOASTMASTERS TASK HUB - MASTER POSTGRESQL SCHEMA WITH ROW LEVEL SECURITY (RLS)
-- Club: SpeakUp Scaler Toastmasters Club | Tagline: Learn • Speak • Lead
-- Stack: Supabase · PostgreSQL · Google OAuth · Supabase Storage · Supabase Realtime
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUMS
CREATE TYPE user_system_role AS ENUM (
  'super_admin',
  'president',
  'vpe',
  'vpm',
  'vppr',
  'secretary',
  'treasurer',
  'saa',
  'member'
);

CREATE TYPE task_priority AS ENUM ('low', 'medium', 'high', 'urgent');

CREATE TYPE task_status AS ENUM (
  'not_started',
  'in_progress',
  'submitted_for_review',
  'approved',
  'changes_requested',
  'cancelled'
);

CREATE TYPE review_action AS ENUM ('approved', 'rejected', 'changes_requested');

-- 3. DEPARTMENTS / TEAMS TABLE
CREATE TABLE IF NOT EXISTS public.departments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT DEFAULT 'folder',
  leader_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. PROFILES TABLE (Mirrors auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  club_role TEXT NOT NULL DEFAULT 'Club Member',
  system_role user_system_role NOT NULL DEFAULT 'member', -- NEVER admin automatically!
  department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Set leader_id foreign key after profiles table exists
ALTER TABLE public.departments 
  DROP CONSTRAINT IF EXISTS fk_departments_leader,
  ADD CONSTRAINT fk_departments_leader FOREIGN KEY (leader_id) REFERENCES public.profiles(id) ON DELETE SET NULL;

-- 5. ROLES TABLE (Toastmasters Hierarchy)
CREATE TABLE IF NOT EXISTS public.roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  is_officer BOOLEAN NOT NULL DEFAULT false,
  hierarchy_level INT NOT NULL DEFAULT 9, -- 1=Super Admin, 2=President, ..., 9=Member
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 6. PERMISSIONS TABLE
CREATE TABLE IF NOT EXISTS public.permissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  code TEXT NOT NULL UNIQUE, -- e.g. tasks.create, tasks.approve
  category TEXT NOT NULL,    -- 'tasks', 'evidence', 'members', 'roles', 'reports', 'settings'
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 7. ROLE_PERMISSIONS JUNCTION TABLE
CREATE TABLE IF NOT EXISTS public.role_permissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  role_id UUID NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
  permission_id UUID NOT NULL REFERENCES public.permissions(id) ON DELETE CASCADE,
  granted_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  UNIQUE(role_id, permission_id)
);

-- 8. TASKS TABLE
CREATE TABLE IF NOT EXISTS public.tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_code TEXT NOT NULL UNIQUE, -- e.g. YK-01, AV-01, PR-04
  title TEXT NOT NULL,
  description TEXT,
  department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,
  department_name TEXT NOT NULL,
  assigned_officer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  assigned_officer_name TEXT,
  assigned_member_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  assigned_member_name TEXT NOT NULL,
  assigned_member_email TEXT NOT NULL,
  priority task_priority NOT NULL DEFAULT 'medium',
  status task_status NOT NULL DEFAULT 'not_started',
  start_date DATE DEFAULT CURRENT_DATE,
  due_date DATE,
  acceptance_criteria TEXT,
  proof_required BOOLEAN NOT NULL DEFAULT true, -- CORE PRINCIPLE: Proof-based completion
  additional_instructions TEXT,
  meeting_name TEXT DEFAULT 'General Club Operations',
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  completed_at TIMESTAMPTZ
);

-- 9. TASK_EVIDENCE TABLE (Submissions History)
CREATE TABLE IF NOT EXISTS public.task_evidence (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  submitted_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  submitter_name TEXT NOT NULL,
  submitter_email TEXT NOT NULL,
  work_description TEXT NOT NULL,
  file_url TEXT,
  file_type TEXT, -- 'image/png', 'image/jpeg', 'application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'url'
  file_name TEXT,
  link_url TEXT, -- Google Drive, Instagram post, YouTube, etc.
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 10. TASK_REVIEWS TABLE (Approvals / Rejections)
CREATE TABLE IF NOT EXISTS public.task_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  evidence_id UUID REFERENCES public.task_evidence(id) ON DELETE SET NULL,
  reviewer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  reviewer_name TEXT NOT NULL,
  reviewer_role TEXT NOT NULL,
  action review_action NOT NULL,
  feedback TEXT NOT NULL, -- MANDATORY feedback when rejecting or requesting changes
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 11. TASK_COMMENTS TABLE
CREATE TABLE IF NOT EXISTS public.task_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  author_avatar TEXT,
  comment TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 12. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL, -- 'task_assigned', 'evidence_submitted', 'task_approved', 'evidence_rejected', 'deadline_approaching'
  related_task_id UUID REFERENCES public.tasks(id) ON DELETE CASCADE,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 13. ACTIVITY_LOGS TABLE (Immutable Audit Trail)
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  user_name TEXT NOT NULL,
  user_role TEXT NOT NULL,
  action TEXT NOT NULL, -- 'TASK_CREATED', 'TASK_ASSIGNED', 'EVIDENCE_SUBMITTED', 'TASK_APPROVED', 'TASK_REJECTED', 'ROLE_CHANGED'
  entity_type TEXT NOT NULL, -- 'task', 'evidence', 'member', 'role', 'system'
  entity_id UUID,
  details JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 14. TASK_TEMPLATES TABLE (Department Quick Tasks)
CREATE TABLE IF NOT EXISTS public.task_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  department_id UUID REFERENCES public.departments(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  priority task_priority NOT NULL DEFAULT 'medium',
  acceptance_criteria TEXT,
  proof_required BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- 15. INDEXES FOR HIGH-PERFORMANCE QUERIES
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_tasks_status ON public.tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON public.tasks(priority);
CREATE INDEX IF NOT EXISTS idx_tasks_assigned_member ON public.tasks(assigned_member_id);
CREATE INDEX IF NOT EXISTS idx_tasks_department ON public.tasks(department_id);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON public.tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_evidence_task_id ON public.task_evidence(task_id);
CREATE INDEX IF NOT EXISTS idx_reviews_task_id ON public.task_reviews(task_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON public.activity_logs(created_at DESC);

-- ==============================================================================
-- 16. ROW LEVEL SECURITY (RLS) POLICIES
-- Core Principle: Public registration does NOT mean public access to club records.
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_templates ENABLE ROW LEVEL SECURITY;

-- Helper Function: Check if user is Super Admin
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND system_role = 'super_admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper Function: Check if user is Officer or Admin
CREATE OR REPLACE FUNCTION public.is_officer_or_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND system_role IN ('super_admin', 'president', 'vpe', 'vpm', 'vppr', 'secretary', 'treasurer', 'saa')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- PROFILES POLICIES
CREATE POLICY "Authenticated members can view club profiles"
  ON public.profiles FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can update their own profile details"
  ON public.profiles FOR UPDATE TO authenticated
  USING (id = auth.uid())
  WITH CHECK (
    id = auth.uid() AND 
    system_role = (SELECT system_role FROM public.profiles WHERE id = auth.uid()) -- Prevents self-promotion
  );

CREATE POLICY "Super Admins can update any profile role and status"
  ON public.profiles FOR UPDATE TO authenticated
  USING (public.is_super_admin());

-- TASKS POLICIES
CREATE POLICY "Authenticated users can view tasks"
  ON public.tasks FOR SELECT TO authenticated USING (true);

CREATE POLICY "Officers and Admins can create tasks"
  ON public.tasks FOR INSERT TO authenticated
  WITH CHECK (public.is_officer_or_admin());

CREATE POLICY "Officers and Admins can update any task"
  ON public.tasks FOR UPDATE TO authenticated
  USING (public.is_officer_or_admin());

CREATE POLICY "Assigned members can update their own task status"
  ON public.tasks FOR UPDATE TO authenticated
  USING (assigned_member_id = auth.uid());

CREATE POLICY "Only Super Admins and President can delete tasks"
  ON public.tasks FOR DELETE TO authenticated
  USING (public.is_super_admin() OR EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND system_role = 'president'
  ));

-- EVIDENCE POLICIES
CREATE POLICY "Authenticated users can view task evidence"
  ON public.task_evidence FOR SELECT TO authenticated USING (true);

CREATE POLICY "Assigned members and officers can submit evidence"
  ON public.task_evidence FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() = submitted_by OR public.is_officer_or_admin()
  );

-- REVIEWS POLICIES
CREATE POLICY "Authenticated users can view task reviews"
  ON public.task_reviews FOR SELECT TO authenticated USING (true);

CREATE POLICY "Officers and Admins can review tasks (NO SELF-APPROVAL)"
  ON public.task_reviews FOR INSERT TO authenticated
  WITH CHECK (
    public.is_officer_or_admin() AND
    -- SECURITY CONSTRAINT: Cannot approve own submission!
    NOT EXISTS (
      SELECT 1 FROM public.tasks 
      WHERE id = task_id AND assigned_member_id = auth.uid()
    )
  );

-- NOTIFICATIONS POLICIES
CREATE POLICY "Users can view and update their own notifications"
  ON public.notifications FOR ALL TO authenticated
  USING (user_id = auth.uid());

-- ACTIVITY LOGS POLICIES (Immutable: SELECT and INSERT only)
CREATE POLICY "Authenticated users can view audit logs"
  ON public.activity_logs FOR SELECT TO authenticated USING (true);

CREATE POLICY "System and users can insert audit logs"
  ON public.activity_logs FOR INSERT TO authenticated WITH CHECK (true);

-- DEPARTMENTS, ROLES, TEMPLATES POLICIES
CREATE POLICY "Authenticated users can view departments and roles"
  ON public.departments FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can view roles and permissions"
  ON public.roles FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can view permissions"
  ON public.permissions FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can view templates"
  ON public.task_templates FOR SELECT TO authenticated USING (true);

-- ==============================================================================
-- 17. AUTOMATIC PROFILE CREATION TRIGGER (DEFAULT = MEMBER ONLY)
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    email,
    full_name,
    avatar_url,
    club_role,
    system_role,
    is_active
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture', ''),
    'Club Member',
    'member', -- NEVER admin by default!
    true
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- 18. SUPABASE STORAGE BUCKET CONFIGURATION (task-evidence)
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('task-evidence', 'task-evidence', false)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS: Authenticated users can read evidence
CREATE POLICY "Authenticated users can view task evidence assets"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'task-evidence');

-- Storage RLS: Authenticated users can upload evidence
CREATE POLICY "Authenticated users can upload task evidence assets"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'task-evidence');

-- ==============================================================================
-- 19. ENABLE SUPABASE REALTIME REPLICATION
-- ==============================================================================
ALTER PUBLICATION supabase_realtime ADD TABLE public.tasks;
ALTER PUBLICATION supabase_realtime ADD TABLE public.task_evidence;
ALTER PUBLICATION supabase_realtime ADD TABLE public.task_reviews;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.activity_logs;
