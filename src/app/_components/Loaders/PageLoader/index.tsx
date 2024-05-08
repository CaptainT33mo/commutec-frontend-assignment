import { type ReactNode } from "react";
import Spinner from "../Spinner";

const PageLoader = ({
  className = "",
  text = "Getting Your Data Ready...",
}: {
  text?: ReactNode | string;
  className?: string;
}) => (
  <div
    className={`flex h-[80vh] w-full flex-col items-center justify-center gap-4 ${className}`}
  >
    <Spinner color="blue" theme="small" />
    <div className="text-xl">{text}</div>
  </div>
);

export default PageLoader;
