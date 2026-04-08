import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';

const TeacherSettings = () => {
    const { data } = useOutletContext();
    const [settings, setSettings] = useState({
        emailNotifications: true,
        realTimeAlerts: true,
        studentPerformanceSync: true,
        parentEngagementNotify: false,
        darkMode: false
    });

    const toggleSetting = (key) => {
        setSettings({ ...settings, [key]: !settings[key] });
    };

    return (
        <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-6 duration-700">
            <div className="mb-12">
                <h2 className="text-4xl font-black text-slate-800 tracking-tight italic">Mentor Settings</h2>
                <p className="text-slate-500 font-medium mt-1">Manage your professional experience and notification clusters.</p>
            </div>

            <div className="space-y-6">
                {/* Notification Cluster */}
                <div className="bg-white p-10 rounded-[3rem] border border-slate-50 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[8rem] group-hover:w-full group-hover:h-full group-hover:rounded-none transition-all duration-700 pointer-events-none"></div>
                    
                    <div className="relative z-10">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary border border-primary/10">
                                <span className="material-symbols-outlined font-bold">notifications_active</span>
                            </div>
                            <h3 className="text-xl font-black text-slate-800 tracking-tight">Notification Pulse</h3>
                        </div>

                        <div className="space-y-6">
                            {[
                                { key: 'realTimeAlerts', label: 'Real-time Student Alerts', desc: 'Instant tray notifications for quiz completions and milestones.' },
                                { key: 'emailNotifications', label: 'Consolidated Email Digests', desc: 'Weekly school-wide performance summaries sent to your inbox.' },
                                { key: 'parentEngagementNotify', label: 'Guardian Enrollment Pulse', desc: 'Alerts when parents link accounts or update engagement data.' }
                            ].map((item) => (
                                <div key={item.key} className="flex items-center justify-between py-4 border-b border-slate-50 last:border-0">
                                    <div className="max-w-xs">
                                        <p className="text-sm font-black text-slate-800 tracking-tight">{item.label}</p>
                                        <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">{item.desc}</p>
                                    </div>
                                    <button 
                                        onClick={() => toggleSetting(item.key)}
                                        className={`w-14 h-8 rounded-full p-1 transition-all duration-300 ${settings[item.key] ? 'bg-primary' : 'bg-slate-200'}`}
                                    >
                                        <div className={`w-6 h-6 rounded-full bg-white shadow-sm transition-all duration-300 transform ${settings[item.key] ? 'translate-x-6' : 'translate-x-0'}`}></div>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* System Prefs */}
                <div className="bg-white p-10 rounded-[3rem] border border-slate-50 shadow-sm">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100">
                            <span className="material-symbols-outlined font-bold">display_settings</span>
                        </div>
                        <h3 className="text-xl font-black text-slate-800 tracking-tight">System Preferences</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div onClick={() => toggleSetting('darkMode')} className={`p-6 rounded-[2rem] border transition-all cursor-pointer flex flex-col items-center text-center ${settings.darkMode ? 'bg-on-surface text-white border-white/20' : 'bg-slate-50 border-slate-100'}`}>
                            <span className="material-symbols-outlined text-3xl mb-4">{settings.darkMode ? 'dark_mode' : 'light_mode'}</span>
                            <p className="text-xs font-black uppercase tracking-widest">Aesthetic Mode</p>
                            <p className="text-[9px] font-bold opacity-60 mt-1">Current: {settings.darkMode ? 'High Contrast' : 'Default Studio'}</p>
                        </div>

                        <div className="p-6 rounded-[2rem] bg-slate-50 border border-slate-100 flex flex-col items-center text-center group">
                            <span className="material-symbols-outlined text-3xl mb-4 text-slate-300 group-hover:rotate-12 transition-transform">database</span>
                            <p className="text-xs font-black uppercase tracking-widest text-slate-800">Local Cache</p>
                            <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-widest italic">Encrypted & Synchronized</p>
                        </div>
                    </div>
                </div>

                {/* Footer Action */}
                <div className="flex justify-between items-center py-8">
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest italic">
                        All settings are stored in your encrypted profile registry.
                    </p>
                    <button className="px-10 py-4 bg-primary text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-primary/20 hover:-translate-y-1 transition-all">
                        Synchronize All
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TeacherSettings;
