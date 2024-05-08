import type { InputHTMLAttributes } from "react";
import { useField } from "formik";
import FieldWrapper from "../FieldWrapper";
import Input from "@/app/_components/Input";

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  name: string;
  noLabel?: boolean;
  required?: boolean;
  inline?: boolean;
  info?: string;
  labelClasses?: string;
  helpText?: string;
}

export default function FormInput({
  label,
  name,
  disabled,
  noLabel,
  required = false,
  inline = false,
  info = "",
  helpText = "",
  labelClasses = "",
  ...props
}: TextInputProps) {
  const [field, meta] = useField(name);
  const errorText = meta.error && meta.touched ? meta.error : "";
  const hasError = !!errorText;
  return (
    <>
      {inline ? (
        <Input
          {...field}
          readOnly={disabled}
          disabled={disabled}
          hasError={hasError}
          required={required}
          inline={inline}
          info={info}
          {...props}
        />
      ) : (
        <FieldWrapper
          label={label}
          errorText={errorText}
          noLabel={noLabel}
          required={required}
          className={labelClasses}
          infoText={helpText}
        >
          <div className="flex items-center">
            <Input
              {...field}
              readOnly={disabled}
              disabled={disabled}
              hasError={hasError}
              info={info}
              {...props}
            />
          </div>
        </FieldWrapper>
      )}
    </>
  );
}
