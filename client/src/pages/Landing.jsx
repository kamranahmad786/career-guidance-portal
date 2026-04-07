import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

// Layout Components
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import ProfileSettings from '../components/common/ProfileSettings';

// Landing Section Components
import Hero from '../components/landing/Hero';
import Features from '../components/landing/Features';
import HowItWorks from '../components/landing/HowItWorks';
import QuizHighlight from '../components/landing/QuizHighlight';
import CuratedLearning from '../components/landing/CuratedLearning';
import About from '../components/landing/About';
import Stakeholders from '../components/landing/Stakeholders';
import AICareerMentor from '../components/landing/AICareerMentor';
import NEPCompliance from '../components/landing/NEPCompliance';
import Testimonials from '../components/landing/Testimonials';
import Contact from '../components/landing/Contact';

// Custom Hooks
import useChat from '../hooks/useChat';

const Landing = () => {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    
    // UI Logic State
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isLoginHovered, setIsLoginHovered] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    // Chatbot Hook (Professional Logic Separation)
    const { 
        messages, 
        isThinking, 
        inputValue, 
        setInputValue, 
        selectedFile,
        setSelectedFile,
        handleSendMessage, 
        chatEndRef 
    } = useChat([
        { role: 'assistant', content: "Hello! I'm EduDisha AI, your personal career mentor. I see you excel at pattern recognition and logic." },
        { role: 'user', content: "I really enjoy mathematics and solving complex puzzles!" },
        { role: 'assistant', content: "That's fantastic! Have you considered a career in Robotics Engineering? Your aptitude in mathematics perfectly aligns with that path.", showButtons: true }
    ]);

    return (
        <div className="bg-background text-on-surface font-body selection:bg-primary-fixed selection:text-on-primary-fixed">
            <Navbar 
                navigate={navigate} 
                mobileMenuOpen={mobileMenuOpen} 
                setMobileMenuOpen={setMobileMenuOpen}
                isLoginHovered={isLoginHovered}
                setIsLoginHovered={setIsLoginHovered}
                onOpenSettings={() => setIsSettingsOpen(true)}
            />
            
            <main className="no-scroll-shift">
                <Hero navigate={navigate} />
                <div className="optimize-render"><Features /></div>
                <div className="optimize-render"><HowItWorks /></div>
                <div className="optimize-render"><QuizHighlight /></div>
                <div className="optimize-render"><CuratedLearning /></div>
                <div className="optimize-render"><About /></div>
                <div className="optimize-render"><Stakeholders /></div>
                <div className="optimize-render">
                    <AICareerMentor 
                        messages={messages}
                        isThinking={isThinking}
                        inputValue={inputValue}
                        setInputValue={setInputValue}
                        selectedFile={selectedFile}
                        setSelectedFile={setSelectedFile}
                        handleSendMessage={handleSendMessage}
                        chatEndRef={chatEndRef}
                    />
                </div>
                <div className="optimize-render"><NEPCompliance /></div>
                <div className="optimize-render"><Testimonials /></div>
                <div className="optimize-render"><Contact /></div>
            </main>

            <Footer />

            {/* Profile Settings Hub - Global Access */}
            <ProfileSettings 
                isOpen={isSettingsOpen} 
                onClose={() => setIsSettingsOpen(false)} 
            />
        </div>
    );
};

export default Landing;
