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
    const overallScore = 85; // Fallback or dynamic calc
    const strokeDashOffset = 351.8 - (351.8 * overallScore) / 100;

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
            {!data?.linked ? (
                /* Unlinked State: Integrated Link Child Portal */
                <div className="bg-white rounded-[3rem] p-10 md:p-20 text-center border border-slate-100 shadow-xl shadow-primary/5">
                    <div className="w-24 h-24 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-10 rotate-12">
                        <span className="material-symbols-outlined text-5xl text-primary font-black">person_add</span>
                    </div>
                    <h2 className="text-4xl font-black text-slate-800 mb-6 font-headline leading-tight max-w-lg mx-auto">
                        Enable Real-Time <span className="text-primary">Career Tracking</span>
                    </h2>
                    <p className="text-slate-500 font-bold mb-12 max-w-xl mx-auto text-lg leading-relaxed">
                        Connect your child's student account to monitor their AI performance alerts, career alignment, and professional roadmap completion.
                    </p>
                    <form onSubmit={handleLinkChild} className="max-w-md mx-auto relative group">
                        <input 
                            type="email" 
                            placeholder="student@edudisha.com"
                            value={childEmail}
                            onChange={(e) => setChildEmail(e.target.value)}
                            className="w-full py-5 px-8 rounded-full border-2 border-slate-100 bg-slate-50 focus:border-primary focus:bg-white transition-all outline-none font-bold text-slate-700 shadow-sm"
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
                    </form>
                    {linkMessage.text && (
                        <p className={`mt-6 font-bold text-sm ${linkMessage.type === 'success' ? 'text-emerald-600' : 'text-error'}`}>
                            {linkMessage.text}
                        </p>
                    )}
                </div>
            ) : (
                /* Linked State: 100% Visual Parity Reconstruction */
                <>
                    {/* Morning Brief / Hero Section */}
                    <section className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border border-slate-100 shadow-sm transition-all hover:bg-white/90">
                        <div>
                            <h2 className="text-4xl font-black text-slate-800 tracking-tight mb-2 italic">Welcome, {parentName.split(' ')[0]} 👋</h2>
                            <p className="text-slate-500 text-lg font-medium">Your daily overview of {childName.split(' ')[0]}'s career trajectory and learning progress.</p>
                        </div>
                        <div className="bg-slate-50 px-8 py-4 rounded-3xl flex items-center gap-4 cursor-pointer hover:bg-slate-100 transition-colors border border-slate-100 shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center font-black text-xs shadow-lg shadow-primary/20">
                                    {getInitials(childName)}
                                </div>
                                <span className="font-black text-slate-700 uppercase tracking-widest text-[10px]">{childName}</span>
                            </div>
                            <span className="material-symbols-outlined text-slate-400">keyboard_arrow_down</span>
                        </div>
                    </section>

                    {/* Bento Grid Layout */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                        
                        {/* Section 1: Child Profile Overview */}
                        <div className="md:col-span-4 bg-white rounded-[3rem] p-10 shadow-sm border border-slate-100 flex flex-col">
                            <div className="flex items-center justify-between mb-10">
                                <h3 className="text-lg font-black text-slate-800 uppercase tracking-widest italic">Child Profile</h3>
                                <div className="w-10 h-10 rounded-xl bg-primary/5 text-primary flex items-center justify-center">
                                    <span className="material-symbols-outlined">person_search</span>
                                </div>
                            </div>
                            <div className="space-y-6 flex-1">
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Full Identity</span>
                                    <span className="text-xl font-black text-slate-800 tracking-tight">{childName}</span>
                                </div>
                                <div className="flex justify-between border-t border-slate-50 pt-6">
                                    <div>
                                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Grade Level</span>
                                        <p className="font-black text-primary italic">{studentGrade}</p>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Institution</span>
                                        <p className="font-bold text-slate-600 truncate max-w-[100px]">{studentSchool}</p>
                                    </div>
                                </div>
                                <div className="pt-6 border-t border-slate-50">
                                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-4 block">Aptitude Clusters</span>
                                    <div className="flex flex-wrap gap-2">
                                        {(data?.childProfile?.details?.interests || ['Coding', 'Robotics']).map(tag => (
                                            <span key={tag} className="bg-primary/5 text-primary px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider border border-primary/10">{tag}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section 2 & 3: Performance & Strengths */}
                        <div className="md:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Quiz Performance */}
                            <div className="bg-white rounded-[3rem] p-10 shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center">
                                <h3 className="text-lg font-black text-slate-800 uppercase tracking-widest italic w-full text-left mb-10">Live Performance</h3>
                                <div className="relative w-40 h-40 flex items-center justify-center mb-6">
                                    <svg className="w-full h-full transform -rotate-90">
                                        <circle className="text-slate-50" cx="80" cy="80" fill="transparent" r="70" stroke="currentColor" strokeWidth="12"></circle>
                                        <circle className="text-primary rounded-full transition-all duration-1000" cx="80" cy="80" fill="transparent" r="70" stroke="currentColor" strokeDasharray="439.8" strokeDashoffset={439.8 - (439.8 * overallScore) / 100} strokeWidth="12" strokeLinecap="round"></circle>
                                    </svg>
                                    <div className="absolute flex flex-col items-center">
                                        <span className="text-4xl font-black text-slate-800">{overallScore}%</span>
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Accuracy</span>
                                    </div>
                                </div>
                                <div className="text-center">
                                    <p className="text-sm font-black text-slate-700">54 / 72 Questions</p>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">NEP Mastery Index</p>
                                </div>
                            </div>
                            
                            {/* AI-Detected Strengths */}
                            <div className="bg-slate-900 rounded-[3rem] p-10 shadow-xl shadow-slate-900/10 border border-slate-800 text-white">
                                <h3 className="text-lg font-black text-white/40 uppercase tracking-widest italic mb-10">AI Predicted Traits</h3>
                                <div className="space-y-8">
                                    {[
                                        { label: 'Coding', value: 85, color: 'bg-primary' },
                                        { label: 'Design', value: 78, color: 'bg-violet-500' },
                                        { label: 'Robotics', value: 70, color: 'bg-emerald-500' }
                                    ].map(item => (
                                        <div key={item.label}>
                                            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-3">
                                                <span>{item.label}</span>
                                                <span className="text-white">{item.value}%</span>
                                            </div>
                                            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                                                <div className={`h-full ${item.color} transition-all duration-1000 shadow-[0_0_10px_rgba(255,255,255,0.1)]`} style={{ width: `${item.value}%` }}></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Section 4: Career Recommendations */}
                        <div className="md:col-span-12">
                            <div className="flex justify-between items-end mb-10">
                                <div>
                                    <h3 className="text-3xl font-black text-slate-800 tracking-tighter">Career Trajectory Recommendations</h3>
                                    <p className="text-slate-500 font-bold text-lg mt-1 italic">Pathway curation powered by Serene Guardian AI</p>
                                </div>
                                <button onClick={() => navigate('/parent/careers')} className="px-8 py-3 bg-white border border-slate-100 text-primary font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl shadow-sm hover:bg-primary hover:text-white transition-all">View Full Roadmap</button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {(data?.careerHistory?.[0]?.careers || ['Software Developer', 'Robotics Engineer', 'Graphic Designer']).slice(0, 3).map((career, i) => (
                                    <div key={i} className={`bg-white p-10 rounded-[3rem] shadow-sm flex flex-col h-full border border-slate-100 group transition-all hover:shadow-xl hover:-translate-y-2 ${i === 1 ? 'ring-2 ring-primary ring-offset-8' : ''}`}>
                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 border border-slate-100 shadow-inner group-hover:scale-110 transition-transform ${i === 1 ? 'bg-primary/5 text-primary' : 'bg-slate-50 text-slate-400'}`}>
                                            <span className="material-symbols-outlined text-3xl">
                                                {i === 0 ? 'terminal' : i === 1 ? 'precision_manufacturing' : 'draw'}
                                            </span>
                                        </div>
                                        <h4 className="text-xl font-black text-slate-800 mb-4 font-headline">{career}</h4>
                                        <p className="text-sm text-slate-500 font-bold mb-10 flex-grow leading-relaxed italic">
                                            {i === 0 ? 'Design and maintain complex software systems for high-impact global applications.' : 
                                             i === 1 ? 'Engineering robotic solutions for multi-planetary surface exploration or industrial automation.' : 
                                             'Visual problem solving through modern UI/UX principles and brand identity architecture.'}
                                        </p>
                                        <button className={`w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl transition-all ${i === 1 ? 'bg-primary text-white shadow-primary/20' : 'bg-slate-50 text-slate-400 hover:bg-slate-900 hover:text-white'}`}>
                                            Analyze Path
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Section 5: Skill Development Progress */}
                        <div className="md:col-span-8 bg-white rounded-[3rem] p-12 shadow-sm border border-slate-100">
                            <div className="flex justify-between items-center mb-10">
                                <h3 className="text-lg font-black text-slate-800 uppercase tracking-widest italic">Skill Velocity Index</h3>
                                <div className="flex gap-6">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2.5 h-2.5 rounded-full bg-primary"></div>
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Aptitude</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2.5 h-2.5 rounded-full bg-slate-200"></div>
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Benchmark</span>
                                    </div>
                                </div>
                            </div>
                            <div className="h-64 flex items-end justify-between gap-4 px-2">
                                {[32, 40, 52, 36, 48, 64].map((h, i) => (
                                    <div key={i} className="w-full h-full bg-slate-50 rounded-2xl relative group flex flex-col justify-end overflow-hidden">
                                        <div className="absolute bottom-0 w-full bg-primary/20 h-full"></div>
                                        <div className="w-full bg-primary rounded-2xl transition-all duration-1000 group-hover:brightness-110 shadow-lg" style={{ height: `${h}%` }}>
                                            <div className="w-full h-1 bg-white/20"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-between mt-8 text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] px-4 italic">
                                {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map(m => <span key={m}>{m}</span>)}
                            </div>
                        </div>

                        {/* Section 6: AI Insights */}
                        <div className="md:col-span-4 bg-gradient-to-br from-indigo-600 to-violet-700 text-white rounded-[3rem] p-12 shadow-xl shadow-indigo-500/20 flex flex-col justify-between border border-transparent relative overflow-hidden group">
                            <div className="relative z-10">
                                <div className="bg-white/10 w-14 h-14 rounded-2xl flex items-center justify-center mb-10 backdrop-blur-md border border-white/10">
                                    <span className="material-symbols-outlined text-white text-3xl font-variation-fill">auto_awesome</span>
                                </div>
                                <h3 className="text-2xl font-black mb-6 italic tracking-tighter">Serene Guardian Insights</h3>
                                <p className="text-white/80 leading-relaxed italic text-lg font-bold">"{childName.split(' ')[0]} demonstrates superior cognitive patterns in logical architecture. I recommend focusing on advanced Python frameworks to sharpen this edge."</p>
                            </div>
                            <div className="mt-12 pt-8 border-t border-white/10 relative z-10">
                                <button onClick={() => navigate('/parent/progress')} className="inline-flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-white hover:gap-6 transition-all">
                                    Full Career Audit
                                    <span className="material-symbols-outlined text-sm font-black">arrow_forward</span>
                                </button>
                            </div>
                            <span className="material-symbols-outlined absolute -bottom-10 -right-10 text-white/5 text-[15rem] rotate-12 group-hover:rotate-0 transition-transform duration-1000">neurology</span>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default ParentDashboard;
    );
};

export default ParentDashboard;
