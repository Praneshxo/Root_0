-- Add explanation and content fields to company_topic_questions table
-- This allows each question to have detailed explanations and code/image examples

-- Step 1: Add new columns to the table
ALTER TABLE company_topic_questions 
ADD COLUMN IF NOT EXISTS explanation_text TEXT,
ADD COLUMN IF NOT EXISTS content_type TEXT CHECK (content_type IN ('code', 'image', 'text', 'quiz')),
ADD COLUMN IF NOT EXISTS content_data JSONB;

-- Step 2: Add comprehensive content for ALL company questions
-- Format: Right side = explanation_text, Left side = content_data

-- ============================================================================
-- DSA QUESTIONS WITH CODE EXAMPLES
-- ============================================================================

-- HCL: Reverse a linked list
UPDATE company_topic_questions
SET 
  explanation_text = E'# Reverse a Linked List\n\nReversing a linked list is a fundamental operation that changes the direction of pointers in a singly linked list.\n\n## Approach:\n\n### Iterative Method (Recommended)\n1. Use three pointers: `prev`, `current`, and `next`\n2. Initialize `prev` as NULL and `current` as head\n3. Traverse the list:\n   - Store next node\n   - Reverse current node''s pointer\n   - Move pointers one position ahead\n4. Update head to point to the last node\n\n## Time Complexity: O(n)\n## Space Complexity: O(1)\n\n## Key Points:\n- In-place reversal (no extra space needed)\n- Single pass through the list\n- Three pointers technique is crucial',
  content_type = 'code',
  content_data = '{
    "language": "javascript",
    "code": "class ListNode {\n  constructor(val = 0, next = null) {\n    this.val = val;\n    this.next = next;\n  }\n}\n\nfunction reverseLinkedList(head) {\n  let prev = null;\n  let current = head;\n  \n  while (current !== null) {\n    // Store next node\n    let next = current.next;\n    \n    // Reverse current node''s pointer\n    current.next = prev;\n    \n    // Move pointers one position ahead\n    prev = current;\n    current = next;\n  }\n  \n  // prev is now the new head\n  return prev;\n}\n\n// Example usage:\n// Input: 1 -> 2 -> 3 -> 4 -> 5\nconst head = new ListNode(1, new ListNode(2, new ListNode(3, new ListNode(4, new ListNode(5)))));\n\nconst reversed = reverseLinkedList(head);\n// Output: 5 -> 4 -> 3 -> 2 -> 1\n\n// Helper function to print list\nfunction printList(head) {\n  let current = head;\n  const values = [];\n  while (current) {\n    values.push(current.val);\n    current = current.next;\n  }\n  console.log(values.join('' -> ''));\n}\n\nprintList(reversed); // 5 -> 4 -> 3 -> 2 -> 1",
    "caption": "Iterative approach using three pointers to reverse the linked list in-place with O(1) space complexity."
  }'::jsonb
WHERE company_name = 'HCL' AND question = 'Reverse a linked list';

-- HCL: Find missing number
UPDATE company_topic_questions
SET 
  explanation_text = E'# Find Missing Number in Array\n\nGiven an array containing n distinct numbers from 0 to n, find the one missing number.\n\n## Approaches:\n\n### Method 1: Sum Formula\n- Calculate expected sum: n * (n + 1) / 2\n- Calculate actual sum of array\n- Difference is the missing number\n- Time: O(n), Space: O(1)\n\n### Method 2: XOR\n- XOR all numbers from 0 to n\n- XOR all array elements\n- Result is missing number (XOR properties)\n- Time: O(n), Space: O(1)\n\n### Method 3: Hash Set\n- Add all array elements to set\n- Check which number from 0 to n is missing\n- Time: O(n), Space: O(n)',
  content_type = 'code',
  content_data = '{
    "language": "javascript",
    "code": "// Method 1: Sum Formula (Most Intuitive)\nfunction missingNumber(nums) {\n  const n = nums.length;\n  const expectedSum = (n * (n + 1)) / 2;\n  const actualSum = nums.reduce((sum, num) => sum + num, 0);\n  return expectedSum - actualSum;\n}\n\n// Method 2: XOR (Clever bit manipulation)\nfunction missingNumberXOR(nums) {\n  let xor = nums.length;\n  for (let i = 0; i < nums.length; i++) {\n    xor ^= i ^ nums[i];\n  }\n  return xor;\n}\n\n// Method 3: Hash Set\nfunction missingNumberSet(nums) {\n  const set = new Set(nums);\n  for (let i = 0; i <= nums.length; i++) {\n    if (!set.has(i)) {\n      return i;\n    }\n  }\n  return -1;\n}\n\n// Test cases:\nconsole.log(missingNumber([3, 0, 1]));           // 2\nconsole.log(missingNumber([0, 1]));              // 2\nconsole.log(missingNumber([9,6,4,2,3,5,7,0,1])); // 8\nconsole.log(missingNumber([0]));                 // 1\n\n// Why XOR works:\n// XOR properties: a ^ a = 0, a ^ 0 = a\n// If we XOR all numbers 0 to n and all array elements,\n// all present numbers cancel out, leaving only the missing one",
    "caption": "Three approaches: Sum formula is most intuitive, XOR is most elegant, Hash set is straightforward but uses extra space."
  }'::jsonb
