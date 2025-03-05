import React from "react";

interface Nota {
  _id: string;
  titulo: string;
  conteudo: string;
}

interface NotaCardProps {
  nota: Nota;
}

export default function NotaCard({ nota }: NotaCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
      <h3 className="text-xl font-bold mb-2 dark:text-white">{nota.titulo}</h3>
      <p className="text-gray-600 dark:text-gray-400">
        {nota.conteudo.slice(0, 100)}...
      </p>
      <button className="mt-4 text-blue-600 dark:text-blue-400 hover:underline">
        Ver mais
      </button>
    </div>
  );
}
