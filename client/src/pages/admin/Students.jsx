import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Loader from '../../components/common/Loader';

const AdminStudents = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    const timeAgo = (d) => { const s = Math.floor((new Date()-new Date(d))/1000); if(s<60) return `${s}s ago`; const m=Math.floor(s/60); if(m<60) return `${m}m ago`; const h=Math.floor(m/60); if(h<24) return `${h}h ago`; return `${Math.floor(h/24)}d ago`; };

    useEffect(() => {
        const t = setTimeout(() => fetchStudents(), 400);
        return () => clearTimeout(t);
    }, [search]);

    const fetchStudents = async () => {
        try {
            setLoading(true);
            const res = await axios.get('/api/admin/students', { headers, params: { search } });
            setStudents(res.data);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-headline font-black text-slate-800">Student Management</h2>
                    <p className="text-slate-500 mt-1">{students.length} students registered</p>
                </div>
                <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
                    <input type="text" placeholder="Search students..." value={search} onChange={e => setSearch(e.target.value)}
                        className="pl-11 pr-5 py-2.5 bg-white border border-slate-200 rounded-2xl w-72 text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 outline-none" />
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Total Students', value: students.length, icon: 'school', color: 'blue' },
                    { label: 'Took Quiz', value: students.filter(s=>s.quizzesTaken>0).length, icon: 'quiz', color: 'indigo' },
                    { label: 'Got Recommendation', value: students.filter(s=>s.quizzesTaken>0).length, icon: 'auto_awesome', color: 'violet' },
                    { label: 'Avg Quiz Score', value: students.length > 0 ? `${Math.round(students.reduce((sum,s)=>sum+s.avgScore,0)/students.length)}%` : '0%', icon: 'grade', color: 'emerald' },
                ].map(c => (
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
                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50">
                                <tr>
                                    {['Student', 'School / Class', 'Interests', 'Quizzes', 'Avg Score', 'Joined'].map(h => (
                                        <th key={h} className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {students.map(s => (
                                    <tr key={s._id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-black text-xs">
                                                    {s.name?.split(' ').map(n=>n[0]).join('').toUpperCase().slice(0,2)}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-slate-800">{s.name}</p>
                                                    <p className="text-xs text-slate-400">{s.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600">
                                            <p className="font-medium">{s.profile?.schoolName || '—'}</p>
                                            <p className="text-xs text-slate-400">{s.profile?.className || '—'}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-wrap gap-1">
                                                {(s.profile?.interests || []).slice(0,2).map(i => (
                                                    <span key={i} className="text-[10px] px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full font-bold">{i}</span>
                                                ))}
                                                {!s.profile?.interests?.length && <span className="text-xs text-slate-300">None</span>}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`text-sm font-black ${s.quizzesTaken > 0 ? 'text-emerald-600' : 'text-slate-300'}`}>{s.quizzesTaken}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`text-sm font-black ${s.avgScore > 0 ? 'text-blue-600' : 'text-slate-300'}`}>{s.avgScore > 0 ? `${s.avgScore}%` : '—'}</span>
                                        </td>
                                        <td className="px-6 py-4 text-xs text-slate-400 font-medium">{timeAgo(s.createdAt)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {students.length === 0 && (
                            <div className="py-16 text-center text-slate-300">
                                <span className="material-symbols-outlined text-4xl">school</span>
                                <p className="font-bold mt-2">No students found</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminStudents;
