import type { Product, ProductSearchData, ReviewSearchData } from "~/types";

export const createProductFromSearchDataAndReviews = (
  product: ProductSearchData,
  reviews: ReviewSearchData[],
  storeId: string
): Product => {
  return {
    storeId,
    id: product.asin,
    title: product.product_title,
    slug: createSlugFromTitle(product.product_title),
    rating: product.product_star_rating,
    reviews: reviews.map((review) => review.review_comment),
  };
};

export const createSlugFromTitle = (title: string) => {
  return title
    .toLowerCase()
    .replace(/-/g, " ")
    .replace(/\s+/g, " ")
    .replace(/[^a-z0-9]/g, "-");
};
