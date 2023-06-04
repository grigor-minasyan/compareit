import type { Category } from "@prisma/client";
import type { backOff } from "exponential-backoff";
import { log } from "next-axiom";
import { serializeError } from "serialize-error";

export const WebsiteName = "Compareit.ai";

export const revalidationTimersInSec = {
  jointComparison: 60 * 60 * 24, // 24 hours
  recentComparisons: 60 * 60, // 1 hour
} as const;

// trying to stay within 4096 total tokens for prompt and response
export const TOKEN_LIMITS = {
  REVIEWS_TOTAL: 1500,
} as const;

export const CHAR_PER_TOKEN_RATIO = 4; // lower is more conservative, openAI gives as 4 on average

export const MIN_REVIEW_COUNT = 10;
export const MIN_REVIEW_LENGTH = 20;
export const MAX_REVIEW_LENGTH = 2000;
export const MIN_REVIEW_LENGTH_TO_SHORTEN = 500;

export const AMAZON_ASSOCIATES_ID = "compareit04f-20";

export const TIMEOUTS_SEC = {
  REDIS: 60 * 60 * 24 * 5, // 5 days
} as const;

export const RATE_LIMIT_REQUESTS_PER_10_SEC = 5;
export const UNKNOWN_IP = "UNKNOWN_IP";

export const CATEGORIES_UNUSED = [
  "Appliances",
  "Apps & Games",
  "Arts, Crafts & Sewing",
  "Automotive Parts & Accessories",
  "Baby",
  "Beauty & Personal Care",
  "Books",
  "CDs & Vinyl",
  "Cell Phones & Accessories",
  "Clothing, Shoes & Jewelry",
  "Women",
  "Men",
  "Girls",
  "Boys",
  "Collectibles & Fine Art",
  "Computers",
  "Credit and Payment Cards",
  "Digital Educational Resources",
  "Digital Music",
  "Electronics",
  "Garden & Outdoor",
  "Gift Cards",
  "Grocery & Gourmet Food",
  "Handmade",
  "Health, Household & Baby Care",
  "Home & Business Services",
  "Home & Kitchen",
  "Industrial & Scientific",
  "Kindle Store",
  "Luggage & Travel Gear",
  "Luxury Stores",
  "Magazine Subscriptions",
  "Movies & TV",
  "Musical Instruments",
  "Office Products",
  "Pet Supplies",
  "Smart Home",
  "Software",
  "Sports & Outdoors",
  "Tools & Home Improvement",
  "Toys & Games",
  "Video Games",
  "Random",
] as const;

export const RANDOM_CAT: Category = { name: "Random", slug: "random" };

export const LOADING_BAR_TEXTS = [
  "Searching for product details...",
  "Looking for customer reviews...",
  "Summarizing reviews...",
  "Generating comparison based on reviews...",
];

export const backOffOptions: Parameters<typeof backOff>[1] = {
  jitter: "full",
  retry(e: unknown, attemptNumber) {
    log[attemptNumber === 10 ? "error" : "warn"](
      `Backoff attempt #${attemptNumber} failed. Error:`,
      serializeError(e)
    );
    return true;
  },
};

export const SLUG_RAND_ID_SUFFIX_LENGTH = 7;

export const MAX_PAGE_SIZE = 5;
export const MAX_PAGES_COUNT = 10;
