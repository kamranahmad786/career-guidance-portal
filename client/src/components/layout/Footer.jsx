import React from 'react';
import BrandLogo from '../common/BrandLogo';

const Footer = () => {
    return (
        <footer className="w-full bg-[#0F172A] text-white pt-24 pb-12 relative overflow-hidden">
            <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
            
            <div className="w-full mx-auto px-6 md:px-12 lg:px-24 relative">
                {/* Final CTA Banner */}
                <div className="relative mb-16">
                    <div className="bg-gradient-to-r from-primary to-blue-600 rounded-2xl md:rounded-[2rem] p-6 md:p-12 text-center shadow-2xl shadow-primary/20 overflow-hidden relative group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[80px] rounded-full -z-10 group-hover:scale-150 transition-transform duration-700"></div>
                        
                        <h2 className="text-2xl md:text-4xl font-extrabold font-headline mb-4 md:mb-6 leading-tight italic">
                            Ready to build your <br md:hidden /><span className="text-white/80">extraordinary future?</span>
                        </h2>
                        <p className="text-white/70 max-w-lg mx-auto text-sm md:text-base mb-8 md:mb-10 font-['Inter'] font-medium">
                            Join 10,000+ students who have already discovered their perfect career path with EduDisha.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
                            <button className="px-6 md:px-8 py-3 md:py-3.5 bg-white text-primary rounded-full font-black text-xs md:text-sm hover:scale-105 transition-transform shadow-xl uppercase tracking-widest">
                                Get Started Free
                            </button>
                            <button className="px-6 md:px-8 py-3 md:py-3.5 bg-transparent border border-white/30 text-white rounded-full font-black text-xs md:text-sm hover:bg-white/10 transition-colors uppercase tracking-widest">
                                Contact Advisor
                            </button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 md:gap-16 mb-24">
                    {/* Brand Column */}
                    <div className="space-y-6 md:space-y-8 text-left">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 md:w-11 md:h-11 rounded-xl bg-slate-800 flex items-center justify-center shadow-lg">
                                <BrandLogo className="w-7 h-7 md:w-8 md:h-8" />
                            </div>
                            <span className="text-2xl font-black font-headline tracking-tighter">EduDisha</span>
                        </div>
                        <p className="text-blue-100/60 leading-relaxed font-['Inter'] text-sm md:text-base">
                            The ultimate AI-powered sanctuary for career guidance, aligning student passions with global industry data and NEP guidelines.
                        </p>
                        <div className="flex gap-3">
                            {['facebook', 'X', 'instagram', 'linkedin'].map((social) => (
                                <div key={social} className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary hover:border-primary transition-all cursor-pointer">
                                    <span className="material-symbols-outlined text-xs">link</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Link Columns */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:col-span-3 gap-10 md:gap-12 text-left">
                        <div className="space-y-5">
                            <h5 className="font-bold text-white uppercase tracking-widest text-xs md:text-sm">Solutions</h5>
                            <ul className="space-y-3 font-bold">
                                <li><a href="#" className="text-blue-200/50 hover:text-white transition-colors text-sm md:text-base">AI Skill Assessment</a></li>
                                <li><a href="#" className="text-blue-200/50 hover:text-white transition-colors text-sm md:text-base">Learning Paths</a></li>
                                <li><a href="#" className="text-blue-200/50 hover:text-white transition-colors text-sm md:text-base">Simulations</a></li>
                                <li><a href="#" className="text-blue-200/50 hover:text-white transition-colors text-sm md:text-base">Roadmaps</a></li>
                            </ul>
                        </div>
                        <div className="space-y-5">
                            <h5 className="font-bold text-white uppercase tracking-widest text-xs md:text-sm">Company</h5>
                            <ul className="space-y-3 font-bold">
                                <li><a href="#" className="text-blue-200/50 hover:text-white transition-colors text-sm md:text-base">Our Vision</a></li>
                                <li><a href="#" className="text-blue-200/50 hover:text-white transition-colors text-sm md:text-base">NEP Compliance</a></li>
                                <li><a href="#" className="text-blue-200/50 hover:text-white transition-colors text-sm md:text-base">Partner Schools</a></li>
                                <li><a href="#" className="text-blue-200/50 hover:text-white transition-colors text-sm md:text-base">Success Stories</a></li>
                            </ul>
                        </div>
                        <div className="space-y-5">
                            <h5 className="font-bold text-white uppercase tracking-widest text-xs md:text-sm">Resources</h5>
                            <ul className="space-y-3 font-bold">
                                <li><a href="#" className="text-blue-200/50 hover:text-white transition-colors text-sm md:text-base">Career Blog</a></li>
                                <li><a href="#" className="text-blue-200/50 hover:text-white transition-colors text-sm md:text-base">Help Center</a></li>
                                <li><a href="#" className="text-blue-200/50 hover:text-white transition-colors text-sm md:text-base">Privacy Policy</a></li>
                                <li><a href="#" className="text-blue-200/50 hover:text-white transition-colors text-sm md:text-base">Terms</a></li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Bottom Ribbon */}
                <div className="pt-8 md:pt-12 border-t border-white/10 flex flex-col md:row justify-between items-center text-center md:text-left gap-6 md:gap-0">
                    <div className="text-blue-200/40 text-[10px] md:text-xs font-['Inter'] font-bold">
                        © 2024 EduDisha. Developed with high-precision AI for the future leaders of India.
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
