"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { User, MOCK_USERS } from "./permission";

/* ── Auth Context Type ── */
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/* ── Storage key ── */
const AUTH_KEY = "erp_jigsaw_auth";

/* ── Provider ── */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(AUTH_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as User;
        setUser(parsed);
      }
    } catch {
      localStorage.removeItem(AUTH_KEY);
    }
    setIsLoading(false);
  }, []);

  // Mock login — in production, call real API
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const login = useCallback(async (email: string, _password: string): Promise<boolean> => {
    // Mock: match by email or use preset users
    const mockUser =
      Object.values(MOCK_USERS).find((u) => u.email === email) ||
      MOCK_USERS.admin; // fallback to admin for any login

    setUser(mockUser);
    localStorage.setItem(AUTH_KEY, JSON.stringify(mockUser));
    return true;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(AUTH_KEY);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/* ── Hook ── */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
