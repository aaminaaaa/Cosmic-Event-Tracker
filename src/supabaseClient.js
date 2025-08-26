import { createClient } from '@supabase/supabase-js';

// Load keys from environment variables (Make sure your .env.local file has these!)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create the Supabase client instance
export const supabase = createClient(supabaseUrl, supabaseAnonKey);