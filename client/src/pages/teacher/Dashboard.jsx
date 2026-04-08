import React, { useState, useEffect } from 'react';
import { useOutletContext, Link } from 'react-router-dom';

const TeacherDashboard = () => {
    const { data, fetchDashboard } = useOutletContext();
    const [recentActivity, setRecentActivity] = useState([]);
    const [quizTitle, setQuizTitle] = useState('');
    const [selectedParams, setSelectedParams] = useState(['Robotics']);
    const [questionCount, setQuestionCount] = useState(10);
    const [isGenerating, setIsGenerating] = useState(false);
    const [message, setMessage] = useState('');

    const availableParams = ["Robotics", "AI & ML", "Data Ethics", "Coding", "Cloud Computing", "Cyber Security", "Finance", "Healthcare"];

    useEffect(() => {
        const fetchStudents = async () => {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/teacher/students', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const results = await res.json();
                setRecentActivity(results);
            }
        };
        fetchStudents();
    }, []);

    const handleCreateQuiz = async (e) => {
        e.preventDefault();
        setIsGenerating(true);
        setMessage('');
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/teacher/generate-quiz', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    title: quizTitle,
                    parameters: selectedParams,
                    questionCount
                })
            });
            const result = await res.json();
            if (res.ok) {
                setMessage('Success: AI Quiz generated and added to library!');
                setQuizTitle('');
            } else {
                setMessage(`Error: ${result.message}`);
            }
        } catch (err) {
            setMessage('Error: Failed to connect to AI service.');
        } finally {
            setIsGenerating(false);
        }
    };

    const toggleParam = (param) => {
        if (selectedParams.includes(param)) {
            setSelectedParams(selectedParams.filter(p => p !== param));
        } else {
            setSelectedParams([...selectedParams, param]);
        }
    };

    const stats = data?.stats || {
        totalStudents: 0,
        activeStudents: 0,
        participationRate: '0%',
        avgPerformance: '0%'
    };

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
            {/* Stats Overview */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Total Students', value: stats.totalStudents, color: 'border-primary', trend: '+4 from last month', icon: 'trending_up' },
                    { label: 'Active Students', value: stats.activeStudents, color: 'border-tertiary', info: 'Engaging in career pathing' },
                    { label: 'Quiz Participation', value: stats.participationRate, color: 'border-primary-container', progress: stats.participationRate },
                    { label: 'Avg. Performance', value: stats.avgPerformance, color: 'border-secondary', info: 'Classroom readiness index' }
                ].map((stat, idx) => (
                    <div key={idx} className={`bg-white p-6 rounded-2xl shadow-xl shadow-slate-200/50 border-l-4 ${stat.color} flex flex-col justify-between h-40`}>
                        <span className="text-[10px] font-black uppercase tracking-[0.1em] text-slate-400">{stat.label}</span>
                        <h3 className="text-4xl font-black text-slate-800">{stat.value}</h3>
                        {stat.trend ? (
                            <div className="flex items-center gap-1 text-primary">
                                <span className="material-symbols-outlined text-sm font-black">{stat.icon}</span>
                                <span className="text-[10px] font-black">{stat.trend}</span>
                            </div>
                        ) : stat.progress ? (
                            <div className="w-full bg-slate-100 h-2 rounded-full mt-2 overflow-hidden border border-slate-50">
                                <div className="bg-primary h-full rounded-full transition-all duration-1000" style={{ width: stat.progress }}></div>
                            </div>
                        ) : (
                            <p className="text-[10px] text-slate-400 font-bold">{stat.info}</p>
                        )}
                    </div>
                ))}
            </section>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                {/* Left Column: Activity & Quiz Form */}
                <div className="md:col-span-8 space-y-8">
                    {/* Recent Activity Table */}
                    <div className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-50">
                        <div className="flex justify-between items-center mb-8">
                            <h4 className="text-xl font-black text-slate-800 tracking-tight italic">Recent Student Activity</h4>
                            <Link to="/teacher/students" className="text-primary text-xs font-black uppercase tracking-widest hover:underline flex items-center gap-1 group/roster">
                                View Full Roster <span className="material-symbols-outlined text-sm group-hover/roster:translate-x-1 transition-transform">chevron_right</span>
                            </Link>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                        <th className="pb-4">Student Name</th>
                                        <th className="pb-4">Class</th>
                                        <th className="pb-4 text-center">Status</th>
                                        <th className="pb-4">Interest Area</th>
                                        <th className="pb-4 text-right pr-4">Score</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {recentActivity.map((student, i) => (
                                        <tr key={i} className="group hover:bg-slate-50/50 transition-colors">
                                            <td className="py-5 flex items-center gap-4">
                                                <div className="w-9 h-9 rounded-xl bg-primary/5 text-primary flex items-center justify-center text-xs font-black shadow-sm group-hover:scale-110 transition-transform">
                                                    {student.name.charAt(0)}
                                                </div>
                                                <span className="font-bold text-slate-700">{student.name}</span>
                                            </td>
                                            <td className="py-5 text-sm font-medium text-slate-500">{student.class}</td>
                                            <td className="py-5 text-center">
                                                <span className="px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-600 border border-emerald-100 italic">
                                                    {student.status}
                                                </span>
                                            </td>
                                            <td className="py-5">
                                                <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-bold uppercase tracking-tight">
                                                    {student.interest}
                                                </span>
                                            </td>
                                            <td className="py-5 text-right font-black text-primary pr-4">{student.score}</td>
                                        </tr>
                                    ))}
                                    {recentActivity.length === 0 && (
                                        <tr><td colSpan="5" className="py-20 text-center text-slate-400 font-bold italic">No recent assessment activity found in your school.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* AI Quiz Creation Form */}
                    <div className="bg-white rounded-3xl p-10 shadow-xl shadow-slate-200/50 border border-slate-50 relative overflow-hidden group">
                        <div className="relative z-10">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary animate-pulse">
                                    <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                                </div>
                                <div>
                                    <h4 className="text-2xl font-black text-slate-800 tracking-tight leading-none italic">Create AI-Powered Quiz</h4>
                                    <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1">Harness Gemini 1.5 Pro for Assessments</p>
                                </div>
                            </div>

                            <form onSubmit={handleCreateQuiz} className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Quiz Title</label>
                                            <input 
                                                required
                                                className="w-full border-none bg-slate-50 rounded-2xl p-4 text-base font-bold text-slate-700 focus:ring-4 focus:ring-primary/10 transition-all outline-none" 
                                                placeholder="e.g. Modern Robotics Fundamentals" 
                                                type="text"
                                                value={quizTitle}
                                                onChange={(e) => setQuizTitle(e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Target Parameters</label>
                                            <div className="flex flex-wrap gap-2">
                                                {availableParams.map(param => (
                                                    <button
                                                        key={param}
                                                        type="button"
                                                        onClick={() => toggleParam(param)}
                                                        className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border ${selectedParams.includes(param) ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20 scale-105' : 'bg-slate-50 text-slate-400 border-slate-200 hover:border-primary/50'}`}
                                                    >
                                                        {param}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Questions Cluster</label>
                                            <select 
                                                className="w-full border-none bg-slate-50 rounded-2xl p-4 text-base font-bold text-slate-700 focus:ring-4 focus:ring-primary/10 transition-all outline-none appearance-none"
                                                value={questionCount}
                                                onChange={(e) => setQuestionCount(parseInt(e.target.value))}
                                            >
                                                <option value={10}>Standard (10 Qns)</option>
                                                <option value={24}>Skill Deep Dive (24 Qns)</option>
                                                <option value={72}>NEP Standard (72 Qns)</option>
                                            </select>
                                        </div>
                                        <div className="flex flex-col gap-3 pt-4">
                                            <button 
                                                type="submit"
                                                disabled={isGenerating}
                                                className="w-full py-5 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                                            >
                                                {isGenerating ? 'Gemini is Synthesizing...' : 'Generate with AI Engine'}
                                            </button>
                                            {message && (
                                                <p className={`text-[10px] font-black uppercase tracking-widest text-center ${message.startsWith('Success') ? 'text-emerald-500' : 'text-error-dim'}`}>{message}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <span className="material-symbols-outlined absolute -bottom-10 -right-10 text-primary/5 text-[20rem] rotate-12 group-hover:rotate-0 transition-transform duration-1000">auto_awesome</span>
                    </div>
                </div>

                {/* Right Column: AI Insights & Events */}
                <div className="md:col-span-4 space-y-8">
                    {/* Career Insights */}
                    <div className="bg-gradient-to-br from-indigo-500 to-primary p-8 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-6">
                                <span className="material-symbols-outlined text-white/50 animate-spin-slow">psychology</span>
                                <h5 className="text-[10px] font-black uppercase tracking-widest text-white/70">AI Class Pulse</h5>
                            </div>
                            <p className="text-xl font-black font-headline tracking-tight leading-relaxed italic">
                                "68% of students in {data?.teacherProfile?.schoolName || 'your school'} show a high natural affinity for AI & Mechanics. Recommendation: Launch a Project-Based Learning module in Digital Ethics."
                            </p>
                        </div>
                        <span className="material-symbols-outlined absolute -bottom-10 -right-10 text-white/10 text-[15rem] rotate-12 group-hover:rotate-0 transition-transform duration-1000">hub</span>
                    </div>

                    {/* Interest Distribution */}
                    <div className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-50">
                        <h5 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-8 leading-none">Interest Heatmap</h5>
                        <div className="space-y-6">
                            {[
                                { label: 'Tech & AI', value: 42, color: 'bg-primary' },
                                { label: 'Creative Arts', value: 28, color: 'bg-indigo-500' },
                                { label: 'Commerce', value: 15, color: 'bg-amber-500' },
                                { label: 'Science', value: 15, color: 'bg-slate-400' }
                            ].map(item => (
                                <div key={item.label} className="space-y-2">
                                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-600">
                                        <span>{item.label}</span>
                                        <span className="text-primary">{item.value}%</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-slate-50 rounded-full border border-slate-100 overflow-hidden">
                                        <div className={`h-full transition-all duration-1000 ${item.color}`} style={{ width: `${item.value}%` }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Upcoming Events */}
                    <div className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-50">
                        <div className="flex justify-between items-center mb-8">
                            <h5 className="text-xs font-black uppercase tracking-widest text-slate-400 leading-none">Upcoming Milestones</h5>
                            <button className="material-symbols-outlined text-primary hover:scale-125 transition-transform">add_circle</button>
                        </div>
                        <div className="space-y-6">
                            {[
                                { date: '24', month: 'OCT', title: 'Robotics Olympiad', sub: '45 Students Registered', color: 'bg-primary/10 text-primary' },
                                { date: '02', month: 'NOV', title: 'Career Alignment', sub: 'Class 10 Intensive', color: 'bg-indigo-50 text-indigo-600' }
                            ].map((evt, i) => (
                                <div key={i} className="flex gap-5 group cursor-pointer">
                                    <div className={`w-14 h-14 rounded-2xl shrink-0 flex flex-col items-center justify-center border border-slate-100 ${evt.color}`}>
                                        <span className="text-lg font-black leading-none">{evt.date}</span>
                                        <span className="text-[8px] font-black uppercase tracking-widest mt-1">{evt.month}</span>
                                    </div>
                                    <div className="flex flex-col justify-center">
                                        <p className="text-sm font-black text-slate-700 leading-none mb-1 group-hover:text-primary transition-colors italic">{evt.title}</p>
                                        <p className="text-[10px] font-bold text-slate-400 tracking-tight">{evt.sub}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="w-full mt-10 py-4 border-2 border-dashed border-slate-100 text-slate-400 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:border-primary/30 hover:text-primary transition-all">
                            New Campus Event
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeacherDashboard;
