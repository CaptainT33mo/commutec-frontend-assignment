import { forwardRef, useState } from "react";
import type { ForwardRefRenderFunction, InputHTMLAttributes } from "react";
import {
  MdInfoOutline,
  MdOutlineVisibility,
  MdOutlineVisibilityOff,
} from "react-icons/md";
import Button from "../Button";
import Tooltip from "../Tooltip";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
  inline?: boolean;
  info?: string;
}

const Input: ForwardRefRenderFunction<HTMLInputElement, InputProps> = (
  {
    className = "",
    hasError,
    disabled,
    inline = false,
    info = "",
    ...props
  }: InputProps,
  ref,
) => {
  const [showPassword, setShow] = useState<boolean>(false);
  const defaultBorderClass = inline
    ? hasError && !disabled
      ? "border-b-red-500"
      : "border-b-primary-light outline-none"
    : hasError && !disabled
      ? "border-red-500"
      : "border-primary-light outline-none";

  const hoverBorderClass = inline
    ? hasError
      ? "focus:border-b-red-500 border-b outline-none"
      : "hover:border-b-gray-400 focus:border-b-black border-b outline-none"
    : hasError
      ? "focus:border-red-500 outline-none"
      : "hover:border-gray-400 focus:border-black  outline-none";
  const baseInputClasses = inline
    ? "border-b-black border-b-2 focus:border-b-black outline-none bg-transparent"
    : "w-full h-11 pl-3 pr-5 py-3 bg-white text-black rounded-lg font-medium focus:outline-0 border outline-none";
  return (
    <div
      className={`${
        inline
          ? "inline"
          : "relative flex w-full items-center justify-center gap-2"
      }`}
    >
      <input
        ref={ref}
        className={`${baseInputClasses} transition-all ${
          inline ? "" : "grow pr-7"
        } ${defaultBorderClass} 
  ${!disabled ? hoverBorderClass : ""} ${
    disabled ? "!cursor-not-allowed" : ""
  } ${className}`}
        {...props}
        type={showPassword && props.type === "password" ? "text" : props.type}
      />
      {props.type === "password" && (
        <Tooltip title={showPassword ? "Hide" : "Show"}>
          <Button
            variant="link"
            className="text-tertiary-light dark:text-tertiary-dark absolute right-2"
            onClick={() => setShow((prev) => !prev)}
            icon={
              showPassword ? (
                <MdOutlineVisibilityOff />
              ) : (
                <MdOutlineVisibility />
              )
            }
          />
        </Tooltip>
      )}
      {info && (
        <Tooltip title={info}>
          <Button
            variant="link"
            className="absolute right-2"
            icon={<MdInfoOutline size={24} />}
          />
        </Tooltip>
      )}
    </div>
  );
};

export default forwardRef(Input);
