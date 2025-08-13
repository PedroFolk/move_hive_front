import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "./apiURL";


export const ListaTodosPost = async () => {
  const token = await AsyncStorage.getItem("token");
  try {
    const response = await fetch(`${API_URL}/postagem/FeedSemFiltro`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Erro ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erro ao listar postagens:", error);
    return null;
  }
};

export const ExcluirPost = async (postId: any) => {
  const token = await AsyncStorage.getItem("token");
  try {
    const response = await fetch(`${API_URL}/postagem/ExcluirPostagem`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ postagem_id: postId }),
    });

    if (!response.ok) {
      throw new Error(`Erro ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erro ao excluir postagem:", error);
    return null;
  }
};

export const ListarPostProprios = async () => {
  const token = await AsyncStorage.getItem("token");
  try {
    const response = await fetch(`${API_URL}/postagem/ListarPostagens`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Erro ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erro ao listar postagens:", error);
    return null;
  }
};

export const CriarPost = async (
  descricao: string,
  imagem: { uri: string; name: string; type: string },
) => {
  try {
    const token = await AsyncStorage.getItem("token");

    const formData = new FormData();
    formData.append("descricao", descricao);
    formData.append("imagem", {
      uri: imagem.uri,
      name: imagem.name,
      type: imagem.type,
    } as any);

    const response = await fetch(`${API_URL}/postagem/CriarPostagem`, {
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
