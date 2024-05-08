type Props = {
  className?: string;
  theme?: "small" | "default";
  color?: "default" | "blue";
};

const getClasses = (theme: "small" | "default", color: "default" | "blue") => {
  let classes = "";
  switch (theme) {
    case "small":
      classes += " w-8 h-8 border-2";
      break;
    default:
      classes += " h-16 w-16 border-4";
  }
  switch (color) {
    case "blue":
      classes += " border-hm-blue";
      break;
    default:
      classes += " border-primary";
  }

  return classes;
};
const Spinner = ({
  theme = "default",
  color = "default",
  className = "",
}: Props) => (
  <div
    className={`${getClasses(
      theme,
      color,
    )} animate-spin rounded-full border-solid border-t-transparent ${className}`}
  />
);

export default Spinner;
