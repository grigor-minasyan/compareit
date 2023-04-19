import { useHomeStore } from "~/state";
import type { ProductNum } from "~/types";
import { SearchResult } from "./SearchResult";

export const SearchResultsWrapper = (props: { productNum: ProductNum }) => {
  const productSearchResult = useHomeStore(
    (state) => state.productSearchResult[props.productNum]
  );

  return !productSearchResult.length ? null : (
    <div className="m-2 flex flex-col rounded-xl bg-slate-50 p-2 drop-shadow-2xl lg:w-1/2">
      <div className="sticky top-0 z-10 -mx-2 backdrop-blur-lg">
        <h2 className="mb-3 mt-4 text-center text-2xl">{`Choose product ${props.productNum}`}</h2>
      </div>
      <div>
        {productSearchResult.map((product) => (
          <SearchResult
            product={product}
            key={product.asin}
            productNum={props.productNum}
          />
        ))}
      </div>
    </div>
  );
};
