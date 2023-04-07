import { type GetStaticPaths, type GetStaticProps } from "next";
import { revalidationTimersInSec } from "~/constants";

type Param = {
  jointId: string;
};
type Props = {
  // product: Product;
  // prompt: string;
  // summary: string;
} & Param;

export default function Comparison({ jointId }: Props) {
  return (
    <article>
      <h1 className="text-4xl">Article {jointId}</h1>

      {/* {JSON.stringify(product, null, 2)} */}
    </article>
  );
}

export const getStaticProps: GetStaticProps<Props> = (context) => {
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
    fallback: "blocking",
  };
};
