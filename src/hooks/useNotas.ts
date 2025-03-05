// hooks/useNotas.ts
import { useState, useEffect } from "react";
import {
  buscarNotas,
  publicarNota,
  deletarNota,
} from "../services/notaService";

interface Nota {
  _id: string;
  titulo: string;
  conteudo: string;
  tags?: string[];
}

export const useNotas = () => {
  const [notas, setNotas] = useState<Nota[]>([]);
  const [notaParaEditar, setNotaParaEditar] = useState<Nota | undefined>(
    undefined
  );

  useEffect(() => {
    const carregarNotas = async () => {
      try {
        const notas = await buscarNotas();
        setNotas(notas);
      } catch (err) {
        console.error("Erro ao carregar notas", err);
      }
    };

    carregarNotas();
  }, []);

  const adicionarOuAtualizarNota = async (
    titulo: string,
    conteudo: string,
    tags?: string[]
  ) => {
    try {
      const nota = await publicarNota(
        titulo,
        conteudo,
        tags,
        notaParaEditar?._id
      );
      if (notaParaEditar) {
        setNotas(notas.map((n) => (n._id === nota._id ? nota : n)));
        setNotaParaEditar(undefined);
      } else {
        setNotas([nota, ...notas]);
      }
    } catch (err) {
      console.error("Erro ao adicionar/atualizar nota", err);
    }
  };

  const removerNota = async (id: string) => {
    try {
      await deletarNota(id);
      setNotas(notas.filter((n) => n._id !== id));
    } catch (err) {
      console.error("Erro ao remover nota", err);
    }
  };

  return {
    notas,
    notaParaEditar,
    setNotaParaEditar,
    adicionarOuAtualizarNota,
    removerNota,
  };
};
