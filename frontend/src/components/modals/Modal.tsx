import React, { Fragment, ReactNode } from "react";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  image?: string;
  modalLogo?: string;
  children: ReactNode;
  title?: ReactNode;
  description?: string;
}

const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  image,
  children,
  title,
  modalLogo,
  description,
}) => {
  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" onClose={onClose} open={open} className="relative z-50">
        <div className="fixed inset-0 bg-[#DDD1BB] bg-opacity-10 backdrop-blur-sm"></div>

        <div className="fixed inset-0 overflow-y-auto text-black">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95">
              <DialogPanel className="w-full bg-[#DDD1BB] max-w-4xl h-[90vh] transform overflow-hidden rounded-full border-4 border-black p-6 shadow-xl transition-all flex flex-col justify-center items-center">
                <img src={modalLogo} alt="" className="w-20 h-20 mb-3" />
                <DialogTitle className="text-center mb-3 uppercase leading-tight">
                  {title}
                </DialogTitle>
                <img src={image} alt="" />
                <span className="capitalize text-opacity-70 text-black text-lg leading-loose p-3">
                  {description}
                </span>
                {children}
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default Modal;

