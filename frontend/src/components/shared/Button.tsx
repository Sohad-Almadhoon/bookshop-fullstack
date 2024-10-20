import { twMerge } from "tailwind-merge";
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'outline' | ""
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
        `bg-black w-full text-[#DFD5BF] uppercase px-8 py-3 rounded-md disabled:text-black disabled:cursor-not-allowed disabled:text-opacity-30 disabled:bg-[#DFD5BF]`,
        className,
        variant === "outline" && "bg-transparent border-black border text-black"
      )}>
      {children}
    </button>
  );
};

export default Button;
