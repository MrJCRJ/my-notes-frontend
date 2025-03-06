// components/AuthButtons.tsx
"use client";

import { useAuth } from "../context/AuthContext";

export default function AuthButtons() {
  const { user, logout } = useAuth();

  const handleGoogleLogin = () => {
    // Redireciona para o backend de autenticação com Google
    window.location.href = "http://localhost:5001/auth/google";
  };

  return (
    <div>
      {user ? (
        <button onClick={logout} className="text-red-600 dark:text-red-400">
          Logout
        </button>
      ) : (
        <button
          onClick={handleGoogleLogin}
          className="text-white bg-red-600 p-2 rounded-lg"
        >
          Login com Google
        </button>
      )}
    </div>
  );
}
