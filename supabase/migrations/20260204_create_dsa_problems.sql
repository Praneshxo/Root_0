-- Create DSA categories table
CREATE TABLE IF NOT EXISTS dsa_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text,
  icon text,
  created_at timestamptz DEFAULT now()
);

-- Create DSA problems table
CREATE TABLE IF NOT EXISTS dsa_problems (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  difficulty text NOT NULL CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
  category_id uuid REFERENCES dsa_categories(id) ON DELETE SET NULL,
  solution_text text,
  hints text[],
  companies text[],
  created_at timestamptz DEFAULT now()
);

-- Create user DSA progress table
CREATE TABLE IF NOT EXISTS user_dsa_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  problem_id uuid NOT NULL REFERENCES dsa_problems(id) ON DELETE CASCADE,
  solved boolean DEFAULT false,
  revision boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, problem_id)
);

-- Enable RLS
ALTER TABLE dsa_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE dsa_problems ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_dsa_progress ENABLE ROW LEVEL SECURITY;

-- Policies for dsa_categories (public read)
CREATE POLICY "Anyone can view DSA categories"
  ON dsa_categories FOR SELECT
  TO authenticated
  USING (true);

-- Policies for dsa_problems (public read)
CREATE POLICY "Anyone can view DSA problems"
  ON dsa_problems FOR SELECT
  TO authenticated
  USING (true);

-- Policies for user_dsa_progress
CREATE POLICY "Users can view own DSA progress"
  ON user_dsa_progress FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own DSA progress"
  ON user_dsa_progress FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own DSA progress"
  ON user_dsa_progress FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_dsa_problems_category ON dsa_problems(category_id);
CREATE INDEX IF NOT EXISTS idx_dsa_problems_difficulty ON dsa_problems(difficulty);
CREATE INDEX IF NOT EXISTS idx_user_dsa_progress_user ON user_dsa_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_dsa_progress_problem ON user_dsa_progress(problem_id);

-- Insert DSA categories
INSERT INTO dsa_categories (name, description, icon) VALUES
  ('Dynamic Programming', 'Problems involving optimal substructure and overlapping subproblems', '🎯'),
  ('Array', 'Array manipulation and traversal problems', '📊'),
  ('String', 'String processing and pattern matching', '📝'),
  ('Binary Search', 'Binary search and its variations', '🔍'),
  ('Linked List', 'Linked list operations and algorithms', '🔗'),
  ('Tree', 'Tree traversal and manipulation', '🌳'),
  ('Graph', 'Graph algorithms and traversal', '🕸️'),
  ('Stack and Queue', 'Stack and queue data structures', '📚'),
  ('Recursion', 'Recursive problem solving', '♻️'),
  ('Heap', 'Heap and priority queue problems', '⛰️'),
  ('Hash Table', 'Hashing and hash map problems', '#️⃣'),
  ('Sorting', 'Sorting algorithms and problems', '🔢'),
  ('Greedy', 'Greedy algorithm problems', '💰'),
  ('Backtracking', 'Backtracking and exhaustive search', '🔙'),
  ('Bit Manipulation', 'Bitwise operations', '💻')
ON CONFLICT (name) DO NOTHING;

