import { Fragment } from "react";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import Button from "./Button";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

/** Deletions are permanent, so every one of them goes through this first. */
const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  title,
  description,
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  loading = false,
  onConfirm,
  onClose,
}) => (
  <Transition appear show={open} as={Fragment}>
    <Dialog as="div" className="relative z-[60]" onClose={loading ? () => {} : onClose}>
      <TransitionChild
        as={Fragment}
        enter="ease-out duration-200"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="ease-in duration-150"
        leaveFrom="opacity-100"
        leaveTo="opacity-0">
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" aria-hidden="true" />
      </TransitionChild>

      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95">
            <DialogPanel className="w-full max-w-md rounded-2xl border-2 border-black bg-[#DDD1BB] p-6 text-left shadow-xl">
              <DialogTitle className="font-voyage text-2xl uppercase">{title}</DialogTitle>
              <p className="mt-2 text-sm text-black/70 font-baskervville">{description}</p>

              <div className="mt-6 flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="w-fit px-5 py-2 text-sm"
                  disabled={loading}
                  onClick={onClose}>
                  {cancelLabel}
                </Button>
                <Button
                  type="button"
                  className="w-fit bg-red-800 px-5 py-2 text-sm text-white hover:bg-red-900"
                  disabled={loading}
                  onClick={onConfirm}>
                  {loading ? "Deleting…" : confirmLabel}
                </Button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </Transition>
);

export default ConfirmDialog;
