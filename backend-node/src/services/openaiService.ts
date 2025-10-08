import dotenv from 'dotenv';
import OpenAI from 'openai';
dotenv.config();

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function getEmbedding(text: string) {
  if (!text || typeof text !== 'string') throw new Error('Invalid text for embedding');
  const resp = await client.embeddings.create({
    model: 'text-embedding-3-small',
    input: text
  });
  return resp.data[0].embedding;
}

export async function createChatSuggestions(messages: any[], opts: { temperature?: number; maxTokens?: number; model?: string } = {}) {
  const response = await client.chat.completions.create({
    model: opts.model || 'gpt-4o-mini',
    messages,
    temperature: opts.temperature ?? 0.2,
    max_tokens: opts.maxTokens ?? 1024
  });

  const rawContent = response.choices?.[0]?.message?.content ?? '';
  let suggestions: any[] = [];
  try {
    const parsed = JSON.parse(rawContent);
    if (Array.isArray(parsed)) suggestions = parsed;
  } catch (e) {
    throw new Error('Failed to parse suggestions from model response');
  }

  return suggestions;
}

export async function createChatCompletion(messages: any[], opts: { temperature?: number; maxTokens?: number; model?: string } = {}) {
  const response = await client.chat.completions.create({
    model: opts.model || 'gpt-4o-mini',
    messages,
    temperature: opts.temperature ?? 0.2,
    max_tokens: opts.maxTokens ?? 1024
  });

  const rawContent = response.choices?.[0]?.message?.content ?? '';

  try {
    // try JSON parse
    const parsed = JSON.parse(rawContent);
    return parsed;
  } catch {
    return { answer: String(rawContent) };
  }
}
