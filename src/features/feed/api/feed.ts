import * as SecureStore from "expo-secure-store";
import { API_URL } from "../../../core/api/apiURL";

const getToken = async () => {
  return await SecureStore.getItemAsync("token");
};

export const ListaPostDescobrir = async () => {
  const token = await getToken();
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

    return await response.json();
  } catch (error) {
    console.error("Erro ao listar postagens:", error);
    return null;
  }
};

export const ListaPostSeguindo = async () => {
  const token = await getToken();
  try {
    const response = await fetch(`${API_URL}/postagem/FeedSeguindo`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Erro ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Erro ao listar postagens:", error);
    return null;
  }
};

export const ExcluirPost = async (postId: string) => {
  const token = await getToken();
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

    return await response.json();
  } catch (error) {
    console.error("Erro ao excluir postagem:", error);
    return null;
  }
};

export const ListarPostProprios = async () => {
  const token = await getToken();
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
    
    return await response.json();
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
    const token = await getToken();
    if (!token) throw new Error("Token não encontrado");

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

export const ListarNofificacao = async () => {
  const token = await getToken();
  try {
    const response = await fetch(`${API_URL}/notificacao/MinhaNotificacoes`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Erro ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Erro ao listar postagens:", error);
    return null;
  }
};


export const MarcarNotificacaoComoLida = async (id: string) => {
  const token = await getToken();

  try {
    const response = await fetch(`${API_URL}/notificacao/NotificacaoLida`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ notificacao_id:id }), 
    });

    if (!response.ok) {
      throw new Error(`Erro ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Erro ao marcar notificação como lida:", error);
    return null;
  }
};


export const PostUsuarioAlheio = async (usuario_id: string) => {
  const token = await getToken();
  try {
    const response = await fetch(`${API_URL}/postagem/usuario/${usuario_id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error(`Erro ${response.status}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erro ao buscar sugestões de perfis:", error);
    return [];
  }
};


export const CurtirPost = async (postId: string) => {
  const token = await getToken();
  try {
    const response = await fetch(`${API_URL}/postagem/ToggleCurtida`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ post_id: postId }),
    });

    if (!response.ok) {
      throw new Error(`Erro ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Erro ao curtir postagem:", error);
    return null;
  }
};


export const ListarComentariosPost = async (post_id: string) => {
  const token = await getToken();
  try {
    const response = await fetch(`${API_URL}/postagem/ListarComentarios/${post_id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });   

    if (!response.ok) throw new Error(`Erro ${response.status}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erro ao buscar comentarios:", error);
    return [];
  }
};


export const CriarComentario = async (postId: string,comentario:string) => {
  const token = await getToken();
  try {
    const response = await fetch(`${API_URL}/postagem/AdicionarComentario`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ post_id: postId,comentario:comentario }),
    });

    if (!response.ok) {
      throw new Error(`Erro ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Erro ao curtir postagem:", error);
    return null;
  }
};

export const DeletarComentario = async (post_id:string,comentario_id: string) => {
  const token = await getToken();
  try {
    const response = await fetch(`${API_URL}/postagem/DeletarComentario`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({post_id, comentario_id }),
    });

    if (!response.ok) throw new Error(`Erro ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Erro ao deletar comentario:", error);
    return null;
  }
};