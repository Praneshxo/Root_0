import fs from 'fs';
import path from 'path';

const csvPath = path.join(process.cwd(), 'public/hr_contacts.csv');
const sqlPath = path.join(process.cwd(), 'hr_contacts_setup.sql');

const csvContent = fs.readFileSync(csvPath, 'utf8');
const lines = csvContent.split('\n').filter(line => line.trim() !== '');

// Skip header
const header = lines.shift();

let sql = `
-- Create hr_contacts table
CREATE TABLE IF NOT EXISTS public.hr_contacts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT,
    title TEXT,
    company TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Set up Row Level Security
ALTER TABLE public.hr_contacts ENABLE ROW LEVEL SECURITY;

-- Allow read access for authenticated users
CREATE POLICY "Allow read access for authenticated users on hr_contacts"
    ON public.hr_contacts
    FOR SELECT
    TO authenticated
    USING (true);

-- Clear existing data (optional, but good for idempotency)
TRUNCATE TABLE public.hr_contacts;

-- Insert data
`;

// Helper to escape single quotes in SQL
const escapeSql = (str) => {
    if (!str) return 'null';
    return `'${str.replace(/'/g, "''")}'`;
}

let values = [];

for (const line of lines) {
    let parsed = [];
    let currentPart = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            parsed.push(currentPart);
            currentPart = '';
        } else {
            currentPart += char;
        }
    }
    parsed.push(currentPart);

    if (parsed.length >= 4) {
        const name = escapeSql(parsed[0].trim());
        const email = escapeSql(parsed[1].trim());
        const title = escapeSql(parsed[2].trim());
        const company = escapeSql(parsed[3].trim());

        values.push(`(${name}, ${email}, ${title}, ${company})`);
    } else {
        console.warn('Skipping malformed line:', line);
    }
}

// Batch inserts
const batchSize = 100;
for (let i = 0; i < values.length; i += batchSize) {
    const batch = values.slice(i, i + batchSize);
    sql += `INSERT INTO public.hr_contacts (name, email, title, company) VALUES\n${batch.join(',\n')};\n\n`;
}

fs.writeFileSync(sqlPath, sql);
console.log('SQL script generated at:', sqlPath);
console.log('Total records:', values.length);
