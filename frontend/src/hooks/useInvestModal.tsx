import { create } from "zustand";

// Create a Zustand store for the modal state
interface ModalState {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

export const useInvestModal = create<ModalState>((set) => ({
  isOpen: false,
  openModal: () => set({ isOpen: true }),
  closeModal: () => set({ isOpen: false }),
}));
