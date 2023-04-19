import type { z } from "zod";
import type {
  ZProductSearchData,
  ZReviewSearchData,
} from "./utils/zodValidations";

export type Product = {
  id: string;
  title: string;
  slug: string;
  rating: number;
  reviews: string[];
  storeId: string;
};

export type ProductSearchData = z.infer<typeof ZProductSearchData>;
export type ReviewSearchData = z.infer<typeof ZReviewSearchData>;

export type ProductNum = "1" | "2";
