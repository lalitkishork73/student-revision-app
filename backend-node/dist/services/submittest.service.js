"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.submitTest = submitTest;
const test_model_1 = __importDefault(require("../models/test.model"));
const quiz_model_1 = __importDefault(require("../models/quiz.model"));
const MARKS = { MCQ: 3, SAQ: 1, LAQ: 5 };
async function submitTest(userId, subject, type, answers) {
    // fetch actual questions
    const questionIds = answers.map(a => a.questionId);
    const questions = await quiz_model_1.default.find({ _id: { $in: questionIds } });
    let total = 0;
    const answerData = answers.map((ans) => {
        const question = questions.find((q) => q._id.toString() === ans.questionId);
        if (!question)
            throw new Error("Question not found: " + ans.questionId);
        const correct = question.answer === ans.selectedOption;
        const marks = correct ? MARKS[question.type] : 0;
        total += marks;
        return { questionId: question._id, selectedOption: ans.selectedOption, correct, marks };
    });
    const test = await test_model_1.default.create({
        user: userId,
        subject,
        type,
        questions: questionIds,
        answers: answerData,
        total
    });
    return test;
}
