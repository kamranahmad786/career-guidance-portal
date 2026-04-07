import React from 'react';
import { useOutletContext } from 'react-router-dom';

const ChildProfile = () => {
    const { data } = useOutletContext();

    if (!data?.linked) return <div className="text-center py-20 text-slate-400 font-bold italic">Link a student to view their detailed identity.</div>;

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
