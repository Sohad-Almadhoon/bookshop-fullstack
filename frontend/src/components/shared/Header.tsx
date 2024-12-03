import React, { ReactNode } from "react";
import { Link } from "react-router-dom";
import ProfileMenu from "../profile/ProfileMenu";
import Notifications from "../shared/Notifications";
import { twMerge } from "tailwind-merge";

interface HeaderProps {
  title?: ReactNode;
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ title, className }) => {
  return (
    <header className="flex items-center border-black border py-1 px-20 ">
      <Link to="/" className="flex-1">
        <img src="/assets/logo-dark.svg" alt="logo" className="w-14" />
      </Link>

      <Heading title={title} className={className} />
      <div className="flex-1 flex justify-end gap-3">
        <div className="flex gap-3">
          {/* <Notifications /> */}
          <Link to="/messages">
            <img src="/assets/messages.svg" alt="Messages" />
          </Link>
        </div>

        <ProfileMenu />
      </div>
    </header>
  );
};

interface HeadingProps {
  className?: string;
  title?: ReactNode;
}

export const Heading: React.FC<HeadingProps> = ({ title, className }) => {
  return (
    <div>
      <span className={
        twMerge("lg:block hidden" ,className)
      }>{title}</span>
    </div>
  );
};

export default Header;
