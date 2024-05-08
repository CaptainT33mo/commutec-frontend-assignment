import type { ReactNode } from "react";

type FieldTitleProps = {
  children: ReactNode;
};

const FieldTitle = ({ children }: FieldTitleProps) => (
  <span className="mb-1 ml-1 flex text-base text-black">{children}</span>
);

export default FieldTitle;
