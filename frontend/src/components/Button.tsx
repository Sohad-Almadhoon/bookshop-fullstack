import React from "react";
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}
const Button: React.FC<ButtonProps> = ({
  className,
  children,
  disabled,
  type = "button",
  ...props
}) => {
  return (
    <button
      type={type}
      disabled={disabled}
      {...props}
      className="bg-black w-full text-white uppercase px-8 py-3">
      {children}
    </button>
  );
};

export default Button;
