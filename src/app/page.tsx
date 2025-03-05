"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import NotaForm from "./NotaForm";
import NotaCard from "./NotaCard";

interface Nota {
  _id: string;
  titulo: string;
  conteudo: string;
  tags?: string[];
}

export default function Home() {
  const [notas, setNotas] = useState<Nota[]>([]);
  const [notaParaEditar, setNotaParaEditar] = useState<Nota | undefined>(
    undefined
  );
  const [busca, setBusca] = useState<string>("");

  // Busca as notas ao carregar a página
  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/notas`)
      .then((response) => {
        setNotas(response.data);
      })
      .catch((err) => {
        console.error("Erro ao buscar notas", err);
      });
  }, []);

  // Publica ou atualiza uma nota
  const publicarNota = (titulo: string, conteudo: string, tags?: string[]) => {
    if (notaParaEditar) {
      // Atualiza a nota existente
      axios
        .put(`${process.env.NEXT_PUBLIC_API_URL}/notas/${notaParaEditar._id}`, {
          titulo,
          conteudo,
          tags,
        })
        .then((response) => {
          setNotas(
            notas.map((nota) =>
              nota._id === notaParaEditar._id ? response.data : nota
            )
          );
          setNotaParaEditar(undefined); // Resetar para undefined após a edição
        })
        .catch((err) => {
          console.error("Erro ao atualizar nota", err);
        });
    } else {
      // Cria uma nova nota
      axios
        .post(`${process.env.NEXT_PUBLIC_API_URL}/notas`, {
          titulo,
          conteudo,
          tags,
        })
        .then((response) => {
          setNotas([response.data, ...notas]);
        })
        .catch((err) => {
          console.error("Erro ao publicar nota", err);
        });
    }
  };

  // Deleta uma nota
  const deletarNota = (id: string) => {
    axios
      .delete(`${process.env.NEXT_PUBLIC_API_URL}/notas/${id}`)
      .then(() => {
        setNotas(notas.filter((nota) => nota._id !== id));
      })
      .catch((err) => {
        console.error("Erro ao deletar nota", err);
      });
  };

  // Filtra as notas com base na busca
  const notasFiltradas = notas.filter(
    (nota) =>
      nota.titulo.toLowerCase().includes(busca.toLowerCase()) ||
      nota.conteudo.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start w-full max-w-4xl">
        <h1 className="text-3xl font-bold">Minhas Notas</h1>

        {/* Campo de busca */}
        <input
          type="text"
          placeholder="Buscar notas..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-900 dark:text-white"
        />

        {/* Formulário para publicar ou editar uma nota */}
        <NotaForm
          onPublicarNota={publicarNota}
          notaParaEditar={notaParaEditar}
        />

        {/* Lista de notas */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {notasFiltradas.map((nota) => (
            <NotaCard
              key={nota._id}
              nota={nota}
              onDeletar={deletarNota}
              onEditar={(nota) => setNotaParaEditar(nota)}
            />
          ))}
        </div>
      </main>

      {/* Rodapé */}
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
