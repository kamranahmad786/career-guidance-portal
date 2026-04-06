const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const Quiz = require('../models/Quiz');

const path = require('path');
dotenv.config({ path: path.join(__dirname, '../.env') });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const parameters = [
  "Coding / Programming",
  "Robotics & AI",
  "Design (UI/UX / Graphics)",
  "Arts & Creativity (Drawing, Painting)",
  "Music (Singing / Instruments)",
  "Dance & Performing Arts",
  "Sports & Physical Activities",
  "Business & Entrepreneurship",
  "Science & Research",
  "Communication & Public Speaking",
  "Social Work & Leadership (Politics / NGO)",
  "Media & Film Making"
];

const generateQuestionsForParameter = async (parameter) => {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  
  const prompt = `Generate 6 multiple-choice questions for an interest assessment in the field of "${parameter}". 
  Each question should help determine a student's interest level.
  Return the response in a strict JSON format (no backticks or extra text) as an array of objects:
  [
    {
      "question": "string",
      "options": ["string", "string", "string", "string"],
      "correctAnswer": "string",
      "parameter": "${parameter}"
    }
  ]
  The correctAnswer must be one of the strings in the options array.`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text().trim();
    
    // Clean potential markdown backticks
    if (text.startsWith('```json')) {
      text = text.replace(/```json|```/g, '');
    } else if (text.startsWith('```')) {
      text = text.replace(/```/g, '');
    }

    return JSON.parse(text);
  } catch (error) {
    console.error(`Error generating questions for ${parameter}:`, error);
    return [];
  }
};

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected for Seeding...");

    // Clear existing quizzes
    await Quiz.deleteMany({});
    console.log("Cleared old quiz data.");

    for (const param of parameters) {
      console.log(`Generating questions for: ${param}...`);
      const questions = await generateQuestionsForParameter(param);
      
      if (questions.length > 0) {
        const newQuiz = new Quiz({
          parameter: param,
          questions: questions
        });
        await newQuiz.save();
        console.log(`Successfully seeded: ${param}`);
      }
      
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    console.log("Full Quiz Seeding Complete!");
    process.exit();
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
};

seedDatabase();
