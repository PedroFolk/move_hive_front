import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "./apiURL";

interface ImagemEvento {
  uri: string;
  name: string;
  type: string;
}

const formatarDataISO = (data: Date) => {
  const pad = (n: number) => n.toString().padStart(2, "0");

  const ano = data.getFullYear();
  const mes = pad(data.getMonth() + 1); // meses começam do 0
  const dia = pad(data.getDate());
  const hora = pad(data.getHours());
  const min = pad(data.getMinutes());
  const seg = pad(data.getSeconds());

  return `${ano}-${mes}-${dia}T${hora}:${min}:${seg}`;
};

export const ListarMeusEventos = async () => {
  const token = await AsyncStorage.getItem("token");
  try {
    const response = await fetch(`${API_URL}/evento/meusEventos`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error(`Erro ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Erro ao listar eventos:", error);
    return null;
  }
};

export const ParticiparEvento = async (evento_id: string) => {
  const token = await AsyncStorage.getItem("token");
  try {
    const response = await fetch(`${API_URL}/evento/participarEvento`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ evento_id }),
    });

    if (!response.ok) throw new Error(`Erro ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Erro ao participar do evento:", error);
    return null;
  }
};

export const CancelarParticipacao = async (evento_id: string) => {
  const token = await AsyncStorage.getItem("token");
  try {
    const response = await fetch(`${API_URL}/evento/cancelarParticipacao`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ evento_id }),
    });

    if (!response.ok) throw new Error(`Erro ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Erro ao participar do evento:", error);
    return null;
  }
};

export const DeletarEvento = async (evento_id: string) => {
  const token = await AsyncStorage.getItem("token");
  try {
    const response = await fetch(`${API_URL}/evento/deletarEvento`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ evento_id }),
    });

    if (!response.ok) throw new Error(`Erro ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Erro ao participar do evento:", error);
    return null;
  }
};

export const ListarTodosEventos = async () => {
  const token = await AsyncStorage.getItem("token");
  try {
    const response = await fetch(`${API_URL}/evento/listarEventos`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error(`Erro ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Erro ao listar eventos:", error);
    return null;
  }
};

export const ListarTodosTorneios = async () => {
  const token = await AsyncStorage.getItem("token");
  try {
    const response = await fetch(`${API_URL}/evento/listarTorneios`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error(`Erro ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Erro ao listar torneios:", error);
    return null;
  }
};

export const CriarEvento = async (
  titulo: string,
  descricao: string,
  esporte_nome: string,
  data_hora: Date,
  localizacao: string,
  max_participantes: number,
  torneio: boolean,
  premiacao: string,
  privado: boolean,
  observacoes: string,
  imagem?: { uri: string; name: string; type: string }
) => {
  try {
    const token = await AsyncStorage.getItem("token");
    if (!token) throw new Error("Token não encontrado");

    const formData = new FormData();

    formData.append("titulo", titulo);
    formData.append("descricao", descricao);
    formData.append("esporte_nome", esporte_nome);
    formData.append("data_hora_str", formatarDataISO(data_hora));
    formData.append("localizacao", localizacao);
    formData.append("max_participantes", max_participantes.toString());
    formData.append("torneio", torneio ? "true" : "false");
    formData.append("premiacao", premiacao);
    formData.append("privado", privado ? "true" : "false");
    formData.append("observacoes", observacoes);

    if (imagem) {
      formData.append("arquivo_foto", {
        uri: imagem.uri,
        name: imagem.name,
        type: imagem.type,
      } as any);
    }

    const response = await fetch(`${API_URL}/evento/AdicionarEvento`, {
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
    console.error("Erro ao criar evento:", error);
    return null;
  }
};
