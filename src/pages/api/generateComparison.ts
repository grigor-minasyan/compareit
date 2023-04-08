import { OpenAIStream } from "../../utils/OpenAIStream";
import { AmazonApiReviews } from "~/server/productApi";
import {
  createProductFromSearchDataAndReviews,
  limitReviewsCount,
  reviewsSortFromShortestToLongest,
  shortenReviewIfNeeded,
} from "~/utils/productUtils";
import { AMAZON_STORE_ID } from "~/constants";
import { generatePromptFromProducts } from "~/utils/promptUtils";
import { CACHE_KEY, redisRestGet } from "~/server/redis";
import type { ProductSearchData } from "~/types";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing env var from OpenAI");
}

export const config = { runtime: "edge" };

const handler = async (req: Request): Promise<Response> => {
  const { ids } = (await req.json()) as unknown as { ids?: string[] };
  if (!ids || !ids[0] || !ids[1]) {
    return new Response("No ids in the request", { status: 400 });
  }
  const [prodId1, prodId2] = ids;

  const [prod1, prod2] = await Promise.all([
    redisRestGet<ProductSearchData>(CACHE_KEY.AMZ_API_PRODUCT(prodId1)),
    redisRestGet<ProductSearchData>(CACHE_KEY.AMZ_API_PRODUCT(prodId2)),
  ]);

  if (!prod1 || !prod2) {
    return new Response("No products found", { status: 400 });
  }

  const [reviews1pg1, reviews2pg1, reviews1pg2, reviews2pg2] =
    await Promise.all([
      AmazonApiReviews(prodId1),
      AmazonApiReviews(prodId2),
      AmazonApiReviews(prodId1, 2),
      AmazonApiReviews(prodId2, 2),
    ]);

  const reviews1 = [...reviews1pg1, ...reviews1pg2];
  const reviews2 = [...reviews2pg1, ...reviews2pg2];

  // TODO calculate how much token is used for this and store it in the db for later analytics
  await Promise.all([...reviews1, ...reviews2].map(shortenReviewIfNeeded));

  // sort finalRes by review_text length, from shortest to longest
  reviews1.sort(reviewsSortFromShortestToLongest);
  reviews2.sort(reviewsSortFromShortestToLongest);

  const reviews1Limited = limitReviewsCount(reviews1);
  const reviews2Limited = limitReviewsCount(reviews2);

  const prod1Clean = createProductFromSearchDataAndReviews(
    prod1,
    reviews1Limited,
    AMAZON_STORE_ID
  );
  const prod2Clean = createProductFromSearchDataAndReviews(
    prod2,
    reviews2Limited,
    AMAZON_STORE_ID
  );

  const prompt = generatePromptFromProducts([prod1Clean, prod2Clean]);

  const [stream, stream2] = (await OpenAIStream(prompt)).tee();
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
