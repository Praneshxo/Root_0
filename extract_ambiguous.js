import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function run() {
    console.log('Fetching remaining uncategorized questions...');
    let allQuestions = [];
    let page = 0;
    const pageSize = 1000;

    while (true) {
        const { data, error } = await supabase
            .from('company_topic_questions')
            .select('id, question, topic')
            .eq('content_type', 'Miscellaneous')
            .range(page * pageSize, (page + 1) * pageSize - 1);

        if (error) {
            console.error(error);
            break;
        }

        if (data.length === 0) break;
        allQuestions = allQuestions.concat(data);
        page++;
    }

    console.log(`Fetched ${allQuestions.length} remaining questions.`);

    // Group by topic
    const byTopic = {};
    for (const q of allQuestions) {
        // We can skip HR altogether as per design
        if (q.topic === 'HR') continue;

        if (!byTopic[q.topic]) byTopic[q.topic] = [];
        byTopic[q.topic].push(q);
    }

    // Only create batches for DSA, SQL, Core CS, Aptitude
    let batchCount = 0;
    let markdown = `# Uncategorized Questions to Classify\n\n`;
    markdown += `Please classify the following questions into exactly ONE of the allowed subcategories for and return a JSON list of objects: [{ "id": "<id>", "subcategory": "<subcategory>" }]\n\n`;

    const allowedSubcategories = {
        'DSA': "['Array', 'String', 'Linked List', 'Tree & Graph', 'Dynamic Programming', 'Sorting & Searching', 'Math & Logic', 'Miscellaneous']",
        'SQL': "['Joins', 'Aggregations', 'Subqueries', 'Window Functions', 'Filtering', 'Miscellaneous']",
        'Core CS': "['OOPs', 'DBMS', 'Operating Systems', 'Computer Networks', 'Miscellaneous']",
        'Aptitude': "['Time & Work', 'Speed & Distance', 'Probability', 'Percentages & Ratios', 'Miscellaneous']"
    };

    for (const topic of Object.keys(byTopic)) {
        const questions = byTopic[topic];
        if (questions.length === 0) continue;

        markdown += `\n\n## TOPIC: ${topic}\n`;
        markdown += `**ALLOWED SUBCATEGORIES**: ${allowedSubcategories[topic]}\n\n`;

        // Chunk into batches of 50
        const batchSize = 50;
        for (let i = 0; i < questions.length; i += batchSize) {
            const batch = questions.slice(i, i + batchSize);
            markdown += `\n### Batch ${++batchCount} (${topic})\n\`\`\`json\n[\n`;

            const batchJson = batch.map(q => `  {"id": "${q.id}", "question": ${JSON.stringify(q.question)}}`);
            markdown += batchJson.join(',\n');

            markdown += `\n]\n\`\`\`\n\n`;
        }
    }

    fs.writeFileSync('uncategorized_batches.md', markdown);
    console.log(`\nWrote uncategorized_batches.md with ${batchCount} batches.`);
}

run();
