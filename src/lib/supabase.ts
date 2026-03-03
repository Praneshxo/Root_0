import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  companies: {
    id: string;
    name: string;
    logo_url: string | null;
    category: 'Service' | 'Product' | 'Startup';
    description: string | null;
    selection_process: string | null;
    syllabus: string | null;
    created_at: string;
  };
  questions: {
    id: string;
    title: string;
    category: 'DSA' | 'SQL' | 'Aptitude' | 'Core' | 'HR' | 'Technical' | 'Managerial';
    difficulty: 'Easy' | 'Medium' | 'Hard';
    content: string;
    solution_text: string | null;
    is_premium: boolean;
    company_id: string | null;
    created_at: string;
  };
  notes: {
    id: string;
    title: string;
    subject: string;
    pdf_url: string;
    preview_image_url: string | null;
    created_at: string;
  };
  projects: {
    id: string;
    title: string;
    tech_stack: string[];
    description: string | null;
    github_url: string | null;
    created_at: string;
  };
  quizzes: {
    id: string;
    title: string;
    category: string | null;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    questions_json: {
      question: string;
      options: string[];
      correct: number;
    }[];
    duration_minutes: number;
    created_at: string;
  };
  user_progress: {
    id: string;
    user_id: string;
    question_id: string;
    status: 'solved' | 'attempted' | 'bookmarked';
    created_at: string;
    updated_at: string;
  };
  user_sql_progress: {
    id: string;
    user_id: string;
    question_id: string;
    solved: boolean;
    revision: boolean;
    created_at: string;
    updated_at: string;
  };
  user_core_cs_progress: {
    id: string;
    user_id: string;
    question_id: string;
    solved: boolean;
    revision: boolean;
    created_at: string;
    updated_at: string;
  };
  user_aptitude_progress: {
    id: string;
    user_id: string;
    question_id: string;
    solved: boolean;
    revision: boolean;
    created_at: string;
    updated_at: string;
  };
};
