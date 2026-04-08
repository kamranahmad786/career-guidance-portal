import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import Loader from '../../components/common/Loader';

const TeacherPerformance = () => {
    const { data } = useOutletContext();
    const [roster, setRoster] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchRoster = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/teacher/roster', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setRoster(data);
            }
        } catch (err) {
            console.error('Failed to fetch roster:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchRoster();
    }, []);

    if (isLoading) return <Loader />;

    // Aggregate Data
    const totalStudents = roster.length;
    const participants = roster.filter(s => s.status === 'Completed').length;
    const participationRate = totalStudents > 0 ? Math.round((participants / totalStudents) * 100) : 0;
    
    // Average scores 
    const scores = roster.filter(s => s.score !== '--').map(s => parseInt(s.score));
    const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;

    // Dominant Interests
    const interestCounts = roster.reduce((acc, curr) => {
        if (curr.interest !== 'N/A' && curr.interest !== 'Analyzing...') {
            acc[curr.interest] = (acc[curr.interest] || 0) + 1;
        }
        return acc;
    }, {});
    const topInterests = Object.entries(interestCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 4);

    return (
        <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
            {/* Header section */}
            <div className="relative p-12 rounded-[3.5rem] bg-on-surface text-white overflow-hidden mb-8 shadow-2xl shadow-blue-900/10">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-white/5 to-transparent pointer-events-none"></div>
                <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md mb-6 border border-white/10">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                        <span className="text-[10px] font-black uppercase tracking-widest text-white/70 italic">Live School Analytics</span>
                    </div>
                    <h2 className="text-5xl font-black tracking-tight mb-4">School Performance <br/>Intelligence</h2>
                    <p className="max-w-xl text-slate-300 font-medium leading-relaxed">
                        Holistic monitoring of career discovery trends, participation metrics, and academic alignment across your school's stakeholder ecosystem.
                    </p>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                {[
                    { label: 'Total Roster', value: totalStudents, sub: 'Registered Students', icon: 'groups' },
                    { label: 'Participation', value: `${participationRate}%`, sub: 'Assessment Rate', icon: 'analytics' },
                    { label: 'Avg Performance', value: `${avgScore}%`, sub: 'Current Aptitude', icon: 'trending_up' },
                    { label: 'Active Alerts', value: 'Live', sub: 'Sync Active', icon: 'hub' }
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined font-bold">{stat.icon}</span>
                            </div>
                        </div>
                        <h3 className="text-3xl font-black tracking-tight text-slate-800 mb-1">{stat.value}</h3>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{stat.label}</p>
                        <p className="text-[9px] font-bold text-slate-300 mt-2 italic">{stat.sub}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                {/* Interest Distribution */}
                <div className="lg:col-span-2 bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm relative overflow-hidden">
                    <div className="flex justify-between items-center mb-10">
                        <div>
                            <h3 className="text-xl font-black text-slate-800 tracking-tight">Career Trajectory Map</h3>
                            <p className="text-xs font-semibold text-slate-400 mt-1 uppercase tracking-widest leading-none">Dominant Career Paths in School</p>
                        </div>
                        <span className="material-symbols-outlined text-slate-200 text-4xl">donut_large</span>
                    </div>

                    <div className="space-y-8">
                        {topInterests.length > 0 ? topInterests.map(([name, count], i) => (
                            <div key={i} className="relative">
                                <div className="flex justify-between items-end mb-2">
                                    <span className="text-sm font-black text-slate-700 tracking-tight">{name}</span>
                                    <span className="text-xs font-black text-primary italic">{Math.round((count / roster.filter(s => s.status === 'Completed').length) * 100)}%</span>
                                </div>
                                <div className="h-3 w-full bg-slate-50 rounded-full overflow-hidden">
                                    <div 
                                        className={`h-full bg-primary transition-all duration-1000 delay-${i * 100}`}
                                        style={{ width: `${(count / roster.filter(s => s.status === 'Completed').length) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        )) : (
                            <div className="py-12 text-center text-slate-300 italic font-medium">No trajectory data processed yet...</div>
                        )}
                    </div>
                </div>

                {/* Performance Cluster */}
                <div className="bg-[#fcfdff] p-10 rounded-[3rem] border border-slate-100 shadow-sm">
                    <h3 className="text-xl font-black text-slate-800 tracking-tight mb-2">Aptitude Clusters</h3>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-8 italic">School Performance Heatmap</p>
                    
                    <div className="space-y-4">
                        {[
                            { range: 'High (80-100)', count: roster.filter(s => parseInt(s.score) >= 80).length, color: 'bg-emerald-400' },
                            { range: 'Mid (50-79)', count: roster.filter(s => parseInt(s.score) >= 50 && parseInt(s.score) < 80).length, color: 'bg-amber-400' },
                            { range: 'Low (0-49)', count: roster.filter(s => parseInt(s.score) > 0 && parseInt(s.score) < 50).length, color: 'bg-rose-400' },
                            { range: 'Not Taken', count: roster.filter(s => s.status !== 'Completed').length, color: 'bg-slate-200' }
                        ].map((cluster, i) => (
                            <div key={i} className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-slate-50 shadow-sm">
                                <div className={`w-3 h-3 rounded-full ${cluster.color}`}></div>
                                <div className="flex-1">
                                    <p className="text-[10px] font-black text-slate-800 tracking-tight">{cluster.range}</p>
                                    <p className="text-[9px] font-bold text-slate-400">{cluster.count} Students</p>
                                </div>
                                <div className="text-xs font-black text-slate-300 italic">#{i+1}</div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 pt-8 border-t border-slate-100">
                        <p className="text-[9px] font-bold text-slate-400 leading-relaxed uppercase tracking-tighter">
                            Aptitude clusters are generated based on real-time assessment data and AI-driven skill mapping.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeacherPerformance;
