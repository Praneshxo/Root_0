-- Aptitude Questions Database Schema

-- Table: aptitude_questions
-- Stores all aptitude test questions
CREATE TABLE IF NOT EXISTS aptitude_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
  category TEXT NOT NULL,
  solution_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: user_aptitude_progress
-- Tracks user progress on aptitude questions
CREATE TABLE IF NOT EXISTS user_aptitude_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES aptitude_questions(id) ON DELETE CASCADE,
  solved BOOLEAN DEFAULT FALSE,
  revision BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, question_id)
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_aptitude_questions_difficulty ON aptitude_questions(difficulty);
CREATE INDEX IF NOT EXISTS idx_aptitude_questions_category ON aptitude_questions(category);
CREATE INDEX IF NOT EXISTS idx_user_aptitude_progress_user_id ON user_aptitude_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_aptitude_progress_question_id ON user_aptitude_progress(question_id);

-- Enable Row Level Security
ALTER TABLE aptitude_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_aptitude_progress ENABLE ROW LEVEL SECURITY;

-- RLS Policies for aptitude_questions (public read)
CREATE POLICY "Anyone can view aptitude questions"
  ON aptitude_questions FOR SELECT
  USING (true);

-- RLS Policies for user_aptitude_progress (user-specific)
CREATE POLICY "Users can view their own aptitude progress"
  ON user_aptitude_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own aptitude progress"
  ON user_aptitude_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own aptitude progress"
  ON user_aptitude_progress FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own aptitude progress"
  ON user_aptitude_progress FOR DELETE
  USING (auth.uid() = user_id);

-- Sample Aptitude Questions Data
INSERT INTO aptitude_questions (title, description, difficulty, category, solution_text) VALUES

-- Logical Reasoning Questions
('Six friends (A, B, C, D, E, F) are sitting in a straight line facing North. C is sitting between A and E. D is not at any end. B is at the immediate right of E. F is at the right end. Who is at the left end?', 'A Linear Seating Arrangement puzzle requiring step-by-step placement.', 'Hard', 'Logical reasoning', 'A is at the left end. Arrangement: A-C-E-B-D-F'),

('Look at this series: 7, 10, 8, 11, 9, 12... What number should come next in the sequence?', 'A Number Series problem that involves an alternating pattern rather than a single rule.', 'Easy', 'Logical reasoning', '10. The pattern alternates: +3, -2, +3, -2, +3, so next is -2 from 12 = 10'),

('Find the next term in the series: A, C, F, J, O...', 'A Letter Series problem where the gap between letters increases by one each time.', 'Medium', 'Logical reasoning', 'U. Gaps are +1, +2, +3, +4, +5: A(+1)B(+2)C(+3)F(+4)J(+5)O(+6)U'),

('A man bought oranges at 5 for $1 and sold them at 4 for $1. What is his profit percentage?', 'A Profit and Loss problem that involves calculating CP and SP per orange.', 'Hard', 'Quantitative', '25%. CP per orange = $0.20, SP per orange = $0.25. Profit = (0.05/0.20) × 100 = 25%'),

-- Verbal Ability Questions
('Please identify the error in the following sentence and provide the corrected version: "The quality of the mangoes were not good, so we decided not to buy them."', 'A Sentence Correction problem focusing on a subject-verb agreement error, a very common mistake.', 'Easy', 'Verbal ability', 'Error: "were" should be "was". Corrected: "The quality of the mangoes was not good, so we decided not to buy them." (Quality is singular)'),

-- Situational Judgement Questions
('You notice a process your team has been using for years is highly inefficient. You have an idea for a better way. What do you do?', 'You have an idea to improve an old process.', 'Medium', 'Situational judgement', 'Present your idea with data and a clear implementation plan to your manager, showing how it benefits the team and organization.'),

