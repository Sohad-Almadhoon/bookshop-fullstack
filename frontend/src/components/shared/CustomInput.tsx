import { forwardRef } from "react";
import { twMerge } from "tailwind-merge";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

// Correct forwardRef function definition
const CustomInput = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", disabled, ...props }, ref) => {
    return (
      <input
        type={type}
        className={twMerge(
          "outline-none rounded-lg border-2 placeholder:font-baskervville placeholder:text-sm placeholder:capitalize placeholder:text-opacity-80 border-black border-opacity-40 bg-transparent py-2 px-3 placeholder:text-black",
          className
        )}
        disabled={disabled}
        ref={ref} // Properly forward the ref
        {...props}
      />
    );
  }
);

CustomInput.displayName = "CustomInput"; // Set display name for forwardRef

export default CustomInput;
