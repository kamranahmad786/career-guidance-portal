import React, { useState, useEffect, useContext } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import BrandLogo from '../components/common/BrandLogo';
import Loader from '../components/common/Loader';
import NotificationHub from '../components/common/NotificationHub';

const StudentLayout = () => {
    const { user, logout } = useContext(AuthContext);
    const location = useLocation();
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/student/profile', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setProfile(data);
            }
        } catch (err) {
            console.error('Failed to load student profile:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    if (loading) return <Loader />;

    const navItems = [
        { id: 'Dashboard', icon: 'dashboard', path: '/student/dashboard' },
        { id: 'My Profile', icon: 'person', path: '/student/profile' },
        { id: 'Take Quiz', icon: 'quiz', path: '/student/quiz' },
        { id: 'Quiz Results', icon: 'bar_chart', path: '/student/results' },
        { id: 'Performance Tracking', icon: 'monitoring', path: '/student/performance' },
        { id: 'Official Reports', icon: 'article', path: '/student/reports' },
        { id: 'Notifications', icon: 'notifications', path: '/student/notifications' },
        { id: 'Recommendations', icon: 'auto_awesome', path: '/student/recommendations' },
        { id: 'Activities & Games', icon: 'sports_esports', path: '/student/activities' },
        { id: 'Knowledge Hub', icon: 'school', path: '/library' }
    ];

    const studentName = user?.name || "Academic User";
    const studentInfo = profile?.className ? `${profile.className} • ${profile.board || 'NEP 2020'}` : "NEP 2020 Learner";

    return (
        <div className="bg-[#f4f7f9] text-slate-800 font-body min-h-screen">
            {/* Sidebar */}
            <aside className="fixed left-0 top-0 h-full w-72 flex flex-col bg-white z-50 hidden md:flex border-r border-slate-100 overflow-y-auto shadow-sm">
                <div
                    style={{ height: '80px' }}
                    className="w-full flex items-center gap-4 px-8 cursor-pointer bg-primary/5 hover:bg-primary/10 transition-all border-b border-slate-100 flex-shrink-0"
                    onClick={() => navigate('/')}
                >
                    <BrandLogo className="w-9 h-9 flex-shrink-0 shadow-lg shadow-primary/20 rounded-xl" />
                    <div className="flex flex-col justify-center">
                        <h1 className="text-xl font-black text-primary tracking-tight leading-none mb-1">EduDisha</h1>
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none">AI Career Guide</p>
                    </div>
                </div>

                <div className="px-6 py-8 flex-1">
                    <nav className="space-y-1.5">
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest px-4 mb-4">Navigation</p>
                        {navItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <Link 
                                    key={item.id} 
                                    to={item.path}
                                    className={`w-full flex items-center justify-between px-4 py-3.5 transition-all rounded-xl group/item ${isActive ? 'text-primary font-black border-r-4 border-primary bg-primary/5' : 'text-slate-500 hover:text-primary hover:bg-slate-100'}`}
                                >
                                    <div className="flex items-center gap-4">
                                        <span className={`material-symbols-outlined text-[22px] transition-transform group-hover/item:scale-110 ${isActive ? 'text-primary' : 'text-slate-300 group-hover/item:text-primary'}`}>{item.icon}</span>
                                        <span className="text-sm font-bold uppercase tracking-wider">{item.id}</span>
                                    </div>
                                </Link>
                            );
                        })}

                        <div className="pt-10 space-y-1.5 border-t border-slate-50 mt-8">
                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest px-4 mb-4">System</p>
                            <Link to="/student/settings" className="w-full flex items-center gap-4 px-4 py-3.5 text-slate-500 hover:text-primary hover:bg-slate-100 transition-all rounded-xl">
                                <span className="material-symbols-outlined text-[22px]">settings</span>
                                <span className="text-sm font-bold uppercase tracking-wider">Settings</span>
                            </Link>
                            <button 
                                onClick={() => { localStorage.removeItem('token'); logout(); navigate('/login'); }}
                                className="w-full flex items-center gap-4 px-4 py-3.5 text-error-dim hover:bg-error-container/10 transition-all rounded-xl"
                            >
                                <span className="material-symbols-outlined text-[22px]">logout</span>
                                <span className="text-sm font-bold uppercase tracking-wider">Logout</span>
                            </button>
                        </div>
                    </nav>
                </div>

                {/* Profile Card */}
                <div className="mt-auto p-6 bg-slate-50 border-t border-slate-100">
                    <div className="flex items-center gap-3 bg-white p-3 rounded-2xl shadow-sm border border-slate-100 cursor-pointer hover:bg-slate-50 transition-all" onClick={() => navigate('/student/profile')}>
                        <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center font-black text-xs shadow-lg shadow-primary/20">
                            {user?.name?.charAt(0) || 'U'}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-xs font-bold text-slate-800 truncate">{studentName}</p>
                            <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest truncate">{studentInfo}</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="md:ml-72 min-h-screen">
                <header 
                    style={{ height: '80px' }}
                    className="fixed top-0 left-72 right-0 bg-white/80 backdrop-blur-md z-40 flex justify-between items-center px-8 border-b border-slate-100 shadow-sm"
                >
                    <div className="flex items-center gap-4">
                        <h2 className="text-lg font-black text-slate-800 tracking-tight leading-none italic">
                            Student {location.pathname.split('/').pop().charAt(0).toUpperCase() + location.pathname.split('/').pop().slice(1)}
                        </h2>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="flex flex-col justify-center text-right hidden sm:flex">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Authenticated Learner</p>
                            <div className="flex items-center gap-2 justify-end">
                                <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse"></span>
                                <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest italic">Live Sync Active</span>
                            </div>
                        </div>
                        <NotificationHub />
                    </div>
                </header>

                <div className="pt-[80px]">
                    <div className="p-8 pb-32">
                        <Outlet context={{ profile, fetchProfile }} />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default StudentLayout;
