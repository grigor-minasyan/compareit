import { useState, type FormEventHandler, useEffect } from "react";
import { api } from "~/utils/api";
import { useHomeStore } from "~/state";
import { SearchInput } from "./SearchInput";
import { SearchButton } from "./SearchButton";
import { SearchResultsWrapper } from "./SearchResultsWrapper";
import { TopCurves } from "./TopCurves";
import { LOADING_BAR_TEXTS, WebsiteName } from "~/constants";
import { ComparisonResults } from "./ComparisonResults";
import {
  ContainerLevel1,
  ContainerLevel2,
  ContainerForComparisonResults,
} from "../Containers";

const LoadingBar = () => {
  const [loadingTextIndex, setLoadingTextIndex] = useState(0);

  useEffect(() => {
    setTimeout(() => {
      setLoadingTextIndex((prev) => (prev + 1) % LOADING_BAR_TEXTS.length);
    }, 1500);
  }, [loadingTextIndex]);

  return (
    <div className="my-2 w-full">
      <div className="flex animate-pulse">
        <div className="flex-1">
          <div className="flex justify-center rounded bg-purple-600 p-1 text-white">
            {LOADING_BAR_TEXTS[loadingTextIndex]}
          </div>
        </div>
      </div>
    </div>
  );
};

export function HomePage() {
  const prod1name = useHomeStore((state) => state.productName["1"]);
  const prod2name = useHomeStore((state) => state.productName["2"]);
  const addErrorAlert = useHomeStore((state) => state.addErrorAlert);

  const setProductSearchResult = useHomeStore(
    (state) => state.setProductSearchResult
  );

  const selectedProductId = useHomeStore((state) => state.selectedProductId);
  const setSelectedProductForComparison = useHomeStore(
    (state) => state.setSelectedProductForComparison
  );

  const [comparisonResult, setComparisonResult] = useState("");
  const [isComparisonLoading, setIsComparisonRunning] = useState(false);
  const isSearchDisabled = !prod1name || !prod2name;
  const searchMut = api.home.searchProducts.useMutation({
    onSuccess(data) {
      setProductSearchResult("1", data[1]);
      setProductSearchResult("2", data[2]);
    },
    onError(error) {
      addErrorAlert(error.message);
    },
  });

  const handleSearchFormSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    searchMut.mutate({ prod1name, prod2name });
  };

  const handleRunComparisonClick = async () => {
    setIsComparisonRunning(true);
    setComparisonResult("");
    (["1", "2"] as const).forEach((productNum) =>
      setSelectedProductForComparison(productNum, selectedProductId[productNum])
    );
    const response = await fetch("/api/generateComparison", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prodId1: selectedProductId[1],
        prodId2: selectedProductId[2],
      }),
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || response.statusText);
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
    <ContainerLevel1>
      <TopCurves />
      <ContainerLevel2>
        <h1 className="mb-4 text-5xl font-bold">
          {WebsiteName.substring(0, WebsiteName.length - 2)}
          <span className="text-violet-900">
            {WebsiteName.substring(WebsiteName.length - 2)}
          </span>
        </h1>
        <p className="mb-8 max-w-2xl text-center text-lg">
          {`This tool helps you compare products based on their reviews. We pull real time Amazon.com reviews, analyze each product based on hundreds of reviews using AI, then we we provide you with a quick pros and cons list of each product.`}
        </p>
        <p className="mb-8 max-w-2xl text-center text-lg">
          {`Just enter the names of the products below and click "Search". After that, select the products you want to compare and click "Run Detailed Comparison".`}
        </p>
        <form
          onSubmit={handleSearchFormSubmit}
          className="mb-4 flex w-full max-w-4xl flex-col px-2 align-middle md:flex-row md:items-center md:px-0"
        >
          <SearchInput productNum="1" />
          <SearchInput productNum="2" />
          <SearchButton
            loading={searchMut.isLoading}
            disabled={isSearchDisabled}
          />
        </form>
        <ContainerForComparisonResults>
          <div className="flex flex-col lg:flex-row">
            <SearchResultsWrapper productNum="1" />
            <SearchResultsWrapper productNum="2" />
          </div>
          <div className="my-5 grid place-items-center">
            <button
              className="rounded-xl bg-violet-500 px-8 py-4 text-white hover:bg-violet-700 disabled:bg-gray-500"
              disabled={
                isComparisonLoading ||
                searchMut.isLoading ||
                !selectedProductId[1] ||
                !selectedProductId[2]
              }
              onClick={() => {
                handleRunComparisonClick().catch((e) => {
                  const errorMessage =
                    e instanceof Error
                      ? e.message
                      : "Something went wrong, please try again in a bit.";
                  addErrorAlert(errorMessage);
                  setIsComparisonRunning(false);
                });
              }}
            >
              Run Detailed Comparison
            </button>
            {(!selectedProductId[1] || !selectedProductId[2]) && (
              <label className="text-xs text-red-500">
                {"Please search and select two products to compare"}
              </label>
            )}
            {isComparisonLoading && <LoadingBar />}
          </div>

          {!!comparisonResult && (
            <ComparisonResults comparisonResult={comparisonResult} />
          )}
        </ContainerForComparisonResults>
      </ContainerLevel2>
    </ContainerLevel1>
  );
}
