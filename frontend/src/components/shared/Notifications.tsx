import { Menu  , MenuButton  , MenuItems} from "@headlessui/react";
import { BsListCheck } from "react-icons/bs";
import { useNotificationModal } from "../../hooks/useNotificationModal";


const Notifications = () => {
  const { toggleModal, isOpen } = useNotificationModal();

  return (
    <div className="relative">
      <div>
        <img
          src="/assets/bell.svg"
          alt="Notifications"
          onClick={toggleModal}
          className="cursor-pointer"
        />
        <div className="absolute top-0 right-0 w-6 h-6 bg-black rounded-full flex justify-center items-center">
          <p className="text-xs text-white">2</p>
        </div>
      </div>
      {isOpen && (
        <Menu
          as="div"
          className="absolute right-0 mt-1 mr-1 w-[400px] min-h-48 border border-black bg-[#dfd4bf] rounded-md shadow-lg z-20">
          <MenuButton className="flex items-center w-full justify-between text-3xl p-2 bg-[#dfd4bf] border-b border-black">
            <p className="font-bold">Notifications</p>
            <BsListCheck />
          </MenuButton>
          <MenuItems className="p-3 min-h-48">
            <div className="flex items-center justify-between text-3xl mb-2">
              <p className="font-bold">Notifications</p>
              <BsListCheck />
            </div>
          
          </MenuItems>
        </Menu>
      )}
    </div>
  );
};

export default Notifications;
