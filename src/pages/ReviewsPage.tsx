import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar, Footer } from '../components/SharedLayout';

const allReviews = [
    { name: "Arjun Kumar", company: "Google", role: "SDE-2", tag: "MAANG", initial: "A", color: "bg-[#7c3aed]", quote: "The HR contacts database alone got me 3 interview calls in a week. I sent 12 emails using the contacts, got 3 responses, 2 interviews, and 1 offer. Placed at Google SDE-2.", plan: "PRO" },
    { name: "Rohan Verma", company: "Amazon", role: "SDE-1", tag: "MAANG", initial: "R", color: "bg-blue-600", quote: "The DSA visualizers finally made me understand recursion and DP. After 6 months of struggling, it clicked in 2 weeks here. Got Amazon in 6 weeks.", plan: "STANDARD" },
    { name: "Priya Nair", company: "Flipkart", role: "SDE-1", tag: "Unicorn", initial: "P", color: "bg-emerald-600", quote: "Study notes for CS core subjects are insanely structured. Revised entire OS and CN in 2 days before my Flipkart interview. Cracked it.", plan: "STANDARD" },
    { name: "Sneha Rao", company: "Microsoft", role: "SDE-2", tag: "MAANG", initial: "S", color: "bg-rose-600", quote: "System design canvas is incredible. I went from having no idea how to answer design questions to confidently designing Twitter in interviews. Microsoft offer received.", plan: "PRO" },
    { name: "Vikram Singh", company: "Swiggy", role: "Backend Engineer", tag: "Unicorn", initial: "V", color: "bg-orange-600", quote: "SQL sandbox with real company questions is a gem. I solved actual Flipkart and Swiggy SQL questions before the interview. Knew exactly what to expect.", plan: "BASIC" },
    { name: "Kavya Menon", company: "Meta", role: "SDE-2", tag: "MAANG", initial: "K", color: "bg-indigo-600", quote: "1-on-1 mentorship sessions were worth every rupee. My mentor caught 3 critical gaps in my preparation that I had completely missed. Meta offer in 8 weeks.", plan: "PRO" },
    { name: "Rahul Das", company: "Razorpay", role: "Senior SDE", tag: "Unicorn", initial: "R", color: "bg-cyan-600", quote: "Company-specific roadmaps are brilliant. The Razorpay roadmap had specific topics they focus on. It felt like having an insider's guide.", plan: "STANDARD" },
    { name: "Ananya Gupta", company: "Google", role: "L4 SWE", tag: "MAANG", initial: "A", color: "bg-yellow-600", quote: "Mock interview sessions with feedback were brutal but exactly what I needed. My interviewer pointed out I was verbose in explanations. Fixed it, cracked Google.", plan: "PRO" },
    { name: "Kiran Reddy", company: "Atlassian", role: "SDE-2", tag: "MNC", initial: "K", color: "bg-teal-600", quote: "The PYQ bank is massive and well-organized. Found 4 questions from my actual Atlassian interview in the database. Luck? I think not.", plan: "STANDARD" },
];

const companies = ["All", "Google", "Amazon", "Meta", "Microsoft", "Flipkart", "Swiggy", "Razorpay", "Atlassian"];

