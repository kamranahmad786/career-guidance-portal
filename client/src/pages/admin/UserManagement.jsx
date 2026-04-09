import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Loader from '../../components/common/Loader';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [editingUser, setEditingUser] = useState(null);
    const [editRole, setEditRole] = useState('');
    const [error, setError] = useState(null);

    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    useEffect(() => {
        fetchUsers();
    }, [roleFilter]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const params = {};
            if (roleFilter !== 'all') params.role = roleFilter;
            if (searchTerm) params.search = searchTerm;

            const res = await axios.get('/api/admin/users', { headers, params });
            setUsers(res.data);
        } catch (err) {
            console.error("User fetch error:", err);
            setError("Failed to fetch users.");
        } finally {
            setLoading(false);
        }
    };

    // Search with debounce
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchUsers();
        }, 400);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    const handleDelete = async (id, name) => {
        if (!window.confirm(`Are you sure you want to permanently delete "${name}" from the system?`)) return;
        try {
            await axios.delete(`/api/admin/users/${id}`, { headers });
            setUsers(users.filter(u => u._id !== id));
        } catch (err) {
            alert(err.response?.data?.message || "Deletion failed");
        }
    };

    const handleRoleUpdate = async (id) => {
        try {
            await axios.put(`/api/admin/users/${id}/role`, { role: editRole }, { headers });
            setUsers(users.map(u => u._id === id ? { ...u, role: editRole } : u));
            setEditingUser(null);
            setEditRole('');
        } catch (err) {
            alert(err.response?.data?.message || "Role update failed");
        }
    };

    const timeAgo = (date) => {
        const seconds = Math.floor((new Date() - new Date(date)) / 1000);
        if (seconds < 60) return `${seconds}s ago`;
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;
        const days = Math.floor(hours / 24);
        return `${days}d ago`;
    };

    const roleCounts = {
        all: users.length,
        Student: users.filter(u => u.role === 'Student').length,
        Teacher: users.filter(u => u.role === 'Teacher').length,
        Parent: users.filter(u => u.role === 'Parent').length,
        SuperAdmin: users.filter(u => u.role === 'SuperAdmin').length,
    };

    const roleStyles = {
        Student: 'bg-blue-50 text-blue-600',
        Teacher: 'bg-violet-50 text-violet-600',
        Parent: 'bg-indigo-50 text-indigo-600',
        SuperAdmin: 'bg-slate-900 text-white',
        Admin: 'bg-slate-900 text-white',
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-headline font-black tracking-tight text-slate-800">User Management</h2>
                    <p className="text-slate-500 font-medium">
                        {users.length} users registered in the system
                    </p>
                </div>
            </div>

            {/* Filters Row */}
            <div className="flex flex-col md:flex-row gap-4">
                {/* Search */}
                <div className="relative flex-1">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-6 py-3 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 outline-none font-medium"
                    />
                </div>

                {/* Role Filter Tabs */}
                <div className="flex gap-2 flex-wrap">
                    {['all', 'Student', 'Teacher', 'Parent', 'SuperAdmin'].map(r => (
                        <button
                            key={r}
                            onClick={() => setRoleFilter(r)}
                            className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                                roleFilter === r
                                    ? 'bg-slate-900 text-white shadow-md'
                                    : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-50'
                            }`}
                        >
                            {r === 'all' ? 'All' : r} 
                        </button>
                    ))}
                </div>
            </div>

            {/* Users Table */}
            {loading ? <Loader /> : (
                <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">User</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Email</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Role</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Joined</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {users.map((user) => (
                                    <tr key={user._id} className="group hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-black text-xs border border-blue-100">
                                                    {user.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                                                </div>
                                                <div>
                                                    <span className="text-sm font-bold text-slate-800 block">{user.name}</span>
                                                    <span className="text-[10px] text-slate-400 font-medium">{user.school || user.grade || ''}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-500">{user.email}</td>
                                        <td className="px-6 py-4">
                                            {editingUser === user._id ? (
                                                <div className="flex items-center gap-2">
                                                    <select
                                                        value={editRole}
                                                        onChange={(e) => setEditRole(e.target.value)}
                                                        className="text-xs font-bold border border-slate-200 rounded-lg px-2 py-1.5 focus:ring-2 focus:ring-blue-500/20"
                                                    >
                                                        <option value="Student">Student</option>
                                                        <option value="Teacher">Teacher</option>
                                                        <option value="Parent">Parent</option>
                                                        <option value="SuperAdmin">SuperAdmin</option>
                                                    </select>
                                                    <button
                                                        onClick={() => handleRoleUpdate(user._id)}
                                                        className="p-1 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                                                    >
                                                        <span className="material-symbols-outlined text-lg">check</span>
                                                    </button>
                                                    <button
                                                        onClick={() => { setEditingUser(null); setEditRole(''); }}
                                                        className="p-1 text-slate-400 hover:bg-slate-100 rounded-lg transition-colors"
                                                    >
                                                        <span className="material-symbols-outlined text-lg">close</span>
                                                    </button>
                                                </div>
                                            ) : (
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${roleStyles[user.role] || 'bg-slate-100 text-slate-600'}`}>
                                                    {user.role}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-400">{timeAgo(user.createdAt)}</td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all">
                                                <button
                                                    onClick={() => { setEditingUser(user._id); setEditRole(user.role); }}
                                                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                                                    title="Change Role"
                                                >
                                                    <span className="material-symbols-outlined text-lg">edit</span>
                                                </button>
                                                {user.role !== 'SuperAdmin' && (
                                                    <button
                                                        onClick={() => handleDelete(user._id, user.name)}
                                                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                                                        title="Delete User"
                                                    >
                                                        <span className="material-symbols-outlined text-lg">delete</span>
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {users.length === 0 && (
                        <div className="p-16 text-center flex flex-col items-center">
                            <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300 mb-4 border-2 border-dashed border-slate-200">
                                <span className="material-symbols-outlined text-3xl">search_off</span>
                            </div>
                            <h4 className="text-lg font-bold text-slate-800 mb-1">No users found</h4>
                            <p className="text-sm text-slate-500">Try adjusting your search or filter criteria.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default UserManagement;
