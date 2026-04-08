import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
    const { user, updateUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState('Personal Details');
    const [status, setStatus] = useState({ type: '', message: '' });
    const [isLoading, setIsLoading] = useState(false);

    // Form states
    const [personalData, setPersonalData] = useState({
        name: user?.name || '',
        phoneNumber: user?.phoneNumber || '',
        email: user?.email || ''
    });

    const [securityData, setSecurityData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [notificationSettings, setNotificationSettings] = useState({
        email: user?.notifications?.email ?? true,
        push: user?.notifications?.push ?? true,
        sms: user?.notifications?.sms ?? false
    });

    const [privacySettings, setPrivacySettings] = useState({
        profilePublic: user?.privacy?.profilePublic ?? false,
        showAnalytics: user?.privacy?.showAnalytics ?? true,
        dataSharing: user?.privacy?.dataSharing ?? true
    });

    const tabs = [
        { id: 'Personal Details', icon: 'person_edit', color: 'primary' },
        { id: 'Security & Password', icon: 'lock_reset', color: 'rose-500' },
        { id: 'Notifications', icon: 'notifications_active', color: 'amber-500' },
        { id: 'Account Privacy', icon: 'shield_person', color: 'emerald-500' }
    ];

    const handleSave = async (payload) => {
        setIsLoading(true);
        setStatus({ type: '', message: '' });
        try {
            const res = await fetch('/api/auth/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(payload)
            });

            const data = await res.json();
            if (res.ok) {
                updateUser(data);
                setStatus({ type: 'success', message: 'Settings saved successfully!' });
                if (payload.password) {
                    setSecurityData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                }
            } else {
                setStatus({ type: 'error', message: data.message || 'Save failed' });
            }
        } catch (err) {
            setStatus({ type: 'error', message: 'Connection error. Please try again.' });
        } finally {
            setIsLoading(false);
        }
    };

    const ToggleSwitch = ({ label, description, checked, onChange }) => (
        <div className="flex items-center justify-between py-6 border-b border-slate-50 last:border-0 group">
            <div className="space-y-1">
                <p className="text-sm font-black text-on-surface group-hover:text-primary transition-colors">{label}</p>
                <p className="text-[10px] text-slate-400 font-medium max-w-xs">{description}</p>
            </div>
            <button 
                onClick={onChange}
                className={`relative w-14 h-8 rounded-full transition-all duration-300 ${
                    checked ? 'bg-primary shadow-lg shadow-primary/20' : 'bg-slate-200'
                }`}
            >
                <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all duration-300 transform ${
                    checked ? 'translate-x-7' : 'translate-x-1'
                } shadow-sm`}></div>
            </button>
        </div>
    );

    const renderTabContent = () => {
        switch (activeTab) {
            case 'Personal Details':
                return (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                                <input 
                                    className="w-full bg-slate-50 border-0 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-primary"
                                    value={personalData.name}
                                    onChange={(e) => setPersonalData({...personalData, name: e.target.value})}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                                <input 
                                    className="w-full bg-slate-50 border-0 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-primary"
                                    value={personalData.phoneNumber}
                                    onChange={(e) => setPersonalData({...personalData, phoneNumber: e.target.value})}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Account Email</label>
                            <input 
                                disabled 
                                className="w-full bg-slate-100 border-0 rounded-2xl px-6 py-4 text-sm font-bold opacity-50 cursor-not-allowed"
                                value={personalData.email}
                            />
                        </div>
                        <button 
                            onClick={() => handleSave({ name: personalData.name, phoneNumber: personalData.phoneNumber })}
                            disabled={isLoading}
                            className="px-10 py-4 bg-on-surface text-white rounded-[1.5rem] font-black text-[11px] uppercase tracking-widest shadow-xl shadow-slate-200 hover:scale-105 active:scale-95 transition-all"
                        >
                            {isLoading ? 'Saving...' : 'Update Identity'}
                        </button>
                    </div>
                );
            case 'Security & Password':
                return (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">New Password</label>
                            <input 
                                type="password"
                                className="w-full bg-slate-50 border-0 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-primary"
                                placeholder="Min. 8 characters"
                                value={securityData.newPassword}
                                onChange={(e) => setSecurityData({...securityData, newPassword: e.target.value})}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Confirm New Password</label>
                            <input 
                                type="password"
                                className="w-full bg-slate-50 border-0 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-primary"
                                placeholder="••••••••"
                                value={securityData.confirmPassword}
                                onChange={(e) => setSecurityData({...securityData, confirmPassword: e.target.value})}
                            />
                        </div>
                        <button 
                            onClick={() => {
                                if (securityData.newPassword !== securityData.confirmPassword) {
                                    return setStatus({ type: 'error', message: 'Passwords do not match' });
                                }
                                handleSave({ password: securityData.newPassword });
                            }}
                            disabled={isLoading}
                            className="px-10 py-4 bg-rose-500 text-white rounded-[1.5rem] font-black text-[11px] uppercase tracking-widest shadow-xl shadow-rose-200 hover:scale-105 active:scale-95 transition-all"
                        >
                            {isLoading ? 'Resetting...' : 'Change my password'}
                        </button>
                    </div>
                );
            case 'Notifications':
                return (
                    <div className="space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <ToggleSwitch 
                            label="Email Notifications" 
                            description="Receive weekly progress reports and academic alerts via email."
                            checked={notificationSettings.email}
                            onChange={() => {
                                const newVal = !notificationSettings.email;
                                setNotificationSettings({...notificationSettings, email: newVal});
                                handleSave({ notifications: { email: newVal } });
                            }}
                        />
                        <ToggleSwitch 
                            label="Push Notifications" 
                            description="Get instant alerts for quiz results and mentor messages."
                            checked={notificationSettings.push}
                            onChange={() => {
                                const newVal = !notificationSettings.push;
                                setNotificationSettings({...notificationSettings, push: newVal});
                                handleSave({ notifications: { push: newVal } });
                            }}
                        />
                        <ToggleSwitch 
                            label="SMS Alerts" 
                            description="Receive critical reminders for upcoming assessments."
                            checked={notificationSettings.sms}
                            onChange={() => {
                                const newVal = !notificationSettings.sms;
                                setNotificationSettings({...notificationSettings, sms: newVal});
                                handleSave({ notifications: { sms: newVal } });
                            }}
                        />
                    </div>
                );
            case 'Account Privacy':
                return (
                    <div className="space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <ToggleSwitch 
                            label="Public Profile" 
                            description="Allow other students and mentors to view your achievements."
                            checked={privacySettings.profilePublic}
                            onChange={() => {
                                const newVal = !privacySettings.profilePublic;
                                setPrivacySettings({...privacySettings, profilePublic: newVal});
                                handleSave({ privacy: { profilePublic: newVal } });
                            }}
                        />
                        <ToggleSwitch 
                            label="Show Progress Analytics" 
                            description="Display your learning velocity on the leaderboard."
                            checked={privacySettings.showAnalytics}
                            onChange={() => {
                                const newVal = !privacySettings.showAnalytics;
                                setPrivacySettings({...privacySettings, showAnalytics: newVal});
                                handleSave({ privacy: { showAnalytics: newVal } });
                            }}
                        />
                        <ToggleSwitch 
                            label="AI Data Sharing" 
                            description="Help improve the AI mentor by sharing anonymous learning data."
                            checked={privacySettings.dataSharing}
                            onChange={() => {
                                const newVal = !privacySettings.dataSharing;
                                setPrivacySettings({...privacySettings, dataSharing: newVal});
                                handleSave({ privacy: { dataSharing: newVal } });
                            }}
                        />
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
            <div className="max-w-4xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                    <div>
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-4">
                            <button 
                                onClick={() => navigate('/student/dashboard')}
                                className="flex items-center gap-2 text-slate-400 font-black text-[10px] uppercase tracking-widest hover:text-primary transition-all underline decoration-slate-200 decoration-2 underline-offset-4"
                            >
                                <span className="material-symbols-outlined text-sm">arrow_back</span>
                                Dashboard
                            </button>
                            <span className="text-slate-300">|</span>
                            <button 
                                onClick={() => navigate('/')}
                                className="flex items-center gap-2 text-slate-400 font-black text-[10px] uppercase tracking-widest hover:text-primary transition-all"
                            >
                                <span className="material-symbols-outlined text-sm">home</span>
                                Main Website
                            </button>
                        </div>
                        <h1 className="text-4xl font-black text-on-surface font-headline tracking-tighter uppercase">Portal Command Center</h1>
                        <p className="text-slate-400 font-medium">Fine-tune your experience, security, and digital presence.</p>
                    </div>

                    {status.message && (
                        <div className={`px-6 py-3 rounded-2xl border flex items-center gap-3 animate-bounce shadow-sm ${
                            status.type === 'success' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'
                        }`}>
                            <span className="material-symbols-outlined text-xl">
                                {status.type === 'success' ? 'verified' : 'warning'}
                            </span>
                            <span className="text-[10px] font-black uppercase tracking-widest">{status.message}</span>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="space-y-3">
                        {tabs.map((tab) => (
                            <button 
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center gap-4 px-6 py-4 rounded-[1.5rem] text-sm font-black transition-all transform active:scale-95 ${
                                    activeTab === tab.id 
                                    ? 'bg-on-surface text-white shadow-2xl shadow-slate-200 -translate-y-1' 
                                    : 'text-slate-400 hover:bg-white hover:text-on-surface'
                                }`}
                            >
                                <span className={`material-symbols-outlined text-xl ${
                                    activeTab === tab.id ? 'text-white' : `text-${tab.color}`
                                }`}>
                                    {tab.icon}
                                </span>
                                {tab.id}
                            </button>
                        ))}
                    </div>

                    <div className="lg:col-span-2">
                        <div className="bg-white p-10 lg:p-14 rounded-[3.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[80px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
                            
                            <div className="relative z-10">
                                <div className="flex items-center gap-4 mb-12">
                                    <h3 className="text-2xl font-black text-on-surface font-headline tracking-tight">
                                        {activeTab}
                                    </h3>
                                    <div className="h-[2px] flex-1 bg-slate-50"></div>
                                </div>
                                
                                {renderTabContent()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
