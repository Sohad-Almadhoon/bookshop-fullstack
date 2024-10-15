import React from "react";
import { Link } from "react-router-dom";
import { twMerge } from "tailwind-merge";

interface HeaderProps {
  profile?: boolean;
  title?: string;
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ profile, title, className }) => {
  return (
    <header className="flex items-center border-black border py-1 px-20">
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
            <Link className="relative" to="/notifications">
              <img src="/assets/bell.svg" alt="Notifications" />
              <div className="absolute top-0 right-0 w-6 h-6 bg-black rounded-full flex justify-center items-center">
                <p className="text-xs text-white">2</p>
              </div>
            </Link>

            {/* Messages */}
            <Link to="/messages">
              <img src="/assets/messages.svg" alt="Messages" />
            </Link>
          </div>
        )}

        {/* Menu Icon */}
        <img src="/assets/menu-black.svg" alt="Menu" />
      </div>
    </header>
  );
};

interface HeadingProps {
  className?: string;
  title?: string;
}

export const Heading: React.FC<HeadingProps> = ({ className, title }) => {
  return (
    <div>
      {title ? (
        <h1 className={className}>{title}</h1>
      ) : (
        <div
          className={twMerge(
            "flex uppercase justify-start text-lg md:text-3xl"
          )}>
          <sub className="text-xl mr-2 mt-1 font-light">the</sub>
          home
          <sub className="text-xl mx-2 mt-1 font-light">of</sub>
          collaborative writing
        </div>
      )}
    </div>
  );
};

export default Header;
