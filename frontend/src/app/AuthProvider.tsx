import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import {
  fetchCurrentUser,
  loginRequest,
  logoutRequest,
  registerRequest,
  type AuthUser,
} from "../entities/session";
import { clearTokens, getAccessToken, getRefreshToken, setTokens } from "../shared/lib/authStorage";

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!getAccessToken()) {
      setIsLoading(false);
      return;
    }
    fetchCurrentUser()
      .then(setUser)
      .catch(() => {
        clearTokens();
        setUser(null);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    const tokens = await loginRequest(email, password);
    setTokens(tokens.access_token, tokens.refresh_token);
    setUser(await fetchCurrentUser());
  };

  const register = async (email: string, password: string) => {
    const tokens = await registerRequest(email, password);
    setTokens(tokens.access_token, tokens.refresh_token);
    setUser(await fetchCurrentUser());
  };

  const logout = async () => {
    const refreshToken = getRefreshToken();
    if (refreshToken) {
      await logoutRequest(refreshToken).catch(() => undefined);
    }
    clearTokens();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth должен использоваться внутри AuthProvider");
  }
  return context;
}
