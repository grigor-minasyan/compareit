import type { z } from "zod";
import type {
  ZProductApiResponse,
  ZProductSearchData,
  ZReviewSearchData,
} from "./utils/zodValidations";

export type Review = {
  id: string;
  rating: number;
  comment: string;
};

export type Product = {
  id: string;
  title: string;
  slug: string;
  rating: number;
  description: string;
  reviews: Review[];
  storeId: string;
};

export type ProductApiResponses = z.infer<typeof ZProductApiResponse>;
export type ProductSearchData = z.infer<typeof ZProductSearchData>;
export type ReviewSearchData = z.infer<typeof ZReviewSearchData>;
