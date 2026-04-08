const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini Client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

/**
 * Helper to handle model generation with retries
 */
const generateWithModel = async (modelId, prompt, isJson = true) => {
    const config = isJson ? { generationConfig: { responseMimeType: "application/json" } } : {};
    const model = genAI.getGenerativeModel({ model: modelId, ...config });
    
    let lastError;
    // Simple 2-attempt retry for RPM limits
    for (let i = 0; i < 2; i++) {
        try {
            const result = await model.generateContent(prompt);
            const text = result.response.text();
            return isJson ? JSON.parse(text) : text;
        } catch (err) {
            lastError = err;
            if (err.message?.includes('429') || err.message?.includes('limit')) {
                console.log(`Rate limit hit (RPM). Retrying attempt ${i + 1}...`);
                await new Promise(resolve => setTimeout(resolve, 3000)); // Wait 3s
                continue;
            }
            throw err;
        }
    }
    throw lastError;
};

/**
 * Generate a dynamic quiz based on parameters (Gemini 3 Flash Edition)
 */
const generateQuiz = async (parameters) => {
  try {
    const prompt = `
      Generate a ${parameters.length * 5}-question multiple-choice quiz based on these career parameters: ${parameters.join(", ")}.
      For each parameter, provide EXACTLY 5 high-quality questions.
      
      Return ONLY a JSON array of objects with this structure:
      [
        {
          "question": "text",
          "options": ["a", "b", "c", "d"],
          "correctAnswer": "exact string from options",
          "parameter": "matching parameter from the list"
        }
      ]
    `;

    // Upgrade to Stable Flash Latest
    return await generateWithModel("gemini-1.5-flash-latest", prompt, true);

  } catch (error) {
    console.error("Gemini 3 API Error (generateQuiz): ", error);
    throw new Error('Failed to generate AI Quiz with Gemini 3 Flash');
  }
};

/**
 * Generate career recommendations (Gemini 3 Flash Edition)
 */
const generateRecommendations = async (topParameters, studentProfile) => {
    try {
        const prompt = `
            Student Profile: ${JSON.stringify(studentProfile)}
            Top Aptitude Areas: ${topParameters.join(", ")}
            
            Generate a detailed career roadmap mapping these traits to NEP 2020 pathways.
            Return ONLY a JSON object:
            {
                "careers": ["Career 1", "Career 2", "Career 3"],
                "roadmap": ["Step 1", "Step 2", "Step 3"],
                "courses": [{"title": "Name", "desc": "Description"}]
            }
        `;

        // Upgrade to Stable Flash Latest
        return await generateWithModel("gemini-1.5-flash-latest", prompt, true);

    } catch (error) {
        console.error("Gemini 3 API Error (generateRecommendations): ", error);
        throw new Error('Failed to generate Recommendations with Gemini 3 Flash');
    }
}

module.exports = {
  generateQuiz,
  generateRecommendations
};
