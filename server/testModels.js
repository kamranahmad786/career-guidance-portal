const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

async function listModels() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  try {
    // Note: listModels is on the genAI instance in some versions or needs a different approach
    // In @google/generative-ai, we might need to use the REST API or check docs
    // Let's try the direct approach if available
    console.log("Checking API Key: ", process.env.GEMINI_API_KEY ? "Present" : "Missing");
    
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent("test");
    console.log("Success with gemini-1.5-flash");
  } catch (e) {
    console.error("Error with gemini-1.5-flash: ", e.message);
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent("test");
    console.log("Success with gemini-pro");
  } catch (e) {
    console.error("Error with gemini-pro: ", e.message);
  }
}

listModels();
