import { create } from "zustand";

// Create a Zustand store for the modal state
interface ModalState {
  isOpen: boolean;
  toggleModal: () => void;
}

export const useNotificationModal = create<ModalState>((set) => ({
  isOpen: false,
  toggleModal: () => set((state: ModalState) => ({ isOpen: !state.isOpen })),
}));
