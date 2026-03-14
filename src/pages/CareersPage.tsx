import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar, Footer } from '../components/SharedLayout';

const roles = [
    {
        dept: "Engineering",
        positions: [
            { title: "Senior Frontend Engineer", type: "Full-time", location: "Remote", desc: "Build interactive learning tools using React, GSAP, and Three.js. You'll own the visual experience layer.", skills: ["React", "TypeScript", "GSAP", "Tailwind"] },
            { title: "Backend Engineer — Node.js", type: "Full-time", location: "Bangalore / Remote", desc: "Design APIs and real-time systems for our learning platform. Experience with Postgres and Redis preferred.", skills: ["Node.js", "PostgreSQL", "Redis", "AWS"] },
        ]
    },
    {
        dept: "Content & Education",
        positions: [
            { title: "DSA Content Creator", type: "Full-time", location: "Remote", desc: "Create high-quality DSA problems, editorial explanations, and visual learning material for our platform.", skills: ["DSA", "C++/Java", "Technical Writing"] },
            { title: "System Design Writer", type: "Contract", location: "Remote", desc: "Write in-depth system design walkthroughs and case studies for FAANG-level preparation.", skills: ["System Design", "HLD/LLD", "Content Strategy"] },
        ]
    },
    {
        dept: "Growth & Partnerships",
        positions: [
            { title: "Campus Ambassador Manager", type: "Full-time", location: "Bangalore", desc: "Build and manage our campus ambassador network across 100+ colleges in India.", skills: ["Community Building", "B2C Sales", "College Networks"] },
            { title: "HR Network Specialist", type: "Full-time", location: "Remote", desc: "Expand and verify our 2000+ HR contacts database. Build relationships with hiring managers.", skills: ["Talent Acquisition", "LinkedIn Outreach", "Data Management"] },
        ]
    },
];

const CareersPage: React.FC = () => {
    const navigate = useNavigate();
    const [openRole, setOpenRole] = useState<string | null>(null);
    const [applied, setApplied] = useState<string | null>(null);

    return (
        <div className="bg-[#0b0b0c] text-slate-200 antialiased min-h-screen">
            <Navbar />
            <main>
                {/* Hero */}
                <section className="relative py-32 px-6 border-b border-[#1A1A1A] overflow-hidden">
                    <div className="absolute top-0 right-1/4 w-[500px] h-[400px] bg-blue-700/6 rounded-full blur-[130px] pointer-events-none" />
                    <div className="max-w-[900px] mx-auto relative z-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#27272A] bg-[#161617] text-xs tracking-widest font-semibold text-gray-500 mb-8">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            WE'RE HIRING
                        </div>
                        <h1 className="text-white text-6xl md:text-7xl font-light leading-[1.05] mb-8">
                            Build the platform<br />
                            <span className="font-semibold">you wish existed.</span>
                        </h1>
                        <p className="text-gray-400 text-xl font-light leading-relaxed max-w-2xl mb-10">
                            Join a small, ambitious team obsessed with helping students crack their dream jobs. Remote-first, outcome-driven, and deeply mission-aligned.
                        </p>
                        <div className="flex gap-6 flex-wrap">
                            {[
                                { label: "Remote-first culture" },
                                { label: "Equity for early hires" },
                                { label: "No micro-management" },
                            ].map((perk, i) => (
                                <div key={i} className="flex items-center gap-2 text-sm text-gray-400">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>
                                    {perk.label}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Roles */}
                <section className="py-24 px-6 bg-[#121214]">
                    <div className="max-w-[900px] mx-auto">
                        <h2 className="text-white text-3xl font-light mb-14">Open positions</h2>
                        <div className="space-y-12">
                            {roles.map((dept) => (
                                <div key={dept.dept}>
                                    <div className="flex items-center gap-3 mb-6">
                                        <span className="text-xs tracking-widest font-semibold text-[#7c3aed]">{dept.dept.toUpperCase()}</span>
                                        <div className="flex-1 h-px bg-[#1A1A1A]" />
                                    </div>
                                    <div className="space-y-4">
                                        {dept.positions.map((pos) => (
                                            <div key={pos.title} className="bg-[#161617] border border-[#27272A] rounded-2xl overflow-hidden hover:border-[#7c3aed]/30 transition-colors">
                                                <button
                                                    className="w-full flex items-center justify-between p-6 text-left"
                                                    onClick={() => setOpenRole(openRole === pos.title ? null : pos.title)}
                                                >
                                                    <div className="flex flex-col gap-1">
                                                        <span className="text-white font-semibold text-lg">{pos.title}</span>
                                                        <div className="flex items-center gap-3 text-xs text-gray-500">
                                                            <span className="flex items-center gap-1">
                                                                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                                                                {pos.type}
                                                            </span>
                                                            <span>·</span>
                                                            <span>{pos.location}</span>
                                                        </div>
                                                    </div>
                                                    <span className={`w-8 h-8 rounded-full bg-[#7c3aed]/10 border border-[#7c3aed]/20 flex items-center justify-center transition-transform duration-300 shrink-0 ${openRole === pos.title ? 'rotate-45' : ''}`}>
                                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
                                                    </span>
                                                </button>
                                                {openRole === pos.title && (
                                                    <div className="px-6 pb-6 border-t border-[#1A1A1A]">
                                                        <p className="text-gray-400 text-sm leading-relaxed mt-5 mb-5">{pos.desc}</p>
                                                        <div className="flex flex-wrap gap-2 mb-6">
                                                            {pos.skills.map(s => (
                                                                <span key={s} className="text-xs px-3 py-1 rounded-full bg-[#1A1A1A] border border-[#27272A] text-gray-400">{s}</span>
                                                            ))}
                                                        </div>
                                                        {applied === pos.title ? (
                                                            <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium">
                                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>
                                                                Application sent! We'll get back to you within 3 days.
                                                            </div>
                                                        ) : (
                                                            <button
                                                                onClick={() => setApplied(pos.title)}
                                                                className="px-6 py-2.5 bg-[#7c3aed] text-white text-sm font-semibold rounded-lg hover:bg-[#6d28d9] transition-colors"
                                                            >
                                                                Apply Now →
                                                            </button>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* No fit CTA */}
                <section className="py-20 px-6 bg-[#0b0b0c] border-t border-[#1A1A1A] text-center">
                    <div className="max-w-[600px] mx-auto">
                        <h3 className="text-white text-2xl font-light mb-4">Don't see your role?</h3>
                        <p className="text-gray-500 text-sm mb-8">We're always looking for exceptional people. Send us your portfolio and tell us what you'd build.</p>
                        <a href="mailto:careers@monolith.ai" className="inline-flex items-center gap-2 px-6 py-3 border border-[#27272A] text-gray-300 text-sm font-medium rounded-lg hover:bg-[#161617] transition-colors">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 7l10 7 10-7"/></svg>
                            careers@monolith.ai
                        </a>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default CareersPage;
