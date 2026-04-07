const ParentProfile = require('../models/ParentProfile');
const User = require('../models/User');
const Result = require('../models/Result');
const Recommendation = require('../models/Recommendation');
const StudentProfile = require('../models/StudentProfile');
const Notification = require('../models/Notification');

/**
 * Link a child (student) to a parent by email
 * POST /api/parent/link-child
 */
exports.linkChildByEmail = async (req, res) => {
    try {
        const { email } = req.body;
        
        // 1. Find the student by email
        const student = await User.findOne({ email, role: 'Student' });
        if (!student) {
            return res.status(404).json({ message: "Student account with this email not found." });
        }

        // 2. Update or Create Parent Profile
        let profile = await ParentProfile.findOne({ user: req.user._id });
        
        if (profile) {
            profile.childId = student._id;
            profile.childName = student.name;
            profile.childGrade = student.grade;
            await profile.save();
        } else {
            profile = await ParentProfile.create({
                user: req.user._id,
                childId: student._id,
                childName: student.name,
                childGrade: student.grade
            });
        }

        res.status(200).json({ 
            message: "Child successfully linked!",
            child: { name: student.name, grade: student.grade }
        });

    } catch (error) {
        console.error("Link Child Error:", error);
        res.status(500).json({ message: "Internal server error during linking." });
    }
};

/**
 * Fetch all data for the Parent Dashboard
 * GET /api/parent/dashboard
 */
exports.getParentDashboardData = async (req, res) => {
    try {
        const profile = await ParentProfile.findOne({ user: req.user._id }).populate('childId');
        
        if (!profile || !profile.childId) {
            return res.status(200).json({ 
                linked: false,
                message: "No child linked yet." 
            });
        }

        const studentId = profile.childId._id;

        // 1. Fetch detailed Student Profile
        const studentProfile = await StudentProfile.findOne({ user: studentId });

        // 2. Fetch Quiz History (Sorted by Date)
        const resultsHistory = await Result.find({ studentId }).sort({ createdAt: -1 });

        // 3. Fetch Career History
        const careerHistory = await Recommendation.find({ studentId }).sort({ createdAt: -1 });

        // 4. Fetch Parent Notifications
        const parentNotifications = await Notification.find({ recipient: req.user._id }).sort({ createdAt: -1 }).limit(20);

        res.status(200).json({
            linked: true,
            parentProfile: {
                notifyOnQuiz: profile.notifyOnQuiz,
                occupation: profile.occupation
            },
            childProfile: {
                _id: profile.childId._id,
                name: profile.childId.name,
                email: profile.childId.email,
                grade: profile.childId.grade,
                school: profile.childId.school,
                details: studentProfile ? {
                    bio: studentProfile.bio,
                    board: studentProfile.board,
                    interests: studentProfile.interests,
                    hobbies: studentProfile.hobbies,
                    skills: studentProfile.skills
                } : null
            },
            resultsHistory,
            careerHistory,
            notifications: parentNotifications
        });

    } catch (error) {
        console.error("Parent Dashboard Error:", error);
        res.status(500).json({ message: "Failed to fetch dashboard data." });
    }
};

/**
 * Toggle notification preferences
 * PATCH /api/parent/notifications
 */
exports.updateNotificationPrefs = async (req, res) => {
    try {
        const { notifyOnQuiz } = req.body;
        const profile = await ParentProfile.findOneAndUpdate(
            { user: req.user._id },
            { notifyOnQuiz },
            { new: true }
        );

        res.status(200).json({ 
            message: "Preferences updated!",
            notifyOnQuiz: profile.notifyOnQuiz 
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to update preferences." });
    }
};
