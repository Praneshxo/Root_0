import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function run() {
    // Check a sample of DSA questions to see if content_type was updated
    const { data, error } = await supabase
        .from('company_topic_questions')
        .select('id, question, topic, content_type')
        .eq('topic', 'DSA')
        .limit(5);

    if (error) {
        console.error('Read error:', error);
        return;
    }
    console.log('Sample DSA questions with content_type:');
    data.forEach(q => console.log(`  [${q.content_type}] ${q.question?.substring(0, 60)}`));

    // Try a single manual update to check if writes work
    const testId = data[0]?.id;
    if (testId) {
        const existing = data[0].content_type;
        const { error: updateError } = await supabase
            .from('company_topic_questions')
            .update({ content_type: existing }) // same value, just testing write perms
            .eq('id', testId);

        if (updateError) {
            console.error('\n❌ UPDATE FAILED:', updateError.message);
            console.log('→ You need to allow UPDATE via RLS or use the service_role key');
        } else {
            console.log('\n✅ Write permission confirmed — updates should be working');
        }
    }
}

run();
