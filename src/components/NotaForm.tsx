import React, { useState, useEffect } from "react";

interface NotaFormProps {
  onPublicarNota: (titulo: string, conteudo: string, tags?: string[]) => void;
  notaParaEditar?: {
    _id: string;
    titulo: string;
    conteudo: string;
    tags?: string[];
  };
}

export default function NotaForm({
  onPublicarNota,
  notaParaEditar,
}: NotaFormProps) {
  const [titulo, setTitulo] = useState<string>("");
  const [conteudo, setConteudo] = useState<string>("");
  const [tags, setTags] = useState<string>("");

  useEffect(() => {
    if (notaParaEditar) {
      setTitulo(notaParaEditar.titulo);
      setConteudo(notaParaEditar.conteudo);
      setTags(notaParaEditar.tags?.join(", ") || "");
    }
  }, [notaParaEditar]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const tagsArray = tags.split(",").map((tag) => tag.trim());
    onPublicarNota(titulo, conteudo, tagsArray);
    setTitulo("");
    setConteudo("");
    setTags("");
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
        <input
          type="text"
          placeholder="Tags (separadas por vírgula)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="w-full p-2 mb-4 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-900 dark:text-white"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
        >
          {notaParaEditar ? "Atualizar Nota" : "Publicar Nota"}
        </button>
      </form>
    </div>
  );
}
