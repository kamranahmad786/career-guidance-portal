import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import Loader from '../../components/common/Loader';

const StudentManagement = () => {
    const { data } = useOutletContext();
    const [roster, setRoster] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedGrade, setSelectedGrade] = useState('All');

    useEffect(() => {
        const fetchRoster = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch('/api/teacher/roster', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    const result = await res.json();
                    setRoster(result);
                }
            } catch (err) {
                console.error('Failed to fetch roster:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchRoster();
    }, []);

    const grades = ['All', ...new Set(roster.map(s => s.class === "Not specified" ? "Unassigned" : s.class))].filter(Boolean);

    const filteredRoster = roster.filter(student => {
        const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             student.email.toLowerCase().includes(searchTerm.toLowerCase());
        
        const studentGrade = student.class === "Not specified" ? "Unassigned" : student.class;
        const matchesGrade = selectedGrade === 'All' || studentGrade === selectedGrade;
        
        return matchesSearch && matchesGrade;
    });

    if (loading) return <Loader />;

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
            {/* Header / Intro */}
            <section className="bg-white/80 backdrop-blur-xl rounded-3xl p-10 flex flex-col md:flex-row justify-between items-center gap-6 border border-slate-100 shadow-sm">
                <div>
                    <h2 className="text-4xl font-black text-slate-800 tracking-tight italic">Student Roster</h2>
                    <p className="text-slate-500 text-lg font-medium mt-1">Class monitoring and career alignment for {data?.teacherProfile?.schoolName || 'your school'}.</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="px-6 py-3 bg-primary text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-primary/20">
                        Total {roster.length} Students
                    </div>
                </div>
            </section>

            {/* Filter Controls */}
            <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
                <div className="relative w-full md:w-96">
                    <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                    <input 
                        type="text"
                        placeholder="Search by name or email..."
                        className="w-full pl-14 pr-6 py-4 bg-white border border-slate-100 rounded-2xl font-bold text-slate-700 focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all shadow-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-4 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
                    {grades.map(grade => (
                        <button
                            key={grade}
                            onClick={() => setSelectedGrade(grade)}
                            className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border
                                ${selectedGrade === grade ? 'bg-slate-900 text-white border-slate-900 shadow-xl' : 'bg-white text-slate-400 border-slate-100 hover:border-primary'}`}
                        >
                            {grade}
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Table */}
            <div className="bg-white rounded-[3rem] overflow-hidden shadow-xl shadow-slate-200/50 border border-slate-100">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50/50 border-b border-slate-100">
                            <tr>
                                <th className="px-10 py-8 text-[10px] font-black uppercase tracking-widest text-slate-400">Student Identity</th>
                                <th className="px-10 py-8 text-[10px] font-black uppercase tracking-widest text-slate-400">Class / Grade</th>
                                <th className="px-10 py-8 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Aptitude Status</th>
                                <th className="px-10 py-8 text-[10px] font-black uppercase tracking-widest text-slate-400">Top Career Interest</th>
                                <th className="px-10 py-8 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Avg Score</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredRoster.map((student, i) => (
                                <tr key={i} className="group hover:bg-slate-50/50 transition-colors">
                                    <td className="px-10 py-6">
                                        <div className="flex items-center gap-5">
                                            <div className="w-12 h-12 rounded-2xl bg-primary/5 text-primary flex items-center justify-center text-sm font-black shadow-inner group-hover:scale-110 transition-transform">
                                                {student.name.charAt(0)}
                                            </div>
                                            <div className="flex flex-col">
                                                <p className="font-black text-slate-800 tracking-tight text-lg leading-tight group-hover:text-primary transition-colors">{student.name}</p>
                                                <p className="text-slate-400 font-bold text-xs uppercase tracking-tight">{student.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-6">
                                        <span className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border italic
                                            ${student.class === "Not specified" ? "bg-slate-50 text-slate-300 border-slate-100" : "bg-slate-50 text-slate-600 border-slate-100"}`}>
                                            {student.class === "Not specified" ? "Unassigned" : student.class}
                                        </span>
                                    </td>
                                    <td className="px-10 py-6 text-center">
                                        <div className={`inline-flex items-center gap-3 px-6 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border
                                            ${student.status === 'Completed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                                              student.status === 'Not Started' ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-slate-50 text-slate-400 border-slate-100'}`}>
                                            <span className={`w-2 h-2 rounded-full ${student.status === 'Completed' ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`}></span>
                                            {student.status}
                                        </div>
                                    </td>
                                    <td className="px-10 py-6">
                                        <div className="flex flex-col">
                                            <p className="font-black text-slate-700 uppercase tracking-[0.1em] text-[10px] leading-tight mb-2 underline decoration-indigo-200 decoration-2 underline-offset-4">{student.interest}</p>
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic opacity-60">Career Stream Match</p>
                                        </div>
                                    </td>
                                    <td className="px-10 py-6 text-right">
                                        <span className="text-2xl font-black text-primary italic pr-4">{student.score}</span>
                                    </td>
                                </tr>
                            ))}
                            {filteredRoster.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="px-10 py-32 text-center">
                                        <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
                                            <span className="material-symbols-outlined text-4xl text-slate-200">person_search</span>
                                        </div>
                                        <p className="text-slate-400 font-black uppercase tracking-[0.2em] italic">No Students Matching Your Filter</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Stats Summary Helper */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-10">
                <div className="bg-primary/5 p-10 rounded-[3rem] border border-primary/10 relative overflow-hidden group">
                    <div className="relative z-10">
                        <h4 className="text-primary font-black uppercase tracking-widest text-[10px] mb-4">NEP 2020 Compliance</h4>
                        <p className="text-slate-700 font-bold leading-relaxed italic pr-12">
                            Assessment data is mapped to developmental milestones as prescribed by the National Education Policy, focusing on holistic talent recognition.
                        </p>
                    </div>
                </div>
                <div className="bg-slate-900 p-10 rounded-[3rem] text-white relative overflow-hidden group">
                    <div className="relative z-10">
                        <h4 className="text-white/40 font-black uppercase tracking-widest text-[10px] mb-4">Export Capabilities</h4>
                        <p className="text-white/80 font-bold leading-relaxed italic pr-12">
                            Securely export class records for official academic audits or parent-teacher meeting briefings.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentManagement;
