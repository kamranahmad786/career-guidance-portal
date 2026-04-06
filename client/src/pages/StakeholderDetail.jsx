import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const StakeholderDetail = () => {
    const { type } = useParams();
    const navigate = useNavigate();

    const stakeholderData = {
        student: {
            title: 'For Students',
            subtitle: 'Navigate Your Future with AI Precision',
            description: 'Unlock your hidden potential with the world’s most advanced career mapping ecosystem. Built on NEP 2020 guidelines, we help you bridge the gap between academic learning and industry success.',
            icon: 'school',
            color: 'text-indigo-600',
            bg: 'bg-indigo-600',
            features: [
                { title: 'AI-Powered Career Mapping', desc: 'Our neural engines analyze your behavioral traits and academic performance to suggest non-linear career paths you never knew existed.', icon: 'psychology' },
                { title: 'Simulated Internships', desc: 'Experience a day in the life of a FinTech analyst, Robotics engineer, or Creative director through our immersive virtual job simulations.', icon: 'biotech' },
                { title: 'Industry-Standard Certifications', desc: 'Gain micro-credentials verified by global firms to make your profile stand out in the 2026 job market.', icon: 'card_membership' }
            ]
        },
        parent: {
            title: 'For Parents',
            subtitle: 'Data-Driven Peace of Mind',
            description: 'Take the guesswork out of your child’s future. EduDisha provides you with real-time analytics and comprehensive reports to support your child’s unique professional journey.',
            icon: 'volunteer_activism',
            color: 'text-emerald-600',
            bg: 'bg-emerald-600',
            features: [
                { title: 'Real-Time Progress Monitoring', desc: 'Stay updated on your child’s career exploration milestones through a dedicated parent-transparency dashboard.', icon: 'monitoring' },
                { title: 'Career Clarity Reports', desc: 'Receive in-depth, AI-generated reports that explain market trends and why certain paths are recommended for your child.', icon: 'assignment' },
                { title: 'Financial Planning Insights', desc: 'Understand the investment required for different career paths and explore global scholarship opportunities.', icon: 'payments' }
            ]
        },
        teacher: {
            title: 'For Teachers',
            subtitle: 'Empower Your Classroom',
            description: 'Transform from an educator to a career strategist. Use our classroom analytics to provide personalized guidance that resonates with every individual student’s aptitude.',
            icon: 'co_present',
            color: 'text-purple-600',
            bg: 'bg-purple-600',
            features: [
                { title: 'Behavioral Analytics', desc: 'Identify student strengths and learning gaps through interactive behavioral data gathered during the career mapping process.', icon: 'analytics' },
                { title: 'NEP 2020 Toolkits', desc: 'Access pre-built lesson plans and activities that meet the latest vocational training standards mandated by the government.', icon: 'task' },
                { title: 'Precision Aptitude Reports', desc: 'Generate classroom-wide reports to understand group dynamics and tailor your mentoring approach accordingly.', icon: 'leaderboard' }
            ]
        },
        admin: {
            title: 'For Institutions',
            subtitle: 'Scaling Excellence',
            description: 'Manage entire educational ecosystems with institutional-grade tools. From performance tracking to NEP compliance, EduDisha is your command center for professional scaling.',
            icon: 'admin_panel_settings',
            color: 'text-slate-800',
            bg: 'bg-slate-800',
            features: [
                { title: 'Centralized Data Management', desc: 'Secure, cloud-based storage for all student career data, providing long-term longitudinal insights for the institution.', icon: 'cloud_done' },
                { title: 'Governance Dashboards', desc: 'Monitor platform usage and career outcomes at scale, with tools designed for high-level decision making.', icon: 'dashboard_customize' },
                { title: 'NEP Compliance Tracking', desc: 'Automatically track and report on how your institution is meeting national vocational and career guidance standards.', icon: 'fact_check' }
            ]
        }
    };

    const data = stakeholderData[type?.toLowerCase()] || stakeholderData.student;

    return (
        <div className="bg-[#f8fafc] min-h-screen font-body">
            {/* Simple Landing-specific Navbar wrapper or global navbar */}
            <Navbar navigate={navigate} onOpenSettings={() => {}} />

            <main className="pt-24 pb-20">
                {/* Hero Section */}
                <section className="px-4 md:px-12 lg:px-24 mb-20 lg:mb-32">
                    <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
                        <div className="flex-1 text-center lg:text-left">
                            <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full ${data.bg}/10 ${data.color} font-black text-xs md:text-sm uppercase tracking-widest mb-8 border border-${data.bg}/20 shadow-sm`}>
                                <span className="material-symbols-outlined text-lg">{data.icon}</span>
                                {data.title}
                            </div>
                            <h1 className="text-3xl md:text-5xl font-black text-on-surface mb-5 font-headline tracking-tight leading-loose italic">
                                {data.subtitle}
                            </h1>
                            <p className="text-on-surface-variant text-base md:text-lg font-medium max-w-xl leading-relaxed mb-8 mx-auto lg:mx-0">
                                {data.description}
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                                <button 
                                    onClick={() => navigate('/register')}
                                    className={`px-8 py-4 ${data.bg} text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl hover:scale-[1.03] active:scale-95 transition-all flex items-center justify-center gap-2`}
                                >
                                    Join the Platform
                                    <span className="material-symbols-outlined text-sm font-black">arrow_forward</span>
                                </button>
                                <button 
                                    onClick={() => navigate('/library')}
                                    className="px-8 py-4 bg-white border border-slate-200 text-on-surface rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                                >
                                    Explore Library
                                    <span className="material-symbols-outlined text-sm">auto_stories</span>
                                </button>
                            </div>
                        </div>
                        <div className="flex-1 w-full max-w-2xl">
                            <div className={`relative p-8 md:p-12 rounded-[3.5rem] ${data.bg} overflow-hidden shadow-2xl group`}>
                                <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                                <div className="relative z-10 grid grid-cols-2 gap-4">
                                    {[1,2,3,4].map(i => (
                                        <div key={i} className="aspect-square rounded-3xl bg-white/10 backdrop-blur-md border border-white/20"></div>
                                    ))}
                                </div>
                                {/* Abstract pattern */}
                                <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 blur-[80px] rounded-full translate-x-20 -translate-y-20"></div>
                                <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 blur-[80px] rounded-full -translate-x-20 translate-y-20"></div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Grid */}
                <section className="px-4 md:px-12 lg:px-24 mb-32">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-16 gap-6 text-center md:text-left">
                            <div>
                                <h2 className="text-3xl md:text-5xl font-black text-on-surface mb-3 font-headline leading-tight italic">Why Choose <span className="text-primary italic">EduDisha?</span></h2>
                                <p className="text-on-surface-variant font-bold text-sm tracking-widest uppercase opacity-60">Engineered for deep professional alignment</p>
                            </div>
                            <div className="px-6 py-3 rounded-2xl bg-white border border-slate-200 text-sm font-black text-on-surface shadow-sm">
                                NEP 2020 Compliant
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {data.features.map((feature, idx) => (
                                <div key={idx} className="group p-8 bg-white rounded-[2.5rem] border border-slate-100 ambient-shadow hover:border-primary/30 transition-all duration-500 hover:-translate-y-2">
                                    <div className={`w-14 h-14 rounded-2xl ${data.bg}/5 flex items-center justify-center mb-6 border border-${data.bg}/10 group-hover:scale-110 transition-transform duration-500`}>
                                        <span className={`material-symbols-outlined ${data.color} text-2xl font-black`}>{feature.icon}</span>
                                    </div>
                                    <h3 className="text-lg font-extrabold text-on-surface mb-3 font-headline leading-tight">{feature.title}</h3>
                                    <p className="text-on-surface-variant font-medium text-[13px] leading-relaxed mb-4 opacity-80">
                                        {feature.desc}
                                    </p>
                                    <div className={`w-10 h-10 rounded-full ${data.bg}/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity`}>
                                        <span className={`material-symbols-outlined ${data.color} text-sm`}>add</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Final CTA */}
                <section className="px-4 md:px-12 lg:px-24">
                    <div className={`max-w-7xl mx-auto p-10 md:p-20 rounded-[3rem] bg-on-surface text-white relative overflow-hidden flex flex-col items-center text-center shadow-2xl`}>
                        <div className="relative z-10">
                            <h2 className="text-2xl md:text-4xl font-black mb-6 font-headline tracking-tighter leading-none italic">
                                Ready to join the <span className="text-primary italic">revolution?</span>
                            </h2>
                            <p className="text-white/60 text-sm md:text-lg font-medium max-w-xl mx-auto mb-10 leading-relaxed">
                                Join over 50,000 students and educators scaling their professional futures with EduDisha’s high-fidelity AI ecosystem.
                            </p>
                            <button 
                                onClick={() => navigate('/register')}
                                className="px-10 py-4 bg-white text-on-surface rounded-full font-black text-xs md:text-sm uppercase tracking-[0.2em] shadow-2xl hover:scale-105 active:scale-95 transition-all"
                            >
                                Get Started Now
                            </button>
                        </div>
                        {/* Abstract background */}
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
                        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/10 blur-[120px] rounded-full -translate-x-1/2 translate-y-1/2"></div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default StakeholderDetail;
