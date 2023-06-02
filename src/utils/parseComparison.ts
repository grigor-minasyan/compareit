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
  return result?.[1] ? result[1].trim() : "Analyzing reviews...";
};

const extractList = (regex: RegExp, text: string): string[] => {
  const result = regex.exec(text);
  return result?.[1]
    ? result[1]
        .trim()
        .split(/\n\s*-\s*/)
        .filter((x) => x)
    : ["Analyzing reviews..."];
};

export const parseComparison = (text: string) => {
  const introRegex = /Introduction:([\s\S]*?)(?=\n([^a-zA-Z\d]*?)Product|$)/;
  const product1ProsRegex =
    /Product 1:[\s\S]*?Pros:\n\s*-\s+([\s\S]*?)(?=\n([^a-zA-Z\d]*?)Cons|$)/;
  const product1ConsRegex =
    /Product 1:[\s\S]*?Cons:\n\s*-\s+([\s\S]*?)(?=\n([^a-zA-Z\d]*?)Product 2|$)/;
  const product2ProsRegex =
    /Product 2:[\s\S]*?Pros:\n\s*-\s+([\s\S]*?)(?=\n([^a-zA-Z\d]*?)Cons|$)/;
  const product2ConsRegex =
    /Product 2:[\s\S]*?Cons:\n\s*-\s+([\s\S]*?)(?=\n([^a-zA-Z\d]*?)Conclusion|$)/;
  const conclusionRegex = /Conclusion:([\s\S]*?)(?=$|$)/;

  const intro = extractText(introRegex, text);
  const product1Pros = extractList(product1ProsRegex, text);
  const product1Cons = extractList(product1ConsRegex, text);
  const product2Pros = extractList(product2ProsRegex, text);
  const product2Cons = extractList(product2ConsRegex, text);
  const conclusion = extractText(conclusionRegex, text);

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

export const checkFaultyComparison = (text: string) => {
  const parsed = parseComparison(text);
  return (
    parsed.introduction.length < 100 ||
    parsed.product1Pros.length < 2 ||
    parsed.product1Cons.length < 2 ||
    parsed.product2Pros.length < 2 ||
    parsed.product2Cons.length < 2 ||
    parsed.conclusion.length < 100
  );
};