WHERE company_name = 'HCL' AND question = 'Find the missing number in an array';

-- HCL: Binary Search
UPDATE company_topic_questions
SET 
  explanation_text = E'# Binary Search Implementation\n\nBinary search is an efficient algorithm for finding a target value in a sorted array by repeatedly dividing the search interval in half.\n\n## Algorithm:\n\n1. Start with left = 0, right = array.length - 1\n2. While left <= right:\n   - Calculate mid = left + (right - left) / 2\n   - If array[mid] == target, return mid\n   - If array[mid] < target, search right half (left = mid + 1)\n   - If array[mid] > target, search left half (right = mid - 1)\n3. If not found, return -1\n\n## Time Complexity: O(log n)\n## Space Complexity: O(1) iterative, O(log n) recursive\n\n## Prerequisites:\n- Array MUST be sorted\n- Random access to elements',
  content_type = 'code',
  content_data = '{
    "language": "javascript",
    "code": "// Iterative Binary Search (Recommended)\nfunction binarySearch(arr, target) {\n  let left = 0;\n  let right = arr.length - 1;\n  \n  while (left <= right) {\n    // Avoid overflow: use left + (right - left) / 2\n    const mid = Math.floor(left + (right - left) / 2);\n    \n    if (arr[mid] === target) {\n      return mid; // Found!\n    } else if (arr[mid] < target) {\n      left = mid + 1; // Search right half\n    } else {\n      right = mid - 1; // Search left half\n    }\n  }\n  \n  return -1; // Not found\n}\n\n// Recursive Binary Search\nfunction binarySearchRecursive(arr, target, left = 0, right = arr.length - 1) {\n  if (left > right) {\n    return -1; // Base case: not found\n  }\n  \n  const mid = Math.floor(left + (right - left) / 2);\n  \n  if (arr[mid] === target) {\n    return mid;\n  } else if (arr[mid] < target) {\n    return binarySearchRecursive(arr, target, mid + 1, right);\n  } else {\n    return binarySearchRecursive(arr, target, left, mid - 1);\n  }\n}\n\n// Test cases:\nconst sortedArray = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19];\n\nconsole.log(binarySearch(sortedArray, 7));   // 3\nconsole.log(binarySearch(sortedArray, 1));   // 0\nconsole.log(binarySearch(sortedArray, 19));  // 9\nconsole.log(binarySearch(sortedArray, 10));  // -1 (not found)\n\n// Comparison with Linear Search:\n// Linear: O(n) - checks every element\n// Binary: O(log n) - halves search space each time\n// For 1 million elements: Linear = 1M checks, Binary = 20 checks!",
    "caption": "Binary search is extremely efficient for sorted arrays. Iterative version avoids recursion overhead."
  }'::jsonb
WHERE company_name = 'HCL' AND question = 'Binary Search implementation';

-- TCS: Reverse string
UPDATE company_topic_questions
SET 
  explanation_text = E'# Reverse a String Without Built-in Functions\n\nReverse a string using only basic operations (no .reverse(), .split(), etc.)\n\n## Approaches:\n\n### Method 1: Two Pointers\n- Convert to array\n- Use two pointers (start and end)\n- Swap characters\n- Time: O(n), Space: O(n)\n\n### Method 2: Stack\n- Push all characters onto stack\n- Pop to build reversed string\n- Time: O(n), Space: O(n)\n\n### Method 3: Recursion\n- Take last character + reverse of remaining\n- Time: O(n), Space: O(n) call stack',
  content_type = 'code',
  content_data = '{
    "language": "javascript",
    "code": "// Method 1: Two Pointers (Most Efficient)\nfunction reverseString(str) {\n  const arr = str.split(''''); // Convert to array\n  let left = 0;\n  let right = arr.length - 1;\n  \n  while (left < right) {\n    // Swap characters\n    [arr[left], arr[right]] = [arr[right], arr[left]];\n    left++;\n    right--;\n  }\n  \n  return arr.join('''');\n}\n\n// Method 2: Manual Loop (No built-ins at all)\nfunction reverseStringManual(str) {\n  let reversed = '''';\n  for (let i = str.length - 1; i >= 0; i--) {\n    reversed += str[i];\n  }\n  return reversed;\n}\n\n// Method 3: Recursion\nfunction reverseStringRecursive(str) {\n  if (str === '''') return '''';\n  return str[str.length - 1] + reverseStringRecursive(str.slice(0, -1));\n}\n\n// Method 4: Stack Approach\nfunction reverseStringStack(str) {\n  const stack = [];\n  \n  // Push all characters\n  for (let char of str) {\n    stack.push(char);\n  }\n  \n  // Pop to build reversed string\n  let reversed = '''';\n  while (stack.length > 0) {\n    reversed += stack.pop();\n  }\n  \n  return reversed;\n}\n\n// Test cases:\nconsole.log(reverseString(''hello''));     // ''olleh''\nconsole.log(reverseString(''TCS''));       // ''SCT''\nconsole.log(reverseString(''a''));         // ''a''\nconsole.log(reverseString(''''));          // ''''\nconsole.log(reverseString(''12345''));     // ''54321''",
    "caption": "Multiple approaches to reverse a string. Two-pointer method is most efficient. Manual loop uses no built-in functions at all."
  }'::jsonb
