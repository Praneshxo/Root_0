-- Comprehensive Sample Data for Company Interview Questions
-- This file contains multi-page questions for all companies with various content types

-- ============================================================================
-- HCL QUESTIONS
-- ============================================================================

-- Question 1: Object-Oriented Programming Concepts
INSERT INTO company_interview_questions (company_name, question, difficulty, category, pages)
VALUES (
    'HCL',
    'Explain the four pillars of Object-Oriented Programming',
    'Medium',
    'Technical',
    '[
        {
            "pageNumber": 1,
            "explanation": "Object-Oriented Programming (OOP) is built on four fundamental principles: Encapsulation, Inheritance, Polymorphism, and Abstraction. These concepts help create modular, reusable, and maintainable code.\n\n**Encapsulation**: Bundling data and methods that operate on that data within a single unit (class), hiding internal details.\n\n**Inheritance**: Mechanism where a new class derives properties and behaviors from an existing class.\n\n**Polymorphism**: Ability of objects to take multiple forms, allowing methods to do different things based on the object.\n\n**Abstraction**: Hiding complex implementation details and showing only essential features.",
            "contentType": "text",
            "content": {
                "text": "These four pillars work together to create robust software systems that are easier to understand, modify, and extend."
            }
        },
        {
            "pageNumber": 2,
            "explanation": "Here is a practical example demonstrating all four OOP principles in Python. This example shows a simple banking system with different account types.",
            "contentType": "code",
            "content": {
                "language": "python",
                "code": "# Encapsulation: Data hiding with private attributes\nclass BankAccount:\n    def __init__(self, account_number, balance):\n        self.__account_number = account_number  # Private\n        self.__balance = balance  # Private\n    \n    def deposit(self, amount):\n        self.__balance += amount\n    \n    def get_balance(self):\n        return self.__balance\n\n# Inheritance: SavingsAccount inherits from BankAccount\nclass SavingsAccount(BankAccount):\n    def __init__(self, account_number, balance, interest_rate):\n        super().__init__(account_number, balance)\n        self.interest_rate = interest_rate\n    \n    # Polymorphism: Overriding parent method\n    def calculate_interest(self):\n        return self.get_balance() * self.interest_rate\n\n# Abstraction: Simple interface for complex operations\naccount = SavingsAccount(\"12345\", 1000, 0.05)\naccount.deposit(500)\nprint(f\"Balance: ${account.get_balance()}\")\nprint(f\"Interest: ${account.calculate_interest()}\")",
                "caption": "This example demonstrates encapsulation (private attributes), inheritance (SavingsAccount extends BankAccount), polymorphism (method overriding), and abstraction (simple public interface)."
            }
        }
    ]'::jsonb
);

-- Question 2: SQL Joins
INSERT INTO company_interview_questions (company_name, question, difficulty, category, pages)
VALUES (
    'HCL',
    'What are the different types of SQL JOINs and when to use them?',
    'Easy',
    'Technical',
    '[
        {
            "pageNumber": 1,
            "explanation": "SQL JOINs are used to combine rows from two or more tables based on related columns. Understanding when to use each type is crucial for efficient database queries.\n\n**INNER JOIN**: Returns only matching rows from both tables.\n**LEFT JOIN**: Returns all rows from left table, matching rows from right (NULL if no match).\n**RIGHT JOIN**: Returns all rows from right table, matching rows from left (NULL if no match).\n**FULL OUTER JOIN**: Returns all rows when there is a match in either table.",
            "contentType": "text",
            "content": {
                "text": "Use INNER JOIN when you only want matching records.\nUse LEFT JOIN when you need all records from the primary table.\nUse RIGHT JOIN when you need all records from the secondary table.\nUse FULL OUTER JOIN when you need all records from both tables."
            }
        },
        {
            "pageNumber": 2,
            "explanation": "Complete the query below to retrieve all customers along with their orders (if any). Some customers may not have placed orders yet.",
            "contentType": "interactive_code",
            "content": {
                "language": "sql",
                "code": "SELECT \n    customers.customer_name,\n    customers.email,\n    orders.order_id,\n    orders.total_amount\nFROM customers\n___BLANK___ orders \nON customers.customer_id = orders.customer_id;",
                "blanks": [
                    {
                        "lineNumber": 7,
                        "placeholder": "___BLANK___",
                        "answer": "LEFT JOIN"
                    }
                ],
                "caption": "LEFT JOIN ensures all customers appear in results, even those without orders (showing NULL for order data)."
            }
        }
    ]'::jsonb
);

