const TeacherProfile = require('../models/TeacherProfile');
const User = require('../models/User');
const Result = require('../models/Result');
const Quiz = require('../models/Quiz');
const Event = require('../models/Event');
const Notification = require('../models/Notification');
const { generateQuiz } = require('../services/aiQuizGenerator');

/**
 * Get Teacher Dashboard Analytics
 * GET /api/teacher/dashboard
 */
exports.getTeacherDashboardStats = async (req, res) => {
    try {
        const teacherProfile = await TeacherProfile.findOne({ user: req.user._id });
        if (!teacherProfile) {
            return res.status(404).json({ message: "Teacher profile not found." });
        }

        const school = teacherProfile.schoolName;
        
        // 1. Get all students in the teacher's school
        const students = await User.find({ school, role: 'Student' });
        const totalStudents = students.length;
        
        const studentIds = students.map(s => s._id);

        // 2. Get all results for these students
        const results = await Result.find({ studentId: { $in: studentIds } });
        
        // 3. Calculate Participation (unique students who attempted at least one quiz)
        const activeStudentCount = new Set(results.map(r => r.studentId.toString())).size;
        const participationRate = totalStudents > 0 ? Math.round((activeStudentCount / totalStudents) * 100) : 0;

        // 4. Calculate Average Performance (Based on actual accuracy)
        let totalAccuracy = 0;
        let scoreCount = 0;
        results.forEach(r => {
            const totalQuestions = r.answers ? r.answers.length : 0;
            const correctAnswers = r.answers ? r.answers.filter(a => a.isCorrect).length : 0;
            if (totalQuestions > 0) {
                totalAccuracy += (correctAnswers / totalQuestions) * 100;
                scoreCount++;
            }
        });
        const avgPerformance = scoreCount > 0 ? Math.round(totalAccuracy / scoreCount) : 0;

        res.status(200).json({
            stats: {
                totalStudents,
                activeStudents: activeStudentCount,
                participationRate: `${participationRate}%`,
                avgPerformance: `${avgPerformance}%`
            },
            teacherProfile
        });

    } catch (error) {
        console.error("Teacher Dashboard Error:", error);
        res.status(500).json({ message: "Failed to fetch teacher analytics." });
    }
};

/**
 * Get Recent Student Activity
 * GET /api/teacher/students
 */
exports.getStudentsList = async (req, res) => {
    try {
        const teacherProfile = await TeacherProfile.findOne({ user: req.user._id });
        const school = teacherProfile.schoolName;

        const students = await User.find({ school, role: 'Student' });
        const studentIds = students.map(s => s._id);

        // Fetch recent results across all students in school
        const recentResults = await Result.find({ studentId: { $in: studentIds } })
            .populate('studentId', 'name grade school')
            .sort({ createdAt: -1 })
            .limit(10);

        const activity = recentResults.map(r => {
            const totalQuestions = r.answers ? r.answers.length : 0;
            const correctAnswers = r.answers ? r.answers.filter(a => a.isCorrect).length : 0;
            const accuracy = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
            
            return {
                _id: r._id,
                name: r.studentId.name,
                class: r.studentId.grade,
                status: 'Completed',
                interest: r.topParameters?.[0] || 'General',
                score: `${accuracy}%`
            };
        });

        res.status(200).json(activity);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch student activity." });
    }
};

/**
 * Generate AI Powered Quiz
 * POST /api/teacher/generate-quiz
 */
exports.generateAIQuiz = async (req, res) => {
    try {
        const { title, parameters, questionCount } = req.body;
        const teacherProfile = await TeacherProfile.findOne({ user: req.user._id });

        if (!parameters || parameters.length === 0) {
            return res.status(400).json({ message: "Please provide parameters for the quiz." });
        }

        // Call Gemini Service
        const generatedQuestions = await generateQuiz(parameters);

        // Save new Quiz to database
        const newQuiz = await Quiz.create({
            title: title || `AI Career Aptitude - ${parameters[0]}`,
            parameter: parameters[0], // Primary parameter
            questions: generatedQuestions // Now directly a flattened array of questions
        });

        res.status(201).json({
            message: "Quiz generated successfully and added to library.",
            quiz: newQuiz
        });

        // NOTIFY ALL STUDENTS IN THE SCHOOL
        try {
            const students = await User.find({ school: teacherProfile.schoolName, role: 'Student' });
            const notifications = students.map(student => ({
                recipient: student._id,
                type: 'achievement',
                title: 'New AI Assessment Available!',
                message: `Your educator has forged a new career assessment: ${newQuiz.title}. Start your journey now!`,
                link: '/student/quiz' // Link to quiz directly
            }));
            
            if (notifications.length > 0) {
                await Notification.insertMany(notifications);
            }
        } catch (notifErr) {
            console.error("Delayed Notification Failed:", notifErr);
        }

    } catch (error) {
        console.error("AI Quiz Gen Error:", error);
        res.status(500).json({ message: "Failed to generate AI quiz." });
    }
};

/**
 * Get Full Student Roster for a school
 * GET /api/teacher/roster
 */
