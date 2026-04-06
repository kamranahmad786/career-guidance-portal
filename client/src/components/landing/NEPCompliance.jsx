import React from 'react';

const NEPCompliance = () => {
    return (
        <section className="min-h-screen py-24 bg-slate-50 flex flex-col justify-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#1e293b 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
            
            <div className="w-full px-6 md:px-12 lg:px-20 relative text-left">
                <div className="bg-white p-12 md:p-20 rounded-[3.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 flex flex-col lg:flex-row gap-16 items-center">
                    <div className="lg:w-1/3 flex flex-col items-center text-center">
                        <div className="w-48 h-48 rounded-[3rem] bg-gradient-to-br from-primary to-primary-container flex flex-col items-center justify-center shadow-2xl mb-10 transform -rotate-3 hover:rotate-0 transition-transform duration-500">
                            <span className="text-sm font-bold text-white/80 uppercase tracking-tighter mb-1">Standard</span>
                            <span className="text-6xl font-black text-white">NEP</span>
                            <span className="text-sm font-bold text-white/80">2020</span>
                        </div>
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 font-bold text-xs uppercase tracking-widest mb-8">
                            <span className="material-symbols-outlined text-sm">verified</span>
                            Fully Compliant
                        </div>
                        <a href="https://www.education.gov.in/sites/upload_files/mhrd/files/NEP_Final_English_0.pdf" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-3 px-8 py-4 bg-on-surface text-white rounded-full font-bold hover:bg-primary transition-all shadow-xl hover:-translate-y-1">
                            <span className="material-symbols-outlined">picture_as_pdf</span>
                            Download Official PDF
                        </a>
                    </div>

                    <div className="lg:w-2/3">
                        <h2 className="text-4xl md:text-5xl font-extrabold font-headline mb-8 text-on-surface leading-tight">
                            Aligning with India's <span className="text-primary italic">Educational Vision</span>
                        </h2>
                        <p className="text-lg text-on-surface-variant mb-12 leading-relaxed font-['Inter']">
                            EduDisha is built from the ground up to support the National Education Policy 2020. We transform complex policy guidelines into actionable career growth for every student.
                        </p>
                        
                        <div className="grid md:grid-cols-3 gap-8">
                            {[
                                { title: 'Skill-Based Learning', desc: 'Prioritizing vocational exposure and practical skill acquisition over rote memorization.', icon: 'architecture' },
                                { title: 'Early Awareness', desc: 'Starting career exploration from primary years to build an organic interest profile.', icon: 'emoji_objects' },
                                { title: 'Holistic Development', desc: 'Integrated reports combining academic, behavioral, and technical aptitudes.', icon: 'hub' }
                            ].map((box, i) => (
                                <div key={i} className="p-6 rounded-[2rem] bg-slate-50 border border-slate-100 hover:bg-white hover:border-primary/20 transition-all duration-300 group">
                                    <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                                        <span className="material-symbols-outlined">{box.icon}</span>
                                    </div>
                                    <h4 className="font-bold font-headline text-on-surface mb-3">{box.title}</h4>
                                    <p className="text-sm text-on-surface-variant leading-relaxed font-['Inter']">{box.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default NEPCompliance;
