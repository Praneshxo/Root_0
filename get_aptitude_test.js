const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: './.env' });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function run() {
  const { data, error } = await supabase
    .from('company_topic_questions')
    .select('content_data')
    .eq('topic', 'Aptitude')
    .limit(10);

  if (error) console.error(error);
  else console.log(JSON.stringify(data, null, 2));
}

run();
