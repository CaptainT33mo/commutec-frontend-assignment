import { useState, type ReactNode, useCallback } from "react";

interface CheckboxProps {
  label?: string | ReactNode;
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export default function Checkbox({
  label = "",
  id,
  checked,
  onChange,
  disabled,
}: CheckboxProps) {
  const defaultChecked = checked ? checked : false;
  const [isChecked, setIsChecked] = useState(defaultChecked);

  const handleChange = useCallback(() => {
    if (!disabled) {
      const newChecked = !isChecked;
      setIsChecked(newChecked);
      onChange && onChange(newChecked);
    }
  }, [isChecked, onChange, disabled]);
  return (
    <div className="flex items-center">
      <input
        id={id}
        type="checkbox"
        checked={isChecked}
        className={`border-secondary-500 before:shadow-checkbox checked:focus:before:shadow-checkbox checked::focus:after:ml-[0.4rem] relative float-left h-6 w-6 appearance-none rounded-[0.25rem] border-[0.125rem] border-solid bg-gray-200 outline-none before:pointer-events-none before:absolute before:h-[0.875rem] before:w-[0.875rem] before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-transparent before:content-[''] checked:border-black checked:bg-black checked:before:opacity-[0.16] checked:after:absolute checked:after:ml-[0.4rem] checked:after:mt-px checked:after:block checked:after:h-[0.9125rem] checked:after:w-[0.475rem] checked:after:rotate-45 checked:after:border-[0.125rem] checked:after:border-l-0 checked:after:border-t-0 checked:after:border-solid checked:after:border-white checked:after:bg-transparent checked:after:content-[''] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-black/60 focus:shadow-none focus:transition-[border-color_0.2s] focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-black/60 focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-[0.875rem] focus:after:w-[0.875rem] focus:after:rounded-[0.125rem] focus:after:content-[''] checked:focus:before:scale-100 checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:after:ms-[0.35rem] checked:focus:after:mt-px checked:focus:after:h-[0.9125rem] checked:focus:after:w-[0.475rem] checked:focus:after:rotate-45 checked:focus:after:rounded-none checked:focus:after:border-[0.125rem] checked:focus:after:border-l-0 checked:focus:after:border-t-0 checked:focus:after:border-solid checked:focus:after:border-white checked:focus:after:bg-transparent dark:border-neutral-400 rtl:float-right ${disabled ? "!cursor-not-allowed opacity-50" : ""}`}
        onChange={handleChange}
        disabled={disabled}
      />
      <label
        htmlFor={id}
        className={`ms-2 text-base font-normal text-black ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
      >
        {label}
      </label>
    </div>
  );
}
