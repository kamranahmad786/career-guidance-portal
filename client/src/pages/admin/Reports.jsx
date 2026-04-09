import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Loader from '../../components/common/Loader';

const AdminReports = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

    useEffect(() => { fetchReports(); }, []);
    const fetchReports = async () => {
        try { setLoading(true); const res = await axios.get('/api/admin/reports', { headers }); setData(res.data); }
        catch (err) { console.error(err); } finally { setLoading(false); }
    };

    if (loading) return <Loader />;

    const maxGrowth = Math.max(...(data?.monthlyGrowth || []).map(m => m.count), 1);
    const maxCareer = Math.max(...(data?.topCareers || []).map(c => c.count), 1);

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-3xl font-headline font-black text-slate-800">Reports & Analytics</h2>
                    <p className="text-slate-500 mt-1">Comprehensive platform performance overview</p>
                </div>
            </div>

            {/* Summary Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Total Users', value: data?.summary.totalUsers, icon: 'people', color: 'blue' },
                    { label: 'Quizzes Created', value: data?.summary.totalQuizzes, icon: 'quiz', color: 'indigo' },
                    { label: 'Assessments Done', value: data?.summary.totalResults, icon: 'assignment', color: 'violet' },
                    { label: 'Career Paths', value: data?.summary.totalRecommendations, icon: 'auto_awesome', color: 'emerald' },
                    { label: 'Students', value: data?.summary.totalStudents, icon: 'school', color: 'sky' },
                    { label: 'Teachers', value: data?.summary.totalTeachers, icon: 'co_present', color: 'rose' },
                    { label: 'Parents', value: data?.summary.totalParents, icon: 'family_restroom', color: 'amber' },
                    { label: 'Resources', value: data?.summary.totalResources, icon: 'auto_stories', color: 'teal' },
                ].map(c => (
                    <div key={c.label} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                        <div className={`w-9 h-9 rounded-xl bg-${c.color}-50 text-${c.color}-600 flex items-center justify-center mb-3`}>
                            <span className="material-symbols-outlined text-lg" style={{fontVariationSettings:"'FILL' 1"}}>{c.icon}</span>
                        </div>
                        <p className="text-2xl font-black text-slate-800">{c.value ?? 0}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{c.label}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Monthly Growth Chart */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                    <h3 className="text-lg font-black text-slate-800 mb-6">Monthly Registrations (12 months)</h3>
                    {data?.monthlyGrowth?.length > 0 ? (
                        <div className="flex items-end gap-1.5 h-40 bg-slate-50 rounded-xl p-4">
                            {data.monthlyGrowth.map((m, i) => (
                                <div key={i} className="flex-1 flex flex-col items-center group relative">
                                    <span className="absolute -top-5 text-[9px] font-black text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">{m.count}</span>
                                    <div className="w-full bg-blue-500 rounded-lg group-hover:bg-blue-600 transition-colors"
                                        style={{ height: `${Math.max((m.count/maxGrowth)*100, 4)}%` }}></div>
                                    <span className="text-[9px] font-black text-slate-300 mt-1">{monthNames[(m._id?.month||1)-1]}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="h-40 flex items-center justify-center text-slate-300"><p className="font-bold">No data yet</p></div>
                    )}
                </div>

                {/* Top Careers */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                    <h3 className="text-lg font-black text-slate-800 mb-6">Top Recommended Careers</h3>
                    {data?.topCareers?.length > 0 ? (
                        <div className="space-y-3">
                            {data.topCareers.map((c, i) => (
                                <div key={c._id} className="flex items-center gap-3">
                                    <span className="text-[10px] font-black text-slate-300 w-4">{i+1}</span>
                                    <div className="flex-1">
                                        <div className="flex justify-between mb-1">
                                            <span className="text-sm font-bold text-slate-700">{c._id}</span>
                                            <span className="text-xs font-black text-slate-400">{c.count}</span>
                                        </div>
                                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                                                style={{ width: `${(c.count/maxCareer)*100}%` }}></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="py-10 text-center text-slate-300"><p className="font-bold">No recommendation data yet</p></div>
                    )}
                </div>
            </div>

            {/* Top Parameters */}
            {data?.topParameters?.length > 0 && (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                    <h3 className="text-lg font-black text-slate-800 mb-6">Top Student Aptitude Parameters</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {data.topParameters.map((p, i) => {
                            const colors = ['bg-blue-500','bg-indigo-500','bg-violet-500','bg-sky-500','bg-rose-500','bg-amber-500','bg-emerald-500','bg-teal-500'];
                            return (
                                <div key={p._id} className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                                    <div className={`w-3 h-3 rounded-full ${colors[i] || 'bg-slate-300'} shrink-0`}></div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-800">{p._id}</p>
                                        <p className="text-xs text-slate-400 font-medium">{p.count} students</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminReports;
