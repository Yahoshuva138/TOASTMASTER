# 🏆 TOASTMASTERS TASK HUB
> **SpeakUp Scaler Toastmasters Club** — *Learn • Speak • Lead*

[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC.svg)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green.svg)](https://supabase.com/)

A centralized, enterprise-grade task management and proof-verification platform built for Toastmasters leadership teams and members.

---

## 🎯 Core Principles

1. **Proof-Based Completion**: A task is never marked completed simply because a checkbox is clicked. Every milestone requires attached proof (video frames, documents, or links) and reviewer verification.
2. **Accountability & Separation of Duties**: Toastmasters bylaws prohibit self-approval of personal tasks.
3. **Role-Based Access Control (RBAC)**: Supports 9 Toastmasters leadership roles with fine-grained server-side Row Level Security (RLS) in PostgreSQL.
4. **Public Google Registration with Member Defaulting**: Public Google OAuth is enabled; new users strictly receive the `Member` role and can never elevate their own privileges.

---

## 🏛️ Application Architecture

```
                                 TOASTMASTERS TASK HUB
                                          │
       ┌──────────────────────────────────┼──────────────────────────────────┐
       ▼                                  ▼                                  ▼
[AUTHENTICATION]                  [RBAC & PERMISSIONS]              [EVIDENCE WORKFLOW]
• Google OAuth                    • 9 Leadership Roles              • Mandatory Evidence
• Public Self-Registration        • RLS PostgreSQL Policies         • No Self-Approval
• Default "Member" Role           • Super Admin Bootstrap           • Image / PDF / Link
• Zero Auto-Admin Escalation      • Permissions Matrix              • Constructive Feedback
```

---

## 🚀 Features & Modules

- **Centralized Dashboard**: Live statistics (Total, In Progress, Under Review, Verified, Overdue, % Completion), department-wise progress bars, upcoming deadlines, and activity logs.
- **Task Management**:
  - **Kanban Board** (Column-based workflow)
  - **Table View** (Sortable enterprise grid with direct actions)
  - **Timeline / Calendar View** (Deadline visualizer)
- **6 Toastmasters Committee Workspaces**:
  - Executive Committee
  - Education & Meeting Roles
  - Membership
  - Public Relations & Media
  - Operations & Logistics
  - Finance & Records
- **Review Queue**: Reviewer portal with Approve/Reject/Request Changes, evidence inspection, and feedback validation (self-approval strictly blocked).
- **Evidence Vault**: Historical archive of all submitted JPG/PNG frames, documents, and external proof links with full search and inspection previews.
- **Member Management**: Admin page displaying member profiles, roles, departments, account statuses, assigned task counts, and activate/deactivate toggles.
- **RBAC Matrix**: 9 leadership roles with 12 granular toggleable permissions.
- **Reports & CSV Export**: Real-time performance analytics and 1-click CSV export of all club records.
- **System Audit Trail**: Immutable audit trail of all task creations, updates, approvals, and role changes.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Lucide React
- **Backend & Database**: Supabase, PostgreSQL, Supabase Auth (Google OAuth), Supabase Storage
- **Security**: PostgreSQL Row Level Security (RLS), Server-side authorization functions

---

## 📦 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/Yahoshuva138/TOASTMASTER.git
cd TOASTMASTER
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Create `.env` using `.env.example`:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Run development server
```bash
npm run dev
```

### 5. Production Build
```bash
npm run build
npm run preview
```

---

## 🗄️ Database Setup (Supabase)

1. Open your **Supabase Project SQL Editor**.
2. Run `supabase/schema.sql` to initialize all tables, RLS policies, triggers, and bucket configurations.
3. After signing in once with Google, run `supabase/admin_bootstrap.sql` to assign Super Admin status to the project owner.

---

## 📄 License
This project is open-source under the MIT License.
