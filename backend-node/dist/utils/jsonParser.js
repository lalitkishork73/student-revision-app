"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseAIResponse = parseAIResponse;
const jsonrepair_1 = require("jsonrepair");
function parseAIResponse(input) {
    try {
        // If already object, return directly
        if (typeof input === "object")
            return input;
        if (typeof input === "string") {
            // Repair messy JSON
            const repaired = (0, jsonrepair_1.jsonrepair)(input);
            // Parse into valid JS object
            return JSON.parse(repaired);
        }
        return null;
    }
    catch (err) {
        console.error("Failed to parse AI JSON:", err);
        return null;
    }
}
