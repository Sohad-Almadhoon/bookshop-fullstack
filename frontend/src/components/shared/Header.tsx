import React, { Fragment, ReactNode } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from "@headlessui/react";
import { BsBook, BsChatDots, BsCompass, BsInfoCircle, BsPencilSquare, BsPersonFill, BsSignpost2, BsTreeFill } from "react-icons/bs";
import { twMerge } from "tailwind-merge";
import { logout } from "../../actions/user.action";
import { getStoredToken } from "../../utils/session";
import Notifications from "./Notifications";

interface HeaderProps {
  title?: ReactNode;
  className?: string;
}

/** Everywhere you can go from anywhere. */
const NAV = [
  { to: "/tree", label: "Tree", Icon: BsTreeFill },
  { to: "/discover", label: "Discover", Icon: BsCompass },
  { to: "/create-book", label: "Create", Icon: BsPencilSquare },
];

const MENU_ONLY = [
  { to: "/profile", label: "Profile", Icon: BsPersonFill },
  { to: "/messages", label: "Messages", Icon: BsChatDots },
  { to: "/how-it-works", label: "How it works", Icon: BsBook },
  { to: "/about", label: "About", Icon: BsInfoCircle },
];

const linkClasses = ({ isActive }: { isActive: boolean }) =>
  twMerge(
    "relative px-3 py-2 text-sm uppercase tracking-wide transition-colors hover:text-black",
    isActive
      ? "text-black after:absolute after:inset-x-3 after:-bottom-0.5 after:h-0.5 after:bg-black after:content-['']"
      : "text-black/55"
  );

const Header: React.FC<HeaderProps> = () => {
  const isSignedIn = Boolean(getStoredToken());

  return (
    <header className="flex items-center gap-2 border border-black p-2 lg:px-8">
      {/* the logo used to point at "/", which bounced signed-in users through
          the landing page before redirecting them to their profile */}
      <Link to={isSignedIn ? "/tree" : "/"} className="shrink-0" aria-label="Block Book home">
        <img
          src="/assets/logo-dark.svg"
          alt="Block Book"
          width={63}
          height={88}
          className="w-11 sm:w-14"
        />
      </Link>

      {isSignedIn && (
        <nav className="hidden flex-1 justify-center gap-1 md:flex" aria-label="Main">
          {NAV.map(({ to, label }) => (
            <NavLink key={to} to={to} className={linkClasses}>
              {label}
            </NavLink>
          ))}
        </nav>
      )}

      <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-3">
        {isSignedIn && <Notifications />}

        {isSignedIn && (
          <NavLink
            to="/messages"
            aria-label="Messages"
            className={({ isActive }) =>
              twMerge(
                "rounded-full border border-black/20 p-2 transition-colors hover:bg-black hover:text-white",
                isActive && "bg-black text-white"
              )
            }>
            <BsChatDots className="text-lg" />
          </NavLink>
        )}

        {isSignedIn && (
          <Menu as="div" className="relative">
            <MenuButton
              aria-label="Menu"
              className="flex items-center rounded-full border border-black/20 p-2 transition-colors hover:bg-black hover:text-white">
              <img
                src="/assets/menu-black.svg"
                alt=""
                width={77}
                height={58}
                className="h-4 w-5"
              />
            </MenuButton>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95">
              <MenuItems
                anchor="bottom end"
                className="z-50 mt-2 w-56 rounded-md border border-black/20 bg-[#dfd4bf] p-2 shadow-lg focus:outline-none">
                {/* on phones the main links live here too */}
                <div className="md:hidden">
                  {NAV.map(({ to, label, Icon }) => (
                    <MenuItem key={to}>
                      <Link
                        to={to}
                        className="flex items-center gap-3 rounded px-3 py-2 text-base hover:bg-black/10">
                        <Icon className="text-lg" />
                        {label}
                      </Link>
                    </MenuItem>
                  ))}
                  <hr className="my-2 border-black/20" />
                </div>

                {MENU_ONLY.map(({ to, label, Icon }) => (
                  <MenuItem key={to}>
                    <Link
                      to={to}
                      className="flex items-center gap-3 rounded px-3 py-2 text-base hover:bg-black/10">
                      <Icon className="text-lg" />
                      {label}
                    </Link>
                  </MenuItem>
                ))}

                <hr className="my-2 border-black/20" />
                <MenuItem>
                  <button
                    type="button"
                    onClick={logout}
                    className="flex w-full items-center gap-3 rounded px-3 py-2 text-left text-base hover:bg-black/10">
                    <BsSignpost2 className="text-lg" />
                    Logout
                  </button>
                </MenuItem>
              </MenuItems>
            </Transition>
          </Menu>
        )}
      </div>
    </header>
  );
};

interface HeadingProps {
  className?: string;
  title?: ReactNode;
}

/** Kept for the landing page, which uses it as a decorative slot. */
export const Heading: React.FC<HeadingProps> = ({ title, className }) => (
  <div>
    <span className={twMerge("lg:block hidden", className)}>{title}</span>
  </div>
);

export default Header;
