"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateQuizFromPDF = generateQuizFromPDF;
exports.getQuizQuestions = getQuizQuestions;
const quiz_model_1 = __importDefault(require("../models/quiz.model"));
const openaiService_1 = require("./openaiService");
const vectorStore_1 = require("./vectorStore");
const mongoose_1 = require("mongoose");
/**
 * Safely extracts and parses JSON from AI response
 */
function parseQuizResponse(rawResponse) {
    try {
        let content = "";
        // Extract content from various response formats
        if (typeof rawResponse === "string") {
            content = rawResponse;
        }
        else if (rawResponse && rawResponse.answer) {
            content = rawResponse.answer;
        }
        else if (rawResponse && rawResponse.content) {
            content = rawResponse.content;
        }
        else {
            content = JSON.stringify(rawResponse);
        }
        // Remove markdown code blocks and extra whitespace
        content = content
            .replace(/```json\n?/g, "")
            .replace(/```\n?/g, "")
            .replace(/\\n/g, " ")
            .trim();
        // Parse JSON
        const parsed = JSON.parse(content);
        // Return questions array
        if (Array.isArray(parsed)) {
            return parsed;
        }
        if (parsed && parsed.questions && Array.isArray(parsed.questions)) {
            return parsed.questions;
        }
        throw new Error("No valid questions array found");
    }
    catch (error) {
        console.error("Parse error:", error.message);
        console.error("Raw response:", rawResponse);
        throw new Error("Failed to parse AI response");
    }
}
async function generateQuizFromPDF(pdfId, quizType, userId) {
    try {
        // Check for existing unattempted questions
        // const existing = await Quiz.find({
        //   pdf: pdfId,
        //   user: userId,
        //   type: quizType,
        //   attempted: false,
        // });
        // if (existing.length >= 5) {
        //   return { quizId: pdfId, questions: existing };
        // }
        // Fetch relevant context
        const embedding = await (0, openaiService_1.getEmbedding)(`Generate ${quizType} quiz questions`);
        const chunks = await (0, vectorStore_1.queryVectors)(pdfId, embedding, 6);
        if (!chunks || chunks.length === 0) {
            throw new Error("No content found for this PDF");
        }
        const context = chunks.map((c) => ({
            page: c.page,
            text: c.text.substring(0, 500)
        }));
        // Build prompt
        const systemPrompt = `You are a quiz generator. Return ONLY a valid JSON object with no markdown formatting.

Your response must be a JSON object with this exact structure:
{
  "questions": [
    {
      "question": "question text",
      "options": ["option1", "option2", "option3", "option4"],
      "correctAnswer": "correct option text",
      "explanation": "explanation text",
      "subject":"current test-subject (physics,maths,etc.)"
      "sourcePages": [1]
    }
  ]
}

Rules:
- Return pure JSON only, no code blocks
- Use double quotes for strings
- Escape special characters
- For MCQ: provide exactly 4 options
- correctAnswer must match one of the options exactly`;
        const userPrompt = `Generate 5 ${quizType} questions from this content:

${context.map((c, i) => `Page ${c.page}:\n${c.text}`).join("\n\n")}

Requirements:
- ${quizType === "MCQ" ? "Multiple choice with 4 options" : quizType === "SAQ" ? "Short answer questions" : "Long answer questions"}
- Include explanations
- Reference source pages
- Ensure variety in questions

Return the JSON object now.`;
        const messages = [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
        ];
        // Call OpenAI
        const rawResponse = await (0, openaiService_1.createChatCompletion)(messages, {
            temperature: 0.3,
            maxTokens: 2000,
        });
        console.log("Raw AI response received");
        // Parse response
        const questions = parseQuizResponse(rawResponse);
        if (!questions || questions.length === 0) {
            throw new Error("No questions generated");
        }
        console.log(`Parsed ${questions.length} questions successfully`);
        // Save to database
        const docs = [];
        for (const q of questions) {
            const doc = await quiz_model_1.default.create({
                pdf: pdfId,
                user: new mongoose_1.Types.ObjectId(userId),
                subject: q.subject,
                type: q.type || quizType,
                question: q.question,
                options: q.options || [],
                answer: q.correctAnswer || q.answer,
                explanation: q.explanation || "",
                attempted: false,
            });
            docs.push(doc);
        }
        return {
            quizId: pdfId,
            questions: docs,
        };
    }
    catch (error) {
        console.error("Quiz generation error:", error.message);
        throw new Error(`Quiz generation failed: ${error.message}`);
    }
}
/**
 * Get quiz questions for a PDF
 */
async function getQuizQuestions(pdfId, userId) {
    const questions = await quiz_model_1.default.find({
        pdf: pdfId,
        user: userId,
        attempted: false,
    }).sort({ createdAt: -1 });
    return questions;
}
