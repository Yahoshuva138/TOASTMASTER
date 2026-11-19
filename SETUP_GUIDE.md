# Toastmasters Task Hub — Supabase & Google OAuth Setup Guide

## Architecture Summary
- **Frontend:** React 18 · TypeScript · Vite · Tailwind CSS
- **Backend:** Supabase · PostgreSQL · Realtime WebSockets
- **Authentication:** Public Google OAuth 2.0 (Strict RBAC: Members by default, Super Admin bootstrap)

---

## Step 1: Create Supabase Project
1. Log in to [https://supabase.com](https://supabase.com) and click **"New Project"**.
2. Name the project `toastmasters-task-hub` and set your database password.
3. Once provisioned, navigate to **Project Settings → API** and copy:
   - **Project URL** (`VITE_SUPABASE_URL`)
   - **anon / public key** (`VITE_SUPABASE_ANON_KEY`)

---

## Step 2: Configure Google OAuth in Google Cloud & Supabase
1. Open [Google Cloud Console](https://console.cloud.google.com/apis/credentials).
2. Create an **OAuth 2.0 Client ID** (Web Application).
3. Add Authorized Redirect URI from Supabase:
   `https://<your-supabase-project-id>.supabase.co/auth/v1/callback`
4. Copy your **Client ID** and **Client Secret**.
5. In Supabase Dashboard, go to **Authentication → Providers → Google**:
   - Enable Google provider
   - Paste Client ID and Client Secret
   - Save changes.

---

## Step 3: Run Database Schema & RLS Policies
1. In the Supabase Dashboard, click **SQL Editor**.
2. Open `supabase/schema.sql` and run the entire script.
3. This creates:
   - `profiles` table with automatic `member` assignment trigger.
   - `tasks` table with `proof_required` constraint.
   - `evidence` table for proof citations.
   - Complete Row Level Security (RLS) policies.
   - Realtime publication for instant cross-device updates.

---

## Step 4: Bootstrap First Super Admin
1. Sign in once using your Google account (`yahoshuva.kesaboyina@scaler.com`).
2. Run `supabase/admin_bootstrap.sql` in the Supabase SQL Editor:
   ```sql
   UPDATE public.profiles
   SET system_role = 'super_admin', club_role = 'Secretary & VPPR'
   WHERE email = 'yahoshuva.kesaboyina@scaler.com';
   ```
3. Your account is now elevated to Super Admin with full RBAC control!

---

## Step 5: Run the Frontend
```bash
npm install
npm run dev
```
Open `http://localhost:5173` to experience live collaborative Toastmasters task management.
