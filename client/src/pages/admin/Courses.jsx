import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Loader from '../../components/common/Loader';

const AdminCourses = () => {
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    const categories = ['all', 'Specialized Courses', 'Live Workshops', 'Expert Webinars', 'Career Simulations'];
    const catColors = { 'Specialized Courses':'blue', 'Live Workshops':'violet', 'Expert Webinars':'indigo', 'Career Simulations':'emerald' };

    useEffect(() => { fetchResources(); }, []);
    const fetchResources = async () => {
        try { setLoading(true); const res = await axios.get('/api/admin/resources', { headers }); setResources(res.data); }
        catch (err) { console.error(err); } finally { setLoading(false); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this resource?')) return;
        await axios.delete(`/api/admin/resources/${id}`, { headers });
        setResources(resources.filter(r => r._id !== id));
    };

    const filtered = filter === 'all' ? resources : resources.filter(r => r.category === filter);

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-headline font-black text-slate-800">Courses & Content</h2>
                <p className="text-slate-500 mt-1">{resources.length} resources in the library</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {categories.slice(1).map(cat => {
                    const count = resources.filter(r=>r.category===cat).length;
                    const c = catColors[cat];
                    return (
                        <div key={cat} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm cursor-pointer hover:-translate-y-0.5 transition-all" onClick={()=>setFilter(cat)}>
                            <p className="text-2xl font-black text-slate-800">{count}</p>
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">{cat}</p>
                        </div>
                    );
                })}
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 flex-wrap">
                {categories.map(c => (
                    <button key={c} onClick={() => setFilter(c)}
                        className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${filter===c ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-500'}`}>
                        {c==='all' ? 'All' : c}
                    </button>
                ))}
            </div>

            {loading ? <Loader /> : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                    {filtered.map(r => {
                        const c = catColors[r.category] || 'slate';
                        return (
                            <div key={r._id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden group hover:shadow-md transition-all">
                                <div className="h-36 bg-slate-100 relative overflow-hidden">
                                    {r.imageUrl ? <img src={r.imageUrl} alt={r.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /> : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                                            <span className="material-symbols-outlined text-5xl">image</span>
                                        </div>
                                    )}
                                    <div className="absolute top-2 left-2">
                                        <span className={`text-[10px] font-black px-2 py-1 bg-${c}-600 text-white rounded-full`}>{r.category}</span>
                                    </div>
                                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all">
                                        <button onClick={()=>handleDelete(r._id)} className="p-1.5 bg-white text-red-500 rounded-lg shadow">
                                            <span className="material-symbols-outlined text-sm">delete</span>
                                        </button>
                                    </div>
                                </div>
                                <div className="p-5">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full font-bold">{r.level}</span>
                                        {r.isPremium && <span className="text-xs px-2 py-0.5 bg-amber-50 text-amber-600 rounded-full font-bold">Premium</span>}
                                    </div>
                                    <h3 className="text-sm font-black text-slate-800 mb-1 line-clamp-2">{r.title}</h3>
                                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-50 text-xs text-slate-400 font-medium">
                                        <span>⭐ {r.rating}</span>
                                        <span>{r.enrolledCount} enrolled</span>
                                        <span>{r.modules} modules</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                    {filtered.length === 0 && (
                        <div className="col-span-3 py-16 text-center text-slate-300">
                            <span className="material-symbols-outlined text-4xl">auto_stories</span>
                            <p className="font-bold mt-2">No resources found</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AdminCourses;
