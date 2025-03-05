import React, { useState } from "react";

interface Nota {
  _id: string;
  titulo: string;
  conteudo: string;
  tags?: string[];
}

interface NotaCardProps {
  nota: Nota;
  onDeletar: (id: string) => void;
  onEditar: (nota: Nota) => void;
}

export default function NotaCard({ nota, onDeletar, onEditar }: NotaCardProps) {
  const [expandido, setExpandido] = useState(false);

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
      <h3 className="text-xl font-bold mb-2 dark:text-white">{nota.titulo}</h3>
      <p className="text-gray-600 dark:text-gray-400">
        {expandido ? nota.conteudo : `${nota.conteudo.slice(0, 100)}...`}
      </p>
      {nota.tags && (
        <div className="flex flex-wrap gap-2 mt-4">
          {nota.tags.map((tag, index) => (
            <span
              key={index}
              className="bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-100 px-2 py-1 rounded-full text-sm"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
      <div className="flex gap-4 mt-4">
        <button
          onClick={() => setExpandido(!expandido)}
          className="text-blue-600 dark:text-blue-400 hover:underline"
        >
          {expandido ? "Ver menos" : "Ver mais"}
        </button>
        <button
          onClick={() => onEditar(nota)}
          className="text-green-600 dark:text-green-400 hover:underline"
        >
          Editar
        </button>
        <button
          onClick={() => onDeletar(nota._id)}
          className="text-red-600 dark:text-red-400 hover:underline"
        >
          Deletar
        </button>
      </div>
    </div>
  );
}
