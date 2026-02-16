-- Add fill_in_blank_code content type support and sample data
-- This extends the company question system with interactive fill-in-the-blank exercises

-- Step 1: Add pages column if it doesn't exist
ALTER TABLE company_topic_questions 
ADD COLUMN IF NOT EXISTS pages JSONB;

ALTER TABLE company_interview_questions 
ADD COLUMN IF NOT EXISTS pages JSONB;

-- Step 2: Update content_type constraint to include new type
ALTER TABLE company_topic_questions 
DROP CONSTRAINT IF EXISTS company_topic_questions_content_type_check;

ALTER TABLE company_topic_questions 
ADD CONSTRAINT company_topic_questions_content_type_check 
CHECK (content_type IN ('code', 'image', 'text', 'quiz', 'fill_in_blank_code'));

-- Step 3: Add sample fill-in-the-blank question for HCL - Binary Search
UPDATE company_topic_questions
SET pages = '[
  {
    "pageNumber": 1,
    "explanation": "# Binary Search - Fill in the Blanks\n\nComplete the binary search implementation by filling in the missing parts. This algorithm searches for a target value in a sorted array.\n\n## Key Concepts:\n- Start with left and right pointers\n- Calculate middle index\n- Compare middle element with target\n- Adjust search range based on comparison\n\n## Time Complexity: O(log n)\n## Space Complexity: O(1)",
    "contentType": "fill_in_blank_code",
    "content": {
      "language": "javascript",
      "codeTemplate": "function binarySearch(arr, target) {\n  let left = {{blank1}};\n  let right = {{blank2}};\n  \n  while (left <= right) {\n    const mid = Math.floor((left + right) / {{blank3}});\n    \n    if (arr[mid] === target) {\n      return {{blank4}};\n    } else if (arr[mid] < target) {\n      left = mid + {{blank5}};\n    } else {\n      right = mid - 1;\n    }\n  }\n  \n  return -1;\n}",
      "blanks": [
        {
          "id": "blank1",
          "correctAnswer": "0",
          "hint": "Starting index"
        },
        {
          "id": "blank2",
          "correctAnswer": "arr.length - 1",
          "hint": "Ending index"
        },
        {
          "id": "blank3",
          "correctAnswer": "2",
          "hint": "Divide by?"
        },
        {
          "id": "blank4",
          "correctAnswer": "mid",
          "hint": "Return the index"
        },
        {
          "id": "blank5",
          "correctAnswer": "1",
          "hint": "Move left pointer"
        }
      ],
      "topic": "DSA",
      "caption": "Fill in the blanks to complete the binary search algorithm. Pay attention to the pointer initialization and update logic."
    }
  }
]'::jsonb
WHERE company_name = 'HCL' AND question = 'Binary Search implementation' AND topic = 'DSA';

-- Step 4: Add multi-page example (Image + Code) for TCS - Reverse String
UPDATE company_topic_questions
SET pages = '[
  {
    "pageNumber": 1,
    "explanation": "# String Reversal - Visual Explanation\n\nStudy this diagram to understand how the two-pointer approach works for reversing a string.\n\n## Approach:\n1. Convert string to array\n2. Use two pointers (left and right)\n3. Swap characters at both pointers\n4. Move pointers toward center\n5. Stop when pointers meet",
    "contentType": "image",
    "content": {
      "url": "https://miro.medium.com/v2/resize:fit:1400/1*fXKfC0P_j2L4R2VPQRjmOQ.png",
      "alt": "Two-pointer string reversal visualization",
      "caption": "The two-pointer technique swaps characters from both ends moving toward the center"
    }
  },
  {
    "pageNumber": 2,
    "explanation": "# Implementation\n\nNow review the code implementation of the two-pointer approach you just learned.\n\n## Key Points:\n- Array destructuring for swapping\n- In-place reversal\n- O(n/2) = O(n) time complexity\n- O(n) space for array conversion",
    "contentType": "code",
    "content": {
      "language": "javascript",
      "code": "function reverseString(str) {\n  const arr = str.split('''');\n  let left = 0;\n  let right = arr.length - 1;\n  \n  while (left < right) {\n    // Swap using array destructuring\n    [arr[left], arr[right]] = [arr[right], arr[left]];\n    left++;\n    right--;\n  }\n  \n  return arr.join('''');\n}\n\n// Test cases\nconsole.log(reverseString(''hello''));  // ''olleh''\nconsole.log(reverseString(''TCS''));    // ''SCT''",
      "caption": "Two-pointer approach with array destructuring for clean swapping"
    }
  }
]'::jsonb
WHERE company_name = 'TCS' AND question = 'Reverse a string without using built-in functions' AND topic = 'DSA';

