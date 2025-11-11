import { createClient } from '@supabase/supabase-js';
import { User, Session } from '../types';

// The Supabase URL provided by the user.
const supabaseUrl = process.env.SUPABASE_URL || 'https://bdgkjeyemuaffpkvqiqm.supabase.co';

// IMPORTANT: Use the PUBLIC ANONYMOUS KEY here. The secret key must never be exposed in a browser.
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJkZ2tqZXllbXVhZmZwa3ZxaXFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI3ODYzNDQsImV4cCI6MjA3ODM2MjM0NH0.rnZG7PsotH-aJmJ09MxV2F6Ggd4XFpkdR8gJgv_K_1M';

// Create and export the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Re-export Supabase types for convenience if needed elsewhere, although our custom types are compatible.
export type { User, Session };