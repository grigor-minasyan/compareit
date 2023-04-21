import { OpenAIStream } from "../../utils/OpenAIStream";
import { AmazonApiReviews } from "~/server/productApi";
import {
  createProductFromSearchDataAndReviews,
  limitReviewsCount,
  reviewsSortFromShortestToLongest,
  shortenReviewIfNeeded,
} from "~/utils/productUtils";
import { AMAZON_STORE_ID, UNKNOWN_IP } from "~/constants";
import { generatePromptFromProducts } from "~/utils/promptUtils";
import { CACHE_KEY, rateLimit, redisRestGet } from "~/server/redis";
import type { ProductSearchData } from "~/types";
import { getClientIp, type Request as RequestForIp } from "request-ip";
// import { testStreamArr } from "~/constants/streaming";

export const config = { runtime: "edge" };

const handler = async (req: Request): Promise<Response> => {
  // // creating a readable stream response from test array
  // const streamTest = new ReadableStream({
  //   async start(controller) {
  //     const encoder = new TextEncoder();
  //     for (const str of testStreamArr) {
  //       const data = encoder.encode(str);
  //       controller.enqueue(data);
  //       await new Promise((resolve) => setTimeout(resolve, 15));
  //     }
  //     controller.close();
  //   },
  // });

  // // returning the stream response
  // return new Response(streamTest);
  const ip = getClientIp(req as unknown as RequestForIp) || UNKNOWN_IP;
  const { success } = await rateLimit.limit(ip);
  if (!success || 1) {
    console.error(`Rate limit exceeded for ${ip}`);
    return new Response("Too many comparisons, please slow down", {
      status: 429,
    });
  }

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
  // TODO figure this out since it's very expensive
  // await Promise.all([...reviews1, ...reviews2].map(shortenReviewIfNeeded));

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
    const chunksArr = [];
    while (true) {
      const { done, value } = await reader.read();
      const chunkValue = decoder.decode(value);
      finalVal += chunkValue;
      chunksArr.push(chunkValue);
      if (done) {
        break;
      }
    }
    // console.log(finalVal);
    // console.log(JSON.stringify(chunksArr));
  })().catch((e) => console.error(e));

  return new Response(stream);
};

export default handler;
