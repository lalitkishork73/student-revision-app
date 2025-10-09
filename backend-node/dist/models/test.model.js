"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const TestSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    subject: { type: String, required: true },
    type: { type: String, required: true },
    questions: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Question" }],
    answers: [{
            questionId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Question" },
            selectedOption: { type: String },
            correct: { type: Boolean },
            marks: { type: Number },
        }],
    total: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
});
exports.default = (0, mongoose_1.model)("Test", TestSchema);
