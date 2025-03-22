// context/AuthContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface AuthContextType {
  email: string | null;
  token: string | null;
  logout: () => void;
  checkLoginStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [email, setEmail] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const checkLoginStatus = async () => {
    try {
      const response = await fetch(
        "https://authenticador-service-production.up.railway.app/auth/profile",
        {
          credentials: "include", // Inclui cookies na requisição
        }
      );

      if (response.ok) {
        const data = await response.json();
        setEmail(data.email); // Supondo que o backend retorne o email
        setToken(data.token); // Supondo que o backend retorne o token
      } else if (response.status === 401) {
        throw new Error("Token inválido ou expirado");
      } else {
        throw new Error("Erro ao verificar o status de login");
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      setEmail(null);
      setToken(null);
    }
  };

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const logout = async () => {
    try {
      const response = await fetch(
        "https://authenticador-service-production.up.railway.app/auth/logout",
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (response.ok) {
        setEmail(null);
        setToken(null);
      } else {
        throw new Error("Erro ao fazer logout");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ email, token, logout, checkLoginStatus }}>
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
