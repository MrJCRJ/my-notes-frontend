// components/Login.tsx
import React from "react";

export default function Login() {
  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5001/auth/google";
  };

  return (
    <div>
      <button
        onClick={handleGoogleLogin}
        className="bg-red-600 text-white p-2 rounded"
      >
        Login com Google
      </button>
    </div>
  );
}
