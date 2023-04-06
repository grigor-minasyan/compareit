import { CHAR_PER_TOKEN_RATIO } from "~/constants";
import type { Product } from "~/types";

export const generatePromptFromProducts = (products: Product[]) => {
  //   const initialPrompt = `I will give you two products with their titles and reviews, you will write a SEO friendly blog style post with an introduction about what the article is about, clearly mark the introduction with "Introduction:".
  // Then based on the product reviews, write between 10 and 15 pros and cons unordered list of each product in third person. Write the unordered list with hyphens with clearly mark the product with "Product 1: [Product name]" and list with "Pros:" or "Cons:".
  // Write a concluding paragraph, clearly mark the conclusion with "Conclusion:", write "The winner is [Product name]", then explain why it is the winner.

  // Write everything structured as a json with keys "introduction", "product1Pros", "product1Cons, "product2Pros", "product2Cons", "conclusion", "winningProductName" and values as strings.`;
  const initialPrompt = `I will give you two products with their titles and reviews, you will write a SEO friendly blog style post with an introduction about what the article is about.
Then based on the product reviews, write between 10 and 15 pros and cons list of each product in third person.
Write a concluding paragraph explaining why it is the winner.

Write everything structured as a valid JSON with keys "introduction", "product1Pros", "product1Cons, "product2Pros", "product2Cons", "conclusion", "winningProductName" and values as strings. Write the pros and const list as an array of strings. Only output the resulting JSON and nothing else.`;
  const productPrompts = products.map((product, i) => {
    return `
Product ${i + 1}: ${product.title}
Reviews of product ${i + 1}: ${product.reviews.join("\n")}`;
  });

  return initialPrompt + productPrompts.join("\n");
};

export const calculateStringTokens = (str: string) => {
  return Math.round(str.length / CHAR_PER_TOKEN_RATIO); // 3.8 is optimistic, usually it's slightly more than 4
};

export const tokenToStringLength = (tokens: number) => {
  return Math.round(tokens * CHAR_PER_TOKEN_RATIO);
};
