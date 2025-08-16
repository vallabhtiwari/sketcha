import { SigninResponse, User } from "@/types";
import { create } from "zustand";

interface UserStore {
  user: User | null;
  token: SigninResponse | null;
  setUser: (user: User) => void;
  setToken: (token: SigninResponse) => void;
  clearAuth: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  token: null,
  setUser: (user) => set({ user }),
  setToken: (token) => set({ token }),
  clearAuth: () => set({ user: null, token: null }),
}));
