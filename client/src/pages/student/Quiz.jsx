import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Quiz = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [questions, setQuestions] = useState([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isFinished, setIsFinished] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('/api/quiz/all', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                
                if (response.ok) {
                    const data = await response.json();
                    
                    // Flatten parameter-grouped questions into a single stable array
                    let allQuestions = [];
                    data.forEach(group => {
                        if (group.questions) {
                            group.questions.forEach(q => {
                                allQuestions.push({
                                    ...q,
                                    databaseId: q._id // Assuming MongoDB ID
                                });
                            });
                        }
                    });
                    
                    // Shuffle or keep ordered by parameter
                    setQuestions(allQuestions);
                }
            } catch (err) {
                console.error("Failed to load assessment questions:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchQuestions();
    }, []);

    const handleOptionSelect = (option) => {
        setAnswers({ ...answers, [currentStep]: option });
    };

    const handleNext = () => {
        if (currentStep < questions.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            handleSubmit();
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            const token = localStorage.getItem('token');
            
            // Format answers for backend scoring logic
            const formattedAnswers = questions.map((q, idx) => ({
                questionId: q.databaseId || idx,
                selectedAnswer: answers[idx],
                isCorrect: answers[idx] === q.correctAnswer,
                parameter: q.parameter
            }));

            // 1. Submit Quiz for Scoring
            const submitRes = await fetch('/api/quiz/submit', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify({ answers: formattedAnswers })
            });

            if (submitRes.ok) {
                // 2. Trigger AI Recommendation Generation
                await fetch('/api/recommendations/generate', {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                
                setIsFinished(true);
                // Redirect to dashboard after a delay
                setTimeout(() => navigate('/student/dashboard'), 3500);
            }
        } catch (err) {
            console.error("Submission failed:", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-[70vh] text-white">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Calibrating Assessment...</p>
            </div>
        );
    }

    if (isFinished) {
        return (
            <div className="flex items-center justify-center h-[70vh] p-4 text-center">
                <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-10 rounded-[3rem] shadow-2xl">
                    <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg shadow-emerald-500/20">
                        <span className="material-symbols-outlined text-white text-4xl">verified</span>
                    </div>
                    <h2 className="text-3xl font-black text-on-surface mb-4 font-headline">Analysis Finalized</h2>
                    <p className="text-slate-400 font-medium mb-8 leading-relaxed">Our AI has mapped your interests across 12 parameters. Your career roadmap is now ready on your dashboard.</p>
                    <div className="flex items-center justify-center gap-3 text-primary font-black uppercase tracking-widest text-[10px]">
                        <span className="w-1.5 h-1.5 bg-primary rounded-full animate-ping"></span>
                        Synchronizing Intelligence Hub...
                    </div>
                </div>
            </div>
        );
    }

    const currentQ = questions[currentStep];

    return (
        <div className="min-h-screen p-4 md:p-8 lg:p-12 max-w-4xl mx-auto flex flex-col justify-center">
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-8 md:p-12 rounded-[3.5rem] shadow-2xl relative overflow-hidden group">
                {/* Visual Accent */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform"></div>
                
                <div className="relative z-10">
                    <div className="flex justify-between items-center mb-10">
                        <div>
                            <span className="px-4 py-1.5 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-full border border-primary/20">
                                {currentQ?.parameter || 'Career Intelligence'}
                            </span>
                        </div>
                        <div className="text-right">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Progress</span>
                            <p className="text-xl font-black text-on-surface leading-none">{currentStep + 1} / {questions.length}</p>
                        </div>
                    </div>

                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 mb-12">
                        <div 
                            className="bg-primary h-full rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(0,119,255,0.3)]" 
                            style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
                        ></div>
                    </div>
                    
                    <h3 className="text-2xl md:text-3xl font-black text-on-surface mb-12 leading-tight font-headline">
                        {currentQ?.question}
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {currentQ?.options?.map((opt, idx) => (
                            <button 
                                key={idx}
                                onClick={() => handleOptionSelect(opt)}
                                className={`p-6 rounded-[2rem] text-left transition-all duration-300 border-2 flex items-center gap-4 group/opt
                                    ${answers[currentStep] === opt 
                                        ? 'bg-primary text-white border-primary shadow-xl shadow-primary/20 scale-[1.02]' 
                                        : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-primary/30 hover:bg-slate-50 dark:hover:bg-slate-700/50'}`
                                }
                            >
                                <span className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shrink-0 transition-colors
                                    ${answers[currentStep] === opt ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-400 group-hover/opt:text-primary'}`}>
                                    {String.fromCharCode(65 + idx)}
                                </span> 
                                <span className="font-bold text-sm md:text-base">{opt}</span>
                            </button>
                        ))}
                    </div>

                    <div className="mt-16 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-8">
                        <button 
                            onClick={() => setCurrentStep(currentStep - 1)}
                            disabled={currentStep === 0}
                            className={`flex items-center gap-2 text-xs font-black uppercase tracking-widest ${currentStep === 0 ? 'text-slate-300 cursor-not-allowed' : 'text-slate-400 hover:text-primary transition-colors'}`}
                        >
                            <span className="material-symbols-outlined text-sm">arrow_back</span>
                            Previous
                        </button>

                        <button 
                            onClick={handleNext} 
                            disabled={!answers[currentStep] || isSubmitting}
                            className={`px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-[11px] transition-all flex items-center gap-3
                                ${answers[currentStep] && !isSubmitting
                                    ? 'bg-on-surface text-white shadow-xl shadow-slate-900/10 hover:scale-105 active:scale-95' 
                                    : 'bg-slate-100 text-slate-300 cursor-not-allowed'}`}
                        >
                            {isSubmitting ? 'Analyzing Responses...' : (currentStep === questions.length - 1 ? 'Finalize Analysis' : 'Next Insight')}
                            {!isSubmitting && <span className="material-symbols-outlined text-sm">arrow_forward</span>}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Quiz;