exports.getFullStudentRoster = async (req, res) => {
    try {
        const teacherProfile = await TeacherProfile.findOne({ user: req.user._id });
        if (!teacherProfile) return res.status(404).json({ message: "Teacher not found" });

        const school = teacherProfile.schoolName;
        const students = await User.find({ school, role: 'Student' }).sort({ name: 1 });
        const studentIds = students.map(s => s._id);

        // Fetch latest results for all students in bulk
        const allResults = await Result.find({ studentId: { $in: studentIds } }).sort({ createdAt: -1 });

        const roster = students.map(student => {
            // Find this student's latest result
            const latestResult = allResults.find(r => r.studentId.toString() === student._id.toString());
            
            let avgScore = "--";
            let topInterest = "N/A";
            let status = "Not Started";

            if (latestResult) {
                // Calculate actual accuracy: (Correct Answers / Total Questions) * 100
                const totalQuestions = latestResult.answers ? latestResult.answers.length : 0;
                const correctAnswers = latestResult.answers ? latestResult.answers.filter(a => a.isCorrect).length : 0;
                
                avgScore = totalQuestions > 0 ? `${Math.round((correctAnswers / totalQuestions) * 100)}%` : "0%";
                
                topInterest = (latestResult.topParameters && latestResult.topParameters.length > 0) 
                    ? latestResult.topParameters[0] 
                    : "Analyzing...";
                status = "Completed";
            }

            return {
                _id: student._id,
                name: student.name,
                email: student.email,
                class: student.grade || "Unassigned",
                grade: student.grade || "Unassigned",
                status,
                interest: topInterest,
                score: avgScore,
                lastActive: latestResult ? latestResult.createdAt : student.updatedAt
            };
        });

        res.status(200).json(roster);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch student roster." });
    }
};

/**
 * Get School Events
 * GET /api/teacher/events
 */
exports.getSchoolEvents = async (req, res) => {
    try {
        const teacherProfile = await TeacherProfile.findOne({ user: req.user._id });
        const events = await Event.find({ school: teacherProfile.schoolName }).sort({ date: 1 });
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch events." });
    }
};

/**
 * Create School Event
 * POST /api/teacher/events
 */
exports.createSchoolEvent = async (req, res) => {
    try {
        const { title, description, date, location, type } = req.body;
        const teacherProfile = await TeacherProfile.findOne({ user: req.user._id });

        const newEvent = await Event.create({
            teacherId: req.user._id,
            school: teacherProfile.schoolName,
            title,
            description,
            date,
            location,
            type
        });

        // NOTIFY ALL STUDENTS IN THE SCHOOL
        const students = await User.find({ school: teacherProfile.schoolName, role: 'Student' });
        const notifications = students.map(student => ({
            recipient: student._id,
            type: 'system',
            title: 'New School Activity Scheduled!',
            message: `${teacherProfile.user.name || 'Your Teacher'} has scheduled a new ${type}: ${title}.`,
            link: '/student/dashboard'
        }));
        
        if (notifications.length > 0) {
            await Notification.insertMany(notifications);
        }

        res.status(201).json(newEvent);
    } catch (error) {
        res.status(500).json({ message: "Failed to create event." });
    }
};

/**
 * Delete School Event
 * DELETE /api/teacher/events/:id
 */
exports.deleteSchoolEvent = async (req, res) => {
    try {
        await Event.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Event deleted successfully." });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete event." });
    }
};

/**
 * Get Recently Generated Quizzes
 * GET /api/teacher/quizzes
 */
exports.getRecentQuizzes = async (req, res) => {
    try {
        // Here we just fetch all quizzes for now, 
        // ideally we'd filter by the teacher who created them if we had that field.
        const quizzes = await Quiz.find().sort({ createdAt: -1 }).limit(10);
        res.status(200).json(quizzes);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch recent quizzes." });
    }
};
/**
 * Search global records (Students, Quizzes)
 * GET /api/teacher/search
 */
exports.searchGlobal = async (req, res) => {
    try {
        const { q } = req.query;
        if (!q || q.length < 2) {
            return res.json({ students: [], quizzes: [] });
        }

        const teacherProfile = await TeacherProfile.findOne({ user: req.user._id });
        if (!teacherProfile) {
            return res.status(404).json({ message: "Teacher Profile Not Found" });
        }

        const school = teacherProfile.schoolName;

        // 1. Search Students
        const students = await User.find({
            role: 'Student',
            school: school,
            $or: [
                { name: { $regex: q, $options: 'i' } },
                { email: { $regex: q, $options: 'i' } }
            ]
        }).select('name email grade profileImage').limit(5);

        // 2. Search Quizzes
        const quizzes = await Quiz.find({
            $or: [
                { title: { $regex: q, $options: 'i' } },
                { parameter: { $regex: q, $options: 'i' } }
            ]
        }).select('title parameter createdAt').limit(5);

        res.json({ students, quizzes });

    } catch (error) {
        console.error("Global Search Error:", error);
        res.status(500).json({ message: "Search failed" });
    }
};
