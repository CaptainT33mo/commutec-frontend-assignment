import type { ReactNode, ReactElement } from "react";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";

type TooltipProps = {
  children: ReactElement;
  title?: ReactNode;
  className?: string;
  placement?: "auto" | "top" | "bottom" | "left" | "right";
  appendTo?: "parent" | Element | ((ref: Element) => Element);
};

const Tooltip = ({
  className = "",
  children,
  title,
  placement = "auto",
  appendTo = () => document.body,
  ...rest
}: TooltipProps) =>
  title ? (
    <Tippy
      content={title}
      className={className}
      placement={placement}
      interactive
      appendTo={appendTo}
      {...rest}
    >
      {children}
    </Tippy>
  ) : (
    children
  );

export default Tooltip;
