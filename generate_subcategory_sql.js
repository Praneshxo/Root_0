import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

const heuristics = {
    'DSA': [
        { sub: 'Dynamic Programming', keys: ['dynamic programming', 'dp table', 'dp approach', 'memoization', 'tabulation', 'knapsack', 'fibonacci sequence', 'longest common', 'minimum cost', 'maximum sum subarray', 'coin change', 'edit distance', 'matrix chain', 'partition equal'] },
        { sub: 'Backtracking', keys: ['backtracking', 'n-queens', 'sudoku', 'permutations', 'subsets', 'combination sum', 'word search', 'generate all', 'all possible', 'backtrack'] },
        { sub: 'Binary Search', keys: ['binary search', 'search in rotated', 'find minimum in rotated', 'peak element', 'kth smallest', 'search a 2d matrix', 'log n'] },
        { sub: 'Bit Manipulation', keys: ['bit manipulation', 'bitwise', 'xor', 'bit shift', 'set bit', 'clear bit', 'count bits', 'hamming', 'single number', 'power of two'] },
        { sub: 'Hash Table', keys: ['hash table', 'hashmap', 'hash map', 'frequency count', 'two sum', 'anagram', 'group anagram', 'longest consecutive', 'contains duplicate', 'hash set'] },
        { sub: 'Heap', keys: ['heap', 'priority queue', 'min heap', 'max heap', 'kth largest', 'kth smallest element', 'merge k sorted', 'top k frequent'] },
        { sub: 'Stack and Queue', keys: ['stack', 'queue', 'deque', 'monotonic', 'next greater element', 'valid parentheses', 'balanced parentheses', 'evaluate expression', 'min stack', 'implement queue'] },
        { sub: 'Greedy', keys: ['greedy', 'activity selection', 'job scheduling', 'fractional knapsack', 'huffman', 'interval scheduling', 'jump game', 'gas station', 'minimum number of arrows'] },
        { sub: 'Linked List', keys: ['linked list', 'singly linked', 'doubly linked', 'circular linked', 'reverse a linked', 'detect cycle', 'floyd', 'merge two sorted lists', 'delete nth node'] },
        { sub: 'Graph', keys: ['graph', 'bfs', 'dfs', 'topological sort', 'shortest path', 'dijkstra', 'bellman ford', 'minimum spanning', 'prim', 'kruskal', 'detect cycle in graph', 'connected components', 'adjacency'] },
        { sub: 'Tree', keys: ['tree', 'bst', 'binary search tree', 'binary tree', 'inorder', 'preorder', 'postorder', 'level order', 'height of tree', 'diameter', 'lowest common ancestor', 'trie', 'avl'] },
        { sub: 'Sorting', keys: ['sorting', 'merge sort', 'quick sort', 'heap sort', 'insertion sort', 'bubble sort', 'selection sort', 'radix sort', 'counting sort', 'sort an array'] },
        { sub: 'Recursion', keys: ['recursion', 'recursive', 'base case', 'divide and conquer', 'tower of hanoi', 'generate parentheses'] },
        { sub: 'String', keys: ['string', 'substring', 'palindrome', 'character', 'pattern matching', 'kmp', 'rabin-karp', 'longest palindromic', 'reverse string', 'valid palindrome', 'strstr'] },
        { sub: 'Array', keys: ['array', 'vector', 'matrix', 'subarray', 'subsequence', 'two pointers', 'sliding window', 'rotate array', 'spiral matrix', 'merge intervals'] },
    ],
    'SQL': [
        { sub: 'Joins', keys: ['join', 'inner join', 'outer join', 'left join', 'right join', 'cross join', 'self join'] },
        { sub: 'Aggregations', keys: ['sum', 'count', 'avg', 'min', 'max', 'group by', 'having'] },
        { sub: 'Subqueries', keys: ['subquery', 'nested', 'in (select', 'exists', 'correlated'] },
        { sub: 'Window Functions', keys: ['window', 'over(', 'rank(', 'dense_rank(', 'row_number(', 'lag(', 'lead(', 'partition by'] },
        { sub: 'DDL & DML', keys: ['create table', 'alter table', 'drop table', 'insert into', 'update set', 'delete from', 'truncate'] },
        { sub: 'Filtering', keys: ['where', 'having', 'select employees', 'select customers', 'find the', 'retrieve', 'fetch'] }
    ],
    'Core CS': [
        { sub: 'OOPs', keys: ['oop', 'object', 'class', 'inheritance', 'polymorphism', 'encapsulation', 'abstraction', 'interface', 'virtual function', 'overloading', 'overriding'] },
        { sub: 'DBMS', keys: ['dbms', 'database', 'transaction', 'acid', 'normalization', 'index', 'relational', 'schema', 'foreign key', 'primary key'] },
        { sub: 'Operating Systems', keys: ['os', 'operating system', 'thread', 'process', 'deadlock', 'mutex', 'semaphore', 'paging', 'scheduling', 'context switch', 'virtual memory', 'ipc'] },
        { sub: 'Computer Networks', keys: ['network', 'tcp', 'udp', 'osi', 'ip', 'router', 'protocol', 'http', 'dns', 'socket', 'bandwidth', 'arp', 'ssl', 'tls'] },
        { sub: 'System Design', keys: ['system design', 'scalability', 'load balancer', 'cache', 'microservice', 'api gateway', 'distributed', 'replication', 'sharding'] }
    ],
    'Aptitude': [
        { sub: 'Time & Work', keys: ['time', 'work', 'days', 'hours', 'man-days', 'efficiency', 'complete the work', 'finish the job'] },
        { sub: 'Speed & Distance', keys: ['speed', 'distance', 'train', 'boat', 'km/h', 'relative speed', 'upstream', 'downstream'] },
        { sub: 'Probability', keys: ['probability', 'dice', 'coin', 'cards', 'chance', 'favorable', 'random'] },
        { sub: 'Percentages & Ratios', keys: ['percent', 'ratio', 'proportion', 'profit', 'loss', 'discount', 'marked price', 'cost price', 'selling price'] },
        { sub: 'Number Systems', keys: ['hcf', 'lcm', 'factor', 'prime', 'divisible', 'remainder', 'number series', 'sequence', 'pattern', 'next number'] },
        { sub: 'Averages & Mixtures', keys: ['average', 'mean', 'mixture', 'alligation', 'weighted'] },
        { sub: 'Algebra & Geometry', keys: ['equation', 'algebra', 'geometry', 'triangle', 'circle', 'area', 'volume', 'perimeter'] }
    ]
};

