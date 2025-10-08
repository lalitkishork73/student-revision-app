import { getEmbedding, createChatCompletion } from "./openaiService";
import { queryVectors } from "./vectorStore";

export async function retrieveAnswer(
  pdfId: string,
  question: string,
  opts: { topK?: number } = {}
) {
  const topK = opts.topK || 4;
  const qVec = await getEmbedding(question);
  const chunks = await queryVectors(pdfId, qVec, topK);
  // console.log("Retrieved chunks:", chunks);
  if (!chunks || chunks.length === 0) {
    return {
      answer: "I couldn't find relevant information in the document.",
      citations: [],
    };
  }

  const contextArray = chunks.map((c) => ({ page: c.page, text: c.text }));
  const contextJSON = JSON.stringify(contextArray, null, 2);

  const system = `
You are an assistant that answers only from the given context.
Return JSON in the exact format below:
{
  "answer": "<clear and short answer>",
  "mentionedPages": [list of page numbers from context that directly support the answer]
}
- Only use page numbers exactly as they appear in the "page" field of the context JSON.
- Never guess or invent page numbers.
- If no page supports the answer, leave mentionedPages empty.
`;

  const userPrompt = `Context:\n${contextJSON}\n\nQuestion: ${question}`;

  const messages = [
    { role: "system", content: system },
    { role: "user", content: userPrompt },
  ];

  const parsed = await createChatCompletion(messages, {
    temperature: 0.0,
    maxTokens: 1500,
  });

  const answer =
    typeof parsed.answer === "string"
      ? parsed.answer
      : String(parsed.answer ?? "");
  const mentionedPages = Array.isArray(parsed.mentionedPages)
    ? parsed.mentionedPages
    : [];

  const citations = Array.from(new Set(mentionedPages)).filter((p) =>
    Number.isInteger(p)
  );
  const mentionedPage = citations.length ? citations[0] : null;

  // Provide short page snippet for frontend convenience (first chunk from the cited page)
  const citedSnippet = citations.length
    ? chunks.find((c) => c.page === citations[0])?.text
    : null;

  return { answer, citations, mentionedPage, snippet: citedSnippet };
}
