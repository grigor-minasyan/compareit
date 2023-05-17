import {
  AMAZON_ASSOCIATES_ID,
  MIN_REVIEW_LENGTH_TO_SHORTEN,
  SLUG_RAND_ID_SUFFIX_LENGTH,
  TOKEN_LIMITS,
} from "~/constants";
import type {
  ProductLocal,
  ProductSearchData,
  ReviewSearchData,
} from "~/types";
import {
  calculateStringTokens,
  generatePromptForComparisonSlug,
  generatePromptToShortenReview,
} from "./promptUtils";
import { OpenAIDirect } from "./OpenAIStream";
import { log } from "next-axiom";
import { v4 as uuidV4 } from "uuid";

export const createProductFromSearchData = (
  product: ProductSearchData
): Omit<ProductLocal, "reviews" | "categorySlug"> => {
  return {
    asin: product.asin,
    title: product.product_title,
    price: product.product_price,
    originalPrice: product.product_original_price,
    starRating: product.product_star_rating,
    numRatings: product.product_num_ratings,
    url: product.product_url,
    photo: product.product_photo,
    slug: createSlugFromTitle(product.product_title),
  };
};

export const createProductSearchDataFromProduct = (
  product: Omit<ProductLocal, "reviews">
): ProductSearchData => {
  return {
    asin: product.asin,
    product_title: product.title,
    product_price: product.price,
    product_original_price: product.originalPrice,
    product_star_rating: product.starRating,
    product_num_ratings: product.numRatings,
    product_url: product.url,
    product_photo: product.photo,
  };
};

export const createSlugFromTitle = (title: string) => {
  return title
    .toLowerCase()
    .replace(/-/g, " ")
    .replace(/[^a-zA-Z0-9]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/[^a-z0-9]/g, "-");
};

export const createTitleFromSlug = (slug: string) => {
  return slug
    .replace(/-/g, " ")
    .replace(/[^a-zA-Z0-9]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export const shortenReviewIfNeeded = async (review: ReviewSearchData) => {
  if (review.review_comment.length > MIN_REVIEW_LENGTH_TO_SHORTEN) {
    review.review_comment = await OpenAIDirect(
      generatePromptToShortenReview(review.review_comment)
    );
  }
};

export const createComparisonSlugFromProducts = async (
  prod1: ProductLocal,
  prod2: ProductLocal
) => {
  const prompt = generatePromptForComparisonSlug(prod1, prod2);
  const slug = await OpenAIDirect(prompt);
  const cleanSlug =
    createSlugFromTitle(slug) +
    "-" +
    uuidV4().slice(-SLUG_RAND_ID_SUFFIX_LENGTH);
  return cleanSlug;
};

export const limitReviewsCount = (reviews: ReviewSearchData[]) => {
  let totalTokens = 0;
  const limitedReviews = reviews.reduce((acc: ReviewSearchData[], review) => {
    const tokens = calculateStringTokens(review.review_comment);
    if (totalTokens + tokens <= TOKEN_LIMITS.REVIEWS_TOTAL) {
      acc.push(review);
      totalTokens += tokens;
    }
    return acc;
  }, []);
  log.info(
    `Limited the number of reviews from ${reviews.length} to ${limitedReviews.length}`
  );

  return limitedReviews;
};

export const reviewsSortFromShortestToLongest = (
  a: ReviewSearchData,
  b: ReviewSearchData
) => a.review_comment.length - b.review_comment.length;

export const truncateProductTitle = (title: string, length = 100) => {
  return title.length > length ? title.slice(0, length) + "..." : title;
};

export const sortProdIdsInt = (a: number, b: number) => a - b;
export const sortProdIdsStr = (a: string, b: string) => a.localeCompare(b);

export const getStreamFromString = (str: string) => {
  const chunks: string[] = [];
  let remaining = str;
  while (remaining.length > 0) {
    const chunkLength = Math.floor(Math.random() * 15) + 10;
    chunks.push(remaining.slice(0, chunkLength));
    remaining = remaining.slice(chunkLength);
  }

  // creating a readable stream response from test array
  return new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      for (const str of chunks) {
        const data = encoder.encode(str);
        controller.enqueue(data);
        await new Promise((resolve) => setTimeout(resolve, 25));
      }
      controller.close();
    },
  });
};

