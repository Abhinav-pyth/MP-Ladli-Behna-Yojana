-- ============================================================
-- SUPABASE DATABASE SETUP
-- ============================================================
-- Run this SQL in your Supabase SQL Editor to create the queries table
-- Go to: Supabase Dashboard > SQL Editor > New Query > Paste this > Run
-- ============================================================

-- Create the queries table
CREATE TABLE IF NOT EXISTS queries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  mobile TEXT NOT NULL,
  district TEXT NOT NULL,
  query TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE queries ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anyone to INSERT (submit queries)
CREATE POLICY "Allow public insert"
  ON queries
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Policy: Allow anyone to SELECT (read queries for admin panel)
-- NOTE: For production, you may want to restrict SELECT to authenticated users only
CREATE POLICY "Allow public select"
  ON queries
  FOR SELECT
  TO anon
  USING (true);

-- Policy: Allow DELETE (for admin to clear queries)
CREATE POLICY "Allow public delete"
  ON queries
  FOR DELETE
  TO anon
  USING (true);

-- Optional: Create an index for faster queries by date
CREATE INDEX IF NOT EXISTS idx_queries_created_at 
  ON queries (created_at DESC);

-- ============================================================
-- VERIFICATION
-- ============================================================
-- After running, verify with:
-- SELECT * FROM queries;
-- You should see an empty table (no rows yet)
-- ============================================================
