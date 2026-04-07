import React, { useState } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';

const ParentNotifications = () => {
    const { data, fetchDashboard } = useOutletContext();
    const navigate = useNavigate();
    const [markingRead, setMarkingRead] = useState(null);

    const markAsRead = async (id) => {
        setMarkingRead(id);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`/api/notifications/read/${id}`, {
                method: 'PATCH',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                fetchDashboard(); // Refresh global layout data
            }
        } catch (err) {
            console.error(err);
        } finally {
            setMarkingRead(null);
        }
    };

    const markAllRead = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/notifications/read-all', {
                method: 'PATCH',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) fetchDashboard();
        } catch (err) {
            console.error(err);
        }
    };

    const notifications = data?.notifications || [];
    const unreadCount = notifications.filter(n => !n.isRead).length;

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-right-6 duration-500">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-black text-slate-800 tracking-tight italic">Alert Center</h2>
                    <p className="text-slate-500 font-medium mt-1">Status: {unreadCount > 0 ? `${unreadCount} Unread Alerts` : 'System Synchronized'}</p>
                </div>
                {unreadCount > 0 && (
                    <button 
                        onClick={markAllRead}
                        className="text-primary font-black text-xs uppercase tracking-widest hover:underline flex items-center gap-2 group"
                    >
                        Mark All as Read
                        <span className="material-symbols-outlined text-sm group-hover:rotate-12 transition-transform">done_all</span>
                    </button>
                )}
            </div>

            <div className="space-y-4">
                {notifications.map((notif, i) => (
                    <div 
                        key={i} 
                        onClick={() => !notif.isRead && markAsRead(notif._id)}
                        className={`p-8 rounded-[2.5rem] border flex items-center justify-between group transition-all cursor-pointer ${notif.isRead ? 'bg-white border-slate-100 opacity-60 grayscale-[0.2]' : 'bg-primary/5 border-primary/20 shadow-2xl shadow-primary/5 ring-1 ring-primary/20 scale-[1.01]'}`}
                    >
                        <div className="flex items-center gap-8">
                            <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center transition-transform group-hover:scale-110 ${notif.isRead ? 'bg-slate-50 text-slate-400' : 'bg-white text-primary shadow-xl shadow-primary/10'}`}>
                                <span className="material-symbols-outlined text-3xl">{notif.type === 'quiz_complete' ? 'quiz' : 'notifications_active'}</span>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-black uppercase text-primary tracking-widest opacity-60 leading-none mb-1">
                                    {new Date(notif.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' })}
                                </p>
                                <h5 className={`text-xl tracking-tight leading-tight ${notif.isRead ? 'text-slate-500' : 'text-slate-900 font-black'}`}>
                                    {notif.title}
                                </h5>
                                <p className="text-sm text-slate-500 font-medium max-w-md">{notif.message}</p>
                            </div>
                        </div>
                        <div className="flex flex-col items-end gap-3">
                            {!notif.isRead ? (
                                <div className="w-3 h-3 rounded-full bg-primary animate-pulse shadow-glow shadow-primary/50"></div>
                            ) : (
                                <span className="material-symbols-outlined text-emerald-500 text-sm">check_circle</span>
                            )}
                            {notif.link && (
                                <button 
                                    onClick={(e) => { e.stopPropagation(); navigate(notif.link); }}
                                    className="text-[10px] font-black uppercase text-primary tracking-widest hover:underline flex items-center gap-1"
                                >
                                    Details
                                    <span className="material-symbols-outlined text-[10px]">arrow_forward</span>
                                </button>
                            )}
                        </div>
                    </div>
                ))}

                {notifications.length === 0 && (
                    <div className="text-center py-32 bg-slate-50/50 rounded-[4rem] border border-slate-100 border-dashed">
                        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-8 grayscale opacity-20">
                            <span className="material-symbols-outlined text-5xl">notifications_off</span>
                        </div>
                        <p className="text-xl font-bold tracking-tight text-slate-400 font-headline italic">No alerts recorded yet.</p>
                        <p className="text-sm font-medium text-slate-400 mt-2">When Alex completes an assessment, you will be notified here immediately.</p>
                    </div>
                )}
            </div>

            {/* AI Guardian Insight Block */}
            <div className="p-10 bg-slate-900 rounded-[3rem] text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
                <div className="flex items-center gap-8">
                    <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-md">
                        <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                    </div>
                    <div>
                        <h4 className="text-lg font-black italic tracking-tight mb-1">Guardian Tip</h4>
                        <p className="text-white/70 font-medium max-w-lg leading-relaxed italic">"Keep notifications active to participate in real-time academic review cycles with your child. Engagement boosts learning outcomes by 32%."</p>
                    </div>
                </div>
                <button 
                    onClick={() => navigate('/parent/dashboard')}
                    className="px-8 py-4 bg-white text-slate-900 rounded-full font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all"
                >
                    Back Overview
                </button>
            </div>
        </div>
    );
};

export default ParentNotifications;
