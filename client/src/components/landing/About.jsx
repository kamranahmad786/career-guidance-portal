import React from 'react';

const About = () => {
    return (
        <section className="min-h-screen py-16 md:py-24 px-4 md:px-6 w-full mx-auto flex flex-col justify-center bg-slate-50 relative overflow-hidden" id="about">
            <div className="absolute top-0 left-0 w-full h-full opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#1e293b 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
            
            <div className="w-full mx-auto px-2 md:px-12 lg:px-24 relative">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20 items-center">
                    <div className="space-y-8 md:space-y-10 text-center lg:text-left">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary font-bold text-[10px] md:text-xs mb-4 md:mb-6 uppercase tracking-widest leading-none">
                                <span className="material-symbols-outlined text-sm">info</span>
                                The EduDisha Vision
                            </div>
                            <h2 className="text-3xl md:text-5xl font-extrabold font-headline mb-4 md:mb-6 text-on-surface leading-tight">
                                Empowering the next generation with <span className="text-primary italic">AI Precision</span>
                            </h2>
                            <p className="text-base md:text-lg text-on-surface-variant leading-relaxed font-['Inter'] max-w-lg mx-auto lg:mx-0">
                                At EduDisha, we believe every student possesses a "Hidden Genius." Our mission is to illuminate that potential by harmonizing advanced psychometric AI with real-world industry data.
                            </p>
                        </div>
                        
                        <div className="flex flex-wrap justify-center lg:justify-start gap-6 md:gap-10 items-center border-t border-slate-200 pt-8 md:pt-10">
                            <div>
                                <h4 className="text-xl md:text-2xl font-black text-on-surface mb-1 tracking-tighter">98.4%</h4>
                                <p className="text-[9px] md:text-[11px] font-bold text-on-surface-variant uppercase tracking-widest leading-none">Accuracy Rate</p>
                            </div>
                            <div className="hidden sm:block w-px h-10 bg-slate-200"></div>
                            <div>
                                <h4 className="text-xl md:text-2xl font-black text-on-surface mb-1 tracking-tighter">10k+</h4>
                                <p className="text-[9px] md:text-[11px] font-bold text-on-surface-variant uppercase tracking-widest leading-none">Success Stories</p>
                            </div>
                            <div className="hidden sm:block w-px h-10 bg-slate-200"></div>
                            <div>
                                <h4 className="text-xl md:text-2xl font-black text-on-surface mb-1 tracking-tighter">NEP</h4>
                                <p className="text-[9px] md:text-[11px] font-bold text-on-surface-variant uppercase tracking-widest leading-none">Compliant</p>
                            </div>
                        </div>
                    </div>

                    {/* Core Values Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative">
                        {[
                            { title: 'Human-Centric AI', desc: 'Built by educators for students—AI that understands potential, not just data points.', icon: 'heart_plus', color: 'bg-rose-100 text-rose-600' },
                            { title: 'Future Alignment', desc: 'Constantly updated with global industry shifts to ensure your path remains relevant.', icon: 'upcoming', color: 'bg-emerald-100 text-emerald-600' },
                            { title: 'Inclusivity First', desc: 'Designed for accessibility across diverse learning backgrounds and socio-economic levels.', icon: 'diversity_1', color: 'bg-blue-100 text-blue-600' },
                            { title: 'Global Standards', desc: 'Utilizing international psychometric frameworks for world-class guidance quality.', icon: 'language', color: 'bg-amber-100 text-amber-600' }
                        ].map((value, i) => (
                            <div key={i} className="group bg-white p-6 rounded-2xl shadow-lg shadow-slate-200/40 border border-slate-100 hover:border-primary/20 transition-all duration-300 hover:scale-105 text-left">
                                <div className={`w-11 h-11 md:w-12 md:h-12 rounded-xl ${value.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-md`}>
                                    <span className="material-symbols-outlined text-lg md:text-xl">{value.icon}</span>
                                </div>
                                <h3 className="text-base md:text-lg font-bold font-headline text-on-surface mb-2">{value.title}</h3>
                                <p className="text-[12px] md:text-sm text-on-surface-variant leading-relaxed font-['Inter']">{value.desc}</p>
                            </div>
                        ))}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-primary/10 blur-[100px] rounded-full -z-10"></div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;