WHERE company_name = 'TCS' AND question = 'Reverse a string without using built-in functions';

-- TCS: Check if string is palindrome
UPDATE company_topic_questions
SET 
  explanation_text = E'# Check if String is Palindrome\n\nA palindrome is a string that reads the same backward as forward (e.g., "racecar", "madam").\n\n## Approach:\n\n### Two Pointer Method\n1. Use two pointers: one at start, one at end\n2. Compare characters at both pointers\n3. If they don''t match, it''s not a palindrome\n4. Move pointers toward center\n5. If all characters match, it''s a palindrome\n\n## Time Complexity: O(n)\n## Space Complexity: O(1)\n\n## Edge Cases:\n- Empty string (considered palindrome)\n- Single character (always palindrome)\n- Case sensitivity (usually ignore case)\n- Spaces and special characters (usually ignore)',
  content_type = 'code',
  content_data = '{
    "language": "javascript",
    "code": "function isPalindrome(str) {\n  // Clean the string: remove spaces, convert to lowercase\n  const cleaned = str.toLowerCase().replace(/[^a-z0-9]/g, '''');\n  \n  // Two pointer approach\n  let left = 0;\n  let right = cleaned.length - 1;\n  \n  while (left < right) {\n    if (cleaned[left] !== cleaned[right]) {\n      return false;\n    }\n    left++;\n    right--;\n  }\n  \n  return true;\n}\n\n// Test cases:\nconsole.log(isPalindrome(''racecar''));        // true\nconsole.log(isPalindrome(''hello''));          // false\nconsole.log(isPalindrome(''A man a plan a canal Panama'')); // true\nconsole.log(isPalindrome(''Was it a car or a cat I saw?'')); // true\nconsole.log(isPalindrome(''''));               // true (empty string)\nconsole.log(isPalindrome(''a''));              // true (single char)\n\n// Alternative: Reverse and compare\nfunction isPalindromeAlt(str) {\n  const cleaned = str.toLowerCase().replace(/[^a-z0-9]/g, '''');\n  const reversed = cleaned.split('''').reverse().join('''');\n  return cleaned === reversed;\n}",
    "caption": "Two-pointer approach is more efficient than reversing the string. Handles case insensitivity and special characters."
  }'::jsonb
WHERE company_name = 'TCS' AND question = 'Check if a string is a palindrome';

-- Infosys: Fibonacci Series
UPDATE company_topic_questions
SET 
  explanation_text = E'# Fibonacci Series Using Recursion\n\nThe Fibonacci sequence is a series where each number is the sum of the two preceding ones: 0, 1, 1, 2, 3, 5, 8, 13, 21...\n\n## Formula:\nF(n) = F(n-1) + F(n-2)\nBase cases: F(0) = 0, F(1) = 1\n\n## Approaches:\n\n### 1. Recursive (Simple but Inefficient)\n- Time: O(2^n) - exponential\n- Space: O(n) - call stack\n- Many repeated calculations\n\n### 2. Memoization (Top-Down DP)\n- Time: O(n)\n- Space: O(n)\n- Cache results to avoid recalculation\n\n### 3. Iterative (Most Efficient)\n- Time: O(n)\n- Space: O(1)\n- Bottom-up approach',
  content_type = 'code',
  content_data = '{
    "language": "javascript",
    "code": "// Method 1: Simple Recursion (Inefficient for large n)\nfunction fibonacciRecursive(n) {\n  if (n <= 1) return n;\n  return fibonacciRecursive(n - 1) + fibonacciRecursive(n - 2);\n}\n\n// Method 2: Recursion with Memoization (Efficient)\nfunction fibonacciMemo(n, memo = {}) {\n  if (n in memo) return memo[n];\n  if (n <= 1) return n;\n  \n  memo[n] = fibonacciMemo(n - 1, memo) + fibonacciMemo(n - 2, memo);\n  return memo[n];\n}\n\n// Method 3: Iterative (Most Efficient)\nfunction fibonacciIterative(n) {\n  if (n <= 1) return n;\n  \n  let prev = 0, curr = 1;\n  \n  for (let i = 2; i <= n; i++) {\n    let next = prev + curr;\n    prev = curr;\n    curr = next;\n  }\n  \n  return curr;\n}\n\n// Generate first n Fibonacci numbers\nfunction generateFibonacci(n) {\n  const result = [];\n  for (let i = 0; i < n; i++) {\n    result.push(fibonacciIterative(i));\n  }\n  return result;\n}\n\n// Examples:\nconsole.log(fibonacciRecursive(10));  // 55\nconsole.log(fibonacciMemo(10));       // 55\nconsole.log(fibonacciIterative(10));  // 55\nconsole.log(generateFibonacci(10));   // [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]",
    "caption": "Three approaches to Fibonacci: simple recursion (slow), memoization (faster), and iterative (fastest and most space-efficient)."
  }'::jsonb
