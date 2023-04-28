import { OpenAIStream } from "../../utils/OpenAIStream";
import { AmazonApiReviews } from "~/server/productApi";
import {
  createProductFromSearchDataAndReviews,
  limitReviewsCount,
  reviewsSortFromShortestToLongest,
  // shortenReviewIfNeeded,
} from "~/utils/productUtils";
import { UNKNOWN_IP } from "~/constants";
import { generatePromptFromProducts } from "~/utils/promptUtils";
import { CACHE_KEY, rateLimit, redisRestGet } from "~/server/redis";
import type { ProductSearchData } from "~/types";
import { ipAddress } from "@vercel/edge";
import { ZGenComparisonRequest } from "~/utils/zodValidations";
import {
  fetchProductWithReviewsFromDb,
  insertComparison,
  insertProductWithReviews,
} from "~/server/dbPlanetscale";
// import { testStreamArr } from "~/constants/streaming";

export const config = { runtime: "edge" };

const fetchProductWithReviews = async (asin: string) => {
  // try to get the clean products first from database
  const cleanProd = await fetchProductWithReviewsFromDb(asin);
  if (cleanProd) {
    console.info("Found clean product in db");
    return cleanProd;
  }

  const prod = await redisRestGet<ProductSearchData>(
    CACHE_KEY.AMZ_API_PRODUCT(asin)
  );

  if (!prod) {
    console.warn(
      `Product not found in cache when generating comparison, asin: ${asin}`
    );
    return null;
  }

  const [reviewsPg1, reviewsPg2] = await Promise.all([
    AmazonApiReviews(asin),
    AmazonApiReviews(asin, 2),
  ]);

  const reviews = [...reviewsPg1, ...reviewsPg2];
  // TODO calculate how much token is used for this and store it in the db for later analytics
  // TODO figure this out since it's very expensive
  // await Promise.all(reviews.map(shortenReviewIfNeeded));
  reviews.sort(reviewsSortFromShortestToLongest);
  const reviewsLimited = limitReviewsCount(reviews);

  const prodLocal = createProductFromSearchDataAndReviews(prod, reviewsLimited);

  return insertProductWithReviews(prodLocal);
};

export default async function handler(req: Request): Promise<Response> {
  try {
    // ------------------------------ Rate limit ------------------------------
    const ip = ipAddress(req) || UNKNOWN_IP;
    const { success } = await rateLimit.limit(ip);
    if (!success) {
      console.warn(`Rate limit exceeded for ${ip}`);
      return new Response("Too many comparisons, please slow down", {
        status: 429,
      });
    }

    // ------------------------------ Checking the request ------------------------------
    const reqJson = await ZGenComparisonRequest.safeParseAsync(
      await req.json()
    );
    if (!reqJson.success) {
      return new Response("Bad request", { status: 400 });
    }
    const { prodId1, prodId2 } = reqJson.data;

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
    const [prod1Clean, prod2Clean] = await Promise.all([
      fetchProductWithReviews(prodId1),
      fetchProductWithReviews(prodId2),
    ]);

    if (!prod1Clean || !prod2Clean) {
      return new Response("No products found", { status: 400 });
    }

    // ------------------------------ Generating the prompt ------------------------------
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
      await insertComparison(prod1Clean.id, prod2Clean.id, finalVal);
      console.log(
        "inserting the comparison result for products: ",
        prod1Clean.id,
        prod2Clean.id
      );
    })().catch(console.error);

    return new Response(stream);
  } catch (e) {
    console.error('Error in "generateComparison" handler', e);
    return new Response(
      "Something went wrong and we are actively investigating, please try again later",
      { status: 500 }
    );
  }
}
