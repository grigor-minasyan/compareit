export const WebsiteName = "EZ Compare";

export const revalidationTimersInSec = {
  jointComparison: 60 * 60 * 24, // 24 hours
} as const;

// trying to stay within 4096 total tokens for prompt and response
export const TOKEN_LIMITS = {
  REVIEWS_TOTAL: 2000,
} as const;

export const CHAR_PER_TOKEN_RATIO = 4; // lower is more conservative, openAI gives as 4 on average

export const MIN_REVIEW_COUNT = 10;
export const MIN_REVIEW_LENGTH = 20;

export const AMAZON_STORE_ID = "g113872638";
