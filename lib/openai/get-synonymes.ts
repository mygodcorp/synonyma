import { openai } from "lib/openai/openai";
import { prompts } from "lib/openai/prompts";

export default async function synonymes(word: string) {
  return await openai.createCompletion({
    model: "text-davinci-003",
    prompt: prompts.synonymes(word),
    temperature: 0,
    max_tokens: 1000,
    top_p: 1,
    frequency_penalty: 2,
    presence_penalty: 2,
  });
}
