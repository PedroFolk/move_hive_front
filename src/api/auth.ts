import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "./apiURL";

const formatDateToISO = (brDate: string) => {
  const [dd, mm, yyyy] = brDate.split("/");
  return `${yyyy}-${mm}-${dd}`;
};

export const RegistrarUsuario = async (
  nomeCompleto: string,
  username: string,
  data_nascimeto: string,
  email: string,
  senha: string,
) => {
  try {
    const dataFormatada = formatDateToISO(data_nascimeto);

    const response = await fetch(`${API_URL}/usuario/RegistrarUsuario`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        NomeCompleto: nomeCompleto,
        username,
        data_nascimento: dataFormatada,
        email,
        senha,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erro ${response.status}: ${errorText}`);
    }
    const data = await response.json();
    const token = data.token;

    await AsyncStorage.setItem("token", token);
    return await data;
  } catch (error) {
    return null;
  }
};

export const LogarUsuario = async (email: string, senha: string) => {
  console.log(API_URL)
  try {
    
    const response = await fetch(`${API_URL}/usuario/LoginUsuario`, {
      
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, senha }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erro ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    const token = data.token;

    await AsyncStorage.setItem("token", token);

    return data;
  } catch (error) {
    return null;
  }
};
