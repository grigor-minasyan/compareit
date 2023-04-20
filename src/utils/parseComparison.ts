type Result = {
  introduction: string;
  product1Pros: string[];
  product1Cons: string[];
  product2Pros: string[];
  product2Cons: string[];
  conclusion: string;
};

const extractText = (regex: RegExp, text: string): string => {
  const result = regex.exec(text);
  return result?.[1] ? result[1].trim() : "Generating";
};

const extractList = (regex: RegExp, text: string): string[] => {
  const result = regex.exec(text);
  return result?.[1]
    ? result[1]
        .trim()
        .split("\n- ")
        .filter((x) => x)
    : ["Generating"];
};

export const parseComparison = (text: string) => {
  const introRegex = /Introduction:\n\n([\s\S]*?)\n\nProduct/;
  const product1ProsRegex = /Product 1:[\s\S]*?Pros:\n-([\s\S]*?)\n\nCons:/;
  const product1ConsRegex = /Product 1:[\s\S]*?Cons:\n-([\s\S]*?)\n\nProduct 2/;
  const product2ProsRegex = /Product 2:[\s\S]*?Pros:\n-([\s\S]*?)\n\nCons:/;
  const product2ConsRegex =
    /Product 2:[\s\S]*?Cons:\n-([\s\S]*?)\n\nConclusion/;
  const conclusionRegex = /Conclusion:\n\n([\s\S]*?)$/;

  const intro: string = extractText(introRegex, text);
  const product1Pros: string[] = extractList(product1ProsRegex, text);
  const product1Cons: string[] = extractList(product1ConsRegex, text);
  const product2Pros: string[] = extractList(product2ProsRegex, text);
  const product2Cons: string[] = extractList(product2ConsRegex, text);
  const conclusion: string = extractText(conclusionRegex, text);

  const result: Result = {
    introduction: intro,
    product1Pros: product1Pros,
    product1Cons: product1Cons,
    product2Pros: product2Pros,
    product2Cons: product2Cons,
    conclusion: conclusion,
  };

  return result;
};
