import { create } from "zustand";

// Define the types of content
type ContentType = "audio" | "text" | "visual";
interface ModalState {
  isOpen: boolean;
  contentType: ContentType | null; // Type of the content
  openModal: (type: ContentType) => void; // Open modal with type and content
  closeModal: () => void;
}

export const useNovelModal = create<ModalState>((set) => ({
  isOpen: false,
  contentType: null,
  openModal: (type) =>
    set({ isOpen: true, contentType: type }),
  closeModal: () => set({ isOpen: false, contentType: null }),
}));
