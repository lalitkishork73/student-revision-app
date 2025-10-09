"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateQuiz = generateQuiz;
exports.submitTestController = submitTestController;
const quizService_1 = require("../services/quizService");
const submittest_service_1 = require("../services/submittest.service");
async function generateQuiz(req, res) {
    try {
        const { pdfId, quizType } = req.body;
        if (!pdfId || !quizType)
            return res.status(400).json({ error: 'Missing pdfId or quizType' });
        const quiz = await (0, quizService_1.generateQuizFromPDF)(pdfId, quizType, '68e63fb51fd04e4d2d821bc8');
        return res.status(200).json({ quiz });
    }
    catch (err) {
        console.error('Quiz generation error:', err);
        return res.status(500).json({ error: err.message || 'Quiz generation failed' });
    }
}
async function submitTestController(req, res) {
    try {
        const userId = req.user.id;
        const { subject, type, answers } = req.body;
        // console.log(userId)
        if (!subject || !type || !answers || !Array.isArray(answers)) {
            return res.status(400).json({ error: "Invalid request body" });
        }
        // console.log(subject)
        const test = await (0, submittest_service_1.submitTest)(userId, subject, type, answers);
        // console.log(test)
        return res.status(201).json({ message: "Test submitted", test });
    }
    catch (err) {
        console.error("submitTestController error:", err);
        return res.status(500).json({ error: err.message });
    }
}
