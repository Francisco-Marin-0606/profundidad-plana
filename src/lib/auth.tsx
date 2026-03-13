import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { isLoggedIn, setToken, clearToken } from "./api";

interface AuthContextType {
  authenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  authenticated: false,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authenticated, setAuthenticated] = useState(isLoggedIn);

  useEffect(() => {
    setAuthenticated(isLoggedIn());
  }, []);

  const login = (token: string) => {
    setToken(token);
    setAuthenticated(true);
  };

  const logout = () => {
    clearToken();
    setAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ authenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