function categorize(question, topic) {
    if (!heuristics[topic]) return 'Miscellaneous';
    const text = (question || '').toLowerCase();
    for (const rule of heuristics[topic]) {
        for (const key of rule.keys) {
            if (text.includes(key.toLowerCase())) return rule.sub;
        }
    }
    return 'Miscellaneous';
}

async function run() {
    console.log('Fetching questions...');
    let allQuestions = [];
    let page = 0;
    const pageSize = 1000;

    while (true) {
        const { data, error } = await supabase
            .from('company_topic_questions')
            .select('id, question, topic')
            .range(page * pageSize, (page + 1) * pageSize - 1);

        if (error) { console.error(error); break; }
        if (data.length === 0) break;
        allQuestions = allQuestions.concat(data);
        page++;
    }

    console.log(`Fetched ${allQuestions.length} questions.`);
    console.log('Generating SQL file...');

    // Build a single large SQL UPDATE per subcategory group for efficiency
    const byCategory = {};
    for (const q of allQuestions) {
        const sub = categorize(q.question, q.topic);
        if (!byCategory[sub]) byCategory[sub] = [];
        byCategory[sub].push(q.id);
    }

    const lines = ['-- Run this in Supabase SQL Editor to set subcategories'];
    lines.push('-- Make sure the subcategory column exists first:');
    lines.push('-- ALTER TABLE company_topic_questions ADD COLUMN IF NOT EXISTS subcategory text;');
    lines.push('');

    for (const [sub, ids] of Object.entries(byCategory)) {
        const escaped = sub.replace(/'/g, "''");
        const idList = ids.map(id => `'${id}'`).join(', ');
        lines.push(`UPDATE company_topic_questions SET subcategory = '${escaped}' WHERE id IN (${idList});`);
        lines.push('');
    }

    fs.writeFileSync('set_subcategories.sql', lines.join('\n'));

    const total = allQuestions.length;
    const cats = Object.entries(byCategory).map(([k, v]) => `  ${k}: ${v.length}`).join('\n');
    console.log(`\nGenerated set_subcategories.sql with ${total} rows across categories:\n${cats}`);
    console.log('\n✅ NEXT STEP: Go to Supabase → SQL Editor → paste and run the file set_subcategories.sql');
}

run();
