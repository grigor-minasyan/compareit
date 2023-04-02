import { TOKEN_LIMITS } from "~/constants";
import type { ReviewData, ProductSearchData, Product } from "~/types";
import { calculateStringTokens } from "./promptUtils";

export const isProductQualified = (product: ProductSearchData): boolean => {
  return (
    !!product.product_description &&
    !!product.product_rating &&
    product.product_description.length > 100 &&
    product.product_num_reviews > 10
  );
};

export const doesProductDescriptionNeedToBeShortened = (
  product: ProductSearchData
): boolean => {
  if (!product.product_description) {
    return false;
  }

  return (
    calculateStringTokens(product.product_description) >
    TOKEN_LIMITS.PRODUCT_DESCRIPTION
  );
};

export const doesReviewNeedToBeShortened = (review: ReviewData) => {
  if (!review.review_text) {
    return false;
  }
  return calculateStringTokens(review.review_text) > TOKEN_LIMITS.REVIEW;
};

export const filterForQualifiedReviews = (reviews: ReviewData[]) => {
  return reviews.filter(
    (review) => review.review_text && review.review_text.length > 10
  );
};

export const createProductFromSearchDataAndReviews = (
  product: ProductSearchData,
  reviews: ReviewData[]
): Product => {
  if (!isProductQualified(product)) {
    throw new Error("Product is not qualified");
  }
  return {
    id: product.product_id,
    title: product.product_title,
    slug: createSlugFromTitle(product.product_title),
    rating: product.product_rating,
    description: product.product_description || "",
    reviews: filterForQualifiedReviews(reviews).map((review) => ({
      id: review.review_id,
      comment: review.review_text || "",
      rating: review.rating,
    })),
  };
};

export const createSlugFromTitle = (title: string) => {
  return title
    .toLowerCase()
    .replace(/-/g, "")
    .replace(/\s+/g, " ")
    .replace(/[^a-z0-9]/g, "-");
};
