import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    
    const [profile, setProfile] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [formData, setFormData] = useState({
        bio: '',
        schoolName: '',
        className: '',
        board: 'CBSE',
        age: '',
        skills: [],
        interests: []
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await fetch('/api/student/profile', {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            const data = await res.json();
            if (res.ok) {
                setProfile(data);
                setFormData({
                    bio: data.bio || '',
                    schoolName: data.schoolName || '',
                    className: data.className || '',
                    board: data.board || 'CBSE',
                    age: data.age || '',
                    skills: data.skills || [],
                    interests: data.interests || []
                });
            }
        } catch (err) {
            console.error('Error fetching profile:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/student/profile', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                const updated = await res.json();
                setProfile(updated);
                setIsEditing(false);
            }
        } catch (err) {
            console.error('Update failed:', err);
        }
    };

    if (isLoading) return (
        <div className="min-h-screen flex items-center justify-center bg-surface">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-surface font-body p-6 lg:p-12">
            <div className="max-w-5xl mx-auto">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-10">
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

                <div className="space-y-12">
                    {/* Hero Profile Section */}
                    <div className="bg-white rounded-[3.5rem] p-10 lg:p-16 shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
                        
                        <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                            {/* Avatar */}
                            <div className="relative group">
                                <div className="w-40 h-40 rounded-[2.5rem] bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-5xl font-black shadow-2xl shadow-primary/20">
                                    {user?.name?.charAt(0)}
                                </div>
                                <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-on-surface text-white rounded-2xl flex items-center justify-center shadow-lg cursor-pointer hover:scale-110 active:scale-95 transition-all border-4 border-white">
                                    <span className="material-symbols-outlined text-xl">photo_camera</span>
                                </div>
                            </div>

                            {/* Info */}
                            <div className="flex-1 text-center md:text-left">
                                <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
                                    <h1 className="text-4xl font-black text-on-surface font-headline tracking-tight">{user?.name}</h1>
                                    <span className="px-5 py-1.5 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-emerald-100 flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                        Active Student
                                    </span>
                                </div>
                                <p className="text-slate-400 font-medium text-lg leading-relaxed mb-8 max-w-xl italic">
                                    "{profile?.bio || 'Add a professional bio to showcase your personality to mentors and AI engines.'}"
                                </p>
                                <div className="flex flex-wrap justify-center md:justify-start gap-4">
                                    <button 
                                        onClick={() => setIsEditing(true)}
                                        className="px-8 py-4 bg-primary text-white rounded-[1.5rem] font-black text-[11px] uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                                    >
                                        Edit Profile
                                    </button>
                                    <button className="px-8 py-4 bg-white border border-slate-100 text-slate-500 rounded-[1.5rem] font-black text-[11px] uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2">
                                        <span className="material-symbols-outlined text-xl">share</span>
                                        Share Profile
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats & Cards Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        {/* Academic Profile Card */}
                        <div className="bg-white rounded-[3.5rem] p-10 border border-slate-100">
                            <div className="flex items-center justify-between mb-10">
                                <h3 className="text-xl font-black text-on-surface font-headline">Academic Identity</h3>
                                <span className="material-symbols-outlined text-primary bg-primary/5 p-3 rounded-2xl">school</span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Current School</p>
                                    <p className="font-bold text-on-surface">{profile?.schoolName || 'Not Set'}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Grade / Division</p>
                                    <p className="font-bold text-on-surface">{profile?.className || 'Not Set'}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Education Board</p>
                                    <p className="font-bold text-on-surface">{profile?.board || 'Not Set'}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Student Age</p>
                                    <p className="font-bold text-on-surface">{profile?.age ? `${profile.age} Years` : 'Not Set'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Interests & Skills Card */}
                        <div className="bg-white rounded-[3.5rem] p-10 border border-slate-100">
                            <div className="flex items-center justify-between mb-10">
                                <h3 className="text-xl font-black text-on-surface font-headline">Skill Cloud</h3>
                                <span className="material-symbols-outlined text-tertiary bg-tertiary/5 p-3 rounded-2xl">neurology</span>
                            </div>
                            <div className="space-y-8">
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Core Skills</p>
                                    <div className="flex flex-wrap gap-2">
                                        {(profile?.skills?.length > 0 ? profile.skills : ['Problem Solving', 'Adaptability']).map(skill => (
                                            <span key={skill} className="px-5 py-2 bg-slate-50 text-on-surface text-[11px] font-black rounded-full border border-slate-100">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Curated Interests</p>
                                    <div className="flex flex-wrap gap-2">
                                        {(profile?.interests?.length > 0 ? profile.interests : ['AI & Robotics', 'Creative Arts']).map(interest => (
                                            <span key={interest} className="px-5 py-2 bg-primary/5 text-primary text-[11px] font-black rounded-full border border-primary/10">
                                                {interest}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Profile Modal */}
            {isEditing && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-12">
                    <div className="absolute inset-0 bg-on-surface/80 backdrop-blur-md" onClick={() => setIsEditing(false)}></div>
                    <div className="relative bg-white w-full max-w-2xl rounded-[3.5rem] p-10 lg:p-16 shadow-2xl overflow-y-auto max-h-[90vh]">
                        <h2 className="text-3xl font-black text-on-surface font-headline mb-4 uppercase tracking-tighter">Update Profile</h2>
                        <p className="text-slate-400 font-medium mb-12">Sync your real-world achievements with your digital AI identity.</p>
                        
                        <form onSubmit={handleUpdate} className="space-y-8">
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Professional Bio</label>
                                    <textarea 
                                        className="w-full bg-slate-50 border-0 rounded-[1.5rem] px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-primary h-32"
                                        value={formData.bio}
                                        onChange={(e) => setFormData({...formData, bio: e.target.value})}
                                        placeholder="Write something inspiring..."
                                    />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">School Name</label>
                                        <input 
                                            className="w-full bg-slate-50 border-0 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-primary"
                                            value={formData.schoolName}
                                            onChange={(e) => setFormData({...formData, schoolName: e.target.value})}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Grade / Division</label>
                                        <input 
                                            className="w-full bg-slate-50 border-0 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-primary"
                                            value={formData.className}
                                            onChange={(e) => setFormData({...formData, className: e.target.value})}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Educational Board</label>
                                        <select 
                                            className="w-full bg-slate-50 border-0 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-primary"
                                            value={formData.board}
                                            onChange={(e) => setFormData({...formData, board: e.target.value})}
                                        >
                                            <option>CBSE</option>
                                            <option>ICSE</option>
                                            <option>State Board</option>
                                            <option>IB</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Age</label>
                                        <input 
                                            type="number"
                                            className="w-full bg-slate-50 border-0 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-primary"
                                            value={formData.age}
                                            onChange={(e) => setFormData({...formData, age: e.target.value})}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4 pt-8">
                                <button type="submit" className="flex-1 py-5 bg-primary text-white rounded-[2rem] font-black text-[11px] uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
                                    Save Changes
                                </button>
                                <button type="button" onClick={() => setIsEditing(false)} className="flex-1 py-5 bg-slate-100 text-slate-500 rounded-[2rem] font-black text-[11px] uppercase tracking-widest hover:bg-slate-200 transition-all">
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;
