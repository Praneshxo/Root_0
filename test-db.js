import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function test() {
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  // We can't easily get the user if we don't have a session, let's login or bypass RLS if possible.
  // Actually we have the service role key? Let's check environment vars.
}
test();
