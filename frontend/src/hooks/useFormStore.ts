// src/store/formStore.ts
import { create } from "zustand";

// Define the shape of the form data
export interface FormData {
  name?: string;
  email?: string;
  password?: string;
  role?: string;
  generes?: string[];
}

// Define the shape of the Zustand store
interface FormStore {
  formData: FormData;
  updateFormData: (newData: Partial<FormData>) => void; // Accepts partial updates
  resetFormData: () => void;
}

// Create the Zustand store with TypeScript
export const useFormStore = create<FormStore>((set) => ({
  formData: {}, // Initial state
  updateFormData: (newData) =>
    set((state) => ({
      formData: { ...state.formData, ...newData }, // Merge new data with existing data
    })),
  resetFormData: () => set({ formData: {} }), // Reset the form data
}));
