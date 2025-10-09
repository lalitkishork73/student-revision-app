"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEmbedding = getEmbedding;
exports.createChatSuggestions = createChatSuggestions;
exports.createChatCompletion = createChatCompletion;
const dotenv_1 = __importDefault(require("dotenv"));
const openai_1 = __importDefault(require("openai"));
dotenv_1.default.config();
const client = new openai_1.default({ apiKey: process.env.OPENAI_API_KEY });
async function getEmbedding(text) {
    if (!text || typeof text !== "string")
        throw new Error("Invalid text for embedding");
    const resp = await client.embeddings.create({
        model: "text-embedding-3-small",
        input: text,
    });
    return resp.data[0].embedding;
}
async function createChatSuggestions(messages, opts = {}) {
    const response = await client.chat.completions.create({
        model: opts.model || "gpt-4o-mini",
        messages,
        temperature: opts.temperature ?? 0.2,
        max_tokens: opts.maxTokens ?? 1024,
    });
    console.log(response, "response");
    console.log(response.choices?.[0]?.message, "response");
    const rawContent = response.choices?.[0]?.message?.content ?? "";
    // let suggestions: any[] = [];
    // try {
    //   const parsed = JSON.parse(rawContent);
    //   if (Array.isArray(parsed)) suggestions = parsed;
    // } catch (e:any) {
    //   throw new Error('Failed to parse suggestions from model response');
    // }
    // console.log(rawContent,"response")
    // return suggestions;
    const vectorId = rawContent.trim();
    return vectorId;
}
async function createChatCompletion(messages, opts = {}) {
    const response = await client.chat.completions.create({
        model: opts.model || "gpt-4o-mini",
        messages,
        temperature: opts.temperature ?? 0.2,
        max_tokens: opts.maxTokens ?? 1024,
    });
    const rawContent = response.choices?.[0]?.message?.content ?? "";
    try {
        // try JSON parse
        const parsed = JSON.parse(rawContent);
        return parsed;
    }
    catch {
        return { answer: String(rawContent) };
    }
}
