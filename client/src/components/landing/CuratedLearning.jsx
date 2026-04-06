import React from 'react';
import { useNavigate } from 'react-router-dom';

const CuratedLearning = () => {
    const navigate = useNavigate();
    return (
        <section className="min-h-screen py-16 md:py-24 w-full flex items-center justify-center relative bg-surface-container-lowest" id="courses">
            <div className="w-full px-4 md:px-12 lg:px-20">
                <div className="flex flex-col lg:flex-row justify-between items-center lg:items-end mb-12 md:mb-16 gap-6 md:gap-8 text-center lg:text-left">
                    <div className="max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 text-secondary font-bold text-[10px] md:text-xs mb-4 uppercase tracking-wider leading-none">
                            <span className="material-symbols-outlined text-sm">auto_stories</span>
                            Knowledge Hub
                        </div>
                        <h2 className="text-3xl md:text-5xl font-extrabold font-headline mb-4 md:mb-6 text-on-surface leading-tight px-2 md:px-0">
                            Curated Learning <span className="text-secondary bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">Resources</span>
                        </h2>
                        <p className="text-base md:text-lg text-on-surface-variant max-w-xl leading-relaxed mx-auto lg:mx-0 font-['Inter']">
                            Bridges the gap between your potential and your dream career with professional-grade content.
                        </p>
                    </div>
                    <button 
                        onClick={() => navigate('/library')}
                        className="group flex items-center gap-3 px-6 md:px-7 py-3 md:py-3.5 bg-on-surface text-white rounded-full font-bold text-sm md:text-base hover:bg-primary transition-all duration-300 shadow-xl"
                    >
                        Browse All Libraries <span className="material-symbols-outlined group-hover:rotate-45 transition-transform text-sm md:text-base">arrow_forward</span>
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-8 md:mb-16">
                    { [
                        { title: 'Specialized Courses', desc: 'Certification programs in Tech, Arts, and Business.', icon: 'terminal', color: 'from-blue-500 to-indigo-600', img: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1' },
                        { title: 'Live Workshops', desc: 'Hands-on interactive sessions with industry veterans.', icon: 'groups', color: 'from-emerald-500 to-teal-600', img: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b' },
                        { title: 'Expert Webinars', desc: 'Weekly insights from global career thought leaders.', icon: 'record_voice_over', color: 'from-purple-500 to-pink-600', img: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2' },
                        { title: 'Career Simulations', desc: 'Immersive virtual job experiences at top firms.', icon: 'biotech', color: 'from-amber-500 to-orange-600', img: 'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac' }
                    ].map((item, idx) => (
                        <div 
                            key={idx} 
                            onClick={() => navigate('/library')}
                            className="group relative bg-white rounded-2xl md:rounded-[2rem] p-3 md:p-3.5 ambient-shadow border border-outline-variant hover:border-primary/50 transition-all duration-500 hover:-translate-y-2 cursor-pointer overflow-hidden"
                        >
                            <div className="relative h-40 md:h-56 rounded-xl md:rounded-[1.5rem] overflow-hidden mb-6 md:mb-7">
                                <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                <div className={`absolute top-3 left-3 w-9 h-9 md:w-11 md:h-11 rounded-lg md:rounded-xl bg-gradient-to-br ${item.color} text-white flex items-center justify-center shadow-lg`}>
                                    <span className="material-symbols-outlined text-sm md:text-base">{item.icon}</span>
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-4 md:p-6 text-left">
                                    <p className="text-white text-[10px] md:text-sm font-bold leading-relaxed">
                                        {item.desc}
                                    </p>
                                </div>
                            </div>
                            <div className="px-2 md:px-3 pb-2 md:pb-3 flex justify-between items-center text-left">
                                <div className="min-h-[50px] md:min-h-[60px] flex flex-col justify-center">
                                    <h4 className="text-base md:text-xl font-bold font-headline text-on-surface mb-0.5">{item.title}</h4>
                                    <div className="flex items-center gap-1.5 md:gap-2 text-on-surface-variant text-[9px] md:text-xs font-bold">
                                        <span>Explore Library</span>
                                        <span className="w-1 h-1 rounded-full bg-outline-variant"></span>
                                        <span>24+ Modules</span>
                                    </div>
                                </div>
                                <div className="w-8 h-8 md:w-11 md:h-11 rounded-full bg-surface-container-low border border-outline-variant flex items-center justify-center group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all duration-300 shrink-0">
                                    <span className="material-symbols-outlined text-xs md:text-sm">call_made</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CuratedLearning;
