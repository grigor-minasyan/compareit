import { connect } from "@planetscale/database";
import type { Product } from "@prisma/client";
import { env } from "~/env.mjs";
import type { ProductLocal, ReviewLocal } from "~/types";

const dbRestConn = connect({ url: env.DATABASE_URL });

export const insertProductWithReviews = async (product: ProductLocal) => {
  const results = await dbRestConn.transaction(async (tx) => {
    const insertProdTransaction = await tx.execute(
      `INSERT INTO Product (createdAt, updatedAt, asin, title, price, originalPrice, starRating, numRatings, url, photo, slug)
      VALUES (NOW(), NOW(), ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
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
      ]
    );
    const insertReviewsTransaction = await tx.execute(
      `INSERT INTO Review (createdAt, updatedAt, productId, comment)
      VALUES ${Array.from(Array(product.reviews.length))
        .map(() => "(NOW(), NOW(), ?, ?)")
        .join(", ")};`,
      product.reviews
        .map((review) => [
          insertProdTransaction.insertId,
          review.comment.trim(),
        ])
        .flat()
    );
    return [insertProdTransaction, insertReviewsTransaction];
  });

  return results;
};

export const fetchProductWithReviewsFromDb = async (asin: string) => {
  const productQuery = await dbRestConn.execute(
    `SELECT * FROM Product WHERE asin = ?;`,
    [asin]
  );
  if (productQuery.rows.length === 0) return null;

  const product = productQuery.rows[0] as Product;

  const reviewsQuery = await dbRestConn.execute(
    `SELECT * FROM Review WHERE productId = ?;`,
    [product.id]
  );
  const reviews = reviewsQuery.rows as ReviewLocal[];

  if (reviews.length === 0) return null;

  (product as unknown as ProductLocal).reviews = reviews;

  return product as unknown as ProductLocal;
};
