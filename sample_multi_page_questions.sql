-- Example data structure for multi-page questions in company_interview_questions table
-- This demonstrates how to structure questions with multiple pages

-- Example 1: Simple question with single page (auto-generated)
INSERT INTO company_interview_questions (company_name, question, difficulty, category, explanation_text, content)
VALUES (
    'HCL',
    'What is polymorphism in OOP?',
    'Medium',
    'Technical',
    'Polymorphism is one of the core concepts of object-oriented programming...',
    'Polymorphism allows objects of different classes to be treated as objects of a common parent class.'
);

-- Example 2: Multi-page question with text and code
INSERT INTO company_interview_questions (company_name, question, difficulty, category, pages)
VALUES (
    'HCL',
    'Explain the concept of closures in JavaScript',
    'Medium',
    'Technical',
    '[
        {
            "pageNumber": 1,
            "explanation": "A closure is a function that has access to variables in its outer (enclosing) lexical scope, even after the outer function has returned. This is a fundamental concept in JavaScript that enables powerful programming patterns.",
            "contentType": "text",
            "content": {
                "text": "Closures are created every time a function is created. They allow inner functions to access the scope of outer functions, creating a private scope for variables."
            }
        },
        {
            "pageNumber": 2,
            "explanation": "Here is a practical example of a closure. Notice how the inner function maintains access to the outer function''s variable even after the outer function has finished executing.",
            "contentType": "code",
            "content": {
                "language": "javascript",
                "code": "function createCounter() {\n  let count = 0;\n  \n  return function() {\n    count++;\n    return count;\n  };\n}\n\nconst counter = createCounter();\nconsole.log(counter()); // 1\nconsole.log(counter()); // 2\nconsole.log(counter()); // 3",
                "caption": "The inner function forms a closure, maintaining access to the count variable."
            }
        }
    ]'::jsonb
);

-- Example 3: Interactive coding question with fill-in-the-blanks
INSERT INTO company_interview_questions (company_name, question, difficulty, category, pages)
VALUES (
    'TCS',
    'Implement a function to reverse a string in Python',
    'Easy',
    'Technical',
    '[
        {
            "pageNumber": 1,
            "explanation": "String reversal is a common programming task. In Python, there are multiple ways to reverse a string. The most Pythonic way is using slicing with a step of -1.",
            "contentType": "text",
            "content": {
                "text": "Key concepts:\n• String slicing syntax: string[start:end:step]\n• Negative step reverses the order\n• Empty start and end means full string"
            }
        },
        {
            "pageNumber": 2,
            "explanation": "Complete the code below by filling in the blanks. The function should take a string as input and return the reversed string using Python slicing.",
            "contentType": "interactive_code",
            "content": {
                "language": "python",
                "code": "def reverse_string(text):\n    # Use slicing to reverse the string\n    return text[___BLANK___]\n\n# Test the function\noriginal = \"Hello, World!\"\nreversed_text = reverse_string(original)\nprint(reversed_text)  # Output: !dlroW ,olleH",
                "blanks": [
                    {
                        "lineNumber": 3,
                        "placeholder": "___BLANK___",
                        "answer": "::-1"
                    }
                ],
                "caption": "The slicing notation [::-1] reverses the string by stepping backwards through all characters."
            }
        }
    ]'::jsonb
);

-- Example 4: Complex multi-page question with various content types
INSERT INTO company_interview_questions (company_name, question, difficulty, category, pages)
VALUES (
    'Infosys',
    'What is the difference between SQL JOIN types?',
    'Medium',
    'Technical',
    '[
        {
            "pageNumber": 1,
            "explanation": "SQL JOINs are used to combine rows from two or more tables based on a related column. There are four main types: INNER JOIN, LEFT JOIN, RIGHT JOIN, and FULL OUTER JOIN.",
            "contentType": "text",
            "content": {
                "text": "• INNER JOIN: Returns matching rows from both tables\n• LEFT JOIN: Returns all rows from left table, matching rows from right\n• RIGHT JOIN: Returns all rows from right table, matching rows from left\n• FULL OUTER JOIN: Returns all rows when there is a match in either table"
            }
        },
        {
            "pageNumber": 2,
            "explanation": "Here is an example of an INNER JOIN. This query retrieves all orders along with customer information for customers who have placed orders.",
            "contentType": "code",
            "content": {
                "language": "sql",
                "code": "SELECT customers.name, orders.order_id, orders.amount\nFROM customers\nINNER JOIN orders ON customers.id = orders.customer_id;",
                "caption": "INNER JOIN returns only the rows where there is a match in both tables."
            }
        },
        {
            "pageNumber": 3,
            "explanation": "Complete the LEFT JOIN query below. A LEFT JOIN returns all customers, even those without orders (showing NULL for order data).",
            "contentType": "interactive_code",
            "content": {
                "language": "sql",
                "code": "SELECT customers.name, orders.order_id, orders.amount\nFROM customers\n___BLANK___ orders ON customers.id = orders.customer_id;",
                "blanks": [
                    {
                        "lineNumber": 3,
                        "placeholder": "___BLANK___",
                        "answer": "LEFT JOIN"
                    }
                ],
                "caption": "LEFT JOIN ensures all customers appear in the result, with NULL values for customers without orders."
            }
        }
    ]'::jsonb
);
