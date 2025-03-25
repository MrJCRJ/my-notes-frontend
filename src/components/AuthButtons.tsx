// src/components/AuthButtons.tsx
"use client";

import { useAuth } from "../context/AuthContext";
import { FcGoogle } from "react-icons/fc";
import { useState } from "react";
import { toast } from "react-hot-toast";

interface AuthButtonsProps {
  onLogin: () => void;
}

export default function AuthButtons({ onLogin }: AuthButtonsProps) {
  const { email, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    console.log("Iniciando processo de login com Google...");

    try {
      const frontendOrigin = window.location.origin;
      const callbackUrl = `${frontendOrigin}`;
      const authUrl = `http://localhost:3000/auth/google/init?redirect=${encodeURIComponent(
        callbackUrl
      )}`;

      console.log("URL de redirecionamento gerada:", callbackUrl);
      console.log("URL completa para autenticação:", authUrl);

      // Validação da URL
      if (!isValidUrl(authUrl)) {
        throw new Error("URL de autenticação inválida");
      }

      // Chama a função de callback antes do redirecionamento
      onLogin();

      // Adiciona um pequeno delay para garantir que o estado de loading seja visível
      await new Promise((resolve) => setTimeout(resolve, 300));

      console.log("Redirecionando para o provedor Google...");
      window.location.href = authUrl;
    } catch (error) {
      console.error("Erro durante o login com Google:", error);
      toast.error("Falha ao iniciar o login. Por favor, tente novamente.");
      setIsLoading(false);
    }
  };

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleLogout = async () => {
    console.log("Iniciando logout...");
    try {
      await logout();
      console.log("Logout realizado com sucesso");
      toast.success("Você foi desconectado com sucesso");
    } catch (error) {
      console.error("Erro durante o logout:", error);
      toast.error("Falha ao desconectar. Por favor, tente novamente.");
    }
  };

  console.log("Renderizando AuthButtons. Estado atual:", {
    email,
    isLoading,
  });

  return (
    <div className="auth-buttons-container">
      {email ? (
        <div className="flex items-center gap-4">
          <span className="text-gray-700 dark:text-gray-300">
            Olá, {email}!
          </span>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            aria-label="Logout"
            disabled={isLoading}
          >
            {isLoading ? "Saindo..." : "Logout"}
          </button>
        </div>
      ) : (
        <button
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Login com Google"
        >
          <FcGoogle className="text-xl" aria-hidden="true" />
          <span>{isLoading ? "Carregando..." : "Login com Google"}</span>
        </button>
      )}
    </div>
  );
}
