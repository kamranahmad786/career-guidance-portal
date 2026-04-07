import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

const Navbar = ({ navigate, mobileMenuOpen, setMobileMenuOpen, isLoginHovered, setIsLoginHovered, onOpenSettings }) => {
    const { user } = useContext(AuthContext);

    return (
        <>
            <nav className="fixed top-0 w-full z-[100] bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 h-16 md:h-20 flex items-center gpu-accelerate">
                <div className="max-w-7xl mx-auto w-full flex justify-between items-center px-4 md:px-6">
                    
                    {/* Brand Logo */}
                    <div className="flex items-center gap-2 md:gap-3 group cursor-pointer shrink-0" onClick={() => navigate('/')}>
                        <div className="w-9 h-9 md:w-11 md:h-11 rounded-xl md:rounded-2xl bg-gradient-to-br from-indigo-600 to-blue-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-300">
                            <span className="material-symbols-outlined text-white text-xl md:text-2xl">explore</span>
                        </div>
                        <div className="flex flex-col text-left">
                            <span className="text-lg md:text-xl font-bold tracking-tight text-slate-900 dark:text-white font-headline leading-none">EduDisha</span>
                            <span className="text-[8px] md:text-[9px] font-bold text-indigo-600 dark:text-indigo-400 tracking-widest uppercase leading-none mt-1">Career Intelligence</span>
                        </div>
                    </div>

                    {/* Unified Navigation Station (Desktop Only) */}
                    <div className="hidden lg:flex items-center gap-1 bg-slate-100/80 dark:bg-slate-800/80 p-1 rounded-full border border-slate-200/50 dark:border-slate-700/50 ambient-shadow">
                        <div className="flex items-center gap-1 pr-2">
                            {[
                                { name: 'Home', href: '/' },
                                { name: 'Features', href: '#features' },
                                { name: 'Process', href: '#how-it-works' },
                                ...(user ? [{ 
                                    name: 'Dashboard', 
                                    onClick: () => {
                                        const role = user.role?.toLowerCase();
                                        if (role === 'teacher') navigate('/teacher/dashboard');
                                        else if (role === 'parent') navigate('/parent/dashboard');
                                        else if (role === 'superadmin' || role === 'admin') navigate('/admin/dashboard');
                                        else navigate('/student/dashboard');
                                    } 
                                }] : []),
                                { name: 'Libraries', href: '/library' },
                                { name: 'About', href: '#about' },
                                { name: 'Contact', href: '#contact' }
                            ].map((link) => (
                                link.onClick ? (
                                    <button 
                                        key={link.name}
                                        onClick={link.onClick}
                                        className="px-4 py-2 rounded-full text-[13px] font-bold text-indigo-600 dark:text-indigo-400 hover:bg-white dark:hover:bg-slate-700 transition-all duration-200"
                                    >
                                        {link.name}
                                    </button>
                                ) : (
                                    <a 
                                        key={link.name}
                                        href={link.href}
                                        className="px-4 py-2 rounded-full text-[13px] font-bold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-white hover:bg-white dark:hover:bg-slate-700 transition-all duration-200"
                                    >
                                        {link.name}
                                    </a>
                                )
                            ))}
                        </div>
                        
                        <div className="w-px h-6 bg-slate-300 dark:bg-slate-600 mx-1"></div>
                        
                        <div className="flex items-center gap-1 pl-1">
                            {!user ? (
                                <>
                                    <button 
                                        onClick={() => navigate('/login')} 
                                        onMouseEnter={() => setIsLoginHovered(true)}
                                        onMouseLeave={() => setIsLoginHovered(false)}
                                        className={`px-5 py-2 rounded-full text-[13px] font-bold transition-all duration-300 ${
                                            isLoginHovered 
                                            ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-lg shadow-indigo-500/20" 
                                            : "text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white"
                                        }`}
                                    >
                                        Login
                                    </button>
                                    <button 
                                        onClick={() => navigate('/register')} 
                                        className={`px-6 py-2 rounded-full text-[13px] font-bold transition-all duration-300 ${
                                            isLoginHovered 
                                            ? "text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white" 
                                            : "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-lg shadow-indigo-500/20"
                                        } hover:shadow-indigo-500/30 active:scale-95`}
                                    >
                                        Register
                                    </button>
                                </>
                            ) : (
                                <button 
                                    onClick={onOpenSettings}
                                    className="flex items-center gap-3 px-4 py-1.5 bg-white dark:bg-slate-700 rounded-full border border-slate-200 dark:border-slate-600 shadow-sm hover:shadow-md transition-all group"
                                >
                                    <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[11px] font-bold group-hover:scale-105 transition-transform">
                                        {user.name?.charAt(0) || 'U'}
                                    </div>
                                    <span className="text-[13px] font-black text-slate-700 dark:text-slate-200 mr-1">{user.name?.split(' ')[0]}</span>
                                    <span className="material-symbols-outlined text-slate-400 text-lg group-hover:rotate-180 transition-transform">expand_more</span>
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button 
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="lg:hidden w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 active:scale-95 transition-all outline-none"
                        aria-label="Toggle menu"
                    >
                        <span className="material-symbols-outlined text-2xl">{mobileMenuOpen ? 'close' : 'menu'}</span>
                    </button>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            {mobileMenuOpen && (
                <div className="lg:hidden fixed inset-0 z-[90] bg-white dark:bg-slate-900" style={{ top: '64px' }}>
                    <div className="flex flex-col h-full overflow-y-auto p-6 space-y-2">
                        {[
                            { name: 'Home', href: '#', icon: 'home' },
                            ...(user ? [{ 
                                name: 'Dashboard', 
                                onClick: () => { 
                                    const role = user.role?.toLowerCase();
                                    if (role === 'teacher') navigate('/teacher/dashboard');
                                    else if (role === 'parent') navigate('/parent/dashboard');
                                    else if (role === 'superadmin' || role === 'admin') navigate('/admin/dashboard');
                                    else navigate('/student/dashboard');
                                    setMobileMenuOpen(false); 
                                }, 
                                icon: 'dashboard' 
                            }] : []),
                            { name: 'Features', href: '#features', icon: 'grid_view' },
                            { name: 'Process', href: '#how-it-works', icon: 'timeline' },
                            { name: 'Libraries', href: '/library', icon: 'auto_stories' },
                            { name: 'About', href: '#about', icon: 'info' },
                            { name: 'Contact', href: '#contact', icon: 'contact_support' }
                        ].map((link) => (
                            link.onClick ? (
                                <button 
                                    key={link.name}
                                    onClick={link.onClick}
                                    className="flex items-center gap-4 py-4 px-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 text-lg font-bold text-slate-900 dark:text-white transition-all group"
                                >
                                    <span className="material-symbols-outlined text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">{link.icon}</span>
                                    {link.name}
                                </button>
                            ) : (
                                <a 
                                    key={link.name}
                                    href={link.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="flex items-center gap-4 py-4 px-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 text-lg font-bold text-slate-900 dark:text-white transition-all group"
                                >
                                    <span className="material-symbols-outlined text-slate-400 group-hover:text-indigo-600 transition-colors">{link.icon}</span>
                                    {link.name}
                                </a>
                            )
                        ))}
                        
                        <div className="pt-8 grid grid-cols-2 gap-4">
                            <button 
                                onClick={() => { navigate('/login'); setMobileMenuOpen(false); }}
                                className="py-4 bg-slate-100 dark:bg-slate-800 rounded-2xl font-bold text-slate-900 dark:text-white"
                            >
                                Login
                            </button>
                            <button 
                                onClick={() => { navigate('/register'); setMobileMenuOpen(false); }}
                                className="py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-500/20"
                            >
                                Register
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Navbar;
