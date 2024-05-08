import type { ReactNode } from "react";
import { MdOutlineInfo } from "react-icons/md";
import ErrorText from "../ErrorText";
import FieldTitle from "../FieldTitle";
import Tooltip from "@/app/_components/Tooltip";

type FieldWrapperProps = {
  label?: string;
  errorText?: string;
  children: ReactNode;
  className?: string;
  noLabel?: boolean;
  required?: boolean;
  infoText?: string;
};

const FieldWrapper = ({
  label,
  errorText,
  children,
  className = "",
  noLabel,
  required = false,
  infoText = "",
}: FieldWrapperProps) => (
  <div className={`${noLabel ? "" : "h-22"} flex flex-col ${className}`}>
    {!label && !noLabel && <span className="mb-4 flex h-4" />}
    {label && (
      <FieldTitle>
        {label}
        {required && <span className="text-red-500">*</span>}
        {infoText && (
          <Tooltip title={infoText}>
            <span className="ml-2 inline-flex items-center justify-center">
              <MdOutlineInfo size={14} />
            </span>
          </Tooltip>
        )}
      </FieldTitle>
    )}
    {children}
    {!!errorText && <ErrorText>{errorText}</ErrorText>}
  </div>
);

export default FieldWrapper;
