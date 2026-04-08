import React, { useState, useContext } from 'react';
import { useOutletContext } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import Loader from '../../components/common/Loader';

const TeacherProfile = () => {
    const { user } = useContext(AuthContext);
    const { data, fetchDashboard } = useOutletContext();
    const [isEditing, setIsEditing] = useState(false);
    
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        subject: data?.teacherProfile?.subject || '',
        bio: data?.teacherProfile?.bio || 'Dedicated educator committed to guiding students through their career discovery journey.',
        schoolName: data?.teacherProfile?.schoolName || user?.school || ''
    });

    if (!data) return <Loader />;

    const handleSave = async () => {
        // Mock save for now 
        setIsEditing(false);
        // fetchDashboard();
    };

    return (
        <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-6 duration-700">
            {/* Cover / Header */}
            <div className="relative h-48 rounded-[3rem] bg-gradient-to-r from-primary to-blue-400 mb-16 overflow-hidden shadow-xl shadow-primary/10">
                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                <div className="absolute -bottom-16 left-12">
                    <div className="w-32 h-32 rounded-[2rem] bg-white p-2 shadow-2xl border border-slate-100 flex items-center justify-center font-black text-4xl text-primary overflow-hidden">
                        {user?.profileImage ? (
                            <img src={user.profileImage} alt={formData.name} className="w-full h-full object-cover" />
                        ) : (
                            formData.name.charAt(0)
                        )}
                    </div>
                </div>
            </div>

            <div className="px-12">
                <div className="flex justify-between items-start mb-12">
                    <div>
                        <h2 className="text-3xl font-black text-slate-800 tracking-tight">{formData.name}</h2>
                        <p className="text-sm font-black text-primary uppercase tracking-widest mt-1 italic">
                            Sr. {formData.subject || 'Career'} Mentor • {formData.schoolName}
                        </p>
                    </div>
                    <button 
                        onClick={() => setIsEditing(!isEditing)}
                        className={`px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${isEditing ? 'bg-slate-100 text-slate-500' : 'bg-primary text-white shadow-xl shadow-primary/20 hover:-translate-y-1'}`}
                    >
                        {isEditing ? 'Cancel Edit' : 'Modify Profile'}
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Basic Info */}
                    <div className="bg-white p-10 rounded-[2.5rem] border border-slate-50 shadow-sm space-y-8">
                        <div>
                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-3">Professional Bio</p>
                            {isEditing ? (
                                <textarea 
                                    className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-medium focus:ring-4 focus:ring-primary/10 outline-none min-h-[120px]"
                                    value={formData.bio}
                                    onChange={(e) => setFormData({...formData, bio: e.target.value})}
                                />
                            ) : (
                                <p className="text-sm font-medium text-slate-500 leading-relaxed italic">"{formData.bio}"</p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 gap-6">
                            {[
                                { label: 'Full Legal Name', key: 'name', type: 'text' },
                                { label: 'Professional Email', key: 'email', type: 'email' },
                                { label: 'Primary Subject', key: 'subject', type: 'text' }
                            ].map((field) => (
                                <div key={field.key}>
                                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-2">{field.label}</p>
                                    {isEditing ? (
                                        <input 
                                            type={field.type}
                                            className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-primary/10 outline-none"
                                            value={formData[field.key]}
                                            onChange={(e) => setFormData({...formData, [field.key]: e.target.value})}
                                        />
                                    ) : (
                                        <p className="text-sm font-bold text-slate-700">{formData[field.key]}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Meta Info */}
                    <div className="space-y-8">
                        <div className="bg-white p-10 rounded-[2.5rem] border border-slate-50 shadow-sm">
                            <h3 className="text-lg font-black text-slate-800 tracking-tight mb-6">School Affiliation</h3>
                            <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl">
                                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-primary shadow-sm border border-slate-100">
                                    <span className="material-symbols-outlined text-2xl font-bold">domain</span>
                                </div>
                                <div>
                                    <p className="text-xs font-black text-slate-800 tracking-tight">{formData.schoolName}</p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Verified Academic Partner</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-primary/5 p-10 rounded-[2.5rem] border border-primary/5">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="material-symbols-outlined text-primary font-bold">verified_user</span>
                                <h3 className="text-lg font-black text-primary tracking-tight italic">EduDisha Mentor Status</h3>
                            </div>
                            <p className="text-xs font-bold text-slate-500 leading-relaxed mb-6">
                                Your mentor profile is active. You have full administrative access to student career trajectories and school audits.
                            </p>
                            <div className="text-[9px] font-black text-primary/50 uppercase tracking-[0.2em]">Live Sync Active</div>
                        </div>
                    </div>
                </div>

                {isEditing && (
                    <div className="mt-12 flex justify-end">
                        <button 
                            onClick={handleSave}
                            className="px-12 py-4 bg-on-surface text-white rounded-2xl font-black text-[12px] uppercase tracking-[0.2em] shadow-2xl shadow-slate-900/20 hover:-translate-y-1 active:scale-95 transition-all"
                        >
                            Save Credentials
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TeacherProfile;
