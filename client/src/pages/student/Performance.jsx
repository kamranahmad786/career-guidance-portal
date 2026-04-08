import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import Loader from '../../components/common/Loader';

const Performance = () => {
    const { profile } = useOutletContext();
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchResults = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/quiz/results/my', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setResults(data);
            }
        } catch (err) {
            console.error('Failed to fetch performance data:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchResults();
    }, []);

    if (isLoading) return <Loader />;

    const latestResult = results.length > 0 ? results[0] : null;
    const historyCount = results.length;
    
    // Aggregate top parameters across history
    const allTopParams = results.flatMap(r => r.topParameters || []);
    const paramFrequency = allTopParams.reduce((acc, p) => {
        acc[p] = (acc[p] || 0) + 1;
        return acc;
    }, {});
    
    const dominantTraits = Object.entries(paramFrequency)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 4);

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
            {/* Header / Intro */}
            <section className="bg-white/80 backdrop-blur-xl rounded-[3rem] p-10 lg:p-14 border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-10">
                <div className="text-center md:text-left">
                    <h2 className="text-4xl font-black text-slate-800 tracking-tight italic">Performance Intelligence</h2>
                    <p className="text-slate-500 font-medium mt-1">Deep-dive assessment of your professional trajectory and academic alignment.</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="px-8 py-4 bg-primary text-white rounded-[2rem] font-black text-[10px] uppercase tracking-widest shadow-xl shadow-primary/20">
                        {historyCount} Assessments Mapped
                    </div>
                </div>
            </section>

            {/* Performance Trajectory Card */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 bg-on-surface p-12 rounded-[4rem] text-white relative overflow-hidden group shadow-2xl">
                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-16">
                            <div>
                                <h3 className="text-3xl font-black font-headline mb-2">Aptitude Trajectory</h3>
                                <p className="opacity-60 text-xs font-bold uppercase tracking-widest italic">NEP 2026 Competency Tracking</p>
                            </div>
                            <div className="flex items-center gap-2 px-4 py-1.5 bg-white/10 rounded-full border border-white/10">
                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                                <span className="text-[8px] font-black uppercase tracking-widest">Active Discovery</span>
                            </div>
                        </div>

                        {/* Custom Trajectory Chart (Mock SVG for premium look) */}
                        <div className="h-48 w-full relative mb-12">
                            <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                                <defs>
                                    <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="#4f46e5" />
                                        <stop offset="100%" stopColor="#10b981" />
                                    </linearGradient>
                                </defs>
                                <path 
                                    d="M 0,80 Q 25,20 50,50 T 100,20" 
                                    fill="none" 
                                    stroke="url(#lineGrad)" 
                                    strokeWidth="2" 
                                    className="animate-chart-line"
                                />
                                <circle cx="0" cy="80" r="1.5" fill="#4f46e5" />
                                <circle cx="50" cy="50" r="1.5" fill="#10b981" />
                                <circle cx="100" cy="20" r="1.5" fill="#10b981" />
                            </svg>
                            <div className="absolute top-0 left-0 w-full h-full flex justify-between items-end px-2 pointer-events-none opacity-40 uppercase text-[7px] font-black tracking-widest text-white/50">
                                <span>Baseline</span>
                                <span>Midway</span>
                                <span>Optimization</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                            <div className="space-y-1">
                                <p className="text-[9px] font-black opacity-40 uppercase tracking-widest">Logic Potential</p>
                                <p className="text-2xl font-black">High</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[9px] font-black opacity-40 uppercase tracking-widest">Creativity IQ</p>
                                <p className="text-2xl font-black">94%</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[9px] font-black opacity-40 uppercase tracking-widest">Adaptability</p>
                                <p className="text-2xl font-black">Extreme</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[9px] font-black opacity-40 uppercase tracking-widest">Social Meta</p>
                                <p className="text-2xl font-black">Elite</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-10 rounded-[4rem] border border-slate-100 shadow-sm relative overflow-hidden">
                    <h3 className="text-xl font-black text-slate-800 font-headline mb-10">Dominant Traits</h3>
                    <div className="space-y-8">
                        {dominantTraits.length > 0 ? dominantTraits.map(([trait, freq], idx) => (
                            <div key={trait} className="flex items-center gap-5 group cursor-help">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all group-hover:rotate-12 ${
                                    idx === 0 ? 'bg-indigo-500 text-white' : 'bg-slate-50 text-slate-400'
                                }`}>
                                    <span className="material-symbols-outlined text-xl">
                                        {idx === 0 ? 'emoji_objects' : 'psychology'}
                                    </span>
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-center mb-1">
                                        <p className="text-[10px] font-black text-slate-800 uppercase tracking-widest">{trait}</p>
                                        <p className="text-[9px] font-bold text-slate-400 italic">Level {freq + 1}</p>
                                    </div>
                                    <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                                        <div 
                                            className={`h-full rounded-full transition-all duration-1000 ${
                                                idx === 0 ? 'bg-indigo-500' : 'bg-emerald-400'
                                            }`} 
                                            style={{ width: `${(freq / historyCount) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <div className="text-center py-20 text-slate-300 italic text-[10px] font-black uppercase tracking-widest">
                                Data processing in progress...
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Parameter Clusters */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {['Logic & Analytical', 'Creative Fluency', 'Technical Mastery', 'Interpersonal IQ'].map((param, i) => (
                    <div key={param} className="bg-white p-8 rounded-[2.5rem] border border-slate-50 hover:shadow-xl transition-all group relative overflow-hidden">
                        <div className={`absolute -top-10 -right-10 w-20 h-20 rounded-full blur-[40px] opacity-10 group-hover:opacity-20 transition-opacity ${
                            i === 0 ? 'bg-indigo-600' : (i === 1 ? 'bg-rose-500' : (i === 2 ? 'bg-amber-400' : 'bg-emerald-500'))
                        }`}></div>
                        <div className="relative z-10">
                            <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-6">{param}</h4>
                            <div className="flex items-end justify-between">
                                <p className="text-4xl font-black text-slate-800 italic">
                                    {i === 0 ? 'Elite' : (i === 1 ? 'Pro' : (i === 2 ? 'Expert' : 'High'))}
                                </p>
                                <span className={`material-symbols-outlined text-4xl opacity-10 group-hover:opacity-30 transition-all ${
                                    i === 0 ? 'text-indigo-600' : (i === 1 ? 'text-rose-500' : (i === 2 ? 'text-amber-400' : 'text-emerald-500'))
                                }`}>
                                    {i === 0 ? 'calculate' : (i === 1 ? 'palette' : (i === 2 ? 'terminal' : 'groups'))}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Performance;
