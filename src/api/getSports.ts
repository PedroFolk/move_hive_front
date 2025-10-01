import * as SecureStore from "expo-secure-store";
import { API_URL } from "./apiURL";

const getToken = async () => {
  return await SecureStore.getItemAsync("token");
};

export const ListarEsportes = async () => {
  const token = await getToken();
  try {
    const response = await fetch(`${API_URL}/esportes/ListarEsportes`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error(`Erro ${response.status}`);
    const data = await response.json();

    return data.map((item: any) => ({
      label: item.nome,
      value: item.id, 
      foto: item.Foto || item.foto || null,
    }));
  } catch (error) {
    console.error("Erro ao listar esportes:", error);
    return [];
  }
};
