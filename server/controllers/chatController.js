const { GoogleGenerativeAI } = require('@google/generative-ai');
const Recommendation = require('../models/Recommendation');

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

/**
 * Handle Career Guidance Chat using Gemini
 * POST /api/chat
 */
exports.handleChat = async (req, res) => {
    try {
        const { messages } = req.body;

        if (!messages || !Array.isArray(messages)) {
            return res.status(400).json({ error: "Invalid messages format" });
        }

        // 1. Fetch Student Recommendation for context (if available)
        let studentContext = "No career assessment data available yet.";
        if (req.user) {
            const recommendation = await Recommendation.findOne({ studentId: req.user._id }).sort({ createdAt: -1 });
            if (recommendation) {
                studentContext = `
                Student is interested in: ${recommendation.topParameters.join(", ")}.
                Suggested Careers: ${recommendation.careers.join(", ")}.
                Current Learning Roadmap: ${recommendation.roadmap}.
                `;
            }
        }

        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const systemPrompt = `
            You are EduDisha AI, a professional and friendly AI career mentor for students in India.
            
            STUDENT CONTEXT:
            ${studentContext}

            STRICT FORMATTING RULES:
            - Provide your response ONLY in clean text. 
            - DO NOT use Markdown symbols like ###, **, __, or lists with asterisks (*).
            - Use regular capital letters for headings and simple new lines for spacing.
            - Keep your tone professional, empathetic, and encouraging.
            - Map guidance to NEP 2020 principles (holistic, multi-disciplinary, 21st-century skills).
            - ALWAYS refer to the student's specific interest parameters if available.
            
            Current Conversation:
            ${messages.slice(-5).map(m => `${m.role === 'user' ? 'Student' : 'EduDisha AI'}: ${m.content}`).join("\n")}
            EduDisha AI:
        `;

        const result = await model.generateContent(systemPrompt);
        const responseText = result.response.text();

        res.status(200).json({ 
            role: 'assistant',
            content: responseText 
        });

    } catch (error) {
        console.error("Gemini Chat Error: ", error);
        res.status(500).json({ error: "Failed to process chat with AI" });
    }
};
