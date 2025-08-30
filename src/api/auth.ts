import { API_URL } from "./apiURL";
import * as SecureStore from "expo-secure-store";

const formatDateToISO = (brDate: string) => {
  const [dd, mm, yyyy] = brDate.split("/");
  return `${yyyy}-${mm}-${dd}`;
};

export const RegistrarUsuario = async (
  nomeCompleto: string,
  username: string,
  data_nascimeto: string,
  email: string,
  senha: string
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

    await SecureStore.setItemAsync("token", token);
    return data;
  } catch (error) {
    return null;
  }
};

export const LogarUsuario = async (email: string, senha: string) => {
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
    console.log(token);
    await SecureStore.setItemAsync("token", token);

    return data;
  } catch (error) {
    return null;
  }
};

export const EsqueciSenha = async (email: string) => {
  try {
    const response = await fetch(`${API_URL}/usuario/esqueciSenha`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erro ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    const token = data.token;

    await SecureStore.setItemAsync("token", token);

    return data;
  } catch (error) {
    return null;
  }
};

export const VerificarCodigo = async (email: string, codigo: string) => {
  try {
    const response = await fetch(`${API_URL}/usuario/verificarCodigo`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, codigo }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erro ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    const token = data.token;

    await SecureStore.setItemAsync("token", token);

    return data;
  } catch (error) {
    return null;
  }
};

export const ResetarSenha = async (
  email: string,
  codigo: string,
  nova_senha: string
) => {
  try {
    const response = await fetch(`${API_URL}/usuario/resetarSenha`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, codigo, nova_senha }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erro ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    const token = data.token;

    await SecureStore.setItemAsync("token", token);

    return data;
  } catch (error) {
    return null;
  }
};
