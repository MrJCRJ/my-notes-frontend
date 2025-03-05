import React, { useState } from "react";

interface NotaFormProps {
  onPublicarNota: (titulo: string, conteudo: string) => void;
}

export default function NotaForm({ onPublicarNota }: NotaFormProps) {
  const [titulo, setTitulo] = useState < string > ("");
  const [conteudo, setConteudo] = useState < string > ("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onPublicarNota(titulo, conteudo);
    setTitulo("");
    setConteudo("");
  };

  return (
    <div className="w-full bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Título"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          className="w-full p-2 mb-4 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-900 dark:text-white"
          required
        />
        <textarea
          placeholder="Conteúdo"
          value={conteudo}
          onChange={(e) => setConteudo(e.target.value)}
          className="w-full p-2 mb-4 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-900 dark:text-white"
          rows={4}
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Publicar Nota
        </button>
      </form>
    </div>
  );
}