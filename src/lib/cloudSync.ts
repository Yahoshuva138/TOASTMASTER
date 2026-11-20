// ==============================================================================
// TOASTMASTERS TASK HUB - REALTIME CLOUD SYNCHRONIZATION WITH SUPABASE
// Handles real-time member access requests, approvals, meeting agendas, and roles.
// ==============================================================================

import { supabase, isSupabaseConfigured } from './supabaseClient';
import { Profile, UserSystemRole, Meeting, RoleSignup } from '../types/database.types';

export const getSystemRoleFromTitle = (title: string = ''): UserSystemRole => {
  const t = title.toLowerCase();
  if (t.includes('super admin')) return 'super_admin';
  if (t.includes('president')) return 'president';
  if (t.includes('education') || t.includes('vpe')) return 'vpe';
  if (t.includes('membership') || t.includes('vpm')) return 'vpm';
  if (t.includes('public relations') || t.includes('vppr') || t.includes('pr')) return 'vppr';
  if (t.includes('secretary')) return 'secretary';
  if (t.includes('treasurer')) return 'treasurer';
  if (t.includes('sergeant') || t.includes('saa')) return 'saa';
  return 'member';
};

/**
 * 1. Submit a new Member Access Request to Supabase Cloud
 */
export const syncAccessRequestToCloud = async (pendingProfile: Profile): Promise<boolean> => {
  if (!isSupabaseConfigured()) return false;

  try {
    const cleanEmail = pendingProfile.email.toLowerCase().trim();

    // Try inserting/updating into the 'members' table
    const { error: membersError } = await supabase
      .from('members')
      .upsert({
        full_name: pendingProfile.fullName,
        email: cleanEmail,
        role_title: 'Pending Role Assignment'
      }, { onConflict: 'email' });

    if (!membersError) return true;

    // Fallback: try 'profiles' table if schema.sql was used
    await supabase
      .from('profiles')
      .upsert({
        email: cleanEmail,
        full_name: pendingProfile.fullName,
        club_role: 'Pending Role Assignment',
        system_role: 'member',
        is_active: false
      }, { onConflict: 'email' });

    return true;
  } catch (err) {
    console.warn('Cloud sync error for access request:', err);
    return false;
  }
};

/**
 * 2. Fetch all Members & Pending Requests from Supabase Cloud
 */
export const fetchCloudMembers = async (): Promise<Profile[]> => {
  if (!isSupabaseConfigured()) return [];

  try {
    const { data, error } = await supabase
      .from('members')
      .select('*')
      .order('joined_at', { ascending: false });

    if (!error && data && data.length > 0) {
      return data.map((cm: any) => {
        const isPending = !cm.role_title || 
          cm.role_title === 'Pending Role Assignment' || 
          cm.role_title.toLowerCase() === 'pending';

        return {
          id: cm.id || `cm-${cm.email}`,
          email: cm.email,
          fullName: cm.full_name || cm.email.split('@')[0].toUpperCase(),
          clubRole: isPending ? 'Pending Role Assignment' : cm.role_title,
          systemRole: getSystemRoleFromTitle(cm.role_title),
          departmentName: 'Club Roster',
          isActive: !isPending,
          accessStatus: isPending ? 'pending' : 'approved',
          createdAt: cm.joined_at || new Date().toISOString(),
          updatedAt: new Date().toISOString()
        } as Profile;
      });
    }

    // Fallback to 'profiles' table
    const { data: profData, error: profErr } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (!profErr && profData && profData.length > 0) {
      return profData.map((p: any) => ({
        id: p.id,
        email: p.email,
        fullName: p.full_name,
        avatarUrl: p.avatar_url,
        clubRole: p.club_role || 'Club Member',
        systemRole: p.system_role || 'member',
        departmentId: p.department_id,
        isActive: p.is_active,
        accessStatus: p.is_active ? 'approved' : 'pending',
        createdAt: p.created_at,
        updatedAt: p.updated_at
      } as Profile));
    }

    return [];
  } catch (err) {
    console.warn('Failed to fetch cloud members:', err);
    return [];
  }
};

/**
 * 3. Super Admin Grants Access and Assigns Role in Cloud
 */
export const grantCloudMemberAccess = async (
  email: string, 
  clubRole: string, 
  fullName?: string
): Promise<boolean> => {
  if (!isSupabaseConfigured()) return false;

  try {
    const cleanEmail = email.toLowerCase().trim();

    // Update in 'members' table
    const { error: membersErr } = await supabase
      .from('members')
      .update({
        role_title: clubRole,
        ...(fullName ? { full_name: fullName } : {})
      })
      .eq('email', cleanEmail);

    if (!membersErr) return true;

    // Fallback: update in 'profiles' table
    await supabase
      .from('profiles')
      .update({
        club_role: clubRole,
        system_role: getSystemRoleFromTitle(clubRole),
        is_active: true
      })
      .eq('email', cleanEmail);

    return true;
  } catch (err) {
    console.warn('Failed to grant cloud member access:', err);
    return false;
  }
};

/**
 * 4. Check if a specific email has been approved in Cloud
 */
export const checkCloudApprovalStatus = async (email: string): Promise<{ approved: boolean; role?: string; profile?: Partial<Profile> }> => {
  if (!isSupabaseConfigured()) return { approved: false };

  try {
    const cleanEmail = email.toLowerCase().trim();

    // 1. Try 'members' table
    const { data: mData } = await supabase
      .from('members')
      .select('*')
      .eq('email', cleanEmail)
      .maybeSingle();

    if (mData && mData.role_title && mData.role_title !== 'Pending Role Assignment' && mData.role_title.toLowerCase() !== 'pending') {
      return {
        approved: true,
        role: mData.role_title,
        profile: {
          id: mData.id,
          email: cleanEmail,
          fullName: mData.full_name,
          clubRole: mData.role_title,
          systemRole: getSystemRoleFromTitle(mData.role_title),
          isActive: true,
          accessStatus: 'approved'
        }
      };
    }

    // 2. Try 'profiles' table
    const { data: pData } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', cleanEmail)
      .maybeSingle();

    if (pData && pData.is_active && pData.club_role !== 'Pending Role Assignment') {
      return {
        approved: true,
        role: pData.club_role,
        profile: {
          id: pData.id,
          email: cleanEmail,
          fullName: pData.full_name,
          avatarUrl: pData.avatar_url,
          clubRole: pData.club_role,
          systemRole: pData.system_role || 'member',
          isActive: true,
          accessStatus: 'approved'
        }
      };
    }

    return { approved: false };
  } catch (err) {
    console.warn('Approval check failed:', err);
    return { approved: false };
  }
};

/**
 * 5. Delete a Member completely from Cloud Supabase
 */
export const deleteCloudMember = async (email: string): Promise<boolean> => {
  if (!isSupabaseConfigured()) return false;

  try {
    const cleanEmail = email.toLowerCase().trim();
    await supabase.from('members').delete().eq('email', cleanEmail);
    await supabase.from('profiles').delete().eq('email', cleanEmail);
    return true;
  } catch (err) {
    console.warn('Failed to delete cloud member:', err);
    return false;
  }
};
