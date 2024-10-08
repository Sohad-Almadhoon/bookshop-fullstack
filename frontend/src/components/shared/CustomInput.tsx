import { twMerge } from "tailwind-merge";
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const CustomInput: React.FC<InputProps> = ({
  className,
  type,
  disabled,
  ...props
}) => {
  return (
    <input
      type={type}
      className={twMerge("outline-none rounded-lg border-2 border-black bg-transparent py-2 px-3", className)}
      disabled={disabled}
      {...props}
    />
  );
};

export default CustomInput;
