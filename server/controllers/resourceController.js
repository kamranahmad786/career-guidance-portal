const Resource = require('../models/Resource');
const jwt = require('jsonwebtoken');

/**
 * @desc    Get all resources (gated)
 * @route   GET /api/resources
 */
exports.getAllResources = async (req, res) => {
    // --- Local Elite Backup Dataset (35+ high-fidelity courses across every major industry) ---
    const eliteBackup = [
        // --- Technology & Engineering (1-10) ---
        { title: 'Full-Stack MERN Engineering 2026', category: 'Specialized Courses', description: 'Master React 19, Node.js, and MongoDB with clean architecture.', imageUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee', contentUrl: 'https://www.youtube.com/watch?v=7CqJlxBYj-M', duration: '45 Hours', modules: 48, level: 'Advanced', rating: 4.9, enrolledCount: 12500 },
        { title: 'Next.js 14 & Server Components', category: 'Specialized Courses', description: 'Building high-performance applications with the App Router.', imageUrl: 'https://images.unsplash.com/photo-1618477388954-7852f32655ec', contentUrl: 'https://www.youtube.com/watch?v=wm5gMKuwSYk', duration: '18 Hours', modules: 22, level: 'Intermediate', rating: 4.8, enrolledCount: 8400 },
        { title: 'Generative AI & LLM Foundations', category: 'Specialized Courses', description: 'Transformer models, Prompt Engineering, and RAG.', imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995', contentUrl: 'https://www.youtube.com/watch?v=mEsleV16qdo', duration: '20 Hours', modules: 25, level: 'Intermediate', rating: 4.9, enrolledCount: 9300 },
        { title: 'Data Scientist: Python & ML', category: 'Specialized Courses', description: 'Master NumPy, Pandas, and Scikit-Learn for Data Science.', imageUrl: 'https://images.unsplash.com/photo-1527474305487-b87b222841cc', contentUrl: 'https://www.youtube.com/watch?v=rfscVS0vtbw', duration: '35 Hours', modules: 40, level: 'Intermediate', rating: 4.8, enrolledCount: 22000 },
        { title: 'Cybersecurity: Ethical Hacking', category: 'Specialized Courses', description: 'Practical penetration testing and network security.', imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b', contentUrl: 'https://www.youtube.com/watch?v=3Kq1MIfTWCE', duration: '14 Hours', modules: 18, level: 'Advanced', rating: 4.8, enrolledCount: 15700 },
        { title: 'AWS Cloud Solutions Architect', category: 'Specialized Courses', description: 'Deep dive into EC2, S3, and Cloud Scalability.', imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa', contentUrl: 'https://www.youtube.com/watch?v=Ia-UEYYR44s', duration: '22 Hours', modules: 30, level: 'Intermediate', rating: 4.9, enrolledCount: 31000 },
        { title: 'Blockchain & Web3 Engineering', category: 'Specialized Courses', description: 'Build dApps using Solidity and Ethereum ecosystems.', imageUrl: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0', contentUrl: 'https://www.youtube.com/watch?v=gyMvvM606k4', duration: '32 Hours', modules: 20, level: 'Advanced', rating: 4.9, enrolledCount: 8900 },
        { title: 'Mobile App Dev: Flutter', category: 'Specialized Courses', description: 'Cross-platform apps for iOS and Android.', imageUrl: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c', contentUrl: 'https://www.youtube.com/watch?v=VPvVD8t02S8', duration: '28 Hours', modules: 24, level: 'Intermediate', rating: 4.8, enrolledCount: 11200 },
        { title: 'Software Architecture Masterclass', category: 'Specialized Courses', description: 'Microservices and Event-Driven Architecture.', imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97', contentUrl: 'https://www.youtube.com/watch?v=v3vMh3mF7Xo', duration: '20 Hours', modules: 22, level: 'Advanced', rating: 4.8, enrolledCount: 4100 },
        { title: 'Harvard CS50: Computer Science', category: 'Specialized Courses', description: 'The legendary introduction to computer science.', imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97', contentUrl: 'https://www.youtube.com/watch?v=8mAITcNt710', duration: '24 Weeks', modules: 12, level: 'Beginner', rating: 5.0, enrolledCount: 45000 },

        // --- Creative Arts & Design (11-20) ---
        { title: 'Professional Graphic Design', category: 'Specialized Courses', description: 'Master Photoshop, Illustrator, and Brand Aesthetics.', imageUrl: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&q=80&w=800', contentUrl: 'https://www.youtube.com/watch?v=jwCm9Jkvm_w', duration: '25 Hours', modules: 30, level: 'Intermediate', rating: 4.8, enrolledCount: 11500 },
        { title: 'Film Making: Professional Track', category: 'Specialized Courses', description: 'Cinematography, Direction, and Elite Editing.', imageUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=800', contentUrl: 'https://www.youtube.com/watch?v=JW-yL42J48A', duration: '40 Hours', modules: 50, level: 'Advanced', rating: 4.9, enrolledCount: 5200 },
        { title: 'Fashion Design & Illustration', category: 'Specialized Courses', description: 'Pattern making, fabric tech, and digital fashion art.', imageUrl: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&q=80&w=800', contentUrl: 'https://www.youtube.com/watch?v=JW-yL42J48A', duration: '30 Hours', modules: 35, level: 'Intermediate', rating: 4.7, enrolledCount: 3800 },
        { title: 'Interior Design: Space Planning', category: 'Specialized Courses', description: 'Designing beautiful and functional modern spaces.', imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=800', contentUrl: 'https://www.youtube.com/watch?v=68afhYis8Y', duration: '15 Hours', modules: 20, level: 'Beginner', rating: 4.6, enrolledCount: 4200 },
        { title: 'Architecture: AutoCAD Mastery', category: 'Specialized Courses', description: 'Sustainable architecture and Infrastructure design.', imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800', contentUrl: 'https://www.youtube.com/watch?v=XW07Z_3mFWA', duration: '50 Hours', modules: 45, level: 'Advanced', rating: 4.9, enrolledCount: 2900 },
        { title: 'Culinary Arts & Gastronomy', category: 'Specialized Courses', description: 'Professional cooking techniques and kitchen management.', imageUrl: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=800', contentUrl: 'https://www.youtube.com/watch?v=Ia-UEYYR44s', duration: '20 Hours', modules: 25, level: 'Beginner', rating: 4.8, enrolledCount: 7100 },
        { title: 'Digital Photography Mastery', category: 'Specialized Courses', description: 'Lighting, Composition, and Post-Processing.', imageUrl: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?auto=format&fit=crop&q=80&w=800', contentUrl: 'https://www.youtube.com/watch?v=7S_tz1z_5bA', duration: '12 Hours', modules: 15, level: 'Beginner', rating: 4.7, enrolledCount: 9200 },
        { title: '3D Animation Essentials', category: 'Specialized Courses', description: 'Character animation and visual effects using Blender.', imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=800', contentUrl: 'https://www.youtube.com/watch?v=nU-IIXBWlS4', duration: '40 Hours', modules: 40, level: 'Intermediate', rating: 4.9, enrolledCount: 6500 },
        { title: 'UI/UX Design Masterclass: Figma', category: 'Specialized Courses', description: 'Designing industry-leading user experiences.', imageUrl: 'https://images.unsplash.com/photo-1581291518066-cd5991823136?auto=format&fit=crop&q=80&w=800', contentUrl: 'https://www.youtube.com/watch?v=jwCm9Jkvm_w', duration: '12 Hours', modules: 15, level: 'Beginner', rating: 4.9, enrolledCount: 18200 },
        { title: 'Advanced Interaction Design 2026', category: 'Specialized Courses', description: 'Motion design and emotional interfaces.', imageUrl: 'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&q=80&w=800', contentUrl: 'https://www.youtube.com/watch?v=68wAfhYis8Y', duration: '8 Hours', modules: 10, level: 'Advanced', rating: 4.7, enrolledCount: 5600 },

        // --- Business, Law & Management (21-30) ---
        { title: 'Chartered Accountant: Taxation', category: 'Specialized Courses', description: 'Income tax, GST, and auditing foundations.', imageUrl: 'https://images.unsplash.com/photo-1454165833222-7d7b726bfef2?auto=format&fit=crop&q=80&w=800', contentUrl: 'https://www.youtube.com/watch?v=XW07Z_3mFWA', duration: '100 Hours', modules: 60, level: 'Advanced', rating: 4.8, enrolledCount: 12000 },
        { title: 'Indian Law: Legal Foundations', category: 'Specialized Courses', description: 'Constitutional law, criminal law, and civil basics.', imageUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=800', contentUrl: 'https://www.youtube.com/watch?v=JW-yL42J48A', duration: '60 Hours', modules: 45, level: 'Intermediate', rating: 4.7, enrolledCount: 8100 },
        { title: 'Hospitality Management Elite', category: 'Specialized Courses', description: 'Hotel management, tourism, and guest relations.', imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800', contentUrl: 'https://www.youtube.com/watch?v=nU-IIXBWlS4', duration: '30 Hours', modules: 25, level: 'Beginner', rating: 4.6, enrolledCount: 5400 },
        { title: 'Project Management: PMP Path', category: 'Specialized Courses', description: 'Agile, Scrum, and industrial projects.', imageUrl: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=800', contentUrl: 'https://www.youtube.com/watch?v=68afhYis8Y', duration: '35 Hours', modules: 30, level: 'Intermediate', rating: 4.9, enrolledCount: 11000 },
        { title: 'Strategic Risk Management', category: 'Specialized Courses', description: 'Identifying and mitigating global financial risks.', imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=800', contentUrl: 'https://www.youtube.com/watch?v=Ia-UEYYR44s', duration: '20 Hours', modules: 18, level: 'Advanced', rating: 4.8, enrolledCount: 4300 },
        { title: 'Fund & Asset Management', category: 'Specialized Courses', description: 'Portfolio strategy, hedge funds, and private equity.', imageUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&q=80&w=800', contentUrl: 'https://www.youtube.com/watch?v=Ia-UEYYR44s', duration: '25 Hours', modules: 20, level: 'Advanced', rating: 4.9, enrolledCount: 2200 },
        { title: 'Digital Marketing Fundamentals', category: 'Specialized Courses', description: 'SEO, SEM, and modern content strategy.', imageUrl: 'https://images.unsplash.com/photo-1533750349088-cd871a92f312?auto=format&fit=crop&q=80&w=800', contentUrl: 'https://www.youtube.com/watch?v=nU-IIXBWlS4', duration: '10 Hours', modules: 12, level: 'Beginner', rating: 4.7, enrolledCount: 14000 },
        { title: 'Product Management Edge', category: 'Specialized Courses', description: 'Building market-leading products.', imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800', contentUrl: 'https://www.youtube.com/watch?v=68afhYis8Y', duration: '8 Hours', modules: 10, level: 'Intermediate', rating: 4.8, enrolledCount: 6500 },
        { title: 'Entrepreneurship Mastery', category: 'Specialized Courses', description: 'Startup fundamentals and business scaling.', imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800', contentUrl: 'https://www.youtube.com/watch?v=XW07Z_3mFWA', duration: '12 Hours', modules: 15, level: 'Intermediate', rating: 4.9, enrolledCount: 5200 },
        { title: 'Talent Acquisition Specialist', category: 'Expert Webinars', description: 'Elite hiring practices for top firms.', imageUrl: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=800', contentUrl: 'https://youtube.com/live/hiring-outlook-edudisha', duration: '90 Minutes', modules: 1, level: 'Beginner', rating: 4.9, enrolledCount: 9500 },

        // --- Academic & Healthcare (31-35) ---
        { title: 'Medical Research Fundamentals', category: 'Specialized Courses', description: 'Ethics, Clinical Trials, and Evidence-Based medicine.', imageUrl: 'https://images.unsplash.com/photo-1579152276507-575ec44358a7?auto=format&fit=crop&q=80&w=800', contentUrl: 'https://www.youtube.com/watch?v=nU-IIXBWlS4', duration: '50 Hours', modules: 40, level: 'Advanced', rating: 4.9, enrolledCount: 3100 },
        { title: 'Child Psychology: Professional', category: 'Specialized Courses', description: 'Understanding development and cognitive learning.', imageUrl: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&q=80&w=800', contentUrl: 'https://www.youtube.com/watch?v=JW-yL42J48A', duration: '30 Hours', modules: 25, level: 'Intermediate', rating: 4.8, enrolledCount: 6800 },
        { title: 'NEP 2026 Pedagogical Strategy', category: 'Live Workshops', description: 'Multidisciplinary learning in modern schools.', imageUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=800', contentUrl: 'https://zoom.us/webinar/edudisha-nep-2026', duration: '4 Hours', modules: 1, level: 'Intermediate', rating: 5.0, enrolledCount: 3200 },
        { title: 'Modern Education Technology', category: 'Specialized Courses', description: 'Integrating EdTech tools for 2026 classrooms.', imageUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=800', contentUrl: 'https://www.youtube.com/watch?v=7S_tz1z_5bA', duration: '15 Hours', modules: 18, level: 'Beginner', rating: 4.7, enrolledCount: 12500 },
        { title: 'Journalism & Media Arts', category: 'Specialized Courses', description: 'Reporting, Broadcasting, and Digital News.', imageUrl: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=800', contentUrl: 'https://www.youtube.com/watch?v=nU-IIXBWlS4', duration: '20 Hours', modules: 22, level: 'Beginner', rating: 4.8, enrolledCount: 4500 },

        // --- Career Simulations (36-45) ---
        { title: 'Elite Mock Trial: The Corporate Case', category: 'Career Simulations', description: 'Interactive courtroom experience. Choose the winning arguments for a high-stakes tech lawsuit.', imageUrl: 'https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&q=80&w=800', contentUrl: 'https://edudisha.ai/sim/law-01', duration: '2 Hours', modules: 1, level: 'Intermediate', rating: 4.9, enrolledCount: 1200 },
        { title: 'Senior Engineer: High-Load Review', category: 'Career Simulations', description: 'Scenario-based code review. Identify performance bottlenecks in a global streaming app architecture.', imageUrl: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&q=80&w=800', contentUrl: 'https://edudisha.ai/sim/tech-01', duration: '90 Minutes', modules: 1, level: 'Advanced', rating: 4.8, enrolledCount: 850 },
        { title: 'Viral Crisis: Brand Reputation Sim', category: 'Career Simulations', description: 'Manage a real-time social media PR crisis. Your decisions determine the brand’s stock market impact.', imageUrl: 'https://images.unsplash.com/photo-1557200134-90327ee9fafa?auto=format&fit=crop&q=80&w=800', contentUrl: 'https://edudisha.ai/sim/mkt-01', duration: '1 Hour', modules: 1, level: 'Intermediate', rating: 5.0, enrolledCount: 3200 },
        { title: 'The Diagnostic Lab: Multi-Symptom Quest', category: 'Career Simulations', description: 'Given conflicting patient vitals, choose the correct tests and make a life-saving diagnosis.', imageUrl: 'https://images.unsplash.com/photo-1581056344415-3abb473d329d?auto=format&fit=crop&q=80&w=800', contentUrl: 'https://edudisha.ai/sim/med-01', duration: '3 Hours', modules: 1, level: 'Advanced', rating: 4.9, enrolledCount: 1540 },
        { title: 'Urban Vision: Carbon-Neutral City', category: 'Career Simulations', description: 'Architectural simulation. Design a city grid that balances energy, traffic, and social well-being.', imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800', contentUrl: 'https://edudisha.ai/sim/arch-01', duration: '4 Hours', modules: 1, level: 'Intermediate', rating: 4.7, enrolledCount: 920 },
        { title: 'Ethical Hacking: Network Breach Defense', category: 'Career Simulations', description: 'Simulate a live cyber-attack. Deploy firewalls and track IP breaches in a server-room scenario.', imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800', contentUrl: 'https://edudisha.ai/sim/cyber-01', duration: '1 Hour', modules: 1, level: 'Advanced', rating: 4.9, enrolledCount: 2100 },
        { title: 'Counseling Room: Pediatric Behavioral Case', category: 'Career Simulations', description: 'Simulate a session with a child patient. Use cognitive therapy models to identify trauma markers.', imageUrl: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&q=80&w=800', contentUrl: 'https://edudisha.ai/sim/psy-01', duration: '2 Hours', modules: 1, level: 'Intermediate', rating: 4.8, enrolledCount: 950 },
        { title: 'Wall Street Trader: High-Volatility Portfolio', category: 'Career Simulations', description: 'Manage a $10M fund during a market flash-crash. Balance risk vs reward in real-time.', imageUrl: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=800', contentUrl: 'https://edudisha.ai/sim/fin-01', duration: '3 Hours', modules: 1, level: 'Advanced', rating: 4.9, enrolledCount: 620 },
        { title: 'Interior Pro: Sustainable Master Suite', category: 'Career Simulations', description: 'Choose materials and spatial flow for a LEED-certified luxury bedroom design.', imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=800', contentUrl: 'https://edudisha.ai/sim/int-01', duration: '90 Minutes', modules: 1, level: 'Beginner', rating: 4.7, enrolledCount: 1100 },
        { title: 'The Director’s Chair: Scene Blocking', category: 'Career Simulations', description: 'Simulate scene directing. Choose camera angles and lighting setups for a dramatic noir script.', imageUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=800', contentUrl: 'https://edudisha.ai/sim/film-01', duration: '2 Hours', modules: 1, level: 'Intermediate', rating: 4.8, enrolledCount: 450 }
    ];

    try {
        let resources = await Resource.find({});
        
        // Auto-seed or Force-Refresh if library is incomplete (less than 10 courses)
        if (resources.length < 10) {
            await Resource.deleteMany({}); // Clear old/incomplete data
            await Resource.insertMany(eliteBackup.map(r => {
                const { _id, ...rest } = r;
                return rest;
            }));
            resources = await Resource.find({});
        }

        // Authentication & Gating Logic
        const authHeader = req.headers.authorization;
        let isAuthenticated = false;
        if (authHeader && authHeader.startsWith('Bearer')) {
            try {
                const token = authHeader.split(' ')[1];
                const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123');
                if (decoded && decoded.id) isAuthenticated = true;
            } catch (error) { isAuthenticated = false; }
        }

        const sanitizedResources = resources.map(resource => {
            const resObj = resource.toObject();
            if (!isAuthenticated) {
                delete resObj.contentUrl;
                resObj.isLocked = true;
            } else { resObj.isLocked = false; }
            return resObj;
        });

        res.json(sanitizedResources);
    } catch (error) {
        console.warn('MongoDB Connection Failed. Falling back to Local Elite Hub.');
        
        // Even in fallback mode, we must check authentication to unlock content
        const authHeader = req.headers.authorization;
        let isAuthenticated = false;
        if (authHeader && authHeader.startsWith('Bearer')) {
            try {
                const token = authHeader.split(' ')[1];
                const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123');
                if (decoded && decoded.id) isAuthenticated = true;
            } catch (err) { isAuthenticated = false; }
        }

        const fallbackResources = eliteBackup.map(r => ({
            ...r,
            isLocked: !isAuthenticated
        }));

        res.status(200).json(fallbackResources);
    }
};

/**
 * @desc    Helper to seed initial resources
 * @route   POST /api/resources/seed
 * (Only for development, typically would be a separate script or admin tool)
 */
exports.seedResources = async (req, res) => {
    try {
        const eliteResources = [
            // --- Specialized Courses: Development & Architecture ---
            {
                title: 'Full-Stack MERN Engineering 2026',
                category: 'Specialized Courses',
                description: 'Master React 19, Node.js, and MongoDB with clean architecture and advanced patterns.',
                imageUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee',
                contentUrl: 'https://www.youtube.com/watch?v=7CqJlxBYj-M',
                duration: '45 Hours',
                modules: 48,
                level: 'Advanced',
                rating: 4.9,
                enrolledCount: 12500
            },
            {
                title: 'Next.js 14 & Server Components',
                category: 'Specialized Courses',
                description: 'The ultimate guide to building high-performance applications with the App Router.',
                imageUrl: 'https://images.unsplash.com/photo-1618477388954-7852f32655ec',
                contentUrl: 'https://www.youtube.com/watch?v=wm5gMKuwSYk',
                duration: '18 Hours',
                modules: 22,
                level: 'Intermediate',
                rating: 4.8,
                enrolledCount: 8400
            },
            {
                title: 'Harvard CS50: Computer Science',
                category: 'Specialized Courses',
                description: 'The world-famed introduction to the intellectual enterprises of computer science.',
                imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97',
                contentUrl: 'https://www.youtube.com/watch?v=8mAITcNt710',
                duration: '24 Weeks',
                modules: 12,
                level: 'Beginner',
                rating: 5.0,
                enrolledCount: 45000
            },
            // --- Specialized Courses: UI/UX & Design ---
            {
                title: 'UI/UX Design Masterclass: Figma',
                category: 'Specialized Courses',
                description: 'Learn design systems, wireframing, and high-fidelity prototyping using industry-standard tools.',
                imageUrl: 'https://images.unsplash.com/photo-1586717791821-3f44a563eb4c',
                contentUrl: 'https://www.youtube.com/watch?v=jwCm9Jkvm_w',
                duration: '12 Hours',
                modules: 15,
                level: 'Beginner',
                rating: 4.9,
                enrolledCount: 18200
            },
            {
                title: 'Advanced Interaction Design 2026',
                category: 'Specialized Courses',
                description: 'Focus on motion design, accessibility, and emotional interfaces for modern web apps.',
                imageUrl: 'https://images.unsplash.com/photo-1558655146-d09347e92766',
                contentUrl: 'https://www.youtube.com/watch?v=68wAfhYis8Y',
                duration: '8 Hours',
                modules: 10,
                level: 'Advanced',
                rating: 4.7,
                enrolledCount: 5600
            },
            // --- Specialized Courses: AI & Data Science ---
            {
                title: 'Generative AI & LLM Foundations',
                category: 'Specialized Courses',
                description: 'Deep dive into Transformer models, Prompt Engineering, and RAG architectures.',
                imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995',
                contentUrl: 'https://www.youtube.com/watch?v=mEsleV16qdo',
                duration: '20 Hours',
                modules: 25,
                level: 'Intermediate',
                rating: 4.9,
                enrolledCount: 9300
            },
            {
                title: 'Python for Data Science & ML',
                category: 'Specialized Courses',
                description: 'Master NumPy, Pandas, Scikit-Learn and build predictive models from scratch.',
                imageUrl: 'https://images.unsplash.com/photo-1527474305487-b87b222841cc',
                contentUrl: 'https://www.youtube.com/watch?v=rfscVS0vtbw',
                duration: '35 Hours',
                modules: 40,
                level: 'Intermediate',
                rating: 4.8,
                enrolledCount: 22000
            },
            // --- Specialized Courses: Cybersecurity & Cloud ---
            {
                title: 'Ethical Hacking: Elite Course',
                category: 'Specialized Courses',
                description: 'Comprehensive cybersecurity training: penetration testing, network sniffing, and more.',
                imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b',
                contentUrl: 'https://www.youtube.com/watch?v=3Kq1MIfTWCE',
                duration: '14 Hours',
                modules: 18,
                level: 'Advanced',
                rating: 4.8,
                enrolledCount: 15700
            },
            {
                title: 'AWS Certified Solutions Architect',
                category: 'Specialized Courses',
                description: 'Prepare for the AWS SAA-C03 exam with deep dives into EC2, S3, and Serverless.',
                imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa',
                contentUrl: 'https://www.youtube.com/watch?v=Ia-UEYYR44s',
                duration: '22 Hours',
                modules: 30,
                level: 'Intermediate',
                rating: 4.9,
                enrolledCount: 31000
            },
            // --- Live Workshops & Expert Webinars ---
            {
                title: 'NEP 2020 Implementation Workshop',
                category: 'Live Workshops',
                description: 'Live session for educators on integrating multidisciplinary learning into curriculums.',
                imageUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655',
                contentUrl: 'https://zoom.us/webinar/edudisha-nep-2026',
                duration: '4 Hours',
                modules: 1,
                level: 'Expert',
                rating: 5.0,
                enrolledCount: 4200
            },
            {
                title: 'Global Career Outlook 2030',
                category: 'Expert Webinars',
                description: 'Elite industry panel discussing the jobs of tomorrow and essential adaptive skills.',
                imageUrl: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b',
                contentUrl: 'https://youtube.com/live/career-outlook-edudisha',
                duration: '90 Minutes',
                modules: 1,
                level: 'Beginner',
                rating: 4.9,
                enrolledCount: 15000
            },
            {
                title: 'Soft Skills for MNC Leaders',
                category: 'Specialized Courses',
                description: 'Communication, emotional intelligence, and cultural competence for the global stage.',
                imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4',
                contentUrl: 'https://www.youtube.com/watch?v=HAnw168huqA',
                duration: '6 Hours',
                modules: 8,
                level: 'Beginner',
                rating: 4.8,
                enrolledCount: 7800
            }
        ];

        await Resource.deleteMany({});
        const resources = await Resource.insertMany(eliteResources);
        res.json({ message: 'Elite Knowledge Hub Seeded Successfully', count: resources.length });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
