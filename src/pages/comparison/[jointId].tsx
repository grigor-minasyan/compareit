import { type GetStaticPaths, type GetStaticProps } from "next";
import { revalidationTimersInSec } from "~/constants";
import { type AmazonProduct, amazonProducts } from "~/constants/mockData";

type Param = {
  jointId: string;
};
type Props = {
  product: AmazonProduct;
} & Param;

export default function Comparison({ jointId, product }: Props) {
  return (
    <article>
      Article {jointId}
      {JSON.stringify(product, null, 2)}
    </article>
  );
}

export const getStaticProps: GetStaticProps = (context) => {
  const { jointId } = context.params as Param;
  if (jointId === "2") {
    return {
      notFound: true,
      revalidate: revalidationTimersInSec.jointComparison,
    };
  }

  return {
    props: { jointId, product: amazonProducts[0] },
    revalidate: revalidationTimersInSec.jointComparison,
  };
};

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: true,
  };
};
