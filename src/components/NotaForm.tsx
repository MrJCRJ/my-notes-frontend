// src/components/NotaForm.tsx
import React, { useState, useEffect } from "react";

interface NotaFormProps {
  onPublicarNota: (titulo: string, conteudo: string, tags?: string[]) => void;
  notaParaEditar?: {
    _id: string;
    titulo: string;
    conteudo: string;
    tags?: string[];
  };
  onCancelarEdicao: () => void;
}

export default function NotaForm({
  onPublicarNota,
  notaParaEditar,
  onCancelarEdicao,
}: NotaFormProps) {
  const [titulo, setTitulo] = useState<string>("");
  const [conteudo, setConteudo] = useState<string>("");
  const [tags, setTags] = useState<string>("");

  useEffect(() => {
    if (notaParaEditar) {
      setTitulo(notaParaEditar.titulo);
      setConteudo(notaParaEditar.conteudo);
      setTags(notaParaEditar.tags?.join(", ") || "");
    } else {
      resetForm();
    }
  }, [notaParaEditar]);

  const resetForm = () => {
    setTitulo("");
    setConteudo("");
    setTags("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const tagsArray = tags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);
    onPublicarNota(
      titulo,
      conteudo,
      tagsArray.length > 0 ? tagsArray : undefined
    );
    resetForm();
  };

  const handleCancelar = () => {
    resetForm();
    onCancelarEdicao();
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
        <div className="flex gap-2">
          <button
            type="submit"
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            {notaParaEditar ? "Atualizar Nota" : "Publicar Nota"}
          </button>
          {notaParaEditar && (
            <button
              type="button"
              onClick={handleCancelar}
              className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
