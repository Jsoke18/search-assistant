// File: lib/openai.server.ts
import OpenAI from 'openai';

console.log('OPENAI_API_KEY:', process.env.OPENAI_API_KEY);

export default new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});