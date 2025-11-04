import { openai } from "lib/openai/openai";
import { prompts } from "lib/openai/prompts";

export default async function antonymes(word: string) {
  return await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "user", content: prompts.antonymes(word) }
    ],
    temperature: 0,
    max_tokens: 1000,
    top_p: 1,
    frequency_penalty: 2,
    presence_penalty: 2,
  });
}
