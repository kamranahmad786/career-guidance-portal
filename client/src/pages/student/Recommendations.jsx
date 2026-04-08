import React, { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const Recommendations = () => {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState(null);
    const [isDownloading, setIsDownloading] = useState(false);
    const reportRef = useRef();
    const pdfHeaderRef = useRef();

    useEffect(() => {
        const fetchRecs = async () => {
            try {
                const res = await fetch('/api/recommendations/my', {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                });
                if (res.ok) {
                    const rec = await res.json();
                    // New backend returns a single object
                    setData(Array.isArray(rec) ? rec[0] : rec);
                }
            } catch (err) {
                console.error('Failed to fetch recommendations:', err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchRecs();
    }, []);

    const handleDownloadPDF = async () => {
        if (isDownloading) return;
        setIsDownloading(true);

        try {
            // Show the PDF-only header temporarily
            if (pdfHeaderRef.current) pdfHeaderRef.current.style.display = 'block';
            
            const element = reportRef.current;
            const canvas = await window.html2canvas(element, {
                scale: 2,
                useCORS: true,
                logging: false,
                backgroundColor: "#f4f7f9"
            });

            // Hide it back
            if (pdfHeaderRef.current) pdfHeaderRef.current.style.display = 'none';

            const imgData = canvas.toDataURL('image/png');
            const { jsPDF } = window.jspdf;
            
            // Calculate height for a single long page
            const imgProps = canvas.width / canvas.height;
            const pdfWidth = 210; // A4 width in mm
            const pdfHeight = pdfWidth / imgProps;

            const pdf = new jsPDF('p', 'mm', [pdfWidth, pdfHeight]);
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`EduDisha_Report_${user?.name || 'Student'}_${new Date().getTime()}.pdf`);
        } catch (err) {
            console.error('PDF Generation Failed:', err);
            alert("Report generation failed. Please try again.");
        } finally {
            setIsDownloading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-surface">
                <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">Decoding Career Path...</p>
            </div>
        );
    }

    // Default structure if no data exists yet
    const displayData = data || {
        careers: ["AI Research Scientist", "Software Developer", "Digital Product Designer"],
        courses: ["Advanced Machine Learning", "Full Stack Specialization"],
        roadmap: "Step 1: Complete the Assessment\nStep 2: Review your Top 3 Interests\nStep 3: Begin your tailored Learning Path",
        topParameters: ["Exploration Phase"]
    };

    // Parse roadmap string into steps
    const roadmapSteps = displayData.roadmap.split('\n').filter(s => s.trim() !== "");

    return (
        <div ref={reportRef} className="max-w-7xl mx-auto">
            {/* PDF ONLY HEADER (Hidden on UI) */}
            <div ref={pdfHeaderRef} style={{ display: 'none' }} className="mb-12 border-b-2 border-indigo-100 pb-10">
                <div className="flex justify-between items-end">
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                                <span className="material-symbols-outlined text-white text-lg">psychology</span>
                            </div>
                            <span className="text-2xl font-black text-indigo-600 tracking-tighter">EduDisha</span>
                        </div>
                        <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Private & Confidential</h2>
                        <h1 className="text-3xl font-black text-on-surface">Career Intelligence Report</h1>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] font-black text-indigo-600 uppercase mb-1">Prepared For</p>
                        <p className="text-xl font-bold text-on-surface">{user?.name || 'Valued Student'}</p>
                        <p className="text-[10px] text-slate-400 mt-2 font-medium">Issue Date: {new Date().toLocaleDateString('en-GB')}</p>
                    </div>
                </div>
            </div>

            {/* Header */}
            <div className="mb-16">
                <button onClick={() => navigate('/student/dashboard')} className="flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-widest mb-6 hover:text-primary transition-colors">
                    <span className="material-symbols-outlined text-sm">arrow_back</span>
                    Back to Dashboard
                </button>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
                    <div>
                        <div className="flex items-center gap-4 mb-4">
                            <span className="px-4 py-1.5 bg-indigo-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-indigo-500/20">
                                AI Strategy Ready
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-on-surface font-headline mb-4 tracking-tight">AI Career Strategy</h1>
                        <p className="text-slate-400 font-medium max-w-2xl text-lg">Derived from your <span className="text-indigo-600 font-bold italic">Deep Interest Analysis</span>, these paths represent your highest alignment across 12 parameters.</p>
                    </div>
                    <button 
                        onClick={handleDownloadPDF}
                        disabled={isDownloading}
                        className={`px-8 py-4 bg-indigo-600 text-white rounded-[2rem] shadow-xl shadow-indigo-600/20 flex items-center gap-3 text-[11px] font-black uppercase tracking-widest hover:scale-105 transition-all ${isDownloading ? 'opacity-70 cursor-wait' : ''}`}
                    >
                        <span className={isDownloading ? "animate-spin material-symbols-outlined" : "material-symbols-outlined"}>
                            {isDownloading ? "sync" : "file_download"}
                        </span>
                        {isDownloading ? "Generating Report..." : "Download Full Report"}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Career Match Cards */}
                <div className="lg:col-span-2 space-y-8">
                    <h3 className="text-2xl font-black text-on-surface font-headline mb-8 flex items-center gap-4">
                        <span className="w-2 h-8 bg-indigo-500 rounded-full"></span>
                        Target Professional Domains
                    </h3>
                    {displayData.careers.map((careerTitle, idx) => (
                        <div key={idx} className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-50 group hover:shadow-2xl transition-all relative overflow-hidden">
                            {/* Visual Accent */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform"></div>
                            
                            <div className="flex flex-col md:flex-row gap-8 relative z-10">
                                <div className={`w-20 h-20 rounded-[2rem] flex-shrink-0 flex items-center justify-center border transition-all duration-500
                                    ${idx === 0 ? 'bg-indigo-50 border-indigo-100 text-indigo-600' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>
                                    <span className="material-symbols-outlined text-4xl">
                                        {idx === 0 ? 'rocket_launch' : (idx === 1 ? 'terminal' : 'palette')}
                                    </span>
                                </div>
                                <div className="flex-grow">
                                    <div className="flex justify-between items-center mb-4">
                                        <h4 className="text-2xl font-black text-on-surface font-headline">{careerTitle}</h4>
                                        <span className="text-xl font-black text-indigo-600 px-4 py-1 bg-indigo-50 rounded-full">
                                            {idx === 0 ? '98%' : (idx === 1 ? '92%' : '85%')} Match
                                        </span>
                                    </div>
                                    <p className="text-slate-400 font-medium leading-relaxed mb-10 text-base">
                                        Strategically aligned with your high performance in <span className="text-indigo-600 font-bold">{displayData.topParameters?.join(", ") || "General Domains"}</span>. This path offers high growth and creative satisfaction.
                                    </p>
                                    <div className="flex flex-wrap gap-6 pt-6 border-t border-slate-50">
                                        <button className="flex items-center gap-2 text-indigo-600 font-black text-[10px] uppercase tracking-widest hover:gap-4 transition-all pb-1 border-b-2 border-transparent hover:border-indigo-600">
                                            Analyze Industry Demand
                                            <span className="material-symbols-outlined text-sm">trending_up</span>
                                        </button>
                                        <button className="flex items-center gap-2 text-slate-400 font-black text-[10px] uppercase tracking-widest hover:text-on-surface transition-all">
                                            Skill Requirements
                                            <span className="material-symbols-outlined text-sm">list_alt</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Sidebar: Next Steps & Resources */}
                <div className="space-y-12">
                    {/* Learning Roadmap Widget */}
                    <div className="bg-on-surface p-10 rounded-[3.5rem] shadow-2xl text-white relative overflow-hidden group">
                        <h3 className="text-2xl font-black mb-10 font-headline relative z-10 flex items-center gap-3">
                            <span className="material-symbols-outlined text-indigo-400">route</span>
                            Execution Plan
                        </h3>
                        <div className="space-y-10 relative z-10">
                            {roadmapSteps.map((step, idx) => (
                                <div key={idx} className="flex gap-6 items-start relative">
                                    {idx < roadmapSteps.length - 1 && (
                                        <div className="absolute left-4 top-10 w-[2.5px] h-10 bg-white/10 rounded-full"></div>
                                    )}
                                    <div className="w-8 h-8 rounded-xl bg-indigo-500 flex-shrink-0 flex items-center justify-center text-[10px] font-black border-4 border-on-surface group-hover:rotate-12 transition-transform">
                                        {idx + 1}
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm leading-relaxed text-slate-100">{step.includes(':') ? step.split(':')[1].trim() : step}</p>
                                        <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mt-1">
                                            {step.includes(':') ? step.split(':')[0].trim() : `Phase ${idx + 1}`}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="absolute -top-20 -right-20 w-64 h-64 bg-indigo-500/10 blur-[100px] rounded-full"></div>
                    </div>

                    {/* Top Resources */}
                    <div className="bg-white p-12 rounded-[3.5rem] shadow-lg border border-slate-50">
                        <h3 className="text-xl font-black text-on-surface font-headline mb-8">Guided Learning</h3>
                        <div className="space-y-6">
                            {displayData.courses.map((courseTitle, idx) => (
                                <div key={idx} className="p-6 bg-slate-50 rounded-[2.5rem] border border-transparent hover:border-indigo-100 hover:bg-white hover:shadow-xl transition-all cursor-pointer group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center">
                                            <span className="material-symbols-outlined text-xl">auto_stories</span>
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black text-indigo-600 uppercase tracking-widest mb-1">Recommended Resource</p>
                                            <p className="text-sm font-black text-on-surface group-hover:text-indigo-600 transition-colors">{courseTitle}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="w-full mt-10 py-5 bg-slate-50 text-slate-400 rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-indigo-50 hover:text-indigo-600 transition-all border border-slate-100">
                            Explore Educational Library
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Recommendations;
