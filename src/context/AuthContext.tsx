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
      console.log("Verificando status de login...");

      // Verifica token na URL (redirecionamento OAuth)
      const urlParams = new URLSearchParams(window.location.search);
      const urlToken = urlParams.get("token");

      if (urlToken) {
        console.log("Token encontrado na URL, salvando...");
        localStorage.setItem("jwt_token", urlToken);
        // Limpa a URL após pegar o token
        window.history.replaceState({}, "", window.location.pathname);
        setToken(urlToken);
      }

      const storedToken = localStorage.getItem("jwt_token") || token;
      if (!storedToken) {
        console.log("Nenhum token encontrado, usuário não autenticado");
        setEmail(null);
        return;
      }

      console.log("Validando token com o backend...");
      const response = await fetch("http://localhost:3000/auth/profile", {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Login válido. Email:", data.email);
        setEmail(data.email);
        setToken(storedToken);
        toast.success(`Bem-vindo, ${data.email}!`);
      } else {
        console.warn("Token inválido ou expirado");
        throw new Error("Token inválido");
      }
    } catch (error) {
      console.error("Erro ao verificar login:", error);
      setEmail(null);
      setToken(null);
      localStorage.removeItem("jwt_token");
      toast.error("Sessão expirada. Por favor, faça login novamente.");
    } finally {
      setIsLoading(false);
    }
  }, [token]); // Adicione todas as dependências necessárias aqui

  const logout = async () => {
    setIsLoading(true);
    try {
      console.log("Iniciando logout...");

      if (!token) {
        console.log("Nenhum token encontrado, limpando estado local");
        throw new Error("No token available");
      }

      const response = await fetch("http://localhost:3000/auth/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        console.log("Logout realizado com sucesso");
        toast.success("Logout realizado com sucesso");
      } else {
        console.warn("Erro no servidor durante logout:", response.status);
        throw new Error("Logout failed");
      }
    } catch (error) {
      console.error("Erro durante logout:", error);
      toast.error("Erro durante logout. Limpando dados locais...");
    } finally {
      // Sempre limpa os dados locais, mesmo se o logout remoto falhar
      setEmail(null);
      setToken(null);
      localStorage.removeItem("jwt_token");
      setIsLoading(false);
    }
  };

  // Verifica o login ao montar o componente
  useEffect(() => {
    console.log("AuthProvider montado, verificando autenticação...");
    checkLoginStatus();
  }, [checkLoginStatus]); // Agora checkLoginStatus está incluído nas dependências

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
