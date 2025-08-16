import { useEffect } from "react";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

function decodeToken(token: any) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.user_id;
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
        const userId = await AsyncStorage.setItem("userId", decodeToken(token))

        router.replace("/main");
      } else {
        router.replace("/login");
      }
    };

    verificarToken();
  }, []);

  return null;
}
