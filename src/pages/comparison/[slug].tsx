import type { Prisma } from "@prisma/client";
import type { GetStaticProps } from "next";
import {
  ContainerForComparisonResults,
  ContainerLevel1,
  ContainerLevel2,
} from "~/Components/Containers";
import { ComparisonResults } from "~/Components/Homepage/ComparisonResults";
import { revalidationTimersInSec } from "~/constants";
import { prisma } from "~/server/db";

type Props = {
  comparison: Prisma.ComparisonGetPayload<{
    include: { product1: true; product2: true };
  }>;
};

export default function Comparison({ comparison }: Props) {
  return (
    <ContainerLevel1>
      <ContainerLevel2>
        <ContainerForComparisonResults>
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
