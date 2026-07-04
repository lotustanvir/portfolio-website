import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import toast from "react-hot-toast";
import type { Admin, AuthState, LoginInput } from "@/types/auth";
import * as authService from "@/lib/auth.service";

interface AuthContextValue extends AuthState {
  login: (input: LoginInput) => Promise<void>;
  logout: () => Promise<void>;
  setAdmin: (admin: Admin) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    admin: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    const init = async () => {
      try {
        const admin = await authService.getMe();
        if (admin) {
          setState({ admin, isAuthenticated: true, isLoading: false });
        } else {
          setState({ admin: null, isAuthenticated: false, isLoading: false });
        }
      } catch {
        setState({ admin: null, isAuthenticated: false, isLoading: false });
      }
    };
    init();
  }, []);

  const login = useCallback(async (input: LoginInput) => {
    const admin = await authService.login(input);
    setState({ admin, isAuthenticated: true, isLoading: false });
    toast.success(`Welcome back, ${admin.name}`);
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      // continue with client-side logout even if server call fails
    }
    setState({ admin: null, isAuthenticated: false, isLoading: false });
  }, []);

  const setAdmin = useCallback((admin: Admin) => {
    setState((prev) => ({ ...prev, admin }));
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, logout, setAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
