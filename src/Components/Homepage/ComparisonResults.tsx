import {
  CheckCircleIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/solid";
import { useHomeStore } from "~/state";
import type { ProductNum } from "~/types";
import { parseComparison } from "~/utils/parseComparison";
import { truncateProductTitle } from "~/utils/productUtils";

export const ComparisonResults = ({
  comparisonResult,
}: {
  comparisonResult: string;
}) => {
  const parsed = parseComparison(comparisonResult);

  return (
    <div className="mx-1 mt-8">
      <h2 className="mb-2 text-2xl font-bold">
        Here is the comparison result after analyzing the reviews
      </h2>
      <p className="whitespace-pre-line text-lg">{parsed.introduction}</p>
      <ProConList list={parsed.product1Pros} proOrCon="Pros" productNum="1" />
      <ProConList list={parsed.product1Cons} proOrCon="Cons" productNum="1" />
      <ProConList list={parsed.product2Pros} proOrCon="Pros" productNum="2" />
      <ProConList list={parsed.product2Cons} proOrCon="Cons" productNum="2" />
      <p className="whitespace-pre-line text-lg">{parsed.conclusion}</p>
    </div>
  );
};

const ProConList = ({
  proOrCon,
  list,
  productNum,
}: {
  proOrCon: "Pros" | "Cons";
  list: string[];
  productNum: ProductNum;
}) => {
  const selectedProductForComparison = useHomeStore(
    (state) => state.selectedProductForComparison
  );
  const product = selectedProductForComparison[productNum];

  return list.length > 0 && product ? (
    <div className="mb-2 mt-4">
      <h2 className="mb-1 text-lg font-bold">
        {truncateProductTitle(product.product_title)}
      </h2>
      <h3 className="text-md mb-2 font-bold">{proOrCon}</h3>
      <ul className="list-inside space-y-1 text-gray-700">
        {list.map((listItem) => (
          <li className="text-md flex items-center gap-1" key={listItem}>
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
            {listItem}
          </li>
        ))}
      </ul>
    </div>
  ) : null;
};
