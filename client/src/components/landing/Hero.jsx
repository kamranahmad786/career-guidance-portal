import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

const Hero = ({ navigate }) => {
    const { user } = useContext(AuthContext);

    return (
        <header className="min-h-screen pt-32 pb-20 w-full overflow-hidden flex flex-col justify-center">
            <div className="max-w-7xl mx-auto px-4 md:px-6 w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
                    <div className="space-y-6 md:space-y-8 text-center md:text-left">
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold font-headline leading-[1.15] tracking-tight text-on-surface">
                                Discover Your Future with <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">AI-Powered</span> Guidance
                        </h1>
                        <p className="text-base md:text-lg text-on-surface-variant leading-relaxed max-w-lg mx-auto md:mx-0">
                                Personalized recommendations, smart quizzes, and guided learning paths for KG to 12 students. Navigate your potential with precision.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                            {user ? (
                                <>
                                    <button 
                                        onClick={() => {
                                            const role = user.role?.toLowerCase();
                                            if (role === 'teacher') navigate('/teacher/dashboard');
                                            else if (role === 'parent') navigate('/parent/dashboard');
                                            else if (role === 'superadmin' || role === 'admin') navigate('/admin/dashboard');
                                            else navigate('/student/dashboard');
                                        }} 
                                        className="bg-primary hover:bg-primary-container text-white px-8 py-3.5 rounded-full font-bold text-base transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2 group hover:scale-105 active:scale-95"
                                    >
                                        Go to Dashboard <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">dashboard</span>
                                    </button>
                                    <button 
                                        onClick={() => {
                                            const role = user.role?.toLowerCase();
                                            if (role === 'teacher') navigate('/teacher/profile');
                                            else if (role === 'parent') navigate('/parent/profile');
                                            else navigate('/student/profile');
                                        }}
                                        className="px-8 py-3.5 rounded-full font-bold text-base border-2 border-primary/20 hover:border-primary/40 hover:bg-primary/5 transition-all text-primary flex items-center justify-center gap-2 group"
                                    >
                                        Review Profile <span className="material-symbols-outlined group-hover:rotate-12 transition-transform">account_circle</span>
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button onClick={() => navigate('/register')} className="bg-primary hover:bg-primary-container text-white px-8 py-3.5 rounded-full font-bold text-base transition-all shadow-lg flex items-center justify-center gap-2">
                                            Get Started <span className="material-symbols-outlined">arrow_forward</span>
                                    </button>
                                    <button 
                                        onClick={() => navigate('/register')}
                                        className="px-8 py-3.5 rounded-full font-bold text-base border border-outline-variant hover:bg-surface-container-low transition-all text-on-surface flex items-center justify-center"
                                    >
                                            Take Career Quiz
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                    <div className="relative max-w-sm sm:max-w-md mx-auto lg:max-w-lg xl:max-w-xl w-full">
                        <div className="absolute -top-10 md:-top-20 -right-10 md:-right-20 w-40 md:w-80 h-40 md:h-80 bg-secondary-fixed opacity-20 blur-[60px] md:blur-[100px] rounded-full"></div>
                        <div className="bg-surface-container-lowest p-2 md:p-3 rounded-xl ambient-shadow">
                            <img alt="Student learning" className="rounded-lg w-full aspect-square object-cover shadow-2xl" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBTESW-YrHNmwEa21_Wsy1GdyTx4aR9mGLW2JafCCIgRfNfd3MzB_4rKmW359KFxjfpzKmllNK1v2-Cm94wmiiu108pMzTBQuPET1_j7NdqQeQ_smmrHGqoO63Y14eFU8SEg-ThoXINux_U_R_BRvmCiHYYmc2P24fF0vsikX1xJB3UiFAEOfan3UI9bBe1NzTunOuCWTidNmNxNoIwYQB-APkF8jbR3yGuGY1t_xwz56mxWusNKNnhQDQ03Ru4YUpYBANVYgHStOz0"/>
                        </div>
                        {/* Floating Insight Card */}
                        <div className="hidden sm:flex absolute -bottom-4 md:-bottom-8 -left-4 md:-left-8 bg-white/95 backdrop-blur-xl p-3 md:p-4 rounded-xl ambient-shadow items-center gap-3 max-w-[220px] md:max-w-xs border border-white/50">
                            <div className="w-10 h-10 bg-tertiary-fixed flex items-center justify-center rounded-full text-on-tertiary-fixed shrink-0 shadow-lg">
                                <span className="material-symbols-outlined text-lg">psychology</span>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-primary uppercase tracking-wider leading-none mb-1">AI Insight</p>
                                <p className="text-xs font-bold text-on-surface">98% students found their ideal path.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Hero;
