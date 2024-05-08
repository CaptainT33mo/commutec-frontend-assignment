import type { ReactNode } from "react";

type ErrorTextProps = {
  children: ReactNode;
  className?: string;
};

const ErrorText = ({ children, className = "" }: ErrorTextProps) => (
  <span className={`mt-1 h-4 text-xs text-red-500 ${className}`}>
    {children}
  </span>
);

export default ErrorText;
