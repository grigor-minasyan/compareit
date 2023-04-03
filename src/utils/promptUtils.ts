import { CHAR_PER_TOKEN_RATIO, TOKEN_LIMITS } from "~/constants";
import type { Product, ProductSearchData } from "~/types";

export const generatePromptFromProducts = (products: Product[]) => {
  // const initialPrompt = `I will give you two products with their descriptions and reviews. Write a blog style post comparing the products. Start with an introduction, then give between 10 and 15 pros and cons unordered list of each product. Write the unordered list with hyphens. At the end of the post also write a conclusion about which product you think is better and why.
  // `;
  const initialPrompt = `I will give you two products with their descriptions and reviews. Based on the description and reviews, write between 10 and 15 pros and cons unordered list of each product. Write the unordered list with hyphens. Clearly mark the product and list with "Pros:" or "Cons:". Do not write any additional introduction or conclusion.
  `;

  const productPrompts = products.map((product, i) => {
    return `
Product ${i + 1}: ${product.title}
Description of product ${i + 1}: ${product.description}
Reviews of product ${i + 1}: ${product.reviews
      .map((review) => review.comment)
      .join("\n")}`;
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
  return `Generate a summary for this product. Try to keep it under ${tokenToStringLength(
    TOKEN_LIMITS.PRODUCT_DESCRIPTION
  )} characters. Here is the product description:\n\n${
    product.product_description
  }`;
};
