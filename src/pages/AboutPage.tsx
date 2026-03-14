import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Navbar, Footer } from '../components/SharedLayout';

gsap.registerPlugin(ScrollTrigger);

const team = [
    { name: "Aryan Mehta", role: "Founder & CEO", bio: "Ex-Google SWE. Placed 500+ students before building this platform.", initial: "A", color: "bg-[#7c3aed]" },
    { name: "Sneha Rao", role: "Head of Content", bio: "IIT Bombay. Authored DSA curriculum used by 200k+ learners.", initial: "S", color: "bg-blue-600" },
    { name: "Kiran Das", role: "CTO", bio: "Built scalable systems at Amazon. Loves distributed databases.", initial: "K", color: "bg-emerald-600" },
    { name: "Priya Nath", role: "Head of HR Network", bio: "10 years in talent acquisition. Curates our 2000+ HR database.", initial: "P", color: "bg-rose-600" },
];

const values = [
    { icon: "⚡", title: "Speed over perfection", desc: "We ship fast, iterate faster. Learning tools should never lag behind industry needs." },
    { icon: "🎯", title: "Outcome first", desc: "Every feature we build is measured by one metric: did it help someone get placed?" },
    { icon: "🔓", title: "Radical transparency", desc: "No dark patterns, no hidden fees. What you see is exactly what you get." },
    { icon: "🤝", title: "Human over algorithm", desc: "AI assists, but human mentors and real HR contacts are always at the core." },
];

const AboutPage: React.FC = () => {
    const navigate = useNavigate();
    const heroRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (heroRef.current) {
            gsap.fromTo(heroRef.current.children,
                { y: 40, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.9, stagger: 0.15, ease: "power3.out", delay: 0.2 }
            );
        }
    }, []);

    return (
        <div className="bg-[#0b0b0c] text-slate-200 antialiased min-h-screen">
            <Navbar />
            <main>
                {/* Hero */}
                <section className="relative py-32 px-6 overflow-hidden border-b border-[#1A1A1A]">
                    <div className="absolute top-0 left-1/3 w-[600px] h-[400px] bg-purple-700/8 rounded-full blur-[140px] pointer-events-none" />
                    <div className="max-w-[900px] mx-auto relative z-10" ref={heroRef}>
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#27272A] bg-[#161617] text-xs tracking-widest font-semibold text-gray-500 mb-8">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#7c3aed]" />
                            OUR STORY
                        </div>
                        <h1 className="text-white text-6xl md:text-7xl font-light leading-[1.05] tracking-tight mb-8">
                            We got rejected.<br />
                            <span className="font-semibold">Then we built the<br />platform we needed.</span>
                        </h1>
                        <p className="text-gray-400 text-xl font-light leading-relaxed max-w-2xl">
                            Master.AI was born from frustration. After countless rejections from MAANG companies despite being technically capable, our founders realized the problem wasn't skill — it was access. Access to the right resources, the right contacts, the right preparation path.
                        </p>
                    </div>
                </section>

                {/* Mission */}
                <section className="py-24 px-6 bg-[#121214] border-b border-[#1A1A1A]">
                    <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-white text-4xl font-light mb-6">Our mission is simple.</h2>
                            <p className="text-gray-400 text-lg leading-relaxed mb-6">
                                Make world-class placement preparation accessible to every engineering student in India — regardless of their college tier, city, or background.
                            </p>
                            <p className="text-gray-500 text-base leading-relaxed">
                                The hiring game is unfair. Tier-1 college students get referrals, mock interviews, and mentors. Everyone else gets YouTube tutorials. We're changing that by giving every student the same unfair advantage.
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { num: "1,200+", label: "Students placed" },
                                { num: "2,000+", label: "Verified HR contacts" },
                                { num: "92%", label: "Interview success rate" },
                                { num: "₹18L", label: "Average package" },
                            ].map((stat, i) => (
                                <div key={i} className="bg-[#161617] border border-[#27272A] rounded-2xl p-6">
                                    <div className="text-3xl font-bold text-white mb-1">{stat.num}</div>
                                    <div className="text-sm text-gray-500">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Values */}
                <section className="py-24 px-6 bg-[#0b0b0c] border-b border-[#1A1A1A]">
                    <div className="max-w-[1200px] mx-auto">
                        <h2 className="text-white text-4xl font-light mb-14 text-center">What we believe in</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {values.map((v, i) => (
                                <div key={i} className="bg-[#111113] border border-[#27272A] rounded-2xl p-7 hover:border-[#7c3aed]/40 transition-colors group">
                                    <div className="text-3xl mb-5">{v.icon}</div>
                                    <h3 className="text-white font-semibold text-base mb-3">{v.title}</h3>
                                    <p className="text-gray-500 text-sm leading-relaxed">{v.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Team */}
                <section className="py-24 px-6 bg-[#121214] border-b border-[#1A1A1A]">
                    <div className="max-w-[1200px] mx-auto">
                        <h2 className="text-white text-4xl font-light mb-4 text-center">The team</h2>
                        <p className="text-gray-500 text-center mb-14">People who've been in your shoes and built the ladder back down.</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {team.map((member, i) => (
                                <div key={i} className="bg-[#161617] border border-[#27272A] rounded-2xl p-7 hover:border-[#7c3aed]/30 transition-colors group">
                                    <div className={`w-14 h-14 rounded-full ${member.color} flex items-center justify-center text-white font-bold text-xl mb-5`}>
                                        {member.initial}
                                    </div>
                                    <h3 className="text-white font-semibold text-base mb-1">{member.name}</h3>
                                    <p className="text-[#7c3aed] text-xs font-medium tracking-wide mb-3">{member.role}</p>
                                    <p className="text-gray-500 text-sm leading-relaxed">{member.bio}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="py-24 px-6 bg-[#0b0b0c] text-center">
                    <div className="max-w-[600px] mx-auto">
                        <h2 className="text-white text-4xl font-light mb-6">Ready to start?</h2>
                        <p className="text-gray-400 mb-10">Join 1,200+ students who turned rejections into offers.</p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <button onClick={() => navigate('/signup')} className="px-8 py-3.5 bg-[#7c3aed] text-white font-semibold rounded-lg hover:bg-[#6d28d9] transition-colors shadow-lg shadow-purple-500/30">
                                Get Started Free
                            </button>
                            <button onClick={() => navigate('/contact')} className="px-8 py-3.5 border border-[#27272A] text-gray-300 font-semibold rounded-lg hover:bg-[#161617] transition-colors">
                                Talk to Us
                            </button>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default AboutPage;
