-- Sample data to populate question content for testing
-- This adds explanation text, content type, and sample content to existing questions

-- Sample DSA Problem with Quiz
UPDATE dsa_problems
SET 
  explanation_text = E'# Binary Search Algorithm\n\nBinary search is an efficient algorithm for finding an item from a sorted list of items. It works by repeatedly dividing in half the portion of the list that could contain the item, until you''ve narrowed down the possible locations to just one.\n\n## How it Works:\n\n1. **Start with the middle element**: Compare the target value to the middle element of the array\n2. **If equal**: You''ve found the target!\n3. **If target is less**: Search the left half\n4. **If target is greater**: Search the right half\n5. **Repeat** until found or the subarray is empty\n\n## Time Complexity:\n- **Best Case**: O(1) - element found at middle\n- **Average Case**: O(log n)\n- **Worst Case**: O(log n)\n\n## Space Complexity:\n- **Iterative**: O(1)\n- **Recursive**: O(log n) due to call stack',
  content_type = 'quiz',
  has_quiz = true,
  quiz_data = '{
    "question": "What is the time complexity of binary search in the worst case?",
    "options": ["O(n)", "O(log n)", "O(n²)", "O(1)"],
    "correctAnswer": 1,
    "explanation": "Binary search divides the search space in half with each iteration, resulting in O(log n) time complexity. This is much more efficient than linear search which is O(n)."
  }'::jsonb
WHERE title ILIKE '%binary search%'
LIMIT 1;

-- Sample DSA Problem with Code
UPDATE dsa_problems
SET 
  explanation_text = E'# Two Sum Problem\n\nGiven an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\n## Approach:\n\nThe most efficient solution uses a **hash map** to store numbers we''ve seen along with their indices.\n\n### Algorithm:\n1. Create an empty hash map\n2. Iterate through the array\n3. For each number, calculate its complement (target - current number)\n4. Check if complement exists in hash map\n5. If yes, return both indices\n6. If no, add current number and index to hash map\n\n## Complexity:\n- **Time**: O(n) - single pass through array\n- **Space**: O(n) - hash map storage',
  content_type = 'code',
  has_quiz = false,
  content_data = '{
    "language": "javascript",
    "code": "function twoSum(nums, target) {\n  const map = new Map();\n  \n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    \n    if (map.has(complement)) {\n      return [map.get(complement), i];\n    }\n    \n    map.set(nums[i], i);\n  }\n  \n  return [];\n}\n\n// Example usage:\nconst nums = [2, 7, 11, 15];\nconst target = 9;\nconsole.log(twoSum(nums, target)); // Output: [0, 1]",
    "caption": "Optimal solution using hash map for O(n) time complexity"
  }'::jsonb
WHERE title ILIKE '%two sum%'
LIMIT 1;

-- Sample SQL Question with Code
UPDATE sql_questions
SET 
  explanation_text = E'# SQL JOIN Operations\n\nJOINs are used to combine rows from two or more tables based on a related column between them.\n\n## Types of JOINs:\n\n### INNER JOIN\nReturns records that have matching values in both tables.\n\n### LEFT JOIN (LEFT OUTER JOIN)\nReturns all records from the left table, and matched records from the right table.\n\n### RIGHT JOIN (RIGHT OUTER JOIN)\nReturns all records from the right table, and matched records from the left table.\n\n### FULL JOIN (FULL OUTER JOIN)\nReturns all records when there is a match in either left or right table.\n\n## When to Use:\n- Use INNER JOIN when you only want matching records\n- Use LEFT JOIN when you want all records from the left table\n- Use RIGHT JOIN when you want all records from the right table\n- Use FULL JOIN when you want all records from both tables',
  content_type = 'code',
  has_quiz = false,
  content_data = '{
    "language": "sql",
    "code": "-- INNER JOIN Example\nSELECT \n  employees.name,\n  departments.dept_name\nFROM employees\nINNER JOIN departments\n  ON employees.dept_id = departments.id;\n\n-- LEFT JOIN Example\nSELECT \n  employees.name,\n  departments.dept_name\nFROM employees\nLEFT JOIN departments\n  ON employees.dept_id = departments.id;\n\n-- Multiple JOINs\nSELECT \n  e.name,\n  d.dept_name,\n  p.project_name\nFROM employees e\nINNER JOIN departments d ON e.dept_id = d.id\nLEFT JOIN projects p ON e.id = p.employee_id;",
    "caption": "Common SQL JOIN patterns with examples"
  }'::jsonb
WHERE title ILIKE '%join%'
LIMIT 1;

-- Sample SQL Question with Quiz
UPDATE sql_questions
SET 
  explanation_text = E'# SQL Aggregate Functions\n\nAggregate functions perform a calculation on a set of values and return a single value.\n\n## Common Aggregate Functions:\n\n### COUNT()\nReturns the number of rows that match a specified criterion.\n\n### SUM()\nReturns the total sum of a numeric column.\n\n### AVG()\nReturns the average value of a numeric column.\n\n### MIN() and MAX()\nReturns the smallest/largest value of the selected column.\n\n## GROUP BY Clause:\nUsed with aggregate functions to group the result set by one or more columns.\n\n## HAVING Clause:\nUsed to filter groups based on aggregate function results (WHERE cannot be used with aggregates).',
  content_type = 'quiz',
  has_quiz = true,
  quiz_data = '{
    "question": "Which SQL clause is used to filter results AFTER aggregation?",
    "options": ["WHERE", "HAVING", "GROUP BY", "ORDER BY"],
    "correctAnswer": 1,
    "explanation": "HAVING is used to filter groups after aggregation, while WHERE filters rows before aggregation. For example: SELECT dept, COUNT(*) FROM employees GROUP BY dept HAVING COUNT(*) > 5"
  }'::jsonb
