const User = require('../models/User');
const Recommendation = require('../models/Recommendation');
const Quiz = require('../models/Quiz');
const Result = require('../models/Result');
const Notification = require('../models/Notification');
const SystemConfig = require('../models/SystemConfig');

/**
 * Get system configuration
 */
exports.getSystemConfig = async (req, res) => {
    try {
        let config = await SystemConfig.findOne();
        if (!config) {
            config = await SystemConfig.create({});
        }
        res.status(200).json(config);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Update system configuration
 */
exports.updateSystemConfig = async (req, res) => {
    try {
        let config = await SystemConfig.findOne();
        if (!config) {
            config = await SystemConfig.create(req.body);
        } else {
            Object.assign(config, req.body);
            await config.save();
        }
        res.status(200).json(config);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Global search across users and quizzes
 */
exports.globalSearch = async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) return res.json({ users: [], quizzes: [] });

        const users = await User.find({
            $or: [
                { name: { $regex: q, $options: 'i' } },
                { email: { $regex: q, $options: 'i' } }
            ]
        }).limit(5).select('name email role');

        const quizzes = await Quiz.find({
            parameter: { $regex: q, $options: 'i' }
        }).limit(5);

        res.json({ users, quizzes });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Get aggregated dashboard statistics with real growth trends
 */
exports.getDashboardStats = async (req, res) => {
    try {
        const totalStudents = await User.countDocuments({ role: 'Student' });
        const totalParents = await User.countDocuments({ role: 'Parent' });
        const totalTeachers = await User.countDocuments({ role: 'Teacher' });
        const totalQuizzes = await Quiz.countDocuments();
        const totalResults = await Result.countDocuments();
        
        // Active: students who submitted at least one quiz result
        const activeStudentIds = await Result.distinct('studentId');
        const activePercentage = totalStudents > 0 ? Math.round((activeStudentIds.length / totalStudents) * 100) : 0;

        // Growth trends: compare this month vs last month
        const now = new Date();
        const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);

        const thisMonthUsers = await User.countDocuments({ createdAt: { $gte: thisMonthStart } });
        const lastMonthUsers = await User.countDocuments({ createdAt: { $gte: lastMonthStart, $lt: thisMonthStart } });
        const growthPercent = lastMonthUsers > 0 ? Math.round(((thisMonthUsers - lastMonthUsers) / lastMonthUsers) * 100) : thisMonthUsers > 0 ? 100 : 0;

        res.status(200).json({
            totalStudents,
            totalParents,
            totalTeachers,
            totalQuizzes,
            totalResults,
            activeStudents: activeStudentIds.length,
            activePercentage,
            growthPercent
        });
    } catch (error) {
        console.error("Admin Stats Error:", error);
        res.status(500).json({ message: "Failed to fetch admin stats" });
    }
};

/**
 * Get analytics data for charts — all real from DB
 */
exports.getAnalyticsData = async (req, res) => {
    try {
        // 1. User Growth: last 6 months, broken down by month
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const growthData = await User.aggregate([
            { $match: { createdAt: { $gte: sixMonthsAgo } } },
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } }
        ]);

        // Fill in missing months with 0
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const filledGrowth = [];
        for (let i = 5; i >= 0; i--) {
            const d = new Date();
            d.setMonth(d.getMonth() - i);
            const year = d.getFullYear();
            const month = d.getMonth() + 1;
            const found = growthData.find(g => g._id.year === year && g._id.month === month);
            filledGrowth.push({
                label: monthNames[month - 1],
                count: found ? found.count : 0
            });
        }

        // 2. Career Interests: from Recommendation topParameters
        const interestDistribution = await Recommendation.aggregate([
            { $unwind: "$topParameters" },
            {
                $group: {
                    _id: "$topParameters",
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } },
            { $limit: 6 }
        ]);

        // 3. Role distribution for pie chart
        const roleDistribution = await User.aggregate([
            {
                $group: {
                    _id: "$role",
                    count: { $sum: 1 }
                }
            }
        ]);

        // 4. Quiz completion rate
        const quizCompletionRate = await Result.countDocuments();

        // 5. Recent registrations (last 5 users)
        const recentUsers = await User.find()
            .select('name email role createdAt')
            .sort({ createdAt: -1 })
            .limit(5);

        res.status(200).json({
            growth: filledGrowth,
            interests: interestDistribution,
            roleDistribution,
            quizCompletionRate,
            recentUsers
        });
    } catch (error) {
        console.error("Admin Analytics Error:", error);
        res.status(500).json({ message: "Failed to fetch analytics data" });
    }
};

/**
 * Get recent system-wide notifications/alerts
 */
