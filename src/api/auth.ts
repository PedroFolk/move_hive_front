import { Platform } from "react-native";

const API_URL =
  Platform.OS === "android" ? "http://10.0.2.2:8000" : "http://localhost:8000";

export const login = async (user: string, pass: string) => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user, pass }),
    });

    if (!response.ok) throw new Error("Erro ao fazer login");
    return await response.json(); // Ex: { token: '...' }
  } catch (error) {
    console.error("Erro no login:", error);
    return null;
  }
};
