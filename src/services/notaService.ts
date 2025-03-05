// services/notaService.ts
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const buscarNotas = async () => {
  try {
    const response = await axios.get(`${API_URL}/notas`);
    return response.data;
  } catch (err) {
    console.error("Erro ao buscar notas", err);
    throw err;
  }
};

export const publicarNota = async (
  titulo: string,
  conteudo: string,
  tags?: string[],
  id?: string
) => {
  try {
    if (id) {
      const response = await axios.put(`${API_URL}/notas/${id}`, {
        titulo,
        conteudo,
        tags,
      });
      return response.data;
    } else {
      const response = await axios.post(`${API_URL}/notas`, {
        titulo,
        conteudo,
        tags,
      });
      return response.data;
    }
  } catch (err) {
    console.error("Erro ao publicar/atualizar nota", err);
    throw err;
  }
};

export const deletarNota = async (id: string) => {
  try {
    await axios.delete(`${API_URL}/notas/${id}`);
  } catch (err) {
    console.error("Erro ao deletar nota", err);
    throw err;
  }
};
