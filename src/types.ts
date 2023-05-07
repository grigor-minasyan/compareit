import type { z } from "zod";
import type {
  ZProductSearchData,
  ZReviewSearchData,
} from "./utils/zodValidations";
import type { Product, Review } from "@prisma/client";

export type ReviewLocal = Omit<
  Review,
  "id" | "createdAt" | "updatedAt" | "productAsin"
>;

export type ProductLocal = Omit<Product, "createdAt" | "updatedAt"> & {
  reviews: ReviewLocal[];
};

export type ProductWithReviews = Product & { reviews: Review[] };

export type ProductSearchData = z.infer<typeof ZProductSearchData>;
export type ReviewSearchData = z.infer<typeof ZReviewSearchData>;

export type ProductNum = "1" | "2";

export type ErrorAlert = {
  id: string;
  message: string;
};
