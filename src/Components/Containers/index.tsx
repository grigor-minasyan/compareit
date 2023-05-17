import type { ReactNode } from "react";

export const ContainerLevel1 = ({ children }: { children: ReactNode }) => {
  return <div className="mx-0 w-screen">{children}</div>;
};

export const ContainerLevel2 = ({ children }: { children: ReactNode }) => {
  return (
    <div className="container mx-auto flex flex-col items-center px-2 py-8">
      {children}
    </div>
  );
};

export const ContainerForComparisonResults = ({
  children,
}: {
  children: ReactNode;
}) => {
  return <div className="my-4 w-full max-w-4xl px-2">{children}</div>;
};
