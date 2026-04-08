import React from 'react';
import { useOutletContext, useParams, useNavigate } from 'react-router-dom';

const CareerStrategy = () => {
    const { data } = useOutletContext();
    const { careerName } = useParams();
    const navigate = useNavigate();

    if (!data?.linked) return <div className="text-center py-20 text-slate-400 font-bold italic">Link a student to view their AI-curated strategies.</div>;

    const recommendation = data.careerHistory?.[0] || {
        roadmap: "Complete specialized certifications in AI and Machine Learning. Participate in industry hackathons to build a portfolio. Network with professionals in the tech sector for mentorship.",
        courses: ["Advanced Neural Networks", "Ethical AI Certification", "Scalable System Architecture"]
    };

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-right-6 duration-500 pb-32">
            {/* Header */}
            <div>
                <button 
                    onClick={() => navigate('/parent/careers')}
                    className="flex items-center gap-2 text-slate-400 font-black text-[10px] uppercase tracking-widest mb-4 hover:text-primary transition-colors"
                >
                    <span className="material-symbols-outlined text-sm">arrow_back</span>
                    Back to Maps
                </button>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h2 className="text-4xl font-black text-slate-800 tracking-tight italic">{careerName} Strategy</h2>
                        <p className="text-slate-500 font-medium mt-1">Multi-year professional roadmap curated by EduDisha AI.</p>
                    </div>
                    <div className="bg-primary/5 px-6 py-3 rounded-2xl border border-primary/10 flex items-center gap-3">
                        <span className="material-symbols-outlined text-primary text-xl">verified</span>
                        <span className="text-[11px] font-black uppercase text-primary tracking-widest leading-none italic">NEP 2020 Aligned</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Main Roadmap */}
                <div className="lg:col-span-2 space-y-12">
                    <div className="bg-white p-12 rounded-[4rem] shadow-sm border border-slate-100 relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-1.5 h-full bg-primary/20 group-hover:bg-primary transition-colors"></div>
                        <h3 className="text-2xl font-black text-slate-800 mb-8 font-headline italic flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center">
                                <span className="material-symbols-outlined text-xl">route</span>
                            </div>
                            Execution Roadmap
                        </h3>
                        <div className="space-y-8">
                            {recommendation.roadmap.split('. ').map((step, idx) => (
                                <div key={idx} className="flex gap-8 group/item">
                                    <div className="flex flex-col items-center">
                                        <div className="w-8 h-8 rounded-full border-2 border-primary/20 text-primary flex items-center justify-center font-black text-xs group-hover/item:bg-primary group-hover/item:text-white transition-all">
                                            {idx + 1}
                                        </div>
                                        {idx !== recommendation.roadmap.split('. ').length - 1 && (
                                            <div className="w-[1px] h-full bg-slate-100 mt-2"></div>
                                        )}
                                    </div>
                                    <p className="text-lg text-slate-600 font-medium leading-relaxed pb-8 italic opacity-80 group-hover/item:opacity-100 transition-opacity">
                                        {step.endsWith('.') ? step : `${step}.`}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Industrial Alignment */}
                    <div className="bg-slate-900 rounded-[4rem] p-12 text-white shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                        <h3 className="text-2xl font-black italic tracking-tighter mb-8 drop-shadow-lg">Industry Forecast</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="p-8 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-3xl hover:bg-white/10 transition-colors cursor-default">
                                <p className="text-[10px] font-black uppercase text-primary tracking-widest mb-2 opacity-60">Global Growth</p>
                                <p className="text-3xl font-black">+24% CAGR <span className="text-emerald-400 material-symbols-outlined align-middle ml-2">trending_up</span></p>
                                <p className="text-xs text-white/50 mt-4 font-medium italic">Projected market expansion for {careerName} specialized roles by 2030.</p>
                            </div>
                            <div className="p-8 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-3xl hover:bg-white/10 transition-colors cursor-default">
                                <p className="text-[10px] font-black uppercase text-primary tracking-widest mb-2 opacity-60">Skill Scarcity</p>
                                <p className="text-3xl font-black text-amber-400">Critical <span className="material-symbols-outlined align-middle ml-2">warning</span></p>
                                <p className="text-xs text-white/50 mt-4 font-medium italic">High demand for talent with deep proficiency in core adaptive systems.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Side Rails: Course Recommendations */}
                <div className="space-y-8">
                    <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100">
                        <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-8 italic">Academic Support</h4>
                        <div className="space-y-6">
                            {(recommendation.courses || ["System Architecture", "AI Ethics", "Data Structures"]).map((course, idx) => (
                                <div key={idx} className="p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:border-primary transition-all group/course cursor-pointer">
                                    <h5 className="text-sm font-black text-slate-800 leading-tight mb-2 group-hover/course:text-primary transition-colors">{course}</h5>
                                    <div className="flex items-center gap-2">
                                        <span className="material-symbols-outlined text-sm text-slate-300">school</span>
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Recommended Tier 1</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="w-full mt-10 py-5 bg-slate-900 text-white rounded-[2rem] font-black text-[10px] uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all">
                            Browse All Courses
                        </button>
                    </div>

                    {/* AI Mentor Callout */}
                    <div className="p-10 bg-indigo-50 rounded-[3rem] border border-indigo-100">
                        <div className="w-12 h-12 rounded-2xl bg-white text-indigo-600 flex items-center justify-center shadow-sm border border-indigo-100 mb-6">
                            <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                        </div>
                        <p className="text-sm text-indigo-900 font-bold leading-relaxed italic opacity-80 mb-6">
                            "Focusing on the first 3 steps of the roadmap within the next 12 months will significantly increase professional visibility for {careerName}."
                        </p>
                        <div className="flex items-center gap-4">
                            <div className="w-8 h-8 rounded-full bg-indigo-600"></div>
                            <div>
                                <p className="text-[9px] font-black uppercase text-indigo-600 tracking-widest">EduDisha AI</p>
                                <p className="text-[8px] font-black text-slate-400 uppercase italic">Strategy Lead</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CareerStrategy;
