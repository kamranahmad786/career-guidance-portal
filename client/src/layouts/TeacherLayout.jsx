import React, { useState, useEffect, useContext } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import BrandLogo from '../components/common/BrandLogo';
import Loader from '../components/common/Loader';
import NotificationHub from '../components/common/NotificationHub';

const TeacherLayout = () => {
    const { user, logout } = useContext(AuthContext);
    const location = useLocation();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState(null);
    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
        if (searchTerm.length < 2) {
            setSearchResults(null);
            return;
        }

        const delayDebounce = setTimeout(async () => {
            setIsSearching(true);
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(`/api/teacher/search?q=${searchTerm}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    const result = await res.json();
                    setSearchResults(result);
                }
            } catch (err) {
                console.error('Search failed:', err);
            } finally {
                setIsSearching(false);
            }
        }, 500);

        return () => clearTimeout(delayDebounce);
    }, [searchTerm]);

    const fetchDashboard = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const res = await fetch('/api/teacher/dashboard', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const result = await res.json();
            setData(result);
        } catch (err) {
            console.error('Failed to load teacher layout data:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboard();
    }, []);

    if (loading) return <Loader />;

    const navItems = [
        { id: 'Dashboard', icon: 'dashboard', path: '/teacher/dashboard' },
        { id: 'Student Management', icon: 'group', path: '/teacher/students' },
        { id: 'Create Quiz', icon: 'quiz', path: '/teacher/create-quiz' },
        { id: 'Activities & Events', icon: 'event', path: '/teacher/activities' },
        { id: 'Performance Tracking', icon: 'trending_up', path: '/teacher/performance' },
        { id: 'Reports', icon: 'analytics', path: '/teacher/reports' },
        { id: 'Notifications', icon: 'notifications', path: '/teacher/notifications' }
    ];

    const teacherName = user?.name || "Dr. Elena Smith";
    const teacherTitle = data?.teacherProfile?.subject ? `Sr. ${data.teacherProfile.subject} Mentor` : "Sr. Career Mentor";

    return (
        <div className="bg-[#f8f9fa] text-slate-800 font-body min-h-screen">
            {/* Sidebar - Matching Mockup styling */}
            <aside className="fixed left-0 top-0 h-full w-72 flex flex-col bg-white z-50 hidden md:flex border-r border-slate-100 overflow-y-auto">
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

                <div className="px-6 py-8 flex-1">
                    <nav className="space-y-1.5">
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest px-4 mb-4">Management</p>
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
                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest px-4 mb-4">Professional</p>
                            <Link 
                                to="/teacher/settings"
                                className={`w-full flex items-center gap-4 px-4 py-3.5 transition-all rounded-xl ${location.pathname === '/teacher/settings' ? 'text-primary font-black bg-primary/5' : 'text-slate-500 hover:text-primary hover:bg-slate-100'}`}
                            >
                                <span className={`material-symbols-outlined text-[22px] ${location.pathname === '/teacher/settings' ? 'text-primary' : 'text-slate-300'}`}>settings</span>
                                <span className="text-sm font-bold uppercase tracking-wider">Settings</span>
                            </Link>
                            <button 
                                onClick={() => { localStorage.removeItem('token'); logout(); navigate('/login'); }}
                                className="w-full flex items-center gap-4 px-4 py-3.5 text-error-dim hover:bg-error-container/10 transition-all rounded-xl"
                            >
                                <span className="material-symbols-outlined text-[22px]">logout</span>
                                <span className="text-sm font-bold uppercase tracking-wider">Sign Out</span>
                            </button>
                        </div>
                    </nav>
                </div>

                {/* Profile Card Fixed at Bottom */}
                <Link to="/teacher/profile" className="mt-auto p-6 bg-slate-50 border-t border-slate-100 block group/profile">
                    <div className="flex items-center gap-3 bg-white p-3 rounded-2xl shadow-sm border border-slate-100 group-hover/profile:border-primary/20 transition-all">
                        <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-black text-xs shadow-lg shadow-primary/20 overflow-hidden">
                            {user.profileImage ? (
                                <img src={user.profileImage} alt={teacherName} className="w-full h-full object-cover" />
                            ) : (
                                teacherName.charAt(0)
                            )}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-xs font-bold text-slate-800 truncate">{teacherName}</p>
                            <p className="text-[10px] text-slate-400 font-medium">{teacherTitle}</p>
                        </div>
                    </div>
                </Link>
            </aside>

            {/* Main Content Area */}
            <main className="md:ml-72 min-h-screen">
                {/* TopNavBar - Fixed with exact height synchronization */}
                <header 
                    style={{ height: '80px' }}
                    className="fixed top-0 left-72 right-0 bg-[#f8faff] backdrop-blur-md z-40 flex justify-between items-center px-8 border-b border-slate-100"
                >
                    <div className="flex items-center gap-8">
                        <div>
                            <h2 className="text-2xl font-semibold text-slate-800 tracking-tight">Welcome, {teacherName.split(' ')[1] || teacherName.split(' ')[0]} 👋</h2>
                        </div>
                        <div className="relative w-96 hidden lg:block">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                                {isSearching ? 'sync' : 'search'}
                            </span>
                            <input 
                                className={`w-full bg-white/50 border border-slate-100 rounded-xl pl-10 pr-4 py-2 text-sm focus:ring-4 focus:ring-primary/10 transition-all outline-none ${isSearching ? 'animate-pulse' : ''}`} 
                                placeholder="Search students, skills, or records..." 
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />

                            {/* Search Results Dropdown */}
                            {searchResults && (
                                <div className="absolute top-full left-0 right-0 mt-4 bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden z-[100] animate-in slide-in-from-top-4 duration-300">
                                    <div className="max-h-[30rem] overflow-y-auto">
                                        {/* Students Category */}
                                        {searchResults.students?.length > 0 && (
                                            <div className="p-4">
                                                <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] px-4 mb-3 italic">Academic Roster</p>
                                                <div className="space-y-1">
                                                    {searchResults.students.map(student => (
                                                        <div 
                                                            key={student._id}
                                                            onClick={() => { navigate('/teacher/students'); setSearchTerm(''); }}
                                                            className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-2xl cursor-pointer transition-all group"
                                                        >
                                                            <div className="w-10 h-10 rounded-xl bg-primary/5 text-primary flex items-center justify-center font-black text-sm group-hover:scale-110 transition-transform">
                                                                {student.name.charAt(0)}
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-black text-slate-800 group-hover:text-primary transition-colors">{student.name}</p>
                                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{student.grade || 'Grade X'} • Student</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Quizzes Category */}
                                        {searchResults.quizzes?.length > 0 && (
                                            <div className="p-4 border-t border-slate-50 bg-slate-50/30">
                                                <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] px-4 mb-3 italic">Knowledge Assessments</p>
                                                <div className="space-y-1">
                                                    {searchResults.quizzes.map(quiz => (
                                                        <div 
                                                            key={quiz._id}
                                                            onClick={() => { navigate('/teacher/create-quiz'); setSearchTerm(''); }}
                                                            className="flex items-center gap-4 p-3 hover:bg-white hover:shadow-sm rounded-2xl cursor-pointer transition-all group"
                                                        >
                                                            <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-500 flex items-center justify-center">
                                                                <span className="material-symbols-outlined text-xl">quiz</span>
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-black text-slate-800 group-hover:text-primary transition-colors">{quiz.title}</p>
                                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{quiz.parameter} • AI Generated</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {searchResults.students?.length === 0 && searchResults.quizzes?.length === 0 && !isSearching && (
                                            <div className="p-10 text-center">
                                                <span className="material-symbols-outlined text-slate-200 text-4xl mb-3">person_search</span>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic leading-relaxed">No matching records found in school registry.</p>
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-center">
                                         <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest italic opacity-60">EduDisha Cognitive Explorer v1.0</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        <NotificationHub />
                        <div className="w-px h-8 bg-slate-200 mx-2"></div>
                        <span className="text-sm font-black text-primary tracking-widest uppercase italic bg-white px-4 py-2 rounded-xl border border-slate-100 shadow-sm leading-none">EduDisha AI</span>
                    </div>
                </header>

                {/* Dashboard Content Outlet */}
                <div className="pt-[80px]">
                    <div className="p-8 pb-32">
                        <Outlet context={{ data, fetchDashboard }} />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default TeacherLayout;
