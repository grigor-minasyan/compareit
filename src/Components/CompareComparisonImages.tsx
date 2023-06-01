import type { Product } from "@prisma/client";
import Image from "next/image";

const ImageComparisonSingleLarge = ({ prod }: { prod: Product }) => {
  return (
    <div className="h-36 w-1/2 rounded-2xl bg-violet-100 p-2 sm:h-72">
      <Image
        className="z-20 h-full w-full rounded-xl bg-transparent object-contain object-center mix-blend-multiply"
        src={prod.photo}
        alt={prod.title}
        width={400}
        height={400}
      />
    </div>
  );
};

export const CompareComparisonImagesLarge = ({
  prod1,
  prod2,
}: {
  prod1: Product;
  prod2: Product;
}) => {
  return (
    <div className="mb-4 flex w-full  items-center justify-center">
      <ImageComparisonSingleLarge prod={prod1} />
      <div className="relative flex items-center justify-center px-2 py-4">
        <div className="absolute bottom-0 left-0 right-0 top-0 z-0 rotate-45 transform rounded-xl bg-violet-700"></div>
        <div className="relative z-10 text-3xl font-bold text-white">VS</div>
      </div>
      <ImageComparisonSingleLarge prod={prod2} />
    </div>
  );
};

const ImageComparisonSingleSmall = ({ prod }: { prod: Product }) => {
  return (
    <div className="h-24 w-1/2 rounded-2xl bg-violet-100 p-2">
      <Image
        className="z-20 h-full w-full rounded-xl bg-transparent object-contain object-center mix-blend-multiply"
        src={prod.photo}
        alt={prod.title}
        width={400}
        height={400}
      />
    </div>
  );
};

export const CompareComparisonImagesSmall = ({
  prod1,
  prod2,
}: {
  prod1: Product;
  prod2: Product;
}) => {
  return (
    <div className="flex w-full items-center justify-center">
      <ImageComparisonSingleSmall prod={prod1} />
      <div className="relative flex items-center justify-center px-1 py-2">
        <div className="absolute bottom-0 left-0 right-0 top-0 z-0 rotate-45 transform rounded-xl bg-violet-700"></div>
        <div className="relative z-10 text-sm font-bold text-white">VS</div>
      </div>
      <ImageComparisonSingleSmall prod={prod2} />
    </div>
  );
};
