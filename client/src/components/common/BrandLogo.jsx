import React from 'react';

const BrandLogo = ({ className = "w-8 h-8", color = "#0057bd" }) => {
    return (
        <svg 
            viewBox="0 0 100 100" 
            className={className}
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* The Compass Housing */}
            <rect width="100" height="100" rx="28" fill={color} />
            
            {/* The Arrow/Compass Needle (Simplified for High-Stability Vector) */}
            <path 
                d="M50 22L78 78L50 64L22 78L50 22Z" 
                fill="white" 
            />
            
            {/* Minimalist Accents for Premium Look */}
            <circle cx="50" cy="50" r="1.5" fill={color} />
        </svg>
    );
};

export default BrandLogo;
