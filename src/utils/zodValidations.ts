import { z } from "zod";
import {
  MIN_DESCRIPTION_LENGTH,
  MIN_REVIEW_COUNT,
  MIN_REVIEW_LENGTH,
} from "~/constants";

export const ZProductSearchData = z.object({
  product_id: z.string(),
  product_title: z.string(),
  product_description: z.string().min(MIN_DESCRIPTION_LENGTH),
  product_photos: z.array(z.string().url()),
  product_rating: z.number(),
  product_num_reviews: z.number().min(MIN_REVIEW_COUNT),
  product_reviews_page_url: z.string().url(),
  offer: z.object({
    store_name: z.string(),
    offer_page_url: z.string().url(),
    price: z.string(),
  }),
});

export const ZReviewSearchData = z.object({
  review_id: z.string(),
  review_text: z.string().min(MIN_REVIEW_LENGTH),
  rating: z.number(),
});

export const ZProductApiResponse = z.object({
  status: z.literal("OK"),
  request_id: z.string(),
  data: z.array(z.unknown()),
});
