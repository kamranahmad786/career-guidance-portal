import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Loader from '../../components/common/Loader';

const AdminNotifications = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [form, setForm] = useState({ title: '', message: '', targetRole: 'all', type: 'system' });
    const [successMsg, setSuccessMsg] = useState('');
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    const timeAgo = (d) => { const s=Math.floor((new Date()-new Date(d))/1000); if(s<60) return `${s}s ago`; const m=Math.floor(s/60); if(m<60) return `${m}m ago`; const h=Math.floor(m/60); if(h<24) return `${h}h ago`; return `${Math.floor(h/24)}d ago`; };

    useEffect(() => { fetchNotifications(); }, []);
    const fetchNotifications = async () => {
        try { setLoading(true); const res = await axios.get('/api/admin/notifications', { headers }); setData(res.data); }
        catch (err) { console.error(err); } finally { setLoading(false); }
    };

    const handleBroadcast = async (e) => {
        e.preventDefault();
        if (!form.title || !form.message) return;
        try {
            setSending(true);
            const res = await axios.post('/api/admin/notifications/broadcast', form, { headers });
            setSuccessMsg(res.data.message);
            setForm({ title: '', message: '', targetRole: 'all', type: 'system' });
            setTimeout(() => setSuccessMsg(''), 4000);
        } catch (err) { alert(err.response?.data?.message || 'Failed to send'); }
        finally { setSending(false); }
    };

    const typeColors = { quiz_complete:'bg-blue-50 text-blue-600', recommendation:'bg-violet-50 text-violet-600', system:'bg-slate-100 text-slate-600', achievement:'bg-amber-50 text-amber-600' };
    const typeIcons = { quiz_complete:'quiz', recommendation:'auto_awesome', system:'notifications', achievement:'emoji_events' };

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-headline font-black text-slate-800">Notifications Center</h2>
                <p className="text-slate-500 mt-1">Broadcast messages and view system notification history</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Broadcast Form */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                    <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2">
                        <span className="material-symbols-outlined text-blue-600">campaign</span> Broadcast Message
                    </h3>
                    {successMsg && (
                        <div className="mb-4 p-3 bg-emerald-50 text-emerald-700 rounded-xl text-sm font-bold flex items-center gap-2">
                            <span className="material-symbols-outlined text-sm">check_circle</span>{successMsg}
                        </div>
                    )}
                    <form onSubmit={handleBroadcast} className="space-y-4">
                        <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">Target Role</label>
                            <select value={form.targetRole} onChange={e=>setForm({...form,targetRole:e.target.value})}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-blue-500/20 outline-none">
                                <option value="all">All Users</option>
                                <option value="Student">Students Only</option>
                                <option value="Teacher">Teachers Only</option>
                                <option value="Parent">Parents Only</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">Type</label>
                            <select value={form.type} onChange={e=>setForm({...form,type:e.target.value})}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-blue-500/20 outline-none">
                                <option value="system">System</option>
                                <option value="achievement">Achievement</option>
                                <option value="recommendation">Recommendation</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">Title</label>
                            <input type="text" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} required
                                placeholder="Notification title..." className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-blue-500/20 outline-none" />
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">Message</label>
                            <textarea rows={4} value={form.message} onChange={e=>setForm({...form,message:e.target.value})} required
                                placeholder="Your message to users..." className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-blue-500/20 outline-none resize-none" />
                        </div>
                        <button type="submit" disabled={sending}
                            className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black text-sm rounded-xl hover:opacity-90 active:scale-95 transition-all disabled:opacity-60">
                            {sending ? 'Sending...' : 'Send Broadcast'}
                        </button>
                    </form>
                </div>

                {/* Notification History */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-black text-slate-800">System Activity</h3>
                        {data?.unreadCount > 0 && (
                            <span className="px-3 py-1 bg-blue-600 text-white text-xs font-black rounded-full">{data.unreadCount} unread</span>
                        )}
                    </div>
                    {loading ? <Loader /> : (
                        <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
                            {(data?.notifications || []).map(n => (
                                <div key={n._id} className={`flex gap-4 p-4 rounded-xl border transition-all ${n.isRead ? 'bg-slate-50/50 border-slate-50' : 'bg-blue-50/40 border-blue-100/50'}`}>
                                    <div className={`w-9 h-9 rounded-xl ${typeColors[n.type] || 'bg-slate-100 text-slate-500'} flex items-center justify-center shrink-0`}>
                                        <span className="material-symbols-outlined text-lg" style={{fontVariationSettings:"'FILL' 1"}}>{typeIcons[n.type] || 'notifications'}</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2">
                                            <p className="text-sm font-bold text-slate-800 leading-tight">{n.title}</p>
                                            {!n.isRead && <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0 mt-1"></span>}
                                        </div>
                                        <p className="text-xs text-slate-500 mt-0.5">{n.message}</p>
                                        <div className="flex items-center gap-3 mt-1.5">
                                            <span className="text-[10px] text-slate-400 font-bold">{n.recipient?.name || 'System'}</span>
                                            <span className="text-[10px] text-slate-300">•</span>
                                            <span className="text-[10px] text-slate-400 font-bold">{timeAgo(n.createdAt)}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {!data?.notifications?.length && (
                                <div className="py-12 text-center text-slate-300">
                                    <span className="material-symbols-outlined text-4xl">notifications_off</span>
                                    <p className="font-bold mt-2">No notifications yet</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminNotifications;
