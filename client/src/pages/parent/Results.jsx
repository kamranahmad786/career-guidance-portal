import React from 'react';
import { useOutletContext, Link } from 'react-router-dom';

const ResultsHistory = () => {
    const { data } = useOutletContext();

    if (!data?.linked) return <div className="text-center py-20 text-slate-400 font-bold italic">Link a student to view their assessment history.</div>;

    const results = data.resultsHistory || [];

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-6 duration-500">
            <h2 className="text-3xl font-black text-slate-800 tracking-tight">Assessment History</h2>
            
            <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100">
                <table className="w-full text-left">
                    <thead className="bg-slate-50/50 border-b border-slate-100">
                        <tr>
                            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Date Completed</th>
                            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Quiz Category</th>
                            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Aptitude Score</th>
                            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Top Parameter</th>
                            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {results.map((res, i) => (
                            <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                                <td className="px-8 py-6 font-bold text-slate-600 group-hover:text-primary transition-colors">{new Date(res.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</td>
                                <td className="px-8 py-6 font-black text-slate-800">Career Aptitude v{results.length - i}</td>
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-3">
                                        {(() => {
                                            const scores = Object.values(res.parameterScores || {});
                                            const avg = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
                                            return (
                                                <>
                                                    <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
                                                        <div className="h-full bg-primary" style={{ width: `${avg}%` }}></div>
                                                    </div>
                                                    <span className="text-sm font-black text-primary">{avg}%</span>
                                                </>
                                            );
                                        })()}
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <span className="px-4 py-1.5 bg-amber-50 text-amber-700 rounded-xl text-[10px] font-black uppercase tracking-[0.1em] border border-amber-100 italic">
                                        {res.topParameters?.[0] || 'Strategic Thinking'}
                                    </span>
                                </td>
                                <td className="px-8 py-6">
                                    <Link 
                                        to={`/parent/result/${res._id}`}
                                        className="flex items-center gap-2 text-primary font-black text-xs uppercase tracking-widest hover:underline group-hover:translate-x-1 transition-transform"
                                    >
                                        View Report
                                        <span className="material-symbols-outlined text-sm">open_in_new</span>
                                    </Link>
                                </td>
                            </tr>
                        ))}
                        {results.length === 0 && (
                            <tr><td colSpan="5" className="px-8 py-20 text-center text-slate-400 font-bold italic">No assessment history recorded. Your child should complete their first career quiz to see data here.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
            
            <div className="p-8 bg-indigo-50/50 rounded-[2.5rem] border border-indigo-100">
                <div className="flex items-start gap-6">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm border border-indigo-100">
                        <span className="material-symbols-outlined italic">verified</span>
                    </div>
                    <div>
                        <h4 className="text-sm font-black text-indigo-900 uppercase tracking-widest mb-2">NEP 2020 Compliance</h4>
                        <p className="text-xs text-indigo-700 font-medium leading-relaxed opacity-80">Every assessment report is generated according to the National Education Policy 2020 guidelines, focusing on core aptitude and creative intelligence rather than just academic grades.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResultsHistory;
