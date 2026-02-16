-- SQL script to delete HR questions from 'company_topic_questions' table
-- This removes any rows where topic is 'HR'
DELETE FROM company_topic_questions WHERE topic = 'HR';
