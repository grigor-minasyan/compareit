import {
  ZProductSearchApiResponse,
  ZProductSearchData,
  ZReviewSearchApiResponse,
  ZReviewSearchData,
} from "~/utils/zodValidations";
import type { ProductSearchData, ReviewSearchData } from "~/types";
import { TOKEN_LIMITS } from "~/constants";
import { calculateStringTokens } from "~/utils/promptUtils";
import { env } from "~/env.mjs";
import { backOff } from "exponential-backoff";

const AMAZON_API_BASE_URL = "https://real-time-amazon-data.p.rapidapi.com";

export const AmazonApiSearch = (
  query: string
): Promise<ProductSearchData[]> => {
  const url =
    `${AMAZON_API_BASE_URL}/search?` +
    new URLSearchParams({
      query,
      country: "US",
      category_id: "aps",
      page: "1",
    }).toString();

  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": env.RAPID_API_KEY,
      "X-RapidAPI-Host": "real-time-amazon-data.p.rapidapi.com",
    },
  };

  return backOff(
    async () => {
      const res = await fetch(url, options);
      const json = (await res.json()) as unknown;
      const productSearchResults = await ZProductSearchApiResponse.parseAsync(
        json
      );
      const productParseRes = await Promise.all(
        productSearchResults.data.products.map((product) =>
          ZProductSearchData.safeParseAsync(product)
        )
      );

      const finalRes = [];
      for (const res of productParseRes) {
        res.success && finalRes.push(res.data);
      }
      // TODO filter sometimes duplicate results
      return finalRes;
    },
    {
      jitter: "full",
      retry(e, attemptNumber) {
        console.error(
          `AmazonApiSearch: Attempt #${attemptNumber} failed. Error:`,
          e
        );
        return true;
      },
    }
  );
};

export const AmazonApiReviews = async (
  asin: string
): Promise<ReviewSearchData[]> => {
  const url =
    `${AMAZON_API_BASE_URL}/product-reviews?` +
    new URLSearchParams({
      asin,
      country: "US",
      sort_by: "TOP_REVIEWS",
      star_rating: "ALL",
      verified_purchases_only: "false",
      images_or_videos_only: "false",
      page: "1",
      page_size: "100",
    }).toString();

  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": env.RAPID_API_KEY,
      "X-RapidAPI-Host": "real-time-amazon-data.p.rapidapi.com",
    },
  };

  return backOff(
    async () => {
      const res = await fetch(url, options);
      const data = (await res.json()) as unknown;
      const cleanRes = await ZReviewSearchApiResponse.parseAsync(data);
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

      // let totalTokens = 0;
      // const limitedReviews = parsedReviews.reduce(
      //   (acc: ReviewSearchData[], review) => {
      //     const tokens = calculateStringTokens(review.review_comment);
      //     if (totalTokens + tokens <= TOKEN_LIMITS.REVIEWS_TOTAL) {
      //       acc.push(review);
      //       totalTokens += tokens;
      //     }
      //     return acc;
      //   },
      //   []
      // );
      // console.log(
      //   `Limited the number of reviews for productId: ${asin} from ${parsedReviews.length} to ${limitedReviews.length}`
      // );

      // return limitedReviews;
      // TODO filter sometimes duplicate results
      return parsedReviews;
    },
    {
      jitter: "full",
      retry(e, attemptNumber) {
        console.error(
          `AmazonApiReviews: Attempt #${attemptNumber} failed. Error:`,
          e
        );
        return true;
      },
    }
  );
};
