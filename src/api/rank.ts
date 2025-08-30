import * as SecureStore from "expo-secure-store";
import { API_URL } from "./apiURL";

const getToken = async () => {
  return await SecureStore.getItemAsync("token");
};


export const ListaRankingTodos = async () => {
  const token = await getToken();
  try {
    const response = await fetch(`${API_URL}/usuario/rankingTodos`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error(`Erro ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Erro ao listar ranking geral:", error);
    return null;
  }
};

export const ListaRankingSeguindo = async () => {
  const token = await getToken();
  try {
    const response = await fetch(`${API_URL}/usuario/rankingSeguindo`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error(`Erro ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Erro ao listar ranking seguindo:", error);
    return null;
  }
};
