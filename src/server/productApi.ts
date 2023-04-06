import { productSearchResults } from "~/constants/productSearch";
import { reviews } from "~/constants/productReviews";
import {
  ZProductSearchApiResponse,
  ZProductSearchData,
  ZReviewSearchApiResponse,
  ZReviewSearchData,
} from "~/utils/zodValidations";
import type { ProductSearchData, ReviewSearchData } from "~/types";
import { TOKEN_LIMITS } from "~/constants";
import { calculateStringTokens } from "~/utils/promptUtils";

export const runFilteredProductSearch = async (
  _query: string
): Promise<ProductSearchData[]> => {
  await new Promise((r) => setTimeout(r, 100));
  const cleanRes = await ZProductSearchApiResponse.parseAsync(
    productSearchResults
  );
  const productParseRes = await Promise.all(
    cleanRes.data.products.map((product) =>
      ZProductSearchData.safeParseAsync(product)
    )
  );

  const finalRes = [];
  for (const res of productParseRes) {
    res.success && finalRes.push(res.data);
  }

  return finalRes;
};

export const runFilteredReviewSearch = async (
  id: string
): Promise<ReviewSearchData[]> => {
  await new Promise((r) => setTimeout(r, 100));
  if (!reviews[id]) {
    throw new Error("No reviews found for product");
  }

  const cleanRes = await ZReviewSearchApiResponse.parseAsync(reviews[id]);
  const reviewParseRes = await Promise.all(
    cleanRes.data.reviews.map((review) =>
      ZReviewSearchData.safeParseAsync(review)
    )
  );
  const parsedReviews = [];
  for (const res of reviewParseRes) {
    res.success && parsedReviews.push(res.data);
  }
  // sort finalRes by review_text length, from shortest to longest
  parsedReviews.sort(
    (a, b) => a.review_comment.length - b.review_comment.length
  );

  let totalTokens = 0;
  const limitedReviews = parsedReviews.reduce(
    (acc: ReviewSearchData[], review) => {
      const tokens = calculateStringTokens(review.review_comment);
      if (totalTokens + tokens <= TOKEN_LIMITS.REVIEWS_TOTAL) {
        acc.push(review);
        totalTokens += tokens;
      }
      return acc;
    },
    []
  );
  console.log(
    `Limited the number of reviews for productId: ${id} from ${parsedReviews.length} to ${limitedReviews.length}`
  );

  return limitedReviews;
};
