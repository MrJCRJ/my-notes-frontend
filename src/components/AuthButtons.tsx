// src/components/AuthButtons.tsx
"use client";

import { useAuth } from "../context/AuthContext";
import { FcGoogle } from "react-icons/fc";
import { useState } from "react";

interface AuthButtonsProps {
  onLogin: () => void;
}

export default function AuthButtons({ onLogin }: AuthButtonsProps) {
  const { email, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = () => {
    setIsLoading(true);
    const frontendOrigin = window.location.origin;
    window.location.href = `https://authenticador-service-production.up.railway.app/auth/google/init?redirect=${encodeURIComponent(
      frontendOrigin
    )}`;
    onLogin();
  };

  return (
    <div>
      {email ? (
        <div className="flex items-center gap-4">
          <span className="text-gray-700 dark:text-gray-300">
            Olá, {email}!
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
