// context/AuthContext.tsx
"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { toast } from "react-hot-toast";

interface AuthContextType {
  email: string | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  logout: () => Promise<void>;
  checkLoginStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [email, setEmail] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const isAuthenticated = !!token;

  const checkLoginStatus = useCallback(async () => {
    setIsLoading(true);
    try {
      // 1. Verifica token na URL (redirecionamento OAuth)
      const urlParams = new URLSearchParams(window.location.search);
      const urlToken = urlParams.get("token");

      let currentToken = token;

      if (urlToken) {
        console.log("Token encontrado na URL, salvando...");
        localStorage.setItem("jwt_token", urlToken);
        window.history.replaceState({}, "", window.location.pathname);
        currentToken = urlToken;
        setToken(urlToken);
      }

      // 2. Pega o token do localStorage
      const storedToken = localStorage.getItem("jwt_token") || currentToken;
      if (!storedToken) {
        console.log("Nenhum token encontrado, usuário não autenticado");
        setEmail(null);
        return;
      }

      // 3. Valida o token com o backend
      console.log("Validando token com o backend...");
      const response = await fetch("http://localhost:3000/auth/profile", {
        headers: {
          Authorization: `Bearer ${storedToken}`,
          "Content-Type": "application/json",
        },
        credentials: "include", // Importante para cookies
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (!data?.email) {
        throw new Error("Resposta do servidor inválida - email não encontrado");
      }

      console.log("Login válido. Email:", data.email);
      setEmail(data.email);
      setToken(storedToken);
    } catch (error) {
      console.error("Erro ao verificar login:", error);
      setEmail(null);
      setToken(null);
      localStorage.removeItem("jwt_token");

      if (token) {
        // Só mostra erro se já estava autenticado
        toast.error("Sessão expirada. Por favor, faça login novamente.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  const logout = async () => {
    setIsLoading(true);
    try {
      if (token) {
        await fetch("http://localhost:3000/auth/logout", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        });
      }
    } catch (error) {
      console.error("Erro durante logout:", error);
    } finally {
      setEmail(null);
      setToken(null);
      localStorage.removeItem("jwt_token");
      setIsLoading(false);
      toast.success("Logout realizado com sucesso");
    }
  };

  // Verifica o login ao montar o componente
  useEffect(() => {
    checkLoginStatus();
  }, [checkLoginStatus]);

  return (
    <AuthContext.Provider
      value={{
        email,
        token,
        isAuthenticated,
        isLoading,
        logout,
        checkLoginStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
