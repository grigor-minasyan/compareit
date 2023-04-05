import type { z } from "zod";
import type {
  ZProductApiResponse,
  ZProductSearchData,
  ZReviewSearchData,
} from "./utils/zodValidations";

export type Product = {
  id: string;
  title: string;
  slug: string;
  rating: number;
  description: string;
  reviews: string[];
  storeId: string;
};

export type ProductApiResponses = z.infer<typeof ZProductApiResponse>;
export type ProductSearchData = z.infer<typeof ZProductSearchData>;
export type ReviewSearchData = z.infer<typeof ZReviewSearchData>;
