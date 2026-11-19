// ==============================================================================
// TOASTMASTERS TASK HUB - SUPABASE CLIENT & AUTHENTICATION HELPER
// ==============================================================================

import { createClient } from '@supabase/supabase-js';

// Environment variables or fallback demo credentials
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://demo-toastmasters-hub.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.demo-key';

export const isSupabaseConfigured = () => {
  return (
    import.meta.env.VITE_SUPABASE_URL !== undefined &&
    import.meta.env.VITE_SUPABASE_ANON_KEY !== undefined &&
    import.meta.env.VITE_SUPABASE_URL !== '' &&
    !import.meta.env.VITE_SUPABASE_URL.includes('demo-toastmasters-hub')
  );
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
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

/**
 * Sign in using Google OAuth (Public Google sign-in allowed; new users default to Member role)
 */
export const signInWithGoogle = async () => {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase credentials not configured in .env. Using client-side Google profile simulation.');
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
    await supabase.auth.signOut();
  }
};
