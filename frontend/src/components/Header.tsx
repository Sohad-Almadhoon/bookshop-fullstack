import React from "react";
import Heading from "./Heading";

const Header = () => {
  return (
    <div className="flex items-center border border-black py-1 px-12 mx-4 mt-1">
      <span className="flex-1">
        <img src="/assets/logo-dark.svg" alt="logo"  className="w-14"/>
      </span>
      <Heading size="lg"/>
      <div className="flex-1 justify-end flex">
        <img src="/assets/menu-black.svg" alt="menu" />
      </div>
    </div>
  );
};

export default Header;
