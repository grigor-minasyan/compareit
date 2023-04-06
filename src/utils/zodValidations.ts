import { z } from "zod";
import { MIN_REVIEW_COUNT, MIN_REVIEW_LENGTH } from "~/constants";

export const ZProductSearchApiResponse = z.object({
  status: z.literal("OK"),
  request_id: z.string(),
  data: z.object({
    total_products: z.number(),
    country: z.string(),
    products: z.array(z.unknown()),
  }),
});

export const ZProductSearchData = z.object({
  asin: z.string(),
  product_title: z.string().min(1),
  product_price: z.string().min(1),
  product_original_price: z.string().min(1).nullable(),
  product_star_rating: z
    .number()
    .min(0)
    .max(5)
    .or(z.string().min(1))
    .pipe(z.coerce.number().min(0).max(5)),
  product_num_ratings: z.number().min(MIN_REVIEW_COUNT),
  product_url: z.string().url(),
  product_photo: z.string().url(),
});

export const ZReviewSearchApiResponse = z.object({
  status: z.literal("OK"),
  request_id: z.string(),
  data: z.object({
    asin: z.string(),
    total_reviews: z.number(),
    country: z.string(),
    reviews: z.array(z.unknown()),
  }),
});

export const ZReviewSearchData = z.object({
  review_id: z.string(),
  review_comment: z.string().min(MIN_REVIEW_LENGTH),
});
