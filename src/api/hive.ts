import * as SecureStore from "expo-secure-store";
import { API_URL } from "./apiURL";

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

export const AdicionarHive = async (hive: {
  id?: string;
  titulo: string;
  descricao: string;
  esporte_nome: string;
  data_hora_str: Date;
  localizacao: string;
  endereco: string;
  max_participantes: number;
  privado: boolean;
  observacoes: string;
  arquivo_foto?: { uri: string; name: string; type: string };
}) => {
  try {
    const token = await getToken();
    if (!token) throw new Error("Token não encontrado");

    const formData = new FormData();
    formData.append("titulo", hive.titulo);
    formData.append("descricao", hive.descricao);
    formData.append("esporte_nome", hive.esporte_nome);
    formData.append("data_hora_str", formatarDataISO(hive.data_hora_str));
    formData.append("localizacao", hive.localizacao);
    formData.append("endereco", hive.endereco);
    formData.append("max_participantes", hive.max_participantes.toString());
    formData.append("privado", hive.privado ? "true" : "false");
    formData.append("observacoes", hive.observacoes);

    if (hive.arquivo_foto) {
      formData.append("arquivo_foto", {
        uri: hive.arquivo_foto.uri,
        name: hive.arquivo_foto.name,
        type: hive.arquivo_foto.type,
      } as any);
    }

    const response = await fetch(`${API_URL}/hive/AdicionarHive`, {
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

export const ListarTodosHives = async () => {
  const token = await getToken();
  try {
    const response = await fetch(`${API_URL}/hive/listarTodosHive`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error(`Erro ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Erro ao listar meus hives:", error);
    return null;
  }
};

export const ParticiparHive = async (hive_id: string) => {
  const token = await getToken();

  try {
    const response = await fetch(`${API_URL}/hive/participarHive`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ hive_id }),
    });

    if (!response.ok) {
      throw new Error(`Erro ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Erro ao participar da hive:", error);
    return null;
  }
};

export const cancelarParticipacaoHive = async (hive_id: string) => {
  const token = await getToken();

  try {
    const response = await fetch(`${API_URL}/hive/cancelarParticipacaoHive`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ hive_id }),
    });

    if (!response.ok) {
      throw new Error(`Erro ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Erro ao cancelar participacao da hive:", error);
    return null;
  }
};

export const DeletarHive = async (hive_id: string) => {
  const token = await getToken();
  try {
    const response = await fetch(`${API_URL}/hive/deletarHive`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ hive_id }),
    });

    if (!response.ok) throw new Error(`Erro ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Erro ao deletar hive:", error);
    return null;
  }
};

export const EditarHive = async (hive: {
  id: string;
  titulo?: string;
  descricao?: string;
  esporte_nome?: string;
  data_hora_str?: Date;
  localizacao?: string;
  endereco?: string;
  max_participantes?: number;
  privado?: boolean;
  observacoes?: string;
  arquivo_foto?: { uri: string; name?: string; type?: string };
}): Promise<object> => {
  try {
    const token = await getToken();
    if (!token) throw new Error("Token não encontrado");

    const formData = new FormData();

    Object.entries(hive).forEach(([key, value]) => {
      if (value !== undefined) {
        if (
          key === "arquivo_foto" &&
          typeof value === "object" &&
          "uri" in value
        ) {
          // Aqui garantimos que value tem uri
          formData.append("arquivo_foto", {
            uri: value.uri,
            name: value.name ?? "hive_photo.jpg",
            type: value.type ?? "image/jpeg",
          } as any);
        } else if (key === "data_hora_str" && value instanceof Date) {
          formData.append(key, formatarDataISO(value));
        } else {
          formData.append(key, String(value));
        }
      }
    });

    const response = await fetch(`${API_URL}/hive/editarHive`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    // Debug rápido caso ainda retorne HTML
    const text = await response.text();
    try {
      const data = JSON.parse(text);
      if (!response.ok)
        throw new Error(data.erro || data.mensagem || response.statusText);
      return data;
    } catch {
      throw new Error(`Resposta inválida do servidor: ${text}`);
    }
  } catch (error: any) {
    console.error("Erro ao editar dados do hive:", error);
    return { erro: error.message ?? "Erro desconhecido ao editar hive." };
  }
};
