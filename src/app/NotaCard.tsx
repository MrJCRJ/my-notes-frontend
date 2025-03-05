import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

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

  // Desabilita o scroll da página quando o modal está aberto
  useEffect(() => {
    if (expandido) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    // Limpa o efeito ao desmontar o componente
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [expandido]);

  return (
    <>
      {/* Card da Nota */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
        <h3 className="text-xl font-bold mb-2 dark:text-white">
          {nota.titulo}
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          {nota.conteudo.slice(0, 100)}...
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
            onClick={() => setExpandido(true)}
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            Ver mais
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

      {/* Modal para Nota Expandida */}
      <AnimatePresence>
        {expandido && (
          <>
            {/* Fundo escurecido */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-50 bg-black bg-opacity-50"
              onClick={() => setExpandido(false)}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <h3 className="text-2xl font-bold mb-4 dark:text-white">
                  {nota.titulo}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4 whitespace-pre-wrap">
                  {nota.conteudo}
                </p>
                {nota.tags && (
                  <div className="flex flex-wrap gap-2 mb-4">
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
                <div className="flex gap-4">
                  <button
                    onClick={() => setExpandido(false)}
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Fechar
                  </button>
                  <button
                    onClick={() => {
                      setExpandido(false);
                      onEditar(nota);
                    }}
                    className="text-green-600 dark:text-green-400 hover:underline"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => {
                      setExpandido(false);
                      onDeletar(nota._id);
                    }}
                    className="text-red-600 dark:text-red-400 hover:underline"
                  >
                    Deletar
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
