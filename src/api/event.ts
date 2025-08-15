import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "./apiURL";

interface ImagemEvento {
  uri: string;
  name: string;
  type: string;
}

export const CriarEvento = async (
  id: string,
  titulo: string,
  descricao: string,
  esporte_nome: string,
  data_hora: string,
  localizacao: string,
  max_participantes: string,
  torneio: string,
  premiacao: string,
  privado: string,
  observacoes: string,
  imagem: ImagemEvento
) => {
  try {
    const token = await AsyncStorage.getItem("token");
    if (!token) throw new Error("Token não encontrado");

    const formData = new FormData();
    formData.append("id", id);
    formData.append("titulo", titulo);
    formData.append("descricao", descricao);
    formData.append("esporte_nome", esporte_nome);
    formData.append("data_hora", data_hora);
    formData.append("localizacao", localizacao);
    formData.append("max_participantes", max_participantes);
    formData.append("torneio", torneio);
    formData.append("premiacao", premiacao);
    formData.append("privado", privado);
    formData.append("observacoes", observacoes);

    formData.append("imagem", {
      uri: imagem.uri,
      name: imagem.name,
      type: imagem.type,
    } as any);

    const response = await fetch(`${API_URL}/evento/AdicionarEvento`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
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
