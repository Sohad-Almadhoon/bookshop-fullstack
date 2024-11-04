import { Menu } from "@headlessui/react";
import { Fragment } from "react";

const ProfileMenu = () => {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-md hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
          Profile
        </Menu.Button>
      </div>

      <Menu.Items className="absolute right-0 w-56 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
        <div className="px-1 py-1 ">
          <Menu.Item>
            {({ active }) => (
              <button
                className={`${
                  active ? "bg-blue-500 text-white" : "text-gray-900"
                } group flex rounded-md items-center w-full px-2 py-2 text-sm`}>
                Settings
              </button>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <button
                className={`${
                  active ? "bg-blue-500 text-white" : "text-gray-900"
                } group flex rounded-md items-center w-full px-2 py-2 text-sm`}>
                Logout
              </button>
            )}
          </Menu.Item>
        </div>
      </Menu.Items>
    </Menu>
  );
};

export default ProfileMenu;