-- Insert sample DSA problems
INSERT INTO dsa_problems (title, description, difficulty, category_id, solution_text, companies) VALUES
  (
    'Climbing Stairs',
    'You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top? This is a classic dynamic programming problem that can be solved with a simple iterative approach.',
    'Easy',
    (SELECT id FROM dsa_categories WHERE name = 'Dynamic Programming'),
    'This is a Fibonacci sequence problem. dp[i] = dp[i-1] + dp[i-2]. Base cases: dp[0] = 1, dp[1] = 1.',
    ARRAY['Amazon', 'Google', 'Microsoft']
  ),
  (
    'Coin Change',
    'You are given an integer array coins representing coins of different denominations and an integer amount representing a total amount of money. Return the fewest number of coins that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return -1. This is a classic dynamic programming problem; the optimal substructure and overlapping subproblems are evident.',
    'Medium',
    (SELECT id FROM dsa_categories WHERE name = 'Dynamic Programming'),
    'Use DP with dp[i] = min(dp[i], dp[i-coin] + 1) for each coin. Initialize dp[0] = 0 and others to infinity.',
    ARRAY['Amazon', 'Facebook', 'Apple']
  ),
  (
    'Longest Increasing Subsequence',
    'Given an integer array nums, return the length of the longest strictly increasing subsequence. A subsequence is a sequence that can be derived from an array by deleting some or no elements without changing the order of the remaining elements. This problem is another classic dynamic programming problem that can be solved with an O(n²) DP approach or a more advanced O(n log n) solution using binary search.',
    'Medium',
    (SELECT id FROM dsa_categories WHERE name = 'Dynamic Programming'),
    'DP approach: dp[i] represents length of LIS ending at i. For each i, check all j < i where nums[j] < nums[i].',
    ARRAY['Google', 'Amazon']
  ),
  (
    'House Robber',
    'You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed. The only constraint stopping you from robbing each house is that adjacent houses have security systems connected, and it will automatically contact the police if two adjacent houses are broken into on the same night. Given an integer array nums representing the amount of money in each house, return the maximum amount of money you can rob tonight without alerting the police.',
    'Medium',
    (SELECT id FROM dsa_categories WHERE name = 'Dynamic Programming'),
    'dp[i] = max(dp[i-1], dp[i-2] + nums[i]). Base cases: dp[0] = nums[0], dp[1] = max(nums[0], nums[1]).',
    ARRAY['Amazon', 'Microsoft']
  ),
  (
    'Unique Paths',
    'There is a robot on an m x n grid. The robot is initially located at the top-left corner (grid[0][0]). The robot can only move either down or right at any point in time. The robot is trying to reach the bottom-right corner (grid[m-1][n-1]). How many possible unique paths are there? This is a classic example of dynamic programming with a straightforward recursive definition. The problem is characterized by overlapping subproblems and optimal substructure. A common approach involves building a 2D DP table.',
    'Medium',
    (SELECT id FROM dsa_categories WHERE name = 'Dynamic Programming'),
    'dp[i][j] = dp[i-1][j] + dp[i][j-1]. Base case: dp[0][j] = 1, dp[i][0] = 1.',
    ARRAY['Google', 'Facebook']
  ),
  (
    'Longest Common Subsequence',
    'Find the length of the longest common subsequence between two strings. This is a classic dynamic programming problem with a straightforward recursive definition. The problem is characterized by overlapping subproblems and optimal substructure. A common approach involves building a 2D DP table.',
    'Medium',
    (SELECT id FROM dsa_categories WHERE name = 'Dynamic Programming'),
    'dp[i][j] = dp[i-1][j-1] + 1 if s1[i] == s2[j], else max(dp[i-1][j], dp[i][j-1]).',
    ARRAY['Amazon', 'Microsoft', 'Google']
  ),
  (
    'Word Break',
    'Given a string s and a dictionary of strings wordDict, return true if s can be segmented into a space-separated sequence of one or more dictionary words. The same word in the dictionary can be reused multiple times in the segmentation.',
    'Medium',
    (SELECT id FROM dsa_categories WHERE name = 'Dynamic Programming'),
    'Use DP where dp[i] = true if s[0:i] can be segmented. Check all substrings ending at i.',
    ARRAY['Google', 'Amazon', 'Facebook']
  ),
  (
    'Two Sum',
    'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
    'Easy',
    (SELECT id FROM dsa_categories WHERE name = 'Array'),
    'Use a hash map to store seen numbers and their indices. For each number, check if target - num exists in map.',
    ARRAY['Amazon', 'Google', 'Microsoft', 'Facebook']
  ),
  (
    'Best Time to Buy and Sell Stock',
    'You are given an array prices where prices[i] is the price of a given stock on the ith day. Maximize profit by choosing a single day to buy and a different day in the future to sell.',
    'Easy',
    (SELECT id FROM dsa_categories WHERE name = 'Array'),
    'Track minimum price seen so far and maximum profit. Update both as you iterate.',
    ARRAY['Amazon', 'Microsoft', 'Facebook']
  ),
  (
    'Maximum Subarray',
    'Given an integer array nums, find the contiguous subarray with the largest sum and return its sum.',
    'Medium',
    (SELECT id FROM dsa_categories WHERE name = 'Array'),
    'Kadane''s algorithm: currentSum = max(num, currentSum + num), maxSum = max(maxSum, currentSum).',
    ARRAY['Amazon', 'Google', 'Microsoft']
  ),
  (
    'Valid Parentheses',
    'Given a string s containing just the characters ''('', '')'', ''{'', ''}'', ''['' and '']'', determine if the input string is valid.',
    'Easy',
    (SELECT id FROM dsa_categories WHERE name = 'Stack and Queue'),
    'Use a stack. Push opening brackets, pop and match for closing brackets.',
    ARRAY['Amazon', 'Microsoft', 'Google']
  ),
  (
    'Reverse Linked List',
    'Given the head of a singly linked list, reverse the list, and return the reversed list.',
    'Easy',
    (SELECT id FROM dsa_categories WHERE name = 'Linked List'),
    'Iterative: Use three pointers (prev, curr, next). Recursive: Reverse rest and fix pointers.',
    ARRAY['Amazon', 'Microsoft', 'Facebook']
  ),
  (
    'Merge Two Sorted Lists',
    'Merge two sorted linked lists and return it as a sorted list.',
    'Easy',
    (SELECT id FROM dsa_categories WHERE name = 'Linked List'),
    'Use a dummy node. Compare values and link smaller node. Move pointer forward.',
    ARRAY['Amazon', 'Google', 'Microsoft']
  ),
  (
    'Binary Tree Inorder Traversal',
    'Given the root of a binary tree, return the inorder traversal of its nodes'' values.',
    'Easy',
    (SELECT id FROM dsa_categories WHERE name = 'Tree'),
    'Recursive: left -> root -> right. Iterative: Use stack, go left until null, pop and process, go right.',
    ARRAY['Amazon', 'Microsoft']
  ),
  (
    'Maximum Depth of Binary Tree',
    'Given the root of a binary tree, return its maximum depth.',
    'Easy',
    (SELECT id FROM dsa_categories WHERE name = 'Tree'),
    'Recursive: 1 + max(depth(left), depth(right)). Base case: null returns 0.',
    ARRAY['Amazon', 'Google', 'Facebook']
  ),
  (
    'Binary Search',
    'Given a sorted array and a target value, return the index if found, otherwise return -1.',
    'Easy',
    (SELECT id FROM dsa_categories WHERE name = 'Binary Search'),
    'Set left=0, right=n-1. While left<=right: mid=(left+right)/2, compare and adjust bounds.',
    ARRAY['Amazon', 'Microsoft', 'Google']
  ),
  (
    'Valid Anagram',
    'Given two strings s and t, return true if t is an anagram of s.',
    'Easy',
    (SELECT id FROM dsa_categories WHERE name = 'String'),
    'Count character frequencies using hash map or array. Compare counts.',
    ARRAY['Amazon', 'Facebook']
  ),
  (
    'Longest Palindromic Substring',
    'Given a string s, return the longest palindromic substring in s.',
    'Medium',
    (SELECT id FROM dsa_categories WHERE name = 'String'),
    'Expand around center for each position. Check both odd and even length palindromes.',
    ARRAY['Amazon', 'Microsoft', 'Google']
  ),
  (
    'Number of Islands',
    'Given a 2D grid of ''1''s (land) and ''0''s (water), count the number of islands.',
    'Medium',
    (SELECT id FROM dsa_categories WHERE name = 'Graph'),
    'Use DFS or BFS. For each unvisited land cell, increment count and mark all connected land.',
    ARRAY['Amazon', 'Google', 'Facebook']
  ),
  (
    'Course Schedule',
    'There are n courses. Some courses have prerequisites. Return true if you can finish all courses.',
    'Medium',
    (SELECT id FROM dsa_categories WHERE name = 'Graph'),
    'Detect cycle in directed graph using DFS with three states or topological sort using Kahn''s algorithm.',
    ARRAY['Amazon', 'Google']
  )
ON CONFLICT DO NOTHING;
