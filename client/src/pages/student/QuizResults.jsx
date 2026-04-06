import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const QuizResults = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [results, setResults] = useState([]);

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const res = await fetch('/api/quiz/results/my', {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setResults(data);
                }
            } catch (err) {
                console.error('Failed to fetch results:', err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchResults();
    }, []);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-surface">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">Processing Analytics...</p>
            </div>
        );
    }

    const latestResult = results.length > 0 ? results[0] : null;

    return (
        <div className="min-h-screen bg-surface p-6 md:p-10 lg:p-16 font-body">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-16">
                    <button onClick={() => navigate('/student/dashboard')} className="flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-widest mb-6 hover:text-primary transition-colors">
                        <span className="material-symbols-outlined text-sm">arrow_back</span>
                        Back to Dashboard
                    </button>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-black text-on-surface font-headline mb-4 tracking-tight">Interest Analytics</h1>
                            <p className="text-slate-400 font-medium max-w-2xl text-lg">A deep-dive into your <span className="text-primary font-bold italic">12-Parameter Assessment</span>. These scores define your professional DNA.</p>
                        </div>
                        <button onClick={() => navigate('/student/quiz')} className="px-8 py-4 bg-on-surface text-white rounded-[2rem] shadow-xl text-[11px] font-black uppercase tracking-widest hover:scale-105 transition-all">
                            Retake Assessment
                        </button>
                    </div>
                </div>

                {latestResult ? (
                    <div className="space-y-16">
                        {/* Summary Card */}
                        <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-12 rounded-[4rem] text-white shadow-2xl relative overflow-hidden group">
                           <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-10">
                                <div>
                                    <h3 className="text-3xl font-black mb-4 font-headline">Assessment Insight</h3>
                                    <p className="opacity-80 font-bold text-base max-w-lg leading-relaxed">
                                        Your primary interests lean strongly towards <span className="text-emerald-300 underline decoration-2 underline-offset-4">{latestResult.topParameters?.join(" and ")}</span>. 
                                        This combination suggests a highly capable multi-disciplinary profile.
                                    </p>
                                </div>
                                <div className="flex items-center gap-8">
                                    <div className="text-center">
                                        <p className="text-5xl font-black mb-1">{latestResult.topParameters?.length || 0}</p>
                                        <p className="text-[10px] font-black opacity-60 uppercase tracking-widest">Key Domains</p>
                                    </div>
                                    <div className="w-[1px] h-16 bg-white/10"></div>
                                    <div className="text-center">
                                        <p className="text-5xl font-black mb-1">{Object.keys(latestResult.parameterScores || {}).length}</p>
                                        <p className="text-[10px] font-black opacity-60 uppercase tracking-widest">Mapped Parameters</p>
                                    </div>
                                </div>
                           </div>
                           <span className="material-symbols-outlined absolute -bottom-10 -right-10 text-white/10 text-[18rem] rotate-12 group-hover:rotate-0 transition-transform duration-1000">analytics</span>
                        </div>

                        {/* Parameter Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {Object.entries(latestResult.parameterScores || {}).map(([param, score], idx) => (
                                <div key={param} className="bg-white p-8 rounded-[3rem] border border-slate-50 hover:shadow-xl transition-all group">
                                    <div className="flex justify-between items-center mb-10">
                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500
                                            ${score > 70 ? 'bg-emerald-50 text-emerald-500 border border-emerald-100' : 'bg-slate-50 text-slate-400 border border-slate-100'}`}>
                                            <span className="material-symbols-outlined text-3xl">
                                                {score > 70 ? 'verified' : 'monitoring'}
                                            </span>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl font-black text-on-surface">{score}%</p>
                                            <p className="text-[9px] font-black text-slate-400 tracking-widest uppercase">Score</p>
                                        </div>
                                    </div>
                                    <h4 className="text-lg font-black text-on-surface font-headline mb-6 group-hover:text-primary transition-colors">{param}</h4>
                                    <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100 mb-2">
                                        <div 
                                            className={`h-full rounded-full transition-all duration-1000 
                                            ${score > 70 ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]' : 'bg-indigo-500 shadow-[0_0_10px_rgba(79,70,229,0.3)]'}`} 
                                            style={{ width: `${score}%` }}
                                        ></div>
                                    </div>
                                    <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">
                                        {score > 70 ? 'Strong Alignment' : (score >= 50 ? 'Moderate Potential' : 'Exploration Required')}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="bg-white p-20 rounded-[4rem] border border-dashed border-slate-200 text-center shadow-sm">
                        <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center text-slate-200 mx-auto mb-8 border border-slate-100">
                            <span className="material-symbols-outlined text-6xl">query_stats</span>
                        </div>
                        <h2 className="text-3xl font-black text-on-surface mb-4 font-headline tracking-tight">No Assessment Data Found</h2>
                        <p className="text-slate-400 font-medium max-w-md mx-auto mb-10 leading-relaxed">
                            To view your detailed interest analytics, you must first complete your discovery journey assessment.
                        </p>
                        <button onClick={() => navigate('/student/quiz')} className="px-10 py-5 bg-primary text-white rounded-[2rem] font-black text-[11px] uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 transition-all">
                            Start Journey Now
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default QuizResults;
