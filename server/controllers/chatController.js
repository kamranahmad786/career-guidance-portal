const { GoogleGenerativeAI } = require('@google/generative-ai');
const Recommendation = require('../models/Recommendation');
const pdf = require('pdf-parse');

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

/**
 * Handle Career Guidance Chat using Gemini
 * POST /api/chat
 */
exports.handleChat = async (req, res) => {
    try {
        // Multi-part form-data means messages might be stringified
        let { messages } = req.body;
        if (typeof messages === 'string') {
            messages = JSON.parse(messages);
        }

        if (!messages || !Array.isArray(messages)) {
            return res.status(400).json({ error: "Invalid messages format" });
        }

        // 1. Fetch Student Recommendation for context
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

        // 2. Handle File Attachment (PDF/Image)
        let fileContent = "";
        let imageData = null;

        if (req.file) {
            const mimeType = req.file.mimetype;
            
            if (mimeType === 'application/pdf') {
                try {
                    const data = await pdf(req.file.buffer);
                    fileContent = `[ATTACHED DOCUMENT CONTENT (PDF)]: \n${data.text}`;
                } catch (pdfErr) {
                    console.error("PDF Extraction Error:", pdfErr);
                    fileContent = "[ERROR READING PDF DOCUMENT]";
                }
            } else if (mimeType.startsWith('image/')) {
                imageData = {
                    inlineData: {
                        data: req.file.buffer.toString("base64"),
                        mimeType: mimeType
                    }
                };
                fileContent = "[ATTACHED IMAGE DOCUMENT: Analysis requested for career guidance]";
            }
        }

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" }); 

        const systemPrompt = `
            You are EduDisha AI, a professional and friendly AI career mentor for students in India.
            
            STUDENT CONTEXT:
            ${studentContext}

            ${fileContent ? `USER HAS UPLOADED A DOCUMENT FOR ANALYSIS:\n${fileContent}` : ""}

            STRICT FORMATTING RULES:
            - Provide your response ONLY in clean text. 
            - DO NOT use Markdown symbols like ###, **, __, or lists with asterisks (*).
            - Keep your tone professional, empathetic, and encouraging.
            - Map guidance to NEP 2020 principles.
            
            Current Conversation:
            ${messages.slice(-5).map(m => `${m.role === 'user' ? 'Student' : 'EduDisha AI'}: ${m.content}`).join("\n")}
            EduDisha AI:
        `;

        let result;
        if (imageData) {
            result = await model.generateContent([systemPrompt, imageData]);
        } else {
            result = await model.generateContent(systemPrompt);
        }
        
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
