
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ptgbygvabrjstiafshtj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB0Z2J5Z3ZhYnJqc3RpYWZzaHRqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcwMjM5MDcsImV4cCI6MjA4MjU5OTkwN30.NPjAOqAX4Ry9Du3Qo1q3moLKEpuSWpmyi8croFgiuAc';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
