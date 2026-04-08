import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import Loader from '../../components/common/Loader';

const Notifications = () => {
    const { fetchDashboard } = useOutletContext();
    const [notifications, setNotifications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    const fetchNotifications = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/notifications', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setNotifications(data.notifications || []);
            }
        } catch (err) {
            console.error('Failed to fetch notifications:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const markAsRead = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`/api/notifications/${id}/read`, {
                method: 'PATCH',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                setNotifications(notifications.map(n => n._id === id ? { ...n, isRead: true } : n));
            }
        } catch (err) {
            console.error('Failed to mark as read:', err);
        }
    };

    const markAllRead = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/notifications/read-all', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                setNotifications(notifications.map(n => ({ ...n, isRead: true })));
            }
        } catch (err) {
            console.error('Failed to mark all as read:', err);
        }
    };

    const filteredNotifications = notifications.filter(n => {
        if (filter === 'unread') return !n.isRead;
        return true;
    });

    if (isLoading) return <Loader />;

    return (
        <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-6 duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                <div>
                    <h2 className="text-4xl font-black text-slate-800 tracking-tight italic">Educator Alerts</h2>
                    <p className="text-slate-500 font-medium mt-1">Real-time pulses from your school's career discovery ecosystem.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => setFilter('all')}
                        className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === 'all' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-white text-slate-400 border border-slate-100'}`}
                    >
                        School Feed
                    </button>
                    <button 
                        onClick={() => setFilter('unread')}
                        className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === 'unread' ? 'bg-error-fixed text-white border-none shadow-lg shadow-error/20' : 'bg-white text-slate-400 border border-slate-100'}`}
                    >
                         Pending
                    </button>
                    <button 
                        onClick={markAllRead}
                        className="ml-4 text-[10px] font-black text-primary uppercase tracking-widest hover:underline decoration-2 underline-offset-4"
                    >
                        Clear All
                    </button>
                </div>
            </div>

            {/* List */}
            <div className="space-y-4">
                {filteredNotifications.length > 0 ? (
                    filteredNotifications.map((notif) => (
                        <div 
                            key={notif._id} 
                            onClick={() => !notif.isRead && markAsRead(notif._id)}
                            className={`group relative p-6 rounded-[2.5rem] border transition-all cursor-pointer ${
                                notif.isRead 
                                ? 'bg-white/40 border-slate-50 opacity-70 hover:opacity-100' 
                                : 'bg-white border-primary/10 shadow-xl shadow-slate-200/40 hover:-translate-y-1'
                            }`}
                        >
                            <div className="flex gap-6 items-start">
                                <div className={`w-14 h-14 rounded-3xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:rotate-6 ${
                                    notif.isRead ? 'bg-slate-50 text-slate-300' : 'bg-primary/5 text-primary'
                                }`}>
                                    <span className="material-symbols-outlined text-2xl font-bold">
                                        {notif.type === 'achievement' ? 'military_tech' : (notif.type === 'system' ? 'hub' : 'sensors')}
                                    </span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start mb-1">
                                        <h4 className={`text-lg font-black tracking-tight truncate ${notif.isRead ? 'text-slate-500' : 'text-slate-800'}`}>
                                            {notif.title}
                                        </h4>
                                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest whitespace-nowrap">
                                            {new Date(notif.createdAt).toLocaleDateString('en-GB')}
                                        </span>
                                    </div>
                                    <p className={`text-sm font-semibold leading-relaxed ${notif.isRead ? 'text-slate-400' : 'text-slate-500'}`}>
                                        {notif.message}
                                    </p>
                                    
                                    {!notif.isRead && (
                                        <div className="absolute top-6 right-6 w-2.5 h-2.5 bg-primary rounded-full ring-4 ring-primary/10"></div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="py-24 bg-white/30 rounded-[3rem] border border-dashed border-slate-200 text-center">
                        <div className="w-20 h-20 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-6">
                            <span className="material-symbols-outlined text-4xl text-slate-200">mark_email_read</span>
                        </div>
                        <p className="text-slate-400 font-black uppercase tracking-widest text-[11px]">School ecosystem is silent</p>
                        <p className="text-slate-300 text-[10px] font-bold mt-2">All academic and career pulses are synchronized.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Notifications;
