import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";

const variants: Record<ButtonVariant, string> = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  danger: "inline-flex items-center justify-center gap-2 rounded-2xl bg-royal-expense px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:brightness-110",
  ghost: "btn-ghost",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  variant?: ButtonVariant;
}

const Button = ({ children, variant = "primary", className = "", type = "button", ...props }: ButtonProps) => {
  return (
    <button type={type} className={`${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;
