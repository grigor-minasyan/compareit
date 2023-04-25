import type { z } from "zod";
import type {
  ZProductSearchData,
  ZReviewSearchData,
} from "./utils/zodValidations";

export type Product = {
  asin: string;
  title: string;
  price: string;
  originalPrice: string | null;
  starRating: number;
  numRatings: number;
  url: string;
  photo: string;
  slug: string;
  reviews: string[];
};

export type ProductSearchData = z.infer<typeof ZProductSearchData>;
export type ReviewSearchData = z.infer<typeof ZReviewSearchData>;

export type ProductNum = "1" | "2";

export type ErrorAlert = {
  id: string;
  message: string;
};
