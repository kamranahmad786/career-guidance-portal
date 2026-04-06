import React from 'react';
import { useNavigate } from 'react-router-dom';

const ActivityGames = () => {
    const navigate = useNavigate();

    const games = [
        {
            id: 1,
            title: "Code Crusader",
            category: "Logic & Algorithm",
            difficulty: "Medium",
            icon: "terminal",
            color: "bg-blue-500",
            description: "Debug common real-world algorithms and optimize code snippets to save the virtual city.",
            points: "500 XP"
        },
        {
            id: 2,
            title: "The Design Sprint",
            category: "UI/UX & Creativity",
            difficulty: "Hard",
            icon: "palette",
            color: "bg-rose-500",
            description: "Solve high-stakes usability puzzles and design responsive layouts under time pressure.",
            points: "750 XP"
        },
        {
            id: 3,
            title: "Robo-Logic",
            category: "Physics & Engineering",
            difficulty: "Easy",
            icon: "precision_manufacturing",
            color: "bg-amber-500",
            description: "Drag-and-drop logic blocks to program an autonomous drone through complex obstacles.",
            points: "300 XP"
        }
    ];

    return (
        <div className="min-h-screen bg-surface p-8 lg:p-12 font-body">
            {/* Header Section */}
            <div className="max-w-7xl mx-auto mb-16 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                <div>
                    <button 
                        onClick={() => navigate('/student/dashboard')}
                        className="flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-widest mb-4 hover:text-primary transition-colors"
                    >
                        <span className="material-symbols-outlined text-sm">arrow_back</span>
                        Back to Dashboard
                    </button>
                    <h1 className="text-4xl font-black text-on-surface font-headline mb-2">Activities & Games</h1>
                    <p className="text-slate-400 font-medium">Gamified simulations to sharpen your real-world problem-solving skills.</p>
                </div>

                <div className="flex items-center gap-4 p-4 bg-white rounded-[2rem] shadow-sm border border-slate-100">
                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined text-3xl font-variation-fill">stars</span>
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Your Rank</p>
                        <p className="text-xl font-black text-on-surface">Pro Voyager</p>
                    </div>
                    <div className="ml-8 pr-4">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Total XP</p>
                        <p className="text-xl font-black text-primary">12,450</p>
                    </div>
                </div>
            </div>

            {/* Game Grid */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {games.map(game => (
                    <div key={game.id} className="group relative bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100 hover:shadow-2xl transition-all hover:-translate-y-2 overflow-hidden">
                        {/* Decorative Background Blob */}
                        <div className={`absolute -top-24 -right-24 w-48 h-48 ${game.color} opacity-5 blur-[40px] group-hover:opacity-10 transition-opacity`}></div>
                        
                        <div className="relative z-10">
                            <div className={`w-16 h-16 ${game.color} rounded-[1.5rem] flex items-center justify-center text-white shadow-xl shadow-slate-200 mb-8`}>
                                <span className="material-symbols-outlined text-3xl">{game.icon}</span>
                            </div>

                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-2xl font-black text-on-surface font-headline">{game.title}</h3>
                                <span className="px-3 py-1 bg-slate-50 text-slate-400 text-[9px] font-black uppercase tracking-widest rounded-full border border-slate-100">
                                    {game.difficulty}
                                </span>
                            </div>

                            <p className="text-slate-400 text-sm font-medium leading-relaxed mb-8 h-20">
                                {game.description}
                            </p>

                            <div className="flex items-center justify-between pt-8 border-t border-slate-50">
                                <div className="flex items-center gap-2 text-primary font-black text-[11px] uppercase tracking-widest">
                                    <span className="material-symbols-outlined text-sm">database</span>
                                    {game.points}
                                </div>
                                <button className="px-6 py-3 bg-on-surface text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-slate-200 hover:scale-105 active:scale-95 transition-all">
                                    Start Simulation
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Challenge Coming Soon Card */}
                <div className="bg-slate-50 p-8 rounded-[3rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center group cursor-pointer hover:border-primary/30 transition-all">
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-slate-300 mb-6 shadow-sm group-hover:text-primary group-hover:rotate-12 transition-all">
                        <span className="material-symbols-outlined text-4xl">lock</span>
                    </div>
                    <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-2">Weekly Challenge</h3>
                    <p className="text-[10px] text-slate-400 font-bold leading-relaxed px-8">Unlocks after completing your next Assessment</p>
                </div>
            </div>

            {/* Bottom NEP Branding Section */}
            <div className="max-w-7xl mx-auto mt-24">
                <div className="bg-on-surface p-10 rounded-[3rem] shadow-2xl relative overflow-hidden group border border-white/5">
                    <div className="relative z-10 flex flex-col lg:flex-row items-center gap-12 text-center lg:text-left">
                        <div className="w-20 h-20 bg-primary/20 rounded-[2rem] flex items-center justify-center backdrop-blur-md">
                            <span className="material-symbols-outlined text-white text-4xl animate-bounce">rocket_launch</span>
                        </div>
                        <div className="flex-1">
                            <h2 className="text-2xl font-black text-white font-headline mb-3 tracking-tight">NEP 2026 Gamified Readiness</h2>
                            <p className="text-slate-400 font-medium leading-relaxed max-w-2xl">
                                Our simulations aren't just games—they're mapped to the <span className="text-primary italic">"Competency-Based Education"</span> framework, allowing you to discover hidden aptitudes through interactive discovery.
                            </p>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex flex-col items-center">
                                <p className="text-3xl font-black text-white mb-1">85%</p>
                                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Retention</p>
                            </div>
                            <div className="w-[1px] h-12 bg-white/10 hidden lg:block"></div>
                            <div className="flex flex-col items-center">
                                <p className="text-3xl font-black text-primary mb-1">10X</p>
                                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Discovery</p>
                            </div>
                        </div>
                    </div>
                    {/* Decorative Blob */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 blur-[120px] rounded-full"></div>
                </div>
            </div>
        </div>
    );
};

export default ActivityGames;