export const formatDate = (date: Date) => {
  const dateObj = new Date(date);
  return dateObj.toLocaleString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export const getAffiliateLinkFromProduct = (product: ProductSearchData) => {
  const url = new URL(product.product_url);
  url.searchParams.set("linkCode", "ll1");
  url.searchParams.append("tag", AMAZON_ASSOCIATES_ID);
  url.searchParams.append("language", "en_US");
  url.searchParams.append("ref_", "as_li_ss_tl");
  url.searchParams.append("pd_rd_i", product.asin);
  return url.toString();
};

export const testAffiliateLinksTags = () => {
  const testLinks = [
    "https://www.amazon.com/Anker-Charger-Compact-Foldable-MacBook/dp/B09C5RG6KV?_encoding=UTF8&pd_rd_w=r1jDR&content-id=amzn1.sym.bc5f3394-3b4c-4031-8ac0-18107ac75816&pf_rd_p=bc5f3394-3b4c-4031-8ac0-18107ac75816&pf_rd_r=1ER02PVPRRKWBWWNZ58B&pd_rd_wg=Wvz80&pd_rd_r=5033de85-cc72-44ad-ae88-2844cdbe7b5a&linkCode=ll1&tag=compareit04f-20&linkId=3ccd2f3617636da6c43a4c6f8431d67b&language=en_US&ref_=as_li_ss_tl",

    "https://www.amazon.com/gp/buyagain?ie=UTF8&ats=eyJleHBsaWNpdENhbmRpZGF0ZXMiOiJCMDAwWEVWOVlFIiwiY3VzdG9tZXJJZCI6IkEyQ0U2NURVNDVDSSJ9&pd_rd_w=LP84P&content-id=amzn1.sym.f41ac46a-2e5b-47ac-8ccf-1f586e7327b2&pf_rd_p=f41ac46a-2e5b-47ac-8ccf-1f586e7327b2&pf_rd_r=0KS39HNAVVT7ZK9KB8Q4&pd_rd_wg=JJxjb&pd_rd_r=32f446c8-a169-4cef-b11a-66f1896867e8&linkCode=ll2&tag=compareit04f-20&linkId=9e0669182570f224362dcd68fd919151&language=en_US&ref_=as_li_ss_tl",

    "https://www.amazon.com/Ohm-Non-Drowsy-Fexofenadine-Antihistamine-Outdoor/dp/B0BBH6XFJH?pd_rd_w=Epy9C&content-id=amzn1.sym.724fac2e-0491-4f7a-a10d-2221f9a8bc9a&pf_rd_p=724fac2e-0491-4f7a-a10d-2221f9a8bc9a&pf_rd_r=B4YTHXR096ZYT37PWERV&pd_rd_wg=J2fj6&pd_rd_r=2bed4d0d-1f0c-4caa-93d8-09e459b6f098&pd_rd_i=B0BBH6XFJH&psc=1&linkCode=ll1&tag=compareit04f-20&linkId=688396851c0f2913f252f1bfcb94bc45&language=en_US&ref_=as_li_ss_tl",
    "https://www.amazon.com/dp/B09SVT92GW?psc=1&pd_rd_i=B09SVT92GW&pd_rd_w=avHnr&content-id=amzn1.sym.0d1092dc-81bb-493f-8769-d5c802257e94&pf_rd_p=0d1092dc-81bb-493f-8769-d5c802257e94&pf_rd_r=4BQ8PR8FTMD3GYHCV702&pd_rd_wg=a52R4&pd_rd_r=762df9fc-1806-4a4b-9956-a0d75491652a&s=hpc&sp_csd=d2lkZ2V0TmFtZT1zcF9kZXRhaWwy&linkCode=ll1&tag=compareit04f-20&linkId=fbdcc3d746f72d8083aa3383686a6fc1&language=en_US&ref_=as_li_ss_tl",
    "https://www.amazon.com/Valentines-Bath-Body-Basket-Women/dp/B07GBFT6Z3?pd_rd_w=QFvgG&content-id=amzn1.sym.77ae9c9a-9dda-41a8-ab9c-d9d0c450d72b&pf_rd_p=77ae9c9a-9dda-41a8-ab9c-d9d0c450d72b&pf_rd_r=EX41RFPD29F128E7R0D6&pd_rd_wg=bFo8U&pd_rd_r=ab10281d-5b08-49a1-b37a-2868d396b291&pd_rd_i=B07GBFT6Z3&linkCode=ll1&tag=compareit04f-20&linkId=9150f0bba118e4242b23b4de7e5afd2a&language=en_US&ref_=as_li_ss_tl",
    "https://www.amazon.com/Luxetique-Lavender-Baskets-Premium-Holiday/dp/B07C5MSTFP?pd_rd_w=QFvgG&content-id=amzn1.sym.77ae9c9a-9dda-41a8-ab9c-d9d0c450d72b&pf_rd_p=77ae9c9a-9dda-41a8-ab9c-d9d0c450d72b&pf_rd_r=EX41RFPD29F128E7R0D6&pd_rd_wg=bFo8U&pd_rd_r=ab10281d-5b08-49a1-b37a-2868d396b291&pd_rd_i=B07C5MSTFP&linkCode=ll1&tag=compareit04f-20&linkId=5a201bf8575c672143c1927dcb7b364f&language=en_US&ref_=as_li_ss_tl",
    "https://www.amazon.com/Birthday-Relaxing-Christmas-Coworker-Teacher/dp/B0BB4JLLR7?pd_rd_w=QFvgG&content-id=amzn1.sym.77ae9c9a-9dda-41a8-ab9c-d9d0c450d72b&pf_rd_p=77ae9c9a-9dda-41a8-ab9c-d9d0c450d72b&pf_rd_r=EX41RFPD29F128E7R0D6&pd_rd_wg=bFo8U&pd_rd_r=ab10281d-5b08-49a1-b37a-2868d396b291&pd_rd_i=B0BB4JLLR7&linkCode=ll1&tag=compareit04f-20&linkId=e30438e774262d3661d3b95d148b45a4&language=en_US&ref_=as_li_ss_tl",
  ];

  const params: Record<string, string[]> = {};
  testLinks.forEach((link) => {
    const url = new URL(link);
    console.log(
      url.searchParams.forEach((value, key) => {
        params[key] = params[key] || [];
        params[key]?.push(value);
      })
    );
  });
  console.log(JSON.stringify(params, null, 2));
};
