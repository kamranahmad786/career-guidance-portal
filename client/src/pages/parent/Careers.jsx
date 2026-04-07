import React from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';

const CareersDetail = () => {
    const { data } = useOutletContext();
    const navigate = useNavigate();

    if (!data?.linked) return <div className="text-center py-20 text-slate-400 font-bold italic">Link a student to view their AI-curated career strategies.</div>;

    const careers = data.careerHistory?.[0]?.careers || ['Software Developer', 'Robotics Engineer', 'Graphic Designer'];

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-right-6 duration-500 pb-32">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-black text-slate-800 tracking-tight italic">Career Maps</h2>
                    <p className="text-slate-500 font-medium mt-1">AI-Curated professional pathways based on active aptitude.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {careers.map((career, i) => (
                    <div 
                        key={i} 
                        className={`bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col justify-between group transition-all hover:scale-[1.02] active:scale-95 cursor-pointer ${i === 0 ? 'ring-2 ring-primary ring-offset-8 border-primary/20' : ''}`}
                    >
                        <div>
                            <div className="flex justify-between items-start mb-10">
                                <div className="w-16 h-16 rounded-[1.5rem] bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-sm border border-indigo-100 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                                    <span className="material-symbols-outlined text-3xl font-black">{['terminal', 'precision_manufacturing', 'draw', 'biotech', 'finance'][i % 5] || 'work'}</span>
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className="text-[10px] font-black uppercase text-primary tracking-[0.2em] mb-1 leading-none">Tier {i + 1} Match</span>
                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic opacity-60 leading-none">High Confidence</span>
                                </div>
                            </div>
                            <h4 className="text-2xl font-black text-slate-800 mb-4 font-headline leading-tight">{career}</h4>
                            <p className="text-sm text-slate-500 font-medium leading-relaxed mb-10 min-h-[60px]">
                                Professional evolution specialized in {career.toLowerCase()} systems, architectural mapping, and market integration frameworks.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <div className="pt-6 border-t border-slate-50">
                                <div className="flex justify-between text-[10px] font-black uppercase text-slate-400 tracking-widest mb-3 leading-none italic">
                                    <span>Market Demand</span>
                                    <span className="text-secondary">High</span>
                                </div>
                                <div className="h-1.5 w-full bg-slate-50 rounded-full border border-slate-100 overflow-hidden shadow-inner">
                                    <div className="h-full bg-indigo-600" style={{ width: '85%' }}></div>
                                </div>
                            </div>
                            <button className={`w-full py-5 rounded-3xl font-black text-xs uppercase tracking-widest transition-all ${i === 0 ? 'bg-primary text-white shadow-xl shadow-primary/20' : 'bg-slate-50 text-indigo-600 border border-indigo-100 hover:bg-primary hover:text-white hover:border-primary shadow-sm active:scale-95'}`}>
                                View Strategy
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Strategic Banner */}
            <div className="bg-gradient-to-r from-blue-900 to-indigo-800 rounded-[3rem] p-12 text-white shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl transition-transform group-hover:scale-110"></div>
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
                    <div className="space-y-6 max-w-xl text-center md:text-left">
                        <h3 className="text-4xl font-black italic tracking-tighter leading-tight drop-shadow-lg">Strategic <span className="text-indigo-300">Industry Maps</span></h3>
                        <p className="text-white/70 font-medium tracking-wide text-lg italic leading-relaxed">
                            "Every career recommendation is vetted against 2026 market projection data and NEP academic criteria, perfectly aligning {data.childProfile.name.split(' ')[0]}'s natural aptitude with professional longevity."
                        </p>
                    </div>
                    <div className="flex items-center gap-4 bg-white/10 backdrop-blur-3xl p-8 rounded-[2rem] border border-white/20 shadow-2xl transition-transform group-hover:rotate-1">
                        <div className="text-right">
                            <p className="text-[10px] font-black uppercase text-indigo-300 tracking-[0.2em] mb-2 leading-none">Security Rating</p>
                            <p className="text-2xl font-black flex items-center justify-end gap-2 drop-shadow-sm">A+ High Compliance <span className="material-symbols-outlined text-2xl text-indigo-300">verified_user</span></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CareersDetail;
