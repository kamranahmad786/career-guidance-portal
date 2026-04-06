require('dotenv').config();
const mongoose = require('mongoose');
const Resource = require('./models/Resource');

const dummyData = [
    // --- Technology & Engineering ---
    { title: 'Full-Stack MERN Engineering 2026', category: 'Specialized Courses', description: 'Master React 19, Node.js, and MongoDB with clean architecture.', imageUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee', contentUrl: 'https://www.youtube.com/watch?v=7CqJlxBYj-M', duration: '45 Hours', modules: 48, level: 'Advanced', rating: 4.9, enrolledCount: 12500 },
    { title: 'Next.js 14 & Server Components', category: 'Specialized Courses', description: 'Building high-performance applications with the App Router.', imageUrl: 'https://images.unsplash.com/photo-1618477388954-7852f32655ec', contentUrl: 'https://www.youtube.com/watch?v=wm5gMKuwSYk', duration: '18 Hours', modules: 22, level: 'Intermediate', rating: 4.8, enrolledCount: 8400 },
    { title: 'Generative AI & LLM Foundations', category: 'Specialized Courses', description: 'Transformer models, Prompt Engineering, and RAG.', imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995', contentUrl: 'https://www.youtube.com/watch?v=mEsleV16qdo', duration: '20 Hours', modules: 25, level: 'Intermediate', rating: 4.9, enrolledCount: 9300 },
    { title: 'Data Scientist: Python & ML', category: 'Specialized Courses', description: 'Master NumPy, Pandas, and Scikit-Learn for Data Science.', imageUrl: 'https://images.unsplash.com/photo-1527474305487-b87b222841cc', contentUrl: 'https://www.youtube.com/watch?v=rfscVS0vtbw', duration: '35 Hours', modules: 40, level: 'Intermediate', rating: 4.8, enrolledCount: 22000 },
    { title: 'Cybersecurity: Ethical Hacking', category: 'Specialized Courses', description: 'Practical penetration testing and network security.', imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b', contentUrl: 'https://www.youtube.com/watch?v=3Kq1MIfTWCE', duration: '14 Hours', modules: 18, level: 'Advanced', rating: 4.8, enrolledCount: 15700 },
    { title: 'AWS Cloud Solutions Architect', category: 'Specialized Courses', description: 'Deep dive into EC2, S3, and Cloud Scalability.', imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa', contentUrl: 'https://www.youtube.com/watch?v=Ia-UEYYR44s', duration: '22 Hours', modules: 30, level: 'Intermediate', rating: 4.9, enrolledCount: 31000 },

    // --- Creative Arts & Design ---
    { title: 'Professional Graphic Design', category: 'Specialized Courses', description: 'Master Photoshop, Illustrator, and Brand Aesthetics.', imageUrl: 'https://images.unsplash.com/photo-1626785774573-4b799315345d', contentUrl: 'https://www.youtube.com/watch?v=jwCm9Jkvm_w', duration: '25 Hours', modules: 30, level: 'Intermediate', rating: 4.8, enrolledCount: 11500 },
    { title: 'Film Making: Professional Track', category: 'Specialized Courses', description: 'Cinematography, Direction, and Elite Editing.', imageUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728', contentUrl: 'https://www.youtube.com/watch?v=JW-yL42J48A', duration: '40 Hours', modules: 50, level: 'Advanced', rating: 4.9, enrolledCount: 5200 },
    { title: 'Fashion Design & Illustration', category: 'Specialized Courses', description: 'Pattern making, fabric tech, and digital fashion art.', imageUrl: 'https://images.unsplash.com/photo-1539109132381-3151b660c20a', contentUrl: 'https://www.youtube.com/watch?v=JW-yL42J48A', duration: '30 Hours', modules: 35, level: 'Intermediate', rating: 4.7, enrolledCount: 3800 },
    { title: 'Architecture: AutoCAD Mastery', category: 'Specialized Courses', description: 'Sustainable architecture and Infrastructure design.', imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab', contentUrl: 'https://www.youtube.com/watch?v=XW07Z_3mFWA', duration: '50 Hours', modules: 45, level: 'Advanced', rating: 4.9, enrolledCount: 2900 },

    // --- Business, Law & Management ---
    { title: 'Chartered Accountant Mastery', category: 'Specialized Courses', description: 'Income tax, GST, and auditing foundations for elite professionals.', imageUrl: 'https://images.unsplash.com/photo-x6lWbv0eDNE', contentUrl: 'https://www.youtube.com/watch?v=XW07Z_3mFWA', duration: '100 Hours', modules: 60, level: 'Advanced', rating: 4.8, enrolledCount: 12000 },
    { title: 'FinTech & Modern Banking', category: 'Specialized Courses', description: 'Exploring digital banking, crypto-regulations, and AI in finance.', imageUrl: 'https://images.unsplash.com/photo-fCx7Na6jtuY', contentUrl: 'https://www.youtube.com/watch?v=Ia-UEYYR44s', duration: '18 Hours', modules: 15, level: 'Intermediate', rating: 4.8, enrolledCount: 5600 },
    { title: 'Indian Law: Legal Foundations', category: 'Specialized Courses', description: 'Constitutional law, criminal law, and civil basics.', imageUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f', contentUrl: 'https://www.youtube.com/watch?v=JW-yL42J48A', duration: '60 Hours', modules: 45, level: 'Intermediate', rating: 4.7, enrolledCount: 8100 },
    { title: 'Hospitality Management Elite', category: 'Specialized Courses', description: 'Hotel management, tourism, and guest relations.', imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800', contentUrl: 'https://www.youtube.com/watch?v=nU-IIXBWlS4', duration: '30 Hours', modules: 25, level: 'Beginner', rating: 4.6, enrolledCount: 5400 },

    // --- Career Simulations (10 Items) ---
    { title: 'The Diagnostic Lab: Multi-Symptom Quest', category: 'Career Simulations', description: 'Given conflicting patient vitals, choose the correct tests and make a life-saving diagnosis.', imageUrl: 'https://images.unsplash.com/photo-a_ldJ0EzbLI', contentUrl: 'https://edudisha.ai/sim/med-01', duration: '3 Hours', modules: 1, level: 'Advanced', rating: 4.9, enrolledCount: 1540 },
    { title: 'Medical Research Fundamentals', category: 'Specialized Courses', description: 'Ethics, Clinical Trials, and Evidence-Based medicine in the 21st century.', imageUrl: 'https://images.unsplash.com/photo-Gmu9edRoA5c', contentUrl: 'https://www.youtube.com/watch?v=nU-IIXBWlS4', duration: '50 Hours', modules: 40, level: 'Advanced', rating: 4.9, enrolledCount: 3100 },
    { title: 'Elite Mock Trial: The Corporate Case', category: 'Career Simulations', description: 'Interactive courtroom experience. Choose the winning arguments for a high-stakes tech lawsuit.', imageUrl: 'https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&q=80&w=800', contentUrl: 'https://edudisha.ai/sim/law-01', duration: '2 Hours', modules: 1, level: 'Intermediate', rating: 4.9, enrolledCount: 1200 },
    { title: 'Senior Engineer: High-Load Review', category: 'Career Simulations', description: 'Scenario-based code review. Identify performance bottlenecks in a global streaming app architecture.', imageUrl: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&q=80&w=800', contentUrl: 'https://edudisha.ai/sim/tech-01', duration: '90 Minutes', modules: 1, level: 'Advanced', rating: 4.8, enrolledCount: 850 },
    { title: 'Viral Crisis: Brand Reputation Sim', category: 'Career Simulations', description: 'Manage a real-time social media PR crisis. Your decisions determine the brand’s stock market impact.', imageUrl: 'https://images.unsplash.com/photo-1557200134-90327ee9fafa?auto=format&fit=crop&q=80&w=800', contentUrl: 'https://edudisha.ai/sim/mkt-01', duration: '1 Hour', modules: 1, level: 'Intermediate', rating: 5.0, enrolledCount: 3200 },
    { title: 'Urban Vision: Carbon-Neutral City', category: 'Career Simulations', description: 'Architectural simulation. Design a city grid that balances energy, traffic, and social well-being.', imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800', contentUrl: 'https://edudisha.ai/sim/arch-01', duration: '4 Hours', modules: 1, level: 'Intermediate', rating: 4.7, enrolledCount: 920 },
    { title: 'Ethical Hacking: Network Breach Defense', category: 'Career Simulations', description: 'Simulate a live cyber-attack. Deploy firewalls and track IP breaches lead.', imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800', contentUrl: 'https://edudisha.ai/sim/cyber-01', duration: '1 Hour', modules: 1, level: 'Advanced', rating: 4.9, enrolledCount: 2100 },
    { title: 'Counseling Room: Pediatric Behavioral Case', category: 'Career Simulations', description: 'Simulate a session with a child patient. Use cognitive therapy models to identify trauma markers.', imageUrl: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&q=80&w=800', contentUrl: 'https://edudisha.ai/sim/psy-01', duration: '2 Hours', modules: 1, level: 'Intermediate', rating: 4.8, enrolledCount: 950 },
    { title: 'Wall Street Trader: High-Volatility Portfolio', category: 'Career Simulations', description: 'Manage a $10M fund during a market flash-crash. Balance risk vs reward in real-time.', imageUrl: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=800', contentUrl: 'https://edudisha.ai/sim/fin-01', duration: '3 Hours', modules: 1, level: 'Advanced', rating: 4.9, enrolledCount: 620 },
    { title: 'Interior Pro: Sustainable Master Suite', category: 'Career Simulations', description: 'Choose materials and spatial flow for a LEED-certified luxury bedroom design.', imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=800', contentUrl: 'https://edudisha.ai/sim/int-01', duration: '90 Minutes', modules: 1, level: 'Beginner', rating: 4.7, enrolledCount: 1100 },
    { title: 'The Director’s Chair: Scene Blocking', category: 'Career Simulations', description: 'Simulate scene directing. Choose camera angles and lighting setups for a dramatic noir script.', imageUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=800', contentUrl: 'https://edudisha.ai/sim/film-01', duration: '2 Hours', modules: 1, level: 'Intermediate', rating: 4.8, enrolledCount: 450 }
];

const seedDB = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected! Seeding Knowledge Hub...');
        
        await Resource.deleteMany({});
        await Resource.insertMany(dummyData);
        
        console.log('Database Seeded Successfully!');
        process.exit();
    } catch (err) {
        console.error('Seeding error:', err);
        process.exit(1);
    }
};

seedDB();
