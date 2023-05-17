import type { Prisma, Product } from "@prisma/client";
import type { GetStaticProps } from "next";
import { log } from "next-axiom";
import Head from "next/head";
import Image from "next/image";
import { serializeError } from "serialize-error";
import {
  ContainerForComparisonResults,
  ContainerLevel1,
  ContainerLevel2,
} from "~/Components/Containers";
import { ComparisonResults } from "~/Components/Homepage/ComparisonResults";
import {
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

const ImageComparisonSingle = ({ prod }: { prod: Product }) => {
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
      <div className="relative flex items-center justify-center px-2 py-4">
        <div className="absolute bottom-0 left-0 right-0 top-0 z-0 rotate-45 transform rounded-xl bg-violet-700"></div>
        <div className="relative z-10 text-3xl font-bold text-white">VS</div>
      </div>
      <ImageComparisonSingle prod={prod2} />
    </div>
  );
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
          <ImageComparison
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
    const { slug } = context.params as { slug: string };
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

export function getStaticPaths() {
  // We'll pre-render only these paths at build time.
  // { fallback: 'blocking' } will server-render pages
  // on-demand if the path doesn't exist.
  return { paths: [], fallback: "blocking" };
}
