-- Add sample companies and interview questions for Mass Recruitment feature
-- This migration adds sample data for the mass recruitment drives

-- Insert sample companies if they don't exist
INSERT INTO companies (name, category, description) VALUES
  ('HCL', 'Service', 'HCL Technologies - Global IT services company'),
  ('IBM', 'Service', 'IBM - International Business Machines Corporation'),
  ('Cognizant', 'Service', 'Cognizant - IT services and consulting'),
  ('Infosys', 'Service', 'Infosys - Global leader in consulting and technology'),
  ('TCS', 'Service', 'Tata Consultancy Services - IT services and consulting'),
  ('Wipro', 'Service', 'Wipro - IT services and consulting'),
  ('Tech Mahindra', 'Service', 'Tech Mahindra - IT services and consulting'),
  ('L&T', 'Service', 'Larsen & Toubro Infotech - IT services'),
  ('Capgemini', 'Service', 'Capgemini - Consulting and technology services'),
  ('Accenture', 'Service', 'Accenture - Professional services company'),
  ('Mindtree', 'Service', 'Mindtree - Digital transformation and technology services'),
  ('Mphasis', 'Service', 'Mphasis - IT services company'),
  ('Hexaware', 'Service', 'Hexaware - IT services and consulting'),
  ('LTIMindtree', 'Service', 'LTIMindtree - Technology consulting and digital solutions'),
  ('Zoho', 'Product', 'Zoho Corporation - Software development company'),
  ('Persistent Systems', 'Product', 'Persistent Systems - Software product development'),
  ('Cyient', 'Service', 'Cyient - Engineering and technology solutions'),
  ('Coforge', 'Service', 'Coforge - IT solutions and services')
ON CONFLICT (name) DO NOTHING;

-- Insert sample interview questions for HCL
INSERT INTO questions (title, category, difficulty, content, company_id) 
SELECT 
  'Why are you interested in this position?',
  'HR',
  'Easy',
  'Most asked Interview Questions at Hcl. Practice common interview questions to prepare for your interviews.',
  id
FROM companies WHERE name = 'HCL'
ON CONFLICT DO NOTHING;

INSERT INTO questions (title, category, difficulty, content, company_id)
SELECT 
  'StringBuffer vs StringBuilder?',
  'Technical',
  'Easy',
  'Explain the differences between StringBuffer and StringBuilder in Java.',
  id
FROM companies WHERE name = 'HCL'
ON CONFLICT DO NOTHING;

INSERT INTO questions (title, category, difficulty, content, company_id)
SELECT 
  'Are you willing to relocate or travel?',
  'HR',
  'Easy',
  'Discuss your flexibility regarding relocation and travel for work.',
  id
FROM companies WHERE name = 'HCL'
ON CONFLICT DO NOTHING;

INSERT INTO questions (title, category, difficulty, content, company_id)
SELECT 
  'What are the 4 pillars of OOP?',
  'Technical',
  'Easy',
  'Explain the four fundamental principles of Object-Oriented Programming.',
  id
FROM companies WHERE name = 'HCL'
ON CONFLICT DO NOTHING;

INSERT INTO questions (title, category, difficulty, content, company_id)
SELECT 
  'What are your weaknesses?',
  'HR',
  'Easy',
  'Discuss your weaknesses and how you are working to improve them.',
  id
FROM companies WHERE name = 'HCL'
ON CONFLICT DO NOTHING;

-- Add more sample questions for other companies
INSERT INTO questions (title, category, difficulty, content, company_id)
SELECT 
  'Explain polymorphism with examples',
  'Technical',
  'Medium',
  'Describe polymorphism and provide real-world examples.',
  id
FROM companies WHERE name = 'IBM'
ON CONFLICT DO NOTHING;

INSERT INTO questions (title, category, difficulty, content, company_id)
SELECT 
  'What is your greatest strength?',
  'HR',
  'Easy',
  'Discuss your key strengths and how they align with the role.',
  id
FROM companies WHERE name = 'Cognizant'
ON CONFLICT DO NOTHING;

INSERT INTO questions (title, category, difficulty, content, company_id)
SELECT 
  'Difference between abstract class and interface',
  'Technical',
  'Medium',
  'Explain the key differences between abstract classes and interfaces.',
  id
FROM companies WHERE name = 'Infosys'
ON CONFLICT DO NOTHING;
