import React from 'react';

const Testimonials = () => {
    return (
        <section className="min-h-screen py-24 px-6 w-full mx-auto flex flex-col justify-center bg-white relative">
            <div className="absolute top-1/2 left-0 w-64 h-64 bg-primary/5 blur-[100px] rounded-full -z-10"></div>
            <div className="absolute bottom-1/2 right-0 w-64 h-64 bg-secondary/5 blur-[100px] rounded-full -z-10"></div>
            
            <div className="max-w-7xl mx-auto w-full">
                <div className="text-center mb-20">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 text-secondary font-bold text-xs uppercase tracking-widest mb-6">
                        <span className="material-symbols-outlined text-sm">stars</span>
                        Wall of Excellence
                    </div>
                    <h2 className="text-3xl md:text-5xl font-extrabold font-headline mb-4 md:mb-6 text-on-surface">Trusted by <span className="text-primary">Future Leaders</span></h2>
                    <p className="text-on-surface-variant max-w-xl mx-auto text-base md:text-lg font-['Inter']">Discover how EduDisha is shaping the career paths of thousands of ambitious students and professionals.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 text-left">
                    {[
                        { 
                            name: 'Aditya Verma', 
                            role: 'Grade 11 Student', 
                            quote: 'EduDisha transformed how I view my subjects. I never knew my hobby in gaming could lead to a career in Cyber Security.', 
                            img: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80'
                        },
                        { 
                            name: 'Sara Khan', 
                            role: 'College Sophomore', 
                            quote: 'The AI recommendations were uncannily accurate. It suggested paths I had never considered but that fit my personality perfectly.', 
                            img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80'
                        },
                        { 
                            name: 'Rohan Sharma', 
                            role: 'Aspiring Engineer', 
                            quote: 'The roadmap helped me organize my study schedule and focus on the skills that actually matter in the industry today.', 
                            img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'
                        }
                    ].map((item, idx) => (
                        <div key={idx} className="group relative bg-white p-6 md:p-8 rounded-2xl md:rounded-[2rem] ambient-shadow border border-slate-100 hover:border-primary/30 transition-all duration-500 hover:-translate-y-2 flex flex-col justify-between overflow-hidden">
                            <div className="absolute top-0 right-0 p-6 md:p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                                <span className="material-symbols-outlined text-5xl md:text-6xl">format_quote</span>
                            </div>
                            
                            <div className="relative z-10">
                                <div className="flex gap-1 text-amber-500 mb-6 md:mb-8">
                                    {[...Array(5)].map((_, i) => (
                                        <span key={i} className="material-symbols-outlined text-[10px] md:text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                    ))}
                                </div>
                                <p className="text-base md:text-lg font-bold font-headline text-on-surface leading-snug mb-8 group-hover:text-primary transition-colors duration-300 italic">
                                    "{item.quote}"
                                </p>
                            </div>

                            <div className="flex items-center gap-3 md:gap-4 mt-auto pt-6 md:pt-8 border-t border-slate-100 relative z-10">
                                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl overflow-hidden shadow-md group-hover:scale-105 transition-transform duration-500 ring-2 ring-white">
                                    <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm md:text-base text-on-surface leading-none mb-1">{item.name}</h4>
                                    <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider leading-none">{item.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-12 md:mt-16 text-center pb-6">
                    <div className="inline-flex items-center gap-4 px-6 md:px-8 py-3.5 md:py-4 rounded-full bg-slate-900 text-white shadow-xl hover:scale-105 transition-transform cursor-pointer">
                        <div className="flex -space-x-2">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="w-6 h-6 md:w-7 md:h-7 rounded-full border border-slate-900 overflow-hidden">
                                    <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="User" />
                                </div>
                            ))}
                        </div>
                        <span className="font-bold text-[11px] md:text-xs tracking-wide">Joined by 10,000+ students worldwide</span>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
