ALTER TABLE company_topic_questions 
DROP CONSTRAINT IF EXISTS company_topic_questions_content_type_check;

ALTER TABLE company_topic_questions
ADD CONSTRAINT company_topic_questions_content_type_check 
CHECK (content_type IN ('code', 'image', 'text', 'quiz', 'sql_construct'));


UPDATE company_topic_questions
SET 
  explanation_text = E'## Get employees with salary > 50000 and department = ''HR''.\n\nConstruct an SQL query to get all employees with salary greater than 50000 and who work in the HR department.\n\n### Approach\n\n1) Start with SELECT ... FROM ...\n2) Use WHERE for the conditions\n3) Use **AND** to combine the conditions.\n\n### Employee Table\n\n| id | name  | department  | salary |\n|----|-------|-------------|--------|\n| 1  | Alice | Engineering | 60,000 |\n| 2  | Bob   | HR          | 55,000 |\n| 3  | Carol | Sales       | 75,000 |\n\n### Expected Output\n\n| id | name | department | salary |\n|----|------|------------|--------|\n| 2  | Bob  | HR         | 55,000 |',
  content_type = 'sql_construct',
  content_data = '{
    "type": "sql_construct",
    "queryLines": [
      ["SELECT", "*"],
      ["FROM", "Employees"],
      ["WHERE", "salary", ">", "50000"],
      ["AND", "department", "=", "''HR''"],
      [";"]
    ],
    "distractors": ["RETURN", "HAVING", "limit", "GROUP BY", "SALARY", "salary", "GRDER BY", "50000", "return", "+", "GROUP BY", "limit", "<>", "<=", "()", "OR", "where", "return", "select", "<=", "<-", ":=", "Employees"],
    "tableSchema": {
      "tableName": "Employee",
      "columns": ["id", "name", "department", "salary"],
      "rows": [
        [1, "Alice", "Engineering", 60000],
        [2, "Bob", "HR", 55000],
        [3, "Carol", "Sales", 75000]
      ]
    },
    "expectedOutput": {
      "columns": ["id", "name", "department", "salary"],
      "rows": [
        [2, "Bob", "HR", 55000]
      ]
    }
  }'::jsonb
WHERE company_name = 'HCL' AND topic = 'SQL' 
  AND question ILIKE '%second highest salary%';
