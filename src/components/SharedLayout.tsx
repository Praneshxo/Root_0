import React from 'react';
import { useNavigate } from 'react-router-dom';

export const Navbar: React.FC = () => {
    const navigate = useNavigate();
    return (
        <header className="sticky top-0 z-50 w-full flex justify-center pointer-events-none">
            <div className="absolute top-0 left-0 w-full flex justify-center -z-10">
                <div className="w-[60rem] h-[42px] md:h-[50px]">
                    <svg width="100%" height="100%" viewBox="0 0 4291 243" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-2xl">
                        <path d="M0 0H3611.72C3651.29 0 3683.37 32.0778 3683.37 71.6478V171.352C3683.37 210.922 3651.29 243 3611.72 243H662.989C633.399 243 606.854 224.811 596.172 197.217L554.881 90.5466C544.199 62.9525 517.653 44.7632 488.064 44.7632H74.4407C55.4385 44.7632 37.2146 37.2146 23.778 23.778L0 0Z" fill="#1a1a1e" />
                        <path d="M4290.87 0H679.15C639.58 0 607.502 32.0778 607.502 71.6478V171.352C607.502 210.922 639.58 243 679.15 243H3627.88C3657.47 243 3684.02 224.811 3694.7 197.217L3735.99 90.5466C3746.67 62.9525 3773.22 44.7632 3802.81 44.7632H4216.43C4235.43 44.7632 4253.66 37.2146 4267.09 23.778L4290.87 0Z" fill="#1a1a1e" />
                    </svg>
                </div>
            </div>
            <div className="flex items-center justify-between w-full max-w-[44rem] px-12 h-[42px] md:h-[50px] pointer-events-auto">
                <div className="flex items-center gap-2 text-white cursor-pointer" onClick={() => navigate('/')}>
                    <div className="w-4 h-4 rounded-full flex items-center justify-center bg-white/10">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                            <path d="M12 2L2 7L12 12L22 7L12 2Z" /><path d="M2 17L12 22L22 17" /><path d="M2 12L12 17L22 12" />
                        </svg>
                    </div>
                    <span className="text-[10px] font-bold tracking-[0.2em] text-white">MASTER.AI</span>
                </div>
                <nav className="hidden md:flex items-center gap-10">
                    <a onClick={() => navigate('/about')} className="text-gray-400 hover:text-white transition-all text-[14px] font-medium tracking-wide cursor-pointer">About</a>
                    <a
                        onClick={() => {
                            if (window.location.pathname === '/') {
                                document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
                            } else {
                                navigate('/#pricing');
                            }
                        }}
                        className="text-gray-400 hover:text-white transition-all text-[14px] font-medium tracking-wide cursor-pointer"
                    >
                        Pricing
                    </a>
                    <a onClick={() => navigate('/login')} className="text-gray-400 hover:text-white transition-all text-[14px] font-medium tracking-wide cursor-pointer">Login</a>
                </nav>
                <button onClick={() => navigate('/signup')} className="flex items-center justify-center rounded-full h-8 px-4 bg-[#7c3aed] hover:bg-[#6d28d9] transition-all text-white text-[14px] font-bold">
                    Get started
                </button>
            </div>
        </header>
    );
};

export const Footer: React.FC = () => {
    const navigate = useNavigate();
    return (
        <footer className="bg-[#0b0b0c] border-t border-[#1A1A1A] py-16 px-6 md:px-10">
            <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 text-sm text-gray-400">
                <div className="space-y-4 md:col-span-1">
                    <div className="flex items-center gap-3 text-white cursor-pointer" onClick={() => navigate('/')}>
                        <div className="size-6 bg-[#7c3aed] text-white flex items-center justify-center rounded">
                            <span className="font-bold text-[10px] tracking-wide">M</span>
                        </div>
                        <span className="font-semibold tracking-wider text-sm">Monolith AI</span>
                    </div>
                    <p className="text-gray-500 font-light pr-4 leading-relaxed">Don't just prepare. Evolve. Beat the automation curve.</p>
                </div>
                <div>
                    <h5 className="text-white font-medium mb-4">Resources</h5>
                    <ul className="space-y-3 text-gray-500 font-light">
                        <li><a onClick={() => navigate('/resources/algorithm-lab')} className="hover:text-[#7c3aed] transition-colors cursor-pointer">Algorithm Lab</a></li>
                        <li><a onClick={() => navigate('/resources/sql-sandbox')} className="hover:text-[#7c3aed] transition-colors cursor-pointer">SQL Sandbox</a></li>
                        <li><a onClick={() => navigate('/resources/system-design')} className="hover:text-[#7c3aed] transition-colors cursor-pointer">System Design Canvas</a></li>
                    </ul>
                </div>
                <div>
                    <h5 className="text-white font-medium mb-4">Company</h5>
                    <ul className="space-y-3 text-gray-500 font-light">
                        <li><a onClick={() => navigate('/about')} className="hover:text-[#7c3aed] transition-colors cursor-pointer">About Us</a></li>
                        <li><a onClick={() => navigate('/careers')} className="hover:text-[#7c3aed] transition-colors cursor-pointer">Careers</a></li>
                        <li><a onClick={() => navigate('/contact')} className="hover:text-[#7c3aed] transition-colors cursor-pointer">Contact</a></li>
                        <li><a onClick={() => navigate('/affiliate')} className="hover:text-[#7c3aed] transition-colors cursor-pointer">Affiliate</a></li>
                    </ul>
                </div>
                <div>
                    <h5 className="text-white font-medium mb-4">Stay updated</h5>
                    <div className="flex relative">
                        <input type="email" placeholder="Enter your email" className="w-full bg-[#161617] border border-[#27272A] text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#7c3aed] transition-all text-sm" />
                        <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-[#7c3aed]/10 hover:bg-[#7c3aed] text-[#7c3aed] hover:text-white rounded-md transition-colors">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                        </button>
                    </div>
                </div>
            </div>
            <div className="max-w-[1400px] mx-auto mt-16 pt-8 border-t border-[#1A1A1A] flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-light text-gray-500 tracking-wide">
                <div>© 2026 Monolith AI Inc. All rights reserved.</div>
                <div className="flex items-center gap-3">
                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-[#161617] border border-[#27272A] flex items-center justify-center text-gray-500 hover:text-white hover:border-gray-500 transition-all">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" /><circle cx="4" cy="4" r="2" /></svg>
                    </a>
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-[#161617] border border-[#27272A] flex items-center justify-center text-gray-500 hover:text-white hover:border-gray-500 transition-all">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" /></svg>
                    </a>
                    <a href="mailto:hello@monolith.ai" className="w-9 h-9 rounded-full bg-[#161617] border border-[#27272A] flex items-center justify-center text-gray-500 hover:text-white hover:border-gray-500 transition-all">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M2 7l10 7 10-7" /></svg>
                    </a>
                </div>
            </div>
        </footer>
    );
};