exports.getRecentAlerts = async (req, res) => {
    try {
        // Recent user registrations as "alerts"
        const recentRegistrations = await User.find()
            .select('name role createdAt')
            .sort({ createdAt: -1 })
            .limit(3);

        // Recent quiz submissions
        const recentQuizzes = await Result.find()
            .populate('studentId', 'name')
            .sort({ createdAt: -1 })
            .limit(3);

        // Recent notifications
        const recentNotifications = await Notification.find()
            .populate('recipient', 'name')
            .sort({ createdAt: -1 })
            .limit(5);

        // Build unified alert feed
        const alerts = [];

        recentRegistrations.forEach(u => {
            alerts.push({
                type: 'registration',
                title: `New ${u.role} registered: ${u.name}`,
                time: u.createdAt,
                icon: 'person_add',
                color: 'primary'
            });
        });

        recentQuizzes.forEach(r => {
            alerts.push({
                type: 'quiz',
                title: `Quiz submitted by ${r.studentId?.name || 'Unknown'}`,
                time: r.createdAt,
                icon: 'quiz',
                color: 'emerald-600'
            });
        });

        recentNotifications.forEach(n => {
            alerts.push({
                type: 'notification',
                title: n.title,
                time: n.createdAt,
                icon: 'notifications',
                color: 'blue-500'
            });
        });

        // Sort all alerts by time, newest first, limit to 6
        alerts.sort((a, b) => new Date(b.time) - new Date(a.time));

        res.status(200).json(alerts.slice(0, 6));
    } catch (error) {
        console.error("Admin Alerts Error:", error);
        res.status(500).json({ message: "Failed to fetch alerts" });
    }
};

/**
 * Get all users with search/filter
 */
exports.getUsers = async (req, res) => {
    try {
        const { search, role } = req.query;
        let filter = {};
        
        if (role && role !== 'all') {
            filter.role = role;
        }
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }

        const users = await User.find(filter).select('-password').sort({ createdAt: -1 });
        res.status(200).json(users);
    } catch (error) {
        console.error("Admin GetUsers Error:", error);
        res.status(500).json({ message: "Failed to fetch users" });
    }
};

/**
 * Update a user's role
 */
exports.updateUserRole = async (req, res) => {
    try {
        const { role } = req.body;
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        user.role = role;
        await user.save();
        res.status(200).json({ message: `User role updated to ${role}`, user });
    } catch (error) {
        console.error("Admin UpdateRole Error:", error);
        res.status(500).json({ message: "Failed to update user role" });
    }
};

/**
 * Delete a user
 */
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });
        
        if (user.role === 'SuperAdmin') {
            return res.status(403).json({ message: "Cannot delete a Super Admin" });
        }

        await User.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "User successfully removed" });
    } catch (error) {
        console.error("Admin DeleteUser Error:", error);
        res.status(500).json({ message: "Failed to delete user" });
    }
};

// ─── STUDENTS ────────────────────────────────────────────────────────────────
const StudentProfile = require('../models/StudentProfile');

