import type { ButtonHTMLAttributes, ReactNode } from "react";

export enum VariantNames {
  "primary" = "primary",
  "link" = "link",
}

export type Variant = "primary" | "link";

export type Size = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

export type CommonButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  children?: ReactNode;
  className?: string;
  fullWidth?: boolean;
  icon?: ReactNode;
  rightIcon?: ReactNode;
  loading?: boolean;
  link?: string;
  target?: "_self" | "_blank" | "_parent" | "_top" | "_unfencedTop";
  disabled?: boolean;
};
