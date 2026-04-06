import React, { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Loader from '../common/Loader';

const ProfileSettings = ({ isOpen, onClose }) => {
    const { user, logout, updateUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');
    
    // Form States
    const [formData, setFormData] = useState({
        name: user?.name || '',
        phoneNumber: user?.phoneNumber || '',
        grade: user?.grade || 'Not specified',
        school: user?.school || 'Not specified',
    });

    if (!isOpen || !user) return null;

    const handleLogout = () => {
        logout();
        onClose();
        navigate('/');
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/auth/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                updateUser(data); // Update global context
                setIsEditing(false);
            } else {
                setError(data.message || 'Failed to update profile');
            }
        } catch (err) {
            setError('Connection failed. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity animate-in fade-in"
                onClick={() => !isSaving && onClose()}
            ></div>

            {/* Modal */}
            <div className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-10 duration-300">
                
                {/* Header */}
                <div className="relative h-32 bg-gradient-to-r from-primary to-secondary p-8 flex items-end justify-between">
                    <div className="flex items-center gap-4 translate-y-12">
                        <div className="w-24 h-24 rounded-3xl bg-white p-1 shadow-2xl">
                            <div className="w-full h-full rounded-[1.25rem] bg-indigo-600 text-white flex items-center justify-center text-3xl font-black">
                                {formData.name?.charAt(0) || user.name?.charAt(0)}
                            </div>
                        </div>
                    </div>
                    {!isSaving && (
                        <button 
                            onClick={onClose}
                            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/10 text-white hover:bg-black/20 flex items-center justify-center transition-colors shadow-sm"
                        >
                            <span className="material-symbols-outlined text-xl font-bold">close</span>
                        </button>
                    )}
                </div>

                {/* Content */}
                <div className="pt-16 pb-8 px-8">
                    {/* View Header */}
                    {!isEditing && (
                        <div className="mb-8">
                            <h2 className="text-2xl font-black text-on-surface mb-1">{user.name}</h2>
                            <div className="flex items-center gap-2">
                                <span className="px-2.5 py-0.5 rounded-lg bg-indigo-100 text-indigo-700 text-[10px] font-black uppercase tracking-wider border border-indigo-200">
                                    {user.role || 'Student'}
                                </span>
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                <span className="text-[11px] font-bold text-slate-400 font-headline uppercase tracking-widest">Active Member</span>
                            </div>
                        </div>
                    )}

                    {isEditing ? (
                        <form onSubmit={handleSave} className="space-y-4 animate-in fade-in slide-in-from-top-2">
                            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-primary mb-4">Edit Academic Information</h3>
                            
                            <div className="grid grid-cols-1 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-2">Full Name</label>
                                    <input 
                                        type="text" 
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-2">Phone</label>
                                        <input 
                                            type="text" 
                                            value={formData.phoneNumber}
                                            onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                                            className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-2">Grade</label>
                                        <input 
                                            type="text" 
                                            value={formData.grade}
                                            onChange={(e) => setFormData({...formData, grade: e.target.value})}
                                            placeholder="e.g. Grade 10"
                                            className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-2">School/College</label>
                                    <input 
                                        type="text" 
                                        value={formData.school}
                                        onChange={(e) => setFormData({...formData, school: e.target.value})}
                                        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                    />
                                </div>
                            </div>

                            {error && <p className="text-rose-500 text-[10px] font-black uppercase tracking-widest text-center mt-4 bg-rose-50 py-2 rounded-xl border border-rose-100">{error}</p>}

                            <div className="pt-6 flex gap-3">
                                <button 
                                    type="button"
                                    onClick={() => !isSaving && setIsEditing(false)}
                                    className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all active:scale-95 disabled:opacity-50"
                                    disabled={isSaving}
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    disabled={isSaving}
                                    className="flex-[2] py-4 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {isSaving ? <Loader type="inline" message="Syncing..." /> : (
                                        <>
                                            <span className="material-symbols-outlined text-sm group-hover:rotate-12 transition-transform">cloud_sync</span>
                                            Save Academic Profile
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="animate-in fade-in slide-in-from-bottom-2">
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-primary/20 transition-all">
                                        <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1.5 flex items-center gap-2">
                                            <span className="material-symbols-outlined text-xs">mail</span>
                                            Email Address
                                        </p>
                                        <p className="text-sm font-bold text-on-surface truncate">{user.email}</p>
                                    </div>
                                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-primary/20 transition-all">
                                        <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1.5 flex items-center gap-2">
                                            <span className="material-symbols-outlined text-xs">history_edu</span>
                                            Academic Level
                                        </p>
                                        <p className="text-sm font-bold text-on-surface">{user.grade || 'Not specified'}</p>
                                    </div>
                                </div>

                                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-primary/20 transition-all">
                                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1.5 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-xs">school</span>
                                        Educational Institution
                                    </p>
                                    <p className="text-sm font-bold text-on-surface">{user.school || 'Not specified'}</p>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="mt-10 flex flex-col sm:flex-row gap-4">
                                <button 
                                    onClick={() => setIsEditing(true)}
                                    className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 group"
                                >
                                    <span className="material-symbols-outlined text-sm group-hover:rotate-12 transition-transform">edit</span>
                                    Edit Academic Profile
                                </button>
                                <button 
                                    onClick={handleLogout}
                                    className="px-8 py-4 bg-rose-50 text-rose-600 border border-rose-100 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all flex items-center justify-center gap-2 active:scale-95"
                                >
                                    <span className="material-symbols-outlined text-sm">logout</span>
                                    Log Out
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Security Note */}
                <div className="py-4 bg-slate-50 border-t border-slate-100 px-8 flex items-center justify-center gap-2 opacity-60">
                    <span className="material-symbols-outlined text-sm">verified_user</span>
                    <p className="text-[9px] font-black uppercase tracking-widest">Secure Career Data Shield Active</p>
                </div>
            </div>
        </div>
    );
};
export default ProfileSettings;
