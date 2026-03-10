import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const LandingPage: React.FC = () => {
    const navigate = useNavigate();
    const { user, loading } = useAuth();

    // Redirect authenticated users to dashboard
    useEffect(() => {
        if (!loading && user) {
            navigate('/dashboard', { replace: true });
        }
    }, [navigate, user, loading]);

    const handleGetStarted = () => {
        navigate('/signup');
    };

    return (
        <div className="dark">
            <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-200 font-display antialiased overflow-x-hidden min-h-screen">
                <div className="relative flex min-h-screen w-full flex-col group/design-root">
                    <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-border-dark bg-background-dark/80 backdrop-blur-md sticky top-0 z-50 px-6 py-4 md:px-10">
                        <div className="flex items-center gap-4 text-white">
                            <div className="size-6 text-accent-purple">
                                <span className="material-symbols-outlined !text-2xl">layers</span>
                            </div>
                            <h2 className="text-white text-lg font-medium leading-tight tracking-wide">MASTER<span className="text-accent-purple">.AI</span></h2>
                        </div>
                        <div className="hidden md:flex flex-1 justify-end gap-8 items-center">
                            <nav className="flex items-center gap-9">
                                <a className="text-gray-400 hover:text-white transition-colors text-sm font-light leading-normal" href="#">Curriculum</a>
                                <a className="text-gray-400 hover:text-white transition-colors text-sm font-light leading-normal" href="#">Challenge Mode</a>
                                <a className="text-gray-400 hover:text-white transition-colors text-sm font-light leading-normal" href="#">Pricing</a>
                            </nav>
                            <button onClick={handleGetStarted} className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-9 px-5 border border-border-dark bg-transparent text-white hover:border-accent-purple transition-colors text-sm font-medium leading-normal tracking-wide">
                                <span className="truncate">Get Started</span>
                            </button>
                        </div>
                        <div className="md:hidden text-white">
                            <span className="material-symbols-outlined cursor-pointer">menu</span>
                        </div>
                    </header>
                    <main className="flex flex-col grow">
                        <section className="flex flex-col lg:flex-row items-center justify-between px-6 py-20 lg:py-32 xl:py-40 bg-background-dark relative overflow-hidden min-h-[90vh]">
                            <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)', backgroundSize: '50px 50px' }}></div>
                            <div className="relative z-10 flex flex-col items-start max-w-2xl text-left gap-8 lg:w-1/2 lg:pr-12">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border-dark bg-surface-dark/50 backdrop-blur-sm">
                                    <span className="size-1.5 rounded-full bg-accent-purple animate-pulse"></span>
                                    <span className="text-xs font-medium text-gray-400 uppercase tracking-widest">AI-Resistant Skills</span>
                                </div>
                                <h1 className="text-white text-5xl md:text-6xl lg:text-7xl font-extralight leading-[1.1] tracking-tight">
                                    Master Placements in the <br /><span className="font-normal text-white border-b-2 border-accent-purple pb-1">Age of AI</span>
                                </h1>
                                <p className="text-gray-400 text-lg md:text-xl font-light leading-relaxed max-w-lg">
                                    Secure your future by mastering the skills AI can't replicate. Deep problem solving, system architecture, and human-centric engineering.
                                </p>
                                <div className="flex flex-wrap gap-4 mt-4">
                                    <button onClick={handleGetStarted} className="flex min-w-[160px] cursor-pointer items-center justify-center rounded-lg h-12 px-6 bg-white text-black hover:bg-gray-100 transition-all text-sm font-medium tracking-wide">
                                        Start Assessment
                                    </button>
                                    <button className="flex min-w-[160px] cursor-pointer items-center justify-center rounded-lg h-12 px-6 bg-transparent border border-border-dark text-white hover:border-accent-purple transition-all text-sm font-medium tracking-wide group">
                                        Explore Syllabus <span className="material-symbols-outlined ml-2 text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
                                    </button>
                                </div>
                            </div>
                            <div className="relative z-10 lg:w-1/2 h-[500px] w-full mt-16 lg:mt-0 flex items-center justify-center">
                                <div className="relative w-full h-full max-w-md mx-auto perspective-1000">
                                    <div className="absolute inset-0 bg-gradient-to-tr from-accent-purple/10 to-transparent rounded-full blur-3xl opacity-30"></div>
                                    <div className="relative w-full h-full rounded-2xl overflow-hidden border border-border-dark/50 shadow-2xl bg-surface-dark/20 backdrop-blur-sm group hover:scale-[1.02] transition-transform duration-700 ease-out">
                                        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCKOuoS_jELCIhXijZSuME3QuB4qb6jGkbhE0np8VIBj5dIbRxbz4-QiXhyvlq4ba6_MIkb8yWnHr0ecGW3NTGioIGiH67XF1oUiGMnod7McLpFpHfKDp1ax_qUI_TVNa33T8oGrQ4qHZSHgf_cnat0Y6AT16Xw66HCUYnXnb-rmgS5hAsiwjCXZJHOfGePbjtYJVze-MpxmLGmrMy3NbL_9daxLSO2801Tk6far8_2x1PrJUGASMweC-uB-WtlKCCe8qTHCgMrPulg')", opacity: 0.9, filter: 'contrast(1.2) brightness(0.8)' }}></div>
                                        <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-transparent to-transparent"></div>
                                        <div className="absolute bottom-10 left-10 right-10 p-6 rounded-xl border border-white/10 bg-black/40 backdrop-blur-md">
                                            <div className="flex justify-between items-center mb-4">
                                                <div className="text-xs text-gray-400 uppercase tracking-wider">System Status</div>
                                                <div className="text-accent-purple text-xs font-bold">OPTIMAL</div>
                                            </div>
                                            <div className="h-1 w-full bg-gray-800 rounded-full overflow-hidden">
                                                <div className="h-full bg-white w-3/4"></div>
                                            </div>
                                            <div className="mt-4 flex justify-between text-white font-light text-sm">
                                                <span>Architecture</span>
                                                <span>98%</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                        <section className="py-32 bg-surface-dark border-y border-border-dark relative">
                            <div className="max-w-[1200px] mx-auto px-6">
                                <div className="mb-16 text-center">
                                    <h2 className="text-3xl font-light text-white mb-4">Interactive <span className="text-accent-purple">Live Preview</span></h2>
                                    <p className="text-gray-400 font-light max-w-xl mx-auto">Don't just watch. Build. Drag the correct data structure to complete the optimal solution pattern.</p>
                                </div>
                                <div className="flex flex-col lg:flex-row gap-12 items-stretch min-h-[500px]">
                                    <div className="flex-1 bg-background-dark border border-border-dark rounded-xl p-8 shadow-2xl flex flex-col">
                                        <div className="flex items-center gap-2 mb-6 border-b border-border-dark pb-4">
                                            <span className="size-3 rounded-full bg-red-500/20 border border-red-500/50"></span>
                                            <span className="size-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></span>
                                            <span className="size-3 rounded-full bg-green-500/20 border border-green-500/50"></span>
                                            <span className="ml-4 text-xs text-gray-500 font-mono">problem_solver.py</span>
                                        </div>
                                        <div className="font-mono text-sm leading-loose text-gray-300 flex-1">
                                            <div className="text-gray-500 mb-4"># Task: Cache recent items efficiently</div>
                                            <div><span className="text-purple-400">class</span> <span className="text-yellow-200">LRUCache</span>:</div>
                                            <div className="pl-4"><span className="text-purple-400">def</span> <span className="text-blue-300">__init__</span>(self, capacity):</div>
                                            <div className="pl-8 text-gray-500"># TODO: Choose structure for O(1) access</div>
                                            <div className="pl-8 flex items-center gap-3 my-2">
                                                <span>self.cache = </span>
                                                <div className="h-10 w-48 border-2 border-dashed border-gray-700 bg-gray-800/50 rounded flex items-center justify-center text-xs text-gray-500 drop-zone">
                                                    Drag Structure Here
                                                </div>
                                            </div>
                                            <div className="pl-8 text-gray-500"># TODO: Choose structure for O(1) ordering</div>
                                            <div className="pl-8 flex items-center gap-3 my-2">
                                                <span>self.order = </span>
                                                <div className="h-10 w-48 border-2 border-dashed border-gray-700 bg-gray-800/50 rounded flex items-center justify-center text-xs text-gray-500 drop-zone">
                                                    Drag Structure Here
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-6 flex justify-end">
                                            <button className="px-6 py-2 bg-accent-purple/10 text-accent-purple border border-accent-purple/20 rounded-lg text-sm hover:bg-accent-purple hover:text-white transition-colors">Run Tests</button>
                                        </div>
                                    </div>
                                    <div className="lg:w-1/3 flex flex-col gap-6 justify-center">
                                        <div className="text-sm text-gray-400 mb-2 uppercase tracking-wider font-medium">Data Structures</div>
                                        <div className="draggable-item bg-background-dark p-4 rounded-lg border border-border-dark hover:border-accent-purple group transition-all shadow-lg hover:shadow-accent-purple/10">
                                            <div className="flex items-center gap-3">
                                                <span className="material-symbols-outlined text-accent-purple">data_object</span>
                                                <div>
                                                    <h4 className="text-white font-medium text-sm">HashMap (Dict)</h4>
                                                    <p className="text-xs text-gray-500">Key-value mapping, O(1) access</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="draggable-item bg-background-dark p-4 rounded-lg border border-border-dark hover:border-accent-purple group transition-all shadow-lg hover:shadow-accent-purple/10">
                                            <div className="flex items-center gap-3">
                                                <span className="material-symbols-outlined text-accent-purple">link</span>
                                                <div>
                                                    <h4 className="text-white font-medium text-sm">Doubly Linked List</h4>
                                                    <p className="text-xs text-gray-500">Ordered nodes, O(1) insertion/deletion</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="draggable-item bg-background-dark p-4 rounded-lg border border-border-dark hover:border-gray-600 group transition-all shadow-lg opacity-50">
                                            <div className="flex items-center gap-3">
                                                <span className="material-symbols-outlined text-gray-500">view_array</span>
                                                <div>
                                                    <h4 className="text-gray-300 font-medium text-sm">Dynamic Array</h4>
                                                    <p className="text-xs text-gray-600">Contiguous memory, O(n) shift</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                        <section className="py-40 bg-background-dark">
                            <div className="max-w-[1200px] mx-auto px-6 flex flex-col gap-40">
                                <div className="group flex flex-col md:flex-row gap-20 items-center">
                                    <div className="flex-1 space-y-8 order-2 md:order-1 max-w-md">
                                        <div className="flex items-center gap-3">
                                            <div className="h-px w-8 bg-accent-purple"></div>
                                            <span className="text-accent-purple text-sm font-medium tracking-widest uppercase">Foundation</span>
                                        </div>
                                        <h3 className="text-white text-3xl font-light">Algorithmic Intuition</h3>
                                        <p className="text-gray-400 leading-relaxed font-light text-lg">
                                            Stop memorizing code. Visualize the execution flow. Our timeline debugger lets you scrub through algorithm states frame-by-frame.
                                        </p>
                                        <ul className="space-y-4 pt-4 border-l border-border-dark pl-6">
                                            <li className="text-sm text-gray-300">
                                                <span className="text-accent-purple mr-2">•</span> Time-Travel Debugging
                                            </li>
                                            <li className="text-sm text-gray-300">
                                                <span className="text-accent-purple mr-2">•</span> Memory Stack Visualization
                                            </li>
                                            <li className="text-sm text-gray-300">
                                                <span className="text-accent-purple mr-2">•</span> Pattern Recognition Engine
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="flex-1 w-full order-1 md:order-2">
                                        <div className="aspect-[4/3] w-full bg-surface-dark rounded-lg overflow-hidden border border-border-dark relative shadow-2xl">
                                            <div className="absolute inset-0 bg-cover bg-center opacity-80" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBfyDpBXdm8bcvVMUjhX9AmcuaxmnetXI7ueTfsdBWSBSTEnBB8q-S2ob3hfz3iEzo8i7LDcvdxdC55Qck3AJUQcevtmyHmFPY6jKJMVE8mxUw7v6iGKFk02vaMIIkiGyyfntVwwFS_bSQQlwfWOZrjQay63-Ysf8-J-4r2PYucK1bUoTTyfCmnAc3vrUDDv0dp3jvK33foaMbhNZA_Tk_ZBOESwoR3YxV5ZX50ZTfMsCkBqLRomyny3r9UDGga4DlYTl-0SQHP-tH-')" }}></div>
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="size-16 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 cursor-pointer hover:scale-110 transition-transform">
                                                    <span className="material-symbols-outlined text-white text-3xl">play_arrow</span>
                                                </div>
                                            </div>
                                            <div className="absolute bottom-6 left-6 right-6 h-1 bg-gray-700 rounded-full overflow-hidden">
                                                <div className="h-full bg-accent-purple w-1/3"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="group flex flex-col md:flex-row gap-20 items-center">
                                    <div className="flex-1 w-full order-1">
                                        <div className="aspect-[4/3] w-full bg-surface-dark rounded-lg overflow-hidden border border-border-dark relative shadow-2xl">
                                            <div className="absolute inset-0 bg-cover bg-center opacity-80" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuD1bweuEzL2BxZubBFjr9RDwCmgFHnDZxw-FCLbqALbjUgP6doMKw0YbAQyB1Ye2v3m6pbJDjY0w0pTL3iXzHkb5VtsysRdGbpYbaqNatlB5fbsA1wVGbRPq01OQCwpNS-6JwhN90yM0uwdo58ek_qFVbLO39j3ZSdluV0nbKznXtpW4RgnzINBBe-p7oYuWOH-xQUC3G2JRPdFkJZTFunY1xLsIR5xidmmwzoOgN_XVIdveXfjCGJEWq62n_PFwIx8CwYHIL-A-LLw')" }}></div>
                                            <div className="absolute top-6 right-6 bg-black/60 backdrop-blur-md px-4 py-2 rounded border border-white/10 text-xs text-white font-mono">
                                                Latency: 12ms <span className="text-green-400">●</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex-1 space-y-8 order-2 max-w-md">
                                        <div className="flex items-center gap-3">
                                            <div className="h-px w-8 bg-accent-purple"></div>
                                            <span className="text-accent-purple text-sm font-medium tracking-widest uppercase">Architecture</span>
                                        </div>
                                        <h3 className="text-white text-3xl font-light">System Design Canvas</h3>
                                        <p className="text-gray-400 leading-relaxed font-light text-lg">
                                            Drag, drop, and scale. Simulate high-traffic scenarios on a live whiteboard. Understand trade-offs between consistency and availability in real-time.
                                        </p>
                                        <ul className="space-y-4 pt-4 border-l border-border-dark pl-6">
                                            <li className="text-sm text-gray-300">
                                                <span className="text-accent-purple mr-2">•</span> Interactive Component Library
                                            </li>
                                            <li className="text-sm text-gray-300">
                                                <span className="text-accent-purple mr-2">•</span> Real-time Load Simulation
                                            </li>
                                            <li className="text-sm text-gray-300">
                                                <span className="text-accent-purple mr-2">•</span> Failure Mode Analysis
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="group flex flex-col md:flex-row gap-20 items-center">
                                    <div className="flex-1 space-y-8 order-2 md:order-1 max-w-md">
                                        <div className="flex items-center gap-3">
                                            <div className="h-px w-8 bg-accent-purple"></div>
                                            <span className="text-accent-purple text-sm font-medium tracking-widest uppercase">Data</span>
                                        </div>
                                        <h3 className="text-white text-3xl font-light">Live SQL Query Builder</h3>
                                        <p className="text-gray-400 leading-relaxed font-light text-lg">
                                            Construct complex queries visually or in code. See the query plan execution and optimize for performance against million-row datasets.
                                        </p>
                                        <ul className="space-y-4 pt-4 border-l border-border-dark pl-6">
                                            <li className="text-sm text-gray-300">
                                                <span className="text-accent-purple mr-2">•</span> Query Cost Analysis
                                            </li>
                                            <li className="text-sm text-gray-300">
                                                <span className="text-accent-purple mr-2">•</span> Indexing Strategy Lab
                                            </li>
                                            <li className="text-sm text-gray-300">
                                                <span className="text-accent-purple mr-2">•</span> Production Schemas
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="flex-1 w-full order-1 md:order-2">
                                        <div className="aspect-[4/3] w-full bg-surface-dark rounded-lg overflow-hidden border border-border-dark relative shadow-2xl">
                                            <div className="absolute inset-0 bg-cover bg-center opacity-80" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDHvY8Snd22wzcZRI7-dq5a-sdlMOLHBJzoqOrpELACtRjnEYLFDnOnFx5AsHgZxu2Gb26BOFJ4ksHTserBx49sTi8AiU_8rHF3LR1idgIYDSOMZwoSR_nvY6nKEkfsaBfZUFbCIDq1JtSWH3Lux05heNZANd_cOPT8FI8MgfLNYSq_eMP8NjTL3HOAb0Q3fMt-C3g1NqCqOoJuBUGWhfPalSH6Ru8t7G9ymDlJ5jhHAo7X-PIN1b2OXHl0h-JHe9cCTFOue_exPURM')" }}></div>
                                            <div className="absolute inset-0 bg-gradient-to-r from-background-dark/80 to-transparent"></div>
                                            <div className="absolute left-6 top-1/2 -translate-y-1/2 space-y-2">
                                                <div className="h-8 w-40 bg-gray-800 rounded border-l-2 border-accent-purple"></div>
                                                <div className="h-8 w-32 bg-gray-800/80 rounded border-l-2 border-accent-purple/50"></div>
                                                <div className="h-8 w-36 bg-gray-800/60 rounded border-l-2 border-accent-purple/30"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                        <section className="py-32 border-t border-border-dark bg-surface-dark">
                            <div className="max-w-4xl mx-auto px-6 text-center">
                                <div className="mb-8 flex justify-center">
                                    <span className="material-symbols-outlined text-4xl text-accent-purple opacity-50">format_quote</span>
                                </div>
                                <h3 className="text-white text-2xl md:text-3xl font-extralight leading-relaxed mb-10 italic">
                                    "The interactivity changes everything. I wasn't just reading about race conditions; I was creating them and fixing them in the simulator. It's the only reason I passed my Meta onsite."
                                </h3>
                                <div className="flex flex-col items-center gap-2">
                                    <div className="size-14 rounded-full p-0.5 bg-gradient-to-tr from-accent-purple to-transparent mb-2">
                                        <div className="w-full h-full rounded-full bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAFKBmlBm1ZXsHPbStNZrJlainLgP7psUc83iam7JKHEAjuVG0twnuAZvvt0VVxX0GoFzEf-VjkwIEB2E1PgazhqpN8StjrFLzVLyoZLPPlEF0R2YCwGylP25XmhXKkGUlFfszZbfs2riXkRAtcKsTpbNfS7ME7l54-ItOF9A9KOVJPqq681sfG0xAXA1CqTnyl7ewBlb2zPS71KIikVY9sFTT_QL1IuETtYwKX2Sd3BXesY7KO39D2j_GIUtBrlGRvcbeqhqvksavb')" }}></div>
                                    </div>
                                    <p className="text-white font-medium tracking-wide">Sarah Jenkins</p>
                                    <p className="text-gray-500 text-sm font-light">E5 Engineer @ Meta</p>
                                </div>
                            </div>
                        </section>
                        <section className="py-32 bg-background-dark border-t border-border-dark relative overflow-hidden">
                            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-accent-purple/5 via-background-dark to-background-dark pointer-events-none"></div>
                            <div className="max-w-[600px] mx-auto px-6 text-center flex flex-col gap-8 relative z-10">
                                <h2 className="text-white text-4xl font-light tracking-tight">Ready to master the craft?</h2>
                                <p className="text-gray-400 font-light">Join the top 1% of engineers who build with intuition.</p>
                                <div className="flex justify-center pt-4">
                                    <button onClick={handleGetStarted} className="flex min-w-[200px] cursor-pointer items-center justify-center rounded-lg h-14 px-8 bg-white text-black hover:bg-gray-100 transition-all text-lg font-medium tracking-wide shadow-[0_0_30px_-5px_rgba(255,255,255,0.15)]">
                                        Start Free Trial
                                    </button>
                                </div>
                            </div>
                        </section>
                    </main>
                    <footer className="bg-background-dark border-t border-border-dark py-12 px-6 md:px-10">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                            <div className="flex items-center gap-3 text-white">
                                <div className="size-5 text-accent-purple">
                                    <span className="material-symbols-outlined !text-xl">layers</span>
                                </div>
                                <span className="text-sm font-medium tracking-wider text-gray-300">MASTER.AI</span>
                            </div>
                            <div className="text-gray-600 text-sm font-light">
                                © 2024 Interactive Mastery Inc.
                            </div>
                            <div className="flex gap-6">
                                <a className="text-gray-500 hover:text-accent-purple transition-colors" href="#">
                                    <span className="material-symbols-outlined !text-xl">public</span>
                                </a>
                                <a className="text-gray-500 hover:text-accent-purple transition-colors" href="#">
                                    <span className="material-symbols-outlined !text-xl">alternate_email</span>
                                </a>
                            </div>
                        </div>
                    </footer>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