-- ============================================================================
-- TCS QUESTIONS
-- ============================================================================

-- Question 1: Array Manipulation
INSERT INTO company_interview_questions (company_name, question, difficulty, category, pages)
VALUES (
    'TCS',
    'How do you reverse an array in-place?',
    'Easy',
    'Technical',
    '[
        {
            "pageNumber": 1,
            "explanation": "Reversing an array in-place means modifying the original array without using extra space for another array. The most efficient approach uses the two-pointer technique.\n\n**Algorithm**:\n1. Use two pointers: one at the start, one at the end\n2. Swap elements at these positions\n3. Move pointers toward center\n4. Stop when pointers meet\n\n**Time Complexity**: O(n)\n**Space Complexity**: O(1)",
            "contentType": "text",
            "content": {
                "text": "This is a common interview question that tests your understanding of array manipulation and space optimization."
            }
        },
        {
            "pageNumber": 2,
            "explanation": "Complete the function below to reverse the array in-place using the two-pointer technique.",
            "contentType": "interactive_code",
            "content": {
                "language": "javascript",
                "code": "function reverseArray(arr) {\n    let left = 0;\n    let right = arr.length - 1;\n    \n    while (left < right) {\n        // Swap elements\n        [arr[left], arr[right]] = ___BLANK___;\n        left++;\n        right--;\n    }\n    \n    return arr;\n}\n\n// Test\nconst numbers = [1, 2, 3, 4, 5];\nconsole.log(reverseArray(numbers)); // [5, 4, 3, 2, 1]",
                "blanks": [
                    {
                        "lineNumber": 7,
                        "placeholder": "___BLANK___",
                        "answer": "[arr[right], arr[left]]"
                    }
                ],
                "caption": "Array destructuring in JavaScript provides a clean way to swap elements."
            }
        }
    ]'::jsonb
);

-- ============================================================================
-- INFOSYS QUESTIONS
-- ============================================================================

-- Question 1: REST API Concepts
INSERT INTO company_interview_questions (company_name, question, difficulty, category, pages)
VALUES (
    'Infosys',
    'Explain REST API principles and HTTP methods',
    'Medium',
    'Technical',
    '[
        {
            "pageNumber": 1,
            "explanation": "REST (Representational State Transfer) is an architectural style for designing networked applications. It uses HTTP methods to perform operations on resources.\n\n**Key Principles**:\n• Stateless: Each request contains all information needed\n• Client-Server: Separation of concerns\n• Cacheable: Responses can be cached\n• Uniform Interface: Consistent way to interact\n\n**HTTP Methods**:\n• GET: Retrieve data\n• POST: Create new resource\n• PUT: Update entire resource\n• PATCH: Partial update\n• DELETE: Remove resource",
            "contentType": "text",
            "content": {
                "text": "RESTful APIs are the standard for modern web services, used by companies like Google, Facebook, and Twitter."
            }
        },
        {
            "pageNumber": 2,
            "explanation": "Here is an example of a RESTful API endpoint structure for a blog application.",
            "contentType": "code",
            "content": {
                "language": "javascript",
                "code": "// Express.js REST API Example\nconst express = require(''express'');\nconst app = express();\n\n// GET: Retrieve all posts\napp.get(''/api/posts'', (req, res) => {\n    res.json({ posts: getAllPosts() });\n});\n\n// GET: Retrieve single post\napp.get(''/api/posts/:id'', (req, res) => {\n    const post = getPostById(req.params.id);\n    res.json({ post });\n});\n\n// POST: Create new post\napp.post(''/api/posts'', (req, res) => {\n    const newPost = createPost(req.body);\n    res.status(201).json({ post: newPost });\n});\n\n// PUT: Update post\napp.put(''/api/posts/:id'', (req, res) => {\n    const updated = updatePost(req.params.id, req.body);\n    res.json({ post: updated });\n});\n\n// DELETE: Remove post\napp.delete(''/api/posts/:id'', (req, res) => {\n    deletePost(req.params.id);\n    res.status(204).send();\n});",
                "caption": "This example shows standard REST API patterns with appropriate HTTP methods and status codes."
            }
        }
    ]'::jsonb
);

