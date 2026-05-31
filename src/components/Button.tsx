import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-brand text-[#0a1628] hover:bg-[#fbd35e] active:bg-[#e6b830] shadow-[0_8px_24px_-8px_rgba(245,200,76,0.6)]",
  secondary:
    "bg-transparent text-fg border border-line-strong hover:bg-surface-elev hover:border-[#3a4a6c]",
  ghost: "bg-transparent text-fg-3 hover:text-fg",
};

const sizeClasses: Record<Size, string> = {
  sm: "h-9 px-3.5 text-[13px]",
  md: "h-11 px-5 text-[14px]",
  lg: "h-12 px-6 text-[15px]",
};

export default function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      {...rest}
      className={`inline-flex items-center justify-center gap-2 rounded-md font-medium transition-all duration-150 outline-none focus-visible:ring-2 focus-visible:ring-brand/50 ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {children}
    </button>
  );
}
