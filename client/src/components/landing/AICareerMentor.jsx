import React from 'react';

const AICareerMentor = ({ messages, isThinking, inputValue, setInputValue, handleSendMessage, chatEndRef }) => {
    return (
        <section className="min-h-screen py-24 px-6 w-full mx-auto overflow-hidden flex flex-col justify-center bg-surface-container-lowest">
            <div className="grid lg:grid-cols-2 gap-16 md:gap-20 items-center px-4 md:px-12 lg:px-20">
                <div className="space-y-10 text-left">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-tertiary/10 text-tertiary font-bold text-[10px] md:text-xs mb-6 uppercase tracking-widest leading-none">
                            <span className="material-symbols-outlined text-sm">chat_bubble</span>
                            Always Available
                        </div>
                        <h2 className="text-3xl md:text-5xl font-extrabold font-headline mb-6 md:mb-8 text-on-surface leading-[1.15]">
                            Your Personal <span className="text-primary bg-gradient-to-r from-primary to-tertiary bg-clip-text text-transparent">AI Career Mentor</span>
                        </h2>
                        <p className="text-base md:text-lg text-on-surface-variant leading-relaxed max-w-lg">
                            Never feel lost again. Our AI mentor is trained on global employment trends and educational data to provide expert guidance instantly, day or night.
                        </p>
                    </div>

                    <div className="space-y-4">
                        {[
                            { title: 'Instant subject recommendations', icon: 'auto_awesome', color: 'text-primary' },
                            { title: 'Real-time industry salary insights', icon: 'trending_up', color: 'text-secondary' },
                            { title: 'College application guidance', icon: 'history_edu', color: 'text-tertiary' }
                        ].map((feature, i) => (
                            <div key={i} className="flex items-center gap-4 group">
                                <div className="w-10 h-10 rounded-xl bg-white ambient-shadow flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                                    <span className={`material-symbols-outlined text-lg ${feature.color}`}>{feature.icon}</span>
                                </div>
                                <span className="font-bold text-base text-on-surface">{feature.title}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="relative group">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] bg-primary/10 blur-[100px] rounded-full -z-10 animate-pulse"></div>
                    
                    {/* The Chat Interface */}
                    <div className="bg-white/80 backdrop-blur-3xl rounded-2xl md:rounded-3xl p-6 md:p-8 ambient-shadow border border-white h-[500px] md:h-[600px] flex flex-col relative overflow-hidden">
                        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
                        
                        <div className="flex items-center justify-between mb-8 pb-5 border-b border-outline-variant/30">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 md:w-11 md:h-11 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg">
                                    <span className="material-symbols-outlined text-xl">smart_toy</span>
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm md:text-base text-on-surface">EduDisha AI</h4>
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                                        <span className="text-[10px] font-bold text-emerald-600">
                                            {isThinking ? 'Thinking' : 'Online'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <div className="w-8 h-8 rounded-full bg-surface-container-low flex items-center justify-center cursor-pointer hover:bg-slate-200"><span className="material-symbols-outlined text-xs">settings</span></div>
                                <div className="w-8 h-8 rounded-full bg-surface-container-low flex items-center justify-center cursor-pointer hover:bg-slate-200"><span className="material-symbols-outlined text-xs">more_vert</span></div>
                            </div>
                        </div>
                        
                        <div className="flex-1 space-y-6 overflow-y-auto pr-3 scrollbar-hide text-left">
                            {messages.map((msg, idx) => (
                                <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                    <div className={`${
                                        msg.role === 'user' 
                                        ? 'bg-primary text-white rounded-tr-none' 
                                        : 'bg-surface-container-low text-on-surface rounded-tl-none'
                                    } p-4 rounded-2xl shadow-sm max-w-[85%] relative`}>
                                        <p className={`text-[13px] ${msg.role === 'user' ? 'font-bold' : 'font-medium'} leading-[1.5]`}>
                                            {msg.content}
                                        </p>
                                        {msg.showButtons && (
                                            <div className="mt-3 flex gap-2">
                                                <div className="px-2.5 py-1 rounded-lg bg-primary/10 text-[9px] font-bold text-primary border border-primary/20 cursor-pointer hover:bg-primary/20 transition-colors">VIEW SYLLABUS</div>
                                                <div className="px-2.5 py-1 rounded-lg bg-tertiary/10 text-[9px] font-bold text-tertiary border border-tertiary/20 cursor-pointer hover:bg-tertiary/20 transition-colors">GET ROADMAP</div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                            
                            {isThinking && (
                                <div className="flex gap-3">
                                    <div className="bg-surface-container-low/50 p-2.5 px-4 rounded-full flex gap-1 items-center">
                                        <div className="w-1 h-1 rounded-full bg-slate-400 animate-bounce"></div>
                                        <div className="w-1 h-1 rounded-full bg-slate-400 animate-bounce [animation-delay:0.2s]"></div>
                                        <div className="w-1 h-1 rounded-full bg-slate-400 animate-bounce [animation-delay:0.4s]"></div>
                                    </div>
                                </div>
                            )}
                            <div ref={chatEndRef} />
                        </div>

                        {/* Chat Input Field */}
                        <div className="mt-8 p-1.5 bg-surface-container-lowest rounded-full border border-outline-variant shadow-md flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface-variant cursor-pointer hover:bg-slate-200 transition-colors">
                                <span className="material-symbols-outlined text-xs">attach_file</span>
                            </div>
                            <input 
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                placeholder="Ask EduDisha AI about your future..."
                                className="flex-1 text-[12px] font-medium text-slate-700 px-3 bg-transparent outline-none border-none placeholder:text-slate-400"
                            />
                            <button 
                                onClick={handleSendMessage}
                                disabled={!inputValue.trim() || isThinking}
                                className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all active:scale-95 ${
                                    inputValue.trim() && !isThinking ? 'bg-primary text-white cursor-pointer' : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                }`}
                            >
                                <span className="material-symbols-outlined text-lg">arrow_upward</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AICareerMentor;
