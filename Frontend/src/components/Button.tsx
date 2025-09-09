import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "secondary";
}

export const Button: React.FC<ButtonProps> = ({ children, variant = "primary", ...props }) => {
  const baseClasses = "px-4 py-2 rounded font-semibold focus:outline-none transition";
  const variantClasses =
    variant === "primary"
      ? "bg-blue-600 hover:bg-blue-700 text-white"
      : "bg-gray-300 hover:bg-gray-400 text-gray-800";
  return (
    <button className={`${baseClasses} ${variantClasses}`} {...props}>
      {children}
    </button>
  );
};
