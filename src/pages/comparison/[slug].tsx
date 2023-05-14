import type { Prisma, Product } from "@prisma/client";
import type { GetStaticProps } from "next";
import Image from "next/image";
import {
  ContainerForComparisonResults,
  ContainerLevel1,
  ContainerLevel2,
} from "~/Components/Containers";
import { ComparisonResults } from "~/Components/Homepage/ComparisonResults";
import { revalidationTimersInSec } from "~/constants";
import { prisma } from "~/server/db";
import { truncateProductTitle } from "~/utils/productUtils";

type Props = {
  comparison: Prisma.ComparisonGetPayload<{
    include: { product1: true; product2: true };
  }>;
};

const ImageComparisonSingle = ({ prod }: { prod: Product }) => {
  return (
    <div className="">
      <Image
        className="z-20 p-2 mix-blend-multiply"
        src={prod.photo}
        alt={prod.title}
        width={400}
        height={400}
      />
    </div>
  );
};

const ImageComparison = ({
  prod1,
  prod2,
}: {
  prod1: Product;
  prod2: Product;
}) => {
  return (
    <div className="mb-4 flex w-full  items-center justify-center">
      <ImageComparisonSingle prod={prod1} />
      <div className="relative flex items-center justify-center px-2 py-8">
        <div className="absolute bottom-0 left-0 right-0 top-0 z-0 rotate-45 transform rounded-xl bg-violet-700"></div>
        <div className="relative z-10 text-3xl font-bold text-white">VS</div>
      </div>
      <ImageComparisonSingle prod={prod2} />
    </div>
  );
};

export default function Comparison({ comparison }: Props) {
  return (
    <ContainerLevel1>
      <ContainerLevel2>
        <ContainerForComparisonResults>
          <ImageComparison
            prod1={comparison.product1}
            prod2={comparison.product2}
          />
          <h2 className="text-2xl">
            {`${truncateProductTitle(
              comparison.product1.title,
              50
            )} vs ${truncateProductTitle(comparison.product2.title, 50)}`}
          </h2>
          <article>
            {/* <h1 className="text-4xl"></h1> */}

            <ComparisonResults
              comparisonResult={comparison.comparisonText}
              product1={comparison.product1}
              product2={comparison.product2}
            />
          </article>
        </ContainerForComparisonResults>
      </ContainerLevel2>
    </ContainerLevel1>
  );
}

export const getStaticProps: GetStaticProps<Props> = async (context) => {
  const { slug } = context.params as { slug: string };
  if (!slug) return { notFound: true };

  const comparison = await prisma.comparison.findUnique({
    where: { slug },
    include: { product1: true, product2: true },
  });
  if (!comparison) return { notFound: true };

  return {
    props: {
      // comparison: JSON.parse(JSON.stringify(comparison)) as Props["comparison"],
      comparison: comparison,
    },
    revalidate: revalidationTimersInSec.jointComparison,
  };
};

export function getStaticPaths() {
  // We'll pre-render only these paths at build time.
  // { fallback: 'blocking' } will server-render pages
  // on-demand if the path doesn't exist.
  return { paths: [], fallback: "blocking" };
}