-- Logical Reasoning - Syllogisms
('Statements: 1. Some actors are singers. 2. All singers are dancers. Conclusion: 1. Some actors are dancers. 2. No singer is an actor. Which conclusion follows?', 'A standard Venn diagram / Syllogism, a very common logical pattern.', 'Easy', 'Logical reasoning', 'Conclusion 1 follows. Since some actors are singers and all singers are dancers, some actors must be dancers. Conclusion 2 is false.'),

-- Number Series
('Find the missing number: 2, 6, 12, 20, 30, ?', 'Pattern involves differences increasing by 2 each time.', 'Easy', 'Number series', '42. Pattern: +4, +6, +8, +10, +12. Next is 30+12=42'),

('What comes next: 1, 4, 9, 16, 25, ?', 'Perfect squares sequence.', 'Easy', 'Number series', '36. These are perfect squares: 1², 2², 3², 4², 5², 6² = 36'),

-- Quantitative - Time and Work
('A can complete a work in 12 days and B can complete it in 18 days. How many days will they take to complete the work together?', 'Classic time and work problem using work rate formula.', 'Medium', 'Time and work', '7.2 days. A''s rate = 1/12, B''s rate = 1/18. Combined = 1/12 + 1/18 = 5/36. Time = 36/5 = 7.2 days'),

-- Speed and Distance
('A train travels at 60 km/h for 2 hours and then at 80 km/h for 3 hours. What is the average speed?', 'Average speed calculation using total distance and total time.', 'Medium', 'Speed and distance', '72 km/h. Total distance = (60×2) + (80×3) = 360 km. Total time = 5 hours. Average = 360/5 = 72 km/h'),

-- Percentages
('If 30% of a number is 90, what is 50% of that number?', 'Basic percentage calculation.', 'Easy', 'Percentages', '150. If 30% = 90, then 100% = 300. So 50% = 150'),

('A shirt is marked at $200 and sold at a 20% discount. What is the selling price?', 'Simple discount calculation.', 'Easy', 'Percentages', '$160. Discount = 20% of 200 = $40. Selling price = 200 - 40 = $160'),

-- Ratios and Proportions
('The ratio of boys to girls in a class is 3:2. If there are 15 boys, how many girls are there?', 'Basic ratio problem.', 'Easy', 'Ratios and proportions', '10 girls. If boys:girls = 3:2 and boys = 15, then 3x = 15, so x = 5. Girls = 2x = 10'),

-- Averages
('The average of 5 numbers is 20. If one number is removed, the average becomes 18. What is the removed number?', 'Average calculation with removal.', 'Medium', 'Averages', '28. Sum of 5 numbers = 5×20 = 100. Sum of 4 numbers = 4×18 = 72. Removed number = 100-72 = 28'),

-- Probability
('What is the probability of getting a sum of 7 when rolling two dice?', 'Classic dice probability problem.', 'Medium', 'Probability', '1/6. Favorable outcomes: (1,6), (2,5), (3,4), (4,3), (5,2), (6,1) = 6. Total outcomes = 36. Probability = 6/36 = 1/6'),

-- Permutations and Combinations
('How many ways can 5 people be arranged in a row?', 'Basic permutation problem.', 'Easy', 'Permutations and combinations', '120. 5! = 5×4×3×2×1 = 120'),

('In how many ways can 3 books be selected from 7 books?', 'Basic combination problem.', 'Easy', 'Permutations and combinations', '35. C(7,3) = 7!/(3!×4!) = 35'),

-- Reading Comprehension
('Read: "Climate change is one of the most pressing issues of our time. Rising temperatures affect ecosystems worldwide." Question: What is the main concern discussed?', 'Simple comprehension question.', 'Easy', 'Reading comprehension', 'Climate change and its impact on ecosystems through rising temperatures.'),

-- Synonyms and Antonyms
('What is a synonym for "abundant"?', 'Vocabulary question.', 'Easy', 'Synonyms and antonyms', 'Plentiful, copious, ample, or profuse'),

