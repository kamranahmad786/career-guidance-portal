import React from 'react';

const HowItWorks = () => {
    return (
        <section className="min-h-screen py-16 md:py-24 bg-slate-50 w-full mx-auto flex flex-col justify-center relative overflow-hidden" id="how-it-works">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full -z-10"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/5 blur-[120px] rounded-full -z-10"></div>
            
            <div className="w-full mx-auto px-4 md:px-12 lg:px-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20 items-center">
                    {/* Left: Showcase Image with Floating Metrics */}
                    <div className="relative order-2 lg:order-1 px-4 md:px-0 max-w-lg mx-auto lg:max-w-none">
                        <div className="relative rounded-2xl md:rounded-[2.5rem] overflow-hidden shadow-xl border-4 md:border-6 border-white p-1 bg-white">
                            <img 
                                alt="Student collaborating" 
                                className="w-full aspect-[4/5] object-cover rounded-xl md:rounded-[2rem]" 
                                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80" 
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 via-transparent to-transparent"></div>
                        </div>
                        
                        {/* Floating Metric 1 */}
                        <div className="absolute -right-2 md:-right-6 top-6 md:top-10 bg-white/95 backdrop-blur-xl p-3 md:p-4 rounded-xl md:rounded-2xl shadow-xl border border-white flex items-center gap-2 md:gap-3 scale-90 md:scale-100 origin-right">
                            <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-secondary flex items-center justify-center text-white">
                                <span className="material-symbols-outlined text-sm md:text-xl">trending_up</span>
                            </div>
                            <div>
                                <p className="text-lg md:text-xl font-bold text-on-surface">120K+</p>
                                <p className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest leading-none">Active Seekers</p>
                            </div>
                        </div>

                        {/* Floating Metric 2 */}
                        <div className="absolute -left-2 md:-left-6 bottom-6 md:bottom-10 bg-white/95 backdrop-blur-xl p-3 md:p-4 rounded-xl md:rounded-2xl shadow-xl border border-white flex items-center gap-2 md:gap-3 scale-90 md:scale-100 origin-left">
                            <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-primary flex items-center justify-center text-white">
                                <span className="material-symbols-outlined text-sm md:text-xl">star_rate</span>
                            </div>
                            <div>
                                <p className="text-lg md:text-xl font-bold text-on-surface">4.9/5</p>
                                <p className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest leading-none">Trust Rating</p>
                            </div>
                        </div>
                    </div>

                    {/* Right: Step-by-Step Evolution */}
                    <div className="space-y-10 md:space-y-12 order-1 lg:order-2 text-center md:text-left">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary font-bold text-[10px] md:text-xs mb-4 md:mb-6 uppercase tracking-widest">
                                <span className="material-symbols-outlined text-sm">timeline</span>
                                The Evolution
                            </div>
                            <h2 className="text-3xl md:text-5xl font-extrabold font-headline mb-4 md:mb-6 text-on-surface leading-tight">
                                From curiosity to a <span className="text-primary font-bold italic">confirmed roadmap</span>
                            </h2>
                            <p className="text-base md:text-lg text-on-surface-variant leading-relaxed max-w-lg mx-auto md:mx-0 font-['Inter']">
                                Our seamless 3-step evolutionary journey is designed to bring total clarity to your career aspirations.
                            </p>
                        </div>

                        <div className="space-y-5 md:space-y-6 relative">
                            {/* Connector Line */}
                            <div className="absolute left-6 top-8 bottom-8 w-px bg-slate-200 -z-10 hidden md:block text-left"></div>
                            
                            {[
                                { step: '01', title: 'Deep Discovery', desc: 'Take our cognitive mapping assessment to reveal your latent aptitude.', icon: 'psychology_alt', color: 'bg-primary' },
                                { step: '02', title: 'AI Synthesis', desc: 'Neural networks harmonize your results with global trends.', icon: 'memory', color: 'bg-secondary' },
                                { step: '03', title: 'Roadmap Unleashed', desc: 'Receive a personalized, K-12 trajectory and target skills.', icon: 'mountain_flag', color: 'bg-tertiary' }
                            ].map((item, idx) => (
                                <div key={idx} className="group flex flex-col md:flex-row gap-4 md:gap-6 items-center md:items-start text-center md:text-left">
                                    <div className={`w-9 h-9 md:w-11 md:h-11 rounded-full ${item.color} text-white flex items-center justify-center font-bold text-xs shrink-0 z-10 shadow-md group-hover:scale-110 transition-transform duration-300`}>
                                        {item.step}
                                    </div>
                                    <div className="p-5 md:p-6 bg-white rounded-xl md:rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-100 flex-1 hover:border-primary/20 transition-all duration-300 w-full text-left">
                                        <div className="flex flex-col md:flex-row items-center md:items-center gap-2 md:gap-3 mb-2 md:mb-3">
                                            <span className={`material-symbols-outlined text-xl md:text-2xl font-light text-primary`}>{item.icon}</span>
                                            <h3 className="text-lg md:text-xl font-bold font-headline text-on-surface">{item.title}</h3>
                                        </div>
                                        <p className="text-[13px] md:text-sm text-on-surface-variant leading-relaxed font-['Inter']">
                                            {item.desc}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
