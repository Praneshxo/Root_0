import React, { useState } from 'react';
import { Navbar, Footer } from '../components/SharedLayout';

const ContactPage: React.FC = () => {
    const [form, setForm] = useState({ name: '', email: '', subject: 'General', message: '' });
    const [sent, setSent] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSent(true);
    };

    return (
        <div className="bg-[#0b0b0c] text-slate-200 antialiased min-h-screen">
            <Navbar />
            <main>
                {/* Hero */}
                <section className="py-24 px-6 border-b border-[#1A1A1A] relative overflow-hidden">
                    <div className="absolute top-0 left-1/4 w-[500px] h-[300px] bg-purple-700/6 rounded-full blur-[120px] pointer-events-none" />
                    <div className="max-w-[700px] mx-auto text-center relative z-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#27272A] bg-[#161617] text-xs tracking-widest font-semibold text-gray-500 mb-8">
                            <span className="text-base">💬</span>
                            GET IN TOUCH
                        </div>
                        <h1 className="text-white text-5xl md:text-6xl font-light mb-6">We're real people.<br /><span className="font-semibold">Talk to us.</span></h1>
                        <p className="text-gray-400 text-lg font-light">Questions, feedback, partnerships, or just want to say hi — we read every message.</p>
                    </div>
                </section>

                {/* Split layout */}
                <section className="py-24 px-6 bg-[#121214]">
                    <div className="max-w-[1100px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">

                        {/* Left — info */}
                        <div>
                            <h2 className="text-white text-2xl font-light mb-10">Other ways to reach us</h2>
                            <div className="space-y-6">
                                {[
                                    {
                                        icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 7l10 7 10-7"/></svg>,
                                        label: "General enquiries",
                                        value: "hello@monolith.ai",
                                        href: "mailto:hello@monolith.ai"
                                    },
                                    {
                                        icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 7l10 7 10-7"/></svg>,
                                        label: "Careers",
                                        value: "careers@monolith.ai",
                                        href: "mailto:careers@monolith.ai"
                                    },
                                    {
                                        icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>,
                                        label: "LinkedIn",
                                        value: "linkedin.com/company/monolith-ai",
                                        href: "https://linkedin.com"
                                    },
                                    {
                                        icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/></svg>,
                                        label: "Instagram",
                                        value: "@monolith.ai",
                                        href: "https://instagram.com"
                                    },
                                ].map((item, i) => (
                                    <a key={i} href={item.href} target="_blank" rel="noopener noreferrer"
                                        className="flex items-center gap-4 p-5 bg-[#161617] border border-[#27272A] rounded-xl hover:border-[#7c3aed]/40 transition-colors group">
                                        <div className="w-10 h-10 rounded-lg bg-[#7c3aed]/10 flex items-center justify-center text-[#7c3aed] shrink-0">
                                            {item.icon}
                                        </div>
                                        <div>
                                            <div className="text-xs text-gray-600 mb-0.5">{item.label}</div>
                                            <div className="text-sm text-gray-300 group-hover:text-white transition-colors">{item.value}</div>
                                        </div>
                                        <svg className="ml-auto text-gray-600 group-hover:text-[#7c3aed] transition-colors" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                                    </a>
                                ))}
                            </div>

                            <div className="mt-10 p-6 bg-[#0d0d0f] border border-[#1A1A1A] rounded-xl">
                                <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium mb-2">
                                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                    Typical response time
                                </div>
                                <p className="text-gray-500 text-sm">We respond to all messages within <span className="text-white">24–48 hours</span> on business days.</p>
                            </div>
                        </div>

                        {/* Right — form */}
                        <div className="bg-[#161617] border border-[#27272A] rounded-2xl p-8">
                            {sent ? (
                                <div className="h-full flex flex-col items-center justify-center text-center py-12">
                                    <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-6">
                                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>
                                    </div>
                                    <h3 className="text-white text-xl font-semibold mb-3">Message sent!</h3>
                                    <p className="text-gray-400 text-sm">We'll get back to you within 24–48 hours.</p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <h2 className="text-white text-xl font-semibold mb-6">Send us a message</h2>
                                    <div>
                                        <label className="text-xs text-gray-500 tracking-wide mb-2 block">YOUR NAME</label>
                                        <input
                                            type="text" required
                                            value={form.name}
                                            onChange={e => setForm({...form, name: e.target.value})}
                                            className="w-full bg-[#111113] border border-[#27272A] text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#7c3aed] transition-all text-sm"
                                            placeholder="Arjun Nair"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-500 tracking-wide mb-2 block">EMAIL ADDRESS</label>
                                        <input
                                            type="email" required
                                            value={form.email}
                                            onChange={e => setForm({...form, email: e.target.value})}
                                            className="w-full bg-[#111113] border border-[#27272A] text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#7c3aed] transition-all text-sm"
                                            placeholder="arjun@email.com"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-500 tracking-wide mb-2 block">SUBJECT</label>
                                        <select
                                            value={form.subject}
                                            onChange={e => setForm({...form, subject: e.target.value})}
                                            className="w-full bg-[#111113] border border-[#27272A] text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#7c3aed] transition-all text-sm"
                                        >
                                            <option>General</option>
                                            <option>Pricing & Plans</option>
                                            <option>Technical Issue</option>
                                            <option>Partnership</option>
                                            <option>University Group Discount</option>
                                            <option>Affiliate Program</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-500 tracking-wide mb-2 block">MESSAGE</label>
                                        <textarea
                                            required rows={5}
                                            value={form.message}
                                            onChange={e => setForm({...form, message: e.target.value})}
                                            className="w-full bg-[#111113] border border-[#27272A] text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#7c3aed] transition-all text-sm resize-none"
                                            placeholder="Tell us what's on your mind..."
                                        />
                                    </div>
                                    <button type="submit" className="w-full py-3.5 bg-[#7c3aed] text-white font-semibold rounded-lg hover:bg-[#6d28d9] transition-colors shadow-lg shadow-purple-500/20">
                                        Send Message →
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default ContactPage;
