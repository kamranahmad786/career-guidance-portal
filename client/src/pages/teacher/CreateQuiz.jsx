import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import Loader from '../../components/common/Loader';

const CreateQuiz = () => {
    const { data } = useOutletContext();
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isGenerating, setIsGenerating] = useState(false);
    const [message, setMessage] = useState('');
    
    // Form State
    const [title, setTitle] = useState('');
    const [selectedParams, setSelectedParams] = useState(['AI & ML']);
    const [count, setCount] = useState(10);

    const availableParams = [
        "Coding", "Robotics", "AI & ML", "Data Science", "Cyber Security", 
        "Finance", "Business", "Healthcare", "Design", "Music", "Digital Ethics"
    ];

    const fetchQuizzes = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/teacher/quizzes', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const result = await res.json();
                setQuizzes(result);
            }
        } catch (err) {
            console.error('Failed to fetch quizzes:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQuizzes();
    }, []);

    const handleGenerate = async (e) => {
        e.preventDefault();
        if (selectedParams.length === 0) return alert('Select at least one skill cluster!');
        
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
                    title: title || `AI Assessment - ${selectedParams[0]}`,
                    parameters: selectedParams,
                    questionCount: count
                })
            });
            
            if (res.ok) {
                setMessage('Success: AI Forge has synthesized a new assessment!');
                setTitle('');
                fetchQuizzes();
            } else {
                setMessage('Error: Gemini Brain is currently over-taxed. Please try again.');
            }
        } catch (err) {
            setMessage('Network Error: Assessment Forge disconnected.');
        } finally {
            setIsGenerating(false);
        }
    };

    const toggleParam = (p) => {
        if (selectedParams.includes(p)) {
            setSelectedParams(selectedParams.filter(item => item !== p));
        } else {
            setSelectedParams([...selectedParams, p]);
        }
    };

    if (loading) return <Loader />;

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
            {/* Page Header */}
            <section className="bg-white rounded-3xl p-10 border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
                <div>
                    <h2 className="text-4xl font-black text-slate-800 tracking-tight italic">AI Quiz Forge</h2>
                    <p className="text-slate-500 text-lg font-medium mt-1">Design specialized career aptitude assessments using Gemini 1.5 Pro.</p>
                </div>
                <div className="flex gap-4">
                    <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10">
                        <p className="text-[10px] font-black uppercase text-primary tracking-widest text-center">Active Tokens</p>
                        <p className="text-xl font-black text-slate-800 text-center uppercase tracking-tighter italic">Infinite</p>
                    </div>
                </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Left: Forge Form */}
                <div className="lg:col-span-8">
                    <div className="bg-white rounded-[3rem] p-12 shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden group">
                        <div className="relative z-10 space-y-10">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
                                    <span className="material-symbols-outlined text-3xl animate-pulse">auto_awesome</span>
                                </div>
                                <h3 className="text-2xl font-black text-slate-800 tracking-tight italic">Assessment Configuration</h3>
                            </div>

                            <form onSubmit={handleGenerate} className="space-y-10">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <div className="space-y-8">
                                        <div>
                                            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 ml-1">Assessment Identity</label>
                                            <input 
                                                required
                                                type="text"
                                                placeholder="e.g. Robotics & Cloud Foundations"
                                                className="w-full bg-slate-50 border-none rounded-2xl p-5 font-bold text-slate-700 focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                                                value={title}
                                                onChange={(e) => setTitle(e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 ml-1">Question Density</label>
                                            <select 
                                                className="w-full bg-slate-50 border-none rounded-2xl p-5 font-bold text-slate-700 focus:ring-4 focus:ring-primary/10 transition-all outline-none appearance-none"
                                                value={count}
                                                onChange={(e) => setCount(parseInt(e.target.value))}
                                            >
                                                <option value={10}>Standard Sprint (10 Qns)</option>
                                                <option value={24}>Deep Focus (24 Qns)</option>
                                                <option value={72}>Full NEP Assessment (72 Qns)</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="space-y-8">
                                        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 ml-1">Skill Clusters (Multi-Select)</label>
                                        <div className="flex flex-wrap gap-2">
                                            {availableParams.map(p => (
                                                <button
                                                    key={p}
                                                    type="button"
                                                    onClick={() => toggleParam(p)}
                                                    className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all
                                                        ${selectedParams.includes(p) ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20 scale-105' : 'bg-slate-50 text-slate-400 border-slate-100 hover:border-primary/40'}`}
                                                >
                                                    {p}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-slate-50">
                                    <button 
                                        type="submit"
                                        disabled={isGenerating}
                                        className="w-full py-6 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl hover:bg-primary transition-all disabled:opacity-50 group/btn flex items-center justify-center gap-3"
                                    >
                                        {isGenerating ? 'Synthesizing with Gemini Brain...' : 'Initiate AI Generation Engine'}
                                        {!isGenerating && <span className="material-symbols-outlined text-sm group-hover/btn:translate-x-1 transition-transform">bolt</span>}
                                    </button>
                                    {message && <p className={`mt-4 text-[10px] font-black uppercase tracking-widest text-center ${message.includes('Success') ? 'text-emerald-500' : 'text-error-dim'}`}>{message}</p>}
                                </div>
                            </form>
                        </div>
                        <span className="material-symbols-outlined absolute -bottom-10 -right-10 text-primary/5 text-[25rem] rotate-12 group-hover:rotate-0 transition-transform duration-1000">auto_awesome</span>
                    </div>
                </div>

                {/* Right: History */}
                <div className="lg:col-span-4">
                    <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl shadow-slate-100/50">
                        <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-8 ml-1 flex items-center gap-2">
                            <span className="material-symbols-outlined text-[16px]">history</span>
                            Recent Synthesis
                        </h4>
                        <div className="space-y-6">
                            {quizzes.map((q, i) => (
                                <div key={i} className="p-5 bg-slate-50/50 rounded-2xl border border-slate-100 hover:border-primary/30 transition-all cursor-pointer group">
                                    <div className="flex justify-between items-start mb-3">
                                        <span className="px-3 py-1 bg-white text-primary text-[8px] font-black uppercase tracking-widest rounded-lg shadow-sm border border-slate-100 italic">
                                            {q.parameter || 'Multi'}
                                        </span>
                                        <span className="text-[10px] font-bold text-slate-300 uppercase">{new Date(q.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <p className="font-black text-slate-700 tracking-tight leading-tight group-hover:text-primary transition-colors italic">{q.title}</p>
                                    <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-100/50">
                                        <div className="flex items-center gap-1">
                                            <span className="material-symbols-outlined text-[14px] text-slate-300">quiz</span>
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{q.questions?.length || 0} Qns</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {quizzes.length === 0 && (
                                <div className="py-20 text-center">
                                    <p className="text-slate-300 font-black uppercase tracking-widest italic text-[10px]">No History Found</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateQuiz;
