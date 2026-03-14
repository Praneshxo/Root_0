import React, { useEffect, useState, useRef, useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Navbar, Footer } from '../components/SharedLayout';
import gsap from 'gsap';
import { ScrollTrigger } from "gsap/ScrollTrigger";
import InteractiveHands from '../components/InteractiveHands';
import { SmoothCursor } from '../components/ui/smooth-cursor';

gsap.registerPlugin(ScrollTrigger);

const hrContacts = [
    { name: "Priya Sharma", role: "Technical Recruiter", company: "Google", email: "p.sharma@google.com", tag: "MAANG" },
    { name: "Rahul Mehta", role: "HR Manager", company: "Amazon", email: "r.mehta@amazon.com", tag: "MAANG" },
    { name: "Sneha Iyer", role: "Talent Acquisition", company: "Flipkart", email: "s.iyer@flipkart.com", tag: "Unicorn" },
    { name: "Arjun Nair", role: "Campus Recruiter", company: "Microsoft", email: "a.nair@microsoft.com", tag: "MAANG" },
    { name: "Divya Patel", role: "HR Lead", company: "Swiggy", email: "d.patel@swiggy.com", tag: "Startup" },
];

const HRInboxMockup: React.FC = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [typed, setTyped] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const contact = hrContacts[activeIndex];

    useEffect(() => {
        setIsTyping(true);
        setTyped("");
        let i = 0;
        const interval = setInterval(() => {
            setTyped(contact.email.slice(0, i + 1));
            i++;
            if (i >= contact.email.length) {
                clearInterval(interval);
                setIsTyping(false);
            }
        }, 45);
        return () => clearInterval(interval);
    }, [activeIndex]);

    return (
        <div className="bg-[#111113] border border-[#27272A] rounded-2xl overflow-hidden shadow-2xl">
            {/* Window bar */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-[#1A1A1A] bg-[#0d0d0f]">
                <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
                <span className="w-3 h-3 rounded-full bg-[#28c840]" />
                <span className="ml-4 text-xs text-gray-600 tracking-wide">New Message — Mail</span>
            </div>

            <div className="flex h-[400px]">
                {/* Sidebar contact list */}
                <div className="w-[200px] border-r border-[#1A1A1A] flex flex-col py-3 shrink-0">
                    <p className="text-[10px] tracking-widest text-gray-600 px-4 mb-3 font-semibold">CONTACTS</p>
                    {hrContacts.map((c, i) => (
                        <button
                            key={i}
                            onClick={() => setActiveIndex(i)}
                            className={`flex flex-col px-4 py-2.5 text-left transition-colors ${activeIndex === i ? "bg-accent-purple/10 border-l-2 border-accent-purple" : "hover:bg-[#161617] border-l-2 border-transparent"}`}
                        >
                            <span className={`text-xs font-semibold ${activeIndex === i ? "text-white" : "text-gray-400"}`}>{c.name}</span>
                            <span className="text-[10px] text-gray-600 mt-0.5">{c.company}</span>
                        </button>
                    ))}
                    <div className="mt-auto px-4 py-3 border-t border-[#1A1A1A]">
                        <div className="text-[10px] text-gray-600 text-center">+1,995 more contacts</div>
                        <div className="w-full mt-2 h-1 bg-[#1A1A1A] rounded-full overflow-hidden">
                            <div className="h-full w-[8%] bg-accent-purple rounded-full" />
                        </div>
                    </div>
                </div>

                {/* Compose area */}
                <div className="flex-1 flex flex-col p-6 gap-4">
                    {/* To field */}
                    <div className="flex items-center gap-3 border-b border-[#1A1A1A] pb-3">
                        <span className="text-xs text-gray-600 w-8 shrink-0">To</span>
                        <div className="flex items-center gap-2 flex-1">
                            <div className="flex items-center gap-2 bg-[#1A1A1A] border border-[#27272A] rounded-full px-3 py-1">
                                <div className="w-5 h-5 rounded-full bg-accent-purple/20 flex items-center justify-center text-[9px] text-accent-purple font-bold">
                                    {contact.name[0]}
                                </div>
                                <span className="text-xs text-gray-300">{contact.name}</span>
                                <span className="text-[9px] text-gray-600">· {contact.role}</span>
                            </div>
                        </div>
                        <span className={`text-[9px] px-2 py-0.5 rounded-full border ${contact.tag === "MAANG" ? "border-blue-500/30 text-blue-400 bg-blue-500/10" :
                            contact.tag === "Unicorn" ? "border-purple-500/30 text-purple-400 bg-purple-500/10" :
                                "border-emerald-500/30 text-emerald-400 bg-emerald-500/10"
                            }`}>{contact.tag}</span>
                    </div>

                    {/* Email field — typewriter */}
                    <div className="flex items-center gap-3 border-b border-[#1A1A1A] pb-3">
                        <span className="text-xs text-gray-600 w-8 shrink-0">Email</span>
                        <div className="flex-1 font-mono text-sm text-emerald-400 tracking-wide">
                            {typed}
                            {isTyping && <span className="animate-pulse text-emerald-400">|</span>}
                        </div>
                        <button className="text-[10px] px-2 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 transition-colors">
                            Copy
                        </button>
                    </div>

                    {/* Subject */}
                    <div className="flex items-center gap-3 border-b border-[#1A1A1A] pb-3">
                        <span className="text-xs text-gray-600 w-8 shrink-0">Sub</span>
                        <span className="text-sm text-gray-500 italic">Referral Request — SDE Role @ {contact.company}</span>
                    </div>

                    {/* Body placeholder */}
                    <div className="flex-1 relative">
                        <p className="text-sm text-gray-600 leading-relaxed">
                            Hi {contact.name.split(" ")[0]}, I came across your profile and wanted to reach out regarding open SDE positions at {contact.company}...
                        </p>
                        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[#111113] to-transparent" />
                    </div>

                    {/* Bottom bar */}
                    <div className="flex items-center justify-between pt-2 border-t border-[#1A1A1A]">
                        <div className="flex items-center gap-2 text-[10px] text-gray-600">
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg>
                            Pro feature — unlock full database
                        </div>
                        <button className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-[#7c3aed] text-white text-xs font-semibold hover:bg-[#6d28d9] transition-colors">
                            Send
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const studyTopics = [
    {
        id: "dsa",
        label: "Data Structures & Algorithms",
        icon: "🧩",
        tag: "Core",
        tagColor: "text-blue-400 bg-blue-500/10 border-blue-500/20",
        preview: {
            title: "DSA Mastersheet",
            desc: "Covers Arrays, Linked Lists, Trees, Graphs, DP and more. Includes pattern recognition guides and complexity cheatsheets.",
            items: ["150+ topic-wise problems", "Pattern recognition guide", "Big-O cheatsheet", "Top interview templates"],
            updated: "2 days ago",
            pages: 84,
        }
    },
    {
        id: "system",
        label: "System Design",
        icon: "🏗️",
        tag: "Advanced",
        tagColor: "text-purple-400 bg-purple-500/10 border-purple-500/20",
        preview: {
            title: "System Design Playbook",
            desc: "How to design Twitter, YouTube, Uber and 20+ other systems. Covers load balancing, caching, sharding, and CAP theorem.",
            items: ["20+ real system walkthroughs", "HLD & LLD templates", "CAP theorem deep-dive", "Scalability patterns"],
            updated: "1 week ago",
            pages: 112,
        }
    },
    {
        id: "sql",
        label: "SQL & Databases",
        icon: "🗄️",
        tag: "Core",
        tagColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
        preview: {
            title: "SQL Zero to Hero",
            desc: "From basic SELECT to window functions and query optimization. Includes real interview questions from product-based companies.",
            items: ["Window functions guide", "Query optimization tips", "50+ interview questions", "Index & execution plans"],
            updated: "3 days ago",
            pages: 56,
        }
    },
    {
        id: "core",
        label: "CS Core Subjects",
        icon: "⚙️",
        tag: "Theory",
        tagColor: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
        preview: {
            title: "OS · CN · DBMS Notes",
            desc: "Concise revision notes for Operating Systems, Computer Networks and DBMS. Built specifically for placement interviews.",
            items: ["OS process & memory notes", "CN protocols simplified", "DBMS normalization guide", "PYQ answer bank"],
            updated: "5 days ago",
            pages: 98,
        }
    },
    {
        id: "behavioral",
        label: "HR & Behavioral",
        icon: "🎤",
        tag: "Soft Skills",
        tagColor: "text-rose-400 bg-rose-500/10 border-rose-500/20",
        preview: {
            title: "HR Interview Bible",
            desc: "Top 50 HR questions with structured STAR-format answers. Includes salary negotiation scripts and offer letter guidance.",
            items: ["50 HR questions answered", "STAR framework templates", "Salary negotiation script", "Offer letter checklist"],
            updated: "1 day ago",
            pages: 42,
        }
    },
];

const StudyNotesSplitScreen: React.FC = () => {
    const [activeTopic, setActiveTopic] = useState(studyTopics[0]);
    const [animating, setAnimating] = useState(false);

    const handleSelect = (topic: typeof studyTopics[0]) => {
        if (topic.id === activeTopic.id) return;
        setAnimating(true);
        setTimeout(() => {
            setActiveTopic(topic);
            setAnimating(false);
        }, 180);
    };

    return (
        <div className="flex flex-col lg:flex-row gap-0 rounded-2xl overflow-hidden border border-[#27272A] shadow-2xl min-h-[460px]">

            {/* Left — topic list */}
            <div className="lg:w-[280px] shrink-0 bg-[#0d0d0f] border-r border-[#1A1A1A] flex flex-col py-4">
                <p className="text-[10px] tracking-widest text-gray-600 px-5 mb-3 font-semibold">TOPICS</p>
                {studyTopics.map((topic) => (
                    <button
                        key={topic.id}
                        onClick={() => handleSelect(topic)}
                        className={`flex items-center gap-3 px-5 py-3.5 text-left transition-all border-l-2 ${activeTopic.id === topic.id
                            ? "bg-[#161617] border-accent-purple"
                            : "border-transparent hover:bg-[#111113] hover:border-gray-700"
                            }`}
                    >
                        <span className="text-lg shrink-0">{topic.icon}</span>
                        <div className="flex-1 min-w-0">
                            <p className={`text-sm font-medium truncate ${activeTopic.id === topic.id ? "text-white" : "text-gray-400"}`}>
                                {topic.label}
                            </p>
                        </div>
                        {activeTopic.id === topic.id && (
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2.5">
                                <path d="M9 18l6-6-6-6" />
                            </svg>
                        )}
                    </button>
                ))}
            </div>

            {/* Right — preview card */}
            <div className={`flex-1 bg-[#111113] p-8 md:p-10 flex flex-col justify-between transition-opacity duration-200 ${animating ? "opacity-0" : "opacity-100"}`}>
                <div>
                    <div className="flex items-start justify-between mb-6 gap-4">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <span className="text-2xl">{activeTopic.icon}</span>
                                <h3 className="text-white text-xl font-semibold">{activeTopic.preview.title}</h3>
                            </div>
                            <p className="text-gray-400 text-sm leading-relaxed max-w-lg">{activeTopic.preview.desc}</p>
                        </div>
                        <span className={`shrink-0 text-[10px] font-bold tracking-widest px-2.5 py-1 rounded-full border ${activeTopic.tagColor}`}>
                            {activeTopic.tag}
                        </span>
                    </div>

                    {/* Feature list */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
                        {activeTopic.preview.items.map((item, i) => (
                            <div key={i} className="flex items-center gap-3 bg-[#161617] border border-[#1A1A1A] rounded-lg px-4 py-3">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2.5">
                                    <path d="M20 6L9 17l-5-5" />
                                </svg>
                                <span className="text-gray-300 text-sm">{item}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer meta + CTA */}
                <div className="flex items-center justify-between pt-6 border-t border-[#1A1A1A]">
                    <div className="flex items-center gap-6 text-xs text-gray-600">
                        <div className="flex items-center gap-1.5">
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
                            </svg>
                            Updated {activeTopic.preview.updated}
                        </div>
                        <div className="flex items-center gap-1.5">
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><path d="M14 2v6h6" />
                            </svg>
                            {activeTopic.preview.pages} pages
                        </div>
                    </div>
                    <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#7c3aed] text-white text-sm font-semibold hover:bg-[#6d28d9] transition-colors shadow-lg shadow-purple-500/20">
                        Access Notes
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};
const LandingPage: React.FC = () => {
    const navigate = useNavigate();
    const { user, loading } = useAuth();
    const [activeTier, setActiveTier] = useState("PRO");
    const [openFaq, setOpenFaq] = useState<number | null>(0);

    // GSAP Refs
    const heroContentRef = useRef<HTMLDivElement>(null);
    const horizontalScrollRef = useRef<HTMLElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const ballRef = useRef<HTMLDivElement>(null);

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

                // Ball bounce animation - Sixth Refinement: Timing & Hide at End
                if (ballRef.current && scrollContainerRef.current) {
                    // --- TUNE THESE VALUES ---
                    const startY = 20;     // Initial Y position (aligned with text)
                    const topY = 12;       // Peak height of the bounce (lower value = higher jump)
                    const restY = 21.8;    // Landing Y position (height of card tops)
                    const finalY = 75;     // Final fall position (bottom of screen)
                    const travelDistance = window.innerWidth * 0.6;  // Total X distance to travel
                    const totalHops = 6;  // How many times the ball bounces
                    const startDelayPercent = 0.15; // % of scroll spent waiting at "learn"
                    // -------------------------

                    const totalScrollPx = Math.abs(
                        scrollContainerRef.current.scrollWidth - window.innerWidth
                    );

                    const ballTl = gsap.timeline({ paused: true });

                    // 1. Initial Wait (Stay at "learn" text)
                    const waitDuration = totalScrollPx * startDelayPercent;
                    ballTl.to(ballRef.current, {
                        top: `${startY}%`,
                        x: 0,
                        opacity: 1,
                        duration: waitDuration
                    });

                    // 2. Moving Bouncy Hops
                    const xStep = travelDistance / totalHops;
                    const hopScrollDuration = (totalScrollPx * (0.9 - startDelayPercent)) / totalHops;

                    for (let i = 1; i <= totalHops; i++) {
                        const targetX = i * xStep;
                        const midX = targetX - (xStep / 2);

                        // Arc Up
                        ballTl.to(ballRef.current, {
                            x: midX,
                            top: `${topY}%`,
                            ease: "sine.out",
                            duration: hopScrollDuration * 0.4,
                        });

                        // Land
                        ballTl.to(ballRef.current, {
                            x: targetX,
                            top: `${restY}%`,
                            ease: "sine.in",
                            duration: hopScrollDuration * 0.6,
                        });
                    }

                    // 3. Final Fall and Hide
                    ballTl.to(ballRef.current, {
                        top: `${finalY}%`,
                        opacity: 0, // Fades out so it doesn't jump in blank space
                        ease: "power2.inOut",
                        duration: totalScrollPx * 0.1,
                    });

                    ScrollTrigger.create({
                        trigger: horizontalScrollRef.current,
                        start: "top top",
                        end: () => `+=${totalScrollPx}`,
                        scrub: 1.2,
                        animation: ballTl,
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


    const faqs = [
        { q: "How do the visual builders work?", a: "Our proprietary visual builders represent syntax as logical blocks that can be manipulated in real-time, helping you grasp complex algorithms intuitively." },
        { q: "Are the HR contacts really verified?", a: "Yes, our database is updated weekly through direct integrations and manual verifications to ensure you're reaching out to active decision-makers." },
        { q: "Can I cancel my subscription anytime?", a: "Absolutely. No long-term commitments required. You can manage your subscription directly from the billing dashboard." },
        { q: "Do you offer university group discounts?", a: "We do. Please contact our support team with your university email to get a personalized quote for your cohort." }
    ];

    const companies = ["GOOGLE", "AMAZON", "META", "APPLE", "MICROSOFT", "NETFLIX", "TESLA", "ORACLE"];

    return (
        <div className="dark">
            <SmoothCursor />
            <div className="bg-[#ffffff] text-slate-200 font-display antialiased overflow-x-hidden min-h-screen selection:bg-accent-purple/30 selection:text-white">
                <div className="relative flex min-h-screen w-full flex-col group/design-root">

                    <Navbar />
                    <main className="flex flex-col grow">

                        {/* Hero Section */}
                        <section id="hero" className="flex flex-col lg:flex-row items-center justify-between px-6 py-20 lg:py-32 xl:py-40 relative flex-1 min-h-[85vh] overflow-hidden bg-[#fafafa]">
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
                        <section id="video" className="py-24 bg-[#fafafa] border-t border-gray-100 flex flex-col items-center justify-center">
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
                        <section id="courses" className="py-20 bg-[#121214] border-t border-[#1A1A1A]">
                            <div className="w-full overflow-hidden flex mb-20 whitespace-nowrap opacity-60 hover:opacity-100 transition-opacity relative before:absolute before:left-0 before:top-0 before:w-32 before:h-full before:bg-gradient-to-r before:from-[#121214] before:to-transparent before:z-10 after:absolute after:right-0 after:top-0 after:w-32 after:h-full after:bg-gradient-to-l after:from-[#121214] after:to-transparent after:z-10">
                                <div className="flex animate-marquee gap-32 px-16 items-center">
                                    {[...companies, ...companies].map((c, i) => (
                                        <span key={i} className="text-2xl md:text-3xl font-extralight text-gray-500 tracking-[0.2em]">{c}</span>
                                    ))}
                                </div>
                            </div>

                        </section>

                        {/* Horizontal Scroll Section */}
                        <section id="learn" ref={horizontalScrollRef} className="h-screen w-full bg-[#121214] flex items-center overflow-hidden border-t border-[#1A1A1A] relative">
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

                            {/* Bouncing Ball */}
                            <div
                                ref={ballRef}
                                className="absolute z-30 w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_3px_2px_rgba(255,255,255,0.3)]"
                                style={{ top: '21.8%', left: '345px', transform: 'translateX(0px)' }}
                            />

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

                        {/* HR Contacts Section */}
                        <section id="hr" className="py-24 bg-[#0b0b0c] border-t border-[#1A1A1A] overflow-hidden">
                            <div className="max-w-[1100px] mx-auto px-6">
                                <div className="flex flex-col lg:flex-row items-center gap-16">

                                    {/* Left copy */}
                                    <div className="lg:w-2/5 shrink-0">
                                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#27272A] bg-[#161617] text-xs tracking-widest font-semibold text-gray-500 mb-6">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                            LIVE DATABASE
                                        </div>
                                        <h2 className="text-white text-4xl font-light leading-tight mb-4">
                                            2000+ verified<br />
                                            <span className="font-semibold">HR contacts</span><br />
                                            at your fingertips
                                        </h2>
                                        <p className="text-gray-400 text-base leading-relaxed mb-6">
                                            Get direct access to hiring managers and HR professionals across top companies. No middlemen — you get their email, you reach out on your own terms.
                                        </p>
                                        <div className="flex flex-col gap-3 mb-8">
                                            {[
                                                { icon: "✉️", text: "Direct email access — no platform DMs" },
                                                { icon: "🔄", text: "Database updated every week" },
                                                { icon: "🏢", text: "500+ companies across MAANG, startups & MNCs" },
                                            ].map((item, i) => (
                                                <div key={i} className="flex items-center gap-3 text-sm text-gray-400">
                                                    <span>{item.icon}</span>
                                                    <span>{item.text}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#161617] border border-[#27272A] text-xs text-gray-500">
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2.5"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg>
                                            Available on Standard & Pro plans only
                                        </div>
                                    </div>

                                    {/* Right — Inbox UI mockup */}
                                    <div className="lg:w-3/5 w-full">
                                        <HRInboxMockup />
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Study Notes Section */}
                        <section id="notes" className="py-24 bg-[#121214] border-t border-[#1A1A1A] relative overflow-hidden">
                            {/* Ambient glows */}
                            <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[120px] pointer-events-none -translate-y-1/2" />
                            <div className="absolute top-1/3 right-0 w-[400px] h-[400px] bg-blue-600/5 rounded-full blur-[100px] pointer-events-none" />

                            <div className="max-w-[1300px] mx-auto px-6 relative z-10">

                                {/* Asymmetric header */}
                                <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-14 gap-6">
                                    <div>
                                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#27272A] bg-[#161617] text-xs tracking-widest font-semibold text-gray-500 mb-5">
                                            <span className="text-base">📚</span>
                                            STUDY MATERIALS
                                        </div>
                                        <h2 className="text-white text-5xl font-light leading-tight">
                                            Everything you need,<br />
                                            <span className="font-semibold">one place.</span>
                                        </h2>
                                    </div>
                                    {/* Floating stat cards on the right of heading */}
                                    <div className="flex gap-4 lg:mb-2 shrink-0">
                                        <div className="bg-[#161617] border border-[#27272A] rounded-xl px-5 py-4 text-center shadow-lg">
                                            <div className="text-2xl font-bold text-white">500+</div>
                                            <div className="text-[11px] text-gray-500 mt-1">study pages</div>
                                        </div>
                                        <div className="bg-[#161617] border border-[#27272A] rounded-xl px-5 py-4 text-center shadow-lg">
                                            <div className="text-2xl font-bold text-accent-purple">6</div>
                                            <div className="text-[11px] text-gray-500 mt-1">core subjects</div>
                                        </div>
                                        <div className="bg-[#161617] border border-[#27272A] rounded-xl px-5 py-4 text-center shadow-lg">
                                            <div className="text-2xl font-bold text-emerald-400">weekly</div>
                                            <div className="text-[11px] text-gray-500 mt-1">updates</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Split screen — now full width */}
                                <StudyNotesSplitScreen />

                                {/* Bottom ticker — fills remaining width */}
                                <div className="mt-8 flex items-center gap-4 overflow-hidden opacity-40">
                                    {["DSA", "System Design", "SQL", "OS", "CN", "DBMS", "HR Prep", "PYQs", "Mock Tests", "Cheatsheets"].map((tag, i) => (
                                        <span key={i} className="shrink-0 text-xs text-gray-500 border border-[#27272A] px-3 py-1.5 rounded-full">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </section>


                        {/* Custom Pricing Accordion */}
                        <section id="pricing" className="py-24 bg-[#0b0b0c]">
                            <div className="max-w-[1000px] mx-auto px-4 md:px-6">
                                <div className="text-center mb-16">
                                    <h2 className="text-white text-4xl font-light mb-4">Choose Your Vector</h2>
                                    <p className="text-gray-400 text-lg font-light">Simple, transparent pricing for every stage of your career.</p>
                                </div>

                                <div className="flex w-full h-[580px] rounded-2xl overflow-hidden border border-[#27272A] shadow-2xl">

                                    {/* --- BASIC TIER --- */}
                                    <div
                                        onClick={() => setActiveTier("BASIC")}
                                        className={`relative transition-all duration-500 ease-in-out cursor-pointer flex ${activeTier === "BASIC" ? "flex-[4]" : "flex-[0.4]"
                                            } bg-[#111113]`}
                                    >
                                        {/* Collapsed label */}
                                        <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${activeTier === "BASIC" ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
                                            <span className="[writing-mode:vertical-rl] rotate-180 tracking-[0.3em] font-medium text-xs text-gray-500 whitespace-nowrap">
                                                BASIC
                                            </span>
                                        </div>

                                        {/* Expanded content */}
                                        <div className={`absolute inset-0 flex flex-col justify-center px-10 md:px-14 transition-all duration-300 ${activeTier === "BASIC" ? "opacity-100 delay-150" : "opacity-0 pointer-events-none"}`}>
                                            <h3 className="text-2xl font-bold text-white mb-6">BASIC</h3>
                                            <div className="text-5xl font-extrabold text-white mb-2">Rs.399</div>
                                            <p className="text-gray-500 text-sm mb-3">1 month access</p>
                                            <div className="flex items-center gap-2 mb-8 px-3 py-2 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] w-fit">
                                                <span className="text-lg">🎬</span>
                                                <span className="text-gray-400 text-xs italic">"Less than a movie ticket."</span>
                                            </div>
                                            <button className="w-full max-w-[320px] py-3.5 rounded-xl border border-[#333] text-white font-semibold text-base mb-10 hover:bg-[#1A1A1A] transition-colors">
                                                Start Free
                                            </button>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                {["50+ DSA Problems", "Basic SQL Sandbox", "Community Access", "Weekly Newsletter"].map(f => (
                                                    <div key={f} className="flex items-center gap-3 text-gray-400 text-sm">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-gray-500 shrink-0" />
                                                        {f}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Divider */}
                                    <div className="w-px bg-[#27272A] shrink-0" />

                                    {/* --- STANDARD TIER --- */}
                                    <div
                                        onClick={() => setActiveTier("STANDARD")}
                                        className={`relative transition-all duration-500 ease-in-out cursor-pointer flex ${activeTier === "STANDARD" ? "flex-[4]" : "flex-[0.4]"
                                            } bg-[#131315]`}
                                    >
                                        {/* Collapsed label */}
                                        <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${activeTier === "STANDARD" ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
                                            <span className="[writing-mode:vertical-rl] rotate-180 tracking-[0.3em] font-medium text-xs text-accent-purple whitespace-nowrap">
                                                STANDARD
                                            </span>
                                        </div>

                                        {/* Expanded content */}
                                        <div className={`absolute inset-0 flex flex-col justify-center px-10 md:px-14 transition-all duration-300 ${activeTier === "STANDARD" ? "opacity-100 delay-150" : "opacity-0 pointer-events-none"}`}>
                                            <h3 className="text-2xl font-bold text-white mb-6">STANDARD</h3>
                                            <div className="text-5xl font-extrabold text-accent-purple mb-2">Rs.699</div>
                                            <p className="text-gray-500 text-sm mb-3">100 days access</p>
                                            <div className="flex items-center gap-2 mb-8 px-3 py-2 rounded-lg bg-[#1a1a1c] border border-[#2e2a3a] w-fit">
                                                <span className="text-lg">👕</span>
                                                <span className="text-purple-300 text-xs italic">"About the price of a branded T-shirt."</span>
                                            </div>
                                            <button className="w-full max-w-[320px] py-3.5 rounded-xl bg-[#7c3aed] text-white font-semibold text-base mb-10 hover:bg-[#6d28d9] transition-colors shadow-lg shadow-purple-500/20">
                                                Buy Plan
                                            </button>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                {["All DSA Problems", "Visual SQL Sandbox", "10 Company Roadmaps", "Portfolio Templates"].map(f => (
                                                    <div key={f} className="flex items-center gap-3 text-gray-300 text-sm">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-accent-purple shrink-0" />
                                                        {f}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Divider */}
                                    <div className="w-px bg-[#27272A] shrink-0" />

                                    {/* --- PRO TIER --- */}
                                    <div
                                        onClick={() => setActiveTier("PRO")}
                                        className={`relative transition-all duration-500 ease-in-out cursor-pointer flex ${activeTier === "PRO" ? "flex-[4]" : "flex-[0.4]"
                                            } bg-[#0d0d0f]`}
                                    >
                                        {/* Collapsed label */}
                                        <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${activeTier === "PRO" ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
                                            <span className="[writing-mode:vertical-rl] rotate-180 tracking-[0.3em] font-medium text-xs text-[#FACC15] whitespace-nowrap">
                                                PRO
                                            </span>
                                        </div>

                                        {/* Expanded content */}
                                        <div className={`absolute inset-0 flex flex-col justify-center px-10 md:px-14 transition-all duration-300 ${activeTier === "PRO" ? "opacity-100 delay-150" : "opacity-0 pointer-events-none"}`}>
                                            <div className="flex items-center gap-3 mb-6">
                                                <h3 className="text-2xl font-bold text-white">PRO</h3>
                                                <span className="text-[10px] font-bold tracking-widest px-2 py-1 rounded-full bg-[#FACC15]/10 text-[#FACC15] border border-[#FACC15]/20">
                                                    MOST POPULAR
                                                </span>
                                            </div>
                                            <div className="text-5xl font-extrabold text-[#FACC15] mb-2">Rs.1500</div>
                                            <p className="text-gray-500 text-sm mb-3">Lifetime access</p>
                                            <div className="flex items-center gap-2 mb-8 px-3 py-2 rounded-lg bg-[#1a1a10] border border-[#2e2a10] w-fit">
                                                <span className="text-lg">👟</span>
                                                <span className="text-yellow-300 text-xs italic">"Less than the price of a pair of sneakers."</span>
                                            </div>
                                            <button className="w-full max-w-[320px] py-3.5 rounded-xl bg-white text-black font-bold text-base mb-10 hover:bg-gray-100 transition-colors shadow-xl">
                                                Buy Pro Plan
                                            </button>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                {["Mock Interview Sessions", "All 50+ Roadmaps", "HR Contacts Database", "1-on-1 Mentorship"].map(f => (
                                                    <div key={f} className="flex items-center gap-3 text-gray-300 text-sm">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-[#FACC15] shrink-0" />
                                                        {f}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </section>
                        {/* FAQ Section */}
                        <section id="faq" className="py-24 bg-[#121214] border-t border-[#1A1A1A]">
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
                                                <span className={`w-8 h-8 rounded-full bg-accent-purple/10 border border-accent-purple/20 flex items-center justify-center transition-transform duration-300 shrink-0 ${openFaq === i ? 'rotate-45' : ''}`}>
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2.5" strokeLinecap="round">
                                                        <path d="M12 5v14M5 12h14" />
                                                    </svg>
                                                </span>
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

                    <Footer />
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
