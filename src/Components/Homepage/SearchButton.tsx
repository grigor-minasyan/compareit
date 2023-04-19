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
        className={`w-full rounded-xl px-8 py-2.5 text-white md:w-80 ${
          disabled
            ? "cursor-not-allowed bg-gray-300"
            : "bg-violet-500 hover:bg-violet-700"
        }`}
        disabled={loading}
      >
        {loading ? "Searching..." : "Search"}
      </button>
    </div>
  );
};
