import { MIN_REVIEW_LENGTH_TO_SHORTEN, TOKEN_LIMITS } from "~/constants";
import type {
  ProductLocal,
  ProductSearchData,
  ReviewSearchData,
} from "~/types";
import {
  calculateStringTokens,
  generatePromptForComparisonSlug,
  generatePromptToShortenReview,
} from "./promptUtils";
import { OpenAIDirect } from "./OpenAIStream";
import { log } from "next-axiom";
import { v4 as uuidV4 } from "uuid";

export const createProductFromSearchData = (
  product: ProductSearchData
): Omit<ProductLocal, "reviews" | "categorySlug"> => {
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
  };
};

export const createSlugFromTitle = (title: string) => {
  return title
    .toLowerCase()
    .replace(/-/g, " ")
    .replace(/[^a-zA-Z0-9]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/[^a-z0-9]/g, "-");
};

export const shortenReviewIfNeeded = async (review: ReviewSearchData) => {
  if (review.review_comment.length > MIN_REVIEW_LENGTH_TO_SHORTEN) {
    review.review_comment = await OpenAIDirect(
      generatePromptToShortenReview(review.review_comment)
    );
  }
};

export const createComparisonSlugFromProducts = async (
  prod1: ProductLocal,
  prod2: ProductLocal
) => {
  const prompt = generatePromptForComparisonSlug(prod1, prod2);
  const slug = await OpenAIDirect(prompt);
  const cleanSlug = createSlugFromTitle(slug) + "-" + uuidV4().slice(-7);
  return cleanSlug;
};

export const limitReviewsCount = (reviews: ReviewSearchData[]) => {
  let totalTokens = 0;
  const limitedReviews = reviews.reduce((acc: ReviewSearchData[], review) => {
    const tokens = calculateStringTokens(review.review_comment);
    if (totalTokens + tokens <= TOKEN_LIMITS.REVIEWS_TOTAL) {
      acc.push(review);
      totalTokens += tokens;
    }
    return acc;
  }, []);
  log.info(
    `Limited the number of reviews from ${reviews.length} to ${limitedReviews.length}`
  );

  return limitedReviews;
};

export const reviewsSortFromShortestToLongest = (
  a: ReviewSearchData,
  b: ReviewSearchData
) => a.review_comment.length - b.review_comment.length;

export const truncateProductTitle = (title: string) => {
  return title.length > 30 ? title.slice(0, 100) + "..." : title;
};

export const sortProdIdsInt = (a: number, b: number) => a - b;
export const sortProdIdsStr = (a: string, b: string) => a.localeCompare(b);

export const getStreamFromString = (str: string) => {
  const chunks: string[] = [];
  let remaining = str;
  while (remaining.length > 0) {
    const chunkLength = Math.floor(Math.random() * 15) + 10;
    chunks.push(remaining.slice(0, chunkLength));
    remaining = remaining.slice(chunkLength);
  }

  // creating a readable stream response from test array
  return new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      for (const str of chunks) {
        const data = encoder.encode(str);
        controller.enqueue(data);
        await new Promise((resolve) => setTimeout(resolve, 25));
      }
      controller.close();
    },
  });
};
