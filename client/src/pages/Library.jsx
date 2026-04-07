import React, { useState, useEffect, useContext, memo } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import ProfileSettings from '../components/common/ProfileSettings';
import Loader from '../components/common/Loader';
import BrandLogo from '../components/common/BrandLogo';

// --- Memoized Resource Card for Elite Performance (Phase 4) ---
const ResourceCard = memo(({ item, user, favorites, toggleFavorite, navigate, getLevelColor }) => {
    return (
        <div className="group relative bg-white rounded-[2.5rem] p-4 border border-slate-100 hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 flex flex-col gpu-accelerate">
            {/* Image & Tags */}
            <div className="relative h-52 rounded-[2rem] overflow-hidden mb-6 bg-slate-100" style={{ aspectRatio: '16/9' }}>
                <img 
                    src={item.imageUrl} 
                    alt={item.title} 
                    loading="lazy"
                    decoding="async"
                    onError={(e) => {
                        e.target.onerror = null;
                        const fallbacks = {
                            'UI/UX Design Masterclass: Figma': 'https://images.unsplash.com/photo-zvmZiw3vdsQ?auto=format&fit=crop&q=80&w=800',
                            'FinTech & Modern Banking': 'https://images.unsplash.com/photo-fCx7Na6jtuY?auto=format&fit=crop&q=80&w=800',
                            'Chartered Accountant Mastery': 'https://images.unsplash.com/photo-x6lWbv0eDNE?auto=format&fit=crop&q=80&w=800',
                            'Medical Research Fundamentals': 'https://images.unsplash.com/photo-Gmu9edRoA5c?auto=format&fit=crop&q=80&w=800',
                            'The Diagnostic Lab: Multi-Symptom Quest': 'https://images.unsplash.com/photo-a_ldJ0EzbLI?auto=format&fit=crop&q=80&w=800'
                        };
                        e.target.src = fallbacks[item.title] || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800';
                    }}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                />
                <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                    <div className="px-3 py-1.5 rounded-xl bg-white/90 backdrop-blur-md text-[9px] font-black uppercase text-primary tracking-widest shadow-sm">
                        {item.category}
                    </div>
                    <button 
                        onClick={(e) => toggleFavorite(e, item._id)}
                        className={`w-9 h-9 rounded-xl backdrop-blur-md flex items-center justify-center transition-all duration-300 shadow-sm ${
                            favorites.includes(item._id) 
                            ? 'bg-primary text-white scale-110' 
                            : 'bg-white/90 text-slate-400 hover:text-primary'
                        }`}
                    >
                        <span className={`material-symbols-outlined text-lg ${favorites.includes(item._id) ? 'fill-1' : ''}`}>
                            {favorites.includes(item._id) ? 'bookmark' : 'bookmark_add'}
                        </span>
                    </button>
                </div>
                
                {!user && (
                    <div className="absolute top-4 left-4 z-10 animate-in fade-in zoom-in duration-500">
                        <div className="px-3 py-1.5 rounded-xl bg-on-surface/80 backdrop-blur-md flex items-center gap-1.5 shadow-xl border border-white/10">
                            <span className="material-symbols-outlined text-[14px] text-primary font-black">lock</span>
                            <span className="text-[9px] font-black text-white uppercase tracking-widest">Member Only</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Content Info */}
            <div className="px-3 flex-1 flex flex-col">
                <div className="flex items-center gap-3 mb-3">
                    <span className={`px-2.5 py-0.5 rounded-lg border text-[9px] font-black uppercase tracking-wider ${getLevelColor(item.level)}`}>
                        {item.level || 'Beginner'}
                    </span>
                    <div className="flex items-center gap-1 text-amber-500">
                        <span className="material-symbols-outlined text-xs fill-1">star</span>
                        <span className="text-xs font-black text-on-surface">{item.rating || '4.8'}</span>
                    </div>
                </div>

                <h3 className="text-lg md:text-xl font-black text-on-surface mb-2 line-clamp-1 font-headline leading-tight">{item.title}</h3>
                <p className="text-xs text-on-surface-variant font-medium line-clamp-2 mb-6 leading-relaxed">
                    {item.description}
                </p>

                <div className="mt-auto pt-6 border-t border-slate-50 space-y-4">
                    <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        <div className="flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-sm">schedule</span>
                            {item.duration}
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-sm">group</span>
                            {item.enrolledCount?.toLocaleString() || '1,200'}
                        </div>
                    </div>

                    {!user ? (
                        <button 
                            onClick={() => navigate('/login')}
                            className="w-full py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20 hover:shadow-2xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
                        >
                            Unlock Access
                            <span className="material-symbols-outlined text-sm font-black">arrow_forward</span>
                        </button>
                    ) : (
                        <a 
                            href={item.contentUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="w-full py-4 bg-on-surface text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl hover:bg-primary transition-all flex items-center justify-center gap-3"
                        >
                            View Content
                            <span className="material-symbols-outlined text-sm font-black">open_in_new</span>
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
});

const Library = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    
    // --- Favorites State (Persistent via LocalStorage) ---
    const [favorites, setFavorites] = useState(() => {
        const saved = localStorage.getItem('edudisha_favorites');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('edudisha_favorites', JSON.stringify(favorites));
    }, [favorites]);

    const toggleFavorite = (e, itemId) => {
        e.stopPropagation(); // Prevent opening the resource
        setFavorites(prev => 
            prev.includes(itemId) 
            ? prev.filter(id => id !== itemId) 
            : [...prev, itemId]
        );
    };

    // --- Elite Hub Local Cache (35+ high-fidelity courses across every major industry) ---
    const eliteCache = [
        // --- Technology & Engineering (1-10) ---
        { _id: 'c-fs-01', title: 'Full-Stack MERN Engineering 2026', category: 'Specialized Courses', description: 'Master React 19, Node.js, and MongoDB with clean architecture.', imageUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=800', contentUrl: 'https://www.youtube.com/watch?v=7CqJlxBYj-M', duration: '45 Hours', modules: 48, level: 'Advanced', rating: 4.9, enrolledCount: 12500 },
        { _id: 'c-next-01', title: 'Next.js 14 & Server Components', category: 'Specialized Courses', description: 'Building high-performance applications with the App Router.', imageUrl: 'https://images.unsplash.com/photo-1618477388954-7852f32655ec?auto=format&fit=crop&q=80&w=800', contentUrl: 'https://www.youtube.com/watch?v=wm5gMKuwSYk', duration: '18 Hours', modules: 22, level: 'Intermediate', rating: 4.8, enrolledCount: 8400 },
        { _id: 'c-ai-01', title: 'Generative AI & LLM Foundations', category: 'Specialized Courses', description: 'Transformer models, Prompt Engineering, and RAG.', imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800', contentUrl: 'https://www.youtube.com/watch?v=mEsleV16qdo', duration: '20 Hours', modules: 25, level: 'Intermediate', rating: 4.9, enrolledCount: 9300 },
        { _id: 'c-py-01', title: 'Data Scientist: Python & ML', category: 'Specialized Courses', description: 'Master NumPy, Pandas, and Scikit-Learn for Data Science.', imageUrl: 'https://images.unsplash.com/photo-1527474305487-b87b222841cc?auto=format&fit=crop&q=80&w=800', contentUrl: 'https://www.youtube.com/watch?v=rfscVS0vtbw', duration: '35 Hours', modules: 40, level: 'Intermediate', rating: 4.8, enrolledCount: 22000 },
        { _id: 'c-cyber-01', title: 'Cybersecurity: Ethical Hacking', category: 'Specialized Courses', description: 'Practical penetration testing and network security.', imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800', contentUrl: 'https://www.youtube.com/watch?v=3Kq1MIfTWCE', duration: '14 Hours', modules: 18, level: 'Advanced', rating: 4.8, enrolledCount: 15700 },
        { _id: 'c-aws-01', title: 'AWS Cloud Solutions Architect', category: 'Specialized Courses', description: 'Deep dive into EC2, S3, and Cloud Scalability.', imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800', contentUrl: 'https://www.youtube.com/watch?v=Ia-UEYYR44s', duration: '22 Hours', modules: 30, level: 'Intermediate', rating: 4.9, enrolledCount: 31000 },
        { _id: 'c-bc-01', title: 'Blockchain & Web3 Engineering', category: 'Specialized Courses', description: 'Build dApps using Solidity and Ethereum ecosystems.', imageUrl: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=800', contentUrl: 'https://www.youtube.com/watch?v=gyMvvM606k4', duration: '32 Hours', modules: 20, level: 'Advanced', rating: 4.9, enrolledCount: 8900 },
        { _id: 'c-mob-01', title: 'Mobile App Dev: Flutter', category: 'Specialized Courses', description: 'Cross-platform apps for iOS and Android.', imageUrl: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=800', contentUrl: 'https://www.youtube.com/watch?v=VPvVD8t02S8', duration: '28 Hours', modules: 24, level: 'Intermediate', rating: 4.8, enrolledCount: 11200 },
        { _id: 'c-sa-01', title: 'Software Architecture Masterclass', category: 'Specialized Courses', description: 'Microservices and Event-Driven Architecture.', imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800', contentUrl: 'https://www.youtube.com/watch?v=v3vMh3mF7Xo', duration: '20 Hours', modules: 22, level: 'Advanced', rating: 4.8, enrolledCount: 4100 },
        { _id: 'c-cs50-01', title: 'Harvard CS50: Computer Science', category: 'Specialized Courses', description: 'The legendary introduction to computer science.', imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800', contentUrl: 'https://www.youtube.com/watch?v=8mAITcNt710', duration: '24 Weeks', modules: 12, level: 'Beginner', rating: 5.0, enrolledCount: 45000 },

        // --- Creative Arts & Design (11-20) ---
        { _id: 'c-gd-01', title: 'Professional Graphic Design', category: 'Specialized Courses', description: 'Master Photoshop, Illustrator, and Brand Aesthetics.', imageUrl: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&q=80&w=800', contentUrl: 'https://www.youtube.com/watch?v=jwCm9Jkvm_w', duration: '25 Hours', modules: 30, level: 'Intermediate', rating: 4.8, enrolledCount: 11500 },
        { _id: 'c-fm-01', title: 'Film Making: Professional Track', category: 'Specialized Courses', description: 'Cinematography, Direction, and Elite Editing.', imageUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=800', contentUrl: 'https://www.youtube.com/watch?v=JW-yL42J48A', duration: '40 Hours', modules: 50, level: 'Advanced', rating: 4.9, enrolledCount: 5200 },
        { _id: 'c-fd-01', title: 'Fashion Design & Illustration', category: 'Specialized Courses', description: 'Pattern making, fabric tech, and digital fashion art.', imageUrl: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&q=80&w=800', contentUrl: 'https://www.youtube.com/watch?v=JW-yL42J48A', duration: '30 Hours', modules: 35, level: 'Intermediate', rating: 4.7, enrolledCount: 3800 },
        { _id: 'c-id-01', title: 'Interior Design: Space Planning', category: 'Specialized Courses', description: 'Designing beautiful and functional modern spaces.', imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=800', contentUrl: 'https://www.youtube.com/watch?v=68afhYis8Y', duration: '15 Hours', modules: 20, level: 'Beginner', rating: 4.6, enrolledCount: 4200 },
        { _id: 'c-arch-01', title: 'Architecture: AutoCAD Mastery', category: 'Specialized Courses', description: 'Sustainable architecture and Infrastructure design.', imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800', contentUrl: 'https://www.youtube.com/watch?v=XW07Z_3mFWA', duration: '50 Hours', modules: 45, level: 'Advanced', rating: 4.9, enrolledCount: 2900 },
        { _id: 'c-cul-01', title: 'Culinary Arts & Gastronomy', category: 'Specialized Courses', description: 'Professional cooking techniques and kitchen management.', imageUrl: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=800', contentUrl: 'https://www.youtube.com/watch?v=Ia-UEYYR44s', duration: '20 Hours', modules: 25, level: 'Beginner', rating: 4.8, enrolledCount: 7100 },
        { _id: 'c-dg-01', title: 'Digital Photography Mastery', category: 'Specialized Courses', description: 'Lighting, Composition, and Post-Processing.', imageUrl: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?auto=format&fit=crop&q=80&w=800', contentUrl: 'https://www.youtube.com/watch?v=7S_tz1z_5bA', duration: '12 Hours', modules: 15, level: 'Beginner', rating: 4.7, enrolledCount: 9200 },
        { _id: 'c-ani-01', title: '3D Animation Essentials', category: 'Specialized Courses', description: 'Character animation and visual effects using Blender.', imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=800', contentUrl: 'https://www.youtube.com/watch?v=nU-IIXBWlS4', duration: '40 Hours', modules: 40, level: 'Intermediate', rating: 4.9, enrolledCount: 6500 },
        { _id: 'c-ui-01', title: 'UI/UX Design Masterclass: Figma', category: 'Specialized Courses', description: 'Designing industry-leading user experiences with advanced prototyping.', imageUrl: 'https://images.unsplash.com/photo-zvmZiw3vdsQ?auto=format&fit=crop&q=80&w=800', contentUrl: 'https://www.youtube.com/watch?v=jwCm9Jkvm_w', duration: '12 Hours', modules: 15, level: 'Beginner', rating: 4.9, enrolledCount: 18200 },
        { _id: 'c-ixd-01', title: 'Advanced Interaction Design 2026', category: 'Specialized Courses', description: 'Motion design and emotional interfaces.', imageUrl: 'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&q=80&w=800', contentUrl: 'https://www.youtube.com/watch?v=68wAfhYis8Y', duration: '8 Hours', modules: 10, level: 'Advanced', rating: 4.7, enrolledCount: 5600 },

        // --- Business, Law & Management (21-30) ---
        { _id: 'c-ca-01', title: 'Chartered Accountant Mastery', category: 'Specialized Courses', description: 'Income tax, GST, and auditing foundations for elite professionals.', imageUrl: 'https://images.unsplash.com/photo-x6lWbv0eDNE?auto=format&fit=crop&q=80&w=800', contentUrl: 'https://www.youtube.com/watch?v=XW07Z_3mFWA', duration: '100 Hours', modules: 60, level: 'Advanced', rating: 4.8, enrolledCount: 12000 },
        { _id: 'c-law-01', title: 'Indian Law: Legal Foundations', category: 'Specialized Courses', description: 'Constitutional law, criminal law, and civil basics.', imageUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=800', contentUrl: 'https://www.youtube.com/watch?v=JW-yL42J48A', duration: '60 Hours', modules: 45, level: 'Intermediate', rating: 4.7, enrolledCount: 8100 },
        { _id: 'c-hosp-01', title: 'Hospitality Management Elite', category: 'Specialized Courses', description: 'Hotel management, tourism, and guest relations.', imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800', contentUrl: 'https://www.youtube.com/watch?v=nU-IIXBWlS4', duration: '30 Hours', modules: 25, level: 'Beginner', rating: 4.6, enrolledCount: 5400 },
        { _id: 'c-pmp-01', title: 'Project Management: PMP Path', category: 'Specialized Courses', description: 'Agile, Scrum, and industrial projects.', imageUrl: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=800', contentUrl: 'https://www.youtube.com/watch?v=68afhYis8Y', duration: '35 Hours', modules: 30, level: 'Intermediate', rating: 4.9, enrolledCount: 11000 },
        { _id: 'c-rm-01', title: 'Strategic Risk Management', category: 'Specialized Courses', description: 'Identifying and mitigating global financial risks.', imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=800', contentUrl: 'https://www.youtube.com/watch?v=Ia-UEYYR44s', duration: '20 Hours', modules: 18, level: 'Advanced', rating: 4.8, enrolledCount: 4300 },
        { _id: 'c-fm-02', title: 'Fund & Asset Management', category: 'Specialized Courses', description: 'Portfolio strategy, hedge funds, and private equity.', imageUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&q=80&w=800', contentUrl: 'https://www.youtube.com/watch?v=Ia-UEYYR44s', duration: '25 Hours', modules: 20, level: 'Advanced', rating: 4.9, enrolledCount: 2200 },
        { _id: 'c-fin-02', title: 'FinTech & Modern Banking', category: 'Specialized Courses', description: 'Exploring digital banking, crypto-regulations, and AI in finance.', imageUrl: 'https://images.unsplash.com/photo-fCx7Na6jtuY?auto=format&fit=crop&q=80&w=800', contentUrl: 'https://www.youtube.com/watch?v=Ia-UEYYR44s', duration: '18 Hours', modules: 15, level: 'Intermediate', rating: 4.8, enrolledCount: 5600 },
        { _id: 'c-dm-01', title: 'Digital Marketing Fundamentals', category: 'Specialized Courses', description: 'SEO, SEM, and modern content strategy.', imageUrl: 'https://images.unsplash.com/photo-1533750349088-cd871a92f312?auto=format&fit=crop&q=80&w=800', contentUrl: 'https://www.youtube.com/watch?v=nU-IIXBWlS4', duration: '10 Hours', modules: 12, level: 'Beginner', rating: 4.7, enrolledCount: 14000 },
        { _id: 'pm-01', title: 'Product Management Edge', category: 'Specialized Courses', description: 'Building market-leading products.', imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800', contentUrl: 'https://www.youtube.com/watch?v=68afhYis8Y', duration: '8 Hours', modules: 10, level: 'Intermediate', rating: 4.8, enrolledCount: 6500 },
        { _id: 'c-ent-01', title: 'Entrepreneurship Mastery', category: 'Specialized Courses', description: 'Startup fundamentals and business scaling.', imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800', contentUrl: 'https://www.youtube.com/watch?v=XW07Z_3mFWA', duration: '12 Hours', modules: 15, level: 'Intermediate', rating: 4.9, enrolledCount: 5200 },
        { _id: 'c-hr-01', title: 'Talent Acquisition Specialist', category: 'Expert Webinars', description: 'Elite hiring practices for top firms.', imageUrl: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=800', contentUrl: 'https://youtube.com/live/hiring-outlook-edudisha', duration: '90 Minutes', modules: 1, level: 'Beginner', rating: 4.9, enrolledCount: 9500 },

        // --- Academic & Healthcare (31-35) ---
        { _id: 'c-med-01', title: 'Medical Research Fundamentals', category: 'Specialized Courses', description: 'Ethics, Clinical Trials, and Evidence-Based medicine in the 21st century.', imageUrl: 'https://images.unsplash.com/photo-Gmu9edRoA5c?auto=format&fit=crop&q=80&w=800', contentUrl: 'https://www.youtube.com/watch?v=nU-IIXBWlS4', duration: '50 Hours', modules: 40, level: 'Advanced', rating: 4.9, enrolledCount: 3100 },
        { _id: 'c-psy-01', title: 'Child Psychology: Professional', category: 'Specialized Courses', description: 'Understanding development and cognitive learning.', imageUrl: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&q=80&w=800', contentUrl: 'https://www.youtube.com/watch?v=JW-yL42J48A', duration: '30 Hours', modules: 25, level: 'Intermediate', rating: 4.8, enrolledCount: 6800 },
        { _id: 'c-nep-01', title: 'NEP 2026 Pedagogical Strategy', category: 'Live Workshops', description: 'Multidisciplinary learning in modern schools.', imageUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=800', contentUrl: 'https://zoom.us/webinar/edudisha-nep-2026', duration: '4 Hours', modules: 1, level: 'Intermediate', rating: 5.0, enrolledCount: 3200 },
        { _id: 'c-edu-01', title: 'Modern Education Technology', category: 'Specialized Courses', description: 'Integrating EdTech tools for 2026 classrooms.', imageUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=800', contentUrl: 'https://www.youtube.com/watch?v=7S_tz1z_5bA', duration: '15 Hours', modules: 18, level: 'Beginner', rating: 4.7, enrolledCount: 12500 },
        { _id: 'c-jour-01', title: 'Journalism & Media Arts', category: 'Specialized Courses', description: 'Reporting, Broadcasting, and Digital News.', imageUrl: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=800', contentUrl: 'https://www.youtube.com/watch?v=nU-IIXBWlS4', duration: '20 Hours', modules: 22, level: 'Beginner', rating: 4.8, enrolledCount: 4500 },

        // --- Career Simulations (36-45) ---
        { _id: 's-law-01', title: 'Elite Mock Trial: The Corporate Case', category: 'Career Simulations', description: 'Interactive courtroom experience. Choose the winning arguments for a high-stakes tech lawsuit.', imageUrl: 'https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&q=80&w=800', contentUrl: 'https://edudisha.ai/sim/law-01', duration: '2 Hours', modules: 1, level: 'Intermediate', rating: 4.9, enrolledCount: 1200 },
        { _id: 's-tech-01', title: 'Senior Engineer: High-Load Review', category: 'Career Simulations', description: 'Scenario-based code review. Identify performance bottlenecks in a global streaming app architecture.', imageUrl: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&q=80&w=800', contentUrl: 'https://edudisha.ai/sim/tech-01', duration: '90 Minutes', modules: 1, level: 'Advanced', rating: 4.8, enrolledCount: 850 },
        { _id: 's-mkt-01', title: 'Viral Crisis: Brand Reputation Sim', category: 'Career Simulations', description: 'Manage a real-time social media PR crisis. Your decisions determine the brand’s stock market impact.', imageUrl: 'https://images.unsplash.com/photo-1557200134-90327ee9fafa?auto=format&fit=crop&q=80&w=800', contentUrl: 'https://edudisha.ai/sim/mkt-01', duration: '1 Hour', modules: 1, level: 'Intermediate', rating: 5.0, enrolledCount: 3200 },
        { _id: 's-med-01', title: 'The Diagnostic Lab: Multi-Symptom Quest', category: 'Career Simulations', description: 'Given conflicting patient vitals, choose the correct tests and make a life-saving diagnosis.', imageUrl: 'https://images.unsplash.com/photo-a_ldJ0EzbLI?auto=format&fit=crop&q=80&w=800', contentUrl: 'https://edudisha.ai/sim/med-01', duration: '3 Hours', modules: 1, level: 'Advanced', rating: 4.9, enrolledCount: 1540 },
        { _id: 's-arch-01', title: 'Urban Vision: Carbon-Neutral City', category: 'Career Simulations', description: 'Architectural simulation. Design a city grid that balances energy, traffic, and social well-being.', imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800', contentUrl: 'https://edudisha.ai/sim/arch-01', duration: '4 Hours', modules: 1, level: 'Intermediate', rating: 4.7, enrolledCount: 920 },
        { _id: 's-cyber-01', title: 'Ethical Hacking: Network Breach Defense', category: 'Career Simulations', description: 'Simulate a live cyber-attack. Deploy firewalls and track IP breaches in a server-room scenario.', imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800', contentUrl: 'https://edudisha.ai/sim/cyber-01', duration: '1 Hour', modules: 1, level: 'Advanced', rating: 4.9, enrolledCount: 2100 },
        { _id: 's-psy-01', title: 'Counseling Room: Pediatric Behavioral Case', category: 'Career Simulations', description: 'Simulate a session with a child patient. Use cognitive therapy models to identify trauma markers.', imageUrl: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&q=80&w=800', contentUrl: 'https://edudisha.ai/sim/psy-01', duration: '2 Hours', modules: 1, level: 'Intermediate', rating: 4.8, enrolledCount: 950 },
        { _id: 's-fin-01', title: 'Wall Street Trader: High-Volatility Portfolio', category: 'Career Simulations', description: 'Manage a $10M fund during a market flash-crash. Balance risk vs reward in real-time.', imageUrl: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=800', contentUrl: 'https://edudisha.ai/sim/fin-01', duration: '3 Hours', modules: 1, level: 'Advanced', rating: 4.9, enrolledCount: 620 },
        { _id: 's-int-01', title: 'Interior Pro: Sustainable Master Suite', category: 'Career Simulations', description: 'Choose materials and spatial flow for a LEED-certified luxury bedroom design.', imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=800', contentUrl: 'https://edudisha.ai/sim/int-01', duration: '90 Minutes', modules: 1, level: 'Beginner', rating: 4.7, enrolledCount: 1100 },
        { _id: 's-film-01', title: 'The Director’s Chair: Scene Blocking', category: 'Career Simulations', description: 'Simulate scene directing. Choose camera angles and lighting setups for a dramatic noir script.', imageUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=800', contentUrl: 'https://edudisha.ai/sim/film-01', duration: '2 Hours', modules: 1, level: 'Intermediate', rating: 4.8, enrolledCount: 450 }
    ];

    const fetchResources = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const headers = { 'Content-Type': 'application/json' };
            if (token) headers['Authorization'] = `Bearer ${token}`;

            const res = await fetch(`http://localhost:5000/api/resources`, { headers });
            const data = await res.json();
            
            if (data && data.length > 0) {
                setResources(data);
            } else {
                setResources(eliteCache);
            }
        } catch (error) {
            console.warn('Backend connection failed. Using Elite Hub local cache.');
            setResources(eliteCache);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchResources();
    }, [filter, searchQuery]);

    const categories = [
        { name: 'All', icon: 'grid_view' },
        { name: 'My Favorites', icon: 'favorite' },
        { name: 'Specialized Courses', icon: 'terminal' },
        { name: 'Live Workshops', icon: 'groups' },
        { name: 'Expert Webinars', icon: 'record_voice_over' },
        { name: 'Career Simulations', icon: 'biotech' }
    ];

    const displayResources = (() => {
        const combined = [...resources];
        
        // Add cache items if they don't already exist in server resources (by title)
        eliteCache.forEach(cacheItem => {
            if (!combined.some(r => r.title === cacheItem.title)) {
                combined.push(cacheItem);
            }
        });

        return combined.filter(r => {
            // My Favorites filtering
            if (filter === 'My Favorites') {
                const isFavorite = favorites.includes(r._id);
                if (!isFavorite) return false;
            } else if (filter !== 'All' && r.category !== filter) {
                return false;
            }

            const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                 r.description.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesSearch;
        });
    })();

    const getLevelColor = (level) => {
        switch(level) {
            case 'Beginner': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'Intermediate': return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'Advanced': return 'bg-rose-100 text-rose-700 border-rose-200';
            default: return 'bg-slate-100 text-slate-700 border-slate-200';
        }
    };

    return (
        <div className="flex min-h-screen bg-[#f8fafc] font-body pt-0">
            {/* Left Sidebar - Dashboard Navigation */}
            <aside className="fixed left-0 top-0 bottom-0 w-72 bg-white border-r border-slate-200 z-30 hidden lg:flex flex-col p-6 overflow-y-auto shadow-sm">
                
                {/* Branding & Profile Section */}
                <div className="mb-8 pt-2">
                    <div className="flex items-center gap-3 mb-10 px-2 cursor-pointer" onClick={() => navigate('/')}>
                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shadow-sm border border-slate-100">
                            <BrandLogo className="w-7 h-7" />
                        </div>
                        <span className="text-2xl font-black tracking-tight text-primary font-headline mt-1">EduDisha</span>
                    </div>

                    {user ? (
                        <div className="p-5 bg-slate-50 rounded-[2rem] border border-slate-100 mb-2">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center font-black text-lg shadow-lg shadow-primary/20">
                                    {user.name?.charAt(0) || 'U'}
                                </div>
                                <div className="text-left overflow-hidden">
                                    <p className="text-sm font-black text-on-surface truncate">{user.name}</p>
                                    <div className="flex items-center gap-1.5 mt-0.5" onClick={() => setIsSettingsOpen(true)}>
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                        <p className="text-[10px] font-black text-slate-400 cursor-pointer hover:text-primary transition-colors">Manage Account</p>
                                    </div>
                                </div>
                            </div>
                            <button 
                                onClick={() => setIsSettingsOpen(true)}
                                className="w-full py-2.5 bg-white border border-slate-200 text-on-surface-variant text-[11px] font-black rounded-xl hover:bg-slate-100 transition-all shadow-sm flex items-center justify-center gap-2"
                            >
                                <span className="material-symbols-outlined text-sm">settings</span>
                                Account Settings
                            </button>
                        </div>
                    ) : (
                        <div className="p-5 bg-primary/5 rounded-[2rem] border border-primary/10 mb-2">
                            <h4 className="text-xs font-black text-primary uppercase tracking-widest mb-4 px-1">Academy Account</h4>
                            <div className="space-y-2.5">
                                <button 
                                    onClick={() => navigate('/login')}
                                    className="w-full py-3 bg-primary text-white text-xs font-black rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
                                >
                                    Log In
                                </button>
                                <button 
                                    onClick={() => navigate('/register')}
                                    className="w-full py-3 bg-white border border-slate-200 text-on-surface-variant text-xs font-black rounded-xl hover:bg-slate-50 transition-all"
                                >
                                    Create Account
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="mb-10">
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-6 px-2">Discover Hub</p>
                    <nav className="space-y-2">
                        {categories.map((cat) => (
                            <button
                                key={cat.name}
                                onClick={() => setFilter(cat.name)}
                                className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl font-bold text-sm transition-all ${
                                    filter === cat.name 
                                    ? 'bg-primary text-white shadow-xl shadow-primary/20 scale-[1.02]' 
                                    : 'text-on-surface-variant hover:bg-slate-50'
                                }`}
                            >
                                <span className="material-symbols-outlined text-lg">{cat.icon}</span>
                                {cat.name}
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="mt-auto p-6 bg-slate-50 rounded-[2.5rem] border border-slate-100">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="material-symbols-outlined text-primary text-lg">auto_awesome</span>
                        <h4 className="text-[13px] font-black text-on-surface">AI Guidance</h4>
                    </div>
                    <p className="text-[11px] text-on-surface-variant font-bold leading-relaxed mb-4">
                        Let AI analyze your progress and suggest the best next workshop.
                    </p>
                    <button 
                        onClick={() => navigate('/')}
                        className="w-full py-3 bg-white border border-slate-200 text-primary text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-primary hover:text-white hover:border-primary transition-all shadow-sm"
                    >
                        Talk to AI Mentor
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 lg:ml-72 p-6 md:p-10 pt-8 lg:pt-14">
                {/* Search & Action Bar */}
                <div className="max-w-6xl mx-auto mb-12">
                    <div className="flex flex-col gap-6">
                        <div className="relative w-full md:max-w-2xl group">
                            <span className="material-symbols-outlined absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors text-2xl">search</span>
                            <input 
                                type="text" 
                                placeholder="Search from 5,000+ specialized courses, live workshops, and simulations..."
                                className="w-full pl-16 pr-8 py-7 bg-white border-2 border-slate-100 rounded-[2.5rem] focus:outline-none focus:ring-8 focus:ring-primary/5 focus:border-primary transition-all text-base font-semibold shadow-sm hover:shadow-md"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        
                        {/* Trending Searches - MNC Style */}
                        <div className="flex flex-wrap items-center gap-3 px-4">
                            <span className="text-[11px] font-black uppercase text-slate-400 tracking-widest mr-2">Trending:</span>
                            {['#Robotics', '#AI_Ethics', '#FinTech', '#SoftSkills', '#NEP2020'].map(tag => (
                                <button 
                                    key={tag}
                                    onClick={() => setSearchQuery(tag.replace('#', ''))}
                                    className="px-4 py-1.5 rounded-full bg-slate-100/50 hover:bg-primary/10 hover:text-primary text-[11px] font-bold text-slate-500 border border-slate-200/50 transition-all active:scale-95"
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Dashboard Hero */}
                <div className="max-w-6xl mx-auto mb-12 p-8 md:p-12 rounded-[3rem] bg-on-surface text-white relative overflow-hidden flex flex-col md:flex-row items-center gap-8 shadow-2xl">
                    <div className="relative z-10 flex-1 text-center md:text-left">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white font-bold text-[10px] mb-6 uppercase tracking-widest border border-white/10">
                            <span className="material-symbols-outlined text-xs animate-pulse">explore</span>
                            Personalized Path
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black mb-4 font-headline tracking-tight leading-tight">
                            Build Your <span className="text-primary italic">Expertise</span> In 2026.
                        </h2>
                        <p className="text-white/70 font-medium max-w-lg leading-relaxed text-sm">
                            Unlock industry-endorsed certifications and immersive simulations designed to land you at top-tier firms.
                        </p>
                    </div>
                    <div className="relative z-10 flex items-center gap-4">
                        <div className="p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] text-center shadow-lg">
                            <p className="text-2xl font-black text-primary">240+</p>
                            <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest mt-1">Available Modules</p>
                        </div>
                    </div>
                    {/* Decorative pattern */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 blur-[100px] rounded-full translate-x-20 -translate-y-20"></div>
                </div>

                {/* Resource Grid */}
                <div className="max-w-6xl mx-auto no-scroll-shift">
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8 transition-all duration-700">
                        {displayResources.length > 0 ? (
                            displayResources.map((item) => (
                                <ResourceCard 
                                    key={item._id}
                                    item={item}
                                    user={user}
                                    favorites={favorites}
                                    toggleFavorite={toggleFavorite}
                                    navigate={navigate}
                                    getLevelColor={getLevelColor}
                                />
                            ))
                        ) : (
                            <div className="col-span-full py-32 text-center bg-white rounded-[3rem] border border-slate-100 shadow-sm">
                                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <span className="material-symbols-outlined text-4xl text-slate-200">search_off</span>
                                </div>
                                <h3 className="text-xl font-black text-on-surface mb-2">No matching resources</h3>
                                <p className="text-sm font-medium text-slate-400">Try adjusting your filters or search keywords.</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Global Account Settings Modal */}
            <ProfileSettings 
                isOpen={isSettingsOpen} 
                onClose={() => setIsSettingsOpen(false)} 
            />
        </div>
    );
};

export default Library;
