// context/AuthContext.tsx
"use client";

import React, { createContext, useContext, useState } from "react";

interface AuthContextType {
  email: string | null;
  token: string | null;
  logout: () => void;
  checkLoginStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

// context/AuthContext.tsx
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [email, setEmail] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const checkLoginStatus = async () => {
    try {
      // Verifica se há token na URL (redirecionamento do Google)
      const urlParams = new URLSearchParams(window.location.search);
      const urlToken = urlParams.get("token");

      if (urlToken) {
        localStorage.setItem("jwt_token", urlToken);
        window.history.replaceState({}, "", window.location.pathname);
        setToken(urlToken);
      }

      const storedToken = localStorage.getItem("jwt_token") || token;
      if (!storedToken) {
        setEmail(null);
        return;
      }

      const response = await fetch(
        "https://authenticador-service-production.up.railway.app/auth/profile",
        {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setEmail(data.email);
        setToken(storedToken);
      } else {
        throw new Error("Erro ao verificar login");
      }
    } catch (error) {
      console.error("Error:", error);
      setEmail(null);
      setToken(null);
      localStorage.removeItem("jwt_token");
    }
  };

  const logout = async () => {
    try {
      const response = await fetch(
        "https://authenticador-service-production.up.railway.app/auth/logout",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setEmail(null);
        setToken(null);
        localStorage.removeItem("jwt_token");
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
