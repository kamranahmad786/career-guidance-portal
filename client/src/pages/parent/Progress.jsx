import React from 'react';
import { useOutletContext } from 'react-router-dom';

const ProgressCharts = () => {
    const { data } = useOutletContext();

    if (!data?.linked) return <div className="text-center py-20 text-slate-400 font-bold italic">Link a student to view their skill development trends.</div>;

    const childName = data.childProfile?.name || "Alex";

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-right-6 duration-500 pb-32">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-black text-slate-800 tracking-tight italic">Progress Insights</h2>
                    <p className="text-slate-500 font-medium mt-1">Holistic trend analysis based on multi-parameter assessment data.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-12">
                {/* Main Trend Chart Card */}
                <div className="bg-white rounded-[3rem] p-12 shadow-sm border border-slate-100 relative group overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-indigo-400 to-primary/10"></div>
                    <div className="flex justify-between items-center mb-16 px-4">
                        <div>
                            <h3 className="text-2xl font-black italic tracking-tight text-slate-800 leading-none mb-3">Skill Evolution</h3>
                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest leading-none">Tracking 6-Month Competency Roadmap</p>
                        </div>
                        <div className="flex gap-8">
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full bg-primary shadow-glow shadow-primary/30"></div>
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">{childName.split(' ')[0]}'s Growth</span>
                            </div>
                            <div className="flex items-center gap-3 opacity-40">
                                <span className="w-3 h-3 rounded-full bg-slate-300"></span>
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">Class Average</span>
                            </div>
                        </div>
                    </div>

                    <div className="h-80 flex items-end justify-between gap-10 px-8">
                        {[65, 78, 82, 75, 88, 92].map((h, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-10">
                                <div className="w-full bg-slate-50 rounded-[1.5rem] relative h-64 overflow-hidden border border-slate-100 group-hover:border-primary/10 transition-all">
                                    <div 
                                        className="absolute bottom-0 w-full bg-primary/10 rounded-[1.5rem] transition-all duration-1000 delay-100" 
                                        style={{ height: `${h}%` }}
                                    ></div>
                                    <div 
                                        className="absolute bottom-0 w-full bg-primary rounded-t-[1.5rem] transition-all duration-1000 shadow-2xl group-hover:brightness-110" 
                                        style={{ height: `${h-5}%` }}
                                    ></div>
                                    <div className="absolute top-4 left-0 right-0 text-center opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                                        <span className="px-3 py-1.5 bg-slate-900 text-white rounded-xl text-xs font-black shadow-xl">{h}%</span>
                                    </div>
                                </div>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic leading-none">{['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'][i]}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Parameter Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {[
                        { label: 'Analytical Intelligence', value: 85, icon: 'analytics', color: 'indigo' },
                        { label: 'Creative Adaptability', value: 78, icon: 'palette', color: 'emerald' }
                    ].map(param => (
                        <div key={param.label} className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col justify-between group transition-all hover:bg-slate-50">
                            <div className="flex items-center justify-between mb-10">
                                <div className={`w-12 h-12 rounded-2xl bg-${param.color}-50 text-${param.color}-600 flex items-center justify-center border border-${param.color}-100 shadow-sm group-hover:scale-110 transition-transform`}>
                                    <span className="material-symbols-outlined italic text-3xl font-black">{param.icon}</span>
                                </div>
                                <span className={`text-[10px] font-black text-${param.color}-600 uppercase tracking-widest animate-pulse transition-opacity group-hover:opacity-100`}>Real-Time Metric</span>
                            </div>
                            <div>
                                <h4 className="text-xl font-black text-slate-800 mb-2 leading-none">{param.label}</h4>
                                <p className="text-xs text-slate-400 font-bold mb-8 italic uppercase tracking-widest opacity-60">Competency Level: {param.value > 80 ? 'Mastery' : 'Professional'}</p>
                                <div className="flex justify-between text-[10px] font-black uppercase text-primary tracking-widest mb-3 leading-none italic">
                                    <span>Proficiency Rating</span>
                                    <span>{param.value}%</span>
                                </div>
                                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner border border-slate-100">
                                    <div className="h-full bg-primary transition-all duration-1000 delay-300" style={{ width: `${param.value}%` }}></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* AI Actionable Suggestion */}
            <div className="bg-primary text-white p-12 rounded-[3.5rem] shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl group-hover:scale-150 transition-all duration-[2000ms]"></div>
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
                    <div className="space-y-6 max-w-xl text-center md:text-left">
                        <div className="flex items-center justify-center md:items-start gap-4">
                            <div className="bg-white/10 w-12 h-12 rounded-2xl flex items-center justify-center backdrop-blur-md">
                                <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                            </div>
                            <h3 className="text-3xl font-black italic tracking-tighter leading-tight drop-shadow-lg">Strategic Insight</h3>
                        </div>
                        <p className="text-white/80 font-medium tracking-wide text-lg italic leading-relaxed">
                            "{childName.split(' ')[0]} has shown a 12% increase in Logical Structure usage this month. We recommend focusing on 'System Architecture' courses as a natural next step in their professional roadmap."
                        </p>
                    </div>
                    <button className="px-10 py-5 bg-white text-primary rounded-full font-black text-xs uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all">
                        Update Roadmap
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProgressCharts;
