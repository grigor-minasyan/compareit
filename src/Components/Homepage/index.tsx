import { useState, type FormEventHandler } from "react";
import { api } from "~/utils/api";
import { useHomeStore } from "~/state";
import { SearchInput } from "./SearchInput";
import { SearchButton } from "./SearchButton";
import { SearchResultsWrapper } from "./SearchResultsWrapper";

const LoadingBar = () => {
  return (
    <div className="my-2 w-full">
      <div className="flex animate-pulse">
        <div className="flex-1">
          <div className="h-3 rounded bg-purple-600"></div>
        </div>
      </div>
    </div>
  );
};

export function HomePage() {
  const prod1name = useHomeStore((state) => state.productName["1"]);
  const prod2name = useHomeStore((state) => state.productName["2"]);
  const setProductName = useHomeStore((state) => state.setProductName);

  const setProductSearchResult = useHomeStore(
    (state) => state.setProductSearchResult
  );

  const selectedProductId = useHomeStore((state) => state.selectedProductId);

  const [comparisonResult, setComparisonResult] = useState("");
  const [isComparisonLoading, setIsComparisonRunning] = useState(false);
  const isSearchDisabled = !prod1name || !prod2name;
  const searchMut = api.home.searchProducts.useMutation({
    onSuccess(data) {
      data[0] && setProductSearchResult("1", data[0]);
      data[1] && setProductSearchResult("2", data[1]);
    },
  });

  const handleSearchFormSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
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
      body: JSON.stringify({
        ids: [selectedProductId[1], selectedProductId[2]],
      }),
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
        <form
          onSubmit={handleSearchFormSubmit}
          className="mb-4 flex w-full max-w-4xl flex-col px-2 align-middle md:flex-row md:items-center md:px-0"
        >
          <SearchInput
            value={prod1name}
            placeholder="Product 1"
            onChange={(e) => setProductName("1", e.target.value)}
          />
          <SearchInput
            value={prod2name}
            placeholder="Product 2"
            onChange={(e) => setProductName("2", e.target.value)}
          />
          <SearchButton
            loading={searchMut.isLoading}
            disabled={isSearchDisabled}
          />
        </form>
        <div className="my-4 w-full max-w-4xl">
          <div className="flex flex-col lg:flex-row">
            {/* //clean up this or use it <SearchResultDropdown /> */}
            <SearchResultsWrapper productNum="1" />
            <SearchResultsWrapper productNum="2" />
          </div>
          <div className="my-5 grid place-items-center">
            <button
              className="rounded-xl bg-violet-500 px-8 py-4 text-white hover:bg-violet-700 disabled:bg-gray-500"
              disabled={
                searchMut.isLoading ||
                !selectedProductId[1] ||
                !selectedProductId[2]
              }
              onClick={() => {
                handleRunComparisonClick().catch((e) => {
                  console.error(e);
                  setIsComparisonRunning(false);
                });
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
