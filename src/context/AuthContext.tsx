// context/AuthContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import jwt from "jsonwebtoken";

// Defina a interface do usuário
interface User {
  id: string;
  email: string;
  role: string;
}

// Defina o tipo do contexto com tipagem genérica
interface AuthContextType<T> {
  user: T | null;
  token: string | null;
  logout: () => void;
}

// Crie o contexto sem um valor padrão explícito
const AuthContext = createContext<AuthContextType<unknown> | null>(null);

// Função para decodificar e validar o token
const decodeToken = (token: string): User | null => {
  try {
    const decoded = jwt.decode(token) as {
      id: string;
      email: string;
      role: string;
    };
    if (decoded && decoded.email) {
      return { id: decoded.id, email: decoded.email, role: decoded.role };
    }
    return null;
  } catch (error) {
    console.error("Erro ao decodificar o token:", error);
    return null;
  }
};

// Provedor do contexto
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Verifica se há um token no localStorage ao carregar o componente
  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    if (storedToken) {
      const decodedUser = decodeToken(storedToken);
      if (decodedUser) {
        setUser(decodedUser);
        setToken(storedToken);
      }
    }
  }, []);

  // Captura o token da URL após o redirecionamento do Google
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (token) {
      const decodedUser = decodeToken(token);
      if (decodedUser) {
        setUser(decodedUser);
        setToken(token);
        localStorage.setItem("authToken", token); // Armazena o token no localStorage
      }
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("authToken"); // Remove o token do localStorage
  };

  return (
    <AuthContext.Provider value={{ user, token, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar o contexto
export const useAuth = <T,>() => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context as AuthContextType<T>;
};
