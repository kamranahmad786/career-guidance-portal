import React from 'react';
import { useNavigate } from 'react-router-dom';

const Stakeholders = () => {
    const navigate = useNavigate();
    return (
        <section className="min-h-screen py-16 md:py-24 px-4 md:px-6 w-full mx-auto flex flex-col justify-center bg-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 blur-[120px] rounded-full -z-10"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/5 blur-[120px] rounded-full -z-10"></div>
            
            <div className="w-full mx-auto px-2 md:px-0">
                <div className="text-center mb-16 md:mb-20">
                    <h2 className="text-3xl md:text-5xl font-extrabold font-headline mb-4 md:mb-6 text-on-surface leading-tight px-4 md:px-0">Built for Every <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Stakeholder</span></h2>
                    <p className="text-on-surface-variant max-w-xl mx-auto text-base md:text-lg italic font-['Inter'] px-4 md:px-0">A multi-tenant ecosystem designed to empower everyone in the educational journey.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                    {[
                        { role: 'Student', benefit: 'Personalized Growth', desc: 'Navigate career choices with AI-backed confidence and clear developmental milestones.', icon: 'school', color: 'bg-primary' },
                        { role: 'Parent', benefit: 'Insightful Monitoring', desc: 'Stay connected with your child’s progress through real-time tracking and comprehensive reports.', icon: 'volunteer_activism', color: 'bg-secondary' },
                        { role: 'Teacher', benefit: 'Data-Driven Teaching', desc: 'Empower your classrooms with behavioral analytics and precision aptitude assessments.', icon: 'co_present', color: 'bg-tertiary' },
                        { role: 'Admin', benefit: 'Institutional Scaling', desc: 'Manage entire organizations with centralized analytics and seamless institutional tools.', icon: 'admin_panel_settings', color: 'bg-slate-800' }
                    ].map((item, idx) => (
                        <div key={idx} className="group relative bg-surface-container-lowest p-6 md:p-8 rounded-2xl md:rounded-[2rem] ambient-shadow border border-outline-variant hover:border-primary/40 transition-all duration-500 hover:-translate-y-1.5 flex flex-col items-center text-center">
                            <div className={`w-14 h-14 md:w-16 md:h-16 rounded-xl bg-primary/5 flex items-center justify-center mb-6 md:mb-8 transition-transform duration-500`}>
                                <div className={`w-11 h-11 md:w-12 md:h-12 rounded-lg ${item.color} text-white flex items-center justify-center shadow-xl`}>
                                    <span className="material-symbols-outlined text-xl md:text-2xl">{item.icon}</span>
                                </div>
                            </div>
                            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant mb-2 leading-none">{item.benefit}</h4>
                            <h3 className="text-xl md:text-2xl font-extrabold font-headline text-on-surface mb-3 md:mb-4">{item.role}</h3>
                            <p className="text-on-surface-variant leading-relaxed text-[13px] md:text-sm font-['Inter'] mb-6 md:mb-8">
                                {item.desc}
                            </p>
                            <div className="mt-auto w-full pt-4 md:pt-6 border-t border-outline-variant/30">
                                <button 
                                    onClick={() => navigate(`/stakeholder/${item.role.toLowerCase()}`)}
                                    className="text-xs font-black text-primary flex items-center justify-center gap-2 cursor-pointer w-full hover:scale-105 transition-transform"
                                >
                                    Learn More <span className="material-symbols-outlined text-sm font-black">arrow_forward</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Stakeholders;
