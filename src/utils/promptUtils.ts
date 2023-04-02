import { CHAR_PER_TOKEN_RATIO, TOKEN_LIMITS } from "~/constants";
import type { ProductSearchData, ReviewData, Product } from "~/types";

export const generatePromptFromProducts = (products: Product[]) => {
  const initialPrompt = `I will give you multiple products with their descriptions and multiple reviews. You will write a blog style post about the comparison. You will then give a summarized pros and cons unordered list of each product. At the end of the post also write a conclusion about which product you think is better and why.
  `;

  const productPrompts = products.map((product, i) => {
    return `
Product ${i + 1}: ${product.title}
Description of product ${i + 1}: ${product.description}
Reviews of product ${i + 1}: ${product.reviews
      .map((review) => review.comment)
      .join("\n\n")}`;
  });

  return initialPrompt + productPrompts.join("\n");
};

export const calculateStringTokens = (str: string) => {
  return Math.round(str.length / CHAR_PER_TOKEN_RATIO); // 3.8 is optimistic, usually it's slightly more than 4
};

export const tokenToStringLength = (tokens: number) => {
  return Math.round(tokens * CHAR_PER_TOKEN_RATIO);
};

export const generatePromptToShortenProductDesc = (
  product: ProductSearchData
) => {
  if (!product.product_description) {
    throw new Error("Product description is empty");
  }
  return `Generate a summary for this product. Try to keep it under ${tokenToStringLength(
    TOKEN_LIMITS.PRODUCT_DESCRIPTION
  )} characters. Here is the product description:\n\n${
    product.product_description
  }`;
};

export const generatePromptToShortenReview = (review: ReviewData) => {
  if (!review.review_text) {
    throw new Error("Review text is empty");
  }

  return `Generate a summary for this review. Try to keep it under ${tokenToStringLength(
    TOKEN_LIMITS.REVIEW
  )} characters. Here is the review:\n\n${review.review_text}`;
};
