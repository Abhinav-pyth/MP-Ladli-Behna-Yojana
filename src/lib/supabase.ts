import { createClient } from '@supabase/supabase-js';

// ============================================================
// SUPABASE CONFIGURATION
// ============================================================
// To set up:
// 1. Go to https://supabase.com and create a free account
// 2. Create a new project
// 3. Go to Project Settings > API
// 4. Copy your "Project URL" and "anon public" key
// 5. Paste them below (or use environment variables)
// 6. Run the SQL in setup.sql to create the table
// ============================================================

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL_HERE';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY_HERE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return supabaseUrl !== 'YOUR_SUPABASE_URL_HERE' && 
         supabaseAnonKey !== 'YOUR_SUPABASE_ANON_KEY_HERE';
};

// Table name for queries
export const QUERIES_TABLE = 'queries';
