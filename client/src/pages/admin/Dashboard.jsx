import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Loader from '../../components/common/Loader';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [analytics, setAnalytics] = useState(null);
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [statsRes, analyticsRes, alertsRes] = await Promise.all([
                    axios.get('/api/admin/stats', { headers }),
                    axios.get('/api/admin/analytics', { headers }),
                    axios.get('/api/admin/alerts', { headers })
                ]);
                setStats(statsRes.data);
                setAnalytics(analyticsRes.data);
                setAlerts(alertsRes.data);
            } catch (err) {
                console.error("Dashboard fetch error:", err);
                setError("Failed to load dashboard. Check console for details.");
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, []);

    if (loading) return <Loader />;
    if (error) return <div className="p-8 text-red-600 font-bold">{error}</div>;

    // Time-ago helper
    const timeAgo = (date) => {
        const seconds = Math.floor((new Date() - new Date(date)) / 1000);
        if (seconds < 60) return `${seconds}s ago`;
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;
        const days = Math.floor(hours / 24);
        return `${days}d ago`;
    };

    const statCards = [
        { label: 'Total Students', value: stats?.totalStudents ?? 0, icon: 'school', bg: 'bg-blue-50', text: 'text-blue-600', trend: `+${stats?.growthPercent ?? 0}%` },
        { label: 'Total Parents', value: stats?.totalParents ?? 0, icon: 'family_restroom', bg: 'bg-indigo-50', text: 'text-indigo-600', trend: `${stats?.totalParents ?? 0}` },
        { label: 'Total Teachers', value: stats?.totalTeachers ?? 0, icon: 'co_present', bg: 'bg-violet-50', text: 'text-violet-600', trend: `${stats?.totalTeachers ?? 0}` },
        { label: 'Active Learners', value: `${stats?.activePercentage ?? 0}%`, icon: 'bolt', bg: 'bg-emerald-50', text: 'text-emerald-600', trend: `${stats?.activeStudents ?? 0} active` },
    ];

    // Compute max for chart scaling
    const growthData = analytics?.growth || [];
    const maxGrowth = Math.max(...growthData.map(g => g.count), 1);

    // Compute interest percentages
    const interests = analytics?.interests || [];
    const totalInterestCount = interests.reduce((sum, i) => sum + i.count, 0) || 1;
    const interestColors = ['bg-blue-600', 'bg-indigo-400', 'bg-violet-300', 'bg-sky-300', 'bg-slate-200', 'bg-gray-100'];

    // NEP stats from real data
    const quizCompletionRate = stats?.totalResults > 0 && stats?.totalStudents > 0
        ? Math.round((stats.totalResults / stats.totalStudents) * 100)
        : 0;

    const alertIcons = {
        registration: 'person_add',
        quiz: 'quiz',
        notification: 'notifications'
    };
    const alertColors = {
        registration: 'text-blue-600 bg-blue-50',
        quiz: 'text-emerald-600 bg-emerald-50',
        notification: 'text-amber-600 bg-amber-50'
    };

    return (
        <div className="space-y-10">
            {/* Page Hero */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h2 className="text-4xl font-headline font-black tracking-tight text-slate-800">Overview</h2>
                    <p className="text-slate-500 font-medium text-lg mt-1">Real-time system status from your database.</p>
                </div>
                <div className="flex items-center gap-3 text-xs font-bold text-slate-400 uppercase tracking-widest">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    Live Data
                </div>
            </div>

            {/* 1. STATS CARDS — all real */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((card) => (
                    <div key={card.label} className="bg-white p-7 rounded-3xl shadow-sm border border-slate-100 hover:shadow-lg hover:-translate-y-0.5 transition-all">
                        <div className="flex justify-between items-start mb-5">
                            <div className={`p-3.5 rounded-2xl ${card.bg} ${card.text}`}>
                                <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>{card.icon}</span>
                            </div>
                            <span className="text-[10px] font-black px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full uppercase tracking-widest">
                                {card.trend}
                            </span>
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{card.label}</p>
                        <p className="text-4xl font-black text-slate-800 tracking-tighter">{card.value}</p>
                    </div>
                ))}
            </div>

            {/* 2. CHARTS — real data */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* User Growth Area Chart */}
                <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-xl font-black text-slate-800">User Growth</h3>
                            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1 italic">Platform Registration Trends</p>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                            {stats?.totalStudents + stats?.totalParents + stats?.totalTeachers} total users
                        </div>
                    </div>
                    
                    <div className="flex-1 bg-slate-50/50 rounded-3xl p-6 border border-slate-100 relative overflow-hidden flex flex-col items-center justify-center">
                        {growthData.length > 0 ? (() => {
                            const h = 200;
                            const w = 600;
                            const max = Math.max(...growthData.map(g => g.count), 4);
                            const points = growthData.map((g, i) => {
                                const x = (i / (growthData.length - 1)) * w;
                                const y = h - (g.count / max) * (h - 40) - 20;
                                return `${x},${y}`;
                            }).join(' ');
                            
                            const areaPoints = `0,${h} ${points} ${w},${h}`;
                            
                            return (
                                <>
                                    <div className="absolute inset-0 bg-gradient-to-t from-blue-500/5 to-transparent pointer-events-none"></div>
                                    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-full drop-shadow-2xl flex-1 px-4 overflow-visible">
                                        <defs>
                                            <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
                                                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                                            </linearGradient>
                                        </defs>
                                        
                                        {/* Area Fill */}
                                        <polygon points={areaPoints} fill="url(#areaGradient)" />
                                        
                                        {/* Line */}
                                        <polyline
                                            points={points}
                                            fill="none"
                                            stroke="#3b82f6"
                                            strokeWidth="4"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                        
                                        {/* Points */}
                                        {growthData.map((g, i) => {
                                            const x = (i / (growthData.length - 1)) * w;
                                            const y = h - (g.count / max) * (h - 40) - 20;
                                            return (
                                                <g key={i} className="group/dot cursor-pointer">
                                                    <circle cx={x} cy={y} r="6" fill="#3b82f6" className="animate-in fade-in zoom-in duration-500 drop-shadow-md" />
                                                    <circle cx={x} cy={y} r="12" fill="white" className="opacity-0 group-hover/dot:opacity-20 transition-opacity" />
                                                    
                                                    {/* Tooltip on dot */}
                                                    <text x={x} y={y - 15} textAnchor="middle" className="text-[10px] font-black fill-slate-800 opacity-0 group-hover/dot:opacity-100 transition-opacity">
                                                        {g.count}
                                                    </text>
                                                </g>
                                            );
                                        })}
                                    </svg>
                                    
                                    <div className="w-full flex justify-between mt-4 px-2">
                                        {growthData.map((g, i) => (
                                            <span key={i} className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{g.label}</span>
                                        ))}
                                    </div>
                                </>
                            );
                        })() : (
                            <div className="flex flex-col items-center justify-center py-20 opacity-40">
                                <span className="material-symbols-outlined text-4xl mb-2">query_stats</span>
                                <p className="text-sm font-black uppercase tracking-widest">Awaiting Registration Data</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Career Interests — real from Recommendations */}
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col">
                    <h3 className="text-xl font-black text-slate-800 mb-1">Career Interests</h3>
                    <p className="text-sm text-slate-500 mb-6">From student aptitude assessments</p>

                    {interests.length > 0 ? (
                        <>
                            <div className="relative w-44 h-44 mx-auto flex items-center justify-center mb-6">
                                <svg className="w-full h-full transform -rotate-90">
                                    <circle className="text-slate-100" cx="88" cy="88" fill="transparent" r="70" stroke="currentColor" strokeWidth="20"></circle>
                                    {interests.slice(0, 3).map((interest, idx) => {
                                        const circumference = 2 * Math.PI * 70;
                                        const pct = interest.count / totalInterestCount;
                                        const offset = circumference * (1 - pct);
                                        const colors = ['text-blue-600', 'text-indigo-400', 'text-violet-300'];
                                        return (
                                            <circle
                                                key={idx}
                                                className={`${colors[idx]} transition-all duration-1000`}
                                                cx="88" cy="88" fill="transparent" r="70"
                                                stroke="currentColor"
                                                strokeDasharray={circumference}
                                                strokeDashoffset={offset}
                                                strokeWidth="20"
                                                strokeLinecap="round"
                                            />
                                        );
                                    })}
                                </svg>
                                <div className="absolute flex flex-col items-center">
                                    <span className="text-2xl font-black text-slate-800">{interests[0]?._id || '—'}</span>
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Top</span>
                                </div>
                            </div>

                            <div className="space-y-3 mt-auto">
                                {interests.slice(0, 5).map((interest, idx) => {
                                    const pct = Math.round((interest.count / totalInterestCount) * 100);
                                    return (
                                        <div key={interest._id} className="flex items-center justify-between text-xs">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-3 h-3 rounded-full ${interestColors[idx] || 'bg-slate-200'}`}></div>
                                                <span className="font-bold text-slate-600">{interest._id}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                    <div className={`h-full ${interestColors[idx] || 'bg-slate-300'} rounded-full`} style={{ width: `${pct}%` }}></div>
                                                </div>
                                                <span className="font-black text-slate-800 w-8 text-right">{pct}%</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-slate-300 py-10">
                            <span className="material-symbols-outlined text-5xl mb-3">psychology</span>
                            <p className="text-sm font-bold">No assessment data yet</p>
                            <p className="text-xs text-slate-400 mt-1">Data will appear when students complete quizzes</p>
                        </div>
                    )}
                </div>
            </div>

            {/* 3. AI System + NEP Compliance — real stats */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* AI System Status */}
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                    <h3 className="text-xl font-black text-slate-800 mb-6">AI System Status</h3>
                    <div className="space-y-4">
                        {[
                            { name: 'Recommendation Engine', icon: 'auto_awesome', count: analytics?.interests?.length || 0, desc: `${analytics?.interests?.length || 0} career paths generated` },
                            { name: 'Quiz Generator', icon: 'quiz', count: stats?.totalQuizzes || 0, desc: `${stats?.totalQuizzes || 0} quizzes created` },
                            { name: 'AI Chatbot', icon: 'forum', count: stats?.totalStudents || 0, desc: `Serving ${stats?.totalStudents || 0} students` }
                        ].map(system => (
                            <div key={system.name} className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-blue-200 transition-all">
                                <div className="flex items-center gap-4">
                                    <div className="w-11 h-11 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-blue-600 shadow-sm">
                                        <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>{system.icon}</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-800">{system.name}</p>
                                        <p className="text-[10px] font-bold text-slate-400">{system.desc}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                    <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Online</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* NEP Compliance — real computed stats */}
                <div className="bg-slate-900 p-8 rounded-3xl text-white shadow-2xl relative overflow-hidden">
                    <div className="absolute -right-20 -top-20 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px]"></div>
                    <div className="relative z-10 flex flex-col h-full">
                        <div className="flex items-center gap-2 mb-8 opacity-60">
                            <span className="material-symbols-outlined text-sm">verified</span>
                            <p className="text-[10px] font-black uppercase tracking-[0.3em]">NEP 2020 Alignment</p>
                        </div>
                        <h3 className="text-2xl font-black mb-8 leading-none tracking-tight">Platform Engagement Metrics</h3>
                        <div className="grid grid-cols-2 gap-8 flex-1">
                            <div>
                                <p className="text-5xl font-black text-blue-400 tracking-tighter">{stats?.activePercentage ?? 0}%</p>
                                <p className="text-xs font-bold text-slate-400 mt-2 uppercase tracking-widest">Active Participation Rate</p>
                            </div>
                            <div>
                                <p className="text-5xl font-black text-emerald-400 tracking-tighter">{quizCompletionRate}%</p>
                                <p className="text-xs font-bold text-slate-400 mt-2 uppercase tracking-widest">Assessment Engagement</p>
                            </div>
                        </div>
                        <div className="mt-8 p-5 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md">
                            <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest mb-3">
                                <span>Skill Assessment Coverage</span>
                                <span className="text-blue-400">{stats?.totalResults || 0} submissions</span>
                            </div>
                            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-blue-500 rounded-full transition-all duration-1000"
                                    style={{ width: `${Math.min(quizCompletionRate, 100)}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 4. Recent Alerts — real from DB */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-black text-slate-800">Recent Activity</h3>
                    <span className="text-xs font-bold text-slate-400">{alerts.length} events</span>
                </div>
                {alerts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {alerts.map((alert, i) => (
                            <div key={i} className="flex gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-white hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer">
                                <div className={`w-10 h-10 rounded-xl ${alertColors[alert.type] || 'bg-slate-100 text-slate-500'} flex items-center justify-center shrink-0`}>
                                    <span className="material-symbols-outlined text-lg">{alert.icon || alertIcons[alert.type] || 'info'}</span>
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm font-bold text-slate-800 leading-tight truncate">{alert.title}</p>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{timeAgo(alert.time)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 text-slate-300">
                        <span className="material-symbols-outlined text-4xl mb-2">inbox</span>
                        <p className="font-bold text-sm">No recent activity</p>
                    </div>
                )}
            </div>

            {/* 5. Recent Users Table */}
            {analytics?.recentUsers?.length > 0 && (
                <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="p-8 border-b border-slate-100 flex justify-between items-center">
                        <h3 className="text-xl font-black text-slate-800">Latest Registrations</h3>
                        <a href="/admin/users" className="text-blue-600 text-sm font-bold flex items-center gap-1 hover:underline">
                            View All <span className="material-symbols-outlined text-sm">arrow_forward</span>
                        </a>
                    </div>
                    <table className="w-full text-left">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Name</th>
                                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Email</th>
                                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Role</th>
                                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Joined</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {analytics.recentUsers.map(user => (
                                <tr key={user._id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-8 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-black text-xs">
                                                {user.name?.split(' ').map(n => n[0]).join('').toUpperCase()}
                                            </div>
                                            <span className="text-sm font-bold text-slate-800">{user.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-4 text-sm text-slate-500">{user.email}</td>
                                    <td className="px-8 py-4">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                            user.role === 'Student' ? 'bg-blue-50 text-blue-600' :
                                            user.role === 'Teacher' ? 'bg-violet-50 text-violet-600' :
                                            user.role === 'Parent' ? 'bg-indigo-50 text-indigo-600' :
                                            'bg-slate-900 text-white'
                                        }`}>{user.role}</span>
                                    </td>
                                    <td className="px-8 py-4 text-sm text-slate-400">{timeAgo(user.createdAt)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
