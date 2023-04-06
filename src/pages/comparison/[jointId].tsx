import { type GetStaticPaths, type GetStaticProps } from "next";
import { AMAZON_STORE_ID, revalidationTimersInSec } from "~/constants";
import { runPrompt } from "~/server/openai";
import {
  runFilteredProductSearch,
  runFilteredReviewSearch,
} from "~/server/productApi";

import { createProductFromSearchDataAndReviews } from "~/utils/productUtils";
import { generatePromptFromProducts } from "~/utils/promptUtils";

type Param = {
  jointId: string;
};
type Props = {
  // product: Product;
  prompt: string;
  summary: string;
} & Param;

export default function Comparison({ jointId, prompt, summary }: Props) {
  return (
    <article>
      <h1 className="text-4xl">Article {jointId}</h1>

      <p className="whitespace-pre-line">{prompt}</p>
      <p className="whitespace-pre-line">{summary}</p>
      {/* {JSON.stringify(product, null, 2)} */}
    </article>
  );
}

export const getStaticProps: GetStaticProps<Props> = async (context) => {
  const { jointId } = context.params as Param;
  if (!jointId || !jointId.includes("-vs-")) {
    return { notFound: true };
  }

  // split the jointId into two productIds split by -vs-
  const productIds = jointId.split("-vs-");
  if (productIds.length !== 2) {
    return { notFound: true };
  }
  productIds.sort((a, b) => a.localeCompare(b));
  const [prodId1, prodId2] = productIds;
  if (!prodId1 || !prodId2) {
    return { notFound: true };
  }
  const prodSearchResult = await runFilteredProductSearch("test");

  const prod1 = prodSearchResult.find((p) => p.asin === prodId1);
  const prod2 = prodSearchResult.find((p) => p.asin === prodId2);
  if (!prod1 || !prod2) {
    return {
      notFound: true,
      revalidate: revalidationTimersInSec.jointComparison,
    };
  }

  const [reviews1, reviews2] = await Promise.all([
    runFilteredReviewSearch(prodId1),
    runFilteredReviewSearch(prodId2),
  ]);

  const prod1Clean = createProductFromSearchDataAndReviews(
    prod1,
    reviews1,
    AMAZON_STORE_ID
  );
  const prod2Clean = createProductFromSearchDataAndReviews(
    prod2,
    reviews2,
    AMAZON_STORE_ID
  );

  const prompt = generatePromptFromProducts([prod1Clean, prod2Clean]);

  const summary = await runPrompt(prompt);

  return {
    props: {
      jointId,
      prompt,
      summary,
    },
    revalidate: revalidationTimersInSec.jointComparison,
  };
};

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};
