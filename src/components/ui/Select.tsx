import { Children, cloneElement, isValidElement, type ReactElement, type ReactNode, type SelectHTMLAttributes } from "react";
import { useFinance } from "../../hooks/useFinance";

const optionPalettes = {
  dark: { color: "#FAF5FF", backgroundColor: "#1E1B4B" },
  light: { color: "#1E1B4B", backgroundColor: "#FFFFFF" },
};

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  children?: ReactNode;
}

const Select = ({ label, children, className = "", ...props }: SelectProps) => {
  const { settings } = useFinance();
  const theme = settings?.theme === "light" ? "light" : "dark";
  const optionStyle = optionPalettes[theme];

  const styledChildren = Children.map(children, (child) => {
    if (!isValidElement(child)) return child;

    const option = child as ReactElement<{ style?: Record<string, unknown> }>;
    if (option.type === "option") {
      return cloneElement(option, {
        style: {
          ...optionStyle,
          ...(option.props.style || {}),
        },
      });
    }

    return child;
  });

  return (
    <label className="block">
      {label && <span className="label">{label}</span>}
      <select className={`field app-select ${className}`} {...props}>
        {styledChildren}
      </select>
    </label>
  );
};

export default Select;
