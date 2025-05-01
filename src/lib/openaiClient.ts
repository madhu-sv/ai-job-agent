// src/lib/openaiClient.ts
import { OpenAI } from 'openai';

/**
 * Returns a singleton OpenAI client instance, throwing a clear error
 * if the API key is missing.
 */
let client: OpenAI | null = null;
export function getOpenAIClient(): OpenAI {
  if (client) return client;
  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    throw new Error('Missing required env var OPENAI_API_KEY');
  }
  client = new OpenAI({ apiKey: key });
  return client;
}
export function getOpenAIClientNoThrow(): OpenAI | null {
  if (client) return client;
  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    return null;
  }
  client = new OpenAI({ apiKey: key });
    return client;
}
export function resetOpenAIClient() {
  client = null;
}
export function setOpenAIClient(clientInstance: OpenAI) {
  client = clientInstance;
}
export function getOpenAIClientInstance(): OpenAI {
  if (client) return client;
  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    throw new Error('Missing required env var OPENAI_API_KEY');
  }
  client = new OpenAI({ apiKey: key });
  return client;
}