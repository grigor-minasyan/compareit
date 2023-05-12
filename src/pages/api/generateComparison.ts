import { OpenAIStream } from "../../utils/OpenAIStream";
import { AmazonApiReviews, getCorrectCategory } from "~/server/productApi";
import {
  createProductFromSearchData,
  createSlugFromTitle,
  getStreamFromString,
  limitReviewsCount,
  reviewsSortFromShortestToLongest,
  shortenReviewIfNeeded,
} from "~/utils/productUtils";
import { UNKNOWN_IP } from "~/constants";
import { generatePromptFromProducts } from "~/utils/promptUtils";
import { CACHE_KEY, rateLimit, redisRestGet } from "~/server/redis";
import type {
  ProductLocal,
  ProductSearchData,
  ReviewSearchData,
} from "~/types";
import { ipAddress } from "@vercel/edge";
import { ZGenComparisonRequest } from "~/utils/zodValidations";
import {
  fetchComparisonFromDb,
  fetchProductWithReviewsFromDb,
  insertComparison,
  insertProductWithReviews,
  updateProductDetails,
} from "~/server/dbPlanetscale";
import { log } from "next-axiom";
import { serializeError } from "serialize-error";
import { checkFaultyComparison } from "~/utils/parseComparison";

export const config = { runtime: "edge" };

const createProductFromSearchDataAndReviews = async (
  product: ProductSearchData,
  reviews: ReviewSearchData[]
): Promise<ProductLocal> => {
  const category = await getCorrectCategory(product);

  return {
    asin: product.asin,
    title: product.product_title,
    price: product.product_price,
    originalPrice: product.product_original_price,
    starRating: product.product_star_rating,
    numRatings: product.product_num_ratings,
    url: product.product_url,
    photo: product.product_photo,
    slug: createSlugFromTitle(product.product_title),
    reviews: reviews.map((review) => ({ comment: review.review_comment })),
    categorySlug: category.slug,
  };
};

const updateProductFromCacheWithAsin = async (asin: string) => {
  const prod = await redisRestGet<ProductSearchData>(
    CACHE_KEY.AMZ_API_PRODUCT(asin)
  );
  if (!prod) return;
  const prodLocal = createProductFromSearchData(prod);
  await updateProductDetails(prodLocal);
};

const fetchProductWithReviews = async (asin: string) => {
  // try to get the clean products first from database
  const cleanProd = await fetchProductWithReviewsFromDb(asin);
  if (cleanProd) {
    // async updating the db with updated product details from cache
    updateProductFromCacheWithAsin(asin).catch((err: unknown) => {
      log.error("Error updating product from cache", serializeError(err));
    });
    log.info("Found clean product in db");
    return cleanProd;
  }

  const prod = await redisRestGet<ProductSearchData>(
    CACHE_KEY.AMZ_API_PRODUCT(asin)
  );

  if (!prod) {
    log.warn(
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
  await Promise.all(reviews.map(shortenReviewIfNeeded));
  reviews.sort(reviewsSortFromShortestToLongest);
  const reviewsLimited = limitReviewsCount(reviews);

  const prodLocal = await createProductFromSearchDataAndReviews(
    prod,
    reviewsLimited
  );

  // not awaiting for speed
  insertProductWithReviews(prodLocal).catch((err: unknown) => {
    log.error("Error inserting product with reviews", serializeError(err));
  });
  return prodLocal;
};

export default async function handler(req: Request): Promise<Response> {
  try {
    // ------------------------------ Rate limit ------------------------------
    const ip = ipAddress(req) || UNKNOWN_IP;
    const { success } = await rateLimit.limit(ip);
    if (!success) {
      log.warn(`Rate limit exceeded for ${ip}`);
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
    // ------------------------------ Fetching the products --------------before the comparison to update the prods
    const [prod1Clean, prod2Clean] = await Promise.all([
      fetchProductWithReviews(prodId1),
      fetchProductWithReviews(prodId2),
    ]);

    if (!prod1Clean || !prod2Clean) {
      return new Response("No products found", { status: 400 });
    }
    // ------------------------------ Checking existing comparisons ------------------------------
    const existingComparison = await fetchComparisonFromDb(prodId1, prodId2);
    if (existingComparison) {
      log.info(
        `Found existing comparison for products:, ${prodId1}, ${prodId2}`
      );
      return new Response(getStreamFromString(existingComparison));
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
      await insertComparison(prod1Clean, prod2Clean, finalVal);
      log.info(
        `inserting the comparison result for products:, ${prod1Clean.asin}, ${prod2Clean.asin}`
      );
      if (checkFaultyComparison(finalVal)) {
        log.error(
          `Faulty comparison found for products, please check ${prod1Clean.asin}, ${prod2Clean.asin}`
        );
      }
    })().catch((e: unknown) =>
      log.error("Error when saving the comparison", serializeError(e))
    );

    return new Response(stream);
  } catch (e) {
    log.error('Error in "generateComparison" handler', serializeError(e));
    return new Response(
      "Something went wrong and we are actively investigating, please try again later",
      { status: 500 }
    );
  }
}
