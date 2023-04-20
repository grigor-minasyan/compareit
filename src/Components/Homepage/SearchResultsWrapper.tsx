import { useHomeStore } from "~/state";
import type { ProductNum } from "~/types";
import { SearchResult } from "./SearchResult";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

export const SearchResultsWrapper = ({
  productNum,
}: {
  productNum: ProductNum;
}) => {
  const productSearchResult = useHomeStore(
    (state) => state.productSearchResult[productNum]
  );
  const isCollapsed = useHomeStore(
    (state) => state.searchResultCollapsed[productNum]
  );
  const toggleCollapsed = useHomeStore(
    (state) => state.toggleSearchResultCollapsed
  );

  return !productSearchResult.length ? null : (
    <div
      className={`m-2 rounded-xl bg-slate-50 p-2 drop-shadow-2xl lg:w-1/2 ${
        isCollapsed ? "h-70" : ""
      }`}
    >
      <div className="sticky top-0 z-10 -mx-2 flex items-center justify-center gap-3 backdrop-blur-lg">
        <h2 className="mb-3 mt-3 text-center text-2xl text-violet-900">{`Choose product ${productNum}`}</h2>
        <button
          className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-900"
          onClick={() => toggleCollapsed(productNum)}
        >
          <ChevronDownIcon
            width={24}
            className={`pt-0.5 text-white transition-transform duration-500 ${
              isCollapsed ? "" : "-rotate-180"
            }`}
          />
        </button>
      </div>
      <div className={`${isCollapsed ? "h-0" : "h-full"} overflow-hidden`}>
        {productSearchResult.map((product) => (
          <SearchResult
            product={product}
            key={product.asin}
            productNum={productNum}
          />
        ))}
      </div>
    </div>
  );
};
