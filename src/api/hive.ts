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
