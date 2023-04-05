import { TOKEN_LIMITS } from "~/constants";
import type { Product, ProductSearchData, ReviewSearchData } from "~/types";
import {
  calculateStringTokens,
  generatePromptToShortenProductDesc,
} from "./promptUtils";
import { runPrompt } from "~/server/openai";

export const doesProductDescriptionNeedToBeShortened = (
  product: ProductSearchData
): boolean => {
  return (
    calculateStringTokens(product.product_description) >
    TOKEN_LIMITS.PRODUCT_DESCRIPTION
  );
};

export const createProductFromSearchDataAndReviews = (
  product: ProductSearchData,
  reviews: ReviewSearchData[],
  storeId: string
): Product => {
  return {
    storeId,
    id: product.product_id,
    title: product.product_title,
    slug: createSlugFromTitle(product.product_title),
    rating: product.product_rating,
    description: product.product_description,
    reviews: reviews.map((review) => review.review_text),
  };
};

export const createSlugFromTitle = (title: string) => {
  return title
    .toLowerCase()
    .replace(/-/g, "")
    .replace(/\s+/g, " ")
    .replace(/[^a-z0-9]/g, "-");
};

export const shortenProductDescIfNeeded = async (
  product: ProductSearchData
): Promise<void> => {
  if (!doesProductDescriptionNeedToBeShortened(product)) {
    return;
  }

  const prompt = generatePromptToShortenProductDesc(product);
  const summary = await runPrompt(prompt);
  product.product_description = summary;
};
