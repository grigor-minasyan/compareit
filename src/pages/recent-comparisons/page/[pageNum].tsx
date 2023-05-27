import type { Prisma } from "@prisma/client";
import type { GetStaticProps } from "next";
import { log } from "next-axiom";
import Head from "next/head";
import { serializeError } from "serialize-error";
import { z } from "zod";
import { ContainerLevel1, ContainerLevel2 } from "~/Components/Containers";
import { MAX_PAGES, MAX_PAGE_SIZE, WebsiteName } from "~/constants";
import { prisma } from "~/server/db";

type Props = {
  comparisons: Prisma.ComparisonGetPayload<{
    include: { product1: true; product2: true };
  }>[];
  maxPageCount: number;
};

export default function RecentComparisons(props: Props) {
  console.log(props);
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
        orderBy: { createdAt: "desc" },
      }),
    ]);

    return {
      props: { comparisons, maxPageCount },
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
    MAX_PAGES
  );
  return maxPages;
}
