import React from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';

const PerformanceGrowthChart = ({ data }) => {
    if (!data || data.length < 2) {
        return (
            <div className="h-48 flex flex-col items-center justify-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                <span className="material-symbols-outlined text-slate-300 text-3xl mb-2">trending_up</span>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Baseline Assessment Pending</p>
                <p className="text-[9px] text-slate-300 mt-1 italic">Take more quizzes to see trend lines</p>
            </div>
        );
    }

    const maxScore = 100;
    const padding = 20;
    const width = 400;
    const height = 150;
    
    // Calculate points
    const points = data.map((d, i) => {
        const x = (i / (data.length - 1)) * (width - 2 * padding) + padding;
        const y = height - ((d.score / maxScore) * (height - 2 * padding) + padding);
        return `${x},${y}`;
    }).join(' ');

    return (
        <div className="w-full h-48 bg-white p-4 rounded-2xl flex flex-col">
            <svg viewBox={`0 0 ${width} ${height}`} className="flex-1 drop-shadow-md">
                <polyline
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={points}
                />
                {data.map((d, i) => {
                    const x = (i / (data.length - 1)) * (width - 2 * padding) + padding;
                    const y = height - ((d.score / maxScore) * (height - 2 * padding) + padding);
                    return (
                        <circle key={i} cx={x} cy={y} r="5" fill="#3b82f6" className="animate-pulse" />
                    );
                })}
            </svg>
            <div className="flex justify-between mt-4">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Initial</span>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Current</span>
            </div>
        </div>
    );
};

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
    const overallScore = latestResult ? latestResult.score : 0; 
    const scoreTrend = data.childProfile?.scoreTrend || [];
    const topCareers = data.childProfile?.topCareers || [];
    const skillAlignment = data.childProfile?.skillAlignment || [
        { label: 'Analytical', value: 0 },
        { label: 'Creative', value: 0 },
        { label: 'Coding', value: 0 }
    ];

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-500 pb-20">
            {/* Morning Brief */}
            <section className="bg-white/80 backdrop-blur-xl rounded-xl p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border border-slate-100 shadow-sm transition-all hover:bg-white/90">
                <div>
                    <h2 className="text-4xl font-extrabold text-slate-800 tracking-tight mb-2 italic">Parent Insight Center 👋</h2>
                    <p className="text-slate-500 text-lg font-medium">Your overview of {childName.split(' ')[0]}'s latest career trajectory.</p>
                </div>
                <div className="bg-slate-50 px-6 py-3 rounded-full flex items-center gap-4 border border-slate-100 cursor-pointer hover:bg-slate-100 transition-colors">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-black text-[10px]">
                            {childName.charAt(0)}
                        </div>
                        <span className="font-bold text-slate-700">{childName}</span>
                    </div>
                </div>
            </section>

            {/* Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                
                {/* Child Growth Section (User Growth) */}
                <div className="md:col-span-8 bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 flex flex-col">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-xl font-bold text-slate-900">Performance Growth</h3>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1 italic">Score trajectory over recent assessments</p>
                        </div>
                        <span className="material-symbols-outlined text-blue-500 font-black">trending_up</span>
                    </div>
                    <PerformanceGrowthChart data={scoreTrend} />
                </div>

                {/* Latest Quiz Performance */}
                <div className="md:col-span-4 bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center">
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
                            <span className="text-[10px] uppercase font-black text-slate-400 tracking-widest mt-1">{overallScore > 75 ? 'Excellent' : 'Improving'}</span>
                        </div>
                    </div>
                    <p className="text-sm font-bold text-slate-500">{latestResult ? `Completed on ${new Date(latestResult.createdAt).toLocaleDateString()}` : 'No quizzes taken yet'}</p>
                </div>

                {/* Career Interests Section */}
                <div className="md:col-span-6 bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-bold text-slate-900">AI Career Interests</h3>
                        <span className="material-symbols-outlined text-amber-500">military_tech</span>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        {topCareers.length > 0 ? topCareers.map((career, i) => (
                            <div key={career} className="bg-amber-50 border border-amber-100 px-6 py-4 rounded-2xl flex items-center gap-4 group hover:bg-amber-100 transition-all cursor-default">
                                <span className="text-lg font-black text-amber-600 opacity-30">0{i+1}</span>
                                <span className="font-bold text-slate-700 tracking-tight">{career}</span>
                            </div>
                        )) : (
                            <p className="text-sm text-slate-400 italic">Complete an AI Recommendation assessment to unlock career paths.</p>
                        )}
                    </div>
                </div>

                {/* Skill Strength Breakdown */}
                <div className="md:col-span-6 bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100">
                    <h3 className="text-xl font-bold text-slate-900 mb-8">Skill Alignment</h3>
                    <div className="space-y-6">
                        {skillAlignment.map(item => (
                            <div key={item.label}>
                                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-3 text-slate-400 italic">
                                    <span>{item.label}</span>
                                    <span className="text-primary">{item.value}%</span>
                                </div>
                                <div className="h-3 w-full bg-slate-50 rounded-full border border-slate-100 overflow-hidden p-0.5">
                                    <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: `${item.value}%` }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* AI Insight Card */}
                <div className="md:col-span-12 bg-slate-900 text-white rounded-[3rem] p-12 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-10">
                    <div className="flex items-center gap-10">
                        <div className="bg-white/10 w-20 h-20 rounded-[2rem] flex items-center justify-center backdrop-blur-md border border-white/20">
                            <span className="material-symbols-outlined text-5xl text-blue-400" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                        </div>
                        <div>
                            <h3 className="text-2xl font-black italic tracking-tight mb-2 text-blue-400">AI Parental Perspective</h3>
                            <p className="text-white/80 font-medium italic text-lg leading-relaxed max-w-2xl">
                                "{childName.split(' ')[0]} is showing consistent <b>{(scoreTrend[scoreTrend.length-1]?.score > scoreTrend[0]?.score) ? 'upward growth' : 'dedication'}</b> in cognitive assessments. Their recent focus on {topCareers[0] || 'core academics'} suggests a strong alignment with future tech or analytical careers."
                            </p>
                        </div>
                    </div>
                    <button onClick={() => navigate('/parent/career')} className="px-12 py-6 bg-blue-500 text-white rounded-full font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-500/30 hover:scale-105 active:scale-95 transition-all whitespace-nowrap">
                        View Recommendations
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DashboardOverview;
