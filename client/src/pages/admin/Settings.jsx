import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Loader from '../../components/common/Loader';

const AdminSettings = () => {
    const [config, setConfig] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    useEffect(() => {
        fetchConfig();
    }, []);

    const fetchConfig = async () => {
        try {
            const res = await axios.get('/api/admin/config', { headers });
            setConfig(res.data);
        } catch (err) {
            console.error("Fetch config error:", err);
            setMessage({ type: 'error', text: 'Failed to load system configuration.' });
        } finally {
            setLoading(false);
        }
    };

    const handleToggle = async (field) => {
        try {
            setSaving(true);
            const updatedValue = !config[field];
            const res = await axios.put('/api/admin/config', { [field]: updatedValue }, { headers });
            setConfig(res.data);
            setMessage({ type: 'success', text: 'System settings updated successfully.' });
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch (err) {
            console.error("Update config error:", err);
            setMessage({ type: 'error', text: 'Failed to update settings.' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <Loader />;

    return (
        <div className="max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h2 className="text-3xl font-headline font-black text-slate-800">System Settings</h2>
                <p className="text-slate-500 mt-1">Configure global platform behavior and AI engine states.</p>
            </div>

            {message.text && (
                <div className={`p-4 rounded-2xl flex items-center gap-3 ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                    <span className="material-symbols-outlined">{message.type === 'success' ? 'check_circle' : 'error'}</span>
                    <p className="text-sm font-bold">{message.text}</p>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* AI Engines Section */}
                <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>psychology</span>
                        </div>
                        <h3 className="text-xl font-black text-slate-800">AI Cognitive Core</h3>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <div>
                                <p className="text-sm font-bold text-slate-800">AI Quiz Generator</p>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mt-1">Gemini Pro 1.5 Powered</p>
                            </div>
                            <button 
                                onClick={() => handleToggle('aiQuizGenEnabled')}
                                disabled={saving}
                                className={`w-12 h-6 rounded-full relative transition-colors ${config.aiQuizGenEnabled ? 'bg-primary' : 'bg-slate-300'}`}
                            >
                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${config.aiQuizGenEnabled ? 'translate-x-[1.5rem]' : 'translate-x-1'}`}></div>
                            </button>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <div>
                                <p className="text-sm font-bold text-slate-800">Recommendation Engine</p>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mt-1">Cross-parameter mapping</p>
                            </div>
                            <button 
                                onClick={() => handleToggle('aiRecommendationEnabled')}
                                disabled={saving}
                                className={`w-12 h-6 rounded-full relative transition-colors ${config.aiRecommendationEnabled ? 'bg-primary' : 'bg-slate-300'}`}
                            >
                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${config.aiRecommendationEnabled ? 'translate-x-[1.5rem]' : 'translate-x-1'}`}></div>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Platform Governance */}
                <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
                            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>gavel</span>
                        </div>
                        <h3 className="text-xl font-black text-slate-800">Gov & Security</h3>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <div>
                                <p className="text-sm font-bold text-slate-800">Maintenance Mode</p>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mt-1">System-wide blackout</p>
                            </div>
                            <button 
                                onClick={() => handleToggle('maintenanceMode')}
                                disabled={saving}
                                className={`w-12 h-6 rounded-full relative transition-colors ${config.maintenanceMode ? 'bg-red-500' : 'bg-slate-300'}`}
                            >
                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${config.maintenanceMode ? 'translate-x-[1.5rem]' : 'translate-x-1'}`}></div>
                            </button>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <div>
                                <p className="text-sm font-bold text-slate-800">New Registrations</p>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mt-1">User onboarding gate</p>
                            </div>
                            <button 
                                onClick={() => handleToggle('registrationEnabled')}
                                disabled={saving}
                                className={`w-12 h-6 rounded-full relative transition-colors ${config.registrationEnabled ? 'bg-primary' : 'bg-slate-300'}`}
                            >
                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${config.registrationEnabled ? 'translate-x-[1.5rem]' : 'translate-x-1'}`}></div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* System Info */}
            <div className="bg-slate-900 p-8 rounded-[3rem] text-white shadow-2xl shadow-slate-900/10 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Database Engine</p>
                    <p className="text-xl font-bold">MongoDB Atlas Cluster - Shard0</p>
                </div>
                <div className="text-right">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Last System Backup</p>
                    <p className="text-xl font-bold">{new Date(config.lastBackup).toLocaleString()}</p>
                </div>
            </div>
        </div>
    );
};

export default AdminSettings;