WHERE company_name = 'Infosys' AND question = 'Fibonacci Series using recursion';

-- ============================================================================
-- SQL QUESTIONS WITH EXAMPLES
-- ============================================================================

-- HCL: Second highest salary
UPDATE company_topic_questions
SET 
  explanation_text = E'# Find Second Highest Salary\n\nThis is a common SQL interview question that tests your understanding of subqueries, LIMIT, and DISTINCT.\n\n## Approaches:\n\n### Method 1: Using LIMIT and OFFSET\n- Sort salaries in descending order\n- Skip the first (highest) and get the next\n- Use DISTINCT to handle duplicates\n\n### Method 2: Using Subquery\n- Find MAX salary that is less than the overall MAX\n\n### Method 3: Using DENSE_RANK()\n- Assign ranks to salaries\n- Filter for rank = 2\n\n## Edge Cases:\n- What if there''s no second highest? (Return NULL)\n- What if all salaries are the same?\n- Duplicate salary values',
  content_type = 'code',
  content_data = '{
    "language": "sql",
    "code": "-- Method 1: Using LIMIT and OFFSET (MySQL, PostgreSQL)\nSELECT DISTINCT salary\nFROM Employee\nORDER BY salary DESC\nLIMIT 1 OFFSET 1;\n\n-- Method 2: Using Subquery (Works in all databases)\nSELECT MAX(salary) AS SecondHighestSalary\nFROM Employee\nWHERE salary < (SELECT MAX(salary) FROM Employee);\n\n-- Method 3: Using DENSE_RANK (Handles duplicates well)\nSELECT salary AS SecondHighestSalary\nFROM (\n  SELECT salary, DENSE_RANK() OVER (ORDER BY salary DESC) as rank\n  FROM Employee\n) ranked\nWHERE rank = 2;\n\n-- Method 4: Using COALESCE for NULL handling\nSELECT COALESCE(\n  (SELECT DISTINCT salary\n   FROM Employee\n   ORDER BY salary DESC\n   LIMIT 1 OFFSET 1),\n  NULL\n) AS SecondHighestSalary;\n\n-- Example data:\n-- Employee table:\n-- | id | name  | salary |\n-- |----|-------|--------|\n-- | 1  | Alice | 100000 |\n-- | 2  | Bob   | 80000  |\n-- | 3  | Carol | 90000  |\n-- | 4  | Dave  | 80000  |\n\n-- Result: 90000 (Carol''s salary)",
    "caption": "Multiple approaches to find second highest salary. Method 1 is simplest, Method 3 handles duplicates best."
  }'::jsonb
WHERE company_name = 'HCL' AND question = 'Select second highest salary from Employee table';

