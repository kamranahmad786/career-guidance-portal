import React, { useState } from 'react';
import useChat from '../../hooks/useChat';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const {
        messages,
        isThinking,
        inputValue,
        setInputValue,
        handleSendMessage,
        chatEndRef
    } = useChat();

    return (
        <div className="fixed bottom-6 right-6 z-[200]">
            {/* Chatbot Toggle Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-2xl text-white shadow-2xl shadow-indigo-500/40 flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-300 group"
                    aria-label="Open AI Assistant"
                >
                    <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <span className="material-symbols-outlined text-2xl md:text-3xl">smart_toy</span>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full"></div>
                </button>
            )}

            {/* Chatbot Window */}
            {isOpen && (
                <div className="w-[320px] sm:w-[400px] h-[550px] md:h-[600px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-3xl rounded-[2rem] shadow-[0_20px_60px_rgba(0,0,0,0.15)] border border-white/50 dark:border-slate-800/50 flex flex-col overflow-hidden animate-in fade-in zoom-in slide-in-from-bottom-10 duration-300">

                    {/* Header */}
                    <div className="p-5 md:p-6 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex justify-between items-center shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg">
                                <span className="material-symbols-outlined text-xl">smart_toy</span>
                            </div>
                            <div className="text-left">
                                <h3 className="font-bold text-sm md:text-base leading-none mb-1">EduDisha AI</h3>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
                                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
                                        {isThinking ? 'Processing' : 'Active'}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all active:scale-90"
                        >
                            <span className="material-symbols-outlined text-lg">close</span>
                        </button>
                    </div>

                    {/* Chat Area */}
                    <div className="flex-1 p-5 overflow-y-auto space-y-6 scrollbar-hide bg-slate-50/50 dark:bg-slate-900/50">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] p-4 rounded-2xl shadow-sm text-sm relative ${msg.role === 'user'
                                        ? 'bg-indigo-600 text-white rounded-tr-none'
                                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-tl-none border border-slate-100 dark:border-slate-700'
                                    }`}>
                                    <p className={`leading-relaxed ${msg.role === 'user' ? 'font-bold' : 'font-medium'}`}>
                                        {msg.content}
                                    </p>
                                    {msg.showButtons && (
                                        <div className="mt-4 flex flex-wrap gap-2">
                                            <button className="px-3 py-1.5 rounded-lg bg-indigo-600/10 text-[10px] font-black text-indigo-600 border border-indigo-600/20 hover:bg-indigo-600 hover:text-white transition-all">VIEW ROADMAP</button>
                                            <button className="px-3 py-1.5 rounded-lg bg-slate-900/10 text-[10px] font-black text-slate-900 dark:text-white border border-slate-900/20 hover:bg-slate-900 hover:text-white transition-all">GET SYLLABUS</button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}

                        {isThinking && (
                            <div className="flex justify-start">
                                <div className="bg-white dark:bg-slate-800 p-3 px-5 rounded-full rounded-tl-none border border-slate-100 dark:border-slate-700 flex gap-1.5 items-center">
                                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce"></div>
                                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce [animation-delay:0.2s]"></div>
                                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce [animation-delay:0.4s]"></div>
                                </div>
                            </div>
                        )}
                        <div ref={chatEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-4 bg-white dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700">
                        <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900 p-1.5 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 transition-all">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                placeholder="Ask EduDisha AI anything..."
                                className="flex-1 bg-transparent border-none outline-none text-[13px] font-medium text-slate-700 dark:text-slate-200 px-4 placeholder:text-slate-400"
                            />
                            <button
                                onClick={handleSendMessage}
                                disabled={!inputValue.trim() || isThinking}
                                className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-all ${inputValue.trim() && !isThinking
                                        ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                                        : 'bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-not-allowed'
                                    }`}
                            >
                                <span className="material-symbols-outlined text-xl">arrow_upward</span>
                            </button>
                        </div>
                        <p className="text-[9px] text-center text-slate-400 font-bold mt-2 uppercase tracking-widest">Powered by EduDisha AI</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Chatbot;
