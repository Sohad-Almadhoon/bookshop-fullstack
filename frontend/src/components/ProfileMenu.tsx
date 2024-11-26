import {
  Menu,
  MenuButton,
  MenuItems,
  MenuItem,
  Transition,
} from "@headlessui/react";
import {BsPersonFill, BsSignpost2 } from "react-icons/bs";
import { Link } from "react-router-dom";
import { Fragment } from "react";
import Button from "./shared/Button";
import { logout } from "../actions/user.action";

const ProfileMenu = () => {
  return (
    <Menu as="div" className="relative">
      <div>
        <MenuButton>
          <img src="/assets/menu-black.svg" alt="" />
        </MenuButton>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95">
        <MenuItems
          anchor="bottom"
          className="absolute bg-[#dfd4bf] -translate-x-[100px] mt-2 w-56 h-40 rounded-md  shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none drop-shadow bg-[#] p-6 z-50">
          <img
            src="/assets/dropdown-bgpattern.svg"
            alt=""
            className="absolute top-0 left-0 w-full h-full object-cover"
          />
          <MenuItem as={Fragment}>
            <Link
              to="/profile"
              className={"flex gap-4 text-xl font-medium cursor-pointer"}>
              <BsPersonFill className="text-2xl" />
              Profile
            </Link>
          </MenuItem>
          <MenuItem as={Fragment}>
            <Button
              className={
                "text-xl font-medium cursor-pointer border-none flex gap-4"
              }
              variant="outline" onClick={logout}>
              <BsSignpost2 />
              Logout
            </Button>
          </MenuItem>
        </MenuItems>
      </Transition>
    </Menu>
  );
};

export default ProfileMenu;
