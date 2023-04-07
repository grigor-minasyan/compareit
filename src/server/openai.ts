import { backOff } from "exponential-backoff";
import { Configuration, OpenAIApi } from "openai";
import { env } from "~/env.mjs";

const configuration = new Configuration({
  apiKey: env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export const runPrompt = async (prompt: string) => {
  console.log("Starting prompt");
  const completion = await backOff(
    () =>
      openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
      }),
    {
      jitter: "full",
      retry(e, attemptNumber) {
        console.error(`Attempt #${attemptNumber} failed. Error:`, e);
        return true;
      },
    }
  );
  console.log("Successfully ran a prompt with usage of", completion.data.usage);
  if (!completion.data.choices[0]?.message?.content) {
    throw new Error("No completion found");
  }
  const result = completion.data.choices[0].message?.content;
  return result;
};
