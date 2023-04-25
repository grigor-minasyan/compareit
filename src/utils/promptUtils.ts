import { CHAR_PER_TOKEN_RATIO } from "~/constants";
import type { ProductLocal } from "~/types";

export const generatePromptFromProducts = (products: ProductLocal[]) => {
  const initialPrompt = `I will give you two products with their descriptions and reviews. Based on the description and reviews, write between 10 and 15 pros and cons unordered list of each product. Start with a blog style introduction of what we are going to do. Clearly mark the introduction with "Introduction:". Then write the unordered list with hyphens. Clearly mark the product with "Product 1: [Product name]" and list with "Pros:" or "Cons:". Write a concluding paragraph about which product you think is better and explain why. Clearly mark the conclusion with "Conclusion:".`;
  const productPrompts = products.map((product, i) => {
    return `
Product ${i + 1}: ${product.title}
Reviews of product ${i + 1}: ${product.reviews
      .map(({ comment }) => comment)
      .join("\n")}`;
  });

  return initialPrompt + productPrompts.join("\n");
};

export const generatePromptToShortenReview = (
  review: string
) => `Give me a summary of this review within 3 sentences. Here is the review.

${review}
`;

export const calculateStringTokens = (str: string) => {
  return Math.round(str.length / CHAR_PER_TOKEN_RATIO); // 3.8 is optimistic, usually it's slightly more than 4
};

export const tokenToStringLength = (tokens: number) => {
  return Math.round(tokens * CHAR_PER_TOKEN_RATIO);
};
