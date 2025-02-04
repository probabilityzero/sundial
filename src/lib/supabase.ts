import { createClient } from '@supabase/supabase-js';

// For development, we'll use dummy values since we're not using Supabase yet
const supabaseUrl = 'https://example.com';
const supabaseAnonKey = 'dummy-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
