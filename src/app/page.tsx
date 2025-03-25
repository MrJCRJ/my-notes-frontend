// src/app/page.tsx
"use client";

import React, { useState, useCallback, useEffect } from "react";
import NotaForm from "../components/NotaForm";
import { useNotas } from "../hooks/useNotas";
import { Toaster } from "react-hot-toast";
import AuthButtons from "../components/AuthButtons";
import SearchBar from "../components/SearchBar";
import NotaList from "../components/NotaList";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const [busca, setBusca] = useState<string>("");
  const { checkLoginStatus } = useAuth();

  const handleGoogleLogin = useCallback(() => {
    const frontendOrigin = window.location.origin;
    const redirectUrl = `${frontendOrigin}/auth/callback`;
    const authUrl = `http://localhost:3000/auth/google/init?redirect=${encodeURIComponent(
      redirectUrl
    )}`;

    try {
      new URL(authUrl);
      window.location.href = authUrl;
    } catch (error) {
      console.error("URL de autenticação inválida:", error);
    }
  }, []);

  const {
    notas,
    notaParaEditar,
    setNotaParaEditar,
    adicionarOuAtualizarNota,
    removerNota,
  } = useNotas(handleGoogleLogin);

  useEffect(() => {
    checkLoginStatus();
  }, [checkLoginStatus]);

  const notasFiltradas = notas.filter((nota) => {
    if (!busca.trim()) return true;

    const buscaLowerCase = busca.toLowerCase();
    return (
      nota.titulo.toLowerCase().includes(buscaLowerCase) ||
      nota.conteudo.toLowerCase().includes(buscaLowerCase) ||
      (nota.tags &&
        nota.tags.some((tag) => tag.toLowerCase().includes(buscaLowerCase)))
    );
  });

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <Toaster
        position="bottom-right"
        toastOptions={{
          className: "dark:bg-gray-800 dark:text-white",
          style: {
            background: "#1F2937",
            color: "#F3F4F6",
            border: "1px solid #374151",
            borderRadius: "8px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          },
          success: {
            style: {
              background: "#10B981",
              color: "#F3F4F6",
              border: "1px solid #059669",
            },
          },
          error: {
            style: {
              background: "#EF4444",
              color: "#F3F4F6",
              border: "1px solid #DC2626",
            },
          },
          loading: {
            style: {
              background: "#1F2937",
              color: "#F3F4F6",
              border: "1px solid #374151",
            },
          },
        }}
      />

      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start w-full max-w-4xl">
        <h1 className="text-3xl font-bold">Minhas Notas</h1>

        <AuthButtons onLogin={handleGoogleLogin} />

        <SearchBar busca={busca} setBusca={setBusca} />

        <NotaForm
          onPublicarNota={adicionarOuAtualizarNota}
          notaParaEditar={notaParaEditar}
          onCancelarEdicao={() => setNotaParaEditar(undefined)}
        />

        <NotaList
          notas={notasFiltradas}
          onDeletar={removerNota}
          onEditar={setNotaParaEditar}
        />
      </main>

      <footer></footer>
    </div>
  );
}
