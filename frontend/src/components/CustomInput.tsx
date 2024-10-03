import React from "react";
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const CustomInput: React.FC<InputProps> = ({
  className,
  type,
  disabled,
  ...props
}) => {
  return <input type={type} className="" disabled={disabled} {...props} />;
};

export default CustomInput;
