// ==============================================================================
// TOASTMASTERS TASK HUB - SUPABASE CLIENT & REALTIME CLOUD INTEGRATION
// Features: Environment variables (.env) + In-App Live Credentials Override,
// Row Level Security (RLS) enforcement, Google OAuth, and Meeting Agendas sync.
// ==============================================================================

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Meeting, RoleSignup, Profile, Task } from '../types/database.types';

// Retrieve saved configuration from localStorage or Vite environment variables
export const getActiveSupabaseUrl = (): string => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('tm_supabase_url');
    if (saved && saved.trim()) return saved.trim();
  }
  return import.meta.env.VITE_SUPABASE_URL || 'https://demo-toastmasters-hub.supabase.co';
};

export const getActiveSupabaseAnonKey = (): string => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('tm_supabase_anon_key');
    if (saved && saved.trim()) return saved.trim();
  }
  return import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.demo-key';
};

export const isSupabaseConfigured = (): boolean => {
  const url = getActiveSupabaseUrl();
  const key = getActiveSupabaseAnonKey();
  return (
    Boolean(url) &&
    Boolean(key) &&
    !url.includes('demo-toastmasters-hub') &&
    url.startsWith('https://') &&
    key.length > 20
  );
};

// Initialize Singleton Client
export let supabase: SupabaseClient = createClient(
  getActiveSupabaseUrl(),
  getActiveSupabaseAnonKey(),
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
  }
);

/**
 * Re-initialize client when user updates credentials in Admin Settings
 */
export const updateSupabaseCredentials = (url: string, anonKey: string) => {
  localStorage.setItem('tm_supabase_url', url.trim());
  localStorage.setItem('tm_supabase_anon_key', anonKey.trim());

  supabase = createClient(url.trim(), anonKey.trim(), {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
  });
};

export const clearSupabaseCredentials = () => {
  localStorage.removeItem('tm_supabase_url');
  localStorage.removeItem('tm_supabase_anon_key');
};

/**
 * Test Live Database Connection
 */
export const testSupabaseConnection = async (): Promise<{ success: boolean; message: string }> => {
  if (!isSupabaseConfigured()) {
    return { 
      success: false, 
      message: 'Supabase URL and Anon Key must be configured.' 
    };
  }

  try {
    // Try pinging the database with a lightweight query
    const { error } = await supabase.from('meetings').select('id').limit(1);
    if (error && error.code !== 'PGRST116') {
      // If table doesn't exist yet, it's connected to Supabase but needs schema
      if (error.message.includes('relation') || error.message.includes('does not exist')) {
        return {
          success: true,
          message: 'Connected to Supabase! (Database tables need schema initialization via schema.sql).'
        };
      }
      return { success: false, message: error.message };
    }

    return { 
      success: true, 
      message: 'Successfully connected to live Supabase PostgreSQL database!' 
    };
  } catch (err: any) {
    return { success: false, message: err?.message || 'Failed to connect to Supabase.' };
  }
};

/**
 * Sign in using Google OAuth
 */
export const signInWithGoogle = async () => {
  if (!isSupabaseConfigured()) {
    return { error: null, isMock: true };
  }

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  });

  return { data, error, isMock: false };
};

/**
 * Sign out user
 */
export const signOut = async () => {
  if (isSupabaseConfigured()) {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.warn('Sign out caught:', e);
    }
  }
};
