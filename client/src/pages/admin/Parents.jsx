import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Loader from '../../components/common/Loader';

const AdminParents = () => {
    const [parents, setParents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    const timeAgo = (d) => { const s=Math.floor((new Date()-new Date(d))/1000); if(s<60) return `${s}s ago`; const m=Math.floor(s/60); if(m<60) return `${m}m ago`; const h=Math.floor(m/60); if(h<24) return `${h}h ago`; return `${Math.floor(h/24)}d ago`; };

    useEffect(() => { const t = setTimeout(fetch, 400); return () => clearTimeout(t); }, [search]);

    const fetch = async () => {
        try { setLoading(true); const res = await axios.get('/api/admin/parents', { headers, params: { search } }); setParents(res.data); }
        catch (err) { console.error(err); } finally { setLoading(false); }
    };

    useEffect(() => { fetch(); }, []);

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-headline font-black text-slate-800">Parent Management</h2>
                    <p className="text-slate-500 mt-1">{parents.length} parents registered</p>
                </div>
                <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                    <input type="text" placeholder="Search parents..." value={search} onChange={e=>setSearch(e.target.value)}
                        className="pl-11 pr-5 py-2.5 bg-white border border-slate-200 rounded-2xl w-72 text-sm font-medium focus:ring-2 focus:ring-blue-500/20 outline-none" />
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                {[
                    { label: 'Total Parents', value: parents.length, icon: 'family_restroom', color: 'indigo' },
                    { label: 'Children Linked', value: parents.filter(p=>p.profile?.childName).length, icon: 'child_care', color: 'blue' },
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
                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50">
                                <tr>{['Parent', 'Child Name', 'Child Grade', 'Notifications', 'Joined'].map(h=>(
                                    <th key={h} className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">{h}</th>
                                ))}</tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {parents.map(p => (
                                    <tr key={p._id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-xs">
                                                    {p.name?.split(' ').map(n=>n[0]).join('').toUpperCase().slice(0,2)}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-slate-800">{p.name}</p>
                                                    <p className="text-xs text-slate-400">{p.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-700 font-medium">{p.profile?.childName || '—'}</td>
                                        <td className="px-6 py-4"><span className="text-xs px-2 py-1 bg-indigo-50 text-indigo-600 rounded-full font-bold">{p.profile?.childGrade || '—'}</span></td>
                                        <td className="px-6 py-4">
                                            <span className={`text-[10px] font-black px-2 py-1 rounded-full ${p.profile?.notifyOnQuiz ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                                                {p.profile?.notifyOnQuiz ? 'Enabled' : 'Disabled'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-xs text-slate-400">{timeAgo(p.createdAt)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {parents.length === 0 && (
                            <div className="py-16 text-center text-slate-300">
                                <span className="material-symbols-outlined text-4xl">family_restroom</span>
                                <p className="font-bold mt-2">No parents found</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminParents;
