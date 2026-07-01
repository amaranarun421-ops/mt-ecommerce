"use client";

import type React from "react";
import { createContext, useContext, useState, useEffect, useCallback } from "react";

export type User = {
  id: string;
  name: string;
  email: string;
  isVerifiedBuyer: boolean;
};

interface AuthContextType {
  user: User | null;
  signIn: (email: string, name?: string) => void;
  signOut: () => void;
  isVerifiedBuyer: boolean;
  setVerifiedBuyer: (v: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isVerifiedBuyer, setIsVerifiedBuyer] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const u = localStorage.getItem("auric-user");
      if (u) setUser(JSON.parse(u));
      const v = localStorage.getItem("auric-verified-buyer");
      if (v === "true") setIsVerifiedBuyer(true);
    } catch {
      // ignore
    }
  }, []);

  const signIn = useCallback((email: string, name?: string) => {
    const newUser: User = {
      id: `user-${Date.now()}`,
      name: name || email.split("@")[0] || "Member",
      email,
      isVerifiedBuyer: localStorage.getItem("auric-verified-buyer") === "true",
    };
    setUser(newUser);
    localStorage.setItem("auric-user", JSON.stringify(newUser));
  }, []);

  const signOut = useCallback(() => {
    setUser(null);
    localStorage.removeItem("auric-user");
  }, []);

  const setVerifiedBuyer = useCallback((v: boolean) => {
    setIsVerifiedBuyer(v);
    localStorage.setItem("auric-verified-buyer", v ? "true" : "false");
    setUser((prev) => (prev ? { ...prev, isVerifiedBuyer: v } : prev));
  }, []);

  return (
    <AuthContext.Provider value={{ user, signIn, signOut, isVerifiedBuyer, setVerifiedBuyer }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
