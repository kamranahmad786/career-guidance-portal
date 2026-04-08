const Quiz = require('../models/Quiz');
const Result = require('../models/Result');
const Notification = require('../models/Notification');
const ParentProfile = require('../models/ParentProfile');
const TeacherProfile = require('../models/TeacherProfile');
const User = require('../models/User');
const { calculateParameterScores, analyzeInterests } = require('../services/scoringService');

// @desc    Submit a quiz and get interest analysis
// @route   POST /api/quiz/submit
// @access  Private (Student)
exports.submitQuiz = async (req, res) => {
  const { answers } = req.body; // Array of { questionId, selectedAnswer, isCorrect, parameter }

  if (!answers || answers.length === 0) {
    return res.status(400).json({ message: 'No answers provided' });
  }

  try {
    // 1. Calculate percentage-wise parameter scores
    const parameterScores = calculateParameterScores(answers);
    
    // 2. Identify top 3 parameters and classify interest levels
    const { topParameters } = analyzeInterests(parameterScores);

    // 3. Save the result to the QuizResult/Result model
    const result = await Result.create({
      studentId: req.user._id,
      answers,
      parameterScores, 
      topParameters
    });

    // 4. Create Notification for the student
    await Notification.create({
      recipient: req.user._id,
      type: 'quiz_complete',
      title: 'Journey Assessment Complete!',
      message: `You've successfully mapped ${topParameters.length} core parameters. Your career strategy is now synchronized.`,
      link: '/student/results'
    });

    // 5. ALERT PARENT: Create Notification for the linked guardian
    try {
      const parentProfile = await ParentProfile.findOne({ childId: req.user._id });
      if (parentProfile && parentProfile.notifyOnQuiz) {
        await Notification.create({
          recipient: parentProfile.user,
          type: 'quiz_complete',
          title: `${req.user.name.split(' ')[0]} Finished an Assessment!`,
          message: `${req.user.name} has completed the latest career aptitude quiz with strong results in ${topParameters.slice(0, 2).join(' & ')}.`,
          link: `/parent/result/${result._id}`
        });
      }
    } catch (parentErr) {
      console.error("Failed to notify parent:", parentErr);
    }

    // 6. ALERT TEACHER: Create Notification for school educators
    try {
      if (req.user.school) {
        const teachers = await User.find({ school: req.user.school, role: 'Teacher' });
        const teacherNotifications = teachers.map(t => ({
          recipient: t._id,
          type: 'achievement',
          title: 'Student Assessment Complete',
          message: `${req.user.name} from your school has completed a career assessment. Results are ready for review.`,
          link: `/teacher/students`
        }));
        if (teacherNotifications.length > 0) {
          await Notification.insertMany(teacherNotifications);
        }
      }
    } catch (teacherErr) {
      console.error("Failed to notify teacher:", teacherErr);
    }

    res.status(201).json({
        message: 'Quiz submitted successfully',
        parameterScores,
        topParameters,
        resultId: result._id
    });

  } catch (error) {
    console.error("Quiz submission error:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    TEMPORARY: Seed Mock Questions (Bypass DNS issues)
// @route   GET /api/quiz/seed-mock
// @access  Public (Temporary)
exports.seedMockQuestions = async (req, res) => {
    try {
        const mockData = [
            {
                parameter: "Coding / Programming",
                questions: [
                    { question: "If you found a bug in a game you were playing, what would you most likely do?", options: ["Try to figure out why it happened", "Ignore it and keep playing", "Report it to the developer", "Restart the game"], correctAnswer: "Try to figure out why it happened", parameter: "Coding / Programming" },
                    { question: "Which of these best describes your reaction to a complicated logic puzzle?", options: ["Excitement to solve it", "Confusion", "Boredom", "Mild interest"], correctAnswer: "Excitement to solve it", parameter: "Coding / Programming" },
                    { question: "Have you ever tried to automate a repetitive task on a computer?", options: ["Yes, multiple times", "No, never", "Once, but it was hard", "I don't know how"], correctAnswer: "Yes, multiple times", parameter: "Coding / Programming" },
                    { question: "Do you enjoy the process of breaking down a large problem into smaller steps?", options: ["Yes, it feels natural", "No, I prefer the big picture", "Sometimes", "It's too tedious"], correctAnswer: "Yes, it feels natural", parameter: "Coding / Programming" },
                    { question: "How do you feel about learning a new language that is logical rather than conversational?", options: ["Very interested", "Not interested", "A bit intimidated", "Willing to try"], correctAnswer: "Very interested", parameter: "Coding / Programming" },
                    { question: "When you use an app, do you often wonder how its features are built?", options: ["Constantyly", "Never", "Sometimes", "Only when it breaks"], correctAnswer: "Constantyly", parameter: "Coding / Programming" }
                ]
            },
            {
                parameter: "Robotics & AI",
                questions: [
                    { question: "Which part of a robot interests you most?", options: ["The brain (programming)", "The body (mechanics)", "The sensors (perception)", "The design (aesthetics)"], correctAnswer: "The brain (programming)", parameter: "Robotics & AI" },
                    { question: "How do you feel about machines that can perform human-like tasks?", options: ["Fascinated", "Scared", "Neutral", "Uninterested"], correctAnswer: "Fascinated", parameter: "Robotics & AI" },
                    { question: "Would you enjoy assembling a kit to build your own remote-controlled car?", options: ["Absolutely", "No", "Maybe with help", "I'd rather just drive it"], correctAnswer: "Absolutely", parameter: "Robotics & AI" },
                    { question: "Do you think about how self-driving cars 'see' the world?", options: ["Often", "Never", "Sometimes", "It doesn't matter to me"], correctAnswer: "Often", parameter: "Robotics & AI" },
                    { question: "If you could have any AI assistant, what would it primarily do for you?", options: ["Solve complex math", "Clean my room", "Write my stories", "Organize my schedule"], correctAnswer: "Solve complex math", parameter: "Robotics & AI" },
                    { question: "Are you interested in how circuits and electronics work together?", options: ["Extremely", "Not at all", "A little", "Only if it involves computers"], correctAnswer: "Extremely", parameter: "Robotics & AI" }
                ]
            },
            {
                parameter: "Design (UI/UX / Graphics)",
                questions: [
                    { question: "When you visit a website, what's the first thing you notice?", options: ["The colors and layout", "The text content", "How fast it loads", "The advertisements"], correctAnswer: "The colors and layout", parameter: "Design (UI/UX / Graphics)" },
                    { question: "Do you enjoy picking out color schemes for a project or room?", options: ["Yes, very much", "No, I'm bad at it", "It's okay", "I prefer black and white"], correctAnswer: "Yes, very much", parameter: "Design (UI/UX / Graphics)" },
                    { question: "If an app is hard to use but looks beautiful, what is your reaction?", options: ["I want to fix the layout", "I delete it immediately", "I don't care about looks", "I just deal with it"], correctAnswer: "I want to fix the layout", parameter: "Design (UI/UX / Graphics)" },
                    { question: "Do you find yourself sketching or doodling shapes during free time?", options: ["Frequently", "Never", "Rarely", "Only when bored"], correctAnswer: "Frequently", parameter: "Design (UI/UX / Graphics)" },
                    { question: "How important is 'user experience' to you in a product?", options: ["Very important", "Not at all", "Somewhat", "I don't know what that is"], correctAnswer: "Very important", parameter: "Design (UI/UX / Graphics)" },
                    { question: "Would you rather create a logo or write a technical manual?", options: ["Create a logo", "Write the manual", "Neither", "Both"], correctAnswer: "Create a logo", parameter: "Design (UI/UX / Graphics)" }
                ]
            },
			{
                parameter: "Arts & Creativity (Drawing, Painting)",
                questions: [
                    { question: "How do you prefer to express your emotions?", options: ["Through visual art", "Through talking", "Through writing", "I keep them inside"], correctAnswer: "Through visual art", parameter: "Arts & Creativity (Drawing, Painting)" },
                    { question: "Do you enjoy visiting art galleries or looking at painting collections?", options: ["Yes, it's inspiring", "No, it's boring", "Occasionally", "Only for social reasons"], correctAnswer: "Yes, it's inspiring", parameter: "Arts & Creativity (Drawing, Painting)" },
                    { question: "When you see a blank canvas, what do you feel?", options: ["A desire to fill it", "Anxiety", "Nothing", "A need to move away"], correctAnswer: "A desire to fill it", parameter: "Arts & Creativity (Drawing, Painting)" },
                    { question: "Are you interested in traditional art techniques like oil or watercolor?", options: ["Very interested", "Not at all", "Somewhat", "Only modern art"], correctAnswer: "Very interested", parameter: "Arts & Creativity (Drawing, Painting)" },
                    { question: "Do you notice the textures and details in the environment around you?", options: ["Always", "Rarely", "Never", "Only if pointed out"], correctAnswer: "Always", parameter: "Arts & Creativity (Drawing, Painting)" },
                    { question: "Would you rather spend an afternoon painting or playing a video game?", options: ["Painting", "Video game", "Both", "Neither"], correctAnswer: "Painting", parameter: "Arts & Creativity (Drawing, Painting)" }
                ]
            },
            {
                parameter: "Music (Singing / Instruments)",
                questions: [
                    { question: "Can you easily pick up the rhythm of a song?", options: ["Yes, naturally", "No, I'm tone deaf", "Sometimes", "With practice"], correctAnswer: "Yes, naturally", parameter: "Music (Singing / Instruments)" },
                    { question: "Do you ever find yourself creating melodies in your head?", options: ["Often", "Never", "Rarely", "Only when listening to music"], correctAnswer: "Often", parameter: "Music (Singing / Instruments)" },
                    { question: "How do you feel when you perform in front of others (or imagine doing so)?", options: ["Excited/Nervous but happy", "Terrified", "Uninterested", "Confident"], correctAnswer: "Excited/Nervous but happy", parameter: "Music (Singing / Instruments)" },
                    { question: "Are you interested in how musical instruments are constructed?", options: ["Very much", "Not really", "A little", "Only the sound matters"], correctAnswer: "Very much", parameter: "Music (Singing / Instruments)" },
                    { question: "Do you enjoy analyzing the lyrics or the composition of a song?", options: ["Both", "Neither", "Just lyrics", "Just composition"], correctAnswer: "Both", parameter: "Music (Singing / Instruments)" },
                    { question: "Would you enjoy learning a new instrument like the piano or guitar?", options: ["Yes, absolutely", "No thanks", "Maybe", "I'd rather sing"], correctAnswer: "Yes, absolutely", parameter: "Music (Singing / Instruments)" }
                ]
            },
            {
                parameter: "Dance & Performing Arts",
                questions: [
                    { question: "When you hear music, does your body naturally want to move?", options: ["Yes, always", "No, never", "Sometimes", "Only if nobody is watching"], correctAnswer: "Yes, always", parameter: "Dance & Performing Arts" },
                    { question: "Do you enjoy learning choreographed movements?", options: ["Yes, it's fun", "No, it's too hard", "I prefer freestyle", "I'm indifferent"], correctAnswer: "Yes, it's fun", parameter: "Dance & Performing Arts" },
                    { question: "How do you feel about expressing a story through body language?", options: ["It's very powerful", "It's confusing", "I'd rather use words", "I haven't thought about it"], correctAnswer: "It's very powerful", parameter: "Dance & Performing Arts" },
                    { question: "Are you interested in theater and stage performance?", options: ["Very much", "Not at all", "Somewhat", "Only as an audience"], correctAnswer: "Very much", parameter: "Dance & Performing Arts" },
                    { question: "Do you appreciate the discipline required for professional dance?", options: ["Yes, it's impressive", "No, it seems excessive", "I don't understand it", "I find it boring"], correctAnswer: "Yes, it's impressive", parameter: "Dance & Performing Arts" },
                    { question: "Would you rather attend a ballet or a rock concert?", options: ["Ballet", "Rock concert", "Both", "Neither"], correctAnswer: "Ballet", parameter: "Dance & Performing Arts" }
                ]
            },
            {
                parameter: "Sports & Physical Activities",
                questions: [
                    { question: "Do you enjoy being part of a team to achieve a physical goal?", options: ["Yes, definitely", "No, I'm a solo person", "Sometimes", "I'm indifferent"], correctAnswer: "Yes, definitely", parameter: "Sports & Physical Activities" },
                    { question: "How often do you feel the need to be physically active?", options: ["Daily", "Rarely", "Never", "Weekly"], correctAnswer: "Daily", parameter: "Sports & Physical Activities" },
                    { question: "Do you enjoy the feeling of competition in sports?", options: ["Yes, it motivates me", "No, it stresses me out", "I prefer casual play", "I avoid competition"], correctAnswer: "Yes, it motivates me", parameter: "Sports & Physical Activities" },
                    { question: "Are you interested in the science behind physical training and health?", options: ["Very interested", "Not at all", "Somewhat", "Only the exercise part"], correctAnswer: "Very interested", parameter: "Sports & Physical Activities" },
                    { question: "How do you feel after a long period of physical exertion?", options: ["Energized and satisfied", "Exhausted and annoyed", "Tired but happy", "Bored"], correctAnswer: "Energized and satisfied", parameter: "Sports & Physical Activities" },
                    { question: "Would you rather coach a team or play in the game?", options: ["Play", "Coach", "Both", "Neither"], correctAnswer: "Play", parameter: "Sports & Physical Activities" }
                ]
            },
            {
                parameter: "Business & Entrepreneurship",
                questions: [
                    { question: "Do you enjoy finding ways to sell products or services?", options: ["Yes, it's a challenge", "No, it's uncomfortable", "I prefer buying", "I'm indifferent"], correctAnswer: "Yes, it's a challenge", parameter: "Business & Entrepreneurship" },
                    { question: "Are you interested in how companies grow and make money?", options: ["Extremely", "Not at all", "Somewhat", "Only if I get paid"], correctAnswer: "Extremely", parameter: "Business & Entrepreneurship" },
                    { question: "Do you ever think about starting your own business?", options: ["Regularly", "Never", "I have some ideas", "It sounds too risky"], correctAnswer: "Regularly", parameter: "Business & Entrepreneurship" },
                    { question: "How well do you manage your own finances or a budget?", options: ["Very well", "Poorly", "Okay", "I don't have one"], correctAnswer: "Very well", parameter: "Business & Entrepreneurship" },
                    { question: "Do you enjoy coming up with solutions to people's daily problems?", options: ["Yes, if it saves them time", "No, not really", "Only if it helps me", "I prefer existing solutions"], correctAnswer: "Yes, if it saves them time", parameter: "Business & Entrepreneurship" },
                    { question: "Would you rather work for a big corporation or a small startup?", options: ["Small startup", "Big corporation", "Neither", "I don't know"], correctAnswer: "Small startup", parameter: "Business & Entrepreneurship" }
                ]
            },
            {
                parameter: "Science & Research",
                questions: [
                    { question: "Do you often ask 'why' something works the way it does in nature?", options: ["Constantly", "Never", "Rarely", "Only when taught"], correctAnswer: "Constantly", parameter: "Science & Research" },
                    { question: "Are you interested in conducting experiments to test a hypothesis?", options: ["Very much", "Not at all", "Somewhat", "Only if result is cool"], correctAnswer: "Very much", parameter: "Science & Research" },
                    { question: "How do you feel about analyzing complex data to find a pattern?", options: ["It's rewarding", "It's tedious", "It's confusing", "I'm indifferent"], correctAnswer: "It's rewarding", parameter: "Science & Research" },
                    { question: "Do you enjoy reading about new scientific discoveries?", options: ["Yes, always", "No, never", "Occasionally", "Only if popular"], correctAnswer: "Yes, always", parameter: "Science & Research" },
                    { question: "Would you rather spend a day in a lab or in a library?", options: ["Lab", "Library", "Both", "Neither"], correctAnswer: "Lab", parameter: "Science & Research" },
                    { question: "How important is evidence to you when making a decision?", options: ["Critical", "Not very", "Somewhat", "Experience matters more"], correctAnswer: "Critical", parameter: "Science & Research" }
                ]
            },
            {
                parameter: "Communication & Public Speaking",
                questions: [
                    { question: "How do you feel about speaking in front of a large group of people?", options: ["Confident and ready", "Anxious but willing", "Terrified", "I'd rather avoid it"], correctAnswer: "Confident and ready", parameter: "Communication & Public Speaking" },
                    { question: "Do you enjoy persuading others to see your point of view?", options: ["Yes, it's a skill I like", "No, I avoid conflict", "Only with friends", "I prefer to listen"], correctAnswer: "Yes, it's a skill I like", parameter: "Communication & Public Speaking" },
                    { question: "Are you interested in how different cultures communicate?", options: ["Very much", "Not really", "A little", "Language is just a tool"], correctAnswer: "Very much", parameter: "Communication & Public Speaking" },
                    { question: "How well can you explain a complex idea to someone else?", options: ["Very clearly", "Poorly", "Okay", "I find it hard"], correctAnswer: "Very clearly", parameter: "Communication & Public Speaking" },
                    { question: "Do you enjoy writing articles, speeches, or stories?", options: ["Yes, I love writing", "No, it's too much work", "I prefer talking", "I'm indifferent"], correctAnswer: "Yes, I love writing", parameter: "Communication & Public Speaking" },
                    { question: "Would you rather be the moderator of a debate or a participant?", options: ["Moderator", "Participant", "Neither", "Audience"], correctAnswer: "Moderator", parameter: "Communication & Public Speaking" }
                ]
            },
            {
                parameter: "Social Work & Leadership (Politics / NGO)",
                questions: [
                    { question: "How motivated are you to solve social issues in your community?", options: ["Highly motivated", "Not at all", "Somewhat", "I focus on myself"], correctAnswer: "Highly motivated", parameter: "Social Work & Leadership (Politics / NGO)" },
                    { question: "Do you enjoy organizing events or leading a group of people?", options: ["Yes, I'm natural leader", "No, I'm a follower", "Only if it's fun", "It's too stressful"], correctAnswer: "Yes, I'm natural leader", parameter: "Social Work & Leadership (Politics / NGO)" },
                    { question: "How important is empathy in your daily interactions?", options: ["Essential", "Secondary", "I don't think about it", "It's personal"], correctAnswer: "Essential", parameter: "Social Work & Leadership (Politics / NGO)" },
                    { question: "Are you interested in policy making and how governments work?", options: ["Very interested", "Boring", "Somewhat", "Only when it affects me"], correctAnswer: "Very interested", parameter: "Social Work & Leadership (Politics / NGO)" },
                    { question: "Would you rather work for an NGO or a private corporation?", options: ["NGO", "Private corporation", "Neither", "I don't care"], correctAnswer: "NGO", parameter: "Social Work & Leadership (Politics / NGO)" },
                    { question: "Do you feel responsible for the well-being of those around you?", options: ["Always", "Never", "Sometimes", "Only family"], correctAnswer: "Always", parameter: "Social Work & Leadership (Politics / NGO)" }
                ]
            },
            {
                parameter: "Media & Film Making",
                questions: [
                    { question: "Are you interested in how movies tell stories through visuals and sound?", options: ["Yes, deeply", "No, I just watch", "Some movies", "Only the story matters"], correctAnswer: "Yes, deeply", parameter: "Media & Film Making" },
                    { question: "Do you enjoy creating or editing video content for social media?", options: ["Yes, it's a hobby", "No, I don't know how", "I find it boring", "Only for fun"], correctAnswer: "Yes, it's a hobby", parameter: "Media & Film Making" },
                    { question: "How much attention do you pay to the lighting and camera angles in a film?", options: ["A lot", "None", "Some", "Only if it's bad"], correctAnswer: "A lot", parameter: "Media & Film Making" },
                    { question: "Would you rather be behind the camera or in front of it?", options: ["Behind the camera", "In front of it", "Neither", "Both"], correctAnswer: "Behind the camera", parameter: "Media & Film Making" },
                    { question: "Are you interested in journalism and reporting the news?", options: ["Very much", "Not at all", "Somewhat", "Only the gossip"], correctAnswer: "Very much", parameter: "Media & Film Making" },
                    { question: "How important is 'media literacy' in your opinion?", options: ["Very important", "Not at all", "Somewhat", "I don't know what it is"], correctAnswer: "Very important", parameter: "Media & Film Making" }
                ]
            }
        ];

        await Quiz.deleteMany({});
        for (const data of mockData) {
            await Quiz.create(data);
        }

        res.json({ message: "Quiz Seeding Successful! 72 Questions Added." });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

// @desc    Get All Quizzes
// @route   GET /api/quiz/all
// @access  Private
exports.getAllQuizzes = async (req, res) => {
    try {
      const quizzes = await Quiz.find().sort({ createdAt: -1 });
      res.json(quizzes);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
};

// @desc    Get Detailed Quiz Result
// @route   GET /api/quiz/result/:studentId
// @access  Private
exports.getQuizResult = async (req, res) => {
  try {
    const result = await Result.findOne({ studentId: req.params.studentId }).sort({ createdAt: -1 });
    if (!result) {
      return res.status(404).json({ message: 'No quiz result found for this student' });
    }
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get My Results
// @route   GET /api/quiz/results/my
// @access  Private (Student)
exports.getMyResults = async (req, res) => {
  try {
    const results = await Result.find({ studentId: req.user._id }).sort({ createdAt: -1 });
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get Specific Quiz Result by ID
// @route   GET /api/quiz/report/:id
// @access  Private
exports.getQuizResultById = async (req, res) => {
  try {
    const result = await Result.findById(req.params.id);
    if (!result) {
      return res.status(404).json({ message: 'Result not found' });
    }
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
