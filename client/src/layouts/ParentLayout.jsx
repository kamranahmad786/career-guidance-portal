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
            <aside className="h-screen w-72 flex-col fixed left-0 top-0 bg-white dark:bg-slate-950 flex flex-col gap-2 py-6 pr-4 z-40 hidden md:flex border-r border-slate-100">
                <div className="px-8 mb-8">
                    <h1 className="text-xl font-black text-primary tracking-tighter">EduDisha Hub</h1>
                    <div className="mt-8 flex items-center gap-3 p-4 bg-primary/5 rounded-2xl border border-primary/10">
                        <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center text-xs font-black shadow-lg shadow-primary/20">
                            {getInitials(childName)}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-[10px] font-black uppercase text-primary tracking-widest leading-none mb-1">Guardian Mode</p>
                            <p className="text-sm font-bold text-slate-800 truncate">{childName.split(' ')[0]}</p>
                        </div>
                    </div>
                </div>
                <nav className="flex-1 space-y-1">
                    {navItems.map((item) => (
                        <Link 
                            key={item.id} 
                            to={item.path}
                            className={`flex items-center justify-between py-3 px-8 rounded-r-full font-bold transition-all group ${location.pathname === item.path ? 'bg-primary text-white shadow-xl shadow-primary/30 translate-x-1' : 'text-slate-500 hover:bg-slate-50 hover:text-primary hover:translate-x-1'}`}
                        >
                            <div className="flex items-center gap-4">
                                <span className={`material-symbols-outlined text-xl transition-transform group-hover:scale-110 ${location.pathname === item.path ? 'text-white' : 'text-slate-300 group-hover:text-primary'}`}>{item.icon}</span>
                                <span className="text-sm font-medium tracking-wide">{item.id}</span>
                            </div>
                            {item.badge > 0 && location.pathname !== item.path && (
                                <span className="px-2 py-0.5 bg-error text-white text-[9px] font-black rounded-full animate-pulse shadow-sm shadow-error/20">{item.badge}</span>
                            )}
                        </Link>
                    ))}
                </nav>
                <div className="mt-auto px-4 space-y-2">
                    <button onClick={() => setIsSettingsOpen(true)} className="w-full flex items-center gap-4 py-3 px-8 text-slate-400 hover:text-slate-900 transition-all font-black text-xs uppercase tracking-widest">
                        <span className="material-symbols-outlined text-lg">settings</span>
                        Settings
                    </button>
                    <button 
                        onClick={() => { localStorage.removeItem('token'); logout(); navigate('/login'); }}
                        className="w-full flex items-center gap-4 py-3 px-8 text-error hover:bg-error-container/5 rounded-r-full transition-all font-black text-xs uppercase tracking-widest group"
                    >
                        <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">logout</span>
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="md:ml-72 min-h-screen">
                {/* TopNavBar */}
                <header className="bg-white/80 backdrop-blur-md dark:bg-slate-900/80 shadow-sm flex justify-between items-center w-full px-8 py-4 max-w-full top-0 sticky z-50 border-b border-slate-100">
                    <div>
                        <h2 className="text-xl font-black text-slate-900 tracking-tight">Parent Portal</h2>
                        <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Live Sync Active</span>
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
