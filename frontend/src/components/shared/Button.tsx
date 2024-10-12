import { twMerge } from "tailwind-merge";
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: string;
}
const Button: React.FC<ButtonProps> = ({
  className,
  children,
  disabled,
  variant,
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
        className,
        variant === "outline" && "bg-transparent border-black border text-black"
      )}>
      {children}
    </button>
  );
};

export default Button;
