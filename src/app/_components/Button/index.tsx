import { forwardRef } from "react";
import type { ForwardRefRenderFunction } from "react";
import Link from "next/link";
import { MdRefresh } from "react-icons/md";
import { buttonStyles, buttonSizes } from "./utils/getClasses";
import type { CommonButtonProps } from "./types";

const linkVariants = ["link"];
const Button: ForwardRefRenderFunction<
  HTMLButtonElement | HTMLAnchorElement,
  CommonButtonProps
> = (
  {
    variant = "primary",
    size = "md",
    icon,
    rightIcon,
    children,
    className = "",
    disabled,
    loading,
    link,
    fullWidth,
    target = "_self",
    ...rest
  }: CommonButtonProps,
  ref,
) => {
  const { baseClass, hoverClass, focusedClass, disabledClass } =
    buttonStyles[variant];
  const { paddingClass, textClass } = buttonSizes[size];
  const iconMarginClass = size === "sm" || size === "md" ? "mr-1" : "mr-2";
  const rightIconMarginClass = size === "sm" || size === "md" ? "ml-1" : "ml-2";

  if (link) {
    return (
      <Link href={link} passHref legacyBehavior>
        {/* @ts-expect-error need to do proper type conversion for HTMLAnchorElement */}
        <a
          type="button"
          ref={ref as React.RefObject<HTMLAnchorElement>}
          className={`flex ${fullWidth ? "w-full" : "min-w-fit"} items-center justify-center no-underline transition-all hover:no-underline ${
            disabled ? disabledClass : hoverClass
          } ${textClass} ${
            linkVariants.includes(variant) ? "" : paddingClass
          } ${baseClass} ${focusedClass} ${className}`}
          target={target}
          rel="noreferrer"
          {...rest}
        >
          {!loading && icon && (
            <span className={`${children ? iconMarginClass : ""}`}>{icon}</span>
          )}
          {loading && (
            <span className={`animate-spin ${children ? iconMarginClass : ""}`}>
              <MdRefresh />
            </span>
          )}
          {children}
          {!loading && rightIcon && (
            <span className={`${children ? rightIconMarginClass : ""}`}>
              {rightIcon}
            </span>
          )}
        </a>
      </Link>
    );
  }

  return (
    <button
      ref={ref as React.RefObject<HTMLButtonElement>}
      type="button"
      className={`flex ${fullWidth ? "w-full" : "min-w-fit"} items-center justify-center transition-all ${
        disabled ? disabledClass : hoverClass
      } ${textClass} ${
        linkVariants.includes(variant) ? "" : paddingClass
      } ${baseClass} ${focusedClass} ${className}`}
      {...rest}
      disabled={disabled}
    >
      {!loading && icon && (
        <span className={`${children ? iconMarginClass : ""}`}>{icon}</span>
      )}
      {loading && (
        <span className={`animate-spin ${children ? iconMarginClass : ""}`}>
          <MdRefresh />
        </span>
      )}
      {children}
      {!loading && rightIcon && (
        <span className={`${children ? rightIconMarginClass : ""}`}>
          {rightIcon}
        </span>
      )}
    </button>
  );
};

export default forwardRef(Button);