-- HCL: INNER JOIN vs LEFT JOIN
UPDATE company_topic_questions
SET 
  explanation_text = E'# INNER JOIN vs LEFT JOIN\n\nJOINs are used to combine rows from two or more tables based on a related column.\n\n## INNER JOIN\n- Returns only matching rows from both tables\n- If no match, row is excluded\n- Most restrictive JOIN\n- Use when you only want records that exist in both tables\n\n## LEFT JOIN (LEFT OUTER JOIN)\n- Returns ALL rows from left table\n- Returns matching rows from right table\n- If no match, NULL values for right table columns\n- Use when you want all records from left table regardless of matches\n\n## Key Differences:\n\n| Aspect | INNER JOIN | LEFT JOIN |\n|--------|-----------|----------|\n| Rows returned | Only matches | All from left + matches |\n| NULL values | No | Yes (for non-matches) |\n| Use case | Strict matching | Keep all left records |',
  content_type = 'code',
  content_data = '{
    "language": "sql",
    "code": "-- Sample Tables:\n-- Employees:\n-- | emp_id | name  | dept_id |\n-- |--------|-------|------|\n-- | 1      | Alice | 10   |\n-- | 2      | Bob   | 20   |\n-- | 3      | Carol | NULL |\n\n-- Departments:\n-- | dept_id | dept_name |\n-- |---------|----------|\n-- | 10      | Sales    |\n-- | 20      | IT       |\n-- | 30      | HR       |\n\n-- INNER JOIN: Only employees with departments\nSELECT \n  e.name,\n  d.dept_name\nFROM Employees e\nINNER JOIN Departments d ON e.dept_id = d.dept_id;\n\n-- Result:\n-- | name  | dept_name |\n-- |-------|----------|\n-- | Alice | Sales    |\n-- | Bob   | IT       |\n-- Carol is excluded (no dept_id)\n-- HR department is excluded (no employees)\n\n-- LEFT JOIN: All employees, with or without departments\nSELECT \n  e.name,\n  d.dept_name\nFROM Employees e\nLEFT JOIN Departments d ON e.dept_id = d.dept_id;\n\n-- Result:\n-- | name  | dept_name |\n-- |-------|----------|\n-- | Alice | Sales    |\n-- | Bob   | IT       |\n-- | Carol | NULL     |\n-- Carol is included with NULL dept_name\n\n-- Find employees WITHOUT a department (LEFT JOIN + NULL check)\nSELECT e.name\nFROM Employees e\nLEFT JOIN Departments d ON e.dept_id = d.dept_id\nWHERE d.dept_id IS NULL;\n-- Result: Carol",
    "caption": "INNER JOIN returns only matches. LEFT JOIN returns all left table rows plus matches. Use LEFT JOIN to find missing relationships."
  }'::jsonb
WHERE company_name = 'HCL' AND question = 'Explain INNER JOIN vs LEFT JOIN';

-- ============================================================================
-- APTITUDE QUESTIONS WITH DETAILED SOLUTIONS
-- ============================================================================

-- HCL: Train speed problem
UPDATE company_topic_questions
SET 
  explanation_text = E'# Train Speed and Distance Problem\n\nA classic speed, distance, and time problem involving trains.\n\n## Problem:\nTrain A moves at 60 km/h. If it travels for a certain time, calculate distance, time, or speed based on given information.\n\n## Fundamental Formula:\n**Distance = Speed × Time**\n\nFrom this, we can derive:\n- **Speed = Distance / Time**\n- **Time = Distance / Speed**\n\n## Common Problem Types:\n\n### 1. Two trains moving toward each other\n- Relative speed = Speed₁ + Speed₂\n- Time to meet = Distance / (Speed₁ + Speed₂)\n\n### 2. Two trains moving in same direction\n- Relative speed = |Speed₁ - Speed₂|\n- Time for faster to overtake = Distance / |Speed₁ - Speed₂|\n\n### 3. Train crossing a platform/bridge\n- Distance = Length of train + Length of platform\n- Time = Total distance / Speed\n\n## Unit Conversion:\n- km/h to m/s: multiply by 5/18\n- m/s to km/h: multiply by 18/5',
  content_type = 'code',
  content_data = '{
    "language": "javascript",
    "code": "// Example 1: Train A at 60 km/h travels for 3 hours\nfunction calculateDistance(speed, time) {\n  return speed * time;\n}\n\nconst speedA = 60; // km/h\nconst time = 3;    // hours\nconst distance = calculateDistance(speedA, time);\nconsole.log(`Distance traveled: ${distance} km`); // 180 km\n\n// Example 2: Two trains meeting\n// Train A: 60 km/h, Train B: 40 km/h, Distance apart: 500 km\nfunction timeToMeet(speed1, speed2, distance) {\n  const relativeSpeed = speed1 + speed2;\n  return distance / relativeSpeed;\n}\n\nconst trainA = 60;  // km/h\nconst trainB = 40;  // km/h\nconst distanceApart = 500; // km\nconst meetTime = timeToMeet(trainA, trainB, distanceApart);\nconsole.log(`Trains will meet in: ${meetTime} hours`); // 5 hours\n\n// Example 3: Train crossing a bridge\n// Train length: 200m, Bridge length: 300m, Speed: 60 km/h\nfunction timeToCrossBridge(trainLength, bridgeLength, speedKmh) {\n  const totalDistance = trainLength + bridgeLength; // meters\n  const speedMs = speedKmh * (5/18); // convert km/h to m/s\n  return totalDistance / speedMs; // seconds\n}\n\nconst trainLen = 200;   // meters\nconst bridgeLen = 300;  // meters\nconst speed = 60;       // km/h\nconst crossTime = timeToCrossBridge(trainLen, bridgeLen, speed);\nconsole.log(`Time to cross bridge: ${crossTime.toFixed(2)} seconds`); // 30 seconds\n\n// Example 4: Relative speed (same direction)\n// Fast train: 80 km/h, Slow train: 60 km/h\nfunction overtakeTime(fastSpeed, slowSpeed, distance) {\n  const relativeSpeed = fastSpeed - slowSpeed;\n  return distance / relativeSpeed;\n}\n\nconst fast = 80;   // km/h\nconst slow = 60;   // km/h\nconst gap = 100;   // km\nconst overtake = overtakeTime(fast, slow, gap);\nconsole.log(`Fast train overtakes in: ${overtake} hours`); // 5 hours",
    "caption": "Common train problems solved with JavaScript. Remember: Distance = Speed × Time. For trains moving toward each other, add speeds; same direction, subtract speeds."
  }'::jsonb
