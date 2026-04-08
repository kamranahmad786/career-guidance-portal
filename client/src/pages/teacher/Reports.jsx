import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import Loader from '../../components/common/Loader';

const TeacherReports = () => {
    const { data: layoutData } = useOutletContext();
    const [roster, setRoster] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isExporting, setIsExporting] = useState(false);

    const fetchRoster = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/teacher/roster', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setRoster(data);
            }
        } catch (err) {
            console.error('Failed to fetch roster:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchRoster();
    }, []);

    const exportSchoolRoster = () => {
        setIsExporting(true);
        try {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            const schoolName = roster[0]?.school || "EduDisha Partner School";
            const date = new Date().toLocaleDateString('en-GB');

            // Header
            doc.setFillColor(15, 23, 42); // slate-900
            doc.rect(0, 0, 210, 40, 'F');
            
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(22);
            doc.setFont("helvetica", "bold");
            doc.text("EduDisha Educator Portal", 20, 20);
            
            doc.setFontSize(10);
            doc.setFont("helvetica", "normal");
            doc.text(`Official School Career Readiness Audit - ${date}`, 20, 30);

            // School Info
            doc.setTextColor(15, 23, 42);
            doc.setFontSize(14);
            doc.text(`School: ${schoolName}`, 20, 55);
            
            doc.setFontSize(10);
            doc.text(`Total Roster: ${roster.length} Students`, 20, 62);
            doc.text(`Completed Assessments: ${roster.filter(s => s.status === 'Completed').length}`, 20, 67);

            // Table
            const tableData = roster.map(s => [
                s.name,
                s.grade || 'N/A',
                s.interest || 'Unmapped',
                s.score || '--',
                s.status
            ]);

            // Using the autoTable plugin which attaches to the jsPDF instance
            doc.autoTable({
                startY: 80,
                head: [['Student Name', 'Grade', 'Primary Interest', 'Aptitude Score', 'Status']],
                body: tableData,
                styles: { fontSize: 8, cellPadding: 4 },
                headStyles: { fillColor: [59, 130, 246], textColor: [255, 255, 255] },
                alternateRowStyles: { fillColor: [248, 250, 252] }
            });

            // Footer
            const pageCount = doc.internal.getNumberOfPages();
            doc.setFontSize(8);
            doc.setTextColor(148, 163, 184); // slate-400
            for(let i = 1; i <= pageCount; i++) {
                doc.setPage(i);
                doc.text(`EduDisha AI Internal Audit Component / Page ${i} of ${pageCount}`, 20, 285);
            }

            doc.save(`School_Career_Audit_${schoolName.replace(/\s+/g, '_')}_${date}.pdf`);
        } catch (err) {
            console.error("Export failed:", err);
        } finally {
            setIsExporting(false);
        }
    };

    if (isLoading) return <Loader />;

    return (
        <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
            {/* Header section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
                <div>
                    <h2 className="text-4xl font-black text-slate-800 tracking-tight italic">Document Center</h2>
                    <p className="text-slate-500 font-medium mt-1">Generate official school-wide career audits and class performance summaries.</p>
                </div>
                <button 
                    onClick={exportSchoolRoster}
                    disabled={isExporting}
                    className="group relative px-10 py-4 bg-primary text-white font-black uppercase text-[10px] tracking-widest rounded-[2rem] shadow-2xl shadow-primary/30 hover:-translate-y-1 transition-all overflow-hidden disabled:opacity-50"
                >
                    <span className="relative z-10 flex items-center gap-3">
                        <span className="material-symbols-outlined text-lg">{isExporting ? 'sync' : 'picture_as_pdf'}</span>
                        {isExporting ? 'Generating Audit...' : 'Export School Master Roster'}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* School Audit Card */}
                <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm relative group overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/[0.03] rounded-bl-[10rem] group-hover:w-full group-hover:h-full group-hover:rounded-none transition-all duration-700"></div>
                    
                    <div className="relative z-10">
                        <div className="w-16 h-16 rounded-[2rem] bg-primary/5 flex items-center justify-center text-primary mb-8">
                            <span className="material-symbols-outlined text-3xl font-bold">description</span>
                        </div>
                        <h3 className="text-2xl font-black text-slate-800 tracking-tight mb-3 italic">Class Performance <br/>Summaries</h3>
                        <p className="text-sm font-semibold text-slate-500 leading-relaxed mb-8">
                            Detailed report cards aggregating performance metrics for specific grade clusters. Used for professional educator audits and school registry updates.
                        </p>
                        <div className="flex items-center gap-4">
                            <span className="text-[10px] font-black text-primary uppercase tracking-widest bg-primary/5 px-4 py-1.5 rounded-full border border-primary/10">NEP 2026 Compliant</span>
                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest italic">Live Status: Synced</span>
                        </div>
                    </div>
                </div>

                {/* Audit History */}
                <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
                    <h3 className="text-xl font-black text-slate-800 tracking-tight mb-8">Generated Report Queue</h3>
                    <div className="space-y-4">
                        {[
                            { name: 'Semester 1 - Career Readiness Audit', date: '02/04/2026', size: '2.4 MB', type: 'School-Wide' },
                            { name: 'Grade 10 - Logic Assessment Cluster', date: '28/03/2026', size: '1.1 MB', type: 'Class-Specific' },
                            { name: 'Parent Engagement Summary (March)', date: '15/03/2026', size: '0.9 MB', type: 'External' }
                        ].map((doc, i) => (
                            <div key={i} className="flex items-center justify-between p-6 bg-slate-50 rounded-[2rem] border border-slate-50 hover:border-primary/10 hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 transition-all cursor-pointer group">
                                <div className="flex items-center gap-5">
                                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors">
                                        <span className="material-symbols-outlined text-xl">file_present</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-slate-800 tracking-tight group-hover:text-primary transition-colors">{doc.name}</p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                                            {doc.date} • {doc.size} • {doc.type}
                                        </p>
                                    </div>
                                </div>
                                <span className="material-symbols-outlined text-slate-200 group-hover:text-primary transition-colors">download</span>
                            </div>
                        ))}
                    </div>
                    
                    <div className="mt-10 p-6 bg-slate-50/50 rounded-[2rem] border border-dashed border-slate-200 flex items-center justify-center">
                        <p className="text-[11px] font-black text-slate-300 uppercase tracking-widest italic">End of record history</p>
                    </div>
                </div>
            </div>

            {/* Verification Badge */}
            <div className="flex items-center gap-3 justify-center py-10">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-500">
                    <span className="material-symbols-outlined text-lg font-bold">verified_user</span>
                </div>
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] italic">Authenticated Document Engine Active</p>
            </div>
        </div>
    );
};

export default TeacherReports;
