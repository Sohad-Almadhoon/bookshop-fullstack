import React from "react";
import SideImage from "./SideImage";
interface SignLayoutProps {
  children: React.ReactNode;
}
const SignLayout: React.FC<SignLayoutProps> = ({ children }) => {
  return (
    <div>
      <SideImage />
      {children}
      <SideImage />
    </div>
  );
};

export default SignLayout;
