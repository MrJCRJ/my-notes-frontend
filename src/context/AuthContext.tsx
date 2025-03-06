// context/AuthContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import jwt from "jsonwebtoken";

interface User {
  id: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Captura o token da URL após o redirecionamento do Google
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (token) {
      console.log("Token recebido:", token); // Log do token
      setToken(token);
      const decoded = jwt.decode(token) as {
        id: string;
        email: string;
        role: string;
      };
      console.log("Usuário decodificado:", decoded); // Log do usuário decodificado

      if (decoded && decoded.email) {
        setUser({ id: decoded.id, email: decoded.email, role: decoded.role });
      } else {
        console.error("Email não encontrado no token.");
      }

      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const response = await fetch(
      "https://auth-backend-mauve.vercel.app/login",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      }
    );
    const data = await response.json();
    if (response.ok) {
      setToken(data.token);
      const decoded = jwt.decode(data.token) as {
        id: string;
        email: string;
        role: string;
      };
      setUser({ id: decoded.id, email: decoded.email, role: decoded.role });
    } else {
      throw new Error(data.message);
    }
  };

  const register = async (email: string, password: string) => {
    const response = await fetch(
      "https://auth-backend-mauve.vercel.app/register",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      }
    );
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, register }}>
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