-- ============================================================================
-- WIPRO QUESTIONS
-- ============================================================================

-- Question 1: Database Normalization
INSERT INTO company_interview_questions (company_name, question, difficulty, category, pages)
VALUES (
    'Wipro',
    'What is database normalization and why is it important?',
    'Medium',
    'Technical',
    '[
        {
            "pageNumber": 1,
            "explanation": "Database normalization is the process of organizing data to reduce redundancy and improve data integrity. It involves dividing large tables into smaller ones and defining relationships.\n\n**Normal Forms**:\n• 1NF: Eliminate repeating groups, ensure atomic values\n• 2NF: Remove partial dependencies\n• 3NF: Remove transitive dependencies\n• BCNF: Stricter version of 3NF\n\n**Benefits**:\n✓ Reduces data redundancy\n✓ Improves data integrity\n✓ Easier to maintain\n✓ Better query performance",
            "contentType": "text",
            "content": {
                "text": "Most production databases aim for 3NF as it provides a good balance between normalization and performance."
            }
        },
        {
            "pageNumber": 2,
            "explanation": "Here is an example showing the transformation from unnormalized to 3NF.",
            "contentType": "code",
            "content": {
                "language": "sql",
                "code": "-- Unnormalized Table (Bad)\nCREATE TABLE orders_bad (\n    order_id INT,\n    customer_name VARCHAR(100),\n    customer_email VARCHAR(100),\n    customer_phone VARCHAR(20),\n    product_names TEXT,  -- Multiple products in one field\n    total_amount DECIMAL\n);\n\n-- Normalized Tables (Good - 3NF)\nCREATE TABLE customers (\n    customer_id INT PRIMARY KEY,\n    name VARCHAR(100),\n    email VARCHAR(100),\n    phone VARCHAR(20)\n);\n\nCREATE TABLE orders (\n    order_id INT PRIMARY KEY,\n    customer_id INT,\n    order_date DATE,\n    total_amount DECIMAL,\n    FOREIGN KEY (customer_id) REFERENCES customers(customer_id)\n);\n\nCREATE TABLE order_items (\n    order_item_id INT PRIMARY KEY,\n    order_id INT,\n    product_id INT,\n    quantity INT,\n    price DECIMAL,\n    FOREIGN KEY (order_id) REFERENCES orders(order_id)\n);",
                "caption": "Normalized design eliminates redundancy and maintains data integrity through proper relationships."
            }
        }
    ]'::jsonb
);

-- ============================================================================
-- COGNIZANT QUESTIONS
-- ============================================================================

