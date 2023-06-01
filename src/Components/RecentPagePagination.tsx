// import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
import { useRouter } from "next/router";

const PaginationSingePage = ({ page }: { page: number }) => {
  const href = `/recent-comparisons/page/${page}`;
  const { asPath } = useRouter();
  const isActive = asPath === href;
  return (
    <Link
      href={href}
      className={`inline-flex h-8 w-8 items-center justify-center rounded text-sm shadow-md ${
        isActive ? "bg-violet-900 text-white" : "bg-gray-50 text-black"
      }`}
      title={`Page ${page}`}
    >
      {page}
    </Link>
  );
};

export const RecentPagePagination = ({ maxPages }: { maxPages: number }) => {
  return (
    <div className="flex justify-center space-x-1 text-gray-800">
      {/* <button
        title="previous"
        type="button"
        className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-gray-100 bg-gray-50 py-0 shadow-md"
      >
        <ChevronLeftIcon />
      </button> */}
      {Array.from(Array(maxPages)).map((_, i) => (
        <PaginationSingePage key={i} page={i + 1} />
      ))}

      {/* <button
        title="next"
        type="button"
        className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-gray-100 bg-gray-50 py-0 shadow-md"
      >
        <ChevronRightIcon />
      </button> */}
    </div>
  );
};
