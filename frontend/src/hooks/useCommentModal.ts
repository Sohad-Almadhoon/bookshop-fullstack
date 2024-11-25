import { create } from "zustand";

// Create a Zustand store for the modal state
interface ModalState {
    isOpen: boolean;
    openModal: () => void;
    closeModal: () => void;
}

export const useCommentModal = create<ModalState>((set) => ({
    isOpen: false,
    closeModal: () => set({ isOpen: false }),
    openModal: () => set({ isOpen: true }),
}));