WHERE company_name = 'HCL' AND topic = 'Aptitude' AND question LIKE 'Train A moves at 60km/h%';

-- HCL: Work and Time problem
UPDATE company_topic_questions
SET 
  explanation_text = E'# Work and Time Problem\n\nA can complete work in 10 days. Find how long it takes for A and B together, or other variations.\n\n## Fundamental Concepts:\n\n### Work Rate\n- If A can do work in 10 days, A''s rate = 1/10 work per day\n- If B can do work in 15 days, B''s rate = 1/15 work per day\n\n### Combined Work\n- When working together: Combined rate = Rate₁ + Rate₂\n- Time = Total work / Combined rate\n\n## Common Problem Types:\n\n### 1. Two people working together\nIf A does work in ''a'' days and B in ''b'' days:\n- Combined rate = 1/a + 1/b\n- Time together = 1 / (1/a + 1/b) = (a × b) / (a + b)\n\n### 2. One person leaves midway\n- Calculate work done by both together\n- Calculate remaining work\n- Calculate time for remaining person\n\n### 3. Efficiency comparison\n- If A is twice as efficient as B, A''s rate = 2 × B''s rate\n\n## Key Formula:\n**Work = Rate × Time**\n\nTotal work is usually considered as 1 (or 100%)',
  content_type = 'code',
  content_data = '{
    "language": "javascript",
    "code": "// Example 1: A can do work in 10 days, B in 15 days\n// How long will they take together?\nfunction workTogether(daysA, daysB) {\n  const rateA = 1 / daysA;\n  const rateB = 1 / daysB;\n  const combinedRate = rateA + rateB;\n  return 1 / combinedRate;\n}\n\nconst aDays = 10;\nconst bDays = 15;\nconst together = workTogether(aDays, bDays);\nconsole.log(`A and B together: ${together} days`); // 6 days\n\n// Shortcut formula: (a × b) / (a + b)\nconst togetherShortcut = (aDays * bDays) / (aDays + bDays);\nconsole.log(`Using shortcut: ${togetherShortcut} days`); // 6 days\n\n// Example 2: A, B, and C working together\n// A: 10 days, B: 15 days, C: 20 days\nfunction workThreePeople(daysA, daysB, daysC) {\n  const rateA = 1 / daysA;\n  const rateB = 1 / daysB;\n  const rateC = 1 / daysC;\n  const combinedRate = rateA + rateB + rateC;\n  return 1 / combinedRate;\n}\n\nconst cDays = 20;\nconst allTogether = workThreePeople(aDays, bDays, cDays);\nconsole.log(`A, B, and C together: ${allTogether.toFixed(2)} days`); // 4.62 days\n\n// Example 3: A and B work for 3 days, then A leaves\n// How long will B take to finish remaining work?\nfunction workWithLeaving(daysA, daysB, daysTogether) {\n  const rateA = 1 / daysA;\n  const rateB = 1 / daysB;\n  const combinedRate = rateA + rateB;\n  \n  // Work done together\n  const workDone = combinedRate * daysTogether;\n  \n  // Remaining work\n  const remainingWork = 1 - workDone;\n  \n  // Time for B to finish alone\n  return remainingWork / rateB;\n}\n\nconst daysWorkedTogether = 3;\nconst bAlone = workWithLeaving(aDays, bDays, daysWorkedTogether);\nconsole.log(`B needs ${bAlone.toFixed(2)} more days`); // 7.5 days\n\n// Example 4: A is twice as efficient as B\n// B takes 20 days, how long for A?\nfunction efficientWorker(slowDays, efficiency) {\n  return slowDays / efficiency;\n}\n\nconst bSlow = 20;\nconst aFast = efficientWorker(bSlow, 2);\nconsole.log(`A (twice as efficient) takes: ${aFast} days`); // 10 days",
    "caption": "Work and Time problems solved systematically. Key: Work = Rate × Time. Combined rate = sum of individual rates. Use 1 as total work for easier calculation."
  }'::jsonb
WHERE company_name = 'HCL' AND topic = 'Aptitude' AND question LIKE 'Work and Time problem%';

-- ============================================================================
-- CORE CS QUESTIONS WITH DETAILED EXPLANATIONS
-- ============================================================================

