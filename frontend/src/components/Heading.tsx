import React from "react";
import { twMerge } from "tailwind-merge";
interface HeadingProps {
  size: "sm" | "lg";
  className?: string;
}
const Heading: React.FC<HeadingProps> = ({ size, className }) => {
  return (
    <div
      className={twMerge("flex uppercase justify-start text-3xl", className)}>
      <sub className="text-xl mr-2 mt-1 font-light">the</sub>home{" "}
      <sub className="text-xl mx-2 mt-1 font-light">of</sub>collaborative
      writing
    </div>
  );
};

export default Heading;
