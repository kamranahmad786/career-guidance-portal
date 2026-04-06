import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const QuizHighlight = () => {
    const navigate = useNavigate();
    const [showSample, setShowSample] = useState(false);

    return (
        <section className="min-h-screen py-16 md:py-24 bg-white w-full mx-auto flex flex-col justify-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#1e293b 1.5px, transparent 1.5px)', backgroundSize: '60px 60px' }}></div>
            <div className="absolute top-1/2 left-0 w-80 h-80 bg-primary/10 blur-[100px] rounded-full -z-10"></div>
            <div className="absolute bottom-0 right-0 w-80 h-80 bg-secondary/10 blur-[120px] rounded-full -z-10"></div>
            
            <div className="w-full mx-auto px-4 md:px-12 lg:px-24">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20 items-center">
                    <div className="text-center lg:text-left">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary font-bold text-[10px] md:text-xs mb-6 md:mb-8 uppercase tracking-widest leading-none">
                            <span className="material-symbols-outlined text-sm">psychology</span>
                            Cognitive Mapping Engine
                        </div>
                        <h2 className="text-3xl md:text-5xl font-extrabold font-headline mb-4 md:mb-6 text-on-surface leading-tight px-2 md:px-0 tracking-tight">
                            Uncover Your <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Hidden Genius</span>
                        </h2>
                        <p className="text-base md:text-lg text-on-surface-variant leading-relaxed mb-8 md:mb-10 font-['Inter'] max-w-lg mx-auto lg:mx-0">
                            Beyond simple skills, we decode your cognitive architecture, emotional intelligence, and natural aptitudes using 72 scientifically curated data points.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 md:gap-5 mb-10 md:mb-12 justify-center lg:justify-start">
                            <button 
                                onClick={() => navigate('/register')}
                                className="group px-8 md:px-9 py-3.5 md:py-4 bg-on-surface text-white rounded-full font-bold text-base hover:bg-primary transition-all shadow-xl hover:-translate-y-1 flex items-center justify-center gap-3"
                            >
                                Start Mapping Now 
                                <span className="material-symbols-outlined text-xl group-hover:translate-x-1.5 transition-transform">rocket_launch</span>
                            </button>
                            <button 
                                onClick={() => setShowSample(true)}
                                className="px-8 md:px-9 py-3.5 md:py-4 bg-white border-2 border-slate-200 text-on-surface rounded-full font-bold text-base hover:border-primary transition-all flex items-center justify-center gap-2"
                            >
                                Sample Report
                                <span className="material-symbols-outlined text-lg">visibility</span>
                            </button>
                        </div>

                        <div className="grid grid-cols-3 gap-6 md:gap-8 max-w-sm md:max-w-none mx-auto lg:mx-0 pr-4">
                            {[
                                { label: 'Time', value: '15-20m', icon: 'timer' },
                                { label: 'Points', value: '72+', icon: 'database' },
                                { label: 'Accuracy', value: '98%', icon: 'verified' }
                            ].map((item, idx) => (
                                <div key={idx} className="flex flex-col items-center lg:items-start gap-1">
                                    <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-primary border border-slate-100 mb-1">
                                        <span className="material-symbols-outlined text-xs">{item.icon}</span>
                                    </div>
                                    <p className="text-xl md:text-2xl font-bold text-on-surface tracking-tighter">{item.value}</p>
                                    <p className="text-[7px] md:text-[9px] uppercase font-bold text-slate-400 tracking-widest">{item.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Animated Neural Skill Grid */}
                    <div className="relative px-4 md:px-0">
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 md:gap-5 relative z-10 p-2 text-left">
                            {[
                                { name: 'Analytics', icon: 'monitoring', color: 'bg-blue-500', pos: 'translate-y-0' },
                                { name: 'Creativity', icon: 'palette', color: 'bg-rose-500', pos: 'md:translate-y-8' },
                                { name: 'Coding', icon: 'terminal', color: 'bg-purple-500', pos: 'md:translate-y-4' },
                                { name: 'Logic', icon: 'rebase_edit', color: 'bg-emerald-500', pos: 'translate-y-0' },
                                { name: 'Arts', icon: 'mic', color: 'bg-amber-500', pos: 'md:translate-y-8' },
                                { name: 'Social', icon: 'groups', color: 'bg-indigo-500', pos: 'md:translate-y-4' }
                            ].map((skill, index) => (
                                <div key={index} className={`group relative p-5 md:p-6 rounded-xl md:rounded-2xl bg-white border border-slate-100 shadow-xl hover:border-primary/30 transition-all duration-500 hover:-translate-y-1.5 ${skill.pos}`}>
                                    <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl ${skill.color} text-white flex items-center justify-center shadow-lg mb-4 group-hover:scale-105 transition-transform`}>
                                        <span className="material-symbols-outlined text-lg md:text-xl font-light">{skill.icon}</span>
                                    </div>
                                    <h4 className="font-bold text-base md:text-lg text-on-surface font-headline">{skill.name}</h4>
                                </div>
                            ))}
                        </div>
                        
                        {/* Decorative background glow */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-secondary/5 blur-3xl -z-10 rounded-full scale-110"></div>
                    </div>
                </div>
            </div>

            {/* Sample Report Modal */}
            {showSample && (
                <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowSample(false)}></div>
                    <div className="relative bg-white dark:bg-slate-900 w-full max-w-4xl max-h-[90vh] rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300 flex flex-col">
                        
                        {/* Modal Header */}
                        <div className="p-6 md:p-8 bg-slate-50 dark:bg-slate-800/50 flex justify-between items-center border-b border-slate-100 dark:border-slate-800">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center font-black shadow-lg">AI</div>
                                <div>
                                    <h3 className="text-xl md:text-2xl font-black text-on-surface">Sample Career Analysis</h3>
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">ID: ED-2026-MOCK-01</p>
                                </div>
                            </div>
                            <button onClick={() => setShowSample(false)} className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-700 transition-all font-bold">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-10 scrollbar-hide text-left">
                            {/* Analytics Summary */}
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <h4 className="text-lg font-black text-primary flex items-center gap-2">
                                        <span className="material-symbols-outlined text-xl">insights</span>
                                        Cognitive Strengths
                                    </h4>
                                    <div className="space-y-4">
                                        {[
                                            { label: 'Logical Reasoning', val: 94, color: 'bg-blue-500' },
                                            { label: 'Spatial Visualization', val: 82, color: 'bg-purple-500' },
                                            { label: 'Pattern Recognition', val: 91, color: 'bg-emerald-500' },
                                            { label: 'Verbal Aptitude', val: 76, color: 'bg-amber-500' }
                                        ].map((stat, i) => (
                                            <div key={i} className="space-y-2">
                                                <div className="flex justify-between text-xs font-bold text-slate-600 dark:text-slate-400">
                                                    <span>{stat.label}</span>
                                                    <span>{stat.val}%</span>
                                                </div>
                                                <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                    <div className={`h-full ${stat.color} rounded-full`} style={{ width: `${stat.val}%` }}></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-slate-50 dark:bg-slate-800/30 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 space-y-4">
                                    <h4 className="text-lg font-black text-secondary flex items-center gap-2">
                                        <span className="material-symbols-outlined text-xl">star</span>
                                        AI Recommendation
                                    </h4>
                                    <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-primary/10">
                                        <p className="text-sm font-bold text-primary mb-1">Primary Match</p>
                                        <p className="text-xl font-black text-on-surface font-headline">Robotics Engineering</p>
                                        <p className="mt-2 text-xs text-on-surface-variant leading-relaxed">
                                            Based on your high logical reasoning and pattern recognition scores, you have a natural aptitude for designing complex automated systems.
                                        </p>
                                    </div>
                                    <div className="flex gap-2 pt-2">
                                        <span className="px-3 py-1 rounded-full bg-slate-200 dark:bg-slate-700 text-[10px] font-bold text-slate-700 dark:text-slate-300 uppercase">AI ML</span>
                                        <span className="px-3 py-1 rounded-full bg-slate-200 dark:bg-slate-700 text-[10px] font-bold text-slate-700 dark:text-slate-300 uppercase">IoT</span>
                                        <span className="px-3 py-1 rounded-full bg-slate-200 dark:bg-slate-700 text-[10px] font-bold text-slate-700 dark:text-slate-300 uppercase">Automation</span>
                                    </div>
                                </div>
                            </div>

                            {/* NEP 2020 Roadmaps */}
                            <div className="space-y-6">
                                <h4 className="text-lg font-black text-on-surface flex items-center gap-2">
                                    <span className="material-symbols-outlined text-xl">map</span>
                                    Personalized Learning Path
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    {[
                                        { step: '01', title: 'Foundational', desc: 'Advanced Discrete Mathematics & Physics' },
                                        { step: '02', title: 'Exploration', desc: 'Embedded Systems & Python Development' },
                                        { step: '03', title: 'Mastery', desc: 'Specialized Robotics & Mechatronics' }
                                    ].map((step, i) => (
                                        <div key={i} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 relative group hover:border-primary transition-all">
                                            <span className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center text-[10px] font-black text-slate-400 group-hover:text-primary transition-colors">{step.step}</span>
                                            <p className="text-xs font-black text-primary uppercase mb-1 tracking-widest">{step.title}</p>
                                            <p className="text-xs font-bold text-on-surface leading-snug">{step.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-6 md:p-8 bg-slate-50 dark:bg-slate-800/50 mt-auto border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <p className="text-sm font-bold text-on-surface-variant text-center sm:text-left">Get your own personalized genius report in 15 minutes.</p>
                            <button 
                                onClick={() => {
                                    setShowSample(false);
                                    navigate('/register');
                                }}
                                className="w-full sm:w-auto px-8 py-3.5 bg-primary text-white rounded-full font-black text-base shadow-xl shadow-primary/20 hover:-translate-y-1 active:translate-y-0 transition-all flex items-center justify-center gap-2"
                            >
                                Get My Free Report
                                <span className="material-symbols-outlined">chevron_right</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default QuizHighlight;
