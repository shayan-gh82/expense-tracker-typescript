import type { TextareaHTMLAttributes } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

const Textarea = ({ label, className = "", ...props }: TextareaProps) => {
  return (
    <label className="block">
      {label && <span className="label">{label}</span>}
      <textarea className={`field min-h-24 resize-none ${className}`} {...props} />
    </label>
  );
};

export default Textarea;
