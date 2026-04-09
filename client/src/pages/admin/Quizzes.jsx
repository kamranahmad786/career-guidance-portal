import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Loader from '../../components/common/Loader';

const AdminQuizzes = () => {
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    const timeAgo = (d) => { const s=Math.floor((new Date()-new Date(d))/1000); if(s<60) return `${s}s ago`; const m=Math.floor(s/60); if(m<60) return `${m}m ago`; const h=Math.floor(m/60); if(h<24) return `${h}h ago`; return `${Math.floor(h/24)}d ago`; };

    useEffect(() => { const t = setTimeout(fetchQuizzes, 400); return () => clearTimeout(t); }, [search]);
    useEffect(() => { fetchQuizzes(); }, []);

    const fetchQuizzes = async () => {
        try { setLoading(true); const res = await axios.get('/api/admin/quizzes', { headers, params: { search } }); setQuizzes(res.data); }
        catch (err) { console.error(err); } finally { setLoading(false); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this quiz?')) return;
        await axios.delete(`/api/admin/quizzes/${id}`, { headers });
        setQuizzes(quizzes.filter(q => q._id !== id));
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-headline font-black text-slate-800">Quiz Management</h2>
                    <p className="text-slate-500 mt-1">{quizzes.length} quizzes in the system</p>
                </div>
                <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                    <input type="text" placeholder="Search by parameter..." value={search} onChange={e=>setSearch(e.target.value)}
                        className="pl-11 pr-5 py-2.5 bg-white border border-slate-200 rounded-2xl w-72 text-sm font-medium focus:ring-2 focus:ring-blue-500/20 outline-none" />
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Total Quizzes', value: quizzes.length, icon: 'quiz', color: 'blue' },
                    { label: 'Total Questions', value: quizzes.reduce((s,q)=>s+q.questions.length,0), icon: 'help', color: 'indigo' },
                    { label: 'Unique Parameters', value: [...new Set(quizzes.map(q=>q.parameter))].length, icon: 'category', color: 'violet' },
                    { label: 'Total Attempts', value: quizzes.reduce((s,q)=>s+q.totalAttempts,0), icon: 'people', color: 'emerald' },
                ].map(c=>(
                    <div key={c.label} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                        <div className={`w-10 h-10 rounded-xl bg-${c.color}-50 text-${c.color}-600 flex items-center justify-center mb-3`}>
                            <span className="material-symbols-outlined" style={{fontVariationSettings:"'FILL' 1"}}>{c.icon}</span>
                        </div>
                        <p className="text-2xl font-black text-slate-800">{c.value}</p>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">{c.label}</p>
                    </div>
                ))}
            </div>

            {loading ? <Loader /> : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                    {quizzes.map(q => (
                        <div key={q._id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 group hover:shadow-md transition-all">
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                                    <span className="material-symbols-outlined" style={{fontVariationSettings:"'FILL' 1"}}>quiz</span>
                                </div>
                                <button onClick={() => handleDelete(q._id)}
                                    className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                                    <span className="material-symbols-outlined text-lg">delete</span>
                                </button>
                            </div>
                            <h3 className="text-base font-black text-slate-800 mb-1">{q.parameter}</h3>
                            <p className="text-xs text-slate-400 font-medium mb-4">{timeAgo(q.createdAt)}</p>
                            <div className="flex gap-4 pt-4 border-t border-slate-50">
                                <div className="text-center">
                                    <p className="text-xl font-black text-slate-800">{q.questions.length}</p>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase">Questions</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-xl font-black text-blue-600">{q.totalAttempts}</p>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase">Attempts</p>
                                </div>
                            </div>
                        </div>
                    ))}
                    {quizzes.length === 0 && (
                        <div className="col-span-3 py-16 text-center text-slate-300">
                            <span className="material-symbols-outlined text-4xl">quiz</span>
                            <p className="font-bold mt-2">No quizzes found</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AdminQuizzes;
