import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Loader from '../../components/common/Loader';

const QuizReportDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResult = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(`/api/quiz/report/${id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setResult(data);
                }
            } catch (err) {
                console.error('Failed to fetch result detail:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchResult();
    }, [id]);

    if (loading) return <Loader />;
    if (!result) return <div className="text-center py-20 text-slate-400 font-bold italic">Assessment report not found.</div>;

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-right-6 duration-500 pb-32">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <button 
                        onClick={() => navigate('/parent/results')}
                        className="flex items-center gap-2 text-slate-400 font-black text-[10px] uppercase tracking-widest mb-4 hover:text-primary transition-colors"
                    >
                        <span className="material-symbols-outlined text-sm">arrow_back</span>
                        Back to History
                    </button>
                    <h2 className="text-4xl font-black text-slate-800 tracking-tight italic">Analytical Report</h2>
                    <p className="text-slate-500 font-medium mt-1">Detailed assessment breakdown recorded on {new Date(result.createdAt).toLocaleDateString()}.</p>
                </div>
                <div className="bg-emerald-50 px-6 py-3 rounded-2xl border border-emerald-100 flex items-center gap-3">
                    <span className="material-symbols-outlined text-emerald-500 text-xl">verified</span>
                    <span className="text-[11px] font-black uppercase text-emerald-700 tracking-widest leading-none">VERIFIED SCORE</span>
                </div>
            </div>

            {/* Assessment Insight Card */}
            <div className="bg-gradient-to-br from-slate-900 to-indigo-950 p-12 rounded-[4rem] text-white shadow-2xl relative overflow-hidden group">
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-10">
                    <div>
                        <h3 className="text-3xl font-black mb-6 font-headline tracking-tighter">Interest Insight</h3>
                        <p className="text-white/70 font-medium text-lg max-w-lg leading-relaxed italic">
                            "The student lean strongly towards <span className="text-indigo-300 underline decoration-2 underline-offset-4 font-black">{result.topParameters?.join(" and ")}</span>. These scores suggest a high potential for analytical leadership."
                        </p>
                    </div>
                    <div className="flex items-center gap-8">
                        <div className="text-center">
                            <p className="text-5xl font-black mb-2">{result.topParameters?.length || 0}</p>
                            <p className="text-[10px] font-black opacity-40 uppercase tracking-widest leading-none">Key Clusters</p>
                        </div>
                        <div className="w-[1px] h-16 bg-white/10"></div>
                        <div className="text-center">
                            <p className="text-5xl font-black mb-2">{Object.keys(result.parameterScores || {}).length}</p>
                            <p className="text-[10px] font-black opacity-40 uppercase tracking-widest leading-none">Mapped Metrics</p>
                        </div>
                    </div>
                </div>
                <span className="material-symbols-outlined absolute -bottom-10 -right-10 text-white/5 text-[20rem] rotate-12 group-hover:rotate-0 transition-transform duration-1000">analytics</span>
            </div>

            {/* Parameter Grid - Sorted by Score */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {Object.entries(result.parameterScores || {})
                    .sort(([, a], [, b]) => b - a)
                    .map(([param, score], idx) => (
                    <div key={param} className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm transition-all group hover:bg-slate-50/50">
                        <div className="flex justify-between items-center mb-10">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 border
                                ${score > 70 ? 'bg-emerald-50 text-emerald-500 border-emerald-100' : 'bg-slate-50 text-slate-400 border-slate-100'}`}>
                                <span className="material-symbols-outlined text-3xl">
                                    {score > 70 ? 'verified' : 'monitoring'}
                                </span>
                            </div>
                            <div className="text-right">
                                <p className="text-2xl font-black text-slate-800 leading-none mb-1">{score}%</p>
                                <p className="text-[9px] font-black text-slate-400 tracking-widest uppercase leading-none">Proficiency</p>
                            </div>
                        </div>
                        <h4 className="text-lg font-black text-slate-800 font-headline mb-6 group-hover:text-primary transition-colors">{param}</h4>
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-100 mb-3">
                            <div 
                                className={`h-full rounded-full transition-all duration-[2000ms] 
                                ${score > 70 ? 'bg-emerald-500 shadow-glow shadow-emerald-500/20' : 'bg-primary'}`} 
                                style={{ width: `${score}%` }}
                            ></div>
                        </div>
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-none italic">
                            {score > 70 ? 'Target Alignment' : (score >= 50 ? 'Developing' : 'Exploration Area')}
                        </p>
                    </div>
                ))}
            </div>

            {/* Parental Support Block */}
            <div className="p-10 bg-white rounded-[3rem] border border-primary/20 shadow-xl shadow-primary/5 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex items-center gap-8">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                        <span className="material-symbols-outlined text-primary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                    </div>
                    <div>
                        <h3 className="text-xl font-black italic tracking-tight text-slate-800 mb-1 leading-none">Guardian Guidance</h3>
                        <p className="text-slate-500 font-medium max-w-lg leading-relaxed italic">
                            "A score above 70% in any domain indicates high natural affinity. We recommend providing {result.topParameters?.[0]}-based enrichment materials."
                        </p>
                    </div>
                </div>
                <button className="px-8 py-4 bg-slate-900 text-white rounded-full font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all">
                    Download PDF
                </button>
            </div>
        </div>
    );
};

export default QuizReportDetail;
