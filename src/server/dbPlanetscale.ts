import { connect } from "@planetscale/database";
import type { Category, Comparison, Product, Review } from "@prisma/client";
import { RANDOM_CAT } from "~/constants";
import { env } from "~/env.mjs";
import type { ProductLocal, ProductWithReviews } from "~/types";
import {
  createComparisonSlugFromProducts,
  sortProdIdsStr,
} from "~/utils/productUtils";

const dbRestConn = connect({ url: env.DATABASE_URL });

export const insertProductWithReviews = async (product: ProductLocal) => {
  return dbRestConn.transaction(async (tx) => {
    await tx.execute(
      `INSERT INTO Product (createdAt, updatedAt, asin, title, price, originalPrice, starRating, numRatings, url, photo, slug, categorySlug)
      VALUES (NOW(), NOW(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        product.asin,
        product.title,
        product.price,
        product.originalPrice,
        product.starRating,
        product.numRatings,
        product.url,
        product.photo,
        product.slug,
        product.categorySlug,
      ]
    );

    await tx.execute(
      `INSERT INTO Review (createdAt, updatedAt, productAsin, comment)
      VALUES ${Array.from(Array(product.reviews.length))
        .map(() => "(NOW(), NOW(), ?, ?)")
        .join(", ")};`,
      product.reviews.map((review) => [product.asin, review.comment]).flat()
    );
  });
};

export const updateProductDetails = async (
  product: Omit<ProductLocal, "reviews" | "categorySlug">
) => {
  return dbRestConn.execute(
    `UPDATE Product SET updatedAt = NOW(), title = ?, price = ?, originalPrice = ?, starRating = ?, numRatings = ?, url = ?, photo = ?, slug = ?
    WHERE asin = ?;`,
    [
      product.title,
      product.price,
      product.originalPrice,
      product.starRating,
      product.numRatings,
      product.url,
      product.photo,
      product.slug,
      product.asin,
    ]
  );
};

export const fetchProductWithReviewsFromDb = async (asin: string) => {
  const productQuery = await dbRestConn.execute(
    `SELECT * FROM Product WHERE asin = ?;`,
    [asin]
  );
  if (productQuery.rows.length === 0) return null;

  const product = productQuery.rows[0] as Product;

  const reviewsQuery = await dbRestConn.execute(
    `SELECT * FROM Review WHERE productAsin = ?;`,
    [product.asin]
  );
  const reviews = reviewsQuery.rows as Review[];

  if (reviews.length === 0) return null;

  (product as ProductWithReviews).reviews = reviews;

  return product as ProductWithReviews;
};

export const insertComparison = async (
  prod1: ProductLocal,
  prod2: ProductLocal,
  comparisonText: string
) => {
  const slug = await createComparisonSlugFromProducts(prod1, prod2);
  return dbRestConn.execute(
    `INSERT INTO Comparison (createdAt, updatedAt, product1Asin, product2Asin, comparisonText, categorySlug, slug)
      VALUES (NOW(), NOW(), ?, ?, ?, ?, ?);`,
    [
      ...[prod1.asin, prod2.asin].sort(sortProdIdsStr),
      comparisonText,
      prod1.categorySlug === prod2.categorySlug
        ? prod1.categorySlug
        : RANDOM_CAT.slug,
      slug,
    ]
  );
};

export const fetchComparisonFromDb = async (
  asin1: string,
  asin2: string
): Promise<string | null> => {
  const comparisonQuery = await dbRestConn.execute(
    `SELECT * FROM Comparison WHERE product1Asin = ? AND product2Asin = ?;`,
    [...[asin1, asin2].sort(sortProdIdsStr)]
  );
  if (comparisonQuery.rows.length === 0) return null;

  const comparison = comparisonQuery.rows[0] as Comparison;

  return comparison.comparisonText;
};

export const fetchCategoriesFromDb = async (): Promise<Category[]> => {
  const categoriesQuery = await dbRestConn.execute(`SELECT * from Category;`);

  return categoriesQuery.rows as unknown as Category[];
};