-- Question 1: Async JavaScript
INSERT INTO company_interview_questions (company_name, question, difficulty, category, pages)
VALUES (
    'Cognizant',
    'Explain Promises and async/await in JavaScript',
    'Medium',
    'Technical',
    '[
        {
            "pageNumber": 1,
            "explanation": "JavaScript is single-threaded but can handle asynchronous operations using Promises and async/await syntax.\n\n**Promise**: An object representing eventual completion or failure of an async operation.\n\n**States**:\n• Pending: Initial state\n• Fulfilled: Operation completed successfully\n• Rejected: Operation failed\n\n**async/await**: Syntactic sugar over Promises, making async code look synchronous.\n\n**Benefits**:\n✓ Cleaner code\n✓ Better error handling\n✓ Easier to read and maintain",
            "contentType": "text",
            "content": {
                "text": "Modern JavaScript applications heavily rely on async/await for API calls, file operations, and database queries."
            }
        },
        {
            "pageNumber": 2,
            "explanation": "Complete the async function below to fetch user data and handle errors properly.",
            "contentType": "interactive_code",
            "content": {
                "language": "javascript",
                "code": "async function fetchUserData(userId) {\n    try {\n        const response = ___BLANK___ fetch(`/api/users/${userId}`);\n        \n        if (!response.ok) {\n            throw new Error(''User not found'');\n        }\n        \n        const userData = await response.json();\n        return userData;\n    } catch (error) {\n        console.error(''Error fetching user:'', error);\n        return null;\n    }\n}\n\n// Usage\nconst user = await fetchUserData(123);",
                "blanks": [
                    {
                        "lineNumber": 3,
                        "placeholder": "___BLANK___",
                        "answer": "await"
                    }
                ],
                "caption": "The await keyword pauses execution until the Promise resolves, making async code easier to read."
            }
        }
    ]'::jsonb
);

-- ============================================================================
-- IBM QUESTIONS
-- ============================================================================

-- Question 1: Cloud Computing Basics
INSERT INTO company_interview_questions (company_name, question, difficulty, category, pages)
VALUES (
    'IBM',
    'What are the different cloud service models?',
    'Easy',
    'Technical',
    '[
        {
            "pageNumber": 1,
            "explanation": "Cloud computing offers three main service models, each providing different levels of control and management.\n\n**IaaS (Infrastructure as a Service)**:\n• Provides virtualized computing resources\n• Examples: AWS EC2, Google Compute Engine\n• You manage: OS, applications, data\n• Provider manages: Hardware, networking\n\n**PaaS (Platform as a Service)**:\n• Provides platform for application development\n• Examples: Heroku, Google App Engine\n• You manage: Applications, data\n• Provider manages: Runtime, middleware, OS\n\n**SaaS (Software as a Service)**:\n• Provides complete software applications\n• Examples: Gmail, Salesforce, Office 365\n• You manage: Data, user access\n• Provider manages: Everything else",
            "contentType": "text",
            "content": {
                "text": "Choosing the right service model depends on your technical expertise, control requirements, and business needs."
            }
        }
    ]'::jsonb
);

-- ============================================================================
-- ACCENTURE QUESTIONS
-- ============================================================================

-- Question 1: Agile Methodology
INSERT INTO company_interview_questions (company_name, question, difficulty, category, pages)
VALUES (
    'Accenture',
    'Explain the Agile development methodology and Scrum framework',
    'Easy',
    'Managerial',
    '[
        {
            "pageNumber": 1,
            "explanation": "Agile is an iterative approach to software development that emphasizes flexibility, collaboration, and customer feedback.\n\n**Agile Principles**:\n• Individuals and interactions over processes\n• Working software over documentation\n• Customer collaboration over contract negotiation\n• Responding to change over following a plan\n\n**Scrum Framework**:\n• Sprint: 2-4 week development cycle\n• Daily Standup: 15-minute daily sync\n• Sprint Planning: Define sprint goals\n• Sprint Review: Demo completed work\n• Sprint Retrospective: Improve process\n\n**Roles**:\n• Product Owner: Defines requirements\n• Scrum Master: Facilitates process\n• Development Team: Builds the product",
            "contentType": "text",
            "content": {
                "text": "Agile and Scrum are widely adopted in the software industry, with over 70% of organizations using some form of Agile methodology."
            }
        }
    ]'::jsonb
);

-- Add more questions for other companies following the same pattern...
