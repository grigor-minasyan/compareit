import { StarIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import { useHomeStore } from "~/state";
import type { ProductNum, ProductSearchData } from "~/types";
import { truncateProductTitle } from "~/utils/productUtils";

export const SearchResult = ({
  product,
  productNum,
}: {
  product: ProductSearchData;
  productNum: ProductNum;
}) => {
  const selectedProdId = useHomeStore(
    (state) => state.selectedProductId[productNum]
  );
  const isSelected = selectedProdId === product.asin;
  const handleSelect = useHomeStore((state) => state.setSelectedProductId);
  return (
    <div
      onClick={() => handleSelect(productNum, product.asin)}
      className="my-1 flex flex-row items-center rounded-xl border border-violet-200 bg-violet-50 p-1 outline-1 sm:m-2"
    >
      <div className="relative h-20 w-1/5 flex-shrink-0 p-1 sm:p-2">
        <Image
          width={75}
          height={75}
          priority={true}
          src={product.product_photo}
          alt={product.product_title}
          className="aspect-square h-full w-full rounded-xl bg-transparent object-cover object-center"
        />
      </div>
      <div className="flex w-3/5 flex-col pl-1 sm:pl-2">
        <h2 className="mb-1  text-sm font-bold">
          {truncateProductTitle(product.product_title)}
        </h2>
        <div className="flex flex-row items-center">
          <StarIcon width={20} className="mr-1 text-violet-900" />
          <span className="mb-0 mr-1 text-sm">
            {product.product_star_rating}
          </span>
          <span className="mr-2 text-xs text-slate-400">{`(${product.product_num_ratings})`}</span>
          <span className="mr-1 text-sm font-bold text-violet-900">{`${product.product_price}`}</span>
          {product.product_original_price && (
            <span className="text-xs text-slate-400 line-through">{`${product.product_original_price}`}</span>
          )}
        </div>
      </div>
      <div className="flex w-1/5 flex-row justify-around">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className={`h-10 w-10 ${
            isSelected ? "text-violet-500" : "text-slate-400"
          }`}
          onClick={() => handleSelect(productNum, product.asin)}
        >
          <path
            fillRule="evenodd"
            d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    </div>
  );
};
