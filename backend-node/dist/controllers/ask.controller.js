"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleAsk = handleAsk;
const ragPipeline_1 = require("../services/ragPipeline");
async function handleAsk(req, res) {
    try {
        const { pdfId, question } = req.body;
        if (!pdfId || !question) {
            return res.status(400).json({ error: 'Missing pdfId or question' });
        }
        console.log("isit wkri");
        const result = await (0, ragPipeline_1.retrieveAnswer)(pdfId, question, { topK: 4 });
        return res.status(200).json(result);
    }
    catch (err) {
        console.error('AskController error:', err);
        return res.status(500).json({ error: err.message || 'Ask failed' });
    }
}
