import { create } from "zustand";
import { persist } from "zustand/middleware";
import { api } from "@/lib/api";
import type { User, Address } from "@/types";

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  initialized: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (name: string, email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  fetchMe: () => Promise<void>;
  updateProfile: (data: Partial<Pick<User, "name" | "phone" | "image">>) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  addAddress: (data: Omit<Address, "_id">) => Promise<void>;
  updateAddress: (id: string, data: Partial<Address>) => Promise<void>;
  deleteAddress: (id: string) => Promise<void>;
  isAdmin: () => boolean;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      loading: false,
      initialized: false,

      isAuthenticated: () => !!get().user,
      isAdmin: () => get().user?.role === "ADMIN",

      login: async (email, password) => {
        set({ loading: true });
        try {
          const { data } = await api.post("/auth/login", { email, password });
          localStorage.setItem("lumiere_token", data.token);
          set({ user: data.user, token: data.token, loading: false });
          return data.user;
        } catch (err) {
          set({ loading: false });
          throw err;
        }
      },

      register: async (name, email, password) => {
        set({ loading: true });
        try {
          const { data } = await api.post("/auth/register", { name, email, password });
          localStorage.setItem("lumiere_token", data.token);
          set({ user: data.user, token: data.token, loading: false });
          return data.user;
        } catch (err) {
          set({ loading: false });
          throw err;
        }
      },

      logout: async () => {
        try { await api.post("/auth/logout"); } catch {}
        localStorage.removeItem("lumiere_token");
        set({ user: null, token: null });
      },

      fetchMe: async () => {
        const token = localStorage.getItem("lumiere_token");
        if (!token) {
          set({ initialized: true });
          return;
        }
        try {
          const { data } = await api.get("/auth/me");
          set({ user: data.user, token, initialized: true });
        } catch {
          localStorage.removeItem("lumiere_token");
          set({ user: null, token: null, initialized: true });
        }
      },

      updateProfile: async (data) => {
        const { data: res } = await api.patch("/auth/profile", data);
        set({ user: res.user });
      },

      changePassword: async (currentPassword, newPassword) => {
        await api.patch("/auth/password", { currentPassword, newPassword });
      },

      addAddress: async (data) => {
        const { data: res } = await api.post("/auth/addresses", data);
        set({ user: res.user });
      },

      updateAddress: async (id, data) => {
        const { data: res } = await api.patch(`/auth/addresses/${id}`, data);
        set({ user: res.user });
      },

      deleteAddress: async (id) => {
        const { data: res } = await api.delete(`/auth/addresses/${id}`);
        set({ user: res.user });
      },
    }),
    {
      name: "lumiere-auth",
      partialize: (s) => ({ user: s.user, token: s.token }),
    }
  )
);
