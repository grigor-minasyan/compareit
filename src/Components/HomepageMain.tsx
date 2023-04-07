import { type ChangeEventHandler, useState } from "react";
import { StarIcon } from "@heroicons/react/24/solid";
import { api } from "~/utils/api";
import type { ProductSearchData } from "~/types";

const SearchInput = ({
  placeholder,
  value,
  onChange,
}: {
  placeholder: string;
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
}) => {
  return (
    <fieldset className="mx-0 my-1 w-auto text-gray-800 md:m-2 md:w-full">
      <label htmlFor="Search" className="hidden">
        Search
      </label>
      <div className="relative my-1">
        <span className="absolute inset-y-0 left-0 flex items-center pl-2">
          <button
            type="button"
            title="search"
            className="p-1 focus:outline-none focus:ring"
          >
            <svg
              fill="currentColor"
              viewBox="0 0 512 512"
              className="h-4 w-4 text-gray-800"
            >
              <path d="M479.6,399.716l-81.084-81.084-62.368-25.767A175.014,175.014,0,0,0,368,192c0-97.047-78.953-176-176-176S16,94.953,16,192,94.953,368,192,368a175.034,175.034,0,0,0,101.619-32.377l25.7,62.2L400.4,478.911a56,56,0,1,0,79.2-79.195ZM48,192c0-79.4,64.6-144,144-144s144,64.6,144,144S271.4,336,192,336,48,271.4,48,192ZM456.971,456.284a24.028,24.028,0,0,1-33.942,0l-76.572-76.572-23.894-57.835L380.4,345.771l76.573,76.572A24.028,24.028,0,0,1,456.971,456.284Z"></path>
            </svg>
          </button>
        </span>
        <input
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          type="search"
          name="Search"
          className="w-full rounded-xl bg-gray-100 py-3 pl-10 pr-4 text-sm text-gray-800 focus:bg-gray-50 focus:ring-violet-900"
        />
      </div>
    </fieldset>
  );
};

const SearchButton = ({
  onClick,
  loading,
  disabled,
}: {
  onClick: () => void;
  loading: boolean;
  disabled?: boolean;
}) => {
  return (
    <button
      className={`my-2 w-full rounded-xl px-8 py-2.5 text-white md:w-80 lg:my-0 ${
        disabled
          ? "cursor-not-allowed bg-gray-300"
          : "bg-violet-500 hover:bg-violet-700"
      }`}
      onClick={onClick}
      disabled={loading}
    >
      {loading ? "Searching..." : "Search"}
    </button>
  );
};

const SearchResult = ({
  product,
  isSelected,
  handleProductSelect,
}: {
  product: ProductSearchData;
  isSelected: boolean;
  handleProductSelect: (s: string) => void;
}) => {
  return (
    <div className="flex flex-row items-center">
      <div className="w-1/5 flex-shrink-0 p-2">
        <img
          src={product.product_photo}
          alt=""
          className="aspect-square h-full w-full rounded-xl border border-violet-900 bg-gray-500 bg-transparent object-contain object-center"
        />
      </div>
      <div className="flex w-3/5 flex-col">
        <h2 className="mb-1 truncate text-lg font-bold">
          {product.product_title}
        </h2>
        <div className="flex flex-row items-center">
          <StarIcon width={20} className="mr-1 text-violet-900" />
          <p>
            <span className="mb-0 mr-1 text-sm">
              {product.product_star_rating}
            </span>
            <span className="text-xs text-slate-400">{`(${product.product_num_ratings})`}</span>
          </p>
        </div>
      </div>
      <div className="flex w-1/5 flex-row justify-around">
        {isSelected ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-10 w-10 text-violet-500"
          >
            <path
              fillRule="evenodd"
              d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
              clipRule="evenodd"
            />
          </svg>
        ) : (
          <button
            className={
              "rounded bg-violet-500 px-4 py-2 text-white hover:bg-violet-700"
            }
            onClick={() => handleProductSelect(product.asin)}
          >
            Select
          </button>
        )}
      </div>
    </div>
  );
};

