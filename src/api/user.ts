import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "./apiURL";

export const PreencherDadosModal = async (
  biografia: string,
  cidade: string,
  estado: string,
  esportes_praticados: Record<string, string>,
  arquivo_foto?: any
) => {
  try {
    const token = await AsyncStorage.getItem("token");

    const dados = {
      biografia,
      cidade,
      estado,
      esportes_praticados,
      arquivo_foto
    };

    const formData = new FormData();
    formData.append("dados", JSON.stringify(dados));

    if (arquivo_foto) {
      formData.append("foto", arquivo_foto);
    }

    const response = await fetch(`${API_URL}/usuario/DadosModal`, {
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
    console.error("Erro ao enviar dados:", error);
    return null;
  }
};

export const ListarDadosPerfil = async () => {
  const token = await AsyncStorage.getItem("token");
  try {
    const response = await fetch(`${API_URL}/usuario/MeuPerfil`, {
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
    console.error("Erro ao listar dados do usuario:", error);
    return null;
  }
};
