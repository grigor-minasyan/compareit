import { env } from "~/env.mjs";
const ProductAdvertisingAPIv1 = require("paapi5-nodejs-sdk");
import { AMAZON_ASSOCIATES_ID } from "~/constants";

const defaultClient = ProductAdvertisingAPIv1.ApiClient.instance;
defaultClient.accessKey = env.PAAPI_ACCESS_KEY;
defaultClient.secretKey = env.PAAPI_SECRET_KEY;
defaultClient.host = "webservices.amazon.com";
defaultClient.region = "us-east-1";

const api = new ProductAdvertisingAPIv1.DefaultApi();

// Request Initialization

export const PAAPIProductSearch = async (query: string) => {
  const searchItemsRequest =
    new ProductAdvertisingAPIv1.SearchItemsRequest() as unknown as Record<
      string,
      unknown
    >;

  /** Enter your partner tag (store/tracking id) and partner type */
  searchItemsRequest["PartnerTag"] = AMAZON_ASSOCIATES_ID;
  searchItemsRequest["PartnerType"] = "Associates";

  /** Specify Keywords */
  searchItemsRequest["Keywords"] = query;

  /**
   * Specify the category in which search request is to be made
   * For more details, refer: https://webservices.amazon.com/paapi5/documentation/use-cases/organization-of-items-on-amazon/search-index.html
   */
  // searchItemsRequest["SearchIndex"] = "Books";

  /** Specify item count to be returned in search result */
  searchItemsRequest["ItemCount"] = 2;

  /**
   * Choose resources you want from SearchItemsResource enum
   * For more details, refer: https://webservices.amazon.com/paapi5/documentation/search-items.html#resources-parameter
   */
  searchItemsRequest["Resources"] = [
    "Images.Primary.Large",
    "ItemInfo.Title",
    "ItemInfo.TechnicalInfo",
    "ItemInfo.Features",
    "ItemInfo.Classifications",
    "ItemInfo.ContentInfo",
    "ItemInfo.ContentRating",

    "Offers.Listings.Price",
  ];

  try {
    const timer = Date.now();
    const rawData = await api.searchItems(searchItemsRequest);

    const searchItemsResponse =
      ProductAdvertisingAPIv1.SearchItemsResponse.constructFromObject(rawData);
    console.log("received response:");
    console.log(JSON.stringify(searchItemsResponse, null, 2));
    console.log(`took ${Date.now() - timer}ms`);
  } catch (error) {
    console.error("received error");
    console.error(error);
  }
};
