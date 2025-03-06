// components/AuthButtons.tsx
"use client";

import { useAuth } from "../context/AuthContext";
import { FcGoogle } from "react-icons/fc"; // Ícone do Google

export default function AuthButtons() {
  const { user, logout } = useAuth();

  const handleGoogleLogin = () => {
    // Redireciona para o backend de autenticação com Google
    window.location.href =
      "https://auth-backend-jose-ciceros-projects.vercel.app/auth/google";
  };

  return (
    <div>
      {user ? (
        <div className="flex items-center gap-4">
          <span className="text-gray-700 dark:text-gray-300">
            Olá, {user.email}!
          </span>
          <button
            onClick={logout}
            className="text-white bg-red-600 p-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Logout
          </button>
        </div>
      ) : (
        <button
          onClick={handleGoogleLogin}
          className="flex items-center gap-2 text-white bg-red-600 p-2 rounded-lg hover:bg-red-700 transition-colors"
        >
          <FcGoogle className="text-xl" /> {/* Ícone do Google */}
          <span>Login com Google</span>
        </button>
      )}
    </div>
  );
}