WHERE category = 'Aggregation'
LIMIT 1;

-- Sample Aptitude Question with Quiz
UPDATE aptitude_questions
SET 
  explanation_text = E'# Percentage Calculations\n\nPercentages are a way of expressing a number as a fraction of 100.\n\n## Basic Formula:\n**Percentage = (Part / Whole) × 100**\n\n## Common Percentage Problems:\n\n### Finding Percentage:\nWhat is 25% of 80?\n- Convert to decimal: 25% = 0.25\n- Multiply: 0.25 × 80 = 20\n\n### Finding the Whole:\nIf 30 is 15% of a number, what is the number?\n- Formula: Whole = Part / (Percentage/100)\n- Whole = 30 / 0.15 = 200\n\n### Percentage Increase/Decrease:\n- Increase: ((New - Old) / Old) × 100\n- Decrease: ((Old - New) / Old) × 100\n\n## Tips:\n- 50% = 1/2\n- 25% = 1/4\n- 10% = 1/10\n- To find 10%, divide by 10\n- To find 5%, divide by 20',
  content_type = 'quiz',
  has_quiz = true,
  quiz_data = '{
    "question": "If a shirt originally costs $80 and is on sale for 25% off, what is the sale price?",
    "options": ["$20", "$40", "$60", "$70"],
    "correctAnswer": 2,
    "explanation": "25% of $80 = 0.25 × 80 = $20 discount. Sale price = $80 - $20 = $60. Alternatively, 75% of $80 = 0.75 × 80 = $60."
  }'::jsonb
WHERE difficulty = 'Easy'
LIMIT 1;

-- Sample Core CS Question with Text Content
UPDATE core_cs_questions
SET 
  explanation_text = E'# OSI Model - 7 Layers\n\nThe Open Systems Interconnection (OSI) model is a conceptual framework used to understand network interactions in seven layers.\n\n## The 7 Layers (Top to Bottom):\n\n### 7. Application Layer\n- End-user services\n- Protocols: HTTP, FTP, SMTP, DNS\n- Where applications access network services\n\n### 6. Presentation Layer\n- Data translation and encryption\n- Format conversion (ASCII, JPEG, etc.)\n- Compression and decompression\n\n### 5. Session Layer\n- Establishes, manages, terminates connections\n- Synchronization and dialog control\n\n### 4. Transport Layer\n- End-to-end communication\n- Protocols: TCP, UDP\n- Segmentation and flow control\n\n### 3. Network Layer\n- Routing and forwarding\n- Protocols: IP, ICMP, routing protocols\n- Logical addressing\n\n### 2. Data Link Layer\n- Node-to-node data transfer\n- MAC addressing\n- Error detection\n- Protocols: Ethernet, Wi-Fi\n\n### 1. Physical Layer\n- Physical transmission of raw bits\n- Hardware: cables, switches, network cards\n- Electrical signals',
  content_type = 'text',
  has_quiz = false,
  content_data = '{
    "text": "Mnemonic to remember: Please Do Not Throw Sausage Pizza Away\\n\\nP - Physical\\nD - Data Link\\nN - Network\\nT - Transport\\nS - Session\\nP - Presentation\\nA - Application"
  }'::jsonb
WHERE title ILIKE '%osi%'
LIMIT 1;

-- Sample Interview Question with Text
UPDATE questions
SET 
  explanation_text = E'# Tell Me About Yourself\n\nThis is often the first question in an interview and sets the tone for the conversation.\n\n## Structure Your Answer:\n\n### 1. Present (30 seconds)\nBriefly describe your current role and key responsibilities.\n\n### 2. Past (30 seconds)\nHighlight relevant experience and achievements that led you here.\n\n### 3. Future (30 seconds)\nExplain why you''re interested in this role and company.\n\n## Tips:\n\n✅ **DO:**\n- Keep it to 1-2 minutes\n- Focus on professional experience\n- Tailor to the job you''re applying for\n- Be enthusiastic and confident\n- Practice beforehand\n\n❌ **DON''T:**\n- Recite your entire resume\n- Share too much personal information\n- Be negative about past employers\n- Ramble or go off-topic\n- Sound rehearsed or robotic\n\n## Example Structure:\n\n"I''m currently a [role] at [company], where I [key responsibility]. Before this, I [relevant experience] which helped me develop skills in [relevant skills]. I''m particularly excited about this opportunity because [why this role/company]."',
  content_type = 'text',
  has_quiz = false,
  content_data = '{
    "text": "Remember: This is your elevator pitch. Make it count!"
  }'::jsonb
WHERE category = 'HR' AND title ILIKE '%tell me about yourself%'
LIMIT 1;

-- Note: Run this script after the main migration to add sample content
-- You can customize these examples or add more as needed
