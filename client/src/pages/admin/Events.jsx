import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Loader from '../../components/common/Loader';

const AdminEvents = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    useEffect(() => { fetchEvents(); }, []);
    const fetchEvents = async () => {
        try { setLoading(true); const res = await axios.get('/api/admin/events', { headers }); setEvents(res.data); }
        catch (err) { console.error(err); } finally { setLoading(false); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this event?')) return;
        await axios.delete(`/api/admin/events/${id}`, { headers });
        setEvents(events.filter(e => e._id !== id));
    };

    const filtered = filter === 'all' ? events : events.filter(e => e.status === filter);
    const statusColors = { Upcoming:'bg-blue-50 text-blue-600', Completed:'bg-emerald-50 text-emerald-600', Cancelled:'bg-red-50 text-red-600' };
    const typeColors = { Workshop:'bg-violet-50 text-violet-600', Seminar:'bg-indigo-50 text-indigo-600', 'Career Day':'bg-amber-50 text-amber-600', 'Skill Lab':'bg-sky-50 text-sky-600', Olympiad:'bg-rose-50 text-rose-600' };

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-headline font-black text-slate-800">Activities & Events</h2>
                <p className="text-slate-500 mt-1">{events.length} events in the system</p>
            </div>

            <div className="grid grid-cols-3 gap-4">
                {['Upcoming','Completed','Cancelled'].map(s => (
                    <div key={s} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                        <p className="text-2xl font-black text-slate-800">{events.filter(e=>e.status===s).length}</p>
                        <p className={`text-xs font-black uppercase tracking-widest mt-1 ${s==='Upcoming'?'text-blue-500':s==='Completed'?'text-emerald-500':'text-red-400'}`}>{s}</p>
                    </div>
                ))}
            </div>

            <div className="flex gap-2">
                {['all','Upcoming','Completed','Cancelled'].map(s => (
                    <button key={s} onClick={()=>setFilter(s)}
                        className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${filter===s?'bg-slate-900 text-white':'bg-white border border-slate-200 text-slate-500'}`}>
                        {s==='all'?'All':s}
                    </button>
                ))}
            </div>

            {loading ? <Loader /> : (
                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50">
                                <tr>{['Event','Teacher','Type','Date','Location','Status',''].map(h=>(
                                    <th key={h} className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">{h}</th>
                                ))}</tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filtered.map(e => (
                                    <tr key={e._id} className="hover:bg-slate-50/50 group transition-colors">
                                        <td className="px-6 py-4">
                                            <p className="text-sm font-bold text-slate-800">{e.title}</p>
                                            <p className="text-xs text-slate-400 line-clamp-1">{e.description}</p>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600">{e.teacherId?.name || '—'}</td>
                                        <td className="px-6 py-4">
                                            <span className={`text-[10px] font-black px-2 py-1 rounded-full ${typeColors[e.type]||'bg-slate-100 text-slate-500'}`}>{e.type}</span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600">{new Date(e.date).toLocaleDateString('en-IN', {day:'2-digit',month:'short',year:'numeric'})}</td>
                                        <td className="px-6 py-4 text-sm text-slate-500">{e.location}</td>
                                        <td className="px-6 py-4">
                                            <span className={`text-[10px] font-black px-2 py-1 rounded-full ${statusColors[e.status]||''}`}>{e.status}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button onClick={()=>handleDelete(e._id)} className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                                                <span className="material-symbols-outlined text-lg">delete</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filtered.length === 0 && (
                            <div className="py-16 text-center text-slate-300">
                                <span className="material-symbols-outlined text-4xl">event</span>
                                <p className="font-bold mt-2">No events found</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminEvents;
