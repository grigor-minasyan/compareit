import { Redis } from "@upstash/redis";
import { env } from "~/env.mjs";

const redis = new Redis({
  url: env.UPSTASH_REDIS_REST_URL,
  token: env.UPSTASH_REDIS_REST_TOKEN,
});

export const CACHE_KEY = {
  AMZ_API_PRODUCT: (asin: string) => `AMZ_API_PRODUCT:${asin}`,
  AMZ_API_PRODUCT_QUERY: (query: string) => `AMZ_API_PRODUCT_QUERY:${query}`,
  AMZ_API_PRODUCT_REVIEWS: (asin: string, page: number) =>
    `AMZ_API_PRODUCT_REVIEWS:${asin}:page-${page}`,
} as const;

export const redisRestGet = async <T>(key: string) => {
  return redis.get(key) as Promise<T>;
};

export const redisRestSet = (key: string, value: unknown) => {
  return redis.set(key, value, { ex: 3600 });
};

export const redisRestSetInPipeline = (
  valuesAsKeyValPairs: [string, unknown][]
) => {
  const p = redis.pipeline();
  for (const [key, value] of valuesAsKeyValPairs) {
    p.set(key, value, { ex: 3600 });
  }
  return p.exec();
};
