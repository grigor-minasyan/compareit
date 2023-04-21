import { parseComparison } from "~/utils/parseComparison";

export const ComparisonResults = ({
  comparisonResult,
}: {
  comparisonResult: string;
}) => {
  const parsed = parseComparison(comparisonResult);

  return (
    <div className="mt-8">
      <h2 className="mb-2 text-2xl font-bold">
        Here is the comparison result after analyzing the reviews
      </h2>
      <p className="whitespace-pre-line text-lg">{parsed.introduction}</p>
      <ProConList list={parsed.product1Pros} proOrCon="Pros" />
      <ProConList list={parsed.product1Cons} proOrCon="Cons" />
      <ProConList list={parsed.product2Pros} proOrCon="Pros" />
      <ProConList list={parsed.product2Cons} proOrCon="Cons" />
      <p className="whitespace-pre-line text-lg">{parsed.conclusion}</p>
    </div>
  );
};

const ProConList = ({
  proOrCon,
  list,
}: {
  proOrCon: "Pros" | "Cons";
  list: string[];
}) => {
  return list.length > 0 ? (
    <div className="mb-2 mt-4">
      <h3 className="mb-2 text-xl font-bold">{proOrCon}</h3>
      <ul className="list-inside list-disc">
        {list.map((listItem) => (
          <li key={listItem}>{listItem}</li>
        ))}
      </ul>
    </div>
  ) : null;
};
