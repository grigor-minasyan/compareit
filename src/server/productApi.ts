import {
  ZProductSearchApiResponse,
  ZProductSearchData,
  ZReviewSearchApiResponse,
  ZReviewSearchData,
} from "~/utils/zodValidations";
import type { ProductSearchData, ReviewSearchData } from "~/types";
import { env } from "~/env.mjs";
import { backOff } from "exponential-backoff";
import { CACHE_KEY, redisRestGet, redisRestSetInPipeline } from "./redis";
import { redisRestSet } from "./redis";
import { log } from "next-axiom";
import { distance, closest } from "fastest-levenshtein";
import { serializeError } from "serialize-error";
import type { Category } from "@prisma/client";
import { fetchCategoriesFromDb } from "./dbPlanetscale";
import { OpenAIDirect } from "~/utils/OpenAIStream";
import { generatePromptToGetProductCategory } from "~/utils/promptUtils";
import { RANDOM_CAT, backOffOptions } from "~/constants";

const AMAZON_API_BASE_URL = "https://real-time-amazon-data.p.rapidapi.com";

export const AmazonApiSearch = async (
  query: string
): Promise<ProductSearchData[]> => {
  const cached = await redisRestGet<ProductSearchData[]>(
    CACHE_KEY.AMZ_API_PRODUCT_QUERY(query)
  );
  if (cached) {
    log.info("AmazonApiSearch: returning cached results for query:", { query });
    return cached;
  }

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

  return backOff(async () => {
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

    const finalRes: ProductSearchData[] = [];
    const seenAsins = new Set<string>();
    for (const res of productParseRes) {
      if (res.success && !seenAsins.has(res.data.asin)) {
        finalRes.push(res.data);
        seenAsins.add(res.data.asin);
      }
    }

    await redisRestSetInPipeline([
      [CACHE_KEY.AMZ_API_PRODUCT_QUERY(query), finalRes],
      ...finalRes.map(
        (product) =>
          [CACHE_KEY.AMZ_API_PRODUCT(product.asin), product] as [
            string,
            unknown
          ]
      ),
    ]);

    return finalRes;
  }, backOffOptions);
};

export const AmazonApiReviews = async (
  asin: string,
  page = 1
): Promise<ReviewSearchData[]> => {
  const cached = await redisRestGet<ReviewSearchData[]>(
    CACHE_KEY.AMZ_API_PRODUCT_REVIEWS(asin, page)
  );
  if (cached) {
    log.info("AmazonApiReviews: returning cached results for asin and page", {
      asin,
      page,
    });
    return cached;
  }

  const url =
    `${AMAZON_API_BASE_URL}/product-reviews?` +
    new URLSearchParams({
      asin,
      country: "US",
      sort_by: "TOP_REVIEWS",
      star_rating: "ALL",
      verified_purchases_only: "false",
      images_or_videos_only: "false",
      page: `${page}`,
      page_size: "20",
    }).toString();

  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": env.RAPID_API_KEY,
      "X-RapidAPI-Host": "real-time-amazon-data.p.rapidapi.com",
    },
  };

  return backOff(async () => {
    const res = await fetch(url, options);
    const data = (await res.json()) as unknown;
    const cleanRes = await ZReviewSearchApiResponse.parseAsync(data);
    const reviewParseRes = await Promise.all(
      cleanRes.data.reviews.map((review) =>
        ZReviewSearchData.safeParseAsync(review)
      )
    );
    const seenReviewIds = new Set<string>();
    const parsedReviews = [];
    for (const res of reviewParseRes) {
      if (res.success && !seenReviewIds.has(res.data.review_id)) {
        parsedReviews.push(res.data);
        seenReviewIds.add(res.data.review_id);
      }
    }

    await redisRestSet(
      CACHE_KEY.AMZ_API_PRODUCT_REVIEWS(asin, page),
      parsedReviews
    );
    return parsedReviews;
  }, backOffOptions);
};

export const fetchCategoriesFromRedis = async (): Promise<Category[]> => {
  const cached = await redisRestGet<Category[]>(CACHE_KEY.CATEGORIES);
  if (cached) {
    log.info("fetchCategoriesFromRedis: returning cached results");
    return cached;
  }

  const categories = await fetchCategoriesFromDb();
  redisRestSet(CACHE_KEY.CATEGORIES, categories).catch((e: unknown) => {
    log.error(
      "fetchCategoriesFromRedis: failed to cache categories",
      serializeError(e)
    );
  });

  return categories;
};

export const getCorrectCategory = async (
  product: ProductSearchData
): Promise<Category> => {
  const categories = await fetchCategoriesFromRedis();
  const prompt = generatePromptToGetProductCategory(product, categories);
  const openAIresult = (await OpenAIDirect(prompt)).toLowerCase().trim();

  const closestCategory = closest(
    openAIresult,
    categories.map((c) => c.name.toLowerCase())
  );

  const score = distance(openAIresult, closestCategory);
  if (score > 2) {
    return RANDOM_CAT;
  }

  return (
    categories.find((c) => c.name.toLowerCase() === closestCategory) ||
    RANDOM_CAT
  );
};
