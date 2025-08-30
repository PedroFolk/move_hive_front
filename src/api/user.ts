import * as SecureStore from "expo-secure-store";
import { API_URL } from "./apiURL";

const getToken = async () => {
  return await SecureStore.getItemAsync("token");
};
const getUserId = async () => {
  return await SecureStore.getItemAsync("userId");
};

export const PreencherDadosModal = async (
  biografia: string,
  cidade: string,
  estado: string,
  esportes_praticados: Record<string, string>,
  arquivo_foto?: any
) => {
  try {
    const token = await getToken();
    if (!token) throw new Error("Token não encontrado");

    const dados = {
      biografia,
      cidade,
      estado,
      esportes_praticados,
      arquivo_foto,
    };

    const formData = new FormData();
    formData.append("dados", JSON.stringify(dados));

    if (arquivo_foto) {
      formData.append("foto", arquivo_foto);
    }

    const response = await fetch(`${API_URL}/usuario/DadosModal`, {
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
    console.error("Erro ao enviar dados:", error);
    return null;
  }
};

export const ListarDadosPerfil = async () => {
  const token = await getToken();
  try {
    const response = await fetch(`${API_URL}/usuario/MeuPerfil`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error(`Erro ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Erro ao listar dados do usuario:", error);
    return null;
  }
};

export const SugerirPerfis = async () => {
  const token = await getToken();
  try {
    const response = await fetch(`${API_URL}/usuario/usuariosComFiltro`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error(`Erro ${response.status}`);
    const data = await response.json();
    return data.usuarios || [];
  } catch (error) {
    console.error("Erro ao buscar sugestões de perfis:", error);
    return [];
  }
};

export const SeguirUsuario = async (id_seguido: string) => {
  const token = await getToken();
  try {
    const response = await fetch(`${API_URL}/usuario/follow`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ seguido_id: id_seguido }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erro ${response.status}: ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Erro ao seguir usuario:", error);
    return null;
  }
};

export const PararDeSeguirUsuario = async (id_seguido: string) => {
  const token = await getToken();
  try {
    const response = await fetch(`${API_URL}/usuario/unfollow`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ seguido_id: id_seguido }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erro ${response.status}: ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Erro ao parar de seguir usuario:", error);
    return null;
  }
};

export const UsuariosSeguidos = async () => {
  const token = await getToken();
  try {
    const response = await fetch(`${API_URL}/usuario/usuariosSeguidos`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error(`Erro ${response.status}`);
    const data = await response.json();
    return data.usuarios_seguindo || [];
  } catch (error) {
    console.error("Erro ao buscar usuarios:", error);
    return [];
  }
};

export const UsuariosSeguidores = async () => {
  const token = await getToken();
  try {
    const response = await fetch(`${API_URL}/usuario/usuariosSeguidores`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error(`Erro ${response.status}`);
    const data = await response.json();
    return data.seguidores || [];
  } catch (error) {
    console.error("Erro ao buscar usuarios:", error);
    return [];
  }
};

export const AtualizarUsuario = async (
  dados: {
    biografia?: string;
    cidade?: string;
    estado?: string;
    esportes_praticados?: Record<string, string>;
    nome_completo?: string;
    senha?: string;
    username?: string;
    email?: string;
    data_nascimento?: string;
    foto_perfil?: {
      uri: string;
      name?: string;
      type?: string;
    };
  }
): Promise<object> => {
  try {
    const token = await getToken();
    if (!token) throw new Error("Token de autenticação não encontrado.");

    const formData = new FormData();

    Object.entries(dados).forEach(([key, value]) => {
      if (value !== undefined) {
        if (key === "foto_perfil" && typeof value === "object") {
          formData.append("foto_perfil", {
            uri: value.uri,
            name: value.name ?? "profile_photo.jpg",
            type: value.type ?? "image/jpeg",
          } as any);
        } else if (key === "esportes_praticados") {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, String(value));
        }
      }
    });

    const response = await fetch(`${API_URL}/usuario/EditarUsuario`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.erro || data.mensagem || response.statusText);

    return data;
  } catch (error: any) {
    console.error("Erro ao editar dados do usuário:", error);
    return { erro: error.message ?? "Erro desconhecido ao editar usuário." };
  }
};
