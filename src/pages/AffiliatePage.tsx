import React, { useState, useEffect, useRef } from 'react';
import { Navbar, Footer } from '../components/SharedLayout';

type Step = 'landing' | 'otp' | 'dashboard';

const AffiliatePage: React.FC = () => {
    const [step, setStep] = useState<Step>('landing');
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [otpSent, setOtpSent] = useState(false);
    const [otpError, setOtpError] = useState(false);
    const [copied, setCopied] = useState(false);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    // Demo affiliate data
    const affiliateData = {
        name: email.split('@')[0] || 'Affiliate',
        coupon: 'MASTER20',
        commission: 20,
        totalEarned: 4800,
        pendingPayout: 1200,
        referrals: 32,
        conversions: 24,
        history: [
            { date: '12 Mar 2026', plan: 'PRO', amount: 300, status: 'Paid' },
            { date: '08 Mar 2026', plan: 'STANDARD', amount: 140, status: 'Paid' },
            { date: '05 Mar 2026', plan: 'PRO', amount: 300, status: 'Pending' },
            { date: '01 Mar 2026', plan: 'BASIC', amount: 80, status: 'Pending' },
            { date: '26 Feb 2026', plan: 'PRO', amount: 300, status: 'Paid' },
        ]
    };

    const handleSendOtp = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;
        setOtpSent(true);
        setStep('otp');
    };

    const handleOtpChange = (val: string, idx: number) => {
        if (!/^\d?$/.test(val)) return;
        const next = [...otp];
        next[idx] = val;
        setOtp(next);
        if (val && idx < 5) inputRefs.current[idx + 1]?.focus();
    };

    const handleOtpVerify = () => {
        const code = otp.join('');
        // Accept any 6-digit code for demo
        if (code.length === 6) {
            setOtpError(false);
            setStep('dashboard');
        } else {
            setOtpError(true);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(affiliateData.coupon);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="bg-[#0b0b0c] text-slate-200 antialiased min-h-screen">
            <Navbar />
            <main>

                {/* ── LANDING ── */}
                {step === 'landing' && (
                    <>
                        <section className="relative py-32 px-6 border-b border-[#1A1A1A] overflow-hidden">
                            <div className="absolute top-0 left-1/3 w-[600px] h-[400px] bg-yellow-500/5 rounded-full blur-[140px] pointer-events-none" />
                            <div className="max-w-[1100px] mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                                <div>
                                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#27272A] bg-[#161617] text-xs tracking-widest font-semibold text-gray-500 mb-8">
                                        <span className="text-base">💰</span>
                                        AFFILIATE PROGRAM
                                    </div>
                                    <h1 className="text-white text-6xl font-light leading-tight mb-6">
                                        Earn <span className="text-[#FACC15] font-semibold">20%</span><br />on every referral.
                                    </h1>
                                    <p className="text-gray-400 text-lg font-light leading-relaxed mb-8">
                                        Share your unique coupon code. When someone subscribes using it, you earn 20% of every transaction — forever, for lifetime plans.
                                    </p>
                                    <div className="grid grid-cols-3 gap-4 mb-10">
                                        {[
                                            { num: "20%", label: "Commission rate" },
                                            { num: "₹300", label: "Per PRO referral" },
                                            { num: "Weekly", label: "Payouts" },
                                        ].map((s, i) => (
                                            <div key={i} className="bg-[#161617] border border-[#27272A] rounded-xl p-4 text-center">
                                                <div className="text-xl font-bold text-[#FACC15] mb-1">{s.num}</div>
                                                <div className="text-xs text-gray-500">{s.label}</div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex flex-col gap-3">
                                        {[
                                            "Get your unique coupon code instantly",
                                            "Track referrals and conversions in real-time",
                                            "Weekly UPI/bank payouts, no minimum threshold",
                                            "Works on all plans — Basic, Standard, Pro",
                                        ].map((item, i) => (
                                            <div key={i} className="flex items-center gap-3 text-sm text-gray-400">
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FACC15" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>
                                                {item}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Sign-up card */}
                                <div className="bg-[#161617] border border-[#27272A] rounded-2xl p-8 shadow-2xl">
                                    <h2 className="text-white text-xl font-semibold mb-2">Join the program</h2>
                                    <p className="text-gray-500 text-sm mb-6">Enter your email. We'll send you a one-time code to verify.</p>
                                    <form onSubmit={handleSendOtp} className="space-y-4">
                                        <div>
                                            <label className="text-xs text-gray-500 tracking-wide mb-2 block">EMAIL ADDRESS</label>
                                            <input
                                                type="email" required
                                                value={email}
                                                onChange={e => setEmail(e.target.value)}
                                                className="w-full bg-[#111113] border border-[#27272A] text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#7c3aed] transition-all text-sm"
                                                placeholder="you@email.com"
                                            />
                                        </div>
                                        <button type="submit" className="w-full py-3.5 bg-[#FACC15] text-black font-bold rounded-lg hover:bg-yellow-300 transition-colors shadow-lg shadow-yellow-500/20">
                                            Get My Coupon Code →
                                        </button>
                                    </form>
                                    <p className="text-xs text-gray-600 mt-4 text-center">By joining you agree to our affiliate terms. Payouts processed every Monday.</p>
                                </div>
                            </div>
                        </section>

                        {/* How it works */}
                        <section className="py-24 px-6 bg-[#121214] border-b border-[#1A1A1A]">
                            <div className="max-w-[900px] mx-auto">
                                <h2 className="text-white text-3xl font-light text-center mb-14">How it works</h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    {[
                                        { step: "01", title: "Join & verify", desc: "Enter your email, verify with OTP, and get your unique coupon code instantly." },
                                        { step: "02", title: "Share your code", desc: "Share YOURCODE20 with friends, on social media, or in college groups." },
                                        { step: "03", title: "Earn every week", desc: "For every purchase made using your code, you earn 20%. Paid weekly to your UPI/bank." },
                                    ].map((item, i) => (
                                        <div key={i} className="relative">
                                            <div className="text-6xl font-bold text-[#1A1A1A] mb-4">{item.step}</div>
                                            <h3 className="text-white font-semibold text-lg mb-3">{item.title}</h3>
                                            <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                                            {i < 2 && <div className="hidden md:block absolute top-8 right-0 w-12 h-px bg-[#27272A]" />}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>
                    </>
                )}

                {/* ── OTP STEP ── */}
                {step === 'otp' && (
                    <section className="min-h-[80vh] flex items-center justify-center px-6 py-24">
                        <div className="w-full max-w-[440px]">
                            <div className="bg-[#161617] border border-[#27272A] rounded-2xl p-10 shadow-2xl text-center">
                                <div className="w-14 h-14 rounded-full bg-[#FACC15]/10 border border-[#FACC15]/20 flex items-center justify-center mx-auto mb-6">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FACC15" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 7l10 7 10-7"/></svg>
                                </div>
                                <h2 className="text-white text-2xl font-semibold mb-2">Check your inbox</h2>
                                <p className="text-gray-400 text-sm mb-2">We sent a 6-digit code to</p>
                                <p className="text-white font-medium text-sm mb-8">{email}</p>

                                {/* OTP inputs */}
                                <div className="flex gap-3 justify-center mb-6">
                                    {otp.map((digit, idx) => (
                                        <input
                                            key={idx}
                                            ref={el => inputRefs.current[idx] = el}
                                            type="text"
                                            maxLength={1}
                                            value={digit}
                                            onChange={e => handleOtpChange(e.target.value, idx)}
                                            onKeyDown={e => {
                                                if (e.key === 'Backspace' && !digit && idx > 0) inputRefs.current[idx - 1]?.focus();
                                            }}
                                            className={`w-11 h-12 text-center text-white text-lg font-bold bg-[#111113] border rounded-lg focus:outline-none transition-all ${otpError ? 'border-red-500' : 'border-[#27272A] focus:border-[#FACC15]'}`}
                                        />
                                    ))}
                                </div>

                                {otpError && <p className="text-red-400 text-xs mb-4">Please enter all 6 digits.</p>}

                                <button
                                    onClick={handleOtpVerify}
                                    className="w-full py-3.5 bg-[#FACC15] text-black font-bold rounded-lg hover:bg-yellow-300 transition-colors mb-4"
                                >
                                    Verify & Access Dashboard
                                </button>
                                <button
                                    onClick={() => setStep('landing')}
                                    className="text-sm text-gray-500 hover:text-white transition-colors"
                                >
                                    ← Change email
                                </button>

                                <div className="mt-6 pt-6 border-t border-[#1A1A1A]">
                                    <p className="text-xs text-gray-600">Didn't receive it? Check spam or <button className="text-[#FACC15] hover:underline" onClick={() => {}}>resend code</button></p>
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {/* ── DASHBOARD ── */}
                {step === 'dashboard' && (
                    <section className="py-16 px-6 bg-[#121214] min-h-[80vh]">
                        <div className="max-w-[1100px] mx-auto">

                            {/* Header */}
                            <div className="flex items-center justify-between mb-10 flex-wrap gap-4">
                                <div>
                                    <div className="text-xs text-gray-500 mb-1">Welcome back,</div>
                                    <h1 className="text-white text-3xl font-semibold capitalize">{affiliateData.name} 👋</h1>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-full">
                                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                    Affiliate Active
                                </div>
                            </div>

                            {/* Coupon card */}
                            <div className="bg-gradient-to-br from-[#1a1a10] to-[#0d0d0c] border border-[#FACC15]/20 rounded-2xl p-8 mb-8 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-48 h-48 bg-yellow-500/5 rounded-full blur-3xl" />
                                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
                                    <div>
                                        <p className="text-xs text-gray-500 tracking-widest mb-2">YOUR COUPON CODE</p>
                                        <div className="flex items-center gap-4">
                                            <span className="text-4xl font-bold text-[#FACC15] tracking-[0.15em] font-mono">{affiliateData.coupon}</span>
                                            <button onClick={handleCopy} className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-all ${copied ? 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10' : 'border-[#FACC15]/30 text-[#FACC15] bg-[#FACC15]/10 hover:bg-[#FACC15]/20'}`}>
                                                {copied ? (
                                                    <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg> Copied!</>
                                                ) : (
                                                    <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg> Copy</>
                                                )}
                                            </button>
                                        </div>
                                        <p className="text-gray-500 text-sm mt-2">Gives buyers a 5% discount · You earn 20% commission</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-4xl font-bold text-white mb-1">₹{affiliateData.totalEarned.toLocaleString()}</div>
                                        <div className="text-xs text-gray-500">Total earned</div>
                                    </div>
                                </div>
                            </div>

                            {/* Stats grid */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                                {[
                                    { label: "Pending payout", value: `₹${affiliateData.pendingPayout}`, color: "text-[#FACC15]" },
                                    { label: "Total referrals", value: affiliateData.referrals, color: "text-white" },
                                    { label: "Conversions", value: affiliateData.conversions, color: "text-emerald-400" },
                                    { label: "Conversion rate", value: `${Math.round((affiliateData.conversions / affiliateData.referrals) * 100)}%`, color: "text-[#7c3aed]" },
                                ].map((stat, i) => (
                                    <div key={i} className="bg-[#161617] border border-[#27272A] rounded-xl p-5">
                                        <div className={`text-2xl font-bold ${stat.color} mb-1`}>{stat.value}</div>
                                        <div className="text-xs text-gray-500">{stat.label}</div>
                                    </div>
                                ))}
                            </div>

                            {/* Payout history */}
                            <div className="bg-[#161617] border border-[#27272A] rounded-2xl overflow-hidden">
                                <div className="flex items-center justify-between px-6 py-4 border-b border-[#1A1A1A]">
                                    <h3 className="text-white font-medium">Recent transactions</h3>
                                    <span className="text-xs text-gray-600">Next payout: Monday</span>
                                </div>
                                <div className="divide-y divide-[#1A1A1A]">
                                    {affiliateData.history.map((tx, i) => (
                                        <div key={i} className="flex items-center justify-between px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-8 h-8 rounded-lg bg-[#111113] border border-[#27272A] flex items-center justify-center text-xs font-bold text-[#7c3aed]">
                                                    {tx.plan[0]}
                                                </div>
                                                <div>
                                                    <div className="text-white text-sm font-medium">{tx.plan} Plan referral</div>
                                                    <div className="text-xs text-gray-600">{tx.date}</div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="text-white font-semibold text-sm">+₹{tx.amount}</div>
                                                <span className={`text-[10px] px-2.5 py-1 rounded-full font-medium ${tx.status === 'Paid' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'}`}>
                                                    {tx.status}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="px-6 py-4 border-t border-[#1A1A1A] flex items-center justify-between">
                                    <span className="text-xs text-gray-600">Showing last 5 transactions</span>
                                    <button className="text-xs text-[#7c3aed] hover:text-white transition-colors">View all →</button>
                                </div>
                            </div>

                            {/* Payout CTA */}
                            <div className="mt-6 p-6 bg-[#0d0d0f] border border-[#1A1A1A] rounded-xl flex flex-col md:flex-row items-center justify-between gap-4">
                                <div>
                                    <p className="text-white font-medium mb-1">Ready to withdraw?</p>
                                    <p className="text-gray-500 text-sm">₹{affiliateData.pendingPayout} pending · Processed every Monday via UPI/bank transfer</p>
                                </div>
                                <button className="px-6 py-3 bg-[#FACC15] text-black font-bold rounded-lg hover:bg-yellow-300 transition-colors shrink-0">
                                    Request Payout
                                </button>
                            </div>
                        </div>
                    </section>
                )}
            </main>
            <Footer />
        </div>
    );
};

export default AffiliatePage;
