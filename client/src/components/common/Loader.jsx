import React from 'react';

/**
 * Professional Loader Component for EduDisha
 * @param {string} type - 'full' (Fixed overlay), 'section' (Container relative), 'inline' (Button/Text)
 * @param {string} message - Optional text to display under the spinner
 */
const Loader = ({ type = 'section', message = 'Processing...' }) => {
    const baseClasses = "flex flex-col items-center justify-center transition-all duration-500 ease-in-out";
    
    // Type-specific wrapper styles
    const typeStyles = {
        full: "fixed inset-0 z-[9999] bg-white/80 glass-overlay",
        section: "p-12 w-full h-full min-h-[400px] rounded-[3rem] bg-surface-container-lowest/50 glass-overlay",
        inline: "inline-flex gap-2 items-center"
    };

    const spinnerSize = type === 'inline' ? "w-5 h-5 border-2" : "w-14 h-14 border-4";

    return (
        <div className={`${baseClasses} ${typeStyles[type] || typeStyles.section}`}>
            <div className={`relative ${spinnerSize}`}>
                {/* Main Spinning Ring */}
                <div className={`
                    absolute inset-0 rounded-full border-solid border-primary 
                    border-t-transparent loader-spin
                `} style={{ borderTopColor: 'transparent', borderWidth: type === 'inline' ? '2px' : '4px' }}></div>
                
                {/* Static Background Ring for contrast */}
                <div className={`
                    absolute inset-0 rounded-full border-solid border-slate-200 
                `} style={{ borderWidth: type === 'inline' ? '2px' : '4px' }}></div>
            </div>

            {type !== 'inline' && (
                <div className="mt-8 text-center animate-in fade-in zoom-in duration-700">
                    <p className="text-xl font-black tracking-tight text-primary font-headline loader-pulse">
                        {message}
                    </p>
                    <p className="text-sm font-bold text-on-surface-variant mt-2 max-w-[200px]">
                        AI Mentor is preparing your professional track
                    </p>
                </div>
            )}
        </div>
    );
};

export default Loader;
