import type { Prisma } from "@prisma/client";
import type { GetStaticPaths, GetStaticProps } from "next";
import { log } from "next-axiom";
import Head from "next/head";
import { serializeError } from "serialize-error";
import { CompareComparisonImagesLarge } from "~/Components/CompareComparisonImages";
import {
  ContainerForComparisonResults,
  ContainerLevel1,
  ContainerLevel2,
} from "~/Components/Containers";
import { ComparisonResults } from "~/Components/Homepage/ComparisonResults";
import {
  MAX_PAGES_COUNT,
  MAX_PAGE_SIZE,
  SLUG_RAND_ID_SUFFIX_LENGTH,
  WebsiteName,
  revalidationTimersInSec,
} from "~/constants";
import { prisma } from "~/server/db";
import { parseComparison } from "~/utils/parseComparison";
import { createTitleFromSlug, formatDate } from "~/utils/productUtils";

type Props = {
  comparison: Prisma.ComparisonGetPayload<{
    include: { product1: true; product2: true };
  }>;
};

type Params = {
  slug: string;
};

export default function Comparison({ comparison }: Props) {
  const articleTitle = createTitleFromSlug(
    comparison.slug.slice(
      0,
      comparison.slug.length - SLUG_RAND_ID_SUFFIX_LENGTH
    )
  );
  const pageTitle = `${articleTitle} - based on customer reviews - ${WebsiteName}`;

  const oldestProductUpdateDate =
    comparison.product1.updatedAt < comparison.product2.updatedAt
      ? comparison.product1.updatedAt
      : comparison.product2.updatedAt;

  return (
    <ContainerLevel1>
      <Head>
        <title>{pageTitle}</title>
        <meta
          name="description"
          content={parseComparison(comparison.comparisonText).introduction}
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ContainerLevel2>
        <ContainerForComparisonResults>
          <CompareComparisonImagesLarge
            prod1={comparison.product1}
            prod2={comparison.product2}
          />
          <h2 className="text-2xl">{articleTitle}</h2>
          <p className="mt-3 text-sm text-gray-500">
            Last updated on {/* dateModified = "2022-02-15" */}
            <time
              dateTime={oldestProductUpdateDate.toISOString()}
              className="font-bold text-gray-800"
            >
              {formatDate(oldestProductUpdateDate)}
            </time>
          </p>
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
  try {
    const { slug } = context.params as Params;
    if (!slug) return { notFound: true };
    const comparison = await prisma.comparison.findUnique({
      where: { slug },
      include: { product1: true, product2: true },
    });
    if (!comparison) return { notFound: true };

    return {
      props: { comparison },
      revalidate: revalidationTimersInSec.jointComparison,
    };
  } catch (error) {
    log.error("Error in /comparison getStaticPaths", serializeError(error));
    return { notFound: true };
  }
};

export const getStaticPaths: GetStaticPaths<Params> = async () => {
  const comparisonSlugs = await prisma.comparison.findMany({
    take: MAX_PAGE_SIZE * MAX_PAGES_COUNT,
    orderBy: { updatedAt: "desc" },
    select: { slug: true },
  });

  // We'll pre-render only these paths at build time.
  // { fallback: 'blocking' } will server-render pages
  // on-demand if the path doesn't exist.
  return {
    paths: comparisonSlugs.map(({ slug }) => ({
      params: { slug },
    })),
    fallback: "blocking",
  };
};
