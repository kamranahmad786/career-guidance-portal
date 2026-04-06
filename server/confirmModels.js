const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

async function checkProjectModels() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("❌ GEMINI_API_KEY is missing from .env");
    return;
  }

  console.log("🔍 Checking authorized models for your API key...");
  
  try {
    // We use a direct fetch to the listModels endpoint because it's the most reliable way to see what's allowed.
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    const data = await response.json();

    if (data.error) {
      console.error(`❌ API Error: ${data.error.message}`);
      return;
    }

    if (data.models && data.models.length > 0) {
      console.log("✅ Models found for your key:");
      data.models.forEach(m => {
        if (m.supportedGenerationMethods.includes("generateContent")) {
          console.log(`- ${m.name.replace('models/', '')} (${m.displayName})`);
        }
      });
    } else {
      console.log("⚠️ No models returned. This key might not have the 'Generative Language API' enabled.");
    }
  } catch (err) {
    console.error("❌ Network Error: ", err.message);
  }
}

checkProjectModels();
