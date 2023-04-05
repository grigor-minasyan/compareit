import { runFilteredReviewSearch } from "~/server/productApi";
import {
  OpenAIStream,
  type OpenAIStreamPayload,
} from "../../utils/OpenAIStream";
import { shortenProductDescIfNeeded } from "~/utils/productUtils";
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
  const [prodId1, prodId2] = ["16600916593715927928", "113030043680409970"];

  const prodSearchResult = await runFilteredProductSearch("test");

  const prod1 = prodSearchResult.find((p) => p.product_id === prodId1);
  const prod2 = prodSearchResult.find((p) => p.product_id === prodId2);
  if (!prod1 || !prod2) {
    return new Response("No products found", { status: 400 });
  }

  const [reviews1, reviews2] = await Promise.all([
    runFilteredReviewSearch(prodId1),
    runFilteredReviewSearch(prodId2),
  ]);
  await Promise.all([prod1, prod2].map(shortenProductDescIfNeeded));

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

  const payload: OpenAIStreamPayload = {
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: "tell me a joke " || prompt }], // TODO put the actual prompt here
    temperature: 0.6,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 2,
    stream: true,
    n: 1,
    max_tokens: 10, // TODO remove the max tokens
  };

  const [stream, stream2] = (await OpenAIStream(payload)).tee();
  // Create a new reader for the stream
  const reader = stream2.getReader();

  // Log data as it is being streamed
  (async () => {
    const decoder = new TextDecoder();
    let finalVal = "";
    while (true) {
      const { done, value } = await reader.read();
      const chunkValue = decoder.decode(value);
      console.log(chunkValue);
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