-- HCL: Process vs Thread
UPDATE company_topic_questions
SET 
  explanation_text = E'# Difference Between Process and Thread\n\nProcesses and threads are fundamental concepts in operating systems for concurrent execution.\n\n## Process\n\nA **process** is an independent execution unit with its own memory space.\n\n### Characteristics:\n- Has its own address space (code, data, heap, stack)\n- Independent execution\n- Isolated from other processes\n- Heavy-weight (more resources)\n- Inter-process communication (IPC) is complex\n- Creating/switching is expensive\n\n## Thread\n\nA **thread** is a lightweight unit of execution within a process.\n\n### Characteristics:\n- Shares memory space with other threads in same process\n- Shares code, data, and heap\n- Has its own stack and registers\n- Light-weight (fewer resources)\n- Communication is easier (shared memory)\n- Creating/switching is faster\n\n## Key Differences:\n\n| Aspect | Process | Thread |\n|--------|---------|--------|\n| Memory | Separate address space | Shared address space |\n| Communication | IPC (pipes, sockets) | Shared memory |\n| Creation time | Slow | Fast |\n| Context switching | Expensive | Cheap |\n| Isolation | High | Low |\n| Resource usage | Heavy | Light |\n| Crash impact | Isolated | Affects all threads |\n\n## When to Use:\n\n**Processes**: When you need isolation, security, or running different programs\n\n**Threads**: When you need parallelism within same application, shared data access',
  content_type = 'code',
  content_data = '{
    "language": "javascript",
    "code": "// Example: Process vs Thread in Node.js\n\n// PROCESS Example: Using child_process to create separate process\nconst { fork } = require(''child_process'');\n\n// Main process\nfunction createProcess() {\n  const child = fork(''worker.js'');\n  \n  // Send message to child process\n  child.send({ task: ''calculate'', data: [1, 2, 3, 4, 5] });\n  \n  // Receive message from child\n  child.on(''message'', (result) => {\n    console.log(''Process result:'', result);\n  });\n}\n\n// worker.js (separate process)\nprocess.on(''message'', (msg) => {\n  const sum = msg.data.reduce((a, b) => a + b, 0);\n  process.send({ result: sum });\n});\n\n// THREAD Example: Using worker_threads\nconst { Worker } = require(''worker_threads'');\n\nfunction createThread() {\n  const worker = new Worker(`\n    const { parentPort, workerData } = require(''worker_threads'');\n    const sum = workerData.reduce((a, b) => a + b, 0);\n    parentPort.postMessage({ result: sum });\n  `, { \n    eval: true,\n    workerData: [1, 2, 3, 4, 5]\n  });\n  \n  worker.on(''message'', (result) => {\n    console.log(''Thread result:'', result);\n  });\n}\n\n// Comparison:\n// Process:\n// - Separate memory space\n// - More overhead\n// - Better isolation\n// - Crash doesn''t affect main process\n\n// Thread:\n// - Shared memory space\n// - Less overhead\n// - Faster communication\n// - Crash can affect entire process\n\n// Real-world example: Web browser\n// - Each tab = separate process (isolation, security)\n// - Within tab: multiple threads (rendering, JavaScript, etc.)\n\n// Multi-threading example\nclass TaskRunner {\n  constructor() {\n    this.sharedData = { count: 0 }; // Shared among threads\n  }\n  \n  runInThread(task) {\n    const worker = new Worker(`\n      const { parentPort, workerData } = require(''worker_threads'');\n      // Thread can access shared data (in real implementation)\n      parentPort.postMessage({ done: true });\n    `, { eval: true });\n    \n    return new Promise((resolve) => {\n      worker.on(''message'', resolve);\n    });\n  }\n}\n\n// Process isolation example\nclass ProcessManager {\n  runInProcess(script) {\n    const child = fork(script);\n    // Each process has its own memory\n    // Cannot directly access parent''s variables\n    return child;\n  }\n}",
    "caption": "Process = separate program with own memory. Thread = lightweight execution unit sharing memory. Use processes for isolation, threads for parallelism within same app."
  }'::jsonb
WHERE company_name = 'HCL' AND question = 'What is the difference between Process and Thread?';

