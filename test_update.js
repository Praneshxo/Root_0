import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function run() {
  const { data: fetch, error: fetchErr } = await supabase
      .from('company_topic_questions')
      .select('id, question, topic, content_type')
      .limit(1);
    
  console.log("Before:", fetch);

  if (fetch && fetch.length > 0) {
    const { data, error } = await supabase
      .from('company_topic_questions')
      .update({ content_type: 'Test Subcategory' })
      .eq('id', fetch[0].id)
      .select();

    console.log("Update output:", data);
    console.log("Error:", error);
  }
}
run();
