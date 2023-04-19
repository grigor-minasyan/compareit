import type { ChangeEventHandler } from "react";

export const SearchInput = ({
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
        <span
          className="absolute inset-y-0 left-0 flex items-center pl-2"
          tabIndex={-1}
        >
          <button type="button" title="search" className="p-1" tabIndex={-1}>
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
