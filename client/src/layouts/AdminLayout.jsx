import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Loader from '../components/common/Loader';
import BrandLogo from '../components/common/BrandLogo';

const AdminLayout = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/login');
                    return;
                }

                const res = await axios.get('/api/auth/me', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                const userRole = res.data.role?.toLowerCase();
                if (userRole !== 'superadmin' && userRole !== 'admin') {
                    console.warn("Access denied: role is", res.data.role);
                    navigate('/login');
                    return;
                }

                setUser(res.data);
            } catch (err) {
                console.error("Auth error:", err);
                navigate('/login');
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState({ users: [], quizzes: [] });
    const [showResults, setShowResults] = useState(false);
    const [unreadNotifications, setUnreadNotifications] = useState(0);

    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    useEffect(() => {
        const fetchInitialMeta = async () => {
            try {
                const res = await axios.get('/api/admin/notifications', { headers });
                setUnreadNotifications(res.data.unreadCount || 0);
            } catch (err) { console.warn("Meta fetch failed", err); }
        };
        fetchInitialMeta();
    }, []);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (searchQuery.length > 2) {
                handleSearch();
            } else {
                setSearchResults({ users: [], quizzes: [] });
                setShowResults(false);
            }
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery]);

    const handleSearch = async () => {
        try {
            const res = await axios.get(`/api/admin/search?q=${searchQuery}`, { headers });
            setSearchResults(res.data);
            setShowResults(true);
        } catch (err) { console.error("Search failed", err); }
    };

    if (loading) return <Loader />;

    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: 'dashboard', path: '/admin' },
        { id: 'users', label: 'User Management', icon: 'group', path: '/admin/users' },
        { id: 'students', label: 'Student Management', icon: 'school', path: '/admin/students' },
        { id: 'parents', label: 'Parent Management', icon: 'family_restroom', path: '/admin/parents' },
        { id: 'teachers', label: 'Teacher Management', icon: 'co_present', path: '/admin/teachers' },
        { id: 'quizzes', label: 'Quiz Management', icon: 'quiz', path: '/admin/quizzes' },
        { id: 'courses', label: 'Courses & Content', icon: 'auto_stories', path: '/admin/courses' },
        { id: 'events', label: 'Activities & Events', icon: 'event', path: '/admin/events' },
        { id: 'ai', label: 'AI System Control', icon: 'psychology', path: '/admin/ai-system' },
        { id: 'analytics', label: 'Reports & Analytics', icon: 'analytics', path: '/admin/reports' },
        { id: 'notifications', label: 'Notifications', icon: 'notifications', path: '/admin/notifications' },
    ];

    return (
        <div className="bg-surface text-on-surface min-h-screen">
            {/* Sidebar */}
            <aside className={`h-screen w-72 fixed left-0 top-0 z-50 bg-white flex flex-col transition-transform duration-300 ease-in-out border-r border-slate-100 lg:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                {/* Brand Section - Exact 80px Match with Sync Background */}
                <div
                    style={{ height: '80px' }}
                    className="w-full flex items-center gap-4 px-8 cursor-pointer bg-[#f8faff] hover:bg-primary/5 transition-all border-b border-slate-100 flex-shrink-0"
                    onClick={() => navigate('/')}
                >
                    <BrandLogo className="w-9 h-9 flex-shrink-0 shadow-lg shadow-primary/20 rounded-xl overflow-hidden" />
                    <div className="flex flex-col justify-center">
                        <h1 className="text-lg font-black text-primary tracking-tight font-headline leading-none mb-1">EduDisha</h1>
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none">Intentional Educator</p>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                    <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-100 mb-6">
                        <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden border-2 border-primary/10 flex items-center justify-center font-black text-xs">
                            {user?.name?.charAt(0) || 'A'}
                        </div>
                        <div>
                            <p className="font-headline font-semibold text-sm text-on-surface truncate max-w-[120px]">{user?.name || 'Admin User'}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Super Admin</p>
                        </div>
                    </div>

                    <nav className="space-y-1">
                        {navItems.map((item) => (
                            <Link
                                key={item.id}
                                to={item.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                                    (location.pathname === item.path || (item.path === '/admin' && location.pathname === '/admin/dashboard'))
                                    ? 'bg-primary/5 text-primary font-bold shadow-sm border border-primary/10' 
                                    : 'text-slate-600 hover:bg-slate-50 hover:translate-x-1'
                                }`}
                            >
                                <span className={`material-symbols-outlined ${(location.pathname === item.path || (item.path === '/admin' && location.pathname === '/admin/dashboard')) ? 'text-primary' : 'text-slate-400'}`}>{item.icon}</span>
                                <span className="text-sm font-bold uppercase tracking-wider">{item.label}</span>
                            </Link>
                        ))}
                        
                        <div className="pt-8 mt-8 border-t border-slate-100 space-y-1">
                            <Link to="/admin/settings" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${location.pathname === '/admin/settings' ? 'bg-primary/5 text-primary font-bold shadow-sm border border-primary/10' : 'text-slate-600 hover:bg-slate-50 hover:translate-x-1'}`}>
                                <span className={`material-symbols-outlined ${location.pathname === '/admin/settings' ? 'text-primary' : 'text-slate-400'}`}>settings</span>
                                <span className="text-sm font-bold uppercase tracking-wider">Settings</span>
                            </Link>
                            <button 
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 hover:translate-x-1 transition-all"
                            >
                                <span className="material-symbols-outlined text-[20px]">logout</span>
                                <span className="text-sm font-bold uppercase tracking-wider">Logout</span>
                            </button>
                        </div>
                    </nav>
                </div>
            </aside>

            {/* Main Content */}
            <main className="lg:ml-72 min-h-screen relative">
                {/* Header - Fixed 80px Height and Background */}
                <header 
                    style={{ height: '80px' }}
                    className="sticky top-0 w-full flex items-center justify-between px-8 bg-white/80 backdrop-blur-xl z-40 border-b border-slate-100"
                >
                    <div className="flex items-center gap-6">
                        <button 
                            className="lg:hidden text-slate-900"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            <span className="material-symbols-outlined">{isMobileMenuOpen ? 'close' : 'menu'}</span>
                        </button>
                        <div className="relative hidden lg:block">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
                            <input 
                                className="pl-10 pr-4 py-2 bg-slate-100 border-none rounded-full text-sm w-80 focus:ring-2 focus:ring-primary/20" 
                                placeholder="Search users or quizzes..." 
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            
                            {/* Search Results Dropdown */}
                            {showResults && (
                                <div className="absolute top-full left-0 mt-4 w-full bg-white rounded-2xl shadow-2xl border border-slate-100 p-4 max-h-96 overflow-y-auto z-50 animate-in fade-in zoom-in duration-200">
                                    {searchResults.users.length > 0 && (
                                        <div className="mb-4">
                                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-2 px-2 italic">User Registry</p>
                                            <div className="space-y-1">
                                                {searchResults.users.map(u => (
                                                    <div key={u._id} onClick={() => {navigate('/admin/users'); setShowResults(false)}} className="p-2 hover:bg-slate-50 rounded-xl cursor-pointer flex items-center gap-3 transition-all group">
                                                        <div className="w-8 h-8 rounded-lg bg-primary/5 text-primary flex items-center justify-center font-black text-xs group-hover:scale-110 transition-transform">{u.name[0]}</div>
                                                        <div>
                                                            <p className="text-xs font-bold text-slate-800">{u.name}</p>
                                                            <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">{u.role}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {searchResults.quizzes.length > 0 && (
                                        <div>
                                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-2 px-2 italic">Knowledge Assets</p>
                                            <div className="space-y-1">
                                                {searchResults.quizzes.map(q => (
                                                    <div key={q._id} onClick={() => {navigate('/admin/quizzes'); setShowResults(false)}} className="p-2 hover:bg-slate-50 rounded-xl cursor-pointer flex items-center gap-2 transition-all group">
                                                        <div className="w-8 h-8 rounded-lg bg-violet-50 text-violet-500 flex items-center justify-center">
                                                            <span className="material-symbols-outlined text-sm">quiz</span>
                                                        </div>
                                                        <p className="text-xs font-bold text-slate-800 group-hover:text-primary transition-colors">{q.parameter}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {searchResults.users.length === 0 && searchResults.quizzes.length === 0 && (
                                        <div className="text-center py-6">
                                            <span className="material-symbols-outlined text-slate-200 text-3xl mb-2">find_in_page</span>
                                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">No matching records</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate('/admin/notifications')} className="p-2 text-slate-500 hover:bg-slate-50 rounded-full transition-colors relative group">
                            <span className="material-symbols-outlined">notifications</span>
                            {unreadNotifications > 0 && (
                                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-white pulse"></span>
                            )}
                        </button>
                        <div className="h-8 w-[1px] bg-slate-200 mx-2"></div>
                        <div className="flex items-center gap-3">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-bold font-headline text-slate-800">Admin Command</p>
                                <p className="text-[10px] text-primary uppercase tracking-widest font-black italic">System Online</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-black text-xs shadow-xl shadow-slate-900/20 cursor-pointer hover:scale-105 transition-transform" onClick={() => navigate('/admin/settings')}>
                                {user?.name?.charAt(0) || 'A'}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <div className="p-8">
                    <Outlet context={{ user }} />
                </div>
            </main>

            {/* Mobile Overlay */}
            {isMobileMenuOpen && (
                <div 
                    className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}
        </div>
    );
};

export default AdminLayout;