exports.getStudents = async (req, res) => {
    try {
        const { search } = req.query;
        let filter = { role: 'Student' };
        if (search) filter.$or = [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }];
        const students = await User.find(filter).select('-password').sort({ createdAt: -1 });
        const studentIds = students.map(s => s._id);
        const profiles = await StudentProfile.find({ user: { $in: studentIds } });
        const results = await Result.find({ studentId: { $in: studentIds } });
        const enriched = students.map(s => {
            const profile = profiles.find(p => p.user.toString() === s._id.toString());
            const studentResults = results.filter(r => r.studentId.toString() === s._id.toString());
            return {
                ...s.toObject(),
                profile: profile || null,
                quizzesTaken: studentResults.length,
                avgScore: studentResults.length > 0
                    ? Math.round(studentResults.reduce((sum, r) => {
                        const scores = Array.from(r.parameterScores?.values?.() || []);
                        return sum + (scores.reduce((a, b) => a + b, 0) / (scores.length || 1));
                    }, 0) / studentResults.length)
                    : 0
            };
        });
        res.status(200).json(enriched);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// ─── TEACHERS ────────────────────────────────────────────────────────────────
const TeacherProfile = require('../models/TeacherProfile');

exports.getTeachers = async (req, res) => {
    try {
        const { search } = req.query;
        let filter = { role: 'Teacher' };
        if (search) filter.$or = [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }];
        const teachers = await User.find(filter).select('-password').sort({ createdAt: -1 });
        const teacherIds = teachers.map(t => t._id);
        const profiles = await TeacherProfile.find({ user: { $in: teacherIds } });
        const quizCounts = await Quiz.aggregate([
            { $group: { _id: '$createdBy', count: { $sum: 1 } } }
        ]);
        const enriched = teachers.map(t => {
            const profile = profiles.find(p => p.user.toString() === t._id.toString());
            const qc = quizCounts.find(q => q._id?.toString() === t._id.toString());
            return { ...t.toObject(), profile: profile || null, quizzesCreated: qc?.count || 0 };
        });
        res.status(200).json(enriched);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// ─── PARENTS ─────────────────────────────────────────────────────────────────
const ParentProfile = require('../models/ParentProfile');

exports.getParents = async (req, res) => {
    try {
        const { search } = req.query;
        let filter = { role: 'Parent' };
        if (search) filter.$or = [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }];
        const parents = await User.find(filter).select('-password').sort({ createdAt: -1 });
        const parentIds = parents.map(p => p._id);
        const profiles = await ParentProfile.find({ user: { $in: parentIds } });
        const enriched = parents.map(p => {
            const profile = profiles.find(pr => pr.user.toString() === p._id.toString());
            return { ...p.toObject(), profile: profile || null };
        });
        res.status(200).json(enriched);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// ─── QUIZZES ─────────────────────────────────────────────────────────────────
exports.getQuizzes = async (req, res) => {
    try {
        const { search } = req.query;
        let filter = {};
        if (search) filter.parameter = { $regex: search, $options: 'i' };
        const quizzes = await Quiz.find(filter).sort({ createdAt: -1 });
        const quizIds = quizzes.map(q => q._id);
        // Count how many results used each quiz's parameters
        const attemptCounts = await Result.aggregate([
            { $unwind: '$answers' },
            { $group: { _id: '$answers.parameter', attempts: { $sum: 1 } } }
        ]);
        const enriched = quizzes.map(q => {
            const ac = attemptCounts.find(a => a._id === q.parameter);
            return { ...q.toObject(), totalAttempts: ac?.attempts || 0 };
        });
        res.status(200).json(enriched);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.deleteQuiz = async (req, res) => {
    try {
        await Quiz.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Quiz deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// ─── RESOURCES / COURSES ─────────────────────────────────────────────────────
const Resource = require('../models/Resource');

exports.getResources = async (req, res) => {
    try {
        const resources = await Resource.find().sort({ createdAt: -1 });
        res.status(200).json(resources);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.deleteResource = async (req, res) => {
    try {
        await Resource.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Resource deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// ─── EVENTS / ACTIVITIES ─────────────────────────────────────────────────────
const Event = require('../models/Event');

exports.getEvents = async (req, res) => {
    try {
        const events = await Event.find()
            .populate('teacherId', 'name email')
            .sort({ date: 1 });
        res.status(200).json(events);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.deleteEvent = async (req, res) => {
    try {
        await Event.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Event deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// ─── AI SYSTEM CONTROL ────────────────────────────────────────────────────────
exports.getAIStatus = async (req, res) => {
    try {
        const totalQuizzes = await Quiz.countDocuments();
        const totalResults = await Result.countDocuments();
        const totalRecommendations = await Recommendation.countDocuments();
        const topParameters = await Recommendation.aggregate([
            { $unwind: '$topParameters' },
            { $group: { _id: '$topParameters', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 8 }
        ]);
        const recentQuizActivity = await Result.find()
            .populate('studentId', 'name')
            .sort({ createdAt: -1 })
            .limit(5);
        res.status(200).json({
            totalQuizzes,
            totalResults,
            totalRecommendations,
            topParameters,
            recentQuizActivity
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// ─── REPORTS & ANALYTICS ─────────────────────────────────────────────────────
exports.getReports = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalStudents = await User.countDocuments({ role: 'Student' });
        const totalTeachers = await User.countDocuments({ role: 'Teacher' });
        const totalParents = await User.countDocuments({ role: 'Parent' });
        const totalQuizzes = await Quiz.countDocuments();
        const totalResults = await Result.countDocuments();
        const totalRecommendations = await Recommendation.countDocuments();
        const totalResources = await Resource.countDocuments();

        // Monthly registration breakdown for full year
        const yearAgo = new Date(); yearAgo.setFullYear(yearAgo.getFullYear() - 1);
        const monthlyGrowth = await User.aggregate([
            { $match: { createdAt: { $gte: yearAgo } } },
            { $group: { _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } }, count: { $sum: 1 } } },
            { $sort: { '_id.year': 1, '_id.month': 1 } }
        ]);

        // Top careers from recommendations
        const topCareers = await Recommendation.aggregate([
            { $unwind: '$careers' },
            { $group: { _id: '$careers', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 8 }
        ]);

        // Top parameters
        const topParameters = await Recommendation.aggregate([
            { $unwind: '$topParameters' },
            { $group: { _id: '$topParameters', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 8 }
        ]);

        res.status(200).json({
            summary: { totalUsers, totalStudents, totalTeachers, totalParents, totalQuizzes, totalResults, totalRecommendations, totalResources },
            monthlyGrowth,
            topCareers,
            topParameters
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// ─── NOTIFICATIONS ────────────────────────────────────────────────────────────
exports.getAdminNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find()
            .populate('recipient', 'name role')
            .sort({ createdAt: -1 })
            .limit(50);
        const unreadCount = await Notification.countDocuments({ isRead: false });
        res.status(200).json({ notifications, unreadCount });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.broadcastNotification = async (req, res) => {
    try {
        const { title, message, targetRole, type } = req.body;
        let filter = {};
        if (targetRole && targetRole !== 'all') filter.role = targetRole;
        const users = await User.find(filter).select('_id');
        const notifs = users.map(u => ({
            recipient: u._id,
            title,
            message,
            type: type || 'system',
            link: '/student/notifications'
        }));
        await Notification.insertMany(notifs);
        res.status(200).json({ message: `Broadcast sent to ${notifs.length} users` });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
