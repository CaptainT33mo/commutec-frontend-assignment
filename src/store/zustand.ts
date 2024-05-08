import { getCookie, removeCookie, setCookie } from "@/utils/helpers";
import type { UserDetails } from "@/types";
import { create } from "zustand";
import type { StateCreator } from "zustand";
import { devtools } from "zustand/middleware";

// Typescript support for Zustand store config can be found here:
// https://github.com/pmndrs/zustand/blob/main/docs/guides/typescript.md#slices-pattern

// https://docs.pmnd.rs/zustand/guides/how-to-reset-state
const resetters: (() => void)[] = [];

export const resetAllSlices = () => resetters.forEach((resetter) => resetter());

interface UserState {
  token: string;
  userDetails: Partial<UserDetails>;
  setUserDetails: (newDetails: Partial<UserDetails>) => void;
  updateToken: (newToken: string) => void;
  removeToken: () => void;
}

const initialUserStore = {
  token: "",
  userDetails: {
    id: "",
    name: "",
    email: "",
    isEmailVerified: false,
  },
};

const useUserStore: StateCreator<UserState> = (set) => {
  resetters.push(() => set(initialUserStore));
  return {
    token: getCookie("nekot-afcsv") ?? "",
    userDetails: { ...initialUserStore.userDetails },
    setUserDetails: (newDetails: Partial<UserDetails>) => {
      set({ userDetails: newDetails });
    },
    updateToken: (newToken: string) => {
      set({ token: newToken });
      setCookie("nekot-afcsv", newToken);
    },
    removeToken: () => {
      removeCookie("nekot-afcsv");
      resetAllSlices();
    },
  };
};

export const useStore = create<UserState>()(
  devtools((...params) => ({
    ...useUserStore(...params),
  })),
);
