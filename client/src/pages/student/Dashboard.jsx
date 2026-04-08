import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const { profile } = useOutletContext();
    const navigate = useNavigate();

    const [recommendations, setRecommendations] = useState([]);
    const [momentum, setMomentum] = useState([]);
    const [quizStats, setQuizStats] = useState({ completed: 0, total: 12 });
    const [notifications, setNotifications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;

                // 1. Fetch unread notifications for Alerts
                const notifRes = await fetch('/api/notifications', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (notifRes.ok) {
                    const notifData = await notifRes.json();
                    setNotifications(notifData.notifications?.filter(n => !n.isRead).slice(0, 2) || []);
                }

                // 1. Fetch Quiz Results (for Momentum)
                const resultsRes = await fetch('/api/quiz/results/my', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (resultsRes.ok) {
                    const resultsData = await resultsRes.json();
                    if (resultsData && resultsData.length > 0) {
                        const latest = resultsData[0];

                        // Map top 4 interesting parameters to momentum
                        if (latest.parameterScores) {
                            const sortedScores = Object.entries(latest.parameterScores)
                                .sort(([, a], [, b]) => b - a)
                                .slice(0, 4)
                                .map(([label, value]) => ({
                                    label,
                                    value
                                }));
                            setMomentum(sortedScores);
                        }
                        setQuizStats({
                            completed: Object.keys(latest.parameterScores || {}).length,
                            total: 12
                        });
                    }
                }

                // 2. Fetch Recommendations
                const recsRes = await fetch('/api/recommendations/my', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (recsRes.ok) {
                    const recsData = await recsRes.json();
                    const latestRec = Array.isArray(recsData) ? recsData[0] : recsData;

                    if (latestRec && latestRec.careers) {
                        const newRecs = latestRec.careers.map((title, idx) => ({
                            id: idx,
                            title: title,
                            match: idx === 0 ? '98%' : (idx === 1 ? '92%' : '85%'),
                            desc: `Based on your interest in ${latestRec.topParameters?.join(", ")}.`,
                            icon: idx === 0 ? 'rocket_launch' : (idx === 1 ? 'terminal' : 'palette'),
                            color: idx === 0 ? 'bg-indigo-50' : (idx === 1 ? 'bg-violet-50' : 'bg-emerald-50'),
                            text: idx === 0 ? 'text-indigo-600' : (idx === 1 ? 'text-violet-600' : 'text-emerald-600')
                        }));
                        setRecommendations(newRecs);
                    }
                }
            } catch (err) {
                console.error('Data synchronization failed:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
            {/* Priority Alerts */}
            {notifications.length > 0 && (
                <section className="animate-bounce-subtle">
                    <div className="bg-amber-50 border border-amber-100 p-6 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-amber-500/5">
                        <div className="flex items-center gap-4 text-center md:text-left">
                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-amber-500 shadow-sm border border-amber-50 shrink-0">
                                <span className="material-symbols-outlined text-2xl font-bold">campaign</span>
                            </div>
                            <div>
                                <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest leading-none mb-1 italic">Mentorship Alert</h4>
                                <p className="text-xs font-bold text-slate-500 leading-tight">
                                    {notifications[0].message}
                                </p>
                            </div>
                        </div>
                        <button 
                            onClick={() => navigate(notifications[0].link || '/student/quiz')}
                            className="px-8 py-3 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:scale-105 transition-all whitespace-nowrap"
                        >
                            Attempt Now
                        </button>
                    </div>
                </section>
            )}

            {/* Welcome Section */}
            <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="md:col-span-2 bg-gradient-to-br from-indigo-600 to-violet-700 p-10 rounded-[3rem] text-white shadow-xl shadow-indigo-500/20 relative overflow-hidden group">
                    <div className="relative z-10">
                        <h3 className="text-3xl font-black mb-2 font-headline">Welcome, {user?.name?.split(' ')[0]}!</h3>
                        <p className="opacity-80 font-bold text-sm mb-8 leading-relaxed">Your professional parameters are being analyzed using Gemini AI. Take a quiz to refine your career roadmap.</p>
                        <button onClick={() => navigate('/student/quiz')} className="px-8 py-3.5 bg-white text-indigo-700 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:scale-105 transition-all shadow-lg shadow-black/10">
                            {quizStats.completed > 0 ? 'Update Assessment' : 'Begin Assessment'}
                        </button>
                    </div>
                    <span className="material-symbols-outlined absolute -bottom-10 -right-10 text-white/10 text-[15rem] rotate-12 group-hover:rotate-0 transition-transform duration-700">neurology</span>
                </div>

                <div className="bg-white p-8 rounded-[3rem] border border-slate-100 flex flex-col justify-center shadow-sm">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                        Live Sync Stats
                    </h4>
                    <div className="space-y-6">
                        <div>
                            <p className="text-4xl font-black text-indigo-600">{quizStats.completed}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Interests</p>
                        </div>
                        <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                            <div className="h-full bg-indigo-500" style={{ width: `${(quizStats.completed / 12) * 100}%` }}></div>
                        </div>
                    </div>
                </div>

                <div className="bg-indigo-50/50 p-8 rounded-[3rem] border border-indigo-100 flex flex-col justify-center">
                    <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-6">AI Confidence</h4>
                    <p className="text-5xl font-black text-indigo-600 mb-2 tracking-tight">96<span className="text-xl">%</span></p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Model Precision</p>
                </div>
            </section>

            <section className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-8">
                {/* Recommendations */}
                <div className="space-y-8">
                    <div className="flex items-center justify-between px-2">
                        <h3 className="text-2xl font-black font-headline">AI Suggested Careers</h3>
                        <button onClick={() => navigate('/student/recommendations')} className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline transition-all">View Full Roadmap</button>
                    </div>
                    {recommendations.length > 0 ? (
                        <div className="grid grid-cols-1 gap-6">
                            {recommendations.map(job => (
                                <div key={job.id} onClick={() => navigate('/student/recommendations')} className="bg-white p-8 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all group border border-slate-50 cursor-pointer">
                                    <div className="flex flex-col md:flex-row gap-6 items-center">
                                        <div className={`w-16 h-16 rounded-[1.5rem] ${job.color} flex-shrink-0 flex items-center justify-center border border-slate-100 group-hover:rotate-6 transition-transform`}>
                                            <span className={`material-symbols-outlined ${job.text} text-3xl`}>{job.icon}</span>
                                        </div>
                                        <div className="flex-grow text-center md:text-left">
                                            <div className="flex justify-between items-center mb-1">
                                                <h4 className="text-lg font-black text-on-surface font-headline">{job.title}</h4>
                                                <span className="text-indigo-600 font-black text-xl">{job.match}</span>
                                            </div>
                                            <p className="text-slate-400 text-xs font-bold leading-relaxed">{job.desc}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-slate-50 p-12 rounded-[2.5rem] border border-dashed border-slate-200 text-center">
                            <span className="material-symbols-outlined text-slate-300 text-5xl mb-4">analytics</span>
                            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">No matches generated yet. Take the quiz.</p>
                        </div>
                    )}
                </div>

                {/* Momentum */}
                <div className="space-y-8">
                    <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
                        <h3 className="text-lg font-black mb-10 font-headline">Aptitude Momentum</h3>
                        {momentum.length > 0 ? (
                            <div className="space-y-10">
                                {momentum.map(stat => (
                                    <div key={stat.label}>
                                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-3">
                                            <span className="text-slate-400">{stat.label}</span>
                                            <span className="text-indigo-600">{stat.value}%</span>
                                        </div>
                                        <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                                            <div
                                                className="h-full bg-indigo-500 rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(79,70,229,0.3)]"
                                                style={{ width: `${stat.value}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-10">
                                <p className="text-slate-300 text-[10px] font-black uppercase tracking-widest">Awaiting assessment data</p>
                            </div>
                        )}
                        <div className="mt-12 p-6 bg-indigo-500 rounded-[2rem] text-white flex items-center justify-between">
                            <div>
                                <p className="text-[10px] font-black opacity-60 uppercase tracking-widest mb-1">Weekly Growth</p>
                                <p className="text-2xl font-black">+14%</p>
                            </div>
                            <span className="material-symbols-outlined text-3xl font-variation-fill">bolt</span>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Dashboard;
