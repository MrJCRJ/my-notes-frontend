import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Função para buscar as notas
export const buscarNotas = async () => {
  try {
    // Recupera o token do localStorage
    const token = localStorage.getItem("authToken");

    // Faz a requisição ao backend com o token no cabeçalho
    const response = await axios.get(`${API_URL}/notas`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (err) {
    console.error("Erro ao buscar notas", err);
    throw err;
  }
};

// Função para publicar ou atualizar uma nota
export const publicarNota = async (
  titulo: string,
  conteudo: string,
  tags?: string[],
  id?: string
) => {
  try {
    // Recupera o token do localStorage
    const token = localStorage.getItem("authToken");

    if (id) {
      // Atualiza uma nota existente
      const response = await axios.put(
        `${API_URL}/notas/${id}`,
        { titulo, conteudo, tags },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } else {
      // Cria uma nova nota
      const response = await axios.post(
        `${API_URL}/notas`,
        { titulo, conteudo, tags },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    }
  } catch (err) {
    console.error("Erro ao publicar/atualizar nota", err);
    throw err;
  }
};

// Função para deletar uma nota
export const deletarNota = async (id: string) => {
  try {
    // Recupera o token do localStorage
    const token = localStorage.getItem("authToken");

    await axios.delete(`${API_URL}/notas/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (err) {
    console.error("Erro ao deletar nota", err);
    throw err;
  }
};
