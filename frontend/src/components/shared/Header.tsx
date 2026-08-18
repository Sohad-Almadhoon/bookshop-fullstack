import React, { ReactNode } from "react";
import { Link } from "react-router-dom";
import { twMerge } from "tailwind-merge";
import ProfileMenu from "../profile/ProfileMenu";

interface HeaderProps {
  title?: ReactNode;
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ title, className }) => {
  return (
    <header className="flex items-center border-black border p-2 lg:py-1 lg:px-20">
      <Link to="/" className="flex-1">
        <img src="/assets/logo-dark.svg" alt="Block Book logo" width={63} height={88} className="w-14" />
      </Link>

      <Heading title={title} className={className} />

      <div className="flex-1 flex justify-end gap-3">
        <Link to="/messages" aria-label="Messages">
          <img src="/assets/messages.svg" alt="" width={78} height={58} />
        </Link>
        <ProfileMenu />
      </div>
    </header>
  );
};

interface HeadingProps {
  className?: string;
  title?: ReactNode;
}

export const Heading: React.FC<HeadingProps> = ({ title, className }) => (
  <div>
    <span className={twMerge("lg:block hidden", className)}>{title}</span>
  </div>
);

export default Header;
