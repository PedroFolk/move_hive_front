import * as SecureStore from "expo-secure-store";
import { API_URL } from "~/core/api/apiURL";

const getToken = async () => {
  return await SecureStore.getItemAsync("token");
};

const formatarDataISO = (data: Date) => {
  const pad = (n: number) => n.toString().padStart(2, "0");

  const ano = data.getFullYear();
  const mes = pad(data.getMonth() + 1);
  const dia = pad(data.getDate());
  const hora = pad(data.getHours());
  const min = pad(data.getMinutes());
  const seg = pad(data.getSeconds());

  return `${ano}-${mes}-${dia}T${hora}:${min}:${seg}`;
};

export const PostarTreino = async (treino: {
  id: string;
  titulo: string;
  descricao: string;
  nome_esporte: string;
  data_hora_str: Date;
  lugar: string;
  tempo_treinado: number;
  imagem?: { uri: string; name: string; type: string };
}) => {
  try {
    const token = await getToken();
    if (!token) throw new Error("Token não encontrado");

    const formData = new FormData();
    formData.append("id", treino.id);
    formData.append("titulo", treino.titulo);
    formData.append("descricao", treino.descricao);
    formData.append("nome_esporte", treino.nome_esporte);
    formData.append("data_hora_str", formatarDataISO(treino.data_hora_str));

    formData.append("lugar", treino.lugar);
    formData.append("tempo_treinado", treino.tempo_treinado.toString());

    if (treino.imagem) {
      formData.append("arquivo_imagem", {
        uri: treino.imagem.uri,
        name: treino.imagem.name,
        type: treino.imagem.type,
      } as any);
    }
    const response = await fetch(`${API_URL}/treino/AdicionarTreino`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erro ${response.status}: ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Erro ao criar post:", error);
    return null;
  }
};

export const ListarTreinos = async () => {
  const token = await getToken();
  try {
    const response = await fetch(`${API_URL}/treino/ListarTreino`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error(`Erro ${response.status}`);
    
    return await response.json();
    
  } catch (error) {
    console.error("Erro ao listar treinos:", error);
    return null;
  }
};

export const DeletarTreino = async (treino_id: string) => {
  const token = await getToken();
  try {
    const response = await fetch(`${API_URL}/treino/ExcluirTreino`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ treino_id }),
    });

    if (!response.ok) throw new Error(`Erro ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Erro ao deletar evento:", error);
    return null;
  }
};

export const FeedTreinoSeguindo = async () => {
  const token = await getToken();
  try {
    const response = await fetch(`${API_URL}/treino/FeedTreinosSeguindo`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error(`Erro ${response.status}`);
    
    return await response.json();
    
  } catch (error) {
    console.error("Erro ao listar treinos:", error);
    return null;
  }
};