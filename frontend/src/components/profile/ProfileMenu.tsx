import {
  Menu,
  MenuButton,
  MenuItems,
  MenuItem,
  Transition,
} from "@headlessui/react";
import { BsPersonFill, BsSignpost2, BsTreeFill } from "react-icons/bs";
import { Link } from "react-router-dom";
import { Fragment } from "react";
import Button from "../shared/Button";
import { logout } from "../../actions/user.action";

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
          className="absolute bg-[#dfd4bf] -translate-x-[100px] mt-2 w-56 h-44 rounded-md  shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none drop-shadow bg-[#] p-6 z-50">
          <MenuItem as={Fragment}>
            <Link
              to="/profile"
              className={"flex gap-4 text-xl font-medium cursor-pointer"}>
              <BsPersonFill className="text-2xl" />
              Profile
            </Link>
            </MenuItem>
            <MenuItem as={Fragment}>
            <Link
              to="/tree"
              className={"flex gap-4 text-xl font-medium cursor-pointer mt-2"}>
              <BsTreeFill className="text-2xl" />
              Tree
            </Link>
          </MenuItem>
          <MenuItem as={Fragment}>
            <Button
              className={
                " px-0 text-xl font-medium cursor-pointer border-none flex gap-3 justify-start content-start w-full"
              }
              variant="outline"
              onClick={logout}>
              <BsSignpost2 className="text-2xl" />

              <span className=" capitalize">Logout</span>
            </Button>
          </MenuItem>
        </MenuItems>
      </Transition>
    </Menu>
  );
};

export default ProfileMenu;
