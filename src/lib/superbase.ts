import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fescyshiqsvvnrnsrqwg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZlc2N5c2hpcXN2dm5ybnNycXdnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE4ODY3MzAsImV4cCI6MjA2NzQ2MjczMH0.BZuUA8-vA6pyZkBfKmW_VfkQbphuV6olCa128x82tAo';

export const supabase = createClient(supabaseUrl, supabaseKey);
