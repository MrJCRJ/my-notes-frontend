// hooks/useNotas.ts
import { useState, useEffect } from "react";
import {
  buscarNotas,
  publicarNota,
  deletarNota,
} from "../services/notaService";
import Swal from "sweetalert2";
import toast from "react-hot-toast";

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
        toast.error("Erro ao carregar notas.");
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
        toast.success("Nota atualizada com sucesso!");
      } else {
        setNotas([nota, ...notas]);
        toast.success("Nota adicionada com sucesso!");
      }
    } catch (err) {
      console.error("Erro ao adicionar/atualizar nota", err);
      toast.error("Erro ao adicionar/atualizar nota.");
    }
  };

  const removerNota = async (id: string) => {
    const result = await Swal.fire({
      title: "Tem certeza?",
      text: "Você não poderá reverter isso!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sim, remover!",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await deletarNota(id);
        setNotas(notas.filter((n) => n._id !== id));
        toast.success("Nota removida com sucesso!");
      } catch (err) {
        console.error("Erro ao remover nota", err);
        toast.error("Erro ao remover nota.");
      }
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
