export const buttonStyles = {
  primary: {
    baseClass:
      "bg-black text-white border border-black rounded-lg",
    hoverClass:
      "hover:bg-gray-700",
    focusedClass: "focus:shadow-xs",
    disabledClass:
      "disabled:bg-gray-600 disabled:text-gray-300 disabled:cursor-not-allowed disabled:border-gray-600",
  },
  link: {
    baseClass:
      "bg-transparent text-black rounded-lg",
    hoverClass: "hover:text-gray-700",
    focusedClass: "focus:shadow-xs",
    disabledClass:
      "disabled:bg-gray-600 disabled:text-gray-300 disabled:cursor-not-allowed disabled:border-gray-600",
  },
};

export const buttonSizes = {
  xs: {
    paddingClass: "px-1.5 py-1",
    textClass: "text-xs font-semibold",
  },
  sm: {
    paddingClass: "px-2.5 py-1.5",
    textClass: "text-sm font-semibold",
  },
  md: {
    paddingClass: "py-2.5 px-3.5",
    textClass: "text-sm font-semibold",
    borderClass:
      "border border-black rounded-lg",
  },
  lg: {
    paddingClass: "py-3 px-4",
    textClass: "text-sm font-semibold",
    borderClass: "border border-black rounded-lg",
  },
  xl: {
    paddingClass: "py-3.5 px-5",
    textClass: "text-base font-semibold",
    borderClass: "border border-black rounded-lg",
  },
  "2xl": {
    paddingClass: "py-4 px-6",
    textClass: "text-lg font-semibold",
    borderClass: "border border-black rounded-lg",
  },
};
