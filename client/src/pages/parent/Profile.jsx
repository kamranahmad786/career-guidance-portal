import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';

const ChildProfile = () => {
    const { data, fetchDashboard } = useOutletContext();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleLink = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/parent/link-child', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ email })
            });

            const result = await res.json();

            if (res.ok) {
                setSuccess('Student account successfully linked!');
                fetchDashboard(); // Refresh global data
            } else {
                setError(result.message || 'Linking failed. Please check the email.');
            }
        } catch (err) {
            setError('System error. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    if (!data?.linked) return (
        <div className="max-w-3xl mx-auto py-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="bg-white rounded-[3rem] p-12 shadow-2xl shadow-primary/10 border border-slate-100 text-center">
                <div className="w-24 h-24 bg-primary/10 rounded-[2rem] flex items-center justify-center mx-auto mb-8 animate-bounce">
                    <span className="material-symbols-outlined text-5xl text-primary font-black">person_add</span>
                </div>
                <h2 className="text-4xl font-black text-slate-800 mb-4 tracking-tighter">Link Student Account</h2>
                <p className="text-slate-500 font-bold mb-10 text-lg leading-relaxed">
                    Enter your child's student email address to start monitoring their academic progress and career trajectory.
                </p>

                <form onSubmit={handleLink} className="space-y-6">
                    <div className="relative group">
                        <span className="absolute left-6 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 group-focus-within:text-primary transition-colors">alternate_email</span>
                        <input 
                            type="email"
                            required
                            placeholder="student@edudisha.com"
                            className="w-full pl-14 pr-8 py-5 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-700 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-lg"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    
                    {error && (
                        <div className="p-4 bg-error/5 text-error text-sm font-black rounded-xl border border-error/10 flex items-center gap-3 animate-head-shake">
                            <span className="material-symbols-outlined">error</span>
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="p-4 bg-emerald-50 text-emerald-600 text-sm font-black rounded-xl border border-emerald-100 flex items-center gap-3">
                            <span className="material-symbols-outlined">check_circle</span>
                            {success}
                        </div>
                    )}

                    <button 
                        type="submit"
                        disabled={loading}
                        className="w-full py-5 bg-primary text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.01] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Processing Sync...' : 'Establish Secure Connection'}
                    </button>
                </form>
                
                <p className="mt-8 text-xs font-black text-slate-400 uppercase tracking-widest">
                    Verification required • Data encrypted • NEP 2020 Compliant
                </p>
            </div>
        </div>
    );

    const child = data.childProfile;

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-right-6 duration-500">
            {/* Main Profile Header */}
            <div className="bg-white rounded-3xl p-10 shadow-sm border border-slate-100">
                <div className="flex flex-col md:flex-row gap-10 items-start">
                    <div className="w-40 h-40 rounded-[3rem] bg-slate-900 text-white flex items-center justify-center text-5xl font-black shadow-2xl shadow-slate-900/10">
                        {child.name.charAt(0)}
                    </div>
                    <div className="flex-1 space-y-6 pt-4">
                        <div>
                            <h2 className="text-4xl font-black text-slate-800 tracking-tight">{child.name}</h2>
                            <p className="text-primary font-bold text-lg mt-1">{child.grade} • {child.school}</p>
                        </div>
                        <p className="text-slate-500 font-medium leading-relaxed max-w-2xl italic text-lg">
                            "{child.details?.bio || "A student dedicated to exploring the intersections of technology and human-centric design."}"
                        </p>
                        <div className="flex flex-wrap gap-4 pt-4">
                            <div className="px-6 py-3 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-primary/20 transition-all cursor-default">
                                <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-1">Board</p>
                                <p className="font-bold text-slate-700">{child.details?.board || "CBSE"}</p>
                            </div>
                            <div className="px-6 py-3 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-primary/20 transition-all cursor-default">
                                <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-1">Account Status</p>
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                    <p className="font-bold text-emerald-600">Active Monitoring</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Interest Segments */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100 group hover:border-primary/10 transition-all">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-10 shadow-sm border border-indigo-100 group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined">psychology</span>
                    </div>
                    <h4 className="text-lg font-black text-slate-800 mb-6 uppercase tracking-widest leading-none">Interests</h4>
                    <div className="flex flex-wrap gap-2.5">
                        {(child.details?.interests || ['Coding', 'Robotics', 'Logic']).map(item => (
                            <span key={item} className="px-5 py-2.5 bg-indigo-50 text-indigo-700 rounded-2xl text-xs font-black uppercase tracking-[0.1em] border border-indigo-100">{item}</span>
                        ))}
                    </div>
                </div>
                
                <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100 group hover:border-primary/10 transition-all">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-10 shadow-sm border border-emerald-100 group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined">award_star</span>
                    </div>
                    <h4 className="text-lg font-black text-slate-800 mb-6 uppercase tracking-widest leading-none">Core Skills</h4>
                    <div className="flex flex-wrap gap-2.5">
                        {(child.details?.skills || ['Problem Solving', 'Mathematics', 'Creativity']).map(item => (
                            <span key={item} className="px-5 py-2.5 bg-emerald-50 text-emerald-700 rounded-2xl text-xs font-black uppercase tracking-[0.1em] border border-emerald-100">{item}</span>
                        ))}
                    </div>
                </div>

                <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100 group hover:border-primary/10 transition-all">
                    <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-10 shadow-sm border border-amber-100 group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined">palette</span>
                    </div>
                    <h4 className="text-lg font-black text-slate-800 mb-6 uppercase tracking-widest leading-none">Hobbies</h4>
                    <div className="flex flex-wrap gap-2.5">
                        {(child.details?.hobbies || ['Reading', 'Chess', 'Sketching']).map(item => (
                            <span key={item} className="px-5 py-2.5 bg-amber-50 text-amber-700 rounded-2xl text-xs font-black uppercase tracking-[0.1em] border border-amber-100">{item}</span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChildProfile;
