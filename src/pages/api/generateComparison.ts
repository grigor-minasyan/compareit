import { runFilteredReviewSearch } from "~/server/productApi";
import { OpenAIStream } from "../../utils/OpenAIStream";
import { runFilteredProductSearch } from "~/server/productApi";
import { createProductFromSearchDataAndReviews } from "~/utils/productUtils";
import { AMAZON_STORE_ID } from "~/constants";
import { generatePromptFromProducts } from "~/utils/promptUtils";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing env var from OpenAI");
}

export const config = { runtime: "edge" };

const handler = async (req: Request): Promise<Response> => {
  const { ids } = (await req.json()) as { ids?: string[] };
  if (!ids || !ids[0] || !ids[1]) {
    return new Response("No ids in the request", { status: 400 });
  }
  console.log(ids);
  // TODO use the input IDs
  const [prodId1, prodId2] = ["B07SQPZ8YP", "B0BWLHGVC9"];

  const prodSearchResult = await runFilteredProductSearch("test");

  const prod1 = prodSearchResult.find((p) => p.asin === prodId1);
  const prod2 = prodSearchResult.find((p) => p.asin === prodId2);
  if (!prod1 || !prod2) {
    return new Response("No products found", { status: 400 });
  }

  const [reviews1, reviews2] = await Promise.all([
    runFilteredReviewSearch(prodId1),
    runFilteredReviewSearch(prodId2),
  ]);

  const prod1Clean = createProductFromSearchDataAndReviews(
    prod1,
    reviews1,
    AMAZON_STORE_ID
  );
  const prod2Clean = createProductFromSearchDataAndReviews(
    prod2,
    reviews2,
    AMAZON_STORE_ID
  );

  const prompt = generatePromptFromProducts([prod1Clean, prod2Clean]);

  const [stream, stream2] = (
    await OpenAIStream({
      model: "gpt-3.5-turbo",
      // messages: [{ role: "user", content: "tell me a joke "}],
      messages: [{ role: "user", content: prompt }], // TODO put the actual prompt here
      temperature: 0.6,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      stream: true,
      n: 1,
      // max_tokens: 10, // TODO remove the max tokens
    })
  ).tee();
  // Create a new reader for the stream
  const reader = stream2.getReader();

  // Log data as it is being streamed
  (async () => {
    const decoder = new TextDecoder();
    let finalVal = "";
    while (true) {
      const { done, value } = await reader.read();
      const chunkValue = decoder.decode(value);
      // console.log(chunkValue);
      finalVal += chunkValue;
      if (done) {
        break;
      }
    }
    console.log(finalVal);
  })().catch((e) => console.error(e));

  return new Response(stream);
};

export default handler;
