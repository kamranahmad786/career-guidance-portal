import React from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';

const DashboardOverview = () => {
    const { data } = useOutletContext();
    const navigate = useNavigate();

    if (!data?.linked) return (
        <div className="bg-white rounded-3xl p-10 md:p-20 text-center border border-slate-100 shadow-xl shadow-primary/5">
            <div className="w-24 h-24 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-10 rotate-12">
                <span className="material-symbols-outlined text-5xl text-primary font-black">person_add</span>
            </div>
            <h2 className="text-4xl font-black text-slate-800 mb-6 tracking-tight">Active Connection Required</h2>
            <p className="text-slate-500 font-bold mb-12 max-w-xl mx-auto text-lg leading-relaxed">
                Connect your child's student account to monitor their AI performance alerts and career alignment in real-time.
            </p>
            <button 
                onClick={() => navigate('/parent/profile')}
                className="px-10 py-5 bg-primary text-white rounded-full font-black text-sm uppercase tracking-widest shadow-xl shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all"
            >
                Link Student Now
            </button>
        </div>
    );

    const childName = data.childProfile?.name || "Alex";
    const latestResult = data.resultsHistory?.[0] || null;
    const overallScore = 85; 

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-500">
            {/* Morning Brief */}
            <section className="bg-white/80 backdrop-blur-xl rounded-xl p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border border-slate-100 shadow-sm transition-all hover:bg-white/90">
                <div>
                    <h2 className="text-4xl font-extrabold text-slate-800 tracking-tight mb-2 italic">Welcome Back 👋</h2>
                    <p className="text-slate-500 text-lg font-medium">Your overview of {childName.split(' ')[0]}'s latest career trajectory.</p>
                </div>
                <div className="bg-slate-50 px-6 py-3 rounded-full flex items-center gap-4 border border-slate-100 cursor-pointer hover:bg-slate-100 transition-colors">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-black text-[10px]">
                            {childName.charAt(0)}
                        </div>
                        <span className="font-bold text-slate-700">{childName}</span>
                    </div>
                    <span className="material-symbols-outlined text-slate-400">keyboard_arrow_down</span>
                </div>
            </section>

            {/* Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                
                {/* Child Profile Overview */}
                <div className="md:col-span-4 bg-white rounded-lg p-6 shadow-sm border border-slate-100 flex flex-col">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-bold text-slate-900">Child Profile</h3>
                        <span className="material-symbols-outlined text-primary">person_search</span>
                    </div>
                    <div className="space-y-6 flex-1">
                        <div className="flex flex-col">
                            <p className="text-[10px] uppercase tracking-widest text-slate-400 font-black mb-1.5">Current Grade</p>
                            <p className="text-lg font-bold text-primary">{data.childProfile.grade}</p>
                        </div>
                        <div className="flex flex-col">
                            <p className="text-[10px] uppercase tracking-widest text-slate-400 font-black mb-1.5">Educational Level</p>
                            <p className="text-lg font-bold text-slate-800">{data.childProfile.school}</p>
                        </div>
                        <div className="pt-6 border-t border-slate-50">
                            <p className="text-[10px] uppercase tracking-widest text-slate-400 font-black mb-4">Core Interests</p>
                            <div className="flex flex-wrap gap-2">
                                {(data.childProfile.details?.interests || ['Coding', 'Mathematics']).map(tag => (
                                    <span key={tag} className="bg-primary/5 text-primary px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider">{tag}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quiz Performance */}
                <div className="md:col-span-4 bg-white rounded-lg p-10 shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center">
                    <h3 className="text-xl font-bold text-slate-900 mb-10 w-full text-left">Latest Assessment</h3>
                    <div className="relative w-40 h-40 flex items-center justify-center mb-8">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle className="text-slate-50" cx="80" cy="80" fill="transparent" r="70" stroke="currentColor" strokeWidth="14"></circle>
                            <circle 
                                className="text-primary transition-all duration-1000" 
                                cx="80" cy="80" fill="transparent" r="70" 
                                stroke="currentColor" 
                                strokeWidth="14"
                                strokeDasharray="439.8"
                                strokeDashoffset={439.8 - (439.8 * overallScore) / 100}
                                strokeLinecap="round"
                            ></circle>
                        </svg>
                        <div className="absolute flex flex-col items-center">
                            <span className="text-4xl font-black text-slate-800">{overallScore}%</span>
                            <span className="text-[10px] uppercase font-black text-slate-400 tracking-widest mt-1">High Match</span>
                        </div>
                    </div>
                    <p className="text-sm font-bold text-slate-500">Completed on {latestResult ? new Date(latestResult.createdAt).toLocaleDateString() : 'N/A'}</p>
                </div>

                {/* Interest Toggles / Bars */}
                <div className="md:col-span-4 bg-white rounded-lg p-8 shadow-sm border border-slate-100">
                    <h3 className="text-xl font-bold text-slate-900 mb-8">Skill Alignment</h3>
                    <div className="space-y-8">
                        {[
                            { label: 'Coding', value: 85 },
                            { label: 'Analytical', value: 78 },
                            { label: 'Creative', value: 70 }
                        ].map(item => (
                            <div key={item.label}>
                                <div className="flex justify-between text-xs font-black uppercase tracking-widest mb-3 text-slate-400">
                                    <span>{item.label}</span>
                                    <span className="text-primary">{item.value}%</span>
                                </div>
                                <div className="h-2 w-full bg-slate-50 rounded-full border border-slate-100 overflow-hidden">
                                    <div className="h-full bg-primary" style={{ width: `${item.value}%` }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* AI Insight Card */}
                <div className="md:col-span-12 bg-primary text-white rounded-xl p-10 shadow-2xl shadow-primary/20 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex items-center gap-8">
                        <div className="bg-white/20 w-16 h-16 rounded-2xl flex items-center justify-center backdrop-blur-md">
                            <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                        </div>
                        <div>
                            <h3 className="text-2xl font-black italic tracking-tight mb-2">AI Perspective</h3>
                            <p className="text-white/80 font-medium italic text-lg leading-relaxed max-w-xl">
                                "{childName.split(' ')[0]} is excelling in mathematical logic. Encouraging more complex problem-solving activities will further sharpen their focus."
                            </p>
                        </div>
                    </div>
                    <button className="px-10 py-5 bg-white text-primary rounded-full font-black text-xs uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all">
                        Full Analysis
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DashboardOverview;