-- Step 5: Add another fill-in-blank example for Infosys - Fibonacci
UPDATE company_topic_questions
SET pages = '[
  {
    "pageNumber": 1,
    "explanation": "# Fibonacci Series - Complete the Code\n\nFill in the missing parts to implement an iterative Fibonacci function.\n\n## Fibonacci Formula:\nF(n) = F(n-1) + F(n-2)\nBase cases: F(0) = 0, F(1) = 1\n\n## Why Iterative?\n- More efficient than recursion\n- O(n) time complexity\n- O(1) space complexity\n- No stack overflow risk",
    "contentType": "fill_in_blank_code",
    "content": {
      "language": "javascript",
      "codeTemplate": "function fibonacci(n) {\n  if (n <= {{blank1}}) return n;\n  \n  let prev = {{blank2}};\n  let curr = {{blank3}};\n  \n  for (let i = 2; i <= n; i++) {\n    let next = prev + {{blank4}};\n    prev = curr;\n    curr = {{blank5}};\n  }\n  \n  return curr;\n}",
      "blanks": [
        {
          "id": "blank1",
          "correctAnswer": "1",
          "hint": "Base case condition"
        },
        {
          "id": "blank2",
          "correctAnswer": "0",
          "hint": "First Fibonacci number"
        },
        {
          "id": "blank3",
          "correctAnswer": "1",
          "hint": "Second Fibonacci number"
        },
        {
          "id": "blank4",
          "correctAnswer": "curr",
          "hint": "Add current to previous"
        },
        {
          "id": "blank5",
          "correctAnswer": "next",
          "hint": "Update current"
        }
      ],
      "topic": "DSA",
      "caption": "Complete the iterative Fibonacci implementation. Remember: each number is the sum of the previous two."
    }
  }
]'::jsonb
WHERE company_name = 'Infosys' AND question = 'Fibonacci Series using recursion' AND topic = 'DSA';

-- Step 6: Add image-only example for SQL JOIN visualization
INSERT INTO company_topic_questions (company_name, question, difficulty, topic, pages)
VALUES (
  'HCL',
  'Visualize SQL JOIN types',
  'Easy',
  'SQL',
  '[
    {
      "pageNumber": 1,
      "explanation": "# SQL JOIN Types - Visual Guide\n\nStudy this Venn diagram to understand the different types of SQL JOINs.\n\n## JOIN Types:\n- **INNER JOIN**: Only matching rows from both tables\n- **LEFT JOIN**: All rows from left table + matches from right\n- **RIGHT JOIN**: All rows from right table + matches from left\n- **FULL OUTER JOIN**: All rows from both tables\n\n## When to Use:\n- Use INNER JOIN when you only want matching records\n- Use LEFT JOIN when you want all records from the primary table\n- Use RIGHT JOIN when you want all records from the secondary table\n- Use FULL OUTER JOIN when you want all records from both tables",
      "contentType": "image",
      "content": {
        "url": "https://www.dofactory.com/img/sql/sql-joins.png",
        "alt": "SQL JOIN types Venn diagram",
        "caption": "Visual representation of different SQL JOIN operations and their result sets"
      }
    }
  ]'::jsonb
)
ON CONFLICT DO NOTHING;

-- Step 7: Add code-only example for SQL subquery
INSERT INTO company_topic_questions (company_name, question, difficulty, topic, pages)
VALUES (
  'TCS',
  'Find employees with salary above average',
  'Medium',
  'SQL',
  '[
    {
      "pageNumber": 1,
      "explanation": "# Subquery Example - Above Average Salary\n\nThis query finds all employees whose salary is above the company average.\n\n## Subquery Concept:\n- Inner query calculates the average salary\n- Outer query filters employees based on that average\n- Subquery executes first, then outer query uses the result\n\n## Performance Note:\n- This subquery runs once and returns a single value\n- Efficient for this use case\n- For more complex scenarios, consider JOINs or CTEs",
      "contentType": "code",
      "content": {
        "language": "sql",
        "code": "-- Find employees earning above average salary\nSELECT \n  employee_id,\n  name,\n  salary,\n  department\nFROM employees\nWHERE salary > (\n  SELECT AVG(salary)\n  FROM employees\n)\nORDER BY salary DESC;\n\n-- Alternative with percentage above average\nSELECT \n  employee_id,\n  name,\n  salary,\n  ROUND((salary - avg_sal) / avg_sal * 100, 2) as percent_above_avg\nFROM employees\nCROSS JOIN (\n  SELECT AVG(salary) as avg_sal\n  FROM employees\n) avg_table\nWHERE salary > avg_sal\nORDER BY salary DESC;",
        "caption": "Two approaches: simple subquery and calculating percentage above average using CROSS JOIN"
      }
    }
  ]'::jsonb
)
ON CONFLICT DO NOTHING;

