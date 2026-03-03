import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: './.env' });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function run() {
  const { data, error } = await supabase
    .from('company_topic_questions')
    .select('*')
    .eq('topic', 'Aptitude')
    .limit(1);

  if (error) console.error(error);
  else console.log(JSON.stringify(data[0].content_data, null, 2));
}

run();
