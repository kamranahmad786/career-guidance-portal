const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini Client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

/**
 * Generate a dynamic quiz based on parameters
 * @param {Array<String>} parameters Array of up to 12 parameters/interests.
 * @returns {Object} JSON object containing generated questions per parameter
 */
const generateQuiz = async (parameters) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `
      You are an AI career guidance expert designing a standardized aptitude quiz.
      Follow NEP 2020 guidelines for early career awareness.
      I need you to generate a ${parameters.length * 6}-question quiz.
      Generate EXACTLY 6 multiple-choice questions for each of the following parameters:
      ${parameters.join(", ")}

      Return the response ONLY as a parseable JSON array of objects, strictly in this format:
      [
        {
          "question": "When you see a complex engine, do you want to...",
          "options": ["Take it apart", "Draw it", "Look at the manual", "Ignore it"],
          "correctAnswer": "Take it apart",
          "parameter": "Robotics"
        }
      ]
      - The "correctAnswer" MUST be exactly one of the values in the "options" array.
      - Each object must include the "parameter" it belongs to.
      - DO NOT return markdown code blocks, just raw JSON.
    `;

    const result = await model.generateContent(prompt);
    const textOutput = result.response.text();
    
    // Clean potential markdown wrap if AI ignores the JSON-only instruction
    const cleanedOutput = textOutput.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleanedOutput);
    
    // Support both wrapped and unwrapped formats
    if (Array.isArray(parsed)) return parsed;
    if (parsed.questions) return parsed.questions;
    
    return parsed;

  } catch (error) {
    console.error("Gemini API Error (generateQuiz): ", error);
    throw new Error('Failed to generate AI Quiz');
  }
};

/**
 * Generate career recommendations based on highest scoring parameters
 */
const generateRecommendations = async (topParameters, studentProfile) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
        const prompt = `
            Given a student with profile ${JSON.stringify(studentProfile)}, their top performing career aptitude parameters are: ${topParameters.join(", ")}.
            Generate a detailed career recommendation report mapped to NEP 2020.
            Include:
            1. Career Suggestions
            2. Learning Roadmap
            3. Suggested Courses and Webinars
            Return as JSON:
            {"careers": [], "roadmap": [], "courses": []}
        `;

        const result = await model.generateContent(prompt);
        const textOutput = result.response.text();
        const cleanedOutput = textOutput.replace(/```json/g, '').replace(/```/g, '');
        return JSON.parse(cleanedOutput);

    } catch (error) {
        console.error("Gemini API Error (generateRecommendations): ", error);
        throw new Error('Failed to generate Recommendations');
    }
}

module.exports = {
  generateQuiz,
  generateRecommendations
};
