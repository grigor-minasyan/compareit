import { connect } from "@planetscale/database";
import type { Product, Review } from "@prisma/client";
import { env } from "~/env.mjs";
import type { ProductLocal, ProductWithReviews } from "~/types";
import { sortProdIdsInt } from "~/utils/productUtils";

const dbRestConn = connect({ url: env.DATABASE_URL });

export const insertProductWithReviews = async (product: ProductLocal) => {
  return dbRestConn.transaction(async (tx) => {
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

    const insertedProd = (
      await tx.execute(`SELECT * FROM Product WHERE id = ?;`, [
        insertProdTransaction.insertId,
      ])
    ).rows[0] as unknown as ProductWithReviews;

    const reviewsTx = await tx.execute(
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

    insertedProd.reviews = reviewsTx.rows as Review[];

    return insertedProd;
  });
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
  const reviews = reviewsQuery.rows as Review[];

  if (reviews.length === 0) return null;

  (product as unknown as ProductWithReviews).reviews = reviews;

  return product as ProductWithReviews;
};

export const insertComparison = async (
  prodId1: number,
  prodId2: number,
  comparisonText: string
) => {
  return dbRestConn.execute(
    `INSERT INTO Comparison (createdAt, updatedAt, product1Id, product2Id, comparisonText)
      VALUES (NOW(), NOW(), ?, ?, ?);`,
    [...[prodId1, prodId2].sort(sortProdIdsInt), comparisonText]
  );
};