const LoadingBar = () => {
  return (
    <div className="mb-4 w-full">
      <div className="flex animate-pulse">
        <div className="flex-1">
          <div className="h-3 rounded bg-purple-600"></div>
        </div>
      </div>
    </div>
  );
};

export function HomePage() {
  const [prod1name, setProd1name] = useState("");
  const [prod2name, setProd2name] = useState("");

  const [product1Res, setProduct1Res] = useState<ProductSearchData[]>([]);
  const [product2Res, setProduct2Res] = useState<ProductSearchData[]>([]);

  const [product1SelectedId, setProduct1SelectedId] = useState("");
  const [product2SelectedId, setProduct2SelectedId] = useState("");

  const [comparisonResult, setComparisonResult] = useState("");
  const [isComparisonLoading, setIsComparisonRunning] = useState(false);
  const isSearchDisabled = !prod1name || !prod2name;
  const searchMut = api.home.searchProducts.useMutation({
    onSuccess(data) {
      data[0] && setProduct1Res(data[0]);
      data[1] && setProduct2Res(data[1]);
    },
  });
  const loading = searchMut.isLoading;

  const handleSearchClick = () => {
    searchMut.mutate({ prod1name, prod2name });
  };

  const handleRunComparisonClick = async () => {
    setIsComparisonRunning(true);
    setComparisonResult("");
    const response = await fetch("/api/generateComparison", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ids: [product1SelectedId, product2SelectedId] }),
    });
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    // This data is a ReadableStream
    const data = response.body;
    if (!data) {
      return;
    }
    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      setComparisonResult((prev) => prev + chunkValue);
    }
    setIsComparisonRunning(false);
  };

  return (
    <div className="container mx-auto">
      <div className="flex flex-col items-center py-8">
        <h1 className="mb-4 text-4xl font-bold">AI Product Compare</h1>
        <p className="mb-8 max-w-2xl text-center text-lg">
          {`Compare any two products using real reviews and ratings from users. Just enter the names of the products below and click "Search".`}
        </p>
        <div className="mb-4 flex w-full max-w-4xl flex-col align-middle md:flex-row md:items-center">
          <SearchInput
            value={prod1name}
            placeholder="Product 1"
            onChange={(e) => setProd1name(e.target.value)}
          />
          <SearchInput
            value={prod2name}
            placeholder="Product 2"
            onChange={(e) => setProd2name(e.target.value)}
          />
          <SearchButton
            onClick={handleSearchClick}
            loading={loading}
            disabled={isSearchDisabled}
          />
        </div>
        {loading && <LoadingBar />}
        <div className="my-4 w-full max-w-4xl">
          <div className="flex flex-row">
            {!!product1Res.length && (
              <div className="flex w-1/2 flex-col">
                <h2 className="mb-3 text-center text-2xl">Choose product 1</h2>
                {product1Res.map((product) => (
                  <SearchResult
                    isSelected={product.asin === product1SelectedId}
                    product={product}
                    key={product.asin}
                    handleProductSelect={setProduct1SelectedId}
                  />
                ))}
              </div>
            )}
            {!!product2Res.length && (
              <div className="flex w-1/2 flex-col">
                <h2 className="mb-3 text-center text-2xl">Choose product 2</h2>
                {product2Res.map((product) => (
                  <SearchResult
                    isSelected={product.asin === product2SelectedId}
                    product={product}
                    key={product.asin}
                    handleProductSelect={setProduct2SelectedId}
                  />
                ))}
              </div>
            )}
          </div>
          <div className="my-5 grid place-items-center">
            <button
              className="rounded-xl bg-violet-500 px-8 py-4 text-white hover:bg-violet-700 disabled:bg-gray-500"
              disabled={loading || !product1SelectedId || !product2SelectedId}
              onClick={() => {
                handleRunComparisonClick().catch(console.error);
              }}
            >
              Run Detailed Comparison
            </button>
            {isComparisonLoading && <LoadingBar />}
          </div>

          <div className="mt-8">
            <h2 className="mb-2 text-2xl font-bold">Comparison Result:</h2>
            <p className="whitespace-pre-wrap text-lg">{comparisonResult}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
