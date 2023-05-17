import {
  CheckCircleIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/solid";
import type { Product } from "@prisma/client";
import { useHomeStore } from "~/state";
import type { ProductNum, ProductSearchData } from "~/types";
import { parseComparison } from "~/utils/parseComparison";
import {
  createProductSearchDataFromProduct,
  getAffiliateLinkFromProduct,
} from "~/utils/productUtils";

export const ComparisonResults = ({
  comparisonResult,
  product1,
  product2,
}: {
  comparisonResult: string;
  product1?: Product;
  product2?: Product;
}) => {
  const parsed = parseComparison(comparisonResult);
  const product1SearchData =
    product1 && createProductSearchDataFromProduct(product1);
  const product2SearchData =
    product2 && createProductSearchDataFromProduct(product2);
  return (
    <div className="mx-0 mt-8">
      <p className="whitespace-pre-line text-lg">{parsed.introduction}</p>
      <ProConList
        list={parsed.product1Pros}
        proOrCon="Pros"
        productNum="1"
        product={product1SearchData}
      />
      <ProConList
        list={parsed.product1Cons}
        proOrCon="Cons"
        productNum="1"
        product={product1SearchData}
      />
      <ProConList
        list={parsed.product2Pros}
        proOrCon="Pros"
        productNum="2"
        product={product2SearchData}
      />
      <ProConList
        list={parsed.product2Cons}
        proOrCon="Cons"
        productNum="2"
        product={product2SearchData}
      />
      <p className="whitespace-pre-line text-lg">{parsed.conclusion}</p>
    </div>
  );
};

const ProConList = ({
  proOrCon,
  list,
  productNum,
  product: productProp,
}: {
  proOrCon: "Pros" | "Cons";
  list: string[];
  productNum: ProductNum;
  product?: ProductSearchData;
}) => {
  const selectedProductForComparison = useHomeStore(
    (state) => state.selectedProductForComparison
  );
  const product = productProp || selectedProductForComparison[productNum];

  return list.length > 0 && product ? (
    <div className="mb-2 mt-4">
      {proOrCon === "Pros" && (
        <div className="flex flex-col md:flex-row">
          <a
            href={getAffiliateLinkFromProduct(product)}
            target="_blank"
            className="text-violet-600"
          >
            <h2 className="mb-1 text-lg font-bold">{product.product_title}</h2>
          </a>
          <a
            href={getAffiliateLinkFromProduct(product)}
            target="_blank"
            className="flex justify-center rounded-xl bg-violet-500 px-8 py-2.5 text-center align-middle text-sm text-white hover:bg-violet-700 md:ml-4 md:w-80"
          >
            <div className="flex items-center justify-center text-center">
              <span>
                {"Buy now on Amazon.com for "}
                <span className="font-bold">{product.product_price}</span>
                {/* TODO add product rating and review count inside the buy button */}
              </span>
            </div>
          </a>
        </div>
      )}
      <h3 className="text-md mb-2 font-bold">{proOrCon}</h3>
      <ul className="list-inside space-y-1 text-gray-700">
        {list.map((listItem) => (
          <li className="text-md flex items-center gap-1" key={listItem}>
            <div>
              {proOrCon === "Pros" ? (
                <CheckCircleIcon
                  width={15}
                  height={15}
                  className="text-green-800"
                />
              ) : (
                <ExclamationCircleIcon
                  width={15}
                  height={15}
                  className="text-red-700"
                />
              )}
            </div>
            {listItem}
          </li>
        ))}
      </ul>
    </div>
  ) : null;
};
