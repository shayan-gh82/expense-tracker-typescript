import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Input = ({ label, className = "", ...props }: InputProps) => {
  return (
    <label className="block">
      {label && <span className="label">{label}</span>}
      <input className={`field ${className}`} {...props} />
    </label>
  );
};

export default Input;
