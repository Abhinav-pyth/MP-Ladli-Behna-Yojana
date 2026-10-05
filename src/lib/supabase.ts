import { createClient } from '@supabase/supabase-js';

// ============================================================
// SUPABASE CONFIGURATION
// ============================================================
// Supports BOTH Vite (VITE_*) and Next.js (NEXT_PUBLIC_*) env prefixes
// This way you don't need to rename your Vercel environment variables.
// ============================================================

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  import.meta.env.NEXT_PUBLIC_SUPABASE_URL ||
  '';

const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Check if Supabase is properly configured
export const isSupabaseConfigured = (): boolean => {
  return Boolean(supabaseUrl && supabaseAnonKey);
};

// Table name for queries
export const QUERIES_TABLE = 'queries';
