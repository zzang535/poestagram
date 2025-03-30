import { create } from 'zustand';

interface PasswordState {
  isChangePasswordOpen: boolean;
  setChangePasswordOpen: (open: boolean) => void;
}

export const usePasswordStore = create<PasswordState>((set) => ({
  isChangePasswordOpen: false,
  setChangePasswordOpen: (open) => set({ isChangePasswordOpen: open }),
})); 