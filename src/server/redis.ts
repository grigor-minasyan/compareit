import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { RATE_LIMIT_REQUESTS_PER_10_SEC, TIMEOUTS_SEC } from "~/constants";
import { env } from "~/env.mjs";

const redis = new Redis({
  url: env.UPSTASH_REDIS_REST_URL,
  token: env.UPSTASH_REDIS_REST_TOKEN,
});

export const CACHE_KEY = {
  RATELIMIT: "RATELIMIT",
  AMZ_API_PRODUCT: (asin: string) => `AMZ_API_PRODUCT:${asin}`,
  AMZ_API_PRODUCT_QUERY: (query: string) => `AMZ_API_PRODUCT_QUERY:${query}`,
  AMZ_API_PRODUCT_REVIEWS: (asin: string, page: number) =>
    `AMZ_API_PRODUCT_REVIEWS:${asin}:page-${page}`,
} as const;

export const redisRestGet = async <T>(key: string) => {
  return redis.get(key) as Promise<T>;
};

export const redisRestSet = (key: string, value: unknown) => {
  return redis.set(key, value, { ex: TIMEOUTS_SEC.REDIS });
};

export const redisRestSetInPipeline = (
  valuesAsKeyValPairs: [string, unknown][]
) => {
  const p = redis.pipeline();
  for (const [key, value] of valuesAsKeyValPairs) {
    p.set(key, value, { ex: TIMEOUTS_SEC.REDIS });
  }
  return p.exec();
};

const ephemeralCache = new Map();
export const rateLimit = new Ratelimit({
  redis,
  ephemeralCache,
  limiter: Ratelimit.slidingWindow(RATE_LIMIT_REQUESTS_PER_10_SEC, "10 s"),
  analytics: true,
  prefix: CACHE_KEY.RATELIMIT,
});
