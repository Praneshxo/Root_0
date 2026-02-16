-- Projects Schema
-- Stores all project information with difficulty levels

-- Table: projects
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  tech_stack TEXT[] NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
  preview_image_url TEXT,
  demo_url TEXT,
  github_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_projects_difficulty ON projects(difficulty);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at);

-- Enable Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can view projects" ON projects;

-- RLS Policies for projects (public read)
CREATE POLICY "Anyone can view projects"
  ON projects FOR SELECT
  USING (true);

-- Sample Projects Data
INSERT INTO projects (title, description, tech_stack, difficulty, preview_image_url, demo_url, github_url) VALUES

-- Easy Projects
('Weather Forecast App', 'Beautiful weather application with 7-day forecasts, location search, and interactive maps', ARRAY['React', 'TypeScript', 'Web App'], 'Easy', '/images/projects/ecommerce.png', 'https://example.com/weather-demo', 'https://github.com/example/weather-app'),

('Blog Platform', 'Modern blogging platform with markdown support, comments, and SEO optimization', ARRAY['Next.js', 'MongoDB', 'Web App'], 'Easy', '/images/projects/ecommerce.png', 'https://example.com/blog-demo', 'https://github.com/example/blog-platform'),

('Portfolio Website', 'Responsive portfolio website with project showcase, contact form, and smooth animations', ARRAY['React', 'TypeScript', 'Web App'], 'Easy', '/images/projects/ecommerce.png', 'https://example.com/portfolio-demo', 'https://github.com/example/portfolio'),

-- Medium Projects
('E-Commerce Platform', 'Full-stack e-commerce application with shopping cart, payment integration, and admin dashboard', ARRAY['React', 'Node.js', 'MongoDB', 'Express'], 'Medium', '/images/projects/ecommerce.png', 'https://example.com/ecommerce-demo', 'https://github.com/example/ecommerce'),

('Real-Time Chat Application', 'WebSocket-based chat app with private messaging, group chats, and file sharing', ARRAY['React', 'Node.js', 'Socket.io', 'PostgreSQL'], 'Medium', '/images/projects/ecommerce.png', 'https://example.com/chat-demo', 'https://github.com/example/chat-app'),

('Task Management Dashboard', 'Kanban-style project management tool with drag-and-drop, team collaboration, and analytics', ARRAY['React', 'TypeScript', 'Node.js', 'MongoDB'], 'Medium', '/images/projects/ecommerce.png', 'https://example.com/task-manager-demo', 'https://github.com/example/task-manager'),

('Social Media Dashboard', 'Analytics dashboard for social media metrics with real-time data visualization', ARRAY['Next.js', 'TypeScript', 'PostgreSQL'], 'Medium', '/images/projects/ecommerce.png', 'https://example.com/social-dashboard-demo', 'https://github.com/example/social-dashboard'),

-- Hard Projects
('Video Streaming Platform', 'Netflix-like streaming platform with video encoding, CDN integration, and user subscriptions', ARRAY['React', 'Node.js', 'PostgreSQL', 'AWS'], 'Hard', '/images/projects/ecommerce.png', 'https://example.com/streaming-demo', 'https://github.com/example/streaming-platform'),

('Microservices E-Learning Platform', 'Scalable e-learning platform with microservices architecture, video courses, and payment processing', ARRAY['React', 'Node.js', 'MongoDB', 'Redis', 'Docker'], 'Hard', '/images/projects/ecommerce.png', 'https://example.com/elearning-demo', 'https://github.com/example/elearning'),

('Real-Time Collaboration Tool', 'Google Docs-like collaborative editor with real-time synchronization, version control, and comments', ARRAY['React', 'Node.js', 'WebRTC', 'PostgreSQL'], 'Hard', '/images/projects/ecommerce.png', 'https://example.com/collab-demo', 'https://github.com/example/collab-tool')

ON CONFLICT DO NOTHING;
