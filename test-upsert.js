import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function test() {
    console.log("Testing user_question_tracking upsert anonymously (may hit RLS, but we'll see the error)...");

    // Try to insert a dummy record
    const { data, error } = await supabase.from('user_question_tracking').upsert({
        user_id: '00000000-0000-0000-0000-000000000000',
        question_id: 'dummy-question',
        topic: 'dsa',
        domain_page: true,
        revision: false
    }, { onConflict: 'user_id,question_id' });

    console.log("Upsert result:", error ? error.message : "Success");
}
test();
