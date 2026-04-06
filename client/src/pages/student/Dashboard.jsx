import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const [recommendations, setRecommendations] = useState([]);
    const [momentum, setMomentum] = useState([]);
    const [profile, setProfile] = useState(null);
    const [quizStats, setQuizStats] = useState({ completed: 0, total: 12 });
    const [isLoading, setIsLoading] = useState(true);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [showNotifications, setShowNotifications] = useState(false);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;

                // 1. Fetch Student Profile
                const profileRes = await fetch('/api/student/profile', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (profileRes.ok) {
                    const profileData = await profileRes.json();
                    setProfile(profileData);
                }

                // 2. Fetch Quiz Results (for Momentum)
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

                // 3. Fetch Recommendations
                const recsRes = await fetch('/api/recommendations/my', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (recsRes.ok) {
                    const recsData = await recsRes.json();
                    // In our new backend, this is a single object, not an array of objects
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

                // 4. Fetch Notifications
                const notifRes = await fetch('/api/notifications', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (notifRes.ok) {
                    const notifData = await notifRes.json();
                    setNotifications(notifData.notifications);
                    setUnreadCount(notifData.unreadCount);
                }
            } catch (err) {
                console.error('Data synchronization failed:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();

        // 5. Polling for notifications every 60s
        const interval = setInterval(() => {
            const token = localStorage.getItem('token');
            if (token) {
                fetch('/api/notifications', {
                    headers: { 'Authorization': `Bearer ${token}` }
                })
                .then(res => res.json())
                .then(data => {
                    setNotifications(data.notifications);
                    setUnreadCount(data.unreadCount);
                });
            }
        }, 60000);

        return () => clearInterval(interval);
    }, []);

    const markNotificationRead = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`/api/notifications/${id}/read`, {
                method: 'PATCH',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                setNotifications(notifications.map(n => n._id === id ? { ...n, isRead: true } : n));
                setUnreadCount(prev => Math.max(0, prev - 1));
            }
        } catch (err) {
            console.error('Failed to mark notification as read:', err);
        }
    };

    return (
        <div className="flex min-h-screen bg-surface font-body pt-0">
            {/* Side Navigation Bar */}
            <aside className="fixed left-0 top-0 h-full w-72 flex flex-col bg-white z-50 hidden lg:flex border-r border-slate-100 overflow-y-auto">
                {/* Brand Section - Flush to Top-Left, Exact Vertical Match with Header */}
                <div
                    className="w-full h-20 flex items-center gap-4 px-8 cursor-pointer bg-primary/5 hover:bg-primary/10 transition-all border-b border-slate-100"
                    onClick={() => navigate('/')}
                >
                    <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 flex-shrink-0">
                        <span className="material-symbols-outlined text-white text-xl">hub</span>
                    </div>
                    <div className="flex flex-col justify-center">
                        <h1 className="text-xl font-black text-primary tracking-tight font-headline leading-none mb-1">EduDisha</h1>
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none">AI Career Guide</p>
                    </div>
                </div>

                <div className="px-6 py-8 flex-1">
                    <nav className="space-y-1.5">
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest px-4 mb-4">Navigation</p>
                        <button onClick={() => navigate('/student/dashboard')} className="w-full flex items-center gap-4 px-4 py-3.5 text-primary font-black border-r-4 border-primary bg-primary/5 transition-all rounded-l-xl">
                            <span className="material-symbols-outlined text-[22px]">dashboard</span>
                            <span className="text-sm">Dashboard</span>
                        </button>
                        <button onClick={() => navigate('/student/profile')} className="w-full flex items-center gap-4 px-4 py-3.5 text-slate-500 hover:text-primary hover:bg-slate-100 transition-all rounded-xl">
                            <span className="material-symbols-outlined text-[22px]">person</span>
                            <span className="text-sm font-bold">My Profile</span>
                        </button>
                        <button onClick={() => navigate('/student/quiz')} className="w-full flex items-center gap-4 px-4 py-3.5 text-slate-500 hover:text-primary hover:bg-slate-100 transition-all rounded-xl">
                            <span className="material-symbols-outlined text-[22px]">quiz</span>
                            <span className="text-sm font-bold">Take Quiz</span>
                        </button>
                        <button onClick={() => navigate('/student/results')} className="w-full flex items-center gap-4 px-4 py-3.5 text-slate-500 hover:text-primary hover:bg-slate-100 transition-all rounded-xl">
                            <span className="material-symbols-outlined text-[22px]">bar_chart</span>
                            <span className="text-sm font-bold">Quiz Results</span>
                        </button>
                        <button onClick={() => navigate('/student/recommendations')} className="w-full flex items-center gap-4 px-4 py-3.5 text-slate-500 hover:text-primary hover:bg-slate-100 transition-all rounded-xl">
                            <span className="material-symbols-outlined text-[22px]">auto_awesome</span>
                            <span className="text-sm font-bold">Recommendations</span>
                        </button>
                        <button onClick={() => navigate('/library')} className="w-full flex items-center gap-4 px-4 py-3.5 text-slate-500 hover:text-primary hover:bg-slate-100 transition-all rounded-xl">
                            <span className="material-symbols-outlined text-[22px]">school</span>
                            <span className="text-sm font-bold">Knowledge Hub</span>
                        </button>

                        <div className="pt-10 space-y-1.5 border-t border-slate-50 mt-8">
                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest px-4 mb-4">Account</p>
                            <button onClick={() => navigate('/')} className="w-full flex items-center gap-4 px-4 py-3.5 text-slate-500 hover:text-primary hover:bg-slate-100 transition-all rounded-xl">
                                <span className="material-symbols-outlined text-[22px]">home</span>
                                <span className="text-sm font-bold">Main Website</span>
                            </button>
                            <button onClick={() => navigate('/student/settings')} className="w-full flex items-center gap-4 px-4 py-3.5 text-slate-500 hover:text-primary hover:bg-slate-100 transition-all rounded-xl">
                                <span className="material-symbols-outlined text-[22px]">settings</span>
                                <span className="text-sm font-bold">Settings</span>
                            </button>
                            <button onClick={logout} className="w-full flex items-center gap-4 px-4 py-3.5 text-error-dim hover:bg-error-container/10 transition-all rounded-xl">
                                <span className="material-symbols-outlined text-[22px]">logout</span>
                                <span className="text-sm font-bold">Logout</span>
                            </button>
                        </div>
                    </nav>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 lg:ml-72 min-h-screen pb-12 relative">
                <header className="w-full h-20 sticky top-0 z-40 bg-white/80 backdrop-blur-md flex justify-between items-center px-8 border-b border-slate-100 shadow-sm shadow-slate-200/50">
                    <div className="flex items-center gap-4">
                        <span className="lg:hidden material-symbols-outlined text-slate-600">menu</span>
                        {/* <div className="flex items-center gap-2">
                             <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest hidden sm:block">Portal</span>
                             <span className="text-slate-200 hidden sm:block">/</span>
                             <h2 className="text-sm font-black text-on-surface tracking-tight">Dashboard Overview</h2>
                        </div> */}
                    </div>
                    <div className="flex items-center gap-5">
                        {/* Notification Bell */}
                        <div className="relative group">
                            <button 
                                onClick={() => setShowNotifications(!showNotifications)}
                                className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center border border-slate-100 hover:bg-indigo-50 hover:text-indigo-600 transition-all relative"
                            >
                                <span className="material-symbols-outlined text-[22px]">notifications</span>
                                {unreadCount > 0 && (
                                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-error text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white animate-bounce">
                                        {unreadCount}
                                    </span>
                                )}
                            </button>

                            {/* Dropdown UI */}
                            {showNotifications && (
                                <div className="absolute right-0 mt-4 w-80 bg-white rounded-[2rem] shadow-2xl border border-slate-100 z-[60] overflow-hidden">
                                    <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Notifications</p>
                                        {unreadCount > 0 && <span className="text-[9px] font-black bg-indigo-500 text-white px-2 py-0.5 rounded-full">{unreadCount} New</span>}
                                    </div>
                                    <div className="max-h-96 overflow-y-auto">
                                        {notifications.length > 0 ? (
                                            notifications.map(n => (
                                                <div 
                                                    key={n._id} 
                                                    onClick={() => {
                                                        markNotificationRead(n._id);
                                                        if (n.link) navigate(n.link);
                                                        setShowNotifications(false);
                                                    }}
                                                    className={`p-5 border-b border-slate-50 flex gap-4 cursor-pointer hover:bg-indigo-50/30 transition-all group ${!n.isRead ? 'bg-indigo-50/10' : ''}`}
                                                >
                                                    <div className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center ${!n.isRead ? 'bg-indigo-500 text-white' : 'bg-slate-50 text-slate-300'}`}>
                                                        <span className="material-symbols-outlined text-lg">
                                                            {n.type === 'quiz_complete' ? 'verified' : 'info'}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <p className={`text-xs font-black ${!n.isRead ? 'text-on-surface' : 'text-slate-400'}`}>{n.title}</p>
                                                        <p className="text-[10px] text-slate-400 mt-1 font-medium leading-relaxed">{n.message}</p>
                                                        <p className="text-[9px] text-indigo-400 mt-2 font-black uppercase tracking-widest">{new Date(n.createdAt).toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="p-10 text-center">
                                                <span className="material-symbols-outlined text-slate-200 text-4xl mb-2">notifications_off</span>
                                                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">No alerts yet</p>
                                            </div>
                                        )}
                                    </div>
                                    <div 
                                        className="p-4 text-center bg-slate-50 hover:bg-indigo-50 cursor-pointer transition-all"
                                        onClick={() => setShowNotifications(false)}
                                    >
                                        <p className="text-[9px] font-black text-indigo-600 uppercase tracking-widest">Close Panel</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="text-right hidden sm:flex flex-col justify-center">
                            <p className="text-sm font-black text-on-surface leading-none mb-1">{user?.name || 'Academic User'}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none">
                                {profile?.className || 'Grade'} {profile?.board ? ` • ${profile?.board}` : ''}
                            </p>
                        </div>
                        <div onClick={() => navigate('/student/profile')} className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-black border-2 border-primary/5 cursor-pointer hover:scale-105 transition-all">
                            {user?.name?.charAt(0) || 'U'}
                        </div>
                    </div>
                </header>

                <div className="p-8 max-w-7xl mx-auto space-y-12">
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
            </main>
        </div>
    );
};

export default Dashboard;
