import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar, Footer } from '../components/SharedLayout';

interface ResourcePageProps {
    title: string;
    subtitle: string;
    badge: string;
    badgeEmoji: string;
    accentColor: string;
    accentBg: string;
    accentBorder: string;
    description: string;
    features: { icon: string; title: string; desc: string }[];
    topics: string[];
    mockup: React.ReactNode;
    stats: { value: string; label: string }[];
}

const ResourcePageTemplate: React.FC<ResourcePageProps> = ({
    title, subtitle, badge, badgeEmoji, accentColor, accentBg, accentBorder,
    description, features, topics, mockup, stats
}) => {
    const navigate = useNavigate();
    return (
        <div className="bg-[#0b0b0c] text-slate-200 antialiased min-h-screen">
            <Navbar />
            <main>
                {/* Hero */}
                <section className="relative py-28 px-6 border-b border-[#1A1A1A] overflow-hidden">
                    <div className={`absolute top-0 left-1/3 w-[600px] h-[400px] ${accentBg} opacity-50 rounded-full blur-[140px] pointer-events-none`} />
                    <div className="max-w-[1200px] mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${accentBorder} bg-[#161617] text-xs tracking-widest font-semibold text-gray-500 mb-8`}>
                                <span>{badgeEmoji}</span>
                                {badge}
                            </div>
                            <h1 className="text-white text-5xl md:text-6xl font-light leading-tight mb-6">
                                {title}<br /><span className="font-semibold">{subtitle}</span>
                            </h1>
                            <p className="text-gray-400 text-lg font-light leading-relaxed mb-8">{description}</p>
                            <div className="flex gap-3 flex-wrap mb-10">
                                {stats.map((s, i) => (
                                    <div key={i} className="bg-[#161617] border border-[#27272A] rounded-xl px-5 py-3 text-center">
                                        <div className={`text-xl font-bold ${accentColor} mb-0.5`}>{s.value}</div>
                                        <div className="text-[11px] text-gray-500">{s.label}</div>
                                    </div>
                                ))}
                            </div>
                            <button onClick={() => navigate('/signup')} className={`px-8 py-3.5 text-white font-semibold rounded-lg transition-colors shadow-lg`} style={{ backgroundColor: '#7c3aed' }}
                                onMouseOver={e => (e.currentTarget.style.backgroundColor = '#6d28d9')}
                                onMouseOut={e => (e.currentTarget.style.backgroundColor = '#7c3aed')}>
                                Start for Free →
                            </button>
                        </div>
                        <div className="w-full">{mockup}</div>
                    </div>
                </section>

                {/* Features */}
                <section className="py-24 px-6 bg-[#121214] border-b border-[#1A1A1A]">
                    <div className="max-w-[1100px] mx-auto">
                        <h2 className="text-white text-3xl font-light mb-14">What's inside</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {features.map((f, i) => (
                                <div key={i} className="bg-[#161617] border border-[#27272A] rounded-2xl p-7 hover:border-[#7c3aed]/30 transition-colors">
                                    <div className="text-3xl mb-5">{f.icon}</div>
                                    <h3 className="text-white font-semibold text-base mb-3">{f.title}</h3>
                                    <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Topics */}
                <section className="py-24 px-6 bg-[#0b0b0c] border-b border-[#1A1A1A]">
                    <div className="max-w-[1100px] mx-auto">
                        <h2 className="text-white text-3xl font-light mb-6">Topics covered</h2>
                        <p className="text-gray-500 mb-10">Everything you need for placement-level mastery.</p>
                        <div className="flex flex-wrap gap-3">
                            {topics.map((t, i) => (
                                <span key={i} className={`px-4 py-2 rounded-full border ${accentBorder} ${accentBg} ${accentColor} text-sm font-medium`}>{t}</span>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="py-24 px-6 bg-[#121214] text-center">
                    <div className="max-w-[600px] mx-auto">
                        <h2 className="text-white text-4xl font-light mb-6">Ready to master it?</h2>
                        <p className="text-gray-500 mb-10">Join thousands of students already using this resource.</p>
                        <div className="flex justify-center gap-4 flex-wrap">
                            <button onClick={() => navigate('/signup')} className="px-8 py-3.5 bg-[#7c3aed] text-white font-semibold rounded-lg hover:bg-[#6d28d9] transition-colors shadow-lg shadow-purple-500/30">
                                Get Started Free
                            </button>
                            <button onClick={() => navigate('/#pricing')} className="px-8 py-3.5 border border-[#27272A] text-gray-300 font-semibold rounded-lg hover:bg-[#161617] transition-colors">
                                View Pricing
                            </button>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
};

/* ─── ALGORITHM LAB ─── */
const AlgorithmLabMockup = () => (
    <div className="bg-[#111113] border border-[#27272A] rounded-2xl overflow-hidden shadow-2xl">
        <div className="flex items-center gap-2 px-4 py-3 bg-[#0d0d0f] border-b border-[#1A1A1A]">
            <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
            <span className="w-3 h-3 rounded-full bg-[#28c840]" />
            <span className="ml-3 text-xs text-gray-600">Algorithm Visualizer</span>
        </div>
        <div className="p-6">
            <div className="text-xs text-gray-600 mb-3 font-mono">// Binary Search Tree — Insert 42</div>
            <div className="flex justify-center items-end gap-8 h-32 mb-4">
                {[50, 30, 70, 20, 40, 60, 80].map((val, i) => (
                    <div key={i} className="flex flex-col items-center gap-1">
                        <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all ${val === 42 ? 'border-emerald-400 text-emerald-400 bg-emerald-400/10' : val === 50 ? 'border-blue-400 text-blue-400 bg-blue-400/10' : 'border-[#27272A] text-gray-400'}`}>
                            {val}
                        </div>
                    </div>
                ))}
            </div>
            <div className="flex gap-2 mt-4">
                <div className="flex-1 h-8 bg-[#7c3aed]/20 border border-[#7c3aed]/30 rounded flex items-center px-3 text-xs text-[#7c3aed]">Step 3 of 6 — Compare with 40</div>
                <button className="px-4 h-8 bg-[#7c3aed] text-white text-xs rounded font-semibold">Next →</button>
            </div>
        </div>
    </div>
);

export const AlgorithmLabPage: React.FC = () => (
    <ResourcePageTemplate
        title="Algorithm Lab."
        subtitle="See it. Understand it."
        badge="ALGORITHM LAB"
        badgeEmoji="🧩"
        accentColor="text-blue-400"
        accentBg="bg-blue-500/10"
        accentBorder="border-blue-500/20"
        description="Interactive visualizers that turn abstract algorithms into intuitive animations. Step through every operation, pause, rewind, and understand deeply — not just memorize."
        stats={[
            { value: "150+", label: "Problems" },
            { value: "Step-by-step", label: "Visualization" },
            { value: "Real-time", label: "Code execution" },
        ]}
        features={[
            { icon: "🎬", title: "Step-through animations", desc: "Watch every pointer move, every comparison happen, every swap occur. Pause at any step." },
            { icon: "✏️", title: "Live code editor", desc: "Write your solution alongside the visualizer. See your code and the animation in sync." },
            { icon: "📊", title: "Complexity tracker", desc: "Real-time time and space complexity analysis as you step through each operation." },
        ]}
        topics={["Arrays", "Linked Lists", "Binary Trees", "BST", "Graphs", "BFS/DFS", "Dynamic Programming", "Sorting", "Searching", "Heaps", "Tries", "Segment Trees", "Fenwick Trees", "Dijkstra's", "Backtracking"]}
        mockup={<AlgorithmLabMockup />}
    />
);

/* ─── SQL SANDBOX ─── */
const SQLSandboxMockup = () => (
    <div className="bg-[#111113] border border-[#27272A] rounded-2xl overflow-hidden shadow-2xl">
        <div className="flex items-center gap-2 px-4 py-3 bg-[#0d0d0f] border-b border-[#1A1A1A]">
            <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
            <span className="w-3 h-3 rounded-full bg-[#28c840]" />
            <span className="ml-3 text-xs text-gray-600">SQL Sandbox — employees.db</span>
        </div>
        <div className="p-4 font-mono text-xs">
            <div className="text-gray-500 mb-2">{'>'} SELECT name, dept, salary</div>
            <div className="text-gray-500 mb-2">{'>'} FROM employees</div>
            <div className="text-gray-500 mb-2">{'>'} WHERE salary {'>'} 80000</div>
            <div className="text-gray-500 mb-4">{'>'} ORDER BY salary DESC;</div>
            <div className="bg-[#0d0d0f] rounded-lg overflow-hidden border border-[#1A1A1A]">
                <div className="grid grid-cols-3 text-[#7c3aed] border-b border-[#1A1A1A] px-4 py-2">
                    <span>name</span><span>dept</span><span>salary</span>
                </div>
                {[
                    ["Arjun K.", "Engineering", "₹1,20,000"],
                    ["Priya S.", "Design", "₹95,000"],
                    ["Rohan M.", "Product", "₹88,000"],
                ].map(([n, d, s], i) => (
                    <div key={i} className="grid grid-cols-3 px-4 py-2 text-gray-400 border-b border-[#0b0b0c] hover:bg-[#161617] transition-colors">
                        <span>{n}</span><span>{d}</span><span className="text-emerald-400">{s}</span>
                    </div>
                ))}
                <div className="px-4 py-2 text-gray-600 text-[10px]">3 rows returned in 0.004s</div>
            </div>
        </div>
    </div>
);

export const SQLSandboxPage: React.FC = () => (
    <ResourcePageTemplate
        title="SQL Sandbox."
        subtitle="Query. Learn. Master."
        badge="SQL SANDBOX"
        badgeEmoji="🗄️"
        accentColor="text-emerald-400"
        accentBg="bg-emerald-500/10"
        accentBorder="border-emerald-500/20"
        description="A fully interactive SQL environment with preloaded datasets. Write real queries, see instant results, and learn through real interview-style problems from MAANG companies."
        stats={[
            { value: "50+", label: "Interview questions" },
            { value: "8", label: "Sample databases" },
            { value: "Instant", label: "Query results" },
        ]}
        features={[
            { icon: "⚡", title: "Instant execution", desc: "Write SQL and see results in milliseconds. No setup, no configuration — just open and query." },
            { icon: "🏢", title: "Real company questions", desc: "50+ actual SQL interview questions from Google, Amazon, Flipkart, and other top companies." },
            { icon: "📈", title: "Visual query plans", desc: "See how the database engine executes your query. Learn optimization through visual explain plans." },
        ]}
        topics={["SELECT & WHERE", "JOINs (INNER, LEFT, RIGHT)", "GROUP BY & HAVING", "Window Functions", "Subqueries & CTEs", "RANK & DENSE_RANK", "Indexes & Performance", "Normalization (1NF–3NF)", "Stored Procedures", "Transactions & ACID", "NoSQL Concepts"]}
        mockup={<SQLSandboxMockup />}
    />
);

/* ─── SYSTEM DESIGN CANVAS ─── */
const SystemDesignMockup = () => (
    <div className="bg-[#111113] border border-[#27272A] rounded-2xl overflow-hidden shadow-2xl">
        <div className="flex items-center gap-2 px-4 py-3 bg-[#0d0d0f] border-b border-[#1A1A1A]">
            <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
            <span className="w-3 h-3 rounded-full bg-[#28c840]" />
            <span className="ml-3 text-xs text-gray-600">Design: Twitter Feed — High Level</span>
        </div>
        <div className="p-6 relative h-[220px]">
            {/* Simplified architecture diagram */}
            {[
                { label: "Client", x: 10, y: 40, color: "border-purple-500/40 text-purple-400" },
                { label: "Load Balancer", x: 32, y: 40, color: "border-blue-500/40 text-blue-400" },
                { label: "API Gateway", x: 54, y: 40, color: "border-blue-500/40 text-blue-400" },
                { label: "Feed Service", x: 76, y: 20, color: "border-emerald-500/40 text-emerald-400" },
                { label: "Cache (Redis)", x: 76, y: 60, color: "border-yellow-500/40 text-yellow-400" },
            ].map((node, i) => (
                <div key={i} className={`absolute bg-[#161617] border ${node.color} rounded-lg px-2 py-1 text-[9px] font-medium whitespace-nowrap`}
                    style={{ left: `${node.x}%`, top: `${node.y}%` }}>
                    {node.label}
                </div>
            ))}
            {/* Connection lines placeholder */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30">
                <line x1="18%" y1="50%" x2="32%" y2="50%" stroke="#7c3aed" strokeWidth="1" strokeDasharray="4"/>
                <line x1="50%" y1="50%" x2="54%" y2="50%" stroke="#3b82f6" strokeWidth="1" strokeDasharray="4"/>
                <line x1="70%" y1="50%" x2="76%" y2="30%" stroke="#10b981" strokeWidth="1" strokeDasharray="4"/>
                <line x1="70%" y1="50%" x2="76%" y2="70%" stroke="#eab308" strokeWidth="1" strokeDasharray="4"/>
            </svg>
            <div className="absolute bottom-4 right-4 text-[10px] text-gray-600">HLD · Twitter Clone</div>
        </div>
    </div>
);

export const SystemDesignPage: React.FC = () => (
    <ResourcePageTemplate
        title="System Design Canvas."
        subtitle="Think at scale."
        badge="SYSTEM DESIGN"
        badgeEmoji="🏗️"
        accentColor="text-purple-400"
        accentBg="bg-purple-500/10"
        accentBorder="border-purple-500/20"
        description="Structured walkthroughs of 20+ real-world system design problems. Learn HLD and LLD through guided case studies, annotated diagrams, and interviewer-approved frameworks."
        stats={[
            { value: "20+", label: "System walkthroughs" },
            { value: "HLD & LLD", label: "Both covered" },
            { value: "FAANG", label: "Interview aligned" },
        ]}
        features={[
            { icon: "🗺️", title: "Guided walkthroughs", desc: "Step-by-step breakdowns of how to design Twitter, YouTube, Uber, WhatsApp, and 20+ other systems." },
            { icon: "📐", title: "HLD & LLD templates", desc: "Reusable diagram templates and frameworks. Adapt them to any new system in minutes." },
            { icon: "⚖️", title: "Trade-off analysis", desc: "Every decision explained: why SQL vs NoSQL, monolith vs microservices, push vs pull." },
        ]}
        topics={["Scalability Fundamentals", "Load Balancing", "Caching Strategies", "Database Sharding", "CAP Theorem", "Message Queues", "CDN Design", "Rate Limiting", "API Design (REST/GraphQL)", "Microservices", "Consistent Hashing", "Distributed Systems", "Event-Driven Architecture"]}
        mockup={<SystemDesignMockup />}
    />
);
