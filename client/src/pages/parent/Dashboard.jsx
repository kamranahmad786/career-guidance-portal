import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Loader from '../../components/common/Loader';
import ProfileSettings from '../../components/common/ProfileSettings';

const ParentDashboard = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    
    // Linking State
    const [showLinkModal, setShowLinkModal] = useState(false);
    const [childEmail, setChildEmail] = useState('');
    const [linkLoading, setLinkLoading] = useState(false);
    const [linkMessage, setLinkMessage] = useState({ text: '', type: '' });

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
            console.error('Failed to load dashboard:', err);
            setError('Connection failure.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboard();
    }, []);

    const handleLinkChild = async (e) => {
        e.preventDefault();
        setLinkLoading(true);
        setLinkMessage({ text: '', type: '' });
        
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/parent/link-child', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ email: childEmail })
            });
            
            const result = await res.json();
            if (res.ok) {
                setLinkMessage({ text: result.message, type: 'success' });
                setTimeout(() => {
                    setShowLinkModal(false);
                    fetchDashboard();
                }, 1500);
            } else {
                setLinkMessage({ text: result.message, type: 'error' });
            }
        } catch (err) {
            setLinkMessage({ text: 'Connection failed.', type: 'error' });
        } finally {
            setLinkLoading(false);
        }
    };

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

    // Data Extraction for Parity
    const childName = data?.childProfile?.name || "Alex Johnson";
    const parentName = user?.name || "Sarah Johnson";
    const studentGrade = data?.childProfile?.grade || "10th Grade";
    const studentSchool = data?.childProfile?.school || "North High";
    const latestResult = data?.resultsHistory?.[0] || null;
    const overallScore = 85; // Fallback or dynamic calc
    const strokeDashOffset = 351.8 - (351.8 * overallScore) / 100;

    const navItems = [
        { id: 'Dashboard', icon: 'dashboard', href: '#dashboard' },
        { id: 'Child Profile', icon: 'person_search', href: '#profile' },
        { id: 'Quiz Results', icon: 'quiz', href: '#results' },
        { id: 'Career Recommendations', icon: 'auto_awesome', href: '#careers' },
        { id: 'Progress Report', icon: 'insights', href: '#progress' },
        { id: 'Activities', icon: 'local_activity', href: '#activities' },
        { id: 'Notifications', icon: 'notifications', href: '#notifications' },
        { id: 'Settings', icon: 'settings', onClick: () => setIsSettingsOpen(true) }
    ];

    return (
        <div className="bg-surface-container-low text-on-surface font-body min-h-screen">
            {/* SideNavBar (Authority: 100% Visual Parity Reconstruction) */}
            <aside className="h-screen w-72 flex-col fixed left-0 top-0 bg-slate-50 dark:bg-slate-950 flex flex-col gap-2 py-6 pr-4 z-40 hidden md:flex border-r border-surface-container-high">
                <div className="px-8 mb-8">
                    <h1 className="text-lg font-black text-blue-800 dark:text-blue-200">EduDisha Guardian</h1>
                    <div className="mt-8 flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black text-sm border border-primary/20">
                            {getInitials(childName)}
                        </div>
                        <div>
                            <p className="text-on-surface font-bold text-sm">Parent Dashboard</p>
                            <p className="text-on-surface-variant text-xs">Managing {childName.split(' ')[0]}'s Future</p>
                        </div>
                    </div>
                </div>
                <nav className="flex-1 overflow-y-auto no-scrollbar">
                    {navItems.map((item) => (
                        <a 
                            key={item.id} 
                            href={item.href || '#'}
                            onClick={item.onClick}
                            className={`flex items-center gap-4 py-3 px-8 rounded-r-full font-bold transition-transform duration-200 hover:translate-x-1 ${item.id === 'Dashboard' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                        >
                            <span className="material-symbols-outlined">{item.icon}</span>
                            <span className="text-sm font-medium tracking-wide">{item.id}</span>
                        </a>
                    ))}
                </nav>
            </aside>

            {/* Main Content Area */}
            <main className="md:ml-72 min-h-screen pb-20 md:pb-0">
                {/* TopNavBar */}
                <header className="bg-surface-container-lowest/80 backdrop-blur-md dark:bg-slate-900/80 shadow-[0_20px_40px_rgba(0,91,196,0.06)] flex justify-between items-center w-full px-8 py-4 max-w-full top-0 sticky z-50">
                    <div className="flex items-center gap-8">
                        <span className="text-xl font-bold tracking-tight text-blue-700 dark:text-blue-400">Dashboard</span>
                        <nav className="hidden lg:flex items-center gap-6">
                            <a className="text-blue-700 dark:text-blue-400 font-semibold border-b-2 border-blue-700 hover:text-blue-800 transition-colors" href="#">Dashboard</a>
                            <a className="text-slate-500 dark:text-slate-400 font-medium hover:text-blue-800 transition-colors" href="#profile">Child Profile</a>
                            <a className="text-slate-500 dark:text-slate-400 font-medium hover:text-blue-800 transition-colors" href="#progress">Progress</a>
                        </nav>
                    </div>
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate('/notifications')} className="p-2 text-slate-500 hover:text-blue-700 transition-colors">
                            <span className="material-symbols-outlined">notifications</span>
                        </button>
                        <div className="flex items-center gap-3 pl-4 border-l border-surface-variant">
                            <span className="text-sm font-semibold text-on-surface">{parentName}</span>
                            <div 
                                className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-black text-xs border-2 border-primary-container cursor-pointer"
                                onClick={() => setIsSettingsOpen(true)}
                            >
                                {getInitials(parentName)}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content Reservoir */}
                <div className="px-8 py-10 max-w-7xl mx-auto space-y-10">
                    
                    {!data?.linked ? (
                        /* Unlinked State: Integrated Link Child Portal */
                        <div className="bg-surface-container-lowest rounded-3xl p-10 md:p-20 text-center border border-white/50 shadow-xl shadow-primary/5">
                            <div className="w-24 h-24 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-10 rotate-12">
                                <span className="material-symbols-outlined text-5xl text-primary font-black">person_add</span>
                            </div>
                            <h2 className="text-4xl font-black text-on-surface mb-6 font-headline leading-tight max-w-lg mx-auto">
                                Enable Real-Time <span className="text-primary">Career Tracking</span>
                            </h2>
                            <p className="text-on-surface-variant font-bold mb-12 max-w-xl mx-auto text-lg leading-relaxed text-slate-500">
                                Connect your child's student account to monitor their AI performance alerts, career alignment, and professional roadmap completion.
                            </p>
                            <form onSubmit={handleLinkChild} className="max-w-md mx-auto relative group">
                                <input 
                                    type="email" 
                                    placeholder="Child's Registered Email"
                                    value={childEmail}
                                    onChange={(e) => setChildEmail(e.target.value)}
                                    className="w-full py-5 px-8 rounded-full border-2 border-surface-container bg-surface-container-low focus:border-primary focus:bg-white transition-all outline-none font-bold text-on-surface shadow-sm"
                                    required
                                />
                                <button 
                                    type="submit"
                                    disabled={linkLoading}
                                    className="absolute right-2 top-2 bottom-2 px-8 bg-primary text-white rounded-full font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                                >
                                    {linkLoading ? "Linking..." : "Link Child"}
                                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                </button>
                                {linkMessage.text && (
                                    <p className={`mt-6 font-bold text-sm ${linkMessage.type === 'success' ? 'text-emerald-600' : 'text-error'}`}>
                                        {linkMessage.text}
                                    </p>
                                )}
                            </form>
                        </div>
                    ) : (
                        /* Linked State: 100% Visual Parity Reconstruction */
                        <>
                            {/* Morning Brief / Hero Section */}
                            <section id="dashboard" className="bg-white/80 backdrop-blur-xl rounded-xl p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border border-white shadow-sm transition-all hover:bg-white/90">
                                <div>
                                    <h2 className="text-4xl font-extrabold text-on-surface tracking-tight mb-2 italic">Welcome, {parentName.split(' ')[0]} 👋</h2>
                                    <p className="text-on-surface-variant text-lg text-slate-500">Your daily overview of {childName.split(' ')[0]}'s career trajectory and learning progress.</p>
                                </div>
                                <div className="bg-surface-container-highest px-6 py-3 rounded-full flex items-center gap-4 cursor-pointer hover:bg-slate-200 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-black text-[10px] border border-primary">
                                            {getInitials(childName)}
                                        </div>
                                        <span className="font-bold text-on-surface">{childName}</span>
                                    </div>
                                    <span className="material-symbols-outlined text-on-surface-variant">keyboard_arrow_down</span>
                                </div>
                            </section>

                            {/* Bento Grid Layout */}
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                                
                                {/* Section 1: Child Profile Overview */}
                                <div id="profile" className="md:col-span-4 bg-surface-container-lowest rounded-lg p-6 shadow-[0_20px_40px_rgba(0,91,196,0.06)] border border-white/20 flex flex-col">
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-xl font-bold text-on-surface text-slate-900">Child Profile</h3>
                                        <span className="material-symbols-outlined text-primary">person_search</span>
                                    </div>
                                    <div className="space-y-4 flex-1">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-1 opacity-60">Full Name</span>
                                            <span className="text-lg font-bold text-slate-800">{childName}</span>
                                        </div>
                                        <div className="flex justify-between border-t border-surface-container pt-4">
                                            <div>
                                                <span className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold opacity-60">Current Grade</span>
                                                <p className="font-bold text-primary">{studentGrade}</p>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold opacity-60">School</span>
                                                <p className="font-bold">{studentSchool}</p>
                                            </div>
                                        </div>
                                        <div className="pt-4 border-t border-surface-container">
                                            <span className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold block mb-3 opacity-60">Interests</span>
                                            <div className="flex flex-wrap gap-2">
                                                {(data.childProfile.details?.interests || ['Coding', 'Robotics']).map(tag => (
                                                    <span key={tag} className="bg-primary/5 text-primary px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">{tag}</span>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="pt-4 border-t border-surface-container">
                                            <span className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold block mb-3 opacity-60">Core Skills</span>
                                            <div className="flex flex-wrap gap-2">
                                                {(data.childProfile.details?.skills || ['Logic', 'Mathematics']).map(tag => (
                                                    <span key={tag} className="bg-secondary/10 text-secondary px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">{tag}</span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Section 2 & 3: Performance & Strengths */}
                                <div id="results" className="md:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Quiz Performance */}
                                    <div className="bg-surface-container-lowest rounded-lg p-6 shadow-[0_20px_40px_rgba(0,91,196,0.06)] border border-white flex flex-col items-center justify-center text-center">
                                        <h3 className="text-xl font-bold text-on-surface mb-6 w-full text-left">Quiz Performance</h3>
                                        <div className="relative w-32 h-32 flex items-center justify-center mb-4">
                                            <svg className="w-full h-full transform -rotate-90">
                                                <circle className="text-surface-container" cx="64" cy="64" fill="transparent" r="56" stroke="currentColor" strokeWidth="12"></circle>
                                                <circle className="text-primary rounded-full transition-all duration-1000" cx="64" cy="64" fill="transparent" r="56" stroke="currentColor" strokeDasharray="351.8" strokeDashoffset={strokeDashOffset} strokeWidth="12" strokeLinecap="round"></circle>
                                            </svg>
                                            <div className="absolute flex flex-col items-center">
                                                <span className="text-3xl font-black text-on-surface">{overallScore}%</span>
                                                <span className="text-[10px] uppercase font-black text-on-surface-variant tracking-tighter">Overall</span>
                                            </div>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-sm font-black text-on-surface">54 / 72 Questions</p>
                                            <p className="text-xs text-on-surface-variant font-bold opacity-60">Attempted successfully</p>
                                        </div>
                                    </div>
                                    
                                    {/* AI-Detected Strengths */}
                                    <div className="bg-surface-container-lowest rounded-lg p-6 shadow-[0_20px_40px_rgba(0,91,196,0.06)] border border-white">
                                        <h3 className="text-xl font-bold text-on-surface mb-8">Top Interest Areas</h3>
                                        <div className="space-y-6">
                                            {[
                                                { label: 'Coding', value: 85 },
                                                { label: 'Design', value: 78 },
                                                { label: 'Robotics', value: 70 }
                                            ].map(item => (
                                                <div key={item.label}>
                                                    <div className="flex justify-between text-xs font-black uppercase tracking-widest mb-2">
                                                        <span>{item.label}</span>
                                                        <span className="text-primary">{item.value}%</span>
                                                    </div>
                                                    <div className="h-2 w-full bg-surface-container-low rounded-full overflow-hidden border border-slate-100">
                                                        <div className="h-full bg-primary transition-all duration-1000" style={{ width: `${item.value}%` }}></div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Section 4: Career Recommendations */}
                                <div id="careers" className="md:col-span-12">
                                    <div className="flex justify-between items-end mb-6">
                                        <div>
                                            <h3 className="text-2xl font-bold text-on-surface text-slate-900">Career Recommendations</h3>
                                            <p className="text-on-surface-variant text-slate-500 font-medium">Pathways curated by Serene Guardian AI</p>
                                        </div>
                                        <span onClick={() => navigate('/library')} className="text-primary font-bold text-sm hover:underline cursor-pointer uppercase tracking-widest">View All Careers</span>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {(data.careerHistory?.[0]?.careers || ['Software Developer', 'Robotics Engineer', 'Graphic Designer']).slice(0, 3).map((career, i) => (
                                            <div key={i} className={`bg-surface-container-lowest p-8 rounded-lg shadow-[0_20px_40px_rgba(0,91,196,0.06)] flex flex-col h-full border border-white group transition-all hover:scale-[1.02] ${i === 1 ? 'border-t-4 border-primary' : ''}`}>
                                                <span className="material-symbols-outlined text-4xl text-primary mb-4 group-hover:scale-110 transition-transform">
                                                    {i === 0 ? 'terminal' : i === 1 ? 'precision_manufacturing' : 'draw'}
                                                </span>
                                                <h4 className="text-xl font-bold mb-2 text-slate-900">{career}</h4>
                                                <p className="text-sm text-on-surface-variant mb-8 flex-grow leading-relaxed text-slate-500">
                                                    {i === 0 ? 'Design, develop, and maintain complex software systems and mobile applications.' : 
                                                     i === 1 ? 'Creating robotic systems that can perform tasks beyond human capability or safety limits.' : 
                                                     'Visual communication through typography, imagery, color, and form for various media.'}
                                                </p>
                                                <button className={`w-full py-3 rounded-full font-black text-xs uppercase tracking-widest shadow-xl transition-all ${i === 1 ? 'bg-primary text-white shadow-primary/20 scale-[1.02]' : 'bg-surface-container-low text-primary hover:bg-primary hover:text-white'}`}>
                                                    View Details
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Section 5: Skill Development Progress */}
                                <div id="progress" className="md:col-span-8 bg-surface-container-lowest rounded-lg p-10 shadow-[0_20px_40px_rgba(0,91,196,0.06)] border border-white">
                                    <div className="flex justify-between items-center mb-10">
                                        <h3 className="text-xl font-bold text-on-surface">Skill Development Progress</h3>
                                        <div className="flex gap-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-3 h-3 rounded-full bg-primary"></div>
                                                <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest text-slate-500">Alex</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-3 h-3 rounded-full bg-secondary"></div>
                                                <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest text-slate-500">Class Avg</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="h-64 flex items-end justify-between gap-3 px-2">
                                        {[32, 40, 52, 36, 48, 64].map((h, i) => (
                                            <div key={i} className="w-full h-full bg-primary/10 rounded-t-lg relative group">
                                                <div className="absolute bottom-0 w-full bg-primary rounded-t-lg transition-all group-hover:brightness-110" style={{ height: `${h}%` }}></div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex justify-between mt-6 text-[10px] font-black text-on-surface-variant uppercase tracking-widest opacity-60 px-4">
                                        {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map(m => <span key={m}>{m}</span>)}
                                    </div>
                                </div>

                                {/* Section 6: AI Insights */}
                                <div className="md:col-span-4 bg-primary text-on-primary rounded-lg p-10 shadow-xl shadow-primary/20 flex flex-col justify-between border border-primary">
                                    <div>
                                        <div className="bg-white/20 w-12 h-12 rounded-xl flex items-center justify-center mb-8 backdrop-blur-md">
                                            <span className="material-symbols-outlined text-white" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                                        </div>
                                        <h3 className="text-2xl font-bold mb-6 italic tracking-tight">AI Insights</h3>
                                        <p className="text-white/80 leading-relaxed italic text-lg font-medium">"{childName.split(' ')[0]} shows strong interest in analytical fields. Encourage participation in coding activities to capitalize on this natural affinity."</p>
                                    </div>
                                    <div className="mt-12 pt-6 border-t border-white/10">
                                        <a className="inline-flex items-center gap-3 text-sm font-black uppercase tracking-widest text-white group" href="#">
                                            Get full analysis
                                            <span className="material-symbols-outlined text-sm group-hover:translate-x-2 transition-transform">arrow_forward</span>
                                        </a>
                                    </div>
                                </div>

                                {/* Section 7: Learning Recommendations */}
                                <div className="md:col-span-6 bg-surface-container-lowest rounded-lg p-8 shadow-[0_20px_40px_rgba(0,91,196,0.06)] border border-white">
                                    <h3 className="text-xl font-bold text-on-surface mb-8">Learning Recommendations</h3>
                                    <div className="space-y-4">
                                        {[
                                            { title: 'Intro to Python', time: '4 weeks', icon: 'data_object' },
                                            { title: 'UI Design Basics', time: '2 weeks', icon: 'palette' }
                                        ].map(course => (
                                            <div key={course.title} className="bg-surface-container-low p-5 rounded-xl flex items-center justify-between border border-slate-100 group hover:border-primary/20 transition-all">
                                                <div className="flex items-center gap-5">
                                                    <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-primary shadow-sm">
                                                        <span className="material-symbols-outlined">{course.icon}</span>
                                                    </div>
                                                    <div>
                                                        <h5 className="font-bold text-slate-800">{course.title}</h5>
                                                        <p className="text-[10px] uppercase font-black tracking-widest text-slate-400">Duration: {course.time}</p>
                                                    </div>
                                                </div>
                                                <button className="bg-white text-primary text-[10px] font-black uppercase tracking-widest px-5 py-2 rounded-full border border-slate-100 hover:bg-primary hover:text-white transition-all shadow-sm">View</button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Section 8: Activities & Events */}
                                <div id="activities" className="md:col-span-6 bg-surface-container-lowest rounded-lg p-8 shadow-[0_20px_40px_rgba(0,91,196,0.06)] border border-white">
                                    <h3 className="text-xl font-bold text-on-surface mb-8">Upcoming Activities</h3>
                                    <div className="space-y-6">
                                        {[
                                            { day: '15', month: 'May', title: 'Science Fair', subtitle: 'Annual Innovation Showcase', time: '10:00 AM - 4:00 PM', color: 'primary' },
                                            { day: '02', month: 'Jun', title: 'Teacher Meeting', subtitle: 'Academic Review Q2', time: '03:30 PM - 4:30 PM', color: 'secondary' }
                                        ].map(ev => (
                                            <div key={ev.title} className="flex gap-6 items-start group">
                                                <div className={`bg-${ev.color}/10 text-${ev.color} p-4 rounded-xl text-center min-w-[70px] border border-${ev.color}/20 group-hover:scale-105 transition-transform`}>
                                                    <span className="block text-2xl font-black leading-none">{ev.day}</span>
                                                    <span className="text-[10px] uppercase font-black">{ev.month}</span>
                                                </div>
                                                <div className="flex-1">
                                                    <h5 className="font-bold text-slate-900 mb-1">{ev.title}</h5>
                                                    <p className="text-xs text-slate-500 font-medium">{ev.subtitle}</p>
                                                    <span className="text-[10px] font-black uppercase tracking-widest bg-slate-100 px-3 py-1 rounded mt-2 inline-block opacity-60">{ev.time}</span>
                                                </div>
                                                <span className="material-symbols-outlined text-slate-300 group-hover:text-primary cursor-pointer transition-colors">chevron_right</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Section 9: NEP 2020 Alignment */}
                                <div className="md:col-span-12">
                                    <div className="bg-gradient-to-r from-blue-900 to-primary rounded-xl p-8 flex flex-col md:flex-row items-center justify-between gap-8 border-2 border-primary-container/20 shadow-xl shadow-primary/10">
                                        <div className="flex items-center gap-8">
                                            <div className="bg-white p-4 rounded-full shadow-2xl">
                                                <img alt="NEP Logo" className="w-16 h-16 object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBxE3ebkHntfzOpJVBvrIq5vrFUbzPKY-rriWYeS5RprJ1-br0hK8KkDCnpCCXMfclj1BgDsSqg1o6PSMh5f9NUq5auMN4PA0Yr63bamwF6XlWn5HsHMM9gXm-sKLc0cIhQv9CjjMLexVM0ZLRBVOCLVMkMV9Lu3bBHLBZpp_Yqy14SuBkUhsQgaW4bHfUZ5Ffd4pqxBYjVzFG7YHXEbK0rA62K3RyPsqiHQSJ01t8xkvRVKd1_gOCAs6IYE23zIvQdVkRUhu0fRM0w"/>
                                            </div>
                                            <div>
                                                <h3 className="text-white text-2xl font-black italic tracking-tighter">NEP 2020 ALIGNED</h3>
                                                <p className="text-on-primary/70 font-black uppercase tracking-widest text-xs opacity-80">Prioritizing Skill-based Learning and Holistic Development</p>
                                            </div>
                                        </div>
                                        <div className="bg-white/10 backdrop-blur-md px-8 py-5 rounded-xl border border-white/20 flex items-center gap-4">
                                            <div className="text-right">
                                                <p className="text-white/60 text-[10px] font-black uppercase tracking-widest mb-1">Current Focus</p>
                                                <div className="flex items-center gap-2 text-white">
                                                    <span className="material-symbols-outlined text-lg">check_circle</span>
                                                    <span className="text-lg font-black">Critical Thinking Integration</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Mobile Bottom Nav */}
                <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-3xl border-t border-surface-container-high py-4 flex justify-around items-center z-50 shadow-2xl">
                    <a className="flex flex-col items-center gap-1 text-primary" href="#dashboard">
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>dashboard</span>
                        <span className="text-[10px] font-black uppercase tracking-widest">Home</span>
                    </a>
                    <a className="flex flex-col items-center gap-1 text-on-surface-variant text-slate-400" href="#profile">
                        <span className="material-symbols-outlined">person_search</span>
                        <span className="text-[10px] font-black uppercase tracking-widest">Profile</span>
                    </a>
                    <a className="flex flex-col items-center gap-1 text-on-surface-variant text-slate-400" href="#results">
                        <span className="material-symbols-outlined">insights</span>
                        <span className="text-[10px] font-black uppercase tracking-widest">Progress</span>
                    </a>
                    <button onClick={() => setIsSettingsOpen(true)} className="flex flex-col items-center gap-1 text-on-surface-variant text-slate-400">
                        <span className="material-symbols-outlined">settings</span>
                        <span className="text-[10px] font-black uppercase tracking-widest">Settings</span>
                    </button>
                </nav>
            </main>

            {/* Account Settings & Preferences */}
            <ProfileSettings 
                isOpen={isSettingsOpen} 
                onClose={() => setIsSettingsOpen(false)} 
                parentPrefs={{
                    notifyOnQuiz: data?.parentProfile?.notifyOnQuiz || false,
                    toggleFn: toggleNotifications
                }}
            />

            {/* Custom Tailwind Overrides support */}
            <style dangerouslySetInnerHTML={{ __html: `
                .no-scrollbar::-webkit-scrollbar { display: none; }
                aside { z-index: 100; }
                header { z-index: 90; }
                .bg-primary { background-color: #005bc4 !important; }
                .text-primary { color: #005bc4 !important; }
                .border-primary { border-color: #005bc4 !important; }
                .bg-secondary { background-color: #575f72 !important; }
                .text-secondary { color: #575f72 !important; }
            `}} />
        </div>
    );
};

export default ParentDashboard;
