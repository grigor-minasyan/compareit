export type Review = {
  rating: number;
  comment: string;
};

export type Product = {
  id: string;
  title: string;
  slug: string;
  rating: number | null;
  description: string;
  reviews: Review[];
};

export type ProductSearchData = {
  product_id: string;
  product_title: string;
  product_description: string | null;
  product_photos: string[];
  product_rating: number | null;
  product_page_url: string;
  product_num_reviews: number;
  product_reviews_page_url: string;
  offer: {
    store_name: string;
    offer_page_url: string;
    price: string;
    // store_rating: number | null;
    // store_review_count: number;
    // store_reviews_page_url: string | null;
    // shipping: string | null;
    // tax: string;
    // on_sale: boolean;
    // original_price: string | null;
    // product_condition: string;
    [key: string]: unknown;
  };
  // product_offers_page_url: string;
  // product_specs_page_url: string;
  // typical_price_range: string[] | null;
  [key: string]: unknown;
};

export type ProductSearchResponse = {
  status: string;
  request_id: string;
  data: ProductSearchData[];
};

export type ReviewData = {
  review_id: string;
  review_text: string | null;
  rating: number;
  // review_title: string;
  // review_author: string;
  // review_source: string;
  // review_source_url: string;
  // review_datetime_utc: string;
  // review_language: string;
  // photos: [];
  [key: string]: unknown;
};

export type ReviewsResponse = {
  status: string;
  request_id: string;
  data: ReviewData[];
};
