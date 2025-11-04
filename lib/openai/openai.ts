import OpenAI from "openai";

let openaiInstance: OpenAI | null = null;

export const openai = {
  get client() {
    if (!openaiInstance) {
      openaiInstance = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });
    }
    return openaiInstance;
  },
  chat: {
    get completions() {
      return openai.client.chat.completions;
    },
  },
};