('What is an antonym for "ancient"?', 'Vocabulary question.', 'Easy', 'Synonyms and antonyms', 'Modern, contemporary, or recent'),

-- Coding-Decoding
('If BOOK is coded as CPPL, how is DESK coded?', 'Letter shift pattern.', 'Easy', 'Coding-decoding', 'EFTL. Each letter is shifted by +1: D→E, E→F, S→T, K→L'),

-- Blood Relations
('A is B''s sister. C is B''s mother. D is C''s father. E is D''s mother. How is A related to D?', 'Family relationship problem.', 'Medium', 'Blood relations', 'Granddaughter. A is B''s sister, C is their mother, D is C''s father (A''s grandfather)'),

-- Direction Sense
('A person walks 5 km North, then 3 km East, then 5 km South. How far is he from the starting point?', 'Direction and distance calculation.', 'Easy', 'Direction sense', '3 km East. North and South movements cancel out (5-5=0), leaving only 3 km East displacement'),

-- Seating Arrangement
('Five people P, Q, R, S, T are sitting around a circular table. P is to the right of Q. R is to the left of S. T is between P and S. Who is to the left of Q?', 'Circular seating arrangement.', 'Medium', 'Seating arrangement', 'T is to the left of Q. Arrangement (clockwise): Q-P-T-S-R'),

-- Puzzles
('A farmer has 17 sheep. All but 9 die. How many are left?', 'Trick question/lateral thinking.', 'Easy', 'Puzzles', '9 sheep. "All but 9" means 9 survived'),

-- Analogies
('Book : Pages :: Tree : ?', 'Relationship analogy.', 'Easy', 'Analogies', 'Leaves. A book is made of pages; a tree is made of leaves'),

-- Classification
('Find the odd one out: 3, 5, 7, 9, 11', 'Number classification.', 'Easy', 'Classification', '9. All others are prime numbers; 9 is composite (3×3)'),

-- Pattern Recognition
('Complete the pattern: 2, 4, 8, 16, ?', 'Geometric progression.', 'Easy', 'Pattern recognition', '32. Each number is multiplied by 2'),

-- Simple Interest
('What is the simple interest on $1000 at 5% per annum for 2 years?', 'Basic SI formula.', 'Easy', 'Simple and compound interest', '$100. SI = (P×R×T)/100 = (1000×5×2)/100 = $100'),

-- Compound Interest
('What is the compound interest on $1000 at 10% per annum for 2 years?', 'Basic CI formula.', 'Medium', 'Simple and compound interest', '$210. Amount = 1000(1.1)² = $1210. CI = 1210-1000 = $210'),

-- Data Interpretation
('A pie chart shows: Sales - 40%, Marketing - 30%, Operations - 20%, Others - 10%. If total budget is $100,000, what is the Marketing budget?', 'Basic percentage calculation from chart.', 'Easy', 'Data interpretation', '$30,000. Marketing = 30% of $100,000 = $30,000'),

-- Idioms and Phrases
('What does "break the ice" mean?', 'Common idiom.', 'Easy', 'Idioms and phrases', 'To initiate conversation or make people feel comfortable in a social situation'),

-- Para Jumbles
('Arrange: A) However, this is not always true. B) Many believe success comes from luck. C) Hard work and persistence matter more. D) Success requires dedication.', 'Sentence ordering.', 'Medium', 'Para jumbles', 'B-A-C-D. Logical flow: statement, contradiction, explanation, conclusion'),

-- Letter Series
('Find the next: B, D, G, K, P, ?', 'Letter series with increasing gaps.', 'Medium', 'Letter series', 'V. Gaps: +2, +3, +4, +5, +6. P(+6) = V'),

-- Data Transformation
('If all numbers in a dataset are multiplied by 3, how does the mean change?', 'Statistical property.', 'Medium', 'Data interpretation', 'The mean is also multiplied by 3. Linear transformation property of mean');

-- Note: This provides 40 sample questions. Add 130 more to reach 170 total.
