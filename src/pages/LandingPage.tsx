import React, { useEffect, useState, useRef, useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import gsap from 'gsap';
import { ScrollTrigger } from "gsap/ScrollTrigger";
import InteractiveHands from '../components/InteractiveHands';

gsap.registerPlugin(ScrollTrigger);
const LandingPage: React.FC = () => {
    const navigate = useNavigate();
    const { user, loading } = useAuth();
    const [activeTier, setActiveTier] = useState("PRO");
    const [openFaq, setOpenFaq] = useState<number | null>(0);

    // GSAP Refs
    const heroContentRef = useRef<HTMLDivElement>(null);
    const horizontalScrollRef = useRef<HTMLElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const getScrollAmount = () => {
                const sWidth = scrollContainerRef.current?.scrollWidth || 0;
                return -(sWidth - window.innerWidth);
            };

            if (scrollContainerRef.current && horizontalScrollRef.current) {
                const scrollAmount = Math.abs(
                    scrollContainerRef.current.scrollWidth - window.innerWidth
                );

                if (scrollAmount > 0) {
                    const tween = gsap.to(scrollContainerRef.current, {
                        x: () => getScrollAmount(),
                        ease: "none",
                    });

                    ScrollTrigger.create({
                        trigger: horizontalScrollRef.current,
                        start: "top top",
                        end: () => `+=${scrollAmount}`,
                        pin: true,
                        pinSpacing: true,        // ← ensures space is reserved after pin
                        animation: tween,
                        scrub: 1,
                        anticipatePin: 1,        // ← prevents jump on pin entry
                        invalidateOnRefresh: true,
                    });
                }
            }
        });

        return () => ctx.revert();
    }, []);
    // Initial Animations
    useEffect(() => {
        if (heroContentRef.current) {
            const elements = heroContentRef.current.children;
            gsap.fromTo(elements,
                { y: 50, opacity: 0 },
                { y: 0, opacity: 1, duration: 1, stagger: 0.2, ease: "power3.out", delay: 0.5 }
            );
        }
    }, []);

    // Redirect authenticated users to dashboard
    useEffect(() => {
        if (!loading && user) {
            navigate('/dashboard', { replace: true });
        }
    }, [navigate, user, loading]);

    const handleGetStarted = () => {
        navigate('/signup');
    };


    const courses = [
        { title: "System Design Masterclass", desc: "Scaling architectures for 100M+ users. Load balancing, sharding, and caching strategies.", modules: "12 MODULES" },
        { title: "Advanced Data Structures", desc: "Moving beyond binary trees. Segment trees, Fenwick trees, and advanced graph theory.", modules: "20 MODULES" },
        { title: "Full-Stack Development", desc: "From zero to production. Next.js, Go, PostgreSQL, and AWS deployment pipelines.", modules: "15 MODULES" },
        { title: "Machine Learning", desc: "Deploying predictive models in production environments.", modules: "10 MODULES" }
    ];

    const faqs = [
        { q: "How do the visual builders work?", a: "Our proprietary visual builders represent syntax as logical blocks that can be manipulated in real-time, helping you grasp complex algorithms intuitively." },
        { q: "Are the HR contacts really verified?", a: "Yes, our database is updated weekly through direct integrations and manual verifications to ensure you're reaching out to active decision-makers." },
        { q: "Can I cancel my subscription anytime?", a: "Absolutely. No long-term commitments required. You can manage your subscription directly from the billing dashboard." },
        { q: "Do you offer university group discounts?", a: "We do. Please contact our support team with your university email to get a personalized quote for your cohort." }
    ];

    const companies = ["GOOGLE", "AMAZON", "META", "APPLE", "MICROSOFT", "NETFLIX", "TESLA", "ORACLE"];

    return (
        <div className="dark">
            <div className="bg-[#ffffff] text-slate-200 font-display antialiased overflow-x-hidden min-h-screen selection:bg-accent-purple/30 selection:text-white">
                <div className="relative flex min-h-screen w-full flex-col group/design-root">

                    {/* Header – floating pill navbar */}
                    <header className="sticky top-0 z-50 w-full flex justify-center pointer-events-none">
                        {/* SVG Background Container */}
                        <div className="absolute top-0 left-0 w-full flex justify-center -z-10">
                            {/* increased width slightly to 60rem to ensure everything fits inside */}
                            <div className="w-[60rem] h-[42px] md:h-[50px]">
                                <svg
                                    width="100%"
                                    height="100%"
                                    viewBox="0 0 4291 243"
                                    preserveAspectRatio="none"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="drop-shadow-2xl"
                                >
                                    <path d="M0 0H3611.72C3651.29 0 3683.37 32.0778 3683.37 71.6478V171.352C3683.37 210.922 3651.29 243 3611.72 243H662.989C633.399 243 606.854 224.811 596.172 197.217L554.881 90.5466C544.199 62.9525 517.653 44.7632 488.064 44.7632H74.4407C55.4385 44.7632 37.2146 37.2146 23.778 23.778L0 0Z" fill="#1a1a1e" />
                                    <path d="M4290.87 0H679.15C639.58 0 607.502 32.0778 607.502 71.6478V171.352C607.502 210.922 639.58 243 679.15 243H3627.88C3657.47 243 3684.02 224.811 3694.7 197.217L3735.99 90.5466C3746.67 62.9525 3773.22 44.7632 3802.81 44.7632H4216.43C4235.43 44.7632 4253.66 37.2146 4267.09 23.778L4290.87 0Z" fill="#1a1a1e" />
                                </svg>
                            </div>
                        </div>

                        {/* Navbar Content - max-w set smaller than the SVG width to force content inside */}
                        <div className="flex items-center justify-between w-full max-w-[44rem] px-12 h-[42px] md:h-[50px] pointer-events-auto">
                            {/* Logo */}
                            <div className="flex items-center gap-2 text-white">
                                <div className="w-4 h-4 rounded-full flex items-center justify-center bg-white/10">
                                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                                        <path d="M12 2L2 7L12 12L22 7L12 2Z" />
                                        <path d="M2 17L12 22L22 17" />
                                        <path d="M2 12L12 17L22 12" />
                                    </svg>
                                </div>
                                <span className="text-[10px] font-bold tracking-[0.2em] text-white">MASTER.AI</span>
                            </div>

                            {/* Nav Links */}
                            <nav className="hidden md:flex items-center gap-10">
                                <a className="text-gray-400 hover:text-white transition-all text-[14px] font-medium tracking-wide" href="#">About</a>
                                <a className="text-gray-400 hover:text-white transition-all text-[14px] font-medium tracking-wide" href="#">Pricing</a>
                                <a className="text-gray-400 hover:text-white transition-all text-[14px] font-medium tracking-wide cursor-pointer" onClick={handleGetStarted}>Login</a>
                            </nav>

                            {/* CTA */}
                            <button onClick={handleGetStarted} className="flex items-center justify-center rounded-full h-8 px-4 bg-[#7c3aed] hover:bg-[#6d28d9] transition-all text-white text-[14px] font-bold">
                                Get started
                            </button>
                        </div>
                    </header>
                    <main className="flex flex-col grow">

                        {/* Hero Section */}
                        <section className="flex flex-col lg:flex-row items-center justify-between px-6 py-20 lg:py-32 xl:py-40 relative flex-1 min-h-[85vh] overflow-hidden bg-[#fafafa]">
                            <div className="absolute top-0 right-0 w-full lg:w-[60%] h-full z-0 pointer-events-auto">
                                <InteractiveHands className="absolute inset-0 w-full h-full mix-blend-multiply opacity-80" />
                            </div>
                            <div ref={heroContentRef} className="relative z-10 flex flex-col items-start max-w-2xl text-left gap-6 lg:w-1/2 lg:pl-16">
                                {/* Tag */}
                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-200 bg-white/80 backdrop-blur-sm text-xs tracking-widest font-semibold text-gray-500">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#3b5bdb]" />
                                    AI-RESISTANT SKILLS
                                </div>
                                <h1 className="text-slate-900 text-5xl md:text-6xl lg:text-[5rem] font-light leading-[1.05] tracking-tight mt-2">
                                    Master Placements<br />in the<br />
                                    <span className="font-semibold border-b-[3px] border-[#7c3aed] pb-1">Age of AI</span>
                                </h1>
                                <p className="text-slate-600 text-lg md:text-xl font-light leading-relaxed max-w-lg mt-4">
                                    Secure your future by mastering the skills AI can't replicate. Deep problem solving, system architecture, and human-centric engineering.
                                </p>
                                <div className="flex flex-wrap gap-4 mt-6 pointer-events-auto">
                                    <button onClick={handleGetStarted} className="flex px-8 py-3.5 bg-[#7c3aed] text-white font-semibold rounded-lg hover:bg-[#6d28d9] transition-colors shadow-lg shadow-purple-500/30">
                                        Start Assessment
                                    </button>
                                    <button className="flex px-8 py-3.5 bg-transparent text-slate-700 font-semibold rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors flex items-center gap-2">
                                        Explore Syllabus
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                                    </button>
                                </div>
                            </div>

                            {/* System Status overlay box matching image reference */}
                            <div className="absolute bottom-16 right-16 z-20 hidden lg:block bg-white/90 backdrop-blur-md border border-gray-200/60 rounded-xl p-6 w-[350px] shadow-2xl">
                                <div className="flex justify-between items-center text-xs tracking-widest font-semibold mb-4">
                                    <span className="text-gray-500">SYSTEM STATUS</span>
                                    <span className="text-[#7c3aed]">OPTIMAL</span>
                                </div>
                                <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden mb-4">
                                    <div className="h-full bg-[#7c3aed] w-[85%] rounded-full"></div>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-700">Architecture</span>
                                    <span className="text-slate-500">98%</span>
                                </div>
                            </div>
                        </section>

                        {/* Video Demo Section */}
                        <section className="py-24 bg-[#fafafa] border-t border-gray-100 flex flex-col items-center justify-center">
                            <div className="w-full max-w-4xl px-6">
                                <div className="w-full aspect-video bg-gray-100 border border-gray-200 rounded-2xl flex items-center justify-center shadow-xl relative overflow-hidden group cursor-pointer">
                                    {/* Video Placeholder */}
                                    <div className="absolute inset-0 bg-gradient-to-tr from-gray-200 to-gray-50 opacity-50"></div>
                                    <div className="relative z-10 w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-2xl transition-transform group-hover:scale-110">
                                        <div className="w-0 h-0 border-t-[12px] border-t-transparent border-l-[20px] border-l-[#ff3b30] border-b-[12px] border-b-transparent ml-2"></div>
                                    </div>
                                    {/* Subtle pattern overlay */}
                                    <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                                </div>
                            </div>
                            <div className="mt-12 text-center max-w-2xl px-6">
                                <h3 className="text-2xl font-light text-slate-800">Super fast interactive learning</h3>
                                <p className="text-slate-500 mt-2 text-sm leading-relaxed">Experience learning that feels like play. Connect concepts seamlessly with our intuitive engine.</p>
                            </div>
                        </section>

                        {/* Companies & Courses Carousel */}
                        <section className="py-20 bg-[#121214] border-t border-[#1A1A1A]">
                            <div className="w-full overflow-hidden flex mb-20 whitespace-nowrap opacity-60 hover:opacity-100 transition-opacity relative before:absolute before:left-0 before:top-0 before:w-32 before:h-full before:bg-gradient-to-r before:from-[#121214] before:to-transparent before:z-10 after:absolute after:right-0 after:top-0 after:w-32 after:h-full after:bg-gradient-to-l after:from-[#121214] after:to-transparent after:z-10">
                                <div className="flex animate-marquee gap-32 px-16 items-center">
                                    {[...companies, ...companies].map((c, i) => (
                                        <span key={i} className="text-2xl md:text-3xl font-extralight text-gray-500 tracking-[0.2em]">{c}</span>
                                    ))}
                                </div>
                            </div>

                            <div className="max-w-[1400px] mx-auto px-6">
                                <h3 className="text-white text-3xl font-light mb-12">Advanced Specializations</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {courses.map((course, i) => (
                                        <div key={i} className="bg-[#161617] border border-[#27272A] shadow-sm p-8 rounded-2xl min-h-[250px] flex flex-col justify-between group hover:border-gray-500 hover:shadow-md transition-all cursor-pointer">
                                            <div>
                                                <h4 className="text-white font-medium text-lg mb-4">{course.title}</h4>
                                                <p className="text-gray-400 text-sm leading-relaxed">{course.desc}</p>
                                            </div>
                                            <div className="flex items-center justify-between mt-8">
                                                <span className="text-accent-purple text-xs font-bold tracking-widest">{course.modules}</span>
                                                <span className="material-symbols-outlined text-gray-500 group-hover:text-white transition-colors">arrow_forward</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>

                        {/* Horizontal Scroll Section */}
                        <section ref={horizontalScrollRef} className="h-screen w-full bg-[#121214] flex items-center overflow-hidden border-t border-[#1A1A1A] relative">
                            {/* Dot Grid Pattern for dark background */}
                            <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>

                            <div className="text-3xl md:text-4xl lg:text-5xl font-light text-white absolute top-20 left-10 md:left-20 z-10 w-[300px]">
                                What are the things<br />you will learn
                            </div>
                            <div className="absolute bottom-20 left-10 md:left-20 z-10 flex gap-8 md:gap-12 font-medium text-gray-400 text-sm">
                                <div className="text-center">
                                    <div className="text-xl md:text-2xl text-white font-bold">200k+</div>
                                    active learners
                                </div>
                                <div className="text-center">
                                    <div className="text-xl md:text-2xl text-white font-bold">20+</div>
                                    companies
                                </div>
                                <div className="text-center">
                                    <div className="text-xl md:text-2xl text-white font-bold">50+</div>
                                    roadmaps
                                </div>
                            </div>

                            {/* Card Container that Scrolls */}
                            <div ref={scrollContainerRef} className="flex gap-8 px-10 md:px-[40vw] h-[55vh] mt-10 w-max">
                                {/* Card 1 */}
                                <div className="w-[350px] md:w-[450px] h-full bg-[#161617] rounded-3xl border border-[#27272A] shadow-xl shrink-0 flex flex-col p-8 md:p-10 relative overflow-hidden group hover:-translate-y-2 transition-transform duration-300">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
                                    <h3 className="text-2xl font-bold text-white mb-2 md:mb-4 z-10">User Journey</h3>
                                    <p className="text-gray-400 mb-6 md:mb-8 z-10 text-sm md:text-base">Follow a crafted path from absolute basics to advanced architectures. Your progress is mapped every step of the way.</p>
                                    <div className="flex-1 rounded-2xl bg-[#0b0b0c] border border-[#1A1A1A] flex items-center justify-center p-6 z-10 min-h-[150px]">
                                        <div className="w-full h-full border-2 border-dashed border-gray-700/50 rounded-xl relative overflow-hidden">
                                            {/* Dummy Graph */}
                                            <div className="absolute bottom-4 left-4 right-4 h-1 bg-[#1A1A1A] rounded-full"></div>
                                            <div className="absolute bottom-4 left-4 h-1 w-1/3 bg-blue-500 rounded-full"></div>
                                            <div className="absolute bottom-3 left-[33%] w-3 h-3 bg-blue-500 rounded-full border-2 border-[#161617]"></div>
                                        </div>
                                    </div>
                                </div>

                                {/* Card 2 */}
                                <div className="w-[350px] md:w-[450px] h-full bg-[#161617] rounded-3xl border border-[#27272A] shadow-xl shrink-0 flex flex-col p-8 md:p-10 relative overflow-hidden group hover:-translate-y-2 transition-transform duration-300">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-accent-purple/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
                                    <h3 className="text-2xl font-bold text-white mb-2 md:mb-4 z-10">Company Roadmap</h3>
                                    <p className="text-gray-400 mb-6 md:mb-8 z-10 text-sm md:text-base">Target specific companies with tailored curricula. Google, MAANG, and fast-growing startups.</p>
                                    <div className="flex-1 rounded-2xl bg-[#0b0b0c] border border-[#1A1A1A] flex items-center justify-center p-6 z-10 min-h-[150px]">
                                        <div className="w-full h-full flex flex-col gap-3 justify-center">
                                            <div className="w-3/4 h-8 bg-[#1A1A1A] border border-gray-800 rounded flex items-center px-4 text-xs font-semibold text-gray-300"><span className="w-2 h-2 rounded-full bg-accent-purple mr-2"></span> Amazon</div>
                                            <div className="w-full h-8 bg-[#1A1A1A] border border-gray-800 rounded flex items-center px-4 text-xs font-semibold text-gray-300"><span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span> Google</div>
                                            <div className="w-5/6 h-8 bg-[#1A1A1A] border border-gray-800 rounded flex items-center px-4 text-xs font-semibold text-gray-300"><span className="w-2 h-2 rounded-full bg-rose-500 mr-2"></span> Meta</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Card 3 */}
                                <div className="w-[350px] md:w-[450px] h-full bg-[#161617] rounded-3xl border border-[#27272A] shadow-xl shrink-0 flex flex-col p-8 md:p-10 relative overflow-hidden group hover:-translate-y-2 transition-transform duration-300">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
                                    <h3 className="text-2xl font-bold text-white mb-2 md:mb-4 z-10">DSA & SQL</h3>
                                    <p className="text-gray-400 mb-6 md:mb-8 z-10 text-sm md:text-base">Interactive visualizers for data structures and a sandbox for writing production-grade SQL.</p>
                                    <div className="flex-1 rounded-2xl bg-[#0b0b0c] border border-[#1A1A1A] flex items-center justify-center p-6 z-10 min-h-[150px]">
                                        <div className="flex gap-4 items-end h-full w-full pb-0">
                                            <div className="w-1/4 h-1/3 bg-emerald-500/40 rounded-t-lg"></div>
                                            <div className="w-1/4 h-2/3 bg-emerald-500/70 rounded-t-lg"></div>
                                            <div className="w-1/4 h-1/2 bg-emerald-500/30 rounded-t-lg"></div>
                                            <div className="w-1/4 h-full bg-emerald-500 rounded-t-lg"></div>
                                        </div>
                                    </div>
                                </div>

                                {/* Card 4 */}
                                <div className="w-[350px] md:w-[450px] h-full bg-[#161617] rounded-3xl border border-[#27272A] shadow-xl shrink-0 flex flex-col p-8 md:p-10 relative overflow-hidden group hover:-translate-y-2 transition-transform duration-300">
                                    <h3 className="text-2xl font-bold text-white mb-2 md:mb-4 z-10">PYQ & Crack Jobs</h3>
                                    <p className="text-gray-400 mb-6 md:mb-8 z-10 text-sm md:text-base">Previous year questions and direct company referrals from verified human resources contacts.</p>
                                    <div className="flex-1 rounded-2xl bg-[#0b0b0c] border border-[#1A1A1A] flex items-center justify-center p-6 z-10 min-h-[150px]">
                                        <div className="w-full h-full border border-dashed border-gray-700/50 rounded flex items-center justify-center text-gray-500 font-medium text-sm">
                                            Database Connected
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Testimonial Section (New) */}
                        <section className="py-24 bg-[#0b0b0c] border-t border-[#1A1A1A] flex flex-col items-center justify-center">
                            <div className="max-w-3xl px-6 text-center">
                                <div className="bg-[#161617] border border-[#27272A] rounded-3xl p-10 md:p-16 shadow-2xl relative">
                                    <div className="absolute top-8 left-8 text-6xl text-[#27272A] font-serif leading-none">"</div>
                                    <p className="text-xl md:text-3xl text-gray-300 font-light leading-relaxed italic relative z-10 mb-8">
                                        This project is so good we love this and super cool interactions. The platform feels like it's from the future.
                                    </p>
                                    <div className="flex flex-col items-center justify-center gap-4">
                                        <div className="w-16 h-16 bg-[#1A1A1A] rounded-full border-4 border-[#27272A] shadow-md flex items-center justify-center text-white font-bold text-xl">
                                            A
                                        </div>
                                        <div className="text-sm font-medium text-white">Alex Student</div>
                                        <button className="text-sm text-accent-purple font-medium hover:text-white transition-colors flex items-center gap-1 mt-2">
                                            see more reviews <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Custom Pricing Accordion */}
                        <section className="py-24 bg-[#0b0b0c]">
                            <div className="max-w-[1000px] mx-auto px-4 md:px-6">
                                <div className="text-center mb-16">
                                    <h2 className="text-white text-4xl font-light mb-4">Choose Your Vector</h2>
                                    <p className="text-gray-400 text-lg font-light">Simple, transparent pricing for every stage of your career.</p>
                                </div>

                                <div className="flex w-full h-[600px] rounded-2xl overflow-hidden bg-[#161617] border border-[#27272A] shadow-2xl">
                                    {/* --- BASIC TIER --- */}
                                    <div
                                        onClick={() => setActiveTier("BASIC")}
                                        className={`relative transition-all duration-500 ease-in-out border-r border-[#1A1A1A] cursor-pointer overflow-hidden group ${activeTier === "BASIC" ? "flex-[1_1_80%]" : "flex-[0_0_80px] md:flex-[0_0_100px]"}`}
                                    >
                                        <div className="absolute left-0 top-0 w-[80px] md:w-[100px] h-full bg-[#161617] z-10 flex flex-col items-center justify-center border-r-2 border-transparent transition-colors group-hover:bg-[#1A1A1A]">
                                            <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(147, 51, 234, 0.2) 2px, rgba(147, 51, 234, 0.2) 4px)' }}></div>
                                            {activeTier === "BASIC" && <div className="absolute left-[30%] top-1/2 -translate-y-1/2 w-[40px] h-[150px] opacity-40 pointer-events-none transition-all duration-300" style={{ backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(147, 51, 234, 0.4) 2px, rgba(147, 51, 234, 0.4) 6px, transparent 6px, transparent 8px)' }}></div>}
                                            <span className={`[writing-mode:vertical-rl] rotate-180 tracking-[0.5em] font-semibold text-xs md:text-sm mt-4 whitespace-nowrap transition-colors duration-300 ${activeTier === "BASIC" ? "text-gray-300" : "text-gray-600"}`}>B A S I C</span>
                                        </div>
                                        <div className={`absolute top-0 left-[80px] md:left-[100px] w-[calc(100%-80px)] md:w-[calc(100%-100px)] h-full bg-[#0b0b0c] p-8 md:p-12 transition-all duration-300 delay-100 flex flex-col ${activeTier === "BASIC" ? "opacity-100 visible translate-x-0" : "opacity-0 invisible -translate-x-8"}`}>
                                            <div className="flex-1">
                                                <h3 className="text-3xl font-bold mb-8 text-white">BASIC</h3>
                                                <div className="text-5xl font-extrabold text-accent-purple mb-6">Rs.0</div>
                                                <p className="text-gray-400 text-sm mb-10 font-bold">Free forever</p>

                                                <button className="w-full md:w-[300px] py-4 rounded-xl border border-[#27272A] text-white font-bold text-lg mb-12 hover:bg-[#1A1A1A] transition-colors">Start Free</button>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-12">
                                                    <div className="flex gap-4 text-gray-400 text-sm items-center"><span className="w-1.5 h-1.5 bg-accent-purple rounded-full"></span> 50+ DSA Problems</div>
                                                    <div className="flex gap-4 text-gray-400 text-sm items-center"><span className="w-1.5 h-1.5 bg-accent-purple rounded-full"></span> Basic SQL Sandbox</div>
                                                    <div className="flex gap-4 text-gray-400 text-sm items-center"><span className="w-1.5 h-1.5 bg-accent-purple rounded-full"></span> Community Access</div>
                                                    <div className="flex gap-4 text-gray-400 text-sm items-center"><span className="w-1.5 h-1.5 bg-accent-purple rounded-full"></span> Weekly Newsletter</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* --- STANDARD TIER --- */}
                                    <div
                                        onClick={() => setActiveTier("STANDARD")}
                                        className={`relative transition-all duration-500 ease-in-out border-r border-[#1A1A1A] cursor-pointer overflow-hidden group ${activeTier === "STANDARD" ? "flex-[1_1_80%]" : "flex-[0_0_80px] md:flex-[0_0_100px]"}`}
                                    >
                                        <div className="absolute left-0 top-0 w-[80px] md:w-[100px] h-full bg-[#1A1A1A] z-10 flex flex-col items-center justify-center border-r-2 border-transparent transition-colors group-hover:bg-[#27272A]">
                                            <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(147, 51, 234, 0.3) 2px, rgba(147, 51, 234, 0.3) 4px)' }}></div>
                                            {activeTier === "STANDARD" ? null : <div className="absolute left-[30%] top-1/2 -translate-y-1/2 w-[40px] h-[200px] opacity-50 pointer-events-none transition-all duration-300" style={{ backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(147, 51, 234, 0.5) 2px, rgba(147, 51, 234, 0.5) 4px, transparent 4px, transparent 6px)' }}></div>}
                                            <span className={`[writing-mode:vertical-rl] rotate-180 tracking-[0.5em] font-bold text-xs md:text-sm mt-4 whitespace-nowrap transition-colors duration-300 ${activeTier === "STANDARD" ? "text-white" : "text-accent-purple"}`}>S T A N D A R D</span>
                                        </div>
                                        <div className={`absolute top-0 left-[80px] md:left-[100px] w-[calc(100%-80px)] md:w-[calc(100%-100px)] h-full bg-[#121214] p-8 md:p-12 transition-all duration-300 delay-100 flex flex-col ${activeTier === "STANDARD" ? "opacity-100 visible translate-x-0" : "opacity-0 invisible -translate-x-8"}`}>
                                            <div className="flex-1 flex flex-col items-center justify-center w-full">
                                                <h3 className="text-3xl font-bold mb-8 text-white">STANDARD</h3>
                                                <div className="text-5xl font-extrabold text-accent-purple mb-6">Rs.500</div>
                                                <p className="text-gray-400 text-sm mb-10 font-bold">Per month</p>

                                                <button className="w-full max-w-[400px] py-4 rounded-xl bg-accent-purple text-white font-bold text-lg mb-12 hover:bg-purple-600 shadow-lg shadow-purple-500/20 transition-all">Buy Plan</button>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-12 w-full max-w-[600px] mx-auto">
                                                    <div className="flex gap-4 text-gray-300 text-sm items-center"><span className="w-1.5 h-1.5 bg-accent-purple rounded-full"></span> All DSA Problems</div>
                                                    <div className="flex gap-4 text-gray-300 text-sm items-center"><span className="w-1.5 h-1.5 bg-accent-purple rounded-full"></span> Visual SQL Sandbox</div>
                                                    <div className="flex gap-4 text-gray-300 text-sm items-center"><span className="w-1.5 h-1.5 bg-accent-purple rounded-full"></span> 10 Company Roadmaps</div>
                                                    <div className="flex gap-4 text-gray-300 text-sm items-center"><span className="w-1.5 h-1.5 bg-accent-purple rounded-full"></span> Portfolio Templates</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* --- PRO TIER --- */}
                                    <div
                                        onClick={() => setActiveTier("PRO")}
                                        className={`relative transition-all duration-500 ease-in-out cursor-pointer overflow-hidden group bg-[#0b0b0c] ${activeTier === "PRO" ? "flex-[1_1_80%]" : "flex-[0_0_80px] md:flex-[0_0_100px]"}`}
                                    >
                                        <div className="absolute left-0 top-0 w-[80px] md:w-[100px] h-full bg-[#0b0b0c] z-10 flex flex-col items-center justify-center border-r border-[#1A1A1A] transition-colors group-hover:bg-black">
                                            <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(255, 255, 255, 0.1) 2px, rgba(255, 255, 255, 0.1) 4px)' }}></div>
                                            <span className={`[writing-mode:vertical-rl] rotate-180 tracking-[0.5em] font-semibold text-xs md:text-sm mt-4 whitespace-nowrap transition-colors duration-300 ${activeTier === "PRO" ? "text-gray-400" : "text-gray-500"}`}>P R O</span>
                                        </div>
                                        <div className={`absolute top-0 left-[80px] md:left-[100px] w-[calc(100%-80px)] md:w-[calc(100%-100px)] h-full bg-[#161617] p-8 md:p-12 transition-all duration-300 delay-100 flex flex-col ${activeTier === "PRO" ? "opacity-100 visible translate-x-0" : "opacity-0 invisible -translate-x-8"}`}>
                                            <div className="flex-1 flex flex-col items-center justify-center w-full">
                                                <h3 className="text-3xl font-bold mb-8 text-white">PRO</h3>
                                                <div className="text-5xl font-extrabold text-[#FACC15] mb-6">Rs.1500</div>
                                                <p className="text-gray-400 text-sm mb-10 font-bold">Per month</p>

                                                <button className="w-full max-w-[400px] py-4 rounded-xl bg-white text-black font-bold text-lg mb-12 hover:bg-gray-200 transition-colors shadow-xl">Buy Pro Plan</button>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-12 w-full max-w-[600px] mx-auto">
                                                    <div className="flex gap-4 text-gray-300 text-sm items-center"><span className="w-1.5 h-1.5 bg-[#FACC15] rounded-full"></span> Mock Interview Sessions</div>
                                                    <div className="flex gap-4 text-gray-300 text-sm items-center"><span className="w-1.5 h-1.5 bg-[#FACC15] rounded-full"></span> All 50+ Roadmaps</div>
                                                    <div className="flex gap-4 text-gray-300 text-sm items-center"><span className="w-1.5 h-1.5 bg-[#FACC15] rounded-full"></span> HR Contacts Database</div>
                                                    <div className="flex gap-4 text-gray-300 text-sm items-center"><span className="w-1.5 h-1.5 bg-[#FACC15] rounded-full"></span> 1-on-1 Mentorship</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* FAQ Section */}
                        <section className="py-24 bg-[#121214] border-t border-[#1A1A1A]">
                            <div className="max-w-[800px] mx-auto px-6">
                                <h3 className="text-white text-3xl font-light text-center mb-16">Frequently Asked Questions</h3>
                                <div className="space-y-4">
                                    {faqs.map((faq, i) => (
                                        <div key={i} className="bg-[#161617] border text-left border-[#27272A] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                            <button
                                                className="w-full flex items-center justify-between p-6 text-left"
                                                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                            >
                                                <span className="text-white font-medium text-lg">{faq.q}</span>
                                                <span className={`material-symbols-outlined text-accent-purple transition-transform duration-300 bg-accent-purple/10 p-2 rounded-full ${openFaq === i ? 'rotate-45' : ''}`}>add</span>
                                            </button>
                                            <div
                                                className={`transition-all duration-300 ease-in-out px-6 ${openFaq === i ? 'max-h-40 opacity-100 pb-6' : 'max-h-0 opacity-0'}`}
                                            >
                                                <p className="text-gray-400 leading-relaxed pt-2 border-t border-[#27272A] mt-2">{faq.a}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>

                    </main>

                    {/* Footer */}
                    <footer className="bg-[#0b0b0c] border-t border-[#1A1A1A] py-16 px-6 md:px-10">
                        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 text-sm text-gray-400">
                            <div className="space-y-4 md:col-span-1">
                                <div className="flex items-center gap-3 text-white">
                                    <div className="size-6 bg-accent-purple text-white flex items-center justify-center rounded">
                                        <span className="font-bold text-[10px] tracking-wide">M</span>
                                    </div>
                                    <span className="font-semibold tracking-wider text-sm">Monolith AI</span>
                                </div>
                                <p className="text-gray-500 font-light pr-4 leading-relaxed">Don't just prepare. Evolve. Beat the automation curve.</p>
                            </div>

                            <div>
                                <h5 className="text-white font-medium mb-4">Platform</h5>
                                <ul className="space-y-3 text-gray-500 font-light">
                                    <li><a href="#" className="hover:text-accent-purple transition-colors">Algorithm Lab</a></li>
                                    <li><a href="#" className="hover:text-accent-purple transition-colors">SQL Sandbox</a></li>
                                    <li><a href="#" className="hover:text-accent-purple transition-colors">System Design Canvas</a></li>
                                </ul>
                            </div>

                            <div>
                                <h5 className="text-white font-medium mb-4">Company</h5>
                                <ul className="space-y-3 text-gray-500 font-light">
                                    <li><a href="#" className="hover:text-accent-purple transition-colors">About Us</a></li>
                                    <li><a href="#" className="hover:text-accent-purple transition-colors">Careers</a></li>
                                    <li><a href="#" className="hover:text-accent-purple transition-colors">Contact</a></li>
                                </ul>
                            </div>

                            <div>
                                <h5 className="text-white font-medium mb-4">Stay updated</h5>
                                <div className="flex relative">
                                    <input type="email" placeholder="Enter your email" className="w-full bg-[#161617] border border-[#27272A] text-white px-4 py-3 rounded-lg focus:outline-none focus:border-accent-purple focus:ring-1 focus:ring-accent-purple transition-all text-sm shadow-sm" />
                                    <button className="absolute right-2 top-1/2 -translate-y-1/2 text-accent-purple hover:text-white transition-colors p-2 bg-accent-purple/10 hover:bg-accent-purple hover:text-white rounded-md">
                                        <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="max-w-[1400px] mx-auto mt-16 pt-8 border-t border-[#1A1A1A] flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-light text-gray-500 tracking-wide">
                            <div>© 2026 Monolith AI Inc. All rights reserved.</div>
                            <div className="flex gap-6 font-medium">
                                <a href="#" className="hover:text-accent-purple transition-colors">Facebook</a>
                                <a href="#" className="hover:text-accent-purple transition-colors">Twitter</a>
                                <a href="#" className="hover:text-accent-purple transition-colors">LinkedIn</a>
                            </div>
                        </div>
                    </footer>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
