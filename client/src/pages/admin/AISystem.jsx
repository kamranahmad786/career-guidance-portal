import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Loader from '../../components/common/Loader';

const AdminAISystem = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    const timeAgo = (d) => { const s=Math.floor((new Date()-new Date(d))/1000); if(s<60) return `${s}s ago`; const m=Math.floor(s/60); if(m<60) return `${m}m ago`; const h=Math.floor(m/60); if(h<24) return `${h}h ago`; return `${Math.floor(h/24)}d ago`; };

    useEffect(() => { fetchStatus(); }, []);
    const fetchStatus = async () => {
        try { setLoading(true); const res = await axios.get('/api/admin/ai-status', { headers }); setData(res.data); }
        catch (err) { console.error(err); } finally { setLoading(false); }
    };

    if (loading) return <Loader />;

    const maxCount = Math.max(...(data?.topParameters || []).map(p => p.count), 1);

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-headline font-black text-slate-800">AI System Control</h2>
                <p className="text-slate-500 mt-1">Real-time cognitive engine performance metrics</p>
            </div>

            {/* Engine Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {[
                    { name: 'Quiz Generation Engine', icon: 'quiz', metric: data?.totalQuizzes, unit: 'quizzes created', color: 'blue', status: 'Online' },
                    { name: 'Assessment Engine', icon: 'assignment_turned_in', metric: data?.totalResults, unit: 'assessments processed', color: 'indigo', status: 'Online' },
                    { name: 'Recommendation Engine', icon: 'auto_awesome', metric: data?.totalRecommendations, unit: 'career paths generated', color: 'violet', status: 'Online' },
                ].map(engine => (
                    <div key={engine.name} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                        <div className="flex justify-between items-start mb-5">
                            <div className={`w-11 h-11 rounded-xl bg-${engine.color}-50 text-${engine.color}-600 flex items-center justify-center`}>
                                <span className="material-symbols-outlined text-xl" style={{fontVariationSettings:"'FILL' 1"}}>{engine.icon}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">{engine.status}</span>
                            </div>
                        </div>
                        <p className="text-3xl font-black text-slate-800">{engine.metric ?? 0}</p>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">{engine.unit}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Top Career Parameters */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                    <h3 className="text-lg font-black text-slate-800 mb-6">Top Aptitude Parameters</h3>
                    {data?.topParameters?.length > 0 ? (
                        <div className="space-y-4">
                            {data.topParameters.map((p, i) => (
                                <div key={p._id} className="flex items-center gap-4">
                                    <span className="text-[10px] font-black text-slate-300 w-5">{i+1}</span>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-center mb-1.5">
                                            <span className="text-sm font-bold text-slate-700">{p._id}</span>
                                            <span className="text-xs font-black text-slate-500">{p.count}</span>
                                        </div>
                                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-blue-500 rounded-full transition-all duration-700"
                                                style={{ width: `${(p.count / maxCount) * 100}%` }}></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="py-10 text-center text-slate-300">
                            <p className="font-bold">No aptitude data yet</p>
                        </div>
                    )}
                </div>

                {/* Recent AI Activity */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                    <h3 className="text-lg font-black text-slate-800 mb-6">Recent Assessment Activity</h3>
                    {data?.recentQuizActivity?.length > 0 ? (
                        <div className="space-y-3">
                            {data.recentQuizActivity.map((r, i) => (
                                <div key={r._id} className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-black text-xs">
                                        {r.studentId?.name?.charAt(0) || '?'}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-slate-800 truncate">{r.studentId?.name || 'Unknown Student'}</p>
                                        <p className="text-xs text-slate-400">{r.topParameters?.join(', ') || 'Assessment completed'}</p>
                                    </div>
                                    <span className="text-[10px] text-slate-400 font-bold shrink-0">{timeAgo(r.createdAt)}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="py-10 text-center text-slate-300">
                            <p className="font-bold">No recent activity</p>
                        </div>
                    )}
                </div>
            </div>

            {/* System Health */}
            <div className="bg-slate-900 rounded-2xl p-8 text-white relative overflow-hidden">
                <div className="absolute -right-20 -top-20 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px]"></div>
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-6">
                        <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Gemini API — Connected</p>
                    </div>
                    <h3 className="text-2xl font-black mb-8">All Cognitive Systems Operational</h3>
                    <div className="grid grid-cols-3 gap-6">
                        <div>
                            <p className="text-4xl font-black text-blue-400">{data?.totalQuizzes ?? 0}</p>
                            <p className="text-xs text-slate-400 mt-2 font-bold uppercase tracking-widest">Quizzes</p>
                        </div>
                        <div>
                            <p className="text-4xl font-black text-violet-400">{data?.totalResults ?? 0}</p>
                            <p className="text-xs text-slate-400 mt-2 font-bold uppercase tracking-widest">Assessments</p>
                        </div>
                        <div>
                            <p className="text-4xl font-black text-emerald-400">{data?.totalRecommendations ?? 0}</p>
                            <p className="text-xs text-slate-400 mt-2 font-bold uppercase tracking-widest">Recommendations</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminAISystem;
