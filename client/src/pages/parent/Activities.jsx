import React, { useState } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';

const ParentActivities = () => {
    const { data } = useOutletContext();
    const navigate = useNavigate();
    const [reminders, setReminders] = useState({});
    const [toast, setToast] = useState({ show: false, message: '' });

    if (!data?.linked) return <div className="text-center py-20 text-slate-400 font-bold italic">Link a student to view their upcoming academic activities.</div>;

    const childName = data.childProfile?.name || "Alex";

    const activities = [
        { 
            id: 1, 
            day: '15', 
            month: 'May', 
            year: '2026',
            title: 'Science & Tech Fair', 
            subtitle: 'Annual Innovation Showcase', 
            time: '10:00 AM - 04:00 PM', 
            startTime: '1000',
            endTime: '1600',
            location: 'Main Auditorium',
            color: 'primary',
            desc: `${childName.split(' ')[0]} is presenting a project on "AI in Sustainable Energy". Guardian attendance is highly recommended.`
        },
        { 
            id: 2, 
            day: '02', 
            month: 'Jun', 
            year: '2026',
            title: 'Parent-Teacher Meet', 
            subtitle: 'Quarterly Academic Review', 
            time: '03:30 PM - 05:00 PM', 
            startTime: '1530',
            endTime: '1700',
            location: 'Classroom 10-A',
            color: 'indigo',
            desc: "Discussion regarding Q1 assessment trends and university preparation roadmap."
        },
        { 
            id: 3, 
            day: '12', 
            month: 'Jun', 
            year: '2026',
            title: 'Career Workshop', 
            subtitle: 'Industry Expert Session', 
            time: '09:00 AM - 12:00 PM', 
            startTime: '0900',
            endTime: '1200',
            location: 'Virtual via EduDisha Portal',
            color: 'amber',
            desc: "Exposure to emerging roles in Robotics and Quantum Computing."
        }
    ];

    const generateCalendarLink = (ev) => {
        const months = { 'Jan': '01', 'Feb': '02', 'Mar': '03', 'Apr': '04', 'May': '05', 'Jun': '06', 'Jul': '07', 'Aug': '08', 'Sep': '09', 'Oct': '10', 'Nov': '11', 'Dec': '12' };
        const dateStr = `${ev.year}${months[ev.month]}${ev.day.padStart(2, '0')}`;
        const start = `${dateStr}T${ev.startTime}00Z`;
        const end = `${dateStr}T${ev.endTime}00Z`;
        
        const url = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(ev.title)}&dates=${start}/${end}&details=${encodeURIComponent(ev.desc)}&location=${encodeURIComponent(ev.location)}`;
        window.open(url, '_blank');
        
        showToast(`Syncing "${ev.title}" to Calendar...`);
    };

    const toggleReminder = (id, title) => {
        setReminders(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
        showToast(!reminders[id] ? `Reminder set for "${title}"` : `Reminder removed for "${title}"`);
    };

    const showToast = (message) => {
        setToast({ show: true, message });
        setTimeout(() => setToast({ show: false, message: '' }), 3000);
    };

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-right-6 duration-500 pb-32 relative">
            
            {/* Toast Notification */}
            {toast.show && (
                <div className="fixed top-24 right-10 z-[100] animate-in slide-in-from-right-10">
                    <div className="bg-slate-900 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/10">
                        <span className="material-symbols-outlined text-primary text-xl">check_circle</span>
                        <span className="text-xs font-black uppercase tracking-widest">{toast.message}</span>
                    </div>
                </div>
            )}

            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-black text-slate-800 tracking-tight italic">Activity Schedule</h2>
                    <p className="text-slate-500 font-medium mt-1">Upcoming milestones and academic engagements for {childName}.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {activities.map((ev) => (
                    <div 
                        key={ev.id} 
                        className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100 flex flex-col md:flex-row gap-10 items-center group transition-all hover:bg-slate-50"
                    >
                        {/* Calendar Icon Block */}
                        <div className={`min-w-[120px] h-[120px] bg-${ev.color}/5 rounded-[2rem] border border-${ev.color}/10 flex flex-col items-center justify-center transition-transform group-hover:scale-110`}>
                            <span className={`text-4xl font-black text-${ev.color} leading-none mb-1`}>{ev.day}</span>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{ev.month}</span>
                            <span className="text-[9px] font-black text-slate-300 mt-2">{ev.year}</span>
                        </div>

                        {/* Event Details */}
                        <div className="flex-1 space-y-4">
                            <div>
                                <h4 className="text-2xl font-black text-slate-800 tracking-tight leading-none mb-2">{ev.title}</h4>
                                <p className="text-primary font-bold text-sm uppercase tracking-widest">{ev.subtitle}</p>
                            </div>
                            <p className="text-slate-500 font-medium leading-relaxed italic text-lg max-w-2xl">
                                "{ev.desc}"
                            </p>
                            <div className="flex flex-wrap gap-6 pt-2">
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-lg text-slate-300">schedule</span>
                                    <span className="text-[11px] font-black uppercase text-slate-500 tracking-widest">{ev.time}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-lg text-slate-300">location_on</span>
                                    <span className="text-[11px] font-black uppercase text-slate-500 tracking-widest">{ev.location}</span>
                                </div>
                            </div>
                        </div>

                        {/* Action Area */}
                        <div className="flex flex-col gap-3 min-w-[180px]">
                            <button 
                                onClick={() => generateCalendarLink(ev)}
                                className="w-full py-4 bg-primary text-white rounded-full font-black text-[10px] uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
                            >
                                <span className="material-symbols-outlined text-sm">calendar_add_on</span>
                                Add to Calendar
                            </button>
                            <button 
                                onClick={() => toggleReminder(ev.id, ev.title)}
                                className={`w-full py-4 rounded-full font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${reminders[ev.id] ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-white text-slate-400 border border-slate-100 hover:bg-slate-100 hover:text-slate-900'}`}
                            >
                                <span className="material-symbols-outlined text-sm">{reminders[ev.id] ? 'notifications_active' : 'notifications_paused'}</span>
                                {reminders[ev.id] ? 'Reminder Set' : 'Remind Me'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* AI Suggestion */}
            <div className="p-10 bg-slate-900 rounded-[3.5rem] text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl group-hover:scale-150 transition-all duration-[3000ms]"></div>
                <div className="flex items-center gap-8 relative z-10">
                    <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-md">
                        <span className="material-symbols-outlined text-primary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                    </div>
                    <div>
                        <h4 className="text-lg font-black italic tracking-tighter mb-1">Guardian Participation</h4>
                        <p className="text-white/60 font-medium max-w-lg leading-relaxed italic">
                            "Direct involvement in academic events increases student confidence and peer-group positioning. We recommend attending the Science Fair virtual stream."
                        </p>
                    </div>
                </div>
                <button 
                    onClick={() => navigate('/parent/dashboard')}
                    className="px-8 py-4 bg-white text-slate-900 rounded-full font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-2xl relative z-10"
                >
                    Back Overview
                </button>
            </div>
        </div>
    );
};

export default ParentActivities;
