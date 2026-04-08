import React, { useState, useEffect } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import Loader from '../../components/common/Loader';

const Reports = () => {
    const { profile } = useOutletContext();
    const navigate = useNavigate();
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isGenerating, setIsGenerating] = useState(false);

    const fetchResults = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/quiz/results/my', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setResults(data);
            }
        } catch (err) {
            console.error('Failed to fetch reports:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchResults();
    }, []);

    const handleDownloadReport = async (resultId) => {
        setIsGenerating(true);
        // Using window.jspdf as integrated in Recommendations.jsx
        try {
            const selectedResult = results.find(r => r._id === resultId);
            if (!selectedResult) return;

            const { jsPDF } = window.jspdf;
            const doc = new jsPDF('p', 'mm', 'a4');
            const primaryColor = "#4f46e5";
            const textColor = "#1e293b";

            // Header - High Trust Branding
            doc.setFillColor(244, 247, 249);
            doc.rect(0, 0, 210, 60, 'F');
            
            doc.setFont("helvetica", "bold");
            doc.setFontSize(28);
            doc.setTextColor(primaryColor);
            doc.text("EduDisha Career AI", 20, 30);
            
            doc.setFontSize(10);
            doc.setTextColor(150);
            doc.text("NEP 2026 OFFICIAL HOLISTIC PROGRESS CARD", 20, 38);
            
            doc.setDrawColor(primaryColor);
            doc.setLineWidth(1);
            doc.line(20, 42, 190, 42);

            // Student Detail
            doc.setFontSize(12);
            doc.setTextColor(textColor);
            doc.text(`Student: ${profile?.schoolName || 'Valued Learner'} Identity`, 20, 75);
            doc.text(`Assessment ID: ${resultId.slice(-8).toUpperCase()}`, 20, 82);
            doc.text(`Issued On: ${new Date().toLocaleDateString('en-GB')}`, 20, 89);

            // Parameter Scores
            doc.setFontSize(16);
            doc.text("Competency Mapping", 20, 110);
            
            let y = 125;
            Object.entries(selectedResult.parameterScores || {}).forEach(([param, score]) => {
                doc.setFontSize(10);
                doc.setTextColor(100);
                doc.text(param, 20, y);
                
                // Bar
                doc.setFillColor(230, 230, 230);
                doc.rect(60, y-3, 100, 4, 'F');
                doc.setFillColor(79, 70, 229);
                doc.rect(60, y-3, score, 4, 'F');
                
                doc.setTextColor(primaryColor);
                doc.text(`${score}%`, 165, y);
                y += 12;
            });

            // Footer
            doc.setFontSize(8);
            doc.setTextColor(150);
            doc.text("This is an AI-generated academic report mapped to National Education Policy milestones.", 105, 285, { align: 'center' });
            doc.text("Verify at: edudisha.ai/verify", 105, 290, { align: 'center' });

            doc.save(`EduDisha_Holistic_Report_${resultId.slice(-4)}.pdf`);
        } catch (err) {
            console.error('PDF generation failed:', err);
            alert("Official Report generation failed. Please try again.");
        } finally {
            setIsGenerating(false);
        }
    };

    if (isLoading) return <Loader />;

    return (
        <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-6 duration-700">
            {/* Header Section */}
            <section className="mb-16">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10 mb-10">
                    <div>
                        <h2 className="text-4xl font-black text-slate-800 tracking-tight italic">DocCenter: Official Reports</h2>
                        <p className="text-slate-500 font-medium mt-1">Official National Education Policy (NEP) assessment certificates and progress cards.</p>
                    </div>
                </div>
                
                <div className="bg-indigo-600 rounded-[3rem] p-10 text-white relative overflow-hidden shadow-2xl">
                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-10">
                        <div>
                            <h3 className="text-2xl font-black mb-4">Verification Registry</h3>
                            <p className="opacity-80 font-bold max-w-xl text-sm leading-relaxed">
                                All certificates issued through EduDisha are cryptographically synced with your school registry. 
                                These documentation blocks are valid for future college admissions and professional internships.
                            </p>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="material-symbols-outlined text-white/20 text-8xl absolute -bottom-4 right-10">verified_user</span>
                            <p className="text-[10px] font-black opacity-60 uppercase tracking-widest text-center mt-2 group-hover:scale-110 transition-all">Verified Academic Credentials</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Reports List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {results.length > 0 ? results.map((report, idx) => (
                    <div key={report._id} className="bg-white p-8 rounded-[3rem] border border-slate-100 hover:shadow-2xl transition-all group">
                        <div className="flex justify-between items-start mb-8">
                            <div className="w-14 h-14 rounded-2xl bg-slate-50 text-slate-300 flex items-center justify-center group-hover:bg-primary/5 group-hover:text-primary transition-all duration-500">
                                <span className="material-symbols-outlined text-3xl">article</span>
                            </div>
                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                                {new Date(report.createdAt).toLocaleDateString('en-GB')}
                            </span>
                        </div>
                        
                        <h4 className="text-lg font-black text-slate-800 font-headline mb-2 uppercase tracking-tight group-hover:text-primary transition-colors">Assessment Card</h4>
                        <p className="text-[10px] font-black text-slate-400 italic mb-10">Ref: {report._id.slice(-8).toUpperCase()}</p>
                        
                        <div className="space-y-4 mb-10">
                            <div className="flex justify-between items-center">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Aptitude Match</p>
                                <p className="text-xs font-black text-emerald-500 italic decoration-2 underline decoration-emerald-100 underline-offset-4">{report.topParameters?.[0]}</p>
                            </div>
                            <div className="h-0.5 w-full bg-slate-50"></div>
                        </div>

                        <button 
                            onClick={() => handleDownloadReport(report._id)}
                            disabled={isGenerating}
                            className={`w-full py-5 bg-on-surface text-white rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest shadow-xl shadow-slate-200 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 ${isGenerating ? 'opacity-70 cursor-wait' : ''}`}
                        >
                            <span className={`material-symbols-outlined text-lg ${isGenerating ? 'animate-spin' : ''}`}>
                                {isGenerating ? 'sync' : 'cloud_download'}
                            </span>
                            {isGenerating ? 'Authenticating...' : 'Download Official PDF'}
                        </button>
                    </div>
                )) : (
                    <div className="col-span-full py-32 bg-white/50 rounded-[4rem] border-4 border-dashed border-slate-200 text-center">
                        <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 border border-slate-100">
                            <span className="material-symbols-outlined text-5xl text-slate-200">folder_open</span>
                        </div>
                        <h2 className="text-2xl font-black text-slate-800 mb-2 font-headline tracking-tight uppercase">Documentation Vault Empty</h2>
                        <p className="text-slate-400 font-medium text-sm max-w-md mx-auto mb-10 italic">
                            Official reports are generated after you complete your career assessments. Your registry is currently waiting for initial data.
                        </p>
                        <button onClick={() => navigate('/student/quiz')} className="px-10 py-5 bg-primary text-white rounded-[2rem] font-black text-[11px] uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 transition-all">
                            Initiate Baseline Assessment
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Reports;
