import type { Prisma } from "@prisma/client";
import type { GetStaticProps } from "next";
import { log } from "next-axiom";
import Head from "next/head";
import Link from "next/link";
import { serializeError } from "serialize-error";
import { z } from "zod";
import { CompareComparisonImagesSmall } from "~/Components/CompareComparisonImages";
import { ContainerLevel1, ContainerLevel2 } from "~/Components/Containers";
import { RecentPagePagination } from "~/Components/RecentPagePagination";
import {
  MAX_PAGES_COUNT,
  MAX_PAGE_SIZE,
  SLUG_RAND_ID_SUFFIX_LENGTH,
  WebsiteName,
  revalidationTimersInSec,
} from "~/constants";
import { prisma } from "~/server/db";
import { parseComparison } from "~/utils/parseComparison";
import {
  createTitleFromSlug,
  formatDate,
  truncateProductTitle,
} from "~/utils/productUtils";

type Props = {
  comparisons: Prisma.ComparisonGetPayload<{
    include: { product1: true; product2: true };
  }>[];
  maxPageCount: number;
};

const ComparisonResult = ({
  comparison,
}: {
  comparison: Prisma.ComparisonGetPayload<{
    include: { product1: true; product2: true };
  }>;
}) => {
  const articleTitle = createTitleFromSlug(
    comparison.slug.slice(
      0,
      comparison.slug.length - SLUG_RAND_ID_SUFFIX_LENGTH
    )
  );
  return (
    <Link href={`/comparison/${comparison.slug}`}>
      <div className="my-1 flex w-full flex-row items-center rounded-xl border border-violet-200 bg-violet-50 p-2 shadow-md outline-1 sm:m-2">
        <div className="relative w-2/5 p-1 sm:p-2">
          <CompareComparisonImagesSmall
            prod1={comparison.product1}
            prod2={comparison.product2}
          />
        </div>
        <div className="flex w-3/5 flex-col pl-1 sm:pl-2">
          <h2 className="text-md mb-1 font-bold">{articleTitle}</h2>
          <p className="text-sm">
            {truncateProductTitle(
              parseComparison(comparison.comparisonText).conclusion,
              200
            )}
          </p>
          <div className="mt-2 flex flex-row justify-between px-2">
            <p className="text-sm text-gray-500">
              <time
                dateTime={comparison.updatedAt.toISOString()}
                className="font-bold text-gray-800"
              >
                {formatDate(comparison.updatedAt)}
              </time>
            </p>

            <span className="text-violet-900">Read more</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default function RecentComparisons({
  comparisons,
  maxPageCount,
}: Props) {
  const pageTitle = `Recent comparisons - ${WebsiteName}`;
  return (
    <ContainerLevel1>
      <Head>
        <title>{pageTitle}</title>
        <meta
          name="description"
          content={`Check out some of the recent comparisons on ${WebsiteName}.`}
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ContainerLevel2>
        <h1 className="text-3xl">Recent comparisons</h1>
        {comparisons.map((comparison) => (
          <ComparisonResult
            key={`${comparison.product1Asin}-${comparison.product2Asin}`}
            comparison={comparison}
          />
        ))}
        <RecentPagePagination maxPages={maxPageCount} />
      </ContainerLevel2>
    </ContainerLevel1>
  );
}

export const getStaticProps: GetStaticProps<Props> = async (context) => {
  try {
    const pgNum = parseInt(z.string().parse(context.params?.pageNum));
    const [maxPageCount, comparisons] = await Promise.all([
      getMaxPageCount(),
      prisma.comparison.findMany({
        skip: (pgNum - 1) * MAX_PAGE_SIZE,
        take: MAX_PAGE_SIZE,
        include: { product1: true, product2: true },
        orderBy: { updatedAt: "desc" },
      }),
    ]);

    return {
      props: { comparisons, maxPageCount },
      revalidate: revalidationTimersInSec.recentComparisons,
    };
  } catch (e) {
    log.error("getStaticProps error", serializeError(e));
    return { notFound: true };
  }
};

export const getStaticPaths = async () => {
  return {
    paths: Array.from(Array(await getMaxPageCount())).map((_, idx) => ({
      params: { pageNum: (idx + 1).toString() },
    })),
    fallback: false,
  };
};

async function getMaxPageCount() {
  const totalComparisons = await prisma.comparison.count();
  const maxPages = Math.min(
    Math.ceil(totalComparisons / MAX_PAGE_SIZE),
    MAX_PAGES_COUNT
  );
  return maxPages;
}