-- Step 8: Add Image + Text Multi-page Example (Infosys - System Design)
INSERT INTO company_topic_questions (company_name, question, difficulty, topic, pages)
VALUES (
  'Infosys',
  'Explain Load Balancer Architecture',
  'Hard',
  'Core CS',
  '[
    {
      "pageNumber": 1,
      "explanation": "# Load Balancer Visualization\n\nA load balancer acts as a reverse proxy, distributing network or application traffic across a number of servers. Load balancers are used to increase capacity (concurrent users) and reliability of applications.\n\n## Key Components:\n- **Clients**: Users accessing the system\n- **Load Balancer**: entry point\n- **Server Farm**: Multiple backend servers",
      "contentType": "image",
      "content": {
        "url": "https://www.nginx.com/wp-content/uploads/2014/07/what-is-a-load-balancer-1.png",
        "alt": "Load Balancer Diagram",
        "caption": "Traffic distribution from clients to multiple backend servers"
      }
    },
    {
      "pageNumber": 2,
      "explanation": "# text-based Explanation\n\n## How it works:\n\n1. **Health Checks**: The load balancer regularly checks servers to ensure they are online.\n2. **Routing Algorithms**: \n   - Round Robin (sequential)\n   - Least Connections (servers with fewest active connections)\n   - IP Hash (user IP determines server)\n\n## Benefits:\n- Scalability\n- Redundancy\n- Flexibility\n- Efficiency",
      "contentType": "text",
      "content": {
        "text": "Detailed textual explanation of load balancing algorithms and benefits."
      }
    }
  ]'::jsonb
)
ON CONFLICT DO NOTHING;

-- Step 9: Add Complex Multi-page Example: Image -> Code -> Fill-in-Blank (TCS - Queue)
INSERT INTO company_topic_questions (company_name, question, difficulty, topic, pages)
VALUES (
  'TCS',
  'Implement Queue using Array',
  'Medium',
  'DSA',
  '[
    {
      "pageNumber": 1,
      "explanation": "# Queue Data Structure\n\nA Queue is a linear structure which follows a particular order in which the operations are performed. The order is First In First Out (FIFO).\n\n## Visual Representation:\n- **Enqueue**: Add item to back (rear)\n- **Dequeue**: Remove item from front",
      "contentType": "image",
      "content": {
        "url": "https://media.geeksforgeeks.org/wp-content/cdn-uploads/20221213113312/Queue-Data-Structures.png",
        "alt": "Queue FIFO Diagram",
        "caption": "Items enter at Rear and leave from Front (FIFO)"
      }
    },
    {
      "pageNumber": 2,
      "explanation": "# Queue Implementation\n\nReview the standard implementation of a Queue using an Array.\n\n## Key Methods:\n- `enqueue(element)`: Adds element to end\n- `dequeue()`: Removes element from front\n- `front()`: Returns front element\n- `isEmpty()`: Checks if queue is empty",
      "contentType": "code",
      "content": {
        "language": "javascript",
        "code": "class Queue {\n  constructor() {\n    this.items = [];\n  }\n  \n  enqueue(element) {\n    this.items.push(element);\n  }\n  \n  dequeue() {\n    if(this.isEmpty()) return \"Underflow\";\n    return this.items.shift();\n  }\n  \n  front() {\n    if(this.isEmpty()) return \"No elements in Queue\";\n    return this.items[0];\n  }\n  \n  isEmpty() {\n    return this.items.length === 0;\n  }\n}",
        "caption": "Basic Queue implementation using methods push() and shift()"
      }
    },
    {
      "pageNumber": 3,
      "explanation": "# Challenge: Complete the Stack Implementation\n\nNow valid your understanding by implementing a Stack (LIFO) which is the opposite of a Queue.\n\n## Stack Operations:\n- **Push**: Add to top\n- **Pop**: Remove from top",
      "contentType": "fill_in_blank_code",
      "content": {
        "language": "javascript",
        "codeTemplate": "class Stack {\n  constructor() {\n    this.items = [];\n  }\n  \n  // Add element to top\n  push(element) {\n    this.items.{{blank1}}(element);\n  }\n  \n  // Remove element from top\n  pop() {\n    if (this.items.length === 0) return \"Underflow\";\n    return this.items.{{blank2}}();\n  }\n  \n  peek() {\n    return this.items[this.items.length - {{blank3}}];\n  }\n}",
        "blanks": [
          {
            "id": "blank1",
            "correctAnswer": "push",
            "hint": "Array method to add to end"
          },
          {
            "id": "blank2",
            "correctAnswer": "pop",
            "hint": "Array method to remove from end"
          },
          {
            "id": "blank3",
            "correctAnswer": "1",
            "hint": "Index offset for last element"
          }
        ],
        "topic": "DSA",
        "caption": "Complete the Stack implementation. Remember it uses LIFO (Last In First Out) order."
      }
    }
  ]'::jsonb
)
ON CONFLICT DO NOTHING;

-- Summary: Added support for:
-- 1. fill_in_blank_code content type
-- 2. Multi-page content (image + code)
-- 3. Image-only content
-- 4. Code-only content
-- 5. Text-only content
-- 6. Complex workflows (Image -> Code -> Interactive)
-- All with proper explanations and captions
