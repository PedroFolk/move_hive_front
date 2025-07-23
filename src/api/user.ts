import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "http://192.168.68.114:8000";
export const PreencherDadosModal = async (
  biografia: string,
  cidade: string,
  estado: string,
  esportes_praticados: Record<string, string>,
  arquivo_foto?: any,
) => {
  try {
    const token = await AsyncStorage.getItem("token");

    // Monta o objeto com os dados
    const dados = {
      biografia,
      cidade,
      estado,
      esportes_praticados,
    };

    const formData = new FormData();
    // Adiciona o JSON stringificado no campo 'dados'
    formData.append("dados", JSON.stringify(dados));

    if (arquivo_foto) {
      formData.append("foto", arquivo_foto);
    }

    const response = await fetch(`${API_URL}/usuario/DadosModal`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        // NÃO colocar Content-Type, fetch define automaticamente
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
