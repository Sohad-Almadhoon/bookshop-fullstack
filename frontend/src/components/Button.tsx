import { twMerge } from "tailwind-merge";
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
      className={twMerge(
        `bg-black w-full text-white uppercase px-8 py-3 rounded-md`,
        className
      )}>
      {children}
    </button>
  );
};

export default Button;
