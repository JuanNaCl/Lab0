import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "URL";
const supabaseAnonKey = "ANON";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
;