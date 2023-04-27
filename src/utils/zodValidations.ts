import { z } from "zod";
import { MIN_REVIEW_COUNT, MIN_REVIEW_LENGTH } from "~/constants";

export const ZProductSearchApiResponse = z.object({
  status: z.literal("OK"),
  request_id: z.string().trim(),
  data: z.object({
    total_products: z.number(),
    country: z.string().trim(),
    products: z.array(z.unknown()),
  }),
});

export const ZProductSearchData = z.object({
  asin: z.string().trim(),
  product_title: z.string().trim().min(1),
  product_price: z.string().trim().min(1),
  product_original_price: z.string().trim().min(1).nullable(),
  product_star_rating: z
    .number()
    .min(0)
    .max(5)
    .or(z.string().trim().min(1))
    .pipe(z.coerce.number().min(0).max(5)),
  product_num_ratings: z.number().min(MIN_REVIEW_COUNT),
  product_url: z.string().trim().url(),
  product_photo: z.string().trim().url(),
});

export const ZReviewSearchApiResponse = z.object({
  status: z.literal("OK"),
  request_id: z.string().trim(),
  data: z.object({
    asin: z.string().trim(),
    total_reviews: z.number(),
    country: z.string().trim(),
    reviews: z.array(z.unknown()),
  }),
});

export const ZReviewSearchData = z.object({
  review_id: z.string().trim(),
  review_comment: z.string().trim().min(MIN_REVIEW_LENGTH),
});

export const ZGenComparisonRequest = z
  .object({
    prodId1: z.string().trim().min(1).max(100),
    prodId2: z.string().trim().min(1).max(100),
  })
  .strict();
