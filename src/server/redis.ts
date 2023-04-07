import { Redis } from "@upstash/redis";
import type { JSONObject } from "superjson/dist/types";
import { env } from "~/env.mjs";

const redis = new Redis({
  url: env.UPSTASH_REDIS_REST_URL,
  token: env.UPSTASH_REDIS_REST_TOKEN,
});

export const CACHE_KEY_PREFIX = {
  AMZ_API_PRODUCT: "AMZ_API_PRODUCT:",
} as const;

export const redisGet = async <T>(key: string) => {
  return (await redis.get(key)) as T;
};

export const redisSet = async <T extends JSONObject>(key: string, value: T) => {
  await redis.set(key, value, { ex: 3600 });
};
