import React from 'react';

const Features = () => {
    return (
        <section className="min-h-screen py-16 md:py-24 px-4 md:px-6 w-full mx-auto flex flex-col justify-center bg-white" id="features">
            <div className="w-full mx-auto px-2 md:px-12 lg:px-20">
                <div className="text-center mb-12 md:mb-16 space-y-3">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary font-bold text-[10px] md:text-xs uppercase tracking-widest mb-2">
                        <span className="material-symbols-outlined text-sm">grid_view</span>
                        Core Ecosystem
                    </div>
                    <h2 className="text-3xl md:text-5xl font-extrabold font-headline text-on-surface leading-tight">Precision Features for <span className="text-primary italic">Growth</span></h2>
                    <p className="text-on-surface-variant max-w-xl mx-auto text-sm md:text-lg font-['Inter']">Our AI sanctuary offers high-precision tools designed to eliminate decision fatigue and illuminate career possibilities.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-auto md:auto-rows-[240px]">
                    {/* AI Recommendations - Large Feature */}
                    <div className="md:col-span-8 md:row-span-2 group relative bg-surface-container-low p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] overflow-hidden ambient-shadow border border-outline-variant hover:border-primary/40 transition-all duration-500">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[80px] rounded-full -z-10 group-hover:scale-125 transition-transform duration-700"></div>
                        <div className="flex flex-col h-full justify-between relative z-10">
                            <div>
                                <div className="w-14 h-14 md:w-16 md:h-16 bg-primary rounded-xl md:rounded-2xl flex items-center justify-center text-white mb-6 md:mb-8 shadow-xl shadow-primary/20 group-hover:scale-110 transition-transform duration-500">
                                    <span className="material-symbols-outlined text-2xl md:text-3xl">psychology</span>
                                </div>
                                <h3 className="text-2xl md:text-3xl font-extrabold mb-3 md:mb-4 font-headline text-on-surface text-left">Cognitive <br className="hidden md:block" />AI Recommendations</h3>
                                <p className="text-on-surface-variant text-sm md:text-lg leading-relaxed max-w-md font-['Inter'] text-left">
                                    Neural networks analyze 500+ data points including behavioral traits, academic history, and latent interests to map your optimal career trajectory.
                                </p>
                            </div>
                            <div className="flex gap-3 items-center mt-6 md:mt-0">
                                <div className="flex -space-x-3">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="w-7 h-7 md:w-9 md:h-9 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                                            <img src={`https://i.pravatar.cc/100?img=${i+20}`} alt="User" />
                                        </div>
                                    ))}
                                </div>
                                <span className="text-[10px] md:text-xs font-bold text-on-surface-variant">Trusted by 10k+ Students</span>
                            </div>
                        </div>
                    </div>

                    {/* Smart Quiz - Tall Feature */}
                    <div className="md:col-span-4 md:row-span-2 group bg-slate-900 p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] overflow-hidden shadow-xl relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent"></div>
                        <div className="flex flex-col h-full justify-between relative z-10 text-white text-left">
                            <div>
                                <div className="w-12 h-12 bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center rounded-xl mb-6 md:mb-8 group-hover:rotate-12 transition-transform duration-500">
                                    <span className="material-symbols-outlined text-xl md:text-2xl">quiz</span>
                                </div>
                                <h3 className="text-2xl md:text-2xl font-extrabold mb-3 md:mb-4 font-headline">Precision Assessment</h3>
                                <p className="text-white/60 text-sm md:text-base leading-relaxed font-['Inter']">
                                    Our signature 72-point mapping system eliminates ambiguity across 12 psychological and professional dimensions.
                                </p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-xl md:rounded-2xl p-4 md:p-6 text-center mt-6 md:mt-0">
                                <span className="text-3xl md:text-4xl font-black text-white mb-1 block tracking-tighter">98.4%</span>
                                <p className="text-white/40 font-bold text-[8px] md:text-[10px] uppercase tracking-widest">Satisfaction Rate</p>
                            </div>
                        </div>
                    </div>

                    {/* Small Features Grid */}
                    <div className="md:col-span-4 group bg-surface-container-lowest p-5 md:p-6 rounded-xl md:rounded-2xl border border-outline-variant hover:border-secondary/40 transition-all duration-300 flex flex-col justify-between text-left">
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-secondary-container/50 rounded-lg md:rounded-xl flex items-center justify-center text-secondary group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined text-lg md:text-xl">route</span>
                        </div>
                        <div className="mt-3 md:mt-0">
                            <h3 className="text-base md:text-lg font-bold font-headline text-on-surface mb-1">Step-by-Step Roadmaps</h3>
                            <p className="text-[11px] md:text-xs text-on-surface-variant font-['Inter'] leading-relaxed">Integrated K-12 to professional paths mapped in real-time.</p>
                        </div>
                    </div>

                    <div className="md:col-span-4 group bg-surface-container-lowest p-5 md:p-6 rounded-xl md:rounded-2xl border border-outline-variant hover:border-tertiary/40 transition-all duration-300 flex flex-col justify-between text-left">
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-tertiary-container/50 rounded-lg md:rounded-xl flex items-center justify-center text-tertiary group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined text-lg md:text-xl">family_restroom</span>
                        </div>
                        <div className="mt-3 md:mt-0">
                            <h3 className="text-base md:text-lg font-bold font-headline text-on-surface mb-1">Stakeholder Insights</h3>
                            <p className="text-[11px] md:text-xs text-on-surface-variant font-['Inter'] leading-relaxed">Unified dashboards for parents and teachers to monitor developmental milestones.</p>
                        </div>
                    </div>

                    <div className="md:col-span-4 group bg-surface-container-lowest p-5 md:p-6 rounded-xl md:rounded-2xl border border-outline-variant hover:border-primary/40 transition-all duration-300 flex flex-col justify-between text-left">
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-primary-container/50 rounded-lg md:rounded-xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined text-lg md:text-xl">monitoring</span>
                        </div>
                        <div className="mt-3 md:mt-0">
                            <h3 className="text-base md:text-lg font-bold font-headline text-on-surface mb-1">Behavioral Analytics</h3>
                            <p className="text-[11px] md:text-xs text-on-surface-variant font-['Inter'] leading-relaxed">Advanced data visualization of aptitude and behavioral tendencies.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Features;
