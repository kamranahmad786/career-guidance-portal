import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const NotificationHub = () => {
    const [notifications, setNotifications] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    const fetchNotifications = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/notifications', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setNotifications(data.notifications || []);
                setUnreadCount(data.unreadCount || 0);
            }
        } catch (err) {
            console.error('Failed to fetch notifications:', err);
        }
    };

    useEffect(() => {
        fetchNotifications();
        // Refresh every 60 seconds
        const interval = setInterval(fetchNotifications, 60000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleRead = async (id, link) => {
        try {
            const token = localStorage.getItem('token');
            await fetch(`/api/notifications/${id}/read`, {
                method: 'PATCH',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setIsOpen(false);
            fetchNotifications();
            if (link) navigate(link);
        } catch (err) {
            console.error('Failed to mark read:', err);
        }
    };

    const handleReadAll = async () => {
        try {
            const token = localStorage.getItem('token');
            await fetch('/api/notifications/read-all', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            fetchNotifications();
        } catch (err) {
            console.error('Failed to mark all read:', err);
        }
    };

    const getRelativeTime = (date) => {
        const now = new Date();
        const past = new Date(date);
        const diff = Math.floor((now - past) / 1000);

        if (diff < 60) return 'Just now';
        if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
        return `${Math.floor(diff / 86400)}d ago`;
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-primary transition-all relative group"
            >
                <span className="material-symbols-outlined text-2xl group-hover:rotate-12 transition-transform">notifications</span>
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-error-dim text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white shadow-sm animate-bounce">
                        {unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-4 w-96 bg-white rounded-[2rem] shadow-2xl shadow-slate-200 border border-slate-100 overflow-hidden z-50 animate-in slide-in-from-top-4 duration-300">
                    <div className="px-8 py-6 bg-slate-50/50 border-b border-slate-100 flex justify-between items-center">
                        <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest italic">Live Updates</h3>
                        {unreadCount > 0 && (
                            <button 
                                onClick={handleReadAll}
                                className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline"
                            >
                                Mark All Read
                            </button>
                        )}
                    </div>

                    <div className="max-h-[32rem] overflow-y-auto">
                        {notifications.length > 0 ? (
                            <div className="divide-y divide-slate-50">
                                {notifications.map((n) => (
                                    <div 
                                        key={n._id}
                                        onClick={() => handleRead(n._id, n.link)}
                                        className={`px-8 py-6 hover:bg-slate-50 cursor-pointer transition-colors relative group
                                            ${!n.isRead ? 'bg-primary/[0.02]' : ''}`}
                                    >
                                        <div className="flex gap-4">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0
                                                ${n.type === 'quiz_complete' ? 'bg-emerald-50 text-emerald-500' : 
                                                  n.type === 'achievement' ? 'bg-amber-50 text-amber-500' : 'bg-primary/5 text-primary'}`}>
                                                <span className="material-symbols-outlined text-xl">
                                                    {n.type === 'quiz_complete' ? 'task_alt' : 
                                                     n.type === 'achievement' ? 'military_tech' : 'info'}
                                                </span>
                                            </div>
                                            <div className="flex-1">
                                                <p className={`text-xs font-black tracking-tight mb-1 ${!n.isRead ? 'text-slate-900' : 'text-slate-500'}`}>
                                                    {n.title}
                                                </p>
                                                <p className="text-[11px] font-bold text-slate-400 leading-relaxed line-clamp-2">
                                                    {n.message}
                                                </p>
                                                <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mt-2 italic">
                                                    {getRelativeTime(n.createdAt)}
                                                </p>
                                            </div>
                                            {!n.isRead && (
                                                <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-20 text-center">
                                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <span className="material-symbols-outlined text-3xl text-slate-200">notifications_off</span>
                                </div>
                                <p className="text-slate-300 font-black uppercase tracking-widest text-[10px] italic">No notifications yet</p>
                            </div>
                        )}
                    </div>

                    <div className="px-8 py-4 bg-slate-50 text-center border-t border-slate-100">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Powered by EduDisha AI</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationHub;
