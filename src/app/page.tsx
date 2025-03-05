// components/Home.tsx
"use client";

import React, { useState } from "react";
import NotaForm from "./NotaForm";
import NotaCard from "./NotaCard";
import { useNotas } from "../hooks/useNotas";
import { Toaster } from "react-hot-toast";

export default function Home() {
  const {
    notas,
    notaParaEditar,
    setNotaParaEditar,
    adicionarOuAtualizarNota,
    removerNota,
  } = useNotas();
  const [busca, setBusca] = useState<string>("");

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
      <Toaster position="bottom-right" />
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start w-full max-w-4xl">
        <h1 className="text-3xl font-bold">Minhas Notas</h1>

        <input
          type="text"
          placeholder="Buscar notas..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-900 dark:text-white"
        />

        <NotaForm
          onPublicarNota={adicionarOuAtualizarNota}
          notaParaEditar={notaParaEditar}
        />

        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {notasFiltradas.map((nota) => (
            <NotaCard
              key={nota._id}
              nota={nota}
              onDeletar={removerNota}
              onEditar={(nota) => setNotaParaEditar(nota)}
            />
          ))}
        </div>
      </main>

      <footer></footer>
    </div>
  );
}
