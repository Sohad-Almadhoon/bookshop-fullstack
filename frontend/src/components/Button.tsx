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
    <button type={type} disabled={disabled} {...props} className="">
      {children}
    </button>
  );
};

export default Button;
