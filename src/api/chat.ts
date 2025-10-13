import * as SecureStore from "expo-secure-store";
import { API_URL } from "./apiURL";

const getToken = async () => {
  return await SecureStore.getItemAsync("token");
};

export const ListarMeusChats = async () => {
  const token = await getToken();
  try {
    const response = await fetch(`${API_URL}/chat/ExibirChats`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error(`Erro ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Erro ao listar chats:", error);
    return null;
  }
};

export const ConversaChatId = async (id: string) => {
  const token = await getToken();
  try {
    const response = await fetch(`${API_URL}/chat/ExibirConversa/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error(`Erro ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Erro ao listar chat:", error);
    return null;
  }
};

export const EnviarMensagemChat = async (chat_id: string,texto_mensagem:string) => {
  const token = await getToken();
  try {
    const response = await fetch(`${API_URL}/chat/MandarMensagem`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ chat_id, texto_mensagem}),
    });

    if (!response.ok) throw new Error(`Erro ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Erro ao enviar mensagem:", error);
    return null;
  }
};