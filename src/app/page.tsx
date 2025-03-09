"use client";

import React, { useState, useCallback } from "react";
import NotaForm from "../components/NotaForm";
import { useNotas } from "../hooks/useNotas";
import { Toaster } from "react-hot-toast";
import AuthButtons from "../components/AuthButtons";
import SearchBar from "../components/SearchBar";
import NotaList from "../components/NotaList";

export default function Home() {
  const [busca, setBusca] = useState<string>("");

  // Função de login
  const handleGoogleLogin = useCallback(() => {
    window.location.href = process.env.NEXT_PUBLIC_AUTH_URL!;
  }, []);

  // Passa a função handleGoogleLogin para o hook useNotas
  const {
    notas,
    notaParaEditar,
    setNotaParaEditar,
    adicionarOuAtualizarNota,
    removerNota,
  } = useNotas(handleGoogleLogin);

  const notasFiltradas = notas.filter((nota) => {
    const buscaLowerCase = busca.toLowerCase();
    const tituloContemBusca = nota.titulo
      .toLowerCase()
      .includes(buscaLowerCase);
    const conteudoContemBusca = nota.conteudo
      .toLowerCase()
      .includes(buscaLowerCase);
    const tagsContemBusca = nota.tags?.some((tag) =>
      tag.toLowerCase().includes(buscaLowerCase)
    );
    return tituloContemBusca || conteudoContemBusca || tagsContemBusca;
  });

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      {/* Toaster personalizado */}
      <Toaster
        position="bottom-right"
        toastOptions={{
          className: "dark:bg-gray-800 dark:text-white",
          style: {
            background: "#1F2937", // Cor de fundo escura
            color: "#F3F4F6", // Cor do texto clara
            border: "1px solid #374151", // Borda sutil
            borderRadius: "8px", // Bordas arredondadas
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", // Sombra suave
          },
          success: {
            style: {
              background: "#10B981", // Verde para sucesso
              color: "#F3F4F6",
              border: "1px solid #059669",
            },
          },
          error: {
            style: {
              background: "#EF4444", // Vermelho para erro
              color: "#F3F4F6",
              border: "1px solid #DC2626",
            },
          },
          loading: {
            style: {
              background: "#1F2937", // Fundo escuro para loading
              color: "#F3F4F6",
              border: "1px solid #374151",
            },
          },
        }}
      />

      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start w-full max-w-4xl">
        <h1 className="text-3xl font-bold">Minhas Notas</h1>

        {/* Botões de Autenticação */}
        <AuthButtons onLogin={handleGoogleLogin} />

        {/* Barra de Busca */}
        <SearchBar busca={busca} setBusca={setBusca} />

        {/* Formulário de Nota */}
        <NotaForm
          onPublicarNota={adicionarOuAtualizarNota}
          notaParaEditar={notaParaEditar}
        />

        {/* Lista de Notas */}
        <NotaList
          notas={notasFiltradas}
          onDeletar={removerNota}
          onEditar={(nota) => setNotaParaEditar(nota)}
        />
      </main>

      <footer></footer>
    </div>
  );
}
