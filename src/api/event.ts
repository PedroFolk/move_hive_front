import AsyncStorage from "@react-native-async-storage/async-storage";
import { Timestamp } from "react-native-reanimated/lib/typescript/commonTypes";
import { API_URL } from "./apiURL";

export const AdicionarEvento = async (
  usuario_id: string,
  esporte_id: string,
  nome: string,
  localizacao: string,
  data_hora:Timestamp,
  descricao: string,
  max_participantes: bigint,
  nivel_esporte : string,
  tipo_evento: string,
  link_oficial: string
) => {
  try {
    const response = await fetch(`${API_URL}/evento/AdicionarEvento`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        usuario_id,
        esporte_id,
        nome,
        localizacao,
        data_hora,
        descricao,
        max_participantes,
        nivel_esporte,
        tipo_evento,
        link_oficial,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erro ${response.status}: ${errorText}`);
    }
    const data = await response.json();
    const token = data.token;

    // Salva localmente
    await AsyncStorage.setItem("token", token);
    return await data;
  } catch (error) {
    return null;
  }
};

