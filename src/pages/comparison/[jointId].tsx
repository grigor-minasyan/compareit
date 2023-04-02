import { type GetStaticPaths, type GetStaticProps } from "next";
import { revalidationTimersInSec } from "~/constants";
import { productIdsToTest, reviews } from "~/constants/productReviews";
import { productSearchResults } from "~/constants/productSearch";
import { runPrompt } from "~/server/openai";

import {
  createProductFromSearchDataAndReviews,
  doesProductDescriptionNeedToBeShortened,
} from "~/utils/productUtils";
import {
  generatePromptFromProducts,
  generatePromptToShortenProductDesc,
} from "~/utils/promptUtils";

type Param = {
  jointId: string;
};
type Props = {
  // product: Product;
  prompt: string;
} & Param;

export default function Comparison({ jointId, prompt }: Props) {
  return (
    <article>
      <h1 className="text-4xl">Article {jointId}</h1>

      <p className="whitespace-pre-line">{prompt}</p>
      {/* {JSON.stringify(product, null, 2)} */}
    </article>
  );
}

export const getStaticProps: GetStaticProps<Props> = async (context) => {
  const { jointId } = context.params as Param;
  if (jointId === "2") {
    return {
      notFound: true,
      revalidate: revalidationTimersInSec.jointComparison,
    };
  }

  const prod1 = productSearchResults.data.find(
    (p) => p.product_id === productIdsToTest[0]
  );
  const prod2 = productSearchResults.data.find(
    (p) => p.product_id === productIdsToTest[1]
  );
  if (!prod1 || !prod2) {
    return {
      notFound: true,
      revalidate: revalidationTimersInSec.jointComparison,
    };
  }

  const reviews1 = reviews[productIdsToTest[0]].data;
  const reviews2 = reviews[productIdsToTest[1]].data;

  if (doesProductDescriptionNeedToBeShortened(prod1)) {
    console.time("prompt1");
    try {
      prod1.description = await runPrompt(
        generatePromptToShortenProductDesc(prod1)
      );
    } catch (e) {
      console.error(e?.toString?.());
    }
    console.timeEnd("prompt1");
  }

  // if (doesProductDescriptionNeedToBeShortened(prod2)) {
  //   console.time("prompt2");
  //   prod2.description = await runPrompt(
  //     generatePromptToShortenProductDesc(prod2)
  //   );
  //   console.timeEnd("prompt2");
  // }
  const prod1Clean = createProductFromSearchDataAndReviews(prod1, reviews1);
  const prod2Clean = createProductFromSearchDataAndReviews(prod2, reviews1);

  const prompt = generatePromptFromProducts([prod1Clean, prod2Clean]);

  return {
    props: {
      jointId,
      prompt,
    },
    revalidate: revalidationTimersInSec.jointComparison,
  };
};

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: true,
  };
};
