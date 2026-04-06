const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

async function listModels() {
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        // Note: The Node SDK does not have a native 'listModels' function yet.
        // We have to use a simple test call to see which model responds.
        
        const testModels = [
            "gemini-1.5-pro",
            "gemini-1.5-flash",
            "gemini-pro",
            "gemini-1.0-pro"
        ];
        
        console.log("-----------------------------------------");
        console.log("EDUDISHA AI MODEL CONNECTIVITY TEST");
        console.log("-----------------------------------------");

        for (const m of testModels) {
            try {
                const model = genAI.getGenerativeModel({ model: m });
                const result = await model.generateContent("Say 'Active'");
                const response = await result.response;
                console.log(`[PASS] ${m}: Model is alive and accessible.`);
            } catch (e) {
                console.log(`[FAIL] ${m}: ${e.message}`);
            }
        }
        console.log("-----------------------------------------");
    } catch (error) {
        console.error("Critical Failure:", error.message);
    }
}

listModels();
