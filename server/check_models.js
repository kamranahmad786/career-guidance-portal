const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function checkModels() {
  const modelIds = [
    "gemini-2.0-flash",
    "gemini-2.0-flash-lite-preview-09-2025",
    "gemini-1.5-flash",
    "gemini-1.5-flash-latest",
    "gemini-3.0-flash", // Long shot
    "gemini-2.5-flash"
  ];

  console.log("=== TESTING MODEL CONNECTIVITY ===");
  for (const id of modelIds) {
    try {
      const model = genAI.getGenerativeModel({ model: id });
      const result = await model.generateContent("test");
      console.log(`✅ SUCCESS: ${id} is active and working.`);
    } catch (error) {
      console.log(`❌ FAILED: ${id} - ${error.message.split('\n')[0]}`);
    }
  }
}

checkModels();
