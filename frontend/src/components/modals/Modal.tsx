import React, { Fragment, ReactNode } from "react";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { IoClose } from "react-icons/io5";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  modalLogo?: string;
  children: ReactNode;
  title?: ReactNode;
  description?: string;
}

const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  children,
  title,
  modalLogo,
  description,
}) => {
  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" onClose={onClose} className="relative z-50">
        <div
          className="fixed inset-0 bg-[#DDD1BB] bg-opacity-10 backdrop-blur-sm"
          aria-hidden="true"
        />

        <div className="fixed inset-0 overflow-auto text-black">
          <div className="flex min-h-full items-center justify-center p-2 sm:p-4 text-center">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95">
              {/* The circular panel only works once there is room for it: below
                  `lg` it becomes a normal scrollable sheet, otherwise the
                  rounded edges eat the content on a phone. */}
              <DialogPanel className="w-full bg-[#DDD1BB] max-w-3xl max-h-[92vh] lg:h-[90vh] transform overflow-y-auto rounded-3xl lg:rounded-full border-2 lg:border-4 border-black p-4 sm:p-6 lg:px-20 shadow-xl transition-all flex flex-col items-center lg:justify-center relative">
                {/* There was no visible way to close the modal. */}
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close"
                  className="absolute top-3 right-4 sm:top-6 sm:right-10 text-3xl z-10">
                  <IoClose />
                </button>

                {modalLogo && (
                  <img
                    src={modalLogo}
                    alt=""
                    className="w-12 h-12 sm:w-20 sm:h-20 mb-3 mt-6 lg:mt-0"
                  />
                )}
                {title && <DialogTitle className="text-2xl mb-2">{title}</DialogTitle>}
                {description && <p className="text-sm mb-3">{description}</p>}
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
