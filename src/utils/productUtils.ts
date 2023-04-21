import { MIN_REVIEW_LENGTH_TO_SHORTEN, TOKEN_LIMITS } from "~/constants";
import type { Product, ProductSearchData, ReviewSearchData } from "~/types";
import {
  calculateStringTokens,
  generatePromptToShortenReview,
} from "./promptUtils";
import { OpenAIDirect } from "./OpenAIStream";

export const createProductFromSearchDataAndReviews = (
  product: ProductSearchData,
  reviews: ReviewSearchData[],
  storeId: string
): Product => {
  return {
    storeId,
    id: product.asin,
    title: product.product_title,
    slug: createSlugFromTitle(product.product_title),
    rating: product.product_star_rating,
    reviews: reviews.map((review) => review.review_comment),
  };
};

export const createSlugFromTitle = (title: string) => {
  return title
    .toLowerCase()
    .replace(/-/g, " ")
    .replace(/\s+/g, " ")
    .replace(/[^a-z0-9]/g, "-");
};

export const shortenReviewIfNeeded = async (review: ReviewSearchData) => {
  if (review.review_comment.length > MIN_REVIEW_LENGTH_TO_SHORTEN) {
    review.review_comment = await OpenAIDirect(
      generatePromptToShortenReview(review.review_comment)
    );
  }

  return review;
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
  console.log(
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
