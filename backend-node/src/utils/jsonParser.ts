import { jsonrepair } from "jsonrepair";

export function parseAIResponse(input: string | object) {
  try {
    // If already object, return directly
    if (typeof input === "object") return input;

    if (typeof input === "string") {
      // Repair messy JSON
      const repaired = jsonrepair(input);

      // Parse into valid JS object
      return JSON.parse(repaired);
    }

    return null;
  } catch (err) {
    console.error("Failed to parse AI JSON:", err);
    return null;
  }
}
