import { useEffect } from "react";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

function decodeToken(token: string) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return String(payload.user_id);
  } catch (e) {
    console.error("Erro ao decodificar o token:", e);
    return null;
  }
}

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const verificarToken = async () => {
      const token = await AsyncStorage.getItem("token");

      if (token) {
        const decodedUserId = decodeToken(token);
        if (decodedUserId) {
          await AsyncStorage.setItem("userId", decodedUserId);
          router.replace("/main");
        } else {
          router.replace("/login");
        }
      } else {
        router.replace("/login");
      }
    };

    verificarToken();
  }, []);

  return null;
}
