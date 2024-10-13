import React from "react";
import { twMerge } from "tailwind-merge";
interface HeadingProps {
  size: "sm" | "lg";
  className?: string;
  title?: string;
}
const Heading: React.FC<HeadingProps> = ({ size, className , title}) => {
  return (
    <div>
      {title ? (
        <h1 className={twMerge(className)}>{title}</h1>
      ) : (
        <div
          className={twMerge(
            "flex uppercase justify-start text-lg md:text-3xl"
          )}>
          <sub className="text-xl mr-2 mt-1 font-light">the</sub>home{" "}
          <sub className="text-xl mx-2 mt-1 font-light">of</sub>collaborative
          writing
        </div>
      )}
    </div>
  );
  
  
};

export default Heading;