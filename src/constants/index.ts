export const WebsiteName = "EZ Compare";

export const revalidationTimersInSec = {
  jointComparison: 60 * 60 * 24, // 24 hours
} as const;

// trying to stay within 4096 total tokens for prompt and response
export const TOKEN_LIMITS = {
  PRODUCT_DESCRIPTION: 200,
  REVIEW_COUNT: 20,
  REVIEW: 40,
} as const;

export const CHAR_PER_TOKEN_RATIO = 4; // lower is more conservative, openAI gives as 4 on average
