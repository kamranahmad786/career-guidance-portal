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
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
    const prompt = `
      You are an AI career guidance expert designing a standardized quiz.
      Follow NEP 2020 guidelines for early career awareness.
      I need you to generate a 72-question quiz in total.
      There should be EXACTLY 6 multiple-choice questions for each of the following ${parameters.length} parameters:
      ${parameters.join(", ")}

      Return the response ONLY as a parseable JSON array of objects, strictly in this format:
      [
        {
          "parameter": "Singing",
          "questions": [
            {
              "question": "When listening to a song, do you...",
              "options": ["Analyze the vocals", "Enjoy the rhythm", "Ignore it", "Look for lyrics"],
              "relevantScore": [5, 3, 0, 2]
            }
          ]
        }
      ]
      DO NOT return markdown code blocks, just raw JSON.
    `;

    const result = await model.generateContent(prompt);
    const textOutput = result.response.text();
    
    // Clean potential markdown wrap if AI ignores the JSON-only instruction
    const cleanedOutput = textOutput.replace(/```json/g, '').replace(/```/g, '');
    return JSON.parse(cleanedOutput);

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
