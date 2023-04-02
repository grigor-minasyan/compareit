import { Configuration, OpenAIApi } from "openai";
import { env } from "~/env.mjs";

const configuration = new Configuration({
  apiKey: env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export const runPrompt = async (prompt: string) => {
  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
  });
  if (!completion.data.choices[0]) {
    throw new Error("No completion found");
  }
  const result = completion.data.choices[0].message?.content;
  return result;
};
