"use client";

import { create } from "zustand";

type AuthPayload = {
  token: string;
  username: string;
  firstName: string;
  image?: string;
};

type AuthState = {
  token: string | null;
  username: string | null;
  firstName: string | null;
  image: string | null;
  setAuth: (payload: AuthPayload) => void;
  clearAuth: () => void;
};

const STORAGE_KEY = "eduportal_auth";

const initial = () => {
  try {
    if (typeof window === "undefined")
      return { token: null, username: null, firstName: null, image: null };
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw)
      return { token: null, username: null, firstName: null, image: null };
    return JSON.parse(raw) as Partial<AuthState>;
  } catch {
    return { token: null, username: null, firstName: null, image: null };
  }
};

export const useAuthStore = create<AuthState>((set) => {
  const init = initial();
  return {
    token: init.token ?? null,
    username: init.username ?? null,
    firstName: init.firstName ?? null,
    image: init.image ?? null,
    setAuth: (payload: AuthPayload) => {
      const p = {
        token: payload.token,
        username: payload.username,
        firstName: payload.firstName,
        image: payload.image ?? null,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
      try {
        // set a cookie for server-side middleware to read
        document.cookie = `edu_token=${encodeURIComponent(
          p.token
        )}; path=/; max-age=${60 * 60 * 24 * 7}`; // 7 days
      } catch {}
      set(() => p);
    },
    clearAuth: () => {
      localStorage.removeItem(STORAGE_KEY);
      try {
        // clear cookie
        document.cookie = `edu_token=; path=/; max-age=0`;
      } catch {}
      set(() => ({
        token: null,
        username: null,
        firstName: null,
        image: null,
      }));
    },
  };
});

export default useAuthStore;
