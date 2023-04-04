import { type ChangeEventHandler, useState } from "react";

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
    <fieldset className="m-2 w-auto space-y-1 text-gray-800 md:w-full">
      <label htmlFor="Search" className="hidden">
        Search
      </label>
      <div className="relative">
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
          className="w-full rounded-xl bg-gray-100 py-3 pl-10 pr-4 text-sm text-gray-800 focus:border-violet-600 focus:bg-gray-50 focus:outline-violet-900"
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
      className={`my-2.5 w-full rounded-xl px-8 py-2 text-white md:w-80 ${
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
  productName,
  handleProductSelect,
}: {
  productName: string;
  handleProductSelect: (s: string) => void;
}) => {
  return (
    <div className="flex flex-row items-center">
      <div className="m-2 h-20 w-20 flex-shrink-0 ">
        <img
          src="https://picsum.photos/200/300"
          alt=""
          className="h-full w-full rounded bg-gray-500 object-cover object-center"
        />
      </div>
      <div className="flex flex-col">
        <h2 className="mb-1 text-lg font-bold">{productName}</h2>
        <p className="mb-0 text-sm">
          <span className="">Reviews:</span> 4,567
        </p>
        <p className="mb-0 text-sm">
          <span className="">Rating:</span> 4.5/5
        </p>
      </div>
      <button
        className={
          "rounded bg-violet-500 px-4 py-2 text-white hover:bg-violet-700"
        }
        onClick={() => handleProductSelect(productName)}
      >
        Select
      </button>
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
  const [product1name, setProduct1name] = useState("");
  const [product2name, setProduct2name] = useState("");
  const [product1Results, setProduct1Results] = useState([]);
  const [product2Results, setProduct2Results] = useState([]);
  const [loading, setLoading] = useState(false);
  const [comparisonResult, setComparisonResult] = useState(null);
  const isSearchDisabled = !product1name || !product2name;

  const handleSearchClick = () => {
    setLoading(true);
    // Add your code for product search here
    // Once the search is complete, you can set the products using setProduct1 and setProduct2
    setLoading(false);
  };

  const handleRunComparisonClick = () => {
    setLoading(true);
    // Add your code for comparison here
    // Once the comparison is complete, you can set the result using setComparisonResult
    setLoading(false);
  };

  const handleProduct1Select = (product) => {
    if (product === product1name) {
      setProduct1name(null);
    } else {
      setProduct1name(product);
    }
  };

  const handleProduct2Select = (product) => {
    if (product === product2name) {
      setProduct2name(null);
    } else {
      setProduct2name(product);
    }
  };

  return (
    <div className="container mx-auto">
      <div className="flex flex-col items-center py-8">
        <h1 className="mb-4 text-4xl font-bold">AI Product Compare</h1>
        <p className="mb-8 max-w-2xl text-center text-lg">
          {`Compare any two products using real reviews and ratings from users. Just enter the names of the products below and click "Search".`}
        </p>
        <div className="mb-4 flex w-full max-w-3xl flex-col align-middle md:flex-row">
          <SearchInput
            value={product1name}
            placeholder="Product 1"
            onChange={(e) => setProduct1name(e.target.value)}
          />
          <SearchInput
            value={product2name}
            placeholder="Product 2"
            onChange={(e) => setProduct2name(e.target.value)}
          />
          <SearchButton
            onClick={handleSearchClick}
            loading={loading}
            disabled={isSearchDisabled}
          />
        </div>
        {loading && <LoadingBar />}
        <div className="mb-4 mt-8 w-full">
          {product1name && (
            <SearchResult
              productName={product1name}
              handleProductSelect={handleProduct1Select}
            />
          )}
          {product2name && (
            <SearchResult
              productName={product2name}
              handleProductSelect={handleProduct2Select}
            />
          )}
          {product1name && product2name && (
            <button
              className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
              disabled={loading}
              onClick={handleRunComparisonClick}
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="mr-2">Progress Bar</div>
                  Running Comparison...
                </div>
              ) : (
                "Run Detailed Comparison"
              )}
            </button>
          )}
          {comparisonResult && (
            <div className="mt-8">
              <h2 className="mb-2 text-2xl font-bold">Comparison Result:</h2>
              <p className="max-w-xl text-lg">{comparisonResult}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
