import React, { ReactNode } from "react";
import { Link } from "react-router-dom";
import { twMerge } from "tailwind-merge";
import ProfileMenu from "../ProfileMenu";
import Notifications from "../Notifications";

interface HeaderProps {
  profile?: boolean;
  title?: ReactNode;
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ profile, title, className }) => {
  return (
    <header className="flex items-center border-black border py-1 px-20 ">
      {/* Logo Section */}
      <Link to="/" className="flex-1">
        <img src="/assets/logo-dark.svg" alt="logo" className="w-14" />
      </Link>

      {/* Heading Section */}
      {!profile && <Heading title={title} className={className} />}

      {/* Profile Icons Section */}
      <div className="flex-1 flex justify-end gap-3">
        {profile && (
          <div className="flex gap-3">
            {/* Notifications */}
           <Notifications/>

            {/* Messages */}
            <Link to="/messages">
              <img src="/assets/messages.svg" alt="Messages" />
            </Link>
            <ProfileMenu />
          </div>
        )}

      </div>
    </header>
  );
};

interface HeadingProps {
  className?: string;
  title?: ReactNode;
}

export const Heading: React.FC<HeadingProps> = ({ title }) => {
  return (
    <div>
      {title ? (
        title
      ) : (
        <div
          className={twMerge(
            "flex uppercase justify-start text-lg md:text-3xl font-romieMedium tracking-wide"
          )}>
          <sub className="text-xl mr-2 mt-1">the</sub>
          home
          <sub className="text-xl mx-2 mt-1">of</sub>
          collaborative writing
        </div>
      )}
    </div>
  );
};

export default Header;
