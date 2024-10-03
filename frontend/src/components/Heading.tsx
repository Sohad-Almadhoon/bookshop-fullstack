import React from "react";
interface HeadingProps {
  size: "sm" | "lg";
  className: string;
}
const Heading: React.FC<HeadingProps> = ({ size , className}) => {
  return (
    <div className="">
      <span>the</span>home <span>of</span>collaborative writing
    </div>
  );
};

export default Heading;
