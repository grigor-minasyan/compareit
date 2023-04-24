export const SearchButton = ({
  loading,
  disabled,
}: {
  loading: boolean;
  disabled?: boolean;
}) => {
  return (
    <div
      className={`w-full pt-2 md:px-2 md:pt-0 ${
        loading ? "animate-pulse" : ""
      }`}
    >
      <button
        type="submit"
        className={`w-full rounded-xl bg-violet-500 px-8 py-2.5 text-white hover:bg-violet-700 disabled:bg-gray-500 md:w-80`}
        disabled={loading || disabled}
      >
        {loading ? "Searching..." : "Search"}
      </button>
    </div>
  );
};