const ReviewsPage: React.FC = () => {
    const navigate = useNavigate();
    const [filter, setFilter] = useState("All");
    const [showForm, setShowForm] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const filtered = filter === "All" ? allReviews : allReviews.filter(r => r.company === filter);

    return (
        <div className="bg-[#0b0b0c] text-slate-200 antialiased min-h-screen">
            <Navbar />
            <main>
                {/* Hero */}
                <section className="relative py-24 px-6 border-b border-[#1A1A1A] overflow-hidden">
                    <div className="absolute top-0 left-1/4 w-[600px] h-[350px] bg-purple-700/6 rounded-full blur-[140px] pointer-events-none" />
                    <div className="max-w-[1200px] mx-auto relative z-10">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-10">
                            <div>
                                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#27272A] bg-[#161617] text-xs tracking-widest font-semibold text-gray-500 mb-6">
                                    <span className="text-base">⭐</span>
                                    STUDENT REVIEWS
                                </div>
                                <h1 className="text-white text-5xl font-light">
                                    Students who<br /><span className="font-semibold">made it.</span>
                                </h1>
                            </div>
                            <div className="flex items-center gap-8">
                                {[
                                    { num: "1,200+", label: "Students placed", color: "text-white" },
                                    { num: "92%", label: "Interview success", color: "text-[#7c3aed]" },
                                    { num: "₹18L", label: "Avg package", color: "text-emerald-400" },
                                ].map((s, i) => (
                                    <div key={i} className="text-center">
                                        <div className={`text-3xl font-bold ${s.color}`}>{s.num}</div>
                                        <div className="text-xs text-gray-500 mt-1">{s.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Filters */}
                        <div className="flex items-center gap-3 flex-wrap">
                            {companies.map(c => (
                                <button key={c} onClick={() => setFilter(c)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${filter === c ? 'bg-[#7c3aed] border-[#7c3aed] text-white' : 'border-[#27272A] text-gray-400 hover:border-gray-500 hover:text-white'}`}>
                                    {c}
                                </button>
                            ))}
                            <button onClick={() => setShowForm(true)}
                                className="ml-auto px-4 py-2 rounded-full text-sm font-medium border border-[#7c3aed]/40 text-[#7c3aed] hover:bg-[#7c3aed]/10 transition-all flex items-center gap-2">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
                                Submit your review
                            </button>
                        </div>
                    </div>
                </section>

                {/* Reviews grid */}
                <section className="py-16 px-6 bg-[#121214]">
                    <div className="max-w-[1200px] mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {filtered.map((review, i) => (
                                <div key={i} className="bg-[#161617] border border-[#27272A] rounded-2xl p-7 flex flex-col justify-between hover:border-[#7c3aed]/30 transition-colors group relative">
                                    <div className="absolute top-5 right-5 text-3xl text-[#27272A] font-serif leading-none">"</div>
                                    <div className="mb-6">
                                        <p className="text-gray-300 text-sm font-light leading-relaxed italic">{review.quote}</p>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className={`w-10 h-10 rounded-full ${review.color} flex items-center justify-center text-white font-bold text-sm shrink-0`}>
                                                {review.initial}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="text-sm font-semibold text-white">{review.name}</div>
                                                <div className="text-xs text-gray-500">{review.role} · {review.company}</div>
                                            </div>
                                            <span className={`text-[9px] px-2 py-1 rounded-full border shrink-0 ${review.tag === 'MAANG' ? 'border-blue-500/20 text-blue-400 bg-blue-500/10' : review.tag === 'Unicorn' ? 'border-purple-500/20 text-purple-400 bg-purple-500/10' : 'border-gray-500/20 text-gray-400 bg-gray-500/10'}`}>
                                                {review.tag}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 pt-3 border-t border-[#1A1A1A]">
                                            <span className="text-[10px] text-gray-600">Plan used:</span>
                                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${review.plan === 'PRO' ? 'text-[#FACC15] bg-yellow-500/10' : review.plan === 'STANDARD' ? 'text-[#7c3aed] bg-purple-500/10' : 'text-gray-400 bg-gray-500/10'}`}>
                                                {review.plan}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {filtered.length === 0 && (
                            <div className="text-center py-20 text-gray-500">No reviews for {filter} yet. Be the first!</div>
                        )}
                    </div>
                </section>

                {/* Submit review modal */}
                {showForm && (
                    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center px-4">
                        <div className="bg-[#161617] border border-[#27272A] rounded-2xl p-8 w-full max-w-[500px] shadow-2xl">
                            {submitted ? (
                                <div className="text-center py-8">
                                    <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-5">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>
                                    </div>
                                    <h3 className="text-white text-xl font-semibold mb-3">Thanks for sharing! 🎉</h3>
                                    <p className="text-gray-400 text-sm mb-6">Your review will be verified and published within 24 hours.</p>
                                    <button onClick={() => { setShowForm(false); setSubmitted(false); }} className="px-6 py-2.5 bg-[#7c3aed] text-white text-sm font-semibold rounded-lg hover:bg-[#6d28d9] transition-colors">Done</button>
                                </div>
                            ) : (
                                <>
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="text-white text-xl font-semibold">Share your story</h2>
                                        <button onClick={() => setShowForm(false)} className="w-8 h-8 rounded-full bg-[#1A1A1A] flex items-center justify-center text-gray-500 hover:text-white transition-colors">
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                                        </button>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-xs text-gray-500 mb-1.5 block">YOUR NAME</label>
                                                <input className="w-full bg-[#111113] border border-[#27272A] text-white px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:border-[#7c3aed]" placeholder="Arjun K." />
                                            </div>
                                            <div>
                                                <label className="text-xs text-gray-500 mb-1.5 block">COMPANY PLACED AT</label>
                                                <input className="w-full bg-[#111113] border border-[#27272A] text-white px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:border-[#7c3aed]" placeholder="Google" />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-xs text-gray-500 mb-1.5 block">YOUR EXPERIENCE</label>
                                            <textarea rows={4} className="w-full bg-[#111113] border border-[#27272A] text-white px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:border-[#7c3aed] resize-none" placeholder="Tell us your placement story..." />
                                        </div>
                                        <button onClick={() => setSubmitted(true)} className="w-full py-3 bg-[#7c3aed] text-white font-semibold rounded-lg hover:bg-[#6d28d9] transition-colors">
                                            Submit Review →
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                )}

                {/* CTA */}
                <section className="py-20 px-6 bg-[#0b0b0c] border-t border-[#1A1A1A] text-center">
                    <div className="max-w-[500px] mx-auto">
                        <h2 className="text-white text-3xl font-light mb-4">Your story next?</h2>
                        <p className="text-gray-500 text-sm mb-8">Join 1,200+ students who turned rejections into offers.</p>
                        <button onClick={() => navigate('/signup')} className="px-8 py-3.5 bg-[#7c3aed] text-white font-semibold rounded-lg hover:bg-[#6d28d9] transition-colors shadow-lg shadow-purple-500/30">
                            Start for Free →
                        </button>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default ReviewsPage;