-- HCL: ACID Properties
UPDATE company_topic_questions
SET 
  explanation_text = E'# ACID Properties in DBMS\n\nACID is an acronym for four critical properties that guarantee reliable database transactions.\n\n## A - Atomicity\n\n**All or Nothing**: A transaction is treated as a single, indivisible unit.\n\n- Either all operations succeed, or none do\n- No partial updates\n- If any operation fails, entire transaction is rolled back\n- Example: Bank transfer - both debit and credit must happen, or neither\n\n## C - Consistency\n\n**Valid State to Valid State**: Database remains in a consistent state before and after transaction.\n\n- All constraints, triggers, and rules are maintained\n- Data integrity is preserved\n- Example: Account balance cannot be negative (constraint maintained)\n\n## I - Isolation\n\n**Concurrent Transactions Don''t Interfere**: Transactions execute as if they''re the only ones running.\n\n- Prevents dirty reads, non-repeatable reads, phantom reads\n- Achieved through locking mechanisms\n- Isolation levels: Read Uncommitted, Read Committed, Repeatable Read, Serializable\n- Example: Two people booking last seat - only one succeeds\n\n## D - Durability\n\n**Permanent Changes**: Once committed, changes survive system failures.\n\n- Data is written to non-volatile storage\n- Survives crashes, power failures\n- Achieved through transaction logs, write-ahead logging\n- Example: After ATM withdrawal confirmation, money deducted even if system crashes\n\n## Why ACID Matters:\n\n✅ Data integrity in critical systems (banking, healthcare)\n✅ Prevents data corruption\n✅ Ensures reliability\n✅ Maintains consistency across concurrent operations',
  content_type = 'code',
  content_data = '{
    "language": "sql",
    "code": "-- ACID Properties Demonstration\n\n-- Example 1: ATOMICITY\n-- Bank transfer: $500 from Account A to Account B\nBEGIN TRANSACTION;\n\n  -- Debit from Account A\n  UPDATE accounts \n  SET balance = balance - 500 \n  WHERE account_id = ''A'';\n  \n  -- Credit to Account B\n  UPDATE accounts \n  SET balance = balance + 500 \n  WHERE account_id = ''B'';\n  \n  -- If any operation fails, ROLLBACK (Atomicity)\n  -- If all succeed, COMMIT\n  \nCOMMIT; -- Both operations succeed together\n-- OR\nROLLBACK; -- Both operations fail together\n\n-- Example 2: CONSISTENCY\n-- Constraint: Balance cannot be negative\nBEGIN TRANSACTION;\n\n  UPDATE accounts \n  SET balance = balance - 1000 \n  WHERE account_id = ''A'';\n  \n  -- If balance becomes negative, constraint violation\n  -- Transaction automatically rolls back\n  -- Database remains consistent\n  \nCOMMIT;\n\n-- Example 3: ISOLATION\n-- Two concurrent transactions\n\n-- Transaction 1:\nBEGIN TRANSACTION;\n  SELECT balance FROM accounts WHERE account_id = ''A'' FOR UPDATE;\n  -- Lock acquired, other transactions must wait\n  UPDATE accounts SET balance = balance - 100 WHERE account_id = ''A'';\nCOMMIT;\n\n-- Transaction 2 (runs concurrently):\nBEGIN TRANSACTION;\n  SELECT balance FROM accounts WHERE account_id = ''A'' FOR UPDATE;\n  -- Waits for Transaction 1 to complete (Isolation)\n  UPDATE accounts SET balance = balance - 50 WHERE account_id = ''A'';\nCOMMIT;\n\n-- Example 4: DURABILITY\n-- E-commerce order\nBEGIN TRANSACTION;\n\n  -- Reduce inventory\n  UPDATE inventory \n  SET quantity = quantity - 1 \n  WHERE product_id = 101;\n  \n  -- Create order\n  INSERT INTO orders (customer_id, product_id, amount)\n  VALUES (1001, 101, 99.99);\n  \n  COMMIT; -- Changes are now DURABLE\n  \n-- Even if system crashes after COMMIT,\n-- the inventory reduction and order creation persist\n\n-- Real-world ACID example: Online ticket booking\nBEGIN TRANSACTION;\n\n  -- Check seat availability\n  SELECT status FROM seats WHERE seat_id = ''A1'' FOR UPDATE;\n  \n  IF status = ''available'' THEN\n    -- Book the seat\n    UPDATE seats SET status = ''booked'', customer_id = 123 WHERE seat_id = ''A1'';\n    \n    -- Create booking record\n    INSERT INTO bookings (customer_id, seat_id, booking_time)\n    VALUES (123, ''A1'', NOW());\n    \n    -- Charge payment\n    INSERT INTO payments (customer_id, amount, status)\n    VALUES (123, 50.00, ''completed'');\n    \n    COMMIT; -- All operations succeed (Atomicity)\n    -- Changes are permanent (Durability)\n  ELSE\n    ROLLBACK; -- Seat not available\n  END IF;\n  \n-- Isolation ensures two customers can''t book same seat\n-- Consistency ensures seat can''t be double-booked",
    "caption": "ACID ensures reliable transactions: Atomicity (all-or-nothing), Consistency (valid states), Isolation (no interference), Durability (permanent changes). Critical for banking, e-commerce, booking systems."
  }'::jsonb
WHERE company_name = 'HCL' AND question = 'Explain ACID properties in DBMS';

-- Summary comment
-- All HCL questions now have comprehensive content:
-- - 3 DSA questions (linked list, missing number, binary search)
-- - 2 Aptitude questions (train speed, work and time)
-- - 2 SQL questions (second highest salary, INNER JOIN vs LEFT JOIN)
-- - 2 Core CS questions (process vs thread, ACID properties)
-- Total: 9 HCL questions with detailed explanations and code examples

