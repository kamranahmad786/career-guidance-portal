import React, { useState, useEffect, useContext } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import ProfileSettings from '../components/common/ProfileSettings';
import Loader from '../components/common/Loader';

const ParentLayout = () => {
    const { user, logout } = useContext(AuthContext);
    const location = useLocation();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    const fetchDashboard = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const res = await fetch('/api/parent/dashboard', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const result = await res.json();
            setData(result);
        } catch (err) {
            console.error('Failed to load layout data:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboard();
    }, []);

    const toggleNotifications = async (val) => {
        try {
            const token = localStorage.getItem('token');
            await fetch('/api/parent/notifications', {
                method: 'PATCH',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ notifyOnQuiz: val })
            });
            setData(prev => ({
                ...prev,
                parentProfile: { ...prev.parentProfile, notifyOnQuiz: val }
            }));
        } catch (err) {
            console.error(err);
        }
    };

    const getInitials = (name) => {
        if (!name) return "U";
        return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    };

    if (loading) return <Loader />;

    const childName = data?.childProfile?.name || "Child Not Linked";
    const parentName = user?.name || "Parent Name";
    const unreadNotifications = data?.notifications?.filter(n => !n.isRead).length || 0;

    const navItems = [
        { id: 'Dashboard', icon: 'dashboard', path: '/parent/dashboard' },
        { id: 'Child Profile', icon: 'person_search', path: '/parent/profile' },
        { id: 'Quiz Results', icon: 'quiz', path: '/parent/results' },
        { id: 'Career Maps', icon: 'auto_awesome', path: '/parent/careers' },
        { id: 'Insights', icon: 'insights', path: '/parent/progress' },
        { id: 'Activities', icon: 'local_activity', path: '/parent/activities' },
        { id: 'Notifications', icon: 'notifications', path: '/parent/notifications', badge: unreadNotifications }
    ];

    return (
        <div className="bg-surface-container-low text-on-surface font-body min-h-screen">
            {/* SideNavBar (Authority: 100% Routed Persistence) */}
            <aside className="fixed left-0 top-0 h-full w-72 flex flex-col bg-white z-50 hidden md:flex border-r border-slate-100 overflow-y-auto">
                {/* Brand Section - Absolute 80px Sync */}
                <div
                    style={{ height: '80px' }}
                    className="w-full flex items-center gap-4 px-8 cursor-pointer bg-[#f8faff] hover:bg-primary/5 transition-all border-b border-slate-100 flex-shrink-0"
                    onClick={() => navigate('/')}
                >
                    <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 flex-shrink-0">
                        <span className="material-symbols-outlined text-white text-xl">hub</span>
                    </div>
                    <div className="flex flex-col justify-center">
                        <h1 className="text-xl font-black text-primary tracking-tight font-headline leading-none mb-1">EduDisha</h1>
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none">Guardian Portal</p>
                    </div>
                </div>

                <div className="px-6 py-8 flex-1">
                    {/* Guardian Info Block */}
                    <div className="mb-10 p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center text-xs font-black shadow-lg shadow-primary/20">
                            {getInitials(childName)}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-[8px] font-black uppercase text-primary tracking-widest leading-none mb-1">Monitoring</p>
                            <p className="text-sm font-bold text-slate-800 truncate">{childName.split(' ')[0]}</p>
                        </div>
                    </div>

                    <nav className="space-y-1.5">
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest px-4 mb-4">Navigation</p>
                        {navItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <button 
                                    key={item.id} 
                                    onClick={() => navigate(item.path)}
                                    className={`w-full flex items-center justify-between px-4 py-3.5 transition-all rounded-xl group/item ${isActive ? 'text-primary font-black border-r-4 border-primary bg-primary/5' : 'text-slate-500 hover:text-primary hover:bg-slate-100'}`}
                                >
                                    <div className="flex items-center gap-4">
                                        <span className={`material-symbols-outlined text-[22px] transition-transform group-hover/item:scale-110 ${isActive ? 'text-primary' : 'text-slate-300 group-hover/item:text-primary'}`}>{item.icon}</span>
                                        <span className="text-sm font-bold">{item.id}</span>
                                    </div>
                                    {item.badge > 0 && !isActive && (
                                        <span className="px-2 py-0.5 bg-error text-white text-[9px] font-black rounded-full shadow-sm shadow-error/20">{item.badge}</span>
                                    )}
                                </button>
                            );
                        })}

                        <div className="pt-10 space-y-1.5 border-t border-slate-50 mt-8">
                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest px-4 mb-4">System</p>
                            <button onClick={() => setIsSettingsOpen(true)} className="w-full flex items-center gap-4 px-4 py-3.5 text-slate-500 hover:text-primary hover:bg-slate-100 transition-all rounded-xl">
                                <span className="material-symbols-outlined text-[22px]">settings</span>
                                <span className="text-sm font-bold">Portal Settings</span>
                            </button>
                            <button onClick={() => navigate('/')} className="w-full flex items-center gap-4 px-4 py-3.5 text-slate-500 hover:text-primary hover:bg-slate-100 transition-all rounded-xl">
                                <span className="material-symbols-outlined text-[22px]">home</span>
                                <span className="text-sm font-bold">Main Website</span>
                            </button>
                            <button 
                                onClick={() => { localStorage.removeItem('token'); logout(); navigate('/login'); }}
                                className="w-full flex items-center gap-4 px-4 py-3.5 text-error-dim hover:bg-error-container/10 transition-all rounded-xl"
                            >
                                <span className="material-symbols-outlined text-[22px]">logout</span>
                                <span className="text-sm font-bold">Sign Out</span>
                            </button>
                        </div>
                    </nav>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="md:ml-72 min-h-screen">
                {/* TopNavBar - Fixed with exact height synchronization */}
                <header 
                    style={{ height: '80px' }}
                    className="fixed top-0 left-72 right-0 bg-[#f8faff] backdrop-blur-md z-40 flex justify-between items-center px-8 border-b border-slate-100"
                >
                    <div className="flex flex-col justify-center">
                        <h2 className="text-lg font-black text-slate-900 leading-none mb-1">Parent Portal</h2>
                        <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Live Sync Active</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 pl-4 border-l border-slate-100">
                        <span className="text-sm font-bold text-slate-700 hidden sm:block">{parentName}</span>
                        <div 
                            className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-xs shadow-xl shadow-slate-900/10 cursor-pointer hover:scale-105 active:scale-95 transition-all overflow-hidden"
                            onClick={() => setIsSettingsOpen(true)}
                        >
                            {user.profileImage ? (
                                <img src={user.profileImage} alt={parentName} className="w-full h-full object-cover" />
                            ) : (
                                getInitials(parentName)
                            )}
                        </div>
                    </div>
                </header>

                {/* Sub-page Content */}
                <div className="p-6 lg:p-10 max-w-7xl mx-auto pb-32 md:pb-10">
                    <Outlet context={{ data, fetchDashboard }} />
                </div>
            </main>

            {/* Mobile Bottom Nav */}
            <nav className="md:hidden fixed bottom-6 left-6 right-6 h-20 bg-slate-900/90 backdrop-blur-3xl rounded-[2.5rem] border border-white/10 flex items-center justify-around px-6 z-50 shadow-2xl">
                {navItems.slice(0, 4).map(item => (
                    <Link 
                        key={item.id} 
                        to={item.path}
                        className={`flex flex-col items-center gap-1 transition-all ${location.pathname === item.path ? 'text-primary scale-110' : 'text-slate-500'}`}
                    >
                        <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: location.pathname === item.path ? "'FILL' 1" : "" }}>{item.icon}</span>
                    </Link>
                ))}
                <button 
                    onClick={() => setIsSettingsOpen(true)}
                    className="w-10 h-10 rounded-full bg-white text-slate-900 flex items-center justify-center font-black text-[10px]"
                >
                    {getInitials(parentName)}
                </button>
            </nav>

            {/* Modal */}
            <ProfileSettings 
                isOpen={isSettingsOpen} 
                onClose={() => setIsSettingsOpen(false)} 
                parentPrefs={{
                    notifyOnQuiz: data?.parentProfile?.notifyOnQuiz || false,
                    toggleFn: toggleNotifications
                }}
            />
        </div>
    );
};

export default ParentLayout;
