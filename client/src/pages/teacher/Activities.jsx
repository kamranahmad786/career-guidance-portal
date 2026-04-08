import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import Loader from '../../components/common/Loader';

const Activities = () => {
    const { data } = useOutletContext();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });
    
    // Form State
    const [showForm, setShowForm] = useState(false);
    const [newEvent, setNewEvent] = useState({
        title: '',
        description: '',
        date: '',
        location: 'School Auditorium',
        type: 'Workshop'
    });

    const fetchEvents = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/teacher/events', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const result = await res.json();
                setEvents(result);
            }
        } catch (err) {
            console.error('Failed to fetch events:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsCreating(true);
        setMessage({ text: '', type: '' });
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/teacher/events', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(newEvent)
            });
            if (res.ok) {
                setMessage({ text: 'Success: School Activity Activated!', type: 'success' });
                setTimeout(() => {
                    setShowForm(false);
                    setMessage({ text: '', type: '' });
                }, 2000);
                setNewEvent({ title: '', description: '', date: '', location: 'School Auditorium', type: 'Workshop' });
                fetchEvents();
            } else {
                setMessage({ text: 'Error: Failed to synchronize event.', type: 'error' });
            }
        } catch (err) {
            setMessage({ text: 'Network Error: Check synchronization status.', type: 'error' });
        } finally {
            setIsCreating(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this event?')) return;
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`/api/teacher/events/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) fetchEvents();
        } catch (err) {
            console.error('Failed to delete event:', err);
        }
    };

    if (loading) return <Loader />;

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
            {/* Header */}
            <section className="bg-white/80 backdrop-blur-xl rounded-3xl p-10 flex flex-col md:flex-row justify-between items-center gap-6 border border-slate-100 shadow-sm relative overflow-hidden">
                <div className="relative z-10">
                    <h2 className="text-4xl font-black text-slate-800 tracking-tight italic">School Activities</h2>
                    <p className="text-slate-500 text-lg font-medium mt-1">Manage career workshops, seminars, and counseling calendars.</p>
                </div>
                <button 
                    onClick={() => setShowForm(!showForm)}
                    className="relative z-10 px-8 py-4 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-3 group"
                >
                    <span className="material-symbols-outlined transition-transform group-hover:rotate-90">add</span>
                    {showForm ? 'Close Scheduler' : 'Schedule New Event'}
                </button>
                <span className="material-symbols-outlined absolute -bottom-10 -right-10 text-primary/5 text-[15rem] rotate-12 group-hover:rotate-0 transition-transform duration-1000">event</span>
            </section>

            {/* Event Scheduler Form */}
            {showForm && (
                <div className="bg-white rounded-[2.5rem] p-10 shadow-2xl shadow-primary/5 border border-primary/10 animate-in slide-in-from-top-4 duration-500">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 ml-1">Event Title</label>
                                    <input 
                                        required
                                        type="text"
                                        placeholder="e.g. Modern AI Career Pathing Seminar"
                                        className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold text-slate-700 focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                                        value={newEvent.title}
                                        onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 ml-1">Date & Time</label>
                                    <input 
                                        required
                                        type="datetime-local"
                                        className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold text-slate-700 focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                                        value={newEvent.date}
                                        onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                                    />
                                </div>
                            </div>
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 ml-1">Location</label>
                                    <input 
                                        required
                                        type="text"
                                        placeholder="e.g. Main Hall 101"
                                        className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold text-slate-700 focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                                        value={newEvent.location}
                                        onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 ml-1">Event Type</label>
                                    <select 
                                        className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold text-slate-700 focus:ring-4 focus:ring-primary/10 transition-all outline-none appearance-none"
                                        value={newEvent.type}
                                        onChange={(e) => setNewEvent({...newEvent, type: e.target.value})}
                                    >
                                        <option value="Workshop">Workshop</option>
                                        <option value="Seminar">Seminar</option>
                                        <option value="Career Day">Career Day</option>
                                        <option value="Skill Lab">Skill Lab</option>
                                        <option value="Olympiad">Olympiad</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 ml-1">Brief Description</label>
                            <textarea 
                                required
                                rows="3"
                                placeholder="What topics will be covered? Who is the speaker?"
                                className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold text-slate-700 focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                                value={newEvent.description}
                                onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                            ></textarea>
                        </div>
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-4">
                            {message.text && (
                                <p className={`text-[10px] font-black uppercase tracking-widest italic
                                    ${message.type === 'success' ? 'text-emerald-500' : 'text-error-dim'}`}>
                                    {message.text}
                                </p>
                            )}
                            <div className="flex-1"></div>
                            <button 
                                type="submit"
                                disabled={isCreating}
                                className="px-10 py-5 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-primary transition-all disabled:opacity-50"
                            >
                                {isCreating ? 'Synchronizing Events...' : 'Confirm School Activation'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Event Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {events.map((evt, i) => (
                    <div key={i} className="bg-white rounded-[2.5rem] overflow-hidden shadow-xl shadow-slate-100/50 border border-slate-50 flex flex-col group hover:scale-[1.02] transition-transform duration-500">
                        <div className="bg-slate-50 p-6 flex justify-between items-center group-hover:bg-primary/5 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-white text-primary flex items-center justify-center font-black text-sm shadow-sm">
                                    {new Date(evt.date).getDate()}
                                </div>
                                <div>
                                    <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest leading-none">
                                        {new Date(evt.date).toLocaleString('default', { month: 'short' })}
                                    </p>
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">
                                        {new Date(evt.date).getFullYear()}
                                    </p>
                                </div>
                            </div>
                            <span className="px-3 py-1 bg-white text-primary text-[8px] font-black uppercase tracking-widest rounded-lg border border-slate-100 italic">
                                {evt.type}
                            </span>
                        </div>
                        <div className="p-8 flex-1 flex flex-col">
                            <h4 className="text-xl font-black text-slate-800 tracking-tight leading-tight mb-4 italic group-hover:text-primary transition-colors">
                                {evt.title}
                            </h4>
                            <p className="text-sm font-bold text-slate-500 leading-relaxed mb-6 flex-1 line-clamp-3">
                                {evt.description}
                            </p>
                            <div className="space-y-4 pt-6 border-t border-slate-50">
                                <div className="flex items-center gap-3 text-slate-400">
                                    <span className="material-symbols-outlined text-sm">location_on</span>
                                    <span className="text-[10px] font-black uppercase tracking-widest">{evt.location}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-3 text-slate-400">
                                        <span className="material-symbols-outlined text-sm">schedule</span>
                                        <span className="text-[10px] font-black uppercase tracking-widest">{new Date(evt.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                    <button 
                                        onClick={() => handleDelete(evt._id)}
                                        className="text-error-dim hover:bg-error-container/10 p-2 rounded-xl transition-all"
                                    >
                                        <span className="material-symbols-outlined text-sm">delete</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                {events.length === 0 && (
                    <div className="md:col-span-2 lg:col-span-3 py-32 text-center bg-white rounded-[3rem] border border-slate-100">
                        <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
                            <span className="material-symbols-outlined text-4xl text-slate-100 italic shadow-sm">event_busy</span>
                        </div>
                        <h4 className="text-slate-400 font-black uppercase tracking-[0.2em] italic">No School Events Scheduled</h4>
                        <p className="text-slate-300 font-bold text-xs mt-2 uppercase tracking-widest">Your calendar is currently clear of career activations.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Activities;
