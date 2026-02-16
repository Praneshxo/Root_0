-- SQL script to add Aptitude questions for Capgemini
-- IDs 1146-1165
-- Topic: 'Aptitude'
-- Targeted Company: Capgemini ONLY
-- Content Type: 'text'

WITH new_aptitude_list AS (
    SELECT *
    FROM (VALUES 
        ('If the ratio of boys to girls in a class is 3:2 and there are 30 students, how many girls are there?', 'Easy', 'Tests ratio and proportion concepts.'),
        ('A train 150m long crosses a pole in 10 seconds. What is its speed?', 'Medium', 'Checks speed, time, and distance fundamentals.'),
        ('Find the simple interest on ₹5000 at 8% per annum for 3 years.', 'Easy', 'Evaluates knowledge of SI formula.'),
        ('If the cost price of an item is ₹800 and it is sold at 20% profit, what is the selling price?', 'Easy', 'Tests profit and loss calculations.'),
        ('Solve: 25% of 480 + 15% of 200.', 'Easy', 'Checks percentage calculation ability.'),
        ('A can do a work in 12 days and B can do it in 18 days. In how many days can they complete it together?', 'Medium', 'Tests time and work concepts.'),
        ('If the average of 5 numbers is 28, what is their total sum?', 'Easy', 'Evaluates average formula understanding.'),
        ('Find the missing number in the series: 2, 6, 12, 20, ?', 'Medium', 'Checks number pattern recognition.'),
        ('A shop offers 10% discount on ₹2000 and then an additional 5% discount. What is the final price?', 'Medium', 'Tests successive discount concept.'),
        ('If a boat''s speed in still water is 10 km/h and the stream speed is 2 km/h, find downstream speed.', 'Easy', 'Checks boats and streams basics.'),
        ('A sum doubles in 5 years at simple interest. What is the rate of interest?', 'Medium', 'Evaluates SI rate derivation.'),
        ('Solve: 3x + 5 = 20.', 'Easy', 'Tests basic algebra skills.'),
        ('Two numbers are in the ratio 4:5 and their sum is 180. Find the numbers.', 'Medium', 'Checks ratio application.'),
        ('If 15 workers complete a task in 8 days, how many workers are needed to complete it in 4 days?', 'Medium', 'Tests inverse proportion concept.'),
        ('Find the compound interest on ₹4000 at 10% per annum for 2 years.', 'Medium', 'Evaluates compound interest formula usage.'),
        ('What is the probability of getting a head when tossing a fair coin?', 'Easy', 'Checks basic probability concept.'),
        ('Find the LCM of 12 and 18.', 'Easy', 'Tests number theory basics.'),
        ('If the perimeter of a rectangle is 60 and length is 20, find the breadth.', 'Medium', 'Checks geometry fundamentals.'),
        ('Solve: 7² + 5².', 'Easy', 'Evaluates basic arithmetic and squares.'),
        ('The average age of 10 students is 15 years. A new student joins and the average becomes 16. Find the age of the new student.', 'Medium', 'Tests weighted average understanding.')
    ) AS q(question, difficulty, explanation_text)
)
INSERT INTO company_topic_questions (company_name, topic, question, difficulty, explanation_text, content_type, content_data)
SELECT 
    'Capgemini', 
    'Aptitude', 
    q.question, 
    q.difficulty, 
    q.explanation_text, 
    'text', 
    jsonb_build_object('text', q.question)
FROM new_aptitude_list q;
