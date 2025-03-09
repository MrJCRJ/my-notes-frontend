"use client";

import { useAuth } from "../context/AuthContext";
import { FcGoogle } from "react-icons/fc";
import { useState } from "react";

// Defina a interface do usuário
interface User {
  id: string;
  email: string;
  name: string; // Adicione o campo name
  role: string;
}

interface AuthButtonsProps {
  onLogin: () => void; // Adicione uma prop para a função de login
}

export default function AuthButtons({ onLogin }: AuthButtonsProps) {
  const { user, logout } = useAuth<User>(); // Passa a interface User como argumento de tipo
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = () => {
    setIsLoading(true);
    // Usa a URL da variável de ambiente
    window.location.href = process.env.NEXT_PUBLIC_AUTH_URL!;
    onLogin(); // Chama a função de login passada como prop
  };

  return (
    <div>
      {user ? (
        <div className="flex items-center gap-4">
          <span className="text-gray-700 dark:text-gray-300">
            Olá, {user.name}! {/* Exibe o nome do usuário */}
          </span>
          <button
            onClick={logout}
            className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            aria-label="Logout"
          >
            Logout
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
