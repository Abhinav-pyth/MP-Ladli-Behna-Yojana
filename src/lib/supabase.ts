import { createClient, SupabaseClient } from '@supabase/supabase-js';

// ============================================================
// SUPABASE CONFIGURATION (Lazy Initialization)
// ============================================================
// IMPORTANT: Vite ONLY exposes env variables prefixed with "VITE_"
// If you're using Vercel, rename your env vars to:
//   VITE_SUPABASE_URL
//   VITE_SUPABASE_PUBLISHABLE_KEY
// ============================================================

let supabaseInstance: SupabaseClient | null = null;
let configChecked = false;
let isConfigured = false;

function getSupabaseUrl(): string {
  return (
    import.meta.env.VITE_SUPABASE_URL ||
    import.meta.env.NEXT_PUBLIC_SUPABASE_URL ||
    ''
  );
}

function getSupabaseKey(): string {
  return (
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
    import.meta.env.VITE_SUPABASE_ANON_KEY ||
    import.meta.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    ''
  );
}

// Lazy getter — only creates client when actually needed
export const getSupabase = (): SupabaseClient | null => {
  if (!configChecked) {
    const url = getSupabaseUrl();
    const key = getSupabaseKey();
    isConfigured = Boolean(url && key);

    if (isConfigured) {
      try {
        supabaseInstance = createClient(url, key);
      } catch (err) {
        console.error('Failed to create Supabase client:', err);
        supabaseInstance = null;
        isConfigured = false;
      }
    }
    configChecked = true;
  }
  return supabaseInstance;
};

// Check if Supabase is properly configured
export const isSupabaseConfigured = (): boolean => {
  getSupabase(); // trigger initialization
  return isConfigured;
};

// Table name for queries
export const QUERIES_TABLE = 'queries';
