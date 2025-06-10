const API_URL = "http://192.168.68.112:8000";

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

    return await response.json();
  } catch (error) {
    console.error("Erro no cadastro:", error);
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
      body: JSON.stringify({
        email,
        senha,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erro ${response.status}: ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Erro no cadastro:", error);
    return null;
  }
};
